import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { useSEO } from '@/marketing/seo';
import { features } from '@/content/cs/features';
import { Container } from '@/marketing/primitives/Container';
import { EyebrowLabel } from '@/marketing/primitives/EyebrowLabel';
import { SectionHeading } from '@/marketing/primitives/SectionHeading';
import { Button } from '@/components/Button';
import type { ProductContent } from '@/content/types';

/**
 * Funkce — detailní přehled jednotlivých modulů aplikace.
 *
 * Inspirováno strukturou bronet.cz/cs/bc4-call-centrum/ — alternating
 * sekce každého modulu s screenshot + popisem + bullets.
 */
export default function FeaturesPage() {
  useSEO(features.seo, '/funkce');

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div
          className="pointer-events-none absolute inset-0 -z-0"
          style={{
            background:
              'radial-gradient(80% 60% at 50% 0%, color-mix(in oklab, var(--color-primary-1) 8%, transparent) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />
        <Container width="default" className="relative text-center">
          <div className="flex flex-col items-center gap-3 max-w-3xl mx-auto">
            <EyebrowLabel>{features.hero.eyebrow}</EyebrowLabel>
            <SectionHeading size="2xl" center subheadline={features.hero.subheadline}>
              {features.hero.headline}
            </SectionHeading>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to={features.hero.primaryCta.href}>
              <Button variant="primary" size="lg">
                {features.hero.primaryCta.label}
              </Button>
            </Link>
            {features.hero.secondaryCta && (
              <Link to={features.hero.secondaryCta.href}>
                <Button variant="secondary" size="lg">
                  {features.hero.secondaryCta.label}
                </Button>
              </Link>
            )}
          </div>
        </Container>
      </section>

      {/* Pain points — 3 problems → resolutions */}
      <section className="bg-[var(--color-surface-2)] py-16 sm:py-20" aria-labelledby="pain-points-headline">
        <Container width="wide">
          <div className="mb-10 max-w-3xl flex flex-col gap-3">
            <EyebrowLabel>{features.painPoints.eyebrow}</EyebrowLabel>
            <SectionHeading size="xl" id="pain-points-headline">
              {features.painPoints.headline}
            </SectionHeading>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.painPoints.items.map(item => (
              <div
                key={item.pain}
                className="rounded-m border border-[var(--color-border)] bg-[var(--color-surface-1)] p-6"
              >
                <p className="mb-3 text-sm font-semibold text-[var(--color-on-surface-subtle-1)]">
                  {item.pain}
                </p>
                <p
                  className="font-display text-base font-bold text-[var(--color-on-surface)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {item.resolution}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Features — alternating list */}
      <section className="py-20 sm:py-28" aria-labelledby="features-headline">
        <Container width="wide">
          <div className="mb-16 max-w-3xl flex flex-col gap-3 sm:mb-20">
            <EyebrowLabel>{features.features.eyebrow}</EyebrowLabel>
            <SectionHeading size="xl" id="features-headline" subheadline={features.features.subheadline}>
              {features.features.headline}
            </SectionHeading>
          </div>

          <div className="flex flex-col gap-20 sm:gap-28">
            {features.features.items.map((item, i) => (
              <FeatureRow key={item.title} item={item} reverse={i % 2 === 1} />
            ))}
          </div>
        </Container>
      </section>

      {/* Related products */}
      <section className="bg-[var(--color-surface-2)] py-20 sm:py-24" aria-labelledby="related-headline">
        <Container width="wide">
          <SectionHeading size="l" id="related-headline" className="mb-10">
            {features.relatedProducts.headline}
          </SectionHeading>
          <div className="grid gap-6 sm:grid-cols-3">
            {features.relatedProducts.items.map(rp => {
              const Icon = (Icons[rp.icon as keyof typeof Icons] as LucideIcon | undefined) ?? Icons.Sparkles;
              return (
                <Link
                  key={rp.href}
                  to={rp.href}
                  className="block rounded-m border border-[var(--color-border)] bg-[var(--color-surface-1)] p-6 transition hover:border-[var(--color-primary-1)] hover:shadow-lg"
                >
                  <Icon className="mb-3 h-6 w-6 text-[var(--color-on-secondary-1)]" aria-hidden="true" />
                  <h3
                    className="mb-1.5 font-display text-base font-bold text-[var(--color-on-surface)]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {rp.name}
                  </h3>
                  <p className="text-sm text-[var(--color-on-surface-subtle-1)]">{rp.description}</p>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}

interface FeatureRowProps {
  item: ProductContent['features']['items'][number];
  reverse: boolean;
}

function FeatureRow({ item, reverse }: FeatureRowProps) {
  const Icon = (Icons[item.icon as keyof typeof Icons] as LucideIcon | undefined) ?? Icons.Sparkles;
  const hasImage =
    item.screenshot &&
    (item.screenshot.endsWith('.png') ||
      item.screenshot.endsWith('.jpg') ||
      item.screenshot.endsWith('.webp'));

  return (
    <motion.article
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
      className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16"
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 16 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0, 0, 0.2, 1] } },
        }}
        className={reverse ? 'lg:order-2' : ''}
      >
        <div className="relative overflow-hidden rounded-m border border-[var(--color-border)] bg-[var(--color-surface-1)] shadow-xl aspect-[4/3]">
          {hasImage ? (
            <img
              src={item.screenshot}
              alt={item.title}
              className="block h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--color-secondary-1)] to-[var(--color-secondary-2)]">
              <Icon className="h-16 w-16 text-[var(--color-on-secondary-1)]" aria-hidden="true" />
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        variants={{
          hidden: { opacity: 0, y: 12 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0, 0, 0.2, 1] } },
        }}
        className={['flex flex-col gap-4', reverse ? 'lg:order-1' : ''].join(' ')}
      >
        <div className="inline-flex items-center gap-2">
          <Icon className="h-5 w-5 text-[var(--color-on-secondary-1)]" aria-hidden="true" />
        </div>
        <h3
          className="font-display text-2xl font-extrabold tracking-tight text-[var(--color-on-surface)] sm:text-3xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {item.title}
        </h3>
        <p className="text-base text-[var(--color-on-surface-subtle-1)] sm:text-lg">
          {item.description}
        </p>
        {item.bullets && (
          <ul className="flex flex-col gap-2 text-sm text-[var(--color-on-surface)]">
            {item.bullets.map(b => (
              <li key={b} className="flex items-start gap-2.5">
                <span
                  aria-hidden="true"
                  className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary-1)]"
                />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </motion.article>
  );
}
