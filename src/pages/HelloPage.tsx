/**
 * HelloPage — landing page for the Kvalt Design System
 * Five top-level section cards linking to hub pages.
 * Each card has an animated stroke icon that draws on hover.
 */

import {
  Palette,
  Hexagon,
  LibraryBig,
  Vault,
  PocketKnife,
} from 'lucide-react';
import { HubCard } from '../components/HubCard';
import { HubIcon } from '../components/HubIcon';
import { PageHero } from '../layouts/PageHero';

interface HelloPageProps {
  onNavigate?: (pageId: string) => void;
}

const SECTIONS: {
  id: string;
  title: string;
  subtitle: string;
  icon: typeof Palette;
}[] = [
  {
    id: 'foundations',
    title: 'Foundations',
    subtitle: '// colors, type, motion, spacing. the ground floor',
    icon: Palette,
  },
  {
    id: 'components',
    title: 'Components',
    subtitle: '// 25 components. all animated. all accessible',
    icon: Hexagon,
  },
  {
    id: 'philosophy',
    title: 'Philosophy',
    subtitle: '// motion, voice, accessibility. the opinions live here',
    icon: LibraryBig,
  },
  {
    id: 'screen-vault',
    title: 'Screen Vault',
    subtitle: '// full screens, dark mode. copy-paste and ship',
    icon: Vault,
  },
  {
    id: 'workshop',
    title: 'Tools',
    subtitle: '// palette generator, characters, forge. where it\'s made',
    icon: PocketKnife,
  },
];

export default function HelloPage({ onNavigate }: HelloPageProps) {
  return (
    <section className="mb-20 relative">
      <PageHero
        title="Kvalt is speed. A decade of craft."
        subtitle="Tokens decided. Components animated. Arguments settled."
        description="Colors, motion, copy rules, palette generator — every opinion documented, every opinion overridable."
      />

      <div className="grid grid-cols-2 gap-3">
        {SECTIONS.map((s, i) => (
          <HubCard
            key={s.id}
            title={s.title}
            subtitle={s.subtitle}
            titleSize="clamp(2.5rem, 4vw, 3.25rem)"
            minHeight={280}
            delay={i * 0.06}
            onClick={() => onNavigate?.(s.id)}
            illustration={(hovered) => (
              <HubIcon icon={s.icon} hovered={hovered} />
            )}
          />
        ))}
      </div>
    </section>
  );
}
