import { GlassSurface } from '../../components/GlassSurface';
import { PageHero } from '../../layouts/PageHero';
import { Card, SectionTitle, Spec, TokenChips } from '../../layouts/DocHelpers';

const DEMO_BG =
  'radial-gradient(circle at 20% 30%, var(--color-primary-2) 0%, transparent 50%), radial-gradient(circle at 80% 70%, var(--color-secondary-2) 0%, transparent 50%), var(--color-surface-2)';

export default function GlassSurfacePage() {
  return (
    <>
      <PageHero
        title="Glass Surface"
        subtitle="Frosted-glass primitive · tinted opacity + backdrop blur · 3 variants"
        description="A thin wrapper around backdrop-filter that pairs a semi-opaque tint with a blur. The opacity does the legibility work, the blur is flavour. One component, one token file, one place to tune performance."
      />

      <TokenChips
        tokens={{
          Variants: ['subtle', 'default', 'strong'],
          Blur: ['6px', '12px', '20px'],
          Opacity: ['60%', '70%', '80%'],
          Props: ['variant', 'tint', 'animating'],
        }}
      />

      {/* ══ VARIANTS ═════════════════════════════════════════════════════════ */}
      <SectionTitle>Variants</SectionTitle>
      <Card>
        <Spec>subtle (6px / 60%) · default (12px / 70%) · strong (20px / 80%)</Spec>
        <div
          className="relative rounded-lg overflow-hidden h-[320px] p-8 flex flex-col gap-4 justify-center"
          style={{ background: DEMO_BG }}
        >
          {(['subtle', 'default', 'strong'] as const).map((v) => (
            <GlassSurface
              key={v}
              variant={v}
              className="rounded-lg px-5 py-4 flex items-center justify-between"
              style={{ border: '1px solid var(--color-border)' }}
            >
              <span
                className="font-display font-semibold text-headline-s"
                style={{ color: 'var(--color-on-surface)' }}
              >
                variant="{v}"
              </span>
              <span
                className="font-mono text-xs"
                style={{ color: 'var(--color-on-surface-subtle-1)' }}
              >
                {v === 'subtle' ? 'blur(6px) · 60%' : v === 'default' ? 'blur(12px) · 70%' : 'blur(20px) · 80%'}
              </span>
            </GlassSurface>
          ))}
        </div>
      </Card>

      {/* ══ TINT ══════════════════════════════════════════════════════════════ */}
      <div className="mt-12" />
      <SectionTitle>Tint</SectionTitle>
      <Card>
        <Spec>
          Pass any CSS color as tint · defaults to var(--color-bg) · use a surface
          token when the glass sits over a non-default background
        </Spec>
        <div
          className="relative rounded-lg overflow-hidden h-[240px] p-8 flex gap-4 items-center justify-center"
          style={{ background: DEMO_BG }}
        >
          <GlassSurface
            variant="default"
            className="rounded-lg px-5 py-4 font-mono text-xs"
            style={{ color: 'var(--color-on-surface)' }}
          >
            tint="var(--color-bg)"
          </GlassSurface>
          <GlassSurface
            variant="default"
            tint="var(--color-surface-2)"
            className="rounded-lg px-5 py-4 font-mono text-xs"
            style={{ color: 'var(--color-on-surface)' }}
          >
            tint="var(--color-surface-2)"
          </GlassSurface>
          <GlassSurface
            variant="default"
            tint="var(--color-primary-1)"
            className="rounded-lg px-5 py-4 font-mono text-xs"
            style={{ color: 'var(--color-on-primary)' }}
          >
            tint="var(--color-primary-1)"
          </GlassSurface>
        </div>
      </Card>

      {/* ══ PERFORMANCE NOTES ════════════════════════════════════════════════ */}
      <div className="mt-12" />
      <SectionTitle>Performance notes</SectionTitle>
      <Card>
        <Spec>Read these before using glass on large surfaces</Spec>
        <ul
          className="font-sans text-md flex flex-col gap-3 max-w-[720px]"
          style={{ color: 'var(--color-on-surface)', listStyle: 'disc', paddingLeft: 20 }}
        >
          <li>
            Cost scales with <em>blurred area × blur radius</em>. Full-viewport
            strong glass on low-end hardware drops frames.
          </li>
          <li>
            Keep blur radius ≤ 12px for large areas. Save 16–24px for small
            islands: menus, toasts, pills.
          </li>
          <li>
            Never animate the <code>backdrop-filter</code> value itself. Fade
            the opacity of the glass layer instead.
          </li>
          <li>
            Set <code>animating</code> to true only while the surface is mid-transition
            — the component will apply <code>will-change: backdrop-filter</code>. Clear
            it afterwards so the GPU can reclaim memory.
          </li>
          <li>
            Avoid glass-on-glass. Stacked backdrop filters force extra
            composite passes.
          </li>
          <li>
            Legibility comes from opacity, not blur. If text looks washy,
            raise the tint opacity before reaching for a bigger radius.
          </li>
        </ul>
      </Card>

      {/* ══ USAGE ════════════════════════════════════════════════════════════ */}
      <div className="mt-12" />
      <SectionTitle>Usage</SectionTitle>
      <Card>
        <Spec>Sticky headers, modal overlays, floating panels</Spec>
        <pre
          className="font-mono text-sm p-5 rounded-lg overflow-x-auto"
          style={{
            backgroundColor: 'var(--color-surface-2)',
            color: 'var(--color-on-surface)',
          }}
        >
{`import { GlassSurface } from '@/components/GlassSurface';

// Sticky header, default tint
<GlassSurface variant="default" className="sticky top-0 px-6 py-4">
  <Nav />
</GlassSurface>

// Overlay on a coloured canvas
<GlassSurface
  variant="strong"
  tint="var(--color-surface-2)"
  className="absolute inset-x-0 top-0 px-6 py-4"
>
  <Header />
</GlassSurface>

// Animated entrance — set animating while the transition runs
<GlassSurface variant="default" animating={isOpening}>
  <Panel />
</GlassSurface>`}
        </pre>
      </Card>
    </>
  );
}
