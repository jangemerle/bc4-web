/**
 * Design System — Pagination component
 *
 * Composable page controls using DS buttons.
 * Renders: prev/next buttons, page number toggles, rows-per-page selector, row count.
 *
 * Usage:
 *   <Pagination
 *     page={1}
 *     totalPages={12}
 *     onPageChange={setPage}
 *   />
 *
 *   <Pagination
 *     page={3}
 *     totalPages={20}
 *     onPageChange={setPage}
 *     rowsPerPage={25}
 *     rowsPerPageOptions={[10, 25, 50, 100]}
 *     onRowsPerPageChange={setRowsPerPage}
 *     totalRows={487}
 *   />
 */

import { useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from './Button';
import { Select } from './Select';
import { ToggleButton } from './ToggleButton';

// ─── Public types ─────────────────────────────────────────────────────────────

export interface PaginationProps {
  /** Current page (1-based) */
  page: number;
  /** Total number of pages */
  totalPages: number;
  /** Called when page changes */
  onPageChange: (page: number) => void;
  /** Current rows per page */
  rowsPerPage?: number;
  /** Available rows-per-page options */
  rowsPerPageOptions?: number[];
  /** Called when rows-per-page changes */
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  /** Total row count — used for "Showing X–Y of Z" */
  totalRows?: number;
  /** Show first/last page buttons. Default: true when totalPages > 5 */
  showFirstLast?: boolean;
  /** Max page buttons to show (excluding ellipses). Default: 7 */
  maxButtons?: number;
  /** Size of the buttons. Default: 'sm' */
  size?: 'xs' | 'sm';
}

// ─── Page range calculation ──────────────────────────────────────────────────

function getPageRange(current: number, total: number, max: number): (number | 'ellipsis')[] {
  if (total <= max) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [];
  const sideCount = Math.floor((max - 3) / 2); // pages on each side of current

  // Always show first page
  pages.push(1);

  const rangeStart = Math.max(2, current - sideCount);
  const rangeEnd = Math.min(total - 1, current + sideCount);

  // Left ellipsis
  if (rangeStart > 2) {
    pages.push('ellipsis');
  }

  // Middle range
  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i);
  }

  // Right ellipsis
  if (rangeEnd < total - 1) {
    pages.push('ellipsis');
  }

  // Always show last page
  if (total > 1) {
    pages.push(total);
  }

  return pages;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Pagination({
  page,
  totalPages,
  onPageChange,
  rowsPerPage,
  rowsPerPageOptions,
  onRowsPerPageChange,
  totalRows,
  showFirstLast,
  maxButtons = 7,
  size = 'sm',
}: PaginationProps) {
  const showFL = showFirstLast ?? totalPages > 5;
  const pages = useMemo(() => getPageRange(page, totalPages, maxButtons), [page, totalPages, maxButtons]);

  // Row range text: "Showing 51–75 of 287"
  const rowRangeText = useMemo(() => {
    if (totalRows == null || rowsPerPage == null) return null;
    const start = (page - 1) * rowsPerPage + 1;
    const end = Math.min(page * rowsPerPage, totalRows);
    return `${start}–${end} of ${totalRows}`;
  }, [page, rowsPerPage, totalRows]);

  if (totalPages <= 1 && !rowRangeText) return null;

  return (
    <nav
      className="flex items-center justify-between gap-4 flex-wrap"
      aria-label="Pagination"
    >
      {/* Left: row range + rows-per-page */}
      <div className="flex items-center gap-3">
        {rowRangeText && (
          <span
            className="font-sans text-sm whitespace-nowrap"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            {rowRangeText}
          </span>
        )}

        {rowsPerPageOptions && onRowsPerPageChange && (
          <div className="flex items-center gap-2">
            <span
              className="font-sans text-sm whitespace-nowrap"
              style={{ color: 'var(--color-on-surface-subtle-2)' }}
            >
              Rows
            </span>
            <div className="w-[72px]">
              <Select
                size="sm"
                value={String(rowsPerPage)}
                options={rowsPerPageOptions.map((opt) => ({
                  value: String(opt),
                  label: String(opt),
                }))}
                onChange={(val) => {
                  onRowsPerPageChange(Number(val));
                  onPageChange(1);
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Right: page controls */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          {/* First page */}
          {showFL && (
            <Button
              variant="secondary"
              size={size}
              iconOnly={ChevronsLeft}
              onClick={() => onPageChange(1)}
              disabled={page === 1}
              aria-label="First page"
            />
          )}

          {/* Previous */}
          <Button
            variant="secondary"
            size={size}
            iconOnly={ChevronLeft}
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            aria-label="Previous page"
          />

          {/* Page numbers */}
          {pages.map((p, i) =>
            p === 'ellipsis' ? (
              <span
                key={`ellipsis-${i}`}
                className="font-sans text-sm px-1"
                style={{ color: 'var(--color-on-surface-subtle-2)' }}
                aria-hidden
              >
                ...
              </span>
            ) : (
              <ToggleButton
                key={p}
                size={size}
                pressed={page === p}
                onPressedChange={() => onPageChange(p)}
                aria-label={`Page ${p}`}
                aria-current={page === p ? 'page' : undefined}
              >
                {String(p)}
              </ToggleButton>
            ),
          )}

          {/* Next */}
          <Button
            variant="secondary"
            size={size}
            iconOnly={ChevronRight}
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            aria-label="Next page"
          />

          {/* Last page */}
          {showFL && (
            <Button
              variant="secondary"
              size={size}
              iconOnly={ChevronsRight}
              onClick={() => onPageChange(totalPages)}
              disabled={page === totalPages}
              aria-label="Last page"
            />
          )}
        </div>
      )}
    </nav>
  );
}
