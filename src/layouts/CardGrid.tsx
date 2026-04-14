/**
 * CardGrid — grid of concept cards (Motion "Personality", Design Principles, etc.)
 */

import { cn } from '../lib/cn';

interface CardGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
}

export function CardGrid({ children, columns = 3 }: CardGridProps) {
  const colClass = columns === 2
    ? 'grid-cols-1 md:grid-cols-2'
    : columns === 4
    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    : 'grid-cols-1 md:grid-cols-3';

  return (
    <div className={cn('grid gap-5', colClass)}>
      {children}
    </div>
  );
}

interface CardGridCardProps {
  title: string;
  children: React.ReactNode;
}

CardGrid.Card = function CardGridCard({ title, children }: CardGridCardProps) {
  return (
    <div
      className="rounded-lg p-10 flex flex-col gap-5"
      style={{ backgroundColor: 'var(--color-surface-1)' }}
    >
      <h3
        className="font-display font-bold text-headline-m"
        style={{ color: 'var(--color-on-surface)' }}
      >
        {title}
      </h3>
      <div className="font-sans text-base" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
        {children}
      </div>
    </div>
  );
};
