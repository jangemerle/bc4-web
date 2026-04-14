import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, Plus, Pencil, SwatchBook, Layers, MoreHorizontal, Trash2, Rainbow, Sparkles } from 'lucide-react';
import { spring, duration, ease } from '../../tokens/motion';
import { PageHero } from '../../layouts/PageHero';
import { Card, SectionTitle, Spec } from '../../layouts/DocHelpers';
import { FloatingSectionNav } from '../../components/FloatingSectionNav';
import { useSectionNav } from '../../hooks/useSectionNav';
import { palette } from '../../tokens/colors';
import { AICard } from '../../components/AICard';
import { oklchToHex } from '../../lib/oklch';
import { ContrastExplorer } from '../../components/ContrastExplorer';
import { HsluvExplainer } from '../../components/HsluvExplainer';
import { Button } from '../../components/Button';
import { DropdownMenu, DropdownMenuItem } from '../../components/DropdownMenu';
import { Modal } from '../../components/Modal';
import { ModalFullscreen } from '../../components/ModalFullscreen';
import PaletteGeneratorV3 from './PaletteGeneratorV3';
import type { PaletteStep } from '../../components/palette-generator/types';

// ─── Close label with discard reveal on hover (edit mode) ───────────────────

function ShadLabCloseLabel({ isDirty }: { isDirty: boolean }) {
  const [hovered, setHovered] = useState(false);
  const showDiscard = isDirty && hovered;

  return (
    <span
      className="inline-flex items-center gap-1.5 overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <AnimatePresence>
        {showDiscard && (
          <motion.span
            key="discard"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{
              width: spring.snappy,
              opacity: { duration: duration.fast, ease: ease.enter },
            }}
            className="inline-flex items-center gap-1.5 whitespace-nowrap overflow-hidden"
            style={{ color: 'var(--color-warning-1)' }}
          >
            Discard
            <span style={{ color: 'var(--color-on-surface)' }}>+</span>
          </motion.span>
        )}
      </AnimatePresence>
      <span>Close</span>
    </span>
  );
}

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

/** Parse an oklch() string → hex for components that need it. */
function toHex(oklchStr: string): string {
  const m = oklchStr.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
  if (!m) return '#000000';
  return oklchToHex(parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3]));
}

/* ─── Palette step keys ───────────────────────────────────────────────────── */

type StepKey = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 750 | 800 | 850 | 900;
const STEP_KEYS: StepKey[] = [50, 100, 200, 300, 400, 500, 600, 700, 750, 800, 850, 900];

/* ─── Page ─────────────────────────────────────────────────────────────────── */

type ShadeLab =
  | { mode: 'new' }
  | { mode: 'edit'; paletteName: string }
  | { mode: 'edit-custom'; name: string; steps: PaletteStep[] };

export default function ColorsPage() {
  const [shadeLab, setShadeLab] = useState<ShadeLab | null>(null);
  const [shadeLabDirty, setShadeLabDirty] = useState(false);
  const [customPalettes, setCustomPalettes] = useState<{ name: string; steps: PaletteStep[] }[]>([]);
  // Reference image for the eyedropper — persists across palette edits so the
  // user can drop once, then eyedropper primary, secondary, grey in sequence.
  const [referenceImageUrl, setReferenceImageUrl] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [openMenuFor, setOpenMenuFor] = useState<string | null>(null);
  const sectionNav = useSectionNav(['tokens', 'palettes', 'gradients'] as const);

  const openNew = () => setShadeLab({ mode: 'new' });
  const openEdit = (name: string) => setShadeLab({ mode: 'edit', paletteName: name });
  const openEditCustom = (name: string, steps: PaletteStep[]) => setShadeLab({ mode: 'edit-custom', name, steps });
  const closeLab = () => { setShadeLab(null); setShadeLabDirty(false); };

  return (
    <section className="mb-24 relative">
      {/* Palette generator launcher — fixed 32px from top-right of viewport */}
      <div className="fixed z-40" style={{ top: 32, right: 32 }}>
        <Button
          variant="elevated"
          size="md"
          iconOnly={Palette}
          aria-label="Open palette generator"
          onClick={openNew}
        />
      </div>

      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title={`Remove ${deleteTarget}?`}
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Keep it</Button>
            <Button variant="danger" onClick={() => {
              setCustomPalettes(prev => prev.filter(p => p.name !== deleteTarget));
              setDeleteTarget(null);
            }}>Remove palette</Button>
          </div>
        }
      >
        <p className="font-sans text-md" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
          This removes {deleteTarget} from the palette list. Your tokens and components are unaffected.
        </p>
      </Modal>

      <ModalFullscreen
        open={shadeLab !== null}
        onClose={closeLab}
        bgColor="var(--color-bg)"
        closeLabel={<ShadLabCloseLabel isDirty={shadeLabDirty} />}
        aria-label="Shade Lab"
      >
        <div className="col-span-full max-w-7xl mx-auto w-full py-16 px-6 lg:px-10">
          <PaletteGeneratorV3
            key={shadeLab ? `${shadeLab.mode}-${'paletteName' in shadeLab ? shadeLab.paletteName : 'name' in shadeLab ? shadeLab.name : 'new'}` : 'closed'}
            onClose={closeLab}
            mode={shadeLab?.mode === 'new' || !shadeLab ? 'new' : 'edit'}
            editPaletteName={shadeLab?.mode === 'edit' ? shadeLab.paletteName : undefined}
            initialSteps={shadeLab?.mode === 'edit-custom' ? shadeLab.steps : undefined}
            customPaletteName={shadeLab?.mode === 'edit-custom' ? shadeLab.name : undefined}
            onDirtyChange={setShadeLabDirty}
            referenceImageUrl={referenceImageUrl}
            onReferenceImageChange={setReferenceImageUrl}
            onPaletteCreated={(name, steps) => {
              setCustomPalettes(prev => {
                const idx = prev.findIndex(p => p.name === name);
                if (idx >= 0) {
                  const next = [...prev];
                  next[idx] = { name, steps };
                  return next;
                }
                return [...prev, { name, steps }];
              });
              closeLab();
            }}
          />
        </div>
      </ModalFullscreen>

      <PageHero
        title="Colors"
        subtitle="Six palettes. One perceptual model. Zero guessing."
        description="Built in OKLCH — so equal lightness steps actually look equal. Semantic tokens do the dark mode work automatically. You pick the hue; the math handles the rest."
      />

      <FloatingSectionNav
        items={[
          { value: 'tokens', label: 'Tokens', icon: Layers },
          { value: 'palettes', label: 'Palettes', icon: SwatchBook },
          { value: 'gradients', label: 'Gradients', icon: Rainbow },
        ]}
        activeSection={sectionNav.activeSection}
        pinned={sectionNav.pinned}
        inlineRef={sectionNav.inlineRef}
        onChange={sectionNav.handleChange}
      />

      {/* ══ TOKENS ═══════════════════════════════════════════════════════════════ */}
      <div ref={sectionNav.setSectionRef('tokens')} className="scroll-mt-[120px]">

      <div className="mb-16">
        <h2
          className="font-brand font-bold leading-[0.95] mb-6"
          style={{ fontSize: 'clamp(56px, 7vw, 104px)', color: 'var(--color-on-surface)' }}
        >
          TOKENS
        </h2>
        <p className="font-sans text-lg max-w-2xl" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
          The contract between design and code. Every color you see in the interface traces back to one of these names — swap the palette underneath and the whole product follows without touching a single component.
        </p>
      </div>

      {/* ── Semantic tokens ─────────────── */}
      <SectionTitle>Surface</SectionTitle>
      <Card>
        <Spec>Background, card layers, text colors · Inverts in dark mode</Spec>
        <div className="grid grid-cols-4 gap-3">
          {[
            { token: 'bg', label: 'bg', source: 'grey-100' },
            { token: 'surface-1', label: 'surface-1', source: 'white' },
            { token: 'surface-2', label: 'surface-2', source: 'grey-50' },
            { token: 'surface-3', label: 'surface-3', source: 'grey-100' },
            { token: 'surface-4', label: 'surface-4', source: 'grey-200' },
            { token: 'surface-5', label: 'surface-5', source: 'grey-300' },
            { token: 'surface-6', label: 'surface-6', source: 'grey-400' },
            { token: 'surface-7', label: 'surface-7', source: 'grey-500' },
            { token: 'inverted-surface', label: 'inverted-surface', source: 'secondary-850' },
          ].map(({ token, label, source }) => (
            <div key={token} className="flex flex-col gap-2">
              <div className="h-16 rounded-lg border" style={{ backgroundColor: `var(--color-${token})`, borderColor: 'var(--color-border)' }} />
              <p className="font-sans text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>{label}</p>
              <p className="font-sans text-2xs font-medium" style={{ color: 'var(--color-on-surface-subtle-2)' }}>{source}</p>
            </div>
          ))}
        </div>
        <div className="divider my-6" />
        <div className="grid grid-cols-4 gap-3">
          {[
            { token: 'on-surface', label: 'on-surface', source: 'secondary-850' },
            { token: 'on-surface-subtle-1', label: 'on-surface-subtle-1', source: 'grey-700' },
            { token: 'on-surface-subtle-2', label: 'on-surface-subtle-2', source: 'grey-600' },
            { token: 'on-inverted-surface', label: 'on-inverted-surface', source: 'white' },
          ].map(({ token, label, source }) => (
            <div key={token} className="flex flex-col gap-2">
              <div className="h-16 rounded-lg border" style={{ backgroundColor: `var(--color-${token})`, borderColor: 'var(--color-border)' }} />
              <p className="font-sans text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>{label}</p>
              <p className="font-sans text-2xs font-medium" style={{ color: 'var(--color-on-surface-subtle-2)' }}>{source}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-12" />
      <SectionTitle>Primary</SectionTitle>
      <Card>
        <Spec>Brand green · CTAs, success accents, positive actions</Spec>
        <div className="grid grid-cols-4 gap-3">
          {[
            { token: 'primary-1', label: 'primary-1', source: 'primary-300' },
            { token: 'primary-2', label: 'primary-2', source: 'primary-400' },
            { token: 'primary-3', label: 'primary-3', source: 'primary-500' },
            { token: 'on-primary', label: 'on-primary', source: 'secondary-850' },
          ].map(({ token, label, source }) => (
            <div key={token} className="flex flex-col gap-2">
              <div className="h-16 rounded-lg border" style={{ backgroundColor: `var(--color-${token})`, borderColor: 'var(--color-border)' }} />
              <p className="font-sans text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>{label}</p>
              <p className="font-sans text-2xs font-medium" style={{ color: 'var(--color-on-surface-subtle-2)' }}>{source}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-12" />
      <SectionTitle>Secondary</SectionTitle>
      <Card>
        <Spec>Blue · Links, selected states, focus rings</Spec>
        <div className="grid grid-cols-4 gap-3">
          {[
            { token: 'secondary-1', label: 'secondary-1', source: 'secondary-100' },
            { token: 'secondary-2', label: 'secondary-2', source: 'secondary-200' },
            { token: 'on-secondary-1', label: 'on-secondary-1', source: 'secondary-700' },
            { token: 'on-secondary-2', label: 'on-secondary-2', source: 'secondary-750' },
          ].map(({ token, label, source }) => (
            <div key={token} className="flex flex-col gap-2">
              <div className="h-16 rounded-lg border" style={{ backgroundColor: `var(--color-${token})`, borderColor: 'var(--color-border)' }} />
              <p className="font-sans text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>{label}</p>
              <p className="font-sans text-2xs font-medium" style={{ color: 'var(--color-on-surface-subtle-2)' }}>{source}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-12" />
      <SectionTitle>Success</SectionTitle>
      <Card>
        <Spec>Confirmations, completed states, positive feedback</Spec>
        <div className="grid grid-cols-4 gap-3">
          {[
            { token: 'success-1', label: 'success-1', source: 'success-600' },
            { token: 'success-2', label: 'success-2', source: 'success-700' },
            { token: 'success-3', label: 'success-3', source: 'success-800' },
            { token: 'on-success', label: 'on-success', source: 'white' },
          ].map(({ token, label, source }) => (
            <div key={token} className="flex flex-col gap-2">
              <div className="h-16 rounded-lg border" style={{ backgroundColor: `var(--color-${token})`, borderColor: 'var(--color-border)' }} />
              <p className="font-sans text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>{label}</p>
              <p className="font-sans text-2xs font-medium" style={{ color: 'var(--color-on-surface-subtle-2)' }}>{source}</p>
            </div>
          ))}
        </div>
        <div className="divider my-6" />
        <div className="grid grid-cols-4 gap-3">
          {[
            { token: 'success-secondary-1', label: 'success-secondary-1', source: 'success-100' },
            { token: 'success-secondary-2', label: 'success-secondary-2', source: 'success-200' },
            { token: 'on-success-secondary', label: 'on-success-secondary', source: 'success-850' },
          ].map(({ token, label, source }) => (
            <div key={token} className="flex flex-col gap-2">
              <div className="h-16 rounded-lg border" style={{ backgroundColor: `var(--color-${token})`, borderColor: 'var(--color-border)' }} />
              <p className="font-sans text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>{label}</p>
              <p className="font-sans text-2xs font-medium" style={{ color: 'var(--color-on-surface-subtle-2)' }}>{source}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-12" />
      <SectionTitle>Warning</SectionTitle>
      <Card>
        <Spec>Caution states, pending actions, attention needed</Spec>
        <div className="grid grid-cols-4 gap-3">
          {[
            { token: 'warning-1', label: 'warning-1', source: 'warning-600' },
            { token: 'warning-2', label: 'warning-2', source: 'warning-700' },
            { token: 'warning-3', label: 'warning-3', source: 'warning-800' },
            { token: 'on-warning', label: 'on-warning', source: 'white' },
          ].map(({ token, label, source }) => (
            <div key={token} className="flex flex-col gap-2">
              <div className="h-16 rounded-lg border" style={{ backgroundColor: `var(--color-${token})`, borderColor: 'var(--color-border)' }} />
              <p className="font-sans text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>{label}</p>
              <p className="font-sans text-2xs font-medium" style={{ color: 'var(--color-on-surface-subtle-2)' }}>{source}</p>
            </div>
          ))}
        </div>
        <div className="divider my-6" />
        <div className="grid grid-cols-4 gap-3">
          {[
            { token: 'warning-secondary-1', label: 'warning-secondary-1', source: 'warning-100' },
            { token: 'warning-secondary-2', label: 'warning-secondary-2', source: 'warning-200' },
            { token: 'on-warning-secondary', label: 'on-warning-secondary', source: 'warning-850' },
          ].map(({ token, label, source }) => (
            <div key={token} className="flex flex-col gap-2">
              <div className="h-16 rounded-lg border" style={{ backgroundColor: `var(--color-${token})`, borderColor: 'var(--color-border)' }} />
              <p className="font-sans text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>{label}</p>
              <p className="font-sans text-2xs font-medium" style={{ color: 'var(--color-on-surface-subtle-2)' }}>{source}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-12" />
      <SectionTitle>Danger</SectionTitle>
      <Card>
        <Spec>Errors, destructive actions, validation failures</Spec>
        <div className="grid grid-cols-4 gap-3">
          {[
            { token: 'danger-1', label: 'danger-1', source: 'danger-700' },
            { token: 'danger-2', label: 'danger-2', source: 'danger-750' },
            { token: 'danger-3', label: 'danger-3', source: 'danger-900' },
            { token: 'on-danger', label: 'on-danger', source: 'white' },
          ].map(({ token, label, source }) => (
            <div key={token} className="flex flex-col gap-2">
              <div className="h-16 rounded-lg border" style={{ backgroundColor: `var(--color-${token})`, borderColor: 'var(--color-border)' }} />
              <p className="font-sans text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>{label}</p>
              <p className="font-sans text-2xs font-medium" style={{ color: 'var(--color-on-surface-subtle-2)' }}>{source}</p>
            </div>
          ))}
        </div>
        <div className="divider my-6" />
        <div className="grid grid-cols-4 gap-3">
          {[
            { token: 'danger-secondary-1', label: 'danger-secondary-1', source: 'danger-100' },
            { token: 'danger-secondary-2', label: 'danger-secondary-2', source: 'danger-200' },
            { token: 'on-danger-secondary', label: 'on-danger-secondary', source: 'danger-850' },
          ].map(({ token, label, source }) => (
            <div key={token} className="flex flex-col gap-2">
              <div className="h-16 rounded-lg border" style={{ backgroundColor: `var(--color-${token})`, borderColor: 'var(--color-border)' }} />
              <p className="font-sans text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>{label}</p>
              <p className="font-sans text-2xs font-medium" style={{ color: 'var(--color-on-surface-subtle-2)' }}>{source}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-12" />
      <SectionTitle>Border</SectionTitle>
      <Card>
        <Spec>Dividers, table lines, card outlines</Spec>
        <div className="grid grid-cols-4 gap-3">
          {[
            { token: 'border', label: 'border', source: 'grey-200' },
            { token: 'border-strong', label: 'border-strong', source: 'grey-300' },
          ].map(({ token, label, source }) => (
            <div key={token} className="flex flex-col gap-2">
              <div className="h-16 rounded-lg border-2" style={{ borderColor: `var(--color-${token})` }} />
              <p className="font-sans text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>{label}</p>
              <p className="font-sans text-2xs font-medium" style={{ color: 'var(--color-on-surface-subtle-2)' }}>{source}</p>
            </div>
          ))}
        </div>
      </Card>

      </div>{/* end tokens */}

      {/* ══ PALETTES ═════════════════════════════════════════════════════════════ */}
      <div ref={sectionNav.setSectionRef('palettes')} className="scroll-mt-[120px]">

      <div className="mb-16 mt-24">
        <h2
          className="font-brand font-bold leading-[0.95] mb-6"
          style={{ fontSize: 'clamp(56px, 7vw, 104px)', color: 'var(--color-on-surface)' }}
        >
          PALETTES
        </h2>
        <p className="font-sans text-lg max-w-2xl" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
          Where the raw material lives. Twelve steps of OKLCH-crafted lightness per hue — perceptually even, gamut-aware, and ready to be remixed. This is the engine room that powers every token above.
        </p>
      </div>

      {/* ── Raw palette ─────────────────── */}
      <div className="flex items-center justify-between mt-16">
        <SectionTitle>Raw palette</SectionTitle>
        <Button
          variant="elevated"
          size="sm"
          iconOnly={Plus}
          aria-label="Create new palette"
          onClick={openNew}
        />
      </div>
      <Card bg="surface">
        <Spec>OKLCH-based · 12 steps per hue · consumed by semantic tokens above</Spec>
        {(['primary', 'secondary', 'grey', 'success', 'warning', 'danger'] as const).map((name) => (
          <div key={name} className="mb-6 last:mb-0">
            <div className="flex items-center justify-between mb-2">
              <p className="font-sans text-md font-semibold capitalize" style={{ color: 'var(--color-on-surface)' }}>{name}</p>
              <Button
                variant="elevated"
                size="xs"
                iconOnly={Pencil}
                aria-label={`Edit ${name} palette`}
                onClick={() => openEdit(name)}
              />
            </div>
            <div className="flex gap-1">
              {STEP_KEYS.map((step) => {
                const oklchStr = palette[name][step];
                const hex = toHex(oklchStr);
                return (
                  <div key={step} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full h-10 rounded" style={{ backgroundColor: oklchStr }} />
                    <span className="font-sans text-[10px] font-medium" style={{ color: 'var(--color-on-surface-subtle-2)' }}>{step}</span>
                    <span className="font-mono text-[9px]" style={{ color: 'var(--color-on-surface-subtle-2)' }}>{hex}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {/* Custom palettes */}
        {customPalettes.length > 0 && (
          <>
            <div className="mt-6 border-t pt-6 flex items-center gap-4" style={{ borderColor: 'var(--color-border)' }}>
              <span className="font-sans text-xs font-semibold uppercase tracking-[1.6px]" style={{ color: 'var(--color-on-surface-subtle-2)' }}>Custom</span>
              <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-border)' }} />
            </div>
            {customPalettes.map((cp) => (
              <div key={cp.name} className="mb-6 last:mb-0 mt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-sans text-md font-semibold capitalize" style={{ color: 'var(--color-on-surface)' }}>{cp.name}</p>
                  <div className="flex items-center gap-1">
                    <Button variant="elevated" size="xs" iconOnly={Pencil} aria-label={`Edit ${cp.name}`} onClick={() => openEditCustom(cp.name, cp.steps)} />
                    <div className="relative">
                      <Button
                        variant="elevated"
                        size="xs"
                        iconOnly={MoreHorizontal}
                        aria-label={`More options for ${cp.name}`}
                        onClick={() => setOpenMenuFor(openMenuFor === cp.name ? null : cp.name)}
                      />
                      <DropdownMenu
                        open={openMenuFor === cp.name}
                        onClose={() => setOpenMenuFor(null)}
                        className="top-full mt-1 right-0"
                        width="160px"
                      >
                        <DropdownMenuItem icon={Trash2} onClick={() => { setOpenMenuFor(null); setDeleteTarget(cp.name); }}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  {cp.steps.map((step) => {
                    const bg = `oklch(${step.l} ${step.c} ${step.h})`;
                    const hex = toHex(`oklch(${step.l} ${step.c} ${step.h})`);
                    return (
                      <div key={step.key} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full h-10 rounded" style={{ backgroundColor: bg, border: step.l > 0.95 ? '1px solid var(--color-border)' : 'none' }} />
                        <span className="font-sans text-[10px] font-medium" style={{ color: 'var(--color-on-surface-subtle-2)' }}>{step.key}</span>
                        <span className="font-mono text-[9px]" style={{ color: 'var(--color-on-surface-subtle-2)' }}>{hex}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </>
        )}

        {/* OKLCH values */}
        <div className="mt-6 border-t pt-4" style={{ borderColor: 'var(--color-border)' }}>
          <p className="font-sans text-xs font-semibold mb-3" style={{ color: 'var(--color-on-surface-subtle-2)' }}>OKLCH values (primary)</p>
          <div className="flex gap-1">
            {STEP_KEYS.map((step) => {
              const m = palette.primary[step].match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
              const [l, c, h] = m ? [parseFloat(m[1]).toFixed(3), parseFloat(m[2]).toFixed(3), parseFloat(m[3]).toFixed(1)] : ['', '', ''];
              return (
                <div key={step} className="flex-1 flex flex-col items-center gap-0.5">
                  <span className="font-mono text-[9px]" style={{ color: 'var(--color-on-surface-subtle-2)' }}>L {l}</span>
                  <span className="font-mono text-[9px]" style={{ color: 'var(--color-on-surface-subtle-2)' }}>C {c}</span>
                  <span className="font-mono text-[9px]" style={{ color: 'var(--color-on-surface-subtle-2)' }}>H {h}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* ── Contrast Explorer ─────────────────── */}
      <div className="mt-16" />
      <SectionTitle>Contrast pairings</SectionTitle>
      <Card>
        <Spec>Hover over any shade to see which other shades in the palette meet WCAG AA contrast ratio (4.5:1) for text. Dimmed shades would fail contrast when paired with the selected shade.</Spec>
        <ContrastExplorer
          name="Primary"
          shades={[
            { label: '900', hex: palette.primary[900] },
            { label: '850', hex: palette.primary[850] },
            { label: '800', hex: palette.primary[800] },
            { label: '750', hex: palette.primary[750] },
            { label: '700', hex: palette.primary[700] },
            { label: '600', hex: palette.primary[600] },
            { label: '500', hex: palette.primary[500] },
            { label: '400', hex: palette.primary[400] },
            { label: '300', hex: palette.primary[300] },
            { label: '200', hex: palette.primary[200] },
            { label: '100', hex: palette.primary[100] },
            { label: '50',  hex: palette.primary[50]  },
          ]}
        />
      </Card>

      {/* ── Color Pairings ─────────────────── */}
      <div className="mt-16" />
      <SectionTitle>Color pairings</SectionTitle>
      <Card>
        <Spec>WCAG AA compliant pairs (4.5 : 1 minimum) · Recommended text-on-background combinations per palette</Spec>

        {[
          { name: 'Primary', pairs: [
            { bg: palette.primary[900], fg: palette.primary[300], bgLabel: '900', fgLabel: '300' },
            { bg: palette.primary[850], fg: palette.primary[300], bgLabel: '850', fgLabel: '300' },
            { bg: palette.primary[800], fg: palette.primary[200], bgLabel: '800', fgLabel: '200' },
            { bg: palette.primary[700], fg: palette.primary[50],  bgLabel: '700', fgLabel: '50' },
            { bg: palette.primary[50],  fg: palette.primary[700], bgLabel: '50',  fgLabel: '700' },
          ]},
          { name: 'Secondary', pairs: [
            { bg: palette.secondary[900], fg: palette.secondary[400], bgLabel: '900', fgLabel: '400' },
            { bg: palette.secondary[850], fg: palette.secondary[400], bgLabel: '850', fgLabel: '400' },
            { bg: palette.secondary[800], fg: palette.secondary[200], bgLabel: '800', fgLabel: '200' },
            { bg: palette.secondary[700], fg: palette.secondary[50],  bgLabel: '700', fgLabel: '50' },
            { bg: palette.secondary[100], fg: palette.secondary[750], bgLabel: '100', fgLabel: '750' },
          ]},
          { name: 'Grey', pairs: [
            { bg: palette.grey[900], fg: palette.grey[400], bgLabel: '900', fgLabel: '400' },
            { bg: palette.grey[850], fg: palette.grey[300], bgLabel: '850', fgLabel: '300' },
            { bg: palette.grey[800], fg: palette.grey[200], bgLabel: '800', fgLabel: '200' },
            { bg: palette.grey[700], fg: palette.grey[50],  bgLabel: '700', fgLabel: '50' },
            { bg: palette.grey[50],  fg: palette.grey[700], bgLabel: '50',  fgLabel: '700' },
          ]},
          { name: 'Success', pairs: [
            { bg: palette.success[900], fg: palette.success[300], bgLabel: '900', fgLabel: '300' },
            { bg: palette.success[850], fg: palette.success[300], bgLabel: '850', fgLabel: '300' },
            { bg: palette.success[800], fg: palette.success[200], bgLabel: '800', fgLabel: '200' },
            { bg: palette.success[600], fg: palette.white,         bgLabel: '600', fgLabel: 'white' },
            { bg: palette.success[100], fg: palette.success[850], bgLabel: '100', fgLabel: '850' },
          ]},
          { name: 'Warning', pairs: [
            { bg: palette.warning[900], fg: palette.warning[300], bgLabel: '900', fgLabel: '300' },
            { bg: palette.warning[850], fg: palette.warning[300], bgLabel: '850', fgLabel: '300' },
            { bg: palette.warning[800], fg: palette.warning[200], bgLabel: '800', fgLabel: '200' },
            { bg: palette.warning[600], fg: palette.white,         bgLabel: '600', fgLabel: 'white' },
            { bg: palette.warning[100], fg: palette.warning[850], bgLabel: '100', fgLabel: '850' },
          ]},
          { name: 'Danger', pairs: [
            { bg: palette.danger[900], fg: palette.danger[300], bgLabel: '900', fgLabel: '300' },
            { bg: palette.danger[850], fg: palette.danger[300], bgLabel: '850', fgLabel: '300' },
            { bg: palette.danger[800], fg: palette.danger[200], bgLabel: '800', fgLabel: '200' },
            { bg: palette.danger[700], fg: palette.white,        bgLabel: '700', fgLabel: 'white' },
            { bg: palette.danger[100], fg: palette.danger[800], bgLabel: '100', fgLabel: '800' },
          ]},
        ].map((pal) => (
          <div key={pal.name} className="mb-8 last:mb-0">
            <p className="font-sans text-md font-semibold mb-3" style={{ color: 'var(--color-on-surface)' }}>{pal.name}</p>
            <div className="flex gap-3">
              {pal.pairs.map((pair, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div
                    className="w-[100px] h-[100px] rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: pair.bg }}
                  >
                    <span className="font-display text-headline-l font-bold" style={{ color: pair.fg }}>Aa</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-sans text-xs font-semibold" style={{ color: 'var(--color-on-surface)' }}>{pair.bgLabel} / {pair.fgLabel}</span>
                    <span className="font-sans text-2xs font-medium" style={{ color: 'var(--color-on-surface-subtle-2)' }}>bg / text</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Card>

      {/* ══════════════════════════════════════════════════════════════════════
          WHY OKLCH — Educational deep-dive
          Written for designers, developers, PMs, and executives.
      ══════════════════════════════════════════════════════════════════════ */}

      <div className="mt-24" />
      <SectionTitle>Why OKLCH?</SectionTitle>
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div>
            <p className="font-display font-bold text-headline-m mb-4" style={{ color: 'var(--color-on-surface)' }}>
              The 30-second version
            </p>
            <p className="font-sans text-base" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
              OKLCH is a color system that matches how your eyes actually work. When two colors have the same
              lightness number, they genuinely <em>look</em> equally bright — regardless of whether one is
              blue and the other is yellow. Traditional color systems (HSL, RGB, hex) can't make that guarantee.
            </p>
          </div>
          <div className="p-6" style={{ background: 'var(--color-surface-2)', borderRadius: 'var(--radius-lg)' }}>
            <p className="font-sans text-sm font-semibold mb-3" style={{ color: 'var(--color-on-surface)' }}>
              Why should I care?
            </p>
            <ul className="font-sans text-sm space-y-2" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
              <li><strong>Designers:</strong> Your green badge and red badge will always carry the same visual weight. No more eyeballing.</li>
              <li><strong>Developers:</strong> Dark mode works by flipping lightness values. The relationships hold automatically.</li>
              <li><strong>PMs / Leadership:</strong> New brand colors integrate in minutes, not days. Accessibility is built into the palette math.</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* ── The problem OKLCH solves ─────────────────── */}
      <div className="mt-12" />
      <SectionTitle>The problem with traditional color</SectionTitle>
      <Card>
        <p className="font-sans text-md mb-6" style={{ color: 'var(--color-on-surface)' }}>
          Every color tool you've used — Figma, Sketch, CSS — defaults to HSL or RGB. These systems describe
          what your monitor's hardware does, not what your brain perceives. This creates three concrete problems:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* 1. Lightness lies — with live demo swatches */}
          <div className="p-5" style={{ background: 'var(--color-surface-2)', borderRadius: 'var(--radius-m)' }}>
            <p className="font-sans text-sm font-bold mb-3" style={{ color: 'var(--color-danger-1)' }}>
              1. Lightness lies
            </p>
            {/* HSL comparison: yellow vs blue at "50% lightness" */}
            <div className="flex gap-2 mb-3">
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full h-12 rounded" style={{ backgroundColor: 'hsl(60, 100%, 50%)' }} />
                <span className="font-mono text-[9px] mt-1" style={{ color: 'var(--color-on-surface-subtle-2)' }}>HSL yellow L50</span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full h-12 rounded" style={{ backgroundColor: 'hsl(240, 100%, 50%)' }} />
                <span className="font-mono text-[9px] mt-1" style={{ color: 'var(--color-on-surface-subtle-2)' }}>HSL blue L50</span>
              </div>
            </div>
            <p className="font-sans text-[11px] mb-3" style={{ color: 'var(--color-danger-1)' }}>
              Same "lightness" — wildly different brightness
            </p>
            {/* OKLCH comparison: same L value */}
            <div className="flex gap-2 mb-2">
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full h-12 rounded" style={{ backgroundColor: 'oklch(0.7 0.15 90)' }} />
                <span className="font-mono text-[9px] mt-1" style={{ color: 'var(--color-on-surface-subtle-2)' }}>OKLCH yellow L0.7</span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full h-12 rounded" style={{ backgroundColor: 'oklch(0.7 0.15 260)' }} />
                <span className="font-mono text-[9px] mt-1" style={{ color: 'var(--color-on-surface-subtle-2)' }}>OKLCH blue L0.7</span>
              </div>
            </div>
            <p className="font-sans text-[11px]" style={{ color: 'var(--color-primary-1)' }}>
              Same lightness — same perceived brightness
            </p>
          </div>

          {/* 2. Dark mode breaks */}
          <div className="p-5" style={{ background: 'var(--color-surface-2)', borderRadius: 'var(--radius-m)' }}>
            <p className="font-sans text-sm font-bold mb-3" style={{ color: 'var(--color-danger-1)' }}>
              2. Dark mode breaks
            </p>
            <p className="font-sans text-sm mb-3" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
              If lightness values aren't perceptually uniform, you can't just flip them for dark mode.
              Every color needs manual adjustment.
            </p>
            <div className="flex gap-1 mb-1">
              {[0.96, 0.88, 0.72, 0.55, 0.34, 0.19].map((l, i) => (
                <div key={i} className="flex-1 h-5 rounded" style={{ backgroundColor: `oklch(${l} 0.10 146)` }} />
              ))}
            </div>
            <div className="flex items-center justify-center my-1">
              <span className="font-mono text-[9px]" style={{ color: 'var(--color-on-surface-subtle-2)' }}>flip L →</span>
            </div>
            <div className="flex gap-1">
              {[0.19, 0.34, 0.55, 0.72, 0.88, 0.96].map((l, i) => (
                <div key={i} className="flex-1 h-5 rounded" style={{ backgroundColor: `oklch(${l} 0.10 146)` }} />
              ))}
            </div>
            <p className="font-sans text-[11px] mt-2" style={{ color: 'var(--color-primary-1)' }}>
              OKLCH: relationships hold when flipped
            </p>
          </div>

          {/* 3. New colors don't fit */}
          <div className="p-5" style={{ background: 'var(--color-surface-2)', borderRadius: 'var(--radius-m)' }}>
            <p className="font-sans text-sm font-bold mb-3" style={{ color: 'var(--color-danger-1)' }}>
              3. New colors don't fit
            </p>
            <p className="font-sans text-sm mb-3" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
              In OKLCH, rotate the hue and the palette slots in perfectly:
            </p>
            {/* Three palettes at same L/C, different H */}
            {[
              { h: 146, label: 'Green H146°' },
              { h: 260, label: 'Blue H260°' },
              { h: 310, label: 'Purple H310°' },
            ].map(({ h, label }) => (
              <div key={h} className="mb-2">
                <div className="flex gap-0.5">
                  {[0.95, 0.85, 0.72, 0.58, 0.44, 0.30].map((l, i) => (
                    <div key={i} className="flex-1 h-4 first:rounded-l last:rounded-r" style={{ backgroundColor: `oklch(${l} 0.10 ${h})` }} />
                  ))}
                </div>
                <span className="font-mono text-[8px]" style={{ color: 'var(--color-on-surface-subtle-2)' }}>{label}</span>
              </div>
            ))}
            <p className="font-sans text-[11px] mt-1" style={{ color: 'var(--color-primary-1)' }}>
              Same L + C values, different H — equal visual weight
            </p>
          </div>
        </div>

        <p className="font-sans text-sm" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
          These aren't edge cases. Every design system that ships dark mode, status colors, or brand themes hits all three.
          Tailwind CSS, Radix, and Open Props all ran into these problems before adopting perceptual color spaces.
        </p>
      </Card>

      {/* ── How OKLCH works ─────────────────── */}
      <div className="mt-12" />
      <SectionTitle>How OKLCH works</SectionTitle>
      <Card>
        <p className="font-sans text-md mb-6" style={{ color: 'var(--color-on-surface)' }}>
          OKLCH separates color into three independent channels. Change one without affecting the others.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* L channel card with gradient strip */}
          <div className="p-5" style={{ background: 'var(--color-surface-2)', borderRadius: 'var(--radius-m)' }}>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="font-mono text-2xl font-bold" style={{ color: 'var(--color-primary-1)' }}>L</span>
              <span className="font-mono text-xs" style={{ color: 'var(--color-on-surface-subtle-2)' }}>0 – 1</span>
            </div>
            <p className="font-sans text-sm font-semibold mb-1" style={{ color: 'var(--color-on-surface)' }}>
              Lightness
            </p>
            <p className="font-sans text-sm mb-3" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
              How bright a color looks to your eyes. 0 = black, 1 = white. Perceptually linear — the key breakthrough.
            </p>
            <div className="flex gap-0.5 h-4">
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} className="flex-1 first:rounded-l last:rounded-r" style={{ backgroundColor: `oklch(${(i + 1) / 10} 0 0)` }} />
              ))}
            </div>
            <div className="flex justify-between mt-1">
              <span className="font-mono text-[8px]" style={{ color: 'var(--color-on-surface-subtle-2)' }}>0</span>
              <span className="font-mono text-[8px]" style={{ color: 'var(--color-on-surface-subtle-2)' }}>1</span>
            </div>
          </div>

          {/* C channel card with gradient strip */}
          <div className="p-5" style={{ background: 'var(--color-surface-2)', borderRadius: 'var(--radius-m)' }}>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="font-mono text-2xl font-bold" style={{ color: 'var(--color-primary-1)' }}>C</span>
              <span className="font-mono text-xs" style={{ color: 'var(--color-on-surface-subtle-2)' }}>0 – ~0.37</span>
            </div>
            <p className="font-sans text-sm font-semibold mb-1" style={{ color: 'var(--color-on-surface)' }}>
              Chroma
            </p>
            <p className="font-sans text-sm mb-3" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
              How colorful — independent of brightness. 0 = pure grey. Changing chroma doesn't shift perceived brightness.
            </p>
            <div className="flex gap-0.5 h-4">
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} className="flex-1 first:rounded-l last:rounded-r" style={{ backgroundColor: `oklch(0.65 ${(i * 0.016)} 146)` }} />
              ))}
            </div>
            <div className="flex justify-between mt-1">
              <span className="font-mono text-[8px]" style={{ color: 'var(--color-on-surface-subtle-2)' }}>grey</span>
              <span className="font-mono text-[8px]" style={{ color: 'var(--color-on-surface-subtle-2)' }}>vivid</span>
            </div>
          </div>

          {/* H channel card with hue strip */}
          <div className="p-5" style={{ background: 'var(--color-surface-2)', borderRadius: 'var(--radius-m)' }}>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="font-mono text-2xl font-bold" style={{ color: 'var(--color-primary-1)' }}>H</span>
              <span className="font-mono text-xs" style={{ color: 'var(--color-on-surface-subtle-2)' }}>0° – 360°</span>
            </div>
            <p className="font-sans text-sm font-semibold mb-1" style={{ color: 'var(--color-on-surface)' }}>
              Hue
            </p>
            <p className="font-sans text-sm mb-3" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
              The color itself. Rotating hue at constant L and C gives harmonious companions with equal visual weight.
            </p>
            <div className="flex gap-0.5 h-4">
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className="flex-1 first:rounded-l last:rounded-r" style={{ backgroundColor: `oklch(0.7 0.12 ${i * 30})` }} />
              ))}
            </div>
            <div className="flex justify-between mt-1">
              <span className="font-mono text-[8px]" style={{ color: 'var(--color-on-surface-subtle-2)' }}>0°</span>
              <span className="font-mono text-[8px]" style={{ color: 'var(--color-on-surface-subtle-2)' }}>360°</span>
            </div>
          </div>
        </div>

        {/* Kvalt's hue angles */}
        <p className="font-sans text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
          Kvalt's hue angles
        </p>
        <div className="flex gap-3 flex-wrap mb-4">
          {[
            { name: 'Primary', h: '146°', color: 'var(--color-primary-1)' },
            { name: 'Secondary', h: '256°', color: 'var(--color-on-secondary-1)' },
            { name: 'Grey', h: '256°', color: 'var(--color-surface-6)' },
            { name: 'Success', h: '154°', color: 'var(--color-success-1)' },
            { name: 'Warning', h: '50°', color: 'var(--color-warning-1)' },
            { name: 'Danger', h: '26°', color: 'var(--color-danger-1)' },
          ].map(({ name, h, color }) => (
            <div key={name} className="flex items-center gap-2 px-3 py-1.5" style={{ background: 'var(--color-surface-2)', borderRadius: 'var(--radius-m)' }}>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="font-sans text-xs font-semibold" style={{ color: 'var(--color-on-surface)' }}>{name}</span>
              <span className="font-mono text-xs" style={{ color: 'var(--color-on-surface-subtle-2)' }}>{h}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* ── The proof ─────────────────── */}
      <div className="mt-12" />
      <SectionTitle>The proof</SectionTitle>
      <Card>
        <HsluvExplainer />
      </Card>

      {/* ── The gamut challenge ─────────────────── */}
      <div className="mt-12" />
      <SectionTitle>The gamut challenge</SectionTitle>
      <Card>
        <p className="font-sans text-md mb-4" style={{ color: 'var(--color-on-surface)' }}>
          OKLCH solves lightness and hue stability. But there's one thing no color model can fix:
          your screen has physical limits on how colorful it can go.
        </p>
        <p className="font-sans text-md mb-6" style={{ color: 'var(--color-on-surface)' }}>
          The sRGB gamut — what every standard monitor can display — is an <strong>irregular shape</strong>.
          Different hues have wildly different amounts of chroma available at the same lightness:
        </p>

        {/* Gamut bars — colored per hue */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          {[
            { hue: 'Magenta', angle: 340, max: '0.27', pct: 100, note: 'Most room' },
            { hue: 'Red', angle: 25, max: '0.20', pct: 74, note: '' },
            { hue: 'Blue', angle: 265, max: '0.17', pct: 63, note: '' },
            { hue: 'Orange', angle: 50, max: '0.17', pct: 63, note: '' },
            { hue: 'Green', angle: 145, max: '0.15', pct: 56, note: '' },
            { hue: 'Cyan', angle: 195, max: '0.13', pct: 48, note: 'Least room' },
          ].map(({ hue, angle, max, pct, note }) => (
            <div key={hue} className="p-3" style={{ background: 'var(--color-surface-2)', borderRadius: 'var(--radius-m)' }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `oklch(0.65 0.15 ${angle})` }} />
                <span className="font-sans text-xs font-semibold" style={{ color: 'var(--color-on-surface)' }}>{hue} ({angle}°)</span>
                <span className="font-mono text-xs ml-auto" style={{ color: 'var(--color-on-surface-subtle-2)' }}>{max}</span>
              </div>
              <div className="w-full h-3 rounded-full" style={{ background: 'var(--color-surface-4)' }}>
                <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: `oklch(0.65 0.15 ${angle})` }} />
              </div>
              {note && <span className="font-sans text-[10px] mt-1 block" style={{ color: 'var(--color-on-surface-subtle-2)' }}>{note}</span>}
            </div>
          ))}
        </div>

        <p className="font-sans text-md mb-4" style={{ color: 'var(--color-on-surface)' }}>
          This means you can't use the same chroma value across all hues. C=0.15 is near-maximum for green
          but barely half of what magenta can do. If you naively set the same chroma for all palette hues,
          some will look washed out while others clip.
        </p>

        <div className="p-5" style={{ background: 'var(--color-surface-2)', borderRadius: 'var(--radius-m)' }}>
          <p className="font-sans text-sm font-bold mb-2" style={{ color: 'var(--color-on-surface)' }}>
            How Kvalt handles this
          </p>
          <p className="font-sans text-sm" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
            Our palette generator uses <strong>gamut-relative chroma curves</strong>. Instead of a fixed chroma value,
            each palette step uses a percentage of the maximum available chroma for that specific hue at that specific
            lightness. This means every palette — green, blue, red, orange — looks proportionally vivid without
            ever exceeding what your screen can display. You can explore this in the{' '}
            <span className="font-semibold" style={{ color: 'var(--color-primary-1)' }}>Palette Generator</span> tool.
          </p>
        </div>
      </Card>

      {/* ── Advanced: hue rotation ─────────────────── */}
      <div className="mt-12" />
      <SectionTitle>Advanced: natural hue shifts</SectionTitle>
      <Card>
        <p className="font-sans text-md mb-4" style={{ color: 'var(--color-on-surface)' }}>
          In nature, your eyes perceive darker shades as cooler (more blue) and lighter tints as warmer
          (more yellow). This is called the <strong>Bezold-Brücke effect</strong>. Advanced palette systems
          intentionally shift hue by a few degrees across lightness steps to mimic this:
        </p>

        {/* Side-by-side comparison: fixed hue vs shifted */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="p-5" style={{ background: 'var(--color-surface-2)', borderRadius: 'var(--radius-m)' }}>
            <p className="font-sans text-sm font-bold mb-3" style={{ color: 'var(--color-on-surface)' }}>
              Fixed hue (H=30° constant)
            </p>
            <div className="flex gap-0.5 h-8 mb-2">
              {[0.95, 0.88, 0.78, 0.68, 0.55, 0.42, 0.30, 0.20].map((l, i) => (
                <div key={i} className="flex-1 first:rounded-l last:rounded-r" style={{ backgroundColor: `oklch(${l} ${0.04 + i * 0.018} 30)` }} />
              ))}
            </div>
            <p className="font-sans text-[11px]" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
              Can feel flat or synthetic across the full range
            </p>
          </div>
          <div className="p-5" style={{ background: 'var(--color-surface-2)', borderRadius: 'var(--radius-m)' }}>
            <p className="font-sans text-sm font-bold mb-3" style={{ color: 'var(--color-on-surface)' }}>
              Hue drift (H: 40° → 22°, warm → cool)
            </p>
            <div className="flex gap-0.5 h-8 mb-2">
              {[
                { l: 0.95, h: 40 }, { l: 0.88, h: 38 }, { l: 0.78, h: 35 }, { l: 0.68, h: 32 },
                { l: 0.55, h: 29 }, { l: 0.42, h: 26 }, { l: 0.30, h: 24 }, { l: 0.20, h: 22 },
              ].map(({ l, h }, i) => (
                <div key={i} className="flex-1 first:rounded-l last:rounded-r" style={{ backgroundColor: `oklch(${l} ${0.04 + i * 0.018} ${h})` }} />
              ))}
            </div>
            <p className="font-sans text-[11px]" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
              Feels more natural — mimics how light behaves in the real world
            </p>
          </div>
        </div>

        <div className="p-5" style={{ background: 'var(--color-surface-2)', borderRadius: 'var(--radius-m)' }}>
          <p className="font-sans text-sm font-bold mb-2" style={{ color: 'var(--color-on-surface)' }}>
            Kvalt's approach
          </p>
          <p className="font-sans text-sm" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
            Our current palettes keep hue constant across steps (±3° from the original HSLuv source).
            This is a conscious starting point — consistent hue is easier to reason about, and hue shifts
            can be introduced per-palette as a refinement pass using the palette generator.
          </p>
        </div>
      </Card>

      {/* ── Known edge cases ─────────────────── */}
      <div className="mt-12" />
      <SectionTitle>Known edge cases</SectionTitle>
      <Card>
        <p className="font-sans text-md mb-6" style={{ color: 'var(--color-on-surface)' }}>
          OKLCH isn't perfect. These are real limitations that every team using it encounters:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Yellow edge case with live demo */}
          <div className="p-5" style={{ background: 'var(--color-surface-2)', borderRadius: 'var(--radius-m)' }}>
            <p className="font-sans text-sm font-bold mb-3" style={{ color: 'var(--color-warning-1)' }}>
              Yellow is the hardest hue
            </p>
            <div className="flex gap-0.5 h-6 mb-2">
              {[0.97, 0.93, 0.87, 0.80, 0.72, 0.62, 0.50, 0.38].map((l, i) => (
                <div key={i} className="flex-1 first:rounded-l last:rounded-r" style={{ backgroundColor: `oklch(${l} ${0.02 + i * 0.014} 90)` }} />
              ))}
            </div>
            <p className="font-sans text-[11px] mb-2" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
              Yellow's chroma range is narrow — dark yellows turn muddy brown
            </p>
            <p className="font-sans text-sm" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
              Adam Argyle (Open Props): "Yellow does not generate well... still trying to figure out the best way."
              Expect manual tuning for yellow palettes.
            </p>
          </div>

          {/* Gradient edge case with live demo */}
          <div className="p-5" style={{ background: 'var(--color-surface-2)', borderRadius: 'var(--radius-m)' }}>
            <p className="font-sans text-sm font-bold mb-3" style={{ color: 'var(--color-warning-1)' }}>
              Gradients can surprise
            </p>
            <div className="mb-2">
              <div className="h-6 rounded mb-1" style={{ background: 'linear-gradient(to right in oklch, oklch(0.7 0.15 145), oklch(0.7 0.15 265))' }} />
              <span className="font-mono text-[8px]" style={{ color: 'var(--color-on-surface-subtle-2)' }}>OKLCH interpolation (may detour through cyan)</span>
            </div>
            <div className="mb-2">
              <div className="h-6 rounded mb-1" style={{ background: 'linear-gradient(to right in oklab, oklch(0.7 0.15 145), oklch(0.7 0.15 265))' }} />
              <span className="font-mono text-[8px]" style={{ color: 'var(--color-on-surface-subtle-2)' }}>Oklab interpolation (straight path)</span>
            </div>
            <p className="font-sans text-sm" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
              For CSS gradients, use Oklab (rectangular) over OKLCH (polar) — Tailwind v4 made the same switch.
            </p>
          </div>

          {/* Hand-tuning */}
          <div className="p-5" style={{ background: 'var(--color-surface-2)', borderRadius: 'var(--radius-m)' }}>
            <p className="font-sans text-sm font-bold mb-3" style={{ color: 'var(--color-warning-1)' }}>
              Hand-tuning still wins
            </p>
            <div className="flex gap-2 mb-3">
              <div className="flex-1 p-2 text-center" style={{ background: 'var(--color-surface-3)', borderRadius: 'var(--radius-s)' }}>
                <span className="font-mono text-2xl font-bold" style={{ color: 'var(--color-on-surface)' }}>90%</span>
                <p className="font-sans text-[10px]" style={{ color: 'var(--color-on-surface-subtle-2)' }}>algorithm</p>
              </div>
              <div className="flex-1 p-2 text-center" style={{ background: 'var(--color-surface-3)', borderRadius: 'var(--radius-s)' }}>
                <span className="font-mono text-2xl font-bold" style={{ color: 'var(--color-primary-1)' }}>10%</span>
                <p className="font-sans text-[10px]" style={{ color: 'var(--color-on-surface-subtle-2)' }}>designer eye</p>
              </div>
            </div>
            <p className="font-sans text-sm" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
              Every major system (Tailwind, Radix, Stripe) hand-tunes their final palettes. OKLCH makes the math transparent,
              but the art is still human.
            </p>
          </div>
        </div>
      </Card>

      {/* ── How others approach this ─────────────────── */}
      <div className="mt-12" />
      <SectionTitle>Industry adoption</SectionTitle>
      <Card>
        <p className="font-sans text-md mb-6" style={{ color: 'var(--color-on-surface)' }}>
          Kvalt isn't early to OKLCH — we're joining a proven trajectory. The largest design systems have
          already migrated or are actively migrating.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {[
            {
              name: 'Tailwind CSS v4',
              detail: 'Migrated all 22 hue palettes (242+ colors) from RGB to OKLCH. Chroma follows a Gaussian curve peaking at mid-tones. Lightness and chroma curves are non-linear and hand-tuned per palette — no single formula worked. Hues intentionally drift across steps for naturalness.',
              accent: 'oklch(0.65 0.15 230)',
            },
            {
              name: 'Radix Colors',
              detail: '12-step scale where step 9 has peak chroma. Steps 11-12 are guaranteed to meet APCA contrast. Uses Gaussian chroma distribution and OKLCH interpolation. Powers Vercel, Linear, and Supabase interfaces.',
              accent: 'oklch(0.60 0.18 290)',
            },
            {
              name: 'Stripe',
              detail: 'Pioneered perceptual color for design systems (2019) using CIELAB. Shifted both background and text in a perceptually uniform space to maintain contrast across all badge colors "without fine tuning each combination individually."',
              accent: 'oklch(0.55 0.20 280)',
            },
            {
              name: 'Linear',
              detail: 'Rebuilt custom theme generation using LCH: "a red and yellow with lightness 50 will appear roughly equally light — making it possible to generate more consistently good-looking themes regardless of base colors."',
              accent: 'oklch(0.60 0.18 260)',
            },
            {
              name: 'Evil Martians',
              detail: 'Created oklch.com, Harmonizer, and apcach. Key finding: use a "max consistency" chroma array that works across ALL hue angles. Published the definitive Tailwind + OKLCH integration guide.',
              accent: 'oklch(0.60 0.20 25)',
            },
            {
              name: 'CSS specification',
              detail: 'oklch() is a W3C standard, supported in Chrome 111+, Safari 15.4+, Firefox 113+ — over 95% global browser coverage. CSS relative color syntax (oklch(from var(--base) ...)) enables dynamic palette generation in pure CSS.',
              accent: 'oklch(0.55 0.15 145)',
            },
          ].map(({ name, detail, accent }) => (
            <div
              key={name}
              className="p-5 flex gap-4"
              style={{ background: 'var(--color-surface-2)', borderRadius: 'var(--radius-m)', borderLeft: `3px solid ${accent}` }}
            >
              <div>
                <p className="font-sans text-sm font-bold mb-2" style={{ color: 'var(--color-on-surface)' }}>{name}</p>
                <p className="font-sans text-sm" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ── What this means for your team ─────────────────── */}
      <div className="mt-12" />
      <SectionTitle>What this means for your team</SectionTitle>
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              role: 'Designers',
              accent: 'var(--color-primary-1)',
              points: [
                'Pick any hue at the same lightness step and it carries equal visual weight — no more eyeballing balance between status colors',
                'Dark mode palettes derive from light mode by mapping lightness — the relationships hold without per-color tweaking',
                'The palette generator lets you sculpt chroma curves visually, with gamut boundaries shown in real time',
              ],
            },
            {
              role: 'Developers',
              accent: 'var(--color-on-secondary-1)',
              points: [
                'oklch() is native CSS — no build step, no JS conversion, no polyfills needed',
                'Semantic tokens resolve to oklch() values, so the color model is transparent to component code',
                'Adding a new brand hue is a config change, not a week of manual color matching',
              ],
            },
            {
              role: 'Product & Leadership',
              accent: 'var(--color-success-1)',
              points: [
                'Accessibility compliance (WCAG AA) is predictable from lightness values — step 700-on-50 always passes',
                'White-label theming becomes viable: swap one hue angle and get a complete, balanced palette',
                'Reduced design-dev handoff friction — the color model eliminates "it looks different than Figma" conversations',
              ],
            },
            {
              role: 'Why not switch to something else?',
              accent: 'var(--color-danger-1)',
              points: [
                'HSL/RGB are perceptually broken — equal values don\'t produce equal perceived brightness across hues',
                'HSLuv solved lightness but isn\'t a CSS standard — it needs JS conversion at runtime or build time',
                'LCH (the predecessor) has hue drift — blues shift purple when you change chroma. OKLCH fixed this',
                'OKLCH is the W3C standard, supported in all browsers, and adopted by Tailwind, Open Props, and the Chrome team',
              ],
            },
          ].map(({ role, accent, points }) => (
            <div key={role} className="p-5" style={{ background: 'var(--color-surface-2)', borderRadius: 'var(--radius-m)', borderLeft: `3px solid ${accent}` }}>
              <p className="font-sans text-sm font-bold mb-3" style={{ color: 'var(--color-on-surface)' }}>{role}</p>
              <ul className="space-y-2">
                {points.map((point, i) => (
                  <li key={i} className="font-sans text-sm flex gap-2" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                    <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      </div>{/* end palettes */}

      {/* ══ GRADIENTS ════════════════════════════════════════════════════════════ */}
      <div ref={sectionNav.setSectionRef('gradients')} className="scroll-mt-[120px]">

      <div className="mb-16 mt-24">
        <h2
          className="font-brand font-bold leading-[0.95] mb-6"
          style={{ fontSize: 'clamp(56px, 7vw, 104px)', color: 'var(--color-on-surface)' }}
        >
          GRADIENTS
        </h2>
        <p className="font-sans text-lg max-w-2xl" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
          The AI signature. A lavender-to-peach diagonal that marks anything powered by intelligence. Four variants by intensity — from a whisper to a shout.
        </p>
      </div>

      {/* ── Variant showcase ─────────────── */}
      <SectionTitle>Variants</SectionTitle>
      <Card>
        <Spec>Four intensities for different contexts · Characters can override the stop colors</Spec>
        <div className="grid grid-cols-2 gap-6">
          {[
            { token: '--gradient-ai', label: 'ai', desc: 'Section backgrounds, hero areas', sublabel: 'Full' },
            { token: '--gradient-ai-subtle', label: 'ai-subtle', desc: 'Card tints, row highlights', sublabel: '12% opacity' },
            { token: '--gradient-ai-vivid', label: 'ai-vivid', desc: 'Badges, CTAs, active states', sublabel: 'Saturated' },
            { token: '--gradient-ai-border', label: 'ai-border', desc: 'Gradient borders', sublabel: '50% opacity' },
          ].map(({ token, label, desc, sublabel }) => (
            <div key={token} className="flex flex-col gap-3">
              <div
                className="w-full h-28"
                style={{
                  background: `var(${token})`,
                  borderRadius: 'var(--radius-lg)',
                  border: token.includes('subtle') || token.includes('border') ? '1px solid var(--color-border)' : 'none',
                }}
              />
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs font-semibold" style={{ color: 'var(--color-on-surface)' }}>{label}</span>
                <span className="font-mono text-[10px]" style={{ color: 'var(--color-on-surface-subtle-2)' }}>{sublabel}</span>
              </div>
              <span className="font-sans text-xs" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{desc}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Stop colors ─────────────── */}
      <SectionTitle>Stop colors</SectionTitle>
      <Card>
        <Spec>Individual stop tokens — override these per character to shift the entire gradient</Spec>
        <div className="flex gap-6">
          {[
            { token: '--color-ai-from', label: 'ai-from', desc: 'Lavender start' },
            { token: '--color-ai-to', label: 'ai-to', desc: 'Peach end' },
          ].map(({ token, label, desc }) => (
            <div key={token} className="flex items-center gap-4 flex-1">
              <div
                className="w-16 h-16 shrink-0"
                style={{
                  backgroundColor: `var(${token})`,
                  borderRadius: 'var(--radius-m)',
                  boxShadow: 'var(--shadow-small-1)',
                }}
              />
              <div className="flex flex-col gap-0.5">
                <span className="font-mono text-xs font-semibold" style={{ color: 'var(--color-on-surface)' }}>{label}</span>
                <span className="font-sans text-xs" style={{ color: 'var(--color-on-surface-subtle-2)' }}>{desc}</span>
                <span className="font-mono text-[10px]" style={{ color: 'var(--color-on-surface-subtle-2)' }}>var({token})</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Use cases ─────────────── */}
      <SectionTitle>Use cases</SectionTitle>
      <Card>
        <Spec>How the gradient appears in real components</Spec>
        <div className="flex flex-col gap-8">

          {/* Full background */}
          <div className="flex flex-col gap-3">
            <span className="font-sans text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>AI feature section</span>
            <div
              className="p-8 flex flex-col gap-3 items-center justify-center text-center"
              style={{
                background: 'var(--gradient-ai)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <Sparkles size={24} style={{ color: 'var(--color-on-surface)' }} />
              <span className="font-display font-bold text-lg" style={{ color: 'var(--color-on-surface)' }}>Powered by AI</span>
              <span className="font-sans text-sm" style={{ color: 'var(--color-on-surface-subtle-1)' }}>This section is enhanced with intelligence.</span>
            </div>
          </div>

          {/* Subtle card tint */}
          <div className="flex flex-col gap-3">
            <span className="font-sans text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>Subtle card tint</span>
            <div className="grid grid-cols-3 gap-4">
              {['Standard card', 'AI-tinted card', 'Vivid card'].map((label, i) => (
                <div
                  key={label}
                  className="p-5 flex flex-col gap-2"
                  style={{
                    background: i === 0 ? 'var(--color-surface-1)' : i === 1 ? 'var(--gradient-ai-subtle)' : 'var(--gradient-ai)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                  }}
                >
                  <span className="font-sans text-sm font-medium" style={{ color: 'var(--color-on-surface)' }}>{label}</span>
                  <span className="font-sans text-xs" style={{ color: 'var(--color-on-surface-subtle-1)' }}>Compare the difference.</span>
                </div>
              ))}
            </div>
          </div>

          {/* Badge */}
          <div className="flex flex-col gap-3">
            <span className="font-sans text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>AI badge</span>
            <div className="flex gap-3">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 font-mono text-xs font-medium"
                style={{
                  background: 'var(--gradient-ai-vivid)',
                  color: '#fff',
                  borderRadius: 'var(--radius-xl)',
                }}
              >
                <Sparkles size={11} />
                AI Generated
              </span>
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 font-mono text-xs font-medium"
                style={{
                  background: 'var(--gradient-ai-subtle)',
                  color: 'var(--color-on-surface)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <Sparkles size={11} />
                AI Assisted
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* ── AICard component ─────────────── */}
      <SectionTitle>AICard component</SectionTitle>
      <Card>
        <Spec>Ready-made card with gradient border, subtle tint, and AI chip — import from <code className="font-mono">components/AICard</code></Spec>
        <div className="grid grid-cols-3 gap-4">
          <AICard
            title="Smart suggestions"
            description="Generated from your history and context."
          />
          <AICard
            chip="Copilot"
            title="Write with AI"
            description="Let the assistant draft your next section."
          />
          <AICard
            chip={null}
            title="No chip variant"
            description="Gradient border and tint, without the badge."
          />
        </div>
      </Card>

      {/* ── Architecture ─────────────── */}
      <SectionTitle>Architecture</SectionTitle>
      <Card>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <span className="font-sans text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>CSS path</span>
            <div className="p-4" style={{ backgroundColor: 'var(--color-surface-2)', borderRadius: 'var(--radius-m)' }}>
              <code className="font-mono text-xs" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                background: var(--gradient-ai);
              </code>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-sans text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>JS path (Motion)</span>
            <div className="p-4" style={{ backgroundColor: 'var(--color-surface-2)', borderRadius: 'var(--radius-m)' }}>
              <code className="font-mono text-xs" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                {`import { gradients } from 'tokens/gradients';`}<br/>
                {`background: gradients['ai-vivid']`}
              </code>
            </div>
          </div>
        </div>
      </Card>

      </div>{/* end gradients */}
    </section>
  );
}
