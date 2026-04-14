/**
 * CharacterSwitcher — Floating panel for switching between characters.
 *
 * Shows character thumbnails with name + personality. Click to switch.
 * The CSS variable swap happens instantly via CharacterProvider.
 * Includes a smooth color-swatch preview for each character.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, ChevronDown, ChevronUp, Check, Pencil, Trash2, MoreHorizontal, RotateCcw } from 'lucide-react';
import { useCharacter } from './CharacterProvider';
import { characterRegistry } from './characters';
import { DropdownMenu, DropdownMenuItem } from '../components/DropdownMenu';
import { spring } from '../tokens/motion';
import { shadows } from '../tokens/shadows';
import { usePress } from '../hooks/usePress';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { deleteCharacterFromSource } from '../lib/saveCharacterToSource';

// ─── Navigation helper ──────────────────────────────────────────────────────

function navigateToCharacterBuilder(characterName: string) {
  const url = new URL(window.location.href);
  url.searchParams.set('page', 'workshop-character-builder');
  url.searchParams.set('character', characterName);
  url.hash = '';
  window.history.pushState(null, '', url.pathname + url.search);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

// ─── Character Color Preview ────────────────────────────────────────────────

function ColorDots({ variables, preview }: {
  variables: Record<string, string>;
  preview?: { primaryColor: string; accentColor?: string; backgroundColor: string; textColor: string };
}) {
  // If character has variable overrides, use those. Otherwise fall back to manifest preview.
  const hasVars = Object.keys(variables).length > 0;

  if (hasVars) {
    const keys = [
      '--color-primary-1',
      '--color-secondary-1',
      '--color-surface-1',
      '--color-success-1',
      '--color-danger-1',
    ];
    return (
      <div className="flex gap-1">
        {keys.map((key) => {
          const color = variables[key];
          if (!color) return null;
          return (
            <div
              key={key}
              className="w-3 h-3 rounded-full border"
              style={{ backgroundColor: color, borderColor: 'rgba(0,0,0,0.1)' }}
            />
          );
        })}
      </div>
    );
  }

  // Fallback to preview colors from manifest
  if (!preview) return null;
  const colors = [preview.primaryColor, preview.accentColor, preview.backgroundColor, preview.textColor].filter(Boolean);
  return (
    <div className="flex gap-1">
      {colors.map((color, i) => (
        <div
          key={i}
          className="w-3 h-3 rounded-full border"
          style={{ backgroundColor: color!, borderColor: 'rgba(0,0,0,0.1)' }}
        />
      ))}
    </div>
  );
}

// ─── Toggle Button ─────────────────────────────────────────────────────────

function ToggleButton({ isOpen, onToggle, reducedMotion, current }: {
  isOpen: boolean;
  onToggle: () => void;
  reducedMotion: boolean;
  current: { manifest: { displayName: string } };
}) {
  const { isPressed, pressHandlers } = usePress({});

  return (
    <motion.button
      className="self-end flex items-center gap-2 px-4 py-2.5 rounded-full cursor-pointer border"
      style={{
        backgroundColor: 'var(--color-inverted-surface)',
        color: 'var(--color-on-inverted-surface)',
        boxShadow: shadows['medium-2'],
        borderColor: 'transparent',
      }}
      onClick={onToggle}
      animate={{ scale: reducedMotion ? 1 : isPressed ? 0.97 : 1 }}
      whileHover={reducedMotion ? undefined : { scale: 1.03 }}
      transition={spring.snappy}
      {...pressHandlers}
    >
      <Palette size={16} />
      <span className="font-sans text-sm font-semibold">
        {current.manifest.displayName}
      </span>
      {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
    </motion.button>
  );
}

// ─── Character Card ─────────────────────────────────────────────────────────

function CharacterCard({ displayName, personality, variables, preview, isActive, isMenuOpen, isPreset, onSelect, onEdit, onDelete, onReset, onMenuToggle, onMenuClose }: {
  displayName: string;
  personality: string;
  variables: Record<string, string>;
  preview?: { primaryColor: string; accentColor?: string; backgroundColor: string; textColor: string };
  isActive: boolean;
  isMenuOpen: boolean;
  /** Preset characters (static, built-in) get Edit + Reset. Customs get Edit + Delete. */
  isPreset: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onReset: () => void;
  onMenuToggle: () => void;
  onMenuClose: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const { isPressed, pressHandlers } = usePress({});

  return (
    <motion.div
      className="w-full rounded-m flex items-stretch border relative overflow-visible"
      style={{
        backgroundColor: isActive ? 'var(--color-surface-3)' : 'var(--color-surface-1)',
        borderColor: isActive ? 'var(--color-primary-1)' : 'var(--color-surface-4)',
      }}
      animate={{ scale: isPressed ? 0.97 : 1 }}
      transition={spring.snappy}
      whileHover={reducedMotion ? undefined : {
        backgroundColor: isActive ? undefined : 'var(--color-surface-2)',
      }}
    >
      {/* Main clickable area */}
      <button
        type="button"
        onClick={onSelect}
        className="flex-1 min-w-0 text-left pl-3 py-2.5 cursor-pointer bg-transparent border-none flex items-start gap-3"
        {...pressHandlers}
      >
        {/* Color preview */}
        <div className="pt-0.5">
          <ColorDots variables={variables} preview={preview} />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="font-sans text-sm font-semibold truncate"
              style={{ color: 'var(--color-on-surface)' }}
            >
              {displayName}
            </span>
            {isActive && (
              <motion.span
                initial={reducedMotion ? false : { scale: 0 }}
                animate={{ scale: 1 }}
                transition={spring.snappy}
              >
                <Check size={14} style={{ color: 'var(--color-primary-1)' }} />
              </motion.span>
            )}
          </div>
          <span
            className="font-sans text-xs leading-snug line-clamp-2 block"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            {personality}
          </span>
        </div>
      </button>

      {/* 3-dots menu trigger — always visible, strong contrast */}
      <div className="relative shrink-0 flex items-center pr-2">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onMenuToggle(); }}
          aria-label={`More options for ${displayName}`}
          title="More options"
          className="w-7 h-7 flex items-center justify-center rounded-s cursor-pointer border-none"
          style={{
            color: 'var(--color-on-surface)',
            backgroundColor: isMenuOpen ? 'var(--color-surface-4)' : 'transparent',
          }}
        >
          <MoreHorizontal size={18} />
        </button>
        <DropdownMenu
          open={isMenuOpen}
          onClose={onMenuClose}
          className="top-full mt-1 right-0"
          width="180px"
        >
          <DropdownMenuItem
            icon={Pencil}
            onClick={() => { onMenuClose(); onEdit(); }}
          >
            Edit
          </DropdownMenuItem>
          {isPreset ? (
            <DropdownMenuItem
              icon={RotateCcw}
              onClick={() => { onMenuClose(); onReset(); }}
            >
              Reset to default
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              icon={Trash2}
              onClick={() => { onMenuClose(); onDelete(); }}
            >
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenu>
      </div>
    </motion.div>
  );
}

// ─── Main Switcher ──────────────────────────────────────────────────────────

export function CharacterSwitcher() {
  const { current, characters, setCharacter, resetCharacter } = useCharacter();
  const [isOpen, setIsOpen] = useState(true);
  const [openMenuFor, setOpenMenuFor] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();

  const handleDelete = (name: string) => {
    resetCharacter(name);
    void deleteCharacterFromSource(name);
  };

  return (
    <motion.div
      className="fixed bottom-5 right-5 z-50 flex flex-col"
      style={{ width: 280 }}
      initial={reducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring.default, delay: 0.3 }}
    >
      {/* Panel body */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="mb-2 rounded-lg overflow-hidden border"
            style={{
              backgroundColor: 'var(--color-surface-1)',
              borderColor: 'var(--color-surface-4)',
              boxShadow: shadows['large-2'],
            }}
            initial={reducedMotion ? false : { opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: 10, scale: 0.95 }}
            transition={spring.snappy}
          >
            {/* Header */}
            <div
              className="px-4 py-3 border-b"
              style={{ borderColor: 'var(--color-surface-4)' }}
            >
              <span
                className="font-display text-sm font-bold"
                style={{ color: 'var(--color-on-surface)' }}
              >
                Character
              </span>
              <p
                className="font-sans text-xs mt-0.5"
                style={{ color: 'var(--color-on-surface-subtle-1)' }}
              >
                Same components, different personality
              </p>
            </div>

            {/* Character list */}
            <div className="p-2 flex flex-col gap-1.5 max-h-[360px] overflow-y-auto">
              {characters.map((character) => {
                const isPreset = characterRegistry.some(c => c.manifest.name === character.manifest.name);
                return (
                  <CharacterCard
                    key={character.manifest.name}
                    displayName={character.manifest.displayName}
                    personality={character.manifest.personality}
                    variables={character.variables}
                    preview={character.manifest.preview}
                    isActive={current.manifest.name === character.manifest.name}
                    isMenuOpen={openMenuFor === character.manifest.name}
                    isPreset={isPreset}
                    onSelect={() => setCharacter(character.manifest.name)}
                    onEdit={() => navigateToCharacterBuilder(character.manifest.name)}
                    onDelete={() => handleDelete(character.manifest.name)}
                    onReset={() => resetCharacter(character.manifest.name)}
                    onMenuToggle={() =>
                      setOpenMenuFor(openMenuFor === character.manifest.name ? null : character.manifest.name)
                    }
                    onMenuClose={() => setOpenMenuFor(null)}
                  />
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <ToggleButton isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} reducedMotion={reducedMotion} current={current} />
    </motion.div>
  );
}
