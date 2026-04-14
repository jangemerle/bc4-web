/**
 * LocaleProvider — active locale for typography rules + screen readers.
 *
 * Wraps the app once (above CharacterProvider). Updates document.documentElement.lang
 * so hyphenation, spellcheck, and AT pronunciation align with the locale.
 *
 * Kvalt ships Czech-first, so `cs` is the default.
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Locale } from '../lib/typo';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

interface LocaleProviderProps {
  children: ReactNode;
  defaultLocale?: Locale;
}

export function LocaleProvider({ children, defaultLocale = 'cs' }: LocaleProviderProps) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

/** Returns the active locale. Defaults to `cs` if called outside a provider. */
export function useLocale(): Locale {
  const ctx = useContext(LocaleContext);
  return ctx?.locale ?? 'cs';
}

/** Returns the locale setter. Throws if called outside a provider. */
export function useSetLocale(): (l: Locale) => void {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('useSetLocale must be used inside a LocaleProvider');
  }
  return ctx.setLocale;
}
