/**
 * Character System — Public API
 *
 * Usage:
 *   import { CharacterProvider, useCharacter } from './characters';
 *   import type { Character, CharacterManifest } from './characters';
 */

export { CharacterProvider, useCharacter } from './CharacterProvider';
export { characterRegistry, getCharacterByName, DEFAULT_CHARACTER } from './characters';
export type { Character, CharacterManifest, CharacterContextValue } from './types';
export { CharacterSwitcher } from './CharacterSwitcher';
