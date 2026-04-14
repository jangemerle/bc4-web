/**
 * ExampleBlock — live interactive component example with label
 *
 * Label + description run through `fixTypo`. Pass `typo={false}` to bypass
 * (e.g. when the label is a raw token name or code snippet).
 */

import { cn } from '../lib/cn';
import { fixTypo } from '../lib/typo';
import { useLocale } from '../contexts/LocaleProvider';

interface ExampleBlockProps {
  label?: string;
  description?: string;
  children: React.ReactNode;
  bg?: 'surface' | 'bg' | 'inverted';
  centered?: boolean;
  /** Disable typography fix (for raw strings: token names, code) */
  typo?: boolean;
}

const bgMap = {
  surface: 'var(--color-surface-1)',
  bg: 'var(--color-bg)',
  inverted: 'var(--color-inverted-surface)',
} as const;

export function ExampleBlock({ label, description, children, bg = 'surface', centered = false, typo = true }: ExampleBlockProps) {
  const locale = useLocale();
  const fix = (s: string) => (typo ? fixTypo(s, locale) : s);

  return (
    <div>
      {label && (
        <p className="font-sans text-sm font-semibold mb-3" style={{ color: 'var(--color-on-surface)' }}>
          {fix(label)}
        </p>
      )}
      {description && (
        <p className="font-sans text-sm mb-3" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
          {fix(description)}
        </p>
      )}
      <div
        className={cn(
          'rounded-lg border px-10 py-10',
          centered && 'flex items-center justify-center',
        )}
        style={{
          backgroundColor: bgMap[bg],
          borderColor: 'var(--color-border)',
          ...(bg === 'inverted' ? { color: 'var(--color-on-inverted-surface)' } : {}),
        }}
      >
        {children}
      </div>
    </div>
  );
}
