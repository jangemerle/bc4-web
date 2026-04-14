import { Badge } from '../../components/Badge';
import { Tabs, Tab } from '../../components/Tabs';
import { PageHero } from '../../layouts/PageHero';
import { Section } from '../../layouts/Section';
import { Card, SectionTitle, Spec, TokenChips } from '../../layouts/DocHelpers';

export default function BadgePage() {
  return (
    <>
      <PageHero
        title="Badge"
        subtitle="The number that says 'this needs you'"
        description="Two variants: neutral (informational count) and accent (attention required). One badge per nav context when using accent — multiple red dots mean nothing is actually urgent. Zero count? Remove the badge entirely. Don't show zero."
      />

      <TokenChips tokens={{ Sizes: ['sm', 'md'], Variants: ['neutral', 'accent'] }} />

      <SectionTitle>Variants</SectionTitle>
      <Card>
        <Spec>Neutral (surface-3 bg) · Accent (danger-1 bg, white text)</Spec>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <Badge>2</Badge>
            <Badge>15</Badge>
            <Badge>99+</Badge>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="accent">2</Badge>
            <Badge variant="accent">15</Badge>
            <Badge variant="accent">99+</Badge>
          </div>
        </div>
      </Card>

      <div className="mt-12" />
      <SectionTitle>Sizes</SectionTitle>
      <Card>
        <Spec>sm (16px min-w, 10px text) · md (20px min-w, 12px text)</Spec>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <span className="font-sans text-md font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>sm</span>
            <Badge size="sm">2</Badge>
            <Badge size="sm" variant="accent">2</Badge>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-sans text-md font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>md</span>
            <Badge size="md">2</Badge>
            <Badge size="md" variant="accent">2</Badge>
          </div>
        </div>
      </Card>

      <div className="mt-12" />
      <SectionTitle>In context</SectionTitle>
      <Card>
        <Spec>Used inside Tab component</Spec>
        <Tabs value="messages" size="md">
          <Tab value="overview">Overview</Tab>
          <Tab value="messages" badge={3}>Messages</Tab>
          <Tab value="settings">Settings</Tab>
        </Tabs>
      </Card>

      <Section title="Writing rules" level="minor">
        <div className="flex flex-col gap-3" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
          <p className="font-sans text-md"><strong style={{ color: 'var(--color-on-surface)' }}>Numeric only.</strong> Badge holds counts, not labels. "3" yes. "New" no.</p>
          <p className="font-sans text-md"><strong style={{ color: 'var(--color-on-surface)' }}>Cap at 99+.</strong> Anything above 99 shows "99+". Never change this cap per feature.</p>
          <p className="font-sans text-md"><strong style={{ color: 'var(--color-on-surface)' }}>Accent = urgent, default = informational.</strong> Don't use accent for counts that are just FYI.</p>
          <p className="font-sans text-md"><strong style={{ color: 'var(--color-on-surface)' }}>One accent badge per navigation context.</strong> Multiple red badges competing = none of them matter.</p>
          <p className="font-sans text-md"><strong style={{ color: 'var(--color-on-surface)' }}>Zero state = no badge.</strong> Remove the component entirely when count is 0. Don't show "0".</p>
        </div>
      </Section>
    </>
  );
}
