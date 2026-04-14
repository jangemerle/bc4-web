import { Sparkles, LayoutList, MessageCircle, BadgeCheck } from 'lucide-react';
import { PageHero } from '../../layouts/PageHero';
import { FloatingSectionNav } from '../../components/FloatingSectionNav';
import { useSectionNav } from '../../hooks/useSectionNav';
import ToneOfVoice from '../ToneOfVoice';

export default function ToneOfVoicePage() {
  const sectionNav = useSectionNav(['character', 'patterns', 'moments', 'quality'] as const);

  return (
    <>
      <PageHero
        title="Tone of Voice"
        subtitle="Say it simply, say it well"
        description="Clear, warm, brief — and occasionally sharp. Language that respects the user's intelligence without forgetting it can also make them smile."
      />

      <FloatingSectionNav
        items={[
          { value: 'character', label: 'Character', icon: Sparkles },
          { value: 'patterns', label: 'Patterns', icon: LayoutList },
          { value: 'moments', label: 'Moments', icon: MessageCircle },
          { value: 'quality', label: 'Quality', icon: BadgeCheck },
        ]}
        activeSection={sectionNav.activeSection}
        pinned={sectionNav.pinned}
        inlineRef={sectionNav.inlineRef}
        onChange={sectionNav.handleChange}
      />

      <ToneOfVoice
        sectionRefs={{
          character: sectionNav.setSectionRef('character'),
          patterns: sectionNav.setSectionRef('patterns'),
          moments: sectionNav.setSectionRef('moments'),
          quality: sectionNav.setSectionRef('quality'),
        }}
      />
    </>
  );
}
