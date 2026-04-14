/**
 * paletteVars — map palette steps to CSS variables matching tokens.css.
 *
 * The base Kvalt character (defined in src/styles/tokens.css) is the canonical
 * source of truth for which palette step populates which semantic token.
 * This file encodes that mapping in one place so both the Shade Lab save flow
 * and the Character Builder save flow produce identical results.
 *
 * Light mode uses standard step keys (50/100/200/300/400/500/600/700).
 * Dark mode uses INTERMEDIATE shades for surface-1/3/5 (tokens.css calls them
 * grey-875/825/775) — we compute those via interpolation between neighbouring
 * step keys so they fit the 12-step palette model without adding new keys.
 */

import type { PaletteStep } from '../components/palette-generator/types';
import { oklchToCss } from './oklch';

// ─── Internal helpers ──────────────────────────────────────────────────────

function getStep(steps: PaletteStep[], key: number): PaletteStep | undefined {
  return steps.find(s => s.key === key);
}

function css(step: PaletteStep | undefined): string | null {
  return step ? oklchToCss(step.l, step.c, step.h) : null;
}

/** Linear midpoint of two palette steps — used for interpolated dark shades. */
function midpoint(a: PaletteStep | undefined, b: PaletteStep | undefined): string | null {
  if (!a || !b) return null;
  return oklchToCss((a.l + b.l) / 2, (a.c + b.c) / 2, (a.h + b.h) / 2);
}

function assign(vars: Record<string, string>, names: string[], value: string | null) {
  if (value === null) return;
  for (const name of names) vars[name] = value;
}

// ─── Light mode mappings ───────────────────────────────────────────────────

/**
 * Light-mode surface/border/text variables from a GREY palette.
 * Matches `:root` rules in tokens.css exactly — surface-1 is pure white and
 * never overwritten.
 */
export function greyVarsLight(steps: PaletteStep[]): Record<string, string> {
  const vars: Record<string, string> = {};
  assign(vars, ['--color-surface-2'],                          css(getStep(steps, 50)));
  assign(vars, ['--color-bg', '--color-surface-3'],            css(getStep(steps, 100)));
  assign(vars, ['--color-surface-4', '--color-border'],        css(getStep(steps, 200)));
  assign(vars, ['--color-surface-5', '--color-border-strong'], css(getStep(steps, 300)));
  assign(vars, ['--color-surface-6'],                          css(getStep(steps, 400)));
  assign(vars, ['--color-surface-7'],                          css(getStep(steps, 500)));
  assign(vars, ['--color-on-surface-subtle-2'],                css(getStep(steps, 600)));
  assign(vars, ['--color-on-surface-subtle-1'],                css(getStep(steps, 700)));
  return vars;
}

/**
 * Light-mode primary palette variables.
 * tokens.css uses steps 300/400/500 for primary-1/2/3 (not 700/750/800).
 */
export function primaryVarsLight(steps: PaletteStep[]): Record<string, string> {
  const vars: Record<string, string> = {};
  assign(vars, ['--color-primary-1'], css(getStep(steps, 300)));
  assign(vars, ['--color-primary-2'], css(getStep(steps, 400)));
  assign(vars, ['--color-primary-3'], css(getStep(steps, 500)));
  return vars;
}

/**
 * Light-mode secondary palette variables.
 * Secondary gives both a tinted bg layer (100/200) and a darker text layer
 * (700/750). Matches tokens.css.
 */
export function secondaryVarsLight(steps: PaletteStep[]): Record<string, string> {
  const vars: Record<string, string> = {};
  assign(vars, ['--color-secondary-1'],    css(getStep(steps, 100)));
  assign(vars, ['--color-secondary-2'],    css(getStep(steps, 200)));
  assign(vars, ['--color-on-secondary-1'], css(getStep(steps, 700)));
  assign(vars, ['--color-on-secondary-2'], css(getStep(steps, 750)));
  return vars;
}

// ─── Dark mode mappings ───────────────────────────────────────────────────

/**
 * Dark-mode surface/border/text variables from a GREY palette.
 * tokens.css uses custom intermediate shades (grey-875/825/775) for
 * surface-1/3/5 — we interpolate between neighbouring step keys so the
 * 12-step palette model still works.
 */
export function greyVarsDark(steps: PaletteStep[]): Record<string, string> {
  const vars: Record<string, string> = {};
  const s500 = getStep(steps, 500);
  const s600 = getStep(steps, 600);
  const s700 = getStep(steps, 700);
  const s750 = getStep(steps, 750);
  const s800 = getStep(steps, 800);
  const s850 = getStep(steps, 850);
  const s900 = getStep(steps, 900);

  assign(vars, ['--color-bg'],                                 css(s900));
  assign(vars, ['--color-surface-1'],                          midpoint(s850, s900));   // grey-875
  assign(vars, ['--color-surface-2'],                          css(s850));
  assign(vars, ['--color-surface-3'],                          midpoint(s800, s850));   // grey-825
  assign(vars, ['--color-surface-4', '--color-border'],        css(s800));
  assign(vars, ['--color-surface-5'],                          midpoint(s750, s800));   // grey-775
  assign(vars, ['--color-surface-6', '--color-border-strong'], css(s750));
  assign(vars, ['--color-surface-7'],                          css(s700));
  assign(vars, ['--color-on-surface-subtle-1'],                css(s500));
  assign(vars, ['--color-on-surface-subtle-2'],                css(s600));
  return vars;
}

/**
 * Dark-mode primary palette variables.
 * Kvalt keeps primary the SAME in both modes (same hex values).
 */
export function primaryVarsDark(steps: PaletteStep[]): Record<string, string> {
  return primaryVarsLight(steps);
}

/**
 * Dark-mode secondary palette variables — inverts the on/bg relationship.
 * In dark mode the bg goes DARKER (step 800/750) and on-text goes LIGHTER
 * (step 200/100).
 */
export function secondaryVarsDark(steps: PaletteStep[]): Record<string, string> {
  const vars: Record<string, string> = {};
  assign(vars, ['--color-secondary-1'],    css(getStep(steps, 800)));
  assign(vars, ['--color-secondary-2'],    css(getStep(steps, 750)));
  assign(vars, ['--color-on-secondary-1'], css(getStep(steps, 200)));
  assign(vars, ['--color-on-secondary-2'], css(getStep(steps, 100)));
  return vars;
}

// ─── Top-level dispatcher ──────────────────────────────────────────────────

export function paletteVars(
  name: 'primary' | 'secondary' | 'grey',
  steps: PaletteStep[],
): { light: Record<string, string>; dark: Record<string, string> } {
  switch (name) {
    case 'primary':   return { light: primaryVarsLight(steps),   dark: primaryVarsDark(steps)   };
    case 'secondary': return { light: secondaryVarsLight(steps), dark: secondaryVarsDark(steps) };
    case 'grey':      return { light: greyVarsLight(steps),      dark: greyVarsDark(steps)      };
  }
}
