import { motion, AnimatePresence } from 'motion/react';
import { IllustrationCard } from './IllustrationCard';
import { ill } from './tokens';
import { duration } from '../../tokens/motion';

export function TooltipIllustration({ hovered = false }: { hovered?: boolean }) {
  return (
    <IllustrationCard rotation={1}>
      {/* Spacer */}
      <div style={{ height: 8 }} />
      {/* Tooltip bubble */}
      <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
        <AnimatePresence>
          {hovered && (
            <motion.div
              key="tooltip"
              style={{
                position: 'absolute',
                bottom: '100%',
                background: ill.text,
                borderRadius: 5,
                padding: '6px 10px',
                marginBottom: 6,
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                whiteSpace: 'nowrap',
              }}
              initial={{ opacity: 0, y: 4, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 2, scale: 0.95 }}
              transition={{ duration: duration.fast }}
            >
              <div style={{ width: 56, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.8)' }} />
              {/* Arrow */}
              <div style={{ position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: `4px solid ${ill.text}` }} />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Trigger button */}
        <motion.div
          style={{ height: 28, borderRadius: 6, background: ill.primary, padding: '0 16px', display: 'flex', alignItems: 'center' }}
          animate={{ boxShadow: hovered ? 'color-mix(in srgb, var(--color-primary-1) 25%, transparent) 0 0 0 3px' : 'none' }}
          transition={{ duration: duration.fast }}
        >
          <div style={{ width: 44, height: 7, borderRadius: 3, background: 'rgba(255,255,255,0.9)' }} />
        </motion.div>
      </div>
      {/* Below content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 8 }}>
        <div style={{ width: '90%', height: 7, borderRadius: 4, background: ill.muted }} />
        <div style={{ width: '65%', height: 7, borderRadius: 4, background: ill.muted }} />
      </div>
    </IllustrationCard>
  );
}
