import { useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { AsciiTexture, type AsciiPattern } from './AsciiTexture';
import { spring } from '../tokens/motion';

// ─── Foundation card data ────────────────────────────────────────────────────

interface FoundationCard {
  id: string;
  label: string;
  pattern: AsciiPattern;
  seed: number;
  subtitle: string;
}

const FOUNDATIONS: FoundationCard[] = [
  { id: 'colors',        label: 'Colors',        pattern: 'organic',  seed: 42,  subtitle: 'HSLUV palettes · Semantic tokens' },
  { id: 'typography',    label: 'Typography',    pattern: 'wave',     seed: 137, subtitle: 'Inter + Borna · Type scale' },
  { id: 'shadows',       label: 'Shadows',       pattern: 'terrain',  seed: 256, subtitle: '3 sizes × 3 intensities' },
  { id: 'border-radius', label: 'Border Radius', pattern: 'crystal',  seed: 89,  subtitle: '4 semantic tokens' },
  { id: 'icons',         label: 'Icons',         pattern: 'static',   seed: 512, subtitle: 'Lucide · 4 size variants' },
  { id: 'illustrations', label: 'Illustrations', pattern: 'ember',    seed: 333, subtitle: 'Hand-drawn watercolor' },
];

// ─── Apple TV tilt card ─────────────────────────────────────────────────────

function TiltCard({
  card,
  index,
  hoveredIndex,
  onHover,
  onLeave,
  onClick,
}: {
  card: FoundationCard;
  index: number;
  hoveredIndex: number | null;
  onHover: (i: number) => void;
  onLeave: () => void;
  onClick: (id: string) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isHovered = hoveredIndex === index;

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [6, -6]), spring.snappy);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-6, 6]), spring.snappy);

  // Cascading: neighbors react
  const getNeighborScale = () => {
    if (hoveredIndex === null) return 1;
    const dist = Math.abs(index - hoveredIndex);
    if (dist === 0) return 1.03;
    if (dist === 1) return 1.01;
    return 0.98;
  };

  const getNeighborOpacity = () => {
    if (hoveredIndex === null) return 1;
    const dist = Math.abs(index - hoveredIndex);
    if (dist === 0) return 1;
    if (dist === 1) return 0.7;
    return 0.5;
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    },
    [mouseX, mouseY],
  );

  return (
    <motion.div
      ref={cardRef}
      className="relative cursor-pointer group"
      style={{ perspective: '800px' }}
      animate={{
        scale: getNeighborScale(),
        opacity: getNeighborOpacity(),
      }}
      transition={{
        type: 'spring',
        visualDuration: spring.default.visualDuration,
        bounce: spring.default.bounce,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => {
        mouseX.set(0.5);
        mouseY.set(0.5);
        onLeave();
      }}
      onClick={() => onClick(card.id)}
    >
      <motion.div
        className="overflow-hidden"
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          transformStyle: 'preserve-3d',
          aspectRatio: '1 / 1',
          background: '#0a0a0a',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: isHovered
            ? '0 25px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)'
            : '0 2px 8px rgba(0,0,0,0.2)',
        }}
      >
        {/* ASCII texture */}
        <div className="absolute inset-0">
          <AsciiTexture
            pattern={card.pattern}
            cols={48}
            rows={24}
            seed={card.seed}
            isHovered={isHovered}
          />
        </div>

        {/* Label — bottom left, minimal */}
        <div className="absolute bottom-0 left-0 right-0 p-5 pt-16"
          style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}
        >
          <div className="font-mono text-[11px] font-semibold tracking-[0.25em] uppercase text-white/90">
            {card.label}
          </div>
          <div className="font-mono text-[9px] tracking-[0.15em] text-white/40 mt-1">
            {card.subtitle}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Cover Flow ─────────────────────────────────────────────────────────────

interface FoundationsCoverFlowProps {
  onNavigate?: (pageId: string) => void;
}

export function FoundationsCoverFlow({ onNavigate }: FoundationsCoverFlowProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleClick = useCallback(
    (id: string) => {
      if (onNavigate) onNavigate(id);
    },
    [onNavigate],
  );

  return (
    <div className="grid grid-cols-3 gap-5 w-full max-w-[1100px] mx-auto">
      {FOUNDATIONS.map((card, i) => (
        <TiltCard
          key={card.id}
          card={card}
          index={i}
          hoveredIndex={hoveredIndex}
          onHover={setHoveredIndex}
          onLeave={() => setHoveredIndex(null)}
          onClick={handleClick}
        />
      ))}
    </div>
  );
}
