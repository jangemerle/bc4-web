/* eslint-disable react-refresh/only-export-components */
/**
 * Character System — React Provider + Hook
 *
 * Wraps the app in a character context that:
 * 1. Applies CSS variable overrides to :root when the character changes
 * 2. Persists the selected character to localStorage
 * 3. Holds runtime-added characters (from Character Builder) alongside
 *    the static registry, merged into one unified list
 * 4. Clears Shade Lab palette overrides on character switch so session
 *    edits don't leak across themes
 * 5. Provides useCharacter() hook for switching, adding, and reading the
 *    active character
 *
 * Usage:
 *   const { current, characters, setCharacter, addCharacter } = useCharacter();
 *   addCharacter(myNewCharacter);
 *   setCharacter('my-new-character');
 */

import { createContext, useContext, useState, useCallback, useEffect, useMemo, type ReactNode } from 'react';
import type { Character, CharacterContextValue } from './types';
import { characterRegistry, DEFAULT_CHARACTER } from './characters';
import { safeGetRaw, safeSetRaw } from '../utils/safeStorage';
import { characterSchema } from '../utils/storageSchemas';
import { clearShadeLabOverrides } from '../lib/applyPalette';

// ─── Context ────────────────────────────────────────────────────────────────

const CharacterContext = createContext<CharacterContextValue | null>(null);

// ─── CSS Variable Application ───────────────────────────────────────────────

const STYLE_TAG_ID = 'kvalt-character-style';

/** Apply a character's CSS variable overrides via a <style> tag.
 *
 * Using a <style> tag (instead of element.style.setProperty) gives class-level
 * specificity, so .dark { } rules in tokens.css are NOT overridden. This means
 * dark mode surface inversions work correctly for all derived characters.
 */
function applyCharacterVariables(character: Character) {
  const toBlock = (vars: Record<string, string>) =>
    Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`).join('\n');

  const lightBlock = `:root {\n${toBlock(character.variables)}\n}`;
  const darkBlock = character.darkVariables
    ? `\n.dark {\n${toBlock(character.darkVariables)}\n}`
    : '';

  let styleEl = document.getElementById(STYLE_TAG_ID) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = STYLE_TAG_ID;
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = lightBlock + darkBlock;

  document.documentElement.dataset.character = character.manifest.name;
}

// ─── Provider ───────────────────────────────────────────────────────────────

interface CharacterProviderProps {
  children: ReactNode;
  /** Override the default character (useful for testing) */
  defaultCharacter?: string;
}

export function CharacterProvider({ children, defaultCharacter }: CharacterProviderProps) {
  // Runtime-added characters (from Character Builder).
  const [runtimeCharacters, setRuntimeCharacters] = useState<Character[]>([]);

  // Merged list: static registry + runtime additions.
  // Runtime characters with the same name as a static one override it.
  const allCharacters = useMemo<Character[]>(() => {
    const runtimeNames = new Set(runtimeCharacters.map(c => c.manifest.name));
    const staticFiltered = characterRegistry.filter(c => !runtimeNames.has(c.manifest.name));
    return [...staticFiltered, ...runtimeCharacters];
  }, [runtimeCharacters]);

  const findCharacter = useCallback(
    (name: string): Character | undefined => allCharacters.find(c => c.manifest.name === name),
    [allCharacters],
  );

  const [current, setCurrent] = useState<Character>(() => {
    // Try to restore from localStorage (validated read)
    const stored = safeGetRaw(characterSchema);
    if (stored) {
      const found = characterRegistry.find(c => c.manifest.name === stored);
      if (found) return found;
    }
    if (defaultCharacter) {
      return characterRegistry.find(c => c.manifest.name === defaultCharacter) ?? DEFAULT_CHARACTER;
    }
    return DEFAULT_CHARACTER;
  });

  // Apply variables on mount and whenever character changes
  useEffect(() => {
    applyCharacterVariables(current);
  }, [current]);

  const setCharacter = useCallback(
    (name: string) => {
      const character = findCharacter(name);
      if (!character) {
        console.warn(`[Kvalt] Character "${name}" not found. Available: ${allCharacters.map(c => c.manifest.name).join(', ')}`);
        return;
      }
      // Clear any Shade Lab palette overrides so character switch is clean
      clearShadeLabOverrides();
      setCurrent(character);
      safeSetRaw(characterSchema, name);
    },
    [findCharacter, allCharacters],
  );

  const addCharacter = useCallback((character: Character) => {
    // 1. Register in runtime state (replaces any existing entry with the same name)
    setRuntimeCharacters(prev => {
      const idx = prev.findIndex(c => c.manifest.name === character.manifest.name);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = character;
        return next;
      }
      return [...prev, character];
    });
    // 2. Atomically make it the active character. We pass the object directly
    //    (not via findCharacter/setCharacter) so we don't hit the stale-closure
    //    race where the registry lookup sees the old version of the character
    //    immediately after addCharacter. applyCharacterVariables fires via the
    //    useEffect on `current`, writing all --color-* / --radius-* / --font-*
    //    tokens to the <style> tag in one pass.
    clearShadeLabOverrides();
    setCurrent(character);
    safeSetRaw(characterSchema, character.manifest.name);
  }, []);

  const resetCharacter = useCallback(
    (name: string) => {
      // Remove any runtime override for this name
      setRuntimeCharacters(prev => prev.filter(c => c.manifest.name !== name));
      clearShadeLabOverrides();
      // If the removed character was active, snap back to the static version
      if (current.manifest.name === name) {
        const staticVersion = characterRegistry.find(c => c.manifest.name === name);
        if (staticVersion) {
          setCurrent(staticVersion);
        }
      }
    },
    [current],
  );

  const value: CharacterContextValue = {
    current,
    characters: allCharacters,
    setCharacter,
    addCharacter,
    resetCharacter,
  };

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useCharacter(): CharacterContextValue {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacter() must be used within a <CharacterProvider>');
  }
  return context;
}
