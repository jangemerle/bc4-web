import { Link } from 'react-router-dom';
import { Linkedin, Github, Twitter, Youtube } from 'lucide-react';
import { useMarketingContent } from '@/marketing/editor/useMarketingContent';
import { RevealLines } from '@/marketing/motion/RevealLines';
import { Reveal } from '@/marketing/motion/Reveal';
import { CtaButton } from '@/marketing/primitives/CtaButton';

const socialIcons = {
  linkedin: Linkedin,
  github: Github,
  twitter: Twitter,
  youtube: Youtube,
} as const;

const legalSignals = ['GDPR ready', 'Data v EU', '99,95 % SLA'];

// Dočasně skryté footer sloupce — placeholder odkazy, dokud stránky neexistují.
const HIDDEN_FOOTER_COLUMNS = ['Společnost', 'Podpora', 'Právní'];

export function Footer() {
  const common = useMarketingContent('common');
  const year = new Date().getFullYear();
  const cta = common.preFooterCta;

  return (
    <>
      {/* CTA strip — primary */}
      <section
        className="relative overflow-hidden bg-[var(--color-primary-1)] py-[clamp(48px,6vw,80px)]"
        aria-labelledby="footer-cta"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(50% 120% at 80% 0%, rgba(255,255,255,0.18), rgba(255,255,255,0) 60%)' }}
        />
        <div className="relative mx-auto flex max-w-[900px] flex-col items-center gap-[22px] px-6 text-center">
          <RevealLines
            as="h2"
            id="footer-cta"
            className="m-0 font-display text-[clamp(1.6rem,1rem+2vw,2.4rem)] font-extrabold leading-[1.15] tracking-[-0.02em] text-balance text-white"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {cta.headline}
          </RevealLines>
          {cta.subheadline && (
            <Reveal as="p" className="m-0 max-w-[560px] text-[16px] leading-[1.6] text-white/80">
              {cta.subheadline}
            </Reveal>
          )}
          <Reveal>
            <CtaButton href={cta.cta.href} variant="white" size="lg" arrow trackingId={cta.cta.trackingId}>
              {cta.cta.label}
            </CtaButton>
          </Reveal>
        </div>
      </section>

      {/* Dark footer */}
      <footer className="bg-[var(--color-inverted-surface)] pt-[clamp(48px,6vw,72px)] pb-9 text-[var(--bc4-accent-soft)]">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid gap-10 border-b border-white/[0.12] pb-10" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            {/* Brand */}
            <div className="flex max-w-[280px] flex-col gap-3.5">
              <Link to="/" aria-label={common.brand.name} className="flex items-center gap-2.5 no-underline">
                <img src="/logos/bc4cloud-mark.svg" alt="" aria-hidden="true" className="h-8 w-auto" />
                <span className="relative top-[2px] font-display text-[19px] font-extrabold tracking-[-0.02em] text-white">
                  BC4 Cloud
                </span>
              </Link>
              <p className="m-0 text-[14px] leading-[1.6] text-[var(--bc4-accent)]">{common.footer.tagline}</p>
            </div>

            {common.footer.columns
              .filter((col) => !HIDDEN_FOOTER_COLUMNS.includes(col.title))
              .map((col) => (
              <div key={col.title} className="flex flex-col gap-3">
                <span className="text-[13px] font-bold uppercase tracking-[0.08em] text-white">{col.title}</span>
                {col.links.map((link) =>
                  link.external ? (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[14.5px] text-[var(--bc4-accent-soft)] no-underline transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="text-[14.5px] text-[var(--bc4-accent-soft)] no-underline transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  ),
                )}
              </div>
            ))}
          </div>

          {/* Bottom row */}
          <div className="flex flex-wrap items-center justify-between gap-3.5 pt-6 text-[13px] text-[var(--bc4-accent)]">
            <span>{common.footer.copyright.replace('{year}', String(year))}</span>
            <div className="flex flex-wrap items-center gap-x-[18px] gap-y-2">
              <span className="flex gap-x-[18px]">
                {legalSignals.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </span>
              {common.footer.social.map((social) => {
                const Icon = socialIcons[social.platform];
                return (
                  <a
                    key={social.platform}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-m text-[var(--bc4-accent-soft)] transition-colors hover:bg-white/[0.08] hover:text-white"
                    aria-label={social.platform}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
