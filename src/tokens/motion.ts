/**
 * Design System — Motion Tokens
 * Powered by motion.dev
 *
 * Single source of truth for all animation timing in the design system.
 * Every component imports from here — no hardcoded springs, durations, or easings.
 *
 * Adjust MOTION_SPEED to globally scale all animation durations:
 *   1   = normal (default)
 *   0.5 = 2× faster (snappier)
 *   2   = 2× slower (more dramatic)
 */

// ─── Global speed multiplier ────────────────────────────────────────────────
// Change this single value to scale ALL animation timing across the DS.
export const MOTION_SPEED = 1;

/** Apply speed multiplier to a duration in seconds. */
const d = (seconds: number) => seconds * MOTION_SPEED;

// ─── Duration (seconds) ─────────────────────────────────────────────────────

export const duration = {
  /** 100 ms — Micro-feedback: button press, checkbox, color change */
  instant: d(0.1),
  /** 160 ms — Small state changes: hover, focus ring, tooltip */
  fast: d(0.16),
  /** 240 ms — Standard transitions: dropdown, popover, tab switch */
  base: d(0.24),
  /** 340 ms — Panel reveals, accordion, sidebar, modal */
  moderate: d(0.34),
  /** 480 ms — Page-level transitions, large layout shifts */
  slow: d(0.48),
} as const;

// ─── Easing (cubic-bezier arrays) ───────────────────────────────────────────

export const ease = {
  /** Decelerate — elements arriving, fading in, filling */
  enter: [0, 0, 0.2, 1] as const,
  /** Accelerate — elements leaving, dissolving */
  exit: [0.4, 0, 1, 1] as const,
  /** Standard — persistent elements changing state (color, border) */
  standard: [0.4, 0, 0.2, 1] as const,
  /** Stroke draw — checkbox / radio path animations */
  stroke: [0.65, 0, 0.35, 1] as const,
} as const;

/** Convert an easing tuple to a CSS `cubic-bezier()` string for use in `style` transitions. */
export const cssEase = (e: readonly [number, number, number, number]) =>
  `cubic-bezier(${e.join(',')})`;

// ─── Springs (Motion visualDuration + bounce) ───────────────────────────────
// visualDuration is also scaled by MOTION_SPEED so spring feel stays in sync.

export const spring = {
  /** No overshoot. Crisp. For dropdowns, tooltips, focus states, press feedback. */
  snappy: { type: 'spring' as const, visualDuration: d(0.15), bounce: 0 },
  /** Hint of life. For panels, modals, sidebars, cards, tab indicators. */
  default: { type: 'spring' as const, visualDuration: d(0.3), bounce: 0.1 },
  /** Visible overshoot. For success states, toasts, celebrations. */
  playful: { type: 'spring' as const, visualDuration: d(0.4), bounce: 0.25 },
} as const;

// ─── Semantic tokens (pre-composed transitions) ─────────────────────────────
// Pick the intent, get the right motion. Components should prefer these.

export const transition = {
  /** Button press, checkbox, toggle — instant + snappy spring */
  feedback: spring.snappy,

  /** Tooltip, popover, dropdown appearing — base ease.enter + default spring */
  reveal: {
    ...spring.default,
    opacity: { duration: duration.base, ease: ease.enter },
  },

  /** Closing, removing, hiding — fast ease.exit + snappy spring */
  dismiss: {
    ...spring.snappy,
    opacity: { duration: duration.fast, ease: ease.exit },
  },

  /** Accordion, drawer, sidebar — moderate + default spring */
  expand: spring.default,

  /** Page transitions, route changes — largest, slowest motion */
  navigate: { type: 'spring' as const, visualDuration: d(0.48), bounce: 0.1 },

  /** Success, achievement, completion — moderate + playful spring */
  celebrate: {
    ...spring.playful,
    opacity: { duration: duration.base, ease: ease.enter },
  },
} as const;
