# Kvalt Docs Redesign — Iteration 2

Changes on top of `docs-redesign.md` (it1). Only net-new or modified behavior is listed here.

---

## 1. Dark mode toggle — layout & tilt fix

### Position
Move the toggle from **below the logo** to the **same row**, right-aligned:

```
[12px bar spacer] [kvalt] [DS chip] ←flex-1→ [toggle]
```

The row has `gap-5` (20px), `pr-8` right padding, `pt-8` top padding. The toggle sits flush-right inside this row.

### Pill surface
- Background: `color-surface-1` (white in light, dark surface in dark) — **not** `color-surface-3`
- Sliding indicator: `color-inverted-surface` (dark circle in light mode, light in dark)

### Moon icon fix
The two icon containers (`Sun`, `Moon`) must both be `24×24` with `z-10`, sitting side by side inside the 64×32 pill. No extra gap — the sliding indicator moves behind them. The moon icon was being clipped/misplaced because the pill had `gap-0` but inconsistent child sizing. Both icons now share identical wrapper markup.

### Stronger 3D tilt
- Perspective: `400px → 600px`
- RotateY range: `±6° → ±12°` (multiplier `12 → 24`)
- RotateX range: `±4° → ±10°` (multiplier `8 → 20`)
- This makes the tilt very noticeable when dragging the cursor across the pill

### Hover state refactor
Replace `whileHover` with explicit `isHovered` state (via `onMouseEnter`/`onMouseLeave`). This lets hover compose cleanly with `isPressed` from `usePress`:

```
targetScale = isPressed ? 0.96 : isHovered ? 1.08 : 1
targetShadow = isPressed ? small-2 : isHovered ? medium-2 : small-2
```

Both feed into a single `animate` object — no competing animation sources.

---

## 2. Nav active indicator — horizontal bar, not vertical

### Old (wrong)
- 4px-wide **vertical** bar, full height of the item, on the left edge

### New (matches Figma)
- **12px wide × 4px tall horizontal** bar, `rounded-full`
- Color: `color-on-secondary-1` (blue)
- Sits at the very left edge of the sidebar (0px from left)
- 20px gap between bar and text (`gap-5`)
- Every nav row reserves the 12px bar space even when inactive (invisible spacer), so all text stays aligned

### Row structure (every nav item)
```
<div className="flex items-center gap-5">
  <div className="w-3 shrink-0">        ← 12px bar column
    {isActive && <div className="h-1 w-3 rounded-full bg-blue" />}
  </div>
  <span>Label</span>
</div>
```

The sidebar has **no left padding** on the nav area — the bar column starts at `x: 0` of the sidebar. Right padding is `pr-8` (32px). The logo row also has the same 12px spacer for alignment.

---

## 3. Navigation animation system

### Two states

**COLLAPSED** — when `activeId === 'hello'`:
```
Hello                    ← active (blue + bar)
Foundations              ← 20px, dark, clickable → navigates to first sub-item
Components
Philosophy
Screen Vault
```

No category labels visible. No sub-items. Just five big items.

**EXPANDED** — when any sub-page is active (e.g. Motion under Philosophy):
```
FOUNDATIONS              ← 12px, uppercase, 2.4px tracking, 50% opacity
PHILOSOPHY
  Motion                 ← active (blue + animated bar)
  Tone of Voice          ← 20px, dark
  Accessibility
  ...
Foundations              ← 20px, dark, clickable → navigates to section
Components
Screen Vault
SCREEN VAULT             ← 12px, muted, bottom
COMPONENTS
```

Structure: muted labels for sections before the active one appear above → active section's label + all its sub-items → other sections as big clickable items → muted labels for sections after active appear below.

### Transition: collapsed → expanded

When the user clicks a top-level category (e.g. "Philosophy") from the Hello page:

1. The entire collapsed nav **fades out** (`opacity → 0`, `duration.fast` / 160ms)
2. The expanded nav **fades in** with items appearing one by one:
   - Each item enters with `opacity: 0, x: -8 → opacity: 1, x: 0`
   - Spring: `{ type: 'spring', visualDuration: 0.35, bounce: 0.18 }`
   - Stagger: **40ms** between items (`delay: 0.04 * index`)
3. The active item's **horizontal bar draws in** from `width: 0 → width: 12px`:
   - Same bounce spring
   - Extra 50ms delay after the item text appears (text first, then bar draws)

### Transition: expanded → different section

When clicking a different top-level category while already in expanded view:

1. Same fade-out/fade-in pattern via `AnimatePresence mode="wait"`
2. The new section's items stagger in fresh
3. The active bar draws in on the new first sub-item

### Transition: expanded → Hello

Clicking "Hello" (if added back as a top-level item) reverses to collapsed state with the same cross-fade.

### Transition: switching sub-items within same section

No full re-render — only the active bar moves. The bar on the old item shrinks to `width: 0` and the bar on the new item grows from `width: 0 → 12px`, both with the bounce spring. Text color transitions between blue/dark.

### Muted category labels

These are **clickable** (navigate to that section's first page) despite looking like passive labels. They use:
- `font-sans` (Inter), not `font-brand`
- `12px`, `uppercase`, `letter-spacing: 2.4px`
- `opacity: 0.5`
- `color-on-surface-subtle-1`

### Spring reference

| Animation | Config | Notes |
|-----------|--------|-------|
| Item enter | `visualDuration: 0.35, bounce: 0.18` | Subtle bounce on slide-in |
| Bar draw | Same spring + 50ms extra delay | Text arrives, then bar draws |
| Stagger | `0.04 * index` | 40ms between items |
| Cross-fade | `duration.fast` (160ms) | Between collapsed/expanded |

---

## Files changed

| File | What |
|------|------|
| `src/layouts/DarkModeToggle.tsx` | Pill surface, tilt strength, hover refactor, icon sizing |
| `src/layouts/DocsLayout.tsx` | Full rewrite: logo+toggle row, horizontal bar, two-state nav, stagger animation |
| `specs/docs-redesign.md` | Updated active state spec + added navigation animation system section |
