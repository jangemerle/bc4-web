import { PageHero } from '../../layouts/PageHero';
import { Section } from '../../layouts/Section';

export default function DesignExplorationPage() {
  return (
    <>
      <PageHero
        title="Design Exploration"
        subtitle="Concept first, pixels second."
        description="Every page in Kvalt starts as a text brief, not a mockup. The creative heavy lifting happens before Pencil renders a single frame."
      />

      <Section title="The principle" description="Claude is the creative director. Pencil is the renderer.">
        <div className="space-y-4">
          <p className="font-sans text-base leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
            The output quality of any AI-assisted design tool is determined almost entirely by the prompt quality.
            A lazy prompt gets generic slop — too many cards, purple gradients, zero personality.
            A prompt with specific layout decisions, real content, typographic choices, colour constraints,
            and explicit anti-patterns gets something worth reacting to.
          </p>
          <p className="font-sans text-base leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
            The Pencil skill front-loads all creative thinking into a structured pipeline that runs
            before any design tool is touched. By the time a prompt is pasted into Pencil, every
            meaningful design decision has already been made.
          </p>
        </div>
      </Section>

      <Section title="The pipeline">
        <div
          className="rounded-lg border px-8 py-6 font-mono text-sm leading-loose"
          style={{
            backgroundColor: 'var(--color-surface-1)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-on-surface)',
          }}
        >
          <span style={{ color: 'var(--color-on-surface-subtle-2)' }}>1.</span> Read learnings from past sessions<br />
          <span style={{ color: 'var(--color-on-surface-subtle-2)' }}>2.</span> Write concept brief — real-world format metaphors, voice scoring<br />
          <span style={{ color: 'var(--color-on-surface-subtle-2)' }}>3.</span> Craft the prompt — layout, content, style, constraints baked in<br />
          <span style={{ color: 'var(--color-on-surface-subtle-2)' }}>4.</span> Paste into Pencil — 6-agent swarm, one version per agent<br />
          <span style={{ color: 'var(--color-on-surface-subtle-2)' }}>5.</span> React — what lands, what doesn't, why<br />
          <span style={{ color: 'var(--color-on-surface-subtle-2)' }}>6.</span> Log session — update learnings for next time
        </div>
      </Section>

      <Section title="Concept brief" description="The real creative work happens in text, before any pixels.">
        <div className="space-y-4">
          <p className="font-sans text-base leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
            For every version in an exploration, we write a structured brief: the real-world format
            (receipt, terminal, boarding pass), why it fits this specific page's content, which
            voice principle it activates, where it sits on the Safe → Unhinged spectrum, and what
            could go wrong.
          </p>
          <p className="font-sans text-base leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
            This is cheap. A 30-second read kills a bad concept before it burns 10 minutes of swarm compute.
            And it forces genuine diversity — we check every batch against five axes: dark/light, dense/airy,
            digital/analog, serious/playful, type-led/image-led.
          </p>
        </div>

        <div
          className="rounded-lg border px-8 py-6 mt-6 font-mono text-sm leading-relaxed"
          style={{
            backgroundColor: 'var(--color-surface-1)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-on-surface)',
          }}
        >
          <p style={{ color: 'var(--color-on-surface-subtle-2)' }}>// Example: Pricing page, V1</p>
          <br />
          <strong>VERSION 1 — "The Receipt"</strong><br />
          Format: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Supermarket receipt — monospace, line items, totals<br />
          Why it fits: Pricing = money = receipt. The format IS the content.<br />
          Voice hit: &nbsp;&nbsp;Concept IS the design. Dry humour in metadata.<br />
          Spectrum: &nbsp;&nbsp;&nbsp;Considered<br />
          Risk: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Could feel gimmicky if the receipt details aren't sharp.
        </div>
      </Section>

      <Section title="Voice scoring" description="Seven checks, run twice — on the brief and on the screenshot.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { check: 'Concept is the design', desc: 'Is the format doing the work, or is it decoration on a standard layout?' },
            { check: 'One idea, clean', desc: 'Is there one clear concept, or are multiple ideas competing?' },
            { check: 'Dry > Loud', desc: 'If there\'s humour, is it embedded in structure, not headlines?' },
            { check: 'Real-world frame', desc: 'Is there a recognisable format, or is it abstract?' },
            { check: 'Green as one moment', desc: 'Is the accent used as a single moment, not a palette?' },
            { check: 'Negative space', desc: 'Does the design have the confidence to leave things out?' },
            { check: 'Not precious', desc: 'Does it avoid self-congratulatory irony?' },
          ].map((item) => (
            <div
              key={item.check}
              className="rounded-lg border px-6 py-4"
              style={{
                backgroundColor: 'var(--color-surface-1)',
                borderColor: 'var(--color-border)',
              }}
            >
              <p className="font-sans text-sm font-semibold mb-1" style={{ color: 'var(--color-on-surface)' }}>
                {item.check}
              </p>
              <p className="font-sans text-sm" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="The learning loop" description="The skill gets sharper with every session.">
        <div className="space-y-4">
          <p className="font-sans text-base leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
            After every exploration session, we log what worked and what didn't — exact quotes, voice scoring results,
            which style guide tags produced good output, and which concept frames landed. This feeds back into four
            learnings files: design voice, exploration patterns, style guide tags, and the concept library.
          </p>
          <p className="font-sans text-base leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
            Next session, those learnings are loaded before a single prompt is written. The concept library grows.
            Bad patterns get flagged before they're repeated. The system accumulates taste.
          </p>
        </div>
      </Section>

      <Section title="What we've learned so far" level="minor">
        <div className="space-y-3">
          {[
            '"Unintrusive sparky humour" — the concept IS the joke, not the copy. The receipt is the joke. The joke isn\'t written on the receipt.',
            'Real-world formats work. Receipt, letter, terminal — they carry inherent meaning that does the design work for you.',
            'Don\'t repeat a winning format. One receipt is clever, two is a pattern, three is a crutch.',
            'Complex concepts need simple execution. Simple concepts can handle rich execution. Never both.',
            'The audience\'s native formats resonate hardest. A terminal for design system users is home turf.',
          ].map((lesson, i) => (
            <div
              key={i}
              className="rounded-lg border px-6 py-4"
              style={{
                backgroundColor: 'var(--color-surface-1)',
                borderColor: 'var(--color-border)',
              }}
            >
              <p className="font-sans text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                {lesson}
              </p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
