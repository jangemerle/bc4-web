/**
 * Design System — LoadingIndicator component
 *
 * Two variants:
 *   spinner       — rotating arc, simple CSS animation
 *   illustration  — animated GIF for longer waits, optional rotating messages
 *
 * Sizes: sm (20px) | md (32px) | lg (48px)
 *
 * Usage:
 *   <LoadingIndicator />
 *   <LoadingIndicator size="lg" label="Saving..." />
 *   <LoadingIndicator variant="illustration" />
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/cn';
import { duration, ease, spring } from '../tokens/motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

// ─── Types ───────────────────────────────────────────────────────────────────

export type LoadingIndicatorVariant = 'spinner' | 'illustration';
export type LoadingIndicatorSize = 'sm' | 'md' | 'lg';

export interface LoadingIndicatorProps {
  variant?: LoadingIndicatorVariant;
  size?: LoadingIndicatorSize;
  /** Text shown below the indicator */
  label?: string;
  /** GIF name for illustration variant */
  illustrationName?: string;
  /** Message rotation interval in ms (illustration variant only) */
  messageInterval?: number;
  /** Apply a gradient shimmer sweep across the label text */
  shimmerLabel?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

// ─── Size config ─────────────────────────────────────────────────────────────

const spinnerSize: Record<LoadingIndicatorSize, number> = {
  sm: 20,
  md: 32,
  lg: 48,
};

const strokeWidths: Record<LoadingIndicatorSize, number> = {
  sm: 2,
  md: 2.5,
  lg: 3,
};

const illustrationWidth: Record<LoadingIndicatorSize, number> = {
  sm: 80,
  md: 120,
  lg: 180,
};

const labelClass: Record<LoadingIndicatorSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-md',
};

// ─── Spinner ─────────────────────────────────────────────────────────────────

function Spinner({ size = 'md' }: { size?: LoadingIndicatorSize }) {
  const reducedMotion = useReducedMotion();
  const d = spinnerSize[size];
  const sw = strokeWidths[size];
  const r = (d - sw) / 2;

  if (reducedMotion) {
    return (
      <svg
        width={d}
        height={d}
        viewBox={`0 0 ${d} ${d}`}
        fill="none"
        role="img"
        aria-hidden
        style={{ opacity: 0.6 }}
      >
        <circle
          cx={d / 2}
          cy={d / 2}
          r={r}
          stroke="var(--color-primary-1)"
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={`${r * 1.8} ${r * 4.5}`}
          transform={`rotate(-90 ${d / 2} ${d / 2})`}
        />
      </svg>
    );
  }

  return (
    <svg
      width={d}
      height={d}
      viewBox={`0 0 ${d} ${d}`}
      fill="none"
      role="img"
      aria-hidden
      className="animate-spin"
    >
      <circle
        cx={d / 2}
        cy={d / 2}
        r={r}
        stroke="var(--color-primary-1)"
        strokeWidth={sw}
        strokeLinecap="round"
        strokeDasharray={`${r * 1.8} ${r * 4.5}`}
        transform={`rotate(-90 ${d / 2} ${d / 2})`}
      />
    </svg>
  );
}

// ─── Illustration variant ────────────────────────────────────────────────────

function IllustrationLoader({
  size = 'md',
  illustrationName = 'walking-up-the-stairs-climbing-to-success-personal-development-and-progress',
}: {
  size?: LoadingIndicatorSize;
  illustrationName?: string;
}) {
  const reducedMotion = useReducedMotion();
  const w = illustrationWidth[size];
  const src = `/illustrations/optimized/${illustrationName}-400w.gif`;

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring.default}
      style={{ width: w }}
    >
      <img
        src={src}
        alt="Loading"
        loading="eager"
        decoding="async"
        style={{ width: '100%', height: 'auto' }}
      />
    </motion.div>
  );
}

// ─── Rotating messages ───────────────────────────────────────────────────────

const messages = [
  'Reading the fine print',
  'Chasing down signatures',
  'Consulting general counsel',
  'Counting the redlines',
  'Waiting on legal approval',
  'Filing the paperwork',
  'Reviewing the terms, carefully',
  'Checking the renewal date',
  'Indexing the contract vault',
  'Drafting one more clause',
];

function RotatingLabel({ size, interval }: { size: LoadingIndicatorSize; interval: number }) {
  const prevRef = useRef(-1);
  const [msg, setMsg] = useState(() => messages[Math.floor(Math.random() * messages.length)]);
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      let next: number;
      do { next = Math.floor(Math.random() * messages.length); } while (next === prevRef.current);
      prevRef.current = next;
      setMsg(messages[next]);
    }, interval);
    return () => clearInterval(id);
  }, [interval]);

  useEffect(() => {
    const id = setInterval(() => setDots(d => (d + 1) % 4), 400);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={cn('font-sans font-medium text-center w-full', labelClass[size])}
      style={{ color: 'var(--color-on-surface-subtle-1)' }}
      aria-live="polite"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={msg}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: duration.fast, ease: ease.standard }}
        >
          {msg}
        </motion.span>
      </AnimatePresence>
      <span style={{ display: 'inline-block', width: '1.5em', textAlign: 'left' }}>
        {'.'.repeat(dots)}
      </span>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export function LoadingIndicator({
  variant = 'spinner',
  size = 'md',
  label,
  illustrationName,
  messageInterval = 3000,
  className,
  style,
}: LoadingIndicatorProps) {
  const showRotatingMessages = variant === 'illustration' && !label;

  return (
    <div
      className={cn('inline-flex flex-col items-center gap-3', className)}
      style={{ minWidth: label || showRotatingMessages ? 160 : undefined, ...style }}
      role="status"
      aria-label={label || 'Loading'}
    >
      {variant === 'spinner' ? (
        <Spinner size={size} />
      ) : (
        <IllustrationLoader size={size} illustrationName={illustrationName} />
      )}

      {showRotatingMessages ? (
        <RotatingLabel size={size} interval={messageInterval} />
      ) : label ? (
        <span
          className={cn('font-sans font-medium text-center', labelClass[size])}
          style={{ color: 'var(--color-on-surface-subtle-1)' }}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
}
