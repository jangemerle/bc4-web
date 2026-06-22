import type { HomeContent } from '@/content/types';
import { Reveal, RevealStagger, RevealItem } from '@/marketing/motion/Reveal';
import { Bound, SECTION_PAD, SectionIntro } from './shared';

interface TestimonialsProps {
  content: HomeContent['testimonials'];
}

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

/** Testimonials — light curtain panel. 3 quote cards. */
export function Testimonials({ content }: TestimonialsProps) {
  return (
    <section className={`bg-[var(--color-surface-1)] ${SECTION_PAD}`} aria-labelledby="testimonials-headline">
      <Bound>
        <Reveal>
          <SectionIntro
            eyebrow={content.eyebrow}
            headline={content.headline}
            headingId="testimonials-headline"
            className="mb-12 max-w-[720px]"
          />
        </Reveal>
        <RevealStagger
          className="grid gap-5"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}
        >
          {content.items.map((t) => (
            <RevealItem key={t.author}>
              <figure className="m-0 flex h-full flex-col gap-5 rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-7">
                <span aria-hidden="true" className="text-[40px] font-extrabold leading-[0.6] text-[#BBC3FA]">
                  &ldquo;
                </span>
                <blockquote className="m-0 flex-1 text-[16.5px] leading-[1.6] text-[var(--color-on-surface)]">
                  {t.quote}
                </blockquote>
                <figcaption className="flex items-center gap-[13px] border-t border-[var(--color-border)] pt-[18px]">
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-[var(--color-on-secondary-2)] text-[15px] font-bold text-white">
                    {initialsOf(t.author)}
                  </span>
                  <span className="flex flex-col">
                    <span className="text-[15px] font-bold text-[var(--color-on-surface)]">{t.author}</span>
                    <span className="text-[13.5px] text-[var(--color-on-surface-subtle-1)]">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealStagger>
      </Bound>
    </section>
  );
}
