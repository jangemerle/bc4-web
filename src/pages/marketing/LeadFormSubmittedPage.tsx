import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Container } from '@/marketing/primitives/Container';
import { Button } from '@/components/Button';
import { useSEO } from '@/marketing/seo';

const seo = {
  title: 'Děkujeme za vaši poptávku | BC4Cloud',
  description: 'Vaše poptávka dorazila. Ozveme se obvykle do několika minut v pracovní době.',
  ogImage: '/og/lead-form-submitted.png',
};

const nextSteps = [
  {
    step: 1,
    title: 'Krátký telefonát',
    description: 'Obchodník se ozve obvykle do několika minut v pracovní době Po–Pá 8–17. Probereme váš případ a co konkrétně řešíte.',
  },
  {
    step: 2,
    title: 'Mini-ukázka přizpůsobená vám',
    description: '20–30 minut online demo. Ukážeme přímo to, co potřebujete — žádné generické 90-minutové prezentace.',
  },
  {
    step: 3,
    title: 'Cenová nabídka na míru',
    description: 'Do 1 pracovního dne pošleme nabídku přizpůsobenou velikosti týmu a požadovaným modulům.',
  },
];

export default function LeadFormSubmittedPage() {
  useSEO(seo, '/poptavka/odeslano');

  return (
    <section className="py-16 sm:py-24">
      <Container width="default">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-success-secondary-1)] text-[var(--color-success-1)] mb-6">
            <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
          </div>
          <h1
            className="font-display text-4xl font-extrabold tracking-tight text-[var(--color-on-surface)] mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Díky. Ozveme se obvykle do několika minut.
          </h1>
          <p className="text-lg text-[var(--color-on-surface-subtle-1)]">
            Pondělí–pátek 8:00–17:00 středoevropského času. Mimo tuto dobu voláme první následující pracovní den.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <h2
            className="font-display text-xl font-bold mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Co se bude dít teď
          </h2>
          <ol className="flex flex-col gap-4 mb-12">
            {nextSteps.map(step => (
              <li key={step.step} className="flex gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-1)] p-5">
                <div className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-secondary-1)] text-[var(--color-on-secondary-1)] font-bold text-sm">
                  {step.step}
                </div>
                <div>
                  <h3 className="font-display font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>{step.title}</h3>
                  <p className="text-sm text-[var(--color-on-surface-subtle-1)]">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="text-center">
            <Link to="/">
              <Button variant="secondary" size="md" iconRight={ArrowRight}>
                Zpět na úvod
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
