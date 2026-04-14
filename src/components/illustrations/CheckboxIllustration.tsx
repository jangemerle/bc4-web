/**
 * CheckboxIllustration — animated component thumbnail for Checkbox.
 *
 * Hover: each row checks/unchecks in a cascading sequence.
 * Idle: shows 4 states — checked, unchecked, indeterminate, disabled.
 */

import { motion, AnimatePresence } from 'motion/react';
import { IllustrationCard } from './IllustrationCard';
import { ill } from './tokens';
import { duration, ease } from '../../tokens/motion';

interface RowProps {
  state: 'checked' | 'unchecked' | 'indeterminate' | 'disabled';
  labelWidth: number;
  delay?: number;
}

function CheckRow({ state, labelWidth, delay = 0 }: RowProps) {
  const isActive = state === 'checked' || state === 'indeterminate';
  const isDisabled = state === 'disabled';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {/* Box */}
      <motion.div
        style={{
          width: 18,
          height: 18,
          borderRadius: 4,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
        animate={{
          backgroundColor: isActive ? ill.primary : isDisabled ? ill.subtle : ill.card,
          boxShadow: isActive
            ? 'none'
            : `inset 0 0 0 1.5px ${isDisabled ? ill.muted : ill.border}`,
        }}
        transition={{ duration: duration.fast, delay }}
      >
        <AnimatePresence>
          {state === 'checked' && (
            <motion.svg
              key="check"
              viewBox="0 0 12 10"
              width={11}
              height={9}
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: duration.base, ease: ease.stroke, delay }}
            >
              <motion.path
                d="M1 5l3.5 3.5L11 1"
                stroke="white"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: duration.base, ease: ease.stroke, delay }}
              />
            </motion.svg>
          )}
          {state === 'indeterminate' && (
            <motion.div
              key="dash"
              style={{ width: 9, height: 2, borderRadius: 1, background: '#FFFFFF' }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0 }}
              transition={{ duration: duration.fast, delay }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Label line */}
      <motion.div
        style={{
          height: 8,
          borderRadius: 4,
          background: isDisabled ? ill.muted : isActive ? ill.text : ill.textMuted,
        }}
        animate={{ width: labelWidth }}
        transition={{ duration: duration.fast, delay }}
      />
    </div>
  );
}

interface CheckboxIllustrationProps {
  hovered?: boolean;
}

export function CheckboxIllustration({ hovered = false }: CheckboxIllustrationProps) {
  // On hover, cycle all rows to checked, then back to original states
  const rows: Array<{ state: RowProps['state']; hoverState: RowProps['state']; labelWidth: number }> = [
    { state: 'checked',       hoverState: 'checked',       labelWidth: 88 },
    { state: 'unchecked',     hoverState: 'checked',       labelWidth: 72 },
    { state: 'indeterminate', hoverState: 'indeterminate', labelWidth: 96 },
    { state: 'disabled',      hoverState: 'disabled',      labelWidth: 60 },
  ];

  return (
    <IllustrationCard rotation={-1}>
      {rows.map((row, i) => (
        <CheckRow
          key={i}
          state={hovered ? row.hoverState : row.state}
          labelWidth={row.labelWidth}
          delay={hovered ? i * 0.06 : 0}
        />
      ))}
    </IllustrationCard>
  );
}
