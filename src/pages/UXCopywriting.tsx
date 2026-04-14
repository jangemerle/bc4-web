import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Timer,
  MoveRight,
  Layers,
  AlertTriangle,
  Target,
  MessageSquare,
  ScanLine,
  Gauge,
  ClipboardCheck,
  Check,
  X,
  RefreshCw,
  PenTool,
} from 'lucide-react';
import { spring, duration as dur, ease } from '../tokens/motion';

/* ─── Section accent colors ──────────────────────────────────────────────── */

const sectionColors = {
  fiveSecond: 'var(--color-error)',
  frontLoad: 'var(--color-primary-1)',
  progressive: 'var(--color-warning)',
  errorHier: 'var(--color-error)',
  clarity: 'var(--color-success)',
  microcopy: 'var(--color-primary-1)',
  scanning: 'var(--color-warning)',
  emotional: 'var(--color-error)',
  review: 'var(--color-success)',
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */

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

function HeroCard({
  icon: Icon,
  iconSize = 48,
  color,
  number,
  title,
  children,
}: {
  icon: React.ElementType;
  iconSize?: number;
  color: string;
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: dur.moderate, ease: ease.enter }}
    >
      {/* Icon hero area */}
      <div
        className="rounded-lg p-10 mb-8 flex items-center gap-8"
        style={{
          backgroundColor: `color-mix(in srgb, ${color} 10%, transparent)`,
        }}
      >
        <div
          className="shrink-0 w-24 h-24 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: color }}
        >
          <Icon size={iconSize} color="white" strokeWidth={1.5} />
        </div>
        <div>
          <span
            className="font-mono text-sm font-medium mb-2 inline-block"
            style={{ color, opacity: 0.8 }}
          >
            {number}
          </span>
          <h2
            className="font-display text-headline-xl font-bold"
            style={{ color: 'var(--color-on-surface)' }}
          >
            {title}
          </h2>
        </div>
      </div>
      {children}
    </motion.section>
  );
}

/* ─── 03 Progressive Disclosure Visual ───────────────────────────────────── */

function ProgressiveTiers() {
  const [expanded, setExpanded] = useState(0);

  const tiers = [
    {
      label: 'Headline',
      text: 'Your payment failed',
      desc: 'The essential fact. Most users stop here.',
      color: 'var(--color-error)',
    },
    {
      label: 'Summary',
      text: 'Your card ending in 4242 was declined by your bank.',
      desc: 'One level deeper. Enough for most to act.',
      color: 'var(--color-warning)',
    },
    {
      label: 'Detail',
      text: 'Your bank returned error code "insufficient_funds". You can update your payment method in Settings > Billing, or contact your bank directly.',
      desc: 'Full context for users who need it.',
      color: 'var(--color-primary-1)',
    },
  ];

  return (
    <div
      className="rounded-lg p-8 mb-8"
      style={{
        backgroundColor: 'var(--color-surface-1)',
        border: '1px solid var(--color-border)',
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <span
          className="font-mono text-xs font-medium px-2.5 py-1 rounded-m"
          style={{
            backgroundColor:
              'var(--color-warning-alpha-10, rgba(245,158,11,0.1))',
            color: 'var(--color-warning)',
          }}
        >
          Interactive
        </span>
        <p
          className="font-sans text-sm font-medium"
          style={{ color: 'var(--color-on-surface-subtle-1)' }}
        >
          Click tiers to reveal progressive layers
        </p>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        {tiers.map((tier, i) => {
          const visible = i <= expanded;
          return (
            <AnimatePresence key={i}>
              {visible && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: dur.base, ease: ease.enter }}
                >
                  <div
                    className="rounded-lg p-5"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${tier.color} 8%, transparent)`,
                      borderLeft: `3px solid ${tier.color}`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="font-mono text-xs font-bold px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: tier.color,
                          color: 'white',
                        }}
                      >
                        Tier {i + 1}
                      </span>
                      <span
                        className="font-mono text-xs font-medium"
                        style={{ color: tier.color }}
                      >
                        {tier.label}
                      </span>
                    </div>
                    <p
                      className="font-sans text-md font-semibold mb-1"
                      style={{ color: 'var(--color-on-surface)' }}
                    >
                      &ldquo;{tier.text}&rdquo;
                    </p>
                    <p
                      className="font-sans text-sm font-medium"
                      style={{ color: 'var(--color-on-surface-subtle-1)' }}
                    >
                      {tier.desc}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          );
        })}
      </div>

      <div className="flex gap-3">
        {['Headline only', '+ Summary', '+ Detail'].map((label, i) => (
          <motion.button
            key={label}
            onClick={() => setExpanded(i)}
            className="font-sans text-sm font-semibold px-4 py-2 rounded-m cursor-pointer"
            animate={{
              backgroundColor:
                expanded >= i
                  ? sectionColors.progressive
                  : 'var(--color-surface-2)',
              color: expanded >= i ? 'white' : 'var(--color-on-surface)',
            }}
            transition={{ duration: dur.instant, ease: ease.standard }}
            style={{
              border: `1px solid ${expanded >= i ? 'transparent' : 'var(--color-border)'}`,
            }}
          >
            {label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/* ─── 04 Error Hierarchy Example ─────────────────────────────────────────── */

function ErrorHierarchyExample() {
  return (
    <div className="grid grid-cols-2 gap-6 mb-8">
      {/* Bad example */}
      <div
        className="rounded-lg p-6 flex flex-col"
        style={{
          backgroundColor: 'var(--color-surface-1)',
          borderTop: '3px solid var(--color-error)',
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <X size={16} color="var(--color-error)" />
          <span
            className="font-sans text-sm font-bold"
            style={{ color: 'var(--color-error)' }}
          >
            Don&apos;t
          </span>
        </div>

        <div
          className="rounded-lg p-5 mb-4"
          style={{
            backgroundColor: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)',
          }}
        >
          <p
            className="font-sans text-md font-semibold mb-2"
            style={{ color: 'var(--color-on-surface)' }}
          >
            Setup pending
          </p>
          <p
            className="font-sans text-sm font-medium leading-relaxed mb-3"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            Your Google Cloud billing account is being processed. Processing
            time varies from a few moments to a few weeks.
          </p>
          <button
            className="font-sans text-sm font-semibold px-4 py-2 rounded-m cursor-default"
            style={{
              backgroundColor: 'var(--color-surface-1)',
              color: 'var(--color-on-surface)',
              border: '1px solid var(--color-border)',
            }}
          >
            Close
          </button>
        </div>

        <div className="flex flex-col gap-2 mt-auto">
          <p
            className="font-sans text-sm font-bold"
            style={{ color: 'var(--color-error)' }}
          >
            What&apos;s wrong:
          </p>
          {[
            'The time range (\u201Cfew moments to few weeks\u201D) spans from 10 seconds to over a million seconds',
            'The user\u2019s brain anchors on the worst case (\u201Cweeks\u201D), turning a potentially instant process into a multi-week anxiety event',
            '\u201CClose\u201D is a dead end \u2014 no way to check status, no notification promise',
            'The user loses all sense of control',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <X
                size={12}
                className="shrink-0 mt-1"
                color="var(--color-error)"
              />
              <p
                className="font-sans text-sm font-medium leading-snug"
                style={{ color: 'var(--color-on-surface-subtle-1)' }}
              >
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Good example */}
      <div
        className="rounded-lg p-6 flex flex-col"
        style={{
          backgroundColor: 'var(--color-surface-1)',
          borderTop: '3px solid var(--color-success)',
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Check size={16} color="var(--color-success)" />
          <span
            className="font-sans text-sm font-bold"
            style={{ color: 'var(--color-success)' }}
          >
            Do
          </span>
        </div>

        <div
          className="rounded-lg p-5 mb-4"
          style={{
            backgroundColor: 'var(--color-surface-2)',
            border: '1px solid var(--color-success)',
          }}
        >
          <p
            className="font-sans text-md font-semibold mb-2"
            style={{ color: 'var(--color-on-surface)' }}
          >
            Setting up your billing
          </p>
          <p
            className="font-sans text-sm font-medium leading-relaxed mb-3"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            This usually takes under a minute. We&apos;ll email you at
            jan@example.com when it&apos;s ready.
          </p>
          <button
            className="font-sans text-sm font-semibold px-4 py-2 rounded-m cursor-default"
            style={{ backgroundColor: 'var(--color-success)', color: 'white' }}
          >
            Got it
          </button>
        </div>

        <div className="flex flex-col gap-2 mt-auto">
          <p
            className="font-sans text-sm font-bold"
            style={{ color: 'var(--color-success)' }}
          >
            Why this works:
          </p>
          {[
            'Specific timeframe sets real expectations',
            'Proactive notification removes the need to check back',
            '\u201CGot it\u201D is an informed dismissal, not an anxious close',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <Check
                size={12}
                className="shrink-0 mt-1"
                color="var(--color-success)"
              />
              <p
                className="font-sans text-sm font-medium leading-snug"
                style={{ color: 'var(--color-on-surface-subtle-1)' }}
              >
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── 06 Microcopy Patterns Data ─────────────────────────────────────────── */

const microcopyPatterns = [
  {
    category: 'Button copy',
    rule: 'Verb + noun',
    examples: [
      { good: 'Save draft', bad: 'Submit' },
      { good: 'Delete project', bad: 'Confirm' },
      { good: 'Export report', bad: 'OK' },
    ],
  },
  {
    category: 'Confirmation',
    rule: 'Destructive: name the consequence. Reversible: skip the dialog.',
    examples: [
      {
        good: 'Delete \u201CQ3 Roadmap\u201D? This can\u2019t be undone.',
        bad: 'Are you sure?',
      },
    ],
  },
  {
    category: 'Empty state',
    rule: 'Guide, don\u2019t decorate',
    examples: [
      {
        good: 'No messages yet. Start a conversation.',
        bad: 'Nothing here.',
      },
    ],
  },
  {
    category: 'Placeholder text',
    rule: 'Show an example, not a label',
    examples: [
      { good: 'e.g. Weekly team sync', bad: 'Enter name' },
      { good: 'jan@example.com', bad: 'Email address' },
    ],
  },
];

/* ─── 07 Scanning Pattern Visual ─────────────────────────────────────────── */

function ScanningPatternDemo() {
  const [showOverlay, setShowOverlay] = useState(true);

  return (
    <div
      className="rounded-lg p-8 mb-8"
      style={{
        backgroundColor: 'var(--color-surface-1)',
        border: '1px solid var(--color-border)',
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span
            className="font-mono text-xs font-medium px-2.5 py-1 rounded-m"
            style={{
              backgroundColor:
                'var(--color-warning-alpha-10, rgba(245,158,11,0.1))',
              color: 'var(--color-warning)',
            }}
          >
            Visual
          </span>
          <p
            className="font-sans text-sm font-medium"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            F-pattern reading behavior
          </p>
        </div>
        <motion.button
          onClick={() => setShowOverlay(!showOverlay)}
          className="font-sans text-sm font-semibold px-3 py-1.5 rounded-m cursor-pointer"
          style={{
            backgroundColor: 'var(--color-surface-2)',
            color: 'var(--color-on-surface)',
            border: '1px solid var(--color-border)',
          }}
          whileHover={{ scale: 1.02 }}
          transition={spring.snappy}
        >
          {showOverlay ? 'Hide heatmap' : 'Show heatmap'}
        </motion.button>
      </div>

      <div className="relative">
        <div className="flex flex-col gap-3">
          {[
            {
              text: 'Save your changes before leaving',
              bold: 'Save your changes',
              weight: 1,
            },
            {
              text: 'All unsaved work in this project will be lost',
              bold: 'unsaved work',
              weight: 0.7,
            },
            {
              text: 'You can also enable auto-save in Settings',
              bold: 'auto-save',
              weight: 0.4,
            },
            {
              text: 'Last saved 3 minutes ago by Jan',
              bold: 'Last saved',
              weight: 0.25,
            },
          ].map((line, i) => (
            <div key={i} className="relative">
              <p
                className="font-sans text-md font-medium leading-relaxed relative z-10"
                style={{ color: 'var(--color-on-surface)' }}
              >
                {line.text.split(line.bold).map((part, j) => (
                  <span key={j}>
                    {part}
                    {j === 0 && (
                      <strong className="font-bold">{line.bold}</strong>
                    )}
                  </span>
                ))}
              </p>
              <AnimatePresence>
                {showOverlay && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.15 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: dur.base, ease: ease.enter }}
                    className="absolute inset-y-0 left-0 rounded"
                    style={{
                      width: `${line.weight * 100}%`,
                      backgroundColor: 'var(--color-error)',
                    }}
                  />
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {showOverlay && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: dur.base, ease: ease.enter }}
              className="flex items-center gap-4 mt-6 pt-4"
              style={{ borderTop: '1px solid var(--color-border)' }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-3 rounded"
                  style={{
                    backgroundColor: 'var(--color-error)',
                    opacity: 0.5,
                  }}
                />
                <span
                  className="font-sans text-xs font-medium"
                  style={{ color: 'var(--color-on-surface-subtle-1)' }}
                >
                  High attention
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-3 rounded"
                  style={{
                    backgroundColor: 'var(--color-error)',
                    opacity: 0.15,
                  }}
                />
                <span
                  className="font-sans text-xs font-medium"
                  style={{ color: 'var(--color-on-surface-subtle-1)' }}
                >
                  Low attention
                </span>
              </div>
              <span
                className="font-sans text-xs font-medium"
                style={{ color: 'var(--color-on-surface-subtle-2)' }}
              >
                Users scan the top-left corner most heavily
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── 08 Emotional Calibration Data ──────────────────────────────────────── */

const emotionalMoments = [
  {
    moment: 'Achievement',
    emotion: 'Celebration',
    example: 'Your first project is live.',
    tone: 'Warm, brief, earned.',
    intensity: 5,
    color: 'var(--color-success)',
  },
  {
    moment: 'Completion',
    emotion: 'Calm satisfaction',
    example: 'All changes saved.',
    tone: 'Neutral, factual.',
    intensity: 3,
    color: 'var(--color-primary-1)',
  },
  {
    moment: 'Routine action',
    emotion: 'Invisible',
    example: 'Saved.',
    tone: 'Minimal. No fanfare.',
    intensity: 1,
    color: 'var(--color-on-surface-subtle-1)',
  },
  {
    moment: 'Error',
    emotion: 'Calm clarity',
    example: 'That file is too large. Try one under 10 MB.',
    tone: 'Direct, helpful, zero blame.',
    intensity: 3,
    color: 'var(--color-warning)',
  },
  {
    moment: 'Destructive action',
    emotion: 'Measured gravity',
    example: 'This will permanently delete 14 files.',
    tone: 'Factual, specific, no drama.',
    intensity: 4,
    color: 'var(--color-error)',
  },
];

/* ─── 09 Copy Review Checklist ───────────────────────────────────────────── */

function CopyReviewChecklist() {
  const checks = [
    {
      q: 'Can a user understand this in under 5 seconds?',
      section: 'The 5-Second Rule',
    },
    {
      q: 'Does the most important information come first?',
      section: 'Front-Loading',
    },
    {
      q: 'Is information layered (headline > summary > detail)?',
      section: 'Progressive Disclosure',
    },
    {
      q: 'Do errors say what happened, why, and how to fix it?',
      section: 'Error Hierarchy',
    },
    {
      q: 'Is clarity prioritised over cleverness?',
      section: 'Clarity Over Cleverness',
    },
    {
      q: 'Do buttons use verb + noun format?',
      section: 'Microcopy Patterns',
    },
    {
      q: 'Is critical info at the start of each line?',
      section: 'Scanning Patterns',
    },
    {
      q: 'Does the emotional weight match the moment?',
      section: 'Emotional Calibration',
    },
    {
      q: 'Is active voice used throughout?',
      section: 'General',
    },
    {
      q: 'Could any word be removed without losing meaning?',
      section: 'General',
    },
  ];

  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const score = Object.values(checked).filter(Boolean).length;
  const toggle = (i: number) =>
    setChecked((prev) => ({ ...prev, [i]: !prev[i] }));

  const scoreColor =
    score === checks.length
      ? 'var(--color-success)'
      : score >= 7
        ? 'var(--color-warning)'
        : 'var(--color-on-surface-subtle-1)';

  const scoreLabel =
    score === checks.length
      ? 'Ship it.'
      : score >= 7
        ? 'Almost there.'
        : score >= 4
          ? 'Getting closer.'
          : 'Keep working.';

  return (
    <div
      className="rounded-lg p-8"
      style={{
        backgroundColor: 'var(--color-surface-1)',
        border: '1px solid var(--color-border)',
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <span
          className="font-mono text-xs font-medium px-2.5 py-1 rounded-m"
          style={{
            backgroundColor:
              'var(--color-success-alpha-10, rgba(34,197,94,0.1))',
            color: 'var(--color-success)',
          }}
        >
          Interactive
        </span>
        <p
          className="font-sans text-md font-semibold"
          style={{ color: 'var(--color-on-surface)' }}
        >
          Run your copy through this checklist before shipping
        </p>
      </div>

      <div className="flex flex-col gap-2 mb-6">
        {checks.map((c, i) => {
          const isChecked = !!checked[i];
          return (
            <motion.button
              key={i}
              onClick={() => toggle(i)}
              className="flex items-center gap-3 p-4 rounded-lg text-left cursor-pointer w-full"
              animate={{
                backgroundColor: isChecked
                  ? 'var(--color-success-alpha-10, rgba(34,197,94,0.08))'
                  : 'var(--color-surface-2)',
              }}
              transition={{ duration: dur.instant, ease: ease.standard }}
              style={{ border: '1px solid var(--color-border)' }}
            >
              <motion.div
                className="shrink-0 w-5 h-5 rounded flex items-center justify-center"
                animate={{
                  backgroundColor: isChecked
                    ? 'var(--color-success)'
                    : 'transparent',
                  borderColor: isChecked
                    ? 'transparent'
                    : 'var(--color-border)',
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

              <div className="flex-1 flex items-center justify-between">
                <p
                  className="font-sans text-md font-semibold leading-snug"
                  style={{
                    color: isChecked
                      ? 'var(--color-success)'
                      : 'var(--color-on-surface)',
                    textDecoration: isChecked ? 'line-through' : 'none',
                    opacity: isChecked ? 0.7 : 1,
                  }}
                >
                  {c.q}
                </p>
                <span
                  className="font-mono text-xs font-medium px-2 py-0.5 rounded shrink-0 ml-3"
                  style={{
                    backgroundColor: 'var(--color-surface-1)',
                    color: 'var(--color-on-surface-subtle-2)',
                  }}
                >
                  {c.section}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Score bar */}
      <motion.div
        className="flex items-center justify-between p-4 rounded-lg"
        animate={{ backgroundColor: `${scoreColor}15` }}
        transition={{ duration: dur.base, ease: ease.standard }}
        style={{ border: `1px solid ${scoreColor}40` }}
      >
        <div className="flex items-center gap-4">
          <div>
            <p
              className="font-sans text-md font-bold"
              style={{ color: scoreColor }}
            >
              {score} / {checks.length}
            </p>
            <p
              className="font-sans text-sm font-medium"
              style={{ color: 'var(--color-on-surface-subtle-1)' }}
            >
              {scoreLabel}
            </p>
          </div>
          <div
            className="w-32 h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: 'var(--color-surface-2)' }}
          >
            <motion.div
              className="h-full rounded-full"
              animate={{ width: `${(score / checks.length) * 100}%` }}
              transition={{ ...spring.default }}
              style={{ backgroundColor: scoreColor }}
            />
          </div>
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
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export type UXCopywritingSectionKey = 'frameworks' | 'writing' | 'calibration';

interface UXCopywritingProps {
  sectionRefs?: Partial<Record<UXCopywritingSectionKey, (el: HTMLDivElement | null) => void>>;
}

export default function UXCopywriting({ sectionRefs }: UXCopywritingProps = {}) {
  return (
    <div className="space-y-24">

      {/* ══ FRAMEWORKS ═══════════════════════════════════════════════════════ */}
      <div ref={sectionRefs?.frameworks} className="scroll-mt-8 space-y-24">
        <div className="mb-4">
          <h2
            className="font-brand font-bold leading-[0.95]"
            style={{ fontSize: 'clamp(56px, 7vw, 104px)', color: 'var(--color-on-surface)' }}
          >
            FRAMEWORKS
          </h2>
        </div>

      {/* ─ Hero ─────────────────────────────────────────────────────── */}
      <section>
        <div
          className="font-mono text-sm font-medium inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6"
          style={{
            backgroundColor: 'var(--color-primary-1-alpha-10)',
            color: 'var(--color-primary-1)',
          }}
        >
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: 'var(--color-primary-1)' }}
          />
          Copywriting
        </div>

        <h1
          className="font-display text-headline-2xl font-bold mb-6"
          style={{ color: 'var(--color-on-surface)' }}
        >
          Words that{' '}
          <span style={{ color: 'var(--color-primary-1)' }}>work</span>
        </h1>
        <p
          className="font-sans text-lg font-medium max-w-[640px] leading-relaxed mb-10"
          style={{ color: 'var(--color-on-surface-subtle-1)' }}
        >
          UX copywriting isn&apos;t decoration, it&apos;s design material. Every
          label, error, tooltip, and empty state is a micro-decision that either
          helps the user move forward or makes them stop and think. These nine
          frameworks will make your copy as intentional as your layout.
        </p>

        {/* Hero visual — three pillars */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              icon: PenTool,
              label: 'Intentional',
              desc: 'Every word earns its place',
              color: 'var(--color-primary-1)',
            },
            {
              icon: Target,
              label: 'Actionable',
              desc: 'Copy that drives behavior',
              color: 'var(--color-success)',
            },
            {
              icon: Gauge,
              label: 'Calibrated',
              desc: 'Tone matches the moment',
              color: 'var(--color-warning)',
            },
          ].map(({ icon: Icon, label, desc, color }) => (
            <motion.div
              key={label}
              className="rounded-lg p-6 flex flex-col items-center text-center"
              style={{
                backgroundColor: `color-mix(in srgb, ${color} 8%, transparent)`,
              }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: dur.base, ease: ease.enter }}
            >
              <div
                className="w-16 h-16 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: color }}
              >
                <Icon size={32} color="white" strokeWidth={1.5} />
              </div>
              <p
                className="font-sans text-md font-bold mb-1"
                style={{ color: 'var(--color-on-surface)' }}
              >
                {label}
              </p>
              <p
                className="font-sans text-sm font-medium"
                style={{ color: 'var(--color-on-surface-subtle-1)' }}
              >
                {desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─ 01 The 5-Second Rule ─────────────────────────────────────── */}
      <HeroCard
        icon={Timer}
        color={sectionColors.fiveSecond}
        number="01"
        title="The 5-Second Rule"
      >
        <Lead>
          If it takes longer to read than to act, rewrite it. Users scan, they
          don&apos;t read. Every word competes for the 5 seconds you get.
        </Lead>

        <div className="grid grid-cols-2 gap-6">
          <div
            className="rounded-lg p-6"
            style={{
              backgroundColor: 'var(--color-surface-1)',
              borderTop: '3px solid var(--color-error)',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <X size={16} color="var(--color-error)" />
              <span
                className="font-sans text-sm font-bold"
                style={{ color: 'var(--color-error)' }}
              >
                Too slow
              </span>
            </div>
            <p
              className="font-sans text-md font-medium leading-relaxed"
              style={{ color: 'var(--color-on-surface-subtle-1)' }}
            >
              &ldquo;In order to complete the process of resetting your password,
              please navigate to the email that was sent to the address
              associated with your account and follow the instructions provided
              therein.&rdquo;
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Timer size={14} color="var(--color-error)" />
              <span
                className="font-mono text-xs font-medium"
                style={{ color: 'var(--color-error)' }}
              >
                ~12 seconds to parse
              </span>
            </div>
          </div>

          <div
            className="rounded-lg p-6"
            style={{
              backgroundColor: 'var(--color-surface-1)',
              borderTop: '3px solid var(--color-success)',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Check size={16} color="var(--color-success)" />
              <span
                className="font-sans text-sm font-bold"
                style={{ color: 'var(--color-success)' }}
              >
                Under 5 seconds
              </span>
            </div>
            <p
              className="font-sans text-md font-semibold leading-relaxed"
              style={{ color: 'var(--color-on-surface)' }}
            >
              &ldquo;Check your email for a reset link.&rdquo;
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Timer size={14} color="var(--color-success)" />
              <span
                className="font-mono text-xs font-medium"
                style={{ color: 'var(--color-success)' }}
              >
                ~2 seconds to parse
              </span>
            </div>
          </div>
        </div>

        <div
          className="rounded-lg p-6 mt-6"
          style={{
            backgroundColor: 'var(--color-surface-1)',
            borderLeft: '3px solid var(--color-error)',
          }}
        >
          <p
            className="font-sans text-md font-bold mb-2"
            style={{ color: 'var(--color-error)' }}
          >
            The test
          </p>
          <p
            className="font-sans text-md font-medium leading-relaxed"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            Read your copy aloud. If you run out of breath before you finish,
            it&apos;s too long. Count the words. If there are more than 15, ask
            which ones are earning their place. The user is mid-task, not reading
            for pleasure.
          </p>
        </div>
      </HeroCard>

      {/* ─ 02 Front-Loading ─────────────────────────────────────────── */}
      <HeroCard
        icon={MoveRight}
        color={sectionColors.frontLoad}
        number="02"
        title="Front-Loading"
      >
        <Lead>
          Lead with the outcome, not the context. Put the most important
          information first. The user shouldn&apos;t have to read the whole
          sentence to find the point.
        </Lead>

        <div className="flex flex-col gap-4 mb-8">
          {[
            {
              bad: 'After processing your request, we\u2019ve confirmed that the project was saved.',
              good: 'Your project was saved.',
              why: 'Outcome first. Context is noise.',
            },
            {
              bad: 'To change your display name, go to Settings, then Account, then click Edit profile.',
              good: 'Settings > Account > Edit profile to change your display name.',
              why: 'Path first. The user needs the instruction, not the reason.',
            },
            {
              bad: 'Due to a recent update in our terms of service, your account requires verification.',
              good: 'Verify your account to continue. Our terms were updated.',
              why: 'Action first. Explanation second.',
            },
          ].map((ex, i) => (
            <div
              key={i}
              className="rounded-lg p-6 grid grid-cols-[1fr_1fr_1fr] gap-6 items-start"
              style={{
                backgroundColor: 'var(--color-surface-1)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div>
                <span
                  className="font-mono text-xs font-medium mb-2 inline-block"
                  style={{ color: 'var(--color-error)' }}
                >
                  Context first
                </span>
                <p
                  className="font-sans text-md font-medium leading-relaxed line-through"
                  style={{
                    color: 'var(--color-on-surface-subtle-1)',
                    opacity: 0.7,
                  }}
                >
                  {ex.bad}
                </p>
              </div>
              <div>
                <span
                  className="font-mono text-xs font-medium mb-2 inline-block"
                  style={{ color: 'var(--color-success)' }}
                >
                  Outcome first
                </span>
                <p
                  className="font-sans text-md font-semibold leading-relaxed"
                  style={{ color: 'var(--color-on-surface)' }}
                >
                  {ex.good}
                </p>
              </div>
              <div>
                <span
                  className="font-mono text-xs font-medium mb-2 inline-block"
                  style={{ color: 'var(--color-primary-1)' }}
                >
                  Why
                </span>
                <p
                  className="font-sans text-sm font-medium leading-relaxed"
                  style={{ color: 'var(--color-on-surface-subtle-1)' }}
                >
                  {ex.why}
                </p>
              </div>
            </div>
          ))}
        </div>
      </HeroCard>

      {/* ─ 03 Progressive Disclosure ─────────────────────────────────── */}
      <HeroCard
        icon={Layers}
        color={sectionColors.progressive}
        number="03"
        title="Progressive Disclosure in Copy"
      >
        <Lead>
          Headline, then summary, then detail. Don&apos;t dump everything at
          once. Layer information so users can stop reading the moment they have
          enough.
        </Lead>

        <ProgressiveTiers />

        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: 'Tier 1: Headline',
              desc: 'The essential fact in under 8 words. 80% of users stop here.',
              color: 'var(--color-error)',
            },
            {
              label: 'Tier 2: Summary',
              desc: 'One sentence of context. Enough for most users to act.',
              color: 'var(--color-warning)',
            },
            {
              label: 'Tier 3: Detail',
              desc: 'Full explanation for power users or edge cases.',
              color: 'var(--color-primary-1)',
            },
          ].map(({ label, desc, color }) => (
            <div
              key={label}
              className="rounded-lg p-5"
              style={{
                backgroundColor: `color-mix(in srgb, ${color} 8%, transparent)`,
                borderLeft: `3px solid ${color}`,
              }}
            >
              <p
                className="font-sans text-sm font-bold mb-1"
                style={{ color }}
              >
                {label}
              </p>
              <p
                className="font-sans text-sm font-medium leading-relaxed"
                style={{ color: 'var(--color-on-surface-subtle-1)' }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </HeroCard>

      {/* ─ 04 Error Hierarchy ────────────────────────────────────────── */}
      <HeroCard
        icon={AlertTriangle}
        color={sectionColors.errorHier}
        number="04"
        title="Error Hierarchy"
      >
        <Lead>
          What happened, then why, then how to fix it &mdash; in that order.
          Every error message is three sentences at most. If you need more, your
          error is actually a help article.
        </Lead>

        {/* The formula */}
        <div
          className="rounded-lg p-6 mb-8 flex items-center gap-4 flex-wrap"
          style={{
            backgroundColor: 'var(--color-surface-1)',
            border: '1px solid var(--color-border)',
          }}
        >
          {['What happened', 'Why', 'How to fix it'].map((step, i) => (
            <div key={step} className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <span
                  className="font-mono text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: 'var(--color-error)',
                    color: 'white',
                  }}
                >
                  {i + 1}
                </span>
                <span
                  className="font-sans text-md font-semibold"
                  style={{ color: 'var(--color-on-surface)' }}
                >
                  {step}
                </span>
              </div>
              {i < 2 && (
                <MoveRight
                  size={16}
                  color="var(--color-on-surface-subtle-2)"
                />
              )}
            </div>
          ))}
        </div>

        <h3
          className="font-display text-headline-s font-bold mb-4"
          style={{ color: 'var(--color-on-surface)' }}
        >
          Pattern: Status Messages with Uncertain Timeframes
        </h3>

        <ErrorHierarchyExample />
      </HeroCard>

      </div>{/* end: frameworks */}

      {/* ══ WRITING ══════════════════════════════════════════════════════════ */}
      <div ref={sectionRefs?.writing} className="scroll-mt-8 space-y-24">
        <div className="mb-4">
          <h2
            className="font-brand font-bold leading-[0.95]"
            style={{ fontSize: 'clamp(56px, 7vw, 104px)', color: 'var(--color-on-surface)' }}
          >
            WRITING
          </h2>
        </div>

      {/* ─ 05 Clarity Over Cleverness ─────────────────────────────────── */}
      <HeroCard
        icon={Target}
        color={sectionColors.clarity}
        number="05"
        title="Clarity Over Cleverness"
      >
        <Lead>
          Every word earns its place. Don&apos;t add humor, personality, or
          creativity at the cost of comprehension. Be witty in marketing, be
          clear in UI.
        </Lead>

        <div className="grid grid-cols-2 gap-6 mb-8">
          {[
            {
              label: 'Marketing site',
              verdict: 'Personality welcome',
              text: 'Design systems that feel alive.',
              color: 'var(--color-success)',
              note: 'Brand pages, landing pages, blog posts. Users are browsing, not executing.',
            },
            {
              label: 'Product UI',
              verdict: 'Clarity required',
              text: 'Create a new design system.',
              color: 'var(--color-primary-1)',
              note: 'Modals, forms, buttons, errors. Users are mid-task. Don\u2019t make them decode your tone.',
            },
          ].map(({ label, verdict, text, color, note }) => (
            <div
              key={label}
              className="rounded-lg overflow-hidden"
              style={{ border: '1px solid var(--color-border)' }}
            >
              <div className="p-4" style={{ backgroundColor: color }}>
                <p
                  className="font-mono text-xs font-bold mb-1"
                  style={{ color: 'white', opacity: 0.8 }}
                >
                  {label}
                </p>
                <p
                  className="font-sans text-md font-bold"
                  style={{ color: 'white' }}
                >
                  {verdict}
                </p>
              </div>
              <div
                className="p-6"
                style={{ backgroundColor: 'var(--color-surface-1)' }}
              >
                <p
                  className="font-sans text-md font-semibold mb-3"
                  style={{ color: 'var(--color-on-surface)' }}
                >
                  &ldquo;{text}&rdquo;
                </p>
                <p
                  className="font-sans text-sm font-medium leading-relaxed"
                  style={{ color: 'var(--color-on-surface-subtle-1)' }}
                >
                  {note}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="rounded-lg p-6"
          style={{
            backgroundColor: 'var(--color-surface-1)',
            borderLeft: '3px solid var(--color-success)',
          }}
        >
          <p
            className="font-sans text-md font-bold mb-2"
            style={{ color: 'var(--color-success)' }}
          >
            The litmus test
          </p>
          <p
            className="font-sans text-md font-medium leading-relaxed"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            Replace your clever copy with the most boring, literal version. If
            the boring version communicates faster, keep it. Cleverness that
            slows comprehension is a design defect, not a feature.
          </p>
        </div>
      </HeroCard>

      {/* ─ 06 Microcopy Patterns ──────────────────────────────────────── */}
      <HeroCard
        icon={MessageSquare}
        color={sectionColors.microcopy}
        number="06"
        title="Microcopy Patterns"
      >
        <Lead>
          Button copy: verb + noun. Confirmations: name the consequence. Empty
          states: guide, don&apos;t decorate. Placeholders: show an example, not
          a label.
        </Lead>

        <div className="flex flex-col gap-4">
          {microcopyPatterns.map((pattern) => (
            <div
              key={pattern.category}
              className="rounded-lg p-6"
              style={{
                backgroundColor: 'var(--color-surface-1)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="font-mono text-xs font-bold px-2.5 py-1 rounded-m"
                  style={{
                    backgroundColor: 'var(--color-primary-1)',
                    color: 'white',
                  }}
                >
                  {pattern.category}
                </span>
                <span
                  className="font-sans text-sm font-medium"
                  style={{ color: 'var(--color-on-surface-subtle-1)' }}
                >
                  {pattern.rule}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {pattern.examples.map((ex, i) => (
                  <div
                    key={i}
                    className="rounded-lg p-4 flex items-start gap-4"
                    style={{ backgroundColor: 'var(--color-surface-2)' }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Check size={12} color="var(--color-success)" />
                        <span
                          className="font-mono text-xs font-medium"
                          style={{ color: 'var(--color-success)' }}
                        >
                          Do
                        </span>
                      </div>
                      <p
                        className="font-sans text-sm font-semibold"
                        style={{ color: 'var(--color-on-surface)' }}
                      >
                        {ex.good}
                      </p>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <X size={12} color="var(--color-error)" />
                        <span
                          className="font-mono text-xs font-medium"
                          style={{ color: 'var(--color-error)' }}
                        >
                          Don&apos;t
                        </span>
                      </div>
                      <p
                        className="font-sans text-sm font-medium line-through"
                        style={{
                          color: 'var(--color-on-surface-subtle-1)',
                          opacity: 0.7,
                        }}
                      >
                        {ex.bad}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </HeroCard>

      {/* ─ 07 Scanning Patterns ──────────────────────────────────────── */}
      <HeroCard
        icon={ScanLine}
        color={sectionColors.scanning}
        number="07"
        title="Scanning Patterns"
      >
        <Lead>
          Users read in F-patterns. Put critical info at the start of lines.
          Bold the action word. Use whitespace as punctuation.
        </Lead>

        <ScanningPatternDemo />

        <div className="grid grid-cols-3 gap-4">
          {[
            {
              title: 'Front-load key words',
              desc: 'The first 2\u20133 words of every line get the most attention. Make them count.',
            },
            {
              title: 'Bold the action',
              desc: 'If a sentence contains an instruction, bold the verb. It becomes an anchor for scanning.',
            },
            {
              title: 'Whitespace is punctuation',
              desc: 'Dense text blocks are skipped entirely. Break content into short, scannable chunks.',
            },
          ].map(({ title, desc }) => (
            <div
              key={title}
              className="rounded-lg p-5"
              style={{
                backgroundColor: 'var(--color-surface-1)',
                border: '1px solid var(--color-border)',
              }}
            >
              <p
                className="font-sans text-sm font-bold mb-2"
                style={{ color: 'var(--color-on-surface)' }}
              >
                {title}
              </p>
              <p
                className="font-sans text-sm font-medium leading-relaxed"
                style={{ color: 'var(--color-on-surface-subtle-1)' }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </HeroCard>

      </div>{/* end: writing */}

      {/* ══ CALIBRATION ══════════════════════════════════════════════════════ */}
      <div ref={sectionRefs?.calibration} className="scroll-mt-8 space-y-24">
        <div className="mb-4">
          <h2
            className="font-brand font-bold leading-[0.95]"
            style={{ fontSize: 'clamp(56px, 7vw, 104px)', color: 'var(--color-on-surface)' }}
          >
            CALIBRATION
          </h2>
        </div>

      {/* ─ 08 Emotional Calibration ──────────────────────────────────── */}
      <HeroCard
        icon={Gauge}
        color={sectionColors.emotional}
        number="08"
        title="Emotional Calibration"
      >
        <Lead>
          Match the emotional weight of the copy to the moment. Celebration for
          achievements, calm for errors, neutral for routine. Never celebrate
          what the user didn&apos;t ask for.
        </Lead>

        <div className="flex flex-col gap-3 mb-8">
          {emotionalMoments.map((m) => (
            <div
              key={m.moment}
              className="rounded-lg p-5 grid grid-cols-[140px_140px_1fr_1fr] gap-6 items-center"
              style={{
                backgroundColor: 'var(--color-surface-1)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div>
                <span
                  className="font-mono text-xs font-bold px-2 py-0.5 rounded"
                  style={{ backgroundColor: m.color, color: 'white' }}
                >
                  {m.moment}
                </span>
              </div>
              <p
                className="font-sans text-sm font-medium"
                style={{ color: 'var(--color-on-surface-subtle-1)' }}
              >
                {m.emotion}
              </p>
              <p
                className="font-sans text-md font-semibold"
                style={{ color: 'var(--color-on-surface)' }}
              >
                &ldquo;{m.example}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="flex-1 h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: 'var(--color-surface-2)' }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(m.intensity / 5) * 100}%`,
                      backgroundColor: m.color,
                    }}
                  />
                </div>
                <span
                  className="font-sans text-sm font-medium"
                  style={{ color: 'var(--color-on-surface-subtle-1)' }}
                >
                  {m.tone}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div
          className="rounded-lg p-6"
          style={{
            backgroundColor: 'var(--color-surface-1)',
            borderLeft: '3px solid var(--color-error)',
          }}
        >
          <p
            className="font-sans text-md font-bold mb-2"
            style={{ color: 'var(--color-error)' }}
          >
            The anti-pattern
          </p>
          <p
            className="font-sans text-md font-medium leading-relaxed"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            Never celebrate what the user didn&apos;t ask for. &ldquo;Your
            password has been updated!&rdquo; with confetti is emotionally
            tone-deaf. The user just fixed a security concern &mdash; they want
            reassurance, not a party. Match the weight of the moment.
          </p>
        </div>
      </HeroCard>

      {/* ─ 09 Copy Review Framework ──────────────────────────────────── */}
      <HeroCard
        icon={ClipboardCheck}
        color={sectionColors.review}
        number="09"
        title="Copy Review Framework"
      >
        <Lead>
          All nine principles combined into a single interactive checklist. Run
          your copy through these questions before it ships. Aim for 10/10.
        </Lead>

        <CopyReviewChecklist />
      </HeroCard>

      </div>{/* end: calibration */}

    </div>
  );
}