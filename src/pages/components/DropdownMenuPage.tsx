import { useState } from 'react';
import { Plus, Pencil, Copy, Trash2, Filter, User, Star, Heart, Bell, Settings } from 'lucide-react';
import { DropdownMenu, DropdownMenuItem, DropdownMenuDivider } from '../../components/DropdownMenu';
import { Button } from '../../components/Button';
import { PageHero } from '../../layouts/PageHero';
import { Card, SectionTitle, Spec, TokenChips } from '../../layouts/DocHelpers';

export default function DropdownMenuPage() {
  const [ddSmOpen, setDdSmOpen] = useState(false);
  const [ddMdOpen, setDdMdOpen] = useState(false);
  const [ddMultiOpen, setDdMultiOpen] = useState(false);
  const [ddMultiSel, setDdMultiSel] = useState<Set<string>>(new Set(['design']));
  const [ddSearch, setDdSearch] = useState('');
  const [ddSingleSel, setDdSingleSel] = useState('option-2');

  const toggleMulti = (key: string) => {
    setDdMultiSel((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <>
      <PageHero
        title="Dropdown Menu"
        subtitle="radius-lg (12px) · shadow-large-3 · sm: 32px / md: 40px items · radius-m items"
        description="Contextual action menus and selection lists with optional search, checkbox multi-select, user avatars, and full keyboard navigation."
      />

      <TokenChips tokens={{ Sizes: ['sm', 'md'], States: ['default', 'hover', 'active', 'selected', 'disabled'], Variants: ['single-select', 'multi-select', 'icon', 'user', 'divider'], Keyboard: ['Arrow U/D', 'Home', 'End', 'Escape'], Props: ['search'] }} />

      {/* ── Variants ───────────────────────────────────────────────────────── */}

        <SectionTitle>Small — default</SectionTitle>
        <Card>
          <Spec>32px items · 2px gap · text only / with icons / selected (dark) / divider</Spec>
          <div className="relative inline-block">
            <Button variant="secondary" multichoice onClick={() => setDdSmOpen(!ddSmOpen)}>Actions</Button>
            <DropdownMenu open={ddSmOpen} onClose={() => setDdSmOpen(false)} className="top-full mt-2 left-0">
              <DropdownMenuItem icon={Plus} onClick={() => setDdSmOpen(false)}>Add item</DropdownMenuItem>
              <DropdownMenuItem icon={Pencil} onClick={() => setDdSmOpen(false)}>Edit</DropdownMenuItem>
              <DropdownMenuItem icon={Copy} onClick={() => setDdSmOpen(false)}>Duplicate</DropdownMenuItem>
              <DropdownMenuDivider />
              <DropdownMenuItem icon={Trash2} onClick={() => setDdSmOpen(false)}>Delete</DropdownMenuItem>
            </DropdownMenu>
          </div>
        </Card>

        <div className="mt-12" />
        <SectionTitle>Small — single select</SectionTitle>
        <Card>
          <Spec>Selected item gets inverted-surface bg + white text + checkmark on right</Spec>
          <DropdownMenu open className="relative" onClose={() => {}} width="auto">
            <DropdownMenuItem icon={Star} selected={ddSingleSel === 'option-1'} onClick={() => setDdSingleSel('option-1')}>Starred</DropdownMenuItem>
            <DropdownMenuItem icon={Heart} selected={ddSingleSel === 'option-2'} onClick={() => setDdSingleSel('option-2')}>Favorites</DropdownMenuItem>
            <DropdownMenuItem icon={Bell} selected={ddSingleSel === 'option-3'} onClick={() => setDdSingleSel('option-3')}>Alerts</DropdownMenuItem>
            <DropdownMenuItem icon={Settings} selected={ddSingleSel === 'option-4'} onClick={() => setDdSingleSel('option-4')}>Settings</DropdownMenuItem>
          </DropdownMenu>
        </Card>

        <div className="mt-12" />
        <SectionTitle>Medium — with search &amp; multi-select</SectionTitle>
        <Card>
          <Spec>40px items · search field at top · checkbox mode · surface-3 bg when selected</Spec>
          <div className="relative inline-block">
            <Button variant="secondary" iconLeft={Filter} multichoice onClick={() => setDdMdOpen(!ddMdOpen)}>Filter</Button>
            <DropdownMenu
              open={ddMdOpen}
              onClose={() => setDdMdOpen(false)}
              size="md"
              search
              searchValue={ddSearch}
              onSearchChange={setDdSearch}
              searchPlaceholder="Search options..."
              className="top-full mt-2 left-0"
            >
              {['design', 'development', 'research', 'marketing', 'sales'].filter(
                (o) => !ddSearch || o.includes(ddSearch.toLowerCase()),
              ).map((opt) => (
                <DropdownMenuItem
                  key={opt}
                  checkbox
                  selected={ddMultiSel.has(opt)}
                  onClick={() => toggleMulti(opt)}
                >
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </DropdownMenuItem>
              ))}
            </DropdownMenu>
          </div>
        </Card>

        <div className="mt-12" />
        <SectionTitle>Medium — with user avatars</SectionTitle>
        <Card>
          <Spec>User variant — avatar + name + caption · md size only</Spec>
          <div className="relative inline-block">
            <Button variant="secondary" iconLeft={User} multichoice onClick={() => setDdMultiOpen(!ddMultiOpen)}>Assign</Button>
            <DropdownMenu
              open={ddMultiOpen}
              onClose={() => setDdMultiOpen(false)}
              size="md"
              className="top-full mt-2 left-0"
            >
              <DropdownMenuItem>Jeffrey Lebowski</DropdownMenuItem>
              <DropdownMenuItem>Donda Dyson</DropdownMenuItem>
              <DropdownMenuItem>Frank Salamander</DropdownMenuItem>
            </DropdownMenu>
          </div>
        </Card>

      {/* ── States ─────────────────────────────────────────────────────────── */}

        <div className="mt-12" />
        <SectionTitle>States</SectionTitle>
        <Card>
          <Spec>Default · Hover (surface-3) · Active (surface-4) · Disabled (opacity 30%) — interact to see</Spec>
          <div className="flex gap-4">
            <DropdownMenu open className="relative" onClose={() => {}}>
              <DropdownMenuItem icon={Plus}>Default</DropdownMenuItem>
              <DropdownMenuItem icon={Pencil}>Hover me</DropdownMenuItem>
              <DropdownMenuItem icon={Star} selected>Selected</DropdownMenuItem>
              <DropdownMenuItem icon={Trash2} disabled>Disabled</DropdownMenuItem>
            </DropdownMenu>
            <DropdownMenu open className="relative" onClose={() => {}}>
              <DropdownMenuItem checkbox>Unchecked</DropdownMenuItem>
              <DropdownMenuItem checkbox selected>Checked</DropdownMenuItem>
              <DropdownMenuItem checkbox icon={Star}>With icon</DropdownMenuItem>
              <DropdownMenuItem checkbox icon={Heart} selected>Icon + checked</DropdownMenuItem>
              <DropdownMenuItem checkbox disabled>Disabled</DropdownMenuItem>
            </DropdownMenu>
          </div>
        </Card>
    </>
  );
}
