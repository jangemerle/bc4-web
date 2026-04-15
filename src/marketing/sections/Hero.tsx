import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShieldCheck, MapPin, Headphones, Play } from 'lucide-react';
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
            <div className="relative overflow-hidden rounded-m border border-[var(--color-border)] bg-[var(--color-surface-1)] shadow-2xl">
              <HeroVisual src={content.heroVisual.src} alt={content.heroVisual.alt} />
              {/* Play overlay — naznačuje, že hero vizuál vede k video ukázce */}
              <a
                href="#product-video"
                aria-label="Přejít na video ukázku BC4Cloud"
                className="absolute inset-0 flex items-center justify-center group"
              >
                <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-primary-1)] text-[var(--color-on-primary)] shadow-2xl transition group-hover:scale-105">
                  <Play className="h-8 w-8 translate-x-0.5 fill-current" aria-hidden="true" />
                </span>
              </a>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

/**
 * HeroVisual — renderuje screenshot, ale s onError fallbackem na placeholder.
 * Důvod: image src může být platná cesta, ale soubor ještě neexistuje
 * (jsme v MVP fázi, screenshoty zatím nedodány).
 */
function HeroVisual({ src, alt }: { src: string; alt: string }) {
  const [imageFailed, setImageFailed] = useState(false);
  const isImageExtension =
    src.endsWith('.png') || src.endsWith('.jpg') || src.endsWith('.webp');

  if (!isImageExtension || imageFailed) {
    return <HeroPlaceholder alt={alt} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className="block h-auto w-full"
      loading="eager"
      fetchPriority="high"
      onError={() => setImageFailed(true)}
    />
  );
}

function HeroPlaceholder({ alt }: { alt: string }) {
  return (
    <div
      className="aspect-[4/3] bg-gradient-to-br from-[var(--color-surface-2)] to-[var(--color-secondary-1)] flex items-center justify-center"
      role="img"
      aria-label={alt}
    >
      {/* Play ikonka v kruhu — konzistentní s ProductVideo placeholderem */}
      <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-primary-1)] text-[var(--color-on-primary)] shadow-2xl">
        <Play className="h-8 w-8 translate-x-0.5 fill-current" aria-hidden="true" />
      </span>
    </div>
  );
}
