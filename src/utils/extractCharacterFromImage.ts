/**
 * extractCharacterFromImage — turn a reference image into a Kvalt character seed.
 *
 * Pipeline:
 *   1. extract-colors returns 8–10 candidate swatches with area / sat / lightness
 *   2. Convert each to OKLCH via culori
 *   3. Split into a neutral pool (chroma < 0.04) and a chromatic pool
 *   4. Median hue of the neutral pool = suggestedGreyHue (falls back to primary's hue)
 *   5. Primary = chromatic candidate with highest (chroma × area)
 *   6. Secondary = furthest remaining candidate by CIEDE2000 (requires ΔE ≥ 20)
 *
 * Output is ready-to-paste into a CharacterSeed — hue, chroma, hex, and a
 * suggested primaryChroma bucket.
 */

import { extractColors, type FinalColor } from 'extract-colors';
import { converter, differenceCiede2000, formatHex } from 'culori';

const toOklch = converter('oklch');

const NEUTRAL_CHROMA_THRESHOLD = 0.04;
const MIN_DELTA_E = 20;

export interface ExtractedColor {
  hex: string;
  hue: number;         // 0–360
  chroma: number;      // 0–0.4 typical
  lightness: number;   // 0–1
  area: number;        // 0–1, fraction of image pixels
  sourceHex: string;   // original hex from extract-colors
}

export interface CharacterFromImageResult {
  /** The dominant distinctive color — maps to primaryHue/primaryChroma. */
  primary: ExtractedColor;
  /** A visually distinct second color (ΔE ≥ 20 from primary). */
  secondary: ExtractedColor;
  /** Median hue of the neutral/low-chroma pool. Falls back to primary.hue. */
  suggestedGreyHue: number;
  /** All chromatic candidates after OKLCH conversion, sorted by score. */
  chromaticPool: ExtractedColor[];
  /** All near-neutral candidates (chroma < 0.04). */
  neutralPool: ExtractedColor[];
  /** Suggested primaryChroma bucket for the CharacterSeed. */
  primaryChromaBucket: 'Vivid' | 'Balanced' | 'Muted' | 'Pastel';
}

/** Map a chroma value to one of Kvalt's four primaryChroma buckets. */
function chromaBucket(chroma: number): 'Vivid' | 'Balanced' | 'Muted' | 'Pastel' {
  if (chroma >= 0.18) return 'Vivid';
  if (chroma >= 0.12) return 'Balanced';
  if (chroma >= 0.07) return 'Muted';
  return 'Pastel';
}

/** Circular median for hues (0–360) via average of sin/cos components. */
function circularMedian(hues: number[]): number {
  if (hues.length === 0) return 0;
  let sumSin = 0;
  let sumCos = 0;
  for (const h of hues) {
    const r = (h * Math.PI) / 180;
    sumSin += Math.sin(r);
    sumCos += Math.cos(r);
  }
  const avg = (Math.atan2(sumSin / hues.length, sumCos / hues.length) * 180) / Math.PI;
  return (avg + 360) % 360;
}

function toExtracted(c: FinalColor): ExtractedColor {
  const oklch = toOklch(c.hex) ?? { l: 0, c: 0, h: 0 };
  return {
    hex: c.hex,
    hue: Math.round(oklch.h ?? 0),
    chroma: Number((oklch.c ?? 0).toFixed(4)),
    lightness: Number((oklch.l ?? 0).toFixed(4)),
    area: c.area,
    sourceHex: c.hex,
  };
}

/**
 * Extract a character seed-ready result from an image Blob or URL.
 */
export async function extractCharacterFromImage(
  source: string | HTMLImageElement,
): Promise<CharacterFromImageResult> {
  const rawCandidates = await extractColors(source, {
    pixels: 64000,
    distance: 0.22,
    saturationDistance: 0.2,
    lightnessDistance: 0.2,
    hueDistance: 0.083,
  });

  const candidates = rawCandidates
    .map(toExtracted)
    .sort((a, b) => b.chroma * b.area - a.chroma * a.area);

  const neutralPool = candidates.filter(c => c.chroma < NEUTRAL_CHROMA_THRESHOLD);
  const chromaticPool = candidates.filter(c => c.chroma >= NEUTRAL_CHROMA_THRESHOLD);

  if (chromaticPool.length === 0) {
    throw new Error('Image has no chromatic colors — try a more colourful reference.');
  }

  const primary = chromaticPool[0];

  // Pick secondary: furthest by ΔE2000 from primary, with minimum distance.
  let secondary: ExtractedColor | null = null;
  let bestDistance = -1;
  for (const candidate of chromaticPool.slice(1)) {
    const dE = differenceCiede2000()(primary.hex, candidate.hex);
    if (dE >= MIN_DELTA_E && dE > bestDistance) {
      bestDistance = dE;
      secondary = candidate;
    }
  }
  // Fallback: relax the ΔE requirement — use the furthest chromatic candidate.
  if (!secondary && chromaticPool.length > 1) {
    for (const candidate of chromaticPool.slice(1)) {
      const dE = differenceCiede2000()(primary.hex, candidate.hex);
      if (dE > bestDistance) {
        bestDistance = dE;
        secondary = candidate;
      }
    }
  }
  // Last resort: duplicate primary (very rare — single-color image).
  if (!secondary) secondary = primary;

  const suggestedGreyHue =
    neutralPool.length > 0 ? Math.round(circularMedian(neutralPool.map(n => n.hue))) : primary.hue;

  return {
    primary,
    secondary,
    suggestedGreyHue,
    chromaticPool,
    neutralPool,
    primaryChromaBucket: chromaBucket(primary.chroma),
  };
}

/**
 * Build a copy-paste CharacterSeed snippet from an extraction result.
 * `greyFrom` picks which hue populates surfaceHue: 'primary' (default) or 'secondary'.
 */
export function toSeedSnippet(
  result: CharacterFromImageResult,
  options: {
    name?: string;
    displayName?: string;
    greyFrom?: 'primary' | 'secondary' | 'neutral';
  } = {},
): string {
  const name = options.name ?? 'new-character';
  const displayName = options.displayName ?? 'New Character';
  const greyFrom = options.greyFrom ?? 'primary';

  const surfaceHue =
    greyFrom === 'secondary'
      ? result.secondary.hue
      : greyFrom === 'neutral'
      ? result.suggestedGreyHue
      : result.primary.hue;

  const patternHex = formatHex({
    mode: 'oklch',
    l: 0.65,
    c: Math.min(result.primary.chroma, 0.16),
    h: result.primary.hue,
  });

  return `const ${camel(name)}Seed: CharacterSeed = {
  name: '${name}',
  displayName: '${displayName}',
  description: 'Extracted from reference image — primary ${result.primary.hex}, secondary ${result.secondary.hex}.',
  personality: 'Edit me. Describe how this character feels to use.',
  tags: ['extracted'],

  // PRIMARY — ${result.primary.hex} (hue ${result.primary.hue}, chroma ${result.primary.chroma})
  primaryHue: ${result.primary.hue},
  primaryChroma: '${result.primaryChromaBucket}',
  primaryStep: 6,

  // GREY palette in ${greyFrom} hue (${surfaceHue})
  surfaceHue: ${surfaceHue},
  surfaceChromaPercent: 0.25,

  radius: { s: '4px', m: '6px', lg: '10px', xl: '9999px' },

  fonts: {
    display: "'Playwrite CZ', cursive",
    body: "'Inter', sans-serif",
    brand: "'Playwrite CZ', cursive",
  },

  // SHADOW tinted toward SECONDARY — ${result.secondary.hex}
  shadowRgb: '${hexToRgbCsv(result.secondary.hex)}',

  backgroundPattern: {
    image: 'radial-gradient(circle, ${patternHex} 1px, transparent 1px)',
    size: '24px 24px',
  },
};

const ${camel(name)} = deriveCharacter(${camel(name)}Seed);`;
}

function camel(s: string): string {
  return s.replace(/[-_](\w)/g, (_, c) => c.toUpperCase());
}

function hexToRgbCsv(hex: string): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r},${g},${b}`;
}
