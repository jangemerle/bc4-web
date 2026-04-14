import { motion } from 'motion/react';
import { IllustrationCard } from './IllustrationCard';
import { ill } from './tokens';
import { duration, ease } from '../../tokens/motion';

export function LoadingIndicatorIllustration({ hovered = false }: { hovered?: boolean }) {
  return (
    <IllustrationCard rotation={1}>
      {/* Spinner */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <motion.div
          style={{
            width: 22, height: 22, borderRadius: '50%',
            border: `2.5px solid color-mix(in srgb, var(--color-primary-1) 20%, transparent)`,
            borderTopColor: ill.primary,
            flexShrink: 0,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: hovered ? 0.5 : 1, ease: 'linear', repeat: Infinity }}
        />
        <div style={{ width: 80, height: 7, borderRadius: 3, background: ill.border }} />
      </div>

      {/* Progress bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ width: 64, height: 6, borderRadius: 3, background: ill.textMuted }} />
        <div style={{ height: 6, borderRadius: 3, background: ill.muted, overflow: 'hidden' }}>
          <motion.div
            style={{ height: '100%', borderRadius: 3, background: ill.primary }}
            animate={{ width: hovered ? '85%' : '60%' }}
            transition={{ duration: duration.moderate, ease: ease.enter }}
          />
        </div>
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              style={{ width: 7, height: 7, borderRadius: '50%', background: ill.primary }}
              animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: hovered ? 0.4 : 0.8, repeat: Infinity, delay: i * (hovered ? 0.1 : 0.2), ease: 'easeInOut' }}
            />
          ))}
        </div>
        <div style={{ width: 72, height: 7, borderRadius: 3, background: ill.border }} />
      </div>
    </IllustrationCard>
  );
}
