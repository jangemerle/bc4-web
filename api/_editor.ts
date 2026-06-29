/**
 * Shared helpers for the live copy editor's serverless endpoints.
 *
 * Auth: a single shared password (EDIT_PASSWORD) compared in constant time.
 * Commit: writes changed content JSON back to the repo via the GitHub Git Data
 * API as one atomic commit, using the fine-grained token in GITHUB_TOKEN.
 *
 * Nothing here is exposed to the browser — the token and password live only in
 * the Vercel function environment.
 */

import { createHash, timingSafeEqual } from 'node:crypto';

// Only these files may ever be written — hard allowlist against path traversal
// or writing anything outside the marketing copy.
export const ALLOWED_FILES = new Set([
  'src/content/cs/home.json',
  'src/content/cs/product-cc.json',
  'src/content/cs/product-calling.json',
  'src/content/cs/features.json',
  'src/content/cs/contact.json',
  'src/content/cs/common.json',
]);

const GH_API = 'https://api.github.com';

export function repoConfig() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO ?? 'jangemerle/bc4-web';
  const branch = process.env.GITHUB_BRANCH ?? 'main';
  const password = process.env.EDIT_PASSWORD;
  return { token, repo, branch, password };
}

/** Constant-time password check that tolerates differing lengths. */
export function passwordMatches(provided: unknown, expected: string | undefined): boolean {
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

export function setByPath(root: unknown, path: string, value: unknown): void {
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

async function gh(ctx: GhContext, path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${GH_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${ctx.token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'bc4-live-editor',
      ...(init?.headers ?? {}),
    },
  });
}

async function ghJson<T>(ctx: GhContext, path: string, init?: RequestInit): Promise<T> {
  const res = await gh(ctx, path, init);
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

/**
 * Apply path-level edits to each file's current repo content and push them as a
 * single commit on `branch`. Returns the new commit's HTML URL.
 */
export async function commitEdits(
  ctx: GhContext,
  fileEdits: FileEdit[],
  message: string,
): Promise<string> {
  // 1. Current branch head + base tree.
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

  // 2. For each file, fetch current content, apply edits, prepare a tree entry.
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

  // 3. New tree → commit → move branch ref.
  const tree = await ghJson<{ sha: string }>(ctx, `/repos/${ctx.repo}/git/trees`, {
    method: 'POST',
    body: JSON.stringify({ base_tree: baseTree, tree: treeEntries }),
  });
  const commit = await ghJson<{ sha: string; html_url: string }>(
    ctx,
    `/repos/${ctx.repo}/git/commits`,
    {
      method: 'POST',
      body: JSON.stringify({ message, tree: tree.sha, parents: [headSha] }),
    },
  );
  await ghJson(ctx, `/repos/${ctx.repo}/git/refs/heads/${ctx.branch}`, {
    method: 'PATCH',
    body: JSON.stringify({ sha: commit.sha }),
  });

  return commit.html_url;
}
