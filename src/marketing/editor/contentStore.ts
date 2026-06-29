/**
 * Marketing content store — the live-preview seam for the edit drawer.
 *
 * Holds a mutable working copy of every marketing content namespace, seeded
 * from the JSON modules. Marketing pages read their namespace through
 * `useMarketingContent(ns)` so an edit in the drawer re-renders the page
 * instantly, in place, on the real site.
 *
 * Out of edit mode this is inert: each namespace keeps its original object
 * reference until something is actually edited, so there's zero behavioural or
 * perf cost on normal page loads.
 */

import { home } from '@/content/cs/home';
import { contact } from '@/content/cs/contact';
import { common } from '@/content/cs/common';
import { features } from '@/content/cs/features';
import { productContactCenter } from '@/content/cs/product-cc';
import { productCalling } from '@/content/cs/product-calling';

// ─── Namespace registry ──────────────────────────────────────────────────────
// Key → the JSON file the server commits to. Order = drawer display order.

export const NAMESPACE_FILES = {
  home: 'src/content/cs/home.json',
  productContactCenter: 'src/content/cs/product-cc.json',
  productCalling: 'src/content/cs/product-calling.json',
  features: 'src/content/cs/features.json',
  contact: 'src/content/cs/contact.json',
  common: 'src/content/cs/common.json',
} as const;

export type NamespaceKey = keyof typeof NAMESPACE_FILES;

export const NAMESPACE_LABELS: Record<NamespaceKey, string> = {
  home: 'Homepage',
  productContactCenter: 'Produkt — Kontaktní centrum',
  productCalling: 'Produkt — Volání',
  features: 'Funkce',
  contact: 'Kontakt',
  common: 'Společné (nav, footer, CTA)',
};

type ContentObject = Record<string, unknown>;

const SEED: Record<NamespaceKey, ContentObject> = {
  home: home as unknown as ContentObject,
  productContactCenter: productContactCenter as unknown as ContentObject,
  productCalling: productCalling as unknown as ContentObject,
  features: features as unknown as ContentObject,
  contact: contact as unknown as ContentObject,
  common: common as unknown as ContentObject,
};

// ─── State ───────────────────────────────────────────────────────────────────
// `original` is the frozen baseline (for diffing + reset). `current` is the
// live working copy the pages render. Each namespace holds its own object
// reference so we can bump just one on edit.

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

const original: Record<NamespaceKey, ContentObject> = deepClone(SEED);
const current: Record<NamespaceKey, ContentObject> = deepClone(SEED);

const listeners = new Set<() => void>();
let version = 0;

function notify(): void {
  version++;
  for (const l of listeners) l();
}

/** Monotonic counter bumped on every edit — a stable snapshot for useSyncExternalStore. */
export function getVersion(): number {
  return version;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getNamespace(ns: NamespaceKey): ContentObject {
  return current[ns];
}

// ─── Path helpers (support array indices: "faq.items.0.question") ────────────

type Key = string | number;

function parsePath(path: string): Key[] {
  return path.split('.').map((seg) => (/^\d+$/.test(seg) ? Number(seg) : seg));
}

export function getByPath(obj: unknown, path: string): unknown {
  let cur: unknown = obj;
  for (const key of parsePath(path)) {
    if (cur == null) return undefined;
    cur = (cur as Record<Key, unknown>)[key];
  }
  return cur;
}

// Immutably set a value by path, cloning only the spine that changes so React
// sees new references exactly where it needs to.
function setByPathImmutable(root: ContentObject, path: string, value: unknown): ContentObject {
  const keys = parsePath(path);
  const clone = Array.isArray(root) ? [...root] : { ...root };
  let cursor: Record<Key, unknown> = clone as Record<Key, unknown>;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const child = cursor[key];
    const childClone = Array.isArray(child) ? [...child] : { ...(child as object) };
    cursor[key] = childClone;
    cursor = childClone as Record<Key, unknown>;
  }
  cursor[keys[keys.length - 1]] = value;
  return clone as ContentObject;
}

export function setValueByPath(ns: NamespaceKey, path: string, value: unknown): void {
  current[ns] = setByPathImmutable(current[ns], path, value);
  notify();
}

export function resetNamespace(ns: NamespaceKey): void {
  current[ns] = deepClone(original[ns]);
  notify();
}

export function resetAll(): void {
  for (const ns of Object.keys(current) as NamespaceKey[]) {
    current[ns] = deepClone(original[ns]);
  }
  notify();
}

// Sync the baseline to the working copy after a successful publish, so the
// "changed" set goes back to empty without a page reload.
export function commitBaseline(): void {
  for (const ns of Object.keys(current) as NamespaceKey[]) {
    original[ns] = deepClone(current[ns]);
  }
  notify();
}

// ─── Editable-field enumeration ──────────────────────────────────────────────
// Walks a namespace and yields every editable leaf (string + number) with its
// dotted path. Technical keys (ids, hrefs, asset paths, discriminators) are
// flagged so the drawer can de-emphasise them.

export interface EditableField {
  path: string;
  value: string | number;
  type: 'string' | 'number';
  /** Last segment of the path — the field's local name. */
  key: string;
  /** Top-level section the field lives under (for grouping). */
  section: string;
  /** True for ids/links/assets/discriminators — copy editors usually skip these. */
  technical: boolean;
}

const TECHNICAL_KEYS = new Set([
  'trackingId',
  'href',
  'src',
  'ogImage',
  'type',
  'id',
  'icon',
  'variant',
  'name', // social/logo machine names; real display copy lives in label/title
]);

function isTechnical(key: string): boolean {
  return TECHNICAL_KEYS.has(key);
}

export function enumerateFields(ns: NamespaceKey): EditableField[] {
  const out: EditableField[] = [];
  const root = current[ns];

  function walk(node: unknown, path: string, section: string): void {
    if (node == null) return;
    if (Array.isArray(node)) {
      node.forEach((item, i) => walk(item, path ? `${path}.${i}` : String(i), section));
      return;
    }
    if (typeof node === 'object') {
      for (const [k, v] of Object.entries(node as ContentObject)) {
        const childPath = path ? `${path}.${k}` : k;
        const childSection = section || k;
        walk(v, childPath, childSection);
      }
      return;
    }
    if (typeof node === 'string' || typeof node === 'number') {
      const key = path.split('.').pop() ?? path;
      out.push({
        path,
        value: node,
        type: typeof node === 'number' ? 'number' : 'string',
        key,
        section,
        technical: isTechnical(key),
      });
    }
  }

  walk(root, '', '');
  return out;
}

// ─── Change tracking ─────────────────────────────────────────────────────────

export interface Change {
  ns: NamespaceKey;
  path: string;
  before: unknown;
  after: unknown;
}

export function getChanges(): Change[] {
  const changes: Change[] = [];
  for (const ns of Object.keys(current) as NamespaceKey[]) {
    for (const field of enumerateFields(ns)) {
      const before = getByPath(original[ns], field.path);
      const after = field.value;
      if (before !== after) {
        changes.push({ ns, path: field.path, before, after });
      }
    }
  }
  return changes;
}

export function hasChanges(): boolean {
  return getChanges().length > 0;
}

// Payload for the save API: only changed namespaces, as { path: value } maps.
export function getEditPayload(): Record<string, Record<string, unknown>> {
  const payload: Record<string, Record<string, unknown>> = {};
  for (const change of getChanges()) {
    const file = NAMESPACE_FILES[change.ns];
    (payload[file] ??= {})[change.path] = change.after;
  }
  return payload;
}
