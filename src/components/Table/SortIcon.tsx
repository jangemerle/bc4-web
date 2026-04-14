/**
 * SortIcon — Animated sort direction indicator
 */

import { motion, AnimatePresence } from 'motion/react';
import { ChevronsUpDown, ChevronDown, ChevronUp } from 'lucide-react';
import { Icon } from '../Icon';
import { spring } from '../../tokens/motion';
import type { SortDirection } from './types';

interface SortIconProps {
  direction: SortDirection;
  reducedMotion: boolean;
}

export function SortIcon({ direction, reducedMotion }: SortIconProps) {
  const iconProps = { size: 'sm' as const };
  const t = reducedMotion ? { duration: 0 } : spring.snappy;

  return (
    <AnimatePresence mode="wait">
      {direction === 'none' && (
        <motion.span
          key="unsorted"
          className="inline-flex"
          style={{ color: 'var(--color-on-surface-subtle-2)' }}
          initial={reducedMotion ? undefined : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0, scale: 0.8 }}
          transition={t}
        >
          <Icon icon={ChevronsUpDown} {...iconProps} />
        </motion.span>
      )}
      {direction === 'asc' && (
        <motion.span
          key="asc"
          className="inline-flex"
          style={{ color: 'var(--color-primary-1)' }}
          initial={reducedMotion ? undefined : { opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? undefined : { opacity: 0, y: -4 }}
          transition={t}
        >
          <Icon icon={ChevronDown} {...iconProps} />
        </motion.span>
      )}
      {direction === 'desc' && (
        <motion.span
          key="desc"
          className="inline-flex"
          style={{ color: 'var(--color-primary-1)' }}
          initial={reducedMotion ? undefined : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? undefined : { opacity: 0, y: 4 }}
          transition={t}
        >
          <Icon icon={ChevronUp} {...iconProps} />
        </motion.span>
      )}
    </AnimatePresence>
  );
}
