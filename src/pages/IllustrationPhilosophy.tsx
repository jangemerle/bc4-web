import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, RefreshCw, Fingerprint, PenTool, Palette, Users, Box, LayoutGrid, Maximize, Ban, Sparkles, FolderOpen, ClipboardCheck, Brush } from 'lucide-react';
import { spring, duration as dur, ease } from '../tokens/motion';

/* ─── Static data ──────────────────────────────────────────────────────────── */

const traits = [
  {
    title: 'Hand-drawn',
    color: 'var(--color-primary-1)',
    body: 'Thick brush pen, visible texture, organic imperfections. Every stroke says "a person made this." If it looks like it came out of a vector tool, start over.',
  },
  {
    title: 'Dreamy',
    color: 'var(--color-warning)',
    body: 'A slightly surreal worldview where people float on clouds, objects have faces, and a magnifying glass might reveal a tiny person inside. Matter-of-fact impossibility.',
  },
  {
    title: 'Human',
    color: 'var(--color-error)',
    body: 'Warm, witty, approachable. Characters are gestural blobs with dot eyes, not anatomical studies. The simplification is the point — it makes everyone feel represented.',
  },
];

const colorPalette = [
  { token: '--illust-warm',   role: 'Primary warm blob',       hex: '#F5B731 → #F09030', character: 'Sunny and optimistic' },
  { token: '--illust-cool',   role: 'Cool atmosphere blob',    hex: '#B8D8E8 → #D4E8F0', character: 'Calm and open' },
  { token: '--illust-green',  role: 'Energy/growth blob',      hex: '#7BC47F → #4FA853', character: 'Motion and vitality' },
  { token: '--illust-coral',  role: 'Warmth/personality blob',  hex: '#F28B82 → #E8A090', character: 'Playful and personal' },
  { token: '--illust-purple', role: 'Dreaminess blob',          hex: '#C4B0E0 → #A890D0', character: 'Magical and sparse' },
  { token: '--illust-line',   role: 'All outlines',             hex: '#1A1A1A',           character: 'Near-black, always' },
  { token: '--illust-bg',     role: 'Default background',       hex: '#FAF8F3',           character: 'Warm off-white' },
];

const avoidList = [
  'Clean, smooth vector lines — the hand-drawn texture is essential',
  'Perfectly geometric shapes — everything should feel human-drawn',
  'Filling every shape with color — restraint makes color impactful',
  'Detailed facial features — keep faces minimal (dot eyes, simple smile)',
  'Complex, busy scenes with many competing focal points',
  'Drop shadows, 3D effects, or photorealistic elements',
  'Thin, delicate line work — strokes should be bold and confident',
  'Gradients on the line work itself — lines are always solid black',
  'Stock illustration aesthetics — this style should feel custom and authored',
  'Symmetrical, centered, "safe" compositions — embrace organic asymmetry',
];

const sizes = [
  { useCase: 'Spot / inline',  dimensions: '400 × 400px',  notes: 'Simple, single-element. Used inline with content.' },
  { useCase: 'Feature / card', dimensions: '800 × 600px',  notes: 'Character + context. Section headers, empty states.' },
  { useCase: 'Hero / landing',  dimensions: '1200 × 900px', notes: 'Full composition. Landing pages, onboarding.' },
  { useCase: 'Empty state',     dimensions: '600 × 400px',  notes: 'Centered, with breathing room.' },
];

const inventory = {
  'Core set': [
    'Person inside magnifying glass → Users / People',
    'Folder inside magnifying glass → Projects / Collections',
    'Document inside magnifying glass → Search / Results',
    'Gear inside magnifying glass → Settings / Config',
    'Question mark inside magnifying glass → Help / Support',
  ],
  'Empty states': [
    'Person looking around an empty space with floating sparkles → No results',
    'Character sitting peacefully on a cloud → Loading / Waiting',
    'Figure reaching up toward floating objects → Getting started / Onboarding',
  ],
  'Status & feedback': [
    'Character with sun-head meditating → Success / Complete',
    'Person running with motion lines and energy blobs → In progress',
    'Figure slumped over a search bar with stars around head → Error / Exhausted',
  ],
  'Feature illustrations': [
    'Person interacting with oversized UI elements → Product features',
    'Character hugging/carrying oversized objects → Value propositions',
    'Figures collaborating with shared objects between them → Teamwork',
  ],
};

const checklist = [
  { q: 'Is the line work thick, textured, and visibly hand-drawn?', hint: 'Brush pen, not Illustrator pen tool.' },
  { q: 'Does the composition have one clear focal point?', hint: 'One subject, generous white space around it.' },
  { q: 'Is color used sparingly — max 2-3 blob groups?', hint: 'Most of the illustration should be black and white.' },
  { q: 'Are the color blobs soft, organic, and watercolor-like?', hint: 'Never hard-edged fills. Luminous and backlit.' },
  { q: 'Is there a surreal or metaphorical twist?', hint: 'Unexpected containment, scale subversion, anthropomorphism.' },
  { q: 'Are characters gestural with minimal facial features?', hint: 'Dot eyes, simple curved mouth. Emotion through pose.' },
  { q: 'Does the illustration tell a micro-story?', hint: 'Not decoration — narrative with an imaginative twist.' },
  { q: 'Would you believe a confident illustrator drew this by hand?', hint: 'If it looks computer-generated, it\'s wrong.' },
];

const sectionMeta: Record<string, { icon: React.ElementType; bg: string }> = {
  '01': { icon: Fingerprint,    bg: '#6366f1' },
  '02': { icon: PenTool,        bg: '#f59e0b' },
  '03': { icon: Palette,        bg: '#06b6d4' },
  '04': { icon: Users,          bg: '#8b5cf6' },
  '05': { icon: Box,            bg: '#14b8a6' },
  '06': { icon: LayoutGrid,     bg: '#ef4444' },
  '07': { icon: Maximize,       bg: '#3b82f6' },
  '08': { icon: Ban,            bg: '#ec4899' },
  '09': { icon: Sparkles,       bg: '#10b981' },
  '10': { icon: FolderOpen,     bg: '#6366f1' },
  '11': { icon: ClipboardCheck, bg: '#f59e0b' },
};

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

function SectionHeader({ n, title }: { n: string; title: string }) {
  const meta = sectionMeta[n];
  const Icon = meta?.icon ?? Brush;
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

function IllustrationChecklist() {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const score = Object.values(checked).filter(Boolean).length;
  const toggle = (i: number) => setChecked(prev => ({ ...prev, [i]: !prev[i] }));

  const scoreColor = score === checklist.length
    ? 'var(--color-success)'
    : score >= 5
    ? 'var(--color-warning)'
    : 'var(--color-error)';

  const scoreLabel = score === checklist.length
    ? 'Ship it. Artfully.'
    : score >= 5
    ? 'Almost there.'
    : 'Keep drawing.';

  return (
    <DemoCard
      label="Checklist"
      title="Illustration review"
      description="Run every illustration through these eight checks before it goes into the product. One failed check and the illustration breaks character."
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

function AvoidFlipDemo() {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const toggleCard = (i: number) => setRevealed(prev => ({ ...prev, [i]: !prev[i] }));

  return (
    <DemoCard
      label="Reference"
      title="What to avoid"
      description="Ten anti-patterns that break the illustration language. Click to acknowledge each one."
    >
      <div className="grid grid-cols-2 gap-3 mb-6">
        {avoidList.map((item, i) => {
          const isDone = !!revealed[i];
          return (
            <motion.button
              key={i}
              onClick={() => toggleCard(i)}
              className="rounded-lg p-4 text-left cursor-pointer w-full"
              style={{
                backgroundColor: isDone ? 'var(--color-success-alpha-10, rgba(34,197,94,0.08))' : 'var(--color-surface-2)',
                border: `1px solid ${isDone ? 'var(--color-success)' : 'var(--color-border)'}`,
              }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.01 }}
              transition={spring.snappy}
            >
              <div className="flex items-start gap-2">
                {isDone
                  ? <Check size={14} className="shrink-0 mt-0.5" color="var(--color-success)" />
                  : <X size={14} className="shrink-0 mt-0.5" color="var(--color-error)" />
                }
                <p
                  className="font-sans text-md font-medium leading-snug"
                  style={{
                    color: isDone ? 'var(--color-success)' : 'var(--color-on-surface-subtle-1)',
                    textDecoration: isDone ? 'line-through' : 'none',
                    opacity: isDone ? 0.6 : 1,
                  }}
                >
                  {item}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </DemoCard>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────────────── */

export type IllustrationSectionKey = 'identity' | 'elements' | 'practice';

interface IllustrationPhilosophyProps {
  sectionRefs?: Partial<Record<IllustrationSectionKey, (el: HTMLDivElement | null) => void>>;
}

export default function IllustrationPhilosophy({ sectionRefs }: IllustrationPhilosophyProps = {}) {
  return (
    <div className="space-y-20">

      {/* ══ IDENTITY ═════════════════════════════════════════════════════════ */}
      <div ref={sectionRefs?.identity} className="scroll-mt-8 space-y-20">
        <div className="mb-4">
          <h2
            className="font-brand font-bold leading-[0.95]"
            style={{ fontSize: 'clamp(56px, 7vw, 104px)', color: 'var(--color-on-surface)' }}
          >
            IDENTITY
          </h2>
        </div>

      {/* ─ Hero ─────────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-start gap-8">
          <div className="w-28 h-28 rounded-3xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-primary-1)' }}>
            <Brush size={64} color="white" strokeWidth={1.5} />
          </div>
          <div>
            <div className="font-mono text-sm font-medium inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4" style={{ backgroundColor: 'var(--color-primary-1-alpha-10)', color: 'var(--color-primary-1)' }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-primary-1)' }} />
              Foundations
            </div>
            <h1 className="font-display text-headline-2xl font-bold mb-4" style={{ color: 'var(--color-on-surface)' }}>
              Draw like you{' '}<span style={{ color: 'var(--color-primary-1)' }}>mean it</span>
            </h1>
            <p className="font-sans text-lg font-medium max-w-[600px] leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
              Our illustrations feel like they were drawn by a confident, playful person with a thick brush pen
              and a set of watercolors — not by a computer. They carry warmth, wit, and a slightly surreal
              worldview where everyday objects come alive and humans float on clouds. This is how the brand
              thinks in pictures.
            </p>
          </div>
        </div>
      </section>

      {/* ─ 01  Identity ─────────────────────────────────────────────── */}
      <section>
        <SectionHeader n="01" title="Core identity" />
        <Lead>
          Three words define every illustration decision. If a drawing doesn't feel like all three,
          something is off. Not two out of three. All three.
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

        <Callout title="What we are not">
          Clean vector art. Corporate flat illustration. Geometric precision. Pixel-perfect symmetry.
          Overly detailed realism. If your illustration could be an Adobe Stock template, it doesn't
          belong here.
        </Callout>
      </section>

      {/* ─ 02  Line work ────────────────────────────────────────────── */}
      <section>
        <SectionHeader n="02" title="Line work" />
        <Lead>
          The foundation of every illustration is bold, organic black line work. Think chunky brush pen
          or wide marker. Not fine-tip. Not Bézier curves. Lines that a human hand actually drew.
        </Lead>

        <div className="grid grid-cols-2 gap-4">
          {[
            { title: 'Weight', body: 'Thick and confident. Visible brush/marker texture with slight grain, pressure variation, and occasional rough edges. Lines are never perfectly smooth.' },
            { title: 'Consistency', body: 'Stroke weight varies naturally within a single line — thicker on curves, thinner on quick strokes. But the overall boldness stays consistent across the system.' },
            { title: 'Endings', body: 'Strokes taper naturally or end with visible brush lift. No perfect geometric caps. The imperfection is the personality.' },
            { title: 'Intersections', body: 'Lines can overlap, cross over each other, and double back. Imperfection is the point. A line that stops perfectly at a junction looks robotic.' },
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

        <DoDont
          doText="Lines define shapes through outline only. Interiors are typically left empty (white/transparent) unless filled with a color blob. The line IS the illustration."
          dontText="Use hatching or cross-hatching for shading. Use thin, delicate strokes. Put gradients on the line work. Lines are always solid black, always bold."
        />
      </section>

      {/* ─ 03  Color system ─────────────────────────────────────────── */}
      <section>
        <SectionHeader n="03" title="Color system" />
        <Lead>
          Color is used sparingly and expressively. It never fills the entire illustration — it acts as
          atmosphere, emotion, and accent floating behind or through the line work. Restraint is what
          makes color impactful.
        </Lead>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { title: 'Black line work', body: 'Always the dominant visual layer. Carries all structure and detail. Color sits behind it, never replaces it.' },
            { title: 'Color blobs', body: 'Soft, watercolor-like shapes that sit behind or bleed through the line work. Organic, amorphous, luminous — like actual watercolor pooling on paper.' },
            { title: 'Max 2-3 color groups', body: 'Per illustration. Some can be monochrome (black only, or black + single accent). Restraint is key — most of the illustration remains black and white.' },
            { title: 'Never use color as outline', body: 'Outlines are always black. Color blobs extend beyond the boundaries of the line work. They\'re atmospheric, not contained.' },
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

        <div
          className="rounded-lg overflow-hidden"
          style={{ border: '1px solid var(--color-border)' }}
        >
          <div
            className="grid grid-cols-[160px_1fr_1fr_1fr] gap-4 px-6 py-3"
            style={{ backgroundColor: 'var(--color-surface-2)' }}
          >
            {['Token', 'Role', 'Hex', 'Character'].map(h => (
              <span key={h} className="font-sans text-sm font-bold" style={{ color: 'var(--color-on-surface-subtle-2)' }}>{h}</span>
            ))}
          </div>
          {colorPalette.map((c, i) => (
            <div
              key={c.token}
              className="grid grid-cols-[160px_1fr_1fr_1fr] gap-4 items-center px-6 py-4"
              style={{
                backgroundColor: i % 2 === 0 ? 'var(--color-surface-1)' : 'transparent',
                borderTop: '1px solid var(--color-border)',
              }}
            >
              <span className="font-mono text-sm font-medium" style={{ color: 'var(--color-primary-1)' }}>{c.token}</span>
              <span className="font-sans text-md font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{c.role}</span>
              <span className="font-mono text-sm font-medium" style={{ color: 'var(--color-on-surface)' }}>{c.hex}</span>
              <span className="font-sans text-md font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{c.character}</span>
            </div>
          ))}
        </div>
      </section>

      </div>{/* end: identity */}

      {/* ══ ELEMENTS ═════════════════════════════════════════════════════════ */}
      <div ref={sectionRefs?.elements} className="scroll-mt-8 space-y-20">
        <div className="mb-4">
          <h2
            className="font-brand font-bold leading-[0.95]"
            style={{ fontSize: 'clamp(56px, 7vw, 104px)', color: 'var(--color-on-surface)' }}
          >
            ELEMENTS
          </h2>
        </div>

      {/* ─ 04  Characters ───────────────────────────────────────────── */}
      <section>
        <SectionHeader n="04" title="Characters & figures" />
        <Lead>
          People are central to the illustration language. They should feel approachable, universal, and
          gently humorous. Not anatomically correct — emotionally correct.
        </Lead>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { title: 'Bodies are gestural blobs', body: 'Simplified but expressive. Proportions are loose — heads can be slightly large, limbs can stretch or compress. Anatomical precision is the opposite of what we want.' },
            { title: 'Hands are visible and active', body: 'They hold things, gesture, reach. Simplified (mitten-like or with suggested fingers) but never hidden. Hands tell the story as much as faces do.' },
            { title: 'Faces are minimal', body: 'Dot eyes, simple curved mouth, occasionally a small nose. Expression reads through body language, head tilt, and arm position — not facial detail.' },
          ].map(({ title, body }) => (
            <div
              key={title}
              className="rounded-lg p-6"
              style={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}
            >
              <h3 className="font-sans text-md font-bold mb-3" style={{ color: 'var(--color-on-surface)' }}>{title}</h3>
              <p className="font-sans text-md font-medium leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{body}</p>
            </div>
          ))}
        </div>

        <Callout title="Diversity through abstraction">
          Vary hair styles, body shapes, and implied characteristics across illustrations. The style's
          abstraction naturally creates universality — lean into this. Characters are somewhat
          gender-neutral by default through simplification.
        </Callout>
      </section>

      {/* ─ 05  Objects & props ──────────────────────────────────────── */}
      <section>
        <SectionHeader n="05" title="Objects & props" />
        <Lead>
          Objects bring narrative to illustrations and are treated with the same hand-drawn warmth as
          characters. A laptop is a rectangle with a smaller rectangle. A phone is a rounded rectangle
          with dots. Recognizable but simplified.
        </Lead>

        <div className="space-y-6">
          {[
            { title: 'Objects can have personality.', desc: 'Faces on suns, moons, apples, and other non-human elements are encouraged. Anthropomorphism is a core part of the visual language.' },
            { title: 'Scale is playful.', desc: 'Objects can be oversized relative to characters — a giant envelope, an enormous clock. Scale subversion creates emphasis and narrative power.' },
            { title: 'UI elements as objects.', desc: 'Screens, windows, buttons, and interface elements appear as hand-drawn versions of themselves. A search bar becomes a pill shape. A checkbox becomes a scribbled square.' },
            { title: 'Recurring motifs bind the system.', desc: '4-pointed sparkle stars, simple scalloped clouds, small floating dots, motion lines (short parallel dashes). These appear across all illustrations as connective tissue.' },
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

      {/* ─ 06  Composition & narrative ──────────────────────────────── */}
      <section>
        <SectionHeader n="06" title="Composition & narrative" />
        <Lead>
          This is where the style becomes truly distinctive. Compositions are not just decorative — they
          tell micro-stories with a surreal, imaginative twist. Every illustration is a tiny world.
        </Lead>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { title: 'Central focal point', body: 'Most illustrations have one clear subject (a person, an object, a scene) that anchors the composition. Everything else supports it.' },
            { title: 'Breathing room', body: 'Generous white space around the illustration. These are not dense, edge-to-edge scenes. The emptiness is part of the design.' },
            { title: 'Asymmetric balance', body: 'Elements are arranged organically, not on a strict grid. A star on one side might be balanced by a cloud on the other.' },
            { title: 'Layering', body: 'Line work sits on top, color blobs sit behind, decorative elements (sparkles, dots) float around the edges.' },
          ].map(({ title, body }) => (
            <div
              key={title}
              className="p-6 rounded-lg"
              style={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}
            >
              <p className="font-sans text-md font-bold mb-2" style={{ color: 'var(--color-on-surface)' }}>{title}</p>
              <p className="font-sans text-md font-medium leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{body}</p>
            </div>
          ))}
        </div>

        <div
          className="rounded-lg p-6"
          style={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}
        >
          <Label>Signature technique</Label>
          <h3 className="font-display text-headline-s font-bold mb-2" style={{ color: 'var(--color-on-surface)' }}>
            The surreal twist
          </h3>
          <p className="font-sans text-md font-medium mb-6" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
            This is the creative signature that makes the style memorable. Every composition should have at least one element
            that bends reality — calmly, matter-of-factly, as if this is simply how things work.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'Unexpected containment', desc: 'A person inside a magnifying glass. A face inside a moon. Objects contain other objects in surprising ways.' },
              { name: 'Scale subversion', desc: 'Characters interact with oversized objects — hugging a giant clock, sitting on a cloud, carrying a building-sized envelope.' },
              { name: 'Anthropomorphism', desc: 'Give personality to abstract concepts — a sun with closed eyes meditating, an apple with a peaceful face, a hot air balloon with a sleepy expression.' },
              { name: 'Metaphor made literal', desc: '"Searching for talent" becomes a hand holding a magnifying glass with a person inside. "Time management" becomes a person hugging a clock.' },
            ].map(({ name, desc }) => (
              <div key={name} className="flex gap-3 items-start">
                <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-2" style={{ backgroundColor: 'var(--color-primary-1)' }} />
                <div>
                  <p className="font-sans text-md font-bold" style={{ color: 'var(--color-on-surface)' }}>{name}</p>
                  <p className="font-sans text-md font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─ 07  Sizing ───────────────────────────────────────────────── */}
      <section>
        <SectionHeader n="07" title="Sizing & format" />
        <Lead>
          Four size tiers cover everything. PNG with transparent background is the primary format. Not
          SVG — the brush texture, watercolor blobs, and organic line quality are raster-native.
        </Lead>

        <div
          className="rounded-lg overflow-hidden"
          style={{ border: '1px solid var(--color-border)' }}
        >
          <div
            className="grid grid-cols-[160px_160px_1fr] gap-4 px-6 py-3"
            style={{ backgroundColor: 'var(--color-surface-2)' }}
          >
            {['Use case', 'Dimensions', 'Notes'].map(h => (
              <span key={h} className="font-sans text-sm font-bold" style={{ color: 'var(--color-on-surface-subtle-2)' }}>{h}</span>
            ))}
          </div>
          {sizes.map((s, i) => (
            <div
              key={s.useCase}
              className="grid grid-cols-[160px_160px_1fr] gap-4 items-center px-6 py-4"
              style={{
                backgroundColor: i % 2 === 0 ? 'var(--color-surface-1)' : 'transparent',
                borderTop: '1px solid var(--color-border)',
              }}
            >
              <span className="font-mono text-sm font-medium" style={{ color: 'var(--color-primary-1)' }}>{s.useCase}</span>
              <span className="font-mono text-sm font-medium" style={{ color: 'var(--color-on-surface)' }}>{s.dimensions}</span>
              <span className="font-sans text-md font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{s.notes}</span>
            </div>
          ))}
        </div>

        <Callout title="Why not SVG?">
          The brush texture, watercolor blobs, and organic line quality are raster-native and cannot be
          faithfully reproduced in vector format. Use PNG with transparent background as primary format.
          Fallback: PNG on warm off-white (#FAF8F3).
        </Callout>
      </section>

      </div>{/* end: elements */}

      {/* ══ PRACTICE ═════════════════════════════════════════════════════════ */}
      <div ref={sectionRefs?.practice} className="scroll-mt-8 space-y-20">
        <div className="mb-4">
          <h2
            className="font-brand font-bold leading-[0.95]"
            style={{ fontSize: 'clamp(56px, 7vw, 104px)', color: 'var(--color-on-surface)' }}
          >
            PRACTICE
          </h2>
        </div>

      {/* ─ 08  What to avoid ────────────────────────────────────────── */}
      <section>
        <SectionHeader n="08" title="What to avoid" />
        <Lead>
          Ten anti-patterns that will break the illustration language immediately. If you catch yourself
          doing any of these, stop and redraw. There are no exceptions.
        </Lead>

        <AvoidFlipDemo />
      </section>

      {/* ─ 09  AI generation prompt ─────────────────────────────────── */}
      <section>
        <SectionHeader n="09" title="AI generation template" />
        <Lead>
          When generating illustrations using AI tools, use this template structure for consistent
          results. The style prefix ensures the core identity is maintained across all outputs.
        </Lead>

        <div
          className="rounded-lg p-5 font-mono text-sm leading-relaxed overflow-x-auto mb-6"
          style={{
            backgroundColor: 'var(--color-surface-1)',
            color: 'var(--color-on-surface-subtle-1)',
            border: '1px solid var(--color-border)',
          }}
        >
          <code>{`[STYLE] Hand-drawn illustration with thick, textured black brush pen outlines
on a warm off-white background. The line work has visible brush texture,
varying pressure, and organic imperfections — like a confident illustrator
drawing with a chunky marker. The style is bold, playful, and slightly surreal.

[COLOR] Behind the black line work, {describe 1-2 soft watercolor gradient
blobs} float as atmospheric accents — they bleed beyond the outlines and have
a luminous, backlit quality. Colors are {specify from DS palette}. Most of
the illustration remains black and white.

[SUBJECT] {Describe the main subject — character, object, or scene}

[NARRATIVE TWIST] {Describe the surreal/metaphorical element — what makes
this composition unexpected and memorable}

[DETAILS] Small decorative elements: {select from: 4-pointed sparkle stars,
small floating dots, simple scalloped clouds, motion lines}. Generous white
space around the composition. The face (if any) has minimal features — dot
eyes and a simple curved mouth.

[FORMAT] PNG with transparent background, {size}px`}</code>
        </div>

        <DoDont
          doText="Be specific about the surreal twist — 'a person sitting inside a giant coffee cup reading a tiny book' gives the AI a clear narrative to execute."
          dontText="Leave the prompt generic — 'a person working at a desk' will produce stock illustration aesthetics every time. The twist is what makes it ours."
        />
      </section>

      {/* ─ 10  Inventory ────────────────────────────────────────────── */}
      <section>
        <SectionHeader n="10" title="Illustration inventory" />
        <Lead>
          Priority illustrations to create for the design system. The core set uses the narrative
          customization pattern — same magnifying glass composition, swap the inner element for context.
        </Lead>

        <div className="space-y-6">
          {Object.entries(inventory).map(([category, items]) => (
            <div
              key={category}
              className="rounded-lg p-6"
              style={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}
            >
              <h3 className="font-sans text-md font-bold mb-4" style={{ color: 'var(--color-on-surface)' }}>
                {category}
              </h3>
              <div className="flex flex-col gap-2">
                {items.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-2" style={{ backgroundColor: 'var(--color-primary-1)' }} />
                    <p className="font-sans text-md font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─ 11  Checklist ────────────────────────────────────────────── */}
      <section>
        <SectionHeader n="11" title="Illustration review" />
        <Lead>
          Eight checks that determine whether an illustration belongs in the system. Run every illustration
          through these before it ships. One failed check and the illustration breaks character.
        </Lead>

        <IllustrationChecklist />

        <Callout title="This is a living document">
          Update it as the illustration language evolves and new patterns emerge. The rules are guardrails,
          not prison walls — but until you've drawn fifty illustrations in this style, treat them as law.
        </Callout>
      </section>

      {/* ─ When not to reach for an illustration ───────────────────── */}
      <section>
        <SectionHeader n="11" title="When not to reach for an illustration" />
        <div className="flex flex-col gap-3" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
          <p className="font-sans text-md"><strong style={{ color: 'var(--color-on-surface)' }}>Mid-task screens.</strong> If the user is in flow — filling a form, navigating a data table, scanning a list — illustration is visual noise. Use icons instead.</p>
          <p className="font-sans text-md"><strong style={{ color: 'var(--color-on-surface)' }}>When you're bored of a blank state.</strong> "This screen looks empty" is not a reason to add illustration. Ask if the absence of content is itself meaningful — sometimes it is.</p>
          <p className="font-sans text-md"><strong style={{ color: 'var(--color-on-surface)' }}>Every empty state equally.</strong> Not every empty state deserves the same illustration weight. A table with no rows is different from an inbox with no messages is different from a brand new account. Match the illustration to the emotional register of the moment.</p>
        </div>
        <p className="font-sans text-sm mt-4" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
          Illustration is the one place the UI is allowed to have feelings. Use it carefully.
        </p>
      </section>

      </div>{/* end: practice */}

    </div>
  );
}
