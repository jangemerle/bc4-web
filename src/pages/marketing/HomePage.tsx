import { useEffect } from 'react';
import { home } from '@/content/cs/home';
import { useSEO, organizationSchema, faqPageSchema } from '@/marketing/seo';
import { Hero } from '@/marketing/sections/Hero';
import { LogoCloud } from '@/marketing/sections/LogoCloud';
import { BenefitTriplet } from '@/marketing/sections/BenefitTriplet';
import { ProductVideo } from '@/marketing/sections/ProductVideo';
import { FeatureShowcase } from '@/marketing/sections/FeatureShowcase';
import { HowItWorks } from '@/marketing/sections/HowItWorks';
import { SegmentCards } from '@/marketing/sections/SegmentCards';
import { WhyUs } from '@/marketing/sections/WhyUs';
import { FAQ } from '@/marketing/sections/FAQ';
import { Container } from '@/marketing/primitives/Container';
import { LeadForm } from '@/marketing/sections/LeadForm';
import { EyebrowLabel } from '@/marketing/primitives/EyebrowLabel';
import { SectionHeading } from '@/marketing/primitives/SectionHeading';

// TODO: po napojení i18next nahradit za useContent('home')
const content = home;

// TODO: až bude lead-form content namespace, nahradit
const leadFormContent = {
  seo: { title: '', description: '', ogImage: '' },
  hero: { headline: '', subheadline: '' },
  form: {
    icoLabel: 'IČ',
    icoPlaceholder: 'Např. 27426653',
    icoHelper: '8 číslic — automaticky ověříme v ARES',
    emailLabel: 'Pracovní email',
    emailPlaceholder: 'jmeno@firma.cz',
    phoneLabel: 'Telefon',
    phonePlaceholder: '+420 123 456 789',
    teamSizeLabel: 'Kolik lidí komunikuje se zákazníky?',
    teamSizePlaceholder: 'Např. 12',
    gdprLabel: 'Souhlasím se zpracováním osobních údajů pro účely této poptávky',
    submitLabel: 'Odeslat poptávku',
    disclaimer: 'Ozveme se obvykle do pár minut v pracovní době (Po–Pá 8–17).',
  },
  errors: {
    icoInvalid: '',
    emailInvalid: '',
    phoneInvalid: '',
    teamSizeInvalid: '',
    gdprRequired: '',
    submissionFailed: 'Odeslání se nepovedlo. Zkuste to znovu, nebo napište na obchod@bc4cloud.cz — pomůžeme vám ručně.',
  },
  ares: {
    companyFound: '✓ Firma: {companyName}',
    companyNotFound: 'IČ jsme v ARES nenašli. Zkontrolujte ho — ale můžete pokračovat i tak.',
  },
};

export default function HomePage() {
  useSEO(home.seo, '/', { locale: 'cs' });

  // Inject JSON-LD pro homepage (Organization + FAQPage)
  useEffect(() => {
    const orgScript = document.createElement('script');
    orgScript.type = 'application/ld+json';
    orgScript.id = 'jsonld-organization';
    orgScript.textContent = JSON.stringify(organizationSchema());
    document.head.appendChild(orgScript);

    const faqScript = document.createElement('script');
    faqScript.type = 'application/ld+json';
    faqScript.id = 'jsonld-faq';
    faqScript.textContent = JSON.stringify(faqPageSchema(home.faq.items));
    document.head.appendChild(faqScript);

    return () => {
      orgScript.remove();
      faqScript.remove();
    };
  }, []);

  return (
    <>
      <Hero content={content.hero} />
      <LogoCloud content={content.trustBand} />
      <BenefitTriplet content={content.benefits} />
      <ProductVideo content={content.productVideo} />
      <HowItWorks content={content.howItWorks} />
      <FeatureShowcase content={content.featureShowcase} />
      <SegmentCards content={content.segments} />

      {/* Inline lead form — druhý konverzní bod uprostřed homepage */}
      <section className="bg-[var(--color-surface-2)] py-20 sm:py-28" aria-labelledby="inline-lead-form-headline">
        <Container width="narrow">
          <div className="mb-8 text-center flex flex-col items-center gap-3">
            {content.inlineLeadForm.eyebrow && (
              <EyebrowLabel>{content.inlineLeadForm.eyebrow}</EyebrowLabel>
            )}
            <SectionHeading size="xl" center id="inline-lead-form-headline" subheadline={content.inlineLeadForm.subheadline}>
              {content.inlineLeadForm.headline}
            </SectionHeading>
          </div>
          <div className="rounded-m border border-[var(--color-border)] bg-[var(--color-surface-1)] p-6 sm:p-8 shadow-lg">
            <LeadForm content={leadFormContent} source="home_inline" />
          </div>
        </Container>
      </section>

      <WhyUs content={content.whyUs} />
      <FAQ eyebrow={content.faq.eyebrow} headline={content.faq.headline} items={content.faq.items} />
    </>
  );
}
