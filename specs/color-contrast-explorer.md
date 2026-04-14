# Color Contrast Explorer — Component Spec

## What it is

An interactive color palette visualization for the Colors documentation page. When a user hovers on any shade in a palette, shades that would fail WCAG AA contrast (4.5:1) when paired with the hovered shade are dimmed to 50% opacity. Shades that pass stay fully visible, making valid contrast pairings immediately discoverable.

Start with the **primary palette only** as a dedicated section. The component should be built generically so it can be reused for other palettes later.

## Visual design

Reference: A horizontal strip of all shades in the palette, from 900 (darkest, left) to 50 (lightest, right). Each swatch shows:
- The shade number (e.g. "900", "850", "800"...)
- The hex value below it
- A small dot indicator: white dot on dark shades (where white text would be used), black dot on light shades (where dark text would be used)

### Layout
- Full-width horizontal strip, all shades equal width
- Swatch height: ~120px minimum (generous, visual)
- Shade label and hex below each swatch
- Palette name as a heading above

### Hover behavior
1. **Default state**: All swatches at full opacity
2. **Hover on a swatch**:
   - The hovered swatch gets a subtle ring/outline to indicate selection
   - Swatches that meet ≥4.5:1 contrast ratio against the hovered color stay at full opacity
   - Swatches that fail <4.5:1 contrast drop to 50% opacity
   - Transition the opacity change smoothly (use `duration.fast` / 160ms with `ease.standard`)
3. **Hover off**: All swatches return to full opacity

### Optional enhancement
When a shade is hovered, show the actual contrast ratio as a small label on each passing swatch (e.g. "7.2:1"). This makes the section educational, not just a yes/no filter.

## Contrast ratio calculation

Implement the WCAG 2.x relative luminance formula:

```typescript
/**
 * Calculate relative luminance of a hex color.
 * Formula: https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */
function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex); // parse "#RRGGBB" → [r, g, b] as 0–255
  const [r, g, b] = rgb.map(c => {
    const sRGB = c / 255;
    return sRGB <= 0.03928
      ? sRGB / 12.92
      : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two colors.
 * Returns a value ≥ 1. WCAG AA requires ≥ 4.5 for normal text.
 */
function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}
```

Place these utility functions in `src/lib/contrast.ts` so they're reusable (the Accessibility page's contrast table could use them too).

## Component API

```typescript
interface ContrastExplorerProps {
  /** Palette name displayed as heading */
  name: string;
  /** Ordered shades from darkest to lightest */
  shades: Array<{
    label: string;    // "900", "850", etc.
    hex: string;      // "#09190B"
  }>;
  /** Minimum contrast ratio to consider "passing". Default 4.5 (WCAG AA) */
  threshold?: number;
}
```

### Usage

```tsx
import { palette } from '../tokens/colors';

// Convert palette object to the shades array format
const primaryShades = [
  { label: '900', hex: palette.primary[900] },
  { label: '850', hex: palette.primary[850] },
  { label: '800', hex: palette.primary[800] },
  { label: '750', hex: palette.primary[750] },
  { label: '700', hex: palette.primary[700] },
  { label: '600', hex: palette.primary[600] },
  { label: '500', hex: palette.primary[500] },
  { label: '400', hex: palette.primary[400] },
  { label: '300', hex: palette.primary[300] },
  { label: '200', hex: palette.primary[200] },
  { label: '100', hex: palette.primary[100] },
  { label: '50',  hex: palette.primary[50]  },
];

<ContrastExplorer name="Primary" shades={primaryShades} />
```

## Implementation rules

1. **Use motion tokens** for the opacity transition: `duration.fast` (160ms) with `ease.standard`
2. **Use `useReducedMotion`** — if reduced motion is preferred, skip the opacity animation and instead use a visual indicator (e.g. a strikethrough or X overlay on failing shades)
3. **Semantic colors only** for UI chrome (the heading, labels). The swatch colors themselves are raw palette values displayed as-is
4. **Text color on swatches**: Determine automatically — if luminance > 0.5, use dark text; if ≤ 0.5, use light text. This replaces the dot indicator from the reference image with actual readable labels
5. **Responsive**: On narrow viewports, the strip should wrap to 2 rows (6+6) or stack vertically. Use CSS grid with `auto-fill`
6. **No new dependencies** — pure React + the contrast utility functions
7. **Accessible**: The hover behavior is visual enhancement only. All shade info (label, hex) is visible in default state. Add `aria-label` on each swatch describing the color

## File location

```
src/lib/contrast.ts              ← getLuminance, getContrastRatio, hexToRgb
src/components/ContrastExplorer.tsx  ← the interactive component
```

## Where it appears

On the Colors documentation page, as a new section titled **"Contrast Pairings"** between the raw palette display and the semantic tokens section. Introduction text:

> "Hover over any shade to see which other shades in the palette meet WCAG AA contrast ratio (4.5:1) for text. Dimmed shades would fail contrast when paired with the selected shade."

Start with primary palette only. The component is generic enough to add all six palettes later by simply rendering multiple `<ContrastExplorer>` instances.
