/**
 * PageHero — Borna Bold hero title + optional 2-column subtitle + hero image
 *
 * Title/subtitle/description run through `fixTypo` so Czech single-letter
 * prepositions bind to the next word via NBSP. Pass `typo={false}` to bypass
 * (e.g. when the title is a raw token name or code fragment).
 */

import { cn } from '../lib/cn';
import { fixTypo } from '../lib/typo';
import { useLocale } from '../contexts/LocaleProvider';

interface PageHeroProps {
  /** Hero title — displayed in Borna Bold, responsive */
  title: string;
  /** Left subtitle column — Borna SemiBold 24px */
  subtitle?: string;
  /** Right description column — Inter Medium 18px */
  description?: string;
  /** Optional full-width hero image below the subtitle row */
  heroImage?: React.ReactNode;
  /** Optional large visual element */
  visual?: React.ReactNode;
  /** Disable typography fix (for raw token names, code fragments) */
  typo?: boolean;
}

export function PageHero({ title, subtitle, description, heroImage, visual, typo = true }: PageHeroProps) {
  const locale = useLocale();
  const fix = (s: string) => (typo ? fixTypo(s, locale) : s);

  return (
    <div className="mb-20">
      {/* Hero title */}
      <h1
        className="font-display font-bold leading-[0.95] mb-10"
        style={{
          fontSize: 'clamp(64px, 8vw, 120px)',
          color: 'var(--color-on-surface)',
        }}
      >
        {fix(title)}
      </h1>

      {/* Two-column subtitle */}
      {(subtitle || description) && (
        <div className={cn('grid gap-10', subtitle && description ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1')}>
          {subtitle && (
            <p className="font-display font-semibold text-[24px] leading-[1.3] whitespace-pre-line" style={{ color: 'var(--color-on-surface)' }}>
              {fix(subtitle)}
            </p>
          )}
          {description && (
            <p className="font-sans font-medium text-lg whitespace-pre-line" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
              {fix(description)}
            </p>
          )}
        </div>
      )}

      {/* Hero image */}
      {heroImage && (
        <div className="mt-10 rounded-[30px] overflow-hidden">
          {heroImage}
        </div>
      )}

      {/* Visual element */}
      {visual && (
        <div className="mt-10">
          {visual}
        </div>
      )}
    </div>
  );
}
