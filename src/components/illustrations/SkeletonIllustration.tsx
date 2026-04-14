import { motion } from 'motion/react';
import { IllustrationCard } from './IllustrationCard';
import { ill } from './tokens';

const LINES = [
  { width: '100%', height: 10 },
  { width: '90%',  height: 7 },
  { width: '75%',  height: 7 },
  { width: '50%',  height: 7 },
];

export function SkeletonIllustration({ hovered = false }: { hovered?: boolean }) {
  return (
    <IllustrationCard rotation={-1}>
      {/* Avatar + title row */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <motion.div
          style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, overflow: 'hidden', background: ill.muted, position: 'relative' }}
          animate={{ opacity: hovered ? [1, 0.5, 1] : 1 }}
          transition={{ duration: hovered ? 0.8 : 0, repeat: hovered ? Infinity : 0, ease: 'easeInOut' }}
        >
          <motion.div
            style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)' }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: hovered ? 0.9 : 1.4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.2 }}
          />
        </motion.div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
          <ShimmerBar width="70%" height={8} hovered={hovered} delay={0.05} />
          <ShimmerBar width="45%" height={6} hovered={hovered} delay={0.1} />
        </div>
      </div>
      {/* Body lines */}
      {LINES.map((line, i) => (
        <ShimmerBar key={i} width={line.width} height={line.height} hovered={hovered} delay={i * 0.07} />
      ))}
    </IllustrationCard>
  );
}

function ShimmerBar({ width, height, hovered, delay = 0 }: { width: string | number; height: number; hovered: boolean; delay?: number }) {
  return (
    <div style={{ width, height, borderRadius: 4, background: ill.muted, overflow: 'hidden', position: 'relative' }}>
      <motion.div
        style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)' }}
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: hovered ? 0.7 : 1.4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.1, delay }}
      />
    </div>
  );
}
