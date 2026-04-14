import { Layers, PenLine, SlidersHorizontal } from 'lucide-react';
import { PageHero } from '../../layouts/PageHero';
import { FloatingSectionNav } from '../../components/FloatingSectionNav';
import { useSectionNav } from '../../hooks/useSectionNav';
import UXCopywriting from '../UXCopywriting';

export default function UXCopywritingPage() {
  const sectionNav = useSectionNav(['frameworks', 'writing', 'calibration'] as const);

  return (
    <>
      <PageHero
        title="UX Copywriting"
        subtitle="Words that work"
        description="Writing patterns for buttons, errors, empty states, and every other touchpoint where words matter."
      />

      <FloatingSectionNav
        items={[
          { value: 'frameworks', label: 'Frameworks', icon: Layers },
          { value: 'writing', label: 'Writing', icon: PenLine },
          { value: 'calibration', label: 'Calibration', icon: SlidersHorizontal },
        ]}
        activeSection={sectionNav.activeSection}
        pinned={sectionNav.pinned}
        inlineRef={sectionNav.inlineRef}
        onChange={sectionNav.handleChange}
      />

      <UXCopywriting
        sectionRefs={{
          frameworks: sectionNav.setSectionRef('frameworks'),
          writing: sectionNav.setSectionRef('writing'),
          calibration: sectionNav.setSectionRef('calibration'),
        }}
      />
    </>
  );
}
