import { Skeleton } from '../../components/Skeleton';
import { PageHero } from '../../layouts/PageHero';
import { Card, SectionTitle, Spec, TokenChips } from '../../layouts/DocHelpers';

export default function SkeletonPage() {
  return (
    <>
      <PageHero
        title="Skeleton"
        subtitle="Animated loading placeholders · bounce animation (spring.playful) · 3 variants"
        description="Content placeholder components that indicate loading state with configurable animation styles, multiple shape variants, and pre-composed layout patterns."
      />

      <TokenChips tokens={{ Variants: ['text', 'circular', 'rectangular'], Sizes: ['sm', 'md', 'lg'], Animations: ['bounce', 'pulse', 'wave', 'none'], Compositions: ['Card', 'List', 'Profile', 'Stats'] }} />

      {/* ══ SHAPES ═══════════════════════════════════════════════════════════ */}
      <SectionTitle>Text lines</SectionTitle>
      <Card>
        <Spec>Single line · Multi-line (last line 70%) · Sizes sm/md/lg</Spec>
        <div className="flex flex-col gap-8 max-w-[480px]">
          <div>
            <p className="font-sans text-xs font-medium mb-3" style={{ color: 'var(--color-on-surface-subtle-1)' }}>Single line (md)</p>
            <Skeleton />
          </div>
          <div>
            <p className="font-sans text-xs font-medium mb-3" style={{ color: 'var(--color-on-surface-subtle-1)' }}>3 lines (md)</p>
            <Skeleton lines={3} />
          </div>
          <div>
            <p className="font-sans text-xs font-medium mb-3" style={{ color: 'var(--color-on-surface-subtle-1)' }}>Size comparison</p>
            <div className="flex flex-col gap-4">
              {(['sm', 'md', 'lg'] as const).map(s => (
                <div key={s} className="flex items-center gap-3">
                  <span className="font-mono text-xs w-6" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{s}</span>
                  <div className="flex-1"><Skeleton size={s} width="80%" /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-12" />
      <SectionTitle>Circular & Rectangular</SectionTitle>
      <Card>
        <Spec>Avatar placeholders · Image/card placeholders</Spec>
        <div className="flex items-end gap-8">
          <div className="flex flex-col items-center gap-2">
            <Skeleton variant="circular" size="sm" />
            <span className="font-mono text-xs" style={{ color: 'var(--color-on-surface-subtle-1)' }}>sm</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Skeleton variant="circular" size="md" />
            <span className="font-mono text-xs" style={{ color: 'var(--color-on-surface-subtle-1)' }}>md</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Skeleton variant="circular" size="lg" />
            <span className="font-mono text-xs" style={{ color: 'var(--color-on-surface-subtle-1)' }}>lg</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-2">
            <Skeleton variant="rectangular" height={100} />
            <span className="font-mono text-xs" style={{ color: 'var(--color-on-surface-subtle-1)' }}>rectangular</span>
          </div>
        </div>
      </Card>

      <div className="mt-12" />
      {/* ══ ANIMATION ════════════════════════════════════════════════════════ */}
      <SectionTitle>Animation styles</SectionTitle>
      <Card>
        <Spec>bounce (default, spring.playful) · pulse · wave · none</Spec>
        <div className="grid grid-cols-2 gap-6 max-w-[600px]">
          {(['bounce', 'pulse', 'wave', 'none'] as const).map(anim => (
            <div key={anim}>
              <p className="font-mono text-xs font-medium mb-3" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{anim}</p>
              <Skeleton lines={2} animation={anim} />
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-12" />
      {/* ══ PATTERNS ═════════════════════════════════════════════════════════ */}
      <SectionTitle>Pre-composed patterns</SectionTitle>
      <Card>
        <Spec>Skeleton.Card · Skeleton.List · Skeleton.Profile · Skeleton.Stats</Spec>
        <div className="flex flex-col gap-8">
          <div>
            <p className="font-sans text-sm font-bold mb-3" style={{ color: 'var(--color-on-surface)' }}>Skeleton.Stats</p>
            <Skeleton.Stats count={4} />
          </div>
          <div>
            <p className="font-sans text-sm font-bold mb-3" style={{ color: 'var(--color-on-surface)' }}>Skeleton.Profile</p>
            <Skeleton.Profile />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="font-sans text-sm font-bold mb-3" style={{ color: 'var(--color-on-surface)' }}>Skeleton.Card</p>
              <Skeleton.Card />
            </div>
            <div>
              <p className="font-sans text-sm font-bold mb-3" style={{ color: 'var(--color-on-surface)' }}>Skeleton.List</p>
              <Skeleton.List rows={4} />
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
