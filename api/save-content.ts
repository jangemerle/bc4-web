import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ALLOWED_FILES, commitEdits, passwordMatches, repoConfig } from './_editor';

/**
 * POST /api/save-content
 *   { password, edits: { "<file>": { "<path>": <value> } } }
 *
 * Verifies the shared password, validates the edit payload against a hard file
 * allowlist, and commits the changes to the repo as one atomic commit. Vercel's
 * git integration then redeploys, so the edits go live and land in code.
 */

const MAX_EDITS = 500;
const MAX_VALUE_LEN = 5000;

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { token, repo, branch, password } = repoConfig();
  if (!password || !token) {
    res.status(500).json({
      error: 'Editor není nakonfigurovaný (chybí EDIT_PASSWORD nebo GITHUB_TOKEN).',
    });
    return;
  }

  const body = req.body as { password?: unknown; edits?: unknown } | undefined;

  if (!passwordMatches(body?.password, password)) {
    res.status(401).json({ error: 'Špatné heslo.' });
    return;
  }

  // ── Validate the edit payload ──────────────────────────────────────────────
  const edits = body?.edits;
  if (!edits || typeof edits !== 'object' || Array.isArray(edits)) {
    res.status(400).json({ error: 'Neplatný formát změn.' });
    return;
  }

  const fileEdits: { file: string; edits: Record<string, unknown> }[] = [];
  let totalEdits = 0;

  for (const [file, fileChanges] of Object.entries(edits as Record<string, unknown>)) {
    if (!ALLOWED_FILES.has(file)) {
      res.status(400).json({ error: `Nepovolený soubor: ${file}` });
      return;
    }
    if (!fileChanges || typeof fileChanges !== 'object' || Array.isArray(fileChanges)) {
      res.status(400).json({ error: `Neplatné změny pro ${file}` });
      return;
    }
    const clean: Record<string, unknown> = {};
    for (const [path, value] of Object.entries(fileChanges as Record<string, unknown>)) {
      // Only primitive copy values; reject objects/arrays/control chars in paths.
      const okType =
        typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
      if (!okType) {
        res.status(400).json({ error: `Neplatná hodnota na cestě ${path}` });
        return;
      }
      if (typeof value === 'string' && value.length > MAX_VALUE_LEN) {
        res.status(400).json({ error: `Hodnota na ${path} je příliš dlouhá.` });
        return;
      }
      if (!/^[\w.]+$/.test(path)) {
        res.status(400).json({ error: `Neplatná cesta: ${path}` });
        return;
      }
      clean[path] = value;
      totalEdits++;
    }
    if (Object.keys(clean).length > 0) {
      fileEdits.push({ file, edits: clean });
    }
  }

  if (fileEdits.length === 0) {
    res.status(400).json({ error: 'Žádné změny k uložení.' });
    return;
  }
  if (totalEdits > MAX_EDITS) {
    res.status(400).json({ error: 'Příliš mnoho změn najednou.' });
    return;
  }

  // ── Commit ──────────────────────────────────────────────────────────────────
  const fileCount = fileEdits.length;
  const message =
    `content(bc4): live edit — ${totalEdits} změn v ${fileCount} ` +
    `${fileCount === 1 ? 'souboru' : 'souborech'}\n\n` +
    `Přes in-page editor (/api/save-content).`;

  try {
    const commitUrl = await commitEdits({ token, repo, branch }, fileEdits, message);
    res.status(200).json({ ok: true, commitUrl, edits: totalEdits });
  } catch (err) {
    const detail = err instanceof Error ? err.message : 'Neznámá chyba';
    res.status(502).json({ error: `Commit selhal: ${detail}` });
  }
}
