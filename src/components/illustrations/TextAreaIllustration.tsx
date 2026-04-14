import { motion } from 'motion/react';
import { IllustrationCard } from './IllustrationCard';
import { ill } from './tokens';
import { duration } from '../../tokens/motion';

const LINES = [88, 72, 60, 80];

export function TextAreaIllustration({ hovered = false }: { hovered?: boolean }) {
  return (
    <IllustrationCard rotation={-1}>
      {/* Label */}
      <div style={{ width: 52, height: 6, borderRadius: 3, background: ill.textMuted }} />
      {/* Textarea */}
      <motion.div
        style={{ borderRadius: 6, background: ill.card, padding: '10px 10px 14px', position: 'relative' }}
        animate={{ boxShadow: hovered ? `inset 0 0 0 2px ${ill.primary}` : `inset 0 0 0 1.5px ${ill.border}` }}
        transition={{ duration: duration.fast }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {LINES.map((w, i) => (
            <motion.div
              key={i}
              style={{ height: 6, borderRadius: 3, background: ill.text }}
              animate={{ width: hovered && i === LINES.length - 1 ? w + 20 : w }}
              transition={{ duration: duration.base, delay: i * 0.04 }}
            />
          ))}
        </div>
        {/* Resize handle */}
        <div style={{ position: 'absolute', bottom: 4, right: 4, display: 'flex', flexDirection: 'column', gap: 1.5, transform: 'rotate(-45deg)' }}>
          {[12, 8, 4].map((w, i) => <div key={i} style={{ width: w, height: 1.5, borderRadius: 1, background: ill.border }} />)}
        </div>
      </motion.div>
      {/* Char count */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ width: 36, height: 6, borderRadius: 3, background: ill.border }} />
      </div>
    </IllustrationCard>
  );
}
