import type { HomeContent } from '@/content/types';
import { Reveal, RevealStagger, RevealItem } from '@/marketing/motion/Reveal';
import { Bound, SECTION_PAD, SectionIntro, Icon } from './shared';

interface BenefitTripletProps {
  content: HomeContent['benefits'];
}

const cardHover =
  'transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-[3px] hover:border-[#BBC3FA] hover:shadow-[0_18px_40px_-22px_rgba(4,18,59,0.35)]';

/** Benefits — 4 cards (light curtain panel). Icon chip, title, description. */
export function BenefitTriplet({ content }: BenefitTripletProps) {
  return (
    <section className={`bg-[var(--color-surface-1)] ${SECTION_PAD}`} aria-labelledby="benefits-headline">
      <Bound>
        <Reveal>
          <SectionIntro
            eyebrow={content.eyebrow}
            headline={content.headline}
            headingId="benefits-headline"
            className="mb-12 max-w-[760px]"
          />
        </Reveal>
        <RevealStagger
          className="grid gap-5"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}
        >
          {content.items.map((b) => (
            <RevealItem
              key={b.title}
              className={`flex flex-col gap-4 rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface-1)] p-7 ${cardHover}`}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[var(--color-secondary-1)] text-[var(--color-primary-1)]">
                <Icon name={b.icon} className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="m-0 text-[18.5px] font-bold leading-[1.3] tracking-[-0.01em] text-[var(--color-on-surface)]">
                {b.title}
              </h3>
              <p className="m-0 text-[15px] leading-[1.58] text-[var(--color-on-surface-subtle-1)]">
                {b.description}
              </p>
            </RevealItem>
          ))}
        </RevealStagger>
      </Bound>
    </section>
  );
}
