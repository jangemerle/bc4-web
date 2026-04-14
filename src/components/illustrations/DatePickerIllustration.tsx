import { motion } from 'motion/react';
import { IllustrationCard } from './IllustrationCard';
import { ill } from './tokens';
import { duration } from '../../tokens/motion';

const DAYS = [
  [null, null, 1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10, 11, 12],
  [13, 14, 15, 16, 17, 18, 19],
];
const ACTIVE = 9;
const HOVER_DAY = 14;

export function DatePickerIllustration({ hovered = false }: { hovered?: boolean }) {
  return (
    <IllustrationCard rotation={-1.5}>
      {/* Month header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: -2 }}>
        <div style={{ width: 60, height: 8, borderRadius: 4, background: ill.text }} />
        <div style={{ display: 'flex', gap: 4 }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: ill.muted }} />
          <div style={{ width: 12, height: 12, borderRadius: 3, background: ill.muted }} />
        </div>
      </div>
      {/* Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Weekday headers */}
        <div style={{ display: 'flex', gap: 2 }}>
          {['S','M','T','W','T','F','S'].map((_d, i) => (
            <div key={i} style={{ width: 20, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 8, height: 6, borderRadius: 2, background: ill.textMuted }} />
            </div>
          ))}
        </div>
        {DAYS.map((week, wi) => (
          <div key={wi} style={{ display: 'flex', gap: 2 }}>
            {week.map((day, di) => {
              const isActive = day === ACTIVE;
              const isHoverDay = day === HOVER_DAY && hovered;
              return (
                <motion.div
                  key={di}
                  style={{ width: 20, height: 18, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  animate={{
                    background: isActive ? ill.primary : isHoverDay ? ill.primaryLight : 'transparent',
                    scale: isActive ? 1 : isHoverDay ? 1.1 : 1,
                  }}
                  transition={{ duration: duration.fast, delay: di * 0.01 }}
                >
                  {day && <div style={{ width: 8, height: 6, borderRadius: 2, background: isActive ? '#FFF' : day ? ill.textMid : 'transparent', opacity: isActive ? 1 : 0.8 }} />}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </IllustrationCard>
  );
}
