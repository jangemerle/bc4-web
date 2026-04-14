/**
 * LandingPageV3 — Ground-up landing page based on website marketing research.
 * Patterns applied: Equals (question headline), Supernova (numbered narrative),
 * Cursor (product-as-demo), Hey (philosophy footer), ManyChat (before/after).
 */

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import {
  ArrowRight, ChevronDown, Github, Figma,
  Box, Type, Layers, ToggleLeft, Calendar, Table2,
  Layout, Check, Star, Search, MessageSquare,
} from 'lucide-react';

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function FadeIn({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: 'spring', visualDuration: 0.5, bounce: 0.08, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── 1. Launch Banner ────────────────────────────────────────────────────── */

function LaunchBanner() {
  return (
    <div
      className="w-full py-2.5 px-4 text-center text-sm font-medium"
      style={{
        background: 'linear-gradient(135deg, #7DDB85 0%, #84AAE6 50%, #B2C7EF 100%)',
        color: '#14263E',
      }}
    >
      <span className="opacity-90">v2.1 —</span>
      <span className="mx-2 font-bold">47 tokens. 25 components. 3 characters.</span>
      <span className="inline-flex items-center gap-1 ml-1 font-semibold underline underline-offset-2 cursor-pointer">
        What's new <ArrowRight size={14} />
      </span>
    </div>
  );
}

/* ─── 2. Header ───────────────────────────────────────────────────────────── */

function Header() {
  return (
    <header
      className="sticky top-0 z-50 w-full backdrop-blur-xl"
      style={{ backgroundColor: 'rgba(240, 244, 244, 0.85)', borderBottom: '1px solid var(--color-border)' }}
    >
      <div className="mx-auto max-w-[1280px] px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-base"
            style={{ background: 'var(--color-primary-1)', color: 'var(--color-on-primary)' }}
          >
            K
          </div>
          <span className="text-lg font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-on-surface)' }}>
            Kvalt
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {['Components', 'Motion', 'Characters', 'Docs'].map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm font-medium transition-colors"
              style={{ color: 'var(--color-on-surface-subtle-1)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-on-surface)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-on-surface-subtle-1)')}
            >
              {item}
            </a>
          ))}
        </nav>

        <a
          href="#"
          className="flex items-center gap-1.5 text-sm font-semibold px-5 py-2 rounded-lg transition-all"
          style={{ background: 'var(--color-on-surface)', color: 'var(--color-bg)' }}
        >
          Get started
        </a>
      </div>
    </header>
  );
}

/* ─── 3. Hero + Character Switcher Demo ───────────────────────────────────── */

const CHARACTER_STYLES: Record<string, Record<string, string>> = {
  Default: {},
  Warm: {
    '--color-primary-1': '#E07A5F',
    '--color-surface-1': '#FFF8F0',
    '--color-bg': '#FFFAF5',
    '--color-border': '#E8D5C4',
    '--color-surface-2': '#FFF0E5',
    '--color-on-surface': '#3D2C2E',
    '--color-on-surface-subtle-1': '#6B5557',
  },
  Minimal: {
    '--color-primary-1': '#6B7280',
    '--color-surface-1': '#F9FAFB',
    '--color-bg': '#FFFFFF',
    '--color-border': '#E5E7EB',
    '--color-surface-2': '#F3F4F6',
    '--color-on-surface': '#111827',
    '--color-on-surface-subtle-1': '#6B7280',
  },
};

function CharacterDemo() {
  const [character, setCharacter] = useState('Default');
  const styles = CHARACTER_STYLES[character];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', visualDuration: 0.6, bounce: 0.1, delay: 0.3 }}
      className="w-full max-w-[480px]"
    >
      {/* Demo card with scoped character variables */}
      <div
        className="rounded-2xl p-6 transition-all duration-300"
        style={{
          background: styles['--color-surface-1'] || 'var(--color-surface-1)',
          border: `1px solid ${styles['--color-border'] || 'var(--color-border)'}`,
          boxShadow: 'var(--shadow-large-1)',
        }}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span
              className="text-sm font-bold"
              style={{ color: styles['--color-on-surface'] || 'var(--color-on-surface)' }}
            >
              Dashboard
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-md font-medium"
              style={{
                background: styles['--color-primary-1'] || 'var(--color-primary-1)',
                color: 'white',
              }}
            >
              Active
            </span>
          </div>
          <div
            className="h-10 rounded-lg px-3 flex items-center text-sm"
            style={{
              background: styles['--color-surface-2'] || 'var(--color-surface-2)',
              border: `1px solid ${styles['--color-border'] || 'var(--color-border)'}`,
              color: styles['--color-on-surface-subtle-1'] || 'var(--color-on-surface-subtle-1)',
            }}
          >
            Search components...
          </div>
          <div className="flex gap-2">
            <button
              className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: styles['--color-primary-1'] || 'var(--color-primary-1)',
                color: 'white',
              }}
            >
              Save
            </button>
            <button
              className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: 'transparent',
                border: `1px solid ${styles['--color-border'] || 'var(--color-border)'}`,
                color: styles['--color-on-surface'] || 'var(--color-on-surface)',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Character switcher tabs */}
      <div className="flex gap-2 mt-4 justify-center">
        {Object.keys(CHARACTER_STYLES).map((name) => (
          <button
            key={name}
            onClick={() => setCharacter(name)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: character === name ? 'var(--color-on-surface)' : 'var(--color-surface-2)',
              color: character === name ? 'var(--color-bg)' : 'var(--color-on-surface-subtle-1)',
              border: `1px solid ${character === name ? 'transparent' : 'var(--color-border)'}`,
            }}
          >
            {name}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function Hero() {
  return (
    <section className="w-full pt-16 pb-20 overflow-hidden" style={{ background: 'var(--color-bg)' }}>
      <div className="mx-auto max-w-[1280px] px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        <div className="flex-1 max-w-[600px]">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', visualDuration: 0.5, bounce: 0.05 }}
            className="text-[42px] lg:text-[56px] leading-[1.05] font-bold tracking-tight mb-6"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-on-surface)' }}
          >
            What comes after component libraries?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', visualDuration: 0.4, bounce: 0.05, delay: 0.08 }}
            className="text-lg leading-relaxed mb-8 max-w-[500px]"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            A design system with opinions. Tokens decided, components animated, arguments settled. Install one package, ship a product that looks like it was designed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', visualDuration: 0.4, bounce: 0.05, delay: 0.16 }}
            className="mb-6"
          >
            <a
              href="#"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all"
              style={{ background: 'var(--color-on-surface)', color: 'var(--color-bg)' }}
            >
              Get started <ArrowRight size={16} />
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xs font-mono uppercase tracking-widest"
            style={{ color: 'var(--color-on-surface-subtle-2)' }}
          >
            React 19 · TypeScript · WCAG AA · 0 meetings required
          </motion.p>
        </div>

        <div className="flex-1 flex justify-center lg:justify-end">
          <CharacterDemo />
        </div>
      </div>
    </section>
  );
}

/* ─── 4. Before / After ───────────────────────────────────────────────────── */

const BEFORE = [
  'Copy a component from that other project.',
  'Spend the afternoon making it match.',
  'Add dark mode in sprint 19. Revert in sprint 20.',
  '14 button variants. Nobody remembers why.',
  'The color meeting. Again.',
];

const AFTER = [
  'npm install kvalt. Import. Ship.',
  '47 tokens handle the matching.',
  'Dark mode from day one. CSS variables. Done.',
  'One Button. 8 variants. All documented.',
  'HSLUV palettes. Perceptually uniform. Math, not meetings.',
];

function BeforeAfter() {
  return (
    <section
      className="w-full py-20"
      style={{ background: 'var(--color-surface-1)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}
    >
      <div className="mx-auto max-w-[1280px] px-6">
        <FadeIn>
          <h2
            className="text-3xl lg:text-4xl font-bold tracking-tight text-center mb-14"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-on-surface)' }}
          >
            What changes.
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FadeIn>
            <div className="rounded-2xl p-8 h-full" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
              <h3 className="text-lg font-bold mb-6" style={{ color: 'var(--color-on-surface)' }}>The usual.</h3>
              <ul className="space-y-3">
                {BEFORE.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--color-danger-1)' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="rounded-2xl p-8 h-full" style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderLeft: '3px solid var(--color-primary-1)' }}>
              <h3 className="text-lg font-bold mb-6" style={{ color: 'var(--color-on-surface)' }}>Kvalt.</h3>
              <ul className="space-y-3">
                {AFTER.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--color-success-1)' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ─── 5. Numbered Sections 01–05 ──────────────────────────────────────────── */

function ManifestoDivider() {
  return (
    <div className="flex items-center gap-6 py-12">
      <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
      <span
        className="text-xs font-mono uppercase tracking-[0.2em]"
        style={{ color: 'var(--color-on-surface-subtle-2)' }}
      >
        Defaults worth keeping.
      </span>
      <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
    </div>
  );
}

interface NumberedSectionProps {
  number: string;
  label: string;
  title: string;
  description: string;
}

function NumberedSection({ number, label, title, description }: NumberedSectionProps) {
  return (
    <FadeIn>
      <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-6 md:gap-12">
        <div>
          <span
            className="text-[72px] lg:text-[88px] font-bold leading-none"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-on-surface-subtle-2)', opacity: 0.3 }}
          >
            {number}
          </span>
        </div>
        <div>
          <span
            className="text-xs font-mono uppercase tracking-[0.2em] mb-3 block"
            style={{ color: 'var(--color-on-surface-subtle-2)' }}
          >
            {label}
          </span>
          <h3
            className="text-2xl lg:text-3xl font-bold tracking-tight mb-4"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-on-surface)' }}
          >
            {title}
          </h3>
          <p
            className="text-base leading-relaxed max-w-[560px]"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            {description}
          </p>
        </div>
      </div>
    </FadeIn>
  );
}

const SECTIONS = [
  {
    number: '01', label: 'TOKENS',
    title: '47 decisions you don\'t have to make.',
    description: '6 HSLUV color palettes. 12 shades each, perceptually uniform. 9 shadow tokens that scale. A 4px spacing grid. Typography pairing Inter for body and Borna for display. Every value derived from a system, documented, and overridable.',
  },
  {
    number: '02', label: 'COMPONENTS',
    title: '25 components that already agree with each other.',
    description: 'Button to DataTable. Every component ships with full variant coverage, keyboard navigation, screen reader support, spring animations, and dark mode. Not a starter kit — a production system.',
  },
  {
    number: '03', label: 'MOTION',
    title: 'Springs with names. Easings with jobs.',
    description: 'Three spring presets: snappy for micro-feedback, default for standard transitions, playful for personality moments. Five duration tokens for fades. One speed dial that scales every animation globally.',
  },
  {
    number: '04', label: 'CHARACTERS',
    title: 'Same components. Different personality.',
    description: 'A character is 53 CSS variables that re-skin the entire system at once. Colors, border-radius, shadows, typography weight. Apply \'Warm\' and the dashboard feels friendly. Apply \'Minimal\' and it feels precise. Your brand, not ours.',
  },
  {
    number: '05', label: 'ACCESSIBILITY',
    title: 'Not an afterthought. Not a checkbox.',
    description: 'WCAG AA contrast ratios validated per token. Keyboard navigation on every interactive element. Visible focus rings. Reduced motion support. ARIA patterns on every widget. Accessibility is a design decision, and we made it at the token level.',
  },
];

function NarrativeSections() {
  return (
    <section className="w-full py-20" style={{ background: 'var(--color-bg)' }}>
      <div className="mx-auto max-w-[1280px] px-6">
        {SECTIONS.map((s, i) => (
          <div key={s.number}>
            <NumberedSection {...s} />
            {i < SECTIONS.length - 1 && <ManifestoDivider />}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── 6. Component Grid ───────────────────────────────────────────────────── */

const COMPONENTS = [
  { name: 'Button', icon: Box, detail: '8 variants' },
  { name: 'Input', icon: Type, detail: '4 states' },
  { name: 'Modal', icon: Layers, detail: '3 sizes' },
  { name: 'Toggle', icon: ToggleLeft, detail: '2 sizes' },
  { name: 'DatePicker', icon: Calendar, detail: 'Range' },
  { name: 'Table', icon: Table2, detail: 'Sortable' },
  { name: 'Tabs', icon: Layout, detail: 'Animated' },
  { name: 'Select', icon: ChevronDown, detail: 'Searchable' },
  { name: 'Checkbox', icon: Check, detail: '3 states' },
  { name: 'Badge', icon: Star, detail: '6 colors' },
  { name: 'Search', icon: Search, detail: 'Debounced' },
  { name: 'Dropdown', icon: MessageSquare, detail: 'Nested' },
];

function ComponentGrid() {
  return (
    <section
      className="w-full py-20"
      style={{ background: 'var(--color-surface-1)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}
    >
      <div className="mx-auto max-w-[1280px] px-6">
        <FadeIn>
          <h2
            className="text-3xl lg:text-4xl font-bold tracking-tight text-center mb-4"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-on-surface)' }}
          >
            The full inventory.
          </h2>
          <p className="text-center text-base mb-14 max-w-[480px] mx-auto" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
            25 components. Variants, keyboard nav, motion, dark mode. No exceptions.
          </p>
        </FadeIn>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {COMPONENTS.map((c, i) => (
            <FadeIn key={c.name} delay={i * 0.04}>
              <div
                className="p-4 rounded-xl text-center cursor-pointer transition-all"
                style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary-1)'; e.currentTarget.style.boxShadow = 'var(--shadow-small-3)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3"
                  style={{ background: 'var(--color-surface-2)', color: 'var(--color-on-surface-subtle-1)' }}
                >
                  <c.icon size={18} />
                </div>
                <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--color-on-surface)' }}>{c.name}</p>
                <p className="text-[11px]" style={{ color: 'var(--color-on-surface-subtle-2)' }}>{c.detail}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 7. Built with Kvalt Showcase ────────────────────────────────────────── */

function Showcase() {
  const screens = [
    { name: 'Dashboard', subtitle: '14 card types, charts, dark/light' },
    { name: 'Login', subtitle: 'Email, password, remember me' },
    { name: 'Pricing Terminal', subtitle: 'Stack trace pricing. Why not' },
  ];

  return (
    <section className="w-full py-20" style={{ background: 'var(--color-bg)' }}>
      <div className="mx-auto max-w-[1280px] px-6">
        <FadeIn>
          <h2
            className="text-3xl lg:text-4xl font-bold tracking-tight text-center mb-4"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-on-surface)' }}
          >
            Built with Kvalt.
          </h2>
          <p className="text-center text-base mb-14 max-w-[480px] mx-auto" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
            13 production screens in the Screen Vault. Dark mode. Responsive. Ready to copy.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {screens.map((s, i) => (
            <FadeIn key={s.name} delay={i * 0.08}>
              <div
                className="rounded-2xl p-8 h-48 flex flex-col justify-end cursor-pointer transition-all"
                style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary-1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
              >
                <h3 className="text-lg font-bold" style={{ color: 'var(--color-on-surface)' }}>{s.name}</h3>
                <p className="text-sm" style={{ color: 'var(--color-on-surface-subtle-2)' }}>{s.subtitle}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <p className="text-center">
          <a href="#" className="text-sm font-medium inline-flex items-center gap-1" style={{ color: 'var(--color-on-secondary-1)' }}>
            See all 13 screens <ArrowRight size={14} />
          </a>
        </p>
      </div>
    </section>
  );
}

/* ─── 8. FAQ ──────────────────────────────────────────────────────────────── */

const FAQS = [
  {
    q: 'How fast can I adopt this?',
    a: 'Five minutes to first component. One to two sprints for full team adoption. The docs are self-serve — nobody needs a workshop.',
  },
  {
    q: 'How opinionated is "opinionated"?',
    a: 'Every token has a default. Every component has a variant structure. Every motion has a preset. But every single one is a CSS variable or a prop — override anything. The opinions are defaults, not walls.',
  },
  {
    q: 'What\'s a character?',
    a: 'A named set of 53 CSS variable overrides. Apply one and the entire system re-skins. Colors, radius, shadows, type weight. Three ship with Kvalt. Create your own in Tools.',
  },
  {
    q: 'Is this just for React?',
    a: 'The components are React. The token system is CSS variables. The motion presets are Motion. The design decisions work in any framework — the implementation is React-first.',
  },
  {
    q: 'What makes this different from shadcn / Radix / Chakra?',
    a: 'Those give you primitives. Kvalt gives you decisions. Colors are chosen. Motion is built in. Dark mode works on install. You ship on day one, not after "customization sprint."',
  },
  {
    q: 'Is it production-ready?',
    a: '13 complete screens in the Screen Vault. A dashboard with 14 card types. All built with Kvalt components. Production-ready means used in production.',
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
        <h3 className="text-base font-semibold" style={{ color: 'var(--color-on-surface)' }}>{q}</h3>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ type: 'spring', visualDuration: 0.2, bounce: 0 }}>
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
    <section
      className="w-full py-20"
      style={{ background: 'var(--color-surface-1)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}
    >
      <div className="mx-auto max-w-[720px] px-6">
        <FadeIn>
          <h2
            className="text-3xl font-bold tracking-tight text-center mb-12"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-on-surface)' }}
          >
            Questions.
          </h2>
        </FadeIn>
        {FAQS.map((faq) => (
          <FAQItem key={faq.q} {...faq} />
        ))}
      </div>
    </section>
  );
}

/* ─── 9. Closing CTA ──────────────────────────────────────────────────────── */

function ClosingCTA() {
  return (
    <FadeIn>
      <section
        className="w-full py-20"
        style={{ background: 'var(--color-on-surface)' }}
      >
        <div className="mx-auto max-w-[720px] px-6 text-center">
          <h2
            className="text-3xl lg:text-4xl font-bold tracking-tight mb-4"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-bg)' }}
          >
            Install Kvalt.
          </h2>
          <p className="text-base mb-8" style={{ color: 'var(--color-bg)', opacity: 0.6 }}>
            One package. Full design language.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg text-sm font-bold transition-all"
            style={{ background: 'var(--color-primary-1)', color: 'var(--color-on-primary)' }}
          >
            Get started <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </FadeIn>
  );
}

/* ─── 10. Philosophy Footer ───────────────────────────────────────────────── */

const FOOTER_COLS = [
  {
    title: 'What we decided',
    items: ['47 tokens, not "it depends"', 'HSLUV, not HSL', 'Springs, not beziers', 'Characters, not themes', '4px, not "whatever fits"'],
  },
  {
    title: 'What we built',
    items: ['25 components, all animated', '13 screens, production-ready', '3 characters, personality included', '1 speed dial for everything'],
  },
  {
    title: 'What we believe',
    items: ['Accessibility isn\'t optional', 'Motion should mean something', 'Good defaults ship faster', 'Words have weight', 'Override anything'],
  },
  {
    title: 'Where to go',
    items: ['Get started', 'GitHub', 'Screen Vault', 'Figma Source', 'Roadmap'],
  },
];

function Footer() {
  return (
    <footer className="w-full pt-16 pb-8" style={{ background: 'var(--color-bg)', borderTop: '1px solid var(--color-border)' }}>
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
                    <span className="text-sm" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-6 h-6 rounded flex items-center justify-center font-bold text-xs"
              style={{ background: 'var(--color-primary-1)', color: 'var(--color-on-primary)' }}
            >
              K
            </div>
            <span className="text-sm" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
              © 2026 Kvalt. By Jan. Have good defaults.
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" style={{ color: 'var(--color-on-surface-subtle-2)' }}><Github size={18} /></a>
            <a href="#" style={{ color: 'var(--color-on-surface-subtle-2)' }}><Figma size={18} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── Page Assembly ───────────────────────────────────────────────────────── */

export default function LandingPageV3() {
  return (
    <div className="min-h-screen w-full" style={{ background: 'var(--color-bg)', color: 'var(--color-on-surface)' }}>
      <LaunchBanner />
      <Header />
      <Hero />
      <BeforeAfter />
      <NarrativeSections />
      <ComponentGrid />
      <Showcase />
      <FAQ />
      <ClosingCTA />
      <Footer />
    </div>
  );
}
