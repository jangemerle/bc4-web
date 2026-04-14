/**
 * OklchExplainer — Interactive section for the Colors page.
 * Demonstrates OKLCH's perceptual uniformity vs standard HSL
 * through grayscale tests and badge examples.
 *
 * Still named HsluvExplainer for import compatibility.
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { palette } from '../tokens/colors';
import { oklchToHex } from '../lib/oklch';
import { duration, ease } from '../tokens/motion';
import { Button } from './Button';

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

/** Convert hex to perceptual grayscale (using relative luminance). */
function toGrayscale(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  const srgb = L <= 0.0031308 ? L * 12.92 : 1.055 * Math.pow(L, 1 / 2.4) - 0.055;
  const v = Math.round(srgb * 255);
  const h = v.toString(16).padStart(2, '0');
  return `#${h}${h}${h}`;
}

function contrastRatio(hex1: string, hex2: string): number {
  const lum = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  };
  const l1 = lum(hex1);
  const l2 = lum(hex2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/** Convert oklch() string → hex for grayscale operations. */
function oklchStringToHex(oklchStr: string): string {
  const m = oklchStr.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
  if (!m) return '#000000';
  return oklchToHex(parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3]));
}

/** Convert standard HSL → hex. */
function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  s /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/* ─── Kvalt palette data ───────────────────────────────────────────────────── */

const STEP_LABELS = ['50', '100', '200', '300', '400', '500', '600', '700', '750', '800', '850', '900'] as const;
type StepKey = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 750 | 800 | 850 | 900;
const STEP_KEYS: StepKey[] = [50, 100, 200, 300, 400, 500, 600, 700, 750, 800, 850, 900];

/** Our actual OKLCH-based palettes — converted to hex for grayscale tests. */
const KVALT_PALETTES = [
  { name: 'Grey',      colors: STEP_KEYS.map((k) => oklchStringToHex(palette.grey[k])) },
  { name: 'Primary',   colors: STEP_KEYS.map((k) => oklchStringToHex(palette.primary[k])) },
  { name: 'Secondary', colors: STEP_KEYS.map((k) => oklchStringToHex(palette.secondary[k])) },
  { name: 'Success',   colors: STEP_KEYS.map((k) => oklchStringToHex(palette.success[k])) },
  { name: 'Warning',   colors: STEP_KEYS.map((k) => oklchStringToHex(palette.warning[k])) },
  { name: 'Danger',    colors: STEP_KEYS.map((k) => oklchStringToHex(palette.danger[k])) },
];

/** OKLCH lightness values per step. */
const OKLCH_L_STEPS = [0.98, 0.96, 0.90, 0.81, 0.77, 0.72, 0.64, 0.53, 0.43, 0.34, 0.27, 0.19];

/**
 * HSL comparison palettes — same hue angles, same approximate lightness steps,
 * but in standard HSL which has broken perceptual uniformity.
 */
const HSL_HUES: Record<string, number> = {
  Grey: 180,
  Primary: 125,
  Secondary: 218,
  Success: 150,
  Warning: 25,
  Danger: 0,
};

const HSL_L_STEPS = [98, 96, 89, 80, 75, 69, 59, 47, 35, 24, 15, 7];

const HSL_PALETTES = KVALT_PALETTES.map(({ name }) => ({
  name,
  colors: HSL_L_STEPS.map((l) =>
    name === 'Grey'
      ? hslToHex(HSL_HUES[name], 5, l)
      : hslToHex(HSL_HUES[name], 70, l),
  ),
}));

/** Badge data using actual Kvalt semantic token pairs. */
const KVALT_BADGES = [
  { name: 'Primary',   bg: oklchStringToHex(palette.primary[100]),   text: oklchStringToHex(palette.primary[700]) },
  { name: 'Secondary', bg: oklchStringToHex(palette.secondary[100]),  text: oklchStringToHex(palette.secondary[750]) },
  { name: 'Success',   bg: oklchStringToHex(palette.success[100]),    text: oklchStringToHex(palette.success[850]) },
  { name: 'Warning',   bg: oklchStringToHex(palette.warning[100]),    text: oklchStringToHex(palette.warning[850]) },
  { name: 'Danger',    bg: oklchStringToHex(palette.danger[100]),     text: oklchStringToHex(palette.danger[850]) },
  { name: 'Grey',      bg: oklchStringToHex(palette.grey[100]),       text: oklchStringToHex(palette.grey[700]) },
];

/** HSL badges at same hue angles for comparison. */
const HSL_BADGES = [
  { name: 'Primary',   bg: hslToHex(125, 70, 96), text: hslToHex(125, 70, 47) },
  { name: 'Secondary', bg: hslToHex(218, 70, 96), text: hslToHex(218, 70, 35) },
  { name: 'Success',   bg: hslToHex(150, 70, 96), text: hslToHex(150, 70, 15) },
  { name: 'Warning',   bg: hslToHex(25, 70, 96),  text: hslToHex(25, 70, 15) },
  { name: 'Danger',    bg: hslToHex(0, 70, 96),   text: hslToHex(0, 70, 15) },
  { name: 'Grey',      bg: hslToHex(180, 5, 96),  text: hslToHex(180, 5, 47) },
];

/* ─── Small reusable components ─────────────────────────────────────────────── */

function GrayscaleToggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <Button
      variant={on ? 'primary' : 'secondary'}
      size="xs"
      onClick={onToggle}
    >
      {on ? 'Showing grayscale' : 'Convert to grayscale'}
    </Button>
  );
}

function PaletteGrid({ palettes, grayscale }: { palettes: typeof KVALT_PALETTES; grayscale: boolean }) {
  return (
    <div className="flex flex-col gap-1 mb-2">
      {palettes.map(({ name, colors }) => (
        <div key={name} className="flex gap-1">
          {colors.map((hex, i) => {
            const display = grayscale ? toGrayscale(hex) : hex;
            return (
              <motion.div
                key={i}
                className="flex-1 h-8 rounded"
                animate={{ backgroundColor: display }}
                transition={{ duration: duration.base, ease: ease.standard }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

function BadgeRow({ badges, grayscale, label }: {
  badges: typeof KVALT_BADGES;
  grayscale: boolean;
  label: string;
}) {
  return (
    <>
      <p className="font-sans text-2xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
        {label}
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {badges.map(({ name, bg, text }) => {
          const displayBg = grayscale ? toGrayscale(bg) : bg;
          const displayText = grayscale ? toGrayscale(text) : text;
          const cr = contrastRatio(bg, text);
          return (
            <motion.span
              key={name}
              className="px-3 py-1.5 rounded-full font-sans text-xs font-semibold"
              animate={{ backgroundColor: displayBg, color: displayText }}
              transition={{ duration: duration.base, ease: ease.standard }}
              title={`${cr.toFixed(1)}:1 contrast`}
            >
              {name}
            </motion.span>
          );
        })}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  Main Explainer Component                                                 */
/* ═══════════════════════════════════════════════════════════════════════════ */

export function HsluvExplainer() {
  const [grayscale1, setGrayscale1] = useState(false);
  const [grayscale2, setGrayscale2] = useState(false);
  const [grayscale3, setGrayscale3] = useState(false);

  return (
    <div>
      {/* ── Introduction ────────────────────────────────────────────────── */}
      <p className="font-sans text-md mb-4" style={{ color: 'var(--color-on-surface)' }}>
        Most color tools use standard HSL. It's intuitive — you pick a hue, set saturation and lightness,
        and get a color. But HSL has a fundamental flaw: its lightness value is mathematical, not perceptual.
        Setting two colors to "50% lightness" doesn't mean they'll look equally bright to your eyes.
      </p>
      <p className="font-sans text-md mb-8" style={{ color: 'var(--color-on-surface)' }}>
        Kvalt's palettes are built with <strong>OKLCH</strong> — a perceptually uniform color space created by
        Björn Ottosson in 2020. It separates lightness (L), chroma (C), and hue (H) so that equal L values
        produce equal perceived brightness across every hue. The proof is simple: convert any palette row to
        grayscale. If the columns are even, the lightness is real.
      </p>

      {/* ── Step 1: HSL palette grid (for comparison) ─────────────────── */}
      <div className="flex items-center justify-between mb-3">
        <p className="font-sans text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>
          Standard HSL — same hues, same lightness steps
        </p>
        <GrayscaleToggle on={grayscale1} onToggle={() => setGrayscale1(!grayscale1)} />
      </div>
      <p className="font-sans text-xs mb-4" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
        Six palettes generated with standard HSL at our hue angles and lightness steps.
        Each column should be equally bright — but it isn't.
        {!grayscale1 && ' Convert to grayscale to see the proof.'}
      </p>

      <PaletteGrid palettes={HSL_PALETTES} grayscale={grayscale1} />
      <div className="flex gap-1 mb-1">
        {STEP_LABELS.map((l) => (
          <span key={l} className="flex-1 text-center font-sans text-[10px]" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
            {l}
          </span>
        ))}
      </div>
      {grayscale1 && (
        <p className="font-sans text-xs mt-2 mb-0" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
          The columns are uneven — yellows and greens appear brighter than blues and reds at the same step. HSL's lightness can't be trusted across hues.
        </p>
      )}

      <div className="divider my-8" />

      {/* ── Step 2: Kvalt's actual OKLCH palette ─────────────────────── */}
      <div className="flex items-center justify-between mb-3">
        <p className="font-sans text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>
          Kvalt's OKLCH palette — the real thing
        </p>
        <GrayscaleToggle on={grayscale2} onToggle={() => setGrayscale2(!grayscale2)} />
      </div>
      <p className="font-sans text-xs mb-4" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
        These are the actual colors from our design system. Every column shares a perceptual lightness value.
        Convert to grayscale and the columns line up.
      </p>

      <PaletteGrid palettes={KVALT_PALETTES} grayscale={grayscale2} />
      <div className="flex gap-1 mb-1">
        {STEP_LABELS.map((l) => (
          <span key={l} className="flex-1 text-center font-sans text-[10px]" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
            {l}
          </span>
        ))}
      </div>
      {grayscale2 && (
        <p className="font-sans text-xs mt-2 mb-0" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
          Each column resolves to the same gray — every hue at step 500 looks equally bright, every hue at step 200 looks equally bright. This is perceptual consistency.
        </p>
      )}

      <div className="divider my-8" />

      {/* ── Step 3: Badges ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-3">
        <p className="font-sans text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>
          Build consistent components
        </p>
        <GrayscaleToggle on={grayscale3} onToggle={() => setGrayscale3(!grayscale3)} />
      </div>
      <p className="font-sans text-xs mb-4" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
        Pick two lightness steps — a light background and dark text — and get consistent contrast and visual weight
        across every hue. In grayscale, well-balanced badges become indistinguishable.
      </p>

      <BadgeRow badges={KVALT_BADGES} grayscale={grayscale3} label="Kvalt badges — using our tokens" />
      <BadgeRow badges={HSL_BADGES} grayscale={grayscale3} label="Standard HSL badges — same lightness values" />

      {grayscale3 && (
        <p className="font-sans text-xs mb-0" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
          The Kvalt badges resolve to nearly identical grays — the HSL ones don't.
          This means our badges carry equal visual weight regardless of color, keeping the interface balanced.
        </p>
      )}

      <div className="divider my-8" />

      {/* ── OKLCH model ──────────────────────────────────────────────── */}
      <p className="font-sans text-sm font-semibold mb-3" style={{ color: 'var(--color-on-surface)' }}>
        The OKLCH color model
      </p>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { axis: 'L', range: '0 – 1', desc: 'Lightness. Perceptually linear — doubling L looks twice as bright.' },
          { axis: 'C', range: '0 – ~0.37', desc: 'Chroma. Colorfulness independent of lightness. 0 = pure grey.' },
          { axis: 'H', range: '0° – 360°', desc: 'Hue angle. Rotating H at constant L/C gives harmonious variations.' },
        ].map(({ axis, range, desc }) => (
          <div key={axis} className="p-4" style={{ background: 'var(--color-surface-2)', borderRadius: 'var(--radius-m)' }}>
            <span className="font-mono text-lg font-bold" style={{ color: 'var(--color-primary-1)' }}>{axis}</span>
            <span className="font-mono text-xs ml-2" style={{ color: 'var(--color-on-surface-subtle-2)' }}>{range}</span>
            <p className="font-sans text-xs mt-2" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{desc}</p>
          </div>
        ))}
      </div>

      {/* ── OKLCH L values per step ──────────────────────────────────── */}
      <p className="font-sans text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
        Lightness values across steps
      </p>
      <div className="flex gap-1 mb-8">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full h-6 rounded"
              style={{ backgroundColor: `oklch(${OKLCH_L_STEPS[i]} 0 0)` }}
            />
            <span className="font-mono text-[9px]" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
              L{OKLCH_L_STEPS[i].toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* ── Benefits ─────────────────────────────────────────────────── */}
      <p className="font-sans text-sm font-semibold mb-3" style={{ color: 'var(--color-on-surface)' }}>
        What this means in practice
      </p>
      <div className="grid grid-cols-3 gap-6">
        {[
          {
            title: 'Balanced palettes',
            desc: 'Every hue at the same step — 300, 500, 700 — carries equal visual weight. Green buttons and blue links feel like they belong together.',
          },
          {
            title: 'No hue drift',
            desc: 'Unlike CIE LCH, OKLCH keeps hues stable when you change chroma. Blues stay blue — they don\'t shift purple.',
          },
          {
            title: 'CSS native',
            desc: 'oklch() is supported in all modern browsers. No JS conversion needed — the color model lives in your stylesheets.',
          },
        ].map(({ title, desc }) => (
          <div key={title}>
            <p className="font-sans text-sm font-semibold mb-1" style={{ color: 'var(--color-on-surface)' }}>{title}</p>
            <p className="font-sans text-sm" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
