import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check, X, RefreshCw, MessageCircle, Fingerprint, Compass,
  LayoutGrid, BookOpen, Type, AlertTriangle, Inbox, ShieldAlert,
  ClipboardCheck, Accessibility, Clock,
} from 'lucide-react';
import { spring, duration as dur, ease } from '../tokens/motion';

/* ─── Static data ─────────────────────────────────────────────────────────── */

const traits = [
  {
    title: 'Clear, not clinical',
    color: 'var(--color-primary-1)',
    body: 'Say exactly what happens in plain language. No system-speak, no passive constructions. "Your file was unable to be processed" → "We couldn\'t open that file." The user should never have to translate.',
  },
  {
    title: 'Warm, not gushing',
    color: 'var(--color-warning)',
    body: 'We are helpful and human, not a hype machine. "Awesome! Amazing! You\'re all set!" is noise. A calm "Done." or "All saved." carries more trust. Save warmth for moments that genuinely deserve it.',
  },
  {
    title: 'Brief, not curt',
    color: 'var(--color-error)',
    body: 'Every word should earn its place. If a sentence works without a word, cut it. But brevity never comes at the cost of clarity. "Del." is not better than "Delete". Respect the user\'s intelligence, not their patience.',
  },
  {
    title: 'Sharp, not snarky',
    color: 'var(--color-success)',
    body: 'Kvalt has a sense of humour — it just doesn\'t announce it. A well-placed observation lands better than a setup with a punchline. Write for the person who\'ll smile quietly and move on. If you had to add "lol" to make it funny, it wasn\'t.',
  },
];

const principles = [
  {
    n: '1',
    title: 'Start with what the user can do.',
    body: 'Lead with the action, not the system state. "You can invite teammates from Settings" instead of "Teammate invitations are available in the Settings panel." The user is the subject, not the software.',
  },
  {
    n: '2',
    title: 'Use active voice.',
    body: '"We saved your changes" beats "Your changes have been saved." Active voice is shorter, clearer, and implies that someone is responsible — which builds trust.',
  },
  {
    n: '3',
    title: 'One idea per sentence.',
    body: 'When a sentence needs a semicolon, it\'s two sentences. Complex ideas are fine — complex sentences are not. If you need to explain a second thing, start a new sentence.',
  },
  {
    n: '4',
    title: 'Put the most important word last.',
    body: 'The end of a sentence carries the most emphasis. "Your file failed to upload" is weaker than "We couldn\'t upload your file." The punchline goes at the end.',
  },
];

const patterns = [
  { surface: 'Button label',      goal: 'Tell the user exactly what happens',    rule: 'Verb + object. Never just a noun.',          good: 'Save changes',              bad: 'Submit' },
  { surface: 'Destructive button', goal: 'Make the risk legible',                 rule: 'Name the thing being destroyed.',            good: 'Delete project',            bad: 'Confirm' },
  { surface: 'Empty state',        goal: 'Explain the gap + give a path forward', rule: 'Why it\'s empty, then one call to action.',  good: 'No messages yet. Start a conversation to get things moving.', bad: 'Nothing here.' },
  { surface: 'Error message',      goal: 'Repair the situation',                  rule: 'What happened + what to do next.',           good: 'That email is already in use. Try signing in instead.', bad: 'Invalid email address.' },
  { surface: 'Success feedback',   goal: 'Confirm without celebrating',           rule: 'State the fact. Skip the exclamations.',     good: 'Project created.',          bad: 'Woohoo! Your project is live!' },
  { surface: 'Tooltip',            goal: 'Add context, not a label repeat',       rule: 'Explain the why, not the what.',             good: 'Marks this conversation as resolved for all members.', bad: 'Resolve conversation.' },
  { surface: 'Placeholder',        goal: 'Hint at the expected input format',     rule: 'Show an example, not a label.',              good: 'e.g. Weekly team sync',     bad: 'Enter name' },
  { surface: 'Loading state',      goal: 'Reassure without over-explaining',      rule: 'Use present progressive. Keep it short.',    good: 'Saving…',                   bad: 'Please wait while your changes are being saved to the server.' },
];

const vocabulary = [
  { avoid: 'Click here',          prefer: 'The linked action',        reason: '"Click here" ignores keyboard and touch users. Name the action instead.' },
  { avoid: 'Please',              prefer: '(nothing)',                reason: 'Filler politeness dilutes clear instruction. Reserve it for genuinely tricky asks.' },
  { avoid: 'Successfully',        prefer: '(past tense verb)',        reason: '"Saved successfully" → "Saved." The verb already implies success.' },
  { avoid: 'Simply / Just / Easy', prefer: '(remove entirely)',       reason: 'Tells people what to feel. If it\'s simple, they\'ll know. If it\'s not, this word insults them.' },
  { avoid: 'We\'re sorry',        prefer: 'Acknowledge + fix',        reason: 'Apologising is not fixing. Lead with what happens next, not with regret.' },
  { avoid: 'Invalid input',       prefer: 'Describe what\'s wrong',   reason: 'Validation errors should name the field and describe the rule that was broken.' },
  { avoid: 'Are you sure?',       prefer: 'State what will happen',   reason: '"Are you sure?" adds anxiety without information. "This will permanently delete…" is both kinder and clearer.' },
  { avoid: 'Utilize',             prefer: 'Use',                      reason: 'There is no situation where "utilize" is better than "use".' },
];

const errorExamples = [
  {
    label: 'Network error',
    bad:  'Error 503: Service temporarily unavailable. Please try again later.',
    good: 'Can\'t connect right now. Check your internet connection and try again.',
  },
  {
    label: 'Form validation',
    bad:  'Invalid email address format detected.',
    good: 'That doesn\'t look like an email address. Try something like you@example.com.',
  },
  {
    label: 'Permission denied',
    bad:  'Access denied. Insufficient privileges to perform this action.',
    good: 'You don\'t have permission to do that. Ask a workspace admin to update your role.',
  },
  {
    label: 'Empty required field',
    bad:  'This field is required.',
    good: 'Add a project name to continue.',
  },
];

const emptyStates = [
  {
    label: 'No results',
    bad:   'No results found.',
    good:  'No projects match "archiv". Try a different spelling or check your filters.',
  },
  {
    label: 'Empty inbox',
    bad:   'Your inbox is empty.',
    good:  'You\'re all caught up. New messages from your team will appear here.',
  },
  {
    label: 'No activity',
    bad:   'No activity.',
    good:  'Nothing\'s happened yet. Activity from your team will show up here as things move.',
  },
];

/* ─── Section meta ────────────────────────────────────────────────────────── */

const sectionMeta: Record<string, { icon: React.ElementType; bg: string }> = {
  '01': { icon: Fingerprint,   bg: '#6366f1' },
  '02': { icon: Compass,       bg: '#06b6d4' },
  '03': { icon: LayoutGrid,    bg: '#8b5cf6' },
  '04': { icon: BookOpen,      bg: '#f59e0b' },
  '05': { icon: Type,          bg: '#14b8a6' },
  '06': { icon: AlertTriangle, bg: '#ef4444' },
  '07': { icon: Inbox,         bg: '#3b82f6' },
  '08': { icon: ShieldAlert,   bg: '#ec4899' },
  '09': { icon: ClipboardCheck, bg: '#10b981' },
  '10': { icon: Accessibility, bg: '#6366f1' },
  '11': { icon: Clock,         bg: '#f59e0b' },
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function SectionHeader({ n, title }: { n: string; title: string }) {
  const meta = sectionMeta[n];
  const Icon = meta?.icon ?? MessageCircle;
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

/* ─── Interactive Demos ──────────────────────────────────────────────────── */

function FlipDemo({ examples, label, title, description }: {
  examples: { label: string; bad: string; good: string }[];
  label: string;
  title: string;
  description: string;
}) {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const toggleCard = (i: number) => setRevealed(prev => ({ ...prev, [i]: !prev[i] }));
  const revealAll = () => {
    const all: Record<number, boolean> = {};
    examples.forEach((_, i) => { all[i] = true; });
    setRevealed(all);
  };
  const resetAll = () => setRevealed({});

  return (
    <DemoCard label={label} title={title} description={description}>
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
                {isGood ? 'Click to see original' : 'Click to see better version'}
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

function VoiceCheckerDemo() {
  const checks = [
    { q: 'Does every sentence start with the user, not the system?', hint: '"You can…" not "The system allows…"' },
    { q: 'Is the verb active?', hint: '"We saved" not "Changes were saved"' },
    { q: 'Is there only one idea per sentence?', hint: 'If it needs a semicolon, split it.' },
    { q: 'Is the most important word at the end?', hint: 'The punchline goes last.' },
    { q: 'Could any word be removed without losing meaning?', hint: '"Successfully", "simply", "just" — cut them.' },
    { q: 'Does the button label describe what happens?', hint: '"Save changes" not "Submit"' },
    { q: 'Does the error say what to do next?', hint: 'Errors without actions are dead ends.' },
    { q: 'Is it written for someone mid-task, not someone reading leisurely?', hint: 'Fast scanning, not slow reading.' },
  ];

  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const score = Object.values(checked).filter(Boolean).length;

  const toggle = (i: number) => setChecked(prev => ({ ...prev, [i]: !prev[i] }));

  const scoreColor = score === checks.length
    ? 'var(--color-success)'
    : score >= 5
    ? 'var(--color-warning)'
    : 'var(--color-error)';

  const scoreLabel = score === checks.length
    ? 'Ship it.'
    : score >= 5
    ? 'Almost there.'
    : 'Keep editing.';

  return (
    <DemoCard
      label="Checklist"
      title="Copy review checklist"
      description="Run your UI copy through these eight questions before it ships. Each one catches a common failure mode."
    >
      <div className="flex flex-col gap-2 mb-6">
        {checks.map((c, i) => {
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
              {/* Checkbox indicator */}
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

      {/* Score */}
      <motion.div
        className="flex items-center justify-between p-4 rounded-lg"
        animate={{ backgroundColor: `${scoreColor}15` }}
        transition={{ duration: dur.base, ease: ease.standard }}
        style={{ border: `1px solid ${scoreColor}40` }}
      >
        <div>
          <p className="font-sans text-md font-bold" style={{ color: scoreColor }}>
            {score} / {checks.length} checked
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

/* ─── Page ───────────────────────────────────────────────────────────────── */

export type ToneOfVoiceSectionKey = 'character' | 'patterns' | 'moments' | 'quality';

interface ToneOfVoiceProps {
  sectionRefs?: Partial<Record<ToneOfVoiceSectionKey, (el: HTMLDivElement | null) => void>>;
}

export default function ToneOfVoice({ sectionRefs }: ToneOfVoiceProps = {}) {
  return (
    <div className="space-y-20">

      {/* ══ CHARACTER ════════════════════════════════════════════════════════ */}
      <div ref={sectionRefs?.character} className="scroll-mt-8 space-y-20">
        <div className="mb-4">
          <h2
            className="font-brand font-bold leading-[0.95]"
            style={{ fontSize: 'clamp(56px, 7vw, 104px)', color: 'var(--color-on-surface)' }}
          >
            CHARACTER
          </h2>
        </div>

      {/* ─ Hero ─────────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-start gap-8">
          <div className="w-28 h-28 rounded-3xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-primary-1)' }}>
            <MessageCircle size={64} color="white" strokeWidth={1.5} />
          </div>
          <div>
            <div className="font-mono text-sm font-medium inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4" style={{ backgroundColor: 'var(--color-primary-1-alpha-10)', color: 'var(--color-primary-1)' }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-primary-1)' }} />
              Foundations
            </div>
            <h1 className="font-display text-headline-2xl font-bold mb-4" style={{ color: 'var(--color-on-surface)' }}>
              Say what you mean,{' '}
              <span style={{ color: 'var(--color-primary-1)' }}>mean what you say</span>
            </h1>
            <p className="font-sans text-lg font-medium max-w-[600px] leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
              The UI is only as good as the words inside it. Every label, error message, tooltip,
              and empty state is a conversation. Kvalt's voice is how the product thinks out
              loud — it should sound like a smart, focused person who respects your time.
            </p>
          </div>
        </div>
      </section>

      {/* ─ 01  Character ─────────────────────────────────────────────── */}
      <section>
        <SectionHeader n="01" title="Character" />
        <Lead>
          Kvalt has one voice and many tones. The voice stays constant — it's the personality.
          The tone adapts — it's the mood for the moment. Celebrating a milestone? Warmer.
          Surfacing a destructive action? Measured. Never the same flat register throughout.
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

        <Callout title="The test">
          Read your copy aloud. If it sounds like a robot wrote it, rewrite it. If it sounds like
          you're performing friendliness, dial it back. The target is a smart colleague explaining
          something in Slack — no fanfare, no bureaucratese.
        </Callout>
      </section>

      {/* ─ 02  Principles ────────────────────────────────────────────── */}
      <section>
        <SectionHeader n="02" title="Principles" />
        <Lead>
          Four rules that cover ninety percent of copy decisions. Memorise these and you won't
          need to think about tone in the moment — the right words will follow naturally.
        </Lead>

        <div className="flex flex-col gap-4">
          {principles.map(({ n, title, body }) => (
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

      </div>{/* end: character */}

      {/* ══ PATTERNS ═════════════════════════════════════════════════════════ */}
      <div ref={sectionRefs?.patterns} className="scroll-mt-8 space-y-20">
        <div className="mb-4">
          <h2
            className="font-brand font-bold leading-[0.95]"
            style={{ fontSize: 'clamp(56px, 7vw, 104px)', color: 'var(--color-on-surface)' }}
          >
            PATTERNS
          </h2>
        </div>

      {/* ─ 03  UI Copy Patterns ──────────────────────────────────────── */}
      <section>
        <SectionHeader n="03" title="UI Copy Patterns" />
        <Lead>
          Every surface has a job. Button labels confirm. Error messages repair. Empty states invite.
          Know the goal of each surface before writing a word. The right goal produces the right tone automatically.
        </Lead>

        <div
          className="rounded-lg overflow-hidden"
          style={{ border: '1px solid var(--color-border)' }}
        >
          {/* Header */}
          <div
            className="grid grid-cols-[160px_1fr_1fr_1fr] gap-4 px-5 py-3"
            style={{ backgroundColor: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)' }}
          >
            {['Surface', 'Goal', 'Rule', 'Example'].map((h) => (
              <span key={h} className="font-sans text-sm font-bold" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                {h}
              </span>
            ))}
          </div>

          {patterns.map((row, i) => (
            <div
              key={row.surface}
              className="grid grid-cols-[160px_1fr_1fr_1fr] gap-4 px-5 py-4 items-start"
              style={{
                borderBottom: i < patterns.length - 1 ? '1px solid var(--color-border)' : 'none',
                backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--color-surface-1)',
              }}
            >
              <span className="font-mono text-sm font-medium" style={{ color: 'var(--color-primary-1)' }}>
                {row.surface}
              </span>
              <span className="font-sans text-md font-medium leading-snug" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                {row.goal}
              </span>
              <span className="font-sans text-md font-medium leading-snug" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                {row.rule}
              </span>
              <div>
                <p className="font-sans text-md font-semibold leading-snug mb-1" style={{ color: 'var(--color-on-surface)' }}>
                  ✓ {row.good}
                </p>
                <p className="font-sans text-sm font-medium leading-snug line-through" style={{ color: 'var(--color-on-surface-subtle-1)', opacity: 0.5 }}>
                  {row.bad}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─ 04  Vocabulary ─────────────────────────────────────────────── */}
      <section>
        <SectionHeader n="04" title="Vocabulary" />
        <Lead>
          Certain words erode trust, confuse users, or pad sentences without adding meaning.
          Below are the habitual offenders and what to say instead. When in doubt: shorter,
          plainer, more specific.
        </Lead>

        <div
          className="rounded-lg overflow-hidden"
          style={{ border: '1px solid var(--color-border)' }}
        >
          <div
            className="grid grid-cols-[180px_180px_1fr] gap-4 px-5 py-3"
            style={{ backgroundColor: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)' }}
          >
            {['Avoid', 'Prefer', 'Reason'].map((h) => (
              <span key={h} className="font-sans text-sm font-bold" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                {h}
              </span>
            ))}
          </div>

          {vocabulary.map((row, i) => (
            <div
              key={row.avoid}
              className="grid grid-cols-[180px_180px_1fr] gap-4 px-5 py-4 items-start"
              style={{
                borderBottom: i < vocabulary.length - 1 ? '1px solid var(--color-border)' : 'none',
                backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--color-surface-1)',
              }}
            >
              <span
                className="font-mono text-sm font-medium line-through"
                style={{ color: 'var(--color-error)', opacity: 0.8 }}
              >
                {row.avoid}
              </span>
              <span className="font-mono text-sm font-medium" style={{ color: 'var(--color-success)' }}>
                {row.prefer}
              </span>
              <span className="font-sans text-md font-medium leading-snug" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                {row.reason}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ─ 05  Capitalisation & Punctuation ──────────────────────────── */}
      <section>
        <SectionHeader n="05" title="Capitalisation & Punctuation" />
        <Lead>
          Typography conventions are not pedantry — they create a consistent reading rhythm.
          These rules apply to every surface. No exceptions for "important" labels.
        </Lead>

        <div className="grid grid-cols-2 gap-4">
          {[
            { title: 'Sentence case everywhere', body: 'Headings, buttons, labels, tooltips — everything. Only proper nouns and the first word of a sentence are capitalised. "Save changes", not "Save Changes". "Create new project", not "Create New Project".' },
            { title: 'Periods in full sentences only', body: 'Body copy and multi-sentence descriptions get periods. Single-clause labels, buttons, headings, and placeholders do not. "Saved." works as feedback. "Save changes." on a button does not.' },
            { title: 'No exclamation marks in UI', body: 'Reserve exclamation marks for truly extraordinary moments (account created, onboarding complete). They lose all meaning if used for routine feedback. "File uploaded!" is not an extraordinary moment.' },
            { title: 'Ampersands only in labels', body: '"Settings & Privacy" is fine in tight navigation contexts. In body copy, always spell out "and". Never use "&" in headings or descriptions.' },
            { title: 'Ellipsis for truncation, not loading', body: 'Use "…" only for truncated text. For loading states, write "Loading" or "Saving" — the progressive form implies continuity without the punctuation.' },
            { title: 'Numbers: words below ten', body: 'Spell out one through nine. Use numerals for 10 and above. "You have 3 new messages" looks like a badge, not prose. "You have three new messages" reads naturally.' },
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
      </section>

      </div>{/* end: patterns */}

      {/* ══ MOMENTS ══════════════════════════════════════════════════════════ */}
      <div ref={sectionRefs?.moments} className="scroll-mt-8 space-y-20">
        <div className="mb-4">
          <h2
            className="font-brand font-bold leading-[0.95]"
            style={{ fontSize: 'clamp(56px, 7vw, 104px)', color: 'var(--color-on-surface)' }}
          >
            MOMENTS
          </h2>
        </div>

      {/* ─ 06  Error Messages (interactive) ──────────────────────────── */}
      <section>
        <SectionHeader n="06" title="Error Messages" />
        <Lead>
          Errors are the moment users need the most help and usually get the least. A good error
          message does three things: acknowledges what went wrong, doesn't blame the user, and
          tells them exactly what to do next. Click each card to see the better version.
        </Lead>

        <FlipDemo
          label="Interactive"
          title="Error message rewrite"
          description="Each card shows a real-world error pattern. Click to flip from the original to the improved version."
          examples={errorExamples}
        />

        <Callout title="Errors are not system logs">
          Never expose technical details in user-facing errors unless they're actionable. Error
          codes, stack traces, and HTTP status numbers belong in dev tools — not in the UI.
          If a code must appear, put it at the end in muted text, never as the headline.
        </Callout>
      </section>

      {/* ─ 07  Empty States (interactive) ───────────────────────────── */}
      <section>
        <SectionHeader n="07" title="Empty States" />
        <Lead>
          Empty states are the most underrated surface in any product. They appear at high-intent
          moments — just after signup, after a search returns nothing, when a project is new.
          A blank page is a missed conversation. Click to see how each one can be improved.
        </Lead>

        <FlipDemo
          label="Interactive"
          title="Empty state rewrite"
          description="Bland empty states leave users stranded. Specific, contextual ones guide them forward."
          examples={emptyStates}
        />

        <div className="grid grid-cols-2 gap-4 mt-8">
          <div
            className="p-6 rounded-lg"
            style={{ backgroundColor: 'var(--color-surface-1)', borderTop: '3px solid var(--color-success)' }}
          >
            <p className="font-sans text-sm font-bold mb-2" style={{ color: 'var(--color-success)' }}>
              Good empty state anatomy
            </p>
            <ol className="flex flex-col gap-2">
              {[
                'Acknowledge the absence without dwelling on it',
                'Explain why this place is empty (context)',
                'Tell the user what they can do here',
                'One clear call to action, not three',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span
                    className="font-mono text-xs shrink-0 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-success)', color: 'white', fontSize: '9px' }}
                  >
                    {i + 1}
                  </span>
                  <span className="font-sans text-md font-medium leading-snug" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                    {item}
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div
            className="p-6 rounded-lg"
            style={{ backgroundColor: 'var(--color-surface-1)', borderTop: '3px solid var(--color-error)' }}
          >
            <p className="font-sans text-sm font-bold mb-2" style={{ color: 'var(--color-error)' }}>
              Common empty state mistakes
            </p>
            <ul className="flex flex-col gap-2">
              {[
                '"Nothing here yet." — no context, no path forward',
                'Generic illustration with no explanatory text',
                'Three CTAs competing for attention',
                'Copy that implies the user did something wrong',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <X size={14} className="shrink-0 mt-0.5" color="var(--color-error)" />
                  <span className="font-sans text-md font-medium leading-snug" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ─ 08  Confirmations ─────────────────────────────────────────── */}
      <section>
        <SectionHeader n="08" title="Confirmations & Destructive Actions" />
        <Lead>
          Confirmations interrupt the user. Every interruption must justify itself. The question
          is never "Are you sure?" — the question is "Here is exactly what will happen. Is that
          what you want?" Specificity reduces anxiety and increases trust.
        </Lead>

        <div className="grid grid-cols-2 gap-4">
          <div
            className="p-6 rounded-lg"
            style={{ backgroundColor: 'var(--color-surface-1)', borderTop: '3px solid var(--color-success)' }}
          >
            <p className="font-sans text-sm font-bold mb-3" style={{ color: 'var(--color-success)' }}>Do</p>
            <div className="flex flex-col gap-4">
              {[
                { label: 'Dialog title', text: 'Delete "Q3 Product Roadmap"?' },
                { label: 'Body', text: 'This will permanently remove the project and all its tasks. This can\'t be undone.' },
                { label: 'Confirm button', text: 'Delete project' },
                { label: 'Cancel button', text: 'Keep project' },
              ].map(({ label, text }) => (
                <div key={label}>
                  <p className="font-mono text-xs mb-1" style={{ color: 'var(--color-on-surface-subtle-1)', opacity: 0.6 }}>
                    {label}
                  </p>
                  <p className="font-sans text-md font-semibold" style={{ color: 'var(--color-on-surface)' }}>
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="p-6 rounded-lg"
            style={{ backgroundColor: 'var(--color-surface-1)', borderTop: '3px solid var(--color-error)' }}
          >
            <p className="font-sans text-sm font-bold mb-3" style={{ color: 'var(--color-error)' }}>Don't</p>
            <div className="flex flex-col gap-4">
              {[
                { label: 'Dialog title', text: 'Confirm action' },
                { label: 'Body', text: 'Are you sure you want to delete this? This action cannot be undone.' },
                { label: 'Confirm button', text: 'OK' },
                { label: 'Cancel button', text: 'Cancel' },
              ].map(({ label, text }) => (
                <div key={label}>
                  <p className="font-mono text-xs mb-1" style={{ color: 'var(--color-on-surface-subtle-1)', opacity: 0.6 }}>
                    {label}
                  </p>
                  <p className="font-sans text-md font-medium line-through" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      </div>{/* end: moments */}

      {/* ══ QUALITY ══════════════════════════════════════════════════════════ */}
      <div ref={sectionRefs?.quality} className="scroll-mt-8 space-y-20">
        <div className="mb-4">
          <h2
            className="font-brand font-bold leading-[0.95]"
            style={{ fontSize: 'clamp(56px, 7vw, 104px)', color: 'var(--color-on-surface)' }}
          >
            QUALITY
          </h2>
        </div>

      {/* ─ 09  Copy Review Checklist (interactive) ───────────────────── */}
      <section>
        <SectionHeader n="09" title="Copy Review Checklist" />
        <Lead>
          Before any copy ships, run it through these eight questions. They cover the most common
          failure modes — passive voice, missing next steps, false simplicity, and tonal mismatch.
          Aim for all eight.
        </Lead>

        <VoiceCheckerDemo />
      </section>

      {/* ─ 10  Accessibility ─────────────────────────────────────────── */}
      <section>
        <SectionHeader n="10" title="Accessible Language" />
        <Lead>
          Plain language is accessible language. The harder your copy is to read, the more
          people it excludes — non-native speakers, screen reader users, people under cognitive
          load. Good tone of voice and accessibility are the same goal.
        </Lead>

        <div className="grid grid-cols-2 gap-4">
          {[
            { title: 'Write for a 9th-grade reading level', body: 'Short sentences. Common words. No jargon. This is not dumbing down — it is respecting that people use this product while doing their actual job.' },
            { title: 'Icon buttons need accessible labels', body: 'Every icon-only button needs an aria-label that describes the action. "Delete" not "Delete icon". Screen readers announce what happens, not what\'s displayed.' },
            { title: 'Don\'t use colour alone to convey meaning', body: 'Error messages in red need a text label too. "Required field" or "Error:" must appear as text, not only as a red border.' },
            { title: 'Avoid directional language', body: '"Click the button below" breaks on mobile, screen readers, and reflow layouts. Use "Select Continue" instead of "click the Continue button to the right."' },
            { title: 'Time-sensitive copy must have alternatives', body: 'Countdowns and time-based prompts should explain themselves without urgency. Screen readers announce content as written — if it sounds panicked, it is panicked.' },
            { title: 'Alt text is a sentence, not a filename', body: '"Person relaxing at a desk, illustrated in a calm line-art style." Not "empty-state-hero.svg". Describe the content and its emotional intent, not the file.' },
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

        <Callout title="Copy is a design material">
          Words are not filled in after the design is done — they are part of the design.
          The best teams write copy and layout in parallel. If a design only works with
          placeholder copy, the design isn't finished.
        </Callout>
      </section>

      {/* ─ 11  Status Messages with Uncertain Timeframes ──────────── */}
      <section>
        <SectionHeader n="11" title="Status Messages with Uncertain Timeframes" />
        <Lead>
          When a process takes an unpredictable amount of time, the copy has to do heavy lifting.
          Vague timeframes create anxiety. Specific ones — even estimates — create trust. Always
          pair an uncertain wait with a notification promise and an informed dismissal.
        </Lead>

        <div className="grid grid-cols-2 gap-4">
          {/* Don't */}
          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
            <div className="px-5 py-3" style={{ backgroundColor: 'var(--color-error)' }}>
              <p className="font-sans text-sm font-bold" style={{ color: 'white' }}>Don't</p>
            </div>
            <div className="p-5" style={{ backgroundColor: 'var(--color-surface-2)' }}>
              <p className="font-sans text-md font-bold mb-1" style={{ color: 'var(--color-on-surface)' }}>Setup pending</p>
              <p className="font-sans text-sm font-medium mb-4" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                Your Google Cloud billing account is being processed. Processing time varies from a few moments to a few weeks.
              </p>
              <div className="inline-block px-3 py-1.5 rounded-m text-sm font-medium" style={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border)', color: 'var(--color-on-surface-subtle-1)' }}>Close</div>
            </div>
            <div className="px-5 py-4" style={{ borderTop: '1px solid var(--color-border)' }}>
              <p className="font-sans text-sm font-bold mb-2" style={{ color: 'var(--color-error)' }}>What's wrong:</p>
              <ul className="flex flex-col gap-1.5">
                {[
                  'Time range ("few moments to few weeks") spans 10 seconds to over a million seconds — communicates nothing',
                  'User anchors on the worst case ("weeks"), creating multi-week anxiety',
                  '"Close" is a dead end — no status check, no notification promise',
                  'User loses all sense of control and is left to guess and hope',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <X size={13} className="shrink-0 mt-0.5" color="var(--color-error)" />
                    <span className="font-sans text-sm font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Do */}
          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
            <div className="px-5 py-3" style={{ backgroundColor: 'var(--color-success)' }}>
              <p className="font-sans text-sm font-bold" style={{ color: 'white' }}>Do</p>
            </div>
            <div className="p-5" style={{ backgroundColor: 'var(--color-surface-2)' }}>
              <p className="font-sans text-md font-bold mb-1" style={{ color: 'var(--color-on-surface)' }}>Setting up your billing</p>
              <p className="font-sans text-sm font-medium mb-4" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                This usually takes under a minute. We'll email you at jan@example.com when it's ready.
              </p>
              <div className="inline-block px-3 py-1.5 rounded-m text-sm font-semibold" style={{ backgroundColor: 'var(--color-primary-1)', color: 'var(--color-on-primary-1)' }}>Got it</div>
            </div>
            <div className="px-5 py-4" style={{ borderTop: '1px solid var(--color-border)' }}>
              <p className="font-sans text-sm font-bold mb-2" style={{ color: 'var(--color-success)' }}>Why this works:</p>
              <ul className="flex flex-col gap-1.5">
                {[
                  'Specific timeframe ("under a minute") sets real expectations',
                  'Proactive notification removes the need to check back',
                  '"Got it" is an informed dismissal, not an anxious close',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check size={13} className="shrink-0 mt-0.5" color="var(--color-success)" />
                    <span className="font-sans text-sm font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      </div>{/* end: quality */}

    </div>
  );
}
