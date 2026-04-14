/**
 * Design System — Color Tokens (OKLCH)
 *
 * Color model: OKLCH (Oklab Lightness–Chroma–Hue)
 *   L = perceptual lightness (0–1)
 *   C = chroma / colorfulness (0–~0.37 sRGB)
 *   H = hue angle (0–360°)
 *
 * Every palette value is a CSS oklch() string. Use directly in
 * inline styles, canvas fillStyle, or any CSS context.
 *
 * For Tailwind classes, use the semantic token names:
 *   bg-color-surface-1, text-color-on-surface, border-color-border, etc.
 */

// ─── Raw Palette ─────────────────────────────────────────────────────────────
//
// Six palettes × 12 lightness steps each.
// Lightness descends from ~0.98 (step 50) to ~0.19 (step 900).
// Chroma peaks at mid-tones and tapers at both extremes.
// Hue is consistent within each palette (±3° from HSLuv source).

export const palette = {
  primary: {
    //                 L      C       H       ── green ──
    50:  'oklch(0.982 0.0141 148.8)',
    100: 'oklch(0.962 0.0435 147.3)',
    200: 'oklch(0.895 0.0948 146.9)',
    300: 'oklch(0.812 0.1494 145.9)',
    400: 'oklch(0.770 0.1412 146.0)',
    500: 'oklch(0.718 0.1325 145.9)',
    600: 'oklch(0.634 0.1165 145.9)',
    700: 'oklch(0.534 0.0985 146.0)',
    750: 'oklch(0.432 0.0796 146.1)',
    800: 'oklch(0.338 0.0629 146.1)',
    850: 'oklch(0.263 0.0484 145.9)',
    900: 'oklch(0.194 0.0354 146.9)',
  },
  secondary: {
    //                 L      C       H       ── blue ──
    50:  'oklch(0.982 0.0057 264.5)',
    100: 'oklch(0.966 0.0115 264.5)',
    200: 'oklch(0.906 0.0320 266.2)',
    300: 'oklch(0.827 0.0609 263.3)',
    400: 'oklch(0.785 0.0767 261.5)',
    500: 'oklch(0.733 0.0971 259.3)',
    600: 'oklch(0.647 0.1233 255.7)',
    700: 'oklch(0.544 0.1036 255.8)',
    750: 'oklch(0.441 0.0832 255.5)',
    800: 'oklch(0.345 0.0660 255.9)',
    850: 'oklch(0.266 0.0511 256.1)',
    900: 'oklch(0.198 0.0374 254.4)',
  },
  grey: {
    //                 L      C       H       ── blue neutral (Base curve) ──
    50:  'oklch(0.982 0.0018 255.7)',
    100: 'oklch(0.962 0.0037 255.7)',
    200: 'oklch(0.895 0.0104 255.7)',
    300: 'oklch(0.812 0.0096 255.7)',
    400: 'oklch(0.770 0.0095 255.7)',
    500: 'oklch(0.718 0.0119 255.7)',
    600: 'oklch(0.634 0.0200 255.7)',
    700: 'oklch(0.534 0.0198 255.7)',
    750: 'oklch(0.432 0.0175 255.7)',
    800: 'oklch(0.338 0.0229 255.7)',
    850: 'oklch(0.263 0.0179 255.7)',
    900: 'oklch(0.194 0.0133 255.7)',
  },
  success: {
    //                 L      C       H       ── green (saturated) ──
    50:  'oklch(0.980 0.0262 156.0)',
    100: 'oklch(0.960 0.0532 154.4)',
    200: 'oklch(0.891 0.1275 154.5)',
    300: 'oklch(0.808 0.1611 154.4)',
    400: 'oklch(0.764 0.1722 154.1)',
    500: 'oklch(0.714 0.1607 154.2)',
    600: 'oklch(0.628 0.1581 154.1)',
    700: 'oklch(0.529 0.1343 153.7)',
    750: 'oklch(0.426 0.1073 154.1)',
    800: 'oklch(0.337 0.0669 154.4)',
    850: 'oklch(0.261 0.0653 154.4)',
    900: 'oklch(0.195 0.0397 152.8)',
  },
  warning: {
    //                 L      C       H       ── orange ──
    50:  'oklch(0.984 0.0080 36.6)',
    100: 'oklch(0.968 0.0161 36.5)',
    200: 'oklch(0.910 0.0475 35.9)',
    300: 'oklch(0.837 0.0935 39.5)',
    400: 'oklch(0.796 0.1227 41.6)',
    500: 'oklch(0.748 0.1636 46.6)',
    600: 'oklch(0.661 0.1743 50.2)',
    700: 'oklch(0.557 0.1461 50.5)',
    750: 'oklch(0.450 0.1185 50.3)',
    800: 'oklch(0.353 0.0933 50.0)',
    850: 'oklch(0.273 0.0723 50.0)',
    900: 'oklch(0.204 0.0531 50.9)',
  },
  danger: {
    //                 L      C       H       ── red ──
    50:  'oklch(0.984 0.0064 17.3)',
    100: 'oklch(0.968 0.0130 17.4)',
    200: 'oklch(0.910 0.0368 17.8)',
    300: 'oklch(0.836 0.0722 18.7)',
    400: 'oklch(0.796 0.0941 19.4)',
    500: 'oklch(0.747 0.1231 20.4)',
    600: 'oklch(0.668 0.1806 23.0)',
    700: 'oklch(0.567 0.1983 26.0)',
    750: 'oklch(0.459 0.1610 26.0)',
    800: 'oklch(0.360 0.1260 25.8)',
    850: 'oklch(0.278 0.0977 25.7)',
    900: 'oklch(0.206 0.0713 26.1)',
  },
  white: 'oklch(1 0 0)',
} as const;

// ─── Semantic Tokens — Light Theme ────────────────────────────────────────────

export const lightTokens = {
  surface: {
    bg:                 palette.grey[100],
    surface1:           palette.white,
    surface2:           palette.grey[50],
    surface3:           palette.grey[100],
    surface4:           palette.grey[200],
    surface5:           palette.grey[300],
    surface6:           palette.grey[400],
    surface7:           palette.grey[500],
    onSurface:          palette.secondary[850],
    onSurfaceSubtle1:   palette.grey[700],
    onSurfaceSubtle2:   palette.grey[600],
    invertedSurface:    palette.secondary[850],
    onInvertedSurface:  palette.white,
  },
  primary: {
    primary1:   palette.primary[300],
    primary2:   palette.primary[400],
    primary3:   palette.primary[500],
    onPrimary:  palette.secondary[850],
  },
  secondary: {
    secondary1:   palette.secondary[100],
    secondary2:   palette.secondary[200],
    onSecondary1: palette.secondary[700],
    onSecondary2: palette.secondary[750],
  },
  success: {
    success1:          palette.success[600],
    success2:          palette.success[700],
    success3:          palette.success[800],
    onSuccess:         palette.white,
    secondary1:        palette.success[100],
    secondary2:        palette.success[200],
    onSecondarySuccess: palette.success[850],
  },
  warning: {
    warning1:          palette.warning[600],
    warning2:          palette.warning[700],
    warning3:          palette.warning[800],
    onWarning:         palette.white,
    secondary1:        palette.warning[100],
    secondary2:        palette.warning[200],
    onSecondaryWarning: palette.warning[850],
  },
  danger: {
    danger1:          palette.danger[700],
    danger2:          palette.danger[750],
    danger3:          palette.danger[900],
    onDanger:         palette.white,
    secondary1:       palette.danger[100],
    secondary2:       palette.danger[200],
    onSecondaryDanger: palette.danger[850],
  },
} as const;

// ─── Semantic Tokens — Dark Theme ─────────────────────────────────────────────

export const darkTokens = {
  surface: {
    bg:                 palette.grey[900],
    surface1:           palette.grey[850],
    surface2:           palette.grey[800],
    surface3:           palette.grey[800],
    surface4:           palette.grey[750],
    surface5:           palette.grey[750],
    surface6:           palette.grey[700],
    surface7:           palette.grey[500],
    onSurface:          palette.white,
    onSurfaceSubtle1:   palette.grey[500],
    onSurfaceSubtle2:   palette.grey[600],
    invertedSurface:    palette.white,
    onInvertedSurface:  palette.secondary[850],
  },
  primary: {
    primary1:   palette.primary[300],
    primary2:   palette.primary[400],
    primary3:   palette.primary[500],
    onPrimary:  palette.secondary[850],
  },
  secondary: {
    secondary1:   palette.secondary[800],
    secondary2:   palette.secondary[750],
    onSecondary1: palette.secondary[200],
    onSecondary2: palette.secondary[100],
  },
  success: {
    success1:           palette.success[500],
    success2:           palette.success[300],
    success3:           palette.success[100],
    onSuccess:          palette.success[850],
    secondary1:         palette.success[800],
    secondary2:         palette.success[750],
    onSecondarySuccess: palette.success[100],
  },
  warning: {
    warning1:           palette.warning[500],
    warning2:           palette.warning[300],
    warning3:           palette.warning[100],
    onWarning:          palette.warning[850],
    secondary1:         palette.warning[800],
    secondary2:         palette.warning[750],
    onSecondaryWarning: palette.warning[100],
  },
  danger: {
    danger1:           palette.danger[600],
    danger2:           palette.danger[400],
    danger3:           palette.danger[200],
    onDanger:          palette.danger[850],
    secondary1:        palette.danger[800],
    secondary2:        palette.danger[750],
    onSecondaryDanger: palette.danger[200],
  },
} as const;
