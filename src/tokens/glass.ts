/**
 * Design System — Glass Surface Tokens
 *
 * Three-step scale for backdrop-blur "glass" surfaces. Pair a semi-opaque
 * background with a blur — the opacity does the legibility work, the blur
 * is flavour.
 *
 * Performance rules (read before using on large surfaces):
 * - Cost of backdrop-filter scales with blurred area × blur radius.
 *   Full-viewport strong glass on low-end hardware drops frames.
 * - Keep radius ≤ 12px for large areas, 16–24px only for small islands.
 * - Never animate backdrop-filter values — fade opacity of the layer instead.
 * - Set will-change: backdrop-filter only while animating, clear afterwards.
 * - Avoid stacking glass-on-glass (two backdrop filters force extra passes).
 *
 * Usage:
 *   <GlassSurface variant="default">…</GlassSurface>
 *   <GlassSurface variant="default" tint="var(--color-surface-2)">…</GlassSurface>
 */

export type GlassVariant = 'subtle' | 'default' | 'strong';

export interface GlassToken {
  /** Opacity of the tint (0–1) mixed with transparent via color-mix. */
  opacity: number;
  /** backdrop-filter value, e.g. 'blur(12px)'. */
  blur: string;
}

export const glass: Record<GlassVariant, GlassToken> = {
  subtle:  { opacity: 0.6, blur: 'blur(6px)'  },
  default: { opacity: 0.7, blur: 'blur(12px)' },
  strong:  { opacity: 0.8, blur: 'blur(20px)' },
} as const;

/**
 * Build a color-mix background string for a glass surface.
 * @param tint CSS color (defaults to var(--color-bg))
 * @param opacity 0–1
 */
export function glassBackground(tint: string, opacity: number): string {
  return `color-mix(in srgb, ${tint} ${Math.round(opacity * 100)}%, transparent)`;
}
