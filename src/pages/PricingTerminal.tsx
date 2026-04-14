/**
 * Pricing Terminal — Screen Vault v2
 *
 * The Kvalt pricing page reimagined as a terminal session.
 * Normal light-bg page, terminal window centered, animated line by line.
 * Blinking cursor, interactive CLI-styled CTAs.
 */

import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { spring, duration, ease } from '../tokens/motion';

// ─── Terminal palette ─────────────────────────────────────────────────────────
const T = {
  bg:        '#1A1C1A',
  titleBar:  '#252725',
  border:    '#2E302E',
  text:      '#B8C8B6',
  dim:       '#5A6858',
  green:     '#7DDB85',   // Kvalt brand green
  command:   '#E8EDE8',
  comment:   '#4A6050',
  certLine:  '#3A5038',
} as const;

const TRAFFIC_LIGHTS = [
  { color: '#FF5F57', label: 'close' },
  { color: '#FFBD2E', label: 'minimise' },
  { color: '#28CA41', label: 'fullscreen' },
] as const;

// ─── Content ──────────────────────────────────────────────────────────────────

const CERT = [
  '+--------------------------------------------------+',
  '|                                                   |',
  '|        FOUNDING DESIGNER CERTIFICATE              |',
  '|                                                   |',
  '|  Name:    You                                     |',
  '|  Plan:    Free. Forever.                          |',
  '|  Price:   $0/mo — no catch, no asterisks*         |',
  '|  Status:  CONFIRMED                               |',
  '|  Expires: Never                                   |',
  '|                                                   |',
  '|  All features. No limits. No tiers.               |',
  '|  No "upgrade to unlock" nonsense.                 |',
  '|                                                   |',
  '|  You believed in us before it was cool.           |',
  '|  This is our thank you.                           |',
  '|                                                   |',
  '+--------------------------------------------------+',
] as const;

type LineKind =
  | { kind: 'blank' }
  | { kind: 'command'; text: string }
  | { kind: 'checking'; label: string; value: string }
  | { kind: 'result'; text: string }
  | { kind: 'cert' }
  | { kind: 'cta'; text: string; comment: string; href?: string }
  | { kind: 'footnote'; text: string };

interface TimedLine {
  line: LineKind;
  delay: number; // ms
}

const SCRIPT: TimedLine[] = [
  { line: { kind: 'command', text: '$ kvalt --pricing' },                                  delay: 500  },
  { line: { kind: 'blank' },                                                                delay: 1050 },
  { line: { kind: 'checking', label: 'Checking subscription model...', value: 'FREE' },    delay: 1250 },
  { line: { kind: 'checking', label: 'Checking asterisks...',           value: '0' },       delay: 1580 },
  { line: { kind: 'checking', label: 'Checking expiry date...',         value: 'NONE' },    delay: 1900 },
  { line: { kind: 'checking', label: 'Checking founding status...',     value: 'CONFIRMED'},delay: 2220 },
  { line: { kind: 'blank' },                                                                delay: 2650 },
  { line: { kind: 'result', text: '> You are a Founding Designer.' },                      delay: 2900 },
  { line: { kind: 'result', text: '> This will not change.' },                             delay: 3200 },
  { line: { kind: 'blank' },                                                                delay: 3550 },
  { line: { kind: 'cert' },                                                                 delay: 3800 },
  { line: { kind: 'blank' },                                                                delay: 4100 },
  { line: { kind: 'cta',  text: '$ kvalt --discord', comment: '# Join the community' },    delay: 4350 },
  { line: { kind: 'cta',  text: '$ kvalt --browse',  comment: '# Start designing'    },    delay: 4650 },
  { line: { kind: 'blank' },                                                                delay: 4950 },
  { line: { kind: 'footnote', text: "# * That's the one asterisk. It leads to nothing." }, delay: 5150 },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function PricingTerminal() {
  const [visibleCount, setVisibleCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timers = SCRIPT.map(({ delay }, i) =>
      window.setTimeout(() => setVisibleCount(i + 1), delay)
    );
    return () => timers.forEach(window.clearTimeout);
  }, []);

  // Scroll to bottom whenever a new line appears
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleCount]);

  const isDone = visibleCount >= SCRIPT.length;

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6 py-20"
      style={{ backgroundColor: 'transparent' }}
    >
      {/* Eyebrow */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: duration.base, ease: ease.enter }}
        className="font-mono text-[11px] tracking-[3px] uppercase mb-10"
        style={{ color: 'var(--color-on-surface-subtle-2)' }}
      >
        Pricing
      </motion.p>

      {/* Terminal window */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring.default}
        className="w-[620px] rounded-lg overflow-hidden"
        style={{
          backgroundColor: T.bg,
          border: `1px solid ${T.border}`,
          boxShadow: 'var(--shadow-large-2)',
        }}
      >
        {/* Title bar */}
        <div
          className="flex items-center h-10 px-4 shrink-0"
          style={{ backgroundColor: T.titleBar, borderBottom: `1px solid ${T.border}` }}
        >
          <div className="flex gap-[7px]">
            {TRAFFIC_LIGHTS.map(({ color, label }) => (
              <div
                key={label}
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
                aria-label={label}
              />
            ))}
          </div>
          <p
            className="flex-1 text-center font-mono text-[11px]"
            style={{ color: T.dim }}
          >
            kvalt@founding-designer: ~/pricing
          </p>
          {/* Spacer to balance traffic lights */}
          <div className="w-[52px]" />
        </div>

        {/* Terminal body */}
        <div ref={scrollRef} className="px-8 py-8 font-mono text-[13px] leading-[1.7]" style={{ height: 400, overflowY: 'auto' }}>
          {SCRIPT.slice(0, visibleCount).map(({ line }, i) => {
            const isCurrentLast = i === visibleCount - 1 && !isDone;
            return (
              <TermLine
                key={i}
                line={line}
                showCursor={isCurrentLast}
              />
            );
          })}

          {/* Final blinking cursor after all lines */}
          {isDone && (
            <div className="flex items-center gap-1 mt-1">
              <span style={{ color: T.green }}>$</span>
              <span style={{ color: T.dim }}>&nbsp;</span>
              <BlinkCursor />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Line renderer ────────────────────────────────────────────────────────────

function TermLine({ line, showCursor }: { line: LineKind; showCursor: boolean }) {
  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: duration.fast, ease: ease.enter },
  } as const;

  switch (line.kind) {
    case 'blank':
      return <div className="h-[1.1em]" />;

    case 'command':
      return (
        <motion.div {...fadeIn} className="flex items-center gap-1">
          <span style={{ color: T.green }}>$</span>
          <span style={{ color: T.command }}>&nbsp;{line.text.replace(/^\$ /, '')}</span>
          {showCursor && <BlinkCursor />}
        </motion.div>
      );

    case 'checking':
      return (
        <motion.div {...fadeIn} className="flex items-baseline">
          <span style={{ color: T.text }}>{line.label}&nbsp;</span>
          <span style={{ color: T.green, fontWeight: 600 }}>{line.value}</span>
          {showCursor && <BlinkCursor />}
        </motion.div>
      );

    case 'result':
      return (
        <motion.div {...fadeIn}>
          <span style={{ color: T.green, fontWeight: 700 }}>{line.text}</span>
          {showCursor && <BlinkCursor />}
        </motion.div>
      );

    case 'cert':
      return (
        <motion.div {...fadeIn}>
          {CERT.map((row, i) => (
            <div key={i} style={{ color: T.certLine }}>
              {row}
            </div>
          ))}
          {showCursor && <BlinkCursor />}
        </motion.div>
      );

    case 'cta':
      return (
        <motion.div {...fadeIn} className="flex items-baseline gap-3">
          <CtaLine text={line.text} comment={line.comment} />
          {showCursor && <BlinkCursor />}
        </motion.div>
      );

    case 'footnote':
      return (
        <motion.div {...fadeIn}>
          <span style={{ color: T.comment }}>{line.text}</span>
          {showCursor && <BlinkCursor />}
        </motion.div>
      );
  }
}

// ─── CTA line — hoverable, pressable ─────────────────────────────────────────

function CtaLine({ text, comment }: { text: string; comment: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      className="flex items-baseline gap-4 text-left"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
    >
      <motion.span
        animate={{ color: hovered ? T.green : T.command }}
        transition={{ duration: duration.instant }}
      >
        {text}
      </motion.span>
      <span style={{ color: T.comment }}>{comment}</span>
    </button>
  );
}

// ─── Blinking cursor ──────────────────────────────────────────────────────────

function BlinkCursor() {
  return (
    <motion.span
      className="inline-block w-[7px] h-[14px] ml-[2px] translate-y-[1px]"
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{
        duration: 1,
        repeat: Infinity,
        times: [0, 0.45, 0.5, 0.95],
        ease: 'linear',
      }}
      style={{ backgroundColor: T.green }}
    />
  );
}
