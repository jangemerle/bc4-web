import { useState, useCallback, useRef, useId } from 'react';
import { motion, AnimatePresence, useInView, animate, useMotionValue, useTransform } from 'motion/react';
import {
  Sparkles, Zap, Play, RotateCcw,
  Check, X, Inbox, Star, Trash2,
  ChevronDown, Settings, ArrowRight,
  Sliders, BookOpen,
  Rocket, Heart, Bell, Mail, Search,
  Shield, Wifi, Cloud, Compass, Feather,
  Lightbulb, Music,
} from 'lucide-react';
import { usePress } from '../../hooks/usePress';
import { useSectionNav } from '../../hooks/useSectionNav';
import { spring, ease, MOTION_SPEED } from '../../tokens/motion';
import { shadows } from '../../tokens/shadows';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { AnimatedIcon } from '../../components/AnimatedIcon';
import { FloatingSectionNav } from '../../components/FloatingSectionNav';
import { ContentSwitcher, ContentSwitcherItem } from '../../components/ContentSwitcher';
import { PageHero } from '../../layouts/PageHero';
import { Section } from '../../layouts/Section';
import { TokenTable } from '../../layouts/TokenTable';
import { CodeBlock } from '../../layouts/CodeBlock';
import { DosDonts } from '../../layouts/DosDonts';
import { CardGrid } from '../../layouts/CardGrid';

/* ─── Reveal-on-scroll wrapper ───────────────────────────────────────────── */

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ ...spring.default, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Giant animated word ────────────────────────────────────────────────── */


/* ─── Live spring playground ─────────────────────────────────────────────── */

function SpringPlayground() {
  const [active, setActive] = useState<'snappy' | 'default' | 'playful'>('default');
  const springs = {
    snappy: spring.snappy,
    default: spring.default,
    playful: spring.playful,
  };
  const descriptions = {
    snappy: 'Zero bounce. Crisp. Press feedback, dropdowns, tooltips.',
    default: 'Hint of life. Panels, modals, sidebars, tab indicators.',
    playful: 'Visible overshoot. Success states, toasts, celebrations.',
  };

  return (
    <div className="rounded-lg p-8" style={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}>
      <div className="mb-8">
        <ContentSwitcher value={active} onChange={(v) => setActive(v as typeof active)} size="sm">
          <ContentSwitcherItem value="snappy">snappy</ContentSwitcherItem>
          <ContentSwitcherItem value="default">default</ContentSwitcherItem>
          <ContentSwitcherItem value="playful">playful</ContentSwitcherItem>
        </ContentSwitcher>
      </div>

      {/* Animated ball */}
      <div className="relative h-24 rounded-lg mb-6" style={{ backgroundColor: 'var(--color-bg)' }}>
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-14 h-14 rounded-full"
          style={{ backgroundColor: 'var(--color-primary-1)' }}
          animate={{ x: active === 'snappy' ? 20 : active === 'playful' ? 'calc(100% - 76px)' : 'calc(50% - 28px)' }}
          transition={springs[active]}
          key={active}
        />
      </div>

      <p className="font-sans text-sm font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
        <span className="font-mono font-bold" style={{ color: 'var(--color-primary-1)' }}>spring.{active}</span>
        {' — '}{descriptions[active]}
      </p>
      <pre className="font-mono text-xs mt-3 p-3 rounded-md" style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-on-surface-subtle-1)' }}>
        {`{ type: 'spring', visualDuration: ${springs[active].visualDuration}, bounce: ${springs[active].bounce} }`}
      </pre>
    </div>
  );
}

/* ─── Duration race ──────────────────────────────────────────────────────── */

function DurationRace() {
  const [running, setRunning] = useState(false);
  const durations = [
    { token: 'instant', ms: 100, color: '#6366f1' },
    { token: 'fast', ms: 160, color: '#06b6d4' },
    { token: 'base', ms: 240, color: '#10b981' },
    { token: 'moderate', ms: 340, color: '#f59e0b' },
    { token: 'slow', ms: 480, color: '#ef4444' },
  ];

  return (
    <div className="rounded-lg p-8" style={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}>
      <div className="flex items-center gap-4 mb-8">
        <Button variant="primary" iconLeft={running ? RotateCcw : Play} onClick={() => setRunning(!running)}>
          {running ? 'Reset' : 'Race'}
        </Button>
        <span className="font-sans text-sm" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
          Watch how each duration feels
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {durations.map((d) => (
          <div key={d.token} className="flex items-center gap-4">
            <span className="font-mono text-xs w-24 text-right shrink-0" style={{ color: d.color }}>
              {d.token}
            </span>
            <span className="font-mono text-xs w-12 shrink-0" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
              {d.ms}ms
            </span>
            <div className="flex-1 h-8 rounded-md relative overflow-hidden" style={{ backgroundColor: 'var(--color-surface-2)' }}>
              <motion.div
                className="absolute inset-y-0 left-0 rounded-md"
                style={{ backgroundColor: d.color }}
                initial={{ width: '0%' }}
                animate={{ width: running ? '100%' : '0%' }}
                transition={{ duration: d.ms / 1000, ease: [0, 0, 0.2, 1] }}
                key={running ? 'go' : 'stop'}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Semantic token cards ───────────────────────────────────────────────── */

function SemanticDemo() {
  const tokens = [
    { name: 'feedback', recipe: 'snappy spring', desc: 'Button press, checkbox, toggle', icon: Zap, color: 'var(--color-primary-1)' },
    { name: 'reveal', recipe: 'ease.enter + default', desc: 'Tooltip, popover, dropdown', icon: Sparkles, color: '#06b6d4' },
    { name: 'dismiss', recipe: 'ease.exit + snappy', desc: 'Closing, removing, hiding', icon: X, color: '#f59e0b' },
    { name: 'expand', recipe: 'default spring', desc: 'Accordion, drawer, sidebar', icon: ChevronDown, color: '#8b5cf6' },
    { name: 'celebrate', recipe: 'playful spring', desc: 'Success, achievement', icon: Star, color: '#10b981' },
  ];

  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
      {tokens.map((t) => {
        const isActive = active === t.name;
        return (
          <motion.button
            key={t.name}
            className="rounded-lg p-5 text-left cursor-pointer"
            style={{
              backgroundColor: isActive ? t.color : 'var(--color-surface-1)',
              border: '1px solid ' + (isActive ? 'transparent' : 'var(--color-border)'),
            }}
            onClick={() => setActive(isActive ? null : t.name)}
            whileHover={{ scale: 1.02 }}
            transition={spring.snappy}
          >
            <Icon icon={t.icon} size="md" style={{ color: isActive ? 'white' : t.color, marginBottom: 8 }} />
            <p className="font-mono text-xs font-bold mb-1" style={{ color: isActive ? 'white' : t.color }}>
              {t.name}
            </p>
            <p className="font-sans text-xs" style={{ color: isActive ? 'rgba(255,255,255,0.7)' : 'var(--color-on-surface-subtle-2)' }}>
              {t.desc}
            </p>
          </motion.button>
        );
      })}
    </div>
  );
}

/* ─── usePress live demo ─────────────────────────────────────────────────── */

function PressDemoBlock() {
  const { isPressed: goodPressed, pressHandlers: goodH } = usePress({});
  const [badPressed, setBadPressed] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Good — usePress */}
      <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}>
        <p className="font-sans text-sm font-bold mb-1" style={{ color: 'var(--color-success-1)' }}>usePress — 120ms minimum</p>
        <p className="font-sans text-xs mb-5" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
          Try fast tapping on a trackpad. The scale animation is always visible.
        </p>
        <motion.button
          className="font-sans text-sm font-bold px-6 py-3 rounded-xl cursor-pointer w-full"
          style={{ backgroundColor: 'var(--color-primary-1)', color: 'var(--color-on-primary)' }}
          animate={{ scale: goodPressed ? 0.94 : 1 }}
          transition={spring.snappy}
          {...goodH}
        >
          {goodPressed ? 'Pressed ✓' : 'Press me'}
        </motion.button>
      </div>

      {/* Bad — whileTap */}
      <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}>
        <p className="font-sans text-sm font-bold mb-1" style={{ color: 'var(--color-danger-1)' }}>whileTap — no minimum</p>
        <p className="font-sans text-xs mb-5" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
          Fast taps on trackpad exit in ~10ms. Animation is invisible.
        </p>
        <motion.button
          className="font-sans text-sm font-bold px-6 py-3 rounded-xl cursor-pointer w-full"
          style={{ backgroundColor: 'var(--color-surface-3)', color: 'var(--color-on-surface)' }}
          whileTap={{ scale: 0.94 }}
          transition={spring.snappy}
          onPointerDown={() => setBadPressed(true)}
          onPointerUp={() => setBadPressed(false)}
        >
          {badPressed ? 'Pressed ✓' : 'Press me'}
        </motion.button>
      </div>
    </div>
  );
}

/* ─── Choreography demo — stagger ────────────────────────────────────────── */

function StaggerDemo() {
  const [show, setShow] = useState(false);
  const items = ['Inbox', 'Starred', 'Sent', 'Drafts', 'Trash'];
  const icons = [Inbox, Star, ArrowRight, Settings, Trash2];

  return (
    <div className="rounded-lg p-8" style={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="primary" iconLeft={show ? RotateCcw : Play} onClick={() => setShow(!show)}>
          {show ? 'Reset' : 'Play stagger'}
        </Button>
        <span className="font-mono text-xs" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
          50ms between items · exit before enter
        </span>
      </div>

      <div className="relative rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--color-bg)', minHeight: 220 }}>
        <AnimatePresence>
          {show && (
            <motion.div className="p-4 flex flex-col gap-1">
              {items.map((item, i) => (
                <motion.div
                  key={item}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg"
                  style={{ backgroundColor: 'var(--color-surface-1)' }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ ...spring.default, delay: i * 0.05 }}
                >
                  <Icon icon={icons[i]} size="sm" style={{ color: 'var(--color-on-surface-subtle-1)' }} />
                  <span className="font-sans text-sm font-medium" style={{ color: 'var(--color-on-surface)' }}>{item}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── Stroke draw demo ──────────────────────────────────────────────────── */

function StrokeDrawDemo() {
  const [key, setKey] = useState(0);
  const showcaseIcons = [Rocket, Heart, Bell, Mail, Search, Shield, Wifi, Cloud, Compass, Feather, Lightbulb, Music];

  return (
    <div className="rounded-lg p-8" style={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}>
      {/* Replay button */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="primary" iconLeft={RotateCcw} onClick={() => setKey(k => k + 1)}>
          Replay
        </Button>
        <span className="font-sans text-xs" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
          Each stroke draws sequentially with 80ms stagger
        </span>
      </div>

      {/* Icon grid — mount trigger, replays on key change */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-6" key={key}>
        {showcaseIcons.map((IconComp, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-2"
          >
            <div
              className="flex items-center justify-center rounded-lg"
              style={{
                width: 56,
                height: 56,
                backgroundColor: 'var(--color-surface-2)',
                color: 'var(--color-on-surface)',
              }}
            >
              <AnimatedIcon icon={IconComp} size="lg" stagger={0.08} />
            </div>
          </div>
        ))}
      </div>

      {/* Hover demo */}
      <div className="mt-10 pt-8" style={{ borderTop: '1px solid var(--color-border)' }}>
        <p className="font-sans text-sm font-medium mb-4" style={{ color: 'var(--color-on-surface)' }}>
          Hover to redraw
        </p>
        <div className="flex gap-6">
          {[Rocket, Heart, Compass, Lightbulb].map((IconComp, i) => (
            <div
              key={i}
              className="flex items-center justify-center rounded-lg transition-colors"
              style={{
                width: 64,
                height: 64,
                backgroundColor: 'var(--color-surface-2)',
                color: 'var(--color-primary-1)',
                cursor: 'pointer',
              }}
            >
              <AnimatedIcon icon={IconComp} sizePx={32} trigger="hover" stagger={0.06} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Speed graphs ────────────────────────────────────────────────────────── */

// SVG viewBox dimensions for the velocity graph
const GW = 280;
const GH = 140;
const COLS = 6;
const ROWS = 4;
const PAD_X = 22;
const PAD_Y = 18;

// Pill animation constants
const PILL_W = 340;
const PILL_H = 76;
const CIRCLE_D = 68;
const SLIDE_X = PILL_W - CIRCLE_D - 10;


// ─── Cycle timing ─────────────────────────────────────────────────────────
// 0 → TRAVEL_F : forward trip (circle moves, curve draws)
// TRAVEL_F → HOLD_F : 3-second hold at destination
// HOLD_F → HOLD_F+ε : instant reset (no animation, just a jump)
// HOLD_F+ε → 1 : pause at start before next cycle
const CYCLE    = 5.5;
const TRAVEL_F = 1.0 / CYCLE;            // forward trip duration fraction
const HOLD_F   = 4.0 / CYCLE;            // end of 3-second hold
const RESET_F  = HOLD_F + 0.0002;        // ε — reset is instantaneous


// ─── Actual spring velocity simulation ────────────────────────────────────
// Derives stiffness/damping from spring.default (visualDuration=0.3, bounce=0.1)
// and integrates the equations of motion to get the true velocity profile.

function simulateSpringVelocity(
  visualDuration: number,
  bounce: number,
  numSamples: number,
): number[] {
  const zeta   = Math.max(0.01, 1 - bounce);
  const omegaN = 6.9 / (zeta * visualDuration); // natural freq (rad/s)
  const k      = omegaN * omegaN;                // stiffness
  const c      = 2 * zeta * omegaN;             // damping (mass=1)

  const simDur = visualDuration * 1.6;
  const dt     = 0.0004;
  const total  = Math.ceil(simDur / dt);
  const stride = Math.max(1, Math.floor(total / numSamples));

  let x = 0, v = 0;
  const out: number[] = [];

  for (let i = 0; i <= total; i++) {
    if (i % stride === 0 && out.length < numSamples) out.push(v);
    const a = k * (1 - x) - c * v;
    v += a * dt;
    x += v * dt;
  }
  return out;
}

// Computed once at module level from the actual spring.default token values
const SPRING_VELS  = simulateSpringVelocity(0.3, 0.1, 120);
const SPRING_MAX_V = Math.max(...SPRING_VELS, 0.001);

function buildSpringPath(): string {
  const availW = GW - 2 * PAD_X;
  const availH = GH - 2 * PAD_Y;
  const pts = SPRING_VELS.map((v, i) => {
    const x = (PAD_X + (i / (SPRING_VELS.length - 1)) * availW).toFixed(1);
    const y = ((GH - PAD_Y) - (Math.max(0, v) / SPRING_MAX_V) * availH).toFixed(1);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  });
  return pts.join(' ');
}

const NATURAL_PATH = buildSpringPath();
// Both graphs share the same bottom baseline
const LINEAR_PATH  = `M ${PAD_X} ${(GH - PAD_Y).toFixed(1)} L ${GW - PAD_X} ${(GH - PAD_Y).toFixed(1)}`;

// ─── VelocityGraph ────────────────────────────────────────────────────────

// Right dot travels the full graph width minus both paddings
const DOT_TRAVEL = GW - 2 * PAD_X;

// Ease arrays — 4 segments for 5 keyframes (forward, hold, instant reset, pause).
// Natural: ease.standard on the forward trip; rest linear.
// Linear:  constant speed throughout (all 'linear').
const NATURAL_EASE = [[...ease.standard], 'linear', 'linear', 'linear'] as const;
const LINEAR_EASE  = ['linear', 'linear', 'linear', 'linear'] as const;

function VelocityGraph({ natural, fwd, started }: { natural: boolean; fwd: import('motion/react').MotionValue<number>; started: boolean }) {
  const rawId  = useId();
  const clipId = `vg${rawId.replace(/:/g, '')}`;

  // Clip right edge = dotX exactly, so the path tip and dot share the same X.
  const clipW = useTransform(fwd, p => PAD_X + p * DOT_TRAVEL);

  // The round stroke cap bleeds past the clip boundary at p=0.
  // Fade the path to invisible at rest so the default state is clean.
  const pathOpacity = useTransform(fwd, [0, 0.003], [0, 1]);

  // Right dot position
  const dotX = useTransform(fwd, p => PAD_X + p * DOT_TRAVEL);
  const dotY = useTransform(fwd, p => {
    if (!natural) return GH - PAD_Y;
    const idx = Math.min(
      Math.round(p * (SPRING_VELS.length - 1)),
      SPRING_VELS.length - 1,
    );
    const v = Math.max(0, SPRING_VELS[idx]);
    return (GH - PAD_Y) - (v / SPRING_MAX_V) * (GH - 2 * PAD_Y);
  });

  const cellW    = GW / COLS;
  const cellH    = GH / ROWS;
  const leftDotY = GH - PAD_Y; // shared bottom baseline

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}
    >
      <svg width="100%" viewBox={`0 0 ${GW} ${GH}`} style={{ display: 'block' }}>
        <defs>
          <clipPath id={clipId}>
            {/* Expands left→right to reveal the path without pathLength gaps */}
            <motion.rect x={0} y={0} height={GH} style={{ width: clipW }} />
          </clipPath>
        </defs>

        {/* Grid */}
        {Array.from({ length: COLS - 1 }, (_, i) => (
          <line key={`v${i}`} x1={(i + 1) * cellW} y1={0} x2={(i + 1) * cellW} y2={GH}
            stroke="var(--color-border)" strokeWidth={0.8} />
        ))}
        {Array.from({ length: ROWS - 1 }, (_, i) => (
          <line key={`h${i}`} x1={0} y1={(i + 1) * cellH} x2={GW} y2={(i + 1) * cellH}
            stroke="var(--color-border)" strokeWidth={0.8} />
        ))}

        {/* Full path revealed left→right by the clip mask */}
        <motion.g clipPath={`url(#${clipId})`} style={{ opacity: pathOpacity }}>
          <path
            d={natural ? NATURAL_PATH : LINEAR_PATH}
            fill="none"
            style={{ stroke: 'var(--color-on-surface)' }}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.g>

        {/* Left dot — pinned at the bottom baseline */}
        {started && <circle cx={PAD_X} cy={leftDotY} r={5} style={{ fill: 'var(--color-on-surface)' }} />}

        {/* Right dot — follows the actual curve tip in both X and Y */}
        {started && <motion.circle cx={0} cy={0} r={5} style={{ x: dotX, y: dotY, fill: 'var(--color-on-surface)' }} />}
      </svg>
    </div>
  );
}

// ─── SpeedCard ────────────────────────────────────────────────────────────

function SpeedCard({ natural }: { natural: boolean }) {
  const easeArr = natural ? NATURAL_EASE : LINEAR_EASE;
  const fwd = useMotionValue(0);
  const [, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const ctrlRef = useRef<ReturnType<typeof animate> | null>(null);

  const handlePlay = useCallback(() => {
    ctrlRef.current?.stop();
    fwd.set(0);
    setPlaying(true);
    setStarted(true);
    const ctrl = animate(fwd, [0, 1, 1, 0, 0], {
      duration: CYCLE,
      times: [0, TRAVEL_F, HOLD_F, RESET_F, 1],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ease: easeArr as any,
      onComplete: () => setPlaying(false),
    });
    ctrlRef.current = ctrl;
  }, [easeArr, fwd]);

  const circleX = useTransform(fwd, p => p * SLIDE_X);

  return (
    <div
      className="flex flex-col gap-6 rounded-lg p-8"
      style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
    >
      {/* Animated pill */}
      <div className="flex justify-center">
        <div
          className="relative flex items-center shrink-0"
          style={{ width: PILL_W, height: PILL_H, background: 'var(--color-inverted-surface)', borderRadius: 9999 }}
        >
          <motion.div
            style={{
              position: 'absolute',
              left: 5,
              width: CIRCLE_D,
              height: CIRCLE_D,
              borderRadius: '50%',
              background: 'var(--color-on-inverted-surface)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: shadows['small-2'],
              x: circleX,
            }}
          >
            <ArrowRight size={22} strokeWidth={2} color={'var(--color-inverted-surface)'} />
          </motion.div>
        </div>
      </div>

      {/* Velocity graph */}
      <VelocityGraph natural={natural} fwd={fwd} started={started} />

      {/* Play button */}
      <div className="flex justify-center">
        <Button variant="elevated" size="sm" iconLeft={Play} onClick={handlePlay}>
          Play
        </Button>
      </div>
    </div>
  );
}

function SpeedGraphs() {
  return (
    <div
      className="rounded-lg p-10"
      style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-8">
        <h3 className="font-display font-bold" style={{ fontSize: 20, color: 'var(--color-on-surface)' }}>
          Speed graphs
        </h3>
        <p
          className="font-sans max-w-xs text-right"
          style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-on-surface-subtle-1)' }}
        >
          Our motion should feel natural and human, like the swipe of a finger.
          Motion shouldn't feel stiff or mechanical.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-4">
        <SpeedCard natural={true} />
        <SpeedCard natural={false} />
      </div>

      {/* Labels */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        {/* Natural — green check */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center shrink-0"
            style={{
              width: 26, height: 26, borderRadius: '50%',
              background: 'var(--color-success-1)',
            }}
          >
            <Check size={13} strokeWidth={2.5} color="white" />
          </div>
          <span className="font-sans" style={{ fontSize: 14, color: 'var(--color-on-surface)' }}>
            Natural Movement
          </span>
        </div>

        {/* Mechanical — red cross */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center shrink-0"
            style={{
              width: 26, height: 26, borderRadius: '50%',
              background: 'var(--color-danger-1)',
            }}
          >
            <X size={13} strokeWidth={2.5} color="white" />
          </div>
          <span className="font-sans" style={{ fontSize: 14, color: 'var(--color-on-surface)' }}>
            Mechanical movement
          </span>
        </div>
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MAIN PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function MotionPage() {
  const sectionNav = useSectionNav(['tokens', 'rules'] as const);

  return (
    <>
      {/* ═══ HERO ═══ */}
      <PageHero
        title="Motion"
        subtitle="Quick, not rushed. Alive, not hyperactive."
        description="Every spring, every duration, every choreography rule exists to make motion feel inevitable — not decorative. If you removed every animation, nothing should break or be confusing. That's the test."
        visual={
          <div className="mt-4 flex gap-6 items-end">
            {/* Three hero blocks demonstrating the three spring personalities */}
            {(['snappy', 'default', 'playful'] as const).map((s, i) => (
              <motion.div
                key={s}
                className="rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: 'var(--color-surface-1)',
                  border: '1px solid var(--color-border)',
                  width: 120 + i * 20,
                  height: 80 + i * 16,
                }}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ ...spring[s], delay: 0.3 + i * 0.15 }}
              >
                <span className="font-mono text-sm font-bold" style={{ color: 'var(--color-primary-1)' }}>
                  {s}
                </span>
              </motion.div>
            ))}
          </div>
        }
      />

      <FloatingSectionNav
        items={[
          { value: 'tokens', label: 'Tokens', icon: Sliders },
          { value: 'rules', label: 'Rules', icon: BookOpen },
        ]}
        activeSection={sectionNav.activeSection}
        pinned={sectionNav.pinned}
        inlineRef={sectionNav.inlineRef}
        onChange={sectionNav.handleChange}
      />

      {/* ══ TOKENS ═══════════════════════════════════════════════════════════ */}
      <div ref={sectionNav.setSectionRef('tokens')} className="scroll-mt-8">

      <div className="mb-16">
        <h2
          className="font-brand font-bold leading-[0.95] mb-6"
          style={{ fontSize: 'clamp(56px, 7vw, 104px)', color: 'var(--color-on-surface)' }}
        >
          TOKENS
        </h2>
        <p className="font-sans text-lg max-w-2xl" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
          Springs, durations, easings — the raw ingredients of every animation. Import them once, use them everywhere. Change the speed multiplier and the whole product breathes differently.
        </p>
      </div>

      {/* ═══ 00 — SPEED GRAPHS ═══ */}
      <Reveal>
        <SpeedGraphs />
      </Reveal>

      {/* ═══ 01 — SPRINGS ═══ */}
      <Reveal>
        <Section title="Springs" description="The core of all spatial motion — position, scale, rotation. Three personalities, one system.">
          <SpringPlayground />
        </Section>
      </Reveal>

      {/* ═══ 01b — SPRING PERSONALITIES ═══ */}
      <Reveal>
        <Section title="Spring personalities" level="minor" description="Each spring communicates something specific. Use the personality, not just the timing.">
          <div className="flex flex-col gap-6">
            <div className="p-5 rounded-lg" style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}>
              <p className="font-mono text-xs font-medium mb-2" style={{ color: 'var(--color-on-surface-subtle-2)' }}>spring.snappy</p>
              <p className="font-sans text-md" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                Snappy is the sound of something working. Zero overshoot — it doesn't linger. Button presses, checkbox toggles, dropdown positions. Anything where the user gave a command and wants immediate acknowledgment. Bounce would feel wrong here: you don't want your confirmation to wobble.
              </p>
            </div>
            <div className="p-5 rounded-lg" style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}>
              <p className="font-mono text-xs font-medium mb-2" style={{ color: 'var(--color-on-surface-subtle-2)' }}>spring.default</p>
              <p className="font-sans text-md" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                Default is confident movement. It enters with purpose, settles with a suggestion of life — just enough overshoot to feel physical, not so much that it draws attention. Panels opening, tab indicators sliding, modals arriving. The spring that's doing its job without asking for applause.
              </p>
            </div>
            <div className="p-5 rounded-lg" style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}>
              <p className="font-mono text-xs font-medium mb-2" style={{ color: 'var(--color-on-surface-subtle-2)' }}>spring.playful</p>
              <p className="font-sans text-md" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                Playful earns its name by earning the moment. Reserved for celebrations — success states, achievement unlocks, that brief second where the user did the thing and the UI acknowledges it. Use it sparingly. If playful appears on every interaction, the interface reads as hyperactive. It's the spring equivalent of a high five: welcome at the end of something, annoying in the middle of it.
              </p>
            </div>
          </div>
        </Section>
      </Reveal>

      {/* ═══ 02 — DURATIONS ═══ */}
      <Reveal>
        <Section title="Durations" description="For tween-based motion: opacity, color, blur. Five levels from micro-feedback to page transitions.">
          <DurationRace />

          <div className="mt-8" />
          <TokenTable
            headers={['Token', 'Value', 'Use case']}
            rows={[
              { cells: [<code>duration.instant</code>, '100ms', 'Micro-feedback: button press, checkbox, color change'] },
              { cells: [<code>duration.fast</code>, '160ms', 'Small state changes: hover, focus ring, tooltip'] },
              { cells: [<code>duration.base</code>, '240ms', 'Standard transitions: dropdown, popover, tab switch'] },
              { cells: [<code>duration.moderate</code>, '340ms', 'Panel reveals, accordion, sidebar, modal'] },
              { cells: [<code>duration.slow</code>, '480ms', 'Page-level transitions, large layout shifts'] },
            ]}
          />
        </Section>
      </Reveal>

      {/* ═══ 03 — EASINGS ═══ */}
      <Reveal>
        <Section title="Easings" description="Cubic-bezier curves for tween animations. Enter decelerates, exit accelerates, standard does both.">
          <TokenTable
            headers={['Token', 'CSS value', 'Use case']}
            rows={[
              { cells: [<code>ease.enter</code>, 'cubic-bezier(0, 0, 0.2, 1)', 'Elements arriving, fading in, filling'] },
              { cells: [<code>ease.exit</code>, 'cubic-bezier(0.4, 0, 1, 1)', 'Elements leaving, dissolving'] },
              { cells: [<code>ease.standard</code>, 'cubic-bezier(0.4, 0, 0.2, 1)', 'Persistent elements changing state'] },
              { cells: [<code>ease.stroke</code>, 'cubic-bezier(0.65, 0, 0.35, 1)', 'Checkbox/radio path draw animations'] },
            ]}
          />
        </Section>
      </Reveal>

      {/* ═══ 04 — SEMANTIC TOKENS ═══ */}
      <Reveal>
        <Section title="Semantic tokens" description="Pick the intent, get the right motion. Components should prefer these over raw springs.">
          <SemanticDemo />

          <div className="mt-8" />
          <CodeBlock label="Usage">
{`import { transition } from '../tokens/motion';

// Button press — instant + snappy
<motion.button transition={transition.feedback} />

// Dropdown appearing — base + ease.enter
<motion.div transition={transition.reveal} />

// Toast success — moderate + playful bounce
<motion.div transition={transition.celebrate} />`}
          </CodeBlock>
        </Section>
      </Reveal>

      </div>{/* end tokens */}

      {/* ══ RULES ════════════════════════════════════════════════════════════ */}
      <div ref={sectionNav.setSectionRef('rules')} className="scroll-mt-8">

      <div className="mb-16 mt-24">
        <h2
          className="font-brand font-bold leading-[0.95] mb-6"
          style={{ fontSize: 'clamp(56px, 7vw, 104px)', color: 'var(--color-on-surface)' }}
        >
          RULES
        </h2>
        <p className="font-sans text-lg max-w-2xl" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
          Tokens tell you what to use. Rules tell you how. Press handling, choreography, exit-before-enter — the choreography that makes motion feel intentional instead of decorative.
        </p>
      </div>

      {/* ═══ 05 — USEPRESS ═══ */}
      <Reveal>
        <Section
          title="The usePress hook"
          description="Never use whileTap directly. On Apple Magic Trackpad, whileTap exits within ~10ms — before the animation is visible. usePress guarantees 120ms minimum."
        >
          <PressDemoBlock />

          <div className="mt-8" />
          <CodeBlock label="Implementation">
{`import { usePress } from '../hooks/usePress';

const { isPressed, pressHandlers } = usePress({ disabled });

<motion.button
  animate={{ scale: isPressed ? 0.97 : 1 }}
  transition={spring.snappy}
  {...pressHandlers}
>
  Save
</motion.button>`}
          </CodeBlock>
        </Section>
      </Reveal>

      {/* ═══ 06 — CHOREOGRAPHY ═══ */}
      <Reveal>
        <Section title="Choreography" description="Motion is a conversation between elements. These rules keep it coherent.">
          <StaggerDemo />

          <div className="mt-8" />
          <CardGrid columns={2}>
            <CardGrid.Card title="Exit before enter">
              When swapping content, outgoing element finishes leaving before incoming starts. Prevents visual clutter.
            </CardGrid.Card>
            <CardGrid.Card title="Parent before children">
              Container begins animation before contents. Modal slides in, then inner elements stagger. Never the reverse.
            </CardGrid.Card>
            <CardGrid.Card title="50ms stagger max">
              The stagger token is 50ms between items. Past that, the wave effect feels like lag. For fast lists, use 30ms.
            </CardGrid.Card>
            <CardGrid.Card title="Dismiss faster than reveal">
              When the user closes something, they've decided — get out of their way. Exit ≈ 60-70% of enter duration.
            </CardGrid.Card>
          </CardGrid>
        </Section>
      </Reveal>

      {/* ═══ 06b — STROKE DRAW ═══ */}
      <Reveal>
        <Section
          title="Stroke drawing"
          description="SVG line draw animation for Lucide icons. Each path draws from zero to full length using ease.stroke — the same curve as checkbox and radio animations."
        >
          <StrokeDrawDemo />

          <div className="mt-8" />
          <CodeBlock label="Usage">
{`import { AnimatedIcon } from '../components/AnimatedIcon';
import { Rocket } from 'lucide-react';

// Draw on mount
<AnimatedIcon icon={Rocket} />

// Redraw on hover
<AnimatedIcon icon={Rocket} trigger="hover" />

// Manual control
<AnimatedIcon icon={Rocket} trigger="manual" animate={isVisible} />

// Custom timing
<AnimatedIcon icon={Rocket} stagger={0.12} strokeDuration={0.4} />`}
          </CodeBlock>
        </Section>
      </Reveal>

      {/* ═══ 07 — SPEED MULTIPLIER ═══ */}
      <Reveal>
        <Section title="Speed multiplier" description="One value scales every duration and spring globally. Set MOTION_SPEED in tokens/motion.ts.">
          <div className="rounded-lg p-8" style={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}>
            <div className="flex items-baseline gap-4 mb-4">
              <span className="font-mono text-4xl font-bold" style={{ color: 'var(--color-primary-1)' }}>
                {MOTION_SPEED}×
              </span>
              <span className="font-sans text-sm" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
                current MOTION_SPEED
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { val: '0.5', desc: '2× faster — snappier feel' },
                { val: '1', desc: 'Default — balanced' },
                { val: '2', desc: '2× slower — dramatic' },
              ].map((s) => (
                <div key={s.val} className="rounded-md p-4" style={{ backgroundColor: 'var(--color-surface-2)' }}>
                  <p className="font-mono text-sm font-bold" style={{ color: 'var(--color-on-surface)' }}>{s.val}</p>
                  <p className="font-sans text-xs" style={{ color: 'var(--color-on-surface-subtle-2)' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </Reveal>

      {/* ═══ 08 — DO / DON'T ═══ */}
      <Reveal>
        <Section title="Guidelines">
          <DosDonts
            do={{
              visual: (
                <pre className="font-mono text-xs leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
{`import { spring } from '../tokens/motion';

<motion.div transition={spring.snappy} />`}
                </pre>
              ),
              caption: 'Always import timing from tokens/motion.ts. One source of truth, globally scalable.',
            }}
            dont={{
              visual: (
                <pre className="font-mono text-xs leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
{`<motion.div
  transition={{ type: 'spring', stiffness: 300 }}
/>`}
                </pre>
              ),
              caption: 'Never hardcode spring configs or duration numbers in components.',
            }}
          />
        </Section>
      </Reveal>

      </div>{/* end rules */}
    </>
  );
}
