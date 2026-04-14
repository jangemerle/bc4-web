/**
 * Section — content section with generous spacing and Borna heading
 *
 * Title + description run through `fixTypo` for Czech single-letter binding.
 * Pass `typo={false}` to bypass (e.g. for code snippets or token names).
 */

import { cn } from '../lib/cn';
import { fixTypo } from '../lib/typo';
import { useLocale } from '../contexts/LocaleProvider';

interface SectionProps {
  /** Section heading — Borna Bold 42px for major, SemiBold 28px for minor */
  title?: string;
  /** Optional description below title */
  description?: string;
  children: React.ReactNode;
  /** "major" = 42px heading + 80px top margin, "minor" = 28px + 40px */
  level?: 'major' | 'minor';
  /** Disable typography fix (for raw strings: token names, code) */
  typo?: boolean;
}

export function Section({ title, description, children, level = 'major', typo = true }: SectionProps) {
  const isMajor = level === 'major';
  const locale = useLocale();
  const fix = (s: string) => (typo ? fixTypo(s, locale) : s);

  return (
    <section className={cn(isMajor ? 'mt-20' : 'mt-10')}>
      {title && (
        <h2
          className={cn(
            'font-display',
            isMajor ? 'font-bold text-headline-2xl mb-5' : 'font-semibold text-headline-l mb-5',
          )}
          style={{ color: 'var(--color-on-surface)' }}
        >
          {fix(title)}
        </h2>
      )}
      {description && (
        <p className="font-sans text-base mb-5" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
          {fix(description)}
        </p>
      )}
      {children}
    </section>
  );
}
