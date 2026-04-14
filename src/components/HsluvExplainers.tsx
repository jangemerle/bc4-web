/**
 * HSLUV Explainer — Three interactive approaches for the Colors page.
 * Each demonstrates why perceptual uniformity matters.
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hsluv } from 'hsluv';
import { spring, duration, ease } from '../tokens/motion';

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

/** Convert HSLUV → hex using the class-based API. */
function hsluvToHex(h: number, s: number, l: number): string {
  const c = new Hsluv();
  c.hsluv_h = h;
  c.hsluv_s = s;
  c.hsluv_l = l;
  c.hsluvToHex();
  return c.hex;
}

/** Convert standard HSL → hex (CSS-compatible). */
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

/** Approximate relative luminance for contrast ratio. */
function luminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = luminance(hex1);
  const l2 = luminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Pick white or dark text for readability on a given background. */
function textColorOn(bg: string): string {
  return luminance(bg) > 0.35 ? '#14263E' : '#FFFFFF';
}

/* Shared slider thumb style */
const sliderClass =
  'w-full h-2 rounded-full appearance-none cursor-pointer accent-[var(--color-on-surface)]' +
  ' [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5' +
  ' [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-on-surface)]' +
  ' [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2' +
  ' [&::-webkit-slider-thumb]:border-[var(--color-surface-1)]';

/* Hue gradient for the slider track */
function hueGradientStyle(): React.CSSProperties {
  const stops = Array.from({ length: 13 }, (_, i) => {
    const h = (i / 12) * 360;
    return `hsl(${h}, 80%, 55%)`;
  });
  return { background: `linear-gradient(to right, ${stops.join(', ')})` };
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  APPROACH A — "The Proof"                                                 */
/*  Hue slider hero + compact before/after UI strip below                    */
/* ═══════════════════════════════════════════════════════════════════════════ */

export function ApproachA() {
  const [hue, setHue] = useState(120);
  const lightness = 60;
  const sat = 70;

  const hslHex = useMemo(() => hslToHex(hue, sat, 50), [hue]);
  const hsluvHex = useMemo(() => hsluvToHex(hue, sat, lightness), [hue]);

  // Generate 5 hues evenly spaced from current hue
  const fiveHues = useMemo(() => {
    return [0, 60, 120, 210, 280].map((offset) => {
      const h = (hue + offset) % 360;
      return {
        h,
        hsl: hslToHex(h, sat, 50),
        hsluv: hsluvToHex(h, sat, lightness),
      };
    });
  }, [hue]);

  return (
    <div>
      <p
        className="font-sans text-sm font-semibold mb-2"
        style={{ color: 'var(--color-on-surface-subtle-1)' }}
      >
        Approach A — "The Proof"
      </p>

      <p className="font-sans text-md mb-4" style={{ color: 'var(--color-on-surface)' }}>
        Most color tools use standard HSL, where "50% lightness" means something different for every hue.
        A yellow and a blue both set to the same lightness look nothing alike — the yellow appears far brighter.
        That's because HSL is a mathematical model that doesn't account for how we actually see color.
      </p>
      <p className="font-sans text-md mb-6" style={{ color: 'var(--color-on-surface)' }}>
        HSLUV fixes this. It's built on human vision research, so when two colors share the same lightness value,
        they genuinely <em>look</em> equally bright. Drag the slider below and see for yourself.
      </p>

      {/* Hue slider */}
      <div className="mb-6">
        <div className="relative h-2 rounded-full mb-2 overflow-hidden" style={hueGradientStyle()}>
          <input
            type="range"
            min={0}
            max={360}
            value={hue}
            onChange={(e) => setHue(Number(e.target.value))}
            className={`${sliderClass} absolute inset-0 opacity-0 cursor-pointer`}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        <input
          type="range"
          min={0}
          max={360}
          value={hue}
          onChange={(e) => setHue(Number(e.target.value))}
          className="w-full opacity-0 h-0"
        />
        <div className="flex justify-between">
          <span className="font-sans text-2xs" style={{ color: 'var(--color-on-surface-subtle-2)' }}>0°</span>
          <span className="font-sans text-xs font-semibold" style={{ color: 'var(--color-on-surface)' }}>
            Hue: {hue}°
          </span>
          <span className="font-sans text-2xs" style={{ color: 'var(--color-on-surface-subtle-2)' }}>360°</span>
        </div>
      </div>

      {/* Side-by-side bars */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <p className="font-sans text-xs font-semibold mb-2" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
            Standard HSL (L50)
          </p>
          <div className="flex gap-1.5">
            {fiveHues.map(({ h, hsl }) => (
              <motion.div
                key={h}
                className="flex-1 h-12 rounded-lg"
                style={{ backgroundColor: hsl }}
                animate={{ backgroundColor: hsl }}
                transition={{ duration: duration.fast, ease: ease.standard }}
              />
            ))}
          </div>
        </div>
        <div>
          <p className="font-sans text-xs font-semibold mb-2" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
            HSLUV (L{lightness})
          </p>
          <div className="flex gap-1.5">
            {fiveHues.map(({ h, hsluv: hex }) => (
              <motion.div
                key={h}
                className="flex-1 h-12 rounded-lg"
                style={{ backgroundColor: hex }}
                animate={{ backgroundColor: hex }}
                transition={{ duration: duration.fast, ease: ease.standard }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mini before/after UI */}
      <div className="divider my-6" />
      <p className="font-sans text-xs font-semibold mb-3" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
        Same hue on real UI elements
      </p>
      <div className="grid grid-cols-2 gap-6">
        {/* HSL UI */}
        <div className="flex gap-2 items-center">
          <button
            className="px-4 py-2 rounded-lg font-sans text-sm font-semibold"
            style={{ backgroundColor: hslHex, color: textColorOn(hslHex) }}
          >
            Button
          </button>
          <span
            className="px-2.5 py-1 rounded-full font-sans text-2xs font-semibold"
            style={{ backgroundColor: hslHex, color: textColorOn(hslHex) }}
          >
            Badge
          </span>
          <div
            className="h-8 w-1 rounded-full"
            style={{ backgroundColor: hslHex }}
          />
          <span className="font-sans text-xs" style={{ color: hslHex }}>Link text</span>
        </div>
        {/* HSLUV UI */}
        <div className="flex gap-2 items-center">
          <button
            className="px-4 py-2 rounded-lg font-sans text-sm font-semibold"
            style={{ backgroundColor: hsluvHex, color: textColorOn(hsluvHex) }}
          >
            Button
          </button>
          <span
            className="px-2.5 py-1 rounded-full font-sans text-2xs font-semibold"
            style={{ backgroundColor: hsluvHex, color: textColorOn(hsluvHex) }}
          >
            Badge
          </span>
          <div
            className="h-8 w-1 rounded-full"
            style={{ backgroundColor: hsluvHex }}
          />
          <span className="font-sans text-xs" style={{ color: hsluvHex }}>Link text</span>
        </div>
      </div>

      {/* What this means */}
      <div className="divider my-6" />
      <p className="font-sans text-sm font-semibold mb-3" style={{ color: 'var(--color-on-surface)' }}>
        What this means in practice
      </p>
      <div className="grid grid-cols-3 gap-6">
        {[
          {
            title: 'Balanced palettes',
            desc: 'Our green, blue, and red all sit at the same visual weight at each step. A "500" always looks like a "500", regardless of hue.',
          },
          {
            title: 'Predictable dark mode',
            desc: 'Flipping lightness for dark themes produces consistent results. No manual tweaking per color — the math just works.',
          },
          {
            title: 'Safe to extend',
            desc: 'Adding a new brand color? Pick any hue in HSLUV at the same lightness steps and it slots right in, already balanced.',
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

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  APPROACH B — "The Story"                                                 */
/*  Provocation → explore → solution narrative                               */
/* ═══════════════════════════════════════════════════════════════════════════ */

const hueNames: Record<number, string> = { 0: 'Red', 60: 'Yellow', 120: 'Green', 210: 'Blue', 280: 'Purple' };

export function ApproachB() {
  const [lightness, setLightness] = useState(50);
  const [revealed, setRevealed] = useState(false);

  // Two fixed hues for the opening provocation
  const provoGreen = hslToHex(120, 70, 50);
  const provoBlue = hslToHex(240, 70, 50);
  const provoGreenHsluv = hsluvToHex(120, 70, 60);
  const provoBlueHsluv = hsluvToHex(240, 70, 60);

  // 5 different hues at one lightness — shows cross-hue brightness mismatch
  const fiveHues = useMemo(() => {
    return [0, 60, 120, 210, 280].map((h) => ({
      h,
      name: hueNames[h],
      hsl: hslToHex(h, 70, lightness),
      hsluv: hsluvToHex(h, 70, lightness),
    }));
  }, [lightness]);

  return (
    <div>
      <p
        className="font-sans text-sm font-semibold mb-2"
        style={{ color: 'var(--color-on-surface-subtle-1)' }}
      >
        Approach B — "The Story"
      </p>

      {/* Step 1: Provocation */}
      <p className="font-sans text-lg font-semibold mb-4" style={{ color: 'var(--color-on-surface)' }}>
        These two buttons are "the same lightness." Do they look it?
      </p>
      <div className="flex gap-4 mb-4">
        <button
          className="px-6 py-3 rounded-lg font-sans text-md font-semibold"
          style={{ backgroundColor: provoGreen, color: textColorOn(provoGreen) }}
        >
          Confirm
        </button>
        <button
          className="px-6 py-3 rounded-lg font-sans text-md font-semibold"
          style={{ backgroundColor: provoBlue, color: textColorOn(provoBlue) }}
        >
          Continue
        </button>
        <span
          className="font-sans text-xs self-center"
          style={{ color: 'var(--color-on-surface-subtle-2)' }}
        >
          Both HSL(_, 70%, 50%)
        </span>
      </div>

      <p className="font-sans text-md mb-2" style={{ color: 'var(--color-on-surface)' }}>
        The green screams while the blue recedes. Standard HSL calls them equal, but your eyes disagree.
      </p>
      <p className="font-sans text-sm mb-4" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
        This is the core problem with HSL — its lightness value is purely mathematical, not perceptual.
        A design system built on HSL needs manual corrections for every hue, and those corrections break
        the moment you add a new color or flip to dark mode. HSLUV solves this by basing lightness on
        human vision research, so equal numbers always mean equal brightness.
      </p>

      {/* Step 2: Explorer — 5 hues at one lightness */}
      <div className="divider my-6" />
      <p className="font-sans text-sm font-semibold mb-2" style={{ color: 'var(--color-on-surface)' }}>
        Explore it yourself — five hues, one lightness value
      </p>
      <p className="font-sans text-sm mb-4" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
        Drag the lightness slider. In HSL, the brightness is all over the place. In HSLUV, every color looks equally bright.
      </p>
      <div className="mb-4">
        <div className="flex items-center gap-3">
          <span className="font-sans text-2xs shrink-0" style={{ color: 'var(--color-on-surface-subtle-2)' }}>Dark</span>
          <input
            type="range"
            min={15}
            max={85}
            value={lightness}
            onChange={(e) => setLightness(Number(e.target.value))}
            className={sliderClass}
            style={{
              background: `linear-gradient(to right, #1a1a1a, #d0d0d0)`,
            }}
          />
          <span className="font-sans text-2xs shrink-0" style={{ color: 'var(--color-on-surface-subtle-2)' }}>Light</span>
        </div>
        <p className="font-sans text-xs text-center font-semibold mt-2" style={{ color: 'var(--color-on-surface)' }}>
          Lightness: {lightness}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-4">
        <div>
          <p className="font-sans text-xs font-semibold mb-2" style={{ color: 'var(--color-on-surface-subtle-1)' }}>Standard HSL — all "L{lightness}"</p>
          <div className="flex gap-1.5">
            {fiveHues.map(({ h, name, hsl }) => (
              <div key={h} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  className="w-full h-14 rounded-lg"
                  animate={{ backgroundColor: hsl }}
                  transition={{ duration: duration.fast }}
                />
                <span className="font-sans text-[10px]" style={{ color: 'var(--color-on-surface-subtle-2)' }}>{name}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="font-sans text-xs font-semibold mb-2" style={{ color: 'var(--color-on-surface-subtle-1)' }}>HSLUV — all L{lightness}</p>
          <div className="flex gap-1.5">
            {fiveHues.map(({ h, name, hsluv: hex }) => (
              <div key={h} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  className="w-full h-14 rounded-lg"
                  animate={{ backgroundColor: hex }}
                  transition={{ duration: duration.fast }}
                />
                <span className="font-sans text-[10px]" style={{ color: 'var(--color-on-surface-subtle-2)' }}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step 3: The fix — reveal */}
      <div className="divider my-6" />
      <button
        onClick={() => setRevealed(!revealed)}
        className="px-4 py-2 rounded-lg font-sans text-sm font-semibold mb-4"
        style={{
          backgroundColor: 'var(--color-secondary-1)',
          color: 'var(--color-on-secondary-1)',
        }}
      >
        {revealed ? 'Hide the fix' : 'See the fix →'}
      </button>

      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={spring.default}
          >
            <p className="font-sans text-sm font-semibold mb-3" style={{ color: 'var(--color-on-surface)' }}>
              Same buttons, now using HSLUV
            </p>
            <div className="flex gap-4 mb-3">
              <button
                className="px-6 py-3 rounded-lg font-sans text-md font-semibold"
                style={{ backgroundColor: provoGreenHsluv, color: textColorOn(provoGreenHsluv) }}
              >
                Confirm
              </button>
              <button
                className="px-6 py-3 rounded-lg font-sans text-md font-semibold"
                style={{ backgroundColor: provoBlueHsluv, color: textColorOn(provoBlueHsluv) }}
              >
                Continue
              </button>
              <span
                className="font-sans text-xs self-center"
                style={{ color: 'var(--color-on-surface-subtle-2)' }}
              >
                Both HSLUV(_, 70, 60)
              </span>
            </div>
            <p className="font-sans text-sm mb-4" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
              Both buttons now carry the same visual weight. That's HSLUV — lightness you can trust.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { title: 'Balanced palettes', desc: 'Every hue at the same step carries equal visual weight. No manual adjustments needed.' },
                { title: 'Predictable dark mode', desc: 'Flip lightness values and the relationships hold. Dark themes that just work.' },
                { title: 'Safe to extend', desc: 'New brand color? Pick any hue at the same lightness stops — it fits right in.' },
              ].map(({ title, desc }) => (
                <div key={title}>
                  <p className="font-sans text-xs font-semibold mb-1" style={{ color: 'var(--color-on-surface)' }}>{title}</p>
                  <p className="font-sans text-xs" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  APPROACH C — "The Split Screen"                                          */
/*  Single shared-hue slider, two mini UIs side by side                      */
/* ═══════════════════════════════════════════════════════════════════════════ */

function MiniUI({ accent, label }: { accent: string; label: string }) {
  const onAccent = textColorOn(accent);
  const cr = contrastRatio(accent, onAccent);
  const passes = cr >= 4.5;

  return (
    <div
      className="flex-1 rounded-xl p-5 flex flex-col gap-4"
      style={{
        backgroundColor: 'var(--color-surface-2)',
        border: '1px solid var(--color-border)',
      }}
    >
      <p className="font-sans text-xs font-semibold" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
        {label}
      </p>

      {/* Mini card */}
      <div
        className="rounded-lg p-4"
        style={{
          backgroundColor: 'var(--color-surface-1)',
          border: '1px solid var(--color-border)',
        }}
      >
        <p className="font-sans text-sm font-semibold mb-1" style={{ color: 'var(--color-on-surface)' }}>
          Card title
        </p>
        <p className="font-sans text-xs mb-3" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
          A short description of something important.
        </p>
        <div className="flex gap-2 items-center">
          <motion.button
            className="px-3 py-1.5 rounded-lg font-sans text-xs font-semibold"
            style={{ backgroundColor: accent, color: onAccent }}
            animate={{ backgroundColor: accent }}
            transition={{ duration: duration.fast }}
          >
            Primary action
          </motion.button>
          <motion.span
            className="font-sans text-xs font-semibold"
            style={{ color: accent }}
            animate={{ color: accent }}
            transition={{ duration: duration.fast }}
          >
            Secondary
          </motion.span>
        </div>
      </div>

      {/* Badge row */}
      <div className="flex gap-2 items-center">
        <motion.span
          className="px-2.5 py-1 rounded-full font-sans text-2xs font-semibold"
          style={{ backgroundColor: accent, color: onAccent }}
          animate={{ backgroundColor: accent }}
          transition={{ duration: duration.fast }}
        >
          Active
        </motion.span>
        <motion.span
          className="px-2.5 py-1 rounded-full font-sans text-2xs font-semibold"
          style={{
            backgroundColor: 'transparent',
            color: accent,
            boxShadow: `inset 0 0 0 1.5px ${accent}`,
          }}
          animate={{
            color: accent,
            boxShadow: `inset 0 0 0 1.5px ${accent}`,
          }}
          transition={{ duration: duration.fast }}
        >
          Outline
        </motion.span>
        <span className="font-sans text-2xs" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
          + 2 more
        </span>
      </div>

      {/* Alert */}
      <motion.div
        className="rounded-lg p-3 flex gap-2 items-start"
        style={{
          backgroundColor: accent + '18',
          borderLeft: `3px solid ${accent}`,
        }}
        animate={{
          backgroundColor: accent + '18',
          borderLeftColor: accent,
        }}
        transition={{ duration: duration.fast }}
      >
        <motion.span
          className="font-sans text-xs font-semibold"
          style={{ color: accent }}
          animate={{ color: accent }}
          transition={{ duration: duration.fast }}
        >
          ℹ
        </motion.span>
        <p className="font-sans text-xs" style={{ color: 'var(--color-on-surface)' }}>
          Something you should know about.
        </p>
      </motion.div>

      {/* Contrast indicator */}
      <div className="flex items-center gap-2 mt-auto">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: passes ? 'var(--color-success-1)' : 'var(--color-danger-1)' }}
        />
        <span className="font-sans text-[10px]" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
          Button contrast: {cr.toFixed(1)}:1 {passes ? '✓ AA' : '✗ Fail'}
        </span>
      </div>
    </div>
  );
}

export function ApproachC() {
  const [hue, setHue] = useState(240);

  const hslHex = useMemo(() => hslToHex(hue, 70, 50), [hue]);
  const hsluvHex = useMemo(() => hsluvToHex(hue, 70, 60), [hue]);

  return (
    <div>
      <p
        className="font-sans text-sm font-semibold mb-2"
        style={{ color: 'var(--color-on-surface-subtle-1)' }}
      >
        Approach C — "The Split Screen"
      </p>
      <p className="font-sans text-md mb-4" style={{ color: 'var(--color-on-surface)' }}>
        Most color tools use standard HSL. It's simple, but it has a fundamental flaw: "50% lightness"
        means something completely different for yellow than it does for blue. A design system built on
        those numbers produces colors that look uneven, and fixing it means hand-tuning every single hue.
      </p>
      <p className="font-sans text-md mb-4" style={{ color: 'var(--color-on-surface)' }}>
        HSLUV is a color space designed around human perception. When two colors share a lightness value,
        they genuinely look equally bright — no exceptions, no manual corrections. This makes palette generation
        predictable, dark mode reliable, and extending the system with new colors effortless.
      </p>
      <p className="font-sans text-sm mb-6" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
        The demo below shows one hue applied to real UI elements in both systems. Try dragging to yellow (60°) then blue (240°) — watch how the HSL side shifts dramatically while HSLUV stays composed.
      </p>

      {/* Shared hue slider */}
      <div className="mb-6">
        <div className="relative h-3 rounded-full overflow-hidden" style={hueGradientStyle()}>
        </div>
        <input
          type="range"
          min={0}
          max={360}
          value={hue}
          onChange={(e) => setHue(Number(e.target.value))}
          className={sliderClass}
          style={{ marginTop: -6, background: 'transparent' }}
        />
        <div className="flex justify-between items-center mt-1">
          <span className="font-sans text-2xs" style={{ color: 'var(--color-on-surface-subtle-2)' }}>0°</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: hslHex }} />
              <span className="font-sans text-xs" style={{ color: 'var(--color-on-surface-subtle-2)' }}>HSL</span>
            </div>
            <span className="font-sans text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>
              {hue}°
            </span>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: hsluvHex }} />
              <span className="font-sans text-xs" style={{ color: 'var(--color-on-surface-subtle-2)' }}>HSLUV</span>
            </div>
          </div>
          <span className="font-sans text-2xs" style={{ color: 'var(--color-on-surface-subtle-2)' }}>360°</span>
        </div>
      </div>

      {/* Two mini UIs */}
      <div className="grid grid-cols-2 gap-4">
        <MiniUI accent={hslHex} label="Standard HSL" />
        <MiniUI accent={hsluvHex} label="HSLUV" />
      </div>

      {/* What this means */}
      <div className="divider my-6" />
      <p className="font-sans text-sm font-semibold mb-3" style={{ color: 'var(--color-on-surface)' }}>
        Why this matters for a design system
      </p>
      <div className="grid grid-cols-3 gap-6">
        {[
          {
            title: 'Balanced palettes',
            desc: 'Every hue at the same step — 300, 500, 700 — carries equal visual weight. Your green buttons and blue links feel like they belong together.',
          },
          {
            title: 'Predictable dark mode',
            desc: 'Flip the lightness scale and the relationships hold. Dark themes inherit the same balance without per-color tweaking.',
          },
          {
            title: 'Safe to extend',
            desc: 'Need a new brand color? Pick any hue at the same lightness stops and it integrates instantly — no rebalancing required.',
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
