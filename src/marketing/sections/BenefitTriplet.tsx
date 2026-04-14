import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Container } from '@/marketing/primitives/Container';
import { EyebrowLabel } from '@/marketing/primitives/EyebrowLabel';
import { SectionHeading } from '@/marketing/primitives/SectionHeading';
import type { HomeContent } from '@/content/types';

interface BenefitTripletProps {
  content: HomeContent['benefits'];
}

export function BenefitTriplet({ content }: BenefitTripletProps) {
  return (
    <section className="py-20 sm:py-28" aria-labelledby="benefits-headline">
      <Container width="wide">
        <div className="mb-12 max-w-3xl flex flex-col gap-3">
          {content.eyebrow && <EyebrowLabel>{content.eyebrow}</EyebrowLabel>}
          <SectionHeading size="xl" id="benefits-headline" subheadline={content.subheadline}>
            {content.headline}
          </SectionHeading>
        </div>

        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {content.items.map(item => {
            const Icon = (Icons[item.icon as keyof typeof Icons] as LucideIcon | undefined) ?? Icons.Sparkles;
            return (
              <motion.li
                key={item.title}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0, 0, 0.2, 1] } },
                }}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-1)] p-6 transition hover:border-[var(--color-border-strong)]"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-m bg-[var(--color-secondary-1)] text-[var(--color-on-secondary-1)]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mb-2 font-display text-lg font-bold text-[var(--color-on-surface)]" style={{ fontFamily: 'var(--font-display)' }}>
                  {item.title}
                </h3>
                <p className="text-[var(--color-on-surface-subtle-1)]">{item.description}</p>
              </motion.li>
            );
          })}
        </motion.ul>
      </Container>
    </section>
  );
}
