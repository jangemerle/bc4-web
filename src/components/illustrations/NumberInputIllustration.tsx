import { motion } from 'motion/react';
import { IllustrationCard } from './IllustrationCard';
import { ill } from './tokens';
import { duration } from '../../tokens/motion';

function Stepper({ atMax = false, disabled = false, hovered = false, hoveredBtn }: {
  atMax?: boolean; disabled?: boolean; hovered?: boolean; hoveredBtn?: 'plus' | 'minus';
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, height: 26, borderRadius: 6, overflow: 'hidden', border: `1.5px solid ${disabled ? ill.muted : ill.border}` }}>
      <motion.div
        style={{ width: 28, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: `1px solid ${ill.muted}`, background: ill.subtle, flexShrink: 0 }}
        animate={{ background: (!atMax && hovered && hoveredBtn === 'minus') ? 'color-mix(in srgb, var(--color-primary-1) 13%, var(--color-surface-1))' : ill.subtle }}
        transition={{ duration: duration.fast }}
      >
        <div style={{ width: 9, height: 2, borderRadius: 1, background: disabled ? ill.border : ill.text }} />
      </motion.div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 24, height: 7, borderRadius: 3, background: disabled ? ill.muted : ill.text }} />
      </div>
      <motion.div
        style={{ width: 28, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderLeft: `1px solid ${ill.muted}`, background: ill.subtle, flexShrink: 0 }}
        animate={{ background: (!atMax && hovered && hoveredBtn === 'plus') ? 'color-mix(in srgb, var(--color-primary-1) 20%, var(--color-surface-1))' : atMax ? ill.subtle : ill.subtle }}
        transition={{ duration: duration.fast }}
      >
        <div style={{ position: 'relative', width: 10, height: 10 }}>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 2, borderRadius: 1, background: disabled || atMax ? ill.border : ill.text, transform: 'translateY(-50%)' }} />
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, borderRadius: 1, background: disabled || atMax ? ill.border : ill.text, transform: 'translateX(-50%)' }} />
        </div>
      </motion.div>
    </div>
  );
}

export function NumberInputIllustration({ hovered = false }: { hovered?: boolean }) {
  return (
    <IllustrationCard rotation={-1}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ width: 48, height: 6, borderRadius: 3, background: ill.textMuted }} />
          <Stepper hovered={hovered} hoveredBtn="plus" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ width: 40, height: 6, borderRadius: 3, background: ill.textMuted }} />
          <Stepper atMax />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ width: 52, height: 6, borderRadius: 3, background: ill.border }} />
          <Stepper disabled />
        </div>
      </div>
    </IllustrationCard>
  );
}
