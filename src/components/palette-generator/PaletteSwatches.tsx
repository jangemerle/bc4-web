/**
 * PaletteSwatches — 12-step swatch strip with live oklch() colors.
 */

import { oklchToCss, oklchToHex } from '../../lib/oklch';
import type { PaletteStep } from './types';

interface PaletteSwatchesProps {
  steps: PaletteStep[];
}

export function PaletteSwatches({ steps }: PaletteSwatchesProps) {
  return (
    <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
      {steps.map((step) => {
        const bg = oklchToCss(step.l, step.c, step.h);
        const hex = oklchToHex(step.l, step.c, step.h);
        const textLight = step.l > 0.55;
        return (
          <div key={step.key} className="flex flex-col items-center gap-1">
            <div
              className="w-full aspect-[3/4] flex items-end justify-center pb-2"
              style={{
                backgroundColor: bg,
                borderRadius: 'var(--radius-m)',
                color: textLight ? 'oklch(0.2 0 0)' : 'oklch(0.95 0 0)',
                border: step.l > 0.95 ? '1px solid var(--color-border)' : 'none',
              }}
            >
              <span className="font-mono text-[9px] opacity-80">{hex}</span>
            </div>
            <span
              className="font-mono text-[10px] font-semibold"
              style={{ color: 'var(--color-on-surface)' }}
            >
              {step.key}
            </span>
            <span
              className="font-mono text-[8px] leading-tight text-center"
              style={{ color: 'var(--color-on-surface-subtle-2)' }}
            >
              L{step.l.toFixed(2)} C{step.c.toFixed(2)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
