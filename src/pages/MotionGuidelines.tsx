import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles, Timer, Zap, TrendingUp, Layers, Play, Code, ListOrdered, Gauge, Accessibility, Activity,
  Check, X, Heart, Inbox, Bell, Star, ChevronDown, ChevronRight, Settings, User,
} from 'lucide-react';
import { usePress } from '../hooks/usePress';
import { spring, duration as dur, ease, transition } from '../tokens/motion';
import { shadows } from '../tokens/shadows';

/* ─── Data ────────────────────────────────────────────────────────────────── */

const durations = [
  { token: 'duration.instant',  value: '100ms', ms: 100,  use: 'Micro-feedback: button press, checkbox, color change' },
  { token: 'duration.fast',     value: '160ms', ms: 160,  use: 'Small state changes: hover, focus ring, tooltip' },
  { token: 'duration.base',     value: '240ms', ms: 240,  use: 'Standard transitions: dropdown, popover, tab switch' },
  { token: 'duration.moderate', value: '340ms', ms: 340,  use: 'Panel reveals, accordion, sidebar, modal' },
  { token: 'duration.slow',     value: '480ms', ms: 480,  use: 'Page-level transitions, large layout shifts' },
];

const easings = [
  { token: 'ease.enter',    css: 'cubic-bezier(0, 0, 0.2, 1)',   use: 'Element fading in, color appearing, background filling' },
  { token: 'ease.exit',     css: 'cubic-bezier(0.4, 0, 1, 1)',   use: 'Element fading out, dissolving, leaving the screen' },
  { token: 'ease.standard', css: 'cubic-bezier(0.4, 0, 0.2, 1)', use: 'Persistent element changing state (color shift, border)' },
];

const semanticTokens = [
  { name: 'motion.feedback',  recipe: 'instant · snappy spring',             desc: 'Button press, checkbox, toggle. Feels like direct manipulation.',     color: 'var(--color-primary-1)' },
  { name: 'motion.reveal',    recipe: 'base · ease.enter + default spring',  desc: 'Tooltip, popover, dropdown appearing. Fades in, slides subtly.',      color: 'var(--color-primary-1)' },
  { name: 'motion.dismiss',   recipe: 'fast · ease.exit + snappy spring',    desc: 'Closing, removing, hiding. Exits quicker than it entered.',           color: 'var(--color-warning)' },
  { name: 'motion.expand',    recipe: 'moderate · default spring',            desc: 'Accordion, drawer, sidebar. Spatial expansion with weight.',          color: 'var(--color-primary-1)' },
  { name: 'motion.navigate',  recipe: 'slow · default spring',               desc: 'Page transitions, route changes. Largest, slowest motion.',           color: 'var(--color-primary-1)' },
  { name: 'motion.celebrate', recipe: 'moderate · playful spring',            desc: 'Success, achievement, completion. The quirky one. Has bounce.',       color: 'var(--color-success)' },
];

const choreographyRules = [
  { title: 'Exit before enter.', desc: 'When swapping content (tabs, route changes), outgoing element finishes leaving before incoming starts. Prevents visual clutter, maintains spatial clarity.' },
  { title: 'Parent before children.', desc: 'Container begins animation before contents. Modal slides in, then inner elements stagger in. Never the reverse.' },
  { title: 'Stagger is 50 ms, never more.', desc: 'The stagger token is 50 ms between items. Past that, the "wave" effect feels like lag. For fast lists, use 30 ms.' },
  { title: 'Dismiss is always faster than reveal.', desc: 'When the user closes something, they\'ve decided — get out of their way. Exit animations should be roughly 60-70 % the duration of enter animations.' },
];

const sectionMeta: Record<string, { icon: React.ElementType; bg: string }> = {
  '01': { icon: Sparkles,      bg: '#6366f1' },
  '02': { icon: Timer,         bg: '#f59e0b' },
  '03': { icon: Zap,           bg: '#06b6d4' },
  '04': { icon: TrendingUp,    bg: '#8b5cf6' },
  '05': { icon: Layers,        bg: '#14b8a6' },
  '06': { icon: Play,          bg: '#ef4444' },
  '07': { icon: Code,          bg: '#3b82f6' },
  '08': { icon: ListOrdered,   bg: '#ec4899' },
  '09': { icon: Gauge,         bg: '#10b981' },
  '10': { icon: Accessibility, bg: '#6366f1' },
};

/* ─── Shared helpers ─────────────────────────────────────────────────────── */

function SectionHeader({ n, title }: { n: string; title: string }) {
  const meta = sectionMeta[n];
  const Icon = meta?.icon ?? Sparkles;
  const bg = meta?.bg ?? 'var(--color-primary-1)';
  return (
    <div className="flex items-center gap-5 mb-6">
      <div className="w-20 h-20 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: bg }}>
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
  return <p className="font-sans text-base font-medium mb-10 max-w-[680px] leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{children}</p>;
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="rounded-lg p-5 font-mono text-sm leading-relaxed overflow-x-auto" style={{ backgroundColor: 'var(--color-surface-1)', color: 'var(--color-on-surface-subtle-1)', border: '1px solid var(--color-border)' }}>
      <code>{children}</code>
    </pre>
  );
}

function Callout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg p-6 my-8" style={{ backgroundColor: 'var(--color-surface-1)', borderLeft: '3px solid var(--color-warning)' }}>
      <p className="font-sans text-md font-bold mb-2" style={{ color: 'var(--color-warning)' }}>{title}</p>
      <p className="font-sans text-md font-medium leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{children}</p>
    </div>
  );
}

function DoDont({ doText, dontText }: { doText: string; dontText: string }) {
  return (
    <div className="grid grid-cols-2 gap-4 my-8">
      <div className="rounded-lg p-5" style={{ backgroundColor: 'var(--color-surface-1)', borderTop: '3px solid var(--color-success)' }}>
        <p className="font-sans text-sm font-bold mb-2" style={{ color: 'var(--color-success)' }}>Do</p>
        <p className="font-sans text-md font-medium leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{doText}</p>
      </div>
      <div className="rounded-lg p-5" style={{ backgroundColor: 'var(--color-surface-1)', borderTop: '3px solid var(--color-error)' }}>
        <p className="font-sans text-sm font-bold mb-2" style={{ color: 'var(--color-error)' }}>Don't</p>
        <p className="font-sans text-md font-medium leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{dontText}</p>
      </div>
    </div>
  );
}

function Label({ children, color }: { children: string; color?: string }) {
  return (
    <span className="font-mono text-sm font-medium px-2.5 py-1 rounded-m inline-block mb-3" style={{ backgroundColor: color ? `${color}15` : 'var(--color-primary-1-alpha-10)', color: color || 'var(--color-primary-1)' }}>
      {children}
    </span>
  );
}

/** Full-width demo strip — the building block for every example. */
function Demo({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg p-6 w-full" style={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}>
      <div className="flex items-baseline gap-3 mb-1">
        <Label>Interactive</Label>
        <h4 className="font-sans text-md font-bold" style={{ color: 'var(--color-on-surface)' }}>{title}</h4>
      </div>
      <p className="font-sans text-sm font-medium mb-6" style={{ color: 'var(--color-on-surface-subtle-2)' }}>{description}</p>
      {children}
    </div>
  );
}

function DemoButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  const { isPressed, pressHandlers } = usePress({});
  return (
    <motion.button onClick={onClick} className="font-sans text-sm font-semibold px-4 py-2 rounded-m cursor-pointer" style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-on-surface)', border: '1px solid var(--color-border)' }} animate={{ scale: isPressed ? 0.97 : 1 }} transition={spring.snappy} {...pressHandlers}>
      {children}
    </motion.button>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   01 · PERSONALITY DEMOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function PersonalityDemo1() {
  const { isPressed: fastPressed, pressHandlers: fastH } = usePress({});
  const { isPressed: slowPressed, pressHandlers: slowH } = usePress({});
  return (
    <Demo title="Quick, not rushed" description="Press both buttons. The left responds instantly — direct manipulation. The right has a 400ms delay that makes it feel broken.">
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col items-center gap-3">
          <motion.button className="w-full h-14 rounded-lg font-sans text-md font-semibold cursor-pointer" style={{ backgroundColor: 'var(--color-primary-1)', color: 'var(--color-on-primary)' }} animate={{ scale: fastPressed ? 0.95 : 1 }} transition={spring.snappy} {...fastH}>Quick — instant feedback</motion.button>
          <span className="font-mono text-xs" style={{ color: 'var(--color-on-surface-subtle-2)' }}>spring.snappy · 0 ms delay</span>
        </div>
        <div className="flex flex-col items-center gap-3">
          <motion.button className="w-full h-14 rounded-lg font-sans text-md font-semibold cursor-pointer" style={{ backgroundColor: 'var(--color-surface-3)', color: 'var(--color-on-surface)' }} animate={{ scale: slowPressed ? 0.95 : 1 }} transition={{ type: 'spring', visualDuration: 0.8, bounce: 0 }} {...slowH}>Rushed — feels sluggish</motion.button>
          <span className="font-mono text-xs" style={{ color: 'var(--color-on-surface-subtle-2)' }}>visualDuration: 0.8s — too slow</span>
        </div>
      </div>
    </Demo>
  );
}

function PersonalityDemo2() {
  const [go, setGo] = useState(false);
  return (
    <Demo title="Alive, not hyperactive" description="Click to toggle. Left cards use springs with natural momentum. Right cards use linear timing — robotic and lifeless.">
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-xs font-medium mb-1" style={{ color: 'var(--color-primary-1)' }}>spring.default (bounce: 0.1)</span>
          {[0, 1, 2].map(i => (
            <motion.div key={i} className="h-12 rounded-lg" style={{ backgroundColor: 'var(--color-primary-1)', opacity: 0.15 + i * 0.25 }} animate={{ x: go ? 40 : 0, scale: go ? 1.02 : 1 }} transition={{ ...spring.default, delay: i * 0.05 }} />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-mono text-xs font-medium mb-1" style={{ color: 'var(--color-on-surface-subtle-2)' }}>linear · 300ms — no life</span>
          {[0, 1, 2].map(i => (
            <motion.div key={i} className="h-12 rounded-lg" style={{ backgroundColor: 'var(--color-surface-4)' }} animate={{ x: go ? 40 : 0, scale: go ? 1.02 : 1 }} transition={{ duration: 0.3, ease: 'linear', delay: i * 0.05 }} />
          ))}
        </div>
      </div>
      <DemoButton onClick={() => setGo(v => !v)}>Toggle movement</DemoButton>
    </Demo>
  );
}

function PersonalityDemo3() {
  const [on, setOn] = useState(false);
  return (
    <Demo title="Quirky, not chaotic" description="Toggle both switches. Left has playful overshoot that adds personality. Right is stiff — functional but forgettable.">
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setOn(v => !v)} className="w-14 h-8 rounded-xl p-1 flex items-center cursor-pointer" style={{ backgroundColor: on ? 'var(--color-primary-1)' : 'var(--color-surface-4)' }}>
            <motion.div className="w-6 h-6 rounded-xl bg-white" animate={{ x: on ? 24 : 0 }} transition={spring.playful} />
          </button>
          <div>
            <span className="font-sans text-sm font-semibold block" style={{ color: 'var(--color-on-surface)' }}>Playful spring</span>
            <span className="font-mono text-xs" style={{ color: 'var(--color-on-surface-subtle-2)' }}>bounce: 0.25 — tiny overshoot</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setOn(v => !v)} className="w-14 h-8 rounded-xl p-1 flex items-center cursor-pointer" style={{ backgroundColor: on ? 'var(--color-surface-5)' : 'var(--color-surface-4)' }}>
            <motion.div className="w-6 h-6 rounded-xl bg-white" animate={{ x: on ? 24 : 0 }} transition={{ duration: 0.15, ease: 'linear' }} />
          </button>
          <div>
            <span className="font-sans text-sm font-semibold block" style={{ color: 'var(--color-on-surface)' }}>Linear</span>
            <span className="font-mono text-xs" style={{ color: 'var(--color-on-surface-subtle-2)' }}>No personality — just slides</span>
          </div>
        </div>
      </div>
    </Demo>
  );
}

function PersonalityDemo4() {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <Demo title="Hover with life" description="Hover over the cards. Springs give them a gentle floating quality — like they have weight and respond to your cursor.">
      <div className="grid grid-cols-4 gap-3">
        {[
          { icon: Heart, color: 'var(--color-danger-1)' },
          { icon: Star, color: 'var(--color-warning-1)' },
          { icon: Bell, color: 'var(--color-primary-1)' },
          { icon: Inbox, color: 'var(--color-success-1)' },
        ].map(({ icon: Icon, color }, i) => (
          <motion.div key={i} className="h-24 rounded-lg flex items-center justify-center cursor-pointer" style={{ backgroundColor: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }} animate={{ y: hovered === i ? -6 : 0, scale: hovered === i ? 1.03 : 1, boxShadow: hovered === i ? shadows['medium-1'] : 'none' }} transition={spring.default} onPointerEnter={() => setHovered(i)} onPointerLeave={() => setHovered(null)}>
            <Icon size={24} color={color} strokeWidth={2} />
          </motion.div>
        ))}
      </div>
    </Demo>
  );
}

function PersonalityDemo5() {
  const [show, setShow] = useState(false);
  const { isPressed, pressHandlers } = usePress({});
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trigger = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setShow(true);
    timer.current = setTimeout(() => setShow(false), 3000);
  }, []);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return (
    <Demo title="The whole personality" description="Press the button to see all three traits combined: instant press feedback (quick), spring slide-in (alive), and bounce overshoot (quirky).">
      <div className="relative h-20 mb-6">
        <AnimatePresence>
          {show && (
            <motion.div className="absolute inset-x-0 top-0 flex items-center gap-3 rounded-lg px-5 py-4" style={{ backgroundColor: 'var(--color-success-secondary-1)', border: '1px solid var(--color-success-1)' }} initial={{ opacity: 0, y: 12, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.98 }} transition={{ ...spring.playful, opacity: { duration: dur.base, ease: ease.enter } }}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...spring.playful, delay: 0.1 }}>
                <Check size={20} color="var(--color-success-1)" strokeWidth={2.5} />
              </motion.div>
              <span className="font-sans text-md font-semibold" style={{ color: 'var(--color-on-success-secondary)' }}>Changes saved to your project</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <motion.button onClick={trigger} className="font-sans text-sm font-semibold px-5 py-2.5 rounded-m cursor-pointer" style={{ backgroundColor: 'var(--color-primary-1)', color: 'var(--color-on-primary)' }} animate={{ scale: isPressed ? 0.95 : 1 }} transition={spring.snappy} {...pressHandlers}>
        Save changes
      </motion.button>
    </Demo>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   02 · DURATION DEMOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function DurationRaceDemo() {
  const [go, setGo] = useState(false);
  const tiers = [
    { label: 'instant', ms: 100, color: 'var(--color-primary-1)' },
    { label: 'fast', ms: 160, color: 'var(--color-success-1)' },
    { label: 'base', ms: 240, color: 'var(--color-warning-1)' },
    { label: 'moderate', ms: 340, color: 'var(--color-danger-1)' },
    { label: 'slow', ms: 480, color: 'var(--color-secondary-1)' },
  ];
  return (
    <Demo title="Duration race" description="Click to send all 5 duration tiers across the track. Notice how instant finishes before slow even gets halfway.">
      <div className="flex flex-col gap-2 mb-6">
        {tiers.map(t => (
          <div key={t.label} className="flex items-center gap-3">
            <span className="font-mono text-xs w-20 text-right shrink-0" style={{ color: 'var(--color-on-surface-subtle-2)' }}>{t.ms}ms</span>
            <div className="flex-1 h-8 rounded-xl relative overflow-hidden" style={{ backgroundColor: 'var(--color-surface-2)' }}>
              <motion.div className="absolute inset-y-0 left-0 rounded-xl" style={{ backgroundColor: t.color, width: '100%' }} animate={{ x: go ? 0 : '-100%' }} transition={{ duration: t.ms / 1000, ease: [0.4, 0, 0.2, 1] }} />
            </div>
            <span className="font-mono text-xs w-16 shrink-0" style={{ color: t.color }}>{t.label}</span>
          </div>
        ))}
      </div>
      <DemoButton onClick={() => setGo(v => !v)}>{go ? 'Reset' : 'Race'}</DemoButton>
    </Demo>
  );
}

function DurationInstantDemo() {
  const [active, setActive] = useState(false);
  return (
    <Demo title="Instant — 100ms" description="Click the chip. Color changes in 100ms — so fast it feels like direct manipulation. Perfect for micro-feedback.">
      <motion.button onClick={() => setActive(v => !v)} className="px-4 py-2 rounded-xl font-sans text-sm font-semibold cursor-pointer" animate={{ backgroundColor: active ? 'var(--color-primary-1)' : 'var(--color-surface-3)', color: active ? 'var(--color-on-primary)' : 'var(--color-on-surface)' }} transition={{ duration: dur.instant, ease: ease.standard }}>
        {active ? '● Active' : '○ Inactive'}
      </motion.button>
    </Demo>
  );
}

function DurationFastDemo() {
  const [focused, setFocused] = useState(false);
  return (
    <Demo title="Fast — 160ms" description="Click the input to toggle focus. The ring appears in 160ms — fast enough to feel responsive but visible enough to be perceived.">
      <motion.div className="rounded-lg px-4 py-3 font-sans text-md cursor-pointer w-full" style={{ backgroundColor: 'var(--color-surface-2)', color: focused ? 'var(--color-on-surface)' : 'var(--color-on-surface-subtle-2)' }} animate={{ boxShadow: focused ? '0 0 0 2px var(--color-primary-1)' : '0 0 0 1px var(--color-border)' }} transition={{ duration: dur.fast, ease: ease.standard }} onClick={() => setFocused(v => !v)}>
        {focused ? 'Type something here...' : 'Click to focus this input'}
      </motion.div>
    </Demo>
  );
}

function DurationBaseDemo() {
  const [open, setOpen] = useState(false);
  const items = ['Design tokens', 'Components', 'Patterns', 'Guidelines'];
  return (
    <Demo title="Base — 240ms" description="Open the dropdown. Items fade in at 240ms — the sweet spot for standard reveals. Fast enough for repeated use, slow enough to perceive.">
      <div className="relative">
        <DemoButton onClick={() => setOpen(v => !v)}>
          <span className="flex items-center gap-2">Select section <ChevronDown size={14} /></span>
        </DemoButton>
        <AnimatePresence>
          {open && (
            <motion.div className="absolute top-full left-0 mt-2 w-56 rounded-lg overflow-hidden z-10" style={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border)', boxShadow: shadows['medium-1'] }} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: dur.base, ease: ease.enter }}>
              {items.map((item, i) => (
                <motion.div key={item} className="px-4 py-2.5 font-sans text-sm cursor-pointer" style={{ color: 'var(--color-on-surface)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: dur.fast, delay: i * 0.03 }} onClick={() => setOpen(false)}>
                  {item}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Demo>
  );
}

function DurationModerateDemo() {
  const [open, setOpen] = useState(false);
  return (
    <Demo title="Moderate — 340ms" description="Toggle the accordion. It expands at 340ms — enough time for the eye to follow the spatial change without feeling sluggish.">
      <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
        <button onClick={() => setOpen(v => !v)} className="w-full flex items-center justify-between px-5 py-4 cursor-pointer" style={{ backgroundColor: 'var(--color-surface-2)' }}>
          <span className="font-sans text-md font-semibold" style={{ color: 'var(--color-on-surface)' }}>Project settings</span>
          <motion.div animate={{ rotate: open ? 90 : 0 }} transition={spring.snappy}><ChevronRight size={16} color="var(--color-on-surface-subtle-1)" /></motion.div>
        </button>
        <motion.div className="overflow-hidden" animate={{ height: open ? 'auto' : 0 }} transition={{ duration: dur.moderate, ease: ease.standard }} initial={false}>
          <div className="px-5 py-4 flex flex-col gap-3" style={{ borderTop: '1px solid var(--color-border)' }}>
            {['Project name', 'Description', 'Visibility', 'Notifications'].map(s => (
              <div key={s} className="flex items-center justify-between">
                <span className="font-sans text-sm" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{s}</span>
                <div className="w-32 h-8 rounded-m" style={{ backgroundColor: 'var(--color-surface-3)' }} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Demo>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   03 · SPRING DEMOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function SpringCompareDemo() {
  const [go, setGo] = useState(false);
  const configs = [
    { label: 'Snappy (bounce: 0)', spring: spring.snappy, color: 'var(--color-primary-1)' },
    { label: 'Default (bounce: 0.1)', spring: spring.default, color: 'var(--color-warning-1)' },
    { label: 'Playful (bounce: 0.25)', spring: spring.playful, color: 'var(--color-danger-1)' },
  ];
  return (
    <Demo title="Spring comparison" description="Watch all three springs move the same distance. Snappy arrives first with no overshoot. Default has a whisper. Playful bounces past and settles.">
      <div className="flex flex-col gap-3 mb-6">
        {configs.map(c => (
          <div key={c.label} className="flex items-center gap-3">
            <span className="font-mono text-xs w-44 shrink-0" style={{ color: c.color }}>{c.label}</span>
            <div className="flex-1 h-10 rounded-xl relative" style={{ backgroundColor: 'var(--color-surface-2)' }}>
              <motion.div className="absolute top-1 bottom-1 left-1 w-10 rounded-xl" style={{ backgroundColor: c.color }} animate={{ x: go ? 'calc(100cqw - 48px)' : 0 }} transition={c.spring} />
            </div>
          </div>
        ))}
      </div>
      <DemoButton onClick={() => setGo(v => !v)}>{go ? 'Reset' : 'Launch'}</DemoButton>
    </Demo>
  );
}

function SpringInterruptDemo() {
  const [pos, setPos] = useState(0);
  const positions = [0, 80, 160, 240, 160, 80, 0];
  return (
    <Demo title="Interrupt mid-flight" description="Click rapidly to change targets. The spring carries momentum into the new position — no jarring restart. This is why springs beat cubic-bezier.">
      <div className="h-16 rounded-lg relative mb-6" style={{ backgroundColor: 'var(--color-surface-2)' }}>
        <motion.div className="absolute top-2 bottom-2 w-12 rounded-lg" style={{ backgroundColor: 'var(--color-primary-1)' }} animate={{ x: positions[pos % positions.length] }} transition={spring.default} />
      </div>
      <DemoButton onClick={() => setPos(p => p + 1)}>Move to next position</DemoButton>
    </Demo>
  );
}

function SpringScaleDemo() {
  const [active, setActive] = useState<Record<string, boolean>>({ snappy: false, default: false, playful: false });
  return (
    <Demo title="Scale with springs" description="Click each card. Each spring gives scale a different character — crisp, natural, or bouncy.">
      <div className="grid grid-cols-3 gap-4">
        {([
          { key: 'snappy', label: 'Snappy', sp: spring.snappy, color: 'var(--color-primary-1)' },
          { key: 'default', label: 'Default', sp: spring.default, color: 'var(--color-warning-1)' },
          { key: 'playful', label: 'Playful', sp: spring.playful, color: 'var(--color-danger-1)' },
        ] as const).map(({ key, label, sp, color }) => (
          <motion.button key={key} className="h-24 rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer" style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }} animate={{ scale: active[key] ? 1.15 : 1 }} transition={sp} onClick={() => setActive(prev => ({ ...prev, [key]: !prev[key] }))}>
            <span className="font-sans text-md font-bold" style={{ color }}>{label}</span>
            <span className="font-mono text-xs" style={{ color: 'var(--color-on-surface-subtle-2)' }}>{active[key] ? 'scaled up' : 'click me'}</span>
          </motion.button>
        ))}
      </div>
    </Demo>
  );
}

function SpringRotateDemo() {
  const [spin, setSpin] = useState(0);
  return (
    <Demo title="Rotation with spring" description="Click the icon. Rotation with spring.playful feels physical — like flicking a dial. The overshoot adds satisfying follow-through.">
      <div className="flex items-center gap-6">
        <motion.div className="w-16 h-16 rounded-xl flex items-center justify-center cursor-pointer" style={{ backgroundColor: 'var(--color-primary-1)' }} animate={{ rotate: spin }} transition={spring.playful} onClick={() => setSpin(s => s + 90)}>
          <Settings size={32} color="white" strokeWidth={2} />
        </motion.div>
        <div>
          <span className="font-sans text-sm font-semibold block" style={{ color: 'var(--color-on-surface)' }}>Click to rotate +90°</span>
          <span className="font-mono text-xs" style={{ color: 'var(--color-on-surface-subtle-2)' }}>spring.playful · bounce: 0.25</span>
        </div>
      </div>
    </Demo>
  );
}

function SpringVsBezierDemo() {
  const [go, setGo] = useState(false);
  return (
    <Demo title="Spring vs cubic-bezier" description="Both travel the same distance. The spring (top) has natural deceleration and momentum. The bezier (bottom) feels mechanical and predetermined.">
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs w-24 shrink-0" style={{ color: 'var(--color-primary-1)' }}>Spring</span>
          <div className="flex-1 h-10 rounded-xl relative" style={{ backgroundColor: 'var(--color-surface-2)' }}>
            <motion.div className="absolute top-1 bottom-1 left-1 w-10 rounded-xl" style={{ backgroundColor: 'var(--color-primary-1)' }} animate={{ x: go ? 200 : 0 }} transition={spring.default} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs w-24 shrink-0" style={{ color: 'var(--color-on-surface-subtle-2)' }}>Cubic-bezier</span>
          <div className="flex-1 h-10 rounded-xl relative" style={{ backgroundColor: 'var(--color-surface-2)' }}>
            <motion.div className="absolute top-1 bottom-1 left-1 w-10 rounded-xl" style={{ backgroundColor: 'var(--color-surface-5)' }} animate={{ x: go ? 200 : 0 }} transition={{ duration: dur.base, ease: ease.standard }} />
          </div>
        </div>
      </div>
      <DemoButton onClick={() => setGo(v => !v)}>{go ? 'Reset' : 'Go'}</DemoButton>
    </Demo>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   04 · EASING DEMOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function EasingCompareDemo() {
  const [go, setGo] = useState(false);
  const curves = [
    { label: 'ease.enter', ease: ease.enter, color: 'var(--color-primary-1)', desc: 'Decelerates in' },
    { label: 'ease.exit', ease: ease.exit, color: 'var(--color-warning-1)', desc: 'Accelerates out' },
    { label: 'ease.standard', ease: ease.standard, color: 'var(--color-danger-1)', desc: 'Both' },
  ];
  return (
    <Demo title="Easing comparison" description="Watch three dots cross using different easings. Enter decelerates (slows at end), exit accelerates (speeds at end), standard does both.">
      <div className="flex flex-col gap-3 mb-6">
        {curves.map(c => (
          <div key={c.label} className="flex items-center gap-3">
            <span className="font-mono text-xs w-28 shrink-0" style={{ color: c.color }}>{c.label}</span>
            <div className="flex-1 h-10 rounded-xl relative" style={{ backgroundColor: 'var(--color-surface-2)' }}>
              <motion.div className="absolute top-1 bottom-1 left-1 w-8 h-8 rounded-xl" style={{ backgroundColor: c.color }} animate={{ x: go ? 200 : 0 }} transition={{ duration: dur.moderate, ease: c.ease as [number, number, number, number] }} />
            </div>
            <span className="font-mono text-xs w-24 shrink-0" style={{ color: 'var(--color-on-surface-subtle-2)' }}>{c.desc}</span>
          </div>
        ))}
      </div>
      <DemoButton onClick={() => setGo(v => !v)}>{go ? 'Reset' : 'Go'}</DemoButton>
    </Demo>
  );
}

function EasingEnterDemo() {
  const [show, setShow] = useState(true);
  return (
    <Demo title="ease.enter — appearing" description="Toggle visibility. The card decelerates as it arrives — fast at first, then eases into its final position. Natural for things entering.">
      <div className="h-20 mb-6">
        <AnimatePresence>
          {show && (
            <motion.div className="w-full h-20 rounded-lg flex items-center px-5 gap-3" style={{ backgroundColor: 'var(--color-secondary-1)', border: '1px solid var(--color-secondary-2)' }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} transition={{ duration: dur.base, ease: ease.enter }}>
              <Inbox size={20} color="var(--color-on-secondary-1)" />
              <span className="font-sans text-md font-medium" style={{ color: 'var(--color-on-secondary-1)' }}>New message from your team</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <DemoButton onClick={() => setShow(v => !v)}>Toggle card</DemoButton>
    </Demo>
  );
}

function EasingExitDemo() {
  const [items, setItems] = useState(['Design review', 'Update tokens', 'Fix contrast']);
  const removeFirst = () => setItems(prev => prev.slice(1));
  const reset = () => setItems(['Design review', 'Update tokens', 'Fix contrast']);
  return (
    <Demo title="ease.exit — leaving" description="Click dismiss. The item accelerates away — fast exit respects the user's decision. Notice how it speeds up as it leaves.">
      <div className="flex flex-col gap-2 mb-6 min-h-[120px]">
        <AnimatePresence>
          {items.map(item => (
            <motion.div key={item} className="flex items-center justify-between px-4 py-3 rounded-lg" style={{ backgroundColor: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }} layout exit={{ opacity: 0, x: 40 }} transition={{ opacity: { duration: dur.fast, ease: ease.exit }, x: { duration: dur.fast, ease: ease.exit }, layout: spring.snappy }}>
              <span className="font-sans text-sm font-medium" style={{ color: 'var(--color-on-surface)' }}>{item}</span>
              <button onClick={removeFirst} className="cursor-pointer p-1 rounded" style={{ color: 'var(--color-on-surface-subtle-2)' }}><X size={14} /></button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <DemoButton onClick={items.length > 0 ? removeFirst : reset}>{items.length > 0 ? 'Dismiss top item' : 'Reset list'}</DemoButton>
    </Demo>
  );
}

function EasingStandardDemo() {
  const [tab, setTab] = useState(0);
  const tabs = ['Overview', 'Activity', 'Settings'];
  return (
    <Demo title="ease.standard — state change" description="Switch tabs. The indicator slides with ease.standard — it accelerates out of the old position and decelerates into the new one. Smooth, predictable state transition.">
      <div className="relative mb-6">
        <div className="flex gap-0" style={{ borderBottom: '1px solid var(--color-border)' }}>
          {tabs.map((t, i) => (
            <button key={t} onClick={() => setTab(i)} className="px-5 py-3 font-sans text-sm font-semibold cursor-pointer relative" style={{ color: tab === i ? 'var(--color-primary-1)' : 'var(--color-on-surface-subtle-1)' }}>
              {t}
              {tab === i && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: 'var(--color-primary-1)' }} layoutId="easing-tab-indicator" transition={{ duration: dur.base, ease: ease.standard }} />}
            </button>
          ))}
        </div>
        <div className="py-4">
          <span className="font-sans text-sm" style={{ color: 'var(--color-on-surface-subtle-1)' }}>Showing: {tabs[tab]}</span>
        </div>
      </div>
    </Demo>
  );
}

function EasingCombinedDemo() {
  const [show, setShow] = useState(false);
  return (
    <Demo title="Spring + tween combined" description="This is the Kvalt signature: transform uses spring (natural momentum), opacity uses tween ease (smooth fade). Click to see both working together.">
      <div className="h-24 relative mb-6">
        <AnimatePresence>
          {show && (
            <motion.div className="absolute inset-x-0 top-0 flex items-center gap-4 rounded-lg p-5" style={{ backgroundColor: 'var(--color-surface-2)', border: '1px solid var(--color-border)', boxShadow: shadows['medium-1'] }} initial={{ opacity: 0, y: 12, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.98 }} transition={{ ...spring.default, opacity: { duration: dur.base, ease: ease.enter } }}>
              <User size={20} color="var(--color-on-surface)" strokeWidth={2} />
              <div>
                <span className="font-sans text-sm font-semibold block" style={{ color: 'var(--color-on-surface)' }}>Spring for transform</span>
                <span className="font-sans text-xs" style={{ color: 'var(--color-on-surface-subtle-2)' }}>Tween ease.enter for opacity</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <DemoButton onClick={() => setShow(v => !v)}>Toggle element</DemoButton>
    </Demo>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   05 · SEMANTIC TOKEN DEMOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function SemanticFeedbackDemo() {
  const { isPressed: p1, pressHandlers: h1 } = usePress({});
  const { isPressed: p2, pressHandlers: h2 } = usePress({});
  const [checked, setChecked] = useState(false);
  return (
    <Demo title="transition.feedback" description="Button press, checkbox toggle. Instant spring with no bounce — the fastest, most frequent animation. Direct manipulation.">
      <div className="flex items-center gap-4">
        <motion.button className="px-5 py-2.5 rounded-m font-sans text-sm font-semibold cursor-pointer" style={{ backgroundColor: 'var(--color-primary-1)', color: 'var(--color-on-primary)' }} animate={{ scale: p1 ? 0.95 : 1 }} transition={transition.feedback} {...h1}>Primary button</motion.button>
        <motion.button className="px-5 py-2.5 rounded-m font-sans text-sm font-semibold cursor-pointer" style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-on-surface)', border: '1px solid var(--color-border)' }} animate={{ scale: p2 ? 0.95 : 1 }} transition={transition.feedback} {...h2}>Secondary</motion.button>
        <button onClick={() => setChecked(v => !v)} className="w-5 h-5 rounded flex items-center justify-center cursor-pointer" style={{ backgroundColor: checked ? 'var(--color-primary-1)' : 'var(--color-surface-3)', border: checked ? 'none' : '1.5px solid var(--color-border-strong)' }}>
          <AnimatePresence>{checked && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={transition.feedback}><Check size={12} color="white" strokeWidth={3} /></motion.div>}</AnimatePresence>
        </button>
        <span className="font-sans text-sm" style={{ color: 'var(--color-on-surface-subtle-1)' }}>Agree to terms</span>
      </div>
    </Demo>
  );
}

function SemanticRevealDemo() {
  const [show, setShow] = useState(false);
  return (
    <Demo title="transition.reveal" description="Tooltip, popover, dropdown. Fades in with ease.enter while spring slides it subtly. Click to toggle.">
      <div className="relative">
        <DemoButton onClick={() => setShow(v => !v)}>
          <span className="flex items-center gap-2">Show tooltip <ChevronDown size={14} /></span>
        </DemoButton>
        <AnimatePresence>
          {show && (
            <motion.div className="absolute top-full left-0 mt-2 px-4 py-3 rounded-lg z-10" style={{ backgroundColor: 'var(--color-inverted-surface)', color: 'var(--color-on-inverted-surface)', boxShadow: shadows['medium-2'] }} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={transition.reveal}>
              <span className="font-sans text-sm">This uses transition.reveal</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Demo>
  );
}

function SemanticDismissDemo() {
  const [items, setItems] = useState(['mara.okafor@quillledger.com', 'lucas.ferreira@quillledger.com', 'priya.nair@quillledger.com']);
  return (
    <Demo title="transition.dismiss" description="Click X to remove. Dismiss is faster than reveal — snappy spring + fast exit easing. The user decided, so get out of their way.">
      <div className="flex flex-col gap-2 min-h-[52px]">
        <AnimatePresence>
          {items.map(item => (
            <motion.div key={item} className="flex items-center justify-between px-4 py-2.5 rounded-lg" style={{ backgroundColor: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }} layout exit={{ opacity: 0, x: 30, scale: 0.95 }} transition={{ ...transition.dismiss, layout: spring.snappy }}>
              <span className="font-sans text-sm" style={{ color: 'var(--color-on-surface)' }}>{item}</span>
              <button onClick={() => setItems(prev => prev.filter(i => i !== item))} className="cursor-pointer p-0.5 rounded" style={{ color: 'var(--color-on-surface-subtle-2)' }}><X size={14} /></button>
            </motion.div>
          ))}
        </AnimatePresence>
        {items.length === 0 && <DemoButton onClick={() => setItems(['mara.okafor@quillledger.com', 'lucas.ferreira@quillledger.com', 'priya.nair@quillledger.com'])}>Reset list</DemoButton>}
      </div>
    </Demo>
  );
}

function SemanticExpandDemo() {
  const [open, setOpen] = useState(false);
  return (
    <Demo title="transition.expand" description="Accordion, sidebar, drawer. The default spring gives spatial expansion a sense of weight — it feels physical, not digital.">
      <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
        <button onClick={() => setOpen(v => !v)} className="w-full flex items-center justify-between px-5 py-4 cursor-pointer" style={{ backgroundColor: 'var(--color-surface-2)' }}>
          <span className="font-sans text-md font-semibold" style={{ color: 'var(--color-on-surface)' }}>Advanced settings</span>
          <motion.div animate={{ rotate: open ? 90 : 0 }} transition={spring.snappy}><ChevronRight size={16} color="var(--color-on-surface-subtle-1)" /></motion.div>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div className="overflow-hidden" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ ...transition.expand, opacity: { duration: dur.fast, ease: ease.enter } }}>
              <div className="px-5 py-4 flex flex-col gap-3" style={{ borderTop: '1px solid var(--color-border)' }}>
                {['API key', 'Webhook URL', 'Rate limit'].map(s => (
                  <div key={s} className="flex items-center justify-between">
                    <span className="font-sans text-sm" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{s}</span>
                    <div className="w-40 h-8 rounded-m" style={{ backgroundColor: 'var(--color-surface-3)' }} />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Demo>
  );
}

function SemanticCelebrateDemo() {
  const [success, setSuccess] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const trigger = () => {
    setSuccess(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setSuccess(false), 3000);
  };
  return (
    <Demo title="transition.celebrate" description="Success, achievement, completion. The playful spring adds visible bounce — it's the one moment we allow personality to shine fully.">
      <div className="flex items-center gap-6">
        <DemoButton onClick={trigger}>Submit form</DemoButton>
        <AnimatePresence>
          {success && (
            <motion.div className="flex items-center gap-2" initial={{ opacity: 0, scale: 0.5, x: -10 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.8 }} transition={transition.celebrate}>
              <motion.div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-success-1)' }} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...spring.playful, delay: 0.05 }}>
                <Check size={16} color="white" strokeWidth={3} />
              </motion.div>
              <span className="font-sans text-md font-semibold" style={{ color: 'var(--color-success-1)' }}>Submitted</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Demo>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   06 · PATTERN DEMOS (existing + new)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function StaggerDemo() {
  const [visible, setVisible] = useState(true);
  return (
    <Demo title="Staggered enter" description="List items, grid cards, dashboard widgets. Each element enters with a 50ms stagger that guides the eye through content.">
      <div className="grid grid-cols-4 gap-3 mb-6 h-24">
        <AnimatePresence>
          {visible && [0, 1, 2, 3].map(i => (
            <motion.div key={i} className="rounded-lg" style={{ backgroundColor: `var(--color-primary-1)`, opacity: 0.2 + i * 0.2 }} initial={{ opacity: 0, y: 16, scale: 0.92 }} animate={{ opacity: 0.2 + i * 0.2, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }} transition={{ ...spring.default, delay: i * 0.05, opacity: { duration: dur.base, ease: ease.enter, delay: i * 0.05 } }} />
          ))}
        </AnimatePresence>
      </div>
      <DemoButton onClick={() => setVisible(v => !v)}>Toggle stagger</DemoButton>
    </Demo>
  );
}

function MicroFeedbackDemo() {
  const { isPressed: p1, pressHandlers: h1 } = usePress({});
  const { isPressed: p2, pressHandlers: h2 } = usePress({});
  const [on, setOn] = useState(false);
  return (
    <Demo title="Micro-feedback" description="Buttons scale down on press, toggles slide with follow-through. The most frequent animation — must be instant and never block.">
      <div className="flex items-center gap-4">
        <motion.button className="px-5 py-2.5 rounded-m font-sans text-sm font-semibold cursor-pointer" style={{ backgroundColor: 'var(--color-primary-1)', color: 'var(--color-on-primary)' }} animate={{ scale: p1 ? 0.95 : 1 }} transition={spring.snappy} {...h1}>Save changes</motion.button>
        <motion.button className="px-5 py-2.5 rounded-m font-sans text-sm font-semibold cursor-pointer" style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-on-surface)', border: '1px solid var(--color-border)' }} animate={{ scale: p2 ? 0.95 : 1 }} transition={spring.snappy} {...h2}>Cancel</motion.button>
        <button onClick={() => setOn(v => !v)} className="ml-2 w-12 h-7 rounded-xl p-1 flex items-center cursor-pointer" style={{ backgroundColor: on ? 'var(--color-primary-1)' : 'var(--color-surface-3)' }}>
          <motion.div className="w-5 h-5 rounded-xl bg-white" animate={{ x: on ? 20 : 0 }} transition={spring.playful} />
        </button>
      </div>
    </Demo>
  );
}

function PanelExpandDemo() {
  const [open, setOpen] = useState(false);
  return (
    <Demo title="Panel expand" description="Sidebars, filter panels, detail drawers. Uses transition.expand — the default spring gives it weight without feeling sluggish.">
      <div className="flex rounded-lg overflow-hidden mb-6" style={{ height: 140, border: '1px solid var(--color-border)' }}>
        <motion.div className="shrink-0 overflow-hidden flex flex-col gap-3 p-4" style={{ backgroundColor: 'var(--color-surface-2)' }} animate={{ width: open ? 180 : 0, opacity: open ? 1 : 0 }} transition={spring.default}>
          {[1, 0.8, 0.6, 0.9, 0.5].map((w, i) => (<div key={i} className="h-3 rounded-xl" style={{ backgroundColor: 'var(--color-surface-4)', width: `${w * 100}%` }} />))}
        </motion.div>
        <div className="flex-1 p-4 flex flex-col gap-3" style={{ backgroundColor: 'var(--color-surface-1)' }}>
          {[1, 0.85, 0.7].map((w, i) => (<div key={i} className="h-4 rounded-xl" style={{ backgroundColor: 'var(--color-surface-2)', width: `${w * 100}%` }} />))}
        </div>
      </div>
      <DemoButton onClick={() => setOpen(v => !v)}>Toggle sidebar</DemoButton>
    </Demo>
  );
}

function ToastDemo() {
  const [show, setShow] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trigger = useCallback(() => { if (timer.current) clearTimeout(timer.current); setShow(true); timer.current = setTimeout(() => setShow(false), 2800); }, []);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  return (
    <Demo title="Notification toast" description="Uses transition.celebrate — playful spring gives a tiny overshoot that catches the eye.">
      <div className="relative h-16 mb-6">
        <AnimatePresence>
          {show && (
            <motion.div className="absolute top-0 right-0 flex items-center gap-3 rounded-lg px-5 py-3.5" style={{ backgroundColor: 'var(--color-surface-2)', border: '1px solid var(--color-border)', boxShadow: shadows['medium-1'] }} initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }} transition={transition.celebrate}>
              <span className="w-2 h-2 rounded-xl" style={{ backgroundColor: 'var(--color-success-1)' }} />
              <span className="font-sans text-md font-medium" style={{ color: 'var(--color-on-surface)' }}>Saved successfully</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <DemoButton onClick={trigger}>Show notification</DemoButton>
    </Demo>
  );
}

function LayoutAnimationDemo() {
  const [expanded, setExpanded] = useState<number | null>(null);
  return (
    <Demo title="Layout animation" description="Click a card to expand. Motion's layout prop uses transforms under the hood — smooth, GPU-accelerated, no height/width animation.">
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map(i => (
          <motion.div key={i} className="rounded-lg cursor-pointer p-4 overflow-hidden" style={{ backgroundColor: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }} layout transition={spring.default} onClick={() => setExpanded(expanded === i ? null : i)}>
            <motion.div className="flex items-center gap-2 mb-2" layout="position" transition={spring.default}>
              <div className="w-6 h-6 rounded-xl" style={{ backgroundColor: ['var(--color-primary-1)', 'var(--color-warning-1)', 'var(--color-danger-1)'][i] }} />
              <span className="font-sans text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>Card {i + 1}</span>
            </motion.div>
            <AnimatePresence>
              {expanded === i && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: dur.fast }}>
                  <p className="font-sans text-sm" style={{ color: 'var(--color-on-surface-subtle-1)' }}>Expanded content with smooth layout animation. No height/width — pure transforms.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </Demo>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   08 · CHOREOGRAPHY DEMOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function ChoreoExitBeforeEnterDemo() {
  const [tab, setTab] = useState(0);
  const content = [
    { label: 'Overview', color: 'var(--color-primary-1)' },
    { label: 'Analytics', color: 'var(--color-warning-1)' },
    { label: 'Settings', color: 'var(--color-danger-1)' },
  ];
  return (
    <Demo title="Exit before enter" description="Switch tabs. Outgoing content exits fully before incoming content enters — prevents visual clutter.">
      <div className="flex gap-2 mb-4">
        {content.map((c, i) => (
          <button key={c.label} onClick={() => setTab(i)} className="px-4 py-2 rounded-m font-sans text-sm font-semibold cursor-pointer" style={{ backgroundColor: tab === i ? c.color : 'var(--color-surface-3)', color: tab === i ? 'white' : 'var(--color-on-surface-subtle-1)' }}>{c.label}</button>
        ))}
      </div>
      <div className="h-24 relative overflow-hidden rounded-lg" style={{ backgroundColor: 'var(--color-surface-2)' }}>
        <AnimatePresence mode="wait">
          <motion.div key={tab} className="absolute inset-0 p-5 flex items-center gap-3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: dur.fast, ease: ease.standard }}>
            <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: content[tab].color, opacity: 0.3 }} />
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-3 rounded-xl w-3/4" style={{ backgroundColor: content[tab].color, opacity: 0.2 }} />
              <div className="h-3 rounded-xl w-1/2" style={{ backgroundColor: content[tab].color, opacity: 0.15 }} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </Demo>
  );
}

function ChoreoParentChildDemo() {
  const [show, setShow] = useState(false);
  return (
    <Demo title="Parent before children" description="Open the modal. Container slides in first, then inner elements stagger in with 50ms delays. Never the reverse.">
      <div className="relative h-52 rounded-lg overflow-hidden mb-6" style={{ backgroundColor: 'var(--color-surface-2)' }}>
        <AnimatePresence>
          {show && (
            <motion.div className="absolute inset-4 rounded-lg p-6 flex flex-col gap-4" style={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border)', boxShadow: shadows['large-1'] }} initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ ...spring.default, opacity: { duration: dur.base, ease: ease.enter } }}>
              {['Title bar', 'Content area', 'Action buttons'].map((item, i) => (
                <motion.div key={item} className="h-8 rounded-m flex items-center px-3" style={{ backgroundColor: 'var(--color-surface-2)' }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring.default, delay: 0.1 + i * 0.05, opacity: { duration: dur.fast, ease: ease.enter, delay: 0.1 + i * 0.05 } }}>
                  <span className="font-mono text-xs" style={{ color: 'var(--color-on-surface-subtle-2)' }}>{item} (delay: {100 + i * 50}ms)</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <DemoButton onClick={() => setShow(v => !v)}>{show ? 'Close modal' : 'Open modal'}</DemoButton>
    </Demo>
  );
}

function ChoreoStaggerTimingDemo() {
  const [go, setGo] = useState(false);
  return (
    <Demo title="50ms vs 200ms stagger" description="Compare stagger timing. Top row uses 50ms (crisp wave). Bottom uses 200ms (feels like lag). Past 50ms, stagger stops feeling intentional.">
      <div className="flex flex-col gap-6 mb-6">
        <div>
          <span className="font-mono text-xs mb-2 block" style={{ color: 'var(--color-primary-1)' }}>50ms stagger — crisp</span>
          <div className="grid grid-cols-6 gap-2 h-12">
            {[0, 1, 2, 3, 4, 5].map(i => (
              <motion.div key={i} className="rounded-lg" style={{ backgroundColor: 'var(--color-primary-1)' }} animate={{ opacity: go ? 1 : 0.15, scale: go ? 1 : 0.8 }} transition={{ ...spring.default, delay: go ? i * 0.05 : 0 }} />
            ))}
          </div>
        </div>
        <div>
          <span className="font-mono text-xs mb-2 block" style={{ color: 'var(--color-on-surface-subtle-2)' }}>200ms stagger — laggy</span>
          <div className="grid grid-cols-6 gap-2 h-12">
            {[0, 1, 2, 3, 4, 5].map(i => (
              <motion.div key={i} className="rounded-lg" style={{ backgroundColor: 'var(--color-surface-5)' }} animate={{ opacity: go ? 1 : 0.15, scale: go ? 1 : 0.8 }} transition={{ ...spring.default, delay: go ? i * 0.2 : 0 }} />
            ))}
          </div>
        </div>
      </div>
      <DemoButton onClick={() => setGo(v => !v)}>{go ? 'Reset' : 'Trigger stagger'}</DemoButton>
    </Demo>
  );
}

function ChoreoDismissFasterDemo() {
  const [show, setShow] = useState(false);
  return (
    <Demo title="Dismiss faster than reveal" description="Open then close. Opening takes ~300ms (default spring). Closing takes ~150ms (snappy spring). The user decided — respect the decision.">
      <div className="h-20 relative mb-6">
        <AnimatePresence>
          {show && (
            <motion.div className="absolute inset-x-0 top-0 h-20 rounded-lg flex items-center justify-between px-5" style={{ backgroundColor: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }} initial={{ opacity: 0, y: 12, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.98 }} transition={show ? { ...spring.default, opacity: { duration: dur.base, ease: ease.enter } } : { ...spring.snappy, opacity: { duration: dur.fast, ease: ease.exit } }}>
              <span className="font-sans text-sm font-medium" style={{ color: 'var(--color-on-surface)' }}>Panel content</span>
              <span className="font-mono text-xs" style={{ color: 'var(--color-on-surface-subtle-2)' }}>enter: 300ms · exit: 150ms</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <DemoButton onClick={() => setShow(v => !v)}>{show ? 'Close (fast)' : 'Open (slow)'}</DemoButton>
    </Demo>
  );
}

function ChoreoReadingDirectionDemo() {
  const [show, setShow] = useState(false);
  return (
    <Demo title="Reading direction stagger" description="Cards enter from top-left to bottom-right — following the natural reading direction. This feels intentional, not random.">
      <div className="grid grid-cols-3 gap-3 mb-6" style={{ minHeight: 120 }}>
        <AnimatePresence>
          {show && [0, 1, 2, 3, 4, 5].map(i => (
            <motion.div key={i} className="h-14 rounded-lg" style={{ backgroundColor: 'var(--color-primary-1)', opacity: 0.15 + (i * 0.14) }} initial={{ opacity: 0, y: 12, scale: 0.9 }} animate={{ opacity: 0.15 + (i * 0.14), y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ ...spring.default, delay: i * 0.05, opacity: { duration: dur.base, ease: ease.enter, delay: i * 0.05 } }} />
          ))}
        </AnimatePresence>
      </div>
      <DemoButton onClick={() => setShow(v => !v)}>{show ? 'Hide grid' : 'Show grid'}</DemoButton>
    </Demo>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   09 · PERFORMANCE DEMOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function PerfTransformDemo() {
  const [go, setGo] = useState(false);
  return (
    <Demo title="Composited: transform + opacity" description="These two properties are GPU-composited — no layout recalculation. The green bar animates smoothly even in a complex DOM.">
      <div className="h-16 rounded-lg relative overflow-hidden mb-6" style={{ backgroundColor: 'var(--color-surface-2)' }}>
        <motion.div className="absolute inset-y-2 left-2 right-2 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-success-1)' }} animate={{ x: go ? 0 : -200, opacity: go ? 1 : 0 }} transition={spring.default}>
          <span className="font-mono text-xs text-white font-semibold">transform: translateX() + opacity</span>
        </motion.div>
      </div>
      <DemoButton onClick={() => setGo(v => !v)}>Toggle</DemoButton>
    </Demo>
  );
}

function PerfLayoutVsWidthDemo() {
  const [wide, setWide] = useState(false);
  return (
    <Demo title="Layout animation vs width" description="The top bar uses Motion's layout prop (transforms). Bottom animates width directly (causes layout recalc). Notice the top is smoother.">
      <div className="flex flex-col gap-4 mb-6">
        <div>
          <span className="font-mono text-xs mb-1 block" style={{ color: 'var(--color-primary-1)' }}>layout prop (GPU transforms)</span>
          <div className="h-10 rounded-lg relative" style={{ backgroundColor: 'var(--color-surface-2)' }}>
            <motion.div className="h-10 rounded-lg" style={{ backgroundColor: 'var(--color-primary-1)', width: wide ? '100%' : '30%' }} layout transition={spring.default} />
          </div>
        </div>
        <div>
          <span className="font-mono text-xs mb-1 block" style={{ color: 'var(--color-on-surface-subtle-2)' }}>animate width (layout recalc)</span>
          <div className="h-10 rounded-lg relative" style={{ backgroundColor: 'var(--color-surface-2)' }}>
            <motion.div className="h-10 rounded-lg" style={{ backgroundColor: 'var(--color-surface-5)' }} animate={{ width: wide ? '100%' : '30%' }} transition={spring.default} />
          </div>
        </div>
      </div>
      <DemoButton onClick={() => setWide(v => !v)}>Toggle width</DemoButton>
    </Demo>
  );
}

function PerfWillChangeDemo() {
  const [active, setActive] = useState(false);
  return (
    <Demo title="will-change hint" description="Left card has will-change: transform (GPU-promoted). Right doesn't. In complex pages, the left card animates more smoothly.">
      <div className="grid grid-cols-2 gap-4">
        <motion.div className="h-20 rounded-lg flex items-center justify-center cursor-pointer" style={{ backgroundColor: 'var(--color-surface-2)', border: '1px solid var(--color-border)', willChange: 'transform' }} animate={{ y: active ? -8 : 0, scale: active ? 1.02 : 1 }} transition={spring.default} onClick={() => setActive(v => !v)}>
          <span className="font-mono text-xs" style={{ color: 'var(--color-primary-1)' }}>will-change: transform</span>
        </motion.div>
        <motion.div className="h-20 rounded-lg flex items-center justify-center cursor-pointer" style={{ backgroundColor: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }} animate={{ y: active ? -8 : 0, scale: active ? 1.02 : 1 }} transition={spring.default} onClick={() => setActive(v => !v)}>
          <span className="font-mono text-xs" style={{ color: 'var(--color-on-surface-subtle-2)' }}>no will-change</span>
        </motion.div>
      </div>
    </Demo>
  );
}

function PerfGridExpandDemo() {
  const [open, setOpen] = useState(false);
  return (
    <Demo title="CSS grid expand (no JS height)" description="For pure CSS expand/collapse, use grid-template-rows 0fr→1fr. Zero layout thrashing, works without JS animation.">
      <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
        <button onClick={() => setOpen(v => !v)} className="w-full flex items-center justify-between px-5 py-3 cursor-pointer" style={{ backgroundColor: 'var(--color-surface-2)' }}>
          <span className="font-sans text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>Details</span>
          <motion.div animate={{ rotate: open ? 90 : 0 }} transition={spring.snappy}><ChevronRight size={14} color="var(--color-on-surface-subtle-1)" /></motion.div>
        </button>
        <div className="grid transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
          <div className="overflow-hidden">
            <div className="px-5 py-3" style={{ borderTop: '1px solid var(--color-border)' }}>
              <span className="font-sans text-sm" style={{ color: 'var(--color-on-surface-subtle-1)' }}>Pure CSS — grid-template-rows: 0fr → 1fr. No JS, no layout thrashing.</span>
            </div>
          </div>
        </div>
      </div>
    </Demo>
  );
}

function PerfSpringCSSDemo() {
  return (
    <Demo title="CSS spring for hover" description="Hover over the buttons. These use CSS transition with cubic-bezier — zero JS runtime cost. Perfect for simple hover states.">
      <div className="flex gap-3">
        {['Primary', 'Secondary', 'Ghost'].map((label, i) => (
          <button key={label} className="px-5 py-2.5 rounded-m font-sans text-sm font-semibold cursor-pointer" style={{
            backgroundColor: i === 0 ? 'var(--color-primary-1)' : i === 1 ? 'var(--color-surface-2)' : 'transparent',
            color: i === 0 ? 'var(--color-on-primary)' : 'var(--color-on-surface)',
            border: i === 1 ? '1px solid var(--color-border)' : i === 2 ? '1px solid transparent' : 'none',
            transition: 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          }} onMouseDown={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.95)'; }} onMouseUp={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}>
            {label}
          </button>
        ))}
      </div>
    </Demo>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   10 · ACCESSIBILITY DEMOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function A11yReducedMotionDemo() {
  const [reduced, setReduced] = useState(false);
  const [go, setGo] = useState(false);
  return (
    <Demo title="prefers-reduced-motion" description="Toggle 'reduced motion' then trigger the animation. With reduced motion, spatial movement stops — only opacity fades remain.">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => setReduced(v => !v)} className="px-3 py-1.5 rounded-m font-sans text-xs font-semibold cursor-pointer" style={{ backgroundColor: reduced ? 'var(--color-warning-1)' : 'var(--color-surface-3)', color: reduced ? 'white' : 'var(--color-on-surface)' }}>
          {reduced ? 'Reduced motion: ON' : 'Reduced motion: OFF'}
        </button>
      </div>
      <div className="h-16 rounded-lg relative overflow-hidden mb-6" style={{ backgroundColor: 'var(--color-surface-2)' }}>
        <motion.div className="absolute inset-y-2 left-2 right-2 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary-1)' }} animate={{ x: go ? 0 : reduced ? 0 : -200, opacity: go ? 1 : 0 }} transition={reduced ? { duration: dur.instant } : spring.default}>
          <span className="font-mono text-xs text-white font-semibold">{reduced ? 'Opacity only — no spatial motion' : 'Full spring animation'}</span>
        </motion.div>
      </div>
      <DemoButton onClick={() => setGo(v => !v)}>Toggle element</DemoButton>
    </Demo>
  );
}

function A11yMeaningNotMotionDemo() {
  const [success, setSuccess] = useState(false);
  return (
    <Demo title="Meaning without motion" description="The success state communicates via color + text + icon — animation is enhancement only. Remove animation and the message is still clear.">
      <div className="flex items-center gap-4">
        <DemoButton onClick={() => setSuccess(v => !v)}>Toggle status</DemoButton>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: success ? 'var(--color-success-secondary-1)' : 'var(--color-surface-2)', border: `1px solid ${success ? 'var(--color-success-1)' : 'var(--color-border)'}` }}>
          <motion.div animate={{ scale: success ? [0.8, 1.1, 1] : 1 }} transition={spring.playful}>
            {success ? <Check size={16} color="var(--color-success-1)" strokeWidth={2.5} /> : <X size={16} color="var(--color-on-surface-subtle-2)" strokeWidth={2} />}
          </motion.div>
          <span className="font-sans text-sm font-semibold" style={{ color: success ? 'var(--color-on-success-secondary)' : 'var(--color-on-surface-subtle-1)' }}>{success ? 'Verified' : 'Not verified'}</span>
        </div>
      </div>
    </Demo>
  );
}

function A11yNoInfiniteLoopDemo() {
  const [pulsing, setPulsing] = useState(false);
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!pulsing) return;
    if (count >= 3) { setPulsing(false); setCount(0); return; } // eslint-disable-line react-hooks/set-state-in-effect -- bounded loop reset
    const t = setTimeout(() => setCount(c => c + 1), 600);
    return () => clearTimeout(t);
  }, [pulsing, count]);
  return (
    <Demo title="No infinite loops" description="Click to pulse. It stops after 3 cycles — never loops endlessly. Continuous motion is distracting and inaccessible.">
      <div className="flex items-center gap-6">
        <motion.div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary-1)' }} animate={{ scale: pulsing ? [1, 1.15, 1] : 1, opacity: pulsing ? [1, 0.7, 1] : 1 }} transition={{ duration: dur.slow, repeat: pulsing && count < 3 ? 1 : 0 }}>
          <Bell size={20} color="white" />
        </motion.div>
        <div>
          <DemoButton onClick={() => { setPulsing(true); setCount(0); }}>Pulse (3× max)</DemoButton>
          <span className="font-mono text-xs block mt-1" style={{ color: 'var(--color-on-surface-subtle-2)' }}>{pulsing ? `Cycle ${count + 1}/3` : 'Stopped'}</span>
        </div>
      </div>
    </Demo>
  );
}

function A11yFocusVisibleDemo() {
  return (
    <Demo title="Focus ring animation" description="Tab through these buttons. Focus ring appears with ease.standard — visible but not jarring. Works for keyboard, hidden for mouse.">
      <div className="flex gap-3">
        {['Save', 'Edit', 'Delete'].map(label => (
          <button key={label} className="px-5 py-2.5 rounded-m font-sans text-sm font-semibold cursor-pointer outline-none" style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-on-surface)', border: '1px solid var(--color-border)', transition: 'box-shadow 160ms cubic-bezier(0.4, 0, 0.2, 1)' }} onFocus={e => { e.currentTarget.style.boxShadow = '0 0 0 2px var(--color-primary-1)'; }} onBlur={e => { e.currentTarget.style.boxShadow = 'none'; }}>
            {label}
          </button>
        ))}
      </div>
    </Demo>
  );
}

function A11yOpacityOnlyDemo() {
  const [show, setShow] = useState(true);
  return (
    <Demo title="Opacity-only transition" description="When reduced motion is active, use opacity fades only. No position, scale, or rotation. This example shows the minimal acceptable animation.">
      <div className="h-16 mb-6">
        <AnimatePresence>
          {show && (
            <motion.div className="w-full h-16 rounded-lg flex items-center px-5" style={{ backgroundColor: 'var(--color-secondary-1)', border: '1px solid var(--color-secondary-2)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: dur.fast }}>
              <span className="font-sans text-sm font-medium" style={{ color: 'var(--color-on-secondary-1)' }}>Opacity-only — safe for prefers-reduced-motion</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <DemoButton onClick={() => setShow(v => !v)}>Toggle</DemoButton>
    </Demo>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function MotionGuidelines() {
  return (
    <div className="space-y-20">

      {/* ─ Hero ────────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-start gap-8">
          <div className="w-28 h-28 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-primary-1)' }}>
            <Activity size={64} color="white" strokeWidth={1.5} />
          </div>
          <div>
            <div className="font-mono text-sm font-medium inline-flex items-center gap-2 px-3 py-1 rounded-xl mb-4" style={{ backgroundColor: 'var(--color-primary-1-alpha-10)', color: 'var(--color-primary-1)' }}>
              <span className="w-2 h-2 rounded-xl animate-pulse" style={{ backgroundColor: 'var(--color-primary-1)' }} />
              Foundations
            </div>
            <h1 className="font-display text-headline-2xl font-bold mb-4" style={{ color: 'var(--color-on-surface)' }}>
              Things should move{' '}<span style={{ color: 'var(--color-primary-1)' }}>just right</span>
            </h1>
            <p className="font-sans text-lg font-medium max-w-[600px] leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
              Motion in the design system is communication, not decoration. Every transition clarifies
              a relationship, confirms an action, or guides focus. Quick, confident, and just bouncy
              enough to make you smile.
            </p>
          </div>
        </div>
      </section>

      {/* ─ 01  Personality ─────────────────────────────────────────── */}
      <section>
        <SectionHeader n="01" title="Personality" />
        <Lead>
          Think of the motion personality as that colleague who is incredibly efficient but always
          has a witty remark ready. Not the class clown — the one with dry, sharp timing.
        </Lead>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { title: 'Quick, not rushed', color: 'var(--color-primary-1)', body: 'Animations complete before the user notices waiting. No animation should make someone feel the UI is slower.' },
            { title: 'Alive, not hyperactive', color: 'var(--color-warning)', body: 'Springs give elements a physical quality with weight and momentum. Bounce is kept gentle. It\'s a tool people use for hours.' },
            { title: 'Quirky, not chaotic', color: 'var(--color-error)', body: 'A toast with tiny overshoot. A toggle with extra follow-through. These micro-moments build personality over time.' },
          ].map(({ title, color, body }) => (
            <div key={title} className="rounded-lg p-6" style={{ backgroundColor: 'var(--color-surface-1)', borderTop: `3px solid ${color}` }}>
              <h3 className="font-sans text-md font-bold mb-2" style={{ color: 'var(--color-on-surface)' }}>{title}</h3>
              <p className="font-sans text-md font-medium leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{body}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <PersonalityDemo1 />
          <PersonalityDemo2 />
          <PersonalityDemo3 />
          <PersonalityDemo4 />
          <PersonalityDemo5 />
        </div>

        <Callout title="The golden rule">
          If you removed every animation from the app, nothing should break and nothing should be
          confusing. Motion enhances understanding, it never carries it alone.
        </Callout>
      </section>

      {/* ─ 02  Duration ────────────────────────────────────────────── */}
      <section>
        <SectionHeader n="02" title="Duration" />
        <Lead>
          Five steps, that's it. Resist the urge to add more. Constraints are what make consistency
          possible. Shorter durations for small, frequent interactions. Longer for larger spatial changes.
        </Lead>

        <div className="rounded-lg overflow-hidden mb-8" style={{ border: '1px solid var(--color-border)' }}>
          <div className="grid grid-cols-[180px_80px_1fr_1fr] gap-4 px-6 py-3" style={{ backgroundColor: 'var(--color-surface-2)' }}>
            <span className="font-sans text-sm font-bold" style={{ color: 'var(--color-on-surface-subtle-2)' }}>Token</span>
            <span className="font-sans text-sm font-bold" style={{ color: 'var(--color-on-surface-subtle-2)' }}>Value</span>
            <span className="font-sans text-sm font-bold" style={{ color: 'var(--color-on-surface-subtle-2)' }}>Use when…</span>
            <span />
          </div>
          {durations.map((d, i) => (
            <div key={d.token} className="grid grid-cols-[180px_80px_1fr_1fr] gap-4 items-center px-6 py-4" style={{ backgroundColor: i % 2 === 0 ? 'var(--color-surface-1)' : 'transparent', borderTop: '1px solid var(--color-border)' }}>
              <span className="font-mono text-sm font-medium" style={{ color: 'var(--color-primary-1)' }}>{d.token}</span>
              <span className="font-mono text-sm font-medium" style={{ color: 'var(--color-on-surface)' }}>{d.value}</span>
              <span className="font-sans text-md font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{d.use}</span>
              <div className="flex items-center"><div className="h-2 rounded-xl" style={{ width: `${(d.ms / 480) * 100}%`, backgroundColor: 'var(--color-primary-1)', opacity: 0.6 }} /></div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <DurationRaceDemo />
          <DurationInstantDemo />
          <DurationFastDemo />
          <DurationBaseDemo />
          <DurationModerateDemo />
        </div>

        <DoDont
          doText="Use instant or fast for anything the user triggers repeatedly — buttons, toggles, list hovers. These should feel like direct manipulation."
          dontText="Use slow on frequent UI. A sidebar that takes 480 ms to open is charming the first time and infuriating the fiftieth."
        />
      </section>

      {/* ─ 03  Springs ─────────────────────────────────────────────── */}
      <section>
        <SectionHeader n="03" title="Springs" />
        <Lead>
          Springs are the default for anything that moves spatially — position, scale, rotation.
          They feel more natural than cubic-bezier because they simulate physical momentum.
          Three spring personalities cover everything.
        </Lead>

        <div className="flex flex-col gap-4 mb-8">
          <SpringCompareDemo />
          <SpringInterruptDemo />
          <SpringScaleDemo />
          <SpringRotateDemo />
          <SpringVsBezierDemo />
        </div>

        <CodeBlock>{`/* Spring tokens */

snappy:  { type: "spring", visualDuration: 0.15, bounce: 0 }
/* No overshoot. Crisp. For dropdowns, tooltips, focus states. */

default: { type: "spring", visualDuration: 0.3,  bounce: 0.1 }
/* Hint of life. For panels, modals, sidebars, cards. */

playful: { type: "spring", visualDuration: 0.4,  bounce: 0.25 }
/* Visible overshoot. For success states, toasts, celebrations. */`}</CodeBlock>

        <Callout title="Why springs over cubic-bezier?">
          Springs incorporate velocity. If a user interrupts an animation mid-flight, the spring
          naturally carries momentum into the new target. Cubic-bezier curves restart from zero,
          creating a jerky "rubber band" feel. Motion handles this automatically with its animate API.
        </Callout>
      </section>

      {/* ─ 04  Easing ──────────────────────────────────────────────── */}
      <section>
        <SectionHeader n="04" title="Easing" />
        <Lead>
          For properties that don't move through space — opacity, color, blur, border — use tween
          easing instead of springs. Three curves cover everything.
        </Lead>

        <div className="rounded-lg overflow-hidden mb-8" style={{ border: '1px solid var(--color-border)' }}>
          <div className="grid grid-cols-[140px_1fr_1fr] gap-4 px-6 py-3" style={{ backgroundColor: 'var(--color-surface-2)' }}>
            <span className="font-sans text-sm font-bold" style={{ color: 'var(--color-on-surface-subtle-2)' }}>Token</span>
            <span className="font-sans text-sm font-bold" style={{ color: 'var(--color-on-surface-subtle-2)' }}>CSS value</span>
            <span className="font-sans text-sm font-bold" style={{ color: 'var(--color-on-surface-subtle-2)' }}>Use when…</span>
          </div>
          {easings.map((e, i) => (
            <div key={e.token} className="grid grid-cols-[140px_1fr_1fr] gap-4 items-center px-6 py-4" style={{ backgroundColor: i % 2 === 0 ? 'var(--color-surface-1)' : 'transparent', borderTop: '1px solid var(--color-border)' }}>
              <span className="font-mono text-sm font-medium" style={{ color: 'var(--color-primary-1)' }}>{e.token}</span>
              <span className="font-mono text-sm font-medium" style={{ color: 'var(--color-on-surface)' }}>{e.css}</span>
              <span className="font-sans text-md font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{e.use}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <EasingCompareDemo />
          <EasingEnterDemo />
          <EasingExitDemo />
          <EasingStandardDemo />
          <EasingCombinedDemo />
        </div>
      </section>

      {/* ─ 05  Semantic tokens ─────────────────────────────────────── */}
      <section>
        <SectionHeader n="05" title="Semantic tokens" />
        <Lead>
          Developers shouldn't have to pick "fast + easeOut + snappy spring" every time.
          Semantic tokens encode intent — pick the intent, get the right motion.
        </Lead>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {semanticTokens.map(t => (
            <div key={t.name} className="rounded-lg p-5" style={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}>
              <span className="font-mono text-sm font-bold block mb-1" style={{ color: 'var(--color-primary-1)' }}>{t.name}</span>
              <span className="font-mono text-sm block mb-3" style={{ color: 'var(--color-on-surface-subtle-2)' }}>{t.recipe}</span>
              <p className="font-sans text-md font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{t.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <SemanticFeedbackDemo />
          <SemanticRevealDemo />
          <SemanticDismissDemo />
          <SemanticExpandDemo />
          <SemanticCelebrateDemo />
        </div>
      </section>

      {/* ─ 06  Patterns in action ──────────────────────────────────── */}
      <section>
        <SectionHeader n="06" title="Patterns in action" />
        <Lead>
          Tokens are ingredients. Patterns are recipes — reusable animation behaviors composed from
          your tokens.
        </Lead>

        <div className="flex flex-col gap-4">
          <StaggerDemo />
          <MicroFeedbackDemo />
          <PanelExpandDemo />
          <ToastDemo />
          <LayoutAnimationDemo />
        </div>
      </section>

      {/* ─ 07  Using with Motion ───────────────────────────────────── */}
      <section>
        <SectionHeader n="07" title="Using with Motion" />
        <Lead>
          The motion tokens are designed to work seamlessly with the Motion library. Here's how the
          token system maps to Motion's API.
        </Lead>

        <h3 className="font-sans text-md font-bold mb-3" style={{ color: 'var(--color-on-surface)' }}>MotionConfig (app root default)</h3>
        <CodeBlock>{`<MotionConfig
  transition={{
    type: "spring",
    visualDuration: 0.3,
    bounce: 0.1,
    opacity: { ease: "easeOut", duration: 0.24 }
  }}
>
  <App />
</MotionConfig>`}</CodeBlock>

        <h3 className="font-sans text-md font-bold mt-8 mb-3" style={{ color: 'var(--color-on-surface)' }}>Semantic tokens as reusable transition objects</h3>
        <CodeBlock>{`export const motionTokens = {
  feedback:  { type: "spring", visualDuration: 0.15, bounce: 0 },
  reveal:    { type: "spring", visualDuration: 0.3, bounce: 0.1,
               opacity: { ease: "easeOut", duration: 0.24 } },
  dismiss:   { type: "spring", visualDuration: 0.15, bounce: 0,
               opacity: { ease: "easeIn", duration: 0.16 } },
  expand:    { type: "spring", visualDuration: 0.3,  bounce: 0.1 },
  celebrate: { type: "spring", visualDuration: 0.4, bounce: 0.25,
               opacity: { ease: "easeOut", duration: 0.24 } },
}`}</CodeBlock>

        <h3 className="font-sans text-md font-bold mt-8 mb-3" style={{ color: 'var(--color-on-surface)' }}>Usage in a component</h3>
        <CodeBlock>{`<motion.div
  initial={{ opacity: 0, y: 8, scale: 0.96 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  exit={{ opacity: 0, y: -4, scale: 0.98 }}
  transition={motionTokens.celebrate}
/>`}</CodeBlock>
      </section>

      {/* ─ 08  Choreography rules ──────────────────────────────────── */}
      <section>
        <SectionHeader n="08" title="Choreography rules" />
        <Lead>
          When multiple elements animate together, order matters. These rules keep complex
          transitions feeling intentional.
        </Lead>

        <div className="space-y-6 mb-8">
          {choreographyRules.map((r, i) => (
            <div key={i} className="flex gap-5 items-start">
              <span className="font-mono text-sm font-bold shrink-0 w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary-1-alpha-10)', color: 'var(--color-primary-1)' }}>{i + 1}</span>
              <div>
                <h4 className="font-sans text-md font-bold mb-1" style={{ color: 'var(--color-on-surface)' }}>{r.title}</h4>
                <p className="font-sans text-md font-medium leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{r.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <ChoreoExitBeforeEnterDemo />
          <ChoreoParentChildDemo />
          <ChoreoStaggerTimingDemo />
          <ChoreoDismissFasterDemo />
          <ChoreoReadingDirectionDemo />
        </div>

        <DoDont
          doText="Stagger dashboard cards from top-left to bottom-right, following natural reading direction. Use 50 ms between each card."
          dontText="Stagger items in random order or from center outward — it creates visual noise in tool UIs where users need to scan predictably."
        />
      </section>

      {/* ─ 09  Performance ─────────────────────────────────────────── */}
      <section>
        <SectionHeader n="09" title="Performance" />
        <Lead>
          Users spend hours in the app. Janky animations erode trust faster than no animations at all.
        </Lead>

        <div className="space-y-6 mb-8">
          {[
            { title: 'Only animate composited properties.', desc: 'Stick to transform (position, scale, rotation) and opacity. These run on the GPU without layout recalculation.' },
            { title: 'Never animate height/width directly.', desc: 'Use Motion\'s layout animations (transforms under the hood). For pure CSS, use grid-template-rows: 0fr → 1fr.' },
            { title: 'Use motion/mini for heavy lists.', desc: 'Tables with 50+ rows, Kanban boards — import from motion/mini for smaller bundle.' },
            { title: 'CSS springs for simple hover states.', desc: 'Motion\'s spring() function generates CSS linear() easing at build time with zero JS cost.' },
          ].map((r, i) => (
            <div key={i} className="flex gap-5 items-start">
              <span className="font-mono text-sm font-bold shrink-0 w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary-1-alpha-10)', color: 'var(--color-primary-1)' }}>{i + 1}</span>
              <div>
                <h4 className="font-sans text-md font-bold mb-1" style={{ color: 'var(--color-on-surface)' }}>{r.title}</h4>
                <p className="font-sans text-md font-medium leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{r.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <PerfTransformDemo />
          <PerfLayoutVsWidthDemo />
          <PerfWillChangeDemo />
          <PerfGridExpandDemo />
          <PerfSpringCSSDemo />
        </div>
      </section>

      {/* ─ 10  Accessibility ───────────────────────────────────────── */}
      <section>
        <SectionHeader n="10" title="Accessibility" />
        <Lead>
          Motion accessibility isn't a nice-to-have. It's as fundamental as color contrast or
          keyboard navigation.
        </Lead>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { title: 'prefers-reduced-motion', body: 'When OS reduces motion, all durations drop to 0 ms. Use Motion\'s useReducedMotion() hook. Opacity-only fades are acceptable.' },
            { title: 'Never animate what carries meaning', body: 'Don\'t put critical info inside animation. Color + text + icon carry the message. Bounce is enhancement only.' },
            { title: 'No infinite loops in the viewport', body: 'Looping animations (spinners excepted) distract. Pulsing should stop after 3-5 iterations.' },
          ].map(a => (
            <div key={a.title} className="rounded-lg p-6" style={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}>
              <h3 className="font-sans text-md font-bold mb-3" style={{ color: 'var(--color-on-surface)' }}>{a.title}</h3>
              <p className="font-sans text-md font-medium leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{a.body}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 mb-8">
          <A11yReducedMotionDemo />
          <A11yMeaningNotMotionDemo />
          <A11yNoInfiniteLoopDemo />
          <A11yFocusVisibleDemo />
          <A11yOpacityOnlyDemo />
        </div>

        <CodeBlock>{`@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-duration-instant:  0ms;
    --motion-duration-fast:     0ms;
    --motion-duration-base:     0ms;
    --motion-duration-moderate: 0ms;
    --motion-duration-slow:     0ms;
  }
}`}</CodeBlock>
      </section>

    </div>
  );
}
