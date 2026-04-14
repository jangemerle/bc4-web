/**
 * storageSchemas — All localStorage keys used in Kvalt
 *
 * Central registry so every read/write goes through validation.
 * Import these schemas wherever you need to access localStorage.
 */

import {
  defineStorage,
  isOneOf,
  isString,
  isArrayOf,
  isRecord,
  hasShape,
} from './safeStorage';
import type { StickyNote, Todo } from '../stores/workspace';

// ─── Theme mode ──────────────────────────────────────────────────────────────

const THEME_MODES = ['light', 'dark', 'system'] as const;
export type ThemeMode = (typeof THEME_MODES)[number];

export const themeModeSchema = defineStorage(
  'blueprint-theme-mode',
  'system' as ThemeMode,
  isOneOf(THEME_MODES),
);

/** @deprecated Legacy key — only used for migration, then removed */
export const themeLegacyKey = 'blueprint-dark-mode';

// ─── Character ───────────────────────────────────────────────────────────────

export const characterSchema = defineStorage(
  'kvalt-character',
  '',
  isString,
);

// ─── Workspace: Sticky Notes ─────────────────────────────────────────────────

const isStickyNote = hasShape<StickyNote>({
  pageId: (v) => typeof v === 'string',
  text: (v) => typeof v === 'string',
  updatedAt: (v) => typeof v === 'number',
});

function isStickyNoteRecord(
  value: unknown,
): value is Record<string, StickyNote> {
  if (!isRecord(value)) return false;
  for (const key in value) {
    if (!isStickyNote((value as Record<string, unknown>)[key])) return false;
  }
  return true;
}

export const notesSchema = defineStorage(
  'kvalt-workspace-notes',
  {} as Record<string, StickyNote>,
  isStickyNoteRecord,
);

// ─── Workspace: Favorites ────────────────────────────────────────────────────

export const favoritesSchema = defineStorage(
  'kvalt-workspace-favorites',
  [] as string[],
  isArrayOf(
    (v: unknown): v is string => typeof v === 'string',
  ),
);

// ─── Workspace: Todos ────────────────────────────────────────────────────────

const isTodo = hasShape<Todo>({
  id: (v) => typeof v === 'string',
  text: (v) => typeof v === 'string',
  done: (v) => typeof v === 'boolean',
  createdAt: (v) => typeof v === 'number',
});

function isTodoArray(value: unknown): value is Todo[] {
  return Array.isArray(value) && value.every(isTodo);
}

export const todosSchema = defineStorage(
  'kvalt-workspace-todos',
  [] as Todo[],
  isTodoArray,
);

// ─── Workspace: Recents ──────────────────────────────────────────────────────

export const recentsSchema = defineStorage(
  'kvalt-workspace-recents',
  [] as string[],
  isArrayOf(
    (v: unknown): v is string => typeof v === 'string',
  ),
);
