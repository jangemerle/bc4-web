import type { HomeContent } from '@/content/types';
import { Reveal, RevealStagger, RevealItem } from '@/marketing/motion/Reveal';
import { Bound, SECTION_PAD, SectionIntro } from './shared';

interface StatsBandProps {
  content: HomeContent['statsBand'];
}

/** Stats band — dark navy curtain panel. Big mono numerals in accent blue. */
export function StatsBand({ content }: StatsBandProps) {
  return (
    <section
      className={`relative overflow-hidden bg-[var(--color-inverted-surface)] ${SECTION_PAD}`}
      aria-labelledby="stats-headline"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'radial-gradient(60% 90% at 85% 0%, rgba(53,100,239,0.32), rgba(53,100,239,0) 60%)' }}
      />
      <Bound className="relative">
        <Reveal>
          <SectionIntro
            eyebrow={content.eyebrow}
            headline={content.headline}
            tone="dark"
            headingId="stats-headline"
            className="mb-12 max-w-[720px]"
          />
        </Reveal>
        <RevealStagger
          className="grid gap-6"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}
        >
          {content.stats.map((s) => (
            <RevealItem
              key={s.label}
              className="flex flex-col gap-2 border-t border-white/[0.16] pt-6"
            >
              <span className="font-mono text-[clamp(2.5rem,1.5rem+2.2vw,3.4rem)] font-bold leading-none tracking-[-0.03em] text-[var(--bc4-accent)]">
                {s.value}
              </span>
              <span className="text-[16.5px] font-bold text-white">{s.label}</span>
              <span className="text-[14px] leading-[1.55] text-white/70">{s.description}</span>
            </RevealItem>
          ))}
        </RevealStagger>
        {content.footnote && (
          <p className="mt-10 max-w-[760px] text-[13.5px] leading-[1.6] text-white/70">
            {content.footnote}
          </p>
        )}
      </Bound>
    </section>
  );
}
