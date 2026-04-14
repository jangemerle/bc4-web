/**
 * i18n configuration.
 *
 * 📍 Cílová lokace: src/i18n/config.ts
 *
 * 🔧 Před přesunem nainstalovat:
 *    npm install i18next react-i18next i18next-browser-languagedetector
 *
 * Strategie:
 *   - Locale je v URL prefix ('/' = CS bez prefixu, '/en' = EN)
 *   - i18n loaduje content přes content modules (TS objekty), ne JSON files
 *   - typed `t()` přes wrapper hook `useT()` (viz scaffolds/useT.ts)
 *   - SSG-friendly: žádný backend loading, content je v build-time bundle
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { common as csCommon } from '@/content/cs/common';
import { home as csHome } from '@/content/cs/home';
import { productContactCenter as csProductCC } from '@/content/cs/product-cc';
import { productCalling as csProductCalling } from '@/content/cs/product-calling';
import { pricing as csPricing } from '@/content/cs/pricing';
import { contact as csContact } from '@/content/cs/contact';

import type { Locale } from '@/content/types';

// ─── Locale resources ────────────────────────────────────────────────────────

const resources = {
  cs: {
    common: csCommon as unknown as Record<string, unknown>,
    home: csHome as unknown as Record<string, unknown>,
    productContactCenter: csProductCC as unknown as Record<string, unknown>,
    productCalling: csProductCalling as unknown as Record<string, unknown>,
    pricing: csPricing as unknown as Record<string, unknown>,
    contact: csContact as unknown as Record<string, unknown>,
  },
  // EN bude přidáno až bude content hotový — viz src/content/en/README.md
};

// ─── Init ────────────────────────────────────────────────────────────────────

void i18n.use(initReactI18next).init({
  resources,
  lng: 'cs',
  fallbackLng: 'cs',
  interpolation: { escapeValue: false }, // React už escapuje
  returnObjects: true, // umožní vrácení celých TS objektů, ne jen stringů
  // Hlasité errory v dev, tichý fallback v prod
  saveMissing: import.meta.env.DEV,
  missingKeyHandler: (lngs, ns, key) => {
    if (import.meta.env.DEV) {
      console.warn(`[i18n] Missing key: ${ns}:${key} for ${lngs.join(',')}`);
    }
  },
});

export default i18n;

// ─── Locale switching helper ─────────────────────────────────────────────────

export async function setLocale(locale: Locale): Promise<void> {
  await i18n.changeLanguage(locale);
  document.documentElement.lang = locale;
}

export function getCurrentLocale(): Locale {
  return (i18n.language.split('-')[0] as Locale) ?? 'cs';
}
