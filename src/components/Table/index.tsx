/**
 * Design System — Table component
 *
 * Column-definition + data array pattern.
 * Generic component: <Table<T>> where T extends Record<string, unknown>.
 *
 * Features:
 *   - Sortable columns with animated sort icons
 *   - Filterable columns
 *   - Row selection with checkboxes (select-all / indeterminate)
 *   - Horizontal / vertical lines, zebra striping, compact mode
 *   - Loading state with skeleton rows
 *   - Empty state with icon, title, description, and action
 *   - Sticky header
 *   - Footer slot
 *   - Staggered row enter animation
 *   - Reduced motion support
 *
 * Usage:
 *   <Table columns={cols} data={rows} />
 *   <Table columns={cols} data={rows} selectable zebraStripe />
 *   <Table columns={cols} data={[]} emptyState={{ title: 'No results' }} />
 *   <Table columns={cols} data={rows} loading />
 */

import { useMemo, useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/cn';
import { duration, ease } from '../../tokens/motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { TableHeader } from './TableHeader';
import { TableBody } from './TableBody';
import { TableSkeleton } from './TableSkeleton';
import { TableEmpty } from './TableEmpty';
import { TableFooter } from './TableFooter';
import {
  type TableProps,
  type SortDirection,
  type ColumnDef,
} from './types';

// Re-export public types
export type { SortDirection, ColumnDef, TableProps };

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  selectable = false,
  selectedRows,
  onSelectionChange,
  sortColumn,
  sortDirection = 'none',
  onSort,
  activeFilters,
  onFilterClick,
  columnFilters,
  onColumnFilterChange,
  filterOptions,
  horizontalLines = true,
  verticalLines = false,
  zebraStripe = false,
  compact = false,
  loading = false,
  emptyState,
  stickyHeader = false,
  footer,
  className,
}: TableProps<T>) {
  const reducedMotion = useReducedMotion();
  const [headerShadow, setHeaderShadow] = useState(false);
  const tableWrapperRef = useRef<HTMLDivElement>(null);

  // Detect scroll to add shadow to sticky header
  useEffect(() => {
    if (!stickyHeader) return;
    const wrapper = tableWrapperRef.current;
    if (!wrapper) return;
    // Find the nearest scrollable ancestor
    let scrollEl: HTMLElement | null = wrapper.parentElement;
    while (scrollEl) {
      const { overflowY } = getComputedStyle(scrollEl);
      if (overflowY === 'auto' || overflowY === 'scroll') break;
      scrollEl = scrollEl.parentElement;
    }
    const target = scrollEl || wrapper;
    const onScroll = () => {
      const rect = wrapper.getBoundingClientRect();
      const containerRect = target.getBoundingClientRect();
      setHeaderShadow(rect.top < containerRect.top);
    };
    target.addEventListener('scroll', onScroll, { passive: true });
    return () => target.removeEventListener('scroll', onScroll);
  }, [stickyHeader]);

  // ── Derived state ────────────────────────────────────────────────────────

  const totalColumns = (selectable ? 1 : 0) + columns.length;

  const selection = selectedRows ?? new Set<number>();
  const allSelected = data.length > 0 && selection.size === data.length;
  const someSelected = selection.size > 0 && !allSelected;

  const skeletonRowCount = Math.max(data.length, 5);

  // ── Sort cycling ─────────────────────────────────────────────────────────

  const handleSort = (columnKey: string) => {
    if (!onSort) return;
    let next: SortDirection = 'asc';
    if (sortColumn === columnKey) {
      if (sortDirection === 'asc') next = 'desc';
      else if (sortDirection === 'desc') next = 'none';
      else next = 'asc';
    }
    onSort(columnKey, next);
  };

  // ── Selection handlers ───────────────────────────────────────────────────

  const handleSelectAll = () => {
    if (!onSelectionChange) return;
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(data.map((_, i) => i));
    }
  };

  const handleSelectRow = (index: number) => {
    if (!onSelectionChange) return;
    const next = new Set(selection);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    onSelectionChange(Array.from(next));
  };

  // ── Dimension tokens ─────────────────────────────────────────────────────

  const rowHeight = compact ? 36 : 50;
  const cellPadding = compact ? '0 12px' : '0 16px';

  // ── Row animation ────────────────────────────────────────────────────────

  const rowVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: (i: number) => ({
        opacity: 1,
        transition: reducedMotion
          ? { duration: 0 }
          : {
              duration: duration.fast,
              ease: ease.enter,
              delay: i * (duration.instant * 0.3),
            },
      }),
    }),
    [reducedMotion],
  );

  // ── Empty state ──────────────────────────────────────────────────────────

  const showEmpty = data.length === 0 && !loading;

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div ref={tableWrapperRef} className={cn('w-full', className)}>
      <table
        className="w-full border-collapse"
        style={{ fontFamily: 'var(--font-sans)' }}
        aria-busy={loading || undefined}
      >
        <TableHeader
          columns={columns}
          selectable={selectable}
          loading={loading}
          allSelected={allSelected}
          someSelected={someSelected}
          handleSelectAll={handleSelectAll}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          activeFilters={activeFilters}
          onFilterClick={onFilterClick}
          columnFilters={columnFilters}
          onColumnFilterChange={onColumnFilterChange}
          filterOptions={filterOptions}
          data={data}
          horizontalLines={horizontalLines}
          verticalLines={verticalLines}
          stickyHeader={stickyHeader}
          headerShadow={headerShadow}
          rowHeight={rowHeight}
          cellPadding={cellPadding}
          reducedMotion={reducedMotion}
        />

        <tbody>
          {loading && (
            <TableSkeleton
              columns={columns}
              selectable={selectable}
              skeletonRowCount={skeletonRowCount}
              horizontalLines={horizontalLines}
              verticalLines={verticalLines}
              zebraStripe={zebraStripe}
              rowHeight={rowHeight}
              cellPadding={cellPadding}
              reducedMotion={reducedMotion}
            />
          )}

          {showEmpty && (
            <TableEmpty
              totalColumns={totalColumns}
              emptyState={emptyState}
              reducedMotion={reducedMotion}
            />
          )}

          {!loading && (
            <TableBody
              columns={columns}
              data={data}
              selectable={selectable}
              selection={selection}
              handleSelectRow={handleSelectRow}
              horizontalLines={horizontalLines}
              verticalLines={verticalLines}
              zebraStripe={zebraStripe}
              rowHeight={rowHeight}
              cellPadding={cellPadding}
              rowVariants={rowVariants}
            />
          )}
        </tbody>
      </table>

      {/* ── Footer ────────────────────────────────────────────────── */}
      {footer && <TableFooter footer={footer} />}

      {/* ── Row hover styles ──────────────────────────────────────── */}
      <style>{`
        .group\\/row:hover {
          background-color: var(--color-surface-2) !important;
        }
        ${zebraStripe
          ? `.group\\/row:nth-child(odd):hover {
              background-color: var(--color-surface-2) !important;
            }
            .group\\/row:nth-child(even):hover {
              background-color: var(--color-surface-3) !important;
            }`
          : ''}
      `}</style>
    </div>
  );
}
