import type { HomeContent } from '@/content/types';
import { Reveal, RevealStagger, RevealItem } from '@/marketing/motion/Reveal';
import { Bound, SECTION_PAD, SectionIntro, Icon } from './shared';

interface SegmentCardsProps {
  content: HomeContent['segments'];
}

/** Segments — dark navy curtain panel. 5 industry cards. */
export function SegmentCards({ content }: SegmentCardsProps) {
  return (
    <section
      className={`bg-[var(--color-inverted-surface)] ${SECTION_PAD}`}
      aria-labelledby="segments-headline"
    >
      <Bound>
        <Reveal>
          <SectionIntro
            eyebrow={content.eyebrow}
            headline={content.headline}
            tone="dark"
            headingId="segments-headline"
            className="mb-11 max-w-[780px]"
          />
        </Reveal>
        <RevealStagger
          className="grid gap-4"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}
        >
          {content.items.map((s) => (
            <RevealItem
              key={s.name}
              className="flex flex-col gap-[13px] rounded-[14px] border border-white/[0.12] bg-white/[0.04] p-6 transition-colors duration-200 hover:border-[var(--bc4-accent-softer)]/50 hover:bg-white/[0.08]"
            >
              <span
                className="flex h-11 w-11 items-center justify-center rounded-[11px] text-[var(--bc4-accent-softer)]"
                style={{ background: 'rgba(53,100,239,0.22)' }}
              >
                <Icon name={s.icon} className="h-[22px] w-[22px]" aria-hidden="true" />
              </span>
              <span className="text-[17px] font-bold text-white">{s.name}</span>
              <span className="text-[14px] leading-[1.55] text-[var(--bc4-accent-soft)]">{s.tagline}</span>
            </RevealItem>
          ))}
        </RevealStagger>
        {content.footnote && (
          <p className="mt-9 max-w-[780px] text-[14.5px] leading-[1.6] text-[var(--bc4-accent)]">
            {content.footnote}
          </p>
        )}
      </Bound>
    </section>
  );
}
