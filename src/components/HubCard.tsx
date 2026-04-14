/**
 * HubCard — shared card for HelloPage and all hub-level pages.
 *
 * Styled after the elevated secondary Button:
 *   surface-1 bg · no border · shadow-small-2 → shadow-medium-2 on hover
 *   title: on-surface → on-secondary-1 on hover
 *   subtitle: on-surface-subtle-2 → on-secondary-2 on hover
 */

import { useRef, useCallback, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useInView } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { spring, duration } from '../tokens/motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { usePress } from '../hooks/usePress';

export interface HubCardProps {
  title: string;
  subtitle: string;
  /** clamp() string or fixed rem — defaults to section-card size */
  titleSize?: string;
  minHeight?: number;
  delay?: number;
  onClick?: () => void;
  /** Optional animated illustration rendered in the top zone of the card */
  illustration?: (hovered: boolean) => React.ReactNode;
}

export function HubCard({
  title,
  subtitle,
  titleSize = 'clamp(1.5rem, 2.5vw, 2rem)',
  minHeight = 220,
  delay = 0,
  onClick,
  illustration,
}: HubCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const reducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const { isPressed, pressHandlers } = usePress({});
  const targetScale = isPressed ? 0.98 : hovered && !reducedMotion ? 1.02 : 1;

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [2.5, -2.5]), spring.snappy);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-2.5, 2.5]), spring.snappy);

  const handleMouse = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - r.left) / r.width);
    mouseY.set((e.clientY - r.top) / r.height);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={ref}
      className="relative overflow-hidden cursor-pointer group shadow-small-2 hover:shadow-medium-2 transition-shadow duration-150"
      style={{
        background: 'var(--color-surface-1)',
        borderRadius: '20px',
        perspective: '1000px',
      }}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0, scale: targetScale } : {}}
      transition={{
        type: 'spring',
        visualDuration: spring.default.visualDuration,
        bounce: spring.default.bounce,
        delay,
        scale: isPressed ? spring.snappy : spring.playful,
      }}
      onMouseMove={handleMouse}
      onMouseLeave={() => { mouseX.set(0.5); mouseY.set(0.5); setHovered(false); }}
      onMouseEnter={() => setHovered(true)}
      onClick={onClick}
      {...pressHandlers}
    >
      {illustration && illustration(hovered)}
      <motion.div
        className={`h-full w-full px-8 py-8 flex flex-col ${illustration ? 'justify-start' : 'justify-end'}`}
        style={{
          minHeight: illustration ? 0 : minHeight,
          rotateX: reducedMotion ? 0 : rotateX,
          rotateY: reducedMotion ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        <h2
          className="font-display font-bold leading-none mb-2 transition-colors duration-150
                     text-[var(--color-on-surface)] group-hover:text-[var(--color-on-secondary-1)]"
          style={{ fontSize: titleSize }}
        >
          {title}
        </h2>
        <p
          className="font-mono text-sm transition-colors duration-150
                     text-[var(--color-on-surface-subtle-2)] group-hover:text-[var(--color-on-secondary-2)]"
        >
          {subtitle}
        </p>
      </motion.div>

      {/* Arrow indicator for cards without illustration/icon */}
      {!illustration && (
        <div
          className="absolute bottom-4 right-4 opacity-0 -translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0"
          style={{ transition: `opacity ${duration.fast * 1000}ms ease, transform ${duration.fast * 1000}ms ease` }}
        >
          <div
            className="w-8 h-8 flex items-center justify-center rounded-xl"
            style={{ background: 'var(--color-secondary-1)' }}
          >
            <ArrowRight size={14} strokeWidth={2.5} color="var(--color-on-secondary-1)" />
          </div>
        </div>
      )}
    </motion.div>
  );
}
