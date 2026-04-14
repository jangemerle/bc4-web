import { useState } from 'react';
import { Home, FileText, MessageCircle, Settings, Bell } from 'lucide-react';
import { Tabs, Tab } from '../../components/Tabs';
import { PageHero } from '../../layouts/PageHero';
import { Card, SectionTitle, Spec, TokenChips } from '../../layouts/DocHelpers';

export default function TabsPage() {
  const [tabSm, setTabSm] = useState('tab-1');
  const [tabMd, setTabMd] = useState('tab-1');
  const [tabLg, setTabLg] = useState('tab-1');
  const [tabIcons, setTabIcons] = useState('tab-1');
  const [tabBadges, setTabBadges] = useState('tab-1');
  const [tabIconsBadges, setTabIconsBadges] = useState('tab-1');
  const [tabMany, setTabMany] = useState('tab-1');

  return (
    <>
      <PageHero
        title="Tabs"
        subtitle="3 sizes (32/40/50px) · 28px gap · selected: on-secondary-1 + 2px indicator"
        description="Horizontal tab navigation with animated underline indicator, icon and badge support, and full keyboard navigation via arrow keys."
      />

      <TokenChips tokens={{ Sizes: ['sm', 'md', 'lg'], States: ['default', 'selected', 'hover', 'disabled'], Props: ['icon', 'badge'], Keyboard: ['Arrow L/R', 'Home', 'End'] }} />

      {/* ══ SIZES ════════════════════════════════════════════════════════════ */}
      <SectionTitle>Sizes</SectionTitle>
      <Card>
        <Spec>sm (32px, Inter Bold 14px) — click to switch tabs</Spec>
        <Tabs value={tabSm} onChange={setTabSm} size="sm">
          <Tab value="tab-1">Overview</Tab>
          <Tab value="tab-2">Details</Tab>
          <Tab value="tab-3">Activity</Tab>
        </Tabs>

        <div className="mt-10" />
        <Spec>md (40px, Inter SemiBold 16px)</Spec>
        <Tabs value={tabMd} onChange={setTabMd} size="md">
          <Tab value="tab-1">Overview</Tab>
          <Tab value="tab-2">Details</Tab>
          <Tab value="tab-3">Activity</Tab>
        </Tabs>

        <div className="mt-10" />
        <Spec>lg (50px, Borna Bold 18px)</Spec>
        <Tabs value={tabLg} onChange={setTabLg} size="lg">
          <Tab value="tab-1">Overview</Tab>
          <Tab value="tab-2">Details</Tab>
          <Tab value="tab-3">Activity</Tab>
        </Tabs>
      </Card>

      <div className="mt-12" />

      {/* ══ FEATURES ═════════════════════════════════════════════════════════ */}
      <SectionTitle>With icons</SectionTitle>
      <Card>
        <Spec>Icon left of label · 4px gap · same color as text</Spec>
        <Tabs value={tabIcons} onChange={setTabIcons}>
          <Tab value="tab-1" icon={Home}>Overview</Tab>
          <Tab value="tab-2" icon={FileText}>Files</Tab>
          <Tab value="tab-3" icon={MessageCircle}>Messages</Tab>
          <Tab value="tab-4" icon={Settings}>Settings</Tab>
        </Tabs>
      </Card>

      <div className="mt-12" />
      <SectionTitle>With badges</SectionTitle>
      <Card>
        <Spec>Badge pill · surface-3 bg · Inter Bold 12px · on-surface text</Spec>
        <Tabs value={tabBadges} onChange={setTabBadges}>
          <Tab value="tab-1">All</Tab>
          <Tab value="tab-2" badge={5}>Unread</Tab>
          <Tab value="tab-3" badge={12}>Mentions</Tab>
        </Tabs>
      </Card>

      <div className="mt-12" />
      <SectionTitle>Icons + badges</SectionTitle>
      <Card>
        <Spec>Full variant — icon + label + badge count</Spec>
        <Tabs value={tabIconsBadges} onChange={setTabIconsBadges}>
          <Tab value="tab-1" icon={Home}>Overview</Tab>
          <Tab value="tab-2" icon={FileText} badge={3}>Files</Tab>
          <Tab value="tab-3" icon={MessageCircle} badge={8}>Messages</Tab>
          <Tab value="tab-4" icon={Bell} badge={2}>Notifications</Tab>
        </Tabs>
      </Card>

      <div className="mt-12" />
      <SectionTitle>Many items</SectionTitle>
      <Card>
        <Spec>Up to 12 tabs supported — scrollable if needed</Spec>
        <Tabs value={tabMany} onChange={setTabMany}>
          {Array.from({ length: 8 }, (_, i) => (
            <Tab key={i} value={`tab-${i + 1}`}>Tab {i + 1}</Tab>
          ))}
        </Tabs>
      </Card>
    </>
  );
}
