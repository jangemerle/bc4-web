import { Home, Ruler, Library } from 'lucide-react';
import { Icon } from '../../components/Icon';
import { PageHero } from '../../layouts/PageHero';
import { Card, SectionTitle, Spec } from '../../layouts/DocHelpers';
import { FloatingSectionNav } from '../../components/FloatingSectionNav';
import { useSectionNav } from '../../hooks/useSectionNav';
import IconsPageGrid from '../IconsPage';

export default function IconsPage() {
  const sectionNav = useSectionNav(['scale', 'library'] as const);

  return (
    <section className="mb-24">
      <PageHero
        title="Icons"
        subtitle="600 icons. Four sizes. One non-negotiable."
        description="Lucide React, wrapped. strokeWidth 2. Color via currentColor, never inline. Swap any icon for any other — the grid holds. The only thing allowed to change is the symbol."
      />

      <FloatingSectionNav
        items={[
          { value: 'scale', label: 'Scale', icon: Ruler },
          { value: 'library', label: 'Library', icon: Library },
        ]}
        activeSection={sectionNav.activeSection}
        pinned={sectionNav.pinned}
        inlineRef={sectionNav.inlineRef}
        onChange={sectionNav.handleChange}
      />

      {/* ══ SCALE ════════════════════════════════════════════════════════════ */}
      <div ref={sectionNav.setSectionRef('scale')} className="scroll-mt-8">
        <div className="mb-16">
          <h2
            className="font-brand font-bold leading-[0.95] mb-6"
            style={{ fontSize: 'clamp(56px, 7vw, 104px)', color: 'var(--color-on-surface)' }}
          >
            SCALE
          </h2>
          <p className="font-sans text-lg max-w-2xl" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
            Four sizes, one stroke weight. Every icon snaps to the same optical grid — swap any icon for another and the layout holds. No exceptions.
          </p>
        </div>

        <SectionTitle>Size scale</SectionTitle>
        <Card>
          <Spec>Size scale — strokeWidth 2</Spec>
          <div className="flex items-end gap-10">
            {([
              { size: 'sm', px: '16px', label: 'sm' },
              { size: 'md', px: '20px', label: 'md' },
              { size: 'lg', px: '24px', label: 'lg — default' },
              { size: 'xl', px: '32px', label: 'xl' },
            ] as { size: 'sm' | 'md' | 'lg' | 'xl'; px: string; label: string }[]).map((s) => (
              <div key={s.size} className="flex flex-col items-start gap-3">
                <Icon icon={Home} size={s.size} style={{ color: 'var(--color-on-surface)' }} />
                <div>
                  <p className="font-display text-headline-s font-bold" style={{ color: 'var(--color-on-surface)' }}>{s.label}</p>
                  <p className="font-sans text-md font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{s.px}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ══ LIBRARY ══════════════════════════════════════════════════════════ */}
      <div ref={sectionNav.setSectionRef('library')} className="scroll-mt-8">
        <div className="mb-16 mt-24">
          <h2
            className="font-brand font-bold leading-[0.95] mb-6"
            style={{ fontSize: 'clamp(56px, 7vw, 104px)', color: 'var(--color-on-surface)' }}
          >
            LIBRARY
          </h2>
          <p className="font-sans text-lg max-w-2xl" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
            The full Lucide set, searchable and clickable. Find the right metaphor, copy the import, and move on.
          </p>
        </div>

        <IconsPageGrid />
      </div>
    </section>
  );
}
