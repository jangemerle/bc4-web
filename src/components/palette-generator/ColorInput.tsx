/**
 * ColorInput — Figma-style color picker for the palette generator.
 *
 * Inline HexColorPicker (gradient square + hue rail) from react-colorful,
 * styled to match Kvalt tokens. No popover — it lives in the page.
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { HexColorPicker } from 'react-colorful';
import { parseColorString, oklchToHex, oklchToCss, maxChromaForLH } from '../../lib/oklch';
import type { OklchColor } from '../../lib/oklch';

interface ColorInputProps {
  /** System color — the closest palette step to the raw picked color */
  value: OklchColor;
  onChange: (color: OklchColor) => void;
  /** Raw color exactly as the user picked it — may differ in L and C */
  rawColor?: OklchColor;
  /** The step key (50, 100, 200…) of the closest palette step shown as "System uses" */
  systemStepKey?: number;
}

export function ColorInput({ value, onChange, rawColor, systemStepKey }: ColorInputProps) {
  // Picker always shows the raw picked color; falls back to system color
  const pickerColor = rawColor ?? value;
  const hex = oklchToHex(pickerColor.l, pickerColor.c, pickerColor.h);
  const css = oklchToCss(value.l, value.c, value.h);

  // Show conversion panel when raw and system differ meaningfully
  const lDiff = rawColor ? Math.abs(rawColor.l - value.l) > 0.005 : false;
  const cDiff = rawColor ? Math.abs(rawColor.c - value.c) > 0.002 : false;
  const showConversion = lDiff || cDiff;

  const [text, setText] = useState(hex);

  // Keep text in sync when value changes externally
  useEffect(() => {
    setText(hex);
  }, [hex]);

  const handlePickerChange = useCallback((newHex: string) => {
    setText(newHex);
    const parsed = parseColorString(newHex);
    if (parsed) onChange(parsed);
  }, [onChange]);

  const rawCss = rawColor ? oklchToCss(rawColor.l, rawColor.c, rawColor.h) : null;

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setText(v);
    const parsed = parseColorString(v);
    if (parsed) onChange(parsed);
  }, [onChange]);

  return (
    <div className="flex gap-10 items-start">
      {/* Picker + hex input */}
      <div className="flex flex-col gap-3" style={{ width: 240 }}>
        <div className="color-input-picker">
          <HexColorPicker color={oklchToHex(pickerColor.l, pickerColor.c, pickerColor.h)} onChange={handlePickerChange} />
        </div>

        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          placeholder="#7DDB85 or oklch(0.8 0.15 146)"
          spellCheck={false}
          className="font-mono text-sm px-3 py-2 w-full"
          style={{
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-m)',
            color: 'var(--color-on-surface)',
            outline: 'none',
          }}
        />

        <GamutCurve hue={value.h} lightness={value.l} />
      </div>

      {/* Color preview + OKLCH readout */}
      <div className="flex flex-col gap-4 pt-1" style={{ maxWidth: 260 }}>
        {showConversion && rawColor && rawCss ? (
          /* ── Conversion view ── */
          <div className="flex flex-col gap-3">
            {/* Two swatches */}
            <div className="flex items-end gap-3">
              <div className="flex flex-col items-center gap-1.5">
                <div style={{ width: 64, height: 64, backgroundColor: rawCss, borderRadius: 'var(--radius-l)', boxShadow: 'var(--shadow-medium-1)' }} />
                <span className="font-mono text-[9px] uppercase tracking-wide" style={{ color: 'var(--color-on-surface-subtle-2)' }}>Your pick</span>
              </div>
              <div className="flex flex-col items-center gap-1 pb-5" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
                <span className="font-mono text-[10px]">→</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div style={{ width: 64, height: 64, backgroundColor: css, borderRadius: 'var(--radius-l)', boxShadow: 'var(--shadow-medium-1)', outline: '2px solid var(--color-primary-1)', outlineOffset: 2 }} />
                <span className="font-mono text-[9px] uppercase tracking-wide" style={{ color: 'var(--color-primary-1)' }}>Shade {systemStepKey ?? '—'}</span>
              </div>
            </div>

            {/* Diff readout */}
            <div className="flex flex-col gap-1.5 p-3 rounded-lg" style={{ backgroundColor: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
              <span className="font-sans text-[11px] font-semibold mb-0.5" style={{ color: 'var(--color-on-surface)' }}>Used as shade {systemStepKey ?? '—'} in your palette</span>
              <span className="font-mono text-[10px]" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                H {rawColor.h.toFixed(1)}° → kept exactly
              </span>
              {lDiff && (
                <span className="font-mono text-[10px]" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                  L {rawColor.l.toFixed(3)} → {value.l.toFixed(3)} · shade {systemStepKey} baseline
                </span>
              )}
              {cDiff && (
                <span className="font-mono text-[10px]" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                  C {rawColor.c.toFixed(4)} → {value.c.toFixed(4)} · gamut curve
                </span>
              )}
            </div>
          </div>
        ) : (
          /* ── Default single swatch ── */
          <>
            <div style={{ width: 80, height: 80, backgroundColor: css, borderRadius: 'var(--radius-l)', boxShadow: 'var(--shadow-medium-1)' }} />
            <div className="flex flex-col gap-2">
              <div className="flex gap-5">
                <Stat label="H" value={`${value.h.toFixed(1)}°`} />
                <Stat label="C" value={value.c.toFixed(4)} />
                <Stat label="L" value={value.l.toFixed(3)} />
              </div>
              <span className="font-mono text-[10px]" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
                {css}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Scoped picker overrides */}
      <style>{`
        .color-input-picker .react-colorful {
          width: 240px;
          height: 220px;
          border-radius: var(--radius-l);
          overflow: hidden;
          box-shadow: var(--shadow-medium-1);
        }
        .color-input-picker .react-colorful__saturation {
          border-radius: var(--radius-l) var(--radius-l) 0 0;
          flex: 1;
        }
        .color-input-picker .react-colorful__hue {
          height: 18px;
          border-radius: 0 0 var(--radius-l) var(--radius-l);
          margin: 0;
        }
        .color-input-picker .react-colorful__pointer {
          width: 20px;
          height: 20px;
          border: 3px solid #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.35);
        }
      `}</style>
    </div>
  );
}

// ─── Gamut curve ─────────────────────────────────────────────────────────────

function GamutCurve({ hue, lightness }: { hue: number; lightness: number }) {
  const W = 240;
  const H = 44;
  const PT = 4;
  const PB = 4;
  const chartH = H - PT - PB;

  const points = useMemo(() => {
    return Array.from({ length: 121 }, (_, i) => {
      const h = (i / 120) * 360;
      return { h, maxC: maxChromaForLH(lightness, h) };
    });
  }, [lightness]);

  const peak = Math.max(...points.map(p => p.maxC), 0.01);
  const toX = (h: number) => (h / 360) * W;
  const toY = (c: number) => PT + chartH - (c / peak) * chartH;

  const linePts = points.map(p => `${toX(p.h).toFixed(1)},${toY(p.maxC).toFixed(1)}`).join(' ');
  const areaPts = `${toX(0)},${H - PB} ${linePts} ${toX(360)},${H - PB}`;

  const cx = toX(((hue % 360) + 360) % 360);
  const currentMaxC = maxChromaForLH(lightness, ((hue % 360) + 360) % 360);
  const cy = toY(currentMaxC);

  return (
    <div style={{ width: W }}>
      <p className="font-mono text-[9px] mb-1.5 uppercase tracking-widest" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
        Gamut boundary · L {lightness.toFixed(2)}
      </p>
      <svg width={W} height={H} style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <linearGradient id="gcfill" x1="0" x2="1" y1="0" y2="0">
            {[0, 60, 120, 180, 240, 300, 360].map(h => (
              <stop key={h} offset={`${(h / 360) * 100}%`} stopColor={`hsl(${h},80%,58%)`} stopOpacity="0.25" />
            ))}
          </linearGradient>
          <linearGradient id="gcline" x1="0" x2="1" y1="0" y2="0">
            {[0, 60, 120, 180, 240, 300, 360].map(h => (
              <stop key={h} offset={`${(h / 360) * 100}%`} stopColor={`hsl(${h},70%,48%)`} stopOpacity="0.6" />
            ))}
          </linearGradient>
        </defs>
        {/* Filled area */}
        <polygon points={areaPts} fill="url(#gcfill)" />
        {/* Curve line */}
        <polyline points={linePts} fill="none" stroke="url(#gcline)" strokeWidth="1.5" strokeLinejoin="round" />
        {/* Current hue line */}
        <line x1={cx} y1={PT} x2={cx} y2={H - PB} stroke="var(--color-on-surface)" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
        {/* Dot on curve */}
        <circle cx={cx} cy={cy} r="3.5" fill="var(--color-surface-1)" stroke="var(--color-on-surface)" strokeWidth="1.5" />
      </svg>
      <p className="font-mono text-[9px] mt-1" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
        Peaks = more chroma available · drag to higher hues for vivid palettes
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span
        className="font-mono text-[9px] uppercase tracking-widest"
        style={{ color: 'var(--color-on-surface-subtle-2)' }}
      >
        {label}
      </span>
      <span
        className="font-mono text-xs font-medium"
        style={{ color: 'var(--color-on-surface-subtle-1)' }}
      >
        {value}
      </span>
    </div>
  );
}
