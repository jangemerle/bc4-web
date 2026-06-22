import type { HomeContent } from '@/content/types';
import { Reveal, RevealStagger, RevealItem } from '@/marketing/motion/Reveal';
import { RevealLines } from '@/marketing/motion/RevealLines';
import { StoreBadges } from '@/marketing/primitives/StoreBadge';
import { Bound, SECTION_PAD, SectionIntro, MonoEyebrow, Icon, Check } from './shared';

interface FeatureShowcaseProps {
  content: HomeContent['featureShowcase'];
}

/** Feature showcase — 5 blocks alternating left/right, browser-framed shots. */
export function FeatureShowcase({ content }: FeatureShowcaseProps) {
  return (
    <section
      id="features"
      className={`scroll-mt-[84px] bg-[var(--color-surface-2)] ${SECTION_PAD}`}
      aria-labelledby="features-headline"
    >
      <Bound>
        <Reveal>
          <SectionIntro
            eyebrow={content.eyebrow}
            headline={content.headline}
            lead={content.subheadline}
            headingId="features-headline"
            className="mb-14 max-w-[760px]"
          />
        </Reveal>

        <div className="flex flex-col gap-[clamp(48px,6vw,80px)]">
          {content.items.map((f, i) => (
            <div
              key={f.id}
              className={`flex flex-col items-center gap-[clamp(32px,5vw,64px)] lg:flex-row ${
                i % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Copy */}
              <div className="flex w-full flex-col gap-[18px] lg:flex-1">
                <Reveal as="span" className="inline-flex items-center gap-[9px] self-start">
                  <span className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface-1)] text-[var(--color-primary-1)]">
                    <Icon name={f.icon} className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <MonoEyebrow className="text-[11.5px] tracking-[0.05em]">{f.eyebrow}</MonoEyebrow>
                </Reveal>

                <RevealLines
                  as="h3"
                  className="m-0 font-display text-[clamp(1.4rem,1rem+1.2vw,1.95rem)] font-extrabold leading-[1.18] tracking-[-0.02em] text-balance text-[var(--color-on-surface)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {f.headline}
                </RevealLines>

                <RevealLines as="p" className="m-0 text-[16px] leading-[1.6] text-[var(--color-on-surface-subtle-1)]">
                  {f.description}
                </RevealLines>

                <RevealStagger className="m-0 mt-1 flex list-none flex-col gap-[11px] p-0" as="ul">
                  {f.highlights.map((hl) => (
                    <RevealItem
                      key={hl}
                      as="li"
                      className="flex gap-[11px] text-[15px] leading-[1.5] text-[var(--color-on-surface)]"
                    >
                      <Check size={20} className="mt-px text-[var(--color-primary-1)]" />
                      <span>{hl}</span>
                    </RevealItem>
                  ))}
                </RevealStagger>

                {f.appStoreLinks && (
                  <Reveal>
                    <StoreBadges appStore={f.appStoreLinks.appStore} googlePlay={f.appStoreLinks.googlePlay} />
                  </Reveal>
                )}
              </div>

              {/* Browser-framed screenshot */}
              <Reveal className="relative w-full lg:flex-1">
                <div
                  aria-hidden="true"
                  className="absolute"
                  style={{
                    inset: '4% 2% -8% 2%',
                    background: 'radial-gradient(60% 60% at 50% 40%, rgba(53,100,239,0.16), rgba(53,100,239,0) 70%)',
                    filter: 'blur(6px)',
                  }}
                />
                <div className="relative overflow-hidden rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface-1)] shadow-[0_26px_56px_-28px_rgba(4,18,59,0.42)]">
                  <img
                    src={f.screenshot.src}
                    alt={f.screenshot.alt}
                    loading="lazy"
                    className="block h-auto w-full"
                  />
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </Bound>
    </section>
  );
}
