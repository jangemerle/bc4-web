/**
 * Design System — Tabs component
 * Source: Figma / Topic Board New / node 1928:9794
 *
 * Sizes:     sm (32px, Inter Bold 14px) | md (40px, Inter SemiBold 16px) | lg (50px, Borna Bold 18px)
 * Gap:       28px between tab items
 * Selected:  on-secondary-1 text + 2px bottom indicator (animated slide)
 * Default:   on-surface-subtle-1 text, hover → on-surface
 * Border:    full-width 1px bottom line (border color)
 *
 * Tab items support: icon (left, 4px gap), badge (pill, surface-3 bg)
 *
 * Usage:
 *   <Tabs value={tab} onChange={setTab}>
 *     <Tab value="overview">Overview</Tab>
 *     <Tab value="files" icon={FileText}>Files</Tab>
 *     <Tab value="messages" badge={3}>Messages</Tab>
 *   </Tabs>
 */

import { createContext, useContext, useId, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { type LucideIcon } from 'lucide-react';
import { Icon } from './Icon';
import { Badge } from './Badge';
import { Typo } from './Typo';
import { cn } from '../lib/cn';
import { spring } from '../tokens/motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

// ─── Context ─────────────────────────────────────────────────────────────────

export type TabsSize = 'sm' | 'md' | 'lg';

interface TabsContext {
  value?: string;
  onChange?: (value: string) => void;
  size: TabsSize;
  layoutId: string;
  reducedMotion: boolean;
}

const TabsCtx = createContext<TabsContext>({ size: 'md', layoutId: '', reducedMotion: false });

// ─── Public types ────────────────────────────────────────────────────────────

export interface TabsProps {
  /** Currently selected tab value */
  value?: string;
  /** Called when a tab is clicked */
  onChange?: (value: string) => void;
  /** Size variant */
  size?: TabsSize;
  /** Tab items */
  children: ReactNode;
  /** Additional className */
  className?: string;
}

export interface TabProps {
  /** Unique value identifying this tab */
  value: string;
  /** Tab label */
  children: ReactNode;
  /** Leading icon */
  icon?: LucideIcon;
  /** Badge count */
  badge?: number;
  /** Disabled state */
  disabled?: boolean;
  /** Additional className */
  className?: string;
}

// ─── Size config ─────────────────────────────────────────────────────────────

const sizeConfig: Record<TabsSize, {
  height: string;
  gap: string;          // gap between label and bottom indicator
  font: string;         // text style
  iconSize: 'sm' | 'md';
  iconPx: number;       // icon pixel size for spacing
}> = {
  sm: {
    height: 'h-8',
    gap: 'gap-[11px]',
    font: 'font-sans text-md font-bold tracking-[0.14px]',
    iconSize: 'sm',
    iconPx: 14,
  },
  md: {
    height: 'h-10',
    gap: 'gap-4',
    font: 'font-sans text-base font-semibold tracking-[0.16px]',
    iconSize: 'sm',
    iconPx: 18,
  },
  lg: {
    height: 'h-[50px]',
    gap: 'gap-[23px]',
    font: 'font-display text-lg font-bold',
    iconSize: 'md',
    iconPx: 20,
  },
};

// ─── Tabs container ──────────────────────────────────────────────────────────

export function Tabs({
  value,
  onChange,
  size = 'md',
  children,
  className,
}: TabsProps) {
  const layoutId = useId();
  const reducedMotion = useReducedMotion();

  return (
    <TabsCtx.Provider value={{ value, onChange, size, layoutId, reducedMotion }}>
      <div
        className={cn('relative flex gap-7', sizeConfig[size].height, className)}
        style={{ borderBottom: '1px solid var(--color-border)' }}
        role="tablist"
      >
        {children}
      </div>
    </TabsCtx.Provider>
  );
}

// ─── Tab item ────────────────────────────────────────────────────────────────

export function Tab({
  value,
  children,
  icon,
  badge,
  disabled,
  className,
}: TabProps) {
  const { value: selectedValue, onChange, size, layoutId, reducedMotion } = useContext(TabsCtx);
  const cfg = sizeConfig[size];
  const isSelected = selectedValue === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isSelected}
      disabled={disabled}
      tabIndex={isSelected ? 0 : -1}
      onClick={() => onChange?.(value)}
      onKeyDown={(e) => {
        const tablist = e.currentTarget.parentElement;
        if (!tablist) return;
        const tabs = Array.from(tablist.querySelectorAll<HTMLElement>('[role="tab"]:not(:disabled)'));
        const idx = tabs.indexOf(e.currentTarget);
        let next: number | null = null;

        if (e.key === 'ArrowRight') next = idx < tabs.length - 1 ? idx + 1 : 0;
        else if (e.key === 'ArrowLeft') next = idx > 0 ? idx - 1 : tabs.length - 1;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = tabs.length - 1;

        if (next !== null) {
          e.preventDefault();
          tabs[next].focus();
          tabs[next].click();
        }
      }}
      className={cn(
        'group relative flex flex-col items-start shrink-0',
        'outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-primary-1)] focus-visible:outline-offset-2',
        cfg.gap,
        disabled ? 'cursor-not-allowed opacity-30' : 'cursor-pointer',
        className,
      )}
    >
      {/* Label row: icon + text + badge */}
      <div className="flex items-center gap-1 transition-colors duration-150">
        {icon && (
          <Icon
            icon={icon}
            size={cfg.iconSize}
            className={cn(
              'transition-colors duration-150',
              isSelected
                ? 'text-[var(--color-on-secondary-1)]'
                : 'text-[var(--color-on-surface-subtle-1)] group-hover:text-[var(--color-on-surface)]',
            )}
            style={{
              width: `${cfg.iconPx}px`,
              height: `${cfg.iconPx}px`,
            }}
          />
        )}
        <span
          className={cn(
            cfg.font,
            'whitespace-nowrap text-center transition-colors duration-150',
            isSelected
              ? 'text-[var(--color-on-secondary-1)]'
              : 'text-[var(--color-on-surface-subtle-1)] group-hover:text-[var(--color-on-surface)]',
          )}
        >
          <Typo>{children}</Typo>
        </span>
        {badge !== undefined && (
          <Badge size="sm">{badge}</Badge>
        )}
      </div>

      {/* Bottom indicator — animated slide via layoutId */}
      <div className="w-full shrink-0" style={{ height: 0 }}>
        {isSelected && (
          <motion.div
            layoutId={`tab-indicator-${layoutId}`}
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: '2px',
              backgroundColor: 'var(--color-on-secondary-1)',
            }}
            transition={reducedMotion ? { duration: 0 } : spring.playful}
          />
        )}
      </div>
    </button>
  );
}
