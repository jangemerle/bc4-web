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

        <ul className="flex flex-col gap-2.5 text-sm text-[var(--color-on-surface)] mt-1">
          {item.highlights.map(highlight => (
            <li key={highlight} className="flex items-start gap-2.5">
              <span
                aria-hidden="true"
                className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary-1)]"
              />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>

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
