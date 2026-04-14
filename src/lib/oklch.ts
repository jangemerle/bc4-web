/**
 * OKLCH ↔ sRGB/hex conversion utilities
 *
 * Implements Björn Ottosson's Oklab (2020) color space transforms.
 * No external dependencies — pure math using the standard M1/M2 matrices.
 *
 * Reference: https://bottosson.github.io/posts/oklab/
 */

// ─── Matrices ────────────────────────────────────────────────────────────────

// sRGB linear → LMS (Oklab M1)
const M1 = [
  [0.4122214708, 0.5363325363, 0.0514459929],
  [0.2119034982, 0.6806995451, 0.1073969566],
  [0.0883024619, 0.2817188376, 0.6299787005],
];

// LMS (cube root) → Oklab (Oklab M2)
const M2 = [
  [0.2104542553, 0.7936177850, -0.0040720468],
  [1.9779984951, -2.4285922050, 0.4505937099],
  [0.0259040371, 0.7827717662, -0.8086757660],
];

// Inverse of M2
const M2_INV = [
  [1.0, 0.3963377774, 0.2158037573],
  [1.0, -0.1055613458, -0.0638541728],
  [1.0, -0.0894841775, -1.2914855480],
];

// Inverse of M1
const M1_INV = [
  [4.0767416621, -3.3077115913, 0.2309699292],
  [-1.2684380046, 2.6097574011, -0.3413193965],
  [-0.0041960863, -0.7034186147, 1.7076147010],
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function linearToSrgb(c: number): number {
  return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1.0 / 2.4) - 0.055;
}

function dot3(m: number[], v: [number, number, number]): number {
  return m[0] * v[0] + m[1] * v[1] + m[2] * v[2];
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

// ─── Forward: hex → OKLCH ────────────────────────────────────────────────────

export interface OklchColor {
  l: number; // 0–1
  c: number; // 0–~0.37
  h: number; // 0–360
}

export function hexToOklch(hex: string): OklchColor {
  const rgb = hexToRgb(hex);
  const lr = srgbToLinear(rgb[0]);
  const lg = srgbToLinear(rgb[1]);
  const lb = srgbToLinear(rgb[2]);

  // linear RGB → LMS
  const lms: [number, number, number] = [
    dot3(M1[0], [lr, lg, lb]),
    dot3(M1[1], [lr, lg, lb]),
    dot3(M1[2], [lr, lg, lb]),
  ];

  // cube root
  const lms_g: [number, number, number] = [
    Math.cbrt(lms[0]),
    Math.cbrt(lms[1]),
    Math.cbrt(lms[2]),
  ];

  // LMS → Oklab
  const L = dot3(M2[0], lms_g);
  const a = dot3(M2[1], lms_g);
  const b = dot3(M2[2], lms_g);

  // Oklab → OKLCH
  const c = Math.sqrt(a * a + b * b);
  let h = Math.atan2(b, a) * RAD;
  if (h < 0) h += 360;

  return { l: L, c, h: c < 0.0001 ? 0 : h };
}

// ─── Reverse: OKLCH → hex ────────────────────────────────────────────────────

export function oklchToRgb(l: number, c: number, h: number): [number, number, number] {
  const a = c * Math.cos(h * DEG);
  const b = c * Math.sin(h * DEG);

  // Oklab → LMS (cube root)
  const lms_g: [number, number, number] = [
    dot3(M2_INV[0], [l, a, b]),
    dot3(M2_INV[1], [l, a, b]),
    dot3(M2_INV[2], [l, a, b]),
  ];

  // cube
  const lms: [number, number, number] = [
    lms_g[0] ** 3,
    lms_g[1] ** 3,
    lms_g[2] ** 3,
  ];

  // LMS → linear RGB
  const lr = dot3(M1_INV[0], lms);
  const lg = dot3(M1_INV[1], lms);
  const lb = dot3(M1_INV[2], lms);

  return [linearToSrgb(lr), linearToSrgb(lg), linearToSrgb(lb)];
}

export function oklchToHex(l: number, c: number, h: number): string {
  const [r, g, b] = oklchToRgb(l, c, h);
  return rgbToHex(clamp01(r), clamp01(g), clamp01(b));
}

export function oklchToCss(l: number, c: number, h: number): string {
  return `oklch(${l.toFixed(3)} ${c.toFixed(4)} ${h.toFixed(1)})`;
}

// ─── Gamut check & clamp ─────────────────────────────────────────────────────

export function isInSrgbGamut(l: number, c: number, h: number): boolean {
  const [r, g, b] = oklchToRgb(l, c, h);
  const e = 0.001; // tolerance
  return r >= -e && r <= 1 + e && g >= -e && g <= 1 + e && b >= -e && b <= 1 + e;
}

/** Binary-search for max displayable chroma at given L/H. */
export function maxChromaForLH(l: number, h: number): number {
  if (l <= 0 || l >= 1) return 0;
  let lo = 0;
  let hi = 0.4;
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    if (isInSrgbGamut(l, mid, h)) lo = mid;
    else hi = mid;
  }
  return lo;
}

/** Clamp chroma to sRGB gamut boundary. */
export function clampToSrgb(l: number, c: number, h: number): OklchColor {
  const maxC = maxChromaForLH(l, h);
  return { l, c: Math.min(c, maxC), h };
}

// ─── Hex/RGB helpers ─────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  const to = (v: number) => Math.round(v * 255).toString(16).padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`;
}

// ─── Parse any color string ──────────────────────────────────────────────────

/** Parse hex (#abc, #aabbcc) or oklch(L C H) string. Returns null if invalid. */
export function parseColorString(str: string): OklchColor | null {
  const s = str.trim();

  // oklch(0.812 0.1494 145.9)
  const oklchMatch = s.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/i);
  if (oklchMatch) {
    return {
      l: parseFloat(oklchMatch[1]),
      c: parseFloat(oklchMatch[2]),
      h: parseFloat(oklchMatch[3]),
    };
  }

  // hex
  const hexMatch = s.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hexMatch) {
    let h = hexMatch[1];
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    return hexToOklch(`#${h}`);
  }

  return null;
}

// ─── Palette generation defaults ─────────────────────────────────────────────

/** Fixed lightness steps matching the Kvalt palette convention. */
export const DEFAULT_LIGHTNESS: readonly number[] = [
  0.982, 0.962, 0.895, 0.812, 0.770, 0.718,
  0.634, 0.534, 0.432, 0.338, 0.263, 0.194,
];

/**
 * Generate a default chroma curve (bell-shaped) scaled to a peak value.
 * The shape peaks around index 3-5 (steps 300-500) and tapers at extremes.
 */
export function generateDefaultChromaCurve(peakChroma: number): number[] {
  // Normalized shape: peaks at center-left, tapers both ends
  const shape = [0.09, 0.29, 0.63, 1.0, 0.95, 0.89, 0.78, 0.66, 0.53, 0.42, 0.32, 0.24];
  return shape.map(s => s * peakChroma);
}

// ─── Gamut-relative chroma presets ──────────────────────────────────────────

export interface ChromaPreset {
  name: string;
  percentage: number;
  /** Optional per-step multiplier (0–1) applied on top of percentage.
   *  When absent, all steps use the flat percentage. */
  shape?: readonly number[];
}

/**
 * Neutral shape: smile curve — more chroma at light/dark extremes,
 * flatter in the mid-range. Designed for tinted UI greys.
 * Steps: 50, 100, 200, 300, 400, 500, 600, 700, 800, 850, 900, 950
 */
/**
 * Base shape: smile curve — matches Pastel at light/dark extremes,
 * dips lower in the mid-range. Designed for tinted UI greys.
 * Steps: 50, 100, 200, 300, 400, 500, 600, 700, 750, 800, 850, 900
 */
const BASE_SHAPE = [1.0, 1.0, 1.0, 0.5, 0.4, 0.4, 0.5, 0.55, 0.6, 1.0, 1.0, 1.0] as const;

export const CHROMA_PRESETS: readonly ChromaPreset[] = [
  { name: 'Vivid', percentage: 0.75 },
  { name: 'Balanced', percentage: 0.55 },
  { name: 'Muted', percentage: 0.35 },
  { name: 'Pastel', percentage: 0.20 },
  { name: 'Base', percentage: 0.20, shape: BASE_SHAPE },
  // Neutral: flat 7% of gamut, no shape. Drops the smile entirely — the
  // curve sits flush at the bottom of the chart with chroma ~0.001 at the
  // lightest end and ~0.012 at the darkest, all well below Base's mid-
  // range dip. Surfaces read as near-pure greys with only a whisper of
  // the palette hue. Matches the feel of the default Kvalt grey palette.
  { name: 'Neutral', percentage: 0.07 },
];

/**
 * Generate a chroma curve relative to the sRGB gamut boundary.
 * For each lightness step, computes the max displayable chroma at the given hue
 * and multiplies by the percentage (0–1). When a per-step shape is provided,
 * each step is further scaled by its shape multiplier.
 */
export function generateGamutRelativeCurve(
  hue: number,
  percentage: number,
  shape?: readonly number[],
): number[] {
  return DEFAULT_LIGHTNESS.map((l, i) => {
    const base = maxChromaForLH(l, hue) * percentage;
    return shape ? base * shape[i] : base;
  });
}
