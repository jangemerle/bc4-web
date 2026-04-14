import { Eye, Hammer } from 'lucide-react';
import { PageHero } from '../../layouts/PageHero';
import { FloatingSectionNav } from '../../components/FloatingSectionNav';
import { useSectionNav } from '../../hooks/useSectionNav';
import DesignPrinciples from '../DesignPrinciples';

export default function DesignPrinciplesPage() {
  const sectionNav = useSectionNav(['perception', 'craft'] as const);

  return (
    <>
      <PageHero
        title="Design Principles"
        subtitle="The rules we design by"
        description="Core principles that guide every decision in the Kvalt design system, from token discipline to motion philosophy."
      />

      <FloatingSectionNav
        items={[
          { value: 'perception', label: 'Perception', icon: Eye },
          { value: 'craft', label: 'Craft', icon: Hammer },
        ]}
        activeSection={sectionNav.activeSection}
        pinned={sectionNav.pinned}
        inlineRef={sectionNav.inlineRef}
        onChange={sectionNav.handleChange}
      />

      <DesignPrinciples setSectionRef={sectionNav.setSectionRef} />
    </>
  );
}
