/**
 * DocsLayout — sidebar + content area shell for the docs site
 * Spec: docs-redesign.md → "Sidebar — exact design from Figma"
 *
 * Navigation has two states:
 *  1. COLLAPSED (Hello page) — shows only top-level categories as big nav items
 *  2. EXPANDED (any other page) — clicked category shrinks to uppercase label,
 *     sub-items animate in one-by-one with bounce, active line draws from left
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/cn';
import { duration, spring } from '../tokens/motion';
import { shadows } from '../tokens/shadows';
import { useReducedMotion } from '../hooks/useReducedMotion';
import {
  BookOpen,
  Palette,
  Hexagon,
  LibraryBig,
  Vault,
  PocketKnife,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { DarkModeToggle } from './DarkModeToggle';
import { SidebarSearch } from '../components/SidebarSearch';
import { useFavorites, useRecents } from '../stores/workspace';
import { ChevronDown, Check, MoreHorizontal, Pencil, RotateCcw, Trash2 } from 'lucide-react';
import { useCharacter } from '../characters/CharacterProvider';
import { characterRegistry } from '../characters/characters';
import { DropdownMenu, DropdownMenuItem } from '../components/DropdownMenu';
import { deleteCharacterFromSource } from '../lib/saveCharacterToSource';

/* ─── Sidebar character picker ───────────────────────────────────────────── */

const characterPanelVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    transition: {
      ...spring.snappy,
      opacity: { duration: duration.fast, ease: [0.4, 0, 1, 1] },
    },
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      ...spring.default,
      opacity: { duration: duration.base, ease: [0, 0, 0.2, 1] },
    },
  },
};

const SWATCH_KEYS = ['--color-primary-1', '--color-secondary-1', '--color-success-1', '--color-danger-1'] as const;

function navigateToCharacterBuilder(characterName: string) {
  const url = new URL(window.location.href);
  url.searchParams.set('page', 'workshop-character-builder');
  url.searchParams.set('character', characterName);
  url.hash = '';
  window.history.pushState(null, '', url.pathname + url.search);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

function SidebarCharacterPicker() {
  const { current, characters, setCharacter, resetCharacter } = useCharacter();
  const [open, setOpen] = useState(false);
  const [openMenuFor, setOpenMenuFor] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const handleDelete = (name: string) => {
    resetCharacter(name);
    void deleteCharacterFromSource(name);
  };

  const handleEdit = (name: string) => {
    setOpen(false);
    setOpenMenuFor(null);
    navigateToCharacterBuilder(name);
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const timeout = setTimeout(() => document.addEventListener('mousedown', handler), 0);
    return () => { clearTimeout(timeout); document.removeEventListener('mousedown', handler); };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); return; }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const items = ref.current?.querySelectorAll<HTMLElement>('[role="menuitem"]');
        if (!items || items.length === 0) return;
        const idx = Array.from(items).findIndex(el => el === document.activeElement);
        const next = e.key === 'ArrowDown'
          ? (idx < items.length - 1 ? idx + 1 : 0)
          : (idx > 0 ? idx - 1 : items.length - 1);
        items[next].focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1 cursor-pointer group"
      >
        <span
          className="font-mono text-[8px] font-medium uppercase tracking-[0.12em] transition-colors duration-150
                     text-[var(--color-on-surface-subtle-1)] group-hover:text-[var(--color-on-surface)]"
        >
          {current.manifest.displayName}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={spring.snappy}
          style={{ display: 'flex', color: 'var(--color-on-surface-subtle-1)' }}
        >
          <ChevronDown size={9} strokeWidth={2.5} />
        </motion.span>
      </button>

      {/* Dropdown — opens upward, matches DS DropdownMenu styling */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            className="absolute bottom-full mb-3 right-0 rounded-lg p-1.5 bg-[var(--color-surface-1)]"
            style={{ width: 220, boxShadow: shadows['large-3'], transformOrigin: 'bottom right' }}
            variants={reducedMotion ? undefined : characterPanelVariants}
            initial={reducedMotion ? { opacity: 1 } : 'hidden'}
            animate={reducedMotion ? { opacity: 1 } : 'visible'}
            exit={reducedMotion ? { opacity: 0 } : 'hidden'}
          >
            <div className="flex flex-col gap-0.5">
              {characters.map((char) => {
                const isActive = current.manifest.name === char.manifest.name;
                const isPreset = characterRegistry.some(c => c.manifest.name === char.manifest.name);
                const isMenuOpen = openMenuFor === char.manifest.name;

                return (
                  <div
                    key={char.manifest.name}
                    className={cn(
                      'relative flex items-center rounded-m',
                      'transition-colors duration-150',
                      isActive
                        ? 'bg-[var(--color-inverted-surface)]'
                        : 'hover:bg-[var(--color-surface-3)] active:bg-[var(--color-surface-4)]',
                    )}
                  >
                    {/* Main select button */}
                    <button
                      role="menuitem"
                      className={cn(
                        'flex-1 min-w-0 text-left h-8 pl-2.5 pr-1 cursor-pointer flex items-center gap-2.5',
                        'outline-none bg-transparent border-none',
                        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-primary-1)] focus-visible:outline-offset-2',
                      )}
                      onClick={() => { setCharacter(char.manifest.name); setOpen(false); }}
                    >
                      {/* Color swatches */}
                      <div className="flex gap-0.5 shrink-0">
                        {SWATCH_KEYS.map(key => {
                          const color = char.variables[key];
                          if (!color) return null;
                          return (
                            <div
                              key={key}
                              className="w-2.5 h-2.5 rounded-full"
                              style={{
                                backgroundColor: color,
                                outline: isActive ? 'none' : '1px solid var(--color-border)',
                              }}
                            />
                          );
                        })}
                      </div>

                      {/* Name */}
                      <span
                        className="font-sans text-md font-semibold tracking-[0.14px] flex-1 truncate"
                        style={{
                          color: isActive ? 'var(--color-on-inverted-surface)' : 'var(--color-on-surface)',
                        }}
                      >
                        {char.manifest.displayName}
                      </span>

                      {/* Checkmark */}
                      {isActive && (
                        <Check
                          size={14}
                          strokeWidth={2.5}
                          className="shrink-0"
                          style={{ color: 'var(--color-on-inverted-surface)' }}
                        />
                      )}
                    </button>

                    {/* 3-dots menu trigger */}
                    <div className="relative shrink-0 flex items-center pr-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuFor(isMenuOpen ? null : char.manifest.name);
                        }}
                        aria-label={`More options for ${char.manifest.displayName}`}
                        title="More options"
                        className="w-6 h-6 flex items-center justify-center rounded-s cursor-pointer border-none bg-transparent"
                        style={{
                          color: isActive
                            ? 'var(--color-on-inverted-surface)'
                            : 'var(--color-on-surface-subtle-1)',
                        }}
                      >
                        <MoreHorizontal size={14} />
                      </button>
                      <DropdownMenu
                        open={isMenuOpen}
                        onClose={() => setOpenMenuFor(null)}
                        className="top-full mt-1 right-0"
                        width="180px"
                      >
                        <DropdownMenuItem
                          icon={Pencil}
                          onClick={() => handleEdit(char.manifest.name)}
                        >
                          Edit
                        </DropdownMenuItem>
                        {isPreset ? (
                          <DropdownMenuItem
                            icon={RotateCcw}
                            onClick={() => { setOpenMenuFor(null); resetCharacter(char.manifest.name); }}
                          >
                            Reset to default
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            icon={Trash2}
                            onClick={() => { setOpenMenuFor(null); handleDelete(char.manifest.name); }}
                          >
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Search placeholder ─────────────────────────────────────────────────── */

/** Rotating search placeholders — one per page load, keeps it fresh */
const SEARCH_PLACEHOLDERS = [
  'What are you after?',
  "Don't scroll, search",
  'Where to?',
  "It's in here somewhere",
  'Find the thing',
] as const;

/** Stable for the entire session — avoids layout flicker from re-picks */
const searchPlaceholder = SEARCH_PLACEHOLDERS[Date.now() % SEARCH_PLACEHOLDERS.length];

/* ─── Navigation structure ──────────────────────────────────────────────── */

export type { NavItem, NavSection } from '../data/nav';
// eslint-disable-next-line react-refresh/only-export-components
export { nav } from '../data/nav';
import { nav } from '../data/nav';

/* ─── Helpers ────────────────────────────────────────────────────────────── */

/** Maps section title → hub page ID */
const SECTION_HUB: Record<string, string> = {
  'Foundations':  'foundations',
  'Components':   'components',
  'Philosophy':   'philosophy',
  'Screen Vault': 'screen-vault',
  'Tools':        'workshop',
};

/** Icon per top-level section — used in both collapsed and expanded sidebar states */
const SECTION_ICONS: Record<string, LucideIcon> = {
  Foundations: Palette,
  Components: Hexagon,
  Philosophy: LibraryBig,
  'Screen Vault': Vault,
  Tools: PocketKnife,
};

/** Find which section a page ID belongs to, or null for 'hello' */
function findSection(pageId: string): string | null {
  // Hub pages expand their own section
  for (const [title, hubId] of Object.entries(SECTION_HUB)) {
    if (hubId === pageId) return title;
  }
  for (const section of nav) {
    if (section.items.some((i) => i.id === pageId)) return section.title;
  }
  return null;
}

/** Find the display label for a page ID */
function findLabel(pageId: string): string | null {
  for (const section of nav) {
    const item = section.items.find((i) => i.id === pageId);
    if (item) return item.label;
  }
  return null;
}

/* ─── Spring with bounce for staggered item reveals ────────────────────── */
const bounceSpring = { type: 'spring' as const, visualDuration: 0.3, bounce: 0.35 };

/* ─── NavRow: a single nav item row with horizontal active bar ──────────── */

interface NavRowProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  /** Delay for stagger animation on mount */
  enterDelay?: number;
  /** Font size — 20 for nav items, 12 for category labels */
  fontSize?: number;
  /** Muted style — applies 50% opacity */
  muted?: boolean;
  /** Style as uppercase category label (font, color, spacing) */
  isLabel?: boolean;
  /** Disable interaction (pointer-events-none, no tabIndex) */
  nonInteractive?: boolean;
  /** Optional icon rendered between the active bar and label */
  icon?: LucideIcon;
  /** Extra left padding in px — used to indent sub-items past the category icon column */
  indent?: number;
  reducedMotion: boolean;
}

function NavRow({
  label, isActive, onClick, enterDelay = 0,
  fontSize = 20, muted = false, isLabel = false, nonInteractive = false, icon: Icon, indent = 0, reducedMotion,
}: NavRowProps) {
  const [hovered, setHovered] = useState(false);
  const [wasActive, setWasActive] = useState(isActive);
  const showHoverColor = hovered && !nonInteractive && !isActive;

  // Track if this item just lost active state (for slow fade-out)
  const justDeactivated = wasActive && !isActive;
  useEffect(() => {
    setWasActive(isActive);
  }, [isActive]);

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={reducedMotion ? undefined : { opacity: 0, x: -8 }}
      transition={
        reducedMotion
          ? undefined
          : { ...bounceSpring, delay: enterDelay }
      }
    >
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          'flex items-center gap-5 w-full text-left cursor-pointer py-[10px]',
          nonInteractive && 'pointer-events-none',
        )}
        style={{
          opacity: muted ? 0.5 : 1,
          paddingLeft: indent,
        }}
        tabIndex={nonInteractive ? -1 : 0}
      >
        {/* Horizontal active bar — 12px wide × 4px tall, flush to left edge */}
        <div className="w-3 shrink-0 flex items-center">
          {isActive ? (
            <motion.div
              key={label}
              className="h-1"
              style={{
                backgroundColor: 'var(--color-on-secondary-1)',
                originX: 0,
                width: 12,
              }}
              initial={reducedMotion ? { scaleX: 1 } : { scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={
                reducedMotion
                  ? undefined
                  : {
                      scaleX: { type: 'spring', visualDuration: 0.18, bounce: 0.45, delay: enterDelay },
                      opacity: { duration: 0.06, delay: enterDelay },
                    }
              }
            />
          ) : (
            <div className="h-1 w-3" />
          )}
        </div>

        {/* Optional icon */}
        {Icon && (
          <Icon
            size={14}
            strokeWidth={2}
            style={{
              color: isActive || showHoverColor
                ? 'var(--color-on-secondary-1)'
                : 'var(--color-on-surface-subtle-1)',
              transition: justDeactivated ? 'color 1.9s ease' : 'color 0.15s ease',
              flexShrink: 0,
            }}
          />
        )}

        {/* Label text */}
        <span
          className={cn(
            'font-display font-semibold leading-[1.2]',
            isLabel && 'font-sans uppercase',
          )}
          style={{
            fontSize,
            letterSpacing: isLabel ? '2.4px' : undefined,
            color: isActive || showHoverColor
              ? 'var(--color-on-secondary-1)'
              : isLabel
                ? 'var(--color-on-surface-subtle-1)'
                : 'var(--color-on-surface)',
            transition: justDeactivated ? 'color 1.9s ease' : 'color 0.15s ease',
          }}
        >
          {label}
        </span>
      </button>
    </motion.div>
  );
}

/* ─── Layout ────────────────────────────────────────────────────────────── */

interface DocsLayoutProps {
  activeId: string;
  onNavigate: (id: string) => void;
  themeMode: import('../utils/storageSchemas').ThemeMode;
  onThemeModeChange: (mode: import('../utils/storageSchemas').ThemeMode) => void;
  children: React.ReactNode;
}

export function DocsLayout({ activeId, onNavigate, themeMode, onThemeModeChange, children }: DocsLayoutProps) {
  const reducedMotion = useReducedMotion();
  const { favorites } = useFavorites();
  const { trackVisit } = useRecents();

  useEffect(() => {
    trackVisit(activeId);
  }, [activeId, trackVisit]);

  // Which section is currently expanded (null = Hello/collapsed view)
  const activeSection = findSection(activeId);

  // Track previous state for animation direction
  const [expandedSection, setExpandedSection] = useState<string | null>(activeSection);
  const prevActiveId = useRef(activeId);

  useEffect(() => {
    const newSection = findSection(activeId);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setExpandedSection(newSection);
    prevActiveId.current = activeId;
  }, [activeId]);

  /** Navigate to hub page for all sections */
  const handleCategoryClick = useCallback(
    (sectionTitle: string) => {
      const hubId = SECTION_HUB[sectionTitle];
      if (hubId) {
        onNavigate(hubId);
        return;
      }
      const section = nav.find((s) => s.title === sectionTitle);
      if (section && section.items.length > 0) {
        onNavigate(section.items[0].id);
      }
    },
    [onNavigate],
  );

  const isCollapsed = activeId === 'hello';

  return (
    <div className="h-screen flex transition-colors overflow-hidden" style={{ backgroundColor: 'var(--color-bg)' }}>

      {/* ── Sidebar column — stretches full page height for bg color ── */}
      <div
        className="w-[320px] shrink-0 hidden lg:block relative z-10"
        style={{ backgroundColor: 'var(--color-surface-1)' }}
      >
      <nav
        className="sticky top-0 h-screen flex flex-col overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface-1)' }}
      >
        {/* Top area: dark pill with logo + DS chip + toggle */}
        <div className="px-5 pt-8">
          <div
            className="flex items-center gap-5 rounded-full"
            style={{
              backgroundColor: 'var(--color-inverted-surface)',
              paddingLeft: 24,
              paddingRight: 4,
              paddingTop: 4,
              paddingBottom: 4,
              boxShadow: shadows['small-2'],
            }}
          >
            {/* Logo + DS chip — clickable, navigates to Hello */}
            <button
              onClick={() => onNavigate('hello')}
              className="flex items-center gap-1.5 flex-1 cursor-pointer"
            >
              <span
                className="font-display font-bold italic whitespace-nowrap leading-[1.2]"
                style={{ fontSize: 22, color: 'var(--color-on-inverted-surface)' }}
              >
                KVALT
              </span>
              <span
                className="font-sans font-semibold px-2 rounded-full whitespace-nowrap"
                style={{
                  backgroundColor: '#dbf7de',
                  color: '#003204',
                  fontSize: 10,
                  letterSpacing: '0.4px',
                  lineHeight: '1.5',
                  paddingTop: 0.5,
                  paddingBottom: 0.5,
                }}
              >
                DS
              </span>
            </button>

            {/* Dark mode toggle — right-aligned inside the pill */}
            <DarkModeToggle mode={themeMode} onModeChange={onThemeModeChange} />
          </div>

        </div>

        {/* Favorites section — shown when there are starred pages */}
        {favorites.length > 0 && !isCollapsed && (
          <div className="px-5 pt-4">
            <span
              className="font-sans uppercase block mb-2"
              style={{ fontSize: 10, letterSpacing: '2px', color: 'var(--color-on-surface)', opacity: 0.35, paddingLeft: 32 }}
            >
              ★ Favorites
            </span>
            {favorites.map((fav) => {
              const label = findLabel(fav);
              if (!label) return null;
              return (
                <button
                  key={fav}
                  onClick={() => onNavigate(fav)}
                  className="flex items-center gap-3 w-full text-left py-1"
                  style={{ cursor: 'pointer', paddingLeft: 32 }}
                >
                  <span
                    className="font-sans"
                    style={{
                      fontSize: 13,
                      color: activeId === fav ? 'var(--color-on-secondary-1)' : 'var(--color-on-surface)',
                      fontWeight: activeId === fav ? 600 : 400,
                    }}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Navigation items — with 32px gap from header like Figma */}
        <div className="flex flex-col gap-0 flex-1 pt-8 pb-8 overflow-y-auto" tabIndex={0} role="group" aria-label="Page navigation">
          <AnimatePresence mode="popLayout">
            {isCollapsed ? (
              /* ── COLLAPSED STATE: top-level items only ─────────── */
              <motion.div
                key="collapsed"
                className="flex flex-col gap-0"
                initial={reducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reducedMotion ? undefined : { opacity: 0 }}
                transition={{ duration: duration.instant }}
              >
                <NavRow
                  label="HELLO THERE"
                  isActive={true}
                  icon={BookOpen}
                  onClick={() => onNavigate('hello')}
                  fontSize={12}
                  isLabel
                  reducedMotion={reducedMotion}
                />
                {nav.map((section, i) => {
                  return (
                    <NavRow
                      key={section.title}
                      label={section.title.toUpperCase()}
                      isActive={false}
                      icon={SECTION_ICONS[section.title]}
                      onClick={() => handleCategoryClick(section.title)}
                      fontSize={12}
                      isLabel
                      enterDelay={reducedMotion ? 0 : 0.028 * (i + 1)}
                      reducedMotion={reducedMotion}
                    />
                  );
                })}
              </motion.div>
            ) : (
              /* ── EXPANDED STATE: category labels + sub-items ───── */
              <motion.div
                key={`expanded-${expandedSection}`}
                className="flex flex-col gap-0"
                initial={reducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reducedMotion ? undefined : { opacity: 0 }}
                transition={{ duration: duration.instant }}
              >
                {renderExpandedNav(
                  activeId,
                  expandedSection,
                  onNavigate,
                  handleCategoryClick,
                  reducedMotion,
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search bar — pinned to bottom of sidebar */}
        <div className="p-5 shrink-0">
          <SidebarSearch placeholder={searchPlaceholder} onNavigate={onNavigate} />
        </div>

        {/* Bottom bar — CLI left, character right */}
        <div className="flex items-center justify-between px-5 pb-5 shrink-0">
          <div className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: 'var(--color-success-1)' }}
            />
            <span
              className="font-mono text-[8px] font-medium uppercase tracking-[0.12em]"
              style={{ color: 'var(--color-on-surface-subtle-1)' }}
            >
              CLI Active
            </span>
          </div>
          <SidebarCharacterPicker />
        </div>
      </nav>
      </div>

      {/* ── Main content ─────────────────────────────────────────── */}
      <main
        className="flex-1 min-w-0 h-full overflow-y-auto"
        tabIndex={0}
        style={{
          backgroundImage:
            'linear-gradient(var(--color-surface-subtle-grid) 1px, transparent 1px), linear-gradient(90deg, var(--color-surface-subtle-grid) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      >
        <div className="px-20 pt-16 pb-20 min-h-full flex flex-col">
          {children}
        </div>
      </main>

    </div>
  );
}

/* ─── Expanded nav renderer ─────────────────────────────────────────────── */

function renderExpandedNav(
  activeId: string,
  expandedSection: string | null,
  onNavigate: (id: string) => void,
  handleCategoryClick: (title: string) => void,
  reducedMotion: boolean,
) {
  const elements: React.ReactNode[] = [];
  let staggerIndex = 0;

  const activeSectionIndex = nav.findIndex((s) => s.title === expandedSection);

  // Iterate sections in natural order. Active section expands in place,
  // others render as allcaps labels.
  for (let i = 0; i < nav.length; i++) {
    const section = nav[i];

    if (i === activeSectionIndex) {
      // Active section: category label (clickable → hub page) + expanded sub-items
      elements.push(
        <NavRow
          key={`label-${section.title}`}
          label={section.title.toUpperCase()}
          isActive={activeId === SECTION_HUB[section.title]}
          icon={SECTION_ICONS[section.title]}
          onClick={() => handleCategoryClick(section.title)}
          fontSize={12}
          isLabel
          enterDelay={reducedMotion ? 0 : 0.014 * staggerIndex}
          reducedMotion={reducedMotion}
        />,
      );
      staggerIndex++;

      for (const item of section.items) {
        const isActive = activeId === item.id;
        elements.push(
          <NavRow
            key={item.id}
            label={item.label}
            isActive={isActive}
            onClick={() => onNavigate(item.id)}
            indent={34}
            enterDelay={reducedMotion ? 0 : 0.028 * staggerIndex}
            reducedMotion={reducedMotion}
          />,
        );
        staggerIndex++;
      }
    } else {
      // Other section: category label (clickable)
      elements.push(
        <NavRow
          key={`label-${section.title}`}
          label={section.title.toUpperCase()}
          isActive={false}
          icon={SECTION_ICONS[section.title]}
          onClick={() => handleCategoryClick(section.title)}
          fontSize={12}
          isLabel
          enterDelay={reducedMotion ? 0 : 0.028 * staggerIndex}
          reducedMotion={reducedMotion}
        />,
      );
      staggerIndex++;
    }
  }

  return elements;
}
