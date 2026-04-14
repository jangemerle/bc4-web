/**
 * CharactersPage — Foundations page for the Character (Faces) system.
 *
 * Shows all registered characters, their token overrides, the seed → derive
 * pipeline, and lets the viewer switch live to feel each personality.
 */

import { useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Palette, Sparkles, ArrowRight, Type, Radius, Sun, Moon } from 'lucide-react';
import { PageHero } from '../../layouts/PageHero';
import { Card, SectionTitle, Spec } from '../../layouts/DocHelpers';
import { FullBleed } from '../../layouts/FullBleed';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { useCharacter } from '../../characters';
import { characterRegistry } from '../../characters/characters';
import { spring } from '../../tokens/motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import type { Character } from '../../characters/types';

// ─── Constants ──────────────────────────────────────────────────────────────

const TOKEN_GROUPS = [
  { label: 'Colors', count: 37, icon: Palette },
  { label: 'Radius', count: 5, icon: Radius },
  { label: 'Shadows', count: 9, icon: Sun },
  { label: 'Fonts', count: 3, icon: Type },
] as const;

const SEED_FIELDS = [
  { field: 'primaryHue', type: 'number', desc: 'Hue angle 0–360 for the brand color' },
  { field: 'primaryChroma', type: 'enum', desc: 'Vivid · Balanced · Muted · Pastel' },
  { field: 'radius', type: 'object', desc: '{ s, m, lg, xl } — the shape personality' },
  { field: 'fonts', type: 'object', desc: '{ display, body, brand } — three type roles' },
  { field: 'surfaceHue', type: 'number', desc: 'Optional — hue tint for neutral surfaces' },
  { field: 'surfaceChromaPercent', type: 'number', desc: '0 = pure grey, 0.12 = subtle tint' },
  { field: 'shadowRgb', type: 'string', desc: '"R,G,B" — shadow color tint' },
  { field: 'onPrimaryOverride', type: 'enum', desc: 'Force white or dark text on buttons' },
];

// ─── Subcomponents ──────────────────────────────────────────────────────────

function CharacterCard({
  character,
  isActive,
  onSelect,
  index,
}: {
  character: Character;
  isActive: boolean;
  onSelect: () => void;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const reducedMotion = useReducedMotion();
  const m = character.manifest;
  const vars = character.variables;
  const primaryColor = m.preview?.primaryColor ?? vars['--color-primary-1'] ?? 'var(--color-primary-1)';
  const bgColor = m.preview?.backgroundColor ?? vars['--color-bg'] ?? 'var(--color-bg)';
  const textColor = m.preview?.textColor ?? vars['--color-on-surface'] ?? 'var(--color-on-surface)';
  const radiusM = vars['--radius-m'] ?? m.preview?.radius ?? '8px';
  const fontDisplay = vars['--font-display'] ?? 'inherit';

  return (
    <motion.div
      ref={ref}
      className="relative cursor-pointer group"
      initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        type: 'spring',
        visualDuration: spring.default.visualDuration,
        bounce: spring.default.bounce,
        delay: index * 0.06,
      }}
      onClick={onSelect}
    >
      <div
        className="overflow-hidden transition-shadow duration-150"
        style={{
          borderRadius: radiusM,
          border: isActive
            ? `2px solid ${primaryColor}`
            : '2px solid var(--color-border)',
          backgroundColor: bgColor,
        }}
      >
        {/* Color strip */}
        <div className="h-2" style={{ backgroundColor: primaryColor }} />

        {/* Content */}
        <div className="px-6 py-5">
          {/* Name + active badge */}
          <div className="flex items-center gap-2 mb-1">
            <h3
              className="font-bold text-base leading-tight"
              style={{ color: textColor, fontFamily: fontDisplay }}
            >
              {m.displayName}
            </h3>
            {isActive && <Badge variant="accent" size="sm">Active</Badge>}
          </div>

          {/* Personality */}
          <p
            className="font-sans text-sm leading-relaxed mb-4"
            style={{ color: textColor, opacity: 0.6 }}
          >
            {m.personality}
          </p>

          {/* Token pills row */}
          <div className="flex gap-1.5 flex-wrap">
            {(m.tags ?? []).slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] px-2 py-0.5"
                style={{
                  borderRadius: radiusM,
                  backgroundColor: primaryColor,
                  color: vars['--color-on-primary'] ?? '#fff',
                  opacity: 0.85,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Radius preview */}
          <div className="flex gap-3 mt-4 items-end">
            {['--radius-s', '--radius-m', '--radius-lg', '--radius-xl'].map((token) => {
              const val = vars[token];
              if (!val) return null;
              return (
                <div key={token} className="flex flex-col items-center gap-1">
                  <div
                    className="w-8 h-8"
                    style={{
                      borderRadius: val === '9999px' ? '9999px' : val,
                      backgroundColor: primaryColor,
                      opacity: 0.2,
                    }}
                  />
                  <span className="font-mono text-[9px]" style={{ color: textColor, opacity: 0.4 }}>
                    {val === '9999px' ? 'pill' : val}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hover arrow */}
      <div
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
      >
        <ArrowRight size={14} style={{ color: primaryColor }} />
      </div>
    </motion.div>
  );
}

function TokenPreviewRow({ token, value }: { label?: string; token: string; value: string }) {
  const isColor = value.startsWith('oklch') || value.startsWith('#') || value.startsWith('rgb');
  const isShadow = token.includes('shadow');
  const isRadius = token.includes('radius');

  return (
    <div className="flex items-center gap-4 py-2">
      <span
        className="font-mono text-xs w-56 shrink-0 truncate"
        style={{ color: 'var(--color-on-surface-subtle-1)' }}
      >
        {token}
      </span>
      {isColor && (
        <div
          className="w-5 h-5 rounded-full shrink-0"
          style={{ backgroundColor: value, border: '1px solid var(--color-border)' }}
        />
      )}
      {isShadow && (
        <div
          className="w-5 h-5 rounded-m shrink-0"
          style={{ backgroundColor: 'var(--color-surface-1)', boxShadow: value }}
        />
      )}
      {isRadius && (
        <div
          className="w-5 h-5 shrink-0"
          style={{
            borderRadius: value === '9999px' ? '9999px' : value,
            backgroundColor: 'var(--color-primary-1)',
            opacity: 0.3,
          }}
        />
      )}
      <span
        className="font-mono text-xs truncate"
        style={{ color: 'var(--color-on-surface-subtle-2)' }}
      >
        {value}
      </span>
    </div>
  );
}

function PipelineDiagram() {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      {[
        { label: 'CharacterSeed', desc: '~8 decisions', icon: Sparkles },
        { label: 'deriveCharacter()', desc: 'OKLCH engine', icon: Palette },
        { label: 'Character', desc: '~53 CSS vars', icon: Sun },
        { label: '<style> on :root', desc: 'Live in DOM', icon: Moon },
      ].map((step, i) => (
        <div key={step.label} className="flex items-center gap-4">
          {i > 0 && (
            <ArrowRight
              size={16}
              style={{ color: 'var(--color-on-surface-subtle-2)' }}
            />
          )}
          <div
            className="px-4 py-3 rounded-lg"
            style={{
              backgroundColor: i === 1 ? 'var(--color-primary-1)' : 'var(--color-surface-3)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div className="flex items-center gap-2 mb-0.5">
              <step.icon
                size={14}
                style={{
                  color: i === 1 ? 'var(--color-on-primary)' : 'var(--color-on-surface)',
                }}
              />
              <span
                className="font-display font-bold text-sm"
                style={{
                  color: i === 1 ? 'var(--color-on-primary)' : 'var(--color-on-surface)',
                }}
              >
                {step.label}
              </span>
            </div>
            <span
              className="font-sans text-xs"
              style={{
                color: i === 1 ? 'var(--color-on-primary)' : 'var(--color-on-surface-subtle-1)',
                opacity: i === 1 ? 0.8 : 1,
              }}
            >
              {step.desc}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Token inspector ────────────────────────────────────────────────────────

type TokenCategory = 'colors' | 'radius' | 'shadows' | 'fonts';

function tokenCategory(key: string): TokenCategory {
  if (key.startsWith('--color-') || key.startsWith('--gradient-')) return 'colors';
  if (key.startsWith('--radius-')) return 'radius';
  if (key.startsWith('--shadow-')) return 'shadows';
  if (key.startsWith('--font-')) return 'fonts';
  return 'colors';
}

function TokenInspector({ character }: { character: Character }) {
  const [filter, setFilter] = useState<TokenCategory | 'all'>('all');
  const entries = Object.entries(character.variables);

  const filtered = filter === 'all'
    ? entries
    : entries.filter(([k]) => tokenCategory(k) === filter);

  if (entries.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="font-sans text-sm" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
          Kvalt Default uses base tokens — no overrides needed.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {(['all', 'colors', 'radius', 'shadows', 'fonts'] as const).map((cat) => (
          <button
            key={cat}
            className="font-sans text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors duration-150"
            style={{
              backgroundColor: filter === cat ? 'var(--color-primary-1)' : 'var(--color-surface-3)',
              color: filter === cat ? 'var(--color-on-primary)' : 'var(--color-on-surface-subtle-1)',
            }}
            onClick={() => setFilter(cat)}
          >
            {cat === 'all' ? `All (${entries.length})` : cat}
          </button>
        ))}
      </div>

      {/* Token list */}
      <div className="max-h-[400px] overflow-y-auto pr-2">
        {filtered.map(([token, value]) => (
          <TokenPreviewRow key={token} label={token} token={token} value={value} />
        ))}
      </div>
    </div>
  );
}

// ─── Main page ──────────────────────────────────────────────────────────────

export default function CharactersPage() {
  const { current, setCharacter } = useCharacter();
  const [inspectedName, setInspectedName] = useState<string>(current.manifest.name);
  const inspected = characterRegistry.find(c => c.manifest.name === inspectedName) ?? current;

  // Count seed-derived vs manual
  const seedDerived = characterRegistry.filter(c => {
    // Seed-derived characters have darkVariables; manual ones (kvalt-default, ink, haze) don't
    return c.darkVariables && Object.keys(c.darkVariables).length > 0;
  });

  return (
    <>
      <PageHero
        title="Characters"
        subtitle="One system. Six personalities."
        description="A character is a portable design configuration that transforms the entire UI by overriding CSS custom properties. Pick a hue, a radius scale, and fonts — the derivation engine computes the rest. Colors, shadows, surfaces, dark mode — all from ~8 decisions."
      />

      {/* ── Overview stats ─────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {TOKEN_GROUPS.map(({ label, count, icon: Icon }) => (
          <Card key={label}>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'var(--color-surface-3)' }}
              >
                <Icon size={18} style={{ color: 'var(--color-primary-1)' }} />
              </div>
              <div>
                <p className="font-display font-bold text-lg" style={{ color: 'var(--color-on-surface)' }}>
                  {count}
                </p>
                <p className="font-sans text-xs" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
                  {label} tokens
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ── Character gallery ──────────────── */}
      <SectionTitle>Character gallery</SectionTitle>
      <Spec>Click any character to inspect its tokens. Click "Apply" to switch the entire DS live.</Spec>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {characterRegistry.map((char, i) => (
          <CharacterCard
            key={char.manifest.name}
            character={char}
            isActive={current.manifest.name === char.manifest.name}
            onSelect={() => setInspectedName(char.manifest.name)}
            index={i}
          />
        ))}
      </div>

      {/* Apply button */}
      {inspectedName !== current.manifest.name && (
        <div className="flex gap-3 mb-16">
          <Button
            variant="primary"
            onClick={() => setCharacter(inspectedName)}
          >
            Apply {inspected.manifest.displayName}
          </Button>
          <Button
            variant="secondary"
            onClick={() => setInspectedName(current.manifest.name)}
          >
            Cancel
          </Button>
        </div>
      )}

      {/* ── Token inspector ────────────────── */}
      <FullBleed bg="var(--color-surface-2)">
        <SectionTitle>Token inspector — {inspected.manifest.displayName}</SectionTitle>
        <Card>
          <Spec>
            {Object.keys(inspected.variables).length} overrides
            {inspected.darkVariables ? ` · ${Object.keys(inspected.darkVariables).length} dark mode inversions` : ''}
          </Spec>
          <TokenInspector character={inspected} />
        </Card>
      </FullBleed>

      {/* ── Pipeline ───────────────────────── */}
      <div className="mt-16" />
      <SectionTitle>Derivation pipeline</SectionTitle>
      <Spec>
        {seedDerived.length} of {characterRegistry.length} characters use the seed → derive pipeline.
        The rest are hand-tuned for effects the algorithm can't express (glassmorphism, editorial subtlety).
      </Spec>
      <Card>
        <PipelineDiagram />
      </Card>

      {/* ── Seed anatomy ───────────────────── */}
      <div className="mt-16" />
      <SectionTitle>Seed anatomy</SectionTitle>
      <Spec>These ~8 fields are all you need. Everything else is computed.</Spec>
      <Card>
        <div className="space-y-3">
          {SEED_FIELDS.map((f) => (
            <div key={f.field} className="flex items-baseline gap-4">
              <span
                className="font-mono text-sm font-semibold w-48 shrink-0"
                style={{ color: 'var(--color-primary-1)' }}
              >
                {f.field}
              </span>
              <span
                className="font-mono text-xs px-2 py-0.5 rounded-s"
                style={{
                  backgroundColor: 'var(--color-surface-3)',
                  color: 'var(--color-on-surface-subtle-1)',
                }}
              >
                {f.type}
              </span>
              <span
                className="font-sans text-sm"
                style={{ color: 'var(--color-on-surface-subtle-2)' }}
              >
                {f.desc}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* ── How it works ───────────────────── */}
      <div className="mt-16" />
      <SectionTitle>How switching works</SectionTitle>
      <Card>
        <div className="space-y-4">
          {[
            { step: '1', text: 'CharacterProvider wraps the app and creates a React context.' },
            { step: '2', text: 'On character change, a <style> tag is injected into <head> overriding :root CSS variables.' },
            { step: '3', text: 'For dark mode, a .dark {} block with inverted surfaces is also injected.' },
            { step: '4', text: 'Since every component uses var(--color-*) tokens, the entire UI updates instantly.' },
            { step: '5', text: 'Selection persists to localStorage — survives page refresh.' },
          ].map(({ step, text }) => (
            <div key={step} className="flex gap-4 items-start">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: 'var(--color-primary-1)' }}
              >
                <span className="font-display font-bold text-xs" style={{ color: 'var(--color-on-primary)' }}>
                  {step}
                </span>
              </div>
              <p className="font-sans text-sm" style={{ color: 'var(--color-on-surface)' }}>
                {text}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
