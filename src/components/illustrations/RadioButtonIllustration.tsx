import { motion, AnimatePresence } from 'motion/react';
import { IllustrationCard } from './IllustrationCard';
import { ill } from './tokens';
import { spring } from '../../tokens/motion';

export function RadioButtonIllustration({ hovered = false }: { hovered?: boolean }) {
  // On hover, selection moves from row 0 to row 2
  const selectedIdx = hovered ? 2 : 0;

  const rows = [
    { labelWidth: 84 },
    { labelWidth: 70 },
    { labelWidth: 90 },
    { labelWidth: 60, disabled: true },
  ];

  return (
    <IllustrationCard rotation={1}>
      {rows.map((row, i) => {
        const isSelected = i === selectedIdx;
        const isDisabled = row.disabled;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Radio circle */}
            <motion.div
              style={{
                width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              animate={{
                boxShadow: isSelected
                  ? `inset 0 0 0 2px ${ill.primary}`
                  : `inset 0 0 0 1.5px ${isDisabled ? ill.muted : ill.border}`,
                background: isDisabled ? ill.subtle : ill.card,
              }}
              transition={{ ...spring.snappy, delay: i * 0.05 }}
            >
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    key="dot"
                    style={{ width: 8, height: 8, borderRadius: '50%', background: ill.primary }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={spring.snappy}
                  />
                )}
              </AnimatePresence>
            </motion.div>
            <div style={{ width: row.labelWidth, height: 8, borderRadius: 4, background: isDisabled ? ill.muted : isSelected ? ill.text : ill.textMuted }} />
          </div>
        );
      })}
    </IllustrationCard>
  );
}
