import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShieldCheck, MapPin, Headphones } from 'lucide-react';
import { Button } from '@/components/Button';
import { Container } from '@/marketing/primitives/Container';
import { EyebrowLabel } from '@/marketing/primitives/EyebrowLabel';
import type { HomeContent } from '@/content/types';

const trustBadges = [
  { icon: ShieldCheck, label: 'GDPR ready' },
  { icon: MapPin, label: 'Data v EU' },
  { icon: Headphones, label: 'Česká podpora' },
];

interface HeroProps {
  content: HomeContent['hero'];
}

export function Hero({ content }: HeroProps) {
  return (
    <section className="relative overflow-hidden pb-12 pt-12 sm:pb-20 sm:pt-20" aria-labelledby="hero-headline">
      {/* Subtle radial gradient — primary color ~5% opacity */}
      <div
        className="pointer-events-none absolute inset-0 -z-0"
        style={{
          background:
            'radial-gradient(80% 60% at 50% 0%, color-mix(in oklab, var(--color-primary-1) 8%, transparent) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <Container width="wide" className="relative">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16">
          {/* Levý sloupec — text + CTA */}
          <div className="flex flex-col gap-6">
            {content.eyebrow && <EyebrowLabel>{content.eyebrow}</EyebrowLabel>}

            <motion.h1
              id="hero-headline"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
              className="font-display text-4xl font-extrabold tracking-[-0.02em] text-[var(--color-on-surface)] sm:text-5xl lg:text-6xl text-balance leading-[1.05]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {content.headline}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08, ease: [0, 0, 0.2, 1] }}
              className="text-lg text-[var(--color-on-surface-subtle-1)] sm:text-xl text-pretty max-w-xl"
            >
              {content.subheadline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16, ease: [0, 0, 0.2, 1] }}
              className="mt-2 flex flex-wrap items-center gap-3"
            >
              <Link to={content.primaryCta.href}>
                <Button variant="primary" size="lg">
                  {content.primaryCta.label}
                </Button>
              </Link>
              {content.secondaryCta && (
                <Link to={content.secondaryCta.href}>
                  <Button variant="secondary" size="lg">
                    {content.secondaryCta.label}
                  </Button>
                </Link>
              )}
            </motion.div>

            {/* Trust badges — GDPR, EU data, česká podpora */}
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--color-on-surface-subtle-1)]"
              aria-label="Trust signály"
            >
              {trustBadges.map(badge => (
                <li key={badge.label} className="inline-flex items-center gap-1.5">
                  <badge.icon className="h-4 w-4 text-[var(--color-on-secondary-1)]" aria-hidden="true" />
                  <span className="font-medium">{badge.label}</span>
                </li>
              ))}
              <li className="inline-flex items-center gap-1.5">
                <span className="font-mono text-xs text-[var(--color-on-surface-subtle-2)]">
                  Od 490 Kč / agent / měsíc
                </span>
              </li>
            </motion.ul>
          </div>

          {/* Pravý sloupec — hero visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0, 0, 0.2, 1] }}
            className="relative"
          >
            <div className="overflow-hidden rounded-m border border-[var(--color-border)] bg-[var(--color-surface-1)] shadow-2xl">
              {content.heroVisual.src.endsWith('.png') || content.heroVisual.src.endsWith('.jpg') || content.heroVisual.src.endsWith('.webp') ? (
                <img
                  src={content.heroVisual.src}
                  alt={content.heroVisual.alt}
                  className="block h-auto w-full"
                  loading="eager"
                  fetchPriority="high"
                />
              ) : (
                // Placeholder když screenshot ještě nemáme
                <HeroPlaceholder alt={content.heroVisual.alt} />
              )}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

function HeroPlaceholder({ alt }: { alt: string }) {
  return (
    <div
      className="aspect-[4/3] bg-gradient-to-br from-[var(--color-surface-2)] to-[var(--color-secondary-1)] flex items-center justify-center"
      role="img"
      aria-label={alt}
    >
      <div className="text-center px-6">
        <p className="font-display text-sm font-semibold text-[var(--color-on-surface-subtle-2)] uppercase tracking-wider mb-2">
          Screenshot aplikace
        </p>
        <p className="text-xs text-[var(--color-on-surface-subtle-2)] max-w-xs">
          Tady bude reálný screenshot z BC4Cloud Agent Panelu — dodá se v dalším kroku.
        </p>
      </div>
    </div>
  );
}
