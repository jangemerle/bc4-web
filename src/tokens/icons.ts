/**
 * Design System — Icon Tokens
 * Source: Untitled UI Icons (Figma) — mapped to lucide-react
 *
 * All icons are 24×24 in Figma (the base grid).
 * Four size variants are provided to pair with text scales:
 *
 *   sm  → 16px  — pairs with body-s / body-xs (inline text icons)
 *   md  → 20px  — pairs with body-l / headline-s
 *   lg  → 24px  — default standalone icon size (Figma native size)
 *   xl  → 32px  — large feature icons
 *
 * Color: icons always use `currentColor` — set color on the parent element.
 *
 * For Tailwind — use the <Icon> component with size prop.
 * For JS — import `iconSize` and use the pixel values directly.
 */

export const iconSize = {
  sm: 16,  // inline with small text
  md: 20,  // default in most UI contexts
  lg: 24,  // Figma native grid size
  xl: 32,  // feature / empty state icons
} as const;

export type IconSize = keyof typeof iconSize;
