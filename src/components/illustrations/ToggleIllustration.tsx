/**
 * ToggleIllustration — animated component thumbnail for Toggle.
 *
 * Hover: top toggle flips from ON→OFF→ON with spring thumb animation.
 * Shows 3 rows: on, off, disabled.
 */

import { motion } from 'motion/react';
import { IllustrationCard } from './IllustrationCard';
import { ill } from './tokens';
import { spring, duration } from '../../tokens/motion';

interface ToggleRowProps {
  on: boolean;
  disabled?: boolean;
  labelWidth: number;
}

function ToggleRow({ on, disabled = false, labelWidth }: ToggleRowProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {/* Track */}
      <motion.div
        style={{
          width: 32,
          height: 18,
          borderRadius: 9,
          flexShrink: 0,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          padding: '0 2px',
        }}
        animate={{
          backgroundColor: disabled ? ill.muted : on ? ill.primary : ill.border,
        }}
        transition={{ duration: duration.fast }}
      >
        {/* Thumb */}
        <motion.div
          style={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: '#FFFFFF',
            boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
            position: 'absolute',
          }}
          animate={{ x: on ? 14 : 0 }}
          transition={spring.default}
        />
      </motion.div>

      {/* Label */}
      <div
        style={{
          width: labelWidth,
          height: 8,
          borderRadius: 4,
          background: disabled ? ill.muted : on ? ill.text : ill.textMuted,
        }}
      />
    </div>
  );
}

interface ToggleIllustrationProps {
  hovered?: boolean;
}

// Simple alternating hover state — top toggle flips each hover
export function ToggleIllustration({ hovered = false }: ToggleIllustrationProps) {
  return (
    <IllustrationCard rotation={-1}>
      <ToggleRow on={hovered ? false : true}  labelWidth={82} />
      <ToggleRow on={hovered ? true  : false} labelWidth={68} />
      <ToggleRow on={false} disabled           labelWidth={72} />
    </IllustrationCard>
  );
}
