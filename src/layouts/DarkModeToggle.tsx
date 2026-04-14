/**
 * DarkModeToggle — pill-shaped three-way toggle: System | Light | Dark
 *
 * ToggleButtonItem states (from Figma node 8969:28101):
 *  - Selected=False, Default: no bg, icon = on-surface
 *  - Selected=False, Hover:   surface-1 bg, icon = on-surface
 *  - Selected=True,  Default: inverted-surface bg, icon = on-inverted-surface
 *  - Selected=True,  Hover:   inverted-surface bg, icon = on-inverted-surface
 *
 * Motion:
 *  - Scale bounce: 1 → 1.04 on hover with spring.playful
 *  - 3D tilt:     cursor-tracking rotateX/Y via spring.snappy
 *  - Press:       scale → 0.96, tilt flattens
 */

import { useRef, useCallback, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { Monitor, Sun, Moon } from 'lucide-react';
import { Icon } from '../components/Icon';
import { usePress } from '../hooks/usePress';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { spring, duration, ease, cssEase } from '../tokens/motion';
import { shadows } from '../tokens/shadows';
import type { ThemeMode } from '../utils/storageSchemas';

const MODES: ThemeMode[] = ['system', 'light', 'dark'];
const MODE_ICONS = { system: Monitor, light: Sun, dark: Moon } as const;
const MODE_LABELS: Record<ThemeMode, string> = {
  system: 'Use system theme',
  light: 'Switch to light mode',
  dark: 'Switch to dark mode',
};

const SLOT_SIZE = 32;
const GAP = 4;
const PADDING = 4;

interface DarkModeToggleProps {
  mode: ThemeMode;
  onModeChange: (mode: ThemeMode) => void;
}

export function DarkModeToggle({ mode, onModeChange }: DarkModeToggleProps) {
  const reducedMotion = useReducedMotion();
  const pillRef = useRef<HTMLDivElement>(null);
  const { isPressed, pressHandlers } = usePress({});
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredSlot, setHoveredSlot] = useState<ThemeMode | null>(null);
  const [pressedSlot, setPressedSlot] = useState<ThemeMode | null>(null);

  // 3D tilt motion values
  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rotateX = useSpring(rawRotateX, spring.snappy);
  const rotateY = useSpring(rawRotateY, spring.snappy);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (reducedMotion || !pillRef.current) return;
      const rect = pillRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      rawRotateY.set((x - 0.5) * 24);
      rawRotateX.set((0.5 - y) * 20);
    },
    [reducedMotion, rawRotateX, rawRotateY],
  );

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setHoveredSlot(null);
    setPressedSlot(null);
    rawRotateX.set(0);
    rawRotateY.set(0);
  }, [rawRotateX, rawRotateY]);

  const targetScale = isPressed ? 0.96 : isHovered && !reducedMotion ? 1.04 : 1;

  const selectedIndex = MODES.indexOf(mode);
  const indicatorLeft = PADDING + selectedIndex * (SLOT_SIZE + GAP);

  const slotBg = (slot: ThemeMode, selected: boolean): string => {
    if (selected) return 'transparent';
    if (pressedSlot === slot || hoveredSlot === slot) return 'var(--color-surface-1)';
    return 'transparent';
  };

  const slotShadow = (slot: ThemeMode, selected: boolean): string => {
    if (selected) return 'none';
    if (pressedSlot === slot || hoveredSlot === slot) return shadows['medium-1'];
    return 'none';
  };

  const totalWidth = PADDING * 2 + SLOT_SIZE * 3 + GAP * 2;

  return (
    <div style={{ perspective: 600 }}>
      <motion.div
        ref={pillRef}
        role="radiogroup"
        aria-label="Theme mode"
        className="relative flex items-center rounded-full cursor-pointer outline-none"
        style={{
          padding: PADDING,
          gap: GAP,
          width: totalWidth,
          height: 40,
          backgroundColor: isHovered && !reducedMotion
            ? 'var(--color-secondary-1)'
            : 'var(--color-secondary-2)',
          boxShadow: isHovered && !reducedMotion
            ? shadows['medium-2']
            : 'none',
          transition: `background-color ${duration.fast}s ${cssEase(ease.standard)}, box-shadow ${duration.fast}s ${cssEase(ease.standard)}`,
          rotateX: reducedMotion ? 0 : rotateX,
          rotateY: reducedMotion ? 0 : rotateY,
        }}
        initial={false}
        animate={{ scale: targetScale }}
        transition={isPressed ? spring.snappy : { scale: spring.playful }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...pressHandlers}
      >
        {/* Sliding indicator */}
        <motion.div
          className="absolute top-1 rounded-full"
          style={{
            width: SLOT_SIZE,
            height: SLOT_SIZE,
            backgroundColor: 'var(--color-inverted-surface)',
          }}
          animate={{ left: indicatorLeft }}
          transition={spring.snappy}
        />

        {/* Slots */}
        {MODES.map((m) => {
          const selected = mode === m;
          return (
            <button
              key={m}
              role="radio"
              aria-checked={selected}
              aria-label={MODE_LABELS[m]}
              onClick={() => onModeChange(m)}
              className="relative z-10 flex items-center justify-center rounded-full bg-transparent border-none cursor-pointer p-0"
              style={{
                width: SLOT_SIZE,
                height: SLOT_SIZE,
                backgroundColor: slotBg(m, selected),
                boxShadow: slotShadow(m, selected),
                transition: `background-color ${duration.fast}s ${cssEase(ease.standard)}, box-shadow ${duration.fast}s ${cssEase(ease.standard)}`,
              }}
              onMouseEnter={() => setHoveredSlot(m)}
              onMouseLeave={() => setHoveredSlot(null)}
              onMouseDown={() => setPressedSlot(m)}
              onMouseUp={() => setPressedSlot(null)}
            >
              <Icon
                icon={MODE_ICONS[m]}
                size="sm"
                style={{
                  color: selected
                    ? 'var(--color-on-inverted-surface)'
                    : 'var(--color-on-surface)',
                  transition: `color ${duration.fast}s ${cssEase(ease.standard)}`,
                }}
              />
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}
