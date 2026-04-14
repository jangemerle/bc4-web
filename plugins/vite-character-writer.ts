/**
 * vite-character-writer — dev-only endpoint for writing characters to source.
 *
 * Endpoints:
 *   POST /api/characters/save
 *     body: { name, displayName, description, personality, tags,
 *             variables, darkVariables, preview?, author? }
 *     Writes a Character block into src/characters/characters.ts before the
 *     Registry section, and adds the character name to the characterRegistry
 *     array. If a character with the same name already exists in the file,
 *     its old block is removed first (last-wins semantics).
 *
 *   POST /api/characters/delete
 *     body: { name }
 *     Removes the Character block and registry entry.
 *
 * Only active in dev mode. Production builds are untouched — the Character
 * Builder falls back to clipboard copy when the endpoint returns 404.
 */

import type { Plugin } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

interface SaveBody {
  name: string;
  displayName: string;
  description?: string;
  personality?: string;
  tags?: string[];
  author?: string;
  variables: Record<string, string>;
  darkVariables?: Record<string, string>;
  preview?: {
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    radius?: string;
  };
}

function toCamel(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+(\w)/g, (_, c) => c.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '');
}

function formatVarsBlock(vars: Record<string, string>, indent: string = '    '): string {
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

function formatCharacterBlock(body: SaveBody): string {
  const varName = toCamel(body.name);
  const tags = body.tags && body.tags.length > 0
    ? `[${body.tags.map(t => `'${t}'`).join(', ')}]`
    : `['custom', 'user-built']`;
  const preview = body.preview ?? {};
  const description = (body.description ?? '').replace(/'/g, "\\'");
  const personality = (body.personality ?? '').replace(/'/g, "\\'");
  const author = (body.author ?? 'Custom').replace(/'/g, "\\'");

  return `// ─── ${body.displayName} ${'─'.repeat(Math.max(0, 60 - body.displayName.length))}
// User-built character from Character Builder. Generated from src/pages/workshop/CharacterBuilderPage.

const ${varName}: Character = {
  manifest: {
    name: '${body.name}',
    displayName: '${body.displayName.replace(/'/g, "\\'")}',
    version: '1.0.0',
    description: '${description}',
    personality: '${personality}',
    author: '${author}',
    license: 'MIT',
    tags: ${tags},
    preview: {
      primaryColor:    '${preview.primaryColor ?? ''}',
      backgroundColor: '${preview.backgroundColor ?? ''}',
      textColor:       '${preview.textColor ?? ''}',
      radius:          '${preview.radius ?? '8px'}',
    },
  },
  variables: ${formatVarsBlock(body.variables, '    ')},${
    body.darkVariables && Object.keys(body.darkVariables).length > 0
      ? `\n  darkVariables: ${formatVarsBlock(body.darkVariables, '    ')},`
      : ''
  }
};

`;
}

/**
 * Remove an existing character block from source by its camelCase const name.
 * Scans for `// ─── DisplayName ...` markers and removes through the matching
 * `};\n\n` terminator.
 */
function removeCharacterBlock(source: string, varName: string): string {
  // Match: `const <varName>: Character = {` followed by balanced braces and a closing `};`
  // varName is already sanitized to [a-zA-Z0-9] via toCamel — safe to interpolate.
  // eslint-disable-next-line security/detect-non-literal-regexp
  const constRegex = new RegExp(`(// ─── [^\\n]*\\n(?:// [^\\n]*\\n)*\\n?)?const ${varName}: Character = \\{`, 'g');
  const match = constRegex.exec(source);
  if (!match) return source;

  const startIdx = match.index;
  const openIdx = source.indexOf('{', match.index + match[0].length - 1);
  let depth = 1;
  let i = openIdx + 1;
  while (i < source.length && depth > 0) {
    const ch = source[i];
    if (ch === '{') depth++;
    else if (ch === '}') depth--;
    i++;
  }
  // Skip the trailing `;` and any immediate newlines
  while (i < source.length && (source[i] === ';' || source[i] === '\n')) i++;
  return source.slice(0, startIdx) + source.slice(i);
}

function removeFromRegistry(source: string, varName: string): string {
  const registryMatch = source.match(/(export const characterRegistry: Character\[\] = \[)([\s\S]*?)(\];)/);
  if (!registryMatch) return source;
  const [, head, body, tail] = registryMatch;
  const lines = body
    .split('\n')
    .filter(line => line.trim().replace(/,$/, '') !== varName)
    .join('\n');
  return source.replace(registryMatch[0], head + lines + tail);
}

function addToRegistry(source: string, varName: string): string {
  const registryMatch = source.match(/(export const characterRegistry: Character\[\] = \[)([\s\S]*?)(\];)/);
  if (!registryMatch) return source;
  const [, head, body, tail] = registryMatch;
  // Don't double-add
  if (body.split('\n').some(line => line.trim().replace(/,$/, '') === varName)) {
    return source;
  }
  const trimmedBody = body.trimEnd();
  const newBody = trimmedBody + `\n  ${varName},\n`;
  return source.replace(registryMatch[0], head + newBody + tail);
}

async function readBody(req: import('node:http').IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

export function characterWriter(): Plugin {
  const charactersPath = path.resolve(process.cwd(), 'src/characters/characters.ts');

  return {
    name: 'kvalt-character-writer',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url) return next();

        // ── SAVE ─────────────────────────────────────────────────────────
        if (req.url.startsWith('/api/characters/save') && req.method === 'POST') {
          try {
            const raw = await readBody(req);
            const body = JSON.parse(raw) as SaveBody;
            if (!body.name || !body.displayName || !body.variables) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Missing name / displayName / variables' }));
              return;
            }

            const varName = toCamel(body.name);
            let source = fs.readFileSync(charactersPath, 'utf8');

            // Last-wins: remove existing block + registry entry for same name
            source = removeCharacterBlock(source, varName);
            source = removeFromRegistry(source, varName);

            // Insert new block before the Registry section
            const registryIdx = source.indexOf('// ─── Registry');
            if (registryIdx === -1) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Could not find Registry marker in characters.ts' }));
              return;
            }
            const block = formatCharacterBlock(body);
            source = source.slice(0, registryIdx) + block + source.slice(registryIdx);

            // Add to registry array
            source = addToRegistry(source, varName);

            fs.writeFileSync(charactersPath, source, 'utf8');

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true, varName, path: charactersPath }));
            return;
          } catch (e) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: (e as Error).message }));
            return;
          }
        }

        // ── DELETE ───────────────────────────────────────────────────────
        if (req.url.startsWith('/api/characters/delete') && req.method === 'POST') {
          try {
            const raw = await readBody(req);
            const body = JSON.parse(raw) as { name: string };
            if (!body.name) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Missing name' }));
              return;
            }
            const varName = toCamel(body.name);
            let source = fs.readFileSync(charactersPath, 'utf8');
            source = removeCharacterBlock(source, varName);
            source = removeFromRegistry(source, varName);
            fs.writeFileSync(charactersPath, source, 'utf8');

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true }));
            return;
          } catch (e) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: (e as Error).message }));
            return;
          }
        }

        return next();
      });
    },
  };
}
