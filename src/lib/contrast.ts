/**
 * WCAG 2.x contrast ratio utilities.
 * Accepts both hex (#RRGGBB) and oklch() color strings.
 */

import { oklchToRgb } from './oklch';

/** Parse any supported color string → [r, g, b] as 0–1 floats. */
function parseToLinearComponents(color: string): [number, number, number] {
  const s = color.trim();

  // oklch(L C H)
  const oklchMatch = s.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/i);
  if (oklchMatch) {
    const [r, g, b] = oklchToRgb(
      parseFloat(oklchMatch[1]),
      parseFloat(oklchMatch[2]),
      parseFloat(oklchMatch[3]),
    );
    return [
      Math.max(0, Math.min(1, r)),
      Math.max(0, Math.min(1, g)),
      Math.max(0, Math.min(1, b)),
    ];
  }

  // hex
  const h = s.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}

/** sRGB → linear channel */
function toLinear(c: number): number {
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * Relative luminance per WCAG 2.x.
 * Accepts hex or oklch() strings.
 */
export function getLuminance(color: string): number {
  const [r, g, b] = parseToLinearComponents(color);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Contrast ratio between two colors (≥ 1). WCAG AA = 4.5:1.
 * Accepts hex or oklch() strings.
 */
export function getContrastRatio(color1: string, color2: string): number {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/** Legacy export for any code importing hexToRgb */
export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

import type { PaletteStep } from '../components/palette-generator/types';
import { oklchToCss } from './oklch';

/** Contrast ratio between two palette steps — convenience wrapper. */
export function contrastSteps(a: PaletteStep, b: PaletteStep): number {
  return getContrastRatio(oklchToCss(a.l, a.c, a.h), oklchToCss(b.l, b.c, b.h));
}

/** WCAG AA normal-text threshold: ≥ 4.5:1. */
export function meetsAA(a: PaletteStep, b: PaletteStep): boolean {
  return contrastSteps(a, b) >= 4.5;
}

/** WCAG AA large-text threshold: ≥ 3:1. */
export function meetsAALarge(a: PaletteStep, b: PaletteStep): boolean {
  return contrastSteps(a, b) >= 3.0;
}
