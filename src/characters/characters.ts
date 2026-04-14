/**
 * Character System — Character Registry (OKLCH)
 *
 * Defines all available characters as variable override maps.
 * Each character is a set of CSS custom property values that get applied to :root.
 * All color values use oklch(L C H) notation.
 *
 * To add a new character:
 * 1. Create a folder in characters/ with character.json + variables.css
 * 2. Add the variable map here
 * 3. The character becomes available via useCharacter()
 */

import type { Character } from './types';
import type { CharacterSeed } from './types';
import { deriveCharacter } from './derive';

// ─── Kvalt Default ──────────────────────────────────────────────────────────
// The reference character — matches the base design system exactly.

const kvaltDefault: Character = {
  manifest: {
    name: 'kvalt-default',
    displayName: 'Kvalt Default',
    version: '1.0.0',
    description: 'The original Kvalt design system — clean, structured, with personality in the details',
    personality: 'Professional but alive. Every interaction has weight, every transition has purpose. Green accents on cool neutrals. The kind of UI that makes you trust the product.',
    author: 'Jan Gemerle',
    license: 'MIT',
    tags: ['saas', 'dashboard', 'professional', 'green', 'motion'],
    preview: {
      primaryColor: 'oklch(0.812 0.1494 145.9)',
      accentColor: 'oklch(0.544 0.1036 255.8)',
      backgroundColor: 'oklch(0.964 0.0065 264.0)',
      textColor: 'oklch(0.266 0.0511 256.1)',
      radius: '8px',
    },
  },
  // Empty variables = use base tokens.css values (this IS the default)
  variables: {},
};

// ─── Taut ───────────────────────────────────────────────────────────────────
// Protocol-grade infrastructure. Sharp zero-radius, electric violet, Space Grotesk.

const tautSeed: CharacterSeed = {
  name: 'taut',
  displayName: 'Taut',
  description: 'Protocol-grade infrastructure — zero-radius sharp edges, electric violet, Space Grotesk and Space Mono for code contexts',
  personality: 'Infrastructure you can trust. Zero decoration. Zero compromise. Every edge is deliberate.',
  tags: ['protocol', 'web3', 'infrastructure', 'monospace', 'sharp'],
  primaryHue: 293,
  primaryChroma: 'Vivid',
  primaryStep: 7,
  surfaceHue: 293,
  surfaceChromaPercent: 0.14,
  radius: { s: '0px', m: '0px', lg: '0px', xl: '0px' },
  fonts: {
    display: "'Space Grotesk', sans-serif",
    body: "'Inter', sans-serif",
    brand: "'Space Mono', monospace",
  },
  shadowRgb: '124,58,237',
};

const taut = deriveCharacter(tautSeed);

// Legacy static overrides kept below — DELETE THESE when seed output is verified:
/** @deprecated Legacy static overrides — delete when seed output is verified */
export const _tautLegacy: Character = {
  manifest: {
    name: 'taut-legacy',
    displayName: 'Taut (legacy)',
    version: '1.0.0',
    description: 'Legacy static version for comparison',
    personality: '',
  },
  variables: {
    '--color-bg': 'oklch(0.979 0.0106 292.0)',
    '--color-surface-1': 'oklch(1 0 0)',
    '--color-surface-2': 'oklch(0.969 0.0161 293.8)',
    '--color-surface-3': 'oklch(0.943 0.0284 294.6)',
    '--color-surface-4': 'oklch(0.894 0.0549 293.3)',
    '--color-surface-5': 'oklch(0.811 0.1013 293.6)',
    '--color-surface-6': 'oklch(0.606 0.2189 292.7)',
    '--color-surface-7': 'oklch(0.491 0.2412 292.6)',
    '--color-on-surface': 'oklch(0.172 0.0324 268.9)',
    '--color-on-surface-subtle-1': 'oklch(0.352 0.0518 291.1)',
    '--color-on-surface-subtle-2': 'oklch(0.467 0.0581 292.9)',
    '--color-inverted-surface': 'oklch(0.172 0.0324 268.9)',
    '--color-on-inverted-surface': 'oklch(0.929 0.0126 255.5)',
    '--color-primary-1': 'oklch(0.541 0.2466 293.0)',
    '--color-primary-2': 'oklch(0.491 0.2412 292.6)',
    '--color-primary-3': 'oklch(0.432 0.2106 292.8)',
    '--color-on-primary': 'oklch(1 0 0)',
    '--color-secondary-1': 'oklch(0.969 0.0161 293.8)',
    '--color-secondary-2': 'oklch(0.943 0.0284 294.6)',
    '--color-on-secondary-1': 'oklch(0.491 0.2412 292.6)',
    '--color-on-secondary-2': 'oklch(0.380 0.1783 293.7)',
    '--color-success-1': 'oklch(0.715 0.1257 215.2)',
    '--color-success-2': 'oklch(0.655 0.1224 215.2)',
    '--color-success-3': 'oklch(0.585 0.1122 215.2)',
    '--color-on-success': 'oklch(1 0 0)',
    '--color-success-secondary-1': 'oklch(0.960 0.0193 215.2)',
    '--color-success-secondary-2': 'oklch(0.920 0.0452 215.2)',
    '--color-on-success-secondary': 'oklch(0.380 0.0628 215.2)',
    '--color-warning-1': 'oklch(0.748 0.1636 46.6)',
    '--color-warning-2': 'oklch(0.661 0.1743 50.2)',
    '--color-warning-3': 'oklch(0.557 0.1461 50.5)',
    '--color-on-warning': 'oklch(1 0 0)',
    '--color-warning-secondary-1': 'oklch(0.968 0.0161 36.5)',
    '--color-warning-secondary-2': 'oklch(0.910 0.0475 35.9)',
    '--color-on-warning-secondary': 'oklch(0.353 0.0933 50.0)',
    '--color-danger-1': 'oklch(0.637 0.2092 25.5)',
    '--color-danger-2': 'oklch(0.577 0.2122 25.5)',
    '--color-danger-3': 'oklch(0.505 0.1860 25.5)',
    '--color-on-danger': 'oklch(1 0 0)',
    '--color-danger-secondary-1': 'oklch(0.952 0.0247 17.4)',
    '--color-danger-secondary-2': 'oklch(0.920 0.0457 17.8)',
    '--color-on-danger-secondary': 'oklch(0.390 0.1100 25.5)',
    '--color-border': 'oklch(0.894 0.0549 293.3)',
    '--color-border-strong': 'oklch(0.811 0.1013 293.6)',
    '--color-hero-title': 'oklch(0.172 0.0324 268.9)',
    '--radius-s': '0px',
    '--radius-m': '0px',
    '--radius-lg': '0px',
    '--radius-xl': '0px',
    '--shadow-small-1': '0px 1px 3px 0px rgba(124,58,237,0.06)',
    '--shadow-small-2': '0px 1px 3px 0px rgba(124,58,237,0.12)',
    '--shadow-small-3': '0px 1px 3px 0px rgba(124,58,237,0.24)',
    '--shadow-medium-1': '0px 4px 16px 0px rgba(124,58,237,0.06)',
    '--shadow-medium-2': '0px 4px 16px 0px rgba(124,58,237,0.12)',
    '--shadow-medium-3': '0px 4px 16px 0px rgba(124,58,237,0.24)',
    '--shadow-large-1': '0px 12px 40px 0px rgba(124,58,237,0.08)',
    '--shadow-large-2': '0px 12px 40px 0px rgba(124,58,237,0.16)',
    '--shadow-large-3': '0px 12px 40px 0px rgba(124,58,237,0.28)',
    '--font-display': "'Space Grotesk', sans-serif",
    '--font-body': "'Inter', sans-serif",
    '--font-brand': "'Space Mono', monospace",
  },
};

// ─── Signal ─────────────────────────────────────────────────────────────────
// Electric playground. Vibrant magenta, generous radius, DM Sans.

const signalSeed: CharacterSeed = {
  name: 'signal',
  displayName: 'Signal',
  description: 'Electric playground — vibrant magenta primary, generous rounded corners, bold DM Sans typography, playful energy',
  personality: 'Design is play. Color is energy. Every click should spark joy.',
  tags: ['creative', 'playful', 'vibrant', 'bento', 'bold', 'joyful'],
  primaryHue: 354,
  primaryChroma: 'Vivid',
  primaryStep: 6,
  surfaceChromaPercent: 0,  // achromatic surfaces — signal uses pure grays
  radius: { s: '10px', m: '16px', lg: '24px', xl: '9999px' },
  fonts: {
    display: "'DM Sans', sans-serif",
    body: "'Inter', sans-serif",
    brand: "'DM Sans', sans-serif",
  },
  shadowRgb: '236,72,153',
  onPrimaryOverride: 'white',  // magenta buttons look better with white text
};

const signal = deriveCharacter(signalSeed);

// Legacy static overrides kept below — DELETE THESE when seed output is verified:
/** @deprecated Legacy static overrides — delete when seed output is verified */
export const _signalLegacy: Character = {
  manifest: {
    name: 'signal-legacy',
    displayName: 'Signal (legacy)',
    version: '1.0.0',
    description: 'Legacy static version for comparison',
    personality: '',
  },
  variables: {
    '--color-bg': 'oklch(0.970 0 0)',
    '--color-surface-1': 'oklch(1 0 0)',
    '--color-surface-2': 'oklch(0.970 0 0)',
    '--color-surface-3': 'oklch(0.961 0 0)',
    '--color-surface-4': 'oklch(0.922 0 0)',
    '--color-surface-5': 'oklch(0.876 0 0)',
    '--color-surface-6': 'oklch(0.732 0 0)',
    '--color-surface-7': 'oklch(0.580 0 0)',
    '--color-on-surface': 'oklch(0.208 0.0398 265.8)',
    '--color-on-surface-subtle-1': 'oklch(0.370 0 0)',
    '--color-on-surface-subtle-2': 'oklch(0.528 0.0097 265.8)',
    '--color-inverted-surface': 'oklch(0.208 0.0398 265.8)',
    '--color-on-inverted-surface': 'oklch(0.970 0 0)',
    '--color-primary-1': 'oklch(0.656 0.2118 354.3)',
    '--color-primary-2': 'oklch(0.592 0.2180 0.6)',
    '--color-primary-3': 'oklch(0.525 0.1990 4.0)',
    '--color-on-primary': 'oklch(1 0 0)',
    '--color-secondary-1': 'oklch(0.969 0.0161 293.8)',
    '--color-secondary-2': 'oklch(0.943 0.0284 294.6)',
    '--color-on-secondary-1': 'oklch(0.491 0.2412 292.6)',
    '--color-on-secondary-2': 'oklch(0.432 0.2106 292.8)',
    '--color-success-1': 'oklch(0.723 0.1920 149.6)',
    '--color-success-2': 'oklch(0.627 0.1699 149.2)',
    '--color-success-3': 'oklch(0.527 0.1371 150.1)',
    '--color-on-success': 'oklch(1 0 0)',
    '--color-success-secondary-1': 'oklch(0.950 0.0451 154.4)',
    '--color-success-secondary-2': 'oklch(0.910 0.0958 154.4)',
    '--color-on-success-secondary': 'oklch(0.393 0.0896 152.5)',
    '--color-warning-1': 'oklch(0.748 0.1636 46.6)',
    '--color-warning-2': 'oklch(0.661 0.1743 50.2)',
    '--color-warning-3': 'oklch(0.557 0.1461 50.5)',
    '--color-on-warning': 'oklch(1 0 0)',
    '--color-warning-secondary-1': 'oklch(0.968 0.0161 36.5)',
    '--color-warning-secondary-2': 'oklch(0.910 0.0475 35.9)',
    '--color-on-warning-secondary': 'oklch(0.353 0.0933 50.0)',
    '--color-danger-1': 'oklch(0.637 0.2092 25.5)',
    '--color-danger-2': 'oklch(0.577 0.2122 25.5)',
    '--color-danger-3': 'oklch(0.505 0.1860 25.5)',
    '--color-on-danger': 'oklch(1 0 0)',
    '--color-danger-secondary-1': 'oklch(0.952 0.0247 17.4)',
    '--color-danger-secondary-2': 'oklch(0.920 0.0457 17.8)',
    '--color-on-danger-secondary': 'oklch(0.390 0.1100 25.5)',
    '--color-border': 'oklch(0.922 0 0)',
    '--color-border-strong': 'oklch(0.876 0 0)',
    '--color-hero-title': 'oklch(0.656 0.2118 354.3)',
    '--radius-s': '10px',
    '--radius-m': '16px',
    '--radius-lg': '24px',
    '--radius-xl': '9999px',
    '--shadow-small-1': '0px 2px 8px 0px rgba(236,72,153,0.05)',
    '--shadow-small-2': '0px 2px 8px 0px rgba(236,72,153,0.10)',
    '--shadow-small-3': '0px 2px 8px 0px rgba(236,72,153,0.20)',
    '--shadow-medium-1': '0px 8px 28px 0px rgba(236,72,153,0.06)',
    '--shadow-medium-2': '0px 8px 28px 0px rgba(236,72,153,0.10)',
    '--shadow-medium-3': '0px 8px 28px 0px rgba(236,72,153,0.18)',
    '--shadow-large-1': '0px 20px 56px 0px rgba(236,72,153,0.06)',
    '--shadow-large-2': '0px 20px 56px 0px rgba(236,72,153,0.12)',
    '--shadow-large-3': '0px 20px 56px 0px rgba(236,72,153,0.22)',
    '--font-display': "'DM Sans', sans-serif",
    '--font-body': "'Inter', sans-serif",
    '--font-brand': "'DM Sans', sans-serif",
  },
};

// ─── Ink ────────────────────────────────────────────────────────────────────
// Bold editorial statement. Forest green, minimal radius, Playfair Display.

const ink: Character = {
  manifest: {
    name: 'ink',
    displayName: 'Ink',
    version: '1.0.0',
    description: 'Bold editorial statement — deep forest green primary, almost-zero radius, massive Playfair Display typography with restraint',
    personality: 'Let the words do the work. Restraint is confidence. Whitespace is luxury.',
    author: 'Kvalt',
    license: 'MIT',
    tags: ['editorial', 'typography', 'green', 'serif', 'literary', 'statement'],
    preview: {
      primaryColor: 'oklch(0.393 0.0896 152.5)',
      accentColor: 'oklch(0.871 0.1363 154.4)',
      backgroundColor: 'oklch(0.984 0.0028 128.5)',
      textColor: 'oklch(0.218 0 0)',
      radius: '2px',
    },
  },
  variables: {
    '--color-bg': 'oklch(0.984 0.0028 128.5)',
    '--color-surface-1': 'oklch(1 0 0)',
    '--color-surface-2': 'oklch(0.984 0.0028 128.5)',
    '--color-surface-3': 'oklch(0.958 0.0069 124.4)',
    '--color-surface-4': 'oklch(0.901 0.0154 123.1)',
    '--color-surface-5': 'oklch(0.830 0.0239 120.3)',
    '--color-surface-6': 'oklch(0.645 0.0329 121.7)',
    '--color-surface-7': 'oklch(0.488 0.0307 124.0)',
    '--color-on-surface': 'oklch(0.218 0 0)',
    '--color-on-surface-subtle-1': 'oklch(0.360 0 0)',
    '--color-on-surface-subtle-2': 'oklch(0.528 0 0)',
    '--color-inverted-surface': 'oklch(0.218 0 0)',
    '--color-on-inverted-surface': 'oklch(0.984 0.0028 128.5)',
    '--color-primary-1': 'oklch(0.393 0.0896 152.5)',
    '--color-primary-2': 'oklch(0.448 0.1083 151.3)',
    '--color-primary-3': 'oklch(0.527 0.1371 150.1)',
    '--color-on-primary': 'oklch(1 0 0)',
    '--color-secondary-1': 'oklch(0.970 0.0253 154.4)',
    '--color-secondary-2': 'oklch(0.950 0.0451 154.4)',
    '--color-on-secondary-1': 'oklch(0.448 0.1083 151.3)',
    '--color-on-secondary-2': 'oklch(0.393 0.0896 152.5)',
    '--color-success-1': 'oklch(0.723 0.1920 149.6)',
    '--color-success-2': 'oklch(0.627 0.1699 149.2)',
    '--color-success-3': 'oklch(0.527 0.1371 150.1)',
    '--color-on-success': 'oklch(1 0 0)',
    '--color-success-secondary-1': 'oklch(0.950 0.0451 154.4)',
    '--color-success-secondary-2': 'oklch(0.910 0.0958 154.4)',
    '--color-on-success-secondary': 'oklch(0.393 0.0896 152.5)',
    '--color-warning-1': 'oklch(0.700 0.1500 80.0)',
    '--color-warning-2': 'oklch(0.630 0.1350 80.0)',
    '--color-warning-3': 'oklch(0.560 0.1200 80.0)',
    '--color-on-warning': 'oklch(1 0 0)',
    '--color-warning-secondary-1': 'oklch(0.968 0.0150 80.0)',
    '--color-warning-secondary-2': 'oklch(0.930 0.0400 80.0)',
    '--color-on-warning-secondary': 'oklch(0.400 0.0900 80.0)',
    '--color-danger-1': 'oklch(0.505 0.1860 25.5)',
    '--color-danger-2': 'oklch(0.470 0.1750 25.5)',
    '--color-danger-3': 'oklch(0.390 0.1500 25.5)',
    '--color-on-danger': 'oklch(1 0 0)',
    '--color-danger-secondary-1': 'oklch(0.952 0.0247 17.4)',
    '--color-danger-secondary-2': 'oklch(0.920 0.0457 17.8)',
    '--color-on-danger-secondary': 'oklch(0.300 0.0800 25.5)',
    '--color-border': 'oklch(0.901 0.0154 123.1)',
    '--color-border-strong': 'oklch(0.830 0.0239 120.3)',
    '--color-hero-title': 'oklch(0.393 0.0896 152.5)',
    '--radius-s': '1px',
    '--radius-m': '2px',
    '--radius-lg': '3px',
    '--radius-xl': '9999px',
    '--shadow-small-1': '0px 1px 2px 0px rgba(26,26,26,0.02)',
    '--shadow-small-2': '0px 1px 2px 0px rgba(26,26,26,0.04)',
    '--shadow-small-3': '0px 1px 2px 0px rgba(26,26,26,0.08)',
    '--shadow-medium-1': '0px 4px 8px 0px rgba(26,26,26,0.02)',
    '--shadow-medium-2': '0px 4px 8px 0px rgba(26,26,26,0.04)',
    '--shadow-medium-3': '0px 4px 8px 0px rgba(26,26,26,0.08)',
    '--shadow-large-1': '0px 8px 16px 0px rgba(26,26,26,0.02)',
    '--shadow-large-2': '0px 8px 16px 0px rgba(26,26,26,0.04)',
    '--shadow-large-3': '0px 8px 16px 0px rgba(26,26,26,0.08)',
    '--font-display': "'Playfair Display', serif",
    '--font-body': "'Inter', sans-serif",
    '--font-brand': "'Playfair Display', serif",
  },
};

// ─── Haze ──────────────────────────────────────────────────────────────────
// Frosted glass over a lavender-peach sky. Premium, soft, AI-forward.

const haze: Character = {
  manifest: {
    name: 'haze',
    displayName: 'Haze',
    version: '1.0.0',
    description: 'Frosted glass over a lavender-peach sky — premium, soft, quietly confident',
    personality: 'Everything feels like it\'s floating one layer above the surface. Warm gradients underneath, frosted panels on top. Precision that doesn\'t need to prove it.',
    author: 'Kvalt',
    license: 'MIT',
    tags: ['glassmorphism', 'gradient', 'premium', 'fintech', 'soft', 'ai', 'modern'],
    preview: {
      primaryColor: '#9B7BC8',
      accentColor: '#D4A07A',
      backgroundColor: '#F6F0FA',
      textColor: '#2A1F3D',
      radius: '16px',
    },
  },
  variables: {
    // Surface — warm lavender-tinted whites
    '--color-bg': 'oklch(0.955 0.018 300)',
    '--color-surface-1': 'oklch(1 0 0)',
    '--color-surface-2': 'oklch(0.978 0.008 300)',
    '--color-surface-3': 'oklch(0.955 0.018 300)',
    '--color-surface-4': 'oklch(0.912 0.024 296)',
    '--color-surface-5': 'oklch(0.856 0.028 294)',
    '--color-surface-6': 'oklch(0.780 0.030 292)',
    '--color-surface-7': 'oklch(0.680 0.028 290)',
    '--color-on-surface': 'oklch(0.230 0.040 300)',
    '--color-on-surface-subtle-1': 'oklch(0.460 0.030 292)',
    '--color-on-surface-subtle-2': 'oklch(0.600 0.024 290)',
    '--color-surface-subtle-grid': 'oklch(0.912 0.024 296 / 0.5)',
    '--color-inverted-surface': 'oklch(0.230 0.040 300)',
    '--color-on-inverted-surface': 'oklch(1 0 0)',
    // Primary — muted lavender/purple
    '--color-primary-1': 'oklch(0.600 0.120 295)',
    '--color-primary-2': 'oklch(0.540 0.130 295)',
    '--color-primary-3': 'oklch(0.480 0.135 295)',
    '--color-on-primary': 'oklch(1 0 0)',
    // Secondary — warm peach
    '--color-secondary-1': 'oklch(0.965 0.020 55)',
    '--color-secondary-2': 'oklch(0.920 0.040 50)',
    '--color-on-secondary-1': 'oklch(0.550 0.080 50)',
    '--color-on-secondary-2': 'oklch(0.440 0.070 50)',
    // Success
    '--color-success-1': 'oklch(0.700 0.140 155)',
    '--color-success-2': 'oklch(0.620 0.130 155)',
    '--color-success-3': 'oklch(0.520 0.110 155)',
    '--color-on-success': 'oklch(1 0 0)',
    '--color-success-secondary-1': 'oklch(0.960 0.025 155)',
    '--color-success-secondary-2': 'oklch(0.900 0.065 155)',
    '--color-on-success-secondary': 'oklch(0.320 0.070 155)',
    // Warning
    '--color-warning-1': 'oklch(0.720 0.140 70)',
    '--color-warning-2': 'oklch(0.650 0.130 70)',
    '--color-warning-3': 'oklch(0.540 0.110 70)',
    '--color-on-warning': 'oklch(1 0 0)',
    '--color-warning-secondary-1': 'oklch(0.970 0.015 60)',
    '--color-warning-secondary-2': 'oklch(0.930 0.040 60)',
    '--color-on-warning-secondary': 'oklch(0.360 0.080 70)',
    // Danger — muted rose
    '--color-danger-1': 'oklch(0.580 0.140 10)',
    '--color-danger-2': 'oklch(0.510 0.130 10)',
    '--color-danger-3': 'oklch(0.420 0.110 10)',
    '--color-on-danger': 'oklch(1 0 0)',
    '--color-danger-secondary-1': 'oklch(0.965 0.018 10)',
    '--color-danger-secondary-2': 'oklch(0.920 0.040 10)',
    '--color-on-danger-secondary': 'oklch(0.350 0.090 10)',
    // Border
    '--color-border': 'oklch(0.912 0.024 296)',
    '--color-border-strong': 'oklch(0.830 0.035 294)',
    '--color-hero-title': 'oklch(0.200 0.050 300)',
    // AI Gradient — Haze's signature
    '--color-ai-from': '#C8ADE0',
    '--color-ai-to': '#E4BEA4',
    '--gradient-ai': 'linear-gradient(135deg, #C8ADE0 0%, #E4BEA4 100%)',
    '--gradient-ai-subtle': 'linear-gradient(135deg, rgba(200,173,224,0.16) 0%, rgba(228,190,164,0.16) 100%)',
    '--gradient-ai-vivid': 'linear-gradient(135deg, #B896D4 0%, #DA9E7C 100%)',
    '--gradient-ai-border': 'linear-gradient(135deg, rgba(200,173,224,0.5) 0%, rgba(228,190,164,0.5) 100%)',
    // Radius — generous, cushioned
    '--radius-s': '8px',
    '--radius-m': '12px',
    '--radius-lg': '16px',
    '--radius-xl': '9999px',
    // Shadows — purple-tinted, soft
    '--shadow-small-1': '0px 1px 4px 0px rgba(42,31,61,0.06)',
    '--shadow-small-2': '0px 1px 4px 0px rgba(42,31,61,0.12)',
    '--shadow-small-3': '0px 1px 4px 0px rgba(42,31,61,0.24)',
    '--shadow-medium-1': '0px 10px 24px 0px rgba(42,31,61,0.06)',
    '--shadow-medium-2': '0px 10px 24px 0px rgba(42,31,61,0.12)',
    '--shadow-medium-3': '0px 10px 24px 0px rgba(42,31,61,0.24)',
    '--shadow-large-1': '0px 24px 48px 0px rgba(42,31,61,0.06)',
    '--shadow-large-2': '0px 24px 48px 0px rgba(42,31,61,0.12)',
    '--shadow-large-3': '0px 24px 48px 0px rgba(42,31,61,0.24)',
    // Typography — Sora for geometric elegance
    '--font-display': "'Sora', sans-serif",
    '--font-body': "'Inter', sans-serif",
    '--font-brand': "'Sora', sans-serif",
  },
  // Dark mode — deep plum-lavender surfaces keep the frosted-glass mood at night.
  // Lightness ramp mirrors tokens.css .dark (0.194 → 0.534) at Haze's hue (300)
  // with a low chroma that reads as tinted neutral, not saturated purple.
  darkVariables: {
    '--color-bg':                   'oklch(0.194 0.022 300)',
    '--color-surface-1':            'oklch(0.229 0.024 300)',
    '--color-surface-2':            'oklch(0.263 0.026 300)',
    '--color-surface-3':            'oklch(0.300 0.028 300)',
    '--color-surface-4':            'oklch(0.338 0.030 300)',
    '--color-surface-5':            'oklch(0.385 0.030 300)',
    '--color-surface-6':            'oklch(0.432 0.028 300)',
    '--color-surface-7':            'oklch(0.534 0.026 300)',
    '--color-on-surface':           'oklch(1 0 0)',
    '--color-on-surface-subtle-1':  'oklch(0.718 0.022 296)',
    '--color-on-surface-subtle-2':  'oklch(0.634 0.024 294)',
    '--color-surface-subtle-grid':  'oklch(0.338 0.030 300 / 0.3)',
    '--color-inverted-surface':     'oklch(1 0 0)',
    '--color-on-inverted-surface':  'oklch(0.230 0.040 300)',
    '--color-border':               'oklch(0.338 0.030 300)',
    '--color-border-strong':        'oklch(0.432 0.028 300)',
    '--color-hero-title':           'oklch(0.978 0.008 300)',
    // Shadows — boosted opacity so purple-tinted depth stays visible on dark surfaces
    '--shadow-small-1':   '0px 1px 4px 0px rgba(10,4,20,0.32)',
    '--shadow-small-2':   '0px 1px 4px 0px rgba(10,4,20,0.56)',
    '--shadow-small-3':   '0px 1px 4px 0px rgba(10,4,20,0.72)',
    '--shadow-medium-1':  '0px 10px 24px 0px rgba(10,4,20,0.32)',
    '--shadow-medium-2':  '0px 10px 24px 0px rgba(10,4,20,0.56)',
    '--shadow-medium-3':  '0px 10px 24px 0px rgba(10,4,20,0.72)',
    '--shadow-large-1':   '0px 24px 48px 0px rgba(10,4,20,0.32)',
    '--shadow-large-2':   '0px 24px 48px 0px rgba(10,4,20,0.56)',
    '--shadow-large-3':   '0px 24px 48px 0px rgba(10,4,20,0.72)',
  },
};

// ─── Cobalt ─────────────────────────────────────────────────────────────────
// Electric cobalt enterprise. Icy cool-gray surfaces, vivid blue, confident SaaS.

const cobaltSeed: CharacterSeed = {
  name: 'cobalt',
  displayName: 'Cobalt',
  description: 'Electric cobalt enterprise — vivid blue primary, icy cool-gray surfaces, confident geometric sans, modern SaaS with presence',
  personality: 'The UI that ships on time and looks good doing it. No decoration for decoration\'s sake — every blue pixel earns its place.',
  tags: ['saas', 'enterprise', 'blue', 'geometric', 'clean', 'confident'],
  primaryHue: 250,
  primaryChroma: 'Vivid',
  primaryStep: 6,
  surfaceHue: 248,
  surfaceChromaPercent: 0.10,
  radius: { s: '2px', m: '2px', lg: '20px', xl: '9999px' },
  layoutGap: '8px',
  fonts: {
    display: "'Plus Jakarta Sans', sans-serif",
    body: "'Inter', sans-serif",
    brand: "'Plus Jakarta Sans', sans-serif",
  },
  shadowRgb: '0,80,200',
  onPrimaryOverride: 'white',
};

const cobalt = deriveCharacter(cobaltSeed);

// ─── Kavárna ────────────────────────────────────────────────────────────────
// Two distinctive colors from a Malika Favre-style editorial illustration:
//   Primary   — coral-salmon (hue 22, from the "X" box)
//   Secondary — deep navy (hue 270, from the figure's jacket)
// Grey palette is tinted toward PRIMARY hue (22) because warm paper fits the
// Czech editorial / uncoated-paper mood better than a cool navy surface.
// Shadow is tinted toward the SECONDARY hue so cards drop a faint navy-bronze
// shadow instead of pure black — keeps the palette coherent.
// Playwrite CZ handwriting powers every headline for the literary-magazine feel.

const kavarnaSeed: CharacterSeed = {
  name: 'kavarna',
  displayName: 'Kavárna',
  description: 'Editorial Czech warmth — coral-salmon primary, warm salmon-tinted surfaces, navy-shadowed cards, dot-grid paper background, Playwrite CZ handwriting for every headline.',
  personality: 'Quiet confidence, no hype. Every headline feels handwritten by someone who cares, every surface is sun-warmed paper, every shadow carries a whisper of navy. Made for long reads, good coffee, and opinions you can defend.',
  tags: ['editorial', 'warm', 'literary', 'czech', 'handwritten', 'coral', 'navy'],

  // PRIMARY — coral-salmon (the "X box" pop)
  primaryHue: 22,
  primaryChroma: 'Vivid',
  primaryStep: 6,

  // GREY palette tinted toward PRIMARY hue (22) for warm paper surfaces.
  // Ready to swap to secondary (270) if the mood wants cool paper instead.
  surfaceHue: 22,
  surfaceChromaPercent: 0.28,

  radius: { s: '2px', m: '4px', lg: '8px', xl: '9999px' },

  fonts: {
    display: "'Playwrite CZ', cursive",
    body: "'Inter', sans-serif",
    brand: "'Playwrite CZ', cursive",
  },

  // SHADOW tinted toward SECONDARY hue (navy ~270) — adds character depth
  // without going pure black. RGB approximates oklch(0.25 0.09 270).
  shadowRgb: '30,35,90',

  onPrimaryOverride: 'white',

  // Dot grid in PRIMARY hue — warm coral dots on warm surfaces, 24px spacing.
  backgroundPattern: {
    image: 'radial-gradient(circle, oklch(0.65 0.14 22 / 0.20) 1px, transparent 1px)',
    size: '24px 24px',
  },
};

const kavarna = deriveCharacter(kavarnaSeed);

// ─── Bloom ──────────────────────────────────────────────────────────────────
// Two distinctive colors from a pink-tulips-with-forest-leaves illustration:
//   Primary   — rose-coral pink (hue 12, the tulip bloom)
//   Secondary — forest green    (hue 148, the dark foliage)
// Grey palette is tinted toward SECONDARY hue (148) because sage-tinted paper
// lets the rose primary bloom — pink dots on pink paper would be monochrome
// mush, but rose on soft sage reads like a pressed flower on herbarium stock.
// Shadow is tinted toward SECONDARY too so cards drop a faint forest shadow.
// Playwrite CZ handwriting powers every headline for the personal-diary feel.

const bloomSeed: CharacterSeed = {
  name: 'bloom',
  displayName: 'Bloom',
  description: 'Romantic botanical — rose-coral primary on sage-tinted paper, soft generous radii, forest-green shadows, Playwrite CZ handwriting for every headline.',
  personality: 'A hand-written love letter pressed between flowers. Rose bloom on sage paper, rounded like a petal, shadowed like deep leaves. Made for diaries, gratitude lists, and notes you\'d rather keep private.',
  tags: ['romantic', 'botanical', 'rose', 'sage', 'handwritten', 'pink', 'green', 'soft'],

  // PRIMARY — rose-coral pink (the tulip bloom)
  primaryHue: 12,
  primaryChroma: 'Vivid',
  primaryStep: 6,

  // GREY palette tinted toward SECONDARY hue (148, forest green) for sage paper.
  // Ready to swap to primary (12) if the rose-on-rose mood ever feels right.
  surfaceHue: 148,
  surfaceChromaPercent: 0.15,

  radius: { s: '8px', m: '16px', lg: '24px', xl: '9999px' },

  fonts: {
    display: "'Playwrite CZ', cursive",
    body: "'Inter', sans-serif",
    brand: "'Playwrite CZ', cursive",
  },

  // SHADOW tinted toward SECONDARY hue — deep forest green for botanical depth.
  // RGB approximates oklch(0.28 0.08 148) — a muted forest tone.
  shadowRgb: '35,65,45',

  onPrimaryOverride: 'white',

  // Dot grid in PRIMARY hue — rose-coral dots sprinkled on sage paper, 24px.
  backgroundPattern: {
    image: 'radial-gradient(circle, oklch(0.72 0.14 12 / 0.20) 1px, transparent 1px)',
    size: '24px 24px',
  },
};

const bloom = deriveCharacter(bloomSeed);

// ─── Babel ──────────────────────────────────────────────────────────────────
// A tribute to Google's Noto project — "No Tofu", the font that covers every
// script in Unicode so no language is left as an empty box. The name inverts
// the Tower of Babel myth: where the tower cursed humanity with fragmented
// language, Noto undoes the curse by giving every script a voice. Endangered
// languages, ancient scripts, living traditions — all typeset in harmony.
//
// Two distinctive colors:
//   Primary   — deep teal (hue 200, "international signal blue")
//   Secondary — warm amber (hue 50, "inclusive warmth")
// Grey palette tinted toward PRIMARY hue (200) for a cool editorial paper.
// Minimal chroma — Babel should feel universal, not loud. The character is
// the celebration; the palette stays out of the way.

const babelSeed: CharacterSeed = {
  name: 'babel',
  displayName: 'Babel',
  description: 'A tribute to Noto Sans — cool slate surfaces, deep teal primary, warm amber accent. Editorial restraint in service of every language the font covers.',
  personality: 'Named for the tower Noto undoes. Every script welcome, every glyph accounted for, no tofu. Quiet, universal, and a little reverent — this is the character for anything that wants to feel like it belongs to the whole world.',
  tags: ['editorial', 'international', 'inclusive', 'noto', 'universal', 'teal', 'slate'],

  // PRIMARY — deep teal, international signal blue
  primaryHue: 200,
  primaryChroma: 'Balanced',
  primaryStep: 7,

  // GREY palette tinted toward PRIMARY hue (200) — barely-there cool paper
  surfaceHue: 200,
  surfaceChromaPercent: 0.08,

  radius: { s: '2px', m: '4px', lg: '8px', xl: '9999px' },

  fonts: {
    display: "'Noto Sans', sans-serif",
    body: "'Inter', sans-serif",
    brand: "'Noto Sans', sans-serif",
  },

  // SHADOW tinted cool slate — matches the editorial restraint.
  // RGB approximates oklch(0.25 0.04 230) — muted ink-slate.
  shadowRgb: '30,50,70',
};

const babel = deriveCharacter(babelSeed);

// ─── Forest ──────────────────────────────────────────────────────
// User-built character from Character Builder. Generated from src/pages/workshop/CharacterBuilderPage.

const forest: Character = {
  manifest: {
    name: 'forest',
    displayName: 'Forest',
    version: '1.0.0',
    description: 'Custom character from Character Builder.',
    personality: 'A character you made. Tweak it, switch to it, own it.',
    author: 'Custom',
    license: 'MIT',
    tags: ['custom', 'user-built'],
    preview: {
      primaryColor:    'oklch(0.812 0.0617 234.4)',
      backgroundColor: 'oklch(0.962 0.0052 110.6)',
      textColor:       'oklch(0.266 0.0511 256.1)',
      radius:          '8px',
    },
  },
  variables: {
    '--color-primary-1':            'oklch(0.812 0.0617 234.4)',
    '--color-primary-2':            'oklch(0.770 0.0766 234.4)',
    '--color-primary-3':            'oklch(0.718 0.0831 234.4)',
    '--color-secondary-1':          'oklch(0.962 0.0352 149.1)',
    '--color-secondary-2':          'oklch(0.895 0.1080 149.1)',
    '--color-on-secondary-1':       'oklch(0.194 0.0227 234.4)',
    '--color-on-secondary-2':       'oklch(0.194 0.0227 234.4)',
    '--color-surface-2':            'oklch(0.982 0.0039 110.6)',
    '--color-bg':                   'oklch(0.962 0.0052 110.6)',
    '--color-surface-3':            'oklch(0.962 0.0052 110.6)',
    '--color-surface-4':            'oklch(0.895 0.0102 110.6)',
    '--color-border':               'oklch(0.895 0.0102 110.6)',
    '--color-surface-5':            'oklch(0.812 0.0089 110.6)',
    '--color-border-strong':        'oklch(0.812 0.0089 110.6)',
    '--color-surface-6':            'oklch(0.770 0.0068 110.6)',
    '--color-surface-7':            'oklch(0.718 0.0063 110.6)',
    '--color-on-surface-subtle-2':  'oklch(0.634 0.0070 110.6)',
    '--color-on-surface-subtle-1':  'oklch(0.534 0.0064 110.6)',
    '--color-on-primary':           'oklch(0.194 0.0227 234.4)',
  },
  darkVariables: {
    '--color-primary-1':            'oklch(0.812 0.0617 234.4)',
    '--color-primary-2':            'oklch(0.770 0.0766 234.4)',
    '--color-primary-3':            'oklch(0.718 0.0831 234.4)',
    '--color-secondary-1':          'oklch(0.962 0.0352 149.1)',
    '--color-secondary-2':          'oklch(0.895 0.1080 149.1)',
    '--color-on-secondary-1':       'oklch(0.194 0.0227 234.4)',
    '--color-on-secondary-2':       'oklch(0.194 0.0227 234.4)',
    '--color-bg':                   'oklch(0.194 0.0043 110.6)',
    '--color-surface-1':            'oklch(0.229 0.0051 110.6)',
    '--color-surface-2':            'oklch(0.263 0.0058 110.6)',
    '--color-surface-3':            'oklch(0.300 0.0066 110.6)',
    '--color-surface-4':            'oklch(0.338 0.0074 110.6)',
    '--color-border':               'oklch(0.338 0.0074 110.6)',
    '--color-surface-5':            'oklch(0.385 0.0066 110.6)',
    '--color-surface-6':            'oklch(0.432 0.0057 110.6)',
    '--color-border-strong':        'oklch(0.432 0.0057 110.6)',
    '--color-surface-7':            'oklch(0.534 0.0064 110.6)',
    '--color-on-surface-subtle-1':  'oklch(0.718 0.0063 110.6)',
    '--color-on-surface-subtle-2':  'oklch(0.634 0.0070 110.6)',
    '--color-on-primary':           'oklch(0.194 0.0227 234.4)',
  },
};

// ─── BC4Cloud ───────────────────────────────────────────────────────────────
// BusinessCom BC4Cloud marketing brand — cool blue primary, neutral greys, Manrope.
// Source: Figma "Call Centrum Design System" (file key ean7AOvOJA14ClZkwIGrf9)
// Tokens mapped per docs/bc4-web/brand-tokens.md — Kvalt DS token structure preserved,
// values swapped to BC4 brand palette. Secondary tokens deliberately use light shades
// of the same primary blue (per Jan's spec: monochromatic coherence).

const bc4: Character = {
  manifest: {
    name: 'bc4',
    displayName: 'BC4Cloud',
    version: '1.0.0',
    description: 'BusinessCom BC4Cloud brand — cool professional blue primary, Manrope typography, neutral greys, light secondary tones derived from primary',
    personality: 'Přehledná profesionalita. Tmavě modrá znamená stabilitu a spolehlivost. Světlé odstíny téže modré drží vizuální koherenci. Žádné křiklavé akcenty, žádná vata — jen čistý, čitelný kontaktní-centrum-grade UI.',
    author: 'Jan Gemerle',
    license: 'MIT',
    tags: ['saas', 'b2b', 'contact-center', 'blue', 'corporate', 'manrope'],
    preview: {
      primaryColor: '#3564EF',
      accentColor: '#143284',
      backgroundColor: '#F3F3F5',
      textColor: '#04123B',
      radius: '8px',
    },
  },
  variables: {
    // Surface
    '--color-bg': '#F3F3F5',
    '--color-surface-1': '#FFFFFF',
    '--color-surface-2': '#F9F9FA',
    '--color-surface-3': '#F3F3F5',
    '--color-surface-4': '#DEDFE4',
    '--color-surface-5': '#C3C6CF',
    '--color-surface-6': '#B4B9C4',
    '--color-surface-7': '#A3A9B6',
    '--color-on-surface': '#04123B',
    '--color-on-surface-subtle-1': '#69707E',
    '--color-on-surface-subtle-2': '#868EA0',
    '--color-surface-subtle-grid': 'rgba(105, 112, 126, 0.08)',
    '--color-inverted-surface': '#04123B',
    '--color-on-inverted-surface': '#FFFFFF',

    // Primary — modrá
    '--color-primary-1': '#3564EF',
    '--color-primary-2': '#143284',
    '--color-primary-3': '#04123B',
    '--color-on-primary': '#FFFFFF',

    // Secondary — světlé odstíny téže modré
    '--color-secondary-1': '#F2F3FE',
    '--color-secondary-2': '#DADEFC',
    '--color-on-secondary-1': '#0B215C',
    '--color-on-secondary-2': '#143284',

    // Success — zelená
    '--color-success-1': '#00A35A',
    '--color-success-2': '#008145',
    '--color-success-3': '#154127',
    '--color-on-success': '#FFFFFF',
    '--color-success-secondary-1': '#D7FDE2',
    '--color-success-secondary-2': '#93F4B5',
    '--color-on-success-secondary': '#002D14',

    // Warning — oranžová
    '--color-warning-1': '#E36B00',
    '--color-warning-2': '#B45400',
    '--color-warning-3': '#602900',
    '--color-on-warning': '#FFFFFF',
    '--color-warning-secondary-1': '#FFF1ED',
    '--color-warning-secondary-2': '#FFD7CC',
    '--color-on-warning-secondary': '#421A00',

    // Danger — červená
    '--color-danger-1': '#D23031',
    '--color-danger-2': '#9E2123',
    '--color-danger-3': '#310505',
    '--color-on-danger': '#FFFFFF',
    '--color-danger-secondary-1': '#FDF1F1',
    '--color-danger-secondary-2': '#F9D8D8',
    '--color-on-danger-secondary': '#4E0B0C',

    // Borders
    '--color-border': '#DEDFE4',
    '--color-border-strong': '#C3C6CF',

    // Hero a overlay
    '--color-hero-title': '#04123B',
    '--color-modal-overlay': 'rgba(4, 18, 59, 0.7)',

    // Typography — Manrope
    '--font-display': "'Manrope', 'Inter', system-ui, sans-serif",
    '--font-body': "'Manrope', 'Inter', system-ui, sans-serif",
    '--font-brand': "'Manrope', 'Inter', system-ui, sans-serif",
  },
};

// ─── Registry ───────────────────────────────────────────────────────────────

export const characterRegistry: Character[] = [
  kvaltDefault,
  taut,
  signal,
  ink,
  haze,
  cobalt,
  kavarna,
  bloom,
  babel,
  forest,
  bc4,
];

export function getCharacterByName(name: string): Character | undefined {
  return characterRegistry.find(c => c.manifest.name === name);
}

export const DEFAULT_CHARACTER = kvaltDefault;
