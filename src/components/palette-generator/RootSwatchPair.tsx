/**
 * RootSwatchPair — the "YOUR PICK → SHADE XXX" pair, rendered as a
 * click-to-activate card under a big headline.
 *
 * Used in CharacterBuilderPage to let the user route the image eyedropper
 * between three palettes (Primary / Secondary / Base) in one view.
 *
 * Styling matches ColorInput's conversion view: 64×64 swatches, radius-l,
 * shadow-medium-1, arrow divider, mono labels underneath. The whole card is
 * a button — clicking it sets the active slot.
 */

import type { OklchColor } from '../../lib/oklch';
import { oklchToCss } from '../../lib/oklch';
import type { PaletteStep } from './types';

interface RootSwatchPairProps {
  /** Big display name above the pair — "Primary" / "Secondary" / "Base". */
  label: string;
  /** The raw picked color, or null if nothing has been picked yet. */
  rawColor: OklchColor | null;
  /** The current palette steps — used to compute the closest shade to the pick. */
  steps: PaletteStep[];
  /** Whether this slot is currently receiving eyedropper picks. */
  active: boolean;
  /** Click handler — parent uses this to set the active slot. */
  onClick: () => void;
}

export function RootSwatchPair({
  label,
  rawColor,
  steps,
  active,
  onClick,
}: RootSwatchPairProps) {
  // Find the closest palette step by lightness (matches ColorInput logic).
  const closestStep =
    rawColor && steps.length > 0
      ? steps.reduce(
          (best, s) =>
            Math.abs(s.l - rawColor.l) < Math.abs(best.l - rawColor.l) ? s : best,
          steps[0],
        )
      : null;

  const rawCss = rawColor ? oklchToCss(rawColor.l, rawColor.c, rawColor.h) : null;
  const shadeCss = closestStep
    ? oklchToCss(closestStep.l, closestStep.c, closestStep.h)
    : null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left cursor-pointer bg-transparent border-none p-0 outline-none"
      style={{ outline: 'none' }}
    >
      {/* Big headline */}
      <h2
        className="font-display font-bold text-headline-l mb-6"
        style={{
          color: active ? 'var(--color-primary-1)' : 'var(--color-on-surface)',
          transition: 'color 160ms ease',
        }}
      >
        {label}
      </h2>

      {/* Pair container with active highlight */}
      <div
        className="rounded-lg p-4 transition-colors"
        style={{
          border: active
            ? '2px solid var(--color-primary-1)'
            : '2px solid transparent',
          backgroundColor: active ? 'var(--color-surface-2)' : 'transparent',
        }}
      >
        <div className="flex items-end gap-3">
          {/* YOUR PICK swatch */}
          <div className="flex flex-col items-center gap-1.5">
            <div
              style={{
                width: 64,
                height: 64,
                backgroundColor: rawCss ?? 'var(--color-surface-3)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: rawCss ? 'var(--shadow-medium-1)' : 'none',
                border: rawCss ? 'none' : '1px dashed var(--color-border-strong)',
              }}
            />
            <span
              className="font-mono text-[9px] uppercase tracking-wide"
              style={{ color: 'var(--color-on-surface-subtle-2)' }}
            >
              Your pick
            </span>
          </div>

          {/* Arrow */}
          <div
            className="flex flex-col items-center gap-1 pb-5"
            style={{ color: 'var(--color-on-surface-subtle-2)' }}
          >
            <span className="font-mono text-[10px]">→</span>
          </div>

          {/* SHADE XXX swatch */}
          <div className="flex flex-col items-center gap-1.5">
            <div
              style={{
                width: 64,
                height: 64,
                backgroundColor: shadeCss ?? 'var(--color-surface-3)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: shadeCss ? 'var(--shadow-medium-1)' : 'none',
                outline: active && shadeCss ? '2px solid var(--color-primary-1)' : 'none',
                outlineOffset: 2,
                border: shadeCss ? 'none' : '1px dashed var(--color-border-strong)',
              }}
            />
            <span
              className="font-mono text-[9px] uppercase tracking-wide"
              style={{
                color: active
                  ? 'var(--color-primary-1)'
                  : 'var(--color-on-surface-subtle-2)',
              }}
            >
              {closestStep ? `Shade ${closestStep.key}` : 'Empty'}
            </span>
          </div>
        </div>

        {/* Active indicator label */}
        {active && (
          <div
            className="font-mono text-[10px] uppercase tracking-widest mt-3"
            style={{ color: 'var(--color-primary-1)' }}
          >
            · Active — next pick lands here
          </div>
        )}
      </div>
    </button>
  );
}
