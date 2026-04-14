import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { Container } from '@/marketing/primitives/Container';
import { EyebrowLabel } from '@/marketing/primitives/EyebrowLabel';
import { SectionHeading } from '@/marketing/primitives/SectionHeading';
import type { FAQItem } from '@/content/types';

interface FAQProps {
  eyebrow?: string;
  headline: string;
  items: FAQItem[];
}

export function FAQ({ eyebrow, headline, items }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-[var(--color-surface-2)] py-20 sm:py-28" aria-labelledby="faq-headline">
      <Container width="default">
        <div className="mb-12 max-w-3xl flex flex-col gap-3">
          {eyebrow && <EyebrowLabel>{eyebrow}</EyebrowLabel>}
          <SectionHeading size="xl" id="faq-headline">
            {headline}
          </SectionHeading>
        </div>

        <ul className="flex flex-col gap-3">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <li
                key={item.question}
                className="overflow-hidden rounded-m border border-[var(--color-border)] bg-[var(--color-surface-1)]"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-display text-base font-bold text-[var(--color-on-surface)] sm:text-lg" style={{ fontFamily: 'var(--font-display)' }}>
                    {item.question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0 text-[var(--color-on-surface-subtle-1)]"
                    aria-hidden="true"
                  >
                    <ChevronDown className="h-5 w-5" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <p
                        className="px-6 pb-5 text-[var(--color-on-surface-subtle-1)]"
                        // Markdown links — minimal parser, jen [text](url)
                        dangerouslySetInnerHTML={{
                          __html: item.answer.replace(
                            /\[([^\]]+)\]\(([^)]+)\)/g,
                            '<a href="$2" class="text-[var(--color-on-secondary-1)] hover:text-[var(--color-on-secondary-2)] underline">$1</a>',
                          ),
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
