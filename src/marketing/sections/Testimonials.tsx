import { motion } from 'motion/react';
import { Quote, User } from 'lucide-react';
import { Container } from '@/marketing/primitives/Container';
import { EyebrowLabel } from '@/marketing/primitives/EyebrowLabel';
import { SectionHeading } from '@/marketing/primitives/SectionHeading';
import type { HomeContent } from '@/content/types';

interface TestimonialsProps {
  content: HomeContent['testimonials'];
}

/**
 * Testimonials — citace zákazníků s fotkou, jménem a pozicí.
 *
 * Pattern: velká dekorativní uvozovka v pozadí, kvalitní fotka autora,
 * stručná citace s konkrétním číslem (ideálně). Bez filmových produkcí —
 * ale také žádné stock foto; placeholder ikona je lepší než fake osoba.
 *
 * Baymard 2023: konkrétní citace s číslem > generická chvála 3× v CTR.
 */
export function Testimonials({ content }: TestimonialsProps) {
  return (
    <section className="py-20 sm:py-28" aria-labelledby="testimonials-headline">
      <Container width="wide">
        <div className="mb-12 max-w-3xl flex flex-col gap-3 sm:mb-16">
          {content.eyebrow && <EyebrowLabel>{content.eyebrow}</EyebrowLabel>}
          <SectionHeading size="xl" id="testimonials-headline" subheadline={content.subheadline}>
            {content.headline}
          </SectionHeading>
        </div>

        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {content.items.map(item => (
            <TestimonialCard key={item.author} item={item} />
          ))}
        </motion.ul>
      </Container>
    </section>
  );
}

function TestimonialCard({ item }: { item: HomeContent['testimonials']['items'][number] }) {
  const hasPhoto =
    item.authorPhoto &&
    !item.authorPhoto.startsWith('/testimonials/placeholder') &&
    (item.authorPhoto.endsWith('.png') ||
      item.authorPhoto.endsWith('.jpg') ||
      item.authorPhoto.endsWith('.webp'));

  return (
    <motion.li
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0, 0, 0.2, 1] } },
      }}
      className="relative flex flex-col gap-5 rounded-m border border-[var(--color-border)] bg-[var(--color-surface-1)] p-7 overflow-hidden transition hover:border-[var(--color-border-strong)]"
    >
      {/* Dekorativní velká uvozovka v pozadí */}
      <Quote
        className="absolute -right-2 -top-2 h-24 w-24 text-[var(--color-secondary-1)] rotate-180"
        aria-hidden="true"
        strokeWidth={1.5}
      />

      {/* Citace */}
      <blockquote className="relative z-10 text-base text-[var(--color-on-surface)] sm:text-lg leading-relaxed text-pretty">
        <p>„{item.quote}"</p>
      </blockquote>

      {/* Autor */}
      <figcaption className="relative z-10 mt-auto flex items-center gap-3 pt-4 border-t border-[var(--color-border)]">
        {/* Fotka nebo placeholder */}
        <div className="shrink-0">
          {hasPhoto ? (
            <img
              src={item.authorPhoto}
              alt=""
              className="h-12 w-12 rounded-full object-cover"
              loading="lazy"
            />
          ) : (
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-secondary-1)] text-[var(--color-on-secondary-1)]"
              aria-hidden="true"
            >
              <User className="h-5 w-5" />
            </div>
          )}
        </div>

        {/* Jméno + role */}
        <div className="flex flex-col min-w-0">
          <p
            className="font-display font-bold text-[var(--color-on-surface)] truncate"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {item.author}
          </p>
          <p className="text-sm text-[var(--color-on-surface-subtle-1)] truncate">
            {item.role}
            {item.role && item.company && ', '}
            {item.company}
          </p>
        </div>
      </figcaption>
    </motion.li>
  );
}
