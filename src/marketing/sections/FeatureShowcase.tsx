import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/marketing/primitives/Container';
import { EyebrowLabel } from '@/marketing/primitives/EyebrowLabel';
import { SectionHeading } from '@/marketing/primitives/SectionHeading';
import type { HomeContent } from '@/content/types';

interface FeatureShowcaseProps {
  content: HomeContent['featureShowcase'];
}

/**
 * FeatureShowcase — deep dive do konkrétních funkcí aplikace.
 *
 * Layout: alternating — image left / text right, pak obráceně.
 * Každá položka má screenshot aplikace, headline, popis a 3–4 highlights.
 * Pattern inspirovaný Linear, Vercel, Cursor marketing pages.
 */
export function FeatureShowcase({ content }: FeatureShowcaseProps) {
  return (
    <section
      id="features"
      className="py-20 sm:py-28"
      aria-labelledby="feature-showcase-headline"
    >
      <Container width="wide">
        {/* Section header */}
        <div className="mb-16 max-w-3xl flex flex-col gap-3 sm:mb-20">
          {content.eyebrow && <EyebrowLabel>{content.eyebrow}</EyebrowLabel>}
          <SectionHeading size="xl" id="feature-showcase-headline" subheadline={content.subheadline}>
            {content.headline}
          </SectionHeading>
        </div>

        {/* Feature items — alternating layout */}
        <div className="flex flex-col gap-24 sm:gap-32">
          {content.items.map((item, i) => (
            <FeatureItem key={item.id} item={item} reverse={i % 2 === 1} />
          ))}
        </div>
      </Container>
    </section>
  );
}

interface FeatureItemProps {
  item: HomeContent['featureShowcase']['items'][number];
  /** Když true, screenshot je vpravo, text vlevo (lichá položka) */
  reverse: boolean;
}

function FeatureItem({ item, reverse }: FeatureItemProps) {
  const Icon = (Icons[item.icon as keyof typeof Icons] as LucideIcon | undefined) ?? Icons.Sparkles;

  const hasRealScreenshot =
    item.screenshot.src &&
    !item.screenshot.src.startsWith('/product/placeholder') &&
    (item.screenshot.src.endsWith('.png') ||
      item.screenshot.src.endsWith('.jpg') ||
      item.screenshot.src.endsWith('.webp'));

  return (
    <motion.article
      id={item.id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08 } },
      }}
      className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16"
    >
      {/* Screenshot column */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0, 0, 0.2, 1] } },
        }}
        className={reverse ? 'lg:order-2' : ''}
      >
        <div className="relative overflow-hidden rounded-m border border-[var(--color-border)] bg-[var(--color-surface-1)] shadow-xl aspect-[4/3]">
          {hasRealScreenshot ? (
            <img
              src={item.screenshot.src}
              alt={item.screenshot.alt}
              className="block h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <ScreenshotPlaceholder icon={Icon} title={item.title} alt={item.screenshot.alt} />
          )}
        </div>
      </motion.div>

      {/* Text column */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 12 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0, 0, 0.2, 1] } },
        }}
        className={['flex flex-col gap-5', reverse ? 'lg:order-1' : ''].join(' ')}
      >
        {item.eyebrow && (
          <div className="inline-flex items-center gap-2">
            <Icon className="h-4 w-4 text-[var(--color-on-secondary-1)]" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-on-secondary-1)]">
              {item.eyebrow}
            </span>
          </div>
        )}

        <h3
          className="font-display text-2xl font-extrabold tracking-tight text-[var(--color-on-surface)] sm:text-3xl text-balance leading-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {item.headline}
        </h3>

        <p className="text-base text-[var(--color-on-surface-subtle-1)] sm:text-lg text-pretty">
          {item.description}
        </p>

        {item.appStoreLinks && (
          <StoreBadges
            appStore={item.appStoreLinks.appStore}
            googlePlay={item.appStoreLinks.googlePlay}
            appName={item.title}
          />
        )}

        {item.learnMoreHref && (
          <Link
            to={item.learnMoreHref}
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-on-secondary-1)] hover:text-[var(--color-on-secondary-2)]"
          >
            Více o {item.title.toLowerCase()}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
      </motion.div>
    </motion.article>
  );
}

interface StoreBadgesProps {
  appStore?: string;
  googlePlay?: string;
  appName: string;
}

function StoreBadges({ appStore, googlePlay, appName }: StoreBadgesProps) {
  if (!appStore && !googlePlay) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-3">
      {appStore && (
        <a
          href={appStore}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Stáhněte ${appName} z App Store`}
          className="inline-flex h-12 items-center gap-2 rounded-md bg-black px-4 text-white transition hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-1)]"
        >
          <AppleMark className="h-6 w-6" />
          <span className="flex flex-col leading-none text-left">
            <span className="text-[10px] font-medium uppercase tracking-wide">Stáhněte z</span>
            <span className="text-base font-semibold tracking-tight">App Store</span>
          </span>
        </a>
      )}
      {googlePlay && (
        <a
          href={googlePlay}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Získejte ${appName} na Google Play`}
          className="inline-flex h-12 items-center gap-2 rounded-md bg-black px-4 text-white transition hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-1)]"
        >
          <GooglePlayMark className="h-6 w-6" />
          <span className="flex flex-col leading-none text-left">
            <span className="text-[10px] font-medium uppercase tracking-wide">Získejte na</span>
            <span className="text-base font-semibold tracking-tight">Google Play</span>
          </span>
        </a>
      )}
    </div>
  );
}

function AppleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function GooglePlayMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" aria-hidden="true" className={className}>
      <path fill="#00C3FF" d="M325.3 234.3 104.6 13l280.8 161.2-60.1 60.1z" />
      <path fill="#FF3A44" d="M104.6 499 325.3 277.7l60.1 60.1L104.6 499z" />
      <path fill="#FFCE00" d="m480.6 256-95.2 81.8-60.1-60.1 60.1-60.1 95.2 38.4z" />
      <path fill="#00F076" d="M104.6 13C97.3 16.8 92.2 23.7 92.2 32.6v446.8c0 8.9 5.1 15.8 12.4 19.6l220.7-221.3L104.6 13z" />
    </svg>
  );
}

function ScreenshotPlaceholder({
  icon: Icon,
  title,
  alt,
}: {
  icon: LucideIcon;
  title: string;
  alt: string;
}) {
  return (
    <div
      className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--color-secondary-1)] via-[var(--color-surface-2)] to-[var(--color-secondary-2)]"
      role="img"
      aria-label={alt}
    >
      <div className="text-center px-8">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-m bg-[var(--color-surface-1)] shadow-lg mb-4">
          <Icon className="h-8 w-8 text-[var(--color-on-secondary-1)]" aria-hidden="true" />
        </div>
        <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--color-on-surface-subtle-2)] mb-1">
          SCREENSHOT PŘIPRAVUJEME
        </p>
        <p
          className="font-display text-sm font-bold text-[var(--color-on-surface)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </p>
      </div>
    </div>
  );
}
