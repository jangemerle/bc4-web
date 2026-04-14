import { motion } from 'motion/react';
import { IllustrationCard } from './IllustrationCard';
import { ill } from './tokens';
import { spring } from '../../tokens/motion';

export function ModalFullscreenIllustration({ hovered = false }: { hovered?: boolean }) {
  return (
    <IllustrationCard rotation={1} bg="#1E293B" className="relative overflow-hidden">
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', borderRadius: 10 }} />
      <motion.div
        style={{
          position: 'relative',
          background: ill.card,
          borderRadius: '10px 10px 0 0',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          marginLeft: -8, marginRight: -8,
          boxShadow: '0 -4px 24px rgba(0,0,0,0.2)',
        }}
        animate={{ y: hovered ? -4 : 0 }}
        transition={spring.default}
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: -2 }}>
          <div style={{ width: 28, height: 3, borderRadius: 2, background: ill.muted }} />
        </div>
        {/* Title */}
        <div style={{ width: 90, height: 9, borderRadius: 4, background: ill.text }} />
        {/* Body lines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <div style={{ width: '100%', height: 6, borderRadius: 3, background: ill.muted }} />
          <div style={{ width: '90%', height: 6, borderRadius: 3, background: ill.muted }} />
          <div style={{ width: '70%', height: 6, borderRadius: 3, background: ill.muted }} />
        </div>
        {/* Actions */}
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ flex: 1, height: 22, borderRadius: 5, background: ill.primary }} />
          <div style={{ flex: 1, height: 22, borderRadius: 5, border: `1px solid ${ill.muted}` }} />
        </div>
      </motion.div>
    </IllustrationCard>
  );
}
