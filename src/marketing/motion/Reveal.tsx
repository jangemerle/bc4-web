import type { ComponentProps, ElementType, ReactNode } from 'react';
import { motion, type Variants } from 'motion/react';

/**
 * Block fade-up for non-text groups (cards, grids, media). `translateY(28px)` +
 * opacity, 0.8s, replaying on re-enter. Pair `RevealStagger` (parent) with
 * `RevealItem` (children) for the 85ms-staggered grid reveal.
 */

const EASE = [0.16, 0.84, 0.44, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

const viewport = { once: false, amount: 0.2 } as const;

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Extra entrance delay in seconds. */
  delay?: number;
}

export function Reveal({ children, as = 'div', className, delay = 0 }: RevealProps) {
  const M = motion[as as keyof typeof motion] as ElementType;
  return (
    <M
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={{
        hidden: { opacity: 0, y: 28 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE, delay } },
      }}
    >
      {children}
    </M>
  );
}

interface RevealStaggerProps extends Omit<ComponentProps<typeof motion.div>, 'variants'> {
  children: ReactNode;
  as?: ElementType;
  /** Per-child stagger in seconds — default 0.085 (85ms). */
  stagger?: number;
}

export function RevealStagger({ children, as = 'div', stagger = 0.085, ...rest }: RevealStaggerProps) {
  const M = motion[as as keyof typeof motion] as ElementType;
  return (
    <M
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.15 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
      {...rest}
    >
      {children}
    </M>
  );
}

interface RevealItemProps extends Omit<ComponentProps<typeof motion.div>, 'variants'> {
  children: ReactNode;
  as?: ElementType;
}

export function RevealItem({ children, as = 'div', ...rest }: RevealItemProps) {
  const M = motion[as as keyof typeof motion] as ElementType;
  return (
    <M variants={fadeUp} {...rest}>
      {children}
    </M>
  );
}
