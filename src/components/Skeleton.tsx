/**
 * Design System — Skeleton component
 *
 * Animated placeholder that indicates content is loading.
 * Uses spring.playful (bounce: 0.25) for a lively shimmer pulse.
 *
 * Variants:  text | circular | rectangular
 * Sizes:    sm | md | lg (affects height for text, diameter for circular)
 *
 * Usage:
 *   <Skeleton />                                   // single text line
 *   <Skeleton variant="circular" size="lg" />       // avatar placeholder
 *   <Skeleton variant="rectangular" height={120} /> // card/image placeholder
 *   <Skeleton width="60%" />                        // partial-width text line
 *   <Skeleton lines={3} />                          // multi-line text block
 *   <Skeleton.Card />                               // pre-composed card skeleton
 *   <Skeleton.List rows={5} />                      // pre-composed list skeleton
 */

import { motion } from 'motion/react';
import { cn } from '../lib/cn';
import { duration, ease } from '../tokens/motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

// ─── Public types ─────────────────────────────────────────────────────────────

export type SkeletonVariant = 'text' | 'circular' | 'rectangular';
export type SkeletonSize = 'sm' | 'md' | 'lg';

export interface SkeletonProps {
  /** Shape variant */
  variant?: SkeletonVariant;
  /** Size preset — affects height for text, diameter for circular */
  size?: SkeletonSize;
  /** Custom width (CSS value or number in px) */
  width?: string | number;
  /** Custom height (CSS value or number in px) — overrides size */
  height?: string | number;
  /** Border radius override (CSS value) */
  borderRadius?: string | number;
  /** Number of text lines to render */
  lines?: number;
  /** Gap between lines in px */
  lineGap?: number;
  /** Animation style */
  animation?: 'pulse' | 'wave' | 'bounce' | 'none';
  /** Additional class names */
  className?: string;
}

// ─── Size config ──────────────────────────────────────────────────────────────

const textHeight: Record<SkeletonSize, number> = {
  sm: 12,
  md: 16,
  lg: 24,
};

const circularSize: Record<SkeletonSize, number> = {
  sm: 32,
  md: 40,
  lg: 56,
};

// ─── Shimmer keyframes ────────────────────────────────────────────────────────

const pulseAnimation = {
  opacity: [0.4, 0.7, 0.4],
};

const bounceAnimation = {
  opacity: [0.35, 0.8, 0.35],
  scaleY: [1, 1.02, 1],
  scaleX: [1, 1.005, 1],
};

const waveAnimation = {
  opacity: [0.3, 0.6, 0.9, 0.6, 0.3],
  backgroundPosition: ['200% 0%', '-200% 0%'],
};

// ─── Single skeleton element ──────────────────────────────────────────────────

function SkeletonElement({
  variant = 'text',
  size = 'md',
  width,
  height,
  borderRadius,
  animation = 'bounce',
  className,
  style,
  delay = 0,
}: SkeletonProps & { style?: React.CSSProperties; delay?: number }) {
  const reducedMotion = useReducedMotion();

  // Compute dimensions
  let computedWidth: string | number = '100%';
  let computedHeight: string | number = textHeight[size];
  let computedRadius: string | number = 'var(--radius-m, 8px)';

  if (variant === 'circular') {
    computedWidth = circularSize[size];
    computedHeight = circularSize[size];
    computedRadius = '50%';
  } else if (variant === 'rectangular') {
    computedHeight = height ?? 120;
    computedRadius = 'var(--radius-lg, 12px)';
  }

  if (width !== undefined) computedWidth = width;
  if (height !== undefined) computedHeight = height;
  if (borderRadius !== undefined) computedRadius = borderRadius;

  // Pick animation
  const getAnimation = () => {
    if (reducedMotion || animation === 'none') return undefined;
    switch (animation) {
      case 'bounce': return bounceAnimation;
      case 'wave': return waveAnimation;
      case 'pulse': return pulseAnimation;
      default: return bounceAnimation;
    }
  };

  const getTransition = () => {
    if (reducedMotion || animation === 'none') return undefined;

    if (animation === 'bounce') {
      return {
        repeat: Infinity,
        repeatType: 'mirror' as const,
        duration: duration.slow * 3,
        ease: ease.standard,
        delay: delay * 0.12,
      };
    }

    return {
      repeat: Infinity,
      repeatType: 'mirror' as const,
      duration: duration.slow * 3,
      ease: ease.standard,
      delay: delay * 0.12,
    };
  };

  return (
    <motion.div
      className={cn('skeleton-element', className)}
      style={{
        width: typeof computedWidth === 'number' ? `${computedWidth}px` : computedWidth,
        height: typeof computedHeight === 'number' ? `${computedHeight}px` : computedHeight,
        borderRadius: typeof computedRadius === 'number' ? `${computedRadius}px` : computedRadius,
        backgroundColor: 'var(--color-surface-3)',
        opacity: reducedMotion ? 0.5 : undefined,
        transformOrigin: 'left center',
        ...style,
      }}
      animate={getAnimation()}
      transition={getTransition()}
    />
  );
}

// ─── Multi-line skeleton ──────────────────────────────────────────────────────

export function Skeleton({
  lines = 1,
  lineGap = 10,
  ...props
}: SkeletonProps) {
  if (props.variant === 'circular' || props.variant === 'rectangular' || lines <= 1) {
    return <SkeletonElement {...props} />;
  }

  return (
    <div className="flex flex-col" style={{ gap: `${lineGap}px` }}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonElement
          key={i}
          {...props}
          delay={i}
          // Last line is shorter for natural text feel
          width={i === lines - 1 ? '70%' : props.width ?? '100%'}
        />
      ))}
    </div>
  );
}

// ─── Pre-composed: Card skeleton ──────────────────────────────────────────────

function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn('rounded-lg p-5 flex flex-col gap-4', className)}
      style={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}
    >
      {/* Image placeholder */}
      <SkeletonElement variant="rectangular" height={140} animation="bounce" delay={0} />
      {/* Title */}
      <SkeletonElement size="lg" width="75%" animation="bounce" delay={1} />
      {/* Body lines */}
      <div className="flex flex-col gap-2">
        <SkeletonElement size="sm" width="100%" animation="bounce" delay={2} />
        <SkeletonElement size="sm" width="100%" animation="bounce" delay={3} />
        <SkeletonElement size="sm" width="55%" animation="bounce" delay={4} />
      </div>
      {/* Action row */}
      <div className="flex gap-3 mt-1">
        <SkeletonElement width={80} height={32} borderRadius={8} animation="bounce" delay={5} />
        <SkeletonElement width={80} height={32} borderRadius={8} animation="bounce" delay={6} />
      </div>
    </div>
  );
}

// ─── Pre-composed: List skeleton ──────────────────────────────────────────────

function SkeletonList({ rows = 4, className }: { rows?: number; className?: string }) {
  return (
    <div
      className={cn('rounded-lg overflow-hidden', className)}
      style={{ border: '1px solid var(--color-border)' }}
    >
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-5 py-4"
          style={{ borderBottom: i < rows - 1 ? '1px solid var(--color-border)' : 'none' }}
        >
          <SkeletonElement variant="circular" size="sm" animation="bounce" delay={i * 3} />
          <div className="flex-1 flex flex-col gap-2">
            <SkeletonElement size="md" width={`${65 - i * 5}%`} animation="bounce" delay={i * 3 + 1} />
            <SkeletonElement size="sm" width={`${45 - i * 3}%`} animation="bounce" delay={i * 3 + 2} />
          </div>
          <SkeletonElement width={60} height={24} borderRadius={6} animation="bounce" delay={i * 3 + 2} />
        </div>
      ))}
    </div>
  );
}

// ─── Pre-composed: Profile header skeleton ────────────────────────────────────

function SkeletonProfile({ className }: { className?: string }) {
  return (
    <div
      className={cn('rounded-lg p-6 flex items-start gap-5', className)}
      style={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}
    >
      <SkeletonElement variant="circular" size="lg" animation="bounce" delay={0} />
      <div className="flex-1 flex flex-col gap-3">
        <SkeletonElement size="lg" width="40%" animation="bounce" delay={1} />
        <SkeletonElement size="sm" width="25%" animation="bounce" delay={2} />
        <div className="flex gap-3 mt-2">
          <SkeletonElement width={90} height={32} borderRadius={8} animation="bounce" delay={3} />
          <SkeletonElement width={90} height={32} borderRadius={8} animation="bounce" delay={4} />
        </div>
      </div>
    </div>
  );
}

// ─── Pre-composed: Dashboard stat cards ───────────────────────────────────────

function SkeletonStats({ count = 4, className }: { count?: number; className?: string }) {
  return (
    <div className={cn('grid gap-4', className)} style={{ gridTemplateColumns: `repeat(${count}, 1fr)` }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg p-5 flex flex-col gap-3"
          style={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}
        >
          <SkeletonElement size="sm" width="50%" animation="bounce" delay={i * 2} />
          <SkeletonElement size="lg" width="60%" height={28} animation="bounce" delay={i * 2 + 1} />
          <SkeletonElement size="sm" width="35%" animation="bounce" delay={i * 2 + 2} />
        </div>
      ))}
    </div>
  );
}

// ─── Attach sub-components ────────────────────────────────────────────────────

Skeleton.Card = SkeletonCard;
Skeleton.List = SkeletonList;
Skeleton.Profile = SkeletonProfile;
Skeleton.Stats = SkeletonStats;
