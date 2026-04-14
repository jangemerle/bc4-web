import { motion } from 'motion/react';
import { IllustrationCard } from './IllustrationCard';
import { ill } from './tokens';
import { spring } from '../../tokens/motion';

const TABS = [72, 58, 64];

export function ContentSwitcherIllustration({ hovered = false }: { hovered?: boolean }) {
  const activeIndex = hovered ? 1 : 0;

  return (
    <IllustrationCard rotation={-1}>
      {/* Switcher track */}
      <div style={{ background: ill.subtle, borderRadius: 8, padding: 3, display: 'flex', gap: 2, position: 'relative' }}>
        {TABS.map((w, i) => (
          <div key={i} style={{ flex: 1, height: 26, borderRadius: 6, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {i === activeIndex && (
              <motion.div
                layoutId="switcher-pill"
                style={{ position: 'absolute', inset: 0, background: ill.card, borderRadius: 6, boxShadow: '0 1px 4px rgba(0,0,0,0.10)' }}
                transition={spring.default}
              />
            )}
            <div style={{ width: w * 0.45, height: 6, borderRadius: 3, background: i === activeIndex ? ill.text : ill.textMuted, position: 'relative', zIndex: 1 }} />
          </div>
        ))}
      </div>

      {/* Content placeholder */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, paddingTop: 4 }}>
        <div style={{ width: '100%', height: 7, borderRadius: 4, background: ill.muted }} />
        <div style={{ width: '75%', height: 7, borderRadius: 4, background: ill.muted }} />
        <div style={{ width: '90%', height: 7, borderRadius: 4, background: ill.muted }} />
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 44, height: 20, borderRadius: 5, background: ill.primary, opacity: 0.9 }} />
          <div style={{ width: 44, height: 20, borderRadius: 5, border: `1px solid ${ill.border}` }} />
        </div>
      </div>
    </IllustrationCard>
  );
}
