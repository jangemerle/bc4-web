/**
 * 404 Terminal — Screen Vault
 *
 * A terminal-style 404 page with animated line reveal.
 * Press Enter to launch a hidden Space Invaders game.
 * Arrows to move, spacebar to shoot, Enter to restart.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { spring, duration, ease } from '../tokens/motion';

// ─── Terminal palette ─────────────────────────────────────────────────────────

const T = {
  bg:       '#1A1C1A',
  titleBar: '#252725',
  border:   '#2E302E',
  text:     '#B8C8B6',
  dim:      '#5A6858',
  green:    '#7DDB85',
  command:  '#E8EDE8',
  comment:  '#4A6050',
  red:      '#FF5F57',
  yellow:   '#FFBD2E',
} as const;

const TRAFFIC_LIGHTS = [
  { color: '#FF5F57', label: 'close' },
  { color: '#FFBD2E', label: 'minimise' },
  { color: '#28CA41', label: 'fullscreen' },
] as const;

// ─── 404 Script ───────────────────────────────────────────────────────────────

type LineKind =
  | { kind: 'blank' }
  | { kind: 'command'; text: string }
  | { kind: 'info'; text: string }
  | { kind: 'error-badge' }
  | { kind: 'error'; text: string }
  | { kind: 'trace'; text: string }
  | { kind: 'suggestion'; text: string }
  | { kind: 'hint'; text: string };

interface TimedLine { line: LineKind; delay: number }

const SCRIPT: TimedLine[] = [
  { line: { kind: 'command', text: '$ kvalt navigate /that-page' },             delay: 500  },
  { line: { kind: 'blank' },                                                    delay: 1050 },
  { line: { kind: 'info', text: 'Resolving route...' },                         delay: 1250 },
  { line: { kind: 'info', text: 'Checking cache... miss' },                     delay: 1580 },
  { line: { kind: 'info', text: 'Fetching from origin... failed' },             delay: 1900 },
  { line: { kind: 'blank' },                                                    delay: 2300 },
  { line: { kind: 'error-badge' },                                              delay: 2500 },
  { line: { kind: 'blank' },                                                    delay: 2700 },
  { line: { kind: 'error', text: 'HttpException: 404 Not Found' },              delay: 2900 },
  { line: { kind: 'trace', text: '  at Router.resolve (kvalt/router.ts:88)' },  delay: 3100 },
  { line: { kind: 'trace', text: '  at navigate (kvalt/nav.ts:42)' },           delay: 3250 },
  { line: { kind: 'trace', text: '  at <anonymous>:1:1' },                      delay: 3400 },
  { line: { kind: 'blank' },                                                    delay: 3700 },
  { line: { kind: 'suggestion', text: 'Suggestion: try /home instead.' },       delay: 3900 },
  { line: { kind: 'suggestion', text: 'Or just close the tab. That also works.' }, delay: 4200 },
  { line: { kind: 'blank' },                                                    delay: 4600 },
  { line: { kind: 'hint', text: '# press ENTER for something else entirely' },  delay: 5000 },
];

// ─── Main Component ───────────────────────────────────────────────────────────

type Phase = 'terminal' | 'loading' | 'game';

export default function NotFoundTerminal() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [phase, setPhase] = useState<Phase>('terminal');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timers = SCRIPT.map(({ delay }, i) =>
      window.setTimeout(() => setVisibleCount(i + 1), delay),
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

  // Listen for Enter to start game
  useEffect(() => {
    if (!isDone || phase !== 'terminal') return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        setPhase('loading');
        setTimeout(() => setPhase('game'), 900);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isDone, phase]);

  const titlePath =
    phase === 'game'
      ? 'kvalt@invaders: ~/404/game'
      : phase === 'loading'
        ? 'kvalt@invaders: ~/404/loading...'
        : 'kvalt@nowhere: ~/404';

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
        404 — Not Found
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
            {titlePath}
          </p>
          <div className="w-[52px]" />
        </div>

        {/* Terminal body — fixed height so it doesn't reflow between phases */}
        <div ref={scrollRef} style={{ height: 400, overflowY: 'auto' }}>
        <AnimatePresence mode="wait">
          {phase === 'terminal' && (
            <motion.div
              key="terminal"
              exit={{ opacity: 0 }}
              transition={{ duration: duration.fast }}
              className="px-8 py-8 font-mono text-[13px] leading-[1.7] h-full"
            >
              {SCRIPT.slice(0, visibleCount).map(({ line }, i) => (
                <TermLine
                  key={i}
                  line={line}
                  showCursor={i === visibleCount - 1 && !isDone}
                />
              ))}
              {isDone && (
                <div className="flex items-center gap-1 mt-1">
                  <span style={{ color: T.green }}>$</span>
                  <span>&nbsp;</span>
                  <BlinkCursor />
                </div>
              )}
            </motion.div>
          )}

          {phase === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: duration.fast }}
              className="px-8 py-8 font-mono text-[13px] leading-[1.7] h-full"
            >
              <div className="flex items-center gap-1">
                <span style={{ color: T.green }}>$</span>
                <span style={{ color: T.command }}>&nbsp;kvalt --play</span>
              </div>
              <div className="h-[1.1em]" />
              <LoadingSequence />
            </motion.div>
          )}

          {phase === 'game' && (
            <motion.div
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: duration.fast }}
            >
              <SpaceInvaders />
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Loading animation ────────────────────────────────────────────────────────

function LoadingSequence() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 200);
    const t2 = setTimeout(() => setStep(2), 500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <>
      {step >= 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: duration.fast }}
        >
          <span style={{ color: T.dim }}>Loading invaders...</span>
        </motion.div>
      )}
      {step >= 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: duration.fast }}
        >
          <span style={{ color: T.green, fontWeight: 700 }}>READY</span>
        </motion.div>
      )}
    </>
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
    case 'info':
      return (
        <motion.div {...fadeIn}>
          <span style={{ color: T.dim }}>{line.text}</span>
          {showCursor && <BlinkCursor />}
        </motion.div>
      );
    case 'error-badge':
      return (
        <motion.div {...fadeIn}>
          <span
            className="inline-block px-2 py-[1px] text-[10px] font-bold"
            style={{ backgroundColor: T.green, color: T.bg }}
          >
            ERROR
          </span>
          {showCursor && <BlinkCursor />}
        </motion.div>
      );
    case 'error':
      return (
        <motion.div {...fadeIn}>
          <span style={{ color: T.green, fontWeight: 700 }}>{line.text}</span>
          {showCursor && <BlinkCursor />}
        </motion.div>
      );
    case 'trace':
      return (
        <motion.div {...fadeIn}>
          <span style={{ color: T.dim }}>{line.text}</span>
          {showCursor && <BlinkCursor />}
        </motion.div>
      );
    case 'suggestion':
      return (
        <motion.div {...fadeIn}>
          <span style={{ color: T.text }}>{line.text}</span>
          {showCursor && <BlinkCursor />}
        </motion.div>
      );
    case 'hint':
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.6, 1] }}
          transition={{ duration: 1.5, ease: 'linear' }}
        >
          <span style={{ color: T.comment }}>{line.text}</span>
          {showCursor && <BlinkCursor />}
        </motion.div>
      );
  }
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

// ─── Space Invaders ───────────────────────────────────────────────────────────

const GW = 616;    // game canvas width
const GH = 364;    // game canvas height (fits 400 - 36 controls bar)
const PW = 28;     // player width
const PH = 14;     // player height
const BW = 2;      // bullet width
const BH = 8;      // bullet height
const AW = 20;     // alien width
const AH = 14;     // alien height
const COLS = 8;
const ROWS = 4;
const GAP_X = 16;
const GAP_Y = 12;

interface Bullet { x: number; y: number; active: boolean }
interface Alien  { x: number; y: number; alive: boolean; row: number }

interface GameState {
  px: number;
  bullets: Bullet[];
  alienBullets: Bullet[];
  aliens: Alien[];
  dir: number;
  speed: number;
  score: number;
  lives: number;
  over: boolean;
  won: boolean;
  keys: Set<string>;
  lastShot: number;
  lastAlienShot: number;
}

function createGame(): GameState {
  const aliens: Alien[] = [];
  const gridW = COLS * (AW + GAP_X) - GAP_X;
  const sx = (GW - gridW) / 2;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      aliens.push({
        x: sx + c * (AW + GAP_X),
        y: 48 + r * (AH + GAP_Y),
        alive: true,
        row: r,
      });
    }
  }
  return {
    px: GW / 2 - PW / 2,
    bullets: [],
    alienBullets: [],
    aliens,
    dir: 1,
    speed: 1,
    score: 0,
    lives: 3,
    over: false,
    won: false,
    keys: new Set(),
    lastShot: 0,
    lastAlienShot: 0,
  };
}

function SpaceInvaders() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gRef = useRef<GameState>(createGame());
  const frameRef = useRef(0);

  const reset = useCallback(() => {
    gRef.current = createGame();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = GW * dpr;
    canvas.height = GH * dpr;
    canvas.style.width = `${GW}px`;
    canvas.style.height = `${GH}px`;
    ctx.scale(dpr, dpr);

    const onDown = (e: KeyboardEvent) => {
      const g = gRef.current;
      g.keys.add(e.key);
      if (['ArrowLeft', 'ArrowRight', ' ', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === 'Enter' && g.over) reset();
    };
    const onUp = (e: KeyboardEvent) => gRef.current.keys.delete(e.key);

    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);

    let animId: number;

    function tick() {
      const g = gRef.current;
      frameRef.current++;

      if (!g.over) {
        // ── Movement ──
        if (g.keys.has('ArrowLeft'))  g.px = Math.max(0, g.px - 4.5);
        if (g.keys.has('ArrowRight')) g.px = Math.min(GW - PW, g.px + 4.5);

        // ── Shoot ──
        const now = Date.now();
        if (g.keys.has(' ') && now - g.lastShot > 220) {
          g.bullets.push({ x: g.px + PW / 2 - BW / 2, y: GH - 36, active: true });
          g.lastShot = now;
        }

        // ── Player bullets ──
        for (const b of g.bullets) {
          if (!b.active) continue;
          b.y -= 5.5;
          if (b.y < 0) b.active = false;
        }

        // ── Alien movement ──
        const living = g.aliens.filter(a => a.alive);
        let edge = false;
        for (const a of living) {
          a.x += g.speed * g.dir;
          if (a.x <= 4 || a.x + AW >= GW - 4) edge = true;
        }
        if (edge) {
          g.dir *= -1;
          for (const a of living) a.y += 16;
        }

        // ── Speed ramp ──
        const alive = living.length;
        g.speed = alive > 20 ? 1 : alive > 10 ? 1.5 : alive > 5 ? 2.2 : 3;

        // ── Alien shooting ──
        if (now - g.lastAlienShot > 900 && living.length > 0) {
          const shooter = living[Math.floor(Math.random() * living.length)];
          g.alienBullets.push({ x: shooter.x + AW / 2, y: shooter.y + AH, active: true });
          g.lastAlienShot = now;
        }

        // ── Alien bullets ──
        for (const b of g.alienBullets) {
          if (!b.active) continue;
          b.y += 3;
          if (b.y > GH) b.active = false;
          if (b.y >= GH - 28 && b.y <= GH - 28 + PH && b.x >= g.px && b.x <= g.px + PW) {
            b.active = false;
            g.lives--;
            if (g.lives <= 0) g.over = true;
          }
        }

        // ── Collision ──
        for (const b of g.bullets) {
          if (!b.active) continue;
          for (const a of g.aliens) {
            if (!a.alive) continue;
            if (b.x >= a.x && b.x <= a.x + AW && b.y >= a.y && b.y <= a.y + AH) {
              b.active = false;
              a.alive = false;
              g.score += (ROWS - a.row) * 10;
            }
          }
        }

        // ── Aliens reach bottom ──
        for (const a of living) {
          if (a.y + AH >= GH - 28) g.over = true;
        }

        // ── Win ──
        if (g.aliens.every(a => !a.alive)) {
          g.over = true;
          g.won = true;
        }

        // ── Cleanup ──
        g.bullets = g.bullets.filter(b => b.active);
        g.alienBullets = g.alienBullets.filter(b => b.active);
      }

      // ══════ DRAW ══════
      ctx!.fillStyle = T.bg;
      ctx!.fillRect(0, 0, GW, GH);

      // HUD
      ctx!.font = '11px "JetBrains Mono", monospace';
      ctx!.fillStyle = T.dim;
      ctx!.fillText(`SCORE ${g.score}`, 16, 22);
      ctx!.fillStyle = T.green;
      for (let i = 0; i < g.lives; i++) {
        ctx!.fillRect(GW - 24 - i * 18, 14, 12, 6);
        ctx!.fillRect(GW - 22 - i * 18, 10, 8, 4);
      }

      // Player ship
      ctx!.fillStyle = T.green;
      const py = GH - 28;
      ctx!.fillRect(g.px, py + 4, PW, PH - 4);
      ctx!.fillRect(g.px + 4, py, PW - 8, PH);
      ctx!.fillRect(g.px + PW / 2 - 2, py - 3, 4, 5);

      // Player bullets
      ctx!.fillStyle = T.green;
      for (const b of g.bullets) ctx!.fillRect(b.x, b.y, BW, BH);

      // Alien bullets
      ctx!.fillStyle = '#4AAE55';
      for (const b of g.alienBullets) ctx!.fillRect(b.x, b.y, BW, 6);

      // Aliens — green gradient: light → dark
      const colors = ['#B8F0BB', '#7DDB85', '#4AAE55', '#2D7A3A'];
      const frame = frameRef.current;
      for (const a of g.aliens) {
        if (!a.alive) continue;
        const c = colors[a.row % 4];
        ctx!.fillStyle = c;
        // Body
        ctx!.fillRect(a.x + 2, a.y + 2, AW - 4, AH - 4);
        ctx!.fillRect(a.x, a.y + 4, AW, AH - 8);
        // Eyes
        ctx!.fillStyle = T.bg;
        ctx!.fillRect(a.x + 5, a.y + 5, 3, 3);
        ctx!.fillRect(a.x + AW - 8, a.y + 5, 3, 3);
        // Legs (animated)
        ctx!.fillStyle = c;
        const legOff = Math.floor(frame / 25) % 2 === 0 ? 0 : 2;
        ctx!.fillRect(a.x + 1 + legOff, a.y + AH - 2, 3, 3);
        ctx!.fillRect(a.x + AW - 4 - legOff, a.y + AH - 2, 3, 3);
      }

      // Game over / win
      if (g.over) {
        // Dim overlay
        ctx!.fillStyle = 'rgba(26, 28, 26, 0.75)';
        ctx!.fillRect(0, 0, GW, GH);

        ctx!.textAlign = 'center';
        ctx!.font = 'bold 22px "JetBrains Mono", monospace';
        ctx!.fillStyle = g.won ? T.green : T.red;
        ctx!.fillText(
          g.won ? 'PAGE FOUND. YOU WIN.' : 'GAME OVER',
          GW / 2, GH / 2 - 16,
        );

        ctx!.font = '12px "JetBrains Mono", monospace';
        ctx!.fillStyle = T.dim;
        ctx!.fillText(
          g.won
            ? `Score: ${g.score}. The page was inside you all along.`
            : `Score: ${g.score}. Press ENTER to retry.`,
          GW / 2, GH / 2 + 12,
        );
        ctx!.textAlign = 'start';
      }

      animId = requestAnimationFrame(tick);
    }

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, [reset]);

  return (
    <div className="flex flex-col">
      <canvas
        ref={canvasRef}
        className="block mx-auto"
        style={{ imageRendering: 'pixelated' }}
      />
      <div
        className="flex justify-between px-6 py-3 font-mono text-[10px]"
        style={{ borderTop: `1px solid ${T.border}` }}
      >
        <span style={{ color: T.dim }}>
          ← →&nbsp; MOVE &nbsp;&nbsp; SPACE&nbsp; SHOOT &nbsp;&nbsp; ENTER&nbsp; RESTART
        </span>
        <span style={{ color: T.comment }}># find the missing page</span>
      </div>
    </div>
  );
}
