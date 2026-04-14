/**
 * ColumnFilterDropdown — Filter dropdown with search
 */

import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { DropdownMenu, DropdownMenuItem, DropdownMenuDivider } from '../DropdownMenu';
import { SearchInput } from '../SearchInput';
import { Icon } from '../Icon';
import { cn } from '../../lib/cn';
import { focusRing } from './types';

const FILTER_SEARCH_THRESHOLD = 12;

interface ColumnFilterDropdownProps {
  columnKey: string;
  uniqueValues: string[];
  selectedValues: Set<string>;
  onToggle: (value: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  isActive: boolean;
}

export function ColumnFilterDropdown({
  columnKey,
  uniqueValues,
  selectedValues,
  onToggle,
  onSelectAll,
  onClearAll,
  isActive,
}: ColumnFilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Reset search whenever the dropdown closes
  useEffect(() => {
    if (!open) setSearch(''); // eslint-disable-line react-hooks/set-state-in-effect
  }, [open]);

  const showSearch = uniqueValues.length > FILTER_SEARCH_THRESHOLD;

  const visibleValues = showSearch && search.trim()
    ? uniqueValues.filter((v) => v.toLowerCase().includes(search.toLowerCase()))
    : uniqueValues;

  const allSelected = uniqueValues.length > 0 && uniqueValues.every((v) => selectedValues.has(v));
  const noneSelected = selectedValues.size === 0;

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        className={cn(
          'inline-flex items-center cursor-pointer bg-transparent border-none p-0 ml-1',
          focusRing,
        )}
        style={{
          color: isActive
            ? 'var(--color-primary-1)'
            : 'var(--color-on-surface-subtle-2)',
        }}
        onClick={() => setOpen((o) => !o)}
        aria-label={`Filter ${columnKey}`}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <Icon icon={Filter} size="sm" />
      </button>

      <DropdownMenu
        open={open}
        onClose={() => setOpen(false)}
        size="sm"
        width="240px"
        className="top-8 left-0"
      >
        {/* Search bar — only when > 12 unique values */}
        {showSearch && (
          <div className="px-1 pb-2">
            <SearchInput
              size="sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch('')}
              placeholder="Search…"
              autoFocus
            />
          </div>
        )}

        {/* Select all / Clear all */}
        <div className="flex items-center justify-between px-3 pb-1.5 pt-0.5">
          <button
            type="button"
            disabled={allSelected}
            onClick={onSelectAll}
            className={cn(
              'font-sans text-sm font-semibold cursor-pointer bg-transparent border-none p-0',
              'transition-colors duration-100',
              focusRing,
            )}
            style={{
              color: allSelected
                ? 'var(--color-on-surface-subtle-2)'
                : 'var(--color-primary-1)',
              opacity: allSelected ? 0.4 : 1,
              cursor: allSelected ? 'default' : 'pointer',
            }}
          >
            Select all
          </button>
          <button
            type="button"
            disabled={noneSelected}
            onClick={onClearAll}
            className={cn(
              'font-sans text-sm font-semibold cursor-pointer bg-transparent border-none p-0',
              'transition-colors duration-100',
              focusRing,
            )}
            style={{
              color: noneSelected
                ? 'var(--color-on-surface-subtle-2)'
                : 'var(--color-on-surface-subtle-1)',
              opacity: noneSelected ? 0.4 : 1,
              cursor: noneSelected ? 'default' : 'pointer',
            }}
          >
            Clear all
          </button>
        </div>

        <DropdownMenuDivider />

        {/* Filter options */}
        {visibleValues.map((val) => (
          <DropdownMenuItem
            key={val}
            checkbox
            selected={selectedValues.has(val)}
            onClick={() => onToggle(val)}
          >
            {val}
          </DropdownMenuItem>
        ))}

        {/* No search results */}
        {showSearch && visibleValues.length === 0 && (
          <div
            className="px-3 py-2 font-sans text-sm font-medium text-center"
            style={{ color: 'var(--color-on-surface-subtle-2)' }}
          >
            No matches
          </div>
        )}
      </DropdownMenu>
    </div>
  );
}
