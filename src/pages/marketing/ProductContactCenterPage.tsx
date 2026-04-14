import { useSEO } from '@/marketing/seo';
import { productContactCenter } from '@/content/cs/product-cc';
import { Container } from '@/marketing/primitives/Container';

/**
 * Stub stránka — kompletní layout dodáme v dalším kroku.
 * Content už je v src/content/cs/product-cc.ts připravený.
 */
export default function ProductContactCenterPage() {
  useSEO(productContactCenter.seo, '/produkt/kontaktni-centrum');
  return (
    <Container width="default" className="py-20">
      <p className="text-sm font-mono uppercase tracking-wider text-[var(--color-on-surface-subtle-2)] mb-3">
        Produkt — Kontaktní centrum
      </p>
      <h1
        className="font-display text-4xl font-extrabold mb-4"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {productContactCenter.hero.headline}
      </h1>
      <p className="text-lg text-[var(--color-on-surface-subtle-1)] max-w-2xl">
        {productContactCenter.hero.subheadline}
      </p>
      <p className="mt-8 text-sm text-[var(--color-on-surface-subtle-2)]">
        Plný layout této stránky se postaví v dalším sprintu — content už je připravený v <code>src/content/cs/product-cc.ts</code>.
      </p>
    </Container>
  );
}
