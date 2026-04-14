import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { PageHero } from '../../layouts/PageHero';
import { Card, SectionTitle, Spec } from '../../layouts/DocHelpers';
import { FullBleed } from '../../layouts/FullBleed';
import { shadows } from '../../tokens/shadows';
import { Button } from '../../components/Button';
import { ContentSwitcher, ContentSwitcherItem } from '../../components/ContentSwitcher';

const SIZES = [
  { label: 'Small',  spec: '0 1px 4px'  },
  { label: 'Medium', spec: '0 10px 20px' },
  { label: 'Large',  spec: '0 20px 40px' },
];

const INTENSITIES = [
  { label: 'Intensity 1', lightPct: '8%',  darkPct: '24%', keys: ['small-1', 'medium-1', 'large-1'] as const },
  { label: 'Intensity 2', lightPct: '16%', darkPct: '48%', keys: ['small-2', 'medium-2', 'large-2'] as const },
  { label: 'Intensity 3', lightPct: '32%', darkPct: '70%', keys: ['small-3', 'medium-3', 'large-3'] as const },
];

export default function ShadowsPage() {
  const [demoView, setDemoView] = useState('list');

  return (
    <section className="mb-24">
      <PageHero
        title="Shadows"
        subtitle="Nine shadows. One decision tree."
        description="Three sizes, three intensities, all theme-aware. In dark mode, the opacity triples automatically — no separate dark tokens, no maintenance tax. Pick the size, pick the intensity, move on."
      />

      {/* ── Matrix ─────────────────────────── */}
      <FullBleed bg="var(--color-surface-2)">
        <SectionTitle>Shadow matrix</SectionTitle>
        <Card bg="bg">
          <Spec>3 sizes x 3 intensities · pure black drop shadow · theme-aware via CSS vars</Spec>
          <div className="flex gap-10 mb-4">
            <div className="w-32 shrink-0" />
            {SIZES.map(({ label, spec }) => (
              <div key={label} className="flex-1">
                <p className="font-display text-headline-s font-bold" style={{ color: 'var(--color-on-surface)' }}>{label}</p>
                <p className="font-sans text-md font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{spec}</p>
              </div>
            ))}
          </div>
          {INTENSITIES.map((row, ri) => (
            <div key={row.label}>
              <div className="flex gap-10 items-center py-8">
                <div className="w-32 shrink-0">
                  <p className="font-sans text-md font-semibold" style={{ color: 'var(--color-on-surface)' }}>{row.label}</p>
                  <p className="font-sans text-sm font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                    <span className="dark:hidden">{row.lightPct} opacity</span>
                    <span className="hidden dark:inline">{row.darkPct} opacity</span>
                  </p>
                </div>
                {row.keys.map((key) => (
                  <div
                    key={key}
                    className="flex-1 h-[120px] rounded-lg"
                    style={{ backgroundColor: 'var(--color-surface-1)', boxShadow: shadows[key] }}
                  />
                ))}
              </div>
              {ri < INTENSITIES.length - 1 && <div className="divider" />}
            </div>
          ))}
        </Card>
      </FullBleed>

      {/* ── Theme behavior ─────────────────── */}
      <div className="mt-12" />
      <SectionTitle>Theme behavior</SectionTitle>
      <Card>
        <Spec>Same tokens, different rendering — no code changes needed when switching themes</Spec>
        <div className="grid grid-cols-2 gap-6">
          <div className="p-8 rounded-lg flex flex-col items-center gap-4" style={{ backgroundColor: 'oklch(0.96 0.004 256)' }}>
            <div className="w-full h-20 rounded-lg shadow-medium-2" style={{ backgroundColor: 'white' }} />
            <p className="font-sans text-sm font-semibold" style={{ color: 'oklch(0.3 0.05 256)' }}>Light mode</p>
            <p className="font-mono text-xs" style={{ color: 'oklch(0.5 0.03 256)' }}>8% / 16% / 32% opacity</p>
          </div>
          <div className="p-8 rounded-lg flex flex-col items-center gap-4" style={{ backgroundColor: 'oklch(0.22 0.015 256)' }}>
            <div className="w-full h-20 rounded-lg" style={{ backgroundColor: 'oklch(0.27 0.018 256)', boxShadow: '0px 10px 20px 0px rgba(0,0,0,0.48)' }} />
            <p className="font-sans text-sm font-semibold" style={{ color: 'oklch(0.95 0 0)' }}>Dark mode</p>
            <p className="font-mono text-xs" style={{ color: 'oklch(0.65 0.02 256)' }}>24% / 48% / 70% opacity (~3x boost)</p>
          </div>
        </div>
      </Card>

      {/* ── Interactive states ─────────────────── */}
      <div className="mt-12" />
      <SectionTitle>Shadow in interactive states</SectionTitle>
      <Card bg="bg">
        <Spec>Elevated components lift shadow on hover — resting: small-2, hover: medium-2</Spec>
        <div className="flex flex-wrap gap-6 items-center">
          <Button variant="elevated" size="md">Hover me</Button>
          <Button variant="elevated" size="md" iconOnly={Pencil} aria-label="Edit" />
          <ContentSwitcher value={demoView} onChange={setDemoView} variant="elevated" size="sm">
            <ContentSwitcherItem value="list">List</ContentSwitcherItem>
            <ContentSwitcherItem value="grid">Grid</ContentSwitcherItem>
          </ContentSwitcher>
        </div>
        <p className="font-sans text-sm mt-4" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
          Shadow transitions use CSS <code className="font-mono text-xs">transition-shadow duration-150</code> — not Motion. This keeps theme switching instant since CSS vars resolve live.
        </p>
      </Card>

      {/* ── Architecture ─────────────────── */}
      <div className="mt-12" />
      <SectionTitle>Architecture</SectionTitle>
      <Card>
        <Spec>Two paths to the same theme-aware shadow</Spec>
        <div className="flex flex-col gap-6">
          {[
            {
              title: 'CSS path (Tailwind)',
              code: 'className="shadow-small-2 hover:shadow-medium-2 transition-shadow duration-150"',
              note: 'Tailwind utilities reference --shadow-* CSS vars. Dark theme overrides the vars — zero code changes.',
            },
            {
              title: 'JS path (Motion / inline style)',
              code: "style={{ boxShadow: shadows['medium-1'] }}",
              note: "shadows['medium-1'] returns 'var(--shadow-medium-1)'. The browser resolves the var at paint time — theme-aware automatically.",
            },
            {
              title: 'Token source',
              code: 'src/styles/tokens.css → --shadow-small-1 through --shadow-large-3',
              note: 'Light theme: :root block. Dark theme: .dark block with boosted opacity. Single source of truth.',
            },
          ].map((item) => (
            <div key={item.title} className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-surface-2)' }}>
              <p className="font-sans text-sm font-semibold mb-1" style={{ color: 'var(--color-on-surface)' }}>{item.title}</p>
              <code className="font-mono text-xs block mb-2" style={{ color: 'var(--color-on-secondary-1)' }}>{item.code}</code>
              <p className="font-sans text-xs" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{item.note}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Rules ─────────────────── */}
      <div className="mt-12" />
      <SectionTitle>Rules</SectionTitle>
      <Card>
        <div className="flex flex-col gap-4">
          {[
            { rule: 'Never use Motion animate for shadow transitions', why: 'Motion caches animated values and can\'t interpolate CSS var() references. Use CSS transition-shadow instead.' },
            { rule: 'Always use Tailwind shadow classes for hover states', why: 'Inline style={{ boxShadow }} overrides hover classes (specificity). Use shadow-small-2 hover:shadow-medium-2 classes.' },
            { rule: 'Never hardcode rgba shadow values in components', why: 'Hardcoded values won\'t adapt to dark mode. Import from shadows token or use Tailwind shadow-* classes.' },
            { rule: 'Elevated components: small-2 resting, medium-2 hover', why: 'Consistent elevation pattern across Button, ContentSwitcher, and any elevated variant.' },
          ].map((item) => (
            <div key={item.rule} className="flex gap-4">
              <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-primary-1)' }} />
              <div>
                <p className="font-sans text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>{item.rule}</p>
                <p className="font-sans text-xs" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{item.why}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}
