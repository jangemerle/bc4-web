import { useNavigate } from 'react-router-dom';
import { Container } from '@/marketing/primitives/Container';
import { EyebrowLabel } from '@/marketing/primitives/EyebrowLabel';
import { SectionHeading } from '@/marketing/primitives/SectionHeading';
import { LeadForm } from '@/marketing/sections/LeadForm';
import { useSEO } from '@/marketing/seo';

const seo = {
  title: 'Domluvit ukázku | BC4Cloud',
  description: 'Vyplňte pár polí a obchodník se vám ozve obvykle do pár minut. Žádný prodejní tlak — jen ukázka.',
  ogImage: '/og/lead-form.png',
};

const formContent = {
  seo,
  hero: {
    headline: 'Ukážeme, jak to funguje u vás.',
    subheadline: 'Čtyři pole a jste hotovi. Ozveme se obvykle do pár minut v pracovní době — a bez prodejního skriptu.',
  },
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

export default function LeadFormPage() {
  const navigate = useNavigate();
  useSEO(seo, '/poptavka');

  return (
    <section className="py-12 sm:py-20">
      <Container width="narrow">
        <div className="text-center mb-10 flex flex-col items-center gap-3">
          <EyebrowLabel>POPTÁVKA</EyebrowLabel>
          <SectionHeading size="2xl" center subheadline={formContent.hero.subheadline}>
            {formContent.hero.headline}
          </SectionHeading>
        </div>
        <div className="rounded-m border border-[var(--color-border)] bg-[var(--color-surface-1)] p-6 sm:p-8 shadow-lg">
          <LeadForm
            content={formContent}
            source="standalone"
            onSubmitSuccess={() => navigate('/poptavka/odeslano')}
          />
        </div>
      </Container>
    </section>
  );
}
