/**
 * Design System — Chip component
 * Source: Figma / Topic Board New / node 5240:31339
 *
 * Sizes:     sm | md
 * Variants:  default (text only) | icon (with leading icon) | user (with avatar)
 * States:    default | hover (CSS :hover) — only when clickable
 * Removable: optional X button to dismiss
 *
 * Usage:
 *   <Chip>Design</Chip>
 *   <Chip clickable={false}>Read-only tag</Chip>
 *   <Chip size="md">Category</Chip>
 *   <Chip icon={Sparkles}>AI Generated</Chip>
 *   <Chip user={{ initials: 'DT' }}>David T.</Chip>
 *   <Chip removable onRemove={() => {}}>Tag</Chip>
 */

import { X, type LucideIcon } from 'lucide-react';
import { Icon } from './Icon';
import { Typo } from './Typo';
import { cn } from '../lib/cn';

// ─── Public types ─────────────────────────────────────────────────────────────

export type ChipSize = 'sm' | 'md';

export interface ChipUser {
  /** 1–2 character initials shown in the avatar circle */
  initials: string;
}

export interface ChipProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onClick'> {
  size?: ChipSize;
  /** Whether the chip is interactive (default: true) */
  clickable?: boolean;
  /** Leading icon (lucide-react) */
  icon?: LucideIcon;
  /** Show a user avatar with initials */
  user?: ChipUser;
  /** Show a remove (X) button */
  removable?: boolean;
  /** Called when the remove button is clicked */
  onRemove?: () => void;
  /** Click handler — only used when clickable */
  onClick?: React.MouseEventHandler<HTMLElement>;
}

// ─── Size config ──────────────────────────────────────────────────────────────

const sizeClasses: Record<ChipSize, {
  container: string;
  text: string;
  avatarContainer: string;
}> = {
  sm: {
    container: 'px-2 py-[2px] gap-[2px]',         // 8px / 2px
    text: 'text-sm tracking-[0.48px]',              // 12px
    avatarContainer: 'pl-[2px] pr-2 py-[2px]',     // user variant padding
  },
  md: {
    container: 'px-3 py-[3.5px] gap-[2px]',        // 12px / 3.5px
    text: 'text-md tracking-[0.14px]',              // 14px
    avatarContainer: 'pl-[3.5px] pr-3 py-[3.5px]', // user variant padding
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function Chip({
  size = 'sm',
  clickable = true,
  icon,
  user,
  removable = false,
  onRemove,
  children,
  className,
  ...rest
}: ChipProps) {
  const cfg = sizeClasses[size];
  const hasUser = !!user;

  const classes = cn(
    // Base
    'inline-flex items-center rounded-xl',
    'transition-all duration-150',
    // Background
    clickable
      ? 'bg-[var(--color-surface-3)]'
      : 'bg-[var(--color-surface-1)]',
    // Interactive states — only when clickable
    clickable && 'cursor-pointer hover:bg-[var(--color-secondary-2)] hover:shadow-medium-1 hover:text-[var(--color-on-secondary-1)]',
    // Focus ring (clickable only)
    clickable && 'outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-primary-1)] focus-visible:outline-offset-2',
    // Text color
    'text-[var(--color-on-surface)]',
    // Border reset
    'border-none',
    // Padding — user variant has asymmetric padding
    hasUser ? cfg.avatarContainer : cfg.container,
    // Typography
    'font-sans font-bold leading-normal',
    cfg.text,
    className,
  );

  const content = (
    <>
      {/* User avatar */}
      {hasUser && (
        <div className="flex items-center gap-[6px]">
          <div
            className={cn(
              'flex items-center justify-center rounded-xl shrink-0',
              'bg-[var(--color-surface-1)] shadow-small-1',
              size === 'md' ? 'size-5' : 'size-4',
            )}
          >
            <span
              className="font-sans font-bold leading-normal text-2xs tracking-[0.32px]"
              style={{ color: 'var(--color-on-surface)' }}
            >
              {user!.initials}
            </span>
          </div>
          <span><Typo>{children}</Typo></span>
        </div>
      )}

      {/* Icon variant */}
      {!hasUser && icon && (
        <>
          <Icon icon={icon} size="sm" />
          <span><Typo>{children}</Typo></span>
        </>
      )}

      {/* Text only */}
      {!hasUser && !icon && (
        <span><Typo>{children}</Typo></span>
      )}

      {/* Removable X */}
      {removable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className={cn(
            'inline-flex items-center justify-center shrink-0',
            'rounded-xl ml-1 cursor-pointer',
            'opacity-60 hover:opacity-100 transition-opacity',
          )}
          aria-label="Remove"
        >
          <Icon icon={X} size="sm" />
        </button>
      )}
    </>
  );

  if (clickable) {
    return (
      <button type="button" className={classes} {...rest as React.ButtonHTMLAttributes<HTMLButtonElement>}>
        {content}
      </button>
    );
  }

  return (
    <span className={classes} {...rest}>
      {content}
    </span>
  );
}
