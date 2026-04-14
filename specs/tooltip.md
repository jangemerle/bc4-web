# Tooltip — Component Spec

**Status:** In progress
**Figma node:** TBD
**Dependencies:** cn(), motion tokens, useReducedMotion, Button (rich actions)

---

## Overview

Contextual help that appears on hover/focus. Two types:
- **Plain** — brief label for unlabeled UI elements (icon buttons). Dark inverted surface, text only.
- **Rich** — longer explanation with optional title and up to 2 action buttons. Light surface, elevated.

---

## Props API

```typescript
interface TooltipAction {
  label: string;
  onClick: () => void;
}

interface TooltipProps {
  content: string;                              // plain text or rich description
  children: React.ReactNode;                    // trigger element
  rich?: boolean;                               // enables rich variant (light bg, structured content)
  title?: string;                               // rich only — optional subhead
  actions?: TooltipAction[];                     // rich only — max 2 text buttons
  persistent?: boolean;                          // rich only — click-triggered, stays until dismissed
  side?: 'top' | 'bottom' | 'left' | 'right';  // default: 'top'
  align?: 'start' | 'center' | 'end';          // default: 'center'
  delayOpen?: number;                           // default: 300 (ms)
  delayClose?: number;                          // default: 150 (ms)
  offset?: number;                              // default: 8 (px)
  disabled?: boolean;
  portal?: boolean;                             // default: true
  className?: string;
}
```

---

## Variants

### Plain (default)
- Background: `var(--color-inverted-surface)`
- Text: `var(--color-on-inverted-surface)`
- Max width: 240px
- Padding: 6px 8px
- Border radius: `rounded-s` (6px)
- Font: `text-sm`, `font-medium`
- No arrow, no border, no shadow

### Rich
- Background: `var(--color-surface-1)`
- Text: `var(--color-on-surface)`
- Title: `text-sm font-semibold`
- Description: `text-sm font-medium`, `var(--color-on-surface-subtle-1)`
- Actions: text buttons, `var(--color-primary-1)`
- Max width: 320px
- Padding: 12px 16px
- Border radius: `rounded-lg` (12px)
- Border: `1px solid var(--color-border)`
- Shadow: `medium-1`
- No arrow

---

## Animation

### Plain — enter
```typescript
initial: { opacity: 0, scale: 0.96 }
animate: { opacity: 1, scale: 1 }
transition: { duration: duration.instant, ease: ease.enter }
```

### Plain — exit
```typescript
exit: { opacity: 0, scale: 0.96 }
transition: { duration: duration.instant, ease: ease.exit }
```

### Rich — enter
```typescript
initial: { opacity: 0, scale: 0.96 }
animate: { opacity: 1, scale: 1 }
transition: transition.reveal  // spring.default + ease.enter fade
```

### Rich — exit
```typescript
exit: { opacity: 0, scale: 0.96 }
transition: transition.dismiss  // spring.snappy + ease.exit fade
```

### Transform origin
Matches `side` — e.g. `side="top"` → origin bottom center.

### Reduced motion
Opacity-only transition at `duration.fast`. No scale.

---

## Interaction

| Trigger | Show | Hide |
|---------|------|------|
| Mouse enter trigger (transient) | After 300ms delay | 150ms after mouse leave |
| Focus trigger (keyboard) | After 300ms delay | On blur |
| Click (persistent rich only) | Immediate | Click outside / Escape |
| — | — | Escape always dismisses |
| — | — | Scroll dismisses transient |

- Delay timers are cancelled if interaction reverses before firing
- Cursor can move onto tooltip without dismissing (WCAG 1.4.13 hoverable)
- Only one tooltip visible at a time (global singleton)
- No tooltip on touch-only devices (no hover)

---

## Accessibility

- `role="tooltip"` on content
- `aria-describedby={tooltipId}` on trigger element
- Unique `id` on tooltip content
- Tooltip content announced as description of trigger
- Escape dismisses tooltip
- Focus stays on trigger (plain) or can move into tooltip (rich with actions)
- Never use tooltip for essential information

---

## Positioning

- Manual positioning with viewport collision detection
- 8px offset from trigger (default)
- 16px viewport boundary margin
- Auto-flip to opposite side if insufficient space
- Portal to `document.body` by default (avoids overflow:hidden clipping)

---

## Edge Cases

- Long text wraps at max-width
- Trigger unmounts while tooltip visible → cleanup gracefully
- Multiple tooltips: only one visible at a time
- Disabled prop: no events bound, tooltip never shows
- Rich tooltip with no title: just description + optional actions
- Rich tooltip with no actions: just title + description
