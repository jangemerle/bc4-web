/**
 * Design System — Shadow Tokens
 * Source of truth: Figma / Topic Board New / Shadows
 *
 * 3 sizes × 3 intensities = 9 tokens
 *
 *   Size       Offset   Blur   Spread
 *   small      0, 1px   4px    0
 *   medium     0, 10px  20px   0
 *   large      0, 20px  40px   0
 *
 *   Intensity  Opacity (pure black)
 *   1          8%   (#00000014)
 *   2          16%  (#00000029)
 *   3          32%  (#00000052)
 *
 * For Tailwind — use utility classes: shadow-small-1 | shadow-medium-2 | shadow-large-3
 * For JS (canvas / chart) — import and use these values directly.
 */

export const shadows = {
  'small-1':  '0px 1px 4px 0px rgba(0,0,0,0.08)',
  'small-2':  '0px 1px 4px 0px rgba(0,0,0,0.16)',
  'small-3':  '0px 1px 4px 0px rgba(0,0,0,0.32)',
  'medium-1': '0px 10px 20px 0px rgba(0,0,0,0.08)',
  'medium-2': '0px 10px 20px 0px rgba(0,0,0,0.16)',
  'medium-3': '0px 10px 20px 0px rgba(0,0,0,0.32)',
  'large-1':  '0px 20px 40px 0px rgba(0,0,0,0.08)',
  'large-2':  '0px 20px 40px 0px rgba(0,0,0,0.16)',
  'large-3':  '0px 20px 40px 0px rgba(0,0,0,0.32)',
} as const;

export type ShadowKey = keyof typeof shadows;
