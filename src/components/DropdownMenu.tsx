/**
 * Design System — DropdownMenu component
 * Source: Figma / Topic Board New / node 7944:36720
 *
 * Structure:  Floating panel with action items, optional search, dividers
 * Sizes:      sm (32px items, 2px gap) | md (40px items, 1px gap, optional search)
 * Corners:    radius-lg (12px)
 * Shadow:     large-3 (0 20px 40px rgba(0,0,0,0.32))
 * Padding:    8px all around
 *
 * Action item states:
 *   Default:   transparent bg
 *   Hover:     surface-3 bg
 *   Active:    surface-4 bg
 *   Selected:  inverted-surface bg + on-inverted-surface text + checkmark (single-select)
 *              OR surface-3 bg + filled checkbox (multi-select)
 *   Disabled:  opacity-30, cursor-not-allowed
 *
 * Usage:
 *   <DropdownMenu open={open} onClose={close}>
 *     <DropdownMenuItem icon={Plus} onClick={add}>Add item</DropdownMenuItem>
 *     <DropdownMenuItem icon={Pencil}>Edit</DropdownMenuItem>
 *     <DropdownMenuDivider />
 *     <DropdownMenuItem icon={Trash2}>Delete</DropdownMenuItem>
 *   </DropdownMenu>
 *
 *   <DropdownMenu open={open} onClose={close} size="md" search>
 *     <DropdownMenuItem checkbox selected>Option A</DropdownMenuItem>
 *     <DropdownMenuItem checkbox>Option B</DropdownMenuItem>
 *   </DropdownMenu>
 */

import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, type LucideIcon } from 'lucide-react';
import { Icon } from './Icon';
import { Checkbox } from './Checkbox';
import { UserAvatar } from './UserAvatar';
import { SearchInput } from './SearchInput';
import { Typo } from './Typo';
import { cn } from '../lib/cn';
import { spring, ease, duration } from '../tokens/motion';
import { shadows } from '../tokens/shadows';
import { useReducedMotion } from '../hooks/useReducedMotion';

// ─── Viewport margin for dropdown positioning ────────────────────────────────

const VIEWPORT_MARGIN = 20;

// ─── Animation constants ────────────────────────────────────────────────────

const SHADOW_LARGE  = shadows['large-3'];

const panelVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    transition: {
      ...spring.snappy,
      opacity: { duration: duration.fast, ease: ease.exit },
    },
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      ...spring.default,
      opacity: { duration: duration.base, ease: ease.enter },
    },
  },
};

// ─── Context ─────────────────────────────────────────────────────────────────

type DropdownMenuSize = 'sm' | 'md';
const SizeContext = createContext<DropdownMenuSize>('sm');

// ─── Public types ────────────────────────────────────────────────────────────

export interface DropdownMenuProps {
  /** Whether the menu is visible */
  open: boolean;
  /** Called when the menu should close (click outside, Escape) */
  onClose: () => void;
  /** Menu items */
  children: React.ReactNode;
  /** Size variant — sm: 32px rows, md: 40px rows with optional search */
  size?: DropdownMenuSize;
  /** Show search field at top (md only) */
  search?: boolean;
  /** Controlled search value */
  searchValue?: string;
  /** Called when the search value changes */
  onSearchChange?: (value: string) => void;
  /** Search placeholder */
  searchPlaceholder?: string;
  /** Panel width */
  width?: string;
  /** Additional className for the panel */
  className?: string;
  /** Ref to the trigger element — clicks inside it won't close the menu */
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export interface DropdownMenuItemProps {
  /** Item label */
  children: React.ReactNode;
  /** Leading icon */
  icon?: LucideIcon;
  /** Show checkbox (multi-select mode) */
  checkbox?: boolean;
  /** Whether the item is selected */
  selected?: boolean;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** User variant — shows avatar + name + optional caption (md only) */
  user?: {
    initials?: string;
    src?: string;
    name: string;
    caption?: string;
  };
  /** Click handler */
  onClick?: () => void;
  /** Additional className */
  className?: string;
}

// ─── DropdownMenu ────────────────────────────────────────────────────────────

export function DropdownMenu({
  open,
  onClose,
  children,
  size = 'sm',
  search,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search',
  width,
  className,
  triggerRef,
}: DropdownMenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // Keyboard: Escape to close + Arrow keys to navigate items
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Home' || e.key === 'End') {
        e.preventDefault();
        const items = ref.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not(:disabled)');
        if (!items || items.length === 0) return;

        const currentIndex = Array.from(items).findIndex(el => el === document.activeElement);

        let nextIndex: number;
        if (e.key === 'ArrowDown') nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        else if (e.key === 'ArrowUp') nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        else if (e.key === 'Home') nextIndex = 0;
        else nextIndex = items.length - 1;

        items[nextIndex].focus();
      }
    };
    document.addEventListener('keydown', handler);

    // Focus selected item (or first item) when menu opens
    // Double rAF to wait for Motion's AnimatePresence to mount children
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const selected = ref.current?.querySelector<HTMLElement>('[role="menuitem"][aria-selected="true"]');
        const first = ref.current?.querySelector<HTMLElement>('[role="menuitem"]:not(:disabled)');
        (selected ?? first)?.focus({ preventScroll: true });
      });
    });

    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Close on click outside (exclude trigger element)
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (ref.current && !ref.current.contains(target)) {
        // If a triggerRef is provided, don't close when clicking the trigger
        // — the trigger's own toggle handler will handle open/close
        if (triggerRef?.current?.contains(target)) return;
        onClose();
      }
    };
    // Delay to avoid catching the click that opened the menu
    const timeout = setTimeout(() => {
      document.addEventListener('mousedown', handler);
    }, 0);
    return () => {
      clearTimeout(timeout);
      document.removeEventListener('mousedown', handler);
    };
  }, [open, onClose, triggerRef]);

  // Viewport-fit correction — keeps the panel ≥20px from every viewport edge.
  // Uses CSS `translate` (separate from CSS `transform`) so it never fights
  // Motion's scale / opacity WAAPI animations which run via `transform`.
  // Direct DOM mutation (no setState) means zero re-renders and no visible flicker.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!open) {
      el.style.translate = '';
      return;
    }

    // Reset any previous correction before measuring
    el.style.translate = '';

    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let dx = 0;
    let dy = 0;

    // Horizontal — push left if overflowing right edge, push right if overflowing left
    if (rect.right > vw - VIEWPORT_MARGIN) dx = vw - VIEWPORT_MARGIN - rect.right;
    if (rect.left + dx < VIEWPORT_MARGIN)  dx = VIEWPORT_MARGIN - rect.left;

    // Vertical — push up if overflowing bottom edge, push down if overflowing top
    if (rect.bottom > vh - VIEWPORT_MARGIN) dy = vh - VIEWPORT_MARGIN - rect.bottom;
    if (rect.top + dy < VIEWPORT_MARGIN)    dy = VIEWPORT_MARGIN - rect.top;

    // Guard: if the correction is unreasonably large the element is inside an
    // off-screen animated container (e.g. a page-enter animation hasn't run yet).
    // In that case skip — the natural layout will position it correctly once the
    // container animates into view.
    const MAX_CORRECTION = 400;
    if (Math.abs(dx) > MAX_CORRECTION || Math.abs(dy) > MAX_CORRECTION) return;

    if (dx !== 0 || dy !== 0) {
      el.style.translate = `${Math.round(dx)}px ${Math.round(dy)}px`;
    }
  }, [open]);

  const defaultWidth = size === 'sm' ? '280px' : '320px';

  return (
    <SizeContext.Provider value={size}>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={ref}
            role="menu"
            variants={reducedMotion ? undefined : panelVariants}
            initial={reducedMotion ? { opacity: 1 } : "hidden"}
            animate={reducedMotion ? { opacity: 1 } : "visible"}
            exit={reducedMotion ? { opacity: 0 } : "hidden"}
            className={cn(
              'absolute z-50 overflow-hidden rounded-lg p-1.5',
              'bg-[var(--color-surface-1)]',
              className,
            )}
            style={{ width: width ?? defaultWidth, transformOrigin: 'top left', boxShadow: SHADOW_LARGE }}
            // Note: viewport-fit translate is applied imperatively via useLayoutEffect
          >
            {/* Search (md only) — uses DS SearchInput, autofocused */}
            {search && size === 'md' && (
              <div className="pb-3">
                <SearchInput
                  size="md"
                  value={searchValue ?? ''}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  onClear={() => onSearchChange?.('')}
                  placeholder={searchPlaceholder}
                  autoFocus
                />
              </div>
            )}

            {/* Items */}
            <div className={cn('flex flex-col', size === 'sm' ? 'gap-0.5' : 'gap-px')}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SizeContext.Provider>
  );
}

// ─── DropdownMenuItem ────────────────────────────────────────────────────────

export function DropdownMenuItem({
  children,
  icon,
  checkbox,
  selected,
  disabled,
  user,
  onClick,
  className,
}: DropdownMenuItemProps) {
  const size = useContext(SizeContext);
  const [itemHovered, setItemHovered] = useState(false);

  // Selected without checkbox → dark bg + white text + checkmark on right
  const isSelectedSingle = selected && !checkbox;
  // Selected with checkbox → surface-3 bg + filled checkbox
  const isSelectedMulti = selected && checkbox;

  return (
    <button
      type="button"
      role="menuitem"
      aria-selected={selected || undefined}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setItemHovered(true)}
      onMouseLeave={() => setItemHovered(false)}
      className={cn(
        'group flex items-center rounded-m transition-colors duration-150 w-full text-left',
        'outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-primary-1)] focus-visible:outline-offset-2 focus-visible:z-10 relative',
        'font-sans text-md font-semibold tracking-[0.14px]',
        size === 'sm' ? 'h-8' : 'h-10',
        // Cursor
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        // Background
        isSelectedSingle
          ? 'bg-[var(--color-inverted-surface)]'
          : isSelectedMulti
            ? 'bg-[var(--color-surface-3)]'
            : '',
        // Hover / Active (not for selected-dark or disabled)
        !isSelectedSingle && !disabled && 'hover:bg-[var(--color-surface-3)] active:bg-[var(--color-surface-4)]',
        // Disabled
        disabled && 'opacity-30',
        className,
      )}
      style={{
        color: isSelectedSingle
          ? 'var(--color-on-inverted-surface)'
          : 'var(--color-on-surface)',
      }}
    >
      {user ? (
        /* ── User variant ─────────────────────────────────── */
        <div className="flex items-center gap-2 px-1.5">
          <UserAvatar
            size="md"
            initials={user.initials}
            src={user.src}
          />
          <div className="flex flex-col">
            <span className="font-sans text-md font-semibold leading-normal">
              {user.name}
            </span>
            {user.caption && (
              <span
                className="font-sans text-sm font-medium leading-normal tracking-[0.24px]"
                style={{
                  color: isSelectedSingle
                    ? 'var(--color-on-inverted-surface)'
                    : 'var(--color-on-surface-subtle-1)',
                }}
              >
                {user.caption}
              </span>
            )}
          </div>
        </div>
      ) : (
        /* ── Standard variant ─────────────────────────────── */
        <div className="flex items-center flex-1 px-2.5">
          {/* Checkbox — uses the DS Checkbox component with stroke-draw animation */}
          {checkbox && (
            <div className="shrink-0 mr-2 pointer-events-none flex items-center">
              <Checkbox
                size="sm"
                checked={!!isSelectedMulti}
                disabled={disabled}
                hovered={itemHovered}
                readOnly
                tabIndex={-1}
              />
            </div>
          )}

          {/* Icon */}
          {icon && (
            <div className="shrink-0 mr-2">
              <Icon icon={icon} size="sm" />
            </div>
          )}

          {/* Label */}
          <span className="flex-1 truncate"><Typo>{children}</Typo></span>

          {/* Checkmark for single-select */}
          {isSelectedSingle && (
            <Icon icon={Check} size="sm" className="shrink-0 ml-2" />
          )}
        </div>
      )}
    </button>
  );
}

// ─── DropdownMenuDivider ─────────────────────────────────────────────────────

export function DropdownMenuDivider() {
  return (
    <div className="h-5 flex items-center" role="separator">
      <div className="w-full h-px" style={{ backgroundColor: 'var(--color-border)' }} />
    </div>
  );
}
