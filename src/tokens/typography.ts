/**
 * Design System — Typography Tokens
 * Source of truth: Figma / Topic Board New / Typography Styles
 *
 * Two font families:
 *   Borna   → Headlines (local OTF, weights 500 + 700)
 *   Inter   → Body text (Google Fonts, weights 500 + 600 + 700)
 */

// ─── Font Families ────────────────────────────────────────────────────────────

export const fontFamily = {
  /** Body text — all non-heading copy */
  sans:    'Inter, sans-serif',
  /** Headlines — Borna (licensed) */
  display: 'Borna, sans-serif',
  /** Code, technical labels, IDs — JetBrains Mono */
  mono:    "'JetBrains Mono', monospace",
} as const;

// ─── Font Weights ─────────────────────────────────────────────────────────────

export const fontWeight = {
  medium:   500,  // Used in both Inter body + Borna headlines
  semibold: 600,  // Inter body only
  bold:     700,  // Used in both Inter body + Borna headlines
} as const;

// ─── Headline Scale (Borna) ───────────────────────────────────────────────────
// line-height: 1.5  |  letter-spacing: 0

export const headlineScale = {
  '5xl': { fontSize: '80px', rem: '5',     lineHeight: 1.5, letterSpacing: 0 },
  '4xl': { fontSize: '64px', rem: '4',     lineHeight: 1.5, letterSpacing: 0 },
  '3xl': { fontSize: '52px', rem: '3.25',  lineHeight: 1.5, letterSpacing: 0 },
  '2xl': { fontSize: '42px', rem: '2.625', lineHeight: 1.5, letterSpacing: 0 },
  'xl':  { fontSize: '36px', rem: '2.25',  lineHeight: 1.5, letterSpacing: 0 },
  'l':   { fontSize: '28px', rem: '1.75',  lineHeight: 1.5, letterSpacing: 0 },
  'm':   { fontSize: '24px', rem: '1.5',   lineHeight: 1.5, letterSpacing: 0 },
  's':   { fontSize: '20px', rem: '1.25',  lineHeight: 1.5, letterSpacing: 0 },
} as const;

// ─── Body Text Scale (Inter) ──────────────────────────────────────────────────
// line-height: 1.2  |  letter-spacing varies (Figma values in px)

export const bodyScale = {
  'xl':  { fontSize: '18px', rem: '1.125',  lineHeight: 1.2, letterSpacing: '0'      },
  'l':   { fontSize: '16px', rem: '1',      lineHeight: 1.2, letterSpacing: '0.16px' },
  'm':   { fontSize: '14px', rem: '0.875',  lineHeight: 1.2, letterSpacing: '0.14px' },
  's':   { fontSize: '12px', rem: '0.75',   lineHeight: 1.2, letterSpacing: '0.48px' },
  'xs':  { fontSize: '10px', rem: '0.625',  lineHeight: 1.2, letterSpacing: '0.4px'  },
  '2xs': { fontSize: '8px',  rem: '0.5',    lineHeight: 1.2, letterSpacing: '0.32px' },
} as const;

// ─── Named Text Styles ────────────────────────────────────────────────────────
// Pre-composed combos matching Figma style names.
// Use these when you need JS-side style objects (e.g. chart libs, canvas).
// For Tailwind — use utility classes: font-display text-headline-2xl font-bold

export const textStyles = {
  // Headlines (Borna)
  'headline-5xl-bold':   { fontFamily: fontFamily.display, ...headlineScale['5xl'], fontWeight: fontWeight.bold   },
  'headline-5xl-medium': { fontFamily: fontFamily.display, ...headlineScale['5xl'], fontWeight: fontWeight.medium },
  'headline-4xl-bold':   { fontFamily: fontFamily.display, ...headlineScale['4xl'], fontWeight: fontWeight.bold   },
  'headline-4xl-medium': { fontFamily: fontFamily.display, ...headlineScale['4xl'], fontWeight: fontWeight.medium },
  'headline-3xl-bold':   { fontFamily: fontFamily.display, ...headlineScale['3xl'], fontWeight: fontWeight.bold   },
  'headline-3xl-medium': { fontFamily: fontFamily.display, ...headlineScale['3xl'], fontWeight: fontWeight.medium },
  'headline-2xl-bold':   { fontFamily: fontFamily.display, ...headlineScale['2xl'], fontWeight: fontWeight.bold   },
  'headline-2xl-medium': { fontFamily: fontFamily.display, ...headlineScale['2xl'], fontWeight: fontWeight.medium },
  'headline-xl-bold':    { fontFamily: fontFamily.display, ...headlineScale['xl'],  fontWeight: fontWeight.bold   },
  'headline-xl-medium':  { fontFamily: fontFamily.display, ...headlineScale['xl'],  fontWeight: fontWeight.medium },
  'headline-l-bold':     { fontFamily: fontFamily.display, ...headlineScale['l'],   fontWeight: fontWeight.bold   },
  'headline-l-medium':   { fontFamily: fontFamily.display, ...headlineScale['l'],   fontWeight: fontWeight.medium },
  'headline-m-bold':     { fontFamily: fontFamily.display, ...headlineScale['m'],   fontWeight: fontWeight.bold   },
  'headline-m-medium':   { fontFamily: fontFamily.display, ...headlineScale['m'],   fontWeight: fontWeight.medium },
  'headline-s-bold':     { fontFamily: fontFamily.display, ...headlineScale['s'],   fontWeight: fontWeight.bold   },
  'headline-s-medium':   { fontFamily: fontFamily.display, ...headlineScale['s'],   fontWeight: fontWeight.medium },

  // Body (Inter)
  'body-xl-medium':      { fontFamily: fontFamily.sans, ...bodyScale['xl'],  fontWeight: fontWeight.medium   },
  'body-xl-semibold':    { fontFamily: fontFamily.sans, ...bodyScale['xl'],  fontWeight: fontWeight.semibold },
  'body-xl-bold':        { fontFamily: fontFamily.sans, ...bodyScale['xl'],  fontWeight: fontWeight.bold     },
  'body-l-medium':       { fontFamily: fontFamily.sans, ...bodyScale['l'],   fontWeight: fontWeight.medium   },
  'body-l-semibold':     { fontFamily: fontFamily.sans, ...bodyScale['l'],   fontWeight: fontWeight.semibold },
  'body-l-bold':         { fontFamily: fontFamily.sans, ...bodyScale['l'],   fontWeight: fontWeight.bold     },
  'body-m-medium':       { fontFamily: fontFamily.sans, ...bodyScale['m'],   fontWeight: fontWeight.medium   },
  'body-m-semibold':     { fontFamily: fontFamily.sans, ...bodyScale['m'],   fontWeight: fontWeight.semibold },
  'body-m-bold':         { fontFamily: fontFamily.sans, ...bodyScale['m'],   fontWeight: fontWeight.bold     },
  'body-s-medium':       { fontFamily: fontFamily.sans, ...bodyScale['s'],   fontWeight: fontWeight.medium   },
  'body-s-semibold':     { fontFamily: fontFamily.sans, ...bodyScale['s'],   fontWeight: fontWeight.semibold },
  'body-s-bold':         { fontFamily: fontFamily.sans, ...bodyScale['s'],   fontWeight: fontWeight.bold     },
  'body-xs-medium':      { fontFamily: fontFamily.sans, ...bodyScale['xs'],  fontWeight: fontWeight.medium   },
  'body-xs-semibold':    { fontFamily: fontFamily.sans, ...bodyScale['xs'],  fontWeight: fontWeight.semibold },
  'body-xs-bold':        { fontFamily: fontFamily.sans, ...bodyScale['xs'],  fontWeight: fontWeight.bold     },
  'body-2xs-medium':     { fontFamily: fontFamily.sans, ...bodyScale['2xs'], fontWeight: fontWeight.medium   },
  'body-2xs-semibold':   { fontFamily: fontFamily.sans, ...bodyScale['2xs'], fontWeight: fontWeight.semibold },
} as const;

// ─── Tailwind Class Helpers ───────────────────────────────────────────────────
// Quick reference for the Tailwind utility combos that produce each Figma style.
//
// Headlines:  font-display text-headline-{s|m|l|xl|2xl|3xl|4xl|5xl} font-{medium|bold}
// Body text:  font-sans    text-{xs|sm|md|base|lg|2xs}   font-{medium|semibold|bold}
//
// Examples:
//   Headline 2XL Bold   → "font-display text-headline-2xl font-bold"
//   Headline L Medium   → "font-display text-headline-l font-medium"
//   Body L SemiBold     → "font-sans text-base font-semibold"
//   Body M Medium       → "font-sans text-md font-medium"
//   Body S Bold         → "font-sans text-sm font-bold"
