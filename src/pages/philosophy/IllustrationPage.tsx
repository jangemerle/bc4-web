import { Fingerprint, Palette, CheckSquare } from 'lucide-react';
import { PageHero } from '../../layouts/PageHero';
import { FloatingSectionNav } from '../../components/FloatingSectionNav';
import { useSectionNav } from '../../hooks/useSectionNav';
import IllustrationPhilosophy from '../IllustrationPhilosophy';

export default function IllustrationPage() {
  const sectionNav = useSectionNav(['identity', 'elements', 'practice'] as const);

  return (
    <>
      <PageHero
        title="Illustration"
        subtitle="The right illustration at the right moment of the flow"
        description="Not every screen needs one. Not every empty state deserves the same asset. This page covers when to use illustration, what kind, and how to know when you've reached for one because it's convenient rather than because it's correct."
      />

      <FloatingSectionNav
        items={[
          { value: 'identity', label: 'Identity', icon: Fingerprint },
          { value: 'elements', label: 'Elements', icon: Palette },
          { value: 'practice', label: 'Practice', icon: CheckSquare },
        ]}
        activeSection={sectionNav.activeSection}
        pinned={sectionNav.pinned}
        inlineRef={sectionNav.inlineRef}
        onChange={sectionNav.handleChange}
      />

      <IllustrationPhilosophy
        sectionRefs={{
          identity: sectionNav.setSectionRef('identity'),
          elements: sectionNav.setSectionRef('elements'),
          practice: sectionNav.setSectionRef('practice'),
        }}
      />
    </>
  );
}
