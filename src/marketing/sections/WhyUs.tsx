import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Container } from '@/marketing/primitives/Container';
import { EyebrowLabel } from '@/marketing/primitives/EyebrowLabel';
import { SectionHeading } from '@/marketing/primitives/SectionHeading';
import type { HomeContent } from '@/content/types';

interface WhyUsProps {
  content: HomeContent['whyUs'];
}

export function WhyUs({ content }: WhyUsProps) {
  return (
    <section className="py-20 sm:py-28" aria-labelledby="why-us-headline">
      <Container width="wide">
        <div className="mb-12 max-w-3xl flex flex-col gap-3">
          {content.eyebrow && <EyebrowLabel>{content.eyebrow}</EyebrowLabel>}
          <SectionHeading size="xl" id="why-us-headline">
            {content.headline}
          </SectionHeading>
        </div>

        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
          className="grid gap-x-8 gap-y-10 sm:grid-cols-2"
        >
          {content.reasons.map(reason => {
            const Icon = (Icons[reason.icon as keyof typeof Icons] as LucideIcon | undefined) ?? Icons.CheckCircle;
            return (
              <motion.li
                key={reason.title}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                }}
                className="flex gap-4"
              >
                <div className="shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-m bg-[var(--color-secondary-1)] text-[var(--color-on-secondary-1)]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                </div>
                <div>
                  <h3 className="mb-1.5 font-display text-lg font-bold text-[var(--color-on-surface)]" style={{ fontFamily: 'var(--font-display)' }}>
                    {reason.title}
                  </h3>
                  <p className="text-[var(--color-on-surface-subtle-1)]">{reason.description}</p>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>
      </Container>
    </section>
  );
}
