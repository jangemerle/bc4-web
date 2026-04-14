import {
  Telescope,
  Drama,
  ArrowRightLeft,
  Hammer,
  Bot,
  Type,
  ImageDown,
  Palette as PaletteIcon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { HubCard } from '../components/HubCard';
import { HubIcon } from '../components/HubIcon';
import { PageHero } from '../layouts/PageHero';

interface WorkshopHubPageProps {
  onNavigate?: (id: string) => void;
}

const ITEMS: { id: string; title: string; subtitle: string; icon: LucideIcon }[] = [
  { id: 'workshop-design-exploration', title: 'Design Exploration',   subtitle: '// 6 agents, concept briefs, voice scoring. taste at scale',                  icon: Telescope },
  { id: 'workshop-characters',         title: 'Characters',           subtitle: '// one mood in, 53 CSS variables out. personality as config',                  icon: Drama },
  { id: 'workshop-figma-to-code',      title: 'Figma to Code',        subtitle: '// token mapping, audit pipeline. zero hardcoded values or it fails',          icon: ArrowRightLeft },
  { id: 'workshop-component-forge',    title: 'Component Forge',      subtitle: '// design interview → TDD loop. red, green, refactor, ship',                   icon: Hammer },
  { id: 'workshop-agents',             title: 'Multi-Agent Pipeline',  subtitle: '// designer, builder, auditor, debugger. four agents, one opinion',           icon: Bot },
  { id: 'workshop-no-widows',          title: 'No Widows',             subtitle: '// typography fix — single-letter words never end a line',                   icon: Type },
  { id: 'workshop-character-from-image', title: 'Character from Image', subtitle: '// drop a reference, get a CharacterSeed. OKLCH + ΔE2000, fully offline',    icon: ImageDown },
  { id: 'workshop-character-builder',    title: 'Character Builder',    subtitle: '// three palettes, one image. eyedropper primary, secondary, grey in one session', icon: PaletteIcon },
].sort((a, b) => a.title.localeCompare(b.title));

export default function WorkshopHubPage({ onNavigate }: WorkshopHubPageProps) {
  return (
    <section className="mb-24">
      <PageHero
        title="Tools"
        subtitle="How things get made."
        description="The tools, workflows, and AI-assisted processes behind every component, screen, and page in Kvalt. Most design systems show you the what. This is the how."
      />
      <div className="grid grid-cols-3 gap-3">
        {ITEMS.map((item, i) => (
          <HubCard
            key={item.id}
            title={item.title}
            subtitle={item.subtitle}
            delay={i * 0.03}
            onClick={() => onNavigate?.(item.id)}
            illustration={(hovered) => <HubIcon icon={item.icon} hovered={hovered} />}
          />
        ))}
      </div>
    </section>
  );
}
