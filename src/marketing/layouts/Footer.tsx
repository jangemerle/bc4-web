import { Link } from 'react-router-dom';
import { Linkedin, Github, Twitter, Youtube } from 'lucide-react';
import { Button } from '@/components/Button';
import { Container } from '@/marketing/primitives/Container';
import { common } from '@/content/cs/common';

const socialIcons = {
  linkedin: Linkedin,
  github: Github,
  twitter: Twitter,
  youtube: Youtube,
} as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      {/* Pre-footer CTA band */}
      <section
        className="relative overflow-hidden bg-[var(--color-secondary-1)] py-16 sm:py-20"
        aria-labelledby="pre-footer-cta"
      >
        {/* Subtle radial gradient pro depth */}
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              'radial-gradient(60% 80% at 50% 0%, var(--color-secondary-2) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />
        <Container width="default" className="relative text-center">
          <h2
            id="pre-footer-cta"
            className="mb-3 font-display text-3xl font-extrabold tracking-tight text-[var(--color-on-surface)] sm:text-4xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {common.preFooterCta.headline}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-base text-[var(--color-on-surface-subtle-1)] sm:text-lg">
            {common.preFooterCta.subheadline}
          </p>
          <Link to={common.preFooterCta.cta.href}>
            <Button variant="primary" size="lg">
              {common.preFooterCta.cta.label}
            </Button>
          </Link>
        </Container>
      </section>

      {/* Main footer */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface-1)] py-12 text-sm">
        <Container width="wide">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {/* Brand column */}
            <div className="col-span-2 lg:col-span-1">
              <Link
                to="/"
                className="mb-3 block font-display text-lg font-extrabold text-[var(--color-on-surface)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {common.brand.name}
              </Link>
              <p className="text-[var(--color-on-surface-subtle-1)]">{common.footer.tagline}</p>
            </div>

            {common.footer.columns.map(col => (
              <div key={col.title}>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--color-on-surface-subtle-2)]">
                  {col.title}
                </h3>
                <ul className="flex flex-col gap-2">
                  {col.links.map(link => (
                    <li key={link.href}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--color-on-surface-subtle-1)] hover:text-[var(--color-on-surface)]"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          to={link.href}
                          className="text-[var(--color-on-surface-subtle-1)] hover:text-[var(--color-on-surface)]"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom row */}
          <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-[var(--color-border)] pt-6 sm:flex-row sm:items-center">
            <p className="text-[var(--color-on-surface-subtle-2)]">
              {common.footer.copyright.replace('{year}', String(year))}
            </p>
            <ul className="flex items-center gap-3">
              {common.footer.social.map(social => {
                const Icon = socialIcons[social.platform];
                return (
                  <li key={social.platform}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-m text-[var(--color-on-surface-subtle-1)] hover:bg-[var(--color-secondary-1)] hover:text-[var(--color-on-surface)]"
                      aria-label={social.platform}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </Container>
      </footer>
    </>
  );
}
