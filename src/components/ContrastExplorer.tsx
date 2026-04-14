/**
 * Design System — ContrastExplorer
 * Interactive palette visualization showing WCAG AA contrast pairings.
 * Hover a shade to see which others pass contrast — failing shades collapse
 * to flat surface-3 rectangles, passing shades lift with a green ring,
 * and the contrast ratio fades in with a staggered bounce.
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/cn';
import { getContrastRatio, getLuminance } from '../lib/contrast';
import { duration, ease } from '../tokens/motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

export interface ContrastExplorerShade {
  label: string;
  hex: string;
}

export interface ContrastExplorerProps {
  /** Palette name displayed as heading */
  name: string;
  /** Ordered shades from darkest to lightest */
  shades: ContrastExplorerShade[];
  /** Minimum contrast ratio to consider "passing". Default 4.5 (WCAG AA) */
  threshold?: number;
}

/** Spring for the swatch scale lift — snappy, no overshoot */
const liftSpring = { type: 'spring' as const, visualDuration: 0.2, bounce: 0 };

/** Spring for the ratio badge pop-in — playful overshoot */
const badgeSpring = { type: 'spring' as const, visualDuration: 0.35, bounce: 0.25 };

export function ContrastExplorer({
  name,
  shades,
  threshold = 4.5,
}: ContrastExplorerProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();

  // Pre-compute contrast ratios for every pair
  const contrastMatrix = useMemo(() => {
    return shades.map((a) =>
      shades.map((b) => getContrastRatio(a.hex, b.hex)),
    );
  }, [shades]);

  // Pre-compute luminance for text color decisions
  const luminances = useMemo(
    () => shades.map((s) => getLuminance(s.hex)),
    [shades],
  );

  // Count passing shades to compute stagger index per passing swatch
  const passingIndices = useMemo(() => {
    if (hoveredIndex === null) return [];
    let idx = 0;
    return shades.map((_, i) => {
      if (i === hoveredIndex) return -1;
      const passes = contrastMatrix[hoveredIndex][i] >= threshold;
      return passes ? idx++ : -1;
    });
  }, [hoveredIndex, shades, contrastMatrix, threshold]);

  return (
    <div>
      <p
        className="font-sans text-md font-semibold mb-4"
        style={{ color: 'var(--color-on-surface)' }}
      >
        {name}
      </p>

      <div className="grid grid-cols-6 gap-3 sm:grid-cols-12">
        {shades.map((shade, i) => {
          const isDark = luminances[i] <= 0.5;
          const textColor = isDark ? '#FFFFFF' : '#141616';
          const subtleTextColor = isDark
            ? 'rgba(255,255,255,0.7)'
            : 'rgba(20,22,22,0.7)';

          const isHovered = hoveredIndex === i;
          const passes =
            hoveredIndex !== null
              ? contrastMatrix[hoveredIndex][i] >= threshold
              : true;
          const ratio =
            hoveredIndex !== null ? contrastMatrix[hoveredIndex][i] : null;

          const dimmed = hoveredIndex !== null && !isHovered && !passes;
          const passing = hoveredIndex !== null && !isHovered && passes;
          const staggerIdx = passingIndices[i] ?? 0;

          return (
            <motion.div
              key={shade.label}
              className={cn(
                'relative flex flex-col items-center justify-center rounded-m cursor-default select-none overflow-hidden',
                (passing || isHovered) && 'ring-2 ring-offset-2',
              )}
              style={{
                height: 120,
                willChange: 'transform',
                ...((passing || isHovered)
                  ? {
                      ['--tw-ring-color' as string]: 'var(--color-primary-1)',
                      ['--tw-ring-offset-color' as string]: 'var(--color-surface-1)',
                    }
                  : {}),
              }}
              animate={
                reducedMotion
                  ? { scale: 1 }
                  : {
                      scale: isHovered ? 1.08 : passing ? 1.03 : dimmed ? 0.95 : 1,
                      backgroundColor: dimmed ? 'var(--color-surface-3)' : shade.hex,
                    }
              }
              transition={
                reducedMotion
                  ? undefined
                  : {
                      scale: liftSpring,
                      backgroundColor: { duration: duration.fast, ease: ease.standard },
                    }
              }
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              aria-label={`${name} ${shade.label}: ${shade.hex}`}
            >
              {/* Text content — hidden when dimmed */}
              <AnimatePresence>
                {!dimmed && (
                  <motion.div
                    className="flex flex-col items-center justify-center"
                    initial={reducedMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reducedMotion ? undefined : { opacity: 0 }}
                    transition={{ duration: duration.fast, ease: ease.enter }}
                  >
                    <span
                      className="font-sans text-sm font-bold"
                      style={{ color: textColor }}
                    >
                      {shade.label}
                    </span>
                    <span
                      className="font-sans text-2xs font-medium mt-1"
                      style={{ color: subtleTextColor }}
                    >
                      {shade.hex}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Contrast ratio badge — staggered bounce pop-in */}
              <AnimatePresence>
                {passing && ratio !== null && (
                  <motion.span
                    className="absolute bottom-2 font-sans text-2xs font-semibold px-1.5 py-0.5 rounded-s"
                    style={{
                      color: textColor,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
                    }}
                    initial={reducedMotion ? false : { opacity: 0, scale: 0, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={reducedMotion ? undefined : { opacity: 0, scale: 0.8 }}
                    transition={
                      reducedMotion
                        ? undefined
                        : {
                            ...badgeSpring,
                            delay: 0.03 * staggerIdx,
                          }
                    }
                  >
                    {ratio.toFixed(1)}:1
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
