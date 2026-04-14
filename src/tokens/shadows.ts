/**
 * Design System — Shadow Tokens
 * Source of truth: tokens.css → --shadow-* CSS custom properties
 *
 * 3 sizes × 3 intensities = 9 tokens (default, downward-facing)
 * + 9 upward-facing variants (-up suffix) for bottom-anchored surfaces
 *   e.g. fixed bottom bars, bottom sheets, docked toolbars
 *
 * Light mode: standard black drop shadows (8%, 16%, 32% opacity)
 * Dark mode:  boosted opacity (24%, 48%, 70%)
 *
 * Values are CSS var() references — the browser resolves them live,
 * so theme switching works instantly without re-render or cache issues.
 *
 * For Tailwind — use utility classes: shadow-small-1 | shadow-large-2-up
 * For JS (Motion boxShadow) — import `shadows` and use directly.
 */

export const shadows = {
  'small-1':  'var(--shadow-small-1)',
  'small-2':  'var(--shadow-small-2)',
  'small-3':  'var(--shadow-small-3)',
  'medium-1': 'var(--shadow-medium-1)',
  'medium-2': 'var(--shadow-medium-2)',
  'medium-3': 'var(--shadow-medium-3)',
  'large-1':  'var(--shadow-large-1)',
  'large-2':  'var(--shadow-large-2)',
  'large-3':  'var(--shadow-large-3)',
  // Upward-facing — for bottom-anchored surfaces (fixed bars, bottom sheets)
  'small-1-up':  'var(--shadow-small-1-up)',
  'small-2-up':  'var(--shadow-small-2-up)',
  'small-3-up':  'var(--shadow-small-3-up)',
  'medium-1-up': 'var(--shadow-medium-1-up)',
  'medium-2-up': 'var(--shadow-medium-2-up)',
  'medium-3-up': 'var(--shadow-medium-3-up)',
  'large-1-up':  'var(--shadow-large-1-up)',
  'large-2-up':  'var(--shadow-large-2-up)',
  'large-3-up':  'var(--shadow-large-3-up)',
} as const;

export type ShadowKey = keyof typeof shadows;
