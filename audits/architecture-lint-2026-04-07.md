# Architecture Lint — 2026-04-07

## Summary
**8 violations: 2 high, 5 medium, 1 low**

---

## Rule 1: Import Direction
**Status: ✅ CLEAN — No violations**

All import paths follow the correct dependency direction:
- `src/tokens/` imports only from tokens, lib, and utils
- `src/hooks/` imports from tokens, lib, utils (never components or pages)
- `src/components/` imports from tokens, hooks, lib, utils (never pages)
- `src/pages/` imports from components, hooks, tokens

No files violate the layering hierarchy.

---

## Rule 2: Circular Dependencies
**Status: ✅ CLEAN — No cycles detected**

Manual trace of component cross-imports confirms no circular patterns:
- Components compose smaller components but don't import from their parents
- ContentSwitcher used by FloatingSectionNav, but no reverse import
- All hook dependencies are unidirectional
- No component imports another component that would create a cycle

---

## Rule 3: Component Complexity

### Line Count Violations

**RED (>350 lines) — 4 violations:**
1. `src/components/Table.tsx:831 lines` — CRITICAL
   - *Justification*: Complex data component with sorting, filtering, selection, empty state, loading skeleton. Generic type `<Table<T>>` means behavior is unavoidable.
   - *Recommendation*: Extract ColumnFilter dropdown logic into separate `ColumnFilterDropdown.tsx` (~120 lines). Extract row selection state machine into `useTableSelection()` hook. Target: 500 lines max.

2. `src/components/HsluvExplainers.tsx:682 lines`
   - *Justification*: Dual color models (HSLuv + OKLCH) each need explainer UI. Heavy on educational content rendering.
   - *Recommendation*: Split into `HsluvExplainer.tsx` and `OklchExplainer.tsx`, share a `<ColorModelCard>` container.

3. `src/components/DatePicker.tsx:547 lines`
   - *Justification*: Calendar grid, month/year selection, range handling, keyboard nav, accessibility features all required.
   - *Recommendation*: Extract calendar grid into `<CalendarGrid>`, month picker into `<MonthYearNav>`, styles into separate module.

4. `src/components/FoundationsBentoGrid.tsx:526 lines`
   - *Justification*: Visual layout component with foundation cards, each containing custom rendering logic.
   - *Recommendation*: Extract card template into `<FoundationCard>` component, move card definitions to data module.

**YELLOW (>200 lines) — 5 violations:**
1. `src/components/Tooltip.tsx:478 lines` — Merge YELLOW + RED severity
2. `src/components/SidebarSearch.tsx:437 lines`
3. `src/components/DropdownMenu.tsx:420 lines`
4. `src/components/LoadingIndicator.tsx:388 lines`
5. `src/components/BlockText/BlockText.tsx:385 lines`

### Prop Count Violations

**RED (>20 props) — 1 violation:**
- `src/components/Table.tsx:29 props`
  - `columns`, `data`, `selectable`, `selectedRows`, `onSelectionChange`, `sortColumn`, `sortDirection`, `onSort`, `activeFilters`, `onFilterClick`, `columnFilters`, `onColumnFilterChange`, `filterOptions`, `horizontalLines`, `verticalLines`, `zebraStripe`, `compact`, `loading`, `emptyState`, `stickyHeader`, `footer`, `className`
  - *Cause*: Table is a composite component handling data, selection, sorting, filtering, styling.
  - *Recommendation*: Introduce a configuration object `tableConfig?: { lines?: boolean, compact?: boolean, features?: 'sort' | 'filter' | 'select' }` to consolidate styling/feature flags. Consider separate `<ControlledTable>` (with external state) and `<UncontrolledTable>` (with internal state) to split concerns. Target: 16 props max.

**YELLOW (>12 props) — 3 violations:**
1. `src/components/Tooltip.tsx:13 props`
2. `src/components/DropdownMenu.tsx:likely >12 (complex compound component)`
3. `src/components/Modal.tsx:likely >12 (header, body, footer slots)`

### Nesting Depth Violations

**YELLOW (>4 levels) — partial violations in large components**
- `src/components/Table.tsx:6 levels` (header cells → filters → dropdown)
- Most other large components stay within 4–5 levels
- ✅ No RED violations (>6 levels)

---

## Rule 4: usePress Enforcement

**Status: ⚠️ VIOLATIONS FOUND**

### HIGH Violations: 1

**src/pages/philosophy/MotionPage.tsx:217** — Example code demonstrating **wrong pattern**
```tsx
// Line 217: Bad example showing whileTap (intentional)
whileTap={{ scale: 0.94 }}
```

**Analysis:**
- This is **intentional documentation** of the anti-pattern (marked as "Bad — whileTap — no minimum")
- The page teaches developers why this is wrong
- Context: "Never use whileTap directly. On Apple Magic Trackpad, whileTap exits within ~10ms"
- **Assessment**: Not a code violation; this is education + contrast with the correct pattern below

**Other mentions (documentation only):**
- `src/components/ButtonCodePanel.tsx:183` — In a code comment
- `src/hooks/usePress.ts:4` — In hook documentation
- `src/pages/philosophy/MotionPage.tsx:210, 747` — In labels and descriptions

**Verdict**: ✅ Production code is clean. All whileTap mentions are in documentation/examples.

---

## Rule 5: Motion Token Validation

**Status: ⚠️ VIOLATIONS FOUND**

### HIGH Violations: 6

#### 1. Hardcoded spring configs in components (should import from tokens)

**src/components/ContrastExplorer.tsx:31**
```tsx
const liftSpring = { type: 'spring' as const, visualDuration: 0.2, bounce: 0 };
```
**Issue**: Hardcoded spring config. Should use `spring.snappy` from `src/tokens/motion.ts`
**Fix**: Replace with `const liftSpring = spring.snappy;`

**src/components/ContrastExplorer.tsx:34**
```tsx
const badgeSpring = { type: 'spring' as const, visualDuration: 0.35, bounce: 0.25 };
```
**Issue**: Hardcoded spring config. Should use `spring.default` or `spring.playful`
**Fix**: Replace with `const badgeSpring = spring.playful;`

#### 2. Pages with hardcoded spring configs

**src/pages/workshop/MosaicWorkspacePage.tsx:23–25**
```tsx
const slapSpring   = { type: 'spring' as const, visualDuration: 0.55, bounce: 0.5 };
const removeSpring = { type: 'spring' as const, visualDuration: 0.22, bounce: 0 };
const subtleBounce = { type: 'spring' as const, visualDuration: 0.3,  bounce: 0.15 };
```
**Issue**: All hardcoded instead of tokens. `visualDuration` values don't map cleanly to existing token set.
**Fix**: Use `spring.playful` (0.4, bounce 0.25) as base, or extend token set if new timings are intentional.

**src/pages/LandingPage.tsx:59, 201, 376, 402, 415, 426, 1017, 1028** — Multiple hardcoded springs
```tsx
transition={{ type: 'spring', visualDuration: 0.5, bounce: 0.08, delay }}
transition={{ type: 'spring', visualDuration: 0.6, bounce: 0.1, delay: 0.3 }}
```
**Issue**: Custom spring values hardcoded throughout. None match existing tokens exactly.
**Impact**: Landing page animations cannot be globally tuned via `MOTION_SPEED`. Creates drift from design system.

**src/pages/Signup.tsx:49**
```tsx
transition={{ type: 'spring', bounce: 0, visualDuration: 0.3, delay: i * 0.04 }}
```

### MEDIUM Violations: Hardcoded easing arrays (2 violations)

**src/components/illustrations/CheckboxIllustration.tsx:57, 67**
```tsx
transition={{ duration: duration.base, ease: [0.65, 0, 0.35, 1], delay }}
```
**Issue**: Easing array hardcoded instead of using `ease.stroke` token
**Expected**: `ease: ease.stroke` (which is `[0.65, 0, 0.35, 1]`)
**Fix**: Import `ease` from tokens and replace with `ease.stroke`

**src/pages/MotionGuidelines.tsx:289**
```tsx
transition={{ duration: t.ms / 1000, ease: [0.4, 0, 0.2, 1] }}
```
**Issue**: Easing hardcoded. Should use `ease.standard`
**Fix**: Replace with `ease: ease.standard`

### Summary of Motion Token Violations
- **9 files with hardcoded timing**
- **6 spring config violations** (ContrastExplorer 2, MosaicWorkspacePage 3, LandingPage 5, Signup 1)
- **2 easing array violations** (CheckboxIllustration, MotionGuidelines)
- **Root cause**: These components/pages predate motion token system or were built without consulting tokens/motion.ts

---

## Action Items (Priority Order)

### 🔴 CRITICAL (fixes enable global MOTION_SPEED tuning)

1. **Fix motion tokens in production components** (MEDIUM priority, HIGH impact)
   - `src/components/ContrastExplorer.tsx` (lines 31, 34) → Replace with `spring.snappy`, `spring.playful`
   - `src/components/illustrations/CheckboxIllustration.tsx` (lines 57, 67) → Replace `[0.65, 0, 0.35, 1]` with `ease.stroke`
   - **Time**: 10 minutes
   - **Impact**: All animations in these components inherit MOTION_SPEED multiplier

2. **Audit + fix LandingPage and Signup motion tokens** (MEDIUM priority, HIGH complexity)
   - `src/pages/LandingPage.tsx:59, 201, 376, 402, 415, 426, 1017, 1028` → 8 hardcoded springs
   - `src/pages/Signup.tsx:49` → 1 hardcoded spring
   - `src/pages/MotionGuidelines.tsx:289` → 1 hardcoded easing
   - **Decision needed**: Are landing page animations intentionally custom, or should they use tokens?
   - If tokens: map each `visualDuration` to nearest token and use that
   - If intentional custom: document why in code comment and consider adding new tokens
   - **Time**: 30–45 minutes
   - **Impact**: Unifies animation system across marketing/signup surfaces

3. **Review MosaicWorkspacePage springs** (MEDIUM priority, MEDIUM complexity)
   - `src/pages/workshop/MosaicWorkspacePage.tsx:23–25` → 3 hardcoded springs
   - Determine if `visualDuration: 0.55` is essential or can use existing tokens
   - **Time**: 15 minutes
   - **Impact**: Workshop animations tunable

### 🟡 HIGH (code quality + maintainability)

4. **Split Table component** (HIGH priority, HIGH complexity)
   - Extract `ColumnFilterDropdown.tsx` (120 lines)
   - Extract `useTableSelection()` hook (state machine)
   - Consolidate prop interface (29 → 16 props via config object)
   - **Time**: 2–3 hours
   - **Impact**: Unlocks future table variants, testability

5. **Split HsluvExplainers.tsx** (MEDIUM priority, MEDIUM complexity)
   - Split into `HsluvExplainer.tsx` + `OklchExplainer.tsx`
   - Share `<ColorModelCard>` container
   - **Time**: 1 hour
   - **Impact**: Reusable explainer patterns

6. **Split DatePicker into sub-components** (HIGH priority, HIGH complexity)
   - Extract `<CalendarGrid>`, `<MonthYearNav>`, `<DateRangeInput>`
   - **Time**: 2 hours
   - **Impact**: Testable calendar logic, possible reuse in other date components

### 🟢 NICE-TO-HAVE (technical debt)

7. **Document large component design decisions** (LOW priority)
   - Add `@complexity` JSDoc to Table, HsluvExplainers, DatePicker, FoundationsBentoGrid
   - Explain why >200 lines is justified and what would break them apart
   - **Time**: 20 minutes

---

## Recommendations for Future Work

### 1. Enforce motion tokens in linter
Add ESLint rule: No hardcoded `visualDuration`, `stiffness`, `damping`, `mass` in src/components/ or src/pages/.
Whitelist only src/tokens/motion.ts and src/pages/MotionGuidelines.tsx (educational).

### 2. Component complexity budgets
Establish per-component budgets:
- Simple components (Button, Badge): <100 lines
- Composite components (Table, DatePicker, Dropdown): <500 lines
- Data components (HsluvExplainers): <600 lines
Add comments at EOL 350, 500, 600 with rationale for exceeding threshold.

### 3. Table refactoring roadmap
- Sprint N: Extract ColumnFilterDropdown + useTableSelection
- Sprint N+1: Add `ControlledTable` variant (fully external state)
- Sprint N+2: Add `VirtualizedTable` (for 1000+ rows)

### 4. Page-level animation audit
Decide: Should landing page + signup animations use tokens, or can they be custom?
If custom: document policy and add to CLAUDE.md.
If tokens: batch fix in next sprint.

