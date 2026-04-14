/**
 * Design System — TableToolbar component
 *
 * Compositional area above a Table for: title, global search,
 * filter chips, bulk actions, and custom actions.
 *
 * Adapts layout based on what's provided — minimal when few features,
 * full toolbar when all slots are used.
 *
 * Usage:
 *   <TableToolbar
 *     title="Users"
 *     search={search}
 *     onSearchChange={setSearch}
 *     filterChips={[{ label: 'Status: Active', onRemove: () => {} }]}
 *     selectedCount={3}
 *     bulkActions={[{ label: 'Delete', icon: Trash2, onClick: handleDelete, variant: 'danger-subtle' }]}
 *     onClearSelection={clearSelection}
 *   />
 */

import { AnimatePresence, motion } from 'motion/react';
import { X, type LucideIcon } from 'lucide-react';
import { SearchInput } from './SearchInput';
import { Button, type ButtonVariant } from './Button';
import { spring, duration, ease } from '../tokens/motion';

// ─── Public types ─────────────────────────────────────────────────────────────

export interface FilterChip {
  label: string;
  onRemove: () => void;
}

export interface BulkAction {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  variant?: ButtonVariant;
}

export interface TableToolbarProps {
  /** Table title */
  title?: string;
  /** Global search value */
  search?: string;
  /** Called when search input changes */
  onSearchChange?: (value: string) => void;
  /** Search placeholder */
  searchPlaceholder?: string;
  /** Active filter chips */
  filterChips?: FilterChip[];
  /** Called to clear all filters */
  onClearAllFilters?: () => void;
  /** Number of selected rows — triggers bulk action mode */
  selectedCount?: number;
  /** Bulk action buttons shown when rows are selected */
  bulkActions?: BulkAction[];
  /** Called to clear row selection */
  onClearSelection?: () => void;
  /** Custom actions rendered on the right (e.g., export button, density toggle) */
  actions?: React.ReactNode;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TableToolbar({
  title,
  search,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filterChips,
  onClearAllFilters,
  selectedCount = 0,
  bulkActions,
  onClearSelection,
  actions,
}: TableToolbarProps) {
  const hasSelection = selectedCount > 0;
  const hasFilters = filterChips && filterChips.length > 0;

  return (
    <div className="flex flex-col gap-3 mb-4">
      {/* Row 1: Title / search / actions — or bulk action bar */}
      <AnimatePresence mode="wait">
        {hasSelection ? (
          <motion.div
            key="bulk"
            className="flex items-center justify-between gap-4 px-4 py-2.5 rounded-lg"
            style={{ backgroundColor: 'var(--color-secondary-1)' }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={spring.snappy}
          >
            <div className="flex items-center gap-3">
              <span
                className="font-sans text-sm font-bold whitespace-nowrap"
                style={{ color: 'var(--color-on-secondary-1)' }}
              >
                {selectedCount} selected
              </span>
              <button
                type="button"
                className="font-sans text-sm font-semibold cursor-pointer bg-transparent border-none p-0 underline"
                style={{ color: 'var(--color-on-secondary-2)' }}
                onClick={onClearSelection}
              >
                Clear
              </button>
            </div>
            {bulkActions && (
              <div className="flex items-center gap-2">
                {bulkActions.map((action) => (
                  <Button
                    key={action.label}
                    variant={action.variant || 'secondary'}
                    size="sm"
                    iconLeft={action.icon}
                    onClick={action.onClick}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="default"
            className="flex items-center justify-between gap-4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={spring.snappy}
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {title && (
                <h3
                  className="font-display font-bold text-lg whitespace-nowrap shrink-0"
                  style={{ color: 'var(--color-on-surface)' }}
                >
                  {title}
                </h3>
              )}
              {onSearchChange != null && (
                <div className="max-w-[320px] flex-1">
                  <SearchInput
                    size="sm"
                    value={search || ''}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onClear={() => onSearchChange('')}
                    placeholder={searchPlaceholder}
                  />
                </div>
              )}
            </div>
            {actions && (
              <div className="flex items-center gap-2 shrink-0">
                {actions}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Row 2: Filter chips */}
      {hasFilters && !hasSelection && (
        <motion.div
          className="flex items-center gap-2 flex-wrap"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ opacity: { duration: duration.fast, ease: ease.enter } }}
        >
          {filterChips!.map((chip) => (
            <span
              key={chip.label}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-sans text-xs font-semibold"
              style={{
                backgroundColor: 'var(--color-secondary-1)',
                color: 'var(--color-on-secondary-1)',
              }}
            >
              {chip.label}
              <button
                type="button"
                className="inline-flex items-center justify-center cursor-pointer bg-transparent border-none p-0 rounded-full hover:bg-[var(--color-secondary-2)]"
                style={{ color: 'var(--color-on-secondary-2)', width: 16, height: 16 }}
                onClick={chip.onRemove}
                aria-label={`Remove filter: ${chip.label}`}
              >
                <X size={10} strokeWidth={2.5} />
              </button>
            </span>
          ))}
          {onClearAllFilters && filterChips!.length > 1 && (
            <button
              type="button"
              className="font-sans text-xs font-semibold cursor-pointer bg-transparent border-none p-0"
              style={{ color: 'var(--color-on-surface-subtle-2)' }}
              onClick={onClearAllFilters}
            >
              Clear all
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}
