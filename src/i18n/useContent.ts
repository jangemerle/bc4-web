/**
 * useContent — typed hook pro načtení marketingového obsahu.
 *
 * 📍 Cílová lokace: src/i18n/useContent.ts
 *
 * 🔧 Před přesunem nainstalovat:
 *    (závisí na i18n.ts — install jeho dependencies)
 *
 * Použití místo `useTranslation`:
 *
 *   const home = useContent('home');
 *   <h1>{home.hero.headline}</h1>
 *
 * Tohle je jednodušší než react-i18next přístup s `t()` funkcí —
 * vrací rovnou typovaný TS objekt z aktuálního locale, plné autocomplete.
 */

import { useTranslation } from 'react-i18next';
import type { LocaleContent } from '@/content/types';

type ContentNamespace = keyof LocaleContent;

export function useContent<K extends ContentNamespace>(namespace: K): LocaleContent[K] {
  const { t } = useTranslation(namespace);
  // returnObjects: true v i18n configu → t('') vrátí celý objekt
  return t('', { returnObjects: true }) as unknown as LocaleContent[K];
}
