import { useSEO } from '@/marketing/seo';
import { productCalling } from '@/content/cs/product-calling';
import { Container } from '@/marketing/primitives/Container';

export default function ProductCallingPage() {
  useSEO(productCalling.seo, '/produkt/volani');
  return (
    <Container width="default" className="py-20">
      <p className="text-sm font-mono uppercase tracking-wider text-[var(--color-on-surface-subtle-2)] mb-3">Produkt — Volání</p>
      <h1 className="font-display text-4xl font-extrabold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
        {productCalling.hero.headline}
      </h1>
      <p className="text-lg text-[var(--color-on-surface-subtle-1)] max-w-2xl">
        {productCalling.hero.subheadline}
      </p>
      <p className="mt-8 text-sm text-[var(--color-on-surface-subtle-2)]">
        Plný layout v dalším sprintu. Content připravený v <code>src/content/cs/product-calling.ts</code>.
      </p>
    </Container>
  );
}
