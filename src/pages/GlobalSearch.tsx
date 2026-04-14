/**
 * GlobalSearch — Command Palette for The Quill & Ledger
 *
 * A Spotlight-style search overlay built from Kvalt DS components:
 *   - Modal (bare + contained) for the overlay, panel, animation, focus-trap, Esc
 *   - SearchInput for the main query field
 *   - Button for the quick-browse shortcuts
 *   - Badge for contract / person status
 *   - UserAvatar for people results
 *   - LoadingIndicator (illustration) for the searching state
 *
 * States:
 *   idle       — empty query; recent searches + browse categories
 *   searching  — debouncing; searching illustration + "Searching…"
 *   results    — grouped contract + people rows with keyboard navigation
 *   empty      — no matches; friendly copy
 *
 * Keyboard:
 *   ↑↓    navigate results
 *   Enter  select (no-op in demo)
 *   Esc    clear query (handled by Modal)
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Users, Clock, ArrowUpRight } from 'lucide-react';
import { Modal } from '../components/Modal';
import { SearchInput } from '../components/SearchInput';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { UserAvatar } from '../components/UserAvatar';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { Icon } from '../components/Icon';
import { cn } from '../lib/cn';
import { duration } from '../tokens/motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { demoContracts, demoTeam, type DemoContract, type DemoUser } from '../data/demo';

// ─── Types ────────────────────────────────────────────────────────────────────

type SearchState = 'idle' | 'searching' | 'results' | 'empty';

// ─── Constants ────────────────────────────────────────────────────────────────

const SEARCH_DELAY = 550;
const ILLUSTRATION = 'person-looking-through-a-magnifying-glass-to-find-information-searching-for-something';

const SEARCH_PLACEHOLDERS = [
  'What are you after?',
  "Don't scroll, search",
  'Where to?',
  "It's in here somewhere",
  'Find the thing',
];

const randomPlaceholder = SEARCH_PLACEHOLDERS[Math.floor(Math.random() * SEARCH_PLACEHOLDERS.length)];

const recentSearches = ['Meridian Capital', 'NDA', 'Mara Okafor'];

const quickCategories = [
  { label: 'Contracts', icon: FileText, query: 'signed' },
  { label: 'Legal team', icon: Users,   query: 'legal'  },
];

// ─── Search logic ─────────────────────────────────────────────────────────────

function filterContracts(q: string): DemoContract[] {
  const lq = q.toLowerCase();
  return demoContracts.filter(
    (c) =>
      c.title.toLowerCase().includes(lq) ||
      c.counterparty.toLowerCase().includes(lq) ||
      c.type.toLowerCase().includes(lq) ||
      c.status.toLowerCase().includes(lq) ||
      c.owner.toLowerCase().includes(lq),
  );
}

function filterPeople(q: string): DemoUser[] {
  const lq = q.toLowerCase();
  return demoTeam.filter(
    (p) =>
      p.name.toLowerCase().includes(lq) ||
      p.role.toLowerCase().includes(lq) ||
      p.department.toLowerCase().includes(lq) ||
      p.email.toLowerCase().includes(lq),
  );
}

function contractStatusVariant(status: string): 'accent' | 'neutral' {
  if (status === 'Signed') return 'accent';
  if (status === 'Expired' || status === 'Terminated') return 'neutral';
  if (status === 'In Review' || status === 'Pending Signature') return 'neutral';
  return 'neutral';
}

function personStatusVariant(status: string): 'accent' | 'neutral' {
  if (status === 'Active') return 'accent';
  if (status === 'Pending') return 'neutral';
  return 'neutral';
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function SectionLabel({
  icon: IconComp,
  label,
  count,
}: {
  icon: typeof FileText;
  label: string;
  count: number;
}) {
  return (
    <div className="flex items-center gap-2 px-4 pt-3 pb-1">
      <Icon icon={IconComp} size="sm" style={{ color: 'var(--color-on-surface-subtle-2)' }} />
      <span
        className="font-sans text-xs font-semibold uppercase tracking-widest"
        style={{ color: 'var(--color-on-surface-subtle-2)' }}
      >
        {label}
      </span>
      <span
        className="font-sans text-xs font-medium ml-auto"
        style={{ color: 'var(--color-on-surface-subtle-2)' }}
      >
        {count}
      </span>
    </div>
  );
}

function ResultRow({
  selected,
  onMouseEnter,
  onClick,
  children,
}: {
  selected: boolean;
  onMouseEnter: () => void;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={cn(
        'w-full flex items-center gap-3 px-4 py-2.5 text-left cursor-pointer transition-colors duration-100',
        'outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-primary-1)]',
      )}
      style={{ backgroundColor: selected ? 'var(--color-surface-2)' : 'transparent' }}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// ─── State panels ─────────────────────────────────────────────────────────────

function IdlePanel({
  onSelectQuery,
  reducedMotion,
}: {
  onSelectQuery: (q: string) => void;
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      key="idle"
      className="px-2 py-3"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: duration.fast }}
    >
      {/* Recent searches */}
      <div className="px-3 pb-1">
        <span
          className="font-sans text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--color-on-surface-subtle-2)' }}
        >
          Recent
        </span>
      </div>

      {recentSearches.map((term) => (
        <button
          key={term}
          type="button"
          onClick={() => onSelectQuery(term)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-m cursor-pointer transition-colors duration-100 hover:bg-[var(--color-surface-2)]"
        >
          <Icon icon={Clock} size="sm" style={{ color: 'var(--color-on-surface-subtle-2)' }} />
          <span
            className="font-sans text-md font-medium flex-1 text-left"
            style={{ color: 'var(--color-on-surface)' }}
          >
            {term}
          </span>
          <Icon icon={ArrowUpRight} size="sm" style={{ color: 'var(--color-on-surface-subtle-2)' }} />
        </button>
      ))}

      {/* Browse categories — using Button component */}
      <div className="px-3 pt-4 pb-2">
        <span
          className="font-sans text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--color-on-surface-subtle-2)' }}
        >
          Browse
        </span>
      </div>

      <div className="flex gap-2 px-3 pb-1">
        {quickCategories.map(({ label, icon: IconComp, query }) => (
          <Button
            key={label}
            variant="secondary"
            size="sm"
            iconLeft={IconComp}
            onClick={() => onSelectQuery(query)}
          >
            {label}
          </Button>
        ))}
      </div>
    </motion.div>
  );
}

function SearchingPanel({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.div
      key="searching"
      className="flex flex-col items-center justify-center py-10"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: duration.fast }}
    >
      <LoadingIndicator
        variant="illustration"
        size="md"
        illustrationName={ILLUSTRATION}
        shimmerLabel
      />
    </motion.div>
  );
}

function ResultsPanel({
  contracts,
  people,
  selectedIndex,
  onHover,
  reducedMotion,
}: {
  contracts: DemoContract[];
  people: DemoUser[];
  selectedIndex: number;
  onHover: (i: number) => void;
  reducedMotion: boolean;
}) {
  let cursor = 0;

  return (
    <motion.div
      key="results"
      className="py-1 overflow-y-auto"
      style={{ maxHeight: 380 }}
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: duration.fast }}
    >
      {contracts.length > 0 && (
        <>
          <SectionLabel icon={FileText} label="Contracts" count={contracts.length} />
          {contracts.map((c) => {
            const idx = cursor++;
            return (
              <ResultRow key={c.id} selected={selectedIndex === idx} onMouseEnter={() => onHover(idx)}>
                <div
                  className="w-8 h-8 rounded-m flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'var(--color-surface-3)' }}
                >
                  <Icon icon={FileText} size="sm" style={{ color: 'var(--color-on-surface-subtle-1)' }} />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-sans text-sm font-semibold truncate" style={{ color: 'var(--color-on-surface)' }}>
                    {c.title}
                  </span>
                  <span className="font-sans text-xs font-medium truncate" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                    {c.counterparty} · {c.type}
                  </span>
                </div>
                <Badge variant={contractStatusVariant(c.status)} size="sm">{c.status}</Badge>
              </ResultRow>
            );
          })}
        </>
      )}

      {people.length > 0 && (
        <>
          <SectionLabel icon={Users} label="People" count={people.length} />
          {people.map((p) => {
            const idx = cursor++;
            return (
              <ResultRow key={p.id} selected={selectedIndex === idx} onMouseEnter={() => onHover(idx)}>
                <UserAvatar size="sm" initials={p.initials} />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-sans text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>
                    {p.name}
                  </span>
                  <span className="font-sans text-xs font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                    {p.role} · {p.department}
                  </span>
                </div>
                <Badge variant={personStatusVariant(p.status)} size="sm">{p.status}</Badge>
              </ResultRow>
            );
          })}
        </>
      )}

      <div className="h-1" />
    </motion.div>
  );
}

function EmptyPanel({ query, reducedMotion }: { query: string; reducedMotion: boolean }) {
  return (
    <motion.div
      key="empty"
      className="flex flex-col items-center justify-center py-10 gap-1.5"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: duration.fast }}
    >
      <span className="font-sans text-md font-semibold" style={{ color: 'var(--color-on-surface)' }}>
        No results for &ldquo;{query}&rdquo;
      </span>
      <span className="font-sans text-sm font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
        Try different keywords or check the spelling
      </span>
    </motion.div>
  );
}

// ─── Keyboard hints footer ────────────────────────────────────────────────────

function KeyboardHints() {
  return (
    <div className="flex items-center gap-5 w-full">
      {[
        { keys: ['↑', '↓'], label: 'navigate' },
        { keys: ['↵'],       label: 'select'   },
        { keys: ['Esc'],     label: 'clear'     },
      ].map(({ keys, label }) => (
        <div key={label} className="flex items-center gap-1.5">
          {keys.map((k) => (
            <kbd
              key={k}
              className="font-sans text-xs font-semibold px-1.5 py-0.5 rounded-s"
              style={{
                backgroundColor: 'var(--color-surface-1)',
                color: 'var(--color-on-surface-subtle-1)',
                border: '1px solid var(--color-border)',
                lineHeight: 1.5,
              }}
            >
              {k}
            </kbd>
          ))}
          <span className="font-sans text-xs font-medium" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Background — blurred app content behind the palette ─────────────────────

function BackgroundApp() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
      <div className="absolute left-0 top-0 bottom-0 w-52" style={{ backgroundColor: 'var(--color-surface-2)' }}>
        <div className="pt-6 px-4 flex flex-col gap-3">
          {[80, 60, 70, 55, 65, 50].map((w, i) => (
            <div key={i} className="h-3 rounded-full" style={{ width: `${w}%`, backgroundColor: 'var(--color-surface-3)' }} />
          ))}
        </div>
      </div>
      <div className="absolute left-52 right-0 top-0 bottom-0">
        <div
          className="h-14 flex items-center gap-3 px-6 border-b"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-1)' }}
        >
          {[120, 80].map((w, i) => (
            <div key={i} className="h-8 rounded-m" style={{ width: w, backgroundColor: 'var(--color-surface-3)' }} />
          ))}
        </div>
        <div
          className="h-10 flex items-center gap-4 px-6 border-b"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-2)' }}
        >
          {[22, 28, 14, 14, 12].map((pct, i) => (
            <div key={i} className="h-2.5 rounded-full" style={{ width: `${pct}%`, backgroundColor: 'var(--color-surface-3)' }} />
          ))}
        </div>
        {demoContracts.slice(0, 6).map((c, i) => (
          <div
            key={c.id}
            className="h-12 flex items-center gap-4 px-6 border-b"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: i % 2 === 1 ? 'var(--color-surface-2)' : 'var(--color-surface-1)',
            }}
          >
            <div className="h-2.5 rounded-full flex-[22]" style={{ backgroundColor: 'var(--color-surface-3)' }} />
            <div className="h-2 rounded-full flex-[28]" style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.7 }} />
            <div className="h-2 rounded-full flex-[14]" style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.7 }} />
            <div className="h-2 rounded-full flex-[14]" style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.7 }} />
            <div className="h-2 rounded-full flex-[12]" style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.7 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function GlobalSearch() {
  const reducedMotion = useReducedMotion();
  const [query, setQuery] = useState('');
  const [state, setState] = useState<SearchState>('idle');
  const [contracts, setContracts] = useState<DemoContract[]>([]);
  const [people, setPeople] = useState<DemoUser[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const timerRef = useRef<number | undefined>(undefined);
  const totalResults = contracts.length + people.length;

  // Debounced search
  useEffect(() => {
    const trimmed = query.trim();
    clearTimeout(timerRef.current);

    if (!trimmed) {
      setTimeout(() => {
        setState('idle');
        setContracts([]);
        setPeople([]);
        setSelectedIndex(0);
      }, 0);
      return;
    }

    timerRef.current = setTimeout(() => {
      setState('searching');
      const c = filterContracts(trimmed);
      const p = filterPeople(trimmed);
      setContracts(c);
      setPeople(p);
      setSelectedIndex(0);
      setState(c.length === 0 && p.length === 0 ? 'empty' : 'results');
    }, SEARCH_DELAY);

    return () => clearTimeout(timerRef.current);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (state !== 'results') return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, totalResults - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [state, totalResults]);

  return (
    // The `relative` wrapper gives Modal(contained) its positioning context
    <div className="relative w-full h-full overflow-hidden">

      {/* App content visible behind the overlay */}
      <BackgroundApp />

      {/*
       * Modal — bare (no title/close header) + contained (absolute within this div)
       * Provides: dimmed overlay, spring-animated panel, focus trap, Esc-to-clear
       *
       * overlayClassName adds the backdrop blur on top of Modal's standard dim.
       * footerClassName overrides the default right-aligned footer layout.
       */}
      <Modal
        open
        onClose={() => setQuery('')}
        title="Global Search"
        bare
        contained
        width="600px"
        footer={<KeyboardHints />}
        footerClassName="justify-start px-4 py-2.5"
        className="rounded-[20px] mx-6"
      >
        {/* ── Search input — SearchInput component ── */}
        <div className="px-4 pt-4 pb-3">
          <SearchInput
            size="md"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery('')}
            placeholder={randomPlaceholder}
            autoFocus
          />
        </div>

        {/* Divider */}
        <div style={{ height: 1, backgroundColor: 'var(--color-border)', flexShrink: 0 }} />

        {/* ── Content panel — animates between states ── */}
        <AnimatePresence mode="wait" initial={false}>
          {state === 'idle' && (
            <IdlePanel key="idle" onSelectQuery={setQuery} reducedMotion={reducedMotion} />
          )}
          {state === 'searching' && (
            <SearchingPanel key="searching" reducedMotion={reducedMotion} />
          )}
          {state === 'results' && (
            <ResultsPanel
              key="results"
              contracts={contracts}
              people={people}
              selectedIndex={selectedIndex}
              onHover={setSelectedIndex}
              reducedMotion={reducedMotion}
            />
          )}
          {state === 'empty' && (
            <EmptyPanel key="empty" query={query} reducedMotion={reducedMotion} />
          )}
        </AnimatePresence>
      </Modal>

    </div>
  );
}
