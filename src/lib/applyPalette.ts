/**
 * applyPalette — commit a computed palette into the live CSS variable system.
 *
 * Single source of truth for the palette-step → CSS-variable mapping is
 * `src/lib/paletteVars.ts`, which encodes the exact rules used by the default
 * Kvalt character (tokens.css). Both the Shade Lab save flow (foundations)
 * and the Character Builder save flow (tools) route through this module so
 * they produce identical results.
 *
 * Persistence strategy:
 *   - Edits are written to a single `<style id="kvalt-shade-lab">` tag with
 *     :root { } (light) and .dark { } (dark) rules.
 *   - `clearShadeLabOverrides()` removes the tag — CharacterProvider calls
 *     this on character switch so palette edits don't leak across themes.
 *   - The runtime `palette` object is also updated so ColorsPage and other
 *     token consumers display the new values without reload.
 */

import type { PaletteStep } from '../components/palette-generator/types';
import { oklchToCss } from './oklch';
import { palette } from '../tokens/colors';
import { paletteVars } from './paletteVars';

const SHADE_LAB_STYLE_ID = 'kvalt-shade-lab';

type PaletteName = 'primary' | 'secondary' | 'grey';

const MAIN_PALETTES: readonly PaletteName[] = ['primary', 'secondary', 'grey'];

function isMainPalette(name: string): name is PaletteName {
  return (MAIN_PALETTES as readonly string[]).includes(name);
}

// ─── Runtime accumulator ────────────────────────────────────────────────────
// Shade Lab writes accumulate here across multiple edits so the <style> tag
// always reflects the latest union of all touched palettes. Cleared on
// character switch.

interface ShadeLabState {
  light: Record<string, string>;
  dark: Record<string, string>;
}

const shadeLabState: ShadeLabState = { light: {}, dark: {} };

function rebuildStyleTag(): void {
  const lightEntries = Object.entries(shadeLabState.light);
  const darkEntries = Object.entries(shadeLabState.dark);

  if (lightEntries.length === 0 && darkEntries.length === 0) {
    document.getElementById(SHADE_LAB_STYLE_ID)?.remove();
    return;
  }

  let css = '';
  if (lightEntries.length > 0) {
    css += ':root {\n';
    for (const [k, v] of lightEntries) css += `  ${k}: ${v};\n`;
    css += '}\n';
  }
  if (darkEntries.length > 0) {
    css += '.dark {\n';
    for (const [k, v] of darkEntries) css += `  ${k}: ${v};\n`;
    css += '}\n';
  }

  let styleEl = document.getElementById(SHADE_LAB_STYLE_ID) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = SHADE_LAB_STYLE_ID;
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = css;
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Apply a palette's steps as CSS variable overrides via the Shade Lab
 * `<style>` tag. Idempotent — calling again with new steps replaces the
 * previous values for the same palette.
 *
 * Also mirrors the values into the runtime `palette` token object so
 * ColorsPage and other consumers reflect the change without a reload.
 *
 * Custom / user-defined palettes (anything outside primary/secondary/grey)
 * only update the runtime palette — they don't have a semantic CSS-var
 * mapping.
 */
export function applyPaletteCssVars(paletteName: string, steps: PaletteStep[]): void {
  if (isMainPalette(paletteName)) {
    const { light, dark } = paletteVars(paletteName, steps);
    Object.assign(shadeLabState.light, light);
    Object.assign(shadeLabState.dark, dark);
    rebuildStyleTag();
  }

  // Update the runtime `palette` object regardless — ColorsPage reads from it.
  const p = palette[paletteName as keyof typeof palette];
  if (p) {
    steps.forEach((step) => {
      (p as Record<number, string>)[step.key] = oklchToCss(step.l, step.c, step.h);
    });
  }
}

/**
 * Clear all Shade Lab overrides — called by CharacterProvider on character
 * switch so session edits don't leak across themes.
 */
export function clearShadeLabOverrides(): void {
  shadeLabState.light = {};
  shadeLabState.dark = {};
  rebuildStyleTag();
}

/**
 * Build a full { variables, darkVariables } pair for a new Character from
 * three edited palettes (primary/secondary/grey). Used by the Character
 * Builder save flow.
 */
export function buildCharacterPaletteVars(
  primarySteps: PaletteStep[],
  secondarySteps: PaletteStep[],
  greySteps: PaletteStep[],
): { variables: Record<string, string>; darkVariables: Record<string, string> } {
  const variables: Record<string, string> = {};
  const darkVariables: Record<string, string> = {};

  if (primarySteps.length > 0) {
    const { light, dark } = paletteVars('primary', primarySteps);
    Object.assign(variables, light);
    Object.assign(darkVariables, dark);
  }
  if (secondarySteps.length > 0) {
    const { light, dark } = paletteVars('secondary', secondarySteps);
    Object.assign(variables, light);
    Object.assign(darkVariables, dark);
  }
  if (greySteps.length > 0) {
    const { light, dark } = paletteVars('grey', greySteps);
    Object.assign(variables, light);
    Object.assign(darkVariables, dark);
  }

  return { variables, darkVariables };
}
