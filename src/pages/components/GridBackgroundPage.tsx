import { GridBackground } from '../../components/GridBackground';
import { PageHero } from '../../layouts/PageHero';
import { Card, SectionTitle, Spec, TokenChips } from '../../layouts/DocHelpers';

export default function GridBackgroundPage() {
  return (
    <>
      <PageHero
        title="Grid Background"
        subtitle="Scoped repeating-pattern surface · inherits from active character · dots, lines, cross, custom"
        description="A small primitive that paints a repeating pattern behind children. By default it reads the active character's --bg-pattern variable, so Kavárna (or any themed character) paints through automatically. Pass explicit props to override for a scoped section."
      />

      <TokenChips
        tokens={{
          Patterns: ['inherit', 'dots', 'lines', 'cross', 'custom'],
          CSSVars: ['--bg-pattern', '--bg-pattern-size'],
          Defaults: ['size=24', 'color=--color-border'],
        }}
      />

      {/* ══ INHERIT ══════════════════════════════════════════════════════════ */}
      <SectionTitle>Inherit (follows character)</SectionTitle>
      <Card>
        <Spec>
          Default mode · reads --bg-pattern + --bg-pattern-size · switch to
          Kavárna in the sidebar to see peach dots paint through
        </Spec>
        <GridBackground
          className="rounded-lg p-8 h-[200px] flex items-center justify-center"
          style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
        >
          <span
            className="font-mono text-xs"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            pattern="inherit"  ·  follows active character
          </span>
        </GridBackground>
      </Card>

      {/* ══ BUILT-IN PATTERNS ════════════════════════════════════════════════ */}
      <div className="mt-12" />
      <SectionTitle>Built-in patterns</SectionTitle>
      <Card>
        <Spec>dots · lines · cross · all respect size + color props</Spec>
        <div className="grid grid-cols-3 gap-4">
          {(['dots', 'lines', 'cross'] as const).map((p) => (
            <GridBackground
              key={p}
              pattern={p}
              size={20}
              color="var(--color-border-strong)"
              className="rounded-lg p-6 h-[160px] flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}
            >
              <span
                className="font-mono text-xs px-2 py-1 rounded"
                style={{
                  backgroundColor: 'var(--color-surface-1)',
                  color: 'var(--color-on-surface-subtle-1)',
                }}
              >
                pattern="{p}"
              </span>
            </GridBackground>
          ))}
        </div>
      </Card>

      {/* ══ SIZE + COLOR ═════════════════════════════════════════════════════ */}
      <div className="mt-12" />
      <SectionTitle>Size & color</SectionTitle>
      <Card>
        <Spec>Scale the step via size · override the stroke via color</Spec>
        <div className="grid grid-cols-3 gap-4">
          {[
            { size: 12, color: 'var(--color-primary-1)', label: 'size=12' },
            { size: 24, color: 'var(--color-on-secondary-1)', label: 'size=24' },
            { size: 40, color: 'var(--color-border-strong)', label: 'size=40' },
          ].map((cfg) => (
            <GridBackground
              key={cfg.label}
              pattern="dots"
              size={cfg.size}
              color={cfg.color}
              className="rounded-lg p-6 h-[140px] flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}
            >
              <span
                className="font-mono text-xs px-2 py-1 rounded"
                style={{
                  backgroundColor: 'var(--color-surface-1)',
                  color: 'var(--color-on-surface-subtle-1)',
                }}
              >
                {cfg.label}
              </span>
            </GridBackground>
          ))}
        </div>
      </Card>

      {/* ══ USAGE ════════════════════════════════════════════════════════════ */}
      <div className="mt-12" />
      <SectionTitle>Usage</SectionTitle>
      <Card>
        <Spec>Hero sections, canvas backgrounds, character-themed paper</Spec>
        <pre
          className="font-mono text-sm p-5 rounded-lg overflow-x-auto"
          style={{
            backgroundColor: 'var(--color-surface-2)',
            color: 'var(--color-on-surface)',
          }}
        >
{`import { GridBackground } from '@/components/GridBackground';

// Follows active character (Kavárna paints peach dots automatically)
<GridBackground className="min-h-screen">
  <Hero />
</GridBackground>

// Scoped dot grid, ignores character
<GridBackground pattern="dots" size={20} color="var(--color-primary-1)">
  <Section />
</GridBackground>

// Custom background-image — full control
<GridBackground
  pattern="custom"
  image="url('/textures/paper.svg')"
  size="120px 120px"
/>`}
        </pre>
      </Card>

      {/* ══ CHARACTER TOKENS ═════════════════════════════════════════════════ */}
      <div className="mt-12" />
      <SectionTitle>Character integration</SectionTitle>
      <Card>
        <Spec>Characters set --bg-pattern via the backgroundPattern seed field</Spec>
        <pre
          className="font-mono text-sm p-5 rounded-lg overflow-x-auto"
          style={{
            backgroundColor: 'var(--color-surface-2)',
            color: 'var(--color-on-surface)',
          }}
        >
{`const kavarnaSeed: CharacterSeed = {
  // …
  backgroundPattern: {
    image: 'radial-gradient(circle, oklch(0.72 0.15 22 / 0.22) 1px, transparent 1px)',
    size: '24px 24px',
  },
};`}
        </pre>
        <p
          className="font-sans text-md mt-4 max-w-[720px]"
          style={{ color: 'var(--color-on-surface-subtle-1)' }}
        >
          The body reads --bg-pattern directly, so site-wide painting happens
          without any component work. GridBackground is only needed for scoped
          surfaces that want their own pattern independent of the character.
        </p>
      </Card>
    </>
  );
}
