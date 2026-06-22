import type { HomeContent } from '@/content/types';
import { Reveal, RevealStagger, RevealItem } from '@/marketing/motion/Reveal';
import { Bound, SECTION_PAD, SectionIntro, Icon } from './shared';

interface WhyUsProps {
  content: HomeContent['whyUs'];
}

/** Why us — 4 reasons, icon chip + title + copy in a row. */
export function WhyUs({ content }: WhyUsProps) {
  return (
    <section
      id="why-us"
      className={`scroll-mt-[84px] bg-[var(--color-surface-1)] ${SECTION_PAD}`}
      aria-labelledby="why-headline"
    >
      <Bound>
        <Reveal>
          <SectionIntro
            eyebrow={content.eyebrow}
            headline={content.headline}
            headingId="why-headline"
            className="mb-12 max-w-[720px]"
          />
        </Reveal>
        <RevealStagger className="grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2">
          {content.reasons.map((w) => (
            <RevealItem key={w.title} className="flex items-start gap-[18px]">
              <span className="flex h-12 w-12 flex-none items-center justify-center rounded-[12px] bg-[var(--color-secondary-1)] text-[var(--color-primary-1)]">
                <Icon name={w.icon} className="h-6 w-6" aria-hidden="true" />
              </span>
              <div className="flex flex-col gap-[7px]">
                <h3 className="m-0 text-[18px] font-bold tracking-[-0.01em] text-[var(--color-on-surface)]">
                  {w.title}
                </h3>
                <p className="m-0 text-[15px] leading-[1.58] text-[var(--color-on-surface-subtle-1)]">
                  {w.description}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
      </Bound>
    </section>
  );
}
