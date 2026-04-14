# Kvalt — Coding Conventions

Non-negotiable rules for all code in this project. Also summarized in `CLAUDE.md` at the project root.


## Token-Only Development

Every component must use DS tokens exclusively. No hardcoded timing, shadows, border radii, icon sizes, or colors.

### Colors
- Use CSS variable-based semantic tokens: `var(--color-*)` via Tailwind or inline styles
- Never use hex codes, `rgb()`, `hsl()`, or direct palette shade references
- Dark mode works automatically when semantic tokens are used

### Border Radius
Only 4 values: `rounded-s` (6px), `rounded-m` (8px), `rounded-lg` (12px), `rounded-xl` (pill)
Never: `rounded-2xl`, `rounded-3xl`, arbitrary `rounded-[Xpx]`

**Exception:** `rounded-full` is acceptable for inherently circular UI elements: radio button dots (RadioButton), toggle thumbs and tracks (Toggle), avatar circles, color swatches, slider thumbs, and small indicator dots. These elements are geometrically round — a token radius would distort them. This exception does NOT apply to buttons, cards, chips, or other elements that should use the token scale.

### Shadows
Only DS tokens: `shadow-small-1` through `shadow-large-3`
Never: arbitrary `boxShadow` values

### Motion
All timing from `src/tokens/motion.ts`: `spring.*`, `duration.*`, `ease.*`, `transition.*`
Never: inline spring configs, hardcoded duration numbers, or easing arrays
Derive computed values from tokens: `duration.instant * 0.3` not `0.03`

### Spacing
All layout gaps and margins from `src/tokens/spacing.ts`. Never use arbitrary `gap-*`, `mb-*`, or `mt-*` classes.

```tsx
import { gap, mb } from '../tokens/spacing';

// Card grids (hub pages, component showcases)
<div className={`grid grid-cols-3 ${gap.card}`}>   // gap-10 = 40px

// Form field stacks, related item groups
<div className={`flex flex-col ${gap.cozy}`}>       // gap-4 = 16px

// Tight inline groups (radio options, tags, icon+label)
<div className={`flex ${gap.tight}`}>               // gap-2 = 8px

// Between major page sections
<div className={`flex flex-col ${gap.section}`}>    // gap-16 = 64px
```

| Token | Tailwind | Pixels | When to use |
|-------|----------|--------|-------------|
| `gap.tight` | `gap-2` | 8px | Radio options, checkbox list, tag rows, icon+label |
| `gap.cozy` | `gap-4` | 16px | Form fields, compact card groups |
| `gap.card` | `gap-10` | 40px | Hub page grids, component showcase grids |
| `gap.section` | `gap-16` | 64px | Between major page sections |
| `mb.hero` | `mb-12` | 48px | PageHero bottom margin |
| `mb.page` | `mb-24` | 96px | Section bottom margin on hub/foundation pages |


## Press Animations — usePress Hook

**Always use `usePress` instead of `whileTap`.**

`whileTap` exits within ~10-50ms on Apple Magic Trackpad — too fast to see. The `usePress` hook guarantees `isPressed` stays `true` for at least 120ms.

```tsx
import { usePress } from '../hooks/usePress';

const { isPressed, pressHandlers } = usePress({ disabled });

<motion.button
  animate={{ scale: isPressed ? 0.97 : 1 }}
  transition={spring.snappy}
  {...pressHandlers}
/>
```

Use on: buttons, form controls with visual indicators, clickable cards, tiles, any `motion.*` element that needs press feedback.


## Reduced Motion — useReducedMotion Hook

Every component with spatial animation must use `useReducedMotion`:

```tsx
const reducedMotion = useReducedMotion();
const pressScale = reducedMotion ? 1 : isPressed ? 0.97 : 1;
```

Under reduced motion: opacity-only fades (under 200ms), no springs, no scale, no translate.


## Icon Component

Always use `<Icon>` with size tokens. Never use raw Lucide icons with arbitrary sizes.

```tsx
<Icon icon={AlertCircle} size="md" />           // 20px
<Icon icon={AlertCircle} sizePx={18} />          // custom
```

- `strokeWidth` defaults to 2 — don't override
- Color is always `currentColor` — set via parent element, not `style={{ color }}`


## Class Names — cn() Utility

Use `cn()` (clsx + tailwind-merge) for all dynamic class composition:

```tsx
import { cn } from '../lib/cn';

className={cn(
  'base-classes',
  condition && 'conditional-classes',
  className, // consumer overrides last
)}
```


## Component File Structure

Every component follows this pattern:

```tsx
/**
 * Design System — ComponentName
 * Source: Figma / Topic Board New / node XXXX:XXXXX
 *
 * Variants:  ...
 * Sizes:     ...
 * States:    ...
 *
 * Usage:
 *   <Component>...</Component>
 */

import { motion } from 'motion/react';
import { cn } from '../lib/cn';
import { spring, ease, duration } from '../tokens/motion';
import { usePress } from '../hooks/usePress';
import { useReducedMotion } from '../hooks/useReducedMotion';

// ─── Public types ──────────────────────────────────────
export type ComponentVariant = '...' | '...';
export interface ComponentProps { ... }

// ─── Variant styles (static for Tailwind JIT) ──────────
const variantClasses: Record<ComponentVariant, string> = { ... };

// ─── Animation constants ───────────────────────────────
const panelVariants = { hidden: { ... }, visible: { ... } };

// ─── Component ─────────────────────────────────────────
export function ComponentName({ ... }: ComponentProps) { ... }
```


## Variant by Background — Button and ContentSwitcher

Always pick the variant based on the surface the component sits on:

**Button:**

| Background | Variant |
|------------|---------|
| `surface-1` (white) | `secondary` |
| `surface-2` and above, `bg`, any tinted/grey surface | `elevated` |

**ContentSwitcher:**

| Background | Variant |
|------------|---------|
| `surface-1` (white) | `default` — border, no shadow |
| `surface-2` and above, `bg`, any tinted/grey surface | `elevated` — no border, surface-1 bg + shadow |

The `elevated` variant adds a shadow that lifts it off coloured backgrounds and removes the border (the shadow provides separation). This rule applies everywhere: doc pages, playground control panels, app screens.

```tsx
{/* Card with surface-2 background */}
<Button variant="elevated" size="sm">Play</Button>

{/* Modal or white panel */}
<Button variant="secondary">Cancel</Button>
```


## Styleguide Pages — Use DS Components

When editing any page in `src/pages/`, always use Kvalt DS components instead of raw HTML. `<Button>` not `<button>`, `<Icon>` not raw Lucide, etc. The styleguide is a live dogfooding test.


## Showcase Requirement

Every new component must be added to `App.tsx` with: all variants, all sizes, all interactive states, and a specs section showing the visual anatomy.


## Focus Rings

Every interactive element must have a visible focus indicator:
```
outline-none focus-visible:outline focus-visible:outline-2
focus-visible:outline-[var(--color-primary-1)] focus-visible:outline-offset-2
```
