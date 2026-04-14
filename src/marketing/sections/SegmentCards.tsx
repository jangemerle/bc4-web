import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Container } from '@/marketing/primitives/Container';
import { EyebrowLabel } from '@/marketing/primitives/EyebrowLabel';
import { SectionHeading } from '@/marketing/primitives/SectionHeading';
import type { HomeContent } from '@/content/types';

interface SegmentCardsProps {
  content: HomeContent['segments'];
}

export function SegmentCards({ content }: SegmentCardsProps) {
  return (
    <section className="py-20 sm:py-28" aria-labelledby="segments-headline">
      <Container width="wide">
        <div className="mb-12 max-w-3xl flex flex-col gap-3">
          {content.eyebrow && <EyebrowLabel>{content.eyebrow}</EyebrowLabel>}
          <SectionHeading size="xl" id="segments-headline">
            {content.headline}
          </SectionHeading>
        </div>

        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {content.items.map(seg => {
            const Icon = (Icons[seg.icon as keyof typeof Icons] as LucideIcon | undefined) ?? Icons.Building2;
            return (
              <motion.li
                key={seg.name}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                }}
                className="rounded-lg bg-[var(--color-surface-2)] p-6 transition hover:bg-[var(--color-secondary-1)]"
              >
                <Icon className="mb-3 h-6 w-6 text-[var(--color-on-secondary-1)]" aria-hidden="true" />
                <h3 className="mb-1.5 font-display text-base font-bold text-[var(--color-on-surface)]" style={{ fontFamily: 'var(--font-display)' }}>
                  {seg.name}
                </h3>
                <p className="text-sm text-[var(--color-on-surface-subtle-1)]">{seg.tagline}</p>
              </motion.li>
            );
          })}
        </motion.ul>
      </Container>
    </section>
  );
}
