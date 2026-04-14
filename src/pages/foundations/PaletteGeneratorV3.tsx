/**
 * PaletteGeneratorV3 — Shade Lab page chrome.
 *
 * Two modes:
 *
 *   Multi-root mode (when editing a main DS palette — primary/secondary/grey):
 *     - "Select roots" section renders three RootSwatchPair cards side by side
 *     - Three PaletteBuilder instances stay mounted; non-active ones hide via
 *       display:none so their state survives slot switches
 *     - Eyedropper picks route to the active slot
 *     - Clicking a root card sets it active
 *     - Auto-advance after each pick: primary → secondary → base → stay on base
 *     - Save commits all touched palettes in one move
 *
 *   Single mode (new palette creation, custom palette editing):
 *     - Old flow — one builder, one Base color section, one save target
 */

import { useCallback, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { spring } from '../../tokens/motion';
import { createPortal } from 'react-dom';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Modal } from '../../components/Modal';
import { PageHero } from '../../layouts/PageHero';
import { Section } from '../../layouts/Section';
import { PaletteBuilder, type PaletteBuilderHandle } from '../../components/palette-generator/PaletteBuilder';
import { ImageEyedropper, type EyedropperPick } from '../../components/palette-generator/ImageEyedropper';
import { RootSwatchPair } from '../../components/palette-generator/RootSwatchPair';
import type { PaletteStep } from '../../components/palette-generator/types';
import { oklchToCss, oklchToHex } from '../../lib/oklch';
import type { OklchColor } from '../../lib/oklch';
import { applyPaletteCssVars } from '../../lib/applyPalette';

// ─── Multi-root configuration ────────────────────────────────────────────────

type RootSlot = 'primary' | 'secondary' | 'grey';

const MAIN_PALETTE_NAMES: readonly string[] = ['primary', 'secondary', 'grey'];

const ROOT_SLOTS: { id: RootSlot; label: string }[] = [
  { id: 'primary',   label: 'Primary'   },
  { id: 'secondary', label: 'Secondary' },
  { id: 'grey',      label: 'Base'      },
];

const NEXT_SLOT: Record<RootSlot, RootSlot> = {
  primary: 'secondary',
  secondary: 'grey',
  grey: 'grey',
};

type SlotRecord<T> = Record<RootSlot, T>;

// ─── Page ────────────────────────────────────────────────────────────────────

export interface PaletteGeneratorV3Props {
  /** Called when user clicks Close — only shown when provided (modal mode) */
  onClose?: () => void;
  /** 'new' shows "Create Palette", 'edit' shows "Save Changes" */
  mode?: 'new' | 'edit';
  /** When provided in edit mode, pre-fills the generator with the existing palette values */
  editPaletteName?: string;
  /** Called whenever dirty state changes */
  onDirtyChange?: (isDirty: boolean) => void;
  /** Called when Create Palette is clicked (new mode) or a custom palette is saved (edit-custom mode) */
  onPaletteCreated?: (name: string, steps: PaletteStep[]) => void;
  /** Pre-fills the reducer state for editing custom palettes */
  initialSteps?: PaletteStep[];
  /** If set in edit mode, skip CSS var update and call onPaletteCreated instead */
  customPaletteName?: string;
  /** Optional parent-controlled reference image URL for the eyedropper. */
  referenceImageUrl?: string | null;
  /** Callback when the user drops / clears the reference image. */
  onReferenceImageChange?: (url: string | null) => void;
}

export default function PaletteGeneratorV3(props: PaletteGeneratorV3Props) {
  const {
    mode = 'new',
    editPaletteName,
    customPaletteName,
  } = props;

  // Multi-root mode: editing a main DS palette, not a custom one
  const isMultiRoot =
    mode === 'edit' &&
    !customPaletteName &&
    !!editPaletteName &&
    MAIN_PALETTE_NAMES.includes(editPaletteName);

  if (isMultiRoot) {
    return <MultiRootShadeLab {...props} />;
  }
  return <SingleRootShadeLab {...props} />;
}

// ─── Multi-root Shade Lab ────────────────────────────────────────────────────

function MultiRootShadeLab({
  editPaletteName,
  onDirtyChange,
  referenceImageUrl,
  onReferenceImageChange,
}: PaletteGeneratorV3Props) {
  const primaryRef = useRef<PaletteBuilderHandle>(null);
  const secondaryRef = useRef<PaletteBuilderHandle>(null);
  const greyRef = useRef<PaletteBuilderHandle>(null);

  const refs = useMemo<SlotRecord<React.RefObject<PaletteBuilderHandle>>>(
    () => ({ primary: primaryRef, secondary: secondaryRef, grey: greyRef }),
    [],
  );

  // Initial active slot: the one the user clicked to open Shade Lab.
  const initialSlot: RootSlot =
    editPaletteName && MAIN_PALETTE_NAMES.includes(editPaletteName)
      ? (editPaletteName as RootSlot)
      : 'primary';

  const [activeSlot, setActiveSlot] = useState<RootSlot>(initialSlot);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [slotSteps, setSlotSteps] = useState<SlotRecord<PaletteStep[]>>({
    primary: [],
    secondary: [],
    grey: [],
  });
  const [rawColors, setRawColors] = useState<SlotRecord<OklchColor | null>>({
    primary: null,
    secondary: null,
    grey: null,
  });
  const [slotDirty, setSlotDirty] = useState<SlotRecord<boolean>>({
    primary: false,
    secondary: false,
    grey: false,
  });

  // Image state — controlled by parent if provided, otherwise local.
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(null);
  const imageUrl = referenceImageUrl !== undefined ? referenceImageUrl : localImageUrl;
  const handleImageChange = (url: string | null) => {
    if (onReferenceImageChange) onReferenceImageChange(url);
    else setLocalImageUrl(url);
  };

  const anyDirty = slotDirty.primary || slotDirty.secondary || slotDirty.grey;
  const notifyDirty = useCallback(
    (dirty: boolean) => {
      onDirtyChange?.(dirty);
    },
    [onDirtyChange],
  );

  // Wrap setSlotDirty so we bubble up to parent
  const handleSlotDirtyChange = useCallback(
    (slot: RootSlot, dirty: boolean) => {
      setSlotDirty(prev => {
        if (prev[slot] === dirty) return prev;
        const next = { ...prev, [slot]: dirty };
        notifyDirty(next.primary || next.secondary || next.grey);
        return next;
      });
    },
    [notifyDirty],
  );

  const handleStepsChange = useCallback((slot: RootSlot, steps: PaletteStep[]) => {
    setSlotSteps(prev => ({ ...prev, [slot]: steps }));
  }, []);

  const handlePick = useCallback(
    (pick: EyedropperPick) => {
      const slot = activeSlot;
      setRawColors(prev => ({ ...prev, [slot]: pick.oklch }));
      refs[slot].current?.setBaseColor(pick.oklch);
      setActiveSlot(prev => NEXT_SLOT[prev]);
    },
    [activeSlot, refs],
  );

  const handleSlotClick = useCallback((slot: RootSlot) => {
    setActiveSlot(slot);
  }, []);

  const handleSave = useCallback(() => {
    // Apply every dirty slot that has steps
    ROOT_SLOTS.forEach(({ id }) => {
      if (slotDirty[id] && slotSteps[id].length > 0) {
        applyPaletteCssVars(id, slotSteps[id]);
        refs[id].current?.markClean();
      }
    });
    setSlotDirty({ primary: false, secondary: false, grey: false });
    notifyDirty(false);
  }, [slotDirty, slotSteps, refs, notifyDirty]);

  const handleConfirmSave = useCallback(() => {
    setConfirmOpen(false);
    handleSave();
  }, [handleSave]);

  const dirtyCount =
    Number(slotDirty.primary) + Number(slotDirty.secondary) + Number(slotDirty.grey);

  return (
    <section className="mb-24">
      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={`Apply ${dirtyCount} ${dirtyCount === 1 ? 'palette' : 'palettes'}?`}
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>Keep editing</Button>
            <Button variant="primary" onClick={handleConfirmSave}>Apply changes</Button>
          </div>
        }
      >
        <p className="font-sans text-md" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
          Your new curves go live across every token and component. The whole system updates in one move.
        </p>
      </Modal>

      <PageHero
        title="SHADES CREATOR"
        subtitle="OKLCH palette generator"
        description="Drop a reference image, eyedropper three colours, shape the curves. Primary, Secondary, and Base palettes all edit together — commit them in one move."
      />

      <StepHint
        n={1}
        title="Drop a reference"
        body="Moodboards, illustrations, photos — anything with a clear palette. Or skip this and eyeball it."
      />
      <Section
        title="Reference image"
        level="minor"
        description="Drop an image, then click pixels to seed each root in turn. Auto-advances through Primary → Secondary → Base."
      >
        <ImageEyedropper
          imageUrl={imageUrl}
          onImageChange={handleImageChange}
          onPick={handlePick}
          pickingFor={`${ROOT_SLOTS.find(s => s.id === activeSlot)?.label} anchor`}
        />
      </Section>

      <StepHint
        n={2}
        title="Select roots"
        body="Click a card to target it. Click the image to pick. The active card highlights — its curve and preview live below."
      />
      <Section title="Select roots" level="minor">
        <div className="grid grid-cols-3 gap-6">
          {ROOT_SLOTS.map(slot => (
            <RootSwatchPair
              key={slot.id}
              label={slot.label}
              rawColor={rawColors[slot.id]}
              steps={slotSteps[slot.id]}
              active={activeSlot === slot.id}
              onClick={() => handleSlotClick(slot.id)}
            />
          ))}
        </div>
      </Section>

      {/* Three builders stay mounted; non-active ones hide so state survives switches.
          The built-in Base color section is visible — users can type custom
          hex codes or use the color grid in addition to the image eyedropper. */}
      {ROOT_SLOTS.map(slot => (
        <div
          key={slot.id}
          style={{ display: activeSlot === slot.id ? 'block' : 'none' }}
        >
          <PaletteBuilder
            ref={refs[slot.id]}
            editPaletteName={slot.id}
            hideExport
            onStepsChange={(steps) => handleStepsChange(slot.id, steps)}
            onDirtyChange={(dirty) => handleSlotDirtyChange(slot.id, dirty)}
            onRawColorChange={(color) =>
              setRawColors(prev => (prev[slot.id] === color ? prev : { ...prev, [slot.id]: color }))
            }
          />
        </div>
      ))}

      <StepHint
        n={3}
        title="Shape the saturation"
        body="Drag dots up for more punch, down for restraint. Flat = quiet palette. Tall peak = opinionated. Each root has its own curve."
      />

      <StepHint
        n={4}
        title="Commit"
        body="Apply every changed palette in one move. Tokens flip, components re-render, dark mode included."
      />

      <div className="h-32" />

      {createPortal(
        <BottomBar
          steps={slotSteps[activeSlot]}
          mode="edit"
          onSave={() => setConfirmOpen(true)}
          isDirty={anyDirty}
          saveLabel={dirtyCount > 1 ? `Save ${dirtyCount} palettes` : 'Save Changes'}
        />,
        document.body,
      )}
    </section>
  );
}

// ─── Single-root Shade Lab ───────────────────────────────────────────────────

function SingleRootShadeLab({
  onClose,
  mode = 'new',
  editPaletteName,
  onDirtyChange,
  onPaletteCreated,
  initialSteps,
  customPaletteName,
  referenceImageUrl,
  onReferenceImageChange,
}: PaletteGeneratorV3Props) {
  const builderRef = useRef<PaletteBuilderHandle>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [newPaletteName, setNewPaletteName] = useState('');
  const [currentSteps, setCurrentSteps] = useState<PaletteStep[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  const [localImageUrl, setLocalImageUrl] = useState<string | null>(null);
  const imageUrl = referenceImageUrl !== undefined ? referenceImageUrl : localImageUrl;
  const handleImageChange = (url: string | null) => {
    if (onReferenceImageChange) onReferenceImageChange(url);
    else setLocalImageUrl(url);
  };

  const handleDirtyChange = useCallback(
    (dirty: boolean) => {
      setIsDirty(dirty);
      onDirtyChange?.(dirty);
    },
    [onDirtyChange],
  );

  const handleEyedropperPick = useCallback((pick: EyedropperPick) => {
    builderRef.current?.setBaseColor(pick.oklch);
  }, []);

  const handleSave = useCallback(() => {
    const steps = builderRef.current?.getSteps() ?? currentSteps;
    if (steps.length === 0) return;

    if (customPaletteName) {
      onPaletteCreated?.(customPaletteName, steps);
      builderRef.current?.markClean();
      return;
    }

    if (!editPaletteName) return;
    applyPaletteCssVars(editPaletteName, steps);
    builderRef.current?.markClean();
  }, [currentSteps, editPaletteName, customPaletteName, onPaletteCreated]);

  const handleConfirmSave = useCallback(() => {
    setConfirmOpen(false);
    handleSave();
  }, [handleSave]);

  const displayName = customPaletteName
    ? customPaletteName.charAt(0).toUpperCase() + customPaletteName.slice(1)
    : editPaletteName
      ? editPaletteName.charAt(0).toUpperCase() + editPaletteName.slice(1)
      : '';

  return (
    <section className="mb-24">
      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={customPaletteName ? `Save ${displayName} palette?` : `Apply ${displayName} palette?`}
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>Keep editing</Button>
            <Button variant="primary" onClick={handleConfirmSave}>Apply palette</Button>
          </div>
        }
      >
        <p className="font-sans text-md" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
          Your new curve goes live across every token and component. The whole system updates in one move.
        </p>
      </Modal>

      <PageHero
        title={customPaletteName ? `EDIT ${customPaletteName.toUpperCase()}` : 'SHADES CREATOR'}
        subtitle="OKLCH palette generator"
        description="Paste any color and shape the chroma curve to build a perceptually uniform 12-step palette. Drag the dots to sculpt saturation across lightness."
      />

      {mode === 'new' && (
        <>
          <StepHint
            n={1}
            title="Name it"
            body="You'll be calling this forever. Choose wisely. (Or just call it Ocean and move on.)"
          />
          <Section title="Palette name" level="minor">
            <Input
              size="md"
              placeholder="e.g. Ocean, Coral, Mint…"
              value={newPaletteName}
              onChange={(e) => setNewPaletteName(e.target.value)}
            />
          </Section>
        </>
      )}

      <StepHint
        n={mode === 'new' ? 2 : 1}
        title="Pick your anchor"
        body="Drop a hex, paste an oklch(), or eyedropper a pixel from a reference image. We'll snap it to the nearest perceptual step and build the scale from there."
      />
      <Section
        title="Reference image"
        level="minor"
        description={`Optional · drop a moodboard or illustration, then click any pixel to set the ${displayName || 'palette'} anchor.`}
      >
        <ImageEyedropper
          imageUrl={imageUrl}
          onImageChange={handleImageChange}
          onPick={handleEyedropperPick}
          pickingFor={displayName ? `${displayName} anchor` : undefined}
        />
      </Section>

      <PaletteBuilder
        ref={builderRef}
        editPaletteName={editPaletteName}
        initialSteps={initialSteps}
        onStepsChange={setCurrentSteps}
        onDirtyChange={handleDirtyChange}
      />

      <StepHint
        n={mode === 'new' ? 3 : 2}
        title="Shape the saturation"
        body="Drag dots up for more punch, down for restraint. Flat = quiet palette. Tall peak = opinionated. The presets are a safe bet — drag is where it gets personal."
      />

      <StepHint
        n={mode === 'new' ? 4 : 3}
        title="Take it home"
        body="Copy as TypeScript tokens or CSS variables. Two pastes and your whole project has a better color system. Your dev will either thank you or ask what OKLCH is."
      />

      <div className="h-32" />

      {createPortal(
        <BottomBar
          steps={currentSteps}
          mode={mode}
          onSave={(editPaletteName || customPaletteName) ? () => setConfirmOpen(true) : undefined}
          isDirty={isDirty}
          newPaletteName={newPaletteName}
          onCreatePalette={onPaletteCreated ? () => {
            onPaletteCreated(newPaletteName.trim(), currentSteps);
            onClose?.();
          } : undefined}
        />,
        document.body,
      )}
    </section>
  );
}

// ─── Step Hint ───────────────────────────────────────────────────────────────

function StepHint({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="flex items-start gap-4 mb-4 mt-10">
      <span
        className="font-mono text-xs font-medium shrink-0 mt-[3px]"
        style={{
          color: 'var(--color-on-surface-subtle-2)',
          minWidth: 24,
        }}
      >
        {String(n).padStart(2, '0')}
      </span>
      <div className="flex flex-col gap-0.5">
        <span
          className="font-sans text-sm font-semibold"
          style={{ color: 'var(--color-on-surface)' }}
        >
          {title}
        </span>
        <span
          className="font-sans text-sm"
          style={{ color: 'var(--color-on-surface-subtle-1)' }}
        >
          {body}
        </span>
      </div>
    </div>
  );
}

// ─── Bottom Bar ──────────────────────────────────────────────────────────────

function BottomBar({
  steps,
  mode = 'new',
  onSave,
  isDirty,
  newPaletteName,
  onCreatePalette,
  saveLabel,
}: {
  steps: PaletteStep[];
  mode?: 'new' | 'edit';
  onSave?: () => void;
  isDirty?: boolean;
  newPaletteName?: string;
  onCreatePalette?: () => void;
  saveLabel?: string;
}) {
  const canCreate = mode === 'new' && (newPaletteName?.trim().length ?? 0) > 0;

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-[60]"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      transition={{ ...spring.default, delay: 0.28 }}
      style={{
        backgroundColor: 'var(--color-surface-1)',
        boxShadow: 'var(--shadow-large-1-up)',
      }}
    >
      <div className="flex items-center gap-6 px-8 py-4 max-w-7xl mx-auto">
        <div className="flex gap-1 flex-1 min-w-0">
          {steps.map((step) => {
            const bg = oklchToCss(step.l, step.c, step.h);
            const hex = oklchToHex(step.l, step.c, step.h);
            return (
              <div
                key={step.key}
                className="flex-1 flex flex-col items-center gap-0.5 min-w-0"
              >
                <div
                  className="w-full aspect-[3/4]"
                  style={{
                    backgroundColor: bg,
                    borderRadius: 'var(--radius-s)',
                    border: step.l > 0.95 ? '1px solid var(--color-border)' : 'none',
                  }}
                  title={`${step.key}: ${hex}`}
                />
                <span
                  className="font-mono text-[7px] truncate"
                  style={{ color: 'var(--color-on-surface-subtle-2)' }}
                >
                  {step.key}
                </span>
              </div>
            );
          })}
        </div>

        <div className="shrink-0">
          <Button
            variant="special-primary"
            size="lg"
            onClick={mode === 'edit' ? onSave : onCreatePalette}
            disabled={mode === 'edit' ? !isDirty : !canCreate}
          >
            {mode === 'new' ? 'Create Palette' : (saveLabel ?? 'Save Changes')}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
