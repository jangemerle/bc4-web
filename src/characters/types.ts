/**
 * Character System — Type Definitions
 *
 * A character is an opinionated design configuration that transforms
 * the entire UI by overriding CSS custom properties and motion tokens.
 */

export interface CharacterManifest {
  name: string;
  displayName: string;
  version: string;
  description: string;
  personality: string;
  author?: string;
  license?: string;
  tags?: string[];
  preview?: {
    primaryColor: string;
    accentColor?: string;
    backgroundColor: string;
    textColor: string;
    radius?: string;
  };
}

/**
 * A loaded character: manifest + the actual CSS variable overrides.
 * The `variables` object maps CSS property names to values,
 * e.g., { '--color-primary-1': '#4F46E5', '--radius-m': '4px' }
 *
 * `darkVariables` contains overrides applied under `.dark { }` — surface and
 * text tokens that need to be inverted in dark mode. Non-surface tokens
 * (primary, radius, fonts, shadows) are not included here since they stay the
 * same in both modes.
 */
export interface Character {
  manifest: CharacterManifest;
  variables: Record<string, string>;
  darkVariables?: Record<string, string>;
}

/**
 * Minimal seed definition for a derived character.
 *
 * Instead of specifying ~53 CSS variable values by hand, you provide a handful
 * of design decisions and `deriveCharacter()` computes the full token set.
 */
export interface CharacterSeed {
  // ── Identity ────────────────────────────────────────────────────────────────
  name: string;
  displayName: string;
  version?: string;
  description: string;
  personality: string;
  author?: string;
  tags?: string[];

  // ── Color ───────────────────────────────────────────────────────────────────
  /** Hue angle (0–360) for the primary brand color. */
  primaryHue: number;
  /** Saturation level for the primary palette. */
  primaryChroma: 'Vivid' | 'Balanced' | 'Muted' | 'Pastel';
  /**
   * Which step in the 12-step primary palette becomes primary-1 (0–9).
   * DEFAULT_LIGHTNESS[7] ≈ 0.534 works well for most action colors (buttons, links).
   * Use lower indices for lighter primaries, higher for dark editorial primaries.
   * @default 7
   */
  primaryStep?: number;

  /** Hue for surface/background tints. Defaults to primaryHue. */
  surfaceHue?: number;
  /**
   * Chroma percentage (0–1) applied to surface palette relative to gamut max.
   * 0 = achromatic surfaces (pure grey). 0.12 = subtle tint.
   * @default 0.12
   */
  surfaceChromaPercent?: number;

  // ── Layout ──────────────────────────────────────────────────────────────────
  radius: { s: string; m: string; lg: string; xl: string };
  /**
   * Optional 2xl radius — for large cards and hero containers.
   * Defaults to `radius.lg` if not set.
   */
  radius2xl?: string;
  /**
   * Gap between cards/grid cells in dashboard layouts.
   * Maps to `--layout-gap`. Default 24px.
   */
  layoutGap?: string;

  // ── Typography ──────────────────────────────────────────────────────────────
  fonts: { display: string; body: string; brand: string };

  // ── Background pattern ──────────────────────────────────────────────────────
  /**
   * Optional repeating background pattern applied site-wide via `--bg-pattern`
   * + `--bg-pattern-size`. The body reads these, so any character can paint
   * a dot grid, lines, or crosshatch behind all content. Components can also
   * opt in via `<GridBackground>` which reads the same variables.
   *
   * `image` is any valid CSS `background-image` value (radial-gradient, url,
   * linear-gradient). `size` is a valid `background-size` value.
   * Leave undefined for a flat bg.
   */
  backgroundPattern?: { image: string; size: string };

  // ── Optional overrides ──────────────────────────────────────────────────────
  /** Use primary-1 as the hero/page title color (vs. default on-surface). */
  heroTitleIsAccent?: boolean;
  /**
   * Override the auto-derived on-primary color.
   * By default: white if primary-1 L < 0.55, else on-surface.
   * Use this when a deliberate aesthetic choice differs from the WCAG-optimal value.
   */
  onPrimaryOverride?: 'white' | 'dark';
  /**
   * Shadow tint as "R,G,B" string, e.g. "124,58,237" for violet.
   * Defaults to a neutral dark derived from on-surface.
   */
  shadowRgb?: string;
  /** Override the hues for semantic palettes (success / warning / danger). */
  semanticOverrides?: {
    successHue?: number; // default 145 (green)
    warningHue?: number; // default 50  (amber)
    dangerHue?: number;  // default 25  (red)
  };
}

/**
 * Character context value provided by CharacterProvider.
 */
export interface CharacterContextValue {
  /** Currently active character */
  current: Character;
  /** All available characters (static registry + runtime-added) */
  characters: Character[];
  /** Switch to a different character by name */
  setCharacter: (name: string) => void;
  /** Register a new character at runtime — e.g. from the Character Builder.
   *  If a character with the same name already exists, it's replaced. */
  addCharacter: (character: Character) => void;
  /** Revert a character to its original shipped values (removes runtime overrides). */
  resetCharacter: (name: string) => void;
}
