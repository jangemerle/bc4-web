import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Container — horizontální centrování + max-width.
 *
 * Marketingové sekce mají typicky tři šířky:
 *   - 'narrow' (640px)  — long-form text content (FAQ odpovědi, blog post)
 *   - 'default' (1120px) — standard sekce, hero, většina layoutů
 *   - 'wide' (1280px)   — galerie, široké tabulky, screen vault
 *   - 'full'           — bez max-width (pro pozadí, full-bleed sekce)
 */

type Width = 'narrow' | 'default' | 'wide' | 'full';

interface ContainerProps {
  children: ReactNode;
  width?: Width;
  /** HTML element — default 'div'. Použít 'section', 'article' kde dává sémantický smysl. */
  as?: ElementType;
  className?: string;
}

const widthClasses: Record<Width, string> = {
  narrow: 'max-w-[640px]',
  default: 'max-w-[1120px]',
  wide: 'max-w-[1280px]',
  full: 'max-w-none',
};

export function Container({
  children,
  width = 'default',
  as: Component = 'div',
  className,
}: ContainerProps) {
  return (
    <Component className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', widthClasses[width], className)}>
      {children}
    </Component>
  );
}
