import { motion } from 'motion/react';
import { IllustrationCard } from './IllustrationCard';
import { ill } from './tokens';
import { spring, duration } from '../../tokens/motion';

export function ChipIllustration({ hovered = false }: { hovered?: boolean }) {
  return (
    <IllustrationCard rotation={1}>
      {/* Filled active */}
      <motion.div
        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        animate={{ x: hovered ? 2 : 0 }}
        transition={spring.snappy}
      >
        <div style={{ height: 22, borderRadius: 11, background: ill.primary, padding: '0 10px', display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 46, height: 7, borderRadius: 3, background: 'rgba(255,255,255,0.85)' }} />
        </div>
        <div style={{ height: 22, borderRadius: 11, background: ill.primary, padding: '0 10px', display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 30, height: 7, borderRadius: 3, background: 'rgba(255,255,255,0.85)' }} />
        </div>
      </motion.div>

      {/* Outlined */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ height: 22, borderRadius: 11, border: `1.5px solid ${ill.border}`, padding: '0 10px', display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 40, height: 7, borderRadius: 3, background: ill.textMuted }} />
        </div>
        <motion.div
          style={{ height: 22, borderRadius: 11, border: `1.5px solid ${ill.border}`, padding: '0 10px', display: 'flex', alignItems: 'center', gap: 5 }}
          animate={{ borderColor: hovered ? ill.primary : ill.border }}
          transition={{ duration: duration.fast }}
        >
          <div style={{ width: 30, height: 7, borderRadius: 3, background: ill.textMuted }} />
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: ill.border }} />
        </motion.div>
      </div>

      {/* Disabled */}
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ height: 22, borderRadius: 11, background: ill.subtle, padding: '0 10px', display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 36, height: 7, borderRadius: 3, background: ill.muted }} />
        </div>
        <div style={{ height: 22, borderRadius: 11, background: ill.subtle, padding: '0 10px', display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 28, height: 7, borderRadius: 3, background: ill.muted }} />
        </div>
      </div>
    </IllustrationCard>
  );
}
