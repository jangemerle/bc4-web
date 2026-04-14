import { motion } from 'motion/react';
import { IllustrationCard } from './IllustrationCard';
import { ill } from './tokens';
import { duration } from '../../tokens/motion';

const VARIANTS = [
  { bg: '#DCFCE7', text: '#166534', label: 88 },
  { bg: '#F3F4F6', text: '#374151', label: 70 },
  { bg: '#FEF3C7', text: '#92400E', label: 96 },
  { bg: '#FEE2E2', text: '#991B1B', label: 60 },
];

export function BadgeIllustration({ hovered = false }: { hovered?: boolean }) {
  return (
    <IllustrationCard rotation={1}>
      {VARIANTS.map((v, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <motion.div
            style={{
              height: 18,
              borderRadius: 9,
              background: v.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
            animate={{ width: hovered && i === 0 ? 52 : 44 }}
            transition={{ duration: duration.fast, delay: i * 0.04 }}
          >
            <div style={{ width: 24, height: 6, borderRadius: 3, background: v.text, opacity: 0.7 }} />
          </motion.div>
          <div style={{ width: v.label, height: 7, borderRadius: 4, background: ill.border }} />
        </div>
      ))}
    </IllustrationCard>
  );
}
