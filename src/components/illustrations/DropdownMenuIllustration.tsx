import { motion } from 'motion/react';
import { IllustrationCard } from './IllustrationCard';
import { ill } from './tokens';
import { spring, duration } from '../../tokens/motion';

const OPTIONS = [
  { width: 72, active: false },
  { width: 60, active: true },
  { width: 80, active: false },
  { width: 56, active: false },
];

export function DropdownMenuIllustration({ hovered = false }: { hovered?: boolean }) {
  const activeIdx = hovered ? 2 : 1;

  return (
    <IllustrationCard rotation={1}>
      {/* Trigger */}
      <div style={{ height: 28, borderRadius: 6, border: `1.5px solid ${ill.border}`, background: ill.card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px' }}>
        <div style={{ width: 60, height: 7, borderRadius: 3, background: ill.text }} />
        <div style={{ width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: `5px solid ${ill.textMuted}` }} />
      </div>
      {/* Dropdown panel */}
      <motion.div
        style={{ borderRadius: 8, overflow: 'hidden', border: `1px solid ${ill.muted}`, background: ill.card, boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}
        animate={{ y: hovered ? -1 : 0 }}
        transition={spring.snappy}
      >
        {OPTIONS.map((opt, i) => (
          <motion.div
            key={i}
            style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 7 }}
            animate={{ background: i === activeIdx ? ill.primaryLight : ill.card }}
            transition={{ duration: duration.fast, delay: i * 0.03 }}
          >
            {i === activeIdx && <div style={{ width: 6, height: 6, borderRadius: '50%', background: ill.primary, flexShrink: 0 }} />}
            <div style={{ width: opt.width, height: 7, borderRadius: 3, background: i === activeIdx ? ill.text : ill.textMuted }} />
          </motion.div>
        ))}
      </motion.div>
    </IllustrationCard>
  );
}
