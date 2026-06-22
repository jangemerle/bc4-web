import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';

/**
 * CtaButton — marketing call-to-action link, styled to the BC4 homepage
 * handoff (final spec: primary shadow 0 8px 22px rgba(53,100,239,.32),
 * radius 10–11px). Colors are bc4 character tokens, not literals.
 *
 * Renders an <a> — homepage CTAs are in-page anchors (#poptavka) or routes.
 */

type Variant = 'primary' | 'outline' | 'white';
type Size = 'md' | 'lg';

interface CtaButtonProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  /** Show a trailing arrow icon. */
  arrow?: boolean;
  className?: string;
  trackingId?: string;
}

const base =
  'group inline-flex items-center justify-center gap-2 font-semibold no-underline rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-1)]';

const sizes: Record<Size, string> = {
  md: 'text-[15px] px-5 py-[11px]',
  lg: 'text-[16px] px-[26px] py-[15px]',
};

const variants: Record<Variant, string> = {
  primary:
    'bg-[var(--color-primary-1)] text-[var(--color-on-primary)] shadow-[0_8px_22px_rgba(53,100,239,0.32)] hover:bg-[var(--color-primary-2)] hover:text-[var(--color-on-primary)]',
  outline:
    'bg-[var(--color-surface-1)] text-[var(--color-on-surface)] border border-[var(--color-border-strong)] hover:bg-[var(--color-secondary-1)] hover:border-[var(--color-primary-1)] hover:text-[var(--color-on-surface)]',
  white:
    'bg-white text-[var(--color-on-secondary-2)] shadow-[0_12px_30px_rgba(4,18,59,0.3)] hover:bg-[var(--color-secondary-1)] hover:text-[var(--color-on-secondary-2)]',
};

export function CtaButton({
  href,
  children,
  variant = 'primary',
  size = 'lg',
  arrow = false,
  className,
  trackingId,
}: CtaButtonProps) {
  return (
    <a href={href} data-tracking-id={trackingId} className={cn(base, sizes[size], variants[variant], className)}>
      {children}
      {arrow && (
        <ArrowRight
          className="h-[18px] w-[18px] transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      )}
    </a>
  );
}
