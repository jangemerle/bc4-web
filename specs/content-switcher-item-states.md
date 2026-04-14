# ContentSwitcherItem -- State Design

## Pattern Analysis (from existing components)

Before designing states, here is a summary of the patterns extracted from Button, Toggle, RadioButton, Chip, and Tabs -- the five interactive components that inform this design.

### Hooks used across the DS

| Hook | Components | Purpose |
|------|-----------|---------|
| `usePress` | Button, Toggle, RadioButton, ContentSwitcher | Guarantees 120ms minimum press hold for visible feedback |
| `useReducedMotion` | Button, Toggle, RadioButton, ContentSwitcher, Tabs | Disables scale/spring, keeps opacity-only fades under 200ms |
| `useState` (hover) | Toggle | Manual hover tracking for animated color changes |

There is **no `useHover` hook** in the DS. Hover is handled via:
- CSS `hover:` utilities (Button, Chip, Tabs) -- for simple color/bg changes
- Manual `onMouseEnter`/`onMouseLeave` with `useState` (Toggle) -- when hover drives animated (Motion-controlled) values
- `group-hover:` on child elements (Tabs, RadioButton) -- for coordinated hover across label + icon

### State expression patterns

| State | Visual expression | Token pattern |
|-------|------------------|---------------|
| **Hover** | Background color shift and/or text color shift | CSS `hover:bg-[var(--color-*)]` or animated `backgroundColor` |
| **Pressed (active)** | Scale down (0.9--0.97) + optional color shift to `-3` depth | `usePress` + `spring.snappy` |
| **Disabled** | `opacity-40` (Button) or `opacity-50` (Toggle) + `cursor-not-allowed` | Tailwind `disabled:opacity-40` or inline |
| **Focus-visible** | 2px outline, primary-1 color, 2px offset | Standard ring: `focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-primary-1)] focus-visible:outline-offset-2` |
| **Selected/Active** | Filled background (inverted-surface or primary) + inverted text | Color swap, layoutId indicator |

### Press scale values by component

| Component | Press scale | Target |
|-----------|------------|--------|
| Button | `0.97` | Entire button |
| Toggle | `0.93` | Track only |
| RadioButton | `0.9` | Ring only |
| ContentSwitcher (current) | `0.97` | Content span (text + icon) |

### Color depth convention for interaction states

The DS uses a **1/2/3 depth pattern** for color tokens:
- `-1` = default/resting
- `-2` = hover
- `-3` = active/pressed

This is consistent across primary, secondary, danger, success, and surface palettes.

### Motion tokens per state transition

| Transition | Token | Components |
|-----------|-------|------------|
| Press feedback (scale) | `spring.snappy` | Button, Toggle, RadioButton, ContentSwitcher |
| Color change (bg, border) | `duration.instant` + `ease.standard` | Toggle, RadioButton |
| Hover color (CSS) | `transition-colors duration-150` | Button, Chip, Tabs |
| Indicator slide | `spring.snappy` (ContentSwitcher), `spring.playful` (Tabs) | Tabs, ContentSwitcher |
| Shadow transitions | `duration.base` + `ease.enter` | Button (elevated), ContentSwitcher (elevated container) |

---

## Current ContentSwitcherItem implementation (gaps)

The current implementation has these states:

| State | Implemented? | How |
|-------|-------------|-----|
| Default (inactive) | Yes | `color: var(--color-on-surface-subtle-1)`, transparent bg |
| Active (selected) | Yes | `color: var(--color-on-inverted-surface)`, sliding indicator with `var(--color-inverted-surface)` bg + `shadow-medium-1` |
| Pressed | Partial | Scale 0.97 on content span only, no color change |
| Hover | **No** | No hover state at all |
| Active + hover | **No** | No differentiation |
| Active + pressed | **No** | Same press behavior as inactive pressed |
| Disabled | Partial | `opacity-40` + `cursor-default`, but no `cursor-not-allowed` |
| Focus-visible | Yes | Standard focus ring |

**Key gaps:** No hover feedback on inactive items, no hover/pressed differentiation for active items, disabled uses `cursor-default` instead of `cursor-not-allowed`.

---

## Designed State Model

### State inventory

| State | Text color | Background | Indicator | Shadow (indicator) | Scale | Opacity | Cursor |
|-------|-----------|------------|-----------|-------------------|-------|---------|--------|
| **Default (inactive)** | `var(--color-on-surface-subtle-1)` | `transparent` | None | -- | `1` | `1` | `pointer` |
| **Hover (inactive)** | `var(--color-on-surface)` | `var(--color-surface-3)` | None | -- | `1` | `1` | `pointer` |
| **Pressed (inactive)** | `var(--color-on-surface)` | `var(--color-surface-4)` | None | -- | `0.97` (content span) | `1` | `pointer` |
| **Active (selected)** | `var(--color-on-inverted-surface)` | Via indicator | `var(--color-inverted-surface)` | `shadow-medium-1` | `1` | `1` | `default` |
| **Active + hover** | `var(--color-on-inverted-surface)` | Via indicator | `var(--color-on-secondary-1)` | `shadow-medium-2` | `1` | `1` | `default` |
| **Active + pressed** | `var(--color-on-inverted-surface)` | Via indicator | `var(--color-on-secondary-1)` | `shadow-medium-1` | `0.97` (content span) | `1` | `default` |
| **Disabled** | `var(--color-on-surface-subtle-1)` | `transparent` | None (if inactive) / indicator (if active+disabled) | -- | `1` | `0.40` | `not-allowed` |
| **Focus-visible** | (per current state) | (per current state) | (per current state) | (per current state) | (per current state) | (per current state) | -- |

### Design rationale

1. **Hover on inactive items** uses `surface-3` background, matching the Chip resting state. This is a subtle fill that says "I'm interactive" without competing with the active indicator. Text darkens from `on-surface-subtle-1` to `on-surface` -- the same pattern Tabs uses for its hover.

2. **Pressed on inactive items** deepens to `surface-4` (one depth step beyond hover), matching the DS convention of hover=`-2`, active=`-3` (here surface-3 to surface-4). The content span scales to `0.97`, consistent with the existing implementation and Button's press scale.

3. **Active + hover** lightens the indicator from `inverted-surface` (near-black) to `on-secondary-1` (blue). This matches the RadioButton pattern where checked + hover shifts to the secondary-700 blue. The shadow lifts from `medium-1` to `medium-2`, matching the elevated Button hover pattern.

4. **Active + pressed** keeps the blue indicator color but drops shadow back to `medium-1` and applies the 0.97 scale. This follows the convention that press is "settling in" -- shadow reduces rather than grows.

5. **Disabled** uses `opacity-40` (matching Button) and `cursor-not-allowed` (fixing the current `cursor-default`). A disabled active item retains its indicator but at reduced opacity.

6. **Focus-visible** is unchanged -- the standard ring applies on top of any other visual state. This is consistent across every Kvalt component.

---

## Implementation notes

### 1. Add hover state tracking

The current implementation uses a plain `<button>` (not `motion.button`). Since hover needs to drive **animated** background color on the button itself (not just CSS hover, because the active indicator background also animates), convert to manual hover tracking:

```tsx
const [isHovered, setIsHovered] = useState(false);
```

Add `onMouseEnter={() => setIsHovered(true)}` and `onMouseLeave={() => setIsHovered(false)}` to the button element.

**Why not CSS hover?** The active indicator's background color change (inverted-surface to on-secondary-1) is on a `motion.div` that uses `animate` prop. CSS hover on the parent cannot drive a Motion animate value on a child. Manual state is needed, matching the Toggle pattern.

### 2. Convert button to motion.button

The current `<button>` needs to become `<motion.button>` so that:
- Inactive hover background can be animated (smooth color transition)
- The button itself does not need scale (scale stays on content span), but animated backgroundColor requires motion

### 3. Inactive item background

Add animated background to the button:

```tsx
// On the motion.button:
animate={{
  backgroundColor: !isActive
    ? (isPressed && !disabled
        ? 'var(--color-surface-4)'
        : isHovered && !disabled
          ? 'var(--color-surface-3)'
          : 'transparent')
    : 'transparent',  // active items have no button-level bg (indicator handles it)
}}
transition={{
  backgroundColor: { duration: duration.fast, ease: ease.standard },
}}
```

### 4. Inactive text color on hover

Change the text color logic:

```tsx
style={{
  // ...existing styles...
  color: disabled
    ? 'var(--color-on-surface-subtle-1)'  // disabled always muted
    : isActive
      ? 'var(--color-on-inverted-surface)'  // active always white
      : (isHovered || isPressed)
        ? 'var(--color-on-surface)'  // hover/pressed darkens text
        : 'var(--color-on-surface-subtle-1)',  // default muted
}}
```

### 5. Active indicator color and shadow on hover/press

Update the sliding indicator `motion.div`:

```tsx
{isActive && (
  <motion.div
    layoutId={ctx.layoutId}
    className="absolute inset-0"
    style={{
      borderRadius: 'var(--radius-xl)',
    }}
    animate={{
      backgroundColor: isHovered && !disabled
        ? 'var(--color-on-secondary-1)'  // blue on hover
        : 'var(--color-inverted-surface)',  // dark default
      boxShadow: isHovered && !disabled
        ? shadows['medium-2']  // lifted shadow on hover
        : shadows['medium-1'],  // resting shadow
    }}
    transition={ctx.reducedMotion
      ? { duration: 0 }
      : {
          layout: spring.snappy,
          backgroundColor: { duration: duration.fast, ease: ease.standard },
          boxShadow: { duration: duration.base, ease: ease.enter },
        }
    }
  />
)}
```

### 6. Fix disabled cursor

Change:
```tsx
disabled && 'opacity-40 cursor-default',
```
To:
```tsx
disabled && 'opacity-40 cursor-not-allowed',
```

### 7. Active item cursor

Active (selected) items should use `cursor-default` since clicking them does nothing:

```tsx
isActive && !disabled && 'cursor-default',
```

Add this to the `cn()` call, after the base `cursor-pointer`.

### 8. Reduced motion handling

Under `reducedMotion`:
- No scale on press (already handled: `0.97` becomes `1`)
- Background color changes use `duration: 0` (instant swap)
- Indicator layout animation uses `duration: 0` (already handled)
- Shadow changes use `duration: 0`

Update the content span's scale:

```tsx
animate={{ scale: reducedMotion ? 1 : (isPressed && !disabled ? 0.97 : 1) }}
```

(This is already close to current but should explicitly guard against disabled.)

---

## Motion

### Transition tokens per state change

| State change | Property | Token | Notes |
|-------------|----------|-------|-------|
| Rest to hover (inactive) | `backgroundColor` | `duration.fast` (160ms) + `ease.standard` | Smooth fill-in of surface-3 |
| Rest to hover (inactive) | `color` (text) | CSS `transition-colors duration-150` | Text darkens via CSS transition |
| Hover to pressed (inactive) | `backgroundColor` | `duration.fast` + `ease.standard` | Deepen to surface-4 |
| Hover to pressed (inactive) | `scale` (content) | `spring.snappy` | 0.97 scale on content span |
| Any to active | Indicator `layout` | `spring.snappy` | Sliding pill indicator |
| Active rest to active hover | `backgroundColor` (indicator) | `duration.fast` + `ease.standard` | inverted-surface to on-secondary-1 |
| Active rest to active hover | `boxShadow` (indicator) | `duration.base` (240ms) + `ease.enter` | medium-1 to medium-2, matching elevated Button |
| Active hover to active pressed | `scale` (content) | `spring.snappy` | 0.97 on content span |
| Active hover to active pressed | `boxShadow` (indicator) | `duration.base` + `ease.enter` | medium-2 back to medium-1 |
| Any to disabled | `opacity` | CSS `opacity-40` | Instant via class toggle (no animation needed) |
| Focus-visible | `outline` | CSS (no animation) | Outline appears instantly on keyboard focus |

### Reduced motion overrides

| Property | Normal | Reduced motion |
|----------|--------|---------------|
| `scale` | `spring.snappy` | Always `1` (no scale) |
| `backgroundColor` | `duration.fast` + `ease.standard` | `duration: 0` (instant) |
| `boxShadow` | `duration.base` + `ease.enter` | `duration: 0` (instant) |
| Indicator `layout` | `spring.snappy` | `duration: 0` (instant) |

---

## Summary of changes

1. **Add `useState` for hover tracking** -- `isHovered` boolean
2. **Convert `<button>` to `<motion.button>`** -- needed for animated backgroundColor
3. **Add `onMouseEnter`/`onMouseLeave`** handlers to the button
4. **Add animated `backgroundColor`** on the button for inactive hover/pressed states
5. **Update text `color` logic** to darken on hover/pressed for inactive items
6. **Update indicator `animate` prop** with hover-driven backgroundColor and boxShadow
7. **Split indicator `transition`** into per-property tokens (layout, backgroundColor, boxShadow)
8. **Fix disabled cursor** from `cursor-default` to `cursor-not-allowed`
9. **Add `cursor-default`** for active (selected) items
10. **Guard press scale** against disabled state explicitly

All changes are **non-breaking** -- the component API (props, values, types) remains identical. Only internal visual behavior changes.
