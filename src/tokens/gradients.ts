/**
 * Design System — Gradient Tokens
 * Source of truth: tokens.css → --gradient-*, --color-ai-*
 *
 * AI gradient: lavender → peach diagonal.
 * Used to highlight AI-powered features throughout the app:
 * backgrounds, card tints, borders, badges, text shimmer.
 *
 * 4 variants by intensity:
 *   subtle  — card backgrounds, row highlights (12% opacity)
 *   default — section backgrounds, hero areas (full color)
 *   vivid   — badges, CTAs, active states (saturated)
 *   border  — 1px gradient borders (50% opacity)
 *
 * Characters can override --color-ai-from / --color-ai-to
 * to shift the entire gradient to their mood.
 *
 * For CSS: use var(--gradient-ai) etc.
 * For JS (Motion background): import `gradients` and use directly.
 */

export const gradients = {
  /** Full AI gradient — backgrounds, hero sections */
  'ai':        'var(--gradient-ai)',
  /** Subtle tint — card backgrounds, row highlights */
  'ai-subtle': 'var(--gradient-ai-subtle)',
  /** Saturated — badges, CTAs, active states */
  'ai-vivid':  'var(--gradient-ai-vivid)',
  /** Border gradient — for background-clip border trick */
  'ai-border': 'var(--gradient-ai-border)',
} as const;

/** Individual stop colors — for custom compositions */
export const aiStops = {
  from: 'var(--color-ai-from)',
  to:   'var(--color-ai-to)',
} as const;

export type GradientKey = keyof typeof gradients;
