/**
 * Table types and shared constants
 */

import type { LucideIcon } from 'lucide-react';

// ─── Public types ────────────────────────────────────────────────────────────

export type SortDirection = 'asc' | 'desc' | 'none';

export interface ColumnDef<T> {
  key: string;
  header: string;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  filterable?: boolean;
  /** Truncate cell content with ellipsis and show tooltip on hover */
  truncate?: boolean;
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
}

export interface TableProps<T extends Record<string, unknown>> {
  columns: ColumnDef<T>[];
  data: T[];
  selectable?: boolean;
  selectedRows?: Set<number>;
  onSelectionChange?: (indices: number[]) => void;
  sortColumn?: string;
  sortDirection?: SortDirection;
  onSort?: (column: string, direction: SortDirection) => void;
  activeFilters?: Set<string>;
  onFilterClick?: (column: string) => void;
  /** Map of column key → Set of selected filter values (multi-select dropdown) */
  columnFilters?: Record<string, Set<string>>;
  /** Called when a column's filter selection changes */
  onColumnFilterChange?: (column: string, values: Set<string>) => void;
  /** Explicit filter options per column. When provided, the dropdown uses these
   *  instead of extracting unique values from the current (possibly filtered) data.
   *  Map of column key → array of option strings. */
  filterOptions?: Record<string, string[]>;
  horizontalLines?: boolean;
  verticalLines?: boolean;
  zebraStripe?: boolean;
  compact?: boolean;
  loading?: boolean;
  emptyState?: {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: { label: string; onClick: () => void };
  };
  stickyHeader?: boolean;
  footer?: React.ReactNode;
  className?: string;
}

// ─── Focus ring classes ──────────────────────────────────────────────────────

export const focusRing =
  'outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-primary-1)] focus-visible:outline-offset-2';

// ─── Alignment helper ───────────────────────────────────────────────────────

export const alignClass = (align?: 'left' | 'center' | 'right') => {
  if (align === 'center') return 'text-center';
  if (align === 'right') return 'text-right';
  return 'text-left';
};
