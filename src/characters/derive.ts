/**
 * Character Derivation Engine
 *
 * Converts a compact CharacterSeed into a full Character with ~53 CSS variable
 * overrides, computed algorithmically from the OKLCH palette generator.
 *
 * Key relationships:
 *   - Full 12-step palette generated via generateGamutRelativeCurve
 *   - on-primary auto-derived from primary-1 lightness (< 0.55 → white, else dark)
 *   - Surfaces use the same hue as primary but at low chroma (tinted neutrals)
 *   - Semantic colors (success/warning/danger) use fixed hues unless overridden
 */

import {
  DEFAULT_LIGHTNESS,
  CHROMA_PRESETS,
  generateGamutRelativeCurve,
  oklchToCss,
} from '../lib/oklch';
import type { Character } from './types';
import type { CharacterSeed } from './types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function p(L: number, C: number[], H: number, i: number): string {
  return oklchToCss(L, C[i], H);
}

function shadowVars(rgb: string): Record<string, string> {
  return {
    '--shadow-small-1':  `0px 1px 3px 0px rgba(${rgb},0.06)`,
    '--shadow-small-2':  `0px 1px 3px 0px rgba(${rgb},0.12)`,
    '--shadow-small-3':  `0px 1px 3px 0px rgba(${rgb},0.24)`,
    '--shadow-medium-1': `0px 4px 16px 0px rgba(${rgb},0.06)`,
    '--shadow-medium-2': `0px 4px 16px 0px rgba(${rgb},0.12)`,
    '--shadow-medium-3': `0px 4px 16px 0px rgba(${rgb},0.24)`,
    '--shadow-large-1':  `0px 12px 40px 0px rgba(${rgb},0.08)`,
    '--shadow-large-2':  `0px 12px 40px 0px rgba(${rgb},0.16)`,
    '--shadow-large-3':  `0px 12px 40px 0px rgba(${rgb},0.28)`,
  };
}

/**
 * Generate the 7 semantic tokens for success/warning/danger.
 * Uses 'Balanced' chroma preset scaled to 55% of gamut max.
 */
function semanticVars(hue: number, prefix: string): Record<string, string> {
  const chromas = generateGamutRelativeCurve(hue, 0.55);
  const L = DEFAULT_LIGHTNESS;
  // secondary tint uses very low chroma (10% of gamut max)
  const tintChromas = generateGamutRelativeCurve(hue, 0.10);

  return {
    [`--color-${prefix}-1`]:            oklchToCss(L[6], chromas[6], hue),
    [`--color-${prefix}-2`]:            oklchToCss(L[7], chromas[7], hue),
    [`--color-${prefix}-3`]:            oklchToCss(L[8], chromas[8], hue),
    [`--color-on-${prefix}`]:           'oklch(1 0 0)',
    [`--color-${prefix}-secondary-1`]:  oklchToCss(L[1], tintChromas[1], hue),
    [`--color-${prefix}-secondary-2`]:  oklchToCss(L[2], tintChromas[2], hue),
    [`--color-on-${prefix}-secondary`]: oklchToCss(L[9], chromas[9], hue),
  };
}

// ─── Core ─────────────────────────────────────────────────────────────────────

export function deriveCharacter(seed: CharacterSeed): Character {
  const step = seed.primaryStep ?? 7;
  const primaryHue = seed.primaryHue;
  const surfaceHue = seed.surfaceHue ?? primaryHue;
  const surfaceChromaPercent = seed.surfaceChromaPercent ?? 0.12;

  // Primary palette — full saturation per chosen preset
  const primaryPreset = CHROMA_PRESETS.find(p => p.name === seed.primaryChroma) ?? CHROMA_PRESETS[1];
  const PC = generateGamutRelativeCurve(primaryHue, primaryPreset.percentage, primaryPreset.shape);

  // Surface palette — low-chroma tinted neutrals using 'Base' shape
  const basePreset = CHROMA_PRESETS.find(p => p.name === 'Base')!;
  const SC = generateGamutRelativeCurve(surfaceHue, surfaceChromaPercent, basePreset.shape);

  // Secondary tint palette — primary hue, very low chroma (15% of gamut max)
  const secondaryTintC = generateGamutRelativeCurve(primaryHue, 0.15);

  const L = DEFAULT_LIGHTNESS;

  // Shortcuts
  const pri  = (i: number) => oklchToCss(L[i], PC[i], primaryHue);
  const surf = (i: number) => oklchToCss(L[i], SC[i], surfaceHue);
  const tint = (i: number) => oklchToCss(L[i], secondaryTintC[i], primaryHue);

  // on-primary: white if primary-1 is dark, dark-text if primary-1 is light
  const primary1L = L[step];
  const onSurface = surf(11);
  const onPrimaryAuto = primary1L < 0.55 ? 'oklch(1 0 0)' : onSurface;
  const onPrimary = seed.onPrimaryOverride === 'white'
    ? 'oklch(1 0 0)'
    : seed.onPrimaryOverride === 'dark'
    ? onSurface
    : onPrimaryAuto;

  const overrides = seed.semanticOverrides ?? {};

  const variables: Record<string, string> = {
    // ── Surfaces ──────────────────────────────────────────────────────────────
    '--color-bg':         surf(1),
    '--color-surface-1':  'oklch(1 0 0)',
    '--color-surface-2':  surf(1),
    '--color-surface-3':  surf(2),
    '--color-surface-4':  surf(3),
    '--color-surface-5':  surf(4),
    '--color-surface-6':  surf(6),
    '--color-surface-7':  surf(7),

    // ── Text ──────────────────────────────────────────────────────────────────
    '--color-on-surface':           onSurface,
    '--color-on-surface-subtle-1':  surf(9),
    '--color-on-surface-subtle-2':  surf(8),
    '--color-inverted-surface':     surf(11),
    '--color-on-inverted-surface':  surf(0),

    // ── Primary ───────────────────────────────────────────────────────────────
    '--color-primary-1':   pri(step),
    '--color-primary-2':   pri(step + 1),
    '--color-primary-3':   pri(step + 2),
    '--color-on-primary':  onPrimary,

    // ── Secondary (primary-hue tinted, very light) ────────────────────────────
    '--color-secondary-1':    tint(1),
    '--color-secondary-2':    tint(2),
    '--color-on-secondary-1': pri(step + 1),
    '--color-on-secondary-2': pri(step),

    // ── Semantic ──────────────────────────────────────────────────────────────
    ...semanticVars(overrides.successHue ?? 145, 'success'),
    ...semanticVars(overrides.warningHue ?? 50,  'warning'),
    ...semanticVars(overrides.dangerHue  ?? 25,  'danger'),

    // ── Borders ───────────────────────────────────────────────────────────────
    '--color-border':        surf(3),
    '--color-border-strong': surf(4),

    // ── Hero title ────────────────────────────────────────────────────────────
    '--color-hero-title': seed.heroTitleIsAccent ? pri(step) : onSurface,

    // ── Radius ────────────────────────────────────────────────────────────────
    '--radius-s':   seed.radius.s,
    '--radius-m':   seed.radius.m,
    '--radius-lg':  seed.radius.lg,
    '--radius-2xl': seed.radius2xl ?? seed.radius.lg,
    '--radius-xl':  seed.radius.xl,

    // ── Layout ────────────────────────────────────────────────────────────────
    '--layout-gap': seed.layoutGap ?? '24px',

    // ── Fonts ─────────────────────────────────────────────────────────────────
    '--font-display': seed.fonts.display,
    '--font-body':    seed.fonts.body,
    '--font-brand':   seed.fonts.brand,

    // ── Background pattern ────────────────────────────────────────────────────
    '--bg-pattern':      seed.backgroundPattern?.image ?? 'none',
    '--bg-pattern-size': seed.backgroundPattern?.size  ?? 'auto',

    // ── Shadows ───────────────────────────────────────────────────────────────
    ...shadowVars(seed.shadowRgb ?? '20,38,62'),
  };

  // Dark mode surface overrides — mirrors the inversion in tokens.css
  // Surfaces flip: light surf(1) → dark surf(11), text flips surf(11) → surf(0)
  const darkVariables: Record<string, string> = {
    '--color-bg':                   surf(11),
    '--color-surface-1':            surf(10),
    '--color-surface-2':            surf(10),
    '--color-surface-3':            surf(9),
    '--color-surface-4':            surf(8),
    '--color-surface-5':            surf(7),
    '--color-surface-6':            surf(6),
    '--color-surface-7':            surf(5),
    '--color-on-surface':           surf(0),
    '--color-on-surface-subtle-1':  surf(5),
    '--color-on-surface-subtle-2':  surf(6),
    '--color-inverted-surface':     surf(0),
    '--color-on-inverted-surface':  surf(11),
    '--color-border':               surf(8),
    '--color-border-strong':        surf(7),
    '--color-hero-title':           seed.heroTitleIsAccent ? pri(step) : surf(0),
  };

  return {
    manifest: {
      name: seed.name,
      displayName: seed.displayName,
      version: seed.version ?? '1.0.0',
      description: seed.description,
      personality: seed.personality,
      author: seed.author ?? 'Kvalt',
      license: 'MIT',
      tags: seed.tags,
      preview: {
        primaryColor:     pri(step),
        backgroundColor:  surf(1),
        textColor:        onSurface,
        radius:           seed.radius.m,
      },
    },
    variables,
    darkVariables,
  };
}
