import { useState } from 'react';
import { Grid, List, BarChart2, Table, Star, Layers, Settings } from 'lucide-react';
import { ContentSwitcher, ContentSwitcherItem, type ContentSwitcherSize, type ContentSwitcherVariant } from '../../components/ContentSwitcher';
import { Toggle } from '../../components/Toggle';
import { PageHero } from '../../layouts/PageHero';
import { Card, SectionTitle, Spec, TokenChips } from '../../layouts/DocHelpers';

// ─── Playground ───────────────────────────────────────────────────────────────

const ICONS = [List, Grid, Table, BarChart2, Star, Layers, Settings];

const ALL_ITEMS = [
  { value: 'list',     label: 'List' },
  { value: 'grid',     label: 'Grid' },
  { value: 'table',    label: 'Table' },
  { value: 'chart',    label: 'Chart' },
  { value: 'settings', label: 'Settings' },
];

function Playground() {
  const [active, setActive]           = useState('list');
  const [size, setSize]               = useState<ContentSwitcherSize>('md');
  const [variant, setVariant]         = useState<ContentSwitcherVariant>('default');
  const [fill, setFill]               = useState(false);
  const [showIcons, setShowIcons]     = useState(false);
  const [itemCount, setItemCount]     = useState(3);
  const [disableLast, setDisableLast] = useState(false);

  const items = ALL_ITEMS.slice(0, itemCount);

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ border: '1px solid var(--color-border)' }}
    >
      {/* Preview */}
      <div
        className="flex items-center justify-center p-16"
        style={{ height: 200, background: variant === 'elevated' ? 'var(--color-surface-2)' : 'var(--color-surface-1)' }}
      >
        <div className={fill ? 'w-full' : undefined}>
          <ContentSwitcher
            value={active}
            onChange={setActive}
            size={size}
            variant={variant}
            fill={fill}
          >
            {items.map((item, i) => (
              <ContentSwitcherItem
                key={item.value}
                value={item.value}
                icon={showIcons ? ICONS[i] : undefined}
                disabled={disableLast && i === items.length - 1}
              >
                {item.label}
              </ContentSwitcherItem>
            ))}
          </ContentSwitcher>
        </div>
      </div>

      {/* Controls */}
      <div
        className="grid grid-cols-2 gap-x-12 gap-y-6 px-10 py-8"
        style={{ background: 'var(--color-surface-2)', borderTop: '1px solid var(--color-border)' }}
      >
        {/* Size */}
        <div className="flex flex-col gap-2 items-start">
          <span className="font-sans text-sm font-semibold" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
            size
          </span>
          <ContentSwitcher value={size} onChange={(v) => setSize(v as ContentSwitcherSize)} size="sm" variant="elevated">
            <ContentSwitcherItem value="sm">sm</ContentSwitcherItem>
            <ContentSwitcherItem value="md">md</ContentSwitcherItem>
            <ContentSwitcherItem value="lg">lg</ContentSwitcherItem>
          </ContentSwitcher>
        </div>

        {/* Variant */}
        <div className="flex flex-col gap-2 items-start">
          <span className="font-sans text-sm font-semibold" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
            variant
          </span>
          <ContentSwitcher value={variant} onChange={(v) => setVariant(v as ContentSwitcherVariant)} size="sm" variant="elevated">
            <ContentSwitcherItem value="default">default</ContentSwitcherItem>
            <ContentSwitcherItem value="elevated">elevated</ContentSwitcherItem>
          </ContentSwitcher>
        </div>

        {/* Item count */}
        <div className="flex flex-col gap-2 items-start">
          <span className="font-sans text-sm font-semibold" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
            items
          </span>
          <ContentSwitcher value={String(itemCount)} onChange={(v) => { setItemCount(Number(v)); setActive(ALL_ITEMS[0].value); }} size="sm" variant="elevated">
            {[2, 3, 4, 5].map(n => (
              <ContentSwitcherItem key={n} value={String(n)}>{n}</ContentSwitcherItem>
            ))}
          </ContentSwitcher>
        </div>

        {/* Toggles */}
        <div className="flex flex-col gap-4 items-start">
          <Toggle
            size="sm"
            label="fill"
            checked={fill}
            onChange={e => setFill(e.target.checked)}
          />
          <Toggle
            size="sm"
            label="icons"
            checked={showIcons}
            onChange={e => setShowIcons(e.target.checked)}
          />
        </div>

        <div className="flex flex-col gap-4 items-start">
          <Toggle
            size="sm"
            label="disable last"
            checked={disableLast}
            onChange={e => setDisableLast(e.target.checked)}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContentSwitcherPage() {
  const [viewSm, setViewSm] = useState('list');
  const [viewMd, setViewMd] = useState('list');
  const [viewLg, setViewLg] = useState('list');
  const [viewSmEl, setViewSmEl] = useState('list');
  const [viewMdEl, setViewMdEl] = useState('list');
  const [viewLgEl, setViewLgEl] = useState('list');
  const [viewIconSm, setViewIconSm] = useState('list');
  const [viewIconMd, setViewIconMd] = useState('list');
  const [widthDefault, setWidthDefault] = useState('overview');
  const [widthFill, setWidthFill] = useState('overview');

  return (
    <>
      <PageHero
        title="Content Switcher"
        subtitle="Pill segmented control · sliding indicator · spring.snappy"
        description="Compact control for switching between content views. The active indicator slides with a spring animation. Supports icons, disabled items, and fill-width layout."
      />

      <TokenChips tokens={{ Sizes: ['sm', 'md', 'lg'], Variants: ['default', 'elevated'], Props: ['fill', 'icon', 'disabled'] }} />

      {/* ══ PLAYGROUND ═══════════════════════════════════════════════════════ */}
      <SectionTitle>Playground</SectionTitle>
      <Playground />

      {/* ══ VARIANTS ═════════════════════════════════════════════════════════ */}
      <SectionTitle>Sizes</SectionTitle>
      <Card>
        <Spec>sm (32px) · md (40px) · lg (48px)</Spec>
        <div className="flex flex-col gap-4 items-start">
          <ContentSwitcher value={viewSm} onChange={setViewSm} size="sm">
            <ContentSwitcherItem value="list">List</ContentSwitcherItem>
            <ContentSwitcherItem value="grid">Grid</ContentSwitcherItem>
            <ContentSwitcherItem value="table">Table</ContentSwitcherItem>
          </ContentSwitcher>
          <ContentSwitcher value={viewMd} onChange={setViewMd} size="md">
            <ContentSwitcherItem value="list">List</ContentSwitcherItem>
            <ContentSwitcherItem value="grid">Grid</ContentSwitcherItem>
            <ContentSwitcherItem value="table">Table</ContentSwitcherItem>
          </ContentSwitcher>
          <ContentSwitcher value={viewLg} onChange={setViewLg} size="lg">
            <ContentSwitcherItem value="list">List</ContentSwitcherItem>
            <ContentSwitcherItem value="grid">Grid</ContentSwitcherItem>
            <ContentSwitcherItem value="table">Table</ContentSwitcherItem>
          </ContentSwitcher>
        </div>
      </Card>

      <div className="mt-12" />
      <SectionTitle>Elevated</SectionTitle>
      <Card bg="bg">
        <Spec>elevated — surface-1 background with shadow. Use on grey/tinted surfaces.</Spec>
        <div className="flex flex-col gap-4 items-start">
          <ContentSwitcher value={viewSmEl} onChange={setViewSmEl} size="sm" variant="elevated">
            <ContentSwitcherItem value="list">List</ContentSwitcherItem>
            <ContentSwitcherItem value="grid">Grid</ContentSwitcherItem>
            <ContentSwitcherItem value="table">Table</ContentSwitcherItem>
          </ContentSwitcher>
          <ContentSwitcher value={viewMdEl} onChange={setViewMdEl} size="md" variant="elevated">
            <ContentSwitcherItem value="list">List</ContentSwitcherItem>
            <ContentSwitcherItem value="grid">Grid</ContentSwitcherItem>
            <ContentSwitcherItem value="table">Table</ContentSwitcherItem>
          </ContentSwitcher>
          <ContentSwitcher value={viewLgEl} onChange={setViewLgEl} size="lg" variant="elevated">
            <ContentSwitcherItem value="list">List</ContentSwitcherItem>
            <ContentSwitcherItem value="grid">Grid</ContentSwitcherItem>
            <ContentSwitcherItem value="table">Table</ContentSwitcherItem>
          </ContentSwitcher>
        </div>
      </Card>

      <div className="mt-12" />
      <SectionTitle>With icons</SectionTitle>
      <Card>
        <Spec>Optional leading icon per item</Spec>
        <div className="flex flex-col gap-4 items-start">
          <ContentSwitcher value={viewIconSm} onChange={setViewIconSm} size="sm">
            <ContentSwitcherItem value="list" icon={List}>List</ContentSwitcherItem>
            <ContentSwitcherItem value="grid" icon={Grid}>Grid</ContentSwitcherItem>
            <ContentSwitcherItem value="table" icon={Table}>Table</ContentSwitcherItem>
          </ContentSwitcher>
          <ContentSwitcher value={viewIconMd} onChange={setViewIconMd} size="md">
            <ContentSwitcherItem value="list" icon={List}>List</ContentSwitcherItem>
            <ContentSwitcherItem value="grid" icon={Grid}>Grid</ContentSwitcherItem>
            <ContentSwitcherItem value="chart" icon={BarChart2}>Chart</ContentSwitcherItem>
          </ContentSwitcher>
        </div>
      </Card>

      <div className="mt-12" />
      <SectionTitle>Width</SectionTitle>
      <Card>
        <Spec>default — container hugs content width</Spec>
        <ContentSwitcher value={widthDefault} onChange={setWidthDefault} size="md">
          <ContentSwitcherItem value="overview">Overview</ContentSwitcherItem>
          <ContentSwitcherItem value="analytics">Analytics</ContentSwitcherItem>
          <ContentSwitcherItem value="settings">Settings</ContentSwitcherItem>
        </ContentSwitcher>
      </Card>
      <Card>
        <Spec>fill — items expand equally to fill the container</Spec>
        <ContentSwitcher value={widthFill} onChange={setWidthFill} size="md" fill>
          <ContentSwitcherItem value="overview">Overview</ContentSwitcherItem>
          <ContentSwitcherItem value="analytics">Analytics</ContentSwitcherItem>
          <ContentSwitcherItem value="settings">Settings</ContentSwitcherItem>
        </ContentSwitcher>
      </Card>

      <div className="mt-12" />
      {/* ══ STATES ═══════════════════════════════════════════════════════════ */}
      <SectionTitle>Disabled items</SectionTitle>
      <Card>
        <Spec>Individual items can be disabled</Spec>
        <ContentSwitcher value="a" size="md">
          <ContentSwitcherItem value="a">Active</ContentSwitcherItem>
          <ContentSwitcherItem value="b">Default</ContentSwitcherItem>
          <ContentSwitcherItem value="c" disabled>Disabled</ContentSwitcherItem>
        </ContentSwitcher>
      </Card>
    </>
  );
}
