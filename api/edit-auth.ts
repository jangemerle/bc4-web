import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHash, timingSafeEqual } from 'node:crypto';

/**
 * POST /api/edit-auth  { password }  → 200 if it matches EDIT_PASSWORD, else 401.
 *
 * Lightweight gate so the editor drawer only opens for someone with the shared
 * password. The real protection is on /api/save-content, which re-checks.
 *
 * Self-contained (no shared imports) to match the other api/ functions — Vercel
 * deploys each api file independently.
 */

/** Constant-time password check that tolerates differing lengths. */
function passwordMatches(provided: unknown, expected: string | undefined): boolean {
  if (!expected || typeof provided !== 'string') return false;
  const a = createHash('sha256').update(provided).digest();
  const b = createHash('sha256').update(expected).digest();
  return timingSafeEqual(a, b);
}

export default function handler(req: VercelRequest, res: VercelResponse): void {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const expected = process.env.EDIT_PASSWORD;
  if (!expected) {
    res.status(500).json({ error: 'Editor není nakonfigurovaný (chybí EDIT_PASSWORD).' });
    return;
  }

  const provided = (req.body as { password?: unknown } | undefined)?.password;
  if (passwordMatches(provided, expected)) {
    res.status(200).json({ ok: true });
  } else {
    res.status(401).json({ error: 'Špatné heslo.' });
  }
}
