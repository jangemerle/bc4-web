import { motion } from 'motion/react';
import { IllustrationCard } from './IllustrationCard';
import { ill } from './tokens';
import { spring, duration } from '../../tokens/motion';

export function SelectIllustration({ hovered = false }: { hovered?: boolean }) {
  const OPTIONS = [72, 56, 88, 64];
  const activeIdx = hovered ? 2 : 0;

  return (
    <IllustrationCard rotation={1}>
      {/* Label */}
      <div style={{ width: 44, height: 6, borderRadius: 3, background: ill.textMuted }} />
      {/* Select trigger */}
      <motion.div
        style={{ height: 28, borderRadius: 6, background: ill.card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px' }}
        animate={{ boxShadow: hovered ? `inset 0 0 0 2px ${ill.primary}` : `inset 0 0 0 1.5px ${ill.border}` }}
        transition={{ duration: duration.fast }}
      >
        <div style={{ width: OPTIONS[activeIdx], height: 7, borderRadius: 3, background: ill.text }} />
        <motion.div
          style={{ width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent' }}
          animate={{ borderTop: hovered ? `5px solid ${ill.primary}` : `5px solid ${ill.textMuted}`, rotate: hovered ? 180 : 0 }}
          transition={{ duration: duration.fast }}
        />
      </motion.div>
      {/* Open dropdown */}
      <motion.div
        style={{ borderRadius: 7, border: `1px solid ${ill.muted}`, background: ill.card, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
        animate={{ opacity: hovered ? 1 : 0.4, scaleY: hovered ? 1 : 0.6, originY: 0 }}
        transition={spring.snappy}
      >
        {OPTIONS.map((w, i) => (
          <motion.div
            key={i}
            style={{ padding: '6px 10px', borderBottom: i < OPTIONS.length - 1 ? `1px solid ${ill.subtle}` : 'none', display: 'flex', alignItems: 'center', gap: 6 }}
            animate={{ background: i === activeIdx && hovered ? ill.primaryLight : ill.card }}
            transition={{ duration: duration.fast }}
          >
            {i === activeIdx && hovered && <div style={{ width: 5, height: 5, borderRadius: '50%', background: ill.primary }} />}
            <div style={{ width: w, height: 6, borderRadius: 3, background: i === activeIdx ? ill.text : ill.border }} />
          </motion.div>
        ))}
      </motion.div>
    </IllustrationCard>
  );
}
