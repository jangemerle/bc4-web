import { Link } from 'react-router-dom';
import { Container } from '@/marketing/primitives/Container';
import { Button } from '@/components/Button';
import { useSEO } from '@/marketing/seo';

export default function NotFoundPage() {
  useSEO(
    {
      title: '404 — Stránka neexistuje | BC4Cloud',
      description: 'Tahle adresa u nás není.',
      ogImage: '/og/default.png',
    },
    '/404',
  );

  return (
    <section className="py-24 sm:py-32 bg-[var(--color-bg)]">
      <Container width="default" className="text-center">
        <p className="font-mono text-sm uppercase tracking-wider text-[var(--color-on-surface-subtle-2)] mb-3">
          404
        </p>
        <h1
          className="font-display text-5xl font-extrabold tracking-tight text-[var(--color-on-surface)] mb-4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Tuhle adresu nemáme.
        </h1>
        <p className="text-lg text-[var(--color-on-surface-subtle-1)] max-w-xl mx-auto mb-8">
          Buď někdo linkoval starou URL, nebo se stal překlep v adresním řádku. Vraťte se na úvod — anebo nám napište, co jste hledali.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/">
            <Button variant="primary" size="md">
              Zpět na úvod
            </Button>
          </Link>
          <Link to="/kontakt">
            <Button variant="secondary" size="md">
              Kontakt
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
