import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * SectionHeading — H1/H2 pro marketingové sekce.
 *
 * Velikost a level (h1–h3) řízeny zvlášť — někdy chceme h2 vypadající jako display,
 * někdy h1 v menší velikosti (pro stránky bez velkého hero). Default = h2 + display-l.
 *
 * Typografická pravidla z brand-tokens.md:
 *   - display-2xl (42px+): tracking -0.02em, line-height 1.15
 *   - display-xl (36px):  tracking -0.01em, line-height 1.2
 *   - display-l  (28px):  tracking -0.01em, line-height 1.25
 *   - display-m  (24px):  default tracking, line-height 1.3
 *
 * Font: Manrope (z bc4 character variables: --font-display).
 */

type Size = '2xl' | 'xl' | 'l' | 'm' | 's';
type Level = 'h1' | 'h2' | 'h3';

interface SectionHeadingProps {
  children: ReactNode;
  /** Visual size — default 'l'. Volíme nezávisle na sémantickém levelu. */
  size?: Size;
  /** HTML heading element — default 'h2'. */
  as?: Level;
  /** Optional subheadline pod hlavním headline */
  subheadline?: ReactNode;
  /** Center-align text — default false (left aligned) */
  center?: boolean;
  className?: string;
  id?: string;
}

const sizeClasses: Record<Size, string> = {
  '2xl': 'text-[36px] sm:text-[42px] tracking-[-0.02em] leading-[1.15]',
  xl: 'text-[28px] sm:text-[36px] tracking-[-0.015em] leading-[1.2]',
  l: 'text-[24px] sm:text-[28px] tracking-[-0.01em] leading-[1.25]',
  m: 'text-[20px] sm:text-[24px] leading-[1.3]',
  s: 'text-[18px] sm:text-[20px] leading-[1.35]',
};

export function SectionHeading({
  children,
  size = 'l',
  as = 'h2',
  subheadline,
  center = false,
  className,
  id,
}: SectionHeadingProps) {
  const Heading = as as ElementType;

  return (
    <div className={cn('flex flex-col gap-3', center && 'items-center text-center', className)}>
      <Heading
        id={id}
        className={cn(
          'font-display font-bold text-[var(--color-on-surface)]',
          'text-balance',
          sizeClasses[size],
        )}
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {children}
      </Heading>
      {subheadline && (
        <p
          className={cn(
            'text-base sm:text-lg text-[var(--color-on-surface-subtle-1)]',
            'max-w-2xl text-pretty',
            center && 'mx-auto',
          )}
        >
          {subheadline}
        </p>
      )}
    </div>
  );
}
