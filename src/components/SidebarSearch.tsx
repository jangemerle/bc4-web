/**
 * SidebarSearch — search bar pinned to sidebar bottom.
 * Typing shows a floating panel above with matching icons from the lucide library.
 */

import { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import * as LucideIcons from 'lucide-react';
import { type LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SearchInput } from './SearchInput';
import { Icon } from './Icon';
import { Tooltip } from './Tooltip';
import { iconCategories } from '../data/icon-categories';
import { iconTags } from '../data/icon-tags';
import { spring, duration, ease } from '../tokens/motion';
import { shadows } from '../tokens/shadows';
import catalog from '../../public/illustrations/_catalog.json';
import { nav } from '../data/nav';
import { BadgeIllustration } from './illustrations/BadgeIllustration';
import { ButtonIllustration } from './illustrations/ButtonIllustration';
import { CardIllustration } from './illustrations/CardIllustration';
import { CheckboxIllustration } from './illustrations/CheckboxIllustration';
import { ChipIllustration } from './illustrations/ChipIllustration';
import { ContentSwitcherIllustration } from './illustrations/ContentSwitcherIllustration';
import { DataTableIllustration } from './illustrations/DataTableIllustration';
import { DatePickerIllustration } from './illustrations/DatePickerIllustration';
import { DropdownMenuIllustration } from './illustrations/DropdownMenuIllustration';
import { InputIllustration } from './illustrations/InputIllustration';
import { LoadingIndicatorIllustration } from './illustrations/LoadingIndicatorIllustration';
import { ModalIllustration } from './illustrations/ModalIllustration';
import { ModalFullscreenIllustration } from './illustrations/ModalFullscreenIllustration';
import { NumberInputIllustration } from './illustrations/NumberInputIllustration';
import { RadioButtonIllustration } from './illustrations/RadioButtonIllustration';
import { SearchInputIllustration } from './illustrations/SearchInputIllustration';
import { SelectIllustration } from './illustrations/SelectIllustration';
import { SkeletonIllustration } from './illustrations/SkeletonIllustration';
import { TabsIllustration } from './illustrations/TabsIllustration';
import { TextAreaIllustration } from './illustrations/TextAreaIllustration';
import { ToggleIllustration } from './illustrations/ToggleIllustration';
import { TooltipIllustration } from './illustrations/TooltipIllustration';
import { UserAvatarIllustration } from './illustrations/UserAvatarIllustration';

// ─── Illustration registry (built once) ─────────────────────────────────────

interface IllustrationEntry {
  name: string;
  file: string;
  src: string;
  gifSrc?: string;
}


const illustrationSearchIndex: { entry: IllustrationEntry; haystack: string }[] =
  catalog.illustrations.map((ill) => ({
    entry: {
      name: ill.name,
      file: ill.file,
      src: `/illustrations/optimized/${ill.file.replace(/\.\w+$/, '')}-400w.png`,
      gifSrc: ill.animated && ill.gif ? `/illustrations/optimized/${ill.gif.replace(/\.\w+$/, '')}-400w.gif` : undefined,
    },
    haystack: [ill.name, ...ill.tags, ill.context].join(' ').toLowerCase(),
  }));

// ─── Icon registry (built once) ─────────────────────────────────────────────

function kebabToPascal(str: string): string {
  return str.split('-').map((p) => (/^\d+$/.test(p) ? p : p.charAt(0).toUpperCase() + p.slice(1))).join('');
}

const allIcons = LucideIcons as unknown as Record<string, LucideIcon>;

interface IconEntry { name: string; component: LucideIcon; tags: string[] }

const iconRegistry: IconEntry[] = Object.keys(iconCategories)
  .map((name) => {
    const comp = allIcons[kebabToPascal(name)];
    return comp && typeof comp === 'object'
      ? { name, component: comp as LucideIcon, tags: iconTags[name] ?? [] }
      : null;
  })
  .filter((x) => x !== null)
  .map((x) => x as IconEntry)
  .sort((a, b) => a.name.localeCompare(b.name));

// Pre-build a searchable string per icon (name words + all tags)
const searchIndex: { entry: IconEntry; haystack: string }[] = iconRegistry.map((entry) => ({
  entry,
  haystack: [entry.name.replace(/-/g, ' '), ...entry.tags].join(' ').toLowerCase(),
}));

// ─── Illustration thumbnail with GIF-on-hover ──────────────────────────────

function IllustrationThumb({ name, src, gifSrc }: { name: string; src: string; gifSrc?: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="shrink-0 flex flex-col items-center gap-1 rounded-m p-1.5 transition-colors hover:bg-[var(--color-surface-3)] cursor-pointer"
      title={name}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={hovered && gifSrc ? gifSrc : src}
        alt={name}
        className="rounded-m object-contain"
        style={{ width: 130, height: 130, backgroundColor: 'var(--color-surface-2)' }}
      />
      <span
        className="font-sans text-[9px] text-center max-w-[130px] truncate"
        style={{ color: 'var(--color-on-surface-subtle-2)' }}
      >
        {name}
      </span>
    </div>
  );
}

// ─── Component illustration map ──────────────────────────────────────────────

type IllustrationFC = React.FC<{ hovered?: boolean }>;

const componentIllustrations: Record<string, IllustrationFC> = {
  badge:             BadgeIllustration,
  button:            ButtonIllustration,
  card:              CardIllustration,
  checkbox:          CheckboxIllustration,
  chip:              ChipIllustration,
  'content-switcher': ContentSwitcherIllustration,
  'data-table':      DataTableIllustration,
  'date-picker':     DatePickerIllustration,
  'dropdown-menu':   DropdownMenuIllustration,
  input:             InputIllustration,
  'loading-indicator': LoadingIndicatorIllustration,
  modal:             ModalIllustration,
  'modal-fullscreen': ModalFullscreenIllustration,
  'number-input':    NumberInputIllustration,
  'radio-button':    RadioButtonIllustration,
  'search-input':    SearchInputIllustration,
  select:            SelectIllustration,
  skeleton:          SkeletonIllustration,
  tabs:              TabsIllustration,
  'text-area':       TextAreaIllustration,
  toggle:            ToggleIllustration,
  tooltip:           TooltipIllustration,
  'user-avatar':     UserAvatarIllustration,
};

// Renders a scaled-down illustration thumbnail (72×72px)
function PageIllustrationThumb({ id }: { id: string }) {
  const Illustration = componentIllustrations[id];
  if (!Illustration) return null;
  return (
    <div
      className="shrink-0 rounded overflow-hidden"
      style={{ width: 72, height: 72 }}
    >
      <div style={{ width: 200, transform: 'scale(0.36)', transformOrigin: 'top left' }}>
        <Illustration hovered={false} />
      </div>
    </div>
  );
}

// ─── Page registry (derived from nav — auto-updates when nav changes) ────────

interface PageEntry { id: string; title: string; section: string }

const pageSearchIndex: { entry: PageEntry; haystack: string }[] =
  nav.flatMap((section) =>
    section.items.map((item) => {
      const entry: PageEntry = { id: item.id, title: item.label, section: section.title };
      // haystack: title words + each word of the id (kebab-case split) + section
      const idWords = item.id.replace(/-/g, ' ');
      return { entry, haystack: [item.label, idWords, section.title].join(' ').toLowerCase() };
    }),
  );

// ─── Component ───────────────────────────────────────────────────────────────

interface SidebarSearchProps {
  placeholder?: string;
  onNavigate?: (id: string) => void;
}

export function SidebarSearch({ placeholder, onNavigate }: SidebarSearchProps) {
  const [query, setQuery] = useState('');
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [panelPos, setPanelPos] = useState<{ left: number; bottom: number } | null>(null);

  const handleCopyIcon = (name: string) => {
    const pascalName = kebabToPascal(name);
    navigator.clipboard.writeText(pascalName).then(() => {
      setCopiedIcon(name);
      setTimeout(() => setCopiedIcon(null), 1500);
    });
  };

  const pageResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return pageSearchIndex
      .filter(({ haystack }) => haystack.includes(q))
      .sort((a, b) => {
        const aScore = a.entry.title.toLowerCase().startsWith(q) ? 0 : 1;
        const bScore = b.entry.title.toLowerCase().startsWith(q) ? 0 : 1;
        return aScore - bScore;
      })
      .slice(0, 8)
      .map(({ entry }) => entry);
  }, [query]);

  const iconResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    const matches = searchIndex.filter(({ haystack }) => haystack.includes(q));
    matches.sort((a, b) => {
      const aName = a.entry.name.replace(/-/g, ' ');
      const bName = b.entry.name.replace(/-/g, ' ');
      const aScore = aName === q ? 0 : aName.includes(q) ? 1 : 2;
      const bScore = bName === q ? 0 : bName.includes(q) ? 1 : 2;
      return aScore - bScore;
    });
    return matches.slice(0, 48).map(({ entry }) => entry);
  }, [query]);

  const illustrationResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return illustrationSearchIndex
      .filter(({ haystack }) => haystack.includes(q))
      .slice(0, 12)
      .map(({ entry }) => entry);
  }, [query]);

  const hasResults = pageResults.length > 0 || iconResults.length > 0 || illustrationResults.length > 0;

  // Close panel on outside click or Escape
  useEffect(() => {
    if (!hasResults) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setQuery('');
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setQuery('');
      }
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [hasResults]);

  // Compute fixed position from the container's viewport rect
  useEffect(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPanelPos({ left: rect.left, bottom: window.innerHeight - rect.top + 8 });
  }, [query]);

  const showPanel = hasResults;

  return (
    <div ref={containerRef} className="relative">
      {createPortal(
      <AnimatePresence>
        {showPanel && (
          <motion.div
            key="icon-results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              ...spring.default,
              opacity: { duration: duration.base, ease: ease.enter },
            }}
            className="rounded-lg overflow-hidden p-1.5"
            style={{
              position: 'fixed',
              left: panelPos?.left ?? 0,
              bottom: panelPos?.bottom ?? 0,
              width: 624,
              zIndex: 10000,
              backgroundColor: 'var(--color-surface-1)',
              boxShadow: shadows['large-3'],
              maxHeight: 640,
              overflowY: 'auto',
            }}
          >
            {/* Header */}
            <div className="px-2.5 py-2 flex items-center justify-between">
              <span
                className="font-sans text-xs font-semibold"
                style={{ color: 'var(--color-on-surface-subtle-2)' }}
              >
                {pageResults.length + iconResults.length + illustrationResults.length} result{pageResults.length + iconResults.length + illustrationResults.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
              </span>
              {copiedIcon ? (
                <span
                  className="font-mono text-[10px]"
                  style={{ color: 'var(--color-primary-1)' }}
                >
                  {kebabToPascal(copiedIcon)} copied
                </span>
              ) : hoveredIcon ? (
                <span
                  className="font-mono text-[10px]"
                  style={{ color: 'var(--color-on-surface-subtle-1)' }}
                >
                  {kebabToPascal(hoveredIcon)}
                </span>
              ) : null}
            </div>
            <div className="h-px mx-1" style={{ backgroundColor: 'var(--color-border)' }} />

            {/* Pages */}
            {pageResults.length > 0 && (
              <>
                <div className="px-2.5 pt-2 pb-1">
                  <span
                    className="font-sans text-[10px] uppercase tracking-[0.08em] font-bold"
                    style={{ color: 'var(--color-on-surface-subtle-2)' }}
                  >
                    Pages
                  </span>
                </div>
                <div className="px-1 pb-1 flex flex-col gap-0.5">
                  {pageResults.map((page) => (
                    <button
                      key={page.id}
                      onClick={() => { onNavigate?.(page.id); setQuery(''); }}
                      className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-m text-left cursor-pointer transition-colors duration-100 hover:bg-[var(--color-surface-3)] active:bg-[var(--color-surface-4)] border-none"
                      style={{ background: 'transparent' }}
                    >
                      <PageIllustrationThumb id={page.id} />
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span
                          className="font-sans text-sm font-medium truncate"
                          style={{ color: 'var(--color-on-surface)' }}
                        >
                          {page.title}
                        </span>
                        <span
                          className="font-sans text-[9px] uppercase tracking-[0.08em] font-semibold"
                          style={{ color: 'var(--color-on-surface-subtle-2)' }}
                        >
                          {page.section}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                {(illustrationResults.length > 0 || iconResults.length > 0) && (
                  <div className="h-px mx-1 my-0.5" style={{ backgroundColor: 'var(--color-border)' }} />
                )}
              </>
            )}

            {/* Illustrations */}
            {illustrationResults.length > 0 && (
              <>
                <div className="px-2.5 pt-2 pb-1">
                  <span
                    className="font-sans text-[10px] uppercase tracking-[0.08em] font-bold"
                    style={{ color: 'var(--color-on-surface-subtle-2)' }}
                  >
                    Illustrations
                  </span>
                </div>
                <div className="flex gap-1.5 px-1.5 overflow-x-auto pb-1.5">
                  {illustrationResults.map(({ name, src, gifSrc }) => (
                    <IllustrationThumb key={name} name={name} src={src} gifSrc={gifSrc} />
                  ))}
                </div>
                {iconResults.length > 0 && (
                  <div className="h-px mx-1 my-0.5" style={{ backgroundColor: 'var(--color-border)' }} />
                )}
              </>
            )}

            {/* Icon grid */}
            {iconResults.length > 0 && (
              <div className="px-2.5 pt-2 pb-1">
                <span
                  className="font-sans text-[10px] uppercase tracking-[0.08em] font-bold"
                  style={{ color: 'var(--color-on-surface-subtle-2)' }}
                >
                  Icons
                </span>
              </div>
            )}
            <div className="px-1 pb-1 grid gap-0.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(108px, 1fr))' }}>
              {iconResults.map(({ name, component }) => {
                const copied = copiedIcon === name;
                return (
                  <Tooltip key={name} content="Copy to clipboard" side="top" zIndex={10001}>
                    <button
                      onMouseEnter={() => setHoveredIcon(name)}
                      onMouseLeave={() => setHoveredIcon(null)}
                      onClick={() => handleCopyIcon(name)}
                      className="relative flex flex-col items-center justify-center gap-1.5 rounded-m cursor-pointer transition-colors duration-150 p-3 border-none hover:bg-[var(--color-surface-3)] active:bg-[var(--color-surface-4)]"
                      style={{ color: copied ? 'var(--color-primary-1)' : 'var(--color-on-surface)' }}
                    >
                      <Icon icon={component} size="xl" />
                      <span
                        className="font-mono text-[9px] text-center w-full truncate leading-tight transition-colors duration-150"
                        style={{ color: copied ? 'var(--color-primary-1)' : 'var(--color-on-surface-subtle-2)' }}
                      >
                        {copied ? 'Copied!' : kebabToPascal(name)}
                      </span>
                    </button>
                  </Tooltip>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body)}

      <SearchInput
        size="sm"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onClear={() => setQuery('')}
      />
    </div>
  );
}
