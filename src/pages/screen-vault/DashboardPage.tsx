/**
 * DashboardPage — Screen Vault showcase of 14 dashboard card styles.
 * Pure SVG charts, DS tokens, no external chart libraries.
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Check,
  CheckCircle2,
  TrendingUp,
  Search,
  Copy,
  ArrowUpRight,
  BarChart2,
  TriangleAlert,
} from 'lucide-react';
import { spring } from '../../tokens/motion';
import { UserAvatar } from '../../components/UserAvatar';
import { Button } from '../../components/Button';
import { cn } from '../../lib/cn';

// ─── Avatar accent colors (one per user) ─────────────────────────────────────
// Maps each user to a semantic secondary-surface token so the tints change
// with the active character palette instead of being locked to the forest theme.

const AVATAR_COLORS: Record<string, string> = {
  JK: 'var(--color-secondary-1)',
  MC: 'var(--color-warning-secondary-1)',
  AK: 'var(--color-success-secondary-1)',
  RP: 'var(--color-secondary-2)',
  LM: 'var(--color-warning-secondary-2)',
};

// ─── Shared card wrapper ──────────────────────────────────────────────────────

interface CardProps {
  children: React.ReactNode;
  dark?: boolean;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}

function Card({ children, dark = false, className, style, delay = 0 }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring.default, delay }}
      className={cn('rounded-lg overflow-hidden', className)}
      style={{
        backgroundColor: dark ? 'var(--color-inverted-surface)' : 'var(--color-surface-1)',
        border: dark ? 'none' : '1px solid var(--color-border)',
        boxShadow: dark ? 'none' : 'var(--shadow-small-1)',
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── 1. StatCard ─────────────────────────────────────────────────────────────

function StatCard() {
  return (
    <Card dark delay={0}>
      <div className="p-5 flex flex-col gap-4">
        {/* Top */}
        <div className="flex items-center justify-between">
          <span
            className="font-mono text-xs uppercase tracking-widest"
            style={{ color: 'var(--color-primary-1)' }}
          >
            Active Users
          </span>
          <TrendingUp size={14} style={{ color: 'var(--color-primary-1)' }} />
        </div>

        {/* Middle */}
        <div className="flex flex-col gap-1">
          <span
            className="font-display font-bold leading-none"
            style={{ fontSize: 48, color: 'var(--color-on-inverted-surface)' }}
          >
            2,847
          </span>
          <span
            className="font-mono text-xs"
            style={{ color: 'var(--color-on-inverted-surface)', opacity: 0.45 }}
          >
            Smart Search
          </span>
        </div>

        {/* Bottom */}
        <div
          className="pt-4 flex items-center gap-2"
          style={{ borderTop: '1px solid color-mix(in oklch, var(--color-on-inverted-surface) 10%, transparent)' }}
        >
          <span
            className="font-mono text-xs font-semibold"
            style={{ color: 'var(--color-primary-1)' }}
          >
            +12.4%
          </span>
          <span
            className="font-mono text-xs"
            style={{ color: 'var(--color-on-inverted-surface)', opacity: 0.45 }}
          >
            vs last week
          </span>
        </div>
      </div>
    </Card>
  );
}

// ─── 2. FeatureCard ───────────────────────────────────────────────────────────

function FeatureCard() {
  return (
    <Card dark={false} delay={0.04} className="flex flex-col">
      {/* Dark image block */}
      <div
        className="h-36 flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-inverted-surface)' }}
      >
        <Search size={32} style={{ color: 'var(--color-primary-1)', opacity: 0.6 }} />
      </div>

      {/* Bottom text */}
      <div className="p-4 flex flex-col gap-1">
        <span
          className="font-display font-bold leading-snug"
          style={{ fontSize: 18, color: 'var(--color-on-surface)' }}
        >
          Smart Search
        </span>
        <span
          className="font-mono text-xs"
          style={{ color: 'var(--color-on-surface-subtle-1)' }}
        >
          Jan · 2 min read
        </span>
      </div>
    </Card>
  );
}

// ─── 3. TicketCard ────────────────────────────────────────────────────────────

function TicketCard() {
  return (
    <Card dark={false} delay={0.08} className="relative">
      {/* Header */}
      <div className="p-5 pb-4 flex items-center gap-2">
        <span
          className="font-display font-bold"
          style={{ fontSize: 16, color: 'var(--color-on-surface)' }}
        >
          Smart Search
        </span>
        <Search size={14} style={{ color: 'var(--color-on-surface-subtle-1)' }} />
      </div>

      {/* Body */}
      <div className="px-5 pb-5">
        <p
          className="font-mono text-xs leading-relaxed"
          style={{ color: 'var(--color-on-surface-subtle-1)' }}
        >
          Find anything in milliseconds.
          <br />
          No configuration needed.
        </p>
      </div>

      {/* Ticket perforation divider */}
      <div className="relative flex items-center" style={{ height: 1 }}>
        <div
          className="absolute left-0 right-0"
          style={{ borderTop: '1px dashed var(--color-border)' }}
        />
        {/* Left cutout */}
        <div
          className="absolute -left-3 w-6 h-6 rounded-xl z-10"
          style={{ backgroundColor: 'var(--color-bg)' }}
        />
        {/* Right cutout */}
        <div
          className="absolute -right-3 w-6 h-6 rounded-xl z-10"
          style={{ backgroundColor: 'var(--color-bg)' }}
        />
      </div>

      {/* Footer */}
      <div className="p-5 pt-4 flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span
            className="font-mono text-2xs uppercase tracking-wider"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            VALID · 30 DAYS
          </span>
          <span
            className="font-mono text-2xs uppercase tracking-wide"
            style={{ color: 'var(--color-on-surface-subtle-2)' }}
          >
            ISSUED TO: JAN KVALT
          </span>
        </div>
        <UserAvatar
          initials="JK"
          size="sm"
          style={{ backgroundColor: AVATAR_COLORS['JK'] }}
        />
      </div>
    </Card>
  );
}

// ─── 4. ActivityCard ──────────────────────────────────────────────────────────

const ACTIVITY_ITEMS = [
  { initials: 'JK', action: 'Deployed Smart Search', time: '2 min ago', done: true },
  { initials: 'MC', action: 'Reviewed token spec', time: '18 min ago', done: false },
  { initials: 'AK', action: 'Merged radius tokens', time: '1 hr ago', done: false },
  { initials: 'RP', action: 'Opened issue #042', time: '3 hrs ago', done: false },
];

function ActivityCard() {
  return (
    <Card dark={false} delay={0.12}>
      <div className="p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span
            className="font-display font-bold"
            style={{ fontSize: 16, color: 'var(--color-on-surface)' }}
          >
            Activity
          </span>
          <span
            className="font-sans text-sm font-medium cursor-pointer"
            style={{ color: 'var(--color-primary-1)' }}
          >
            View all
          </span>
        </div>

        {/* Feed */}
        <div className="flex flex-col gap-3">
          {ACTIVITY_ITEMS.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <UserAvatar
                initials={item.initials}
                size="sm"
                style={{ backgroundColor: AVATAR_COLORS[item.initials] }}
              />
              <div className="flex-1 min-w-0">
                <span
                  className="font-sans text-sm block truncate"
                  style={{ color: 'var(--color-on-surface)' }}
                >
                  {item.action}
                </span>
              </div>
              <span
                className="font-mono text-xs shrink-0"
                style={{ color: 'var(--color-on-surface-subtle-1)' }}
              >
                {item.time}
              </span>
              {item.done && (
                <CheckCircle2 size={14} style={{ color: 'var(--color-primary-1)', flexShrink: 0 }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ─── 5. CodeCard ─────────────────────────────────────────────────────────────
//
// Syntax palette maps to semantic DS tokens so the code card re-skins with
// the active character palette — same role for each token kind.

const SYNTAX = {
  keyword:     'var(--color-primary-1)',          // import, from, const, await
  identifier:  'var(--color-on-secondary-1)',     // variable names, function calls
  operator:    'var(--color-on-secondary-2)',     // =, :
  string:      'var(--color-success-1)',          // 'Smart Search', '@kvalt/core'
  prop:        'var(--color-danger-1)',           // query, limit
  number:      'var(--color-warning-1)',          // 10
  punctuation: 'var(--color-on-inverted-surface)',// {, }, ,, ;
  comment:     'var(--color-on-surface-subtle-2)',// // ...
};

const CODE_LINES = [
  { tokens: [{ text: 'import', color: SYNTAX.keyword }, { text: ' { search } ', color: SYNTAX.punctuation }, { text: 'from', color: SYNTAX.keyword }, { text: " '@kvalt/core'", color: SYNTAX.string }] },
  { tokens: [] },
  { tokens: [{ text: 'const', color: SYNTAX.keyword }, { text: ' results ', color: SYNTAX.identifier }, { text: '=', color: SYNTAX.operator }, { text: ' await ', color: SYNTAX.keyword }, { text: 'search', color: SYNTAX.identifier }, { text: '({', color: SYNTAX.punctuation }] },
  { tokens: [{ text: '  query', color: SYNTAX.prop }, { text: ': ', color: SYNTAX.operator }, { text: "'Smart Search'", color: SYNTAX.string }, { text: ',', color: SYNTAX.punctuation }] },
  { tokens: [{ text: '  limit', color: SYNTAX.prop }, { text: ': ', color: SYNTAX.operator }, { text: '10', color: SYNTAX.number }, { text: ',', color: SYNTAX.punctuation }] },
  { tokens: [{ text: '});', color: SYNTAX.punctuation }] },
  { tokens: [] },
  { tokens: [{ text: '// milliseconds, no config', color: SYNTAX.comment }] },
];

function CodeCard() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card dark delay={0.16} style={{ fontFamily: 'monospace' }}>
      <div className="p-4 flex flex-col gap-3">
        {/* Traffic lights + filename + language chip + copy */}
        <div className="flex items-center gap-3">
          {/* Traffic lights */}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-xl" style={{ backgroundColor: 'var(--color-danger-1)' }} />
            <div className="w-3 h-3 rounded-xl" style={{ backgroundColor: 'var(--color-warning-1)' }} />
            <div className="w-3 h-3 rounded-xl" style={{ backgroundColor: 'var(--color-success-1)' }} />
          </div>

          {/* Filename */}
          <span
            className="font-mono text-xs flex-1"
            style={{ color: 'var(--color-on-inverted-surface)', opacity: 0.35 }}
          >
            search.ts
          </span>

          {/* Language chip */}
          <div
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-xl"
            style={{ backgroundColor: 'color-mix(in oklch, var(--color-on-inverted-surface) 7%, transparent)' }}
          >
            <div
              className="w-1.5 h-1.5 rounded-xl"
              style={{ backgroundColor: 'var(--color-primary-1)' }}
            />
            <span
              className="font-mono text-2xs"
              style={{ color: 'var(--color-on-inverted-surface)', opacity: 0.6 }}
            >
              TypeScript
            </span>
          </div>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="flex items-center justify-center w-6 h-6 rounded cursor-pointer transition-colors"
            style={{
              backgroundColor: 'color-mix(in oklch, var(--color-on-inverted-surface) 5%, transparent)',
              color: copied ? 'var(--color-primary-1)' : 'color-mix(in oklch, var(--color-on-inverted-surface) 40%, transparent)',
            }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
          </button>
        </div>

        {/* Code */}
        <div className="flex flex-col" style={{ gap: 2 }}>
          {CODE_LINES.map((line, i) => (
            <div key={i} style={{ minHeight: 18 }}>
              {line.tokens.map((token, j) => (
                <span key={j} style={{ color: token.color, fontSize: 12, lineHeight: '18px' }}>
                  {token.text}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ─── 6. PricingCard ──────────────────────────────────────────────────────────

const PRICING_FEATURES = [
  'All 6 foundation tokens',
  'Lucide icons included',
  'Illustration library',
  'Priority updates',
];

function PricingCard() {
  return (
    <Card dark={false} delay={0.2}>
      <div className="p-6 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span
            className="font-display font-bold"
            style={{ fontSize: 20, color: 'var(--color-on-surface)' }}
          >
            Pro
          </span>
          <span
            className="font-sans text-xs font-semibold px-2 py-0.5 rounded-xl"
            style={{
              backgroundColor: 'var(--color-primary-secondary-1)',
              color: 'var(--color-primary-1)',
            }}
          >
            Most popular
          </span>
        </div>

        {/* Price */}
        <div className="flex items-end gap-1">
          <span
            className="font-display font-bold leading-none"
            style={{ fontSize: 52, color: 'var(--color-on-surface)' }}
          >
            $0
          </span>
          <span
            className="font-sans text-md pb-2"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            /mo
          </span>
        </div>

        {/* Description */}
        <p
          className="font-sans text-sm"
          style={{ color: 'var(--color-on-surface-subtle-1)' }}
        >
          Free for Founding Designers, forever.
        </p>

        {/* Divider */}
        <div style={{ borderTop: '1px solid var(--color-border)' }} />

        {/* Features */}
        <div className="flex flex-col gap-2.5">
          {PRICING_FEATURES.map((f) => (
            <div key={f} className="flex items-center gap-2.5">
              <Check size={14} style={{ color: 'var(--color-primary-1)', flexShrink: 0 }} />
              <span className="font-sans text-sm" style={{ color: 'var(--color-on-surface)' }}>
                {f}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Button variant="primary" size="lg" className="w-full justify-center">
          Get started free
        </Button>
      </div>
    </Card>
  );
}

// ─── 7. StatusCard ────────────────────────────────────────────────────────────

const STATUS_SERVICES = [
  { name: 'API', status: 'Healthy', color: 'var(--color-primary-1)' },
  { name: 'Search', status: 'Healthy', color: 'var(--color-primary-1)' },
  { name: 'Indexer', status: 'Degraded', color: 'var(--color-warning-1)' },
];

function StatusCard() {
  return (
    <Card dark delay={0.24}>
      <div className="p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span
            className="font-mono text-xs uppercase tracking-widest"
            style={{ color: 'var(--color-primary-1)' }}
          >
            System Status
          </span>
          <div
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-xl"
            style={{ backgroundColor: 'color-mix(in oklch, var(--color-on-inverted-surface) 7%, transparent)' }}
          >
            <div
              className="w-1.5 h-1.5 rounded-xl"
              style={{ backgroundColor: 'var(--color-primary-1)' }}
            />
            <span
              className="font-mono text-2xs"
              style={{ color: 'var(--color-on-inverted-surface)', opacity: 0.7 }}
            >
              Operational
            </span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid color-mix(in oklch, var(--color-on-inverted-surface) 8%, transparent)' }} />

        {/* Services */}
        <div className="flex flex-col">
          {STATUS_SERVICES.map((svc, i) => (
            <div key={svc.name}>
              <div className="flex items-center gap-3 py-2.5">
                <div
                  className="w-2 h-2 rounded-xl shrink-0"
                  style={{ backgroundColor: svc.color }}
                />
                <span
                  className="flex-1 font-sans text-sm"
                  style={{ color: 'var(--color-on-inverted-surface)' }}
                >
                  {svc.name}
                </span>
                <span
                  className="font-mono text-xs"
                  style={{ color: svc.color }}
                >
                  {svc.status}
                </span>
              </div>
              {i < STATUS_SERVICES.length - 1 && (
                <div style={{ borderTop: '1px solid color-mix(in oklch, var(--color-on-inverted-surface) 6%, transparent)' }} />
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          className="pt-3 flex items-center justify-between"
          style={{ borderTop: '1px solid color-mix(in oklch, var(--color-on-inverted-surface) 8%, transparent)' }}
        >
          <span
            className="font-mono text-2xs uppercase tracking-wider"
            style={{ color: 'var(--color-on-inverted-surface)', opacity: 0.3 }}
          >
            System Status · Operational
          </span>
        </div>
      </div>
    </Card>
  );
}

// ─── 8. RevenueCard ───────────────────────────────────────────────────────────

// 12 data points trending upward
const REVENUE_POINTS = [28, 32, 27, 38, 35, 42, 40, 48, 44, 52, 49, 58];

function RevenueCard() {
  const w = 280;
  const h = 80;
  const pad = 4;

  const min = Math.min(...REVENUE_POINTS);
  const max = Math.max(...REVENUE_POINTS);
  const range = max - min || 1;

  const pts = REVENUE_POINTS.map((v, i) => {
    const x = pad + (i / (REVENUE_POINTS.length - 1)) * (w - pad * 2);
    const y = pad + (1 - (v - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  });

  const polyline = pts.join(' ');
  const area = `${pts[0]} ${pts.join(' ')} ${w - pad},${h + 2} ${pad},${h + 2}`;

  return (
    <Card dark delay={0.28}>
      <div className="p-5 flex flex-col gap-3">
        {/* Label */}
        <span
          className="font-mono text-xs uppercase tracking-widest"
          style={{ color: 'var(--color-primary-1)' }}
        >
          Revenue
        </span>

        {/* Number */}
        <div className="flex flex-col gap-0.5">
          <span
            className="font-display font-bold leading-none"
            style={{ fontSize: 36, color: 'var(--color-on-inverted-surface)' }}
          >
            $48,291
          </span>
          <div className="flex items-center gap-2">
            <span
              className="font-mono text-xs font-semibold"
              style={{ color: 'var(--color-primary-1)' }}
            >
              +8.3%
            </span>
            <span
              className="font-mono text-xs"
              style={{ color: 'var(--color-on-inverted-surface)', opacity: 0.4 }}
            >
              this month
            </span>
          </div>
        </div>

        {/* Chart */}
        <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ height: 80 }}>
          <defs>
            <linearGradient id="rev-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary-1)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--color-primary-1)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={area} fill="url(#rev-grad)" />
          <polyline
            points={polyline}
            fill="none"
            stroke="var(--color-primary-1)"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span
            className="font-mono text-xs"
            style={{ color: 'var(--color-on-inverted-surface)', opacity: 0.35 }}
          >
            Jan → Jun 2026
          </span>
          <ArrowUpRight size={14} style={{ color: 'var(--color-primary-1)' }} />
        </div>
      </div>
    </Card>
  );
}

// ─── 9. StorageCard ───────────────────────────────────────────────────────────

function StorageCard() {
  const cx = 70;
  const cy = 70;
  const r = 52;
  const stroke = 16;
  const circ = 2 * Math.PI * r;

  // used: 73%, free: 27%
  // Split into: used-dark (70%), accent-highlight (3%), free (27%)
  const usedDash = circ * 0.70;
  const accentDash = circ * 0.03;
  const usedOffset = 0;
  const accentOffset = -usedDash;

  return (
    <Card dark={false} delay={0.32}>
      <div className="p-5 flex flex-col gap-4">
        {/* Label */}
        <span
          className="font-mono text-xs uppercase tracking-wider"
          style={{ color: 'var(--color-on-surface-subtle-1)' }}
        >
          Storage Used
        </span>

        {/* Donut + number */}
        <div className="flex items-center gap-5">
          <div style={{ position: 'relative', width: 140, height: 140, flexShrink: 0 }}>
            <svg width={140} height={140} viewBox="0 0 140 140">
              {/* Track (free) */}
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke="var(--color-surface-3)"
                strokeWidth={stroke}
              />
              {/* Used portion */}
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke="var(--color-on-surface)"
                strokeWidth={stroke}
                strokeDasharray={`${usedDash} ${circ}`}
                strokeDashoffset={`${usedOffset}`}
                strokeLinecap="butt"
                transform={`rotate(-90 ${cx} ${cy})`}
                opacity={0.25}
              />
              {/* Accent highlight */}
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke="var(--color-primary-1)"
                strokeWidth={stroke}
                strokeDasharray={`${accentDash} ${circ}`}
                strokeDashoffset={accentOffset}
                strokeLinecap="butt"
                transform={`rotate(-90 ${cx} ${cy})`}
              />
            </svg>
            {/* Center label */}
            <div
              className="absolute inset-0 flex items-center justify-center"
            >
              <span
                className="font-display font-bold"
                style={{ fontSize: 28, color: 'var(--color-on-surface)' }}
              >
                73%
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-xl"
                  style={{ backgroundColor: 'var(--color-on-surface)', opacity: 0.3 }}
                />
                <span className="font-mono text-xs" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                  Used
                </span>
              </div>
              <span className="font-mono text-xs font-semibold" style={{ color: 'var(--color-on-surface)' }}>
                54.7 GB
              </span>
              <span className="font-mono text-xs" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
                73%
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-xl"
                  style={{ backgroundColor: 'var(--color-surface-3)' }}
                />
                <span className="font-mono text-xs" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                  Free
                </span>
              </div>
              <span className="font-mono text-xs font-semibold" style={{ color: 'var(--color-on-surface)' }}>
                20.3 GB
              </span>
              <span className="font-mono text-xs" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
                27%
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─── 10. CommitsCard ──────────────────────────────────────────────────────────

const COMMIT_DAYS = [
  { label: 'M', value: 28 },
  { label: 'T', value: 35 },
  { label: 'W', value: 42 },
  { label: 'T', value: 68, today: true },
  { label: 'F', value: 31 },
  { label: 'S', value: 18 },
  { label: 'S', value: 25 },
];

function CommitsCard() {
  const maxVal = Math.max(...COMMIT_DAYS.map((d) => d.value));

  return (
    <Card dark={false} delay={0.36}>
      <div className="p-5 flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span
            className="font-mono text-xs uppercase tracking-wider"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            Weekly Commits
          </span>
          <span
            className="font-mono text-xs font-semibold"
            style={{ color: 'var(--color-primary-1)' }}
          >
            vs avg ↑14%
          </span>
        </div>

        {/* Big number */}
        <span
          className="font-display font-bold leading-none"
          style={{ fontSize: 40, color: 'var(--color-on-surface)' }}
        >
          247
        </span>

        {/* Bar chart */}
        <div className="flex items-end gap-1.5" style={{ height: 64 }}>
          {COMMIT_DAYS.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1" style={{ height: '100%' }}>
              <div className="flex-1 w-full flex items-end">
                <div
                  className="w-full rounded-t-sm"
                  style={{
                    height: `${(day.value / maxVal) * 100}%`,
                    backgroundColor: day.today
                      ? 'var(--color-on-surface)'
                      : 'var(--color-surface-3)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Day labels */}
        <div className="flex gap-1.5">
          {COMMIT_DAYS.map((day, i) => (
            <div key={i} className="flex-1 flex justify-center">
              <span
                className="font-mono text-2xs"
                style={{
                  color: day.today ? 'var(--color-on-surface)' : 'var(--color-on-surface-subtle-2)',
                  fontWeight: day.today ? 700 : 400,
                }}
              >
                {day.label}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <span
            className="font-sans text-xs"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            This week
          </span>
          <BarChart2 size={14} style={{ color: 'var(--color-primary-1)' }} />
        </div>
      </div>
    </Card>
  );
}

// ─── 11. OnboardingCard ───────────────────────────────────────────────────────

const ONBOARDING_STEPS = [
  { label: 'Create your account', done: true },
  { label: 'Connect your repo', done: true },
  { label: 'Configure tokens', done: true },
  { label: 'Build first component', done: true },
  { label: 'Review icons', done: false, inProgress: true },
  { label: 'Ship to staging', done: false },
];

function OnboardingCard() {
  const doneCount = ONBOARDING_STEPS.filter((s) => s.done).length;
  const total = ONBOARDING_STEPS.length;
  const pct = (doneCount / total) * 100;

  return (
    <Card dark={false} delay={0.4}>
      <div className="p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span
            className="font-mono text-xs uppercase tracking-wider"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            Onboarding
          </span>
          <span
            className="font-sans text-sm"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            {doneCount} of {total} steps complete
          </span>
        </div>

        {/* Progress bar */}
        <div
          className="h-1.5 rounded-xl overflow-hidden"
          style={{ backgroundColor: 'var(--color-surface-3)' }}
        >
          <div
            className="h-full rounded-xl"
            style={{ width: `${pct}%`, backgroundColor: 'var(--color-primary-1)' }}
          />
        </div>

        {/* Steps */}
        <div className="flex flex-col">
          {ONBOARDING_STEPS.map((step, i) => (
            <div key={i}>
              <div className="flex items-center gap-3 py-2.5">
                {/* Circle indicator */}
                {step.done ? (
                  <div
                    className="w-5 h-5 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: 'var(--color-primary-1)' }}
                  >
                    <Check size={10} style={{ color: 'var(--color-on-primary)' }} />
                  </div>
                ) : (
                  <div
                    className="w-5 h-5 rounded-xl shrink-0"
                    style={{
                      backgroundColor: 'var(--color-on-surface)',
                      opacity: step.inProgress ? 1 : 0.15,
                    }}
                  />
                )}

                {/* Label */}
                <span
                  className="flex-1 font-sans text-sm"
                  style={{
                    color: step.done
                      ? 'var(--color-on-surface-subtle-1)'
                      : 'var(--color-on-surface)',
                    textDecoration: step.done ? 'line-through' : 'none',
                    opacity: step.done ? 0.5 : 1,
                  }}
                >
                  {step.label}
                </span>

                {/* In-progress dot */}
                {step.inProgress && (
                  <div
                    className="w-2 h-2 rounded-xl shrink-0"
                    style={{ backgroundColor: 'var(--color-warning-1)' }}
                  />
                )}

                {/* Done label */}
                {step.done && (
                  <span
                    className="font-mono text-xs shrink-0"
                    style={{ color: 'var(--color-primary-1)' }}
                  >
                    Done
                  </span>
                )}
              </div>
              {i < ONBOARDING_STEPS.length - 1 && (
                <div style={{ borderTop: '1px solid var(--color-border)' }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ─── 12. GaugeCard ────────────────────────────────────────────────────────────

function GaugeCard() {
  const pct = 0.68;
  const cx = 100;
  const cy = 90;
  const r = 72;
  const stroke = 14;
  const circ = Math.PI * r; // semi-circle

  const usedLen = circ * pct;
  return (
    <Card dark delay={0.44}>
      <div className="p-5 flex flex-col gap-3">
        {/* Label */}
        <span
          className="font-mono text-xs uppercase tracking-widest"
          style={{ color: 'var(--color-primary-1)' }}
        >
          CPU Usage
        </span>

        {/* SVG gauge */}
        <div className="flex justify-center">
          <svg width={200} height={110} viewBox="0 0 200 110">
            {/* Background arc */}
            <path
              d={`M ${cx - r},${cy} A ${r},${r} 0 0 1 ${cx + r},${cy}`}
              fill="none"
              stroke="color-mix(in oklch, var(--color-on-inverted-surface) 8%, transparent)"
              strokeWidth={stroke}
              strokeLinecap="round"
            />
            {/* Used arc */}
            <path
              d={`M ${cx - r},${cy} A ${r},${r} 0 0 1 ${cx + r},${cy}`}
              fill="none"
              stroke="var(--color-primary-1)"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${usedLen} ${circ}`}
            />
            {/* Percentage text */}
            <text
              x={cx}
              y={cy - 8}
              textAnchor="middle"
              fill="var(--color-on-inverted-surface)"
              fontSize={28}
              fontWeight={700}
              fontFamily="var(--font-display, sans-serif)"
            >
              68%
            </text>
            {/* Min/max labels */}
            <text x={cx - r + 2} y={cy + 16} fill="color-mix(in oklch, var(--color-on-inverted-surface) 25%, transparent)" fontSize={9} fontFamily="monospace">0%</text>
            <text x={cx + r - 20} y={cy + 16} fill="color-mix(in oklch, var(--color-on-inverted-surface) 25%, transparent)" fontSize={9} fontFamily="monospace">100%</text>
            {/* Normal range label */}
            <text x={cx} y={cy + 18} textAnchor="middle" fill="color-mix(in oklch, var(--color-on-inverted-surface) 18%, transparent)" fontSize={8} fontFamily="monospace">NORMAL RANGE</text>
          </svg>
        </div>

        {/* Subtitle */}
        <div className="flex flex-col items-center gap-1">
          <span
            className="font-sans text-sm"
            style={{ color: 'var(--color-on-inverted-surface)', opacity: 0.45 }}
          >
            68% utilized
          </span>
          <div className="flex items-center gap-1.5">
            <span
              className="font-mono text-xs font-semibold"
              style={{ color: 'var(--color-primary-1)' }}
            >
              ↓ 4%
            </span>
            <span
              className="font-mono text-xs"
              style={{ color: 'var(--color-on-inverted-surface)', opacity: 0.4 }}
            >
              vs yesterday
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─── 13. LeaderboardCard ─────────────────────────────────────────────────────

const LEADERBOARD = [
  { rank: 1, initials: 'JK', name: 'Jan Kvalt', score: 2847, highlight: true },
  { rank: 2, initials: 'MC', name: 'Maya Chen', score: 2241 },
  { rank: 3, initials: 'AK', name: 'Alex Kim', score: 1988 },
  { rank: 4, initials: 'RP', name: 'Riya Patel', score: 1654 },
  { rank: 5, initials: 'LM', name: 'Luca M.', score: 1203 },
];

function LeaderboardCard() {
  return (
    <Card dark={false} delay={0.48}>
      <div className="p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span
            className="font-display font-bold"
            style={{ fontSize: 16, color: 'var(--color-on-surface)' }}
          >
            Leaderboard
          </span>
          <span
            className="font-sans text-xs"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            This sprint
          </span>
        </div>

        {/* Rows */}
        <div className="flex flex-col gap-1">
          {LEADERBOARD.map((entry) => (
            <div
              key={entry.rank}
              className="flex items-center gap-3 px-2 py-2 rounded-lg"
              style={{
                backgroundColor: entry.highlight
                  ? 'var(--color-warning-secondary-1)'
                  : 'transparent',
              }}
            >
              {/* Rank */}
              <span
                className="font-mono text-sm w-5 text-center"
                style={{
                  color: entry.highlight
                    ? 'var(--color-warning-1)'
                    : 'var(--color-on-surface-subtle-2)',
                  fontWeight: entry.highlight ? 700 : 400,
                }}
              >
                #{entry.rank}
              </span>

              {/* Avatar */}
              <UserAvatar
                initials={entry.initials}
                size="sm"
                style={{ backgroundColor: AVATAR_COLORS[entry.initials] }}
              />

              {/* Name */}
              <span
                className="flex-1 font-sans text-sm"
                style={{ color: 'var(--color-on-surface)' }}
              >
                {entry.name}
              </span>

              {/* Score */}
              <span
                className="font-mono text-sm font-semibold"
                style={{ color: 'var(--color-on-surface)' }}
              >
                {entry.score.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ─── 14. KPISnapshotCard ──────────────────────────────────────────────────────

const KPI_METRICS = [
  {
    label: 'Revenue',
    badge: '+18.4%',
    badgeColor: 'var(--color-primary-1)',
    badgeBg: 'var(--color-primary-secondary-1)',
    value: '$48.2K',
    sub: '↑ from $40.7K',
  },
  {
    label: 'Active Users',
    badge: '+7.2%',
    badgeColor: 'var(--color-primary-1)',
    badgeBg: 'var(--color-primary-secondary-1)',
    value: '12,847',
    sub: '↑ from 11,983',
  },
  {
    label: 'Churn Rate',
    badge: '-0.4pp',
    badgeColor: 'var(--color-error-1)',
    badgeBg: 'var(--color-error-secondary-1)',
    value: '2.1%',
    sub: '↓ from 2.5%',
  },
];

function KPISnapshotCard() {
  return (
    <Card dark={false} delay={0.52}>
      <div className="p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span
            className="font-mono text-xs uppercase tracking-wider"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            KPI Snapshot
          </span>
          <span
            className="font-sans text-xs"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            Mar vs Feb 2026
          </span>
        </div>

        {/* Metrics */}
        <div className="flex flex-col">
          {KPI_METRICS.map((metric, i) => (
            <div key={metric.label}>
              <div className="flex items-center gap-3 py-3">
                {/* Badge */}
                <span
                  className="font-mono text-xs font-semibold px-2 py-0.5 rounded-xl shrink-0"
                  style={{
                    color: metric.badgeColor,
                    backgroundColor: metric.badgeBg,
                  }}
                >
                  {metric.badge}
                </span>

                {/* Label */}
                <span
                  className="font-sans text-sm flex-1"
                  style={{ color: 'var(--color-on-surface-subtle-1)' }}
                >
                  {metric.label}
                </span>

                {/* Value + sub */}
                <div className="flex flex-col items-end gap-0.5">
                  <span
                    className="font-display font-bold"
                    style={{ fontSize: 16, color: 'var(--color-on-surface)' }}
                  >
                    {metric.value}
                  </span>
                  <span
                    className="font-mono text-xs"
                    style={{ color: 'var(--color-on-surface-subtle-2)' }}
                  >
                    {metric.sub}
                  </span>
                </div>
              </div>
              {i < KPI_METRICS.length - 1 && (
                <div style={{ borderTop: '1px solid var(--color-border)' }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ─── 15. AnomalyCard ─────────────────────────────────────────────────────────

const ANOMALY_BARS = [18, 22, 15, 20, 17, 19, 16, 21, 18, 20, 84, 24];
const ANOMALY_SPIKE_INDEX = 10;

function AnomalyCard() {
  const [dismissed, setDismissed] = useState(false);
  const maxBar = Math.max(...ANOMALY_BARS);

  if (dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ ...spring.default }}
      style={{
        backgroundColor: 'var(--color-surface-1)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-small-1)',
        overflow: 'hidden',
      }}
    >
      <div className="p-5 flex flex-col gap-3">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TriangleAlert size={18} style={{ color: 'var(--color-warning-1)', flexShrink: 0 }} />
            <span
              className="font-display font-bold text-headline-s"
              style={{ color: 'var(--color-on-surface)' }}
            >
              Anomaly detected
            </span>
          </div>
          <span
            className="font-sans text-sm font-semibold px-2.5 py-0.5"
            style={{
              backgroundColor: 'var(--color-warning-secondary-1)',
              color: 'var(--color-warning-2)',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            High
          </span>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-0.5">
          <span
            className="font-sans text-md"
            style={{ color: 'var(--color-on-surface)' }}
          >
            API error rate 8.3× above baseline · 2:14 AM
          </span>
          <span
            className="font-sans text-md"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            Began 22 minutes ago · 3 services affected
          </span>
        </div>

        {/* Bar chart */}
        <div className="flex items-end gap-1.5 h-12 pt-1">
          {ANOMALY_BARS.map((val, i) => {
            const isSpike = i === ANOMALY_SPIKE_INDEX;
            const heightPct = (val / maxBar) * 100;
            return (
              <motion.div
                key={i}
                className="flex-1 rounded-sm"
                style={{
                  height: `${heightPct}%`,
                  backgroundColor: isSpike
                    ? 'var(--color-warning-1)'
                    : 'var(--color-surface-3)',
                }}
                {...(isSpike && {
                  animate: { opacity: [1, 0.6, 1] },
                  transition: {
                    duration: 1.4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                })}
              />
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-1">
          <button
            className="font-sans text-md font-semibold"
            style={{ color: 'var(--color-primary-2)' }}
          >
            View logs
          </button>
          <button
            className="font-sans text-md"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
            onClick={() => setDismissed(true)}
          >
            Dismiss
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg)',
        padding: '32px',
        minHeight: '100vh',
      }}
    >
      <div className="flex flex-col gap-4">

        {/* Row 1: StatCard, FeatureCard, TicketCard */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard />
          <FeatureCard />
          <TicketCard />
        </div>

        {/* Row 2: ActivityCard, CodeCard */}
        <div className="grid grid-cols-2 gap-4">
          <ActivityCard />
          <CodeCard />
        </div>

        {/* Row 3: PricingCard, StatusCard */}
        <div className="grid grid-cols-2 gap-4">
          <PricingCard />
          <StatusCard />
        </div>

        {/* Row 4: RevenueCard, StorageCard, CommitsCard */}
        <div className="grid grid-cols-3 gap-4">
          <RevenueCard />
          <StorageCard />
          <CommitsCard />
        </div>

        {/* Row 5: OnboardingCard + AnomalyCard */}
        <div className="grid grid-cols-2 gap-4">
          <OnboardingCard />
          <AnomalyCard />
        </div>

        {/* Row 6: GaugeCard, LeaderboardCard, KPISnapshotCard */}
        <div className="grid grid-cols-3 gap-4">
          <GaugeCard />
          <LeaderboardCard />
          <KPISnapshotCard />
        </div>

      </div>
    </div>
  );
}
