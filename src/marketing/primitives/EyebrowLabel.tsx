import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * EyebrowLabel — "section label" pattern.
 *
 * Malé velké písmo, monospace nebo wide tracking, sekce ho používá nad headlinem
 * jako kontextové návěstí. Pattern z Tailwind a Stripe marketingových stránek —
 * signalizuje "tohle je technicky precizní content", a vytváří vizuální hierarchii
 * mezi sekcemi bez toho, aby okupoval prostor jako další headline.
 *
 * Použití:
 *   <EyebrowLabel>CO TO ŘEŠÍ</EyebrowLabel>
 *   <SectionHeading>Tři vzorce, které vám kradou čas.</SectionHeading>
 */

interface EyebrowLabelProps {
  children: ReactNode;
  className?: string;
  /** Když je true, použije monospace font (default je sans-serif s wide tracking) */
  mono?: boolean;
  /** Volitelné HTML id — pro aria-labelledby vazby ze sekce */
  id?: string;
}

export function EyebrowLabel({ children, className, mono = false, id }: EyebrowLabelProps) {
  return (
    <p
      id={id}
      className={cn(
        'text-xs font-semibold uppercase',
        mono ? 'font-mono tracking-wider' : 'tracking-[0.12em]',
        'text-[var(--color-on-surface-subtle-1)]',
        className,
      )}
    >
      {children}
    </p>
  );
}
