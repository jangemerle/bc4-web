import { Play } from 'lucide-react';
import type { HomeContent } from '@/content/types';
import { Reveal, RevealStagger, RevealItem } from '@/marketing/motion/Reveal';
import { SECTION_PAD, SectionIntro } from './shared';

interface ProductVideoProps {
  content: HomeContent['productVideo'];
}

/** Product video — centered heading, 16:9 poster with play, 3 chapter cards. */
export function ProductVideo({ content }: ProductVideoProps) {
  return (
    <section
      id="product-video"
      className={`scroll-mt-[84px] bg-[var(--color-surface-2)] ${SECTION_PAD}`}
      aria-labelledby="video-headline"
    >
      <div className="mx-auto w-full max-w-[1100px] px-6">
        <Reveal>
          <SectionIntro
            eyebrow={content.eyebrow}
            headline={content.headline}
            align="center"
            headingId="video-headline"
            className="mx-auto mb-11 max-w-[680px]"
          />
        </Reveal>

        <Reveal>
          <div
            className="relative flex aspect-video items-center justify-center overflow-hidden rounded-[18px] shadow-[0_30px_70px_-30px_rgba(4,18,59,0.55)]"
            style={{ background: 'linear-gradient(135deg, #0B215C, #04123B)' }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{ background: 'radial-gradient(50% 60% at 50% 50%, rgba(53,100,239,0.4), rgba(53,100,239,0) 70%)' }}
            />
            <button
              type="button"
              aria-label="Přehrát video ukázku BC4Cloud"
              className="relative flex h-[84px] w-[84px] items-center justify-center rounded-full bg-[var(--color-primary-1)] text-white shadow-[0_12px_36px_rgba(53,100,239,0.55)] transition-colors duration-200 hover:bg-white hover:text-[var(--color-primary-1)]"
            >
              <Play className="h-[34px] w-[34px] translate-x-0.5 fill-current" aria-hidden="true" />
            </button>
            <span className="absolute bottom-[18px] right-[18px] rounded-[8px] bg-[rgba(4,18,59,0.7)] px-3 py-1.5 text-[13px] font-semibold text-white backdrop-blur-[6px]">
              {content.duration}
            </span>
          </div>
        </Reveal>

        <RevealStagger
          className="mt-6 grid gap-4"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}
        >
          {content.chapters.map((c) => (
            <RevealItem
              key={c.timestamp}
              className="flex flex-col gap-[7px] rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface-1)] p-5"
            >
              <span className="font-mono text-[13px] font-bold tracking-[0.01em] text-[var(--color-primary-1)]">
                {c.timestamp}
              </span>
              <span className="text-[16px] font-bold text-[var(--color-on-surface)]">{c.title}</span>
              <span className="text-[14px] leading-[1.55] text-[var(--color-on-surface-subtle-1)]">
                {c.description}
              </span>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
