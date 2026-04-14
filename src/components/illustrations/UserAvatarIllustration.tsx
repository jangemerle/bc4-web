import { motion } from 'motion/react';
import { IllustrationCard } from './IllustrationCard';
import { ill } from './tokens';
import { spring } from '../../tokens/motion';

const SIZES = [
  { size: 36, initials: true, color: ill.primary, textColor: '#166534', label: 80 },
  { size: 28, initials: false, color: '#DBEAFE', label: 70 },
  { size: 24, initials: true, color: '#EDE9FE', textColor: '#5B21B6', label: 64 },
  { size: 20, initials: false, color: '#FEE2E2', label: 56, group: true },
];

export function UserAvatarIllustration({ hovered = false }: { hovered?: boolean }) {
  return (
    <IllustrationCard rotation={-1}>
      {/* Individual avatar rows */}
      {SIZES.slice(0, 3).map((av, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <motion.div
            style={{ width: av.size, height: av.size, borderRadius: '50%', background: av.color, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
            animate={{ scale: hovered && i === 0 ? 1.08 : 1 }}
            transition={spring.snappy}
          >
            {av.initials && (
              <div style={{ width: av.size * 0.38, height: av.size * 0.28, borderRadius: 2, background: av.textColor ?? '#166534', opacity: 0.8 }} />
            )}
            {/* Status dot on first */}
            {i === 0 && (
              <motion.div
                style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: '50%', background: ill.primary, border: `2px solid ${ill.card}` }}
                animate={{ scale: hovered ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.6, repeat: hovered ? Infinity : 0 }}
              />
            )}
          </motion.div>
          <div style={{ width: av.label, height: 7, borderRadius: 4, background: i === 0 ? ill.text : ill.textMuted }} />
        </div>
      ))}
      {/* Stacked group */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex' }}>
          {[ill.primary, '#DBEAFE', '#EDE9FE', '#FEF3C7'].map((color, i) => (
            <motion.div
              key={i}
              style={{ width: 22, height: 22, borderRadius: '50%', background: color, border: `2px solid ${ill.card}`, marginLeft: i > 0 ? -6 : 0 }}
              animate={{ x: hovered ? i * -1 : 0 }}
              transition={{ ...spring.snappy, delay: i * 0.03 }}
            />
          ))}
        </div>
        <div style={{ width: 44, height: 6, borderRadius: 3, background: ill.textMuted }} />
      </div>
    </IllustrationCard>
  );
}
