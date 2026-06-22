import type { CSSProperties } from 'react';

/**
 * NavGlow — concentric flat-fill blurred circles. On mount they scale-in +
 * fade-in once (the "appear" effect); pass `loop` to add a continuous outward
 * pulse with staggered delays. Flat fill + blur (NOT a radial-gradient) keeps
 * the circles' edges distinct. The prefers-reduced-motion rule in globals.css
 * freezes both animations.
 */

interface NavGlowProps {
  /** Circle diameters in px, innermost first. */
  sizes?: number[];
  /** Primary-blue alpha per circle, innermost first. */
  alphas?: number[];
  /** Blur radius in px. */
  blur?: number;
  /** Mount scale-in duration (s). */
  inDuration?: number;
  /** Continuous outward pulse after the entrance. */
  loop?: boolean;
  /** Pulse loop duration (s). */
  loopDuration?: number;
  className?: string;
  style?: CSSProperties;
}

export function NavGlow({
  sizes = [70, 132, 198],
  alphas = [0.13, 0.07, 0.038],
  blur = 6,
  inDuration = 0.6,
  loop = false,
  loopDuration = 3.4,
  className,
  style,
}: NavGlowProps) {
  return (
    <span aria-hidden="true" className={className} style={{ position: 'absolute', ...style }}>
      {sizes.map((size, i) => (
        <span
          key={size}
          style={{
            position: 'absolute',
            width: size,
            height: size,
            marginLeft: -size / 2,
            marginTop: -size / 2,
            borderRadius: 9999,
            background: `rgba(53,100,239,${alphas[i] ?? 0.04})`,
            filter: `blur(${blur}px)`,
            pointerEvents: 'none',
            animation: [
              `bc4WaveIn ${inDuration}s ${i * 0.12}s cubic-bezier(.22,.7,.3,1) both`,
              loop ? `bc4WaveLoop ${loopDuration}s ${inDuration + i * 0.3}s ease-in-out infinite` : '',
            ]
              .filter(Boolean)
              .join(', '),
          }}
        />
      ))}
    </span>
  );
}
