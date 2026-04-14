import { HubCard } from '../components/HubCard';
import { PageHero } from '../layouts/PageHero';
import { BadgeIllustration } from '../components/illustrations/BadgeIllustration';
import { ButtonIllustration } from '../components/illustrations/ButtonIllustration';
import { CardIllustration } from '../components/illustrations/CardIllustration';
import { CheckboxIllustration } from '../components/illustrations/CheckboxIllustration';
import { ChipIllustration } from '../components/illustrations/ChipIllustration';
import { ContentSwitcherIllustration } from '../components/illustrations/ContentSwitcherIllustration';
import { DataTableIllustration } from '../components/illustrations/DataTableIllustration';
import { DatePickerIllustration } from '../components/illustrations/DatePickerIllustration';
import { DropdownMenuIllustration } from '../components/illustrations/DropdownMenuIllustration';
import { InputIllustration } from '../components/illustrations/InputIllustration';
import { LoadingIndicatorIllustration } from '../components/illustrations/LoadingIndicatorIllustration';
import { ModalIllustration } from '../components/illustrations/ModalIllustration';
import { ModalFullscreenIllustration } from '../components/illustrations/ModalFullscreenIllustration';
import { NumberInputIllustration } from '../components/illustrations/NumberInputIllustration';
import { RadioButtonIllustration } from '../components/illustrations/RadioButtonIllustration';
import { SearchInputIllustration } from '../components/illustrations/SearchInputIllustration';
import { SelectIllustration } from '../components/illustrations/SelectIllustration';
import { SkeletonIllustration } from '../components/illustrations/SkeletonIllustration';
import { TabsIllustration } from '../components/illustrations/TabsIllustration';
import { TextAreaIllustration } from '../components/illustrations/TextAreaIllustration';
import { ToggleIllustration } from '../components/illustrations/ToggleIllustration';
import { TooltipIllustration } from '../components/illustrations/TooltipIllustration';
import { UserAvatarIllustration } from '../components/illustrations/UserAvatarIllustration';

interface ComponentsHubPageProps {
  onNavigate?: (id: string) => void;
}

const ITEMS: Array<{
  id: string;
  title: string;
  subtitle: string;
  illustration?: (hovered: boolean) => React.ReactNode;
}> = [
  { id: 'badge',             title: 'Badge',             subtitle: '// 2 variants, 2 sizes, 1 hard cap at 99+',                illustration: (h: boolean) => <BadgeIllustration hovered={h} /> },
  { id: 'button',            title: 'Button',            subtitle: '// 10 variants, 4 sizes, 5 content modes. the most opinionated element in the system', illustration: (h: boolean) => <ButtonIllustration hovered={h} /> },
  { id: 'card',              title: 'Card',              subtitle: '// surfaces, gradients, shadows — all token-controlled',    illustration: (h: boolean) => <CardIllustration hovered={h} /> },
  { id: 'checkbox',          title: 'Checkbox',          subtitle: '// 3 sizes, 3 states, 36 combinations, 1 hand-drawn stroke', illustration: (h: boolean) => <CheckboxIllustration hovered={h} /> },
  { id: 'chip',              title: 'Chip',              subtitle: '// 3 variants, 2 sizes, removable with animated exit',     illustration: (h: boolean) => <ChipIllustration hovered={h} /> },
  { id: 'content-switcher',  title: 'Content Switcher',  subtitle: '// 3 sizes, 2 surface variants, 1 spring-driven indicator', illustration: (h: boolean) => <ContentSwitcherIllustration hovered={h} /> },
  { id: 'data-table',        title: 'Data Table',        subtitle: '// sort, filter, paginate. columns don\'t flinch',         illustration: (h: boolean) => <DataTableIllustration hovered={h} /> },
  { id: 'date-picker',       title: 'Date Picker',       subtitle: '// 7 presets, 5 range states, full keyboard nav',          illustration: (h: boolean) => <DatePickerIllustration hovered={h} /> },
  { id: 'dropdown-menu',     title: 'Dropdown Menu',     subtitle: '// 2 sizes, 5 item states, searchable, avatar support',    illustration: (h: boolean) => <DropdownMenuIllustration hovered={h} /> },
  { id: 'input',             title: 'Input',             subtitle: '// 3 sizes, 6 states, 4 slots, 0 messages saying "Invalid input"', illustration: (h: boolean) => <InputIllustration hovered={h} /> },
  { id: 'loading-indicator', title: 'Loading Indicator', subtitle: '// 2 variants, 3 sizes, 20 rotating messages with personality', illustration: (h: boolean) => <LoadingIndicatorIllustration hovered={h} /> },
  { id: 'modal',             title: 'Modal',             subtitle: '// 3 modes, focus trapped, escape honored. always',         illustration: (h: boolean) => <ModalIllustration hovered={h} /> },
  { id: 'modal-fullscreen',  title: 'Modal Fullscreen',  subtitle: '// slides up, slides down faster. prev/next built in',     illustration: (h: boolean) => <ModalFullscreenIllustration hovered={h} /> },
  { id: 'number-input',      title: 'Number Input',      subtitle: '// 3 sizes, 6 states, min/max enforced. no exceptions',    illustration: (h: boolean) => <NumberInputIllustration hovered={h} /> },
  { id: 'radio-button',      title: 'Radio Button',      subtitle: '// 3 sizes, 30 state combinations, 1 press that survives the trackpad', illustration: (h: boolean) => <RadioButtonIllustration hovered={h} /> },
  { id: 'search-input',      title: 'Search Input',      subtitle: '// 3 sizes, debounced, clear button that earns its space', illustration: (h: boolean) => <SearchInputIllustration hovered={h} /> },
  { id: 'select',            title: 'Select',            subtitle: '// 3 sizes, 6 states, keyboard-first. mouse also welcome', illustration: (h: boolean) => <SelectIllustration hovered={h} /> },
  { id: 'skeleton',          title: 'Skeleton',          subtitle: '// 3 shapes, 4 animations, 4 pre-composed layouts. patience, visualized', illustration: (h: boolean) => <SkeletonIllustration hovered={h} /> },
  { id: 'tabs',              title: 'Tabs',              subtitle: '// 3 sizes, 3 content modes, 1 spring-driven indicator',   illustration: (h: boolean) => <TabsIllustration hovered={h} /> },
  { id: 'text-area',         title: 'Text Area',         subtitle: '// 3 sizes, 6 states, grows with your words. counts them too', illustration: (h: boolean) => <TextAreaIllustration hovered={h} /> },
  { id: 'toggle',            title: 'Toggle',            subtitle: '// 3 sizes, 30 combinations, 1 spring that lands like it means it', illustration: (h: boolean) => <ToggleIllustration hovered={h} /> },
  { id: 'tooltip',           title: 'Tooltip',           subtitle: '// 2 types, 12 placements, rich mode with actions',        illustration: (h: boolean) => <TooltipIllustration hovered={h} /> },
  { id: 'user-avatar',       title: 'User Avatar',       subtitle: '// 4 sizes, 3 content types, 1 dignified fallback',        illustration: (h: boolean) => <UserAvatarIllustration hovered={h} /> },
].sort((a, b) => a.title.localeCompare(b.title));

export default function ComponentsHubPage({ onNavigate }: ComponentsHubPageProps) {
  return (
    <section className="mb-24">
      <PageHero
        title="Components"
        subtitle="Every building block, documented and interactive."
        description="23 components. All animated, accessible, and token-compliant. 1 opinionated tone of voice."
      />
      <div className="grid grid-cols-3 gap-3">
        {ITEMS.map((item, i) => (
          <HubCard
            key={item.id}
            title={item.title}
            subtitle={item.subtitle}
            titleSize="clamp(1.75rem, 3vw, 2.25rem)"
            minHeight={item.illustration ? 0 : 180}
            delay={i * 0.03}
            onClick={() => onNavigate?.(item.id)}
            illustration={item.illustration}
          />
        ))}
      </div>
    </section>
  );
}
