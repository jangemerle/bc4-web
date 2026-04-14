import { motion } from 'motion/react';
import { IllustrationCard } from './IllustrationCard';
import { ill } from './tokens';
import { duration } from '../../tokens/motion';

const COLS = [52, 40, 36];
const ROWS = [
  [60, 44, 32],
  [50, 36, 40],
  [56, 42, 28],
];

export function DataTableIllustration({ hovered = false }: { hovered?: boolean }) {
  return (
    <IllustrationCard rotation={1}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, borderRadius: 6, overflow: 'hidden', border: `1px solid ${ill.muted}` }}>
        {/* Header */}
        <div style={{ display: 'flex', gap: 0, background: ill.subtle, padding: '7px 10px', borderBottom: `1px solid ${ill.muted}` }}>
          {COLS.map((w, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 3 }}>
              <div style={{ width: w * 0.7, height: 7, borderRadius: 3, background: ill.textMid }} />
              {i === 0 && hovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ width: 6, height: 6, borderRadius: 1, background: ill.primary }}
                />
              )}
            </div>
          ))}
        </div>
        {/* Rows */}
        {ROWS.map((row, ri) => (
          <motion.div
            key={ri}
            style={{ display: 'flex', padding: '7px 10px', borderBottom: ri < 2 ? `1px solid ${ill.subtle}` : 'none' }}
            animate={{ background: hovered && ri === 1 ? ill.primaryLight : ri % 2 === 1 ? ill.subtle : ill.card }}
            transition={{ duration: duration.fast, delay: ri * 0.04 }}
          >
            {row.map((w, ci) => (
              <div key={ci} style={{ flex: 1 }}>
                <div style={{ width: w, height: 6, borderRadius: 3, background: ci === 0 ? ill.text : ill.border }} />
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </IllustrationCard>
  );
}
