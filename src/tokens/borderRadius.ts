/**
 * Design System — Border Radius Tokens
 * Source of truth: Figma / Topic Board New / Border Radius
 *
 * 5 semantic steps:
 *   radius-s   →  6px    small controls, tags, badges
 *   radius-m   →  8px    inputs, buttons, chips
 *   radius-lg  →  12px   cards, modals, panels
 *   radius-2xl →  20px   large containers, modals, hero sections
 *   radius-xl  →  pill   fully rounded / avatar / badge dot
 *
 * For Tailwind — use utility classes: rounded-s | rounded-m | rounded-lg | rounded-2xl | rounded-xl
 * For JS (canvas / chart) — import and use these values directly.
 */

export const borderRadius = {
  's':   '6px',    // radius-s
  'm':   '8px',    // radius-m
  'lg':  '12px',   // radius-lg
  '2xl': '20px',   // radius-2xl — large containers, modals
  'xl':  '9999px', // radius-xl (pill)
} as const;

export type BorderRadiusKey = keyof typeof borderRadius;
