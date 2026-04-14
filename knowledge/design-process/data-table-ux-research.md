# Data Table UX Research Report

> Comprehensive synthesis of 25+ sources on data table design patterns, interaction models, accessibility, and visual design. Compiled April 2026 for the Kvalt Design System.

---

## Table of Contents

- [A. Core Layout & Structure](#a-core-layout--structure)
- [B. Data Display Patterns](#b-data-display-patterns)
- [C. Interaction Patterns](#c-interaction-patterns)
- [D. Responsive & Overflow](#d-responsive--overflow)
- [E. Performance](#e-performance)
- [F. Accessibility](#f-accessibility)
- [G. Visual Design](#g-visual-design)
- [H. Advanced Features](#h-advanced-features)
- [I. Kvalt-Specific Recommendations](#i-kvalt-specific-recommendations)
- [Sources](#sources)

---

## A. Core Layout & Structure

### A1. Column Alignment Rules
**What:** Text left-aligned, numbers right-aligned, status/badges center-aligned. Currency right-aligned with decimal alignment.
**Why:** Left-alignment mirrors Western reading direction. Right-alignment lets users compare numerical magnitude by scanning the leading digits. Decimal alignment (or fixed decimal places) prevents misreading values.
**Sources:** Pencil & Paper, Material Design, Taras Bakusevych, UX Collective (reusability), Matthew Strom
**Importance:** CRITICAL

### A2. Row Height and Density Options
**What:** Three density levels are standard:
- **Comfortable/Default:** 48-56px row height, 16px cell padding
- **Compact/Dense:** 32-40px row height, 8-12px cell padding
- **Spacious:** 56-72px row height, for tables with avatars, multi-line content, or action buttons

**Why:** Different data types and use cases require different densities. Dense financial data needs compact rows; user management with avatars needs more space. Material Design specifies 52dp default, 36dp compact. Let users toggle density when the table is their primary workspace.
**Sources:** Material Design, Carbon Design System, Pencil & Paper, Ant Design
**Importance:** CRITICAL

### A3. Header Design
**What:** Headers should be:
- **Visually distinct** from data rows (different background, bolder weight, slightly smaller or uppercased text)
- **Sticky** when the table scrolls vertically — with a subtle shadow appearing on scroll to indicate the header is floating above content
- **Concise** — 1-2 words per header; truncate with tooltip if longer
- **Interactive** — sort indicators visible on hover for sortable columns; filter icons for filterable columns
- **Help text** — optional tooltip or info icon for columns that need explanation (e.g., "ARR" → "Annual Recurring Revenue")

**Why:** Headers are the user's primary orientation mechanism. Sticky headers maintain context during vertical scrolling. Sort indicators must be discoverable but not noisy. Carbon specifies wrapping to 2 lines max, then truncating.
**Sources:** Carbon Design System, Material Design, Atlassian, Shopify Polaris, CSS-Tricks, Pencil & Paper
**Importance:** CRITICAL

### A4. Minimum Column Widths
**What:** Enforce minimum widths per content type:
- Checkbox column: 40-50px
- Short text (name, status): 100px minimum
- Email/URL: 180px minimum
- Date: 100px minimum
- Actions column: width of action buttons + padding
- Numbers: wide enough for the largest expected value + sort indicator

Material Design specifies minimum 56dp padding between columns. The widest item in a column (including the header) should define the column's minimum width.
**Why:** Prevents columns from becoming unreadably narrow. Ensures touch targets remain accessible.
**Sources:** Material Design, AG Grid, MUI X
**Importance:** CRITICAL

### A5. Table vs. Card View Thresholds
**What:** Switch from table to card layout below ~600px viewport width (or when fewer than 3 columns remain visible). The breakpoint depends on content:
- 2-4 columns: table works on most viewports
- 5-8 columns: consider hiding lower-priority columns on tablet
- 9+ columns: horizontal scroll with pinned key columns, or switch to cards on mobile

**Why:** Tables become unusable on narrow viewports when users must scroll both horizontally and vertically. Cards eliminate horizontal scrolling by stacking fields vertically.
**Sources:** NN/g (Big Tables Small Screens), CSS-Tricks, UXmatters (Designing Mobile Tables), Baymard Institute
**Importance:** RECOMMENDED

---

## B. Data Display Patterns

### B1. Cell Content Types
**What:** Common cell types and their display rules:

| Type | Display | Alignment | Notes |
|------|---------|-----------|-------|
| Plain text | As-is, truncate with tooltip | Left | Ellipsis after container width |
| Numbers | Tabular/monospace figures | Right | Fixed decimal places within a column |
| Currency | Symbol + formatted number | Right | Use locale-aware formatting; align decimal points |
| Dates | Consistent format (e.g., "Apr 4, 2026") | Left or Right | Relative dates ("2 hours ago") for recent, absolute for historical |
| Status badges | Colored badge/pill | Left or Center | Limit to 3-5 statuses; use both color + label (never color alone) |
| Avatars | Image + name in same cell | Left | Fallback to initials; combine with name for scannability |
| Boolean | Checkmark/dash or icon | Center | Avoid "Yes/No" text — icons scan faster |
| Actions | Icon buttons or overflow menu | Right | Show on hover, always visible on mobile; max 2-3 visible actions, overflow into "..." menu |
| Links | Styled as clickable text | Left | Underline or color to indicate interactivity |
| Progress | Mini progress bar | Left | Include percentage text for accessibility |
| Tags/chips | Multiple inline chips | Left | Wrap or "+N more" with tooltip |

**Sources:** Pencil & Paper, Halo Lab, UX Booth, Ant Design ProTable, Shadcn UI
**Importance:** CRITICAL

### B2. Truncation Strategies
**What:**
- Use CSS `text-overflow: ellipsis` with `white-space: nowrap` and `overflow: hidden`
- Requires `table-layout: fixed` or explicit column widths
- Show full content in a tooltip on hover — but ONLY when the content is actually truncated (conditional tooltip)
- For multi-line cells: clamp to 2 lines with `-webkit-line-clamp`
- DataTables ellipsis plugin: truncates at N characters while keeping data searchable and sortable

**Why:** Long content (emails, URLs, descriptions) will break table layouts without truncation. Tooltips provide escape hatch. Conditional tooltips prevent unnecessary tooltip flicker on short content.
**Sources:** DataTables, PatternFly (Truncate), SitePoint, GeeksforGeeks
**Importance:** CRITICAL

### B3. Empty/Null/Zero States Per Cell
**What:**
- **Null/missing:** Display an em-dash "—" (not empty, not "N/A", not "null")
- **Zero:** Display "0" or "$0.00" — never leave blank (blank implies missing, not zero)
- **Boolean false:** Display a dash or subdued icon — empty cells are ambiguous
- **Empty string:** Same as null — em-dash

**Why:** Distinguishing between "no data," "zero," and "not applicable" prevents user confusion. The em-dash is universally understood as "nothing here" while being visually distinct from content.
**Sources:** NN/g, Tableau docs, Pencil & Paper, Halo Lab
**Importance:** CRITICAL

### B4. Number Formatting
**What:**
- Right-align all numeric columns
- Use tabular lining figures (monospace numerals) — every digit same width for visual alignment
- Keep decimal places consistent within a column (e.g., all prices show 2 decimals)
- Use thousands separators for numbers > 999 (locale-aware)
- For percentages: right-align, include % symbol, consistent decimal places
- For large numbers: abbreviate (1.2M, 45K) with tooltip showing exact value

**Why:** FiveThirtyEight uses Decima Mono specifically for data density. Inconsistent decimal places create visual noise and impede comparison. Right-alignment lets users compare magnitude by scanning leading digits.
**Sources:** Matthew Strom, Plotly/Dash, Material Design, Pencil & Paper
**Importance:** CRITICAL

### B5. Date/Time Formatting
**What:**
- Short format for tables: "Apr 4, 2026" or "2026-04-04" (ISO for technical users)
- Never show full timestamp in the cell — use tooltip for exact time
- Relative dates ("3 days ago") are useful for recent activity but confuse sorting — include absolute date in tooltip
- Sort by underlying timestamp, not display string
- Time zones: show user's local time; indicate timezone only when relevant

**Sources:** Carbon, Shopify Polaris, general UX practice
**Importance:** RECOMMENDED

### B6. Status Indicators
**What:**
- **Badge/pill:** Colored background with text label. Best for discrete statuses (Active, Pending, Failed)
- **Dot + text:** Small colored circle before the label. More subtle, works for many statuses
- **Icon + text:** Checkmark, warning triangle, etc. Most accessible pattern
- NEVER use color alone — always pair with text label or icon for colorblind users
- Limit palette: green (success), amber/yellow (warning), red (error/danger), blue (info), gray (neutral/inactive)
- Keep badges visually quiet — overly colorful badges compete for attention and make it hard to spot what needs action

**Why:** Status is the most scanned column in most enterprise tables. Clear visual hierarchy helps users triage quickly. Color-only indicators fail WCAG 1.4.1 (Use of Color).
**Sources:** UX Movement (status badges), Pencil & Paper, Carbon, Ant Design valueEnum
**Importance:** CRITICAL

---

## C. Interaction Patterns

### C1. Sorting
**What:**
- **Single-column sort** is the default — click header to cycle: none → ascending → descending → none
- **Multi-column sort** for power users: Shift+click to add secondary/tertiary sort columns. Show sort priority numbers (1, 2, 3) on the indicators
- **Default sort:** Always show data in a meaningful default order (most recent, alphabetical by name, etc.) — never random
- **Sort indicator:** Arrow icon in header — up for ascending, down for descending. Subtle icon (ChevronsUpDown) when unsortable or unsorted
- **Announce sort changes** to screen readers via `aria-sort` attribute on `<th>` and live region updates
- **Server-side sort** for large datasets (1000+ rows) — show loading indicator during sort

**Why:** Sorting is the #1 table interaction (NN/g's four tasks: find, compare, view/edit, act). Users expect click-to-sort on any data column. Multi-sort is essential for complex analysis but should not complicate the basic case.
**Sources:** NN/g, TanStack Table, DataTables, Material Design, Carbon, Shopify Polaris
**Importance:** CRITICAL

### C2. Filtering
**What:**
- **Column-level filters:** Filter icon in each column header opens a dropdown with checkbox multi-select (like Excel). Include search within dropdown when >12 options. Show "Select All" / "Clear All" controls
- **Global search:** Single search input above the table that matches across all columns
- **Filter chips/tags:** Show active filters as removable chips above the table for visibility
- **Filter bar:** Dedicated row of filter inputs between header and data (advanced pattern)
- **Preset filters / saved filters:** Let users save filter combinations as named views
- **Clear all filters:** Always provide a single action to reset all filters
- **Show result count:** "Showing 23 of 156 results" helps users understand filter impact

**Why:** Filtering is the second most important table interaction. Column-level filters are intuitive because they're co-located with the data they control. Filter chips provide visibility into active state. Global search handles "I know what I'm looking for" cases.
**Sources:** Carbon, TanStack Table, Pencil & Paper, Shopify Polaris, Ant Design
**Importance:** CRITICAL

### C3. Selection
**What:**
- **Row selection** via checkbox in the first column
- **Select all** checkbox in header — with indeterminate state when some rows are selected
- **Select all on current page** vs. **select all across pages** — disambiguate with a banner: "All 25 on this page selected. Select all 1,234 results?"
- **Bulk action toolbar:** Appears when rows are selected — shows selected count and available actions (Delete, Export, Assign, etc.)
- **Shift+click** for range selection (select from last selected to clicked row)
- **Preserve selection across pagination** — selected rows should persist when changing pages (or clearly communicate that they don't)
- **Visual: selected rows** get a highlight background color distinct from hover and zebra striping

**Why:** Selection enables batch operations, which are critical for efficiency in data-heavy workflows. The select-all-across-pages ambiguity is a common UX bug that frustrates users.
**Sources:** Material Design, Shopify Polaris (IndexTable), Carbon, Pencil & Paper, UX Movement (bulk edit)
**Importance:** CRITICAL

### C4. Pagination vs. Infinite Scroll vs. Virtual Scrolling
**What:**

| Pattern | Best For | Drawbacks |
|---------|----------|-----------|
| **Pagination** | Most data tables. Provides cognitive anchoring, supports bookmarking, predictable performance | Requires interaction to see more data |
| **Infinite scroll** | Content feeds, activity logs | No orientation, can't bookmark, breaks "back" button, disorients in tables |
| **"Load more" button** | Compromise — user-initiated loading | Loses page context over time |
| **Virtual scrolling** | Large datasets (1000+ rows) where scrolling is preferred over pagination | Complex implementation, scrollbar position can be misleading |

**Recommendation for data tables:** Pagination as default, with configurable rows-per-page (10, 25, 50, 100). Virtual scrolling as an option for power-user views with very large datasets.

**Pagination UX details:**
- Show: page number, total pages, rows per page selector, first/prev/next/last buttons
- Keyboard accessible navigation
- Announce page changes to screen readers

**Why:** Pagination provides the best balance of usability, performance, and orientation for data tables. Infinite scroll is actively harmful for structured data comparison tasks (Baymard, NN/g).
**Sources:** NN/g, Baymard, UX Planet, Kleeen Software, LogRocket, Pencil & Paper
**Importance:** CRITICAL

### C5. Row Expansion / Detail Panels
**What:** Three approaches:
1. **Inline expansion:** Chevron icon (left or right edge) expands a detail area below the row within the table. Best for supplementary info that belongs to the row context
2. **Side panel / drawer:** Clicking a row opens a panel on the right with full details. Best for complex detail views. Most scalable option
3. **Modal:** Full overlay with details. More disruptive; use only when detail view needs full attention

**Design rules:**
- Expand icon: chevron that rotates 90° on open (or down-arrow that rotates to up)
- Only one row expanded at a time (default) — "expand all" as optional feature
- Expanded content can contain any layout: form fields, nested tables, charts, timeline
- Lazy-load expanded content to save initial load time

**Why:** Row expansion prevents navigating away from the list view, maintaining context. It's the most requested enterprise table feature after sorting and filtering.
**Sources:** Carbon (expandable rows), MUI X (master-detail), Cloudscape, PatternFly, IBM/Becca Urry
**Importance:** RECOMMENDED

### C6. Inline Editing
**What:**
- Click a cell to activate edit mode (or click an edit icon)
- Cell transforms into an input/select/datepicker matching the data type
- Show save/cancel controls (checkmark/X icons or Enter/Escape keys)
- Validate on blur or save; show inline error messages
- Highlight edited cells until saved (optimistic or explicit save)
- For bulk editing: enter "edit mode" for the whole table, save/cancel all at once

**Limitations:**
- Works well for 1-5 editable columns per row
- For complex edits, prefer a detail panel or modal form
- On mobile, inline editing is often impractical — prefer edit-in-drawer

**Why:** Inline editing eliminates navigation to a separate edit form, reducing friction for quick updates. But it adds complexity to keyboard navigation and error handling.
**Sources:** UX Design World (inline editing best practices), Salesforce, Pencil & Paper, NN/g
**Importance:** NICE-TO-HAVE for v1, RECOMMENDED for v2

### C7. Column Resizing and Reordering
**What:**
- **Resizing:** Drag handle appears on hover between column headers. Cursor changes to `col-resize`. Minimum width enforced. Neighboring column adjusts or table width changes
- **Reordering:** Drag column header to new position. Visual feedback during drag (ghost column, insertion indicator). Can be combined with column visibility toggle
- **Persistence:** Save column widths and order to localStorage or user preferences

**Why:** Different users need different views of the same data. Power users will customize column layout for their workflow and expect it to persist.
**Sources:** AG Grid, TanStack Table, MUI X, Pencil & Paper
**Importance:** NICE-TO-HAVE (v2)

### C8. Row Reordering (Drag)
**What:** Drag handle (grip icon, ⠿) on the left edge of each row. Drag to reorder. Visual feedback: dragged row floats, insertion line shows target position. Accessible alternative: move-up/move-down buttons or keyboard shortcut.
**Why:** Essential for priority lists, kanban-like ordering, manual ranking.
**Sources:** Atlassian (DynamicTable `isRankable`), Pencil & Paper
**Importance:** NICE-TO-HAVE (v2)

### C9. Keyboard Navigation
**What:**
- **Tab** moves focus into the table, then between interactive elements (sort buttons, filter buttons, checkboxes, action buttons)
- **Arrow keys** for grid navigation (when using `role="grid"`): Left/Right between cells, Up/Down between rows
- **Enter/Space** activates focused element (sort toggle, checkbox, action button)
- **Home/End** jump to first/last cell in a row
- **Page Up/Page Down** scroll by visible height
- **Escape** closes any open dropdown/panel
- Single roving tabindex (`tabindex="0"` on focused cell, `-1` on all others)

**When to use `role="grid"` vs `role="table"`:**
- `role="table"`: read-only data display, minimal interactivity. Screen readers announce row/column positions naturally
- `role="grid"`: interactive tables with cell-level focus (editing, cell-level actions). Requires full arrow-key navigation implementation

**Why:** Keyboard accessibility is a WCAG requirement. Power users navigate tables faster with keyboard than mouse. Grid navigation is complex to implement correctly — only use when cells are individually interactive.
**Sources:** W3C WAI ARIA APG (Grid pattern), MDN (grid role), Adrian Roselli (Grid as Anti-Pattern), Accesify
**Importance:** CRITICAL (basic Tab navigation), RECOMMENDED (full grid navigation for editable tables)

---

## D. Responsive & Overflow

### D1. Horizontal Scrolling Strategies
**What:**
- Wrap table in a container with `overflow-x: auto`
- Show scroll shadow/fade on left and right edges to indicate scrollable content
- Scrollbar always visible (not auto-hidden) for discoverability
- Minimum table width prevents columns from compressing below readable thresholds

**Why:** Wide tables are inevitable in enterprise apps. Scroll indicators prevent users from missing columns they can't see.
**Sources:** Pencil & Paper, CSS-Tricks, Ant Design (scroll shadow), Shadcn UI
**Importance:** CRITICAL

### D2. Column Priority / Hiding
**What:**
- Assign priority levels to columns (1 = always visible, 2 = hide on tablet, 3 = hide on mobile)
- "Columns" button lets users toggle column visibility
- Show column count: "Showing 6 of 12 columns"
- Reset to default column set

**Why:** Not all columns are equally important. Hiding low-priority columns preserves readability on smaller viewports without requiring horizontal scroll.
**Sources:** Pencil & Paper, DataTables (Responsive extension), Atlassian
**Importance:** RECOMMENDED

### D3. Stacked/Card View on Mobile
**What:**
- Below breakpoint (~640px), transform rows into cards
- Each card shows field label + value pairs vertically
- Key identifier (name, ID) as card title
- Status badge visible without expanding
- Action buttons in card footer
- Progressive disclosure: show critical fields, expand for all

**Why:** Cards leverage natural vertical scrolling on mobile and eliminate the horizontal scroll problem entirely. Each record becomes self-contained and scannable.
**Sources:** CSS-Tricks (Responsive Data Tables), UXmatters, Medium (Nathan Keen, Michal Jarosz)
**Importance:** RECOMMENDED for v2

### D4. Frozen/Pinned Columns
**What:**
- Pin columns to left or right edge — they remain visible during horizontal scrolling
- Common: pin the first column (identifier/name) and last column (actions)
- Shadow or border on the edge of pinned columns to indicate they're floating
- Pinned section width limited to ~50% of viewport to keep center columns accessible
- Columns that are too wide when pinned auto-unpin (AG Grid approach)

**Why:** When tables require horizontal scroll, pinned columns maintain context. Users always see which row they're looking at (name column) and can always act (actions column).
**Sources:** AG Grid, MUI X, TanStack Table, Material React Table, Pencil & Paper
**Importance:** RECOMMENDED for v2

---

## E. Performance

### E1. Virtual Scrolling for Large Datasets
**What:**
- Only render rows visible in the viewport plus a small buffer (typically 5-10 rows above and below)
- Maintain a constant number of DOM nodes regardless of data size (e.g., 50 DOM rows for 100,000 data rows)
- Use libraries: TanStack Virtual, react-window, react-virtuoso
- Requires fixed or estimated row heights for scroll position calculation
- Variable row heights possible but more complex

**Why:** Rendering 10,000+ table rows causes browser jank, high memory usage, and slow initial paint. Virtual scrolling reduces DOM nodes by 100-1000x, keeping scroll performance smooth.
**Sources:** TanStack Table, DEV Community (morewings), react-virtualized, jsschools
**Importance:** RECOMMENDED for v2 (when table is used with large datasets)

### E2. Lazy Loading
**What:**
- Load first page of data immediately
- Fetch subsequent pages on demand (pagination click, scroll near bottom, or explicit "load more")
- Show loading indicator during fetch (spinner in footer, not full table skeleton)
- Cache loaded pages to avoid re-fetching on back-navigation

**Why:** Loading 10,000 rows upfront is slow and wasteful. Lazy loading keeps initial page load fast.
**Sources:** TanStack Table, DataTables (Scroller), Ant Design ProTable
**Importance:** RECOMMENDED (application-level, not component-level)

### E3. Skeleton Loading States
**What:**
- Show skeleton rows matching the expected layout on initial load
- Skeleton mimics the column widths, row heights, and overall shape of real data
- Number of skeleton rows: match the expected page size (e.g., 10 rows if rows-per-page is 10)
- Animate with a subtle shimmer (pulse or wave)
- Header renders immediately (not skeleton) — it provides context for what's loading
- `aria-busy="true"` on the table during loading
- Skeletons appear for only a few seconds — if data hasn't loaded, switch to an error state

**Why:** Skeleton loading reduces perceived load time by up to 67% compared to spinners. The table shape provides spatial context for what's coming.
**Sources:** Carbon (loading pattern), PatternFly (SkeletonTable), Semrush (Intergalactic), Medium (React 19 skeletons)
**Importance:** CRITICAL

### E4. Optimistic Updates
**What:**
- After inline edit: immediately update the UI, send the request in the background
- If the request fails: revert the cell to its previous value and show an error toast
- For bulk operations: show progress indicator, then result summary

**Why:** Optimistic updates make the UI feel instant. The alternative (spinner → wait → update) feels sluggish for quick edits.
**Sources:** UX Movement (bulk edit), general React patterns
**Importance:** NICE-TO-HAVE (v2)

---

## F. Accessibility

### F1. ARIA Roles and Attributes
**What:**
- Use semantic HTML: `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`
- `<th scope="col">` for column headers, `<th scope="row">` for row headers
- `aria-sort="ascending|descending|none"` on sortable column headers
- `aria-busy="true"` on table during loading
- `role="status"` on empty state message
- `aria-label` on sort buttons, filter buttons, selection checkboxes
- `<caption>` or `aria-label` on the `<table>` element describing its purpose
- For interactive tables: consider `role="grid"` with `role="gridcell"` — but ONLY when cells are individually focusable/editable. Adrian Roselli warns that `role="grid"` is commonly misused

**Sources:** W3C WAI (Tables Tutorial), WebAIM, WCAG 2.2, MDN, Adrian Roselli
**Importance:** CRITICAL

### F2. Screen Reader Row/Column Announcements
**What:**
- Screen readers automatically announce "Row X of Y, Column Z" when navigating HTML tables with proper `<th>` headers
- Column headers are announced as context for each cell: "Name: John Smith, Status: Active"
- Avoid `display: grid` or `display: flex` on table elements — it breaks the implicit table semantics
- For responsive card view: use `aria-label` on each card with the record identifier

**Sources:** W3C WAI, WebAIM, TestParty
**Importance:** CRITICAL

### F3. Keyboard Navigation Patterns
**What:** (See C9 above for detailed patterns)
- At minimum: all interactive elements (buttons, checkboxes, links) must be keyboard accessible via Tab
- Sort buttons, filter buttons, action buttons: focus ring visible on `focus-visible`
- For grid pattern: implement full arrow-key navigation with roving tabindex

**Sources:** W3C WAI APG (Grid pattern), Simple Table
**Importance:** CRITICAL

### F4. Focus Management
**What:**
- When sort is triggered: keep focus on the sort button (don't move focus)
- When filter dropdown closes: return focus to the filter button
- When a row is deleted: move focus to the next row (or previous if last row)
- When pagination changes: move focus to the first data row on the new page (or keep on pagination controls)
- When inline edit is cancelled: return focus to the cell
- Single roving tabindex for grid navigation: only one cell has `tabindex="0"` at a time

**Sources:** W3C WAI APG, KendoReact, general a11y best practices
**Importance:** CRITICAL

### F5. Sort State Announcements
**What:**
- `aria-sort` attribute on `<th>` changes when sort state changes
- Optionally announce sort change via `aria-live="polite"` region: "Table sorted by Name, ascending"
- Include sort direction in the button's `aria-label`: "Sort by Name, currently ascending"

**Sources:** W3C WAI, TestParty, Accesify
**Importance:** CRITICAL

### F6. High Contrast Mode
**What:**
- Test table in Windows High Contrast Mode and forced-colors media query
- Borders must be visible in high contrast (they use `CanvasText` color)
- Status badges: ensure text labels are present (not color-only)
- Focus indicators: must use system highlight colors in forced-colors mode
- Selected row highlight: use a border or outline, not just background color

**Sources:** WCAG 2.2, general a11y
**Importance:** RECOMMENDED

---

## G. Visual Design

### G1. Zebra Striping vs. Hover Highlight
**What:**
- **Zebra striping:** Alternating row backgrounds. Helps horizontal tracking across wide tables
- **Row hover:** Highlight on mouse hover. More interactive, less visual noise
- **Recommendation:** Use hover highlight as default. Offer zebra striping as an option for wide tables. Don't use both intensely — the combination creates too many visual states

**Research findings:**
- A List Apart study: zebra striping showed minimal improvement in accuracy for narrow tables, but helped with wide tables (7+ columns)
- Zebra striping becomes problematic with selection highlights, hover states, disabled rows, and loading states — too many competing background colors
- Modern approach: subtle row hover + good spacing + clear typography achieves the same readability without zebra complexity

**Sources:** A List Apart (Jessica Enders), Felicia Grace (Medium), Pencil & Paper, W3Schools
**Importance:** RECOMMENDED (hover as default, zebra as option)

### G2. Border Styles
**What:**
- **Horizontal lines only (default):** Clean, modern look. Most common pattern. 1px, light gray
- **Full grid:** Both horizontal and vertical lines. Use for dense numerical data or spreadsheet-like views
- **Minimal (no borders):** Relies on spacing and hover states for row separation. Best for simple, sparse tables
- **No vertical borders with zebra striping:** The alternating colors act as row separators; vertical borders add unnecessary noise

**Rules:**
- Never use borders thicker than 1px
- Border color: light gray (low contrast with background) — borders should organize, not dominate
- If zebra-striped: you don't need horizontal borders (the color fills act as separators)
- Vertical borders only when columns contain similar data types that could be confused

**Sources:** UX Movement (9 design techniques), Pencil & Paper, Material Design
**Importance:** RECOMMENDED

### G3. Row Hover States
**What:**
- Subtle background color shift on hover (e.g., surface-1 → surface-2)
- Hover should be visible but not dramatic — it's orientation feedback, not a call to action
- Show row actions (edit, delete) on hover as they appear — but always keep them keyboard-accessible
- For zebra-striped tables: hover color must be distinct from both the odd and even row colors
- Don't suppress hover during loading or on skeleton rows

**Sources:** Material Design, Pencil & Paper, Halo Lab
**Importance:** RECOMMENDED

### G4. Selected Row States
**What:**
- Selected rows get a distinct background color (e.g., primary-tint or surface-3)
- Selected background must be visually distinct from: hover, zebra stripe, default
- Hierarchy: selected > hover > zebra > default
- Checkbox checked state mirrors row selection state
- Show count of selected rows in toolbar: "3 selected"

**Sources:** Material Design, Carbon, Shopify Polaris
**Importance:** CRITICAL (when selection is enabled)

### G5. Active/Focused Cell States
**What:**
- Focus ring on the active cell (2px outline, primary color)
- For grid navigation: focused cell has a clear border/outline
- For tab navigation: focus ring on the interactive element within the cell

**Sources:** W3C WAI APG, KendoReact
**Importance:** CRITICAL for accessibility

### G6. Column Header Styling
**What:**
- Background: slightly darker than data rows (surface-2 or surface-3)
- Typography: same font family, semibold weight, same or slightly smaller size, muted color
- Not uppercase (screen readers spell out uppercase text letter by letter in some modes)
- Sort icons: subtle when inactive, primary color when active
- Adequate click target: full header cell is clickable for sort, not just the text

**Sources:** Carbon, Material Design, Ant Design, Pencil & Paper
**Importance:** CRITICAL

### G7. Sticky Header Shadow
**What:**
- When table scrolls and header becomes sticky, add a subtle `box-shadow` below the header: `0 2px 4px rgba(0,0,0,0.08)`
- Shadow appears on scroll (not when at top) — triggered via `IntersectionObserver` or scroll listener
- Use `box-shadow` for borders on sticky elements, not actual `border` (borders disappear during scroll due to `border-collapse`)
- For pinned columns: add a right-edge shadow on the pinned section

**Sources:** CSS-Tricks, Ryan Mulligan, Stijn de Witt, Ant Design
**Importance:** RECOMMENDED

---

## H. Advanced Features

### H1. Column Configuration Panel
**What:**
- Button (gear icon or "Columns") opens a panel/popover listing all available columns
- Each column has a checkbox for visibility and can be reordered via drag-and-drop
- "Reset to default" button
- Save configuration per user (localStorage or API)
- Show currently hidden column count

**Why:** Different users need different column sets. A dedicated panel is more discoverable than drag-to-reorder on headers.
**Sources:** DataTables (colvis), AG Grid, Ant Design, Shopify Polaris
**Importance:** RECOMMENDED for v2

### H2. Export (CSV, Excel)
**What:**
- Export button in table toolbar
- Options: CSV, Excel (XLSX), PDF, copy to clipboard
- Export respects current filters, sort, and column visibility
- Option to export "current view" vs "all data"
- For large exports: background job with download notification
- Include column headers in export
- Format dates and numbers appropriately for the target format

**Why:** Users need to take data out of the app for reporting, sharing, and analysis. CSV is the universal format; Excel adds formatting.
**Sources:** DataTables (Buttons extension), Webix, Tableau, WPDataTables
**Importance:** RECOMMENDED for v2

### H3. Print View
**What:**
- "Print" button or Ctrl+P support
- Print-optimized stylesheet: remove hover states, sticky positioning, scrolling
- Fit table width to page (may require landscape orientation for wide tables)
- Include table title, filters applied, date printed
- Pagination: all rows on one page (or paginated to physical pages)

**Sources:** DataTables (print button), WPDataTables
**Importance:** NICE-TO-HAVE

### H4. Saved Views / Presets
**What:**
- Let users save a combination of: visible columns, column order, column widths, active filters, sort state, density
- Named presets (e.g., "My view", "Finance review", "Quick scan")
- Default view always available as reset
- Share views via URL parameters

**Why:** Power users create personalized workflows. Saved views eliminate repetitive setup.
**Sources:** AG Grid, Pencil & Paper, enterprise SaaS patterns
**Importance:** NICE-TO-HAVE (v3)

### H5. Column Totals / Aggregation
**What:**
- Footer row showing sum, average, min, max, count per numeric column
- Configurable per column: what aggregation to show
- Grand total row: pinned to bottom, always visible
- Group-level aggregation for grouped tables

**Sources:** AG Grid (grouping-footers), MUI X (aggregation), Material React Table
**Importance:** NICE-TO-HAVE (v2)

### H6. Grouping / Tree Tables
**What:**
- Group rows by a column value (e.g., group by Department)
- Collapsible groups with expand/collapse toggle
- Group header shows: group value, count of rows, aggregations
- Tree tables: parent-child hierarchy (org chart, file system)
- Indent child rows with visual connector lines

**Sources:** AG Grid, MUI X (row-grouping), TanStack Table, Cloudscape
**Importance:** NICE-TO-HAVE (v3)

---

## I. Kvalt-Specific Recommendations

### Current Kvalt Table Component Analysis

The existing `Table.tsx` component (exported as `<Table>`) is well-structured with:

**Already implemented:**
- Column definitions with `key`, `header`, `width`, `align`, `sortable`, `filterable`, `render`
- Single-column sorting with animated sort icons (ChevronsUpDown → ChevronDown/ChevronUp)
- Column-level multi-select filter dropdowns with search (when >12 options)
- Row selection with checkboxes, select-all with indeterminate state
- Horizontal lines (default on), vertical lines (optional), zebra striping, compact mode
- Loading state with skeleton rows and staggered animation
- Empty state with icon, title, description, and action button
- Sticky header
- Footer slot
- Staggered row enter animation with reduced motion support
- Row hover styles (via CSS)
- Focus ring on interactive elements
- aria-sort, aria-busy, aria-label on controls

**Not yet implemented (gaps):**

| Feature | Priority | Phase |
|---------|----------|-------|
| Pagination | CRITICAL | v1 |
| Global search | CRITICAL | v1 |
| Bulk action toolbar | CRITICAL | v1 |
| Cell truncation with tooltip | CRITICAL | v1 |
| Sticky header shadow on scroll | RECOMMENDED | v1 |
| Filter chips (active filter visibility) | RECOMMENDED | v1 |
| Column pinning (frozen columns) | RECOMMENDED | v2 |
| Row expansion / detail panel | RECOMMENDED | v2 |
| Horizontal scroll with overflow indicators | RECOMMENDED | v2 |
| Column resizing | RECOMMENDED | v2 |
| Column reordering | NICE-TO-HAVE | v2 |
| Column visibility toggle panel | RECOMMENDED | v2 |
| Virtual scrolling | RECOMMENDED | v2 |
| Row reordering (drag) | NICE-TO-HAVE | v2 |
| Inline editing | NICE-TO-HAVE | v2 |
| Card view for mobile | RECOMMENDED | v2 |
| Export (CSV, Excel) | RECOMMENDED | v2 |
| Saved views / presets | NICE-TO-HAVE | v3 |
| Column totals / aggregation | NICE-TO-HAVE | v3 |
| Grouping / tree tables | NICE-TO-HAVE | v3 |
| Print view | NICE-TO-HAVE | v3 |
| Multi-column sort | NICE-TO-HAVE | v3 |

### v1 Critical Features (must ship)

1. **Pagination component** — Page controls below the table: current page, total pages, rows-per-page selector (10/25/50/100), prev/next/first/last buttons. Announce page changes to screen readers. Integrate with existing footer slot or replace it.

2. **Global search input** — Search input above the table that filters across all visible columns. Debounced input (300ms). Show result count. Clear button. Can be a `<SearchInput>` above the table or integrated into a toolbar component.

3. **Bulk action toolbar** — Appears when rows are selected. Shows count: "3 items selected". Action buttons for common operations (Delete, Export, etc.) configurable via props. Dismissible with "Clear selection" button.

4. **Cell truncation with tooltip** — Add `truncate` option to `ColumnDef`. Cells with long content show ellipsis and a tooltip on hover with full content. Use `table-layout: fixed` when truncation is active.

5. **Sticky header shadow** — Add subtle `box-shadow` to `<thead>` when scrolled past top. Use `IntersectionObserver` or scroll position check. Shadow appears/disappears smoothly.

6. **Filter chips** — When column filters are active, show removable chips above the table showing which filters are applied. "Clear all filters" link. Improves visibility of filter state.

7. **Table toolbar component** — Compositional area above the table for: title, global search, filter chips, bulk actions, column toggle, export button, density toggle. Consistent layout across all table instances.

### v2 Roadmap Features

1. **Row expansion** — Chevron column, expandable detail area below row, animated expand/collapse using motion tokens
2. **Column pinning** — Pin first/last columns, shadow on pinned edge, respect horizontal scroll
3. **Horizontal scroll indicators** — Left/right fade shadows on scroll container
4. **Column visibility panel** — Popover with column checklist, drag-to-reorder, reset to default
5. **Column resizing** — Drag handle between headers, min-width enforcement, cursor change
6. **Virtual scrolling** — Integrate TanStack Virtual for tables with 500+ rows
7. **Card view for mobile** — Below 640px breakpoint, render as cards with field labels
8. **Export** — CSV and Excel export respecting current view (filters, sort, visible columns)
9. **Inline editing** — Click-to-edit cells, type-appropriate editors, save/cancel

### Documentation Page Structure

The DataTable doc page should be restructured into:

1. **Hero** — "Data Table" title, tagline, overview description
2. **Anatomy section** — Labeled diagram showing: toolbar, header, data rows, selection column, sort indicators, filter icons, pagination, footer
3. **Basic usage** — Minimal example with columns + data
4. **Density variants** — Default, compact, spacious side-by-side
5. **Border styles** — Horizontal lines, vertical lines, full grid, minimal
6. **Sorting** — Interactive demo with sort cycling
7. **Filtering** — Column filters + global search + filter chips
8. **Selection** — Checkboxes, select-all, bulk action toolbar
9. **Pagination** — Page controls, rows-per-page
10. **Cell rendering** — Custom render functions: status badges, avatars, action buttons, links, progress bars
11. **Empty & loading states** — Skeleton, empty with illustration, error state
12. **Sticky header** — Scrollable demo showing shadow on scroll
13. **Responsive** — Horizontal scroll, column priority, card view preview
14. **Accessibility** — ARIA attributes table, keyboard navigation map, screen reader behavior
15. **Kitchen sink** — Full-featured demo combining all features
16. **Props reference** — Full API table for `TableProps` and `ColumnDef`

### Interactive Demos Needed

1. **Sorting playground** — Toggle sortable columns on/off, watch sort indicators
2. **Filter builder** — Apply multiple column filters, see result count update live
3. **Selection + bulk actions** — Select rows, see toolbar appear with actions
4. **Density toggle** — Switch between comfortable/compact/spacious
5. **Border style toggle** — Cycle through border configurations
6. **Column configuration** — Show/hide columns, reorder
7. **Loading states** — Button to trigger loading → skeleton → data appear
8. **Empty states** — Various empty state configurations (no data, no results, error)
9. **Responsive preview** — Viewport width slider showing table → card view transition
10. **Large dataset demo** — 10,000 rows with virtual scrolling, demonstrating performance
11. **Cell type gallery** — Every cell type (text, number, currency, date, status, avatar, actions, progress, tags) in one table

---

## Sources

### Specified Articles (Phase 1)
1. [Designing Tables for Reusability](https://uxdesign.cc/designing-tables-for-reusability-490a3760533) — UX Collective (Ada Rafalowicz & Havana Nguyen)
2. [Designing Big Data Tables: Insights from UX/UI](https://medium.com/@nika.romanenko11/designing-big-data-tables-insights-from-a-ux-ui-perspective-c1600f230f34) — Nika Romanenko
3. [Designing Effective UI/UX Data Tables 101](https://medium.com/@vaishali.samanta/designing-effective-ui-ux-data-tables-101-part-1-09e1599553d4) — Vaishali Samanta
4. [Best Practices for Usable and Efficient Data Table](https://uxplanet.org/best-practices-for-usable-and-efficient-data-table-in-applications-4a1d1fb29550) — Dmitry Sergushkin, UX Planet
5. [Applying UX Principles on Data Tables](https://medium.com/@virginiaracu15/applying-ux-principles-on-data-tables-89298fb1470) — Virginia Racu
6. [Designing Smarter Data Tables](https://uxdesign.cc/designing-smarter-data-tables-8cb15b5371a8) — UX Collective
7. [The Part of Design Systems Nobody Wants to Build](https://medium.muz.li/the-part-of-design-systems-nobody-wants-to-build-ca97e1c8cd85) — Muzli
8. [Designing the Perfect Data Table](https://medium.com/@madurangakodithuwakku/designing-the-perfect-data-table-b1e805657f45) — Maduranga Kodithuwakku
9. [UX Pattern Analysis: Enterprise Data Tables](https://www.pencilandpaper.io/articles/ux-pattern-analysis-enterprise-data-tables) — Pencil & Paper
10. [Let's Design Data Tables](https://uxdesign.cc/lets-design-data-tables-bf065a60e588) — UX Collective
11. [Data Tables Design](https://taras-bakusevych.medium.com/data-tables-design-3c705b106a64) — Taras Bakusevych

### Additional Sources (Phase 2)
12. [Data Tables: Four Major User Tasks](https://www.nngroup.com/articles/data-tables/) — Nielsen Norman Group
13. [How to Fit Big Tables on Small Screens](https://www.nngroup.com/videos/big-tables-small-screens/) — NN/g Video
14. [3 Rules for Better Comparison Tables](https://www.nngroup.com/videos/ux-rules-comparison-tables/) — NN/g Video
15. [Data Tables — Material Design](https://m2.material.io/components/data-tables) — Google Material Design
16. [Data Table — Carbon Design System](https://carbondesignsystem.com/components/data-table/usage/) — IBM Carbon
17. [Dynamic Table — Atlassian Design](https://atlassian.design/components/dynamic-table/) — Atlassian
18. [Index Table — Shopify Polaris](https://polaris-react.shopify.com/components/tables/index-table) — Shopify
19. [Table — Ant Design](https://ant.design/components/table/) — Ant Design
20. [ProTable — Ant Design Pro Components](https://procomponents.ant.design/en-US/components/table/) — Ant Design
21. [Grid (Interactive Tabular Data) Pattern — W3C WAI APG](https://www.w3.org/WAI/ARIA/apg/patterns/grid/) — W3C
22. [Tables Tutorial — W3C WAI](https://www.w3.org/WAI/tutorials/tables/) — W3C
23. [ARIA Grid as an Anti-Pattern](https://adrianroselli.com/2020/07/aria-grid-as-an-anti-pattern.html) — Adrian Roselli
24. [Creating Accessible Tables — WebAIM](https://webaim.org/techniques/tables/data) — WebAIM
25. [Table Accessibility and WCAG Compliance](https://testparty.ai/blog/wcag-tables-accessibility) — TestParty
26. [Responsive Data Tables](https://css-tricks.com/responsive-data-tables/) — CSS-Tricks
27. [Designing Mobile Tables](https://www.uxmatters.com/mt/archives/2020/07/designing-mobile-tables.php) — UXmatters
28. [Zebra Striping: Does it Really Help?](https://alistapart.com/article/zebrastripingdoesithelp/) — A List Apart
29. [The Right Way to Design Table Status Badges](https://uxmovement.substack.com/p/why-youre-designing-table-status) — UX Movement
30. [9 Design Techniques for User-Friendly Tables](https://uxmovement.com/content/9-design-techniques-for-user-friendly-tables/) — UX Movement
31. [The Easiest Way to Bulk Edit Data Tables](https://uxmovement.com/forms/the-easiest-way-to-bulk-edit-data-tables/) — UX Movement
32. [Best Practices for Inline Editing in Table Design](https://uxdworld.com/inline-editing-in-tables-design/) — UX Design World
33. [Best Practices for Providing Actions in Data Tables](https://medium.com/uxdworld/best-practices-for-providing-actions-in-data-tables-d629c6e73ab8) — Saadia Minhas
34. [Bulk Action UX: 8 Design Guidelines](https://www.eleken.co/blog-posts/bulk-actions-ux) — Eleken
35. [Position Sticky and Table Headers](https://css-tricks.com/position-sticky-and-table-headers/) — CSS-Tricks
36. [TanStack Table Documentation](https://tanstack.com/table/latest/docs/introduction) — TanStack
37. [Building a Data Table Component in React](https://shopify.engineering/building-data-table-component-react) — Shopify Engineering
38. [Data Table Design: The Ultimate Guide](https://www.halo-lab.com/blog/the-ultimate-guide-to-designing-data-tables) — Halo Lab
39. [Table UX Best Practices](https://www.uxpin.com/studio/blog/table-ux/) — UXPin
40. [Enterprise UX: Essential Resources for Data Tables](https://stephaniewalter.design/blog/essential-resources-design-complex-data-tables/) — Stephanie Walter
41. [Empty States Pattern — Carbon](https://carbondesignsystem.com/patterns/empty-states-pattern/) — IBM Carbon
42. [Loading Pattern — Carbon](https://carbondesignsystem.com/patterns/loading-pattern/) — IBM Carbon
43. [Table States — Intergalactic/Semrush](https://developer.semrush.com/intergalactic/table-group/table-states/table-states) — Semrush
44. [PatternFly Table Design Guidelines](https://www.patternfly.org/components/table/design-guidelines/) — Red Hat PatternFly
45. [Data Grid Aggregation — MUI X](https://mui.com/x/react-data-grid/aggregation/) — MUI
46. [Baymard Institute — Comparison Features Research](https://baymard.com/blog/provide-comparison-features) — Baymard Institute

---

## Relevance to Kvalt

This research directly informs the Kvalt DataTable component architecture. The existing `<Table>` component has a solid foundation (sorting, filtering, selection, loading/empty states) but needs pagination, global search, bulk actions, truncation, and toolbar composition to be production-ready. The phased roadmap (v1 critical, v2 advanced, v3 power-user) aligns with Kvalt's progressive disclosure philosophy and the Screen Vault demo requirements.

Key architectural decision: consider adopting TanStack Table as the headless logic layer, keeping Kvalt's visual layer as the rendering implementation. This would provide sorting, filtering, pagination, grouping, column pinning, and virtual scrolling logic out of the box, while Kvalt controls every pixel of the UI.
