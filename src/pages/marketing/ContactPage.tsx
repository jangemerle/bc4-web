import { useSEO } from '@/marketing/seo';
import { contact } from '@/content/cs/contact';
import { Container } from '@/marketing/primitives/Container';

export default function ContactPage() {
  useSEO(contact.seo, '/kontakt');
  return (
    <Container width="default" className="py-20">
      <h1 className="font-display text-4xl font-extrabold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
        {contact.hero.headline}
      </h1>
      <p className="text-lg text-[var(--color-on-surface-subtle-1)] mb-12 max-w-2xl">
        {contact.hero.subheadline}
      </p>
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-1)] p-6">
        <h2 className="font-display text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
          {contact.company.name}
        </h2>
        <address className="not-italic text-[var(--color-on-surface-subtle-1)] space-y-1">
          {contact.company.address.map(line => <div key={line}>{line}</div>)}
          <div>IČ: {contact.company.ico}</div>
          <div>Tel: {contact.company.phone}</div>
          <div>Email: <a href={`mailto:${contact.company.email}`} className="text-[var(--color-on-secondary-1)] hover:underline">{contact.company.email}</a></div>
        </address>
      </div>
    </Container>
  );
}
