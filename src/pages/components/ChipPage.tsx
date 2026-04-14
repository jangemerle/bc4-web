import { Star, Heart } from 'lucide-react';
import { Chip } from '../../components/Chip';
import { PageHero } from '../../layouts/PageHero';
import { Section } from '../../layouts/Section';
import { Card, SectionTitle, Spec, TokenChips } from '../../layouts/DocHelpers';

export default function ChipPage() {
  return (
    <>
      <PageHero
        title="Chip"
        subtitle="Labels that imply something can happen to them"
        description="Chips communicate user-applied state — tags, filters, assignees. The hover state exists because something is always possible: remove it, click it, change it. If nothing can happen to the label, don't use a chip. Use a status indicator instead."
      />

      <TokenChips tokens={{ Sizes: ['sm', 'md'], Variants: ['text', 'icon', 'user'], States: ['default', 'hover'], Props: ['removable'] }} />

      <SectionTitle>Sizes</SectionTitle>
      <Card>
        <Spec>sm (12px text · 8px/2px padding) · md (14px text · 12px/3.5px padding) — hover to see state change</Spec>
        <div className="flex items-center gap-3 flex-wrap">
          <Chip size="sm">Small</Chip>
          <Chip size="md">Medium</Chip>
        </div>
      </Card>

      <div className="mt-12" />
      <SectionTitle>Variants</SectionTitle>
      <Card>
        <Spec>Text only</Spec>
        <div className="flex items-center gap-3 flex-wrap mb-8">
          <Chip>Design</Chip>
          <Chip>Development</Chip>
          <Chip>Research</Chip>
          <Chip size="md">Design</Chip>
          <Chip size="md">Development</Chip>
          <Chip size="md">Research</Chip>
        </div>
        <Spec>With icon</Spec>
        <div className="flex items-center gap-3 flex-wrap mb-8">
          <Chip icon={Star}>Starred</Chip>
          <Chip icon={Heart}>Favorite</Chip>
          <Chip size="md" icon={Star}>Starred</Chip>
          <Chip size="md" icon={Heart}>Favorite</Chip>
        </div>
        <Spec>With user avatar</Spec>
        <div className="flex items-center gap-3 flex-wrap mb-8">
          <Chip size="md" user={{ initials: 'DT' }}>David T.</Chip>
          <Chip size="md" user={{ initials: 'JK' }}>Jan K.</Chip>
          <Chip size="md" user={{ initials: 'AB' }}>Anna B.</Chip>
        </div>
        <Spec>Removable</Spec>
        <div className="flex items-center gap-3 flex-wrap">
          <Chip removable>Removable</Chip>
          <Chip size="md" removable>Removable</Chip>
          <Chip size="md" icon={Star} removable>Starred</Chip>
          <Chip size="md" user={{ initials: 'DT' }} removable>David T.</Chip>
        </div>
      </Card>

      <Section title="Writing rules" level="minor">
        <div className="flex flex-col gap-3" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
          <p className="font-sans text-md"><strong style={{ color: 'var(--color-on-surface)' }}>Short nouns.</strong> "Design", "Q2 2025", "In review". Not sentences.</p>
          <p className="font-sans text-md"><strong style={{ color: 'var(--color-on-surface)' }}>Sentence case.</strong> "In review" not "In Review". Only proper nouns capitalised.</p>
          <p className="font-sans text-md"><strong style={{ color: 'var(--color-on-surface)' }}>Removable = user-chosen.</strong> Only use removable on chips the user applied. System labels are not removable.</p>
          <p className="font-sans text-md"><strong style={{ color: 'var(--color-on-surface)' }}>Don't use chips as status.</strong> "Active", "Pending", "Archived" are status labels. Chips imply interactivity — if nothing can happen to it, it's not a chip.</p>
        </div>
      </Section>
    </>
  );
}
