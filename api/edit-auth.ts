import type { VercelRequest, VercelResponse } from '@vercel/node';
import { passwordMatches, repoConfig } from './_editor';

/**
 * POST /api/edit-auth  { password }  → 200 if it matches EDIT_PASSWORD, else 401.
 *
 * Lightweight gate so the editor drawer only opens for someone with the shared
 * password. The real protection is on /api/save-content, which re-checks.
 */
export default function handler(req: VercelRequest, res: VercelResponse): void {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { password: expected } = repoConfig();
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
