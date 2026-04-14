/**
 * Geo-based mock user names.
 *
 * Primary persona: Jeffrey Lebowski (The Dude) — US / default.
 * Other US users: characters from The Big Lebowski.
 *
 * Detection priority:
 *   1. /api/geo — Vercel's x-vercel-ip-country header (accurate, free, no 3rd party)
 *   2. navigator.language — fallback for local dev
 *   3. US / Big Lebowski cast — final fallback
 *
 * Adding a new country:
 *   1. Add an entry to `namesByCountry` keyed by ISO 3166-1 alpha-2 code (e.g. 'DE', 'FR')
 *   2. Also add the ISO 639-1 language fallback in `langToCountry` if the language
 *      maps unambiguously to one country (e.g. cs → CZ)
 *   3. Add 6–10 genuinely local names — research real naming conventions per region
 */

export interface MockUser {
  first: string;
  last: string;
  get full(): string;
  initials: string;
  email: string;
}

function user(first: string, last: string, emailDomain = 'kvalt.app'): MockUser {
  const slug = (s: string) =>
    s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s/g, '');
  return {
    first,
    last,
    get full() { return `${first} ${last}`; },
    initials: `${first[0]}${last[0]}`.toUpperCase(),
    email: `${slug(first)}.${slug(last)}@${emailDomain}`,
  };
}

// ─── Name sets (add new countries here) ──────────────────────────────────────

const US: MockUser[] = [
  user('Jeffrey', 'Lebowski', 'grouweapps.com'), // The Dude — primary persona
  user('Walter',  'Sobchak'),
  user('Donny',   'Kerabatsos'),
  user('Maude',   'Lebowski'),
  user('Jackie',  'Treehorn'),
  user('Bunny',   'Lebowski'),
  user('Brandt',  'Lebowski'),
];

const CZ: MockUser[] = [
  user('Zdeněk',    'Novák'),
  user('Karolína',  'Procházková'),
  user('Tomáš',     'Kratochvíl'),
  user('Markéta',   'Horáčková'),
  user('Ondřej',    'Dvořák'),
  user('Lucie',     'Svobodová'),
  user('Jakub',     'Krejčí'),
  user('Veronika',  'Blahová'),
  user('Marek',     'Šimánek'),
  user('Petra',     'Nováková'),
];

// ─── Country map (ISO 3166-1 alpha-2) ────────────────────────────────────────

const namesByCountry: Record<string, MockUser[]> = {
  CZ: CZ,
  US: US,
  // Add: DE, FR, JP, NG, IS, SK, PL, ...
};

// Language code → country fallback (for navigator.language local dev)
const langToCountry: Record<string, string> = {
  cs: 'CZ',
  // Add: de → DE, fr → FR, ja → JP, ...
};

// ─── Resolution ──────────────────────────────────────────────────────────────

function resolveByCountry(country: string | null): MockUser[] {
  if (country) return namesByCountry[country.toUpperCase()] ?? US;
  const lang = navigator.language?.split('-')[0].toLowerCase() ?? '';
  const mapped = langToCountry[lang];
  return mapped ? (namesByCountry[mapped] ?? US) : US;
}

/**
 * Picks a user deterministically by day-of-month.
 * Stable within a session, rotates daily — feels alive without being jarring.
 */
function pickUser(users: MockUser[]): MockUser {
  return users[new Date().getDate() % users.length];
}

// ─── Sync API (uses navigator.language — for local dev / SSR-less contexts) ──

export function getMockUsers(country?: string | null): MockUser[] {
  return resolveByCountry(country ?? null);
}

export function getMockUser(country?: string | null): MockUser {
  return pickUser(getMockUsers(country));
}

/** Always index 0 — Jeffrey in US, Zdeněk in CZ, etc. */
export function getPrimaryUser(country?: string | null): MockUser {
  return getMockUsers(country)[0];
}

// ─── Async API (uses /api/geo on Vercel — production-accurate) ───────────────

let _cachedCountry: string | null | undefined = undefined; // undefined = not yet fetched

async function fetchCountry(): Promise<string | null> {
  if (_cachedCountry !== undefined) return _cachedCountry;
  try {
    const res = await fetch('/api/geo');
    if (!res.ok) throw new Error('geo failed');
    const { country } = await res.json();
    _cachedCountry = country ?? null;
  } catch {
    // Local dev or fetch failed — fall back to navigator.language
    _cachedCountry = null;
  }
  return _cachedCountry ?? null;
}

/**
 * Resolves the mock user using /api/geo (Vercel country header).
 * Falls back to navigator.language if the API isn't available (local dev).
 * Result is cached for the session — safe to call multiple times.
 */
export async function resolveMockUser(): Promise<MockUser> {
  const country = await fetchCountry();
  return getMockUser(country);
}

export async function resolvePrimaryUser(): Promise<MockUser> {
  const country = await fetchCountry();
  return getPrimaryUser(country);
}
