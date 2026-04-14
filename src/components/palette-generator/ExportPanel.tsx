/**
 * ExportPanel — copyable code block with palette values.
 */

import { useState, useCallback } from 'react';
import { oklchToCss } from '../../lib/oklch';
import type { PaletteStep } from './types';

interface ExportPanelProps {
  steps: PaletteStep[];
  name?: string;
}

type ExportFormat = 'ts' | 'css';

export function ExportPanel({ steps, name = 'palette' }: ExportPanelProps) {
  const [format, setFormat] = useState<ExportFormat>('ts');
  const [copied, setCopied] = useState(false);

  const tsOutput = `export const ${name} = {\n${steps
    .map((s) => `  ${s.key}: '${oklchToCss(s.l, s.c, s.h)}',`)
    .join('\n')}\n};`;

  const cssOutput = steps
    .map((s) => `  --${name}-${s.key}: ${oklchToCss(s.l, s.c, s.h)};`)
    .join('\n');

  const output = format === 'ts' ? tsOutput : cssOutput;

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [output]);

  return (
    <div>
      {/* Format toggle */}
      <div className="flex gap-1 mb-3">
        {(['ts', 'css'] as const).map((f) => (
          <button
            key={f}
            className="font-mono text-xs px-3 py-1.5 cursor-pointer"
            style={{
              background: format === f ? 'var(--color-on-surface)' : 'var(--color-surface-3)',
              color: format === f ? 'var(--color-surface-1)' : 'var(--color-on-surface-subtle-1)',
              borderRadius: 'var(--radius-m)',
              border: 'none',
            }}
            onClick={() => setFormat(f)}
          >
            {f === 'ts' ? 'TypeScript' : 'CSS Variables'}
          </button>
        ))}
      </div>

      {/* Code block */}
      <div className="relative">
        <pre
          className="font-mono text-xs p-4 overflow-x-auto"
          style={{
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-m)',
            color: 'var(--color-on-surface)',
            lineHeight: 1.6,
          }}
        >
          {output}
        </pre>

        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 font-mono text-[10px] px-2 py-1 cursor-pointer"
          style={{
            background: copied ? 'var(--color-success-1)' : 'var(--color-surface-4)',
            color: copied ? 'var(--color-on-success)' : 'var(--color-on-surface-subtle-1)',
            borderRadius: 'var(--radius-s)',
            border: 'none',
          }}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
