import type { HomeContent } from '@/content/types';
import { Reveal, RevealStagger, RevealItem } from '@/marketing/motion/Reveal';
import { Bound, SECTION_PAD, SectionIntro, Check } from './shared';

interface HowItWorksProps {
  content: HomeContent['howItWorks'];
}

/** How it works — 4 tier cards, numbered chip + add-on badge + checklist. */
export function HowItWorks({ content }: HowItWorksProps) {
  return (
    <section
      id="how-it-works"
      className={`scroll-mt-[84px] bg-[var(--color-surface-1)] ${SECTION_PAD}`}
      aria-labelledby="how-headline"
    >
      <Bound>
        <Reveal>
          <SectionIntro
            eyebrow={content.eyebrow}
            headline={content.headline}
            lead={content.subheadline}
            headingId="how-headline"
            className="mb-12 max-w-[760px]"
          />
        </Reveal>
        <RevealStagger
          className="grid gap-5"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}
        >
          {content.tiers.map((t) => (
            <RevealItem
              key={t.tier}
              className="relative flex flex-col gap-4 rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface-1)] p-[26px] transition-[border-color,box-shadow] duration-200 hover:border-[#BBC3FA] hover:shadow-[0_18px_40px_-24px_rgba(4,18,59,0.3)]"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-[var(--color-inverted-surface)] text-[17px] font-extrabold text-white">
                  {t.tier}
                </span>
                {t.addOn && (
                  <span className="rounded-[9999px] bg-[var(--color-secondary-1)] px-2.5 py-[5px] text-[11.5px] font-bold uppercase tracking-[0.06em] text-[var(--color-on-secondary-2)]">
                    Přídavný modul
                  </span>
                )}
              </div>
              <h3 className="m-0 text-[20px] font-extrabold tracking-[-0.01em] text-[var(--color-on-surface)]">
                {t.title}
              </h3>
              <p className="m-0 text-[14.5px] leading-[1.55] text-[var(--color-on-surface-subtle-1)]">
                {t.description}
              </p>
              <ul className="m-0 mt-1 flex list-none flex-col gap-2.5 p-0">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-[9px] text-[14px] leading-[1.45] text-[var(--color-on-surface)]">
                    <Check size={18} className="mt-px text-[var(--color-primary-1)]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </RevealItem>
          ))}
        </RevealStagger>
      </Bound>
    </section>
  );
}
