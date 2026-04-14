/**
 * Workspace Store — localStorage-backed state for Tier 1 features
 *
 * Three concerns:
 *   1. Sticky Notes — per-page text annotations
 *   2. Favorites    — starred page IDs shown at top of nav
 *   3. Quick Todos  — checkbox items with optional page tag
 *
 * All hooks trigger re-renders on change and sync across tabs via
 * the 'storage' event.
 *
 * Every read is validated through safeStorage schemas — corrupt or
 * unexpected data falls back to safe defaults instead of crashing.
 */

import { useCallback, useSyncExternalStore } from 'react';
import { safeGet, safeSet } from '../utils/safeStorage';
import type { StorageSchema } from '../utils/safeStorage';
import {
  notesSchema,
  favoritesSchema,
  todosSchema,
  recentsSchema,
} from '../utils/storageSchemas';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StickyNote {
  pageId: string;
  text: string;
  updatedAt: number; // epoch ms
}

export interface Todo {
  id: string;
  text: string;
  done: boolean;
  pageTag?: string;   // auto-tagged with the page you were on
  createdAt: number;
}

// ─── Generic validated localStorage helper with cross-tab sync ───────────────

function createStore<T>(schema: StorageSchema<T>) {
  const listeners = new Set<() => void>();

  // Cache last raw string + parsed value so getSnapshot returns a stable
  // reference between renders — required by useSyncExternalStore.
  let lastRaw: string | null = undefined as unknown as string | null;
  let lastValue: T = schema.fallback;

  function get(): T {
    try {
      const raw = localStorage.getItem(schema.key);
      if (raw === lastRaw) return lastValue;
      lastRaw = raw;
      // Validated read — corrupt data returns fallback
      lastValue = safeGet(schema);
      return lastValue;
    } catch {
      return schema.fallback;
    }
  }

  function set(value: T) {
    safeSet(schema, value);
    const next = JSON.stringify(value);
    lastRaw = next;
    lastValue = value;
    listeners.forEach((l) => l());
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);

    // Cross-tab sync
    const onStorage = (e: StorageEvent) => {
      if (e.key === schema.key) listener();
    };
    window.addEventListener('storage', onStorage);

    return () => {
      listeners.delete(listener);
      window.removeEventListener('storage', onStorage);
    };
  }

  function useStore(): [T, (value: T) => void] {
    const snapshot = useSyncExternalStore(subscribe, get, get);
    return [snapshot, set];
  }

  return { get, set, subscribe, useStore };
}

// ─── Stores ───────────────────────────────────────────────────────────────────

const notesStore     = createStore(notesSchema);
const favoritesStore = createStore(favoritesSchema);
const todosStore     = createStore(todosSchema);
const recentsStore   = createStore(recentsSchema);

// ─── Sticky Notes Hook ────────────────────────────────────────────────────────

export function useNotes() {
  const [notes, setNotes] = notesStore.useStore();

  const getNote = useCallback(
    (pageId: string): string => notes[pageId]?.text ?? '',
    [notes]
  );

  const setNote = useCallback(
    (pageId: string, text: string) => {
      const next = { ...notes };
      if (text.trim() === '') {
        delete next[pageId];
      } else {
        next[pageId] = { pageId, text, updatedAt: Date.now() };
      }
      setNotes(next);
    },
    [notes, setNotes]
  );

  const hasNote = useCallback(
    (pageId: string): boolean => !!notes[pageId]?.text,
    [notes]
  );

  const allNotes = Object.values(notes).sort((a, b) => b.updatedAt - a.updatedAt);

  return { getNote, setNote, hasNote, allNotes };
}

// ─── Favorites Hook ───────────────────────────────────────────────────────────

export function useFavorites() {
  const [favorites, setFavorites] = favoritesStore.useStore();

  const isFavorite = useCallback(
    (pageId: string): boolean => favorites.includes(pageId),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (pageId: string) => {
      if (favorites.includes(pageId)) {
        setFavorites(favorites.filter((id) => id !== pageId));
      } else {
        setFavorites([...favorites, pageId]);
      }
    },
    [favorites, setFavorites]
  );

  return { favorites, isFavorite, toggleFavorite };
}

// ─── Quick Todos Hook ─────────────────────────────────────────────────────────

let todoIdCounter = Date.now();

export function useTodos() {
  const [todos, setTodos] = todosStore.useStore();

  const addTodo = useCallback(
    (text: string, pageTag?: string) => {
      const todo: Todo = {
        id: String(todoIdCounter++),
        text,
        done: false,
        pageTag,
        createdAt: Date.now(),
      };
      setTodos([todo, ...todos]);
    },
    [todos, setTodos]
  );

  const toggleTodo = useCallback(
    (id: string) => {
      setTodos(
        todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
      );
    },
    [todos, setTodos]
  );

  const removeTodo = useCallback(
    (id: string) => {
      setTodos(todos.filter((t) => t.id !== id));
    },
    [todos, setTodos]
  );

  const editTodo = useCallback(
    (id: string, text: string) => {
      setTodos(
        todos.map((t) => (t.id === id ? { ...t, text } : t))
      );
    },
    [todos, setTodos]
  );

  const pending = todos.filter((t) => !t.done);
  const completed = todos.filter((t) => t.done);

  return { todos, pending, completed, addTodo, toggleTodo, removeTodo, editTodo };
}

// ─── Recents Hook ─────────────────────────────────────────────────────────────

const MAX_RECENTS = 8;

export function useRecents() {
  const [recents, setRecents] = recentsStore.useStore();

  const trackVisit = useCallback(
    (pageId: string) => {
      if (pageId === 'hello') return; // don't track home
      // Read current value directly to avoid dependency on `recents`
      const current = recentsStore.get();
      const next = [pageId, ...current.filter((id) => id !== pageId)].slice(0, MAX_RECENTS);
      setRecents(next);
    },
    [setRecents]
  );

  return { recents, trackVisit };
}
