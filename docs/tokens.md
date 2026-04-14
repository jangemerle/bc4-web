# Kvalt — Design Tokens Reference

All tokens are defined in `src/tokens/` (TypeScript) and `src/styles/tokens.css` (CSS variables). Components must use these tokens exclusively — never hardcode values.


## Colors

### Palettes (HSLUV-based)
6 palettes, each with 12 shades: 50, 100, 200, 300, 400, 500, 600, 700, 750, 800, 850, 900.

| Palette | Hue | Usage |
|---------|-----|-------|
| Primary | Green | Brand, CTAs, success-adjacent |
| Secondary | Blue | Links, selections, hover fills |
| Grey | Neutral | Surfaces, borders, subtle text |
| Success | Green | Confirmations, positive states |
| Warning | Orange | Caution, attention needed |
| Danger | Red | Errors, destructive actions |

### Semantic Tokens (CSS variables)
Defined in `src/styles/tokens.css` with light (`:root`) and dark (`.dark`) values.

**Surfaces:**
- `--color-bg` — page background
- `--color-surface-1` through `--color-surface-7` — layered surface hierarchy
- `--color-on-surface` — primary text on surfaces
- `--color-on-surface-subtle-1` — secondary text
- `--color-on-surface-subtle-2` — tertiary/muted text

**Primary (green):**
- `--color-primary-1` — default, `--color-primary-2` — hover, `--color-primary-3` — active
- `--color-on-primary` — text on primary backgrounds

**Secondary (blue):**
- `--color-secondary-1` — default, `--color-secondary-2` — hover
- `--color-on-secondary-1` — text/links, `--color-on-secondary-2` — hover text

**Status colors (success, warning, danger):**
Each has: `-1` (default), `-2` (hover), `-3` (active), `on-*` (text on fill), `-secondary-1` (subtle bg), `-secondary-2` (subtle hover), `on-secondary` (text on subtle)

**Borders:**
- `--color-border` — default borders
- `--color-border-strong` — emphasized borders

**Inverted:**
- `--color-inverted-surface` — dark background (overlays, tooltips)
- `--color-on-inverted-surface` — light text on dark

### Usage in Components
```tsx
// Tailwind classes (preferred)
className="bg-[var(--color-surface-1)] text-[var(--color-on-surface)]"

// Inline styles (when dynamic)
style={{ color: 'var(--color-danger-1)' }}

// In JS (charts, canvas)
import { palette } from '../tokens/colors';
```


## Typography

### Font Families
- **Inter** (`font-sans`) — body text, UI. Weights: 500 (medium), 600 (semibold), 700 (bold)
- **Borna** (`font-display`) — headlines. Local OTF. Weights: 500, 700

### Headline Scale (Borna, line-height 1.2)
| Token | Size | Tailwind class |
|-------|------|---------------|
| 2xl | 42px | `text-headline-2xl` |
| xl | 36px | `text-headline-xl` |
| l | 28px | `text-headline-l` |
| m | 24px | `text-headline-m` |
| s | 20px | `text-headline-s` |

### Body Scale (Inter, line-height 1.5)
| Token | Size | Letter-spacing | Tailwind class |
|-------|------|---------------|---------------|
| xl | 18px | 0 | `text-xl` |
| l | 16px | 0.16px | `text-lg` / `text-base` |
| m | 14px | 0.14px | `text-md` |
| s | 12px | 0.48px | `text-sm` |
| xs | 10px | 0.4px | `text-xs` |
| 2xs | 8px | 0.32px | `text-2xs` |


## Spacing

4px base unit. Scale defined in Tailwind config.

| Token | Value | Tailwind |
|-------|-------|---------|
| 0 | 0px | `p-0` |
| 1 | 4px | `p-1` |
| 2 | 8px | `p-2` |
| 3 | 12px | `p-3` |
| 4 | 16px | `p-4` |
| 5 | 20px | `p-5` |
| 6 | 24px | `p-6` |
| 7 | 28px | `p-7` |
| 8 | 32px | `p-8` |
| 10 | 40px | `p-10` |
| 12 | 48px | `p-12` |
| 14 | 56px | `p-14` |
| 16 | 64px | `p-16` |
| 20 | 80px | `p-20` |
| 24 | 96px | `p-24` |


## Border Radius

| Token | Value | Usage | Tailwind |
|-------|-------|-------|---------|
| s | 6px | Tags, badges, small controls | `rounded-s` |
| m | 8px | Inputs, buttons, chips | `rounded-m` |
| lg | 12px | Cards, modals, panels | `rounded-lg` |
| xl | 9999px | Pill / fully rounded | `rounded-xl` |

**Never use**: `rounded-2xl`, `rounded-3xl`, `rounded-full` (unless mapping to `rounded-xl`).


## Shadows

3 sizes × 3 intensities = 9 tokens. All use pure black with varying opacity.

| Token | Offset | Blur | Opacity | Tailwind |
|-------|--------|------|---------|---------|
| small-1 | 0, 1px | 4px | 8% | `shadow-small-1` |
| small-2 | 0, 1px | 4px | 16% | `shadow-small-2` |
| small-3 | 0, 1px | 4px | 32% | `shadow-small-3` |
| medium-1 | 0, 10px | 20px | 8% | `shadow-medium-1` |
| medium-2 | 0, 10px | 20px | 16% | `shadow-medium-2` |
| medium-3 | 0, 10px | 20px | 32% | `shadow-medium-3` |
| large-1 | 0, 20px | 40px | 8% | `shadow-large-1` |
| large-2 | 0, 20px | 40px | 16% | `shadow-large-2` |
| large-3 | 0, 20px | 40px | 32% | `shadow-large-3` |


## Icons

Source: Lucide React (mapped from Untitled UI Figma icons). Always use the `<Icon>` component.

| Size | Pixels | Usage |
|------|--------|-------|
| sm | 16px | Inline with small text |
| md | 20px | Default in most UI |
| lg | 24px | Standalone, Figma native |
| xl | 32px | Feature / empty state |

Rules: `strokeWidth` always 2. Color always `currentColor` (set via parent). For custom sizes, use `sizePx` prop.


## Motion

All timing defined in `src/tokens/motion.ts`. The `MOTION_SPEED` constant (default: 1) scales everything globally.

### Durations (seconds)
| Token | Value | Usage |
|-------|-------|-------|
| instant | 0.1 (100ms) | Button press, checkbox, color change |
| fast | 0.16 (160ms) | Hover, focus ring, tooltip |
| base | 0.24 (240ms) | Dropdown, popover, tab switch |
| moderate | 0.34 (340ms) | Panel, accordion, sidebar, modal |
| slow | 0.48 (480ms) | Page transitions |

### Easings (cubic-bezier)
| Token | Value | Usage |
|-------|-------|-------|
| enter | [0, 0, 0.2, 1] | Things arriving, fading in |
| exit | [0.4, 0, 1, 1] | Things leaving, dissolving |
| standard | [0.4, 0, 0.2, 1] | State changes (color, border) |
| stroke | [0.65, 0, 0.35, 1] | Checkbox/radio path draw |

### Springs (Motion visualDuration + bounce)
| Token | visualDuration | bounce | Usage |
|-------|---------------|--------|-------|
| snappy | 0.15 | 0 | Press feedback, dropdowns, focus |
| default | 0.3 | 0.1 | Panels, modals, cards, tab indicators |
| playful | 0.4 | 0.25 | Success states, toasts, celebrations |

### Semantic Transitions (pre-composed)
| Token | Composition | Usage |
|-------|------------|-------|
| feedback | spring.snappy | Button press, checkbox, toggle |
| reveal | spring.default + ease.enter fade | Dropdown, popover, tooltip appearing |
| dismiss | spring.snappy + ease.exit fade | Closing, removing, hiding |
| expand | spring.default | Accordion, drawer, sidebar |
| navigate | visualDuration 0.48, bounce 0.1 | Page transitions, route changes |
| celebrate | spring.playful + ease.enter fade | Success, achievement, completion |
