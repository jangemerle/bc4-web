import { useSEO } from '@/marketing/seo';
import { pricing } from '@/content/cs/pricing';
import { Container } from '@/marketing/primitives/Container';
import { EyebrowLabel } from '@/marketing/primitives/EyebrowLabel';
import { SectionHeading } from '@/marketing/primitives/SectionHeading';

export default function PricingPage() {
  useSEO(pricing.seo, '/cenik');
  return (
    <Container width="default" className="py-20">
      <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3 mb-12">
        {pricing.hero.eyebrow && <EyebrowLabel>{pricing.hero.eyebrow}</EyebrowLabel>}
        <SectionHeading size="2xl" center subheadline={pricing.hero.subheadline}>
          {pricing.hero.headline}
        </SectionHeading>
      </div>
      <p className="text-center text-sm text-[var(--color-on-surface-subtle-2)] mt-12">
        Plná tabulka cen, add-ons a FAQ se vykreslí v dalším sprintu. Content připravený v <code>src/content/cs/pricing.ts</code>.
      </p>
    </Container>
  );
}
