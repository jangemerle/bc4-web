import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHash, timingSafeEqual } from 'node:crypto';

/**
 * POST /api/save-content
 *   { password, edits: { "<file>": { "<path>": <value> } } }
 *
 * Verifies the shared password, validates the edit payload against a hard file
 * allowlist, and commits the changes to the repo as one atomic commit via the
 * GitHub Git Data API. Vercel's git integration then redeploys, so the edits go
 * live and land in code.
 *
 * Self-contained (no shared imports) to match the other api/ functions — Vercel
 * deploys each api file independently. Token + password live only in the
 * function environment.
 */

const MAX_EDITS = 500;
const MAX_VALUE_LEN = 5000;

// Only these files may ever be written — hard allowlist against path traversal
// or writing anything outside the marketing copy.
const ALLOWED_FILES = new Set([
  'src/content/cs/home.json',
  'src/content/cs/product-cc.json',
  'src/content/cs/product-calling.json',
  'src/content/cs/features.json',
  'src/content/cs/contact.json',
  'src/content/cs/common.json',
]);

const GH_API = 'https://api.github.com';

/** Constant-time password check that tolerates differing lengths. */
function passwordMatches(provided: unknown, expected: string | undefined): boolean {
  if (!expected || typeof provided !== 'string') return false;
  const a = createHash('sha256').update(provided).digest();
  const b = createHash('sha256').update(expected).digest();
  return timingSafeEqual(a, b);
}

// ─── Path setter (mirrors the client store, supports array indices) ──────────

type Key = string | number;

function parsePath(path: string): Key[] {
  return path.split('.').map((seg) => (/^\d+$/.test(seg) ? Number(seg) : seg));
}

function setByPath(root: unknown, path: string, value: unknown): void {
  const keys = parsePath(path);
  let cursor = root as Record<Key, unknown>;
  for (let i = 0; i < keys.length - 1; i++) {
    const next = cursor[keys[i]];
    if (next == null || typeof next !== 'object') {
      throw new Error(`Path "${path}" does not exist in target file`);
    }
    cursor = next as Record<Key, unknown>;
  }
  cursor[keys[keys.length - 1]] = value;
}

// ─── GitHub REST helpers ─────────────────────────────────────────────────────

interface GhContext {
  token: string;
  repo: string;
  branch: string;
}

async function ghJson<T>(ctx: GhContext, path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${GH_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${ctx.token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'bc4-live-editor',
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`GitHub ${init?.method ?? 'GET'} ${path} → ${res.status}: ${body.slice(0, 300)}`);
  }
  return (await res.json()) as T;
}

interface FileEdit {
  file: string;
  edits: Record<string, unknown>;
}

/** Apply path-level edits to each file's current content and push one commit. */
async function commitEdits(ctx: GhContext, fileEdits: FileEdit[], message: string): Promise<string> {
  const ref = await ghJson<{ object: { sha: string } }>(
    ctx,
    `/repos/${ctx.repo}/git/ref/heads/${ctx.branch}`,
  );
  const headSha = ref.object.sha;
  const headCommit = await ghJson<{ tree: { sha: string } }>(
    ctx,
    `/repos/${ctx.repo}/git/commits/${headSha}`,
  );
  const baseTree = headCommit.tree.sha;

  const treeEntries: { path: string; mode: '100644'; type: 'blob'; content: string }[] = [];
  for (const { file, edits } of fileEdits) {
    const current = await ghJson<{ content: string; encoding: string }>(
      ctx,
      `/repos/${ctx.repo}/contents/${file}?ref=${ctx.branch}`,
    );
    const raw = Buffer.from(current.content, current.encoding as BufferEncoding).toString('utf8');
    const data = JSON.parse(raw) as unknown;
    for (const [path, value] of Object.entries(edits)) {
      setByPath(data, path, value);
    }
    const next = JSON.stringify(data, null, 2) + '\n';
    treeEntries.push({ path: file, mode: '100644', type: 'blob', content: next });
  }

  const tree = await ghJson<{ sha: string }>(ctx, `/repos/${ctx.repo}/git/trees`, {
    method: 'POST',
    body: JSON.stringify({ base_tree: baseTree, tree: treeEntries }),
  });
  const commit = await ghJson<{ sha: string; html_url: string }>(
    ctx,
    `/repos/${ctx.repo}/git/commits`,
    { method: 'POST', body: JSON.stringify({ message, tree: tree.sha, parents: [headSha] }) },
  );
  await ghJson(ctx, `/repos/${ctx.repo}/git/refs/heads/${ctx.branch}`, {
    method: 'PATCH',
    body: JSON.stringify({ sha: commit.sha }),
  });

  return commit.html_url;
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const token = process.env.GITHUB_TOKEN;
  const password = process.env.EDIT_PASSWORD;
  const repo = process.env.GITHUB_REPO ?? 'jangemerle/bc4-web';
  const branch = process.env.GITHUB_BRANCH ?? 'main';

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

  const fileEdits: FileEdit[] = [];
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
