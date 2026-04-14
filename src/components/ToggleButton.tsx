/**
 * Design System — ToggleButton component
 *
 * A button with a persistent pressed/selected state.
 * Uses aria-pressed for accessibility.
 *
 * Unpressed: secondary outline style (border, transparent bg)
 * Pressed: filled secondary-1 background, primary text
 *
 * Sizes: xs (24px) | sm (32px) | md (40px) | lg (48px)
 *
 * Usage:
 *   <ToggleButton pressed={isBold} onPressedChange={setIsBold} iconOnly={Bold} />
 *   <ToggleButton pressed={page === 3} onPressedChange={() => setPage(3)}>3</ToggleButton>
 */

import { motion } from 'motion/react';
import { type LucideIcon } from 'lucide-react';
import { Icon } from './Icon';
import type { IconSize } from '../tokens/icons';
import { usePress } from '../hooks/usePress';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { spring } from '../tokens/motion';

// ─── Public types ─────────────────────────────────────────────────────────────

export type ToggleButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ToggleButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** Whether the button is in the pressed/selected state */
  pressed: boolean;
  /** Called when the pressed state should change */
  onPressedChange?: (pressed: boolean) => void;
  size?: ToggleButtonSize;
  /** Prepend an icon to the left of the label */
  iconLeft?: LucideIcon;
  /** Render an icon-only toggle (square). Pass aria-label for accessibility. */
  iconOnly?: LucideIcon;
}

// ─── Size tokens ──────────────────────────────────────────────────────────────

const sizeTextPadding: Record<ToggleButtonSize, string> = {
  xs: 'px-2 py-0.5',
  sm: 'px-3 py-1',
  md: 'px-4 py-2',
  lg: 'px-6 py-3',
};

const sizeTextPaddingWithIcon: Record<ToggleButtonSize, string> = {
  xs: 'pl-1.5 pr-2 py-0.5',
  sm: 'pl-2 pr-3 py-1',
  md: 'pl-3 pr-4 py-2',
  lg: 'pl-4 pr-6 py-3',
};

const sizeIconPadding: Record<ToggleButtonSize, string> = {
  xs: 'p-1',
  sm: 'p-2',
  md: 'p-[10px]',
  lg: 'p-3',
};

const sizeIconSize: Record<ToggleButtonSize, IconSize> = {
  xs: 'sm',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
};

const sizeFontClass: Record<ToggleButtonSize, string> = {
  xs: 'text-sm',
  sm: 'text-base',
  md: 'text-base',
  lg: 'text-base',
};

// ─── Component ────────────────────────────────────────────────────────────────

export function ToggleButton({
  pressed,
  onPressedChange,
  size = 'md',
  iconLeft,
  iconOnly,
  children,
  className,
  disabled,
  onClick,
  ...rest
}: ToggleButtonProps) {
  const isIconOnly = !!iconOnly;
  const iconSize = sizeIconSize[size];
  const { isPressed, pressHandlers } = usePress({ disabled });
  const reducedMotion = useReducedMotion();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onPressedChange?.(!pressed);
    onClick?.(e);
  };

  const classes = [
    'inline-flex items-center justify-center gap-2',
    'rounded-xl',
    `font-sans font-bold ${sizeFontClass[size]} leading-normal tracking-[0.16px] whitespace-nowrap`,
    'transition-[color,background-color,border-color] duration-150',
    'cursor-pointer',
    'outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-primary-1)] focus-visible:outline-offset-2',
    'disabled:opacity-40 disabled:cursor-not-allowed',
    // Padding
    isIconOnly
      ? sizeIconPadding[size]
      : iconLeft
        ? sizeTextPaddingWithIcon[size]
        : sizeTextPadding[size],
    // Visual state
    pressed
      ? 'bg-[var(--color-secondary-1)] text-[var(--color-on-secondary-1)] border border-transparent'
      : isPressed
        ? 'bg-[var(--color-secondary-2)] text-[var(--color-on-surface)] border border-transparent'
        : 'border border-[var(--color-surface-4)] text-[var(--color-on-surface)] hover:bg-[var(--color-secondary-1)] hover:border-transparent',
    className,
  ].filter(Boolean).join(' ');

  const pressScale = reducedMotion ? 1 : isPressed ? 0.97 : 1;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onDrag, onDragStart, onDragEnd, onAnimationStart, onAnimationEnd, onAnimationIteration, ...safeRest } = rest;

  return (
    <motion.button
      type="button"
      className={classes}
      disabled={disabled}
      aria-pressed={pressed}
      onClick={handleClick}
      animate={{ scale: pressScale }}
      transition={{ scale: spring.snappy }}
      {...pressHandlers}
      {...safeRest}
    >
      {isIconOnly ? (
        <Icon icon={iconOnly} size={iconSize} />
      ) : (
        <>
          {iconLeft && <Icon icon={iconLeft} size={iconSize} />}
          {children}
        </>
      )}
    </motion.button>
  );
}
