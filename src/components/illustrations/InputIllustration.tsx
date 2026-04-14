import { motion } from 'motion/react';
import { IllustrationCard } from './IllustrationCard';
import { ill } from './tokens';
import { duration } from '../../tokens/motion';

const ROWS = [
  { border: ill.primary,  label: ill.textMid,  content: ill.text,    bg: ill.card,   w: 88 },
  { border: ill.border,   label: ill.textMuted, content: ill.textMuted, bg: ill.card, w: 72 },
  { border: '#FCA5A5',    label: '#EF4444',    content: ill.text,    bg: '#FFF5F5',  w: 80 },
  { border: ill.muted,    label: ill.border,   content: ill.muted,   bg: ill.subtle, w: 60 },
];

export function InputIllustration({ hovered = false }: { hovered?: boolean }) {
  return (
    <IllustrationCard rotation={-1}>
      {ROWS.map((row, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ width: row.w * 0.55, height: 6, borderRadius: 3, background: row.label }} />
          <motion.div
            style={{ height: 24, borderRadius: 5, background: row.bg, display: 'flex', alignItems: 'center', padding: '0 8px' }}
            animate={{ boxShadow: hovered && i === 0 ? `inset 0 0 0 2px ${row.border}, 0 0 0 3px ${row.border}22` : `inset 0 0 0 1.5px ${row.border}` }}
            transition={{ duration: duration.fast }}
          >
            <div style={{ width: row.w, height: 6, borderRadius: 3, background: row.content }} />
          </motion.div>
        </div>
      ))}
    </IllustrationCard>
  );
}
