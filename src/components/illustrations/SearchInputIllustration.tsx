import { motion } from 'motion/react';
import { IllustrationCard } from './IllustrationCard';
import { ill } from './tokens';
import { spring, duration } from '../../tokens/motion';

const RESULTS = [88, 70, 96, 60];

export function SearchInputIllustration({ hovered = false }: { hovered?: boolean }) {
  return (
    <IllustrationCard rotation={-1}>
      {/* Search field */}
      <motion.div
        style={{ height: 28, borderRadius: 6, background: ill.card, display: 'flex', alignItems: 'center', gap: 7, padding: '0 10px' }}
        animate={{ boxShadow: hovered ? `inset 0 0 0 2px ${ill.primary}` : `inset 0 0 0 1.5px ${ill.border}` }}
        transition={{ duration: duration.fast }}
      >
        {/* Magnifier icon */}
        <motion.div style={{ width: 12, height: 12, flexShrink: 0, position: 'relative' }}
          animate={{ opacity: hovered ? 1 : 0.5 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', border: `1.5px solid ${hovered ? ill.primary : ill.textMuted}`, position: 'absolute', top: 0, left: 0 }} />
          <div style={{ width: 4, height: 1.5, background: hovered ? ill.primary : ill.textMuted, borderRadius: 1, position: 'absolute', bottom: 1, right: 0, transform: 'rotate(-45deg)' }} />
        </motion.div>
        <div style={{ flex: 1, height: 7, borderRadius: 3, background: hovered ? ill.text : ill.border }} />
        {hovered && (
          <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} style={{ width: 14, height: 14, borderRadius: '50%', background: ill.muted, flexShrink: 0 }} />
        )}
      </motion.div>

      {/* Results list */}
      <motion.div
        style={{ borderRadius: 7, border: `1px solid ${ill.muted}`, background: ill.card, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
        animate={{ opacity: hovered ? 1 : 0.5, y: hovered ? 0 : 2 }}
        transition={spring.snappy}
      >
        {RESULTS.map((w, i) => (
          <motion.div
            key={i}
            style={{ padding: '6px 10px', borderBottom: i < 3 ? `1px solid ${ill.subtle}` : 'none' }}
            animate={{ background: i === 0 && hovered ? ill.primaryLight : ill.card }}
            transition={{ duration: duration.fast }}
          >
            <div style={{ width: w, height: 6, borderRadius: 3, background: i === 0 ? ill.text : ill.border }} />
          </motion.div>
        ))}
      </motion.div>
    </IllustrationCard>
  );
}
