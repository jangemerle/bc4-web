/**
 * FoundationsBentoGrid — MetaMask-inspired bento grid for Foundations showcase
 *
 * Each cell is an interactive demo of a foundation pillar:
 *   Colors, Typography, Shadows, Border Radius, Icons, Illustrations
 *
 * Layout: 4-column grid with varying spans
 *   [Colors 2×2]  [Typography 2×1]
 *   .............. [Shadows 1×1] [Radius 1×1]
 *   [Icons 2×1]   [Illustrations 2×1]
 */

import { useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useInView } from 'motion/react';
import { usePress } from '../hooks/usePress';
import { spring, duration, ease } from '../tokens/motion';
import {
  Palette, Type, Layers, Circle, Grid3x3, Image,
  ArrowRight, Sun, Moon, Sparkles,
} from 'lucide-react';
import { Icon } from './Icon';
import { Illustration } from './Illustration';
import { useReducedMotion } from '../hooks/useReducedMotion';

// ─── Shared BentoCard wrapper ────────────────────────────────────────────────

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  span?: string;
  onClick?: () => void;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
}

function BentoCard({ children, className = '', span = '', onClick, label, sublabel, icon: CardIcon }: BentoCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const reducedMotion = useReducedMotion();

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [3, -3]), spring.snappy);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-3, 3]), spring.snappy);

  const handleMouse = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - r.left) / r.width);
    mouseY.set((e.clientY - r.top) / r.height);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden cursor-pointer group ${span} ${className}`}
      style={{
        perspective: '1000px',
        background: 'var(--color-surface-1)',
        border: '1px solid var(--color-surface-4)',
        borderRadius: 'var(--radius-lg, 12px)',
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        type: 'spring',
        visualDuration: spring.default.visualDuration,
        bounce: spring.default.bounce,
      }}
      onMouseMove={handleMouse}
      onMouseLeave={() => { mouseX.set(0.5); mouseY.set(0.5); }}
      onClick={onClick}
    >
      <motion.div
        className="h-full w-full"
        style={{
          rotateX: reducedMotion ? 0 : rotateX,
          rotateY: reducedMotion ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Content area */}
        <div className="p-6 md:p-8 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-8 h-8 flex items-center justify-center"
              style={{
                background: 'var(--color-secondary-1)',
                borderRadius: 'var(--radius-m, 8px)',
                color: 'var(--color-on-secondary-1)',
              }}
            >
              <CardIcon size={16} strokeWidth={2} />
            </div>
            <div>
              <div className="font-display font-bold text-sm" style={{ color: 'var(--color-on-surface)' }}>
                {label}
              </div>
              <div className="font-sans text-xs" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
                {sublabel}
              </div>
            </div>
          </div>

          {/* Interactive content */}
          <div className="flex-1 relative">
            {children}
          </div>

          {/* Hover arrow */}
          <motion.div
            className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100"
            initial={{ x: -8, opacity: 0 }}
            whileHover={{ x: 0, opacity: 1 }}
            transition={{ duration: duration.fast, ease: ease.enter }}
          >
            <div
              className="w-8 h-8 flex items-center justify-center rounded-xl"
              style={{
                background: 'var(--color-primary-1)',
              }}
            >
              <ArrowRight size={14} strokeWidth={2.5} color="var(--color-on-primary)" />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Cell: Colors ────────────────────────────────────────────────────────────

function ColorsDemo() {
  const [activeIdx, setActiveIdx] = useState(0);

  const palette = [
    { name: 'Primary', var: '--color-primary-1', size: 64 },
    { name: 'Secondary', var: '--color-on-secondary-1', size: 48 },
    { name: 'Success', var: '--color-success-1', size: 40 },
    { name: 'Warning', var: '--color-warning-1', size: 36 },
    { name: 'Danger', var: '--color-danger-1', size: 36 },
  ];

  return (
    <div className="flex flex-col h-full justify-between">
      {/* Color orbs */}
      <div className="flex items-center gap-3 flex-wrap py-4">
        {palette.map((c, i) => (
          <motion.div
            key={c.name}
            className="cursor-pointer"
            style={{
              width: c.size,
              height: c.size,
              borderRadius: '50%',
              background: `var(${c.var})`,
              boxShadow: activeIdx === i
                ? `0 0 0 3px var(--color-surface-1), 0 0 0 5px var(${c.var}), 0 8px 24px var(${c.var})`
                : 'none',
            }}
            animate={{
              scale: activeIdx === i ? 1.15 : 1,
              y: activeIdx === i ? -4 : 0,
            }}
            transition={spring.snappy}
            onMouseEnter={() => setActiveIdx(i)}
          />
        ))}
      </div>

      {/* Surface gradient strip */}
      <div className="mt-4">
        <div className="flex gap-1 h-6 w-full">
          {['--color-surface-1', '--color-surface-2', '--color-surface-3', '--color-surface-4', '--color-surface-5', '--color-surface-6', '--color-surface-7'].map((v) => (
            <motion.div
              key={v}
              className="flex-1"
              style={{
                background: `var(${v})`,
                borderRadius: 'var(--radius-s, 2px)',
              }}
              whileHover={{ scaleY: 1.5 }}
              transition={spring.snappy}
            />
          ))}
        </div>
        <div className="font-mono text-[10px] mt-2 tracking-wider" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
          7 surface tokens · semantic mapping
        </div>
      </div>
    </div>
  );
}

// ─── Cell: Typography ────────────────────────────────────────────────────────

function TypographyDemo() {
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);

  const lines = [
    { text: 'Aa', font: 'var(--font-brand, Borna)', weight: 700, size: 48, label: 'Brand' },
    { text: 'Headlines', font: 'var(--font-display, Borna)', weight: 700, size: 28, label: 'Display' },
    { text: 'Body text renders beautifully', font: "'Inter', sans-serif", weight: 400, size: 16, label: 'Body' },
    { text: '0123456789', font: "'JetBrains Mono', monospace", weight: 500, size: 14, label: 'Mono' },
  ];

  return (
    <div className="flex flex-col gap-3 py-2">
      {lines.map((line, i) => (
        <motion.div
          key={i}
          className="relative cursor-default"
          onMouseEnter={() => setHoveredLine(i)}
          onMouseLeave={() => setHoveredLine(null)}
          animate={{
            x: hoveredLine === i ? 8 : 0,
          }}
          transition={spring.snappy}
        >
          <div
            className="truncate"
            style={{
              fontFamily: line.font,
              fontWeight: line.weight,
              fontSize: line.size,
              lineHeight: 1.2,
              color: hoveredLine === i ? 'var(--color-primary-1)' : 'var(--color-on-surface)',
              transition: 'color 0.15s',
            }}
          >
            {line.text}
          </div>
          <motion.span
            className="absolute right-0 top-1/2 -translate-y-1/2 font-mono text-[10px] tracking-widest uppercase"
            style={{ color: 'var(--color-on-surface-subtle-2)' }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: hoveredLine === i ? 1 : 0, x: hoveredLine === i ? 0 : -10 }}
            transition={{ duration: duration.fast }}
          >
            {line.label}
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Cell: Shadows ───────────────────────────────────────────────────────────

function DepthButton({ d, active, onClick }: { d: number; active: boolean; onClick: () => void }) {
  const { isPressed, pressHandlers } = usePress({});
  return (
    <motion.button
      className="font-mono text-xs px-3 py-1.5 cursor-pointer"
      style={{
        background: active ? 'var(--color-primary-1)' : 'var(--color-surface-3)',
        color: active ? 'var(--color-on-primary)' : 'var(--color-on-surface-subtle-1)',
        borderRadius: 'var(--radius-m, 8px)',
        border: 'none',
      }}
      whileHover={{ scale: 1.05 }}
      animate={{ scale: isPressed ? 0.97 : 1 }}
      transition={spring.snappy}
      onClick={onClick}
      {...pressHandlers}
    >
      L{d}
    </motion.button>
  );
}

function ShadowsDemo() {
  const [depth, setDepth] = useState(1);
  const sizes = ['small', 'medium', 'large'] as const;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-5">
      {/* Floating card preview */}
      <motion.div
        className="w-full max-w-[180px] h-24 flex items-center justify-center"
        style={{
          background: 'var(--color-surface-1)',
          borderRadius: 'var(--radius-lg, 12px)',
          border: '1px solid var(--color-surface-3)',
          boxShadow: `var(--shadow-${sizes[depth - 1]}-${Math.min(depth, 3)})`,
        }}
        animate={{ y: depth === 1 ? 0 : depth === 2 ? -4 : -8 }}
        transition={spring.default}
      >
        <span className="font-mono text-xs" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
          {sizes[depth - 1]}-{depth}
        </span>
      </motion.div>

      {/* Depth slider */}
      <div className="flex gap-2 items-center">
        {[1, 2, 3].map((d) => (
          <DepthButton key={d} d={d} active={depth === d} onClick={() => setDepth(d)} />
        ))}
      </div>
    </div>
  );
}

// ─── Cell: Border Radius ─────────────────────────────────────────────────────

function RadiusDemo() {
  const [radiusIdx, setRadiusIdx] = useState(0);
  const tokens = [
    { name: 'S', var: '--radius-s' },
    { name: 'M', var: '--radius-m' },
    { name: 'LG', var: '--radius-lg' },
    { name: 'XL', var: '--radius-xl' },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      {/* Shape preview */}
      <motion.div
        className="w-24 h-24"
        style={{
          background: 'var(--color-primary-1)',
          borderRadius: `var(${tokens[radiusIdx].var})`,
        }}
        layout
        transition={spring.default}
      />

      {/* Token selector */}
      <div className="flex gap-1.5">
        {tokens.map((t, i) => (
          <motion.button
            key={t.name}
            className="font-mono text-[10px] tracking-wider px-2.5 py-1 cursor-pointer"
            style={{
              background: radiusIdx === i ? 'var(--color-on-surface)' : 'var(--color-surface-3)',
              color: radiusIdx === i ? 'var(--color-surface-1)' : 'var(--color-on-surface-subtle-1)',
              borderRadius: `var(${t.var})`,
              border: 'none',
            }}
            whileHover={{ scale: 1.08 }}
            onClick={() => setRadiusIdx(i)}
          >
            {t.name}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── Cell: Icons ─────────────────────────────────────────────────────────────

function IconsDemo() {
  const [hoveredIcon, setHoveredIcon] = useState<number | null>(null);

  const iconSlots = [
    { icon: Sun, label: 'Sun' },
    { icon: Moon, label: 'Moon' },
    { icon: Sparkles, label: 'Sparkles' },
    { icon: Palette, label: 'Palette' },
    { icon: Type, label: 'Type' },
    { icon: Layers, label: 'Layers' },
    { icon: Circle, label: 'Circle' },
    { icon: Grid3x3, label: 'Grid' },
    { icon: Image, label: 'Image' },
  ];

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="grid grid-cols-3 gap-3">
        {iconSlots.map((slot, i) => (
          <motion.div
            key={i}
            className="aspect-square flex items-center justify-center cursor-pointer"
            style={{
              background: hoveredIcon === i ? 'var(--color-secondary-1)' : 'var(--color-surface-3)',
              borderRadius: 'var(--radius-m, 8px)',
              color: hoveredIcon === i ? 'var(--color-on-secondary-1)' : 'var(--color-on-surface-subtle-1)',
              transition: 'background 0.15s, color 0.15s',
            }}
            animate={{
              scale: hoveredIcon === i ? 1.12 : 1,
              rotate: hoveredIcon === i ? 8 : 0,
            }}
            transition={spring.snappy}
            onMouseEnter={() => setHoveredIcon(i)}
            onMouseLeave={() => setHoveredIcon(null)}
          >
            <Icon icon={slot.icon} size="md" />
          </motion.div>
        ))}
      </div>
      <div className="font-mono text-[10px] mt-3 tracking-wider" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
        Lucide · 4 sizes · strokeWidth 2
      </div>
    </div>
  );
}

// ─── Cell: Illustrations ─────────────────────────────────────────────────────

const ILLUSTRATION_PICKS = [
  'building-blocks-assembled-creative-project-planning-finding-solutions-and-fixing-problems',
  'finishing-a-puzzle-brainstorm-coming-up-with-the-ideas-working-on-a-project-or-solutions-to-a-problem',
  'hand-drawn-high-five-gesture-celebrating-achievement-peer-encouragement-and-recognition-1',
  'eyes-following-star-goal-tracking-and-achievement-focus-trend-monitoring-and-analysis',
];

function IllustrationsDemo() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="h-full flex items-end justify-around pb-1">
      {ILLUSTRATION_PICKS.map((name, i) => (
        <motion.div
          key={i}
          className="cursor-pointer"
          animate={{ y: hovered === i ? -10 : 0, scale: hovered === i ? 1.12 : 1 }}
          transition={spring.snappy}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
        >
          <Illustration
            name={name}
            width={72}
            optimized={false}
            animated
            autoplay={hovered === i}
            loading="eager"
            alt=""
          />
        </motion.div>
      ))}
    </div>
  );
}

// ─── Main Bento Grid ─────────────────────────────────────────────────────────

interface FoundationsBentoGridProps {
  onNavigate?: (pageId: string) => void;
}

export function FoundationsBentoGrid({ onNavigate }: FoundationsBentoGridProps) {
  const handleNav = useCallback(
    (id: string) => {
      if (onNavigate) onNavigate(id);
    },
    [onNavigate],
  );

  return (
    <div className="w-full max-w-[1100px] mx-auto grid grid-cols-4 gap-4 auto-rows-[240px]">
      {/* Colors — large 2×2 */}
      <BentoCard
        span="col-span-2 row-span-2"
        label="Colors"
        sublabel="HSLUV palettes · Semantic tokens"
        icon={Palette}
        onClick={() => handleNav('colors')}
      >
        <ColorsDemo />
      </BentoCard>

      {/* Typography — 2×1 */}
      <BentoCard
        span="col-span-2 row-span-1"
        label="Typography"
        sublabel="Borna + Inter + JetBrains Mono"
        icon={Type}
        onClick={() => handleNav('typography')}
      >
        <TypographyDemo />
      </BentoCard>

      {/* Shadows — 1×1 */}
      <BentoCard
        span="col-span-1 row-span-1"
        label="Shadows"
        sublabel="3 sizes × 3 intensities"
        icon={Layers}
        onClick={() => handleNav('shadows')}
      >
        <ShadowsDemo />
      </BentoCard>

      {/* Border Radius — 1×1 */}
      <BentoCard
        span="col-span-1 row-span-1"
        label="Border Radius"
        sublabel="4 semantic tokens"
        icon={Circle}
        onClick={() => handleNav('border-radius')}
      >
        <RadiusDemo />
      </BentoCard>

      {/* Icons — 2×1 */}
      <BentoCard
        span="col-span-2 row-span-1"
        label="Icons"
        sublabel="Lucide · 4 size variants"
        icon={Grid3x3}
        onClick={() => handleNav('icons')}
      >
        <IconsDemo />
      </BentoCard>

      {/* Illustrations — 2×1 */}
      <BentoCard
        span="col-span-2 row-span-1"
        label="Illustrations"
        sublabel="Hand-drawn watercolor"
        icon={Image}
        onClick={() => handleNav('illustrations')}
      >
        <IllustrationsDemo />
      </BentoCard>
    </div>
  );
}
