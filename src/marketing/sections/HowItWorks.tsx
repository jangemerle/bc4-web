import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/marketing/primitives/Container';
import { EyebrowLabel } from '@/marketing/primitives/EyebrowLabel';
import { SectionHeading } from '@/marketing/primitives/SectionHeading';
import type { HomeContent } from '@/content/types';

interface HowItWorksProps {
  content: HomeContent['howItWorks'];
}

export function HowItWorks({ content }: HowItWorksProps) {
  return (
    <section
      id="how-it-works"
      className="bg-[var(--color-surface-2)] py-20 sm:py-28"
      aria-labelledby="how-it-works-headline"
    >
      <Container width="wide">
        <div className="mb-14 flex flex-col items-center text-center gap-3">
          {content.eyebrow && <EyebrowLabel>{content.eyebrow}</EyebrowLabel>}
          <SectionHeading size="xl" center id="how-it-works-headline">
            {content.headline}
          </SectionHeading>
        </div>

        <motion.ol
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid gap-5 lg:grid-cols-3"
        >
          {content.tiers.map(tier => (
            <motion.li
              key={tier.tier}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0, 0, 0.2, 1] } },
              }}
              className="flex flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-1)] p-7 transition hover:border-[var(--color-primary-1)] hover:shadow-lg"
            >
              <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-m bg-[var(--color-primary-1)] text-sm font-bold text-[var(--color-on-primary)]">
                {tier.tier}
              </div>
              <h3
                className="mb-2 font-display text-2xl font-extrabold text-[var(--color-on-surface)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {tier.title}
              </h3>
              <p className="mb-5 text-[var(--color-on-surface-subtle-1)]">{tier.description}</p>
              <ul className="mb-6 flex flex-col gap-2.5 text-sm text-[var(--color-on-surface)]">
                {tier.features.map(f => (
                  <li key={f} className="flex items-start gap-2">
                    <span
                      className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary-1)]"
                      aria-hidden="true"
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to={tier.learnMoreHref}
                className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-on-secondary-1)] hover:text-[var(--color-on-secondary-2)]"
              >
                Více o úrovni {tier.tier}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </motion.li>
          ))}
        </motion.ol>
      </Container>
    </section>
  );
}
