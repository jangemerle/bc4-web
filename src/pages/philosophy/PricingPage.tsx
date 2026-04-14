import { Check, MessageCircle, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { PageHero } from '../../layouts/PageHero';
import { Button } from '../../components/Button';
import { spring, ease, duration } from '../../tokens/motion';
import { useMockUser } from '../../hooks/useMockUser';

const DISCORD_URL = 'https://discord.gg/kvalt'; // swap when ready

// ─── Certificate ─────────────────────────────────────────────────────────────

function Certificate({ userName = 'Jeffrey' }: { userName?: string }) {
  const strokeColor = 'var(--color-primary-1)';
  const subtleColor = 'var(--color-on-surface-subtle-2)';

  // Shared stroke-draw transition
  const drawTransition = (delay: number, dur = 0.7) => ({
    pathLength: { duration: dur, delay, ease: ease.stroke },
    opacity: { duration: 0.01, delay },
  });

  return (
    <motion.div
      className="relative w-full overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring.default, delay: 0.26 }}
      style={{
        background: 'var(--color-surface-1)',
        borderRadius: 'var(--radius-l)',
        boxShadow: 'var(--shadow-large-1)',
        padding: '3rem 3.5rem',
      }}
    >
      {/* Corner ornaments — top-left */}
      <CornerOrnament position="top-left" delay={0.5} />
      <CornerOrnament position="top-right" delay={0.6} />
      <CornerOrnament position="bottom-left" delay={0.7} />
      <CornerOrnament position="bottom-right" delay={0.8} />

      {/* Content */}
      <div className="flex flex-col items-center gap-6 relative z-10">

        {/* Label */}
        <motion.span
          className="font-mono text-xs uppercase tracking-[0.25em]"
          style={{ color: strokeColor }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: duration.base, delay: 0.4, ease: ease.enter }}
        >
          Certificate of Recognition
        </motion.span>

        {/* Divider line */}
        <svg width="200" height="2" viewBox="0 0 200 2" fill="none" style={{ overflow: 'visible' }}>
          <motion.line
            x1="0" y1="1" x2="200" y2="1"
            stroke={strokeColor}
            strokeWidth="0.75"
            strokeOpacity="0.4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={drawTransition(0.45, 0.5)}
          />
        </svg>

        {/* Title */}
        <motion.h2
          className="font-display font-bold"
          style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            color: 'var(--color-on-surface)',
            letterSpacing: '-0.01em',
            lineHeight: 1.1,
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring.default, delay: 0.5 }}
        >
          Founding Designer
        </motion.h2>

        {/* Body text */}
        <motion.p
          className="font-sans text-sm max-w-sm"
          style={{ color: subtleColor, lineHeight: 1.7 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: duration.moderate, delay: 0.6, ease: ease.enter }}
        >
          This certifies that the bearer arrived before it was obvious,
          and shall enjoy Kvalt free of charge — now and in whatever comes next.
        </motion.p>

        {/* Seal + Signature row */}
        <div className="flex items-end justify-center gap-10 mt-2 w-full">

          {/* Signature */}
          <div className="flex flex-col items-center gap-2">
            <SignatureSVG delay={0.85} />
            <motion.span
              className="font-mono text-[10px] uppercase tracking-widest"
              style={{ color: subtleColor }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: duration.base, delay: 1.4, ease: ease.enter }}
            >
              {userName}
            </motion.span>
          </div>

          {/* Wax seal */}
          <WaxSeal delay={0.9} />

        </div>

        {/* Free forever tag */}
        <motion.span
          className="inline-flex items-center gap-1.5 px-3 py-1 font-mono text-xs"
          style={{
            background: 'var(--color-success-subtle)',
            color: 'var(--color-success)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-success)',
          }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...spring.playful, delay: 1.1 }}
        >
          <Check size={11} strokeWidth={2.5} />
          Free forever · No action required
        </motion.span>

      </div>
    </motion.div>
  );
}

// ─── Corner ornament ──────────────────────────────────────────────────────────

function CornerOrnament({ position, delay }: {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  delay: number;
}) {
  const size = 28;
  const s = 'var(--color-primary-1)';

  const style: React.CSSProperties = {
    position: 'absolute',
    ...(position.includes('top') ? { top: 16 } : { bottom: 16 }),
    ...(position.includes('left') ? { left: 16 } : { right: 16 }),
    transform: position === 'top-right' ? 'scaleX(-1)'
      : position === 'bottom-left' ? 'scaleY(-1)'
      : position === 'bottom-right' ? 'scale(-1)' : undefined,
  };

  const drawT = {
    pathLength: { duration: 0.5, delay, ease: ease.stroke },
    opacity: { duration: 0.01, delay },
  };

  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" style={style}>
      <motion.path
        d="M2 14 L2 2 L14 2"
        stroke={s} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        strokeOpacity="0.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={drawT}
      />
      <motion.circle
        cx="2" cy="2" r="2"
        fill={s} fillOpacity="0.35"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ transformOrigin: '2px 2px' }}
        transition={{ ...spring.snappy, delay: delay + 0.45 }}
      />
    </svg>
  );
}

// ─── Signature SVG ────────────────────────────────────────────────────────────

function SignatureSVG({ delay }: { delay: number }) {
  const drawT = (d: number) => ({
    pathLength: { duration: 0.55, delay: delay + d, ease: ease.stroke },
    opacity: { duration: 0.01, delay: delay + d },
  });

  return (
    <svg width="120" height="44" viewBox="0 0 120 44" fill="none">
      {/* First stroke — J shape */}
      <motion.path
        d="M10 8 C10 8 14 6 16 14 C18 22 14 32 8 36"
        stroke="var(--color-on-surface)" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={drawT(0)}
      />
      {/* Flowing middle stroke */}
      <motion.path
        d="M18 18 C28 10 40 24 52 20 C64 16 70 10 80 14 C90 18 96 26 108 22"
        stroke="var(--color-on-surface)" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={drawT(0.25)}
      />
      {/* Underline flourish */}
      <motion.path
        d="M8 40 C30 36 80 38 112 34"
        stroke="var(--color-primary-1)" strokeWidth="1"
        strokeLinecap="round" strokeOpacity="0.6"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={drawT(0.55)}
      />
    </svg>
  );
}

// ─── Wax seal ────────────────────────────────────────────────────────────────

function WaxSeal({ delay }: { delay: number }) {
  const R = 38;
  const cx = 42;
  const cy = 42;

  // 12-pointed star path for the seal edge
  const starPath = (() => {
    const pts: string[] = [];
    for (let i = 0; i < 24; i++) {
      const angle = (i * Math.PI * 2) / 24 - Math.PI / 2;
      const r = i % 2 === 0 ? R : R - 5;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`);
    }
    return pts.join(' ') + ' Z';
  })();

  return (
    <motion.div
      style={{ position: 'relative', width: 84, height: 84 }}
      initial={{ scale: 0, rotate: -15, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ ...spring.playful, delay }}
    >
      <svg width="84" height="84" viewBox="0 0 84 84" fill="none">
        {/* Seal body */}
        <motion.path
          d={starPath}
          fill="var(--color-primary-1)"
          fillOpacity="0.12"
          stroke="var(--color-primary-1)"
          strokeWidth="1.2"
          strokeOpacity="0.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: 0.8, delay: delay + 0.15, ease: ease.stroke },
            opacity: { duration: 0.01, delay: delay + 0.15 },
          }}
        />
        {/* Inner circle */}
        <motion.circle
          cx={cx} cy={cy} r="22"
          stroke="var(--color-primary-1)"
          strokeWidth="0.75"
          strokeOpacity="0.4"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: 0.6, delay: delay + 0.5, ease: ease.stroke },
            opacity: { duration: 0.01, delay: delay + 0.5 },
          }}
        />
        {/* K monogram */}
        <motion.path
          d="M35 30 L35 54 M35 42 L49 30 M35 42 L49 54"
          stroke="var(--color-primary-1)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: 0.6, delay: delay + 0.75, ease: ease.stroke },
            opacity: { duration: 0.01, delay: delay + 0.75 },
          }}
        />
      </svg>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const mockUser = useMockUser();

  return (
    <>
      <PageHero
        title="Pricing"
        subtitle="The short version"
        description="We thought you'd appreciate clarity over a pricing table with seventeen asterisks."
      />

      <div className="flex flex-col items-center text-center gap-16 py-16 px-6 max-w-2xl mx-auto">

        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring.default, delay: 0.1 }}
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-2 font-sans text-sm font-medium"
            style={{
              background: 'var(--color-success-subtle)',
              color: 'var(--color-success)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-success)',
            }}
          >
            <Check size={14} strokeWidth={2.5} />
            Kvalt is free
          </span>
        </motion.div>

        {/* Main copy */}
        <motion.div
          className="flex flex-col gap-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring.default, delay: 0.18 }}
        >
          <h2
            className="font-display font-bold leading-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--color-on-surface)' }}
          >
            You showed up early.
          </h2>

          <p
            className="font-sans text-lg leading-relaxed"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            We may introduce paid plans someday. If we do,{' '}
            <strong style={{ color: 'var(--color-on-surface)' }}>Founding Designers</strong>
            {' '}— everyone using Kvalt right now — keep it free. Forever.
          </p>

          <p
            className="font-sans text-md leading-relaxed"
            style={{ color: 'var(--color-on-surface-subtle-2)' }}
          >
            No asterisks. No "free while in beta". No annual reminder that
            "pricing may change". You were here before it was obvious. That means something.
          </p>
        </motion.div>

        {/* The certificate */}
        <Certificate userName={mockUser.first} />

        {/* Discord CTA */}
        <motion.div
          className="flex flex-col gap-5 w-full"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring.default, delay: 0.34 }}
          style={{ borderTop: '1px solid var(--color-border)', paddingTop: '3rem' }}
        >
          <div className="flex flex-col gap-2">
            <h3
              className="font-display font-bold text-xl"
              style={{ color: 'var(--color-on-surface)' }}
            >
              Stay close.
            </h3>
            <p
              className="font-sans text-md leading-relaxed"
              style={{ color: 'var(--color-on-surface-subtle-1)' }}
            >
              New characters, token updates, design debates, and the occasional
              strong opinion about border radius — it all happens in Discord first.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => window.open(DISCORD_URL, '_blank')}
            >
              <MessageCircle size={16} />
              Join the Discord
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                const url = new URL(window.location.href);
                url.searchParams.delete('page');
                window.history.pushState({}, '', url);
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
            >
              Browse the system
              <ArrowRight size={16} />
            </Button>
          </div>
        </motion.div>

        {/* Fine print */}
        <motion.p
          className="font-mono text-xs"
          style={{ color: 'var(--color-on-surface-subtle-2)', opacity: 0.6 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: duration.moderate, delay: 0.5, ease: ease.enter }}
        >
          * That's the one asterisk. It leads to nothing.
        </motion.p>

      </div>
    </>
  );
}
