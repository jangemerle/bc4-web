import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Container } from '@/marketing/primitives/Container';
import { EyebrowLabel } from '@/marketing/primitives/EyebrowLabel';
import { SectionHeading } from '@/marketing/primitives/SectionHeading';
import type { HomeContent } from '@/content/types';

interface ProductScreenshotProps {
  content: HomeContent['productShowcase'];
}

export function ProductScreenshot({ content }: ProductScreenshotProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  // Subtle parallax — image moves slower than scroll
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const isImage =
    content.screenshot.src.endsWith('.png') ||
    content.screenshot.src.endsWith('.jpg') ||
    content.screenshot.src.endsWith('.webp');

  return (
    <section
      ref={ref}
      className="bg-[var(--color-surface-2)] py-20 sm:py-28 overflow-hidden"
      aria-labelledby="product-showcase-headline"
    >
      <Container width="wide">
        <div className="mb-12 max-w-3xl flex flex-col gap-3">
          {content.eyebrow && <EyebrowLabel>{content.eyebrow}</EyebrowLabel>}
          <SectionHeading size="xl" id="product-showcase-headline" subheadline={content.subheadline}>
            {content.headline}
          </SectionHeading>
        </div>

        <motion.div
          style={{ y }}
          className="relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-1)] shadow-2xl"
        >
          {isImage ? (
            <img
              src={content.screenshot.src}
              alt={content.screenshot.alt}
              className="block h-auto w-full"
              loading="lazy"
            />
          ) : (
            <ScreenshotPlaceholder alt={content.screenshot.alt} />
          )}
        </motion.div>
      </Container>
    </section>
  );
}

function ScreenshotPlaceholder({ alt }: { alt: string }) {
  return (
    <div
      className="aspect-[16/9] flex items-center justify-center bg-gradient-to-br from-[var(--color-surface-2)] to-[var(--color-secondary-1)]"
      role="img"
      aria-label={alt}
    >
      <div className="text-center px-6">
        <p className="font-display text-sm font-semibold text-[var(--color-on-surface-subtle-2)] uppercase tracking-wider mb-2">
          Anotovaný screenshot Agent Panelu
        </p>
        <p className="text-xs text-[var(--color-on-surface-subtle-2)] max-w-md">
          Tady bude reálný screenshot z BC4Cloud — dodá se v dalším kroku.
        </p>
      </div>
    </div>
  );
}
