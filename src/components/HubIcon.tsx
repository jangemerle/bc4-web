/**
 * HubIcon — animated icon in a 2px border circle for hub-level cards.
 *
 * On hover: the circle "rolls" from left to right across the card,
 * rotating 360°, and the icon morphs into a ChevronRight.
 */

import { motion, AnimatePresence } from 'motion/react';
import type { LucideIcon } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { spring, duration } from '../tokens/motion';

interface HubIconProps {
  icon: LucideIcon;
  hovered: boolean;
}

export function HubIcon({ icon: Icon, hovered }: HubIconProps) {
  return (
    <div className="relative h-16 mx-8 mt-8">
      <motion.div
        className="absolute top-0 left-0 rounded-full flex items-center justify-center"
        style={{
          border: '2px solid var(--color-on-surface-subtle-2)',
        }}
        initial={false}
        animate={{
          top: hovered ? 0 : 0,
          left: hovered ? 'calc(100% - 46px)' : '0px',
          width: hovered ? 46 : 64,
          height: hovered ? 46 : 64,
          rotate: hovered ? 360 : 0,
          borderColor: hovered
            ? 'var(--color-on-secondary-1)'
            : 'var(--color-on-surface-subtle-2)',
        }}
        transition={{
          left: spring.default,
          rotate: spring.default,
          borderColor: { duration: duration.fast },
        }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {hovered ? (
            <motion.div
              key="chevron"
              initial={{ opacity: 0, scale: 0.6, rotate: -360 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={spring.snappy}
            >
              <ChevronRight
                size={20}
                strokeWidth={2}
                style={{ color: 'var(--color-on-secondary-1)' }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="icon"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={spring.snappy}
            >
              <Icon
                size={28}
                strokeWidth={1.5}
                style={{ color: 'var(--color-on-surface-subtle-1)' }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
