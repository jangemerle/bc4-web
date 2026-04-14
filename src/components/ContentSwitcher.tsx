/**
 * Design System — ContentSwitcher component
 * Source: Figma / Whatever Design System / node 2814:14291
 *
 * A pill-shaped segmented control for switching between content views.
 * Active item gets a sliding dark indicator.
 *
 * Sizes:    sm (32px) | md (40px) | lg (48px)
 * Variant:  default (border only) | elevated (surface-1 bg + shadow, lifts on hover)
 * Width:    hug (fixed per item) | fill (equal-width items fill container)
 *
 * Usage:
 *   <ContentSwitcher value={view} onChange={setView}>
 *     <ContentSwitcherItem value="list">List</ContentSwitcherItem>
 *     <ContentSwitcherItem value="grid" icon={Grid}>Grid</ContentSwitcherItem>
 *   </ContentSwitcher>
 *
 *   <ContentSwitcher value={view} onChange={setView} variant="elevated" fill>
 *     <ContentSwitcherItem value="a">Option A</ContentSwitcherItem>
 *     <ContentSwitcherItem value="b">Option B</ContentSwitcherItem>
 *   </ContentSwitcher>
 */

import { createContext, useContext, useId, useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { type LucideIcon } from 'lucide-react';
import { Icon } from './Icon';
import { cn } from '../lib/cn';
import { usePress } from '../hooks/usePress';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { spring, duration, ease } from '../tokens/motion';
import { shadows } from '../tokens/shadows';

// ─── Context ─────────────────────────────────────────────────────────────────

export type ContentSwitcherSize = 'sm' | 'md' | 'lg';
export type ContentSwitcherVariant = 'default' | 'elevated';

interface ContentSwitcherContext {
  value?: string;
  onChange?: (value: string) => void;
  size: ContentSwitcherSize;
  fill: boolean;
  layoutId: string;
  reducedMotion: boolean;
}

const SwitcherCtx = createContext<ContentSwitcherContext>({
  size: 'md',
  fill: false,
  layoutId: '',
  reducedMotion: false,
});

// ─── Public types ────────────────────────────────────────────────────────────

export interface ContentSwitcherProps {
  /** Currently selected item value */
  value?: string;
  /** Called when an item is clicked */
  onChange?: (value: string) => void;
  /** Size variant */
  size?: ContentSwitcherSize;
  /** Visual variant — elevated adds surface-1 bg and a shadow that lifts on hover */
  variant?: ContentSwitcherVariant;
  /** Items fill the container width equally */
  fill?: boolean;
  /** Items */
  children: ReactNode;
  /** Additional className on the container */
  className?: string;
}

export interface ContentSwitcherItemProps {
  /** Unique value identifying this item */
  value: string;
  /** Optional leading icon */
  icon?: LucideIcon;
  /** Whether this item is disabled */
  disabled?: boolean;
  /** Label text */
  children: ReactNode;
}

// ─── Size tokens ─────────────────────────────────────────────────────────────

const sizeStyles: Record<ContentSwitcherSize, { height: number; padding: number; px: number; gap: number; text: string; iconSize: 'sm' | 'md'; iconPx?: number }> = {
  sm: { height: 32, padding: 2, px: 12, gap: 4, text: 'text-sm font-semibold', iconSize: 'sm', iconPx: 14 },
  md: { height: 40, padding: 3, px: 16, gap: 6, text: 'text-md font-semibold', iconSize: 'sm' },
  lg: { height: 48, padding: 4, px: 20, gap: 8, text: 'text-md font-semibold', iconSize: 'md' },
};

// ─── Container ───────────────────────────────────────────────────────────────

export function ContentSwitcher({
  value,
  onChange,
  size = 'md',
  variant = 'default',
  fill = false,
  children,
  className,
}: ContentSwitcherProps) {
  const layoutId = useId();
  const reducedMotion = useReducedMotion();
  const s = sizeStyles[size];
  const isElevated = variant === 'elevated';

  return (
    <SwitcherCtx.Provider value={{ value, onChange, size, fill, layoutId, reducedMotion }}>
      <div
        role="tablist"
        className={cn(
          'inline-flex items-center',
          fill && 'flex w-full',
          isElevated && 'shadow-small-2 hover:shadow-medium-2 transition-shadow duration-150',
          className,
        )}
        style={{
          padding: s.padding,
          gap: 2,
          borderRadius: 'var(--radius-xl)',
          border: isElevated ? 'none' : '1px solid var(--color-border)',
          backgroundColor: isElevated ? 'var(--color-surface-1)' : undefined,
        }}
      >
        {children}
      </div>
    </SwitcherCtx.Provider>
  );
}

// ─── Item ────────────────────────────────────────────────────────────────────

export function ContentSwitcherItem({
  value,
  icon,
  disabled = false,
  children,
}: ContentSwitcherItemProps) {
  const ctx = useContext(SwitcherCtx);
  const isActive = ctx.value === value;
  const { isPressed, pressHandlers } = usePress({ disabled });
  const [isHovered, setIsHovered] = useState(false);
  const s = sizeStyles[ctx.size];
  const reducedMotion = ctx.reducedMotion;

  const handleClick = () => {
    if (!disabled && ctx.onChange) {
      ctx.onChange(value);
    }
  };

  const pressScale = reducedMotion ? 1 : isPressed && !disabled ? 0.97 : 1;

  // Text color logic
  const textColor = disabled
    ? 'var(--color-on-surface-subtle-1)'
    : isActive
      ? 'var(--color-on-inverted-surface)'
      : (isHovered || isPressed)
        ? 'var(--color-on-secondary-2)'
        : 'var(--color-on-secondary)';

  // Inactive button background via CSS (browser-level, like Button's transition-colors)
  const buttonBg = !isActive
    ? (isPressed && !disabled
        ? 'var(--color-secondary-2)'
        : isHovered && !disabled
          ? 'var(--color-secondary-1)'
          : 'transparent')
    : 'transparent';

  return (
    <motion.button
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={handleClick}
      onMouseEnter={() => { if (!disabled) setIsHovered(true); }}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'relative font-sans cursor-pointer select-none',
        'outline-none focus-visible:outline focus-visible:outline-2',
        'focus-visible:outline-[var(--color-primary-1)] focus-visible:outline-offset-2',
        s.text,
        ctx.fill && 'flex-1',
        disabled && 'opacity-40 cursor-not-allowed',
        isActive && !disabled && 'cursor-default',
      )}
      style={{
        height: s.height - 2 - s.padding * 2,
        paddingLeft: s.px,
        paddingRight: s.px,
        borderRadius: 'var(--radius-xl)',
        border: 'none',
        color: textColor,
      }}
      animate={{ scale: pressScale, backgroundColor: buttonBg }}
      transition={{
        scale: spring.snappy,
        backgroundColor: reducedMotion
          ? { duration: 0 }
          : isPressed
            ? { duration: 0 }
            : { duration: duration.fast, ease: ease.standard },
      }}
      {...pressHandlers}
    >
      {/* Sliding active indicator */}
      {isActive && (
        <motion.div
          layoutId={ctx.layoutId}
          className="absolute inset-0"
          style={{
            borderRadius: 'var(--radius-xl)',
            backgroundColor: 'var(--color-inverted-surface)',
            boxShadow: shadows[ctx.size === 'lg' ? 'large-2' : 'medium-2'],
          }}
          transition={reducedMotion ? { duration: 0 } : {
            layout: spring.default,
          }}
        />
      )}

      {/* Content — above the indicator */}
      <span
        className="relative z-10 flex items-center justify-center whitespace-nowrap"
        style={{ gap: s.gap }}
      >
        {icon && (s.iconPx ? <Icon icon={icon} sizePx={s.iconPx} /> : <Icon icon={icon} size={s.iconSize} />)}
        {children}
      </span>
    </motion.button>
  );
}
