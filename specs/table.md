# Table — Component Spec

**Status:** Not started
**Figma node:** TBD
**Dependencies:** Checkbox, Skeleton, Badge, Chip, Icon, cn(), motion tokens, useReducedMotion

---

## Overview

Data display component for structured tabular data. Column-definition API with type-safe generics. Supports sorting, row selection, loading states, and empty states.

---

## Architecture

Single component with a column definition array + data array pattern. No `<TableRow>` or `<TableCell>` sub-components — the column config drives rendering.

```tsx
const columns: ColumnDef<User>[] = [
  { key: 'name', header: 'Name', sortable: true, width: '200px' },
  { key: 'email', header: 'Email', sortable: true },
  { key: 'role', header: 'Role', render: (val) => <Badge>{val}</Badge> },
];

<Table columns={columns} data={users} selectable striped stickyHeader />
```

---

## Props API

### ColumnDef

```typescript
interface ColumnDef<T> {
  key: string;
  header: string;
  width?: string | number;
  align?: 'left' | 'center' | 'right';    // default: 'left'
  sortable?: boolean;                       // default: false
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
}
```

### TableProps

```typescript
type SortDirection = 'asc' | 'desc' | 'none';

interface TableProps<T extends Record<string, unknown>> {
  // Data
  columns: ColumnDef<T>[];
  data: T[];

  // Selection
  selectable?: boolean;
  selectedRows?: Set<number>;
  onSelectionChange?: (indices: number[]) => void;

  // Sorting (controlled)
  sortColumn?: string;
  sortDirection?: SortDirection;
  onSort?: (column: string, direction: SortDirection) => void;

  // States
  loading?: boolean;
  emptyState?: {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: { label: string; onClick: () => void };
  };

  // Layout
  stickyHeader?: boolean;
  striped?: boolean;
  compact?: boolean;

  className?: string;
}
```

---

## Sizes

| Size | Row height | Cell padding |
|------|-----------|-------------|
| default | 48px | 12px vertical, 16px horizontal |
| compact | 36px | 8px vertical, 12px horizontal |

---

## Variants

### Default
- Row borders: `1px solid var(--color-border)` between rows
- All rows same background: `var(--color-surface-1)`

### Striped (`striped={true}`)
- Even rows: `var(--color-surface-1)`
- Odd rows: `var(--color-surface-2)`
- Still has subtle row borders

---

## Visual Spec

- Table background: `var(--color-surface-1)`
- Header background: `var(--color-surface-2)`
- Header text: `text-sm`, `font-bold`, `var(--color-on-surface-subtle-1)`
- Body text: `text-md`, `font-medium`, `var(--color-on-surface)`
- Border: `var(--color-border)`
- Border radius: `rounded-lg` (12px) on outer container wrapper
- Overflow: `overflow-x-auto` on wrapper for horizontal scroll

---

## Features

### 1. Sorting

**Behavior**: Click sortable header → cycle: none → asc → desc → none

**Visual**:
- Unsorted: header text only, `var(--color-on-surface-subtle-1)`
- Sorted: text becomes `var(--color-on-surface)`, ChevronUp (asc) or ChevronDown (desc) icon
- Hover on sortable header: `var(--color-surface-3)` background

**Animation**: Sort indicator rotates via `spring.snappy`. Reduced motion: instant.

### 2. Row Selection

**Behavior**:
- Checkbox column appears as first column (48px wide)
- Header checkbox: select all / deselect all
- Header shows indeterminate state when some rows selected
- Uses existing Checkbox component (inherits stroke-draw animation)

**Callbacks**: `onSelectionChange(indices: number[])` on every change

### 3. Loading State

**When**: `loading={true}`

- Render Skeleton rows (use existing Skeleton component)
- Row count: `data.length` or 5 if data is empty
- Skeleton cells match column widths
- `aria-busy="true"` on `<table>`

### 4. Empty State

**When**: `data.length === 0` and `loading === false`

- Centered in table body, spans all columns
- Icon (optional, `xl` 32px) → Title (`text-md`, `font-semibold`) → Description (`text-sm`) → Action Button
- Min height: 240px
- `role="status"` on container
- Fade in: `ease.enter`, `duration.base`

### 5. Sticky Header

**When**: `stickyHeader={true}`

- `<thead>` gets `position: sticky; top: 0; z-index: 10`
- Solid background (no transparency)
- Add `shadow-small-2` when scrolled (detect via IntersectionObserver or scroll listener)

### 6. Custom Cell Rendering

```typescript
render: (value, row, index) => React.ReactNode
```

Enables Badge, Chip, Button, Avatar, or any component inside cells.

---

## Animation

### Sort indicator
- `spring.snappy` rotation
- Reduced motion: instant

### Row enter (data changes)
- Staggered fade-in: `ease.enter`, `duration.fast` (160ms)
- 30ms stagger per row
- Reduced motion: no stagger, instant

### Row hover
- Background: `var(--color-surface-2)`, `duration.instant` (100ms)

---

## Accessibility

### Semantic HTML
- `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th scope="col">`, `<td>`
- No `<div>`-based table structure

### ARIA
- Sortable columns: `aria-sort="ascending" | "descending" | "none"`
- Select all checkbox: `aria-label="Select all rows"`
- Row checkboxes: `aria-label="Select row"`
- Loading: `aria-busy="true"` on `<table>`
- Empty state: `role="status"`

### Keyboard
- Tab through interactive elements (sortable headers, checkboxes, action buttons in cells)
- Enter / Space to toggle sort or selection
- No focus trap within table

### Focus ring
On all interactive elements: sortable `<th>`, checkboxes, buttons in cells.

---

## Edge Cases

- 0 rows → empty state (must provide `emptyState.title`)
- 1000+ rows → no virtualization in v1; recommend pagination in parent
- Column overflow → horizontal scroll via `overflow-x-auto` wrapper
- Null/undefined cell values → render `'—'` by default, override via `render`
- No sortable columns → headers render as plain text, no click handlers
- All rows selected → header checkbox checked (not indeterminate)

---

## Showcase (App.tsx)

1. Basic table with 3-4 columns of sample data
2. Sortable columns (click headers to cycle)
3. Row selection with select-all and indeterminate state
4. Striped vs default variant
5. Compact vs default size
6. Custom cell rendering (Badge for status, formatted numbers)
7. Loading state (skeleton rows)
8. Empty state with icon, message, and action button
9. Sticky header with scrollable body (max-height container)
10. Combined: sortable + selectable + striped + sticky header
