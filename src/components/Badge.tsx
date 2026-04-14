/**
 * Design System — Badge component
 * Source: Figma / Topic Board New / node 1928:9521
 *
 * Sizes:     sm (16px min-w, 10px text) | md (20px min-w, 12px text)
 * Variants:  neutral (surface-3 bg) | accent (danger-1 bg, white text)
 *
 * Usage:
 *   <Badge>3</Badge>
 *   <Badge variant="accent">5</Badge>
 *   <Badge size="sm">2</Badge>
 *   <Badge size="sm" variant="accent">2</Badge>
 */

import { cn } from '../lib/cn';
import { Typo } from './Typo';

// ─── Public types ─────────────────────────────────────────────────────────────

export type BadgeSize = 'sm' | 'md';
export type BadgeVariant = 'neutral' | 'accent';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Size variant */
  size?: BadgeSize;
  /** Color variant */
  variant?: BadgeVariant;
}

// ─── Size config ──────────────────────────────────────────────────────────────

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'min-w-[16px] px-[5px] py-[0.5px] text-xs tracking-[0.4px]',   // 10px text
  md: 'min-w-[20px] px-[6px] py-px text-sm tracking-[0.48px]',         // 12px text
};

// ─── Component ────────────────────────────────────────────────────────────────

export function Badge({
  size = 'md',
  variant = 'neutral',
  children,
  className,
  ...rest
}: BadgeProps) {
  const isAccent = variant === 'accent';

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-xl',
        'font-sans font-bold leading-normal text-center',
        sizeClasses[size],
        isAccent
          ? 'bg-[var(--color-danger-1)] text-[var(--color-on-danger)]'
          : 'bg-[var(--color-surface-3)] text-[var(--color-on-surface)]',
        className,
      )}
      {...rest}
    >
      <Typo>{children}</Typo>
    </span>
  );
}
