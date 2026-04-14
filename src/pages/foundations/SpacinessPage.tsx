import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageHero } from '../../layouts/PageHero';
import { SectionTitle, Spec } from '../../layouts/DocHelpers';
import { Card as DSCard } from '../../components/Card';
import { DensityProvider, spacinessVars } from '../../components/DensityProvider';
import { ContentSwitcher, ContentSwitcherItem } from '../../components/ContentSwitcher';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Input } from '../../components/Input';
import { Chip } from '../../components/Chip';
import { spring } from '../../tokens/motion';
import { Minus, Plus, RotateCcw, Layers, Maximize2, Minimize2 } from 'lucide-react';

// ─── Semantic scale data ─────────────────────────────────────────────────────

const SCALE = [
  { token: '--space-xs',  base:  4, label: 'xs',  use: 'Hairline gaps, icon–label' },
  { token: '--space-sm',  base:  8, label: 'sm',  use: 'Tight groups, tag rows' },
  { token: '--space-md',  base: 16, label: 'md',  use: 'Form fields, list items' },
  { token: '--space-lg',  base: 24, label: 'lg',  use: 'Card padding, sections' },
  { token: '--space-xl',  base: 32, label: 'xl',  use: 'Panel padding, modals' },
  { token: '--space-2xl', base: 48, label: '2xl', use: 'Hero margins, page gaps' },
  { token: '--space-3xl', base: 64, label: '3xl', use: 'Section dividers' },
  { token: '--space-4xl', base: 96, label: '4xl', use: 'Page-level breathing' },
] as const;

const snap = (base: number, spaciness: number) =>
  Math.round((base * spaciness) / 4) * 4;

const PRESETS = [
  { label: 'Compact', value: 0.85, icon: Minimize2 },
  { label: 'Default', value: 1.00, icon: Layers },
  { label: 'Spacious', value: 1.15, icon: Maximize2 },
] as const;

// ─── Layout gap demo ─────────────────────────────────────────────────────────

const LAYOUT_TOKENS = [
  { name: 'tight',   label: 'layout-gap-tight',   base: 12 },
  { name: 'default', label: 'layout-gap-default',  base: 24 },
  { name: 'section', label: 'layout-gap-section',  base: 48 },
  { name: 'page',    label: 'layout-gap-page',     base: 96 },
] as const;

type LayoutGapKey = typeof LAYOUT_TOKENS[number]['name'];

const DEMO_CARDS = ['Button', 'Badge', 'Toggle', 'Checkbox', 'Chip', 'Input'];

function LayoutGapDemo({ spaciness }: { spaciness: number }) {
  const [gapKey, setGapKey] = useState<LayoutGapKey>('default');
  const token = LAYOUT_TOKENS.find(t => t.name === gapKey)!;
  const gapPx = snap(token.base, spaciness);

  return (
    <>
      <ContentSwitcher value={gapKey} onChange={(v) => setGapKey(v as LayoutGapKey)} variant="elevated" size="sm">
        {LAYOUT_TOKENS.map(t => (
          <ContentSwitcherItem key={t.name} value={t.name}>{t.name}</ContentSwitcherItem>
        ))}
      </ContentSwitcher>

      <div className="mt-6 relative overflow-hidden">
        <motion.div
          className="grid grid-cols-3"
          animate={{ gap: gapPx }}
          transition={spring.default}
        >
          {DEMO_CARDS.map((label) => (
            <motion.div
              key={label}
              layout
              className="rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                height: 72,
              }}
              transition={spring.default}
            >
              <span className="font-sans text-sm font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                {label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={gapKey}
            className="mt-4 flex items-center gap-2"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.14 }}
          >
            <code
              className="font-mono text-xs font-semibold px-2 py-0.5 rounded-s"
              style={{ backgroundColor: 'var(--color-secondary-1)', color: 'var(--color-on-secondary-1)' }}
            >
              --{token.label}
            </code>
            <span className="font-sans text-xs" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
              = {gapPx}px (base {token.base}px × {spaciness.toFixed(2)})
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SpacinessPage() {
  const [spaciness, setSpaciness] = useState(1);
  const demoRef = useRef<HTMLDivElement>(null);

  const clamp = (v: number) => Math.round(Math.max(0.7, Math.min(1.3, v)) * 100) / 100;

  return (
    <section className="mb-24">
      <PageHero
        title="Spaciness"
        subtitle={"One knob.\nEvery component.\nEvery layout."}
        description="Spaciness scales the air between and inside things — padding, gaps, margins. Component sizes (button height, input height) stay fixed. Like MOTION_SPEED for time, but for space."
      />

      {/* ── Master control ────────────────────────────────────────────── */}
      <SectionTitle>Master control</SectionTitle>
      <div
        className="rounded-lg px-10 py-10"
        style={{
          backgroundColor: 'var(--color-surface-1)',
          border: '1px solid var(--color-border)',
        }}
      >
        <Spec>Drag the slider or pick a preset. The demo cards below react in real time.</Spec>

        {/* Presets */}
        <div className="flex items-center gap-2 mb-6">
          {PRESETS.map(({ label, value, icon: Icon }) => (
            <button
              key={label}
              onClick={() => setSpaciness(value)}
              className="flex items-center gap-2 px-4 py-2 rounded-m font-sans text-sm font-medium transition-colors"
              style={{
                backgroundColor: spaciness === value ? 'var(--color-primary-1)' : 'var(--color-surface-2)',
                color: spaciness === value ? 'var(--color-on-primary)' : 'var(--color-on-surface-subtle-1)',
                border: '1px solid transparent',
              }}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
          <button
            onClick={() => setSpaciness(1)}
            className="ml-2 p-2 rounded-m"
            style={{ color: 'var(--color-on-surface-subtle-2)' }}
            title="Reset to 1.0"
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {/* Slider */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSpaciness(s => clamp(s - 0.05))}
            className="p-2 rounded-m"
            style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-on-surface)' }}
          >
            <Minus size={14} />
          </button>

          <div className="flex-1 flex items-center gap-4">
            <input
              type="range"
              min={70}
              max={130}
              step={5}
              value={Math.round(spaciness * 100)}
              onChange={(e) => setSpaciness(Number(e.target.value) / 100)}
              className="flex-1 accent-[var(--color-primary-1)]"
              style={{ height: 4 }}
            />
          </div>

          <button
            onClick={() => setSpaciness(s => clamp(s + 0.05))}
            className="p-2 rounded-m"
            style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-on-surface)' }}
          >
            <Plus size={14} />
          </button>

          {/* Value display */}
          <div
            className="font-mono text-sm font-bold px-3 py-1.5 rounded-m min-w-[72px] text-center"
            style={{
              backgroundColor: 'var(--color-secondary-1)',
              color: 'var(--color-on-secondary-1)',
            }}
          >
            {spaciness.toFixed(2)}
          </div>
        </div>
      </div>

      {/* ── Live card demo ────────────────────────────────────────────── */}
      <div className="mt-12" />
      <SectionTitle>Live demo</SectionTitle>
      <Spec>Same Card component at three densities. Buttons stay 40px tall — only the air changes.</Spec>

      <div ref={demoRef} style={spacinessVars(spaciness)}>
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ gap: 'var(--layout-gap-default)' }}
        >
          {/* Default card */}
          <DSCard>
            <DSCard.Header
              title="Revenue"
              description="Q1 2026 performance overview"
            />
            <DSCard.Body>
              <div className="flex items-baseline gap-2">
                <span
                  className="font-display font-bold text-headline-l"
                  style={{ color: 'var(--color-on-surface)' }}
                >
                  $1.2M
                </span>
                <Badge variant="accent">+12%</Badge>
              </div>
              <p className="font-sans text-sm" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                Compared to $1.07M in Q4 2025
              </p>
            </DSCard.Body>
            <DSCard.Footer>
              <Button variant="secondary" size="sm">View report</Button>
            </DSCard.Footer>
          </DSCard>

          {/* Compact card */}
          <DSCard variant="outlined" density="compact">
            <DSCard.Header
              title="Active users"
              description="Real-time session count"
            />
            <DSCard.Body>
              <div className="flex items-baseline gap-2">
                <span
                  className="font-display font-bold text-headline-l"
                  style={{ color: 'var(--color-on-surface)' }}
                >
                  3,847
                </span>
                <Badge variant="accent">Live</Badge>
              </div>
              <div className="flex gap-1 flex-wrap">
                <Chip size="sm" clickable={false}>Desktop 62%</Chip>
                <Chip size="sm" clickable={false}>Mobile 38%</Chip>
              </div>
            </DSCard.Body>
            <DSCard.Footer>
              <Button variant="secondary" size="sm">Details</Button>
            </DSCard.Footer>
          </DSCard>

          {/* Card with form */}
          <DSCard>
            <DSCard.Header
              title="Quick add"
              description="Add a new team member"
            />
            <DSCard.Body>
              <Input label="Name" placeholder="Jane Doe" size="sm" />
              <Input label="Email" placeholder="jane@company.com" size="sm" />
            </DSCard.Body>
            <DSCard.Footer align="between">
              <Button variant="link" size="sm">Cancel</Button>
              <Button variant="primary" size="sm">Add member</Button>
            </DSCard.Footer>
          </DSCard>
        </div>
      </div>

      {/* ── Scale reference ───────────────────────────────────────────── */}
      <div className="mt-12" />
      <SectionTitle>Semantic scale</SectionTitle>
      <div
        className="rounded-lg px-10 py-10"
        style={{
          backgroundColor: 'var(--color-surface-1)',
          border: '1px solid var(--color-border)',
        }}
      >
        <Spec>Base values × spaciness, snapped to the 4px grid. Compare across density levels.</Spec>

        {/* Column headers */}
        <div className="flex items-center gap-4 mb-4 pb-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div className="w-24 shrink-0">
            <span className="font-sans text-xs font-semibold" style={{ color: 'var(--color-on-surface-subtle-2)' }}>Token</span>
          </div>
          <div className="w-14 shrink-0 text-center">
            <span className="font-sans text-xs font-semibold" style={{ color: 'var(--color-on-surface-subtle-2)' }}>Base</span>
          </div>
          <div className="w-14 shrink-0 text-center">
            <span className="font-mono text-xs font-bold" style={{ color: 'var(--color-primary-1)' }}>× {spaciness.toFixed(2)}</span>
          </div>
          <div className="flex-1">
            <span className="font-sans text-xs font-semibold" style={{ color: 'var(--color-on-surface-subtle-2)' }}>Use case</span>
          </div>
          <div className="w-[200px] shrink-0">
            <span className="font-sans text-xs font-semibold" style={{ color: 'var(--color-on-surface-subtle-2)' }}>Visual</span>
          </div>
        </div>

        <div className="flex flex-col divide-y" style={{ borderColor: 'var(--color-border)' }}>
          {SCALE.map(({ token, base, label, use }) => {
            const computed = snap(base, spaciness);
            const barWidth = Math.min((computed / 96) * 100, 100);
            const changed = computed !== base;

            return (
              <div key={token} className="flex items-center gap-4 py-3">
                <code
                  className="font-mono text-xs w-24 shrink-0 font-semibold"
                  style={{ color: 'var(--color-on-secondary-1)' }}
                >
                  space-{label}
                </code>
                <span
                  className="font-mono text-xs w-14 shrink-0 text-center"
                  style={{ color: 'var(--color-on-surface-subtle-1)' }}
                >
                  {base}px
                </span>
                <span
                  className="font-mono text-xs w-14 shrink-0 text-center font-bold"
                  style={{ color: changed ? 'var(--color-primary-1)' : 'var(--color-on-surface)' }}
                >
                  {computed}px
                </span>
                <span
                  className="font-sans text-xs flex-1"
                  style={{ color: 'var(--color-on-surface-subtle-1)' }}
                >
                  {use}
                </span>
                <div className="w-[200px] shrink-0 flex items-center">
                  <motion.div
                    className="h-3 rounded-s"
                    style={{ backgroundColor: 'var(--color-primary-1)' }}
                    animate={{ width: `${barWidth}%` }}
                    transition={spring.snappy}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Layout gaps demo ─────────────────────────────────────────── */}
      <div className="mt-12" />
      <SectionTitle>Layout gaps</SectionTitle>
      <div
        className="rounded-lg px-10 py-10"
        style={{
          backgroundColor: 'var(--color-surface-1)',
          border: '1px solid var(--color-border)',
        }}
      >
        <Spec>Layout tokens control space between components. Switch to see the grid breathe.</Spec>
        <LayoutGapDemo spaciness={spaciness} />
      </div>

      {/* ── Rules ─────────────────────────────────────────────────────── */}
      <div className="mt-12" />
      <SectionTitle>Rules</SectionTitle>
      <div
        className="rounded-lg px-10 py-10"
        style={{
          backgroundColor: 'var(--color-surface-1)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div className="flex flex-col gap-4">
          {[
            {
              rule: 'Never hardcode pixel spacing values',
              why: 'Use --space-* tokens or --layout-* tokens. They scale with spaciness and snap to the 4px grid.',
            },
            {
              rule: 'Pick the semantic name, not the pixel value',
              why: '"Gap between cards" → layout-gap-default. Don\'t think "I need 24px". Think "what is the relationship between these elements?"',
            },
            {
              rule: 'Component internals use space-* tokens',
              why: 'Padding, gap, and margin inside a component reference the semantic scale (space-xs through space-4xl).',
            },
            {
              rule: 'Layout arrangement uses layout-* tokens',
              why: 'Space between components on a page: layout-gutter, layout-gap-default, layout-gap-section, layout-gap-page.',
            },
            {
              rule: 'Use DensityProvider for local overrides',
              why: 'Wrap a region to change spaciness locally. A dense data table inside a spacious editorial page.',
            },
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
      </div>

      {/* ── Nested density demo ───────────────────────────────────────── */}
      <div className="mt-12" />
      <SectionTitle>Nested density</SectionTitle>
      <Spec>DensityProvider overrides --spaciness for a region. A dense table inside a spacious card.</Spec>

      <DensityProvider spaciness={1.15}>
        <DSCard variant="filled">
          <DSCard.Header
            title="Team overview"
            description="Spacious container (spaciness: 1.15) wrapping a compact data region"
          />
          <DSCard.Body>
            <DensityProvider spaciness={0.85}>
              <div
                className="rounded-m overflow-hidden"
                style={{
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface-1)',
                }}
              >
                <table className="w-full font-sans text-sm" style={{ borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                      {['Name', 'Role', 'Status', 'Revenue'].map(h => (
                        <th
                          key={h}
                          className="text-left font-semibold text-xs"
                          style={{
                            color: 'var(--color-on-surface-subtle-1)',
                            padding: 'var(--space-sm) var(--space-md)',
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Acme Corp', role: 'Enterprise', status: 'Active', rev: '$120K' },
                      { name: 'Globex', role: 'Startup', status: 'Trial', rev: '$8K' },
                      { name: 'Initech', role: 'Enterprise', status: 'Active', rev: '$210K' },
                    ].map((row) => (
                      <tr key={row.name} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: 'var(--space-sm) var(--space-md)', color: 'var(--color-on-surface)' }} className="font-medium">{row.name}</td>
                        <td style={{ padding: 'var(--space-sm) var(--space-md)', color: 'var(--color-on-surface-subtle-1)' }}>{row.role}</td>
                        <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                          <Badge variant="accent" size="sm">{row.status}</Badge>
                        </td>
                        <td style={{ padding: 'var(--space-sm) var(--space-md)' }} className="font-mono font-semibold" >{row.rev}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DensityProvider>
          </DSCard.Body>
        </DSCard>
      </DensityProvider>

      {/* ── What scales, what doesn't ─────────────────────────────────── */}
      <div className="mt-12" />
      <SectionTitle>What scales, what stays fixed</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div
          className="rounded-lg px-10 py-10"
          style={{
            backgroundColor: 'var(--color-surface-1)',
            border: '1px solid var(--color-border)',
          }}
        >
          <p className="font-display font-semibold text-headline-s mb-4" style={{ color: 'var(--color-primary-1)' }}>
            Scales with spaciness
          </p>
          <div className="flex flex-col gap-3">
            {[
              'Padding inside containers',
              'Gaps between elements',
              'Margins between sections',
              'Layout gutters',
              'Page margins',
            ].map(item => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-primary-1)' }} />
                <span className="font-sans text-sm" style={{ color: 'var(--color-on-surface)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-lg px-10 py-10"
          style={{
            backgroundColor: 'var(--color-surface-1)',
            border: '1px solid var(--color-border)',
          }}
        >
          <p className="font-display font-semibold text-headline-s mb-4" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
            Fixed (never scales)
          </p>
          <div className="flex flex-col gap-3">
            {[
              'Component heights (button: 40px, input: 40px)',
              'Border width (1px)',
              'Focus ring (2px)',
              'Icon sizes (16/20/24px)',
              'Border radius',
              'Font sizes',
              'Shadow offsets',
              'Max content width',
            ].map(item => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-on-surface-subtle-2)' }} />
                <span className="font-sans text-sm" style={{ color: 'var(--color-on-surface)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Card component tokens ─────────────────────────────────────── */}
      <div className="mt-12" />
      <SectionTitle>Card component tokens</SectionTitle>
      <div
        className="rounded-lg px-10 py-10"
        style={{
          backgroundColor: 'var(--color-surface-1)',
          border: '1px solid var(--color-border)',
        }}
      >
        <Spec>Each card variant maps its tokens to different points on the semantic scale</Spec>

        <div className="flex flex-col divide-y" style={{ borderColor: 'var(--color-border)' }}>
          {/* Header */}
          <div className="flex items-center gap-4 pb-3">
            <span className="font-sans text-xs font-semibold w-36 shrink-0" style={{ color: 'var(--color-on-surface-subtle-2)' }}>Token</span>
            <span className="font-sans text-xs font-semibold w-20 shrink-0 text-center" style={{ color: 'var(--color-on-surface-subtle-2)' }}>Default</span>
            <span className="font-sans text-xs font-semibold w-20 shrink-0 text-center" style={{ color: 'var(--color-on-surface-subtle-2)' }}>Compact</span>
            <span className="font-sans text-xs font-semibold w-20 shrink-0 text-center" style={{ color: 'var(--color-on-surface-subtle-2)' }}>Flush</span>
            <span className="font-sans text-xs font-semibold flex-1" style={{ color: 'var(--color-on-surface-subtle-2)' }}>Purpose</span>
          </div>

          {[
            { token: '--card-padding',       def: 'space-lg', compact: 'space-md', flush: '0',        purpose: 'Outer padding (all sides)' },
            { token: '--card-gap',           def: 'space-md', compact: 'space-sm', flush: 'space-sm', purpose: 'Between header / body / footer' },
            { token: '--card-inner-padding', def: 'space-md', compact: 'space-sm', flush: 'space-md', purpose: 'Body internal padding' },
            { token: '--card-header-gap',    def: 'space-sm', compact: 'space-xs', flush: 'space-sm', purpose: 'Icon → title, title → desc' },
            { token: '--card-body-gap',      def: 'space-sm', compact: 'space-xs', flush: 'space-sm', purpose: 'Between items inside body' },
          ].map(({ token, def, compact, flush, purpose }) => (
            <div key={token} className="flex items-center gap-4 py-3">
              <code className="font-mono text-xs w-36 shrink-0 font-semibold" style={{ color: 'var(--color-on-secondary-1)' }}>{token}</code>
              <code className="font-mono text-xs w-20 shrink-0 text-center" style={{ color: 'var(--color-on-surface)' }}>{def}</code>
              <code className="font-mono text-xs w-20 shrink-0 text-center" style={{ color: 'var(--color-on-surface)' }}>{compact}</code>
              <code className="font-mono text-xs w-20 shrink-0 text-center" style={{ color: 'var(--color-on-surface)' }}>{flush}</code>
              <span className="font-sans text-xs flex-1" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{purpose}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── The equation ──────────────────────────────────────────────── */}
      <div className="mt-12" />
      <SectionTitle>The Kvalt equation</SectionTitle>
      <div
        className="rounded-lg px-10 py-10"
        style={{
          backgroundColor: 'var(--color-surface-1)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div className="flex flex-col items-center gap-6 py-6">
          <p className="font-display font-bold text-headline-m text-center" style={{ color: 'var(--color-on-surface)' }}>
            Personality =
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { label: 'Color', active: false },
              { label: 'Typography', active: false },
              { label: 'Radius', active: false },
              { label: 'Motion', active: false },
              { label: 'Spaciness', active: true },
            ].map(({ label, active }) => (
              <div
                key={label}
                className="font-mono text-sm font-semibold px-4 py-2 rounded-m"
                style={{
                  backgroundColor: active ? 'var(--color-primary-1)' : 'var(--color-surface-2)',
                  color: active ? 'var(--color-on-primary)' : 'var(--color-on-surface)',
                  border: active ? 'none' : '1px solid var(--color-border)',
                }}
              >
                {label}
              </div>
            ))}
          </div>
          <p className="font-sans text-md text-center max-w-md" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
            Five independent axes. Characters dial each one.
            The design system adapts.
          </p>
        </div>
      </div>
    </section>
  );
}
