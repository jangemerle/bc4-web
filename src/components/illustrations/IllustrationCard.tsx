/**
 * IllustrationCard — base shell for all component card illustrations.
 *
 * Renders a soft blue-gray background zone with a floating white card
 * inside it (slight rotation, drop shadow). Each component illustration
 * fills the white card with its own content.
 */

import { motion } from 'motion/react';
import { ill } from './tokens';

interface IllustrationCardProps {
  children: React.ReactNode;
  /** Card rotation in degrees. Alternates between -1 and 1 per card. */
  rotation?: number;
  /** Background fill — defaults to the standard light blue-gray */
  bg?: string;
  className?: string;
}

export function IllustrationCard({
  children,
  rotation = -1,
  bg = ill.bg,
  className = '',
}: IllustrationCardProps) {
  return (
    <div
      className={`relative w-full flex items-center justify-center overflow-hidden ${className}`}
      style={{ background: bg, height: 200 }}
    >
      <motion.div
        style={{
          background: ill.card,
          borderRadius: 10,
          boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
          rotate: rotation,
          width: 200,
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 13,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
