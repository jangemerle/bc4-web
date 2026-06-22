import type { ReactNode } from 'react';

/**
 * Curtain — the scroll-over "curtain" effect. A light section above is pinned
 * (`sticky; top:0`) and the dark section below scrolls up to overlap it with a
 * square top edge. Implemented by wrapping the pinned+overlapping pair in a
 * `position:relative` container with both children `sticky; top:0`, the lower
 * one a higher z-index.
 *
 * ⚠️ CRITICAL: do NOT put `overflow-x:hidden` on `body` or any ancestor — it
 * silently turns an ancestor into the scroll container and disables sticky.
 * Clip horizontal overflow on the panels themselves instead.
 */

export function Curtain({ children }: { children: ReactNode }) {
  return <div className="relative">{children}</div>;
}

interface CurtainPanelProps {
  children: ReactNode;
  /** Stacking order — the lower (dark) panel needs the higher value. */
  z?: number;
  className?: string;
  id?: string;
  'aria-labelledby'?: string;
}

export function CurtainPanel({ children, z = 0, className = '', id, ...rest }: CurtainPanelProps) {
  return (
    <section id={id} className={`sticky top-0 ${className}`} style={{ zIndex: z }} {...rest}>
      {children}
    </section>
  );
}
