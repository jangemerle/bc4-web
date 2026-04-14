import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, Eye, EyeOff, Keyboard, MousePointer, RefreshCw, Heart, Contrast, Crosshair, Palette, Volume2, Pause, ZoomIn, ClipboardCheck, TestTube, Shield } from 'lucide-react';
import { spring, duration as dur, ease } from '../tokens/motion';

/* ─── Static data ──────────────────────────────────────────────────────────── */

const traits = [
  {
    title: 'Inclusive, not patronising',
    color: 'var(--color-primary-1)',
    body: 'Accessibility is not a separate feature bolted on for compliance. It\'s the baseline. An inaccessible button is a broken button — no different from one that throws an error on click.',
  },
  {
    title: 'Robust, not fragile',
    color: 'var(--color-warning)',
    body: 'Build for the worst case. Slow connections. High zoom. Screen readers. Trackpads, touch, keyboards, switches. If it works everywhere, it works. If it only works on your machine, it doesn\'t.',
  },
  {
    title: 'Obvious, not clever',
    color: 'var(--color-error)',
    body: 'Clever interactions impress designers. Obvious ones help users. A custom drag handle means nothing to a keyboard user. A button that says "Move up" means everything.',
  },
];

const contrastPairs = [
  { bg: '#FFFFFF', fg: '#14263E', ratio: '15.3:1', label: 'Surface on text',     pass: 'AAA' },
  { bg: '#FFFFFF', fg: '#6C7070', ratio: '4.84:1', label: 'Surface on subtle',   pass: 'AA' },
  { bg: '#FFFFFF', fg: '#898F8F', ratio: '3.38:1', label: 'Surface on subtle-2', pass: 'AA Large' },
  { bg: '#7DDB85', fg: '#14263E', ratio: '8.1:1',  label: 'Primary on text',     pass: 'AAA' },
  { bg: '#D23031', fg: '#FFFFFF', ratio: '5.2:1',  label: 'Danger on white',     pass: 'AA' },
  { bg: '#F0F4F4', fg: '#14263E', ratio: '12.6:1', label: 'Background on text',  pass: 'AAA' },
];

const focusRules = [
  { title: 'Every interactive element has a visible focus ring.', desc: 'No exceptions. No "we\'ll skip it because the design looks cleaner." A missing focus ring is a locked door for keyboard users.' },
  { title: '2px primary outline, 2px offset.', desc: 'This is the Kvalt standard. Consistent, visible, and it clears the element edge so it\'s never obscured by borders or shadows.' },
  { title: 'Focus order matches visual order.', desc: 'Tab through the page. If focus jumps somewhere unexpected, the DOM order is wrong. Fix the HTML, not the tabindex.' },
  { title: 'Never use tabindex > 0.', desc: 'Positive tabindex overrides the natural flow and creates maintenance nightmares. Use 0 to make something focusable. Use -1 to make it programmatically focusable only.' },
  { title: 'Focus trapping in modals is mandatory.', desc: 'When a modal opens, focus moves inside. Tab cycles within it. Escape closes it and returns focus to the trigger. No exceptions.' },
];

const keyboardPatterns = [
  { element: 'Button',        keys: 'Enter, Space',         note: 'Both must work. Space is often forgotten.' },
  { element: 'Link',          keys: 'Enter',                note: 'Space scrolls the page, not the link.' },
  { element: 'Checkbox',      keys: 'Space',                note: 'Enter submits the form. Space toggles the box.' },
  { element: 'Select / Menu', keys: 'Arrow keys, Enter, Esc', note: 'Arrows navigate. Enter confirms. Escape closes.' },
  { element: 'Modal',         keys: 'Escape, Tab',          note: 'Escape closes. Tab cycles within.' },
  { element: 'Tabs',          keys: 'Arrow keys',           note: 'Left/Right move between tabs. Home/End jump to first/last.' },
];

const ariaRules = [
  { n: '1', title: 'Use semantic HTML first.', body: 'A <button> is already a button. You don\'t need role="button" on a <div>. ARIA is a polyfill for missing semantics, not a replacement for correct HTML.' },
  { n: '2', title: 'If it moves, announce it.', body: 'Toasts, inline validation, live counters — these need aria-live regions. "polite" for most. "assertive" for errors. If a screen reader user can\'t perceive the change, it didn\'t happen.' },
  { n: '3', title: 'Labels describe actions, not visuals.', body: '"Close dialog" not "X button". "Remove item from cart" not "Delete icon". Screen readers announce purpose, not appearance.' },
  { n: '4', title: 'States are not just colours.', body: 'aria-expanded, aria-selected, aria-checked, aria-disabled. Every visual state change must have a programmatic equivalent. A green checkbox that isn\'t aria-checked is a lie.' },
  { n: '5', title: 'Test without a mouse. Then without a screen.', body: 'Can you complete the entire flow with just a keyboard? Can you understand it with just a screen reader? If either answer is no, it\'s not done.' },
];

const colourMistakes = [
  {
    label: 'Error indicator',
    bad: 'Red border only — no text, no icon.',
    good: 'Red border + "This field is required" text + error icon.',
  },
  {
    label: 'Status badge',
    bad: 'Green dot = active, red dot = inactive.',
    good: 'Green dot + "Active" label. Red dot + "Inactive" label.',
  },
  {
    label: 'Link in text',
    bad: 'Links are only distinguished by colour.',
    good: 'Links are underlined (or bold) and coloured.',
  },
  {
    label: 'Chart legend',
    bad: 'Colour swatches only, no patterns or labels.',
    good: 'Colour + pattern + text label for each series.',
  },
];

const checklist = [
  { q: 'Can you complete the entire flow using only a keyboard?', hint: 'Tab, Enter, Space, Escape, Arrow keys.' },
  { q: 'Does every interactive element have a visible focus indicator?', hint: '2px primary, 2px offset. No exceptions.' },
  { q: 'Is colour never the sole carrier of meaning?', hint: 'Red border + text label. Green dot + "Active" text.' },
  { q: 'Do all images and icons have appropriate alt text or aria-labels?', hint: 'Decorative = alt="" . Informative = sentence describing purpose.' },
  { q: 'Does the page make sense at 200% zoom?', hint: 'No horizontal scrolling. No overlapping text. No cut-off buttons.' },
  { q: 'Are form errors announced to screen readers?', hint: 'aria-live="polite" or aria-describedby pointing to the error.' },
  { q: 'Is the reading order logical when CSS is disabled?', hint: 'Unplug the stylesheet. Does the content still flow correctly?' },
  { q: 'Does prefers-reduced-motion disable all non-essential animation?', hint: 'Opacity fades are fine. Spatial motion should stop.' },
];

const sectionMeta: Record<string, { icon: React.ElementType; bg: string }> = {
  '01': { icon: Heart,          bg: '#6366f1' },
  '02': { icon: Contrast,       bg: '#f59e0b' },
  '03': { icon: Crosshair,      bg: '#06b6d4' },
  '04': { icon: Keyboard,       bg: '#8b5cf6' },
  '05': { icon: Palette,        bg: '#14b8a6' },
  '06': { icon: Volume2,        bg: '#ef4444' },
  '07': { icon: Pause,          bg: '#3b82f6' },
  '08': { icon: ZoomIn,         bg: '#ec4899' },
  '09': { icon: ClipboardCheck, bg: '#10b981' },
  '10': { icon: TestTube,       bg: '#6366f1' },
};

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

function SectionHeader({ n, title }: { n: string; title: string }) {
  const meta = sectionMeta[n];
  const Icon = meta?.icon ?? Heart;
  const bg = meta?.bg ?? 'var(--color-primary-1)';
  return (
    <div className="flex items-center gap-5 mb-6">
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: bg }}>
        <Icon size={40} color="white" strokeWidth={1.5} />
      </div>
      <div>
        <span className="font-mono text-sm font-medium block mb-1" style={{ color: bg }}>{n}</span>
        <h2 className="font-display text-headline-xl font-bold" style={{ color: 'var(--color-on-surface)' }}>{title}</h2>
      </div>
    </div>
  );
}

function Lead({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="font-sans text-base font-medium mb-10 max-w-[680px] leading-relaxed"
      style={{ color: 'var(--color-on-surface-subtle-1)' }}
    >
      {children}
    </p>
  );
}

function Callout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-lg p-6 my-8"
      style={{
        backgroundColor: 'var(--color-surface-1)',
        borderLeft: '3px solid var(--color-warning)',
      }}
    >
      <p className="font-sans text-md font-bold mb-2" style={{ color: 'var(--color-warning)' }}>
        {title}
      </p>
      <p className="font-sans text-md font-medium leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
        {children}
      </p>
    </div>
  );
}

function DoDont({ doText, dontText }: { doText: React.ReactNode; dontText: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-4 my-8">
      <div
        className="rounded-lg p-5"
        style={{ backgroundColor: 'var(--color-surface-1)', borderTop: '3px solid var(--color-success)' }}
      >
        <p className="font-sans text-sm font-bold mb-2" style={{ color: 'var(--color-success)' }}>Do</p>
        <p className="font-sans text-md font-medium leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{doText}</p>
      </div>
      <div
        className="rounded-lg p-5"
        style={{ backgroundColor: 'var(--color-surface-1)', borderTop: '3px solid var(--color-error)' }}
      >
        <p className="font-sans text-sm font-bold mb-2" style={{ color: 'var(--color-error)' }}>Don't</p>
        <p className="font-sans text-md font-medium leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{dontText}</p>
      </div>
    </div>
  );
}

function Label({ children, color }: { children: string; color?: string }) {
  return (
    <span
      className="font-mono text-sm font-medium px-2.5 py-1 rounded-m inline-block mb-3"
      style={{
        backgroundColor: color ? `${color}15` : 'var(--color-primary-1-alpha-10)',
        color: color || 'var(--color-primary-1)',
      }}
    >
      {children}
    </span>
  );
}

function DemoCard({ label, title, description, children }: {
  label: string; title: string; description: string; children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-lg p-8 my-6"
      style={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}
    >
      <Label>{label}</Label>
      <h3 className="font-display text-headline-s font-bold mb-2" style={{ color: 'var(--color-on-surface)' }}>
        {title}
      </h3>
      <p className="font-sans text-md font-medium mb-8" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
        {description}
      </p>
      {children}
    </div>
  );
}

/* ─── Interactive Demos ────────────────────────────────────────────────────── */

function ContrastDemo() {
  return (
    <DemoCard
      label="Interactive"
      title="Contrast checker"
      description="Every text/background pair in the system. If it doesn't hit AA, it doesn't ship."
    >
      <div className="grid grid-cols-3 gap-4">
        {contrastPairs.map((pair) => (
          <div
            key={pair.label}
            className="rounded-lg overflow-hidden"
            style={{ border: '1px solid var(--color-border)' }}
          >
            <div
              className="h-16 flex items-center justify-center"
              style={{ backgroundColor: pair.bg }}
            >
              <span
                className="font-sans text-base font-bold"
                style={{ color: pair.fg }}
              >
                Aa
              </span>
            </div>
            <div className="p-4" style={{ backgroundColor: 'var(--color-surface-1)' }}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-sm font-medium" style={{ color: 'var(--color-on-surface)' }}>
                  {pair.ratio}
                </span>
                <span
                  className="font-mono text-xs font-bold px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: pair.pass === 'AAA' ? 'var(--color-success-alpha-10, rgba(34,197,94,0.12))' : 'var(--color-warning-alpha-10, rgba(251,191,36,0.12))',
                    color: pair.pass === 'AAA' ? 'var(--color-success)' : 'var(--color-warning)',
                  }}
                >
                  {pair.pass}
                </span>
              </div>
              <p className="font-sans text-sm font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                {pair.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="font-sans text-md font-medium mt-6" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
        AA requires 4.5:1 for normal text, 3:1 for large text. AAA requires 7:1. Kvalt targets AA minimum,
        AAA where possible. <span className="font-semibold" style={{ color: 'var(--color-on-surface)' }}>No exceptions for "it looks better lighter."</span>
      </p>
    </DemoCard>
  );
}

function FocusDemo() {
  const [mode, setMode] = useState<'mouse' | 'keyboard'>('mouse');

  return (
    <DemoCard
      label="Interactive"
      title="Focus visibility"
      description="Click the toggle to switch between mouse and keyboard mode. Watch how focus rings appear only when they're needed."
    >
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => setMode('mouse')}
          className="font-sans text-sm font-semibold px-4 py-2 rounded-m cursor-pointer inline-flex items-center gap-2"
          style={{
            backgroundColor: mode === 'mouse' ? 'var(--color-primary-1)' : 'var(--color-surface-2)',
            color: mode === 'mouse' ? 'var(--color-on-primary-1)' : 'var(--color-on-surface)',
            border: mode === 'mouse' ? 'none' : '1px solid var(--color-border)',
          }}
        >
          <MousePointer size={14} />
          Mouse
        </button>
        <button
          onClick={() => setMode('keyboard')}
          className="font-sans text-sm font-semibold px-4 py-2 rounded-m cursor-pointer inline-flex items-center gap-2"
          style={{
            backgroundColor: mode === 'keyboard' ? 'var(--color-primary-1)' : 'var(--color-surface-2)',
            color: mode === 'keyboard' ? 'var(--color-on-primary-1)' : 'var(--color-on-surface)',
            border: mode === 'keyboard' ? 'none' : '1px solid var(--color-border)',
          }}
        >
          <Keyboard size={14} />
          Keyboard
        </button>
      </div>

      <div className="flex gap-4">
        {['Save changes', 'Cancel', 'Delete'].map((label, i) => (
          <motion.div
            key={label}
            className="font-sans text-sm font-semibold px-5 py-2.5 rounded-m text-center"
            style={{
              backgroundColor: i === 0 ? 'var(--color-primary-1)' : i === 2 ? 'var(--color-danger-secondary-1, #FDF1F1)' : 'var(--color-surface-2)',
              color: i === 0 ? 'var(--color-on-primary-1)' : i === 2 ? 'var(--color-error)' : 'var(--color-on-surface)',
              border: i === 0 ? 'none' : `1px solid ${i === 2 ? 'var(--color-error)' : 'var(--color-border)'}`,
              outline: mode === 'keyboard' && i === 1 ? '2px solid var(--color-primary-1)' : 'none',
              outlineOffset: '2px',
            }}
            animate={{
              scale: mode === 'keyboard' && i === 1 ? 1.02 : 1,
            }}
            transition={spring.snappy}
          >
            {label}
          </motion.div>
        ))}
      </div>

      <p className="font-sans text-sm font-medium mt-6" style={{ color: 'var(--color-on-surface-subtle-1)', opacity: 0.7 }}>
        {mode === 'mouse'
          ? 'Mouse mode: focus rings are hidden. Users see hover states instead.'
          : 'Keyboard mode: focus ring visible on the active element. 2px primary, 2px offset.'}
      </p>
    </DemoCard>
  );
}

function ScreenReaderDemo() {
  const [showAria, setShowAria] = useState(false);

  const elements = [
    {
      visual: <div className="w-10 h-10 rounded-m flex items-center justify-center" style={{ backgroundColor: 'var(--color-error)', color: '#fff' }}><X size={16} /></div>,
      noAria: '<div onclick="close()">✕</div>',
      withAria: '<button aria-label="Close dialog">✕</button>',
      announced: '"Close dialog, button"',
    },
    {
      visual: <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--color-success)' }} /><span className="font-sans text-sm font-medium" style={{ color: 'var(--color-on-surface)' }}>Online</span></div>,
      noAria: '<span class="green-dot"></span>',
      withAria: '<span role="status">Online</span>',
      announced: '"Online, status"',
    },
    {
      visual: <div className="flex items-center gap-2"><Eye size={16} style={{ color: 'var(--color-on-surface-subtle-1)' }} /><span className="font-sans text-sm font-medium" style={{ color: 'var(--color-on-surface)' }}>Show</span></div>,
      noAria: '<img src="eye.svg" onclick="toggle()">',
      withAria: '<button aria-label="Show password"><EyeIcon /></button>',
      announced: '"Show password, button"',
    },
  ];

  return (
    <DemoCard
      label="Interactive"
      title="What screen readers hear"
      description="Toggle between the visual and the announced version. If the screen reader version doesn't make sense, neither does your component."
    >
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setShowAria(false)}
          className="font-sans text-sm font-semibold px-4 py-2 rounded-m cursor-pointer inline-flex items-center gap-2"
          style={{
            backgroundColor: !showAria ? 'var(--color-primary-1)' : 'var(--color-surface-2)',
            color: !showAria ? 'var(--color-on-primary-1)' : 'var(--color-on-surface)',
            border: !showAria ? 'none' : '1px solid var(--color-border)',
          }}
        >
          <EyeOff size={14} />
          Without ARIA
        </button>
        <button
          onClick={() => setShowAria(true)}
          className="font-sans text-sm font-semibold px-4 py-2 rounded-m cursor-pointer inline-flex items-center gap-2"
          style={{
            backgroundColor: showAria ? 'var(--color-primary-1)' : 'var(--color-surface-2)',
            color: showAria ? 'var(--color-on-primary-1)' : 'var(--color-on-surface)',
            border: showAria ? 'none' : '1px solid var(--color-border)',
          }}
        >
          <Eye size={14} />
          With ARIA
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {elements.map((el, i) => (
          <div
            key={i}
            className="flex items-center gap-6 p-4 rounded-lg"
            style={{
              backgroundColor: showAria ? 'var(--color-success-alpha-10, rgba(34,197,94,0.08))' : 'var(--color-surface-2)',
              border: `1px solid ${showAria ? 'var(--color-success)' : 'var(--color-border)'}`,
            }}
          >
            <div className="shrink-0 w-12 flex justify-center">{el.visual}</div>
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={showAria ? 'aria' : 'no-aria'}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: dur.fast, ease: ease.enter }}
                >
                  <p className="font-mono text-sm mb-1" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                    {showAria ? el.withAria : el.noAria}
                  </p>
                  {showAria && (
                    <p className="font-sans text-sm font-semibold" style={{ color: 'var(--color-success)' }}>
                      Announced: {el.announced}
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </DemoCard>
  );
}

function ColourBlindDemo() {
  const examples = colourMistakes;
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const toggleCard = (i: number) => setRevealed(prev => ({ ...prev, [i]: !prev[i] }));
  const revealAll = () => {
    const all: Record<number, boolean> = {};
    examples.forEach((_, i) => { all[i] = true; });
    setRevealed(all);
  };
  const resetAll = () => setRevealed({});

  return (
    <DemoCard
      label="Interactive"
      title="Beyond colour"
      description="Colour is decoration, not information. Click each card to see how to make it work without colour alone."
    >
      <div className="grid grid-cols-2 gap-4 mb-6">
        {examples.map((ex, i) => {
          const isGood = !!revealed[i];
          return (
            <motion.button
              key={i}
              onClick={() => toggleCard(i)}
              className="rounded-lg p-5 text-left cursor-pointer w-full"
              style={{
                backgroundColor: isGood ? 'var(--color-success-alpha-10, rgba(34,197,94,0.08))' : 'var(--color-surface-2)',
                border: `1px solid ${isGood ? 'var(--color-success)' : 'var(--color-border)'}`,
              }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.01 }}
              transition={spring.snappy}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <span
                  className="font-mono text-xs font-medium px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: isGood ? 'var(--color-success-alpha-10, rgba(34,197,94,0.12))' : 'var(--color-surface-3)',
                    color: isGood ? 'var(--color-success)' : 'var(--color-on-surface-subtle-1)',
                  }}
                >
                  {ex.label}
                </span>
                <motion.div
                  animate={{ rotate: isGood ? 0 : 180 }}
                  transition={spring.snappy}
                >
                  {isGood
                    ? <Check size={14} color="var(--color-success)" />
                    : <X size={14} color="var(--color-on-surface-subtle-1)" />
                  }
                </motion.div>
              </div>

              <AnimatePresence mode="wait">
                {isGood ? (
                  <motion.p
                    key="good"
                    className="font-sans text-md font-semibold leading-relaxed text-left"
                    style={{ color: 'var(--color-on-surface)' }}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: dur.fast, ease: ease.enter }}
                  >
                    "{ex.good}"
                  </motion.p>
                ) : (
                  <motion.p
                    key="bad"
                    className="font-sans text-md font-medium leading-relaxed text-left"
                    style={{ color: 'var(--color-on-surface-subtle-1)' }}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: dur.fast, ease: ease.enter }}
                  >
                    "{ex.bad}"
                  </motion.p>
                )}
              </AnimatePresence>

              <p
                className="font-sans text-sm font-medium mt-3"
                style={{ color: 'var(--color-on-surface-subtle-1)', opacity: 0.6 }}
              >
                {isGood ? 'Click to see the problem' : 'Click to see the fix'}
              </p>
            </motion.button>
          );
        })}
      </div>

      <div className="flex gap-3">
        <button
          onClick={revealAll}
          className="font-sans text-sm font-semibold px-4 py-2 rounded-m cursor-pointer"
          style={{ backgroundColor: 'var(--color-primary-1)', color: 'var(--color-on-primary-1)' }}
        >
          Reveal all
        </button>
        <button
          onClick={resetAll}
          className="font-sans text-sm font-semibold px-4 py-2 rounded-m cursor-pointer inline-flex items-center gap-1.5"
          style={{
            backgroundColor: 'var(--color-surface-2)',
            color: 'var(--color-on-surface)',
            border: '1px solid var(--color-border)',
          }}
        >
          <RefreshCw size={13} />
          Reset
        </button>
      </div>
    </DemoCard>
  );
}

function AccessibilityChecklist() {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const score = Object.values(checked).filter(Boolean).length;
  const toggle = (i: number) => setChecked(prev => ({ ...prev, [i]: !prev[i] }));

  const scoreColor = score === checklist.length
    ? 'var(--color-success)'
    : score >= 5
    ? 'var(--color-warning)'
    : 'var(--color-error)';

  const scoreLabel = score === checklist.length
    ? 'Ship it. Accessibly.'
    : score >= 5
    ? 'Getting there.'
    : 'Keep going.';

  return (
    <DemoCard
      label="Checklist"
      title="Pre-ship accessibility audit"
      description="Eight checks that catch eighty percent of accessibility issues. Run them before every PR. No exceptions."
    >
      <div className="flex flex-col gap-2 mb-6">
        {checklist.map((c, i) => {
          const isChecked = !!checked[i];
          return (
            <motion.button
              key={i}
              onClick={() => toggle(i)}
              className="flex items-start gap-3 p-4 rounded-lg text-left cursor-pointer w-full"
              animate={{
                backgroundColor: isChecked
                  ? 'var(--color-success-alpha-10, rgba(34,197,94,0.08))'
                  : 'var(--color-surface-1)',
              }}
              transition={{ duration: dur.instant, ease: ease.standard }}
              style={{ border: '1px solid var(--color-border)' }}
            >
              <motion.div
                className="shrink-0 mt-0.5 w-5 h-5 rounded flex items-center justify-center"
                animate={{
                  backgroundColor: isChecked ? 'var(--color-success)' : 'var(--color-surface-2)',
                  borderColor: isChecked ? 'transparent' : 'var(--color-border)',
                }}
                transition={{ duration: dur.instant, ease: ease.standard }}
                style={{ border: '1.5px solid var(--color-border)' }}
              >
                <AnimatePresence>
                  {isChecked && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={spring.snappy}
                    >
                      <Check size={11} color="white" strokeWidth={2.5} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <div className="flex-1">
                <p
                  className="font-sans text-md font-semibold leading-snug"
                  style={{
                    color: isChecked ? 'var(--color-success)' : 'var(--color-on-surface)',
                    textDecoration: isChecked ? 'line-through' : 'none',
                    opacity: isChecked ? 0.7 : 1,
                  }}
                >
                  {c.q}
                </p>
                <p
                  className="font-sans text-sm font-medium mt-0.5"
                  style={{ color: 'var(--color-on-surface-subtle-1)', opacity: 0.7 }}
                >
                  {c.hint}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>

      <motion.div
        className="flex items-center justify-between p-4 rounded-lg"
        animate={{ backgroundColor: `${scoreColor}15` }}
        transition={{ duration: dur.base, ease: ease.standard }}
        style={{ border: `1px solid ${scoreColor}40` }}
      >
        <div>
          <p className="font-sans text-md font-bold" style={{ color: scoreColor }}>
            {score} / {checklist.length} checked
          </p>
          <p className="font-sans text-sm font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
            {scoreLabel}
          </p>
        </div>
        <button
          onClick={() => setChecked({})}
          className="font-sans text-sm font-semibold px-3 py-1.5 rounded-m cursor-pointer inline-flex items-center gap-1.5"
          style={{
            backgroundColor: 'var(--color-surface-2)',
            color: 'var(--color-on-surface)',
            border: '1px solid var(--color-border)',
          }}
        >
          <RefreshCw size={12} />
          Reset
        </button>
      </motion.div>
    </DemoCard>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────────────── */

export type AccessibilitySectionKey = 'mindset' | 'interaction' | 'semantics' | 'testing';

interface AccessibilityProps {
  sectionRefs?: Partial<Record<AccessibilitySectionKey, (el: HTMLDivElement | null) => void>>;
}

export default function Accessibility({ sectionRefs }: AccessibilityProps = {}) {
  return (
    <div className="space-y-20">

      {/* ══ MINDSET ══════════════════════════════════════════════════════════ */}
      <div ref={sectionRefs?.mindset} className="scroll-mt-8 space-y-20">
        <div className="mb-4">
          <h2
            className="font-brand font-bold leading-[0.95]"
            style={{ fontSize: 'clamp(56px, 7vw, 104px)', color: 'var(--color-on-surface)' }}
          >
            MINDSET
          </h2>
        </div>

      {/* ─ Hero ─────────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-start gap-8">
          <div className="w-28 h-28 rounded-3xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-primary-1)' }}>
            <Shield size={64} color="white" strokeWidth={1.5} />
          </div>
          <div>
            <div className="font-mono text-sm font-medium inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4" style={{ backgroundColor: 'var(--color-primary-1-alpha-10)', color: 'var(--color-primary-1)' }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-primary-1)' }} />
              Foundations
            </div>
            <h1 className="font-display text-headline-2xl font-bold mb-4" style={{ color: 'var(--color-on-surface)' }}>
              If it's not accessible,{' '}<span style={{ color: 'var(--color-primary-1)' }}>it's not done</span>
            </h1>
            <p className="font-sans text-lg font-medium max-w-[600px] leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
              Accessibility isn't a feature you add after the design looks good. It's the reason the design
              looks good. Every component in Kvalt is built to work for everyone — keyboard users, screen
              reader users, people with low vision, people in bright sunlight, people who are just tired.
              Because software that excludes people is broken software.
            </p>
          </div>
        </div>
      </section>

      {/* ─ 01  Mindset ──────────────────────────────────────────────── */}
      <section>
        <SectionHeader n="01" title="Mindset" />
        <Lead>
          Three principles. Not aspirational posters — engineering constraints. Treat them the same
          way you treat "don't ship with a memory leak."
        </Lead>

        <div className="grid grid-cols-3 gap-4">
          {traits.map(({ title, color, body }) => (
            <div
              key={title}
              className="rounded-lg p-6"
              style={{ backgroundColor: 'var(--color-surface-1)', borderTop: `3px solid ${color}` }}
            >
              <h3 className="font-sans text-md font-bold mb-2" style={{ color: 'var(--color-on-surface)' }}>
                {title}
              </h3>
              <p className="font-sans text-md font-medium leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                {body}
              </p>
            </div>
          ))}
        </div>

        <Callout title="The rule">
          Accessibility is not a backlog item. It ships with the component or the component doesn't
          ship. You don't file a follow-up ticket to "add ramp to building later."
        </Callout>
      </section>

      </div>{/* end: mindset */}

      {/* ══ INTERACTION ══════════════════════════════════════════════════════ */}
      <div ref={sectionRefs?.interaction} className="scroll-mt-8 space-y-20">
        <div className="mb-4">
          <h2
            className="font-brand font-bold leading-[0.95]"
            style={{ fontSize: 'clamp(56px, 7vw, 104px)', color: 'var(--color-on-surface)' }}
          >
            INTERACTION
          </h2>
        </div>

      {/* ─ 02  Contrast ─────────────────────────────────────────────── */}
      <section>
        <SectionHeader n="02" title="Colour contrast" />
        <Lead>
          If someone can't read it, nothing else matters. Not the layout. Not the animation.
          Not how good the type looks at 2 am on your calibrated monitor.
        </Lead>

        <ContrastDemo />

        <DoDont
          doText="Test contrast in both light and dark themes. Check at 200% zoom. Check on a cheap monitor in a sunny room. That's where your users are."
          dontText={<>Eyeball it. 'It looks fine to me' is not a contrast ratio. Use the <a href="https://developer.chrome.com/docs/devtools/accessibility/contrast" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-on-secondary-1)' }}>DevTools contrast checker</a> or the <a href="https://chromewebstore.google.com/detail/wcag-color-contrast-check/plnahcmalebffmaghcpcmpaciebdhgdf" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-on-secondary-1)' }}>WCAG Contrast Checker plugin</a>. Every time.</>}
        />
      </section>

      {/* ─ 03  Focus management ─────────────────────────────────────── */}
      <section>
        <SectionHeader n="03" title="Focus management" />
        <Lead>
          Focus is the cursor for keyboard users. Losing focus is like the mouse disappearing.
          If you've ever lost your cursor on a big monitor, you know how that feels. Now imagine
          it happens every time you press Tab.
        </Lead>

        <FocusDemo />

        <div className="space-y-6 mt-8">
          {focusRules.map((r, i) => (
            <div key={i} className="flex gap-5 items-start">
              <span
                className="font-mono text-sm font-bold shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--color-primary-1-alpha-10)', color: 'var(--color-primary-1)' }}
              >
                {i + 1}
              </span>
              <div>
                <h4 className="font-sans text-md font-bold mb-1" style={{ color: 'var(--color-on-surface)' }}>{r.title}</h4>
                <p className="font-sans text-md font-medium leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─ 04  Keyboard navigation ──────────────────────────────────── */}
      <section>
        <SectionHeader n="04" title="Keyboard navigation" />
        <Lead>
          Not everyone uses a mouse. Some people can't. Some people choose not to. Some people
          are eating lunch with one hand. The reason doesn't matter. The keyboard must work.
        </Lead>

        <div
          className="rounded-lg overflow-hidden"
          style={{ border: '1px solid var(--color-border)' }}
        >
          <div
            className="grid grid-cols-[140px_180px_1fr] gap-4 px-6 py-3"
            style={{ backgroundColor: 'var(--color-surface-2)' }}
          >
            <span className="font-sans text-sm font-bold" style={{ color: 'var(--color-on-surface-subtle-2)' }}>Element</span>
            <span className="font-sans text-sm font-bold" style={{ color: 'var(--color-on-surface-subtle-2)' }}>Keys</span>
            <span className="font-sans text-sm font-bold" style={{ color: 'var(--color-on-surface-subtle-2)' }}>Watch out</span>
          </div>

          {keyboardPatterns.map((row, i) => (
            <div
              key={row.element}
              className="grid grid-cols-[140px_180px_1fr] gap-4 items-center px-6 py-4"
              style={{
                backgroundColor: i % 2 === 0 ? 'var(--color-surface-1)' : 'transparent',
                borderTop: '1px solid var(--color-border)',
              }}
            >
              <span className="font-mono text-sm font-medium" style={{ color: 'var(--color-primary-1)' }}>
                {row.element}
              </span>
              <span className="font-mono text-sm font-medium" style={{ color: 'var(--color-on-surface)' }}>
                {row.keys}
              </span>
              <span className="font-sans text-md font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                {row.note}
              </span>
            </div>
          ))}
        </div>

        <Callout title="The five-second test">
          Put your mouse in a drawer. Navigate to the feature you just built. If you get stuck within
          five seconds, there's a keyboard trap. Fix it before you fix anything else.
        </Callout>
      </section>

      {/* ─ 05  Colour independence ──────────────────────────────────── */}
      <section>
        <SectionHeader n="05" title="Colour independence" />
        <Lead>
          8% of men and 0.5% of women have some form of colour vision deficiency. That's roughly
          one in every twelve male users. If your error state is "the border turns red," you've
          just made an invisible error for a lot of people.
        </Lead>

        <ColourBlindDemo />

        <DoDont
          doText="Pair every colour signal with a text label, icon, or pattern. Red border + error text + error icon. Belt, suspenders, and a backup belt."
          dontText="Use green for success and red for error with no other indicator. Congratulations, you've built a traffic light for people who can't see traffic lights."
        />
      </section>

      </div>{/* end: interaction */}

      {/* ══ SEMANTICS ════════════════════════════════════════════════════════ */}
      <div ref={sectionRefs?.semantics} className="scroll-mt-8 space-y-20">
        <div className="mb-4">
          <h2
            className="font-brand font-bold leading-[0.95]"
            style={{ fontSize: 'clamp(56px, 7vw, 104px)', color: 'var(--color-on-surface)' }}
          >
            SEMANTICS
          </h2>
        </div>

      {/* ─ 06  Screen readers & ARIA ────────────────────────────────── */}
      <section>
        <SectionHeader n="06" title="Screen readers & ARIA" />
        <Lead>
          Screen readers translate your UI into a stream of spoken words. If your HTML is semantic,
          most of the work is done. ARIA fills the gaps — but it's a repair kit, not a foundation.
        </Lead>

        <ScreenReaderDemo />

        <div className="flex flex-col gap-4 mt-8">
          {ariaRules.map(({ n, title, body }) => (
            <div
              key={n}
              className="flex gap-6 p-6 rounded-lg"
              style={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}
            >
              <span
                className="font-mono text-sm font-bold shrink-0 w-6 h-6 flex items-center justify-center rounded-full mt-0.5"
                style={{ backgroundColor: 'var(--color-primary-1-alpha-10)', color: 'var(--color-primary-1)' }}
              >
                {n}
              </span>
              <div>
                <p className="font-sans text-md font-bold mb-1" style={{ color: 'var(--color-on-surface)' }}>
                  {title}
                </p>
                <p className="font-sans text-md font-medium leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─ 07  Reduced motion ───────────────────────────────────────── */}
      <section>
        <SectionHeader n="07" title="Reduced motion" />
        <Lead>
          Some people get physically sick from animations. Not "slightly uncomfortable" — actually
          nauseous. Respecting prefers-reduced-motion is not optional. It's the difference between
          a usable app and a health hazard.
        </Lead>

        <div className="grid grid-cols-2 gap-4">
          {[
            { title: 'What gets removed', body: 'All spatial motion — slides, bounces, scale transitions, parallax. Elements appear and disappear instantly or with a short opacity fade (max 100ms).' },
            { title: 'What stays', body: 'Opacity transitions under 200ms. Colour changes. Focus ring appearance. Anything that doesn\'t involve physical movement through space.' },
            { title: 'How to implement', body: 'Motion\'s useReducedMotion() hook returns true when the OS preference is set. All duration tokens automatically drop to 0ms. You don\'t need per-component logic.' },
            { title: 'How to test', body: 'macOS: System Settings → Accessibility → Display → Reduce motion. Then use your entire app. If anything still bounces, slides, or zooms, fix it.' },
          ].map(({ title, body }) => (
            <div
              key={title}
              className="p-6 rounded-lg"
              style={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}
            >
              <p className="font-sans text-md font-bold mb-2" style={{ color: 'var(--color-on-surface)' }}>
                {title}
              </p>
              <p className="font-sans text-md font-medium leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                {body}
              </p>
            </div>
          ))}
        </div>

        <Callout title="It's one line of CSS">
          If you're thinking "we'll add reduced motion support later" — it's a media query. It takes
          less time than this callout took to read.
        </Callout>
      </section>

      {/* ─ 08  Zoom & reflow ────────────────────────────────────────── */}
      <section>
        <SectionHeader n="08" title="Zoom & reflow" />
        <Lead>
          WCAG requires content to be usable at 200% zoom. That's not a suggestion — it's the
          legal minimum in many countries. And it's easier to hit than you think if you use
          relative units.
        </Lead>

        <div className="space-y-6">
          {[
            { title: 'Use rem for font sizes, not px.', desc: 'Users who set a larger default font size in their browser are telling you something. If you use px, you\'re overriding their explicit preference.' },
            { title: 'No horizontal scrolling at 320px viewport.', desc: 'At 200% zoom on a 1280px screen, the effective viewport is 640px. Content must reflow. If it doesn\'t, flexbox and grid are your friends.' },
            { title: 'Touch targets: 44×44px minimum.', desc: 'WCAG 2.2 requires it. Small buttons on mobile aren\'t just annoying — they\'re exclusionary for people with motor impairments. Pad the click area even if the visual is smaller.' },
            { title: 'Test with browser zoom, not CSS scale.', desc: 'Ctrl/Cmd + actually changes the viewport. CSS transform: scale() does not. They test completely different things. Use browser zoom.' },
          ].map((r, i) => (
            <div key={i} className="flex gap-5 items-start">
              <span
                className="font-mono text-sm font-bold shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--color-primary-1-alpha-10)', color: 'var(--color-primary-1)' }}
              >
                {i + 1}
              </span>
              <div>
                <h4 className="font-sans text-md font-bold mb-1" style={{ color: 'var(--color-on-surface)' }}>{r.title}</h4>
                <p className="font-sans text-md font-medium leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      </div>{/* end: semantics */}

      {/* ══ TESTING ══════════════════════════════════════════════════════════ */}
      <div ref={sectionRefs?.testing} className="scroll-mt-8 space-y-20">
        <div className="mb-4">
          <h2
            className="font-brand font-bold leading-[0.95]"
            style={{ fontSize: 'clamp(56px, 7vw, 104px)', color: 'var(--color-on-surface)' }}
          >
            TESTING
          </h2>
        </div>

      {/* ─ 09  Checklist ────────────────────────────────────────────── */}
      <section>
        <SectionHeader n="09" title="Pre-ship checklist" />
        <Lead>
          Eight questions. If you can answer yes to all of them, you've covered the ground that
          catches most real-world accessibility failures. This is not a replacement for a full
          audit — it's the minimum bar.
        </Lead>

        <AccessibilityChecklist />
      </section>

      {/* ─ 10  Testing ──────────────────────────────────────────────── */}
      <section>
        <SectionHeader n="10" title="Testing" />
        <Lead>
          Automated tools catch about 30% of accessibility issues. The other 70% require a
          human. Preferably one who actually uses assistive technology.
        </Lead>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { title: 'Automated (CI)', body: 'axe-core in your test suite catches missing alt text, low contrast, missing labels, and ARIA violations. Run it on every PR. It\'s fast, free, and catches the obvious stuff.' },
            { title: 'Manual (every PR)', body: 'Tab through the entire flow. Turn on VoiceOver (macOS) or NVDA (Windows) and navigate without looking at the screen. Zoom to 200%. Toggle reduced motion. Five minutes, every time.' },
            { title: 'User testing (quarterly)', body: 'Nothing replaces watching someone who uses a screen reader try to complete a task. Schedule it. Budget for it. The insights will surprise you every single time.' },
          ].map(a => (
            <div
              key={a.title}
              className="rounded-lg p-6"
              style={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}
            >
              <h3 className="font-sans text-md font-bold mb-3" style={{ color: 'var(--color-on-surface)' }}>
                {a.title}
              </h3>
              <p className="font-sans text-md font-medium leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                {a.body}
              </p>
            </div>
          ))}
        </div>

        <Callout title="Accessibility is not a checklist">
          This page has checklists because checklists are useful starting points. But real accessibility
          is a practice, not a punch list. The question is never "did we check all the boxes?" It's
          "can everyone actually use this thing?"
        </Callout>
      </section>

      </div>{/* end: testing */}

    </div>
  );
}
