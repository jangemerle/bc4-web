/**
 * saveCharacterToSource — persist a built Character to src/characters/characters.ts.
 *
 * Happy path: POST to the dev-only `/api/characters/save` endpoint provided
 * by the vite-character-writer plugin. The plugin writes the character block
 * directly to source and updates the `characterRegistry` array.
 *
 * Fallback: if the endpoint isn't available (prod build, dev server down,
 * non-2xx response), format the character as a TypeScript block and copy it
 * to the clipboard so the user can paste it manually.
 */

import type { Character } from '../characters/types';

export type SaveResult =
  | { ok: true; mode: 'source'; path?: string }
  | { ok: true; mode: 'clipboard' }
  | { ok: false; error: string };

function camel(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+(\w)/g, (_, c) => c.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '');
}

function formatVars(vars: Record<string, string>, indent: string = '    '): string {
  const entries = Object.entries(vars);
  if (entries.length === 0) return '{}';
  const keyWidth = Math.max(...entries.map(([k]) => k.length)) + 2;
  const lines = entries.map(([k, v]) => {
    const quotedKey = `'${k}':`;
    const pad = ' '.repeat(Math.max(0, keyWidth - k.length));
    return `${indent}${quotedKey}${pad}'${v}',`;
  });
  return `{\n${lines.join('\n')}\n${indent.slice(2)}}`;
}

/**
 * Format a character as a ready-to-paste TypeScript block for
 * `src/characters/characters.ts`.
 */
export function formatCharacterBlock(character: Character): string {
  const varName = camel(character.manifest.name);
  const m = character.manifest;
  const tags = m.tags && m.tags.length > 0
    ? `[${m.tags.map(t => `'${t.replace(/'/g, "\\'")}'`).join(', ')}]`
    : `['custom', 'user-built']`;
  const preview = m.preview ?? {};

  return `// ─── ${m.displayName} ${'─'.repeat(Math.max(0, 60 - m.displayName.length))}
// User-built character from Character Builder.

const ${varName}: Character = {
  manifest: {
    name: '${m.name}',
    displayName: '${m.displayName.replace(/'/g, "\\'")}',
    version: '${m.version || '1.0.0'}',
    description: '${(m.description || '').replace(/'/g, "\\'")}',
    personality: '${(m.personality || '').replace(/'/g, "\\'")}',
    author: '${(m.author || 'Custom').replace(/'/g, "\\'")}',
    license: 'MIT',
    tags: ${tags},
    preview: {
      primaryColor:    '${preview.primaryColor ?? ''}',
      backgroundColor: '${preview.backgroundColor ?? ''}',
      textColor:       '${preview.textColor ?? ''}',
      radius:          '${preview.radius ?? '8px'}',
    },
  },
  variables: ${formatVars(character.variables, '    ')},${
    character.darkVariables && Object.keys(character.darkVariables).length > 0
      ? `\n  darkVariables: ${formatVars(character.darkVariables, '    ')},`
      : ''
  }
};

// Remember to add \`${varName}\` to the \`characterRegistry\` array below.
`;
}

/**
 * Try to save via the dev plugin; fall back to clipboard on any failure.
 */
export async function saveCharacterToSource(character: Character): Promise<SaveResult> {
  const payload = {
    name: character.manifest.name,
    displayName: character.manifest.displayName,
    description: character.manifest.description,
    personality: character.manifest.personality,
    tags: character.manifest.tags,
    author: character.manifest.author,
    variables: character.variables,
    darkVariables: character.darkVariables,
    preview: character.manifest.preview,
  };

  try {
    const res = await fetch('/api/characters/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const json = await res.json().catch(() => ({}));
      return { ok: true, mode: 'source', path: json.path };
    }
  } catch {
    // fall through to clipboard
  }

  // Clipboard fallback
  try {
    const block = formatCharacterBlock(character);
    await navigator.clipboard.writeText(block);
    return { ok: true, mode: 'clipboard' };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

/** POST to the delete endpoint. No clipboard fallback — reset runtime only. */
export async function deleteCharacterFromSource(name: string): Promise<boolean> {
  try {
    const res = await fetch('/api/characters/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
