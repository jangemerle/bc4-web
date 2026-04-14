/**
 * GridBackground — scoped repeating-pattern surface primitive.
 *
 * By default reads the active character's `--bg-pattern` + `--bg-pattern-size`
 * CSS variables, so Kavárna (or any character with a backgroundPattern seed)
 * paints through automatically. Pass explicit props to override for a scoped
 * section — e.g. a hero block that wants a denser dot grid regardless of theme.
 *
 * Built-in patterns (`pattern` prop): 'dots' | 'lines' | 'cross'.
 * Pass `pattern="custom"` + `image` + `size` for a fully custom background.
 *
 * Usage:
 *   <GridBackground>…</GridBackground>                     // follows character
 *   <GridBackground pattern="dots" size={20} />            // scoped dots
 *   <GridBackground pattern="lines" color="#E85A48" />     // scoped custom color
 *   <GridBackground pattern="custom" image="url(...)" size="40px 40px" />
 */

import { forwardRef } from 'react';

export type GridPattern = 'dots' | 'lines' | 'cross' | 'custom' | 'inherit';

interface GridBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Built-in pattern or 'inherit' (read CSS vars, default) or 'custom' (use image/size). */
  pattern?: GridPattern;
  /** Grid step in px (or CSS string). Used by dots/lines/cross. Default 24. */
  size?: number | string;
  /** Dot/line color. Any CSS color. Default uses --color-border. */
  color?: string;
  /** For pattern="custom": full background-image value. */
  image?: string;
}

function sizeCss(size: number | string): string {
  return typeof size === 'number' ? `${size}px ${size}px` : size;
}

function buildPattern(
  pattern: GridPattern,
  size: number | string,
  color: string,
  image: string | undefined,
): { image: string; size: string } | null {
  const stepCss = sizeCss(size);

  switch (pattern) {
    case 'inherit':
      return null; // fall through to CSS vars
    case 'dots':
      return {
        image: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
        size: stepCss,
      };
    case 'lines':
      return {
        image: `linear-gradient(to right, ${color} 1px, transparent 1px)`,
        size: stepCss,
      };
    case 'cross':
      return {
        image: `linear-gradient(to right, ${color} 1px, transparent 1px), linear-gradient(to bottom, ${color} 1px, transparent 1px)`,
        size: stepCss,
      };
    case 'custom':
      if (!image) return null;
      return { image, size: stepCss };
  }
}

export const GridBackground = forwardRef<HTMLDivElement, GridBackgroundProps>(
  ({
    pattern = 'inherit',
    size = 24,
    color = 'var(--color-border)',
    image,
    style,
    children,
    ...rest
  }, ref) => {
    const built = buildPattern(pattern, size, color, image);

    const bgStyle: React.CSSProperties = built
      ? {
          backgroundImage: built.image,
          backgroundSize: built.size,
        }
      : {
          backgroundImage: 'var(--bg-pattern)',
          backgroundSize: 'var(--bg-pattern-size)',
        };

    return (
      <div ref={ref} style={{ ...bgStyle, ...style }} {...rest}>
        {children}
      </div>
    );
  }
);
GridBackground.displayName = 'GridBackground';

export type { GridBackgroundProps };
