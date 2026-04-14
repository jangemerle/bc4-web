/**
 * TableHeader — The <thead> section
 */

import { Icon } from '../Icon';
import { Checkbox } from '../Checkbox';
import { Filter } from 'lucide-react';
import { cn } from '../../lib/cn';
import { SortIcon } from './SortIcon';
import { ColumnFilterDropdown } from './ColumnFilterDropdown';
import { focusRing, alignClass, type SortDirection, type ColumnDef } from './types';
import { shadows } from '../../tokens/shadows';

interface TableHeaderProps<T extends Record<string, unknown>> {
  columns: ColumnDef<T>[];
  selectable: boolean;
  loading: boolean;
  allSelected: boolean;
  someSelected: boolean;
  handleSelectAll: () => void;
  sortColumn?: string;
  sortDirection: SortDirection;
  onSort: (columnKey: string) => void;
  activeFilters?: Set<string>;
  onFilterClick?: (column: string) => void;
  columnFilters?: Record<string, Set<string>>;
  onColumnFilterChange?: (column: string, values: Set<string>) => void;
  filterOptions?: Record<string, string[]>;
  data: unknown[];
  horizontalLines: boolean;
  verticalLines: boolean;
  stickyHeader: boolean;
  headerShadow: boolean;
  rowHeight: number;
  cellPadding: string;
  reducedMotion: boolean;
}

export function TableHeader<T extends Record<string, unknown>>({
  columns,
  selectable,
  loading,
  allSelected,
  someSelected,
  handleSelectAll,
  sortColumn,
  sortDirection,
  onSort,
  activeFilters,
  onFilterClick,
  columnFilters,
  onColumnFilterChange,
  filterOptions,
  data,
  horizontalLines,
  verticalLines,
  stickyHeader,
  headerShadow,
  rowHeight,
  cellPadding,
  reducedMotion,
}: TableHeaderProps<T>) {
  const getAriaSort = (col: ColumnDef<T>): 'ascending' | 'descending' | 'none' | undefined => {
    if (!col.sortable) return undefined;
    if (sortColumn !== col.key) return 'none';
    if (sortDirection === 'asc') return 'ascending';
    if (sortDirection === 'desc') return 'descending';
    return 'none';
  };

  return (
    <thead
      className={cn(
        stickyHeader && 'sticky top-0 z-10',
      )}
      style={{
        backgroundColor: 'var(--color-surface-2)',
        boxShadow: headerShadow ? shadows['small-2'] : 'none',
        transition: 'box-shadow 0.15s ease',
      }}
    >
      <tr>
        {/* Checkbox column header */}
        {selectable && (
          <th
            scope="col"
            className="font-sans text-sm font-semibold"
            style={{
              width: 50,
              minWidth: 50,
              maxWidth: 50,
              height: rowHeight,
              padding: 0,
              color: 'var(--color-on-surface-subtle-1)',
              borderBottom: horizontalLines ? '1px solid var(--color-border)' : undefined,
              borderRight: verticalLines ? '1px solid var(--color-border)' : undefined,
            }}
          >
            <div className="flex items-center justify-center h-full">
              {loading ? (
                <Checkbox size="sm" disabled checked={false} onChange={() => {}} />
              ) : (
                <Checkbox
                  size="sm"
                  checked={allSelected || someSelected}
                  indeterminate={someSelected}
                  onChange={handleSelectAll}
                  aria-label="Select all rows"
                />
              )}
            </div>
          </th>
        )}

        {/* Data column headers */}
        {columns.map((col, colIdx) => (
          <th
            key={col.key}
            scope="col"
            aria-sort={getAriaSort(col)}
            className={cn(
              'font-sans text-sm font-semibold',
              alignClass(col.align),
            )}
            style={{
              width: col.width,
              height: rowHeight,
              padding: cellPadding,
              color: 'var(--color-on-surface-subtle-1)',
              borderBottom: horizontalLines ? '1px solid var(--color-border)' : undefined,
              borderRight:
                verticalLines && colIdx < columns.length - 1
                  ? '1px solid var(--color-border)'
                  : undefined,
            }}
          >
            <div className="flex items-center gap-1">
              {/* Sortable: wrap in button */}
              {col.sortable ? (
                <button
                  type="button"
                  className={cn(
                    'inline-flex items-center gap-1 cursor-pointer bg-transparent border-none p-0 font-sans text-sm font-semibold',
                    focusRing,
                  )}
                  style={{ color: 'inherit' }}
                  onClick={() => onSort(col.key)}
                  aria-label={`Sort by ${col.header}`}
                >
                  {col.header}
                  <SortIcon
                    direction={sortColumn === col.key ? sortDirection : 'none'}
                    reducedMotion={reducedMotion}
                  />
                </button>
              ) : (
                <span>{col.header}</span>
              )}

              {/* Filter dropdown (new API) */}
              {col.filterable && onColumnFilterChange && (() => {
                const colValues =
                  filterOptions?.[col.key] ??
                  Array.from(new Set(data.map((row) => String((row as Record<string, unknown>)[col.key] ?? '')))).sort();
                const selected = columnFilters?.[col.key] ?? new Set<string>();
                return (
                  <ColumnFilterDropdown
                    columnKey={col.key}
                    uniqueValues={colValues}
                    selectedValues={selected}
                    onToggle={(val) => {
                      const next = new Set(selected);
                      if (next.has(val)) next.delete(val);
                      else next.add(val);
                      onColumnFilterChange(col.key, next);
                    }}
                    onSelectAll={() => onColumnFilterChange(col.key, new Set(colValues))}
                    onClearAll={() => onColumnFilterChange(col.key, new Set())}
                    isActive={(columnFilters?.[col.key]?.size ?? 0) > 0}
                  />
                );
              })()}

              {/* Filter button (legacy toggle API) */}
              {col.filterable && !onColumnFilterChange && onFilterClick && (
                <button
                  type="button"
                  className={cn(
                    'inline-flex items-center cursor-pointer bg-transparent border-none p-0 ml-1',
                    focusRing,
                  )}
                  style={{
                    color:
                      activeFilters?.has(col.key)
                        ? 'var(--color-on-secondary-1)'
                        : 'var(--color-on-surface-subtle-2)',
                  }}
                  onClick={() => onFilterClick(col.key)}
                  aria-label={`Filter ${col.header}`}
                  aria-pressed={activeFilters?.has(col.key) || false}
                >
                  <Icon icon={Filter} size="sm" />
                </button>
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}
