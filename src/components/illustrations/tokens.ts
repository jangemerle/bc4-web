/**
 * Illustration palette tokens — CSS variable references.
 * Use these instead of hardcoded hex colors so illustrations
 * respond to character theme changes and dark mode.
 */

export const ill = {
  // Surfaces
  bg:           'var(--color-surface-2)',       // outer zone background (was #ECEEF8, #EDF0F7, #F0F2FA)
  card:         'var(--color-surface-1)',       // inner floating card (was #FFFFFF)
  subtle:       'var(--color-surface-3)',       // light gray fills (was #F3F4F6, #F9FAFB, #FAFAFA)
  muted:        'var(--color-surface-4)',       // inactive/disabled fills (was #E5E7EB)

  // Borders & dividers
  border:       'var(--color-border)',          // (was #D1D5DB, #E5E7EB)

  // Text
  text:         'var(--color-on-surface)',      // strong text (was #374151, #1F2937, #111827)
  textMid:      'var(--color-on-surface-subtle-1)', // medium text (was #6B7280)
  textMuted:    'var(--color-on-surface-subtle-2)', // placeholder (was #9CA3AF)

  // Primary accent — character-aware, changes with theme
  primary:      'var(--color-primary-1)',       // accent (was #7DDB85, GREEN)
  onPrimary:    'var(--color-on-primary)',      // text on primary (was dark #374151)
  primaryLight: 'color-mix(in srgb, var(--color-primary-1) 14%, var(--color-surface-1))', // tinted bg (was #F0FDF4, #DCFCE7)
} as const;
