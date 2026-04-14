/**
 * DashboardPreview — abstract dashboard layout using the generated palette.
 * Shows how the palette would look in a real UI: sidebar, cards, charts, buttons.
 * All elements are stylized blocks — no real content, just visual rhythm.
 */

import type { PaletteStep } from './types';
import { oklchToCss } from '../../lib/oklch';

interface DashboardPreviewProps {
  steps: PaletteStep[];
}

/** Get CSS color from a step index */
function c(steps: PaletteStep[], key: number): string {
  const step = steps.find((s) => s.key === key);
  return step ? oklchToCss(step.l, step.c, step.h) : '#888';
}

export function DashboardPreview({ steps }: DashboardPreviewProps) {
  const bg = c(steps, 100);
  const surface = c(steps, 50);
  const border = c(steps, 200);
  const subtle = c(steps, 300);
  const mid = c(steps, 400);
  const accent = c(steps, 500);
  const dark = c(steps, 700);
  const darker = c(steps, 800);
  const darkest = c(steps, 900);
  const text = c(steps, 850);
  const textMuted = c(steps, 600);

  return (
    <div
      className="w-full h-full rounded-lg overflow-hidden flex"
      style={{ backgroundColor: bg, border: `1px solid ${border}`, fontSize: 0 }}
    >
      {/* Sidebar */}
      <div
        className="w-16 shrink-0 flex flex-col gap-3 p-3"
        style={{ backgroundColor: darkest }}
      >
        {/* Logo block */}
        <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: accent }} />
        {/* Nav items */}
        {[0.6, 0.4, 0.4, 0.4, 0.4].map((opacity, i) => (
          <div
            key={i}
            className="w-10 h-8 rounded-md"
            style={{
              backgroundColor: i === 0 ? dark : darker,
              opacity,
            }}
          />
        ))}
        <div className="flex-1" />
        {/* Bottom avatar */}
        <div className="w-8 h-8 rounded-full self-center" style={{ backgroundColor: mid }} />
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 p-4 gap-3">
        {/* Top bar */}
        <div className="flex items-center gap-3">
          <div className="h-4 rounded-full flex-1" style={{ backgroundColor: border, maxWidth: 120 }} />
          <div className="flex-1" />
          <div className="h-7 w-7 rounded-full" style={{ backgroundColor: subtle }} />
          <div className="h-7 w-7 rounded-full" style={{ backgroundColor: subtle }} />
          <div className="h-7 rounded-full px-4" style={{ backgroundColor: accent, width: 72 }} />
        </div>

        {/* Stat cards row */}
        <div className="flex gap-2">
          {[accent, mid, dark, textMuted].map((color, i) => (
            <div
              key={i}
              className="flex-1 rounded-lg p-3 flex flex-col gap-2"
              style={{ backgroundColor: surface, border: `1px solid ${border}` }}
            >
              <div className="h-2 rounded-full w-2/3" style={{ backgroundColor: subtle }} />
              <div className="h-5 rounded-md w-1/2" style={{ backgroundColor: text }} />
              <div className="h-1.5 rounded-full w-full mt-1" style={{ backgroundColor: border }} >
                <div className="h-full rounded-full" style={{ backgroundColor: color, width: `${55 + i * 12}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Main content — chart area + side panel */}
        <div className="flex gap-2 flex-1 min-h-0">
          {/* Chart card */}
          <div
            className="flex-[2] rounded-lg p-3 flex flex-col"
            style={{ backgroundColor: surface, border: `1px solid ${border}` }}
          >
            <div className="h-2 rounded-full w-24 mb-3" style={{ backgroundColor: subtle }} />
            {/* Chart bars */}
            <div className="flex items-end gap-1.5 flex-1">
              {[40, 65, 50, 80, 55, 70, 90, 60, 75, 45, 85, 65].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm"
                  style={{
                    height: `${h}%`,
                    backgroundColor: i === 6 ? accent : i % 3 === 0 ? mid : subtle,
                    opacity: i === 6 ? 1 : 0.7,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Side list card */}
          <div
            className="flex-1 rounded-lg p-3 flex flex-col gap-2"
            style={{ backgroundColor: surface, border: `1px solid ${border}` }}
          >
            <div className="h-2 rounded-full w-16 mb-1" style={{ backgroundColor: subtle }} />
            {[accent, mid, dark, textMuted, accent].map((color, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md shrink-0" style={{ backgroundColor: color, opacity: 0.8 }} />
                <div className="flex flex-col gap-1 flex-1">
                  <div className="h-2 rounded-full" style={{ backgroundColor: text, width: `${60 + i * 8}%`, opacity: 0.6 }} />
                  <div className="h-1.5 rounded-full w-full" style={{ backgroundColor: border }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom table rows */}
        <div
          className="rounded-lg overflow-hidden"
          style={{ backgroundColor: surface, border: `1px solid ${border}` }}
        >
          {/* Header */}
          <div className="flex gap-3 px-3 py-2" style={{ backgroundColor: bg }}>
            {[40, 60, 80, 50].map((w, i) => (
              <div key={i} className="h-2 rounded-full" style={{ backgroundColor: textMuted, width: w, opacity: 0.5 }} />
            ))}
          </div>
          {/* Rows */}
          {[0, 1, 2].map((row) => (
            <div
              key={row}
              className="flex items-center gap-3 px-3 py-2"
              style={{ borderTop: `1px solid ${border}` }}
            >
              <div className="w-5 h-5 rounded-full shrink-0" style={{ backgroundColor: subtle }} />
              <div className="h-2 rounded-full" style={{ backgroundColor: text, width: 48, opacity: 0.5 }} />
              <div className="h-2 rounded-full flex-1" style={{ backgroundColor: border }} />
              <div
                className="h-5 rounded-full px-2"
                style={{ backgroundColor: row === 0 ? accent : row === 1 ? mid : subtle, width: 48 }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
