/**
 * fixTypo — applies locale-aware typography rules to a string.
 *
 * Wraps `typopo` so the engine is swappable. Adds a tiny pre-pass for Czech
 * currency (Kč) which typopo doesn't bind as a unit by default.
 *
 * The transform is idempotent: running it twice on the same input yields the
 * same output. Safe to call on already-fixed strings.
 *
 * Memoized via a Map keyed on `${locale}\x00${text}` — typical Kvalt pages
 * render the same titles on every keystroke, so caching pays off.
 */

import { fixTypos, type TypopoLocale } from 'typopo';

export type Locale = 'cs' | 'en';

// typopo uses region-tagged codes; Kvalt exposes short codes.
const TYPOPO_LOCALE: Record<Locale, TypopoLocale> = {
  cs: 'cs',
  en: 'en-us',
};

// Czech currency pre-pass — typopo doesn't bind digit + Kč as a unit.
// Matches `<digit> Kč` and joins with NBSP. No `\b` — JS word boundaries
// are ASCII-only and `č` is non-ASCII, so `\b` would never match.
const CZK_UNIT = /(\d)\s+(Kč)(?![\p{L}])/gu;

const cache = new Map<string, string>();
const MAX_CACHE = 500;

export function fixTypo(text: string, locale: Locale = 'cs'): string {
  if (!text) return text;

  const key = `${locale}\x00${text}`;
  const hit = cache.get(key);
  if (hit !== undefined) return hit;

  let out = fixTypos(text, TYPOPO_LOCALE[locale]);
  if (locale === 'cs') out = out.replace(CZK_UNIT, '$1\u00A0$2');

  if (cache.size >= MAX_CACHE) cache.clear();
  cache.set(key, out);
  return out;
}

/** Exposed for tests and manual cache busting (e.g. in HMR). */
export function clearTypoCache(): void {
  cache.clear();
}
