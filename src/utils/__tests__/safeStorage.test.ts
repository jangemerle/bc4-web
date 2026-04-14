/**
 * safeStorage — unit tests
 *
 * Validates that localStorage reads go through validation,
 * corrupt data falls back to defaults, and writes are type-safe.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  defineStorage,
  safeGet,
  safeGetRaw,
  safeSet,
  safeSetRaw,
  safeRemove,
  isOneOf,
  isString,
  isArrayOf,
  isRecord,
  hasShape,
} from '../safeStorage';

// ─── Test setup ──────────────────────────────────────────────────────────────

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

// ─── defineStorage ───────────────────────────────────────────────────────────

describe('defineStorage', () => {
  it('creates a schema object', () => {
    const schema = defineStorage('key', 'fallback', isString);
    expect(schema.key).toBe('key');
    expect(schema.fallback).toBe('fallback');
    expect(typeof schema.validate).toBe('function');
  });
});

// ─── safeGet (JSON-parsed reads) ─────────────────────────────────────────────

describe('safeGet', () => {
  const modes = ['light', 'dark', 'system'] as const;
  const schema = defineStorage(
    'theme',
    'system' as (typeof modes)[number],
    isOneOf(modes),
  );

  it('returns fallback when key is missing', () => {
    expect(safeGet(schema)).toBe('system');
  });

  it('returns valid stored value', () => {
    localStorage.setItem('theme', JSON.stringify('dark'));
    expect(safeGet(schema)).toBe('dark');
  });

  it('returns fallback and cleans up when stored value is invalid', () => {
    localStorage.setItem('theme', JSON.stringify('banana'));
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(safeGet(schema)).toBe('system');
    expect(localStorage.getItem('theme')).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Invalid data'),
    );
  });

  it('returns fallback and cleans up when JSON is corrupt', () => {
    localStorage.setItem('theme', '{not valid json');
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(safeGet(schema)).toBe('system');
    expect(localStorage.getItem('theme')).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Corrupt data'),
    );
  });

  it('applies migrate function after validation', () => {
    const migratingSchema = defineStorage(
      'version',
      'v2',
      isString,
      (val) => (val === 'v1' ? 'v2' : val),
    );
    localStorage.setItem('version', JSON.stringify('v1'));
    expect(safeGet(migratingSchema)).toBe('v2');
  });
});

// ─── safeGetRaw (non-JSON string reads) ──────────────────────────────────────

describe('safeGetRaw', () => {
  const modes = ['light', 'dark', 'system'] as const;
  const schema = defineStorage(
    'raw-theme',
    'system' as (typeof modes)[number],
    isOneOf(modes),
  );

  it('returns fallback when key is missing', () => {
    expect(safeGetRaw(schema)).toBe('system');
  });

  it('returns valid raw string', () => {
    localStorage.setItem('raw-theme', 'dark');
    expect(safeGetRaw(schema)).toBe('dark');
  });

  it('returns fallback when raw value is invalid', () => {
    localStorage.setItem('raw-theme', 'banana');
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(safeGetRaw(schema)).toBe('system');
    expect(localStorage.getItem('raw-theme')).toBeNull();
  });
});

// ─── safeSet / safeSetRaw ────────────────────────────────────────────────────

describe('safeSet', () => {
  const schema = defineStorage('data', [] as string[], isArrayOf(
    (v: unknown): v is string => typeof v === 'string',
  ));

  it('writes JSON-serialized value', () => {
    safeSet(schema, ['a', 'b']);
    expect(localStorage.getItem('data')).toBe('["a","b"]');
  });

  it('handles localStorage write failure gracefully', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceeded');
    });
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    // Should not throw
    safeSet(schema, ['x']);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Failed to write'),
      expect.any(Error),
    );
  });
});

describe('safeSetRaw', () => {
  const modes = ['light', 'dark', 'system'] as const;
  const schema = defineStorage(
    'raw-write',
    'system' as (typeof modes)[number],
    isOneOf(modes),
  );

  it('writes raw string (no JSON wrapping)', () => {
    safeSetRaw(schema, 'dark');
    expect(localStorage.getItem('raw-write')).toBe('dark');
  });
});

// ─── safeRemove ──────────────────────────────────────────────────────────────

describe('safeRemove', () => {
  it('removes a key', () => {
    localStorage.setItem('temp', 'value');
    safeRemove('temp');
    expect(localStorage.getItem('temp')).toBeNull();
  });

  it('does not throw for non-existent key', () => {
    expect(() => safeRemove('nonexistent')).not.toThrow();
  });
});

// ─── Validators ──────────────────────────────────────────────────────────────

describe('isOneOf', () => {
  const check = isOneOf(['a', 'b', 'c'] as const);

  it('accepts valid values', () => {
    expect(check('a')).toBe(true);
    expect(check('b')).toBe(true);
  });

  it('rejects invalid values', () => {
    expect(check('z')).toBe(false);
    expect(check(42)).toBe(false);
    expect(check(null)).toBe(false);
  });
});

describe('isString', () => {
  it('accepts non-empty strings', () => {
    expect(isString('hello')).toBe(true);
  });

  it('rejects empty string', () => {
    expect(isString('')).toBe(false);
  });

  it('rejects non-strings', () => {
    expect(isString(42)).toBe(false);
    expect(isString(null)).toBe(false);
  });
});

describe('isArrayOf', () => {
  const isStringArray = isArrayOf(
    (v: unknown): v is string => typeof v === 'string',
  );

  it('accepts valid arrays', () => {
    expect(isStringArray(['a', 'b'])).toBe(true);
    expect(isStringArray([])).toBe(true);
  });

  it('rejects arrays with wrong item types', () => {
    expect(isStringArray([1, 2])).toBe(false);
    expect(isStringArray(['a', 42])).toBe(false);
  });

  it('rejects non-arrays', () => {
    expect(isStringArray('string')).toBe(false);
    expect(isStringArray(null)).toBe(false);
  });
});

describe('isRecord', () => {
  it('accepts plain objects', () => {
    expect(isRecord({})).toBe(true);
    expect(isRecord({ a: 1 })).toBe(true);
  });

  it('rejects arrays and null', () => {
    expect(isRecord([])).toBe(false);
    expect(isRecord(null)).toBe(false);
    expect(isRecord('string')).toBe(false);
  });
});

describe('hasShape', () => {
  interface Point { x: number; y: number }
  const isPoint = hasShape<Point>({
    x: (v) => typeof v === 'number',
    y: (v) => typeof v === 'number',
  });

  it('accepts valid shapes', () => {
    expect(isPoint({ x: 1, y: 2 })).toBe(true);
  });

  it('accepts shapes with extra properties', () => {
    expect(isPoint({ x: 1, y: 2, z: 3 })).toBe(true);
  });

  it('rejects shapes with missing properties', () => {
    expect(isPoint({ x: 1 })).toBe(false);
  });

  it('rejects shapes with wrong types', () => {
    expect(isPoint({ x: 'a', y: 2 })).toBe(false);
  });

  it('rejects non-objects', () => {
    expect(isPoint(null)).toBe(false);
    expect(isPoint('string')).toBe(false);
  });
});

// ─── Integration: storageSchemas ─────────────────────────────────────────────

describe('storageSchemas integration', () => {
  it('themeModeSchema validates correctly', async () => {
    const { themeModeSchema } = await import('../storageSchemas');

    // Valid
    localStorage.setItem('blueprint-theme-mode', 'dark');
    expect(safeGetRaw(themeModeSchema)).toBe('dark');

    // Invalid → fallback
    localStorage.setItem('blueprint-theme-mode', 'neon');
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(safeGetRaw(themeModeSchema)).toBe('system');
  });

  it('todosSchema validates array of todos', async () => {
    const { todosSchema } = await import('../storageSchemas');

    const validTodos = [
      { id: '1', text: 'Test', done: false, createdAt: Date.now() },
    ];
    localStorage.setItem('kvalt-workspace-todos', JSON.stringify(validTodos));
    expect(safeGet(todosSchema)).toEqual(validTodos);

    // Corrupt → fallback
    localStorage.setItem('kvalt-workspace-todos', JSON.stringify([{ bad: true }]));
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(safeGet(todosSchema)).toEqual([]);
  });

  it('favoritesSchema validates string array', async () => {
    const { favoritesSchema } = await import('../storageSchemas');

    localStorage.setItem('kvalt-workspace-favorites', JSON.stringify(['page-1', 'page-2']));
    expect(safeGet(favoritesSchema)).toEqual(['page-1', 'page-2']);

    // Mixed types → fallback
    localStorage.setItem('kvalt-workspace-favorites', JSON.stringify(['ok', 42]));
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(safeGet(favoritesSchema)).toEqual([]);
  });

  it('notesSchema validates sticky note records', async () => {
    const { notesSchema } = await import('../storageSchemas');

    const validNotes = {
      'page-1': { pageId: 'page-1', text: 'Hello', updatedAt: 123 },
    };
    localStorage.setItem('kvalt-workspace-notes', JSON.stringify(validNotes));
    expect(safeGet(notesSchema)).toEqual(validNotes);

    // Invalid shape → fallback
    localStorage.setItem('kvalt-workspace-notes', JSON.stringify({ bad: 'data' }));
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(safeGet(notesSchema)).toEqual({});
  });

  it('characterSchema validates non-empty string', async () => {
    const { characterSchema } = await import('../storageSchemas');

    localStorage.setItem('kvalt-character', 'fintech');
    expect(safeGetRaw(characterSchema)).toBe('fintech');

    // Empty string → fallback
    localStorage.setItem('kvalt-character', '');
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(safeGetRaw(characterSchema)).toBe('');
  });
});
