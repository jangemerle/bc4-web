import {
  Droplets,
  Type,
  Layers,
  Circle,
  Feather,
  Paintbrush,
  Space,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { HubCard } from '../components/HubCard';
import { HubIcon } from '../components/HubIcon';
import { PageHero } from '../layouts/PageHero';

interface FoundationsHubPageProps {
  onNavigate?: (id: string) => void;
}

const ITEMS: { id: string; title: string; subtitle: string; icon: LucideIcon }[] = [
  { id: 'colors',            title: 'Colors',            subtitle: '// 7 scales, OKLCH-native. dark mode isn\'t an afterthought', icon: Droplets },
  { id: 'typography',        title: 'Typography',        subtitle: '// 4 families, each with a job. no font is decorative',       icon: Type },
  { id: 'shadows',           title: 'Shadows',           subtitle: '// 9 tokens, 3 intensities. elevation you can name',          icon: Layers },
  { id: 'border-radius',     title: 'Border Radius',     subtitle: '// 5 steps. rounded-xl is earned, not default',               icon: Circle },
  { id: 'icons',             title: 'Icons',             subtitle: '// 900+ Lucide icons. 4 sizes. all stroke, no fill',           icon: Feather },
  { id: 'illustrations',     title: 'Illustrations',     subtitle: '// hand-drawn watercolor. auto-matched to content',           icon: Paintbrush },
  { id: 'spacing',           title: 'Spacing',           subtitle: '// 4px grid. every gap has a name and a reason',               icon: Space },
].sort((a, b) => a.title.localeCompare(b.title));

export default function FoundationsHubPage({ onNavigate }: FoundationsHubPageProps) {
  return (
    <section className="mb-24">
      <PageHero
        title="Foundations"
        subtitle="The atoms everything is built from."
        description="Colors, type, space, motion — every raw token that components are made of."
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
