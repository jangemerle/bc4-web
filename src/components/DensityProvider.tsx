/* eslint-disable react-refresh/only-export-components */
/**
 * DensityProvider — locally override --spaciness for a region.
 *
 * CSS custom properties compute at definition site, not use site.
 * So overriding just --spaciness on a child doesn't cause --space-*
 * tokens (defined on :root) to recalculate. We must redefine them all.
 *
 * Usage:
 *   <DensityProvider spaciness={0.85}>
 *     <DataTable ... />   ← compact spacing
 *   </DensityProvider>
 */

interface DensityProviderProps {
  /** Spaciness value — 0.75–1.25 range recommended */
  spaciness: number;
  children: React.ReactNode;
  className?: string;
}

/** Snap to 4px grid */
const snap = (base: number, s: number) => Math.round((base * s) / 4) * 4;

/** Compute all space + layout tokens for a given spaciness value */
export function spacinessVars(s: number): React.CSSProperties {
  return {
    '--spaciness': s,
    '--space-xs':  `${snap(4, s)}px`,
    '--space-sm':  `${snap(8, s)}px`,
    '--space-md':  `${snap(16, s)}px`,
    '--space-lg':  `${snap(24, s)}px`,
    '--space-xl':  `${snap(32, s)}px`,
    '--space-2xl': `${snap(48, s)}px`,
    '--space-3xl': `${snap(64, s)}px`,
    '--space-4xl': `${snap(96, s)}px`,
    '--layout-gutter':      `${snap(16, s)}px`,
    '--layout-margin':      `${snap(24, s)}px`,
    '--layout-gap-tight':   `${snap(12, s)}px`,
    '--layout-gap-default': `${snap(24, s)}px`,
    '--layout-gap-section': `${snap(48, s)}px`,
    '--layout-gap-page':    `${snap(96, s)}px`,
  } as React.CSSProperties;
}

export function DensityProvider({ spaciness, children, className }: DensityProviderProps) {
  return (
    <div className={className} style={spacinessVars(spaciness)}>
      {children}
    </div>
  );
}
