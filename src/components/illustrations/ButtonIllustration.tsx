/**
 * ButtonIllustration — animated component thumbnail for Button.
 *
 * Shows 4 button variants as rows.
 * Hover: primary button scales up slightly, secondary gets border highlight.
 */

import { motion } from 'motion/react';
import { IllustrationCard } from './IllustrationCard';
import { ill } from './tokens';
import { spring, duration } from '../../tokens/motion';

const GREEN_DIM = '#5DC966';

interface ButtonIllustrationProps {
  hovered?: boolean;
}

export function ButtonIllustration({ hovered = false }: ButtonIllustrationProps) {
  return (
    <IllustrationCard rotation={1}>
      {/* Primary */}
      <motion.div
        style={{
          height: 26,
          borderRadius: 6,
          background: ill.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
        animate={{
          scale: hovered ? 1.03 : 1,
          backgroundColor: hovered ? GREEN_DIM : ill.primary,
          boxShadow: hovered
            ? '0 4px 12px rgba(125,219,133,0.45)'
            : '0 1px 3px rgba(125,219,133,0.2)',
        }}
        transition={spring.snappy}
      >
        <div style={{ width: 60, height: 7, borderRadius: 4, background: 'rgba(255,255,255,0.9)' }} />
      </motion.div>

      {/* Secondary */}
      <motion.div
        style={{
          height: 26,
          borderRadius: 6,
          background: ill.card,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        animate={{
          boxShadow: hovered
            ? `inset 0 0 0 1.5px ${ill.primary}`
            : `inset 0 0 0 1.5px ${ill.border}`,
        }}
        transition={{ duration: duration.fast }}
      >
        <div style={{ width: 52, height: 7, borderRadius: 4, background: ill.textMuted }} />
      </motion.div>

      {/* Ghost */}
      <div
        style={{
          height: 26,
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <motion.div
          style={{ width: 44, height: 7, borderRadius: 4 }}
          animate={{ background: hovered ? ill.textMid : ill.textMuted }}
          transition={{ duration: duration.fast }}
        />
      </div>

      {/* Disabled */}
      <div
        style={{
          height: 26,
          borderRadius: 6,
          background: ill.subtle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ width: 48, height: 7, borderRadius: 4, background: ill.muted }} />
      </div>
    </IllustrationCard>
  );
}
