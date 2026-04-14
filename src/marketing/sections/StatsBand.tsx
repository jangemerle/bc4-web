import { motion } from 'motion/react';
import { Container } from '@/marketing/primitives/Container';
import { EyebrowLabel } from '@/marketing/primitives/EyebrowLabel';
import type { HomeContent } from '@/content/types';

interface StatsBandProps {
  content: HomeContent['statsBand'];
}

/**
 * StatsBand — aggregate statistiky napříč zákazníky.
 *
 * Pattern z Linear/Vercel/Stripe marketing pages. Stat band sedí jako
 * interstitial sekce mezi context (proč to chcete) a deep-dive (jak to
 * funguje). Pomáhá, když ještě nemáme jednu silnou case study — aggregate
 * čísla z 10+ klientů konvertují líp než 0 case studies.
 *
 * Design: 3–4 velká čísla vedle sebe, minimální chrom, barevný akcent.
 */
export function StatsBand({ content }: StatsBandProps) {
  return (
    <section
      className="relative overflow-hidden bg-[var(--color-inverted-surface)] py-16 text-[var(--color-on-inverted-surface)] sm:py-20"
      aria-labelledby={content.headline ? 'stats-band-headline' : undefined}
    >
      {/* Subtle radial gradient — primary color @ 10% */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(60% 80% at 50% 100%, color-mix(in oklab, var(--color-primary-1) 25%, transparent) 0%, transparent 60%)',
        }}
      />

      <Container width="wide" className="relative">
        {(content.eyebrow || content.headline) && (
          <div className="mb-10 max-w-2xl flex flex-col gap-3 sm:mb-14">
            {content.eyebrow && (
              <EyebrowLabel className="text-[var(--color-on-inverted-surface)]/70">
                {content.eyebrow}
              </EyebrowLabel>
            )}
            {content.headline && (
              <h2
                id="stats-band-headline"
                className="font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {content.headline}
              </h2>
            )}
          </div>
        )}

        <motion.dl
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12"
        >
          {content.stats.map(stat => (
            <motion.div
              key={stat.label}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
              }}
              className="flex flex-col gap-1.5"
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd
                className="font-display text-4xl font-extrabold tracking-tight text-[var(--color-on-inverted-surface)] sm:text-5xl"
                style={{ fontFamily: 'var(--font-display)' }}
                aria-hidden="true"
              >
                {stat.value}
              </dd>
              <p className="font-display text-lg font-bold text-[var(--color-on-inverted-surface)]" style={{ fontFamily: 'var(--font-display)' }}>
                {stat.label}
              </p>
              {stat.description && (
                <p className="text-sm text-[var(--color-on-inverted-surface)]/70">
                  {stat.description}
                </p>
              )}
            </motion.div>
          ))}
        </motion.dl>

        {content.footnote && (
          <p className="mt-10 text-xs text-[var(--color-on-inverted-surface)]/60">
            {content.footnote}
          </p>
        )}
      </Container>
    </section>
  );
}
