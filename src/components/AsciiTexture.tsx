import { useState, useEffect, useRef, useMemo } from 'react';

// ─── Pattern types ──────────────────────────────────────────────────────────

export type AsciiPattern = 'terrain' | 'organic' | 'static' | 'crystal' | 'wave' | 'ember' | 'scale' | 'add' | 'changeOverTime';

// ─── Character ramps per pattern ────────────────────────────────────────────

const CHAR_RAMPS: Record<AsciiPattern, { idle: string[]; hover: string[] }> = {
  terrain: {
    idle:  [' ', '.', ':', '-', '=', '+', '*', '#', '%', '@'],
    hover: [' ', '▁', '▂', '▃', '▄', '▅', '▆', '▇', '█', '█'],
  },
  organic: {
    idle:  [' ', ' ', '·', '·', '.', '°', '○', '●', '◉', '◎'],
    hover: [' ', ' ', '∘', '◦', '○', '◯', '●', '◉', '◎', '⊙'],
  },
  static: {
    idle:  [' ', '░', '▒', '▓', '█', '▓', '▒', '░', ' ', '█'],
    hover: [' ', '▘', '▝', '▖', '▗', '▚', '▞', '▛', '▜', '█'],
  },
  crystal: {
    idle:  [' ', ' ', '·', '+', 'x', 'X', '◇', '◆', '✦', '◈'],
    hover: [' ', ' ', '∙', '×', '⊕', '⊗', '◇', '◆', '⬡', '⬢'],
  },
  wave: {
    idle:  ['~', '~', '-', '─', '═', '≈', '≋', '━', '~', '-'],
    hover: ['∼', '∽', '≈', '≋', '∿', '⏝', '⌢', '⌣', '∼', '∽'],
  },
  ember: {
    idle:  [' ', ' ', ' ', '·', '.', '°', '*', '✦', '●', '◉'],
    hover: [' ', ' ', '·', '∙', '•', '⁕', '✳', '✵', '✹', '✺'],
  },
  scale: {
    idle:  [' ', '·', '∘', '○', '◯', '●', '◉', '⊙', '⬤', '⬤'],
    hover: [' ', '·', '◦', '○', '◎', '●', '◉', '⊛', '⬤', '⬤'],
  },
  add: {
    idle:  [' ', ' ', '·', '◝', '◜', '◞', '◟', '◠', '◡', '●'],
    hover: [' ', ' ', '∙', '◝', '◜', '◞', '◟', '◠', '◡', '⊕'],
  },
  changeOverTime: {
    idle:  [' ', '▁', '▂', '▃', '▄', '▅', '▆', '▇', '█', '█'],
    hover: [' ', '░', '▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'],
  },
};

// ─── Color palettes per pattern (Kvalt-inspired) ────────────────────────────

const PATTERN_COLORS: Record<AsciiPattern, string> = {
  terrain:  'var(--color-primary-400)',   // green
  organic:  'var(--color-secondary-400)', // blue
  static:   'var(--color-grey-400)',      // neutral
  crystal:  'var(--color-danger-300)',     // pink/magenta
  wave:     'var(--color-primary-300)',   // light green
  ember:         'var(--color-warning-400)',   // amber/orange
  scale:         'var(--color-primary-400)',   // green — foundations
  add:           'var(--color-secondary-400)', // blue — components
  changeOverTime:'var(--color-warning-400)',   // amber — motion
};

// ─── Simple noise function (no dependencies) ────────────────────────────────

function pseudoRandom(x: number, y: number, seed: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed * 43.12) * 43758.5453;
  return n - Math.floor(n);
}

function smoothNoise(x: number, y: number, seed: number, scale: number): number {
  const sx = x / scale;
  const sy = y / scale;
  const ix = Math.floor(sx);
  const iy = Math.floor(sy);
  const fx = sx - ix;
  const fy = sy - iy;
  // bilinear interpolation
  const a = pseudoRandom(ix, iy, seed);
  const b = pseudoRandom(ix + 1, iy, seed);
  const c = pseudoRandom(ix, iy + 1, seed);
  const d = pseudoRandom(ix + 1, iy + 1, seed);
  const top = a + (b - a) * fx;
  const bottom = c + (d - c) * fx;
  return top + (bottom - top) * fy;
}

// ─── Grid generator ─────────────────────────────────────────────────────────

function generateGrid(
  cols: number,
  rows: number,
  pattern: AsciiPattern,
  seed: number,
  time: number,
  isHovered: boolean,
): string[][] {
  const ramp = isHovered ? CHAR_RAMPS[pattern].hover : CHAR_RAMPS[pattern].idle;
  const grid: string[][] = [];
  const rampLen = ramp.length;

  for (let y = 0; y < rows; y++) {
    const row: string[] = [];
    for (let x = 0; x < cols; x++) {
      let value: number;

      switch (pattern) {
        case 'terrain': {
          // layered noise for depth
          const n1 = smoothNoise(x, y, seed, 6);
          const n2 = smoothNoise(x, y, seed + 100, 12);
          const drift = isHovered ? Math.sin(time * 0.8 + y * 0.15) * 0.1 : 0;
          value = (n1 * 0.6 + n2 * 0.4 + drift);
          break;
        }
        case 'organic': {
          // circular blobs
          const cx = cols / 2 + Math.sin(seed * 3.14) * cols * 0.2;
          const cy = rows / 2 + Math.cos(seed * 2.71) * rows * 0.2;
          const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) / (cols * 0.4);
          const n = smoothNoise(x, y, seed, 8);
          const pulse = isHovered ? Math.sin(time * 1.2 + dist * 4) * 0.15 : 0;
          value = Math.max(0, 1 - dist) * n + pulse;
          break;
        }
        case 'static': {
          // random noise, shuffles on hover
          const timeSeed = isHovered ? Math.floor(time * 6) : 0;
          value = pseudoRandom(x, y, seed + timeSeed);
          break;
        }
        case 'crystal': {
          // geometric / hexagonal
          const hx = (x + (y % 2 === 0 ? 0 : 3)) % 6;
          const hy = y % 6;
          const base = smoothNoise(x, y, seed, 10);
          const geo = (hx < 2 || hy < 2) ? 0.8 : 0.2;
          const shimmer = isHovered ? Math.sin(time * 2 + x * 0.3 + y * 0.3) * 0.2 : 0;
          value = base * 0.4 + geo * 0.6 + shimmer;
          break;
        }
        case 'wave': {
          // sine waves
          const wave1 = Math.sin(x * 0.2 + seed * 2 + (isHovered ? time * 1.5 : 0));
          const wave2 = Math.sin(y * 0.3 + x * 0.1 + seed + (isHovered ? time * 0.8 : 0));
          const n = smoothNoise(x, y, seed, 14);
          value = (wave1 * 0.4 + wave2 * 0.3 + n * 0.3 + 1) / 2;
          break;
        }
        case 'ember': {
          // rising particles
          const rise = isHovered ? (y + time * 8) % rows : y;
          const n = smoothNoise(x, rise, seed, 5);
          const spark = pseudoRandom(x, Math.floor(rise), seed + (isHovered ? Math.floor(time * 3) : 0));
          value = spark > 0.85 ? n : spark > 0.7 ? n * 0.5 : 0;
          break;
        }
        case 'scale': {
          // Circles growing from left to right (like the Scale card)
          // Place 3-4 circles at increasing sizes across the width
          const numCircles = 4;
          let maxVal = 0;
          for (let i = 0; i < numCircles; i++) {
            const frac = (i + 0.5) / numCircles;
            const cx = frac * cols;
            const cy = rows * 0.5;
            const radius = (1.5 + i * 2.2) * (rows / 20);
            const dist = Math.sqrt((x - cx) ** 2 + ((y - cy) * 1.8) ** 2);
            // ring shape: bright at edge, dim inside
            const ring = Math.abs(dist - radius) < 1.2 ? 0.9 : dist < radius ? 0.15 : 0;
            const pulse = isHovered ? Math.sin(time * 2 - i * 0.8) * 0.15 : 0;
            maxVal = Math.max(maxVal, ring + pulse);
          }
          value = maxVal;
          break;
        }
        case 'add': {
          // Crescents / particles accumulating — sparse at top-left, dense at bottom-right
          const density = ((x / cols) * 0.5 + (y / rows) * 0.5);
          const n = smoothNoise(x, y, seed, 4);
          const threshold = 1 - density;
          const drift = isHovered ? Math.sin(time * 1.5 + x * 0.15 + y * 0.1) * 0.12 : 0;
          value = n > threshold ? (n - threshold) / (1 - threshold) + drift : 0;
          break;
        }
        case 'changeOverTime': {
          // Vertical bars growing taller from left to right (progression)
          const barWidth = 2;
          const gap = 1;
          const period = barWidth + gap;
          const inBar = (x % period) < barWidth;
          if (!inBar) {
            value = 0;
          } else {
            const barIndex = Math.floor(x / period);
            const totalBars = Math.floor(cols / period);
            const barHeight = (barIndex / totalBars) * rows * 0.95;
            const fromBottom = rows - y;
            const wave = isHovered ? Math.sin(time * 2.5 - barIndex * 0.3) * rows * 0.06 : 0;
            value = fromBottom <= barHeight + wave ? 0.3 + 0.7 * (barIndex / totalBars) : 0;
          }
          break;
        }
        default:
          value = smoothNoise(x, y, seed, 8);
      }

      const idx = Math.min(rampLen - 1, Math.max(0, Math.floor(value * rampLen)));
      row.push(ramp[idx]);
    }
    grid.push(row);
  }

  return grid;
}

// ─── Component ──────────────────────────────────────────────────────────────

interface AsciiTextureProps {
  pattern: AsciiPattern;
  cols?: number;
  rows?: number;
  seed?: number;
  isHovered?: boolean;
  className?: string;
  label?: string;
}

export function AsciiTexture({
  pattern,
  cols = 40,
  rows = 20,
  seed = 42,
  isHovered = false,
  className = '',
  label,
}: AsciiTextureProps) {
  const [time, setTime] = useState(0);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isHovered) {
      setTime(0); // eslint-disable-line react-hooks/set-state-in-effect -- reset on hover-off is intentional
      startTimeRef.current = 0;
      return;
    }

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = (timestamp - startTimeRef.current) / 1000;
      setTime(elapsed);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isHovered]);

  const grid = useMemo(
    () => generateGrid(cols, rows, pattern, seed, time, isHovered),
    [cols, rows, pattern, seed, time, isHovered],
  );

  const color = PATTERN_COLORS[pattern];

  return (
    <div
      className={`relative overflow-hidden font-mono select-none ${className}`}
      style={{
        fontSize: '10px',
        lineHeight: '12px',
        letterSpacing: '1px',
        color,
      }}
    >
      <pre className="m-0 p-3 whitespace-pre">
        {grid.map((row, y) => (
          <div key={y}>{row.join('')}</div>
        ))}
      </pre>
      {label && (
        <div
          className="absolute bottom-3 left-3 font-mono text-xs font-bold tracking-[0.2em] uppercase"
          style={{ color }}
        >
          {label}
        </div>
      )}
    </div>
  );
}
