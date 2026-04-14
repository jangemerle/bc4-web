import { motion } from 'motion/react';
import { IllustrationCard } from './IllustrationCard';
import { ill } from './tokens';
import { spring } from '../../tokens/motion';

const TABS = [{ w: 40 }, { w: 52 }, { w: 36 }, { w: 44 }];

export function TabsIllustration({ hovered = false }: { hovered?: boolean }) {
  const activeIdx = hovered ? 1 : 0;

  return (
    <IllustrationCard rotation={1}>
      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 0, borderBottom: `2px solid ${ill.muted}`, position: 'relative' }}>
        {TABS.map((tab, i) => (
          <div key={i} style={{ padding: '0 10px 8px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: tab.w, height: 7, borderRadius: 3, background: i === activeIdx ? ill.text : ill.textMuted }} />
            {i === activeIdx && (
              <motion.div
                layoutId="tab-indicator"
                style={{ position: 'absolute', bottom: -2, left: 0, right: 0, height: 2, background: ill.primary, borderRadius: 1 }}
                transition={spring.default}
              />
            )}
          </div>
        ))}
      </div>
      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, paddingTop: 4 }}>
        <div style={{ width: '100%', height: 7, borderRadius: 4, background: ill.muted }} />
        <div style={{ width: '80%', height: 7, borderRadius: 4, background: ill.muted }} />
        <div style={{ width: '65%', height: 7, borderRadius: 4, background: ill.muted }} />
        <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
          <div style={{ width: 48, height: 20, borderRadius: 5, background: ill.primary, opacity: 0.9 }} />
          <div style={{ width: 48, height: 20, borderRadius: 5, border: `1px solid ${ill.border}` }} />
        </div>
      </div>
    </IllustrationCard>
  );
}
