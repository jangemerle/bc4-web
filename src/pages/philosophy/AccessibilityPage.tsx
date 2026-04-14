import { Brain, MousePointerClick, Code, TestTubeDiagonal } from 'lucide-react';
import { PageHero } from '../../layouts/PageHero';
import { FloatingSectionNav } from '../../components/FloatingSectionNav';
import { useSectionNav } from '../../hooks/useSectionNav';
import Accessibility from '../Accessibility';

export default function AccessibilityPage() {
  const sectionNav = useSectionNav(['mindset', 'interaction', 'semantics', 'testing'] as const);

  return (
    <>
      <PageHero
        title="Accessibility"
        subtitle="Built in, not bolted on"
        description="WCAG AA compliance, visible focus rings, keyboard navigation, reduced motion support, and semantic HTML throughout."
      />

      <FloatingSectionNav
        items={[
          { value: 'mindset', label: 'Mindset', icon: Brain },
          { value: 'interaction', label: 'Interaction', icon: MousePointerClick },
          { value: 'semantics', label: 'Semantics', icon: Code },
          { value: 'testing', label: 'Testing', icon: TestTubeDiagonal },
        ]}
        activeSection={sectionNav.activeSection}
        pinned={sectionNav.pinned}
        inlineRef={sectionNav.inlineRef}
        onChange={sectionNav.handleChange}
      />

      <Accessibility
        sectionRefs={{
          mindset: sectionNav.setSectionRef('mindset'),
          interaction: sectionNav.setSectionRef('interaction'),
          semantics: sectionNav.setSectionRef('semantics'),
          testing: sectionNav.setSectionRef('testing'),
        }}
      />
    </>
  );
}
