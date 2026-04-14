/**
 * Design System — Link component
 *
 * Inline text links that inherit typography from their parent.
 * Renders <a> by default. Always underlined (WCAG preferred).
 *
 * Color: --color-on-secondary-1 (blue, same as Button link variant)
 * Hover: darker shade (--color-on-secondary-2)
 * Focus: focus-visible ring
 *
 * Sizes match body scale — use when you need explicit sizing.
 * By default, size/weight/line-height inherit from parent text.
 *
 * Usage:
 *   <p>Read our <Link href="/docs/motion">motion guidelines</Link> for details.</p>
 *   <Link href="/docs" size="sm">Documentation</Link>
 *   <Link href="https://example.com" external>External site</Link>
 */

import { forwardRef, type AnchorHTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { Typo } from './Typo';

// ─── Types ──────────────────────────────────────────────────────────────────

export type LinkSize = 'sm' | 'md' | 'base' | 'lg';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Explicit size — if omitted, inherits from parent text */
  size?: LinkSize;
  /** Opens in new tab with rel="noopener noreferrer" */
  external?: boolean;
  /** Monochrome variant — inherits text color, underline only */
  monochrome?: boolean;
  /** Additional className */
  className?: string;
}

// ─── Size classes ───────────────────────────────────────────────────────────

const SIZE_CLASSES: Record<LinkSize, string> = {
  sm:   'text-sm',    // 12px
  md:   'text-md',    // 14px
  base: 'text-base',  // 16px
  lg:   'text-lg',    // 18px
};

// ─── Link ───────────────────────────────────────────────────────────────────

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  {
    size,
    external,
    monochrome = false,
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <a
      ref={ref}
      className={cn(
        // Base: underline always, smooth transition, inherit font
        'underline underline-offset-2 decoration-1 transition-colors duration-150 cursor-pointer hover:no-underline active:no-underline',
        'outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-primary-1)] focus-visible:outline-offset-2 rounded-s',
        // Color
        monochrome
          ? 'text-inherit decoration-current hover:opacity-70 active:opacity-60'
          : [
              'text-[var(--color-on-secondary-1)]',
              'decoration-[var(--color-on-secondary-1)]/40',
              'hover:text-[var(--color-on-secondary-2)] hover:decoration-[var(--color-on-secondary-2)]',
              'active:opacity-80',
            ],
        // Explicit size (otherwise inherits)
        size && SIZE_CLASSES[size],
        className,
      )}
      {...(external
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : {})}
      {...rest}
    >
      <Typo>{children}</Typo>
    </a>
  );
});
