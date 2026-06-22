import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import type { FAQItem } from '@/content/types';
import { duration, ease } from '@/tokens/motion';
import { Reveal } from '@/marketing/motion/Reveal';
import { SECTION_PAD, SectionIntro } from './shared';

interface FAQProps {
  eyebrow?: string;
  headline: string;
  items: FAQItem[];
}

/** Render `[text](href)` markdown links inside an answer string. */
function renderAnswer(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(
      <a key={key++} href={m[2]} className="font-semibold text-[var(--color-primary-1)] underline underline-offset-2">
        {m[1]}
      </a>,
    );
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

/** FAQ — single-open accordion. */
export function FAQ({ eyebrow, headline, items }: FAQProps) {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className={`scroll-mt-[84px] bg-[var(--color-surface-2)] ${SECTION_PAD}`} aria-labelledby="faq-headline">
      <div className="mx-auto w-full max-w-[820px] px-6">
        <Reveal>
          <SectionIntro eyebrow={eyebrow} headline={headline} headingId="faq-headline" className="mb-11" />
        </Reveal>
        <Reveal>
          <div className="overflow-hidden rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface-1)]">
            {items.map((q, i) => {
              const isOpen = open === i;
              return (
                <div key={q.question} className="border-b border-[var(--bc4-border-light)] last:border-b-0">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left transition-colors duration-200 hover:bg-[var(--color-surface-2)]"
                  >
                    <span className="text-[16.5px] font-bold text-[var(--color-on-surface)]">{q.question}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: duration.base, ease: ease.standard }}
                      className="flex-none text-[var(--color-primary-1)]"
                    >
                      <ChevronDown className="h-5 w-5" aria-hidden="true" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: duration.moderate, ease: ease.standard }}
                        className="overflow-hidden"
                      >
                        <p className="m-0 px-6 pb-[22px] text-[15px] leading-[1.62] text-[var(--color-on-surface-subtle-1)]">
                          {renderAnswer(q.answer)}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
