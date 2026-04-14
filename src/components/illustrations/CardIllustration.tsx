import { motion } from 'motion/react';
import { IllustrationCard } from './IllustrationCard';
import { ill } from './tokens';
import { spring } from '../../tokens/motion';

export function CardIllustration({ hovered = false }: { hovered?: boolean }) {
  return (
    <IllustrationCard rotation={-1}>
      {/* Inner card-in-card */}
      <motion.div
        style={{
          background: ill.subtle,
          borderRadius: 6,
          overflow: 'hidden',
          border: `1px solid ${ill.muted}`,
        }}
        animate={{ boxShadow: hovered ? '0 4px 12px rgba(0,0,0,0.10)' : '0 1px 3px rgba(0,0,0,0.04)' }}
        transition={spring.snappy}
      >
        {/* Image area */}
        <div style={{ height: 48, background: 'linear-gradient(135deg, #DBEAFE 0%, #EDE9FE 100%)' }} />
        {/* Content */}
        <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ width: 80, height: 8, borderRadius: 4, background: ill.text }} />
          <div style={{ width: '100%', height: 6, borderRadius: 3, background: ill.border }} />
          <div style={{ width: '80%', height: 6, borderRadius: 3, background: ill.border }} />
          <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
            <div style={{ width: 28, height: 6, borderRadius: 3, background: ill.textMuted }} />
            <div style={{ width: 20, height: 6, borderRadius: 3, background: ill.textMuted }} />
          </div>
        </div>
      </motion.div>
    </IllustrationCard>
  );
}
