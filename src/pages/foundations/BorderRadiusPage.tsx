import { PageHero } from '../../layouts/PageHero';
import { Card, SectionTitle } from '../../layouts/DocHelpers';

export default function BorderRadiusPage() {
  return (
    <section className="mb-24">
      <PageHero
        title="Radius"
        subtitle="Six tokens. The rest is just not allowed."
        description="xs, s, m, lg, 2xl, xl. 4px, 6px, 8px, 12px, 20px, pill. If you find yourself reaching for something else, the answer is no. The constraint is the feature."
      />

      <SectionTitle>Radius tokens</SectionTitle>
      <Card>
        <div className="flex gap-16 items-end">
          {[
            { name: 'radius-xs',  value: '4px',   radius: 'var(--radius-xs)',  desc: 'Micro rounding, split button inner corners' },
            { name: 'radius-s',   value: '6px',   radius: 'var(--radius-s)',   desc: 'Small controls, tags, badges' },
            { name: 'radius-m',   value: '8px',   radius: 'var(--radius-m)',   desc: 'Inputs, buttons, chips' },
            { name: 'radius-lg',  value: '12px',  radius: 'var(--radius-lg)',  desc: 'Cards, modals, panels' },
            { name: 'radius-2xl', value: '20px',  radius: 'var(--radius-2xl)', desc: 'Large containers, hero sections' },
            { name: 'radius-xl',  value: 'pill',  radius: 'var(--radius-xl)',  desc: 'Fully rounded, buttons, badges' },
          ].map((r) => (
            <div key={r.name} className="flex flex-col gap-4 items-start">
              <div style={{ width: '120px', height: '120px', borderRadius: r.radius, backgroundColor: 'var(--color-primary-1)' }} />
              <div>
                <p className="font-display text-headline-s font-bold" style={{ color: 'var(--color-on-surface)' }}>{r.name}</p>
                <p className="font-sans text-md font-semibold" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{r.value}</p>
                <p className="font-sans text-sm mt-1" style={{ color: 'var(--color-on-surface-subtle-2)' }}>{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}
