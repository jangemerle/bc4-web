import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check, RefreshCw, Lightbulb, Group, Layers, LayoutGrid,
  Repeat, Zap, Eye, Contrast, Grid3X3, Gauge, ScanEye,
} from 'lucide-react';
import { spring, duration as dur, ease } from '../tokens/motion';

/* ─── Section meta ────────────────────────────────────────────────────────── */

const sectionMeta: Record<string, { icon: React.ElementType; bg: string }> = {
  '01': { icon: Group,      bg: '#6366f1' },
  '02': { icon: Layers,     bg: '#f59e0b' },
  '03': { icon: LayoutGrid, bg: '#06b6d4' },
  '04': { icon: Repeat,     bg: '#8b5cf6' },
  '05': { icon: Zap,        bg: '#10b981' },
  '06': { icon: ScanEye,    bg: '#e11d48' },
};

/* ─── Data ────────────────────────────────────────────────────────────────── */

const gestalt = [
  { title: 'Proximity', icon: Group, body: 'Elements close together are perceived as a group.', rule: 'Group related content within consistent spacing tokens. Separate unrelated groups with larger gaps. If two things are conceptually separate, make them spatially separate.' },
  { title: 'Similarity', icon: Eye, body: 'Elements that look alike are perceived as related.', rule: 'Use consistent styling — color, size, shape — for items with the same function. A blue badge always means the same thing. A 14px label always signals the same level of importance.' },
  { title: 'Continuity', icon: Gauge, body: 'The eye follows lines and curves naturally.', rule: 'Maintain alignment to guide the eye through a layout. When elements share an edge or a baseline, the brain treats them as a sequence — a story being told left-to-right, top-to-bottom.' },
  { title: 'Closure', icon: Grid3X3, body: 'The brain completes incomplete shapes.', rule: 'You don\'t need borders everywhere. Whitespace and alignment can define regions just as well as lines can. Card edges, table dividers, section separators — try removing them and see if the layout still reads.' },
  { title: 'Figure / Ground', icon: Contrast, body: 'We distinguish foreground from background instinctively.', rule: 'Use contrast and elevation — shadows, surface colors — to create depth and focus. The primary content should feel like it sits "in front" of secondary content.' },
];

const hierarchy = [
  { title: 'Visual weight', body: 'Size, color, contrast, and whitespace all direct attention. Bigger and bolder means more important. If everything is bold, nothing is bold. Pick your single loudest element per view and make everything else quieter.' },
  { title: 'Typography scale', body: 'Use the DS type scale as a hierarchy system — headline-2xl for page titles, headline-xl for section headings, text-md for body. No more than 3 levels of heading prominence per view. If you need a fourth, your page has too many sections.' },
  { title: 'Scanning patterns', body: 'F-pattern for text-heavy content — users read the first line fully, then scan down the left edge. Z-pattern for marketing and hero layouts — eye moves top-left → top-right → bottom-left → bottom-right. Place key actions and info along these paths.' },
  { title: 'Contrast as a tool', body: 'The most important element should have the highest contrast against its surroundings. A primary button works because it\'s the only filled element in a sea of outlined ones. If you add a second high-contrast element, you split attention in half.' },
];

const composition = [
  { title: 'Alignment', body: 'Every element should align to something. If it doesn\'t, there should be a deliberate reason. Misalignment is one of the most common reasons a layout "feels off" — it creates visual noise that the brain registers before the conscious mind does.' },
  { title: 'Grid systems', body: 'Grids create predictable, scannable layouts. They\'re not a creative constraint — they\'re a cognitive scaffold. When content snaps to a grid, the brain can predict where information will be, which makes scanning faster.' },
  { title: 'Balance', body: 'Symmetrical layouts feel stable and formal — good for dashboards and settings. Asymmetrical layouts feel dynamic — good for landing pages. Asymmetry works when the "heavier" side is balanced by whitespace or a strong element on the other side.' },
  { title: 'Whitespace', body: 'It\'s not empty space, it\'s breathing room. Whitespace directs attention, separates concepts, and reduces cognitive load. When in doubt, add more whitespace, not less. A layout that feels "too spacious" is almost always better than one that feels cramped.' },
  { title: 'Density', body: 'Match density to context. Dashboards can be denser — power users expect it. Onboarding flows should be sparse — new users need cognitive room. Settings pages are medium density. Never use one density for everything.' },
];

const rhythm = [
  { title: 'Spacing scale', body: 'Always use DS spacing tokens, never arbitrary values. Consistent spacing builds subconscious trust — the brain notices when gaps are uneven even if the user can\'t articulate why. 4px, 8px, 12px, 16px, 24px, 32px, 48px — that\'s your scale. Use it.' },
  { title: 'Repetition', body: 'Repeating patterns — card layouts, list structures, form groups — reduce cognitive load and set expectations. Once a user has learned one card, they can predict every card. Break the pattern only to draw attention.' },
  { title: 'Vertical rhythm', body: 'Consistent baseline spacing makes content feel polished even if nobody can explain why. When headings, body text, and gaps all snap to the same vertical grid, the page develops a visual "heartbeat" that feels intentional and calm.' },
];

const opticalCorrections = [
  {
    title: 'Button padding with icons',
    what: 'When a button has an icon on one side and text on the other, the icon side gets 4px less padding than the text side.',
    why: 'Icons are solid shapes — they carry more visual mass than open letterforms. Equal mathematical padding makes the icon side look heavier. Reducing it by ~25% makes both sides feel balanced to the eye.',
  },
  {
    title: 'Play icon in circles',
    what: 'A play triangle centered mathematically inside a circle looks shifted to the left. We nudge it a few pixels to the right.',
    why: 'The triangle\'s visual center of mass is closer to its flat edge, not its geometric centroid. The optical center is always slightly right of the math center. Every media player does this — Spotify, YouTube, Apple Music.',
  },
  {
    title: 'Chroma curves per hue',
    what: 'Our palette generator uses gamut-relative chroma instead of a single fixed value across all hues.',
    why: 'sRGB can display wildly different amounts of chroma at different hue angles. C=0.15 is near-maximum for green but barely half of what magenta allows. A fixed value would make some palettes washed out and others clipped. The math has to bend to physics.',
  },
  {
    title: 'Circle vs. square sizing',
    what: 'A circle and a square at the same pixel dimensions don\'t look the same size. Circles need to be slightly larger to appear equivalent.',
    why: 'Circles have less area than squares at identical bounding boxes (~78.5% vs 100%). The brain judges size by area, not bounding box. This is why icon grids use keyline shapes — circles get a larger artboard allowance.',
  },
  {
    title: 'Font weight across sizes',
    what: 'The same font-weight value looks bolder at large sizes and thinner at small sizes. Display headings may use a lighter weight than body text even though they should feel "bolder."',
    why: 'Stroke width is absolute but perceived boldness is relative to letter height. A 1px stroke on a 12px letter looks bold. The same 1px on a 120px letter looks hairline. Variable fonts handle this automatically — static fonts need manual compensation.',
  },
];

const heuristics = [
  { q: 'Group related actions within the smallest spacing token that still reads clearly.', hint: 'Save/Cancel are siblings — 8px. Save and a help link are distant cousins — 24px+.' },
  { q: 'Use no more than 3 levels of visual hierarchy per section.', hint: 'Title, subtitle, body — that\'s it. A fourth level means too many sections.' },
  { q: 'When in doubt, add more whitespace, not less.', hint: 'Cramped layouts feel cheap. Spacious layouts feel considered.' },
  { q: 'Left-align text by default — center-align only for short, standalone elements.', hint: 'Paragraphs, lists, form labels — always left-aligned.' },
  { q: 'Limit line width to 60–80 characters for readability.', hint: 'max-w-[640px] or max-w-prose handles this automatically.' },
  { q: 'Primary action should be visually dominant; secondary actions should recede.', hint: 'One filled button. The rest are outlined or text-only.' },
  { q: 'If two things are different, make them clearly different — not just slightly.', hint: 'A 2px size difference is noise. An 8px size difference is a signal.' },
  { q: 'Consistent doesn\'t mean identical — adapt patterns to context but keep the underlying structure.', hint: 'Dashboard cards and onboarding cards can differ but share the same anatomy.' },
];

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function SectionHeader({ n, title }: { n: string; title: string }) {
  const meta = sectionMeta[n];
  const Icon = meta?.icon ?? Lightbulb;
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
  return <p className="font-sans text-base font-medium mb-10 max-w-[680px] leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{children}</p>;
}

function Callout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg p-6 my-8" style={{ backgroundColor: 'var(--color-surface-1)', borderLeft: '3px solid var(--color-warning)' }}>
      <p className="font-sans text-md font-bold mb-2" style={{ color: 'var(--color-warning)' }}>{title}</p>
      <p className="font-sans text-md font-medium leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{children}</p>
    </div>
  );
}

/* ─── Interactive checklist ───────────────────────────────────────────────── */

function HeuristicsChecklist() {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const score = Object.values(checked).filter(Boolean).length;
  const toggle = (i: number) => setChecked(prev => ({ ...prev, [i]: !prev[i] }));
  const scoreColor = score === heuristics.length ? 'var(--color-success)' : score >= 5 ? 'var(--color-warning)' : 'var(--color-error)';
  const scoreLabel = score === heuristics.length ? 'Layout looks solid.' : score >= 5 ? 'Getting there.' : 'Keep refining.';

  return (
    <div className="rounded-lg p-8 my-6" style={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}>
      <span className="font-mono text-sm font-medium px-2.5 py-1 rounded-m inline-block mb-3" style={{ backgroundColor: 'var(--color-primary-1-alpha-10)', color: 'var(--color-primary-1)' }}>Checklist</span>
      <h3 className="font-display text-headline-s font-bold mb-2" style={{ color: 'var(--color-on-surface)' }}>Layout review</h3>
      <p className="font-sans text-md font-medium mb-8" style={{ color: 'var(--color-on-surface-subtle-1)' }}>Run your layout through these eight checks. Each one catches a common visual problem.</p>

      <div className="flex flex-col gap-2 mb-6">
        {heuristics.map((c, i) => {
          const isChecked = !!checked[i];
          return (
            <motion.button key={i} onClick={() => toggle(i)} className="flex items-start gap-3 p-4 rounded-lg text-left cursor-pointer w-full"
              animate={{ backgroundColor: isChecked ? 'var(--color-success-alpha-10, rgba(34,197,94,0.08))' : 'var(--color-surface-1)' }}
              transition={{ duration: dur.instant, ease: ease.standard }}
              style={{ border: '1px solid var(--color-border)' }}>
              <motion.div className="shrink-0 mt-0.5 w-5 h-5 rounded flex items-center justify-center"
                animate={{ backgroundColor: isChecked ? 'var(--color-success)' : 'var(--color-surface-2)', borderColor: isChecked ? 'transparent' : 'var(--color-border)' }}
                transition={{ duration: dur.instant, ease: ease.standard }} style={{ border: '1.5px solid var(--color-border)' }}>
                <AnimatePresence>
                  {isChecked && <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={spring.snappy}><Check size={11} color="white" strokeWidth={2.5} /></motion.div>}
                </AnimatePresence>
              </motion.div>
              <div className="flex-1">
                <p className="font-sans text-md font-semibold leading-snug" style={{ color: isChecked ? 'var(--color-success)' : 'var(--color-on-surface)', textDecoration: isChecked ? 'line-through' : 'none', opacity: isChecked ? 0.7 : 1 }}>{c.q}</p>
                <p className="font-sans text-sm font-medium mt-0.5" style={{ color: 'var(--color-on-surface-subtle-1)', opacity: 0.7 }}>{c.hint}</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      <motion.div className="flex items-center justify-between p-4 rounded-lg" animate={{ backgroundColor: `${scoreColor}15` }} transition={{ duration: dur.base, ease: ease.standard }} style={{ border: `1px solid ${scoreColor}40` }}>
        <div>
          <p className="font-sans text-md font-bold" style={{ color: scoreColor }}>{score} / {heuristics.length} checked</p>
          <p className="font-sans text-sm font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{scoreLabel}</p>
        </div>
        <button onClick={() => setChecked({})} className="font-sans text-sm font-semibold px-3 py-1.5 rounded-m cursor-pointer inline-flex items-center gap-1.5" style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-on-surface)', border: '1px solid var(--color-border)' }}>
          <RefreshCw size={12} /> Reset
        </button>
      </motion.div>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────────── */

interface DesignPrinciplesProps {
  setSectionRef?: (key: 'craft' | 'perception') => (el: HTMLDivElement | null) => void;
}

export default function DesignPrinciples({ setSectionRef }: DesignPrinciplesProps) {
  return (
    <div className="space-y-20">

      {/* Hero */}
      <section>
        <div className="flex items-start gap-8">
          <div className="w-28 h-28 rounded-3xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-primary-1)' }}>
            <Lightbulb size={64} color="white" strokeWidth={1.5} />
          </div>
          <div>
            <div className="font-mono text-sm font-medium inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4" style={{ backgroundColor: 'var(--color-primary-1-alpha-10)', color: 'var(--color-primary-1)' }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-primary-1)' }} />
              Foundations
            </div>
            <h1 className="font-display text-headline-2xl font-bold mb-4" style={{ color: 'var(--color-on-surface)' }}>
              See like a{' '}<span style={{ color: 'var(--color-primary-1)' }}>designer</span>
            </h1>
            <p className="font-sans text-lg font-medium max-w-[600px] leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
              You don't need a design degree to make good layout decisions. These principles are the
              mental models that designers use — distilled into rules you can apply immediately.
              If your layout feels "off" but you can't explain why, one of these will tell you.
            </p>
          </div>
        </div>
      </section>

      {/* ══ PERCEPTION ════════════════════════════════════════════════════ */}
      <div ref={setSectionRef?.('perception')} className="scroll-mt-8 space-y-20">

      <div>
        <h2
          className="font-brand font-bold leading-[0.95] mb-6"
          style={{ fontSize: 'clamp(56px, 7vw, 104px)', color: 'var(--color-on-surface)' }}
        >
          PERCEPTION
        </h2>
        <p className="font-sans text-lg max-w-2xl" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
          How the brain reads a layout before the conscious mind catches up. Gestalt laws, hierarchy, attention — the invisible architecture that makes something feel "right" or "off" in the first 200 milliseconds.
        </p>
      </div>

      {/* 01 Visual Perception */}
      <section>
        <SectionHeader n="01" title="Visual Perception" />
        <Lead>
          The Gestalt principles are how your brain organises visual information before you
          consciously think about it. They're the reason some layouts feel "right" without
          explanation — and why others feel wrong even when every individual element is fine.
        </Lead>
        <div className="grid grid-cols-1 gap-4">
          {gestalt.map(({ title, icon: Icon, body, rule }) => (
            <div key={title} className="flex gap-5 p-6 rounded-lg" style={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#6366f120' }}>
                <Icon size={24} color="#6366f1" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-sans text-md font-bold mb-1" style={{ color: 'var(--color-on-surface)' }}>{title}</h3>
                <p className="font-sans text-md font-semibold mb-2" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{body}</p>
                <p className="font-sans text-md font-medium leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)', opacity: 0.8 }}>{rule}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 02 Hierarchy & Attention */}
      <section>
        <SectionHeader n="02" title="Hierarchy & Attention" />
        <Lead>
          Every layout is a competition for the user's eyes. Hierarchy is how you pick winners.
          Without clear hierarchy, a page is a democracy of equally loud elements — and democracies
          of loud elements produce nothing but noise.
        </Lead>
        <div className="grid grid-cols-2 gap-4">
          {hierarchy.map(({ title, body }) => (
            <div key={title} className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}>
              <h3 className="font-sans text-md font-bold mb-2" style={{ color: 'var(--color-on-surface)' }}>{title}</h3>
              <p className="font-sans text-md font-medium leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{body}</p>
            </div>
          ))}
        </div>
        <Callout title="The squint test">
          Blur your eyes (or zoom your browser to 25%) and look at your layout. The elements that
          stand out are your hierarchy. If the wrong thing stands out — or nothing does — your
          hierarchy needs work.
        </Callout>
      </section>

      </div>{/* end perception */}

      {/* ══ CRAFT ═══════════════════════════════════════════════════════════ */}
      <div ref={setSectionRef?.('craft')} className="scroll-mt-8 space-y-20">

      <div className="mt-4">
        <h2
          className="font-brand font-bold leading-[0.95] mb-6"
          style={{ fontSize: 'clamp(56px, 7vw, 104px)', color: 'var(--color-on-surface)' }}
        >
          CRAFT
        </h2>
        <p className="font-sans text-lg max-w-2xl" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
          Where theory meets the pixel grid. Composition, rhythm, optical corrections — the deliberate choices that separate a system that's technically correct from one that feels crafted by human hands.
        </p>
      </div>

      {/* 03 Composition & Layout */}
      <section>
        <SectionHeader n="03" title="Composition & Layout" />
        <Lead>
          Composition is about how elements relate to each other in space. Alignment, balance,
          and whitespace are the grammar of visual design — they determine whether your layout
          reads as a coherent sentence or a collection of random words.
        </Lead>
        <div className="flex flex-col gap-4">
          {composition.map(({ title, body }, i) => (
            <div key={title} className="flex gap-5 items-start p-6 rounded-lg" style={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}>
              <span className="font-mono text-sm font-bold shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#06b6d420', color: '#06b6d4' }}>{i + 1}</span>
              <div>
                <h4 className="font-sans text-md font-bold mb-1" style={{ color: 'var(--color-on-surface)' }}>{title}</h4>
                <p className="font-sans text-md font-medium leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 04 Rhythm & Consistency */}
      <section>
        <SectionHeader n="04" title="Rhythm & Consistency" />
        <Lead>
          Rhythm is what makes a layout feel "designed" rather than "assembled." When spacing,
          sizing, and patterns repeat predictably, the brain relaxes — it knows what to expect.
          Break the rhythm only when you want to draw attention.
        </Lead>
        <div className="grid grid-cols-3 gap-4">
          {rhythm.map(({ title, body }) => (
            <div key={title} className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-surface-1)', borderTop: '3px solid #8b5cf6' }}>
              <h3 className="font-sans text-md font-bold mb-2" style={{ color: 'var(--color-on-surface)' }}>{title}</h3>
              <p className="font-sans text-md font-medium leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 05 Practical Heuristics */}
      <section>
        <SectionHeader n="05" title="Practical Heuristics" />
        <Lead>
          Rules of thumb for when you don't have time to think about theory. Each of these
          encodes a principle from the sections above — they're the fast version. Check your
          layout against all eight before calling it done.
        </Lead>
        <HeuristicsChecklist />
        <Callout title="These aren't rules to memorise">
          They're lenses to look through. When a layout feels wrong but you can't explain why,
          run through these principles one by one. One of them will give you the vocabulary to
          describe the problem — and the tool to fix it.
        </Callout>
      </section>

      {/* 06 Optical Corrections */}
      <section>
        <SectionHeader n="06" title="Optical Corrections" />
        <Lead>
          A design system that only follows the math will always feel slightly off. The human eye
          doesn't measure pixels — it measures perceived weight, balance, and proportion. Sometimes
          the correct value is the one that looks wrong in the code but looks right on screen.
          These aren't bugs. They're the difference between a system that's technically correct
          and one that feels alive.
        </Lead>

        <div className="p-6 rounded-lg mb-8" style={{ backgroundColor: 'var(--color-surface-1)', borderLeft: '3px solid #e11d48' }}>
          <p className="font-sans text-md font-bold mb-2" style={{ color: '#e11d48' }}>
            Why this matters
          </p>
          <p className="font-sans text-md font-medium leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
            If you're a developer reading the source and you see asymmetric padding, a nudged icon,
            or a value that doesn't match the token grid — check here before "fixing" it. There's a
            good chance someone already tried the mathematically correct version, and it looked worse.
            Optical corrections are deliberate. They're documented. And they exist because human
            perception doesn't run on a pixel grid.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {opticalCorrections.map(({ title, what, why }, i) => (
            <div key={title} className="flex gap-5 items-start p-6 rounded-lg" style={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}>
              <span className="font-mono text-sm font-bold shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#e11d4820', color: '#e11d48' }}>{i + 1}</span>
              <div>
                <h4 className="font-sans text-md font-bold mb-1" style={{ color: 'var(--color-on-surface)' }}>{title}</h4>
                <p className="font-sans text-md font-semibold mb-2" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{what}</p>
                <p className="font-sans text-md font-medium leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)', opacity: 0.8 }}>{why}</p>
              </div>
            </div>
          ))}
        </div>

        <Callout title="The principle behind the principle">
          Every design system is a negotiation between two truths: the mathematical truth (pixels,
          tokens, grids) and the perceptual truth (what the human eye reports). When they disagree,
          the eye wins. Document why, and move on. A system that refuses to bend to perception isn't
          rigorous — it's brittle.
        </Callout>
      </section>

      </div>{/* end craft */}
    </div>
  );
}
