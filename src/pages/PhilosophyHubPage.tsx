import {
  Accessibility,
  Ruler,
  Paintbrush,
  Zap,
  Receipt,
  MessageCircle,
  PenTool,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { HubCard } from '../components/HubCard';
import { HubIcon } from '../components/HubIcon';
import { PageHero } from '../layouts/PageHero';

interface PhilosophyHubPageProps {
  onNavigate?: (id: string) => void;
}

const ITEMS: { id: string; title: string; subtitle: string; icon: LucideIcon }[] = [
  { id: 'accessibility',     title: 'Accessibility',     subtitle: '// if it\'s not accessible, it\'s not done',                   icon: Accessibility },
  { id: 'design-principles', title: 'Design Principles', subtitle: '// the rules behind the rules. all 8 of them',                icon: Ruler },
  { id: 'illustration',      title: 'Illustration',      subtitle: '// hand-drawn, not generated. personality on purpose',         icon: Paintbrush },
  { id: 'motion-guidelines', title: 'Motion',            subtitle: '// springs, not tweens. 240ms was chosen, not guessed',        icon: Zap },
  { id: 'pricing',           title: 'Pricing',           subtitle: '// founding designer certificate. no subscription',            icon: Receipt },
  { id: 'tone-of-voice',     title: 'Tone of Voice',     subtitle: '// direct, dry, quietly confident. no exclamation marks',      icon: MessageCircle },
  { id: 'ux-copywriting',    title: 'UX Copywriting',    subtitle: '// words that work. "Click here" was retired on day one',      icon: PenTool },
].sort((a, b) => a.title.localeCompare(b.title));

export default function PhilosophyHubPage({ onNavigate }: PhilosophyHubPageProps) {
  return (
    <section className="mb-24">
      <PageHero
        title="Philosophy"
        subtitle="Why Kvalt makes the decisions it makes."
        description="The principles, voice, and values that every design decision flows from."
      />
      <div className="grid grid-cols-3 gap-3">
        {ITEMS.map((item, i) => (
          <HubCard
            key={item.id}
            title={item.title}
            subtitle={item.subtitle}
            delay={i * 0.04}
            onClick={() => onNavigate?.(item.id)}
            illustration={(hovered) => <HubIcon icon={item.icon} hovered={hovered} />}
          />
        ))}
      </div>
    </section>
  );
}
