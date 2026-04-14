/**
 * safeStorage — Validated localStorage wrapper
 *
 * Every read goes through a validator function. If the stored value
 * is missing, corrupt, or doesn't match the expected shape, the
 * fallback is returned instead of crashing.
 *
 * Usage:
 *   const schema = defineStorage('my-key', 'default', isString);
 *   const value = safeGet(schema);        // typed & validated
 *   safeSet(schema, 'new value');          // type-checked write
 */

// ─── Schema definition ───────────────────────────────────────────────────────

export interface StorageSchema<T> {
  /** localStorage key */
  key: string;
  /** Returned when stored value is missing or invalid */
  fallback: T;
  /** Returns true only if `value` is a valid T */
  validate: (value: unknown) => value is T;
  /** Optional transform after validation (e.g. migration) */
  migrate?: (value: T) => T;
}

export function defineStorage<T>(
  key: string,
  fallback: T,
  validate: (value: unknown) => value is T,
  migrate?: (value: T) => T,
): StorageSchema<T> {
  return { key, fallback, validate, migrate };
}

// ─── Core operations ─────────────────────────────────────────────────────────

/** Read a value from localStorage with validation */
export function safeGet<T>(schema: StorageSchema<T>): T {
  if (typeof window === 'undefined') return schema.fallback;

  try {
    const raw = localStorage.getItem(schema.key);
    if (raw === null) return schema.fallback;

    const parsed: unknown = JSON.parse(raw);

    if (!schema.validate(parsed)) {
      // Stored value doesn't match expected shape — clean it up
      console.warn(
        `[safeStorage] Invalid data for "${schema.key}", using fallback.`,
      );
      localStorage.removeItem(schema.key);
      return schema.fallback;
    }

    return schema.migrate ? schema.migrate(parsed) : parsed;
  } catch {
    // JSON.parse failed — corrupt data
    console.warn(
      `[safeStorage] Corrupt data for "${schema.key}", using fallback.`,
    );
    localStorage.removeItem(schema.key);
    return schema.fallback;
  }
}

/** Read a raw string value (no JSON.parse) with validation */
export function safeGetRaw<T extends string>(schema: StorageSchema<T>): T {
  if (typeof window === 'undefined') return schema.fallback;

  try {
    const raw = localStorage.getItem(schema.key);
    if (raw === null) return schema.fallback;

    if (!schema.validate(raw)) {
      console.warn(
        `[safeStorage] Invalid value for "${schema.key}", using fallback.`,
      );
      localStorage.removeItem(schema.key);
      return schema.fallback;
    }

    return schema.migrate ? schema.migrate(raw) : raw;
  } catch {
    return schema.fallback;
  }
}

/** Write a value to localStorage (JSON-serialized) */
export function safeSet<T>(schema: StorageSchema<T>, value: T): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(schema.key, JSON.stringify(value));
  } catch (e) {
    // localStorage full or blocked
    console.warn(`[safeStorage] Failed to write "${schema.key}":`, e);
  }
}

/** Write a raw string value (no JSON.stringify) */
export function safeSetRaw<T extends string>(
  schema: StorageSchema<T>,
  value: T,
): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(schema.key, value);
  } catch (e) {
    console.warn(`[safeStorage] Failed to write "${schema.key}":`, e);
  }
}

/** Remove a key from localStorage */
export function safeRemove(key: string): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(key);
  } catch {
    // Silently ignore — storage might be blocked
  }
}

// ─── Common validators ───────────────────────────────────────────────────────

/** Validate that value is one of the allowed string literals */
export function isOneOf<T extends string>(
  allowed: readonly T[],
): (value: unknown) => value is T {
  return (value: unknown): value is T =>
    typeof value === 'string' && (allowed as readonly string[]).includes(value);
}

/** Validate that value is a non-empty string */
export function isString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

/** Validate that value is an array where every item passes a check */
export function isArrayOf<T>(
  itemValidator: (item: unknown) => item is T,
): (value: unknown) => value is T[] {
  return (value: unknown): value is T[] =>
    Array.isArray(value) && value.every(itemValidator);
}

/** Validate that value is a record (object) with string keys */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Validate that value matches a shape (shallow check) */
export function hasShape<T>(
  checks: { [K in keyof T]: (v: unknown) => boolean },
): (value: unknown) => value is T {
  return (value: unknown): value is T => {
    if (!isRecord(value)) return false;
    for (const key in checks) {
      if (!checks[key]((value as Record<string, unknown>)[key])) return false;
    }
    return true;
  };
}
