/**
 * CharacterBuilderPage — name it, pick three colors, map tokens, save.
 *
 * Two major modes:
 *
 *   New character:
 *     - Default "Character Builder" hero
 *     - Blank name input
 *     - Three empty palette builders
 *
 *   Edit character (opened with ?character=<name> in URL):
 *     - Hero shows a randomly-rotated verb + the character's display name,
 *       e.g. "Finetune \"Kavárna\"" or "Polish \"Bloom\""
 *     - Name input pre-filled with character.manifest.displayName
 *     - Each palette pre-seeded from the character's existing variables
 *       (hue extracted from --color-primary-1 / --color-secondary-1 / --color-bg)
 *
 * Flow:
 *   1. Enter a character name (huge input).
 *   2. Drop a reference image (optional) OR type hex directly.
 *   3. Click a root card to target Primary / Secondary / Base.
 *   4. Click the image or enter a custom hex to seed each palette.
 *   5. Shape the chroma curves.
 *   6. Step 2 — Token mapping: pick which palette step becomes
 *      --color-primary-1 and --color-on-primary. Contrast filter enabled.
 *      Direction toggle decides whether primary-2/-3 go lighter or darker.
 *   7. Save character → registers at runtime AND writes to
 *      src/characters/characters.ts via vite-character-writer plugin.
 *      Falls back to clipboard copy if the dev plugin isn't available.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, Sparkles, Copy as CopyIcon } from 'lucide-react';
import { PageHero } from '../../layouts/PageHero';
import { Section } from '../../layouts/Section';
import { Button } from '../../components/Button';
import {
  PaletteBuilder,
  type PaletteBuilderHandle,
} from '../../components/palette-generator/PaletteBuilder';
import {
  ImageEyedropper,
  type EyedropperPick,
} from '../../components/palette-generator/ImageEyedropper';
import { RootSwatchPair } from '../../components/palette-generator/RootSwatchPair';
import { STEP_KEYS } from '../../components/palette-generator/types';
import type { PaletteStep, StepKey } from '../../components/palette-generator/types';
import type { OklchColor } from '../../lib/oklch';
import { oklchToCss } from '../../lib/oklch';
import { buildCharacterPaletteVars } from '../../lib/applyPalette';
import { contrastSteps } from '../../lib/contrast';
import { saveCharacterToSource } from '../../lib/saveCharacterToSource';
import { useCharacter } from '../../characters/CharacterProvider';
import type { Character } from '../../characters/types';

// ─── Constants ──────────────────────────────────────────────────────────────

type BuilderSlot = 'primary' | 'secondary' | 'grey';

const SLOTS: { id: BuilderSlot; label: string; description: string }[] = [
  { id: 'primary',   label: 'Color 1', description: 'First distinctive brand colour.' },
  { id: 'secondary', label: 'Color 2', description: 'Second distinctive brand colour.' },
  { id: 'grey',      label: 'Base',    description: 'Body bg, cards, borders, subtle text.' },
];

// Maps user-facing palette source ('color1' / 'color2') to the internal slot
// key used by palette storage. The internal keys stay primary/secondary/grey
// so the existing paletteVars mapping + ColorInput + applyPaletteCssVars
// plumbing doesn't need to change.
type PaletteSource = 'color1' | 'color2';

function sourceToSlot(source: PaletteSource): BuilderSlot {
  return source === 'color1' ? 'primary' : 'secondary';
}

const SOURCE_LABEL: Record<PaletteSource, string> = {
  color1: 'Color 1',
  color2: 'Color 2',
};

interface TokenAnchor {
  source: PaletteSource;
  step: StepKey;
}

const NEXT_SLOT: Record<BuilderSlot, BuilderSlot> = {
  primary: 'secondary',
  secondary: 'grey',
  grey: 'grey',
};

type SlotRecord<T> = Record<BuilderSlot, T>;

const EDIT_VERBS = [
  'Edit',
  'Finetune',
  'Adjust',
  'Tackle',
  'Polish',
  'Refine',
  'Tweak',
  'Rework',
  'Reimagine',
  'Remix',
] as const;

const MIN_CONTRAST_AA = 4.5;

// ─── Helpers ────────────────────────────────────────────────────────────────

function toCharacterName(displayName: string): string {
  return displayName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Read a URL query parameter without reactivity. */
function getQueryParam(key: string): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get(key);
}

/** Extract an OKLCH color from a character's variables by CSS var name. */
function extractOklch(variables: Record<string, string>, varName: string): OklchColor | null {
  const val = variables[varName];
  if (!val) return null;
  const m = val.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/i);
  if (!m) return null;
  return { l: parseFloat(m[1]), c: parseFloat(m[2]), h: parseFloat(m[3]) };
}

/** Pick a random edit verb. */
function randomEditVerb(): string {
  return EDIT_VERBS[Math.floor(Math.random() * EDIT_VERBS.length)];
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function CharacterBuilderPage() {
  const { addCharacter, current, characters } = useCharacter();

  const primaryRef = useRef<PaletteBuilderHandle>(null);
  const secondaryRef = useRef<PaletteBuilderHandle>(null);
  const greyRef = useRef<PaletteBuilderHandle>(null);

  const refs = useMemo<SlotRecord<React.RefObject<PaletteBuilderHandle>>>(
    () => ({ primary: primaryRef, secondary: secondaryRef, grey: greyRef }),
    [],
  );

  // ── Edit mode detection ───────────────────────────────────────────────────
  const editTargetName = getQueryParam('character');
  const editTarget = useMemo(
    () => (editTargetName ? characters.find(c => c.manifest.name === editTargetName) ?? null : null),
    [editTargetName, characters],
  );
  const isEditMode = !!editTarget;
  const editVerb = useMemo(() => randomEditVerb(), []);

  // ── Primary state ─────────────────────────────────────────────────────────
  const [characterName, setCharacterName] = useState(
    editTarget ? editTarget.manifest.displayName : '',
  );
  const [activeSlot, setActiveSlot] = useState<BuilderSlot>('primary');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [rawColors, setRawColors] = useState<SlotRecord<OklchColor | null>>({
    primary: null,
    secondary: null,
    grey: null,
  });
  const [slotSteps, setSlotSteps] = useState<SlotRecord<PaletteStep[]>>({
    primary: [],
    secondary: [],
    grey: [],
  });

  // ── Step 2: token mapping state ───────────────────────────────────────────
  // Each token can be sourced from either Color 1 or Color 2. User picks the
  // source palette + step for each semantic token. primary-2/-3 and
  // secondary-2 auto-follow via a direction toggle. The on-* slots show a
  // contrast-filtered grid across BOTH palettes — any step from either that
  // meets WCAG AA is eligible.
  const [primaryAnchor, setPrimaryAnchor] = useState<TokenAnchor>({ source: 'color1', step: 300 });
  const [primaryDirection, setPrimaryDirection] = useState<'lighter' | 'darker'>('darker');
  const [userOnPrimary, setUserOnPrimary] = useState<TokenAnchor | null>(null);

  const [secondaryAnchor, setSecondaryAnchor] = useState<TokenAnchor>({ source: 'color2', step: 100 });
  const [secondaryDirection, setSecondaryDirection] = useState<'lighter' | 'darker'>('darker');
  const [userOnSecondary, setUserOnSecondary] = useState<TokenAnchor | null>(null);

  // ── Save feedback ─────────────────────────────────────────────────────────
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'copied' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  // ── Pre-load palettes in edit mode ────────────────────────────────────────
  // Extract hues from the character's existing variables and push them into
  // each builder via its imperative ref. Runs once after refs mount.
  useEffect(() => {
    if (!editTarget) return;
    // Wait for builders to mount before calling setBaseColor
    const id = requestAnimationFrame(() => {
      const primaryOklch = extractOklch(editTarget.variables, '--color-primary-1');
      const secondaryOklch =
        extractOklch(editTarget.variables, '--color-secondary-1') ??
        extractOklch(editTarget.variables, '--color-on-secondary-1');
      const greyOklch = extractOklch(editTarget.variables, '--color-bg');

      if (primaryOklch)   { primaryRef.current?.setBaseColor(primaryOklch);   setRawColors(prev => ({ ...prev, primary: primaryOklch })); }
      if (secondaryOklch) { secondaryRef.current?.setBaseColor(secondaryOklch); setRawColors(prev => ({ ...prev, secondary: secondaryOklch })); }
      if (greyOklch)      { greyRef.current?.setBaseColor(greyOklch);          setRawColors(prev => ({ ...prev, grey: greyOklch })); }
    });
    return () => cancelAnimationFrame(id);
  }, [editTarget]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const setSteps = useCallback((slot: BuilderSlot, steps: PaletteStep[]) => {
    setSlotSteps(prev => ({ ...prev, [slot]: steps }));
  }, []);

  const handleRawColorChange = useCallback(
    (slot: BuilderSlot, color: OklchColor | null) => {
      setRawColors(prev => (prev[slot] === color ? prev : { ...prev, [slot]: color }));
    },
    [],
  );

  const handlePick = useCallback(
    (pick: EyedropperPick) => {
      const slot = activeSlot;
      refs[slot].current?.setBaseColor(pick.oklch);
      setActiveSlot(prev => NEXT_SLOT[prev]);
      setSaveState('idle');
    },
    [activeSlot, refs],
  );

  const handleSlotClick = useCallback((slot: BuilderSlot) => {
    setActiveSlot(slot);
  }, []);

  // ── Derived: anchor resolution + auto contrast picking ───────────────────
  const getStepFromAnchor = useCallback(
    (anchor: TokenAnchor | null): PaletteStep | null => {
      if (!anchor) return null;
      const slot = sourceToSlot(anchor.source);
      return slotSteps[slot].find(s => s.key === anchor.step) ?? null;
    },
    [slotSteps],
  );

  const primaryBase = useMemo(() => getStepFromAnchor(primaryAnchor), [getStepFromAnchor, primaryAnchor]);
  const secondaryBase = useMemo(() => getStepFromAnchor(secondaryAnchor), [getStepFromAnchor, secondaryAnchor]);

  /** Pick the highest-contrast candidate from BOTH palettes against a background. */
  function pickBestContrast(bg: PaletteStep | null): TokenAnchor | null {
    if (!bg) return null;
    const all: { anchor: TokenAnchor; contrast: number }[] = [];
    (['color1', 'color2'] as PaletteSource[]).forEach((source) => {
      const steps = slotSteps[sourceToSlot(source)];
      steps.forEach((s) => {
        const c = contrastSteps(s, bg);
        if (c >= MIN_CONTRAST_AA) {
          all.push({ anchor: { source, step: s.key }, contrast: c });
        }
      });
    });
    all.sort((a, b) => b.contrast - a.contrast);
    return all[0]?.anchor ?? null;
  }

  /** Resolve user override or fall back to best auto-pick. */
  function resolveOnAnchor(
    userPick: TokenAnchor | null,
    bg: PaletteStep | null,
  ): TokenAnchor | null {
    if (!bg) return null;
    if (userPick) {
      const step = getStepFromAnchor(userPick);
      if (step && contrastSteps(step, bg) >= MIN_CONTRAST_AA) return userPick;
    }
    return pickBestContrast(bg);
  }

  const effectiveOnPrimary = useMemo(
    () => resolveOnAnchor(userOnPrimary, primaryBase),
    // pickBestContrast reads slotSteps + thresholds — deps via primaryBase + slotSteps
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userOnPrimary, primaryBase, slotSteps],
  );

  const effectiveOnSecondary = useMemo(
    () => resolveOnAnchor(userOnSecondary, secondaryBase),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userOnSecondary, secondaryBase, slotSteps],
  );

  // ── Build final variables with token mapping overrides ────────────────────
  const buildFinalVars = useCallback((): { variables: Record<string, string>; darkVariables: Record<string, string> } => {
    const { variables, darkVariables } = buildCharacterPaletteVars(
      slotSteps.primary,
      slotSteps.secondary,
      slotSteps.grey,
    );

    // ── Primary ─────────────────────────────────────────────────────────────
    if (primaryBase) {
      const primarySteps = slotSteps[sourceToSlot(primaryAnchor.source)];
      const idx = STEP_KEYS.indexOf(primaryAnchor.step);
      const offset = primaryDirection === 'lighter' ? -1 : 1;
      const p2 = primarySteps[Math.max(0, Math.min(STEP_KEYS.length - 1, idx + offset))];
      const p3 = primarySteps[Math.max(0, Math.min(STEP_KEYS.length - 1, idx + offset * 2))];

      const p1Css = oklchToCss(primaryBase.l, primaryBase.c, primaryBase.h);
      variables['--color-primary-1'] = p1Css;
      darkVariables['--color-primary-1'] = p1Css;
      if (p2) {
        const v = oklchToCss(p2.l, p2.c, p2.h);
        variables['--color-primary-2'] = v;
        darkVariables['--color-primary-2'] = v;
      }
      if (p3) {
        const v = oklchToCss(p3.l, p3.c, p3.h);
        variables['--color-primary-3'] = v;
        darkVariables['--color-primary-3'] = v;
      }
    }

    // ── on-primary ──────────────────────────────────────────────────────────
    const onPrimaryStep = getStepFromAnchor(effectiveOnPrimary);
    if (onPrimaryStep) {
      const v = oklchToCss(onPrimaryStep.l, onPrimaryStep.c, onPrimaryStep.h);
      variables['--color-on-primary'] = v;
      darkVariables['--color-on-primary'] = v;
    }

    // ── Secondary ───────────────────────────────────────────────────────────
    if (secondaryBase) {
      const secondarySteps = slotSteps[sourceToSlot(secondaryAnchor.source)];
      const idx = STEP_KEYS.indexOf(secondaryAnchor.step);
      const offset = secondaryDirection === 'lighter' ? -1 : 1;
      const s2 = secondarySteps[Math.max(0, Math.min(STEP_KEYS.length - 1, idx + offset))];

      const s1Css = oklchToCss(secondaryBase.l, secondaryBase.c, secondaryBase.h);
      variables['--color-secondary-1'] = s1Css;
      darkVariables['--color-secondary-1'] = s1Css;
      if (s2) {
        const v = oklchToCss(s2.l, s2.c, s2.h);
        variables['--color-secondary-2'] = v;
        darkVariables['--color-secondary-2'] = v;
      }
    }

    // ── on-secondary ────────────────────────────────────────────────────────
    const onSecondaryStep = getStepFromAnchor(effectiveOnSecondary);
    if (onSecondaryStep) {
      const v = oklchToCss(onSecondaryStep.l, onSecondaryStep.c, onSecondaryStep.h);
      variables['--color-on-secondary-1'] = v;
      variables['--color-on-secondary-2'] = v;
      darkVariables['--color-on-secondary-1'] = v;
      darkVariables['--color-on-secondary-2'] = v;
    }

    return { variables, darkVariables };
  }, [
    slotSteps,
    primaryBase,
    primaryAnchor,
    primaryDirection,
    effectiveOnPrimary,
    secondaryBase,
    secondaryAnchor,
    secondaryDirection,
    effectiveOnSecondary,
    getStepFromAnchor,
  ]);

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    const displayName = characterName.trim();
    if (!displayName) return;
    const name = toCharacterName(displayName);
    if (!name) return;

    setSaveState('saving');
    setSaveMessage('');

    const built = buildFinalVars();
    const inheritSource = editTarget ?? current;

    // Merge strategy: start with the full base character's variables so every
    // token has SOMETHING, then overlay the computed palette + token-mapping
    // output. Any token not touched by the editor falls through to the base
    // character's value — never to the raw tokens.css defaults. Guarantees a
    // fully-resolved character on save, no stale tokens.
    const variables: Record<string, string> = {
      ...inheritSource.variables,
      ...built.variables,
    };
    const darkVariables: Record<string, string> = {
      ...(inheritSource.darkVariables ?? {}),
      ...built.darkVariables,
    };

    const primaryHex = variables['--color-primary-1'] ?? current.manifest.preview?.primaryColor ?? '';
    const greyHex = variables['--color-bg'] ?? current.manifest.preview?.backgroundColor ?? '';

    const character: Character = {
      manifest: {
        name,
        displayName,
        version: editTarget?.manifest.version ?? '1.0.0',
        description: editTarget?.manifest.description ?? 'Custom character from Character Builder.',
        personality: editTarget?.manifest.personality ?? 'A character you made. Tweak it, switch to it, own it.',
        author: editTarget?.manifest.author ?? 'Custom',
        license: 'MIT',
        tags: editTarget?.manifest.tags ?? ['custom', 'user-built'],
        preview: {
          primaryColor: primaryHex,
          backgroundColor: greyHex,
          textColor: variables['--color-on-surface'] ?? 'oklch(0.266 0.0511 256.1)',
          radius: variables['--radius-m'] ?? '8px',
        },
      },
      variables,
      darkVariables,
    };

    // addCharacter now atomically registers AND activates the character,
    // triggering applyCharacterVariables via the CharacterProvider useEffect.
    // No need for a separate setCharacter call — that was prone to stale
    // closures when the registry lookup ran before runtime state had flushed.
    addCharacter(character);

    const result = await saveCharacterToSource(character);
    if (result.ok && result.mode === 'source') {
      setSaveState('saved');
      setSaveMessage('Written to src/characters/characters.ts');
    } else if (result.ok && result.mode === 'clipboard') {
      setSaveState('copied');
      setSaveMessage('Copied to clipboard — paste into src/characters/characters.ts');
    } else {
      setSaveState('error');
      setSaveMessage(result.ok ? '' : result.error);
    }
    setTimeout(() => setSaveState('idle'), 3000);
  }, [characterName, buildFinalVars, editTarget, current, addCharacter]);

  const canSave =
    characterName.trim().length > 0 &&
    (slotSteps.primary.length > 0 ||
      slotSteps.secondary.length > 0 ||
      slotSteps.grey.length > 0);

  const heroTitle = isEditMode ? `${editVerb} ${editTarget.manifest.displayName}` : 'Character Builder';
  const heroSubtitle = isEditMode
    ? 'Tune the palettes, remap the tokens, save back to source.'
    : 'Name it. Pick three colours. Save it. Switch to it.';

  return (
    <section className="mb-24">
      <PageHero
        title={heroTitle}
        subtitle={heroSubtitle}
        description="Seed each palette with a pixel from a reference image or a hex code, shape the chroma curve, and pick which palette step becomes --color-primary-1. Save — it joins the sidebar character switcher and writes to src/characters/characters.ts."
      />

      {/* ══ NAME ═════════════════════════════════════════════════════════════ */}
      <Section
        title="Character name"
        description="One or two words. Becomes the sidebar label and the filename slug."
      >
        <input
          type="text"
          value={characterName}
          onChange={(e) => setCharacterName(e.target.value)}
          placeholder="Name your character…"
          className="w-full bg-transparent border-none outline-none font-display font-bold"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            lineHeight: 1.1,
            color: 'var(--color-on-surface)',
            borderBottom: '2px solid var(--color-border)',
            paddingBottom: '0.5rem',
          }}
        />
      </Section>

      {/* ══ IMAGE ════════════════════════════════════════════════════════════ */}
      <Section
        title="Reference image"
        description="Drop a moodboard or illustration, then click pixels to seed each palette. Optional — you can also type hex codes below."
      >
        <ImageEyedropper
          imageUrl={imageUrl}
          onImageChange={(url) => {
            setImageUrl(url);
            setActiveSlot('primary');
            setSaveState('idle');
          }}
          onPick={handlePick}
          pickingFor={`${SLOTS.find(s => s.id === activeSlot)?.label} anchor`}
        />
      </Section>

      {/* ══ SELECT ROOTS ═════════════════════════════════════════════════════ */}
      <Section title="Select roots">
        <div className="grid grid-cols-3 gap-6">
          {SLOTS.map((slot) => (
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

      {/* ══ ACTIVE BUILDER ═══════════════════════════════════════════════════ */}
      {SLOTS.map((slot) => (
        <div
          key={slot.id}
          style={{ display: activeSlot === slot.id ? 'block' : 'none' }}
        >
          <PaletteBuilder
            ref={refs[slot.id]}
            editPaletteName={slot.id}
            hideExport
            onStepsChange={(steps) => setSteps(slot.id, steps)}
            onRawColorChange={(color) => handleRawColorChange(slot.id, color)}
          />
        </div>
      ))}

      {/* ══ STEP 2 — Token mapping ═══════════════════════════════════════════ */}
      <Section
        title="Token mapping"
        description="Pick which palette step becomes each semantic token. Both Color 1 and Color 2 are available for every slot. on-primary / on-secondary grids are filtered to steps that meet WCAG AA (≥4.5:1)."
      >
        <div className="flex flex-col gap-12">
          {/* ── Primary group ─────────────────────────────────────────── */}
          <TokenGroup
            title="Primary"
            bgStep={primaryBase}
            anchor={primaryAnchor}
            setAnchor={setPrimaryAnchor}
            direction={primaryDirection}
            setDirection={setPrimaryDirection}
            slotSteps={slotSteps}
            onAnchor={effectiveOnPrimary}
            setUserOnAnchor={setUserOnPrimary}
            getStepFromAnchor={getStepFromAnchor}
            bgTokenLabel="--color-primary-1"
            onTokenLabel="--color-on-primary"
            directionLabel="Primary-2 / Primary-3 direction"
            followupTokens={['--color-primary-2', '--color-primary-3']}
          />

          {/* ── Secondary group ───────────────────────────────────────── */}
          <TokenGroup
            title="Secondary"
            bgStep={secondaryBase}
            anchor={secondaryAnchor}
            setAnchor={setSecondaryAnchor}
            direction={secondaryDirection}
            setDirection={setSecondaryDirection}
            slotSteps={slotSteps}
            onAnchor={effectiveOnSecondary}
            setUserOnAnchor={setUserOnSecondary}
            getStepFromAnchor={getStepFromAnchor}
            bgTokenLabel="--color-secondary-1"
            onTokenLabel="--color-on-secondary"
            directionLabel="Secondary-2 direction"
            followupTokens={['--color-secondary-2']}
          />
        </div>
      </Section>

      {/* ══ SAVE ═════════════════════════════════════════════════════════════ */}
      <div
        className="mt-12 p-8 rounded-lg flex items-center justify-between gap-6"
        style={{
          backgroundColor: 'var(--color-surface-1)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div className="flex flex-col gap-1">
          <h3
            className="font-display font-semibold text-headline-m"
            style={{ color: 'var(--color-on-surface)' }}
          >
            {saveState === 'saved' || saveState === 'copied' ? 'Saved' : isEditMode ? 'Save changes' : 'Save this character'}
          </h3>
          <p
            className="font-sans text-md"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            {saveMessage ||
              'Saving registers the character, switches to it, and writes it to src/characters/characters.ts.'}
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          iconLeft={saveState === 'saved' ? Check : saveState === 'copied' ? CopyIcon : Sparkles}
          onClick={handleSave}
          disabled={!canSave || saveState === 'saving'}
        >
          {saveState === 'saving'
            ? 'Saving…'
            : saveState === 'saved'
            ? 'Saved'
            : saveState === 'copied'
            ? 'Copied'
            : isEditMode
            ? 'Save changes'
            : 'Save character'}
        </Button>
      </div>
    </section>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────

/**
 * TokenGroup — one semantic token pair (bg + on-text) with:
 * - Palette grid picker for the background slot (primary-1 / secondary-1)
 * - Direction toggle for the 2/3 follow-ups
 * - Contrast-filtered palette grid picker for the on-text slot
 * - Live preview pill
 */
function TokenGroup({
  title,
  bgStep,
  anchor,
  setAnchor,
  direction,
  setDirection,
  slotSteps,
  onAnchor,
  setUserOnAnchor,
  getStepFromAnchor,
  bgTokenLabel,
  onTokenLabel,
  directionLabel,
  followupTokens,
}: {
  title: string;
  bgStep: PaletteStep | null;
  anchor: TokenAnchor;
  setAnchor: (a: TokenAnchor) => void;
  direction: 'lighter' | 'darker';
  setDirection: (d: 'lighter' | 'darker') => void;
  slotSteps: SlotRecord<PaletteStep[]>;
  onAnchor: TokenAnchor | null;
  setUserOnAnchor: (a: TokenAnchor | null) => void;
  getStepFromAnchor: (a: TokenAnchor | null) => PaletteStep | null;
  bgTokenLabel: string;
  onTokenLabel: string;
  directionLabel: string;
  followupTokens: string[];
}) {
  const onStep = getStepFromAnchor(onAnchor);

  return (
    <div
      className="rounded-lg p-6 flex flex-col gap-6"
      style={{
        backgroundColor: 'var(--color-surface-1)',
        border: '1px solid var(--color-border)',
      }}
    >
      <h3
        className="font-display font-bold text-headline-m"
        style={{ color: 'var(--color-on-surface)' }}
      >
        {title}
      </h3>

      {/* Background (primary-1 / secondary-1) */}
      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <span className="font-sans text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>
            {bgTokenLabel}
          </span>
          <span className="font-mono text-xs" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
            {SOURCE_LABEL[anchor.source]} · {anchor.step}
          </span>
        </div>
        <PaletteGridPicker
          slotSteps={slotSteps}
          selectedAnchor={anchor}
          onSelect={setAnchor}
        />
      </div>

      {/* Direction for -2/-3 follow-ups — shown as two preview cards */}
      <div className="flex flex-col gap-2">
        <span className="font-sans text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>
          {directionLabel}
        </span>
        <DirectionPreview
          anchor={anchor}
          direction={direction}
          setDirection={setDirection}
          slotSteps={slotSteps}
          tokenLabels={followupTokens}
        />
      </div>

      {/* on-* slot (contrast-filtered) */}
      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <span className="font-sans text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>
            {onTokenLabel} · contrast ≥ 4.5:1
          </span>
          <span className="font-mono text-xs" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
            {onAnchor ? `${SOURCE_LABEL[onAnchor.source]} · ${onAnchor.step}` : '—'}
          </span>
        </div>
        <PaletteGridPicker
          slotSteps={slotSteps}
          selectedAnchor={onAnchor}
          onSelect={setUserOnAnchor}
          contrastBg={bgStep}
          minContrast={MIN_CONTRAST_AA}
        />
      </div>

      {/* Live preview */}
      {bgStep && onStep && (
        <div className="flex flex-col gap-2">
          <span className="font-sans text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>
            Preview
          </span>
          <div
            className="rounded-lg px-5 py-4 flex items-center justify-between"
            style={{
              backgroundColor: oklchToCss(bgStep.l, bgStep.c, bgStep.h),
              color: oklchToCss(onStep.l, onStep.c, onStep.h),
            }}
          >
            <span className="font-display font-semibold text-headline-s">
              The quick brown fox
            </span>
            <span className="font-mono text-xs">
              {contrastSteps(bgStep, onStep).toFixed(2)}:1
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * DirectionPreview — two cards showing how -2/-3 follow-ups would look in
 * each direction. Click to pick. Active card gets a highlighted border.
 */
function DirectionPreview({
  anchor,
  direction,
  setDirection,
  slotSteps,
  tokenLabels,
}: {
  anchor: TokenAnchor;
  direction: 'lighter' | 'darker';
  setDirection: (d: 'lighter' | 'darker') => void;
  slotSteps: SlotRecord<PaletteStep[]>;
  tokenLabels: string[]; // e.g. ['--color-primary-2', '--color-primary-3']
}) {
  const anchorSteps = slotSteps[sourceToSlot(anchor.source)];
  const anchorIdx = STEP_KEYS.indexOf(anchor.step);

  const stepsFor = (dir: 'lighter' | 'darker'): (PaletteStep | null)[] => {
    const offset = dir === 'lighter' ? -1 : 1;
    return tokenLabels.map((_, i) => {
      const targetIdx = Math.max(
        0,
        Math.min(STEP_KEYS.length - 1, anchorIdx + offset * (i + 1)),
      );
      return anchorSteps[targetIdx] ?? null;
    });
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {(['lighter', 'darker'] as const).map((dir) => {
        const active = direction === dir;
        const previewSteps = stepsFor(dir);
        return (
          <button
            key={dir}
            type="button"
            onClick={() => setDirection(dir)}
            className="text-left rounded-lg p-4 flex flex-col gap-3 cursor-pointer bg-transparent"
            style={{
              border: active
                ? '2px solid var(--color-primary-1)'
                : '2px solid var(--color-border)',
              backgroundColor: active ? 'var(--color-surface-2)' : 'transparent',
            }}
          >
            <span
              className="font-sans text-sm font-semibold"
              style={{
                color: active ? 'var(--color-primary-1)' : 'var(--color-on-surface)',
              }}
            >
              {dir === 'lighter' ? 'Go lighter' : 'Go darker'}
            </span>
            <div className="flex gap-2">
              {previewSteps.map((step, i) => (
                <div key={i} className="flex-1 flex flex-col items-stretch gap-1">
                  <div
                    className="w-full aspect-[3/2] rounded-s"
                    style={{
                      backgroundColor: step
                        ? oklchToCss(step.l, step.c, step.h)
                        : 'var(--color-surface-3)',
                      border:
                        step && step.l > 0.95
                          ? '1px solid var(--color-border)'
                          : 'none',
                    }}
                  />
                  <span
                    className="font-mono text-[9px] truncate"
                    style={{ color: 'var(--color-on-surface-subtle-2)' }}
                  >
                    {tokenLabels[i]}
                  </span>
                  <span
                    className="font-mono text-[9px]"
                    style={{ color: 'var(--color-on-surface-subtle-2)' }}
                  >
                    {step ? `step ${step.key}` : '—'}
                  </span>
                </div>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}

/**
 * PaletteGridPicker — 2-row grid of palette step swatches across both
 * Color 1 and Color 2. Click any cell to select. If `contrastBg` is set,
 * cells below `minContrast` are disabled and rendered faded with their
 * contrast ratio stamped in their caption.
 */
function PaletteGridPicker({
  slotSteps,
  selectedAnchor,
  onSelect,
  contrastBg,
  minContrast,
}: {
  slotSteps: SlotRecord<PaletteStep[]>;
  selectedAnchor: TokenAnchor | null;
  onSelect: (anchor: TokenAnchor) => void;
  contrastBg?: PaletteStep | null;
  minContrast?: number;
}) {
  const rows: { source: PaletteSource; steps: PaletteStep[] }[] = [
    { source: 'color1', steps: slotSteps.primary },
    { source: 'color2', steps: slotSteps.secondary },
  ];

  return (
    <div className="flex flex-col gap-2">
      {rows.map((row) => (
        <div key={row.source} className="flex items-center gap-3">
          <span
            className="font-mono text-[10px] uppercase tracking-wider w-[56px] shrink-0"
            style={{ color: 'var(--color-on-surface-subtle-2)' }}
          >
            {SOURCE_LABEL[row.source]}
          </span>
          <div className="flex-1 flex gap-1">
            {STEP_KEYS.map((key) => {
              const step = row.steps.find(s => s.key === key);
              const bg = step ? oklchToCss(step.l, step.c, step.h) : 'var(--color-surface-3)';
              const active =
                selectedAnchor?.source === row.source && selectedAnchor?.step === key;

              // Contrast filter (only applied when contrastBg is set)
              const contrast = step && contrastBg ? contrastSteps(step, contrastBg) : null;
              const contrastOk =
                contrastBg === undefined || contrastBg === null
                  ? true
                  : contrast !== null && contrast >= (minContrast ?? 0);
              const clickable = !!step && contrastOk;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => clickable && onSelect({ source: row.source, step: key })}
                  disabled={!clickable}
                  title={
                    contrast !== null
                      ? `${contrast.toFixed(2)}:1${contrastOk ? ' · passes AA' : ' · fails AA'}`
                      : undefined
                  }
                  className="flex-1 flex flex-col items-center gap-1 bg-transparent border-none p-0"
                  style={{
                    opacity: !step ? 0.25 : contrastOk ? 1 : 0.25,
                    cursor: clickable ? 'pointer' : 'not-allowed',
                  }}
                >
                  <div
                    className="w-full aspect-square rounded-s"
                    style={{
                      backgroundColor: bg,
                      outline: active ? '2px solid var(--color-primary-1)' : 'none',
                      outlineOffset: 2,
                      border: step && step.l > 0.95 ? '1px solid var(--color-border)' : 'none',
                    }}
                  />
                  <span
                    className="font-mono text-[9px]"
                    style={{
                      color: active ? 'var(--color-primary-1)' : 'var(--color-on-surface-subtle-2)',
                    }}
                  >
                    {contrast !== null ? contrast.toFixed(1) : key}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
