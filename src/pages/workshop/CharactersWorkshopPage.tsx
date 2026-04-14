import { PageHero } from '../../layouts/PageHero';
import { Section } from '../../layouts/Section';

export default function CharactersWorkshopPage() {
  return (
    <>
      <PageHero
        title="Characters"
        subtitle="A mood in, a theme out."
        description="Describe a vibe. Get 53 CSS variable overrides, a manifest, and a complete personality for your design system. One prompt, one character."
      />

      <Section title="What's a character?" description="A theme with opinions.">
        <div className="space-y-4">
          <p className="font-sans text-base leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
            Most design systems have a dark mode and call it a day. Kvalt has characters —
            complete visual personalities that reshape every surface, text colour, border, shadow,
            and accent in the system. A character isn't a palette swap. It's a mood that
            touches every token.
          </p>
          <p className="font-sans text-base leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
            Each character is defined by 53 CSS variable overrides, a set of personality traits,
            and a manifest with metadata. Apply it with one class on the root element and every
            Kvalt component transforms to match.
          </p>
        </div>
      </Section>

      <Section title="The process" description="How a mood becomes a theme.">
        <div
          className="rounded-lg border px-8 py-6 font-mono text-sm leading-loose"
          style={{
            backgroundColor: 'var(--color-surface-1)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-on-surface)',
          }}
        >
          <span style={{ color: 'var(--color-on-surface-subtle-2)' }}>Input:</span> &nbsp;"Warm brutalist — exposed concrete, amber light, functional typography"<br />
          <br />
          <span style={{ color: 'var(--color-on-surface-subtle-2)' }}>Step 1:</span> Parse mood into token categories — surface warmth, accent direction, type density<br />
          <span style={{ color: 'var(--color-on-surface-subtle-2)' }}>Step 2:</span> Generate 53 CSS variable overrides maintaining WCAG contrast ratios<br />
          <span style={{ color: 'var(--color-on-surface-subtle-2)' }}>Step 3:</span> Write personality traits — adjectives that describe how the character "feels"<br />
          <span style={{ color: 'var(--color-on-surface-subtle-2)' }}>Step 4:</span> Compile manifest — name, description, traits, variable map<br />
          <br />
          <span style={{ color: 'var(--color-on-surface-subtle-2)' }}>Output:</span> Complete Character object, ready to apply
        </div>
      </Section>

      <Section title="What gets generated" level="minor">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Surfaces', desc: 'Background, 7 surface layers, inverted surface. The foundation that everything sits on.' },
            { title: 'Text', desc: 'Primary, subtle-1, subtle-2, on-primary, on-inverted. Every readable element.' },
            { title: 'Accents', desc: 'Primary, secondary, success, warning, danger — each with default, hover, and active states.' },
            { title: 'Borders', desc: 'Default and strong variants. The quiet lines that structure everything.' },
            { title: 'Shadows', desc: 'Small, medium, large at three intensities. Depth that matches the mood.' },
            { title: 'Metadata', desc: 'Name, personality traits, description. The character\'s identity.' },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-lg border px-6 py-5"
              style={{
                backgroundColor: 'var(--color-surface-1)',
                borderColor: 'var(--color-border)',
              }}
            >
              <p className="font-sans text-sm font-semibold mb-2" style={{ color: 'var(--color-on-surface)' }}>
                {item.title}
              </p>
              <p className="font-sans text-sm" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Why it matters">
        <p className="font-sans text-base leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
          Characters turn Kvalt from one design system into a design system that can wear any personality.
          The same Button, the same Modal, the same DataTable — but they feel completely different.
          The component architecture doesn't change. The CSS variables do all the work. That's the
          point of building on tokens instead of hardcoded values.
        </p>
      </Section>
    </>
  );
}
