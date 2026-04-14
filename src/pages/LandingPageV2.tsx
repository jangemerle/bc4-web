/**
 * LandingPage — Fish Audio-inspired marketing landing page for Kvalt DS
 * Layout: 1:1 structural clone of fish.audio adapted for Kvalt branding
 */

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import {
  ArrowRight,
  Palette,
  Type,
  Moon,
  Zap,
  Layers,
  Check,
  ChevronDown,
  Play,
  Star,
  Github,
  ExternalLink,
  Box,
  Paintbrush,
  Shield,
  Layout,
  ToggleLeft,
  Table2,
  Calendar,
  Search,
  MessageSquare,
  Figma,
} from 'lucide-react';
import { AsciiTexture, type AsciiPattern } from '../components/AsciiTexture';

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function FadeInSection({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: 'spring', visualDuration: 0.5, bounce: 0.08, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Promo Banner (top gradient strip) ───────────────────────────────────── */

function PromoBanner() {
  return (
    <div
      className="w-full py-2.5 px-4 text-center text-sm font-medium"
      style={{
        background: 'linear-gradient(135deg, #7DDB85 0%, #84AAE6 50%, #B2C7EF 100%)',
        color: '#14263E',
      }}
    >
      <span className="opacity-90">v2.1 is live.</span>
      <span className="mx-2 font-bold">47 tokens. 25 components. 3 characters.</span>
      <span
        className="inline-flex items-center gap-1 ml-1 font-semibold underline underline-offset-2 cursor-pointer"
        style={{ color: '#14263E' }}
      >
        What changed <ArrowRight size={14} />
      </span>
    </div>
  );
}

/* ─── Header / Navigation ─────────────────────────────────────────────────── */

function Header() {
  return (
    <header
      className="sticky top-0 z-50 w-full backdrop-blur-xl"
      style={{
        backgroundColor: 'rgba(240, 244, 244, 0.85)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div className="mx-auto max-w-[1280px] px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-base"
            style={{
              background: 'var(--color-primary-1)',
              color: 'var(--color-on-primary)',
            }}
          >
            K
          </div>
          <span
            className="text-lg font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-on-surface)' }}
          >
            Kvalt
          </span>
        </div>

        {/* Nav items */}
        <nav className="hidden md:flex items-center gap-8">
          {['Foundations', 'Components', 'Philosophy', 'Screen Vault', 'Docs'].map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm font-medium transition-colors"
              style={{ color: 'var(--color-on-surface-subtle-1)' }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = 'var(--color-on-surface)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = 'var(--color-on-surface-subtle-1)')
              }
            >
              {item}
            </a>
          ))}
        </nav>

        {/* CTA buttons */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            style={{
              color: 'var(--color-on-surface)',
              border: '1px solid var(--color-border-strong)',
            }}
          >
            GitHub <ExternalLink size={14} />
          </a>
          <a
            href="#"
            className="flex items-center gap-1.5 text-sm font-semibold px-5 py-2 rounded-lg transition-all"
            style={{
              background: 'var(--color-on-surface)',
              color: 'var(--color-bg)',
            }}
          >
            Get started
          </a>
        </div>
      </div>
    </header>
  );
}

/* ─── Component Preview Widget (maps to Fish Audio's voice demo) ──────────── */

const DEMO_TABS = ['Components', 'Tokens', 'Motion'] as const;

const COMPONENT_LIST = [
  { icon: '🟢', name: 'Button', status: 'Stable' },
  { icon: '🔵', name: 'Input', status: 'Stable' },
  { icon: '🟣', name: 'Modal', status: 'Stable' },
  { icon: '🟠', name: 'DatePicker', status: 'New' },
  { icon: '⚪', name: 'Table', status: 'New' },
  { icon: '🔴', name: 'Select', status: 'Stable' },
];

const TOKEN_TAGS = [
  { label: 'primary-1', color: '#7DDB85' },
  { label: 'secondary-1', color: '#84AAE6' },
  { label: 'danger-1', color: '#D23031' },
  { label: 'warning-1', color: '#E36B00' },
  { label: 'success-1', color: '#00A35A' },
  { label: 'surface-1', color: '#FFFFFF' },
  { label: 'on-surface', color: '#14263E' },
  { label: 'border', color: '#D9E1E1' },
];

function DemoWidget() {
  const [activeTab, setActiveTab] = useState<(typeof DEMO_TABS)[number]>('Components');
  const [activeComponent, setActiveComponent] = useState('Button');

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', visualDuration: 0.6, bounce: 0.1, delay: 0.3 }}
      className="w-full max-w-[540px] rounded-2xl overflow-hidden"
      style={{
        background: 'var(--color-surface-1)',
        boxShadow: 'var(--shadow-large-1), 0 0 0 1px rgba(0,0,0,0.05)',
      }}
    >
      {/* Tabs */}
      <div
        className="flex items-center gap-1 px-5 pt-4 pb-0"
      >
        {DEMO_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="relative px-4 py-2 text-sm font-medium rounded-lg transition-colors"
            style={{
              color:
                activeTab === tab
                  ? 'var(--color-on-surface)'
                  : 'var(--color-on-surface-subtle-2)',
              background:
                activeTab === tab ? 'var(--color-surface-3)' : 'transparent',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="px-5 pb-5 pt-3">
        <div className="flex gap-4" style={{ minHeight: 280 }}>
          {/* Left: Component list */}
          <div className="w-[180px] flex-shrink-0 space-y-1">
            {COMPONENT_LIST.map((comp) => (
              <button
                key={comp.name}
                onClick={() => setActiveComponent(comp.name)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-colors"
                style={{
                  background:
                    activeComponent === comp.name
                      ? 'var(--color-surface-3)'
                      : 'transparent',
                  color: 'var(--color-on-surface)',
                }}
              >
                <span className="text-base">{comp.icon}</span>
                <span className="font-medium">{comp.name}</span>
                {comp.status === 'New' && (
                  <span
                    className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded"
                    style={{
                      background: 'var(--color-primary-1)',
                      color: 'var(--color-on-primary)',
                    }}
                  >
                    NEW
                  </span>
                )}
              </button>
            ))}
            <div
              className="mt-2 text-xs font-medium flex items-center gap-1 px-3 py-2"
              style={{ color: 'var(--color-on-secondary-1)' }}
            >
              25+ components <ArrowRight size={12} />
            </div>
          </div>

          {/* Right: Code preview / token area */}
          <div className="flex-1 flex flex-col">
            <div
              className="flex-1 rounded-xl p-4 font-mono text-xs leading-relaxed overflow-hidden"
              style={{
                background: 'var(--color-surface-2)',
                color: 'var(--color-on-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              {activeTab === 'Components' && (
                <div>
                  <span style={{ color: 'var(--color-on-surface-subtle-2)' }}>{'// '}{activeComponent}.tsx</span>
                  <br />
                  <span style={{ color: '#84AAE6' }}>import</span>{' '}
                  <span>{'{ '}{activeComponent}{' }'}</span>{' '}
                  <span style={{ color: '#84AAE6' }}>from</span>{' '}
                  <span style={{ color: '#7DDB85' }}>'kvalt'</span>;
                  <br /><br />
                  <span style={{ color: '#84AAE6' }}>{'<'}</span>
                  <span style={{ color: '#E36B00' }}>{activeComponent}</span>
                  <br />
                  {'  '}<span style={{ color: '#84AAE6' }}>variant</span>=<span style={{ color: '#7DDB85' }}>"primary"</span>
                  <br />
                  {'  '}<span style={{ color: '#84AAE6' }}>size</span>=<span style={{ color: '#7DDB85' }}>"md"</span>
                  <br />
                  {'  '}<span style={{ color: '#84AAE6' }}>motion</span>=<span style={{ color: '#7DDB85' }}>"spring.snappy"</span>
                  <br />
                  <span style={{ color: '#84AAE6' }}>{'/>'}</span>
                </div>
              )}
              {activeTab === 'Tokens' && (
                <div className="space-y-2">
                  <span style={{ color: 'var(--color-on-surface-subtle-2)' }}>{'// '}Semantic color tokens</span>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {TOKEN_TAGS.map((t) => (
                      <span
                        key={t.label}
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium"
                        style={{
                          background: 'var(--color-surface-3)',
                          color: 'var(--color-on-surface)',
                          border: '1px solid var(--color-border)',
                        }}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ background: t.color }}
                        />
                        {t.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 'Motion' && (
                <div>
                  <span style={{ color: 'var(--color-on-surface-subtle-2)' }}>{'// '}Motion tokens</span>
                  <br /><br />
                  <span style={{ color: '#84AAE6' }}>spring</span>.snappy{'  '}<span style={{ color: 'var(--color-on-surface-subtle-2)' }}>// 0.15s</span>
                  <br />
                  <span style={{ color: '#84AAE6' }}>spring</span>.default{'  '}<span style={{ color: 'var(--color-on-surface-subtle-2)' }}>// 0.3s</span>
                  <br />
                  <span style={{ color: '#84AAE6' }}>spring</span>.playful{'  '}<span style={{ color: 'var(--color-on-surface-subtle-2)' }}>// 0.4s</span>
                  <br /><br />
                  <span style={{ color: '#E36B00' }}>ease</span>.enter{'    '}<span style={{ color: 'var(--color-on-surface-subtle-2)' }}>// arrive</span>
                  <br />
                  <span style={{ color: '#E36B00' }}>ease</span>.exit{'     '}<span style={{ color: 'var(--color-on-surface-subtle-2)' }}>// leave</span>
                  <br />
                  <span style={{ color: '#E36B00' }}>ease</span>.standard{'  '}<span style={{ color: 'var(--color-on-surface-subtle-2)' }}>// state</span>
                </div>
              )}
            </div>

            {/* Generate button (maps to Fish Audio's "Generate & play") */}
            <button
              className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: 'var(--color-on-surface)',
                color: 'var(--color-bg)',
              }}
            >
              <Play size={14} fill="currentColor" /> Preview in Docs
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Hero Section ────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section
      className="w-full pt-16 pb-20 overflow-hidden"
      style={{ background: 'var(--color-bg)' }}
    >
      <div className="mx-auto max-w-[1280px] px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* Left: Text content */}
        <div className="flex-1 max-w-[600px]">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', visualDuration: 0.5, bounce: 0.05 }}
            className="text-[42px] lg:text-[56px] leading-[1.05] font-bold tracking-tight mb-4"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-on-surface)',
            }}
          >
            Defaults worth keeping.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', visualDuration: 0.4, bounce: 0.05, delay: 0.08 }}
            className="text-lg leading-relaxed mb-8 max-w-[480px]"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            One install gives you a color system, motion language, and 25 components that already agree with each other. Override anything — or just ship.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', visualDuration: 0.4, bounce: 0.05, delay: 0.16 }}
          >
            <a
              href="#"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: 'var(--color-on-surface)',
                color: 'var(--color-bg)',
              }}
            >
              Get started <ArrowRight size={16} />
            </a>
          </motion.div>
        </div>

        {/* Right: Demo widget */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <DemoWidget />
        </div>
      </div>
    </section>
  );
}

/* ─── Scrolling Logo Bar (maps to Fish Audio's Partners section) ───────────── */

const TECH_LOGOS = [
  'TypeScript', 'React 19', 'Motion 12', 'HSLUV Colors', 'Tailwind CSS', 'WCAG AA',
  'Vite', 'Lucide Icons', 'Figma Sync', 'Dark Mode',
];

function TechBar() {
  return (
    <FadeInSection>
      <section
        className="w-full py-12 overflow-hidden"
        style={{
          borderTop: '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <p
          className="text-center text-sm font-medium mb-8 tracking-wide uppercase"
          style={{ color: 'var(--color-on-surface-subtle-2)' }}
        >
          THE STACK
        </p>
        <div className="flex items-center justify-center flex-wrap gap-x-10 gap-y-4 max-w-[1000px] mx-auto px-6">
          {TECH_LOGOS.map((name) => (
            <span
              key={name}
              className="text-sm font-semibold opacity-50 hover:opacity-100 transition-opacity cursor-default"
              style={{ color: 'var(--color-on-surface)' }}
            >
              {name}
            </span>
          ))}
        </div>
      </section>
    </FadeInSection>
  );
}

/* ─── "Experience" Cards Section (maps to Fish Audio S2 showcase) ─────────── */

const SHOWCASE_CARDS: {
  title: string;
  subtitle: string;
  tags: string[];
  description: string;
  pattern: AsciiPattern;
  patternSeed: number;
  color: string;
  label: string;
}[] = [
  {
    title: '47 tokens. Zero meetings.',
    subtitle: 'THE GROUND FLOOR',
    tags: ['Colors', 'Typography', 'Shadows'],
    description: '6 HSLUV palettes, 12 shades each. Shadows that scale. A 4px grid you don\'t have to argue about. Every value derived, not debated.',
    pattern: 'scale',
    patternSeed: 42,
    color: '#7DDB85',
    label: 'Scale',
  },
  {
    title: '25 components. All animated. All accessible.',
    subtitle: 'SHIP, DON\'T PROTOTYPE',
    tags: ['Accessible', 'Animated', 'Themed'],
    description: 'Button to DataTable. Full variant coverage, keyboard nav, spring animations, dark mode. The components your team would build if they had three months and zero deadlines.',
    pattern: 'add',
    patternSeed: 137,
    color: '#84AAE6',
    label: 'Add',
  },
  {
    title: 'Springs with opinions.',
    subtitle: 'ALIVE, NOT HYPERACTIVE',
    tags: ['Snappy', 'Default', 'Playful', 'Speed dial'],
    description: 'Three spring presets for spatial motion. Five duration tokens for state changes. One speed dial that scales everything at once. Physics, not guesswork.',
    pattern: 'changeOverTime',
    patternSeed: 256,
    color: '#E36B00',
    label: 'Change over time',
  },
];

function ShowcaseCard({ card, index }: { card: typeof SHOWCASE_CARDS[number]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <FadeInSection delay={index * 0.1}>
      <div
        className="rounded-2xl overflow-hidden h-full flex flex-col"
        style={{
          background: 'var(--color-surface-1)',
          border: '1px solid var(--color-border)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* ASCII texture area */}
        <div
          className="h-48 flex items-center justify-center overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${card.color}15 0%, ${card.color}08 100%)`,
          }}
        >
          <AsciiTexture
            pattern={card.pattern}
            cols={48}
            rows={14}
            seed={card.patternSeed}
            isHovered={isHovered}
            label={card.label}
          />
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: card.color }}>
              {card.subtitle}
            </span>
          </div>
          <h3
            className="text-xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-on-surface)' }}
          >
            {card.title}
          </h3>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {card.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md"
                style={{
                  background: 'var(--color-surface-3)',
                  color: 'var(--color-on-surface-subtle-1)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <p
            className="text-sm leading-relaxed flex-1"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            {card.description}
          </p>
          <a
            href="#"
            className="mt-4 text-sm font-medium flex items-center gap-1 transition-colors"
            style={{ color: 'var(--color-on-secondary-1)' }}
          >
            Explore <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </FadeInSection>
  );
}

function ShowcaseCards() {
  return (
    <section className="w-full py-20" style={{ background: 'var(--color-bg)' }}>
      <div className="mx-auto max-w-[1280px] px-6">
        <FadeInSection>
          <h2
            className="text-3xl lg:text-4xl font-bold tracking-tight text-center mb-4"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-on-surface)' }}
          >
            Design systems, but alive.
          </h2>
          <p
            className="text-center text-base mb-14 max-w-[520px] mx-auto"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            Every layer is designed to work together. Tokens feed components, components express motion, motion creates personality.
          </p>
        </FadeInSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SHOWCASE_CARDS.map((card, i) => (
            <ShowcaseCard key={card.title} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Use Cases Grid (maps to Fish Audio's 4-column use cases) ────────────── */

// USE_CASES removed in V2 — replaced by BeforeAfter section

const BEFORE_ITEMS = [
  '14 button variants. None of them match.',
  'Hardcoded hex values in 47 files.',
  '3-hour meeting about border radius.',
  'Rebuilt the date picker. Again.',
  'Dark mode added in sprint 19. Broke in sprint 20.',
];

const AFTER_ITEMS = [
  'One Button. 8 variants. All documented.',
  '47 semantic tokens. Change one, change everywhere.',
  '4px grid. 8px radius. Decided. Moving on.',
  'DatePicker ships with range support and keyboard nav.',
  'Dark mode from install. CSS variables. Zero component changes.',
];

function BeforeAfter() {
  return (
    <section
      className="w-full py-20"
      style={{
        background: 'var(--color-surface-1)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div className="mx-auto max-w-[1280px] px-6">
        <FadeInSection>
          <h2
            className="text-3xl lg:text-4xl font-bold tracking-tight text-center mb-4"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-on-surface)' }}
          >
            Before and after.
          </h2>
          <p
            className="text-center text-base mb-14 max-w-[480px] mx-auto"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            What changes when your design system has opinions.
          </p>
        </FadeInSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FadeInSection>
            <div
              className="rounded-2xl p-8 h-full"
              style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
            >
              <h3
                className="text-lg font-bold mb-1"
                style={{ color: 'var(--color-on-surface)' }}
              >
                Before Kvalt
              </h3>
              <p className="text-sm mb-6" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
                All decisions, no shipping
              </p>
              <ul className="space-y-3">
                {BEFORE_ITEMS.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--color-danger-1)' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </FadeInSection>

          <FadeInSection delay={0.1}>
            <div
              className="rounded-2xl p-8 h-full"
              style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderLeft: '3px solid var(--color-primary-1)' }}
            >
              <h3
                className="text-lg font-bold mb-1"
                style={{ color: 'var(--color-on-surface)' }}
              >
                After Kvalt
              </h3>
              <p className="text-sm mb-6" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
                Defaults worth keeping
              </p>
              <ul className="space-y-3">
                {AFTER_ITEMS.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--color-success-1)' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </FadeInSection>
        </div>
      </div>
    </section>
  );
}

/* ─── Component Grid (maps to Fish Audio's Voice Library) ─────────────────── */

const COMPONENT_GRID = [
  { name: 'Button', icon: Box, variants: '8 variants' },
  { name: 'Input', icon: Type, variants: '4 states' },
  { name: 'Modal', icon: Layers, variants: '3 sizes' },
  { name: 'Toggle', icon: ToggleLeft, variants: '2 sizes' },
  { name: 'DatePicker', icon: Calendar, variants: 'Range support' },
  { name: 'Table', icon: Table2, variants: 'Sortable' },
  { name: 'Tabs', icon: Layout, variants: 'Animated' },
  { name: 'Select', icon: ChevronDown, variants: 'Searchable' },
  { name: 'Checkbox', icon: Check, variants: '3 states' },
  { name: 'Badge', icon: Star, variants: '6 colors' },
  { name: 'SearchInput', icon: Search, variants: 'Debounced' },
  { name: 'DropdownMenu', icon: MessageSquare, variants: 'Nested' },
];

function ComponentGrid() {
  return (
    <section className="w-full py-20" style={{ background: 'var(--color-bg)' }}>
      <div className="mx-auto max-w-[1280px] px-6">
        <FadeInSection>
          <h2
            className="text-3xl lg:text-4xl font-bold tracking-tight text-center mb-4"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-on-surface)' }}
          >
            The inventory.
          </h2>
          <p
            className="text-center text-base mb-14 max-w-[480px] mx-auto"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            Every component ships with variants, keyboard nav, spring motion, and dark mode. No exceptions.
          </p>
        </FadeInSection>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {COMPONENT_GRID.map((comp, i) => (
            <FadeInSection key={comp.name} delay={i * 0.04}>
              <div
                className="p-4 rounded-xl text-center cursor-pointer transition-all group"
                style={{
                  background: 'var(--color-surface-1)',
                  border: '1px solid var(--color-border)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary-1)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-small-3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3"
                  style={{
                    background: 'var(--color-surface-3)',
                    color: 'var(--color-on-surface-subtle-1)',
                  }}
                >
                  <comp.icon size={18} />
                </div>
                <p
                  className="text-sm font-semibold mb-0.5"
                  style={{ color: 'var(--color-on-surface)' }}
                >
                  {comp.name}
                </p>
                <p
                  className="text-[11px]"
                  style={{ color: 'var(--color-on-surface-subtle-2)' }}
                >
                  {comp.variants}
                </p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Features Bento (maps to Fish Audio Enterprise APIs section) ──────────── */

const FEATURES = [
  {
    title: 'HSLUV Color Science',
    description: 'Perceptually uniform. Every shade at the same lightness actually looks equally bright. No more muddy blues next to glowing greens. Math, not eyeballing.',
    icon: Palette,
    span: 'col-span-1 md:col-span-2',
  },
  {
    title: 'Spring Motion System',
    description: 'Springs for spatial motion. Easings for state fades. Three named presets — snappy, default, playful — plus a speed dial. Physics, not magic numbers.',
    icon: Zap,
    span: 'col-span-1',
  },
  {
    title: 'Dark Mode for Free',
    description: 'CSS variables all the way down. Components never reference colors directly. Toggle the class. Everything switches. Zero component changes.',
    icon: Moon,
    span: 'col-span-1',
  },
  {
    title: 'WCAG AA Accessibility',
    description: 'Contrast ratios validated per token. Keyboard nav on every interactive element. Focus rings. Reduced motion. ARIA patterns. Not an afterthought.',
    icon: Shield,
    span: 'col-span-1 md:col-span-2',
  },
  {
    title: 'Character Theming',
    description: '53 CSS variables define a character. Swap them all at once. Same components, completely different personality. Your brand, not ours.',
    icon: Paintbrush,
    span: 'col-span-1 md:col-span-2',
  },
  {
    title: 'Spec Export Pipeline',
    description: 'Export component specs with motion, interaction, and token details. Your FE team reproduces them in any framework. The handoff that actually works.',
    icon: ExternalLink,
    span: 'col-span-1',
  },
];

function FeaturesBento() {
  return (
    <section
      className="w-full py-20"
      style={{
        background: 'var(--color-surface-1)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div className="mx-auto max-w-[1280px] px-6">
        <FadeInSection>
          <h2
            className="text-3xl lg:text-4xl font-bold tracking-tight text-center mb-4"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-on-surface)' }}
          >
            Not just components.
          </h2>
          <p
            className="text-center text-base mb-14 max-w-[520px] mx-auto"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            A system of color science, motion physics, accessibility standards, and character theming. The decisions that make components work together.
          </p>
        </FadeInSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURES.map((feat, i) => (
            <FadeInSection key={feat.title} delay={i * 0.06} className={feat.span}>
              <div
                className="p-6 rounded-2xl h-full"
                style={{
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{
                    background: 'var(--color-surface-3)',
                    color: 'var(--color-on-surface)',
                  }}
                >
                  <feat.icon size={20} />
                </div>
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--color-on-surface)' }}
                >
                  {feat.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--color-on-surface-subtle-1)' }}
                >
                  {feat.description}
                </p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Stats Bar (maps to social proof / testimonials) ─────────────────────── */

const STATS = [
  { value: '47', label: 'design tokens' },
  { value: '25', label: 'components' },
  { value: '3', label: 'spring presets' },
  { value: '53', label: 'CSS vars per character' },
  { value: '0', label: 'meetings required' },
  { value: '1', label: 'npm install' },
];

function StatsBar() {
  return (
    <FadeInSection>
      <section className="w-full py-16" style={{ background: 'var(--color-bg)' }}>
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p
                  className="text-3xl lg:text-4xl font-bold mb-1"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--color-on-surface)' }}
                >
                  {stat.value}
                </p>
                <p
                  className="text-sm"
                  style={{ color: 'var(--color-on-surface-subtle-2)' }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </FadeInSection>
  );
}

/* ─── FAQ Section ─────────────────────────────────────────────────────────── */

const FAQS = [
  {
    q: 'How long does adoption take?',
    a: 'If you can npm install and import a React component, you\'re running Kvalt in under 5 minutes. Full team adoption is typically 1-2 sprints — the docs are written for self-serve.',
  },
  {
    q: 'Can I customize everything?',
    a: 'Every token, every component prop, every motion preset. Characters override 53 CSS variables at once for wholesale changes. Or override one border-radius. Both are first-class workflows.',
  },
  {
    q: 'What if I outgrow it?',
    a: 'Kvalt is a design opinion, not a cage. Every component is standard React. Every token is a CSS variable. Outgrow a component — replace it, the tokens still work. Outgrow the tokens — the components still work.',
  },
  {
    q: 'What\'s a "character" exactly?',
    a: 'A named set of 53 CSS variable overrides. Apply one and the entire DS re-skins — colors, radius, shadows, typography weight. Think of it as a personality for your product. Three ship with Kvalt. Create your own.',
  },
  {
    q: 'Does it work with my existing Tailwind setup?',
    a: 'Yes. Kvalt uses Tailwind for utility classes but owns its design tokens through CSS variables. Your existing config and Kvalt coexist without conflict.',
  },
  {
    q: 'Is this production-ready?',
    a: 'Every component has full variant coverage, keyboard nav, screen reader support, dark mode, and spring animations. 13 complete screens in the Screen Vault — built entirely with Kvalt.',
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border-b py-5 cursor-pointer"
      style={{ borderColor: 'var(--color-border)' }}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between gap-4">
        <h3
          className="text-base font-semibold"
          style={{ color: 'var(--color-on-surface)' }}
        >
          {q}
        </h3>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: 'spring', visualDuration: 0.2, bounce: 0 }}
        >
          <ChevronDown size={18} style={{ color: 'var(--color-on-surface-subtle-2)' }} />
        </motion.div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.p
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', visualDuration: 0.3, bounce: 0.05 }}
            className="text-sm leading-relaxed mt-3 overflow-hidden"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            {a}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function FAQ() {
  return (
    <section className="w-full py-20" style={{ background: 'var(--color-bg)' }}>
      <div className="mx-auto max-w-[720px] px-6">
        <FadeInSection>
          <h2
            className="text-3xl font-bold tracking-tight text-center mb-12"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-on-surface)' }}
          >
            Frequently asked questions
          </h2>
        </FadeInSection>
        {FAQS.map((faq) => (
          <FAQItem key={faq.q} {...faq} />
        ))}
      </div>
    </section>
  );
}

/* ─── CTA Banner ──────────────────────────────────────────────────────────── */

function CTABanner() {
  return (
    <FadeInSection>
      <section
        className="w-full py-20"
        style={{
          background: 'linear-gradient(135deg, var(--color-on-surface) 0%, #1a3a5c 100%)',
        }}
      >
        <div className="mx-auto max-w-[720px] px-6 text-center">
          <h2
            className="text-3xl lg:text-4xl font-bold tracking-tight mb-4"
            style={{ fontFamily: 'var(--font-display)', color: '#FFFFFF' }}
          >
            Install Kvalt.
          </h2>
          <p
            className="text-base mb-8 opacity-70"
            style={{ color: '#FFFFFF' }}
          >
            One package. Full design language. Ship today.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg text-sm font-bold transition-all"
            style={{
              background: 'var(--color-primary-1)',
              color: 'var(--color-on-primary)',
            }}
          >
            Get started <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </FadeInSection>
  );
}

/* ─── Footer ──────────────────────────────────────────────────────────────── */

const FOOTER_COLS = [
  {
    title: 'Decisions',
    items: ['47 tokens, no debate', '6 palettes, perceptually uniform', '4px grid, settled', 'Shadows that scale', 'Icons with intent'],
  },
  {
    title: 'The Inventory',
    items: ['Button (8 variants)', 'Input (4 states)', 'Modal (3 sizes)', 'DataTable (sortable)', 'DatePicker (range)', 'Select (searchable)', '19 more'],
  },
  {
    title: 'Opinions',
    items: ['Motion has rules', 'Words have weight', 'Accessibility isn\'t optional', 'Good defaults ship faster', 'Override anything'],
  },
  {
    title: 'Resources',
    items: ['Screen Vault', 'GitHub', 'Figma Source', 'Roadmap'],
  },
];

function Footer() {
  return (
    <footer
      className="w-full pt-16 pb-8"
      style={{
        background: 'var(--color-surface-1)',
        borderTop: '1px solid var(--color-border)',
      }}
    >
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <h4
                className="text-xs font-bold uppercase tracking-wider mb-4"
                style={{ color: 'var(--color-on-surface-subtle-2)' }}
              >
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm transition-colors"
                      style={{ color: 'var(--color-on-surface-subtle-1)' }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = 'var(--color-on-surface)')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = 'var(--color-on-surface-subtle-1)')
                      }
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-6 h-6 rounded flex items-center justify-center font-bold text-xs"
              style={{
                background: 'var(--color-primary-1)',
                color: 'var(--color-on-primary)',
              }}
            >
              K
            </div>
            <span
              className="text-sm"
              style={{ color: 'var(--color-on-surface-subtle-2)' }}
            >
              © 2026 Kvalt. Designed, built, and opinionated by Jan. Have good defaults.
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
              <Github size={18} />
            </a>
            <a href="#" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
              <Figma size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── Page Assembly ───────────────────────────────────────────────────────── */

export default function LandingPageV2() {
  return (
    <div
      className="min-h-screen w-full"
      style={{ background: 'var(--color-bg)', color: 'var(--color-on-surface)' }}
    >
      <PromoBanner />
      <Header />
      <Hero />
      <TechBar />
      <ShowcaseCards />
      <BeforeAfter />
      <StatsBar />
      <ComponentGrid />
      <FeaturesBento />
      <FAQ />
      <CTABanner />
      <Footer />
    </div>
  );
}
