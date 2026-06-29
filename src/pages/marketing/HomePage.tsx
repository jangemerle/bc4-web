import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useMarketingContent } from '@/marketing/editor/useMarketingContent';
import { useSEO, organizationSchema, faqPageSchema } from '@/marketing/seo';
import { Hero } from '@/marketing/sections/Hero';
import { LogoCloud } from '@/marketing/sections/LogoCloud';
import { StatsBand } from '@/marketing/sections/StatsBand';
import { BenefitTriplet } from '@/marketing/sections/BenefitTriplet';
import { ProductVideo } from '@/marketing/sections/ProductVideo';
import { FeatureShowcase } from '@/marketing/sections/FeatureShowcase';
import { Testimonials } from '@/marketing/sections/Testimonials';
import { HowItWorks } from '@/marketing/sections/HowItWorks';
import { SegmentCards } from '@/marketing/sections/SegmentCards';
import { WhyUs } from '@/marketing/sections/WhyUs';
import { FAQ } from '@/marketing/sections/FAQ';
import { LeadForm } from '@/marketing/sections/LeadForm';
import { Curtain } from '@/marketing/motion/Curtain';
import { Reveal } from '@/marketing/motion/Reveal';
import { SectionIntro } from '@/marketing/sections/shared';

// Section toggles — trust band + product video (were tweakable design props).
const SHOW_TRUST = true;
// Video ukázka — zatím skryté, použijeme v budoucnu (poster + video TODO).
const SHOW_VIDEO = false;

// TODO: až bude lead-form content namespace, nahradit
const leadFormContent = {
  seo: { title: '', description: '', ogImage: '' },
  hero: { headline: '', subheadline: '' },
  form: {
    icoLabel: 'IČ',
    icoPlaceholder: 'Např. 27426653',
    icoHelper: '',
    emailLabel: 'Pracovní email',
    emailPlaceholder: 'jmeno@firma.cz',
    phoneLabel: 'Telefon',
    phonePlaceholder: '+420 123 456 789',
    teamSizeLabel: 'Kolik lidí komunikuje se zákazníky?',
    teamSizePlaceholder: 'Např. 12',
    gdprLabel: 'Souhlasím se zpracováním osobních údajů pro účely této poptávky',
    noteToggleLabel: 'Máte konkrétní otázku?',
    noteLabel: 'Vaše otázka nebo poznámka',
    notePlaceholder:
      'Např. Funguje to s naším Salesforce? Máme 25 operátorů a chceme začít s callbackem. Jaká je doba nasazení?',
    submitLabel: 'Odeslat poptávku',
    disclaimer: 'Ozveme se obvykle do pár minut v pracovní době (Po–Pá 8–17).',
    optionalHint: '(nepovinné)',
  },
  errors: {
    icoInvalid: '',
    emailInvalid: '',
    phoneInvalid: '',
    teamSizeInvalid: '',
    gdprRequired: '',
    submissionFailed:
      'Odeslání se nepovedlo. Zkuste to znovu, nebo napište na obchod@bc4cloud.cz — pomůžeme vám ručně.',
  },
  ares: {
    companyFound: '✓ Firma: {companyName}',
    companyNotFound: 'IČ jsme v ARES nenašli. Zkontrolujte ho — ale můžete pokračovat i tak.',
  },
};

export default function HomePage() {
  const content = useMarketingContent('home');
  useSEO(content.seo, '/', { locale: 'cs' });
  const { hash } = useLocation();

  // Inject JSON-LD (Organization + FAQPage)
  useEffect(() => {
    const orgScript = document.createElement('script');
    orgScript.type = 'application/ld+json';
    orgScript.id = 'jsonld-organization';
    orgScript.textContent = JSON.stringify(organizationSchema());
    document.head.appendChild(orgScript);

    const faqScript = document.createElement('script');
    faqScript.type = 'application/ld+json';
    faqScript.id = 'jsonld-faq';
    faqScript.textContent = JSON.stringify(faqPageSchema(content.faq.items));
    document.head.appendChild(faqScript);

    return () => {
      orgScript.remove();
      faqScript.remove();
    };
  }, []);

  // Scroll to a hash target on load / hash change (cross-page anchor support).
  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);
    const scroll = () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    const t = window.setTimeout(scroll, 80);
    return () => window.clearTimeout(t);
  }, [hash]);

  return (
    <>
      <Hero content={content.hero} />

      {SHOW_TRUST && <LogoCloud content={content.trustBand} />}

      {/* Curtain ① — Benefits (light) overlapped by Stats (dark) */}
      <Curtain>
        <div className="sticky top-0" style={{ zIndex: 0 }}>
          <BenefitTriplet content={content.benefits} />
        </div>
        <div className="sticky top-0" style={{ zIndex: 1 }}>
          <StatsBand content={content.statsBand} />
        </div>
      </Curtain>

      {SHOW_VIDEO && <ProductVideo content={content.productVideo} />}

      <HowItWorks content={content.howItWorks} />
      <FeatureShowcase content={content.featureShowcase} />

      {/* Curtain ② — Testimonials (light) overlapped by Segments (dark) */}
      <Curtain>
        <div className="sticky top-0" style={{ zIndex: 0 }}>
          <Testimonials content={content.testimonials} />
        </div>
        <div className="sticky top-0" style={{ zIndex: 1 }}>
          <SegmentCards content={content.segments} />
        </div>
      </Curtain>

      {/* Inline lead form — mid-page conversion point */}
      <section
        id="poptavka"
        className="scroll-mt-[84px] bg-[var(--color-surface-2)] py-[clamp(56px,8vw,104px)]"
        aria-labelledby="inline-lead-form-headline"
      >
        <div className="mx-auto w-full max-w-[680px] px-6">
          <Reveal>
            <SectionIntro
              eyebrow={content.inlineLeadForm.eyebrow}
              headline={content.inlineLeadForm.headline}
              align="center"
              headingId="inline-lead-form-headline"
              className="mb-8"
            />
          </Reveal>
          <Reveal>
            <div className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-1)] p-[clamp(24px,4vw,38px)] shadow-[0_24px_50px_-32px_rgba(4,18,59,0.35)]">
              <LeadForm content={leadFormContent} source="home_inline" />
            </div>
          </Reveal>
        </div>
      </section>

      <WhyUs content={content.whyUs} />
      <FAQ eyebrow={content.faq.eyebrow} headline={content.faq.headline} items={content.faq.items} />
    </>
  );
}
