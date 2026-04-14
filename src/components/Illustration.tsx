/**
 * Illustration — accessible, optimized illustration renderer.
 *
 * Uses <picture> with WebP + original fallback, lazy loading,
 * explicit dimensions (no layout shift), and alt text from catalog.
 *
 * Supports toggling between static PNG and animated GIF versions
 * when both exist for the same illustration name.
 */

import type { CSSProperties } from 'react';

interface IllustrationProps {
  /** Filename without extension (e.g. "envelope") */
  name: string;
  /** Display width in CSS pixels (actual file = 2x for retina) */
  width?: number;
  /** Optional alt text override (otherwise uses catalog context) */
  alt?: string;
  /** Optional className for the wrapper */
  className?: string;
  /** Optional inline styles */
  style?: CSSProperties;
  /** Loading strategy — defaults to "lazy" */
  loading?: 'lazy' | 'eager';
  /** Whether to use the optimized/ subfolder variants */
  optimized?: boolean;
  /**
   * Enable animated GIF support. When true together with autoplay,
   * swaps from static PNG to animated GIF version.
   * Requires both `name.png` and `name.gif` to exist in optimized/.
   */
  animated?: boolean;
  /** Show the animated GIF (only when animated=true). Default: false */
  autoplay?: boolean;
}

/**
 * Renders an illustration with WebP progressive enhancement
 * and optional animated GIF support.
 *
 * Animation playback is controlled externally via the `autoplay` prop —
 * the component itself has no built-in play/pause UI. Consumers can
 * drive `autoplay` from hover state, a toggle, or any other trigger.
 *
 * @example
 * // Static only
 * <Illustration name="envelope" width={200} />
 *
 * // Animated, controlled externally (e.g. hover-to-play)
 * <Illustration name="envelope" width={200} animated autoplay={isHovering} />
 */
export function Illustration({
  name,
  width = 200,
  alt = '',
  className,
  style,
  loading = 'lazy',
  optimized = true,
  animated = false,
  autoplay = false,
}: IllustrationProps) {
  // Retina: actual file width is 2x the CSS display width
  const fileWidth = width * 2;

  // Build paths
  const prefix = optimized
    ? `/illustrations/optimized/${name}-${fileWidth}w`
    : `/illustrations/${name}`;

  const pngSrc  = optimized ? `${prefix}.png`  : `/illustrations/${name}.png`;
  const webpSrc = optimized ? `${prefix}.webp` : undefined;
  const gifSrc  = optimized ? `${prefix}.gif`  : `/illustrations/${name}.gif`;

  const imgStyle: CSSProperties = {
    width,
    height: 'auto',
    ...style,
  };

  // When animated and autoplay are both true, show the GIF
  const showGif = animated && autoplay;

  const imgElement = showGif ? (
    <img
      src={gifSrc}
      alt={alt}
      width={width}
      loading={loading}
      decoding="async"
      style={imgStyle}
    />
  ) : optimized && webpSrc ? (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <img
        src={pngSrc}
        alt={alt}
        width={width}
        loading={loading}
        decoding="async"
        style={imgStyle}
      />
    </picture>
  ) : (
    <img
      src={pngSrc}
      alt={alt}
      width={width}
      loading={loading}
      decoding="async"
      style={imgStyle}
    />
  );

  return <div className={className}>{imgElement}</div>;
}
