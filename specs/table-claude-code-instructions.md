# Table Component — Claude Code Build Instructions

## IMPORTANT: Read CLAUDE.md first
Before writing any code, read and follow ALL rules in `/CLAUDE.md`. Key rules:
- All animation timing from `src/tokens/motion.ts` — never hardcode
- Use `usePress` hook for press animations — never `whileTap`
- Use `useReducedMotion` hook for accessibility
- Only DS border radius tokens: `rounded-s`, `rounded-m`, `rounded-lg`, `rounded-xl`
- Only DS shadow tokens: `shadow-small-*`, `shadow-medium-*`, `shadow-large-*`
- Semantic CSS variables: `var(--color-*)` — never hex codes
- Use `cn()` from `src/lib/cn.ts` for class merging
- Use `<Icon>` component with size tokens — never raw Lucide icons

---

## Source
Figma file: Topic Board New (GKdrp6fzNGwF0XKPO5MDQz)
Figma node: 8913:58427 (frame "3.4 Data Table")

---

## Architecture

Create a single file: `src/components/Table.tsx`

The Table uses a **column definition array + data array** pattern. No sub-components for rows/cells — columns define structure, data drives content. The column config is the API.

### Exports
```typescript
export type ColumnDef<T>
export type SortDirection
export type TableProps<T>
export function Table<T extends Record<string, unknown>>(props: TableProps<T>): React.ReactNode
```

---

## Figma Component Mapping

The Figma file defines these atomic pieces. Map them to the Table implementation:

### Table Header Cell
Figma variants: `Filter`, `Sorting`, `Horizontal Line`, `Vertical Line`
- `Filter=False, Sorting=False` → plain header text
- `Filter=True, Sorting=False` → header text + filter icon (funnel, 16px)
- `Filter=False, Sorting=True` → header text + sort indicator
- `Filter=True, Sorting=True` → header text + filter icon + sort indicator

### Table Column Sorting (sort indicator icon)
Figma variants: `Type` × `State`
- `Type=Default` → double chevron (up+down stacked, 8×12px) — column is sortable but unsorted
  - States: Default (grey `var(--color-on-surface-subtle-2)`), Hover (blue `var(--color-secondary-1)`), Active (blue `var(--color-secondary-1)`), Disabled (grey, opacity 40%)
- `Type=Active Down` → single down arrow — sorted A→Z (ascending)
  - States: Default (blue `var(--color-secondary-1)`), Disabled (grey, opacity 40%)
- `Type=Active Up` → single up arrow — sorted Z→A (descending)
  - States: Default (blue `var(--color-secondary-1)`), Disabled (grey, opacity 40%)

**Sort cycle on click**: Default → Active Down (A-Z) → Active Up (Z-A) → Default (none)

### Table Column Filter (filter funnel icon)
Figma variants: `Active` × `State`
- `Active=False` → filter not applied, grey funnel icon
- `Active=True` → filter applied, blue filled funnel icon
- States for both: Default, Hover, Active, Disabled

**Note for v1**: Filter icon is a clickable trigger. The filtering logic (dropdown, values) is handled by the parent — Table just renders the icon and fires `onFilterClick(columnKey)`. The filter dropdown already exists as `DropdownMenu`.

### Table Cell - Default
Figma variants: `Horizontal Line`, `Vertical Line`, `Zebra Stripe`, `State`
- States: Default, Hover, Selected, Disabled
- Horizontal Line: 1px border-bottom `var(--color-border)`
- Vertical Line: 1px border-right `var(--color-border)`
- Zebra Stripe: alternating row bg `var(--color-surface-2)`
- Selected: bg `var(--color-secondary-1)` at ~8% opacity (use `var(--color-surface-3)`)
- Hover: bg `var(--color-surface-2)`
- Disabled: opacity 40%, cursor-not-allowed

### Table Cell - Checkbox
Figma: 50px wide column. Uses the existing `Checkbox` component (sm size).
- Same state variants as Default cell
- Selected state = checked checkbox + selected row bg

### Table Cell - Actions
Figma: contains icon buttons for row actions (e.g. copy, delete, view detail)
- Same state variants as Default cell
- Icon buttons inside are `sm` size icons, spaced with `gap-1`
- Handled via column `render` function — not a special cell type

### Table Footer
Figma variants: `Top Border` (true/false)
- Contains pagination: items-per-page selector, "1–20 of 993 total" text, page number buttons, prev/next arrows
- Height: 80px
- Pagination is a separate concern — render via `footer` prop or build inline

---

## Props API

```typescript
import type { LucideIcon } from 'lucide-react';

export type SortDirection = 'asc' | 'desc' | 'none';

export interface ColumnDef<T> {
  /** Unique column key — must match a key in data objects */
  key: string;
  /** Header text */
  header: string;
  /** Column width (CSS value) */
  width?: string | number;
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
  /** Show sort indicator + enable sort click */
  sortable?: boolean;
  /** Show filter funnel icon + enable filter click */
  filterable?: boolean;
  /** Custom cell renderer */
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
}

export interface TableProps<T extends Record<string, unknown>> {
  /** Column definitions */
  columns: ColumnDef<T>[];
  /** Data array */
  data: T[];

  // ─── Selection ─────────────────────────────────────
  /** Show checkbox column */
  selectable?: boolean;
  /** Controlled selected row indices */
  selectedRows?: Set<number>;
  /** Fires when selection changes */
  onSelectionChange?: (indices: number[]) => void;

  // ─── Sorting (controlled) ─────────────────────────
  /** Currently sorted column key */
  sortColumn?: string;
  /** Current sort direction */
  sortDirection?: SortDirection;
  /** Fires on header sort click — cycle: none → asc → desc → none */
  onSort?: (column: string, direction: SortDirection) => void;

  // ─── Filtering ─────────────────────────────────────
  /** Set of column keys that currently have active filters */
  activeFilters?: Set<string>;
  /** Fires when filter icon is clicked — parent opens dropdown */
  onFilterClick?: (column: string) => void;

  // ─── Visual options ────────────────────────────────
  /** Show horizontal lines between rows */
  horizontalLines?: boolean;    // default: true
  /** Show vertical lines between columns */
  verticalLines?: boolean;      // default: false
  /** Alternating row backgrounds */
  zebraStripe?: boolean;        // default: false
  /** Compact row height (36px instead of 50px) */
  compact?: boolean;            // default: false

  // ─── States ────────────────────────────────────────
  /** Show skeleton loading rows */
  loading?: boolean;
  /** Content to show when data is empty */
  emptyState?: {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: { label: string; onClick: () => void };
  };

  // ─── Layout ────────────────────────────────────────
  /** Sticky header on scroll */
  stickyHeader?: boolean;
  /** Footer content (e.g. pagination) */
  footer?: React.ReactNode;

  /** Additional className on outer wrapper */
  className?: string;
}
```

---

## Dimensions (from Figma)

### Row heights
- Default: **50px** (matches all Figma cell instances)
- Compact: **36px** (for dense layouts, not explicitly in Figma but needed)
- Header: same as row height
- Footer: **80px**

### Checkbox column
- Width: **50px** (fixed)
- Checkbox centered, uses existing `Checkbox` component with `size="sm"`

### Cell padding
- Default: **0 16px** (left-right), vertically centered
- Compact: **0 12px**

### Actions column
- Width: set by column `width` prop
- Icon buttons: `sm` (16px) icons with `gap-1` (4px)

---

## Sort Indicator Implementation

Use Lucide icons to match Figma:
- **Unsorted**: `ChevronsUpDown` icon (sm, 16px) — grey `var(--color-on-surface-subtle-2)`
- **Sorted A-Z (asc)**: `ChevronDown` icon (sm, 16px) — blue `var(--color-secondary-1)`
- **Sorted Z-A (desc)**: `ChevronUp` icon (sm, 16px) — blue `var(--color-secondary-1)`

Sort cycle on click: `none` → `asc` → `desc` → `none`

The sort indicator animates between states:
```typescript
// Animate sort icon change with spring.snappy
<AnimatePresence mode="wait">
  <motion.div
    key={sortDirection}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={spring.snappy}
  >
    <Icon icon={sortIcon} size="sm" />
  </motion.div>
</AnimatePresence>
```

---

## Filter Icon Implementation

Use Lucide `Filter` icon (sm, 16px):
- **Inactive**: `var(--color-on-surface-subtle-2)`
- **Active** (filter applied): `var(--color-secondary-1)`
- **Hover**: `var(--color-secondary-1)`

The filter icon is a clickable button that fires `onFilterClick(columnKey)`. The parent is responsible for rendering the filter dropdown (use existing `DropdownMenu`).

---

## Row States

### Default
- Background: `var(--color-surface-1)` (or `var(--color-surface-2)` for zebra odd rows)

### Hover
- Background: `var(--color-surface-2)` (or `var(--color-surface-3)` for zebra odd rows)
- Transition: `duration.instant` (100ms) with `ease.standard`

### Selected (checkbox checked)
- Background: `var(--color-surface-3)`
- Checkbox is checked with stroke-draw animation (inherited from Checkbox component)

### Disabled
- Opacity: 40%
- Cursor: `not-allowed`
- Checkbox and actions are non-interactive

---

## Animation

### Row enter (when data changes)
```typescript
// Staggered fade-in — derive stagger from tokens, don't hardcode
const STAGGER = duration.instant * 0.3; // 30ms from token math

<motion.tr
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{
    duration: duration.fast,
    ease: ease.enter,
    delay: index * STAGGER,
  }}
>
```

### Sort indicator change
Use `AnimatePresence mode="wait"` with `spring.snappy` for icon swap.

### Row selection
Checkbox uses its own stroke-draw animation. Row background color changes with:
```typescript
transition: { duration: duration.instant, ease: ease.standard }
```

### Reduced motion (useReducedMotion)
- No row enter stagger (instant)
- No sort indicator animation (instant swap)
- Row hover still transitions (this is just CSS)

---

## Accessibility

### Semantic HTML
```html
<div class="table-wrapper overflow-x-auto">  <!-- scroll container -->
  <table>
    <thead>
      <tr>
        <th scope="col">...</th>  <!-- each header -->
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>...</td>  <!-- each cell -->
      </tr>
    </tbody>
  </table>
  <footer>...</footer>  <!-- if footer prop provided -->
</div>
```

### ARIA
- Sortable `<th>`: `aria-sort="ascending" | "descending" | "none"`, `role="columnheader"`
- Sortable `<th>`: wrap content in `<button>` for keyboard access
- Select-all checkbox: `aria-label="Select all rows"`
- Row checkboxes: `aria-label="Select row"`
- Loading state: `aria-busy="true"` on `<table>`
- Empty state: `role="status"` on the empty container
- Filter button: `aria-label="Filter {column name}"`, `aria-pressed={isActive}`

### Keyboard
- **Tab**: Navigate between interactive elements (sort buttons, filter buttons, checkboxes)
- **Enter / Space**: Toggle sort direction, toggle selection, activate filter
- **No arrow key navigation** between cells (this is a data table, not a spreadsheet grid)

### Focus rings
On ALL interactive elements inside the table:
```
outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-primary-1)] focus-visible:outline-offset-2
```

---

## Loading State

When `loading={true}`:
- Render Skeleton rows using the existing `Skeleton` component
- Number of skeleton rows: `Math.max(data.length, 5)`
- Each skeleton cell renders a `<Skeleton />` matching ~60% of column width
- Checkbox column renders disabled checkbox skeletons
- `aria-busy="true"` on `<table>`
- No row hover or selection during loading

---

## Empty State

When `data.length === 0` and `loading !== true`:
- Render a centered block spanning all columns via `<td colSpan={totalColumns}>`
- Icon (optional, `xl` 32px, `var(--color-on-surface-subtle-1)`)
- Title: `text-md`, `font-semibold`, `var(--color-on-surface)`
- Description: `text-sm`, `font-medium`, `var(--color-on-surface-subtle-1)`
- Action button (optional): use existing `Button` component, `variant="secondary"`, `size="sm"`
- Min height: 240px
- Fade in: `ease.enter`, `duration.base`
- `role="status"` on container

---

## File Structure

Create ONE file: `src/components/Table.tsx`

```typescript
/**
 * Design System — Table component
 * Source: Figma / Topic Board New / node 8913:58427
 *
 * Structure:  Column-driven data table with header, body, optional footer
 * Features:   Sorting, filtering, row selection, loading, empty state
 * Row height: 50px (default) | 36px (compact)
 * Lines:      Horizontal (default on) | Vertical (default off) | Zebra stripe
 *
 * Usage:
 *   const columns: ColumnDef<User>[] = [
 *     { key: 'name', header: 'Name', sortable: true },
 *     { key: 'email', header: 'Email', sortable: true, filterable: true },
 *     { key: 'role', header: 'Role', render: (val) => <Badge>{val}</Badge> },
 *   ];
 *
 *   <Table columns={columns} data={users} />
 *
 *   <Table
 *     columns={columns}
 *     data={users}
 *     selectable
 *     selectedRows={selected}
 *     onSelectionChange={setSelected}
 *     sortColumn="name"
 *     sortDirection="asc"
 *     onSort={handleSort}
 *     horizontalLines
 *     zebraStripe
 *     stickyHeader
 *     footer={<Pagination ... />}
 *   />
 */
```

---

## Showcase (add to App.tsx)

Add a "Data Table" section to the showcase with these demos:

1. **Basic table** — 4 columns, 7 rows of sample data, `horizontalLines`
2. **Sortable** — Click headers to cycle sort, show sort indicator states
3. **With selection** — Checkbox column, select-all, indeterminate, selected row highlight
4. **Zebra stripe** — `zebraStripe` + `horizontalLines`
5. **With vertical lines** — `horizontalLines` + `verticalLines`
6. **Compact** — `compact` size for dense layout
7. **Column filter** — Headers with filter icon, `activeFilters` shown
8. **Custom cell rendering** — Badge for status, formatted numbers, icon buttons for actions
9. **Loading state** — Skeleton rows
10. **Empty state** — Icon, title, description, action button
11. **Sticky header** — Scrollable container with fixed header (`max-h-[300px]`)
12. **Kitchen sink** — All features combined: selectable + sortable + filterable + striped + sticky header

---

## Implementation Checklist

Before marking the component as done, verify:

- [ ] All colors use `var(--color-*)` semantic tokens — no hex codes
- [ ] All animation timing from `tokens/motion.ts` — no hardcoded values
- [ ] `useReducedMotion` disables row stagger and sort animation
- [ ] Focus rings on every interactive element (sort buttons, filter buttons, checkboxes)
- [ ] Semantic `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th scope="col">`, `<td>`
- [ ] `aria-sort` on sortable columns
- [ ] `aria-busy="true"` during loading
- [ ] Checkbox uses existing `Checkbox` component from `./Checkbox`
- [ ] Skeleton uses existing `Skeleton` component from `./Skeleton`
- [ ] Empty state action uses existing `Button` component
- [ ] Icon uses `<Icon>` component with size tokens
- [ ] Sort cycle: none → asc → desc → none (3-click)
- [ ] Works in dark mode (all semantic tokens)
- [ ] Horizontal scroll on overflow (`overflow-x-auto` wrapper)
- [ ] No `rounded-2xl` or `rounded-3xl` — only DS radius tokens
- [ ] Added to App.tsx showcase with all 12 demo sections
