import type { ComponentType, ReactNode } from 'react';
import {
  PhoneIncoming, Timer, Users, BarChart3, Monitor, GitBranch, Eye, Sparkles,
  Smartphone, ShoppingCart, Wrench, ShieldCheck, Stethoscope, Antenna,
  Headphones, MapPin, TrendingUp, Clock, Headset, type LucideProps,
} from 'lucide-react';
import { RevealLines } from '@/marketing/motion/RevealLines';

/**
 * Shared building blocks for the BC4 homepage sections — keeps the 12 sections
 * consistent and free of repeated boilerplate. Colors come from the bc4
 * character tokens; on-navy accents use the --bc4-* tokens.
 */

// ─── Icon resolver — content stores lucide names as strings ──────────────────
const ICONS: Record<string, ComponentType<LucideProps>> = {
  PhoneIncoming, Timer, Users, BarChart3, Monitor, GitBranch, Eye, Sparkles,
  Smartphone, ShoppingCart, Wrench, ShieldCheck, Stethoscope, Antenna,
  Headphones, MapPin, TrendingUp, Clock, Headset,
};

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Cmp = ICONS[name] ?? Sparkles;
  return <Cmp {...props} />;
}

// ─── Bounded container — 1200px content, 24px gutters (handoff spec) ──────────
export function Bound({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1200px] px-6 ${className}`}>{children}</div>;
}

// Vertical section rhythm: clamp(56px, 8vw, 104px)
export const SECTION_PAD = 'py-[clamp(56px,8vw,104px)]';

// ─── Mono eyebrow — JetBrains Mono data label ────────────────────────────────
export function MonoEyebrow({
  children,
  tone = 'primary',
  className = '',
}: {
  children: ReactNode;
  tone?: 'primary' | 'on-dark';
  className?: string;
}) {
  const color = tone === 'on-dark' ? 'text-[var(--bc4-accent-softer)]' : 'text-[var(--color-primary-1)]';
  return (
    <span
      className={`font-mono text-[12px] font-semibold uppercase tracking-[0.06em] ${color} ${className}`}
    >
      {children}
    </span>
  );
}

// ─── Section intro — eyebrow + heading (+ optional lead), with line reveal ────
export function SectionIntro({
  eyebrow,
  headline,
  lead,
  tone = 'light',
  align = 'left',
  className = '',
  headingId,
}: {
  eyebrow?: ReactNode;
  headline?: string;
  lead?: string;
  tone?: 'light' | 'dark';
  align?: 'left' | 'center';
  className?: string;
  headingId?: string;
}) {
  const headColor = tone === 'dark' ? 'text-white' : 'text-[var(--color-on-surface)]';
  const leadColor = tone === 'dark' ? 'text-[var(--bc4-accent-soft)]' : 'text-[var(--color-on-surface-subtle-1)]';
  return (
    <div
      className={`flex flex-col gap-[14px] ${align === 'center' ? 'items-center text-center' : ''} ${className}`}
    >
      {eyebrow && <MonoEyebrow tone={tone === 'dark' ? 'on-dark' : 'primary'}>{eyebrow}</MonoEyebrow>}
      {headline && (
        <RevealLines
          as="h2"
          id={headingId}
          className={`m-0 font-display text-[clamp(1.75rem,1rem+2vw,2.5rem)] font-extrabold leading-[1.12] tracking-[-0.02em] text-balance ${headColor}`}
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {headline}
        </RevealLines>
      )}
      {lead && (
        <RevealLines
          as="p"
          className={`m-0 text-[17px] leading-[1.6] ${leadColor} ${align === 'center' ? 'max-w-[640px]' : ''}`}
        >
          {lead}
        </RevealLines>
      )}
    </div>
  );
}

// ─── Check icon — used in tier + feature checklists ──────────────────────────
export function Check({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      style={{ flex: 'none' }}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
