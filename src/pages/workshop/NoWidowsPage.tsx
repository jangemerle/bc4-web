import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { PageHero } from '../../layouts/PageHero';
import { Section } from '../../layouts/Section';
import { TextArea } from '../../components/TextArea';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { fixTypo, type Locale } from '../../lib/typo';

const SAMPLE_TEXTS: Record<Locale, string[]> = {
  cs: [
    'V Praze bydlí 1,3 milionu lidí a každý z nich má svůj příběh.',
    'Dr. Novák a Ing. Dvořák se sešli v kavárně u J. R. R. Tolkiena.',
    'Cena je 250 Kč, teplota 24 °C, sleva 5 % pro studenty.',
    'Řekl "ahoj" a odešel s knihou o psu a kočce.',
    'K dispozici máme 10 000 kusů za 150 Kč.',
  ],
  en: [
    'The quick brown fox jumps over a lazy dog.',
    'He said "hello" and walked away.',
    'The meeting is at 10 km from here.',
  ],
};

// Render a string with visible NBSP markers so users can see where typopo inserted them.
function MarkedText({ text }: { text: string }) {
  const parts = text.split('\u00A0');
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (
            <span
              aria-hidden
              className="inline-block px-1 mx-0.5 rounded-s font-mono text-xs"
              style={{
                backgroundColor: 'var(--color-primary-1)',
                color: 'var(--color-on-primary)',
                verticalAlign: 'middle',
                lineHeight: '1',
              }}
            >
              NBSP
            </span>
          )}
        </span>
      ))}
    </>
  );
}

export default function NoWidowsPage() {
  // Demo has its own local locale — flipping it here only affects the
  // input/output below, not the rest of the app. The page itself reads
  // under the global LocaleProvider (cs default).
  const [demoLocale, setDemoLocale] = useState<Locale>('cs');
  const [input, setInput] = useState(SAMPLE_TEXTS.cs[0]);

  const output = fixTypo(input, demoLocale);
  const nbspCount = (output.match(/\u00A0/g) || []).length;
  const hasChanges = output !== input;

  return (
    <>
      <PageHero
        title="No Widows — Typography Fix"
        subtitle="Single-letter words never end a line."
        description="A rule every decent book respects. In Czech — prepositions and conjunctions like a, i, o, u, v, k, s, z bind to the next word via a non-breaking space so they can't be stranded at a line break. In English, the same rule kills widows on the final word. Kvalt does it automatically."
      />

      {/* Live demo */}
      <Section title="Try it" description="Type something and see where non-breaking spaces get inserted.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="font-sans text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>
                Input
              </p>
              <div className="flex gap-2">
                <Button
                  variant={demoLocale === 'cs' ? 'primary' : 'secondary'}
                  size="xs"
                  onClick={() => setDemoLocale('cs')}
                  typo={false}
                >
                  cs
                </Button>
                <Button
                  variant={demoLocale === 'en' ? 'primary' : 'secondary'}
                  size="xs"
                  onClick={() => setDemoLocale('en')}
                  typo={false}
                >
                  en
                </Button>
              </div>
            </div>
            <TextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={6}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {SAMPLE_TEXTS[demoLocale].map((sample, i) => (
                <Button
                  key={i}
                  variant="secondary"
                  size="xs"
                  onClick={() => setInput(sample)}
                  typo={false}
                >
                  Sample {i + 1}
                </Button>
              ))}
            </div>
          </div>

          {/* Output */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="font-sans text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>
                Output
              </p>
              <div className="flex items-center gap-2">
                {hasChanges ? (
                  <span
                    className="inline-flex items-center gap-1 font-sans text-sm font-semibold px-2 py-0.5 rounded-xl"
                    style={{
                      backgroundColor: 'var(--color-success-secondary-1)',
                      color: 'var(--color-on-secondary-success)',
                    }}
                  >
                    <Icon icon={Check} size="sm" />
                    {nbspCount} NBSP
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center gap-1 font-sans text-sm font-semibold px-2 py-0.5 rounded-xl"
                    style={{
                      backgroundColor: 'var(--color-surface-3)',
                      color: 'var(--color-on-surface-subtle-1)',
                    }}
                  >
                    <Icon icon={X} size="sm" />
                    no changes
                  </span>
                )}
              </div>
            </div>
            <div
              className="rounded-m p-4 font-sans text-md leading-normal min-h-[162px]"
              style={{
                backgroundColor: 'var(--color-surface-1)',
                color: 'var(--color-on-surface)',
                boxShadow: 'inset 0 0 0 1px var(--color-surface-5)',
              }}
            >
              <MarkedText text={output} />
            </div>
            <p className="mt-3 font-sans text-sm" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
              Orange pills mark where Kvalt inserted a non-breaking space. The actual output contains Unicode U+00A0 — the browser won't break a line there.
            </p>
          </div>
        </div>
      </Section>

      {/* Rules */}
      <Section title="Rules Kvalt applies" level="minor">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'Single-letter prepositions',
              desc: 'Czech: a, i, o, u, v, k, s, z and their capitals bind to the following word. English: the final-word widow rule kicks in on short sentences.',
              example: 'V Praze → V\u00A0Praze',
            },
            {
              title: 'Titles and abbreviations',
              desc: 'Dr., Ing., p., Mr., Mrs., Prof. bind to the name that follows them.',
              example: 'Dr. Novák → Dr.\u00A0Novák',
            },
            {
              title: 'Initials',
              desc: 'Dotted initials bind to each other and to the surname.',
              example: 'J. R. R. Tolkien → J.\u00A0R.\u00A0R. Tolkien',
            },
            {
              title: 'Numbers with units',
              desc: 'Digits bind to degrees, percent signs, and the Czech koruna (Kč).',
              example: '5 % → 5\u00A0%,  250 Kč → 250\u00A0Kč',
            },
            {
              title: 'Quotes',
              desc: 'Straight quotes get converted to the locale\u2019s curly quotes.',
              example: '"hello" → \u201Chello\u201D',
            },
            {
              title: 'Ellipsis',
              desc: 'Three dots become a proper ellipsis character (U+2026).',
              example: '... → …',
            },
          ].map((rule) => (
            <div
              key={rule.title}
              className="rounded-lg p-6"
              style={{ backgroundColor: 'var(--color-surface-1)' }}
            >
              <p
                className="font-sans text-md font-semibold mb-2"
                style={{ color: 'var(--color-on-surface)' }}
              >
                {rule.title}
              </p>
              <p
                className="font-sans text-sm mb-3"
                style={{ color: 'var(--color-on-surface-subtle-1)' }}
              >
                {rule.desc}
              </p>
              <p
                className="font-mono text-sm"
                style={{ color: 'var(--color-on-secondary-1)' }}
              >
                {rule.example}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* API */}
      <Section title="How to use it" description="Three shapes. Pick the one that fits where the text lives.">
        <div className="space-y-6">
          {[
            {
              name: '<Typo>',
              desc: 'React component. Walks the children tree and fixes every string leaf. Use it when you have JSX with inline text.',
              code: `<h1><Typo>{title}</Typo></h1>`,
            },
            {
              name: 'fixTypo()',
              desc: 'Pure function. String in, string out. Use it for props that must be strings — aria-label, placeholder, title attribute.',
              code: `fixTypo('V Praze', 'cs')
// → 'V\\u00A0Praze'`,
            },
            {
              name: 'useTypo()',
              desc: 'Hook. Reads the active locale from context and memoizes the result. Ideal for dynamic text inside components.',
              code: `const safeTitle = useTypo(title);`,
            },
          ].map((api) => (
            <div
              key={api.name}
              className="rounded-lg p-6"
              style={{ backgroundColor: 'var(--color-surface-1)' }}
            >
              <div className="flex items-baseline gap-3 mb-2">
                <p
                  className="font-mono text-md font-semibold"
                  style={{ color: 'var(--color-on-secondary-1)' }}
                >
                  {api.name}
                </p>
              </div>
              <p
                className="font-sans text-sm mb-4"
                style={{ color: 'var(--color-on-surface-subtle-1)' }}
              >
                {api.desc}
              </p>
              <pre
                className="rounded-m p-4 font-mono text-sm overflow-x-auto"
                style={{
                  backgroundColor: 'var(--color-surface-2)',
                  color: 'var(--color-on-surface)',
                }}
              >
                {api.code}
              </pre>
            </div>
          ))}
        </div>
      </Section>

      {/* Opt-out */}
      <Section title="When to opt out" level="minor">
        <div
          className="rounded-lg p-6"
          style={{ backgroundColor: 'var(--color-surface-1)' }}
        >
          <p
            className="font-sans text-md mb-4"
            style={{ color: 'var(--color-on-surface)' }}
          >
            Every DS component takes a <code className="font-mono text-sm">typo</code> prop that turns the transform off. Use it for anything that must stay raw — token names, code samples, technical strings.
          </p>
          <pre
            className="rounded-m p-4 font-mono text-sm"
            style={{
              backgroundColor: 'var(--color-surface-2)',
              color: 'var(--color-on-surface)',
            }}
          >
            {`<Button typo={false}>--color-primary-1</Button>`}
          </pre>
        </div>
      </Section>
    </>
  );
}
