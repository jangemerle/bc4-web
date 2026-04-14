/**
 * BlockText — CSS-rendered geometric block letterforms
 *
 * Inspired by modular/pixel typefaces with angled cuts.
 * Each letter is an SVG built from a 5×7 grid of rectangular modules.
 * Used for decorative headlines in the styleguide — not a real font.
 *
 * Usage:
 *   <BlockText text="KVALT" size={64} color="var(--color-on-surface)" />
 */

import { useMemo } from 'react';

// ─── Grid definitions ─────────────────────────────────────────────────────────
// Each letter is a 5-wide × 7-tall grid. 1 = filled, 0 = empty.
// Some cells use 'L','R','TL','TR','BL','BR' for diagonal cuts (angled corners).

type Cell = 0 | 1 | 'TL' | 'TR' | 'BL' | 'BR';

const GLYPHS: Record<string, Cell[][]> = {
  A: [
    [0, 'TL', 1, 'TR', 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  B: [
    [1, 1, 1, 'TR', 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 'TR', 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 'BR', 0],
  ],
  C: [
    [0, 'TL', 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [0, 'BL', 1, 1, 1],
  ],
  D: [
    [1, 1, 1, 'TR', 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 'BR', 0],
  ],
  E: [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  F: [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
  ],
  G: [
    [0, 'TL', 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 'BL', 1, 1, 1],
  ],
  H: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  I: [
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  J: [
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 'BL', 1, 'BR', 0],
  ],
  K: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 1, 0],
    [1, 0, 1, 0, 0],
    [1, 1, 'TR', 0, 0],
    [1, 0, 1, 0, 0],
    [1, 0, 0, 1, 0],
    [1, 0, 0, 0, 1],
  ],
  L: [
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  M: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  N: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  O: [
    [0, 'TL', 1, 'TR', 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 'BL', 1, 'BR', 0],
  ],
  P: [
    [1, 1, 1, 'TR', 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 'BR', 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
  ],
  Q: [
    [0, 'TL', 1, 'TR', 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 0],
    [0, 'BL', 1, 0, 1],
  ],
  R: [
    [1, 1, 1, 'TR', 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 'BR', 0],
    [1, 0, 1, 0, 0],
    [1, 0, 0, 1, 0],
    [1, 0, 0, 0, 1],
  ],
  S: [
    [0, 'TL', 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [0, 'BL', 1, 'TR', 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 1, 1, 'BR', 0],
  ],
  T: [
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  U: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 'BL', 1, 'BR', 0],
  ],
  V: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
  ],
  W: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 0, 0, 1],
  ],
  X: [
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 1, 0],
    [1, 0, 0, 0, 1],
  ],
  Y: [
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  Z: [
    [1, 1, 1, 1, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  ' ': [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  '.': [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0],
  ],
};

const COLS = 5;
const ROWS = 7;
const GAP_RATIO = 0.12; // gap between cells as ratio of cell size

// ─── Diagonal clip paths ──────────────────────────────────────────────────────
function getClipPath(cell: Cell): string | undefined {
  switch (cell) {
    case 'TL': return 'polygon(100% 0, 0 100%, 100% 100%)';
    case 'TR': return 'polygon(0 0, 100% 100%, 0 100%)';
    case 'BL': return 'polygon(0 0, 100% 0, 100% 100%)';
    case 'BR': return 'polygon(0 0, 100% 0, 0 100%)';
    default: return undefined;
  }
}

// ─── Single glyph SVG ─────────────────────────────────────────────────────────
function GlyphSVG({
  glyph,
  cellSize,
  gap,
  color,
}: {
  glyph: Cell[][];
  cellSize: number;
  gap: number;
  color: string;
}) {
  const w = COLS * cellSize + (COLS - 1) * gap;
  const h = ROWS * cellSize + (ROWS - 1) * gap;

  const rects: React.ReactNode[] = [];
  let id = 0;

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = glyph[row]?.[col];
      if (!cell) continue;

      const x = col * (cellSize + gap);
      const y = row * (cellSize + gap);
      const clip = getClipPath(cell);

      rects.push(
        <rect
          key={id++}
          x={x}
          y={y}
          width={cellSize}
          height={cellSize}
          fill={color}
          clipPath={clip ? `path('${clip}')` : undefined}
          style={clip ? { clipPath: clip } : undefined}
        />
      );
    }
  }

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg">
      {rects}
    </svg>
  );
}

// ─── BlockText component ──────────────────────────────────────────────────────
interface BlockTextProps {
  /** Uppercase text to render (A-Z, space, period supported) */
  text: string;
  /** Height of the rendered text in pixels */
  size?: number;
  /** Fill color — any CSS color value */
  color?: string;
  /** Gap between letters as ratio of size (default 0.15) */
  letterGap?: number;
  className?: string;
}

export function BlockText({
  text,
  size = 48,
  color = 'currentColor',
  letterGap = 0.15,
  className,
}: BlockTextProps) {
  const cellSize = useMemo(() => {
    return size / (ROWS + (ROWS - 1) * GAP_RATIO);
  }, [size]);

  const gap = cellSize * GAP_RATIO;

  const chars = text.toUpperCase().split('');

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'flex-end',
        gap: `${cellSize * letterGap}px`,
      }}
    >
      {chars.map((char, i) => {
        const glyph = GLYPHS[char];
        if (!glyph) return null;
        return <GlyphSVG key={i} glyph={glyph} cellSize={cellSize} gap={gap} color={color} />;
      })}
    </span>
  );
}

export default BlockText;
