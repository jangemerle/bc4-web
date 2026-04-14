import { motion } from 'motion/react';
import { Container } from '@/marketing/primitives/Container';
import { EyebrowLabel } from '@/marketing/primitives/EyebrowLabel';
import type { HomeContent } from '@/content/types';

interface LogoCloudProps {
  content: HomeContent['trustBand'];
}

export function LogoCloud({ content }: LogoCloudProps) {
  return (
    <section className="border-y border-[var(--color-border)] bg-[var(--color-surface-1)] py-10 sm:py-12" aria-labelledby="logo-cloud-label">
      <Container width="wide">
        <EyebrowLabel className="text-center mb-6" id="logo-cloud-label">
          {content.label}
        </EyebrowLabel>
        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.05 } },
          }}
          className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14"
        >
          {content.logos.map(logo => (
            <motion.li
              key={logo.name}
              variants={{
                hidden: { opacity: 0, y: 8 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
              className="flex flex-col items-center gap-1"
            >
              {logo.src.startsWith('/logos/clients/placeholder') ? (
                // Placeholder dokud nemáme reálná loga
                <div
                  className="flex h-10 min-w-[100px] items-center justify-center rounded-m bg-[var(--color-surface-3)] px-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface-subtle-2)]"
                  aria-label={logo.alt}
                >
                  {logo.name}
                </div>
              ) : (
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="h-8 w-auto opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
                  loading="lazy"
                />
              )}
              {/* Outcome pod logem — +18 % konverze dle Baymard 2023 */}
              {logo.outcome && (
                <span className="text-xs font-semibold text-[var(--color-on-secondary-1)]">
                  {logo.outcome}
                </span>
              )}
            </motion.li>
          ))}
        </motion.ul>
      </Container>
    </section>
  );
}
