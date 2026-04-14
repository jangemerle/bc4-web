# Accordion — Component Spec

**Status:** Not started
**Figma node:** TBD
**Dependencies:** Icon (ChevronDown), cn(), motion tokens, usePress, useReducedMotion

---

## Overview

Collapsible sections for progressive disclosure. Reduces cognitive load by showing one (or multiple) sections at a time while maintaining an overview of all available sections.

---

## Architecture

Two components:

1. **Accordion** — Container managing state (single vs multiple open items)
2. **AccordionItem** — Individual collapsible section

State flows via React Context from Accordion to AccordionItem.

```tsx
<Accordion type="single" defaultValue="faq-1">
  <AccordionItem value="faq-1" title="What is Kvalt?">
    <p>A design system built from scratch...</p>
  </AccordionItem>
  <AccordionItem value="faq-2" title="How do I install it?">
    <p>Run npm install...</p>
  </AccordionItem>
</Accordion>
```

---

## Props API

### Accordion

```typescript
type AccordionType = 'single' | 'multiple';
type AccordionVariant = 'default' | 'flush';

interface AccordionProps {
  type: AccordionType;
  variant?: AccordionVariant;                    // default: 'default'
  defaultValue?: string | string[];              // uncontrolled
  value?: string | string[];                     // controlled
  onValueChange?: (value: string | string[]) => void;
  className?: string;
  children: React.ReactNode;
}
```

### AccordionItem

```typescript
interface AccordionItemProps {
  value: string;                                 // unique identifier
  title: string | React.ReactNode;
  icon?: LucideIcon;                             // optional leading icon (md)
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;                     // collapsible content
}
```

---

## Variants

### Default
- Border: `1px solid var(--color-border)` between items
- Border radius: `rounded-lg` (12px) on outer container
- Trigger padding: 16px horizontal, 12px vertical
- Content padding: 0 16px 16px 16px
- Trigger hover: `var(--color-surface-2)` background

### Flush
- No borders, no border radius
- Trigger padding: 12px horizontal, 10px vertical
- Content padding: 0 12px 12px 12px
- Trigger hover: `var(--color-surface-2)` background
- Minimal footprint for embedding in sidebars/panels

---

## Behavior

### Single mode (`type="single"`)
- Only one item open at any time
- Opening an item closes the currently open one
- Clicking an open item closes it (all collapsed state is valid)
- `onValueChange` receives a single string (or `''` when all closed)

### Multiple mode (`type="multiple"`)
- Any combination of items can be open simultaneously
- Each item toggles independently
- `onValueChange` receives a string array of open item values

### Controlled vs Uncontrolled
- **Uncontrolled**: use `defaultValue` — component manages state internally
- **Controlled**: use `value` + `onValueChange` — parent owns state

---

## Anatomy

### Trigger row
```
┌──────────────────────────────────────┐
│ [icon]  Title Text          [chevron] │  ← <button>
└──────────────────────────────────────┘
```

- Icon: optional, `md` (20px), `var(--color-on-surface-subtle-1)`
- Title: `text-md`, `font-semibold`, `var(--color-on-surface)`
- Chevron: `ChevronDown`, `md` (20px), rotates 0° → 180° when open
- Entire row is a `<button>` element
- `cursor-pointer` (default), `cursor-not-allowed` + `opacity-40` (disabled)

### Content area
- Any React content
- Clips during animation, `overflow-visible` when fully expanded
- Inherits text styles from parent

---

## Animation

### Content reveal — Motion layout animation
```typescript
// Do NOT animate height/width directly.
// Use Motion's layout animations on a wrapper div.
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={transition.expand}  // spring.default
      style={{ overflow: 'hidden' }}
    >
      <div className="content-padding">{children}</div>
    </motion.div>
  )}
</AnimatePresence>
```

### Chevron rotation
```typescript
<motion.div
  animate={{ rotate: isOpen ? 180 : 0 }}
  transition={spring.snappy}
>
  <Icon icon={ChevronDown} size="md" />
</motion.div>
```

### Trigger press feedback
```typescript
const { isPressed, pressHandlers } = usePress({ disabled });

<motion.button
  animate={{ scale: isPressed ? 0.98 : 1 }}
  transition={spring.snappy}
  {...pressHandlers}
>
```

### Stagger (multiple mode)
When multiple items change state simultaneously: 50ms stagger, top to bottom.

### Reduced motion
- Content: instant show/hide (no height animation), opacity only
- Chevron: instant rotation
- No press scale

---

## Accessibility

### ARIA
- Trigger: `<button>` with `aria-expanded="true|false"` and `aria-controls="content-{value}"`
- Content: `<div role="region" aria-labelledby="trigger-{value}" id="content-{value}">`
- Container: no special role needed (semantic grouping)

### Keyboard

| Key | Action |
|-----|--------|
| Enter / Space | Toggle focused trigger |
| ArrowDown | Move focus to next trigger |
| ArrowUp | Move focus to previous trigger |
| Home | Move focus to first trigger |
| End | Move focus to last trigger |

### Focus ring
`focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-primary-1)] focus-visible:outline-offset-2`

---

## Edge Cases

- **Dynamic items**: items can be added/removed; if an open item is removed, parent updates state
- **Nested accordions**: each manages independent state, keyboard nav scoped to nearest accordion
- **Empty content**: AccordionItem with no children — trigger still works, empty content area
- **All collapsed**: valid state in both single and multiple modes
- **Long title**: wraps to multiple lines, chevron stays right-aligned

---

## Showcase (App.tsx)

1. Single mode — open one, others close
2. Multiple mode — open several simultaneously
3. Default vs flush variants
4. With leading icons
5. Disabled item
6. Controlled mode (external state management)
7. Keyboard navigation demo (ArrowUp/Down, Home/End)
8. Nested accordion
9. Rich content inside (paragraphs, code, lists)
