import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { NavGlow } from '@/marketing/motion/NavGlow';

/**
 * MarketingHero — shared top-of-page hero shell for interior marketing pages
 * (/funkce, /kontakt, …). Mirrors the homepage hero treatment: the section
 * extends up behind the transparent sticky header (so no grey strip shows) and
 * carries the pulsing sound-wave glow. Drop hero content inside.
 *
 * The -72px margin pulls the section under the 72px header; the matching top
 * padding pushes the content back below the nav.
 */

interface MarketingHeroProps {
  children: ReactNode;
  className?: string;
  id?: string;
  'aria-labelledby'?: string;
}

export function MarketingHero({ children, className, id, ...rest }: MarketingHeroProps) {
  return (
    <section
      id={id}
      className={cn('relative overflow-hidden bg-[var(--color-surface-1)] pb-[clamp(48px,6vw,80px)]', className)}
      style={{ marginTop: '-72px', paddingTop: 'calc(72px + clamp(40px, 5vw, 72px))' }}
      {...rest}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <NavGlow
          loop
          loopDuration={4.2}
          sizes={[552, 960, 1368]}
          alphas={[0.16, 0.09, 0.045]}
          blur={12}
          inDuration={0.9}
          style={{ left: '50%', top: 'calc(4% - 160px)' }}
        />
      </div>
      <div className="relative">{children}</div>
    </section>
  );
}
