/**
 * GlassSurface — frosted-glass backdrop primitive.
 *
 * Applies a semi-opaque tinted background + backdrop-filter blur using
 * the glass tokens. Three variants: subtle, default, strong.
 *
 * See src/tokens/glass.ts for the full performance rulebook.
 *
 * Usage:
 *   <GlassSurface variant="default">…</GlassSurface>
 *   <GlassSurface variant="strong" tint="var(--color-surface-2)">…</GlassSurface>
 *
 * When animating the surface itself (e.g. fading in), set `animating`
 * to true for the duration of the animation so the browser gets a
 * will-change hint. Clear it afterwards to free GPU memory.
 */

import { forwardRef } from 'react';
import { glass, glassBackground, type GlassVariant } from '../tokens/glass';

interface GlassSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Glass intensity: subtle (6px), default (12px), strong (20px). */
  variant?: GlassVariant;
  /** CSS color for the tint — defaults to var(--color-bg). */
  tint?: string;
  /** Set will-change: backdrop-filter while true. Clear when animation ends. */
  animating?: boolean;
}

export const GlassSurface = forwardRef<HTMLDivElement, GlassSurfaceProps>(
  ({
    variant = 'default',
    tint = 'var(--color-bg)',
    animating = false,
    style,
    children,
    ...rest
  }, ref) => {
    const token = glass[variant];
    const background = glassBackground(tint, token.opacity);

    return (
      <div
        ref={ref}
        style={{
          background,
          backdropFilter: token.blur,
          WebkitBackdropFilter: token.blur,
          willChange: animating ? 'backdrop-filter' : undefined,
          ...style,
        }}
        {...rest}
      >
        {children}
      </div>
    );
  }
);
GlassSurface.displayName = 'GlassSurface';

export type { GlassSurfaceProps };
