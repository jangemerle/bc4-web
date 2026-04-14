import { motion } from 'motion/react';
import { IllustrationCard } from './IllustrationCard';
import { ill } from './tokens';
import { spring } from '../../tokens/motion';

export function ModalIllustration({ hovered = false }: { hovered?: boolean }) {
  return (
    <IllustrationCard rotation={-1} bg="#14263E" className="relative">
      {/* Overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', borderRadius: 10 }} />
      {/* Dialog */}
      <motion.div
        style={{
          position: 'relative',
          background: ill.card,
          borderRadius: 10,
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
        }}
        animate={{ scale: hovered ? 1.02 : 1, y: hovered ? -2 : 0 }}
        transition={spring.default}
      >
        {/* Title + close */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ width: 80, height: 9, borderRadius: 4, background: ill.text }} />
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: ill.subtle }} />
        </div>
        {/* Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <div style={{ width: '100%', height: 6, borderRadius: 3, background: ill.muted }} />
          <div style={{ width: '85%', height: 6, borderRadius: 3, background: ill.muted }} />
        </div>
        {/* Divider */}
        <div style={{ height: 1, background: ill.subtle }} />
        {/* Actions */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
          <div style={{ width: 44, height: 20, borderRadius: 5, border: `1px solid ${ill.muted}` }} />
          <div style={{ width: 52, height: 20, borderRadius: 5, background: ill.primary }} />
        </div>
      </motion.div>
    </IllustrationCard>
  );
}
