import { PageHero } from '../../layouts/PageHero';
import { Section } from '../../layouts/Section';

export default function ComponentForgePage() {
  return (
    <>
      <PageHero
        title="Component Forge"
        subtitle="Interview it, then build it."
        description="Every component goes through a design interview before a single line of code is written. Then it's built test-first: red, green, refactor, repeat."
      />

      <Section title="Phase 1: The Grill" description="A design tree interview. Walk every branch before you commit to building.">
        <div className="space-y-4">
          <p className="font-sans text-base leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
            Before writing a component spec or starting implementation, the grill-component skill
            walks through every design decision as a structured interview. Variants, states,
            content model, composition, accessibility, motion, edge cases — each branch explored,
            each decision confirmed.
          </p>
          <p className="font-sans text-base leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
            The output is a confirmed design summary: a document that captures what the component
            does, what it doesn't do, and why. This feeds directly into the spec and the test plan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {[
            { branch: 'Variants', questions: 'What visual variations exist? What triggers each? Are any variants mutually exclusive?' },
            { branch: 'States', questions: 'Default, hover, focus, active, disabled, loading, error, selected — which apply? What are the transitions between them?' },
            { branch: 'Content model', questions: 'What goes inside? Text only? Icons? Custom content? What happens when content overflows? Truncation or wrapping?' },
            { branch: 'Composition', questions: 'Does it compose with other components? Can it be a child of containers? Does it need slots for custom content?' },
            { branch: 'Accessibility', questions: 'What ARIA role? Keyboard interactions? Focus management? Screen reader announcements? Reduced motion handling?' },
            { branch: 'Motion', questions: 'What animates? Which motion tokens? Press feedback via usePress? Enter/exit transitions? Spring or duration?' },
            { branch: 'Edge cases', questions: 'Empty state? Very long content? RTL? Multiple instances on one page? What breaks first?' },
            { branch: 'API surface', questions: 'What props are public? What\'s controlled vs uncontrolled? What are the defaults? What\'s the minimal usage?' },
          ].map((item) => (
            <div
              key={item.branch}
              className="rounded-lg border px-6 py-4"
              style={{
                backgroundColor: 'var(--color-surface-1)',
                borderColor: 'var(--color-border)',
              }}
            >
              <p className="font-sans text-sm font-semibold mb-1" style={{ color: 'var(--color-on-surface)' }}>
                {item.branch}
              </p>
              <p className="font-sans text-sm" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                {item.questions}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Phase 2: TDD" description="Red-green-refactor. One test at a time.">
        <div className="space-y-4">
          <p className="font-sans text-base leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
            With the design confirmed, implementation follows a strict test-driven loop.
            Write one failing test. Implement just enough to pass. Refactor. Repeat. The test
            suite becomes the specification — if it passes, the component matches the design.
          </p>
        </div>

        <div
          className="rounded-lg border px-8 py-6 mt-6 font-mono text-sm leading-loose"
          style={{
            backgroundColor: 'var(--color-surface-1)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-on-surface)',
          }}
        >
          <span style={{ color: 'var(--color-danger-1)' }}>RED</span> &nbsp;&nbsp;&nbsp;Write a failing test for one behaviour<br />
          <span style={{ color: 'var(--color-success-1)' }}>GREEN</span> &nbsp;Implement the minimum code to pass<br />
          <span style={{ color: 'var(--color-on-secondary-1)' }}>REFACTOR</span> &nbsp;Clean up without changing behaviour<br />
          <br />
          <span style={{ color: 'var(--color-on-surface-subtle-2)' }}>Repeat until the design summary is fully covered.</span><br />
          <span style={{ color: 'var(--color-on-surface-subtle-2)' }}>Then: check-tokens audit → playwright visual regression.</span>
        </div>
      </Section>

      <Section title="The full sequence" level="minor">
        <div
          className="rounded-lg border px-8 py-6 font-mono text-sm leading-loose"
          style={{
            backgroundColor: 'var(--color-surface-1)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-on-surface)',
          }}
        >
          grill-component &nbsp;→ confirmed design summary<br />
          write spec &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ specs/ComponentName.md<br />
          tdd-component &nbsp;&nbsp;→ tests + implementation<br />
          check-tokens &nbsp;&nbsp;&nbsp;→ token compliance audit<br />
          playwright-test &nbsp;→ visual regression + a11y<br />
          doc page &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ add to styleguide + nav<br />
        </div>
      </Section>
    </>
  );
}
