/**
 * ChromaCurveEditor — SVG interactive chroma curve for 12 palette steps.
 *
 * X axis: step index (50 → 900, left to right)
 * Y axis: chroma (0 at bottom, max at top)
 * Each dot is draggable vertically. A smooth path connects them.
 * A dashed line shows the sRGB gamut boundary per step.
 */

import { useMemo, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { oklchToHex, maxChromaForLH, DEFAULT_LIGHTNESS, CHROMA_PRESETS } from '../../lib/oklch';
import { spring } from '../../tokens/motion';
import type { PaletteStep } from './types';
import { STEP_KEYS } from './types';

interface ChromaCurveEditorProps {
  steps: PaletteStep[];
  hue: number;
  onChromaChange: (stepIndex: number, newChroma: number) => void;
}

// ─── Layout constants ────────────────────────────────────────────────────────

const PAD_L = 48;
const PAD_R = 56;
const PAD_T = 16;
const PAD_B = 32;
const W = 640;
const H = 280;
const PLOT_W = W - PAD_L - PAD_R;
const PLOT_H = H - PAD_T - PAD_B;
const MAX_C = 0.30; // y-axis max chroma

function stepX(i: number): number {
  return PAD_L + (i / (STEP_KEYS.length - 1)) * PLOT_W;
}

function chromaToY(c: number): number {
  return PAD_T + PLOT_H - (c / MAX_C) * PLOT_H;
}

function yToChroma(y: number): number {
  const c = ((PAD_T + PLOT_H - y) / PLOT_H) * MAX_C;
  return Math.max(0, Math.min(MAX_C, c));
}

// Catmull-Rom → cubic bezier path through points
function smoothPath(points: [number, number][]): string {
  if (points.length < 2) return '';
  const d: string[] = [`M${points[0][0]},${points[0][1]}`];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d.push(`C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2[0]},${p2[1]}`);
  }
  return d.join(' ');
}

export function ChromaCurveEditor({ steps, hue, onChromaChange }: ChromaCurveEditorProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef<number | null>(null);

  // Compute gamut boundary
  const gamutBoundary: [number, number][] = steps.map((s, i) => [
    stepX(i),
    chromaToY(maxChromaForLH(s.l, s.h)),
  ]);

  // Compute preset curves based on hue
  const presetCurves = useMemo(() => {
    return CHROMA_PRESETS.map((preset) => {
      const points: [number, number][] = DEFAULT_LIGHTNESS.map((l, i) => {
        const base = maxChromaForLH(l, hue) * preset.percentage;
        const c = preset.shape ? base * preset.shape[i] : base;
        return [stepX(i), chromaToY(c)];
      });
      return { ...preset, points };
    });
  }, [hue]);

  // Current dots
  const dots: [number, number][] = steps.map((s, i) => [stepX(i), chromaToY(s.c)]);

  const getSvgY = useCallback((clientY: number) => {
    if (!svgRef.current) return 0;
    const rect = svgRef.current.getBoundingClientRect();
    return ((clientY - rect.top) / rect.height) * H;
  }, []);

  const handlePointerDown = useCallback((i: number) => (e: React.PointerEvent) => {
    dragging.current = i;
    (e.target as SVGElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (dragging.current === null) return;
    const y = getSvgY(e.clientY);
    const newC = yToChroma(y);
    // Clamp to gamut
    const step = steps[dragging.current];
    const max = maxChromaForLH(step.l, step.h);
    onChromaChange(dragging.current, Math.min(newC, max));
  }, [getSvgY, onChromaChange, steps]);

  const handlePointerUp = useCallback(() => {
    dragging.current = null;
  }, []);

  // Y-axis labels
  const yLabels = [0, 0.05, 0.10, 0.15, 0.20, 0.25, 0.30];

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      className="w-full select-none"
      style={{ maxWidth: W, cursor: dragging.current !== null ? 'grabbing' : 'default' }} // eslint-disable-line react-hooks/refs
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Grid lines */}
      {yLabels.map((v) => (
        <g key={v}>
          <line
            x1={PAD_L} y1={chromaToY(v)} x2={W - PAD_R} y2={chromaToY(v)}
            stroke="var(--color-surface-4)" strokeWidth={1}
          />
          <text
            x={PAD_L - 6} y={chromaToY(v) + 3}
            textAnchor="end" fontSize={9} fontFamily="var(--font-body)"
            fill="var(--color-on-surface-subtle-2)"
          >
            {v.toFixed(2)}
          </text>
        </g>
      ))}

      {/* X-axis step labels */}
      {STEP_KEYS.map((key, i) => (
        <text
          key={key}
          x={stepX(i)} y={H - 6}
          textAnchor="middle" fontSize={9} fontFamily="'JetBrains Mono', monospace"
          fill="var(--color-on-surface-subtle-2)"
        >
          {key}
        </text>
      ))}

      {/* Gamut boundary (dashed) */}
      <path
        d={smoothPath(gamutBoundary)}
        fill="none"
        stroke="var(--color-danger-1)"
        strokeWidth={1}
        strokeDasharray="4 3"
        opacity={0.5}
      />

      {/* Preset curves (dashed reference lines) */}
      {presetCurves.map((preset, pi) => {
        const opacity = 0.25 + pi * 0.08; // 0.25, 0.33, 0.41, 0.49
        const lastPt = preset.points[preset.points.length - 1];
        return (
          <g key={preset.name}>
            <path
              d={smoothPath(preset.points)}
              fill="none"
              stroke="var(--color-on-surface-subtle-2)"
              strokeWidth={1}
              strokeDasharray="3 4"
              opacity={opacity}
            />
            <text
              x={lastPt[0] + 6}
              y={lastPt[1] + 3}
              fontSize={8}
              fontFamily="'JetBrains Mono', monospace"
              fill="var(--color-on-surface-subtle-2)"
              opacity={opacity + 0.15}
            >
              {preset.name}
            </text>
          </g>
        );
      })}

      {/* Chroma curve path */}
      <path
        d={smoothPath(dots)}
        fill="none"
        stroke="var(--color-on-surface-subtle-1)"
        strokeWidth={2}
      />

      {/* Draggable dots */}
      {steps.map((step, i) => {
        const cx = stepX(i);
        const cy = chromaToY(step.c);
        const fill = oklchToHex(step.l, step.c, step.h);
        return (
          <motion.circle
            key={i}
            cx={cx}
            cy={cy}
            r={7}
            fill={fill}
            stroke="var(--color-surface-1)"
            strokeWidth={2}
            style={{ cursor: 'grab', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}
            whileHover={{ r: 10 }}
            transition={spring.snappy}
            onPointerDown={handlePointerDown(i)}
          />
        );
      })}
    </svg>
  );
}
