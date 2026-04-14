#!/usr/bin/env node

/**
 * Token Coverage Audit Script
 *
 * Scans all component files for hardcoded values that should come from the token system.
 * Run: npm run audit:tokens
 *
 * Checks:
 *   1. Hardcoded hex colors (#fff, #c0c8c8, etc.) outside of comments/docs
 *   2. Hardcoded rgba/hsla values in runtime code (not comments)
 *   3. Hardcoded spring configs (type: 'spring', visualDuration:, bounce:)
 *   4. Hardcoded duration numbers in transition/animate props
 *   5. Hardcoded cubic-bezier / easing arrays
 *   6. Hardcoded box-shadow strings (outside of token imports)
 *   7. CSS fallback values in var() — e.g., var(--color-x, #hex)
 *
 * Allowlisted patterns:
 *   - Comments (lines starting with * or //)
 *   - bg-white, text-white (Tailwind utility, not a hardcoded color)
 *   - rounded-full (intentional for circular elements)
 *   - sr-only, className strings
 *   - ContrastExplorer.tsx (color exploration tool, dynamic colors are its purpose)
 *   - HsluvExplainer*.tsx (color science demos, same reasoning)
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const COMPONENTS_DIR = join(process.cwd(), 'src/components');
const PAGES_DIR = join(process.cwd(), 'src/pages');

// Files where dynamic/display color values are the point — skip visual checks
const FULL_ALLOWLIST = [
  'ContrastExplorer.tsx',
  'HsluvExplainer.tsx',
  'HsluvExplainers.tsx',
  'FoundationsCoverFlow.tsx',    // Dark-themed visual showcase with decorative styles
  'CodePanel.tsx',               // Syntax-highlighted code panel with intentional dark theme
  'ChromaCurveEditor.tsx',       // Color curve editor — generates colors dynamically
  'ColorInput.tsx',              // Color input with hex placeholder, dynamic swatches
  'DashboardPreview.tsx',        // Palette generator preview — all colors are dynamic
];

// Alias for backwards compat
const COLOR_ALLOWLIST = FULL_ALLOWLIST;

// ─── Violation rules ────────────────────────────────────────────────────────

const rules = [
  {
    id: 'hardcoded-hex',
    description: 'Hardcoded hex color — use semantic CSS variable (var(--color-*))',
    // Match #xxx, #xxxx, #xxxxxx, #xxxxxxxx — but not inside comments or Tailwind classes
    test: (line, _file) => {
      if (isComment(line)) return false;
      // Match hex colors in style objects, inline styles, backgroundColor, color, etc.
      const matches = line.match(/#[0-9a-fA-F]{3,8}\b/g);
      if (!matches) return false;
      // Filter out Tailwind class references like bg-[#xxx] which are also violations
      // but keep them — they should also use tokens
      return matches.filter(m => {
        // Skip if inside a comment block (JSDoc)
        if (line.trim().startsWith('*') || line.trim().startsWith('//')) return false;
        // Skip hex in import paths or string literals that are clearly not colors
        if (line.includes('import ') || line.includes('require(')) return false;
        return true;
      }).length > 0;
    },
    skipForFiles: COLOR_ALLOWLIST,
  },
  {
    id: 'hardcoded-rgba',
    description: 'Hardcoded rgba/hsla — use semantic CSS variable or token',
    test: (line, _file) => {
      if (isComment(line)) return false;
      // Allow rgba(0,0,0,0) — transparent, legitimate use
      if (/rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\s*\)/.test(line)) return false;
      // Allow low-opacity black overlays (backdrop scrims, no token exists yet)
      if (/rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\.[01]\d*\s*\)/.test(line)) return false;
      return /rgba?\s*\(/.test(line) || /hsla?\s*\(/.test(line);
    },
    skipForFiles: COLOR_ALLOWLIST,
  },
  {
    id: 'css-var-fallback',
    description: 'CSS var() with hardcoded fallback — tokens are always defined, remove fallback',
    test: (line, _file) => {
      if (isComment(line)) return false;
      // var(--something, #hex) or var(--something, rgb(...))
      return /var\(--[^,]+,\s*[#r]/.test(line);
    },
    skipForFiles: FULL_ALLOWLIST,
  },
  {
    id: 'hardcoded-spring',
    description: 'Hardcoded spring config — import from tokens/motion.ts',
    test: (line, _file) => {
      if (isComment(line)) return false;
      // Match inline spring configs not from import
      if (/visualDuration:\s*[\d.]+/.test(line) && !line.includes('tokens/motion')) return true;
      if (/bounce:\s*[\d.]+/.test(line) && !line.includes('tokens/motion')) return true;
      return false;
    },
    skipForFiles: FULL_ALLOWLIST,
  },
  {
    id: 'hardcoded-duration',
    description: 'Hardcoded duration number in animation — use duration.* token',
    test: (line, _file) => {
      if (isComment(line)) return false;
      // Match duration: 0.X or duration: X.X in transition/animation objects
      // But NOT duration: 0 (instant/disabled) or duration.something (token reference)
      if (/duration:\s*[\d.]+/.test(line) && !/duration\.\w/.test(line) && !/duration:\s*0[,}\s]/.test(line)) {
        // Skip if this is a token definition file
        return true;
      }
      return false;
    },
    skipForFiles: [],
  },
  {
    id: 'hardcoded-easing',
    description: 'Hardcoded easing array — use ease.* token',
    test: (line, _file) => {
      if (isComment(line)) return false;
      // Match inline easing arrays like [0.4, 0, 0.2, 1]
      if (/ease:\s*\[[\d.,\s]+\]/.test(line)) return true;
      return false;
    },
    skipForFiles: [],
  },
  {
    id: 'hardcoded-shadow',
    description: 'Hardcoded box-shadow string — use shadows token or var(--shadow-*)',
    test: (line, _file) => {
      if (isComment(line)) return false;
      // Allow boxShadow: 'var(--shadow-*)' — this IS using the token system via CSS vars
      if (/boxShadow:\s*['"]var\(--shadow-/.test(line)) return false;
      // Allow boxShadow: 'none' or shadows[...]
      if (/boxShadow:\s*['"]none/.test(line)) return false;
      if (line.includes('shadows[')) return false;
      // Flag other hardcoded boxShadow values (raw px/rgba shadows)
      if (/boxShadow:\s*['"]/.test(line)) return true;
      // Match inline box-shadow CSS (but allow var(--)
      if (/box-shadow:\s*(?!none)/.test(line) && !line.includes('var(--')) return true;
      return false;
    },
    skipForFiles: FULL_ALLOWLIST,
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function isComment(line) {
  const trimmed = line.trim();
  return trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*');
}

function getAllFiles(dir, ext = '.tsx') {
  const results = [];
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        results.push(...getAllFiles(fullPath, ext));
      } else if (entry.endsWith(ext) && !entry.includes('.test.') && !entry.includes('.spec.')) {
        results.push(fullPath);
      }
    }
  } catch {
    // Directory doesn't exist, skip
  }
  return results;
}

// ─── Main ───────────────────────────────────────────────────────────────────

const files = [
  ...getAllFiles(COMPONENTS_DIR),
  ...getAllFiles(PAGES_DIR),
];

// Exclude token definition files themselves
const tokenFiles = ['motion.ts', 'colors.ts', 'shadows.ts', 'typography.ts', 'borderRadius.ts', 'icons.ts'];

let totalViolations = 0;
const violationsByFile = {};

for (const filePath of files) {
  const fileName = filePath.split('/').pop();

  // Skip token definition files
  if (tokenFiles.some(tf => fileName === tf)) continue;
  // Skip illustration components — decorative with intentional hardcoded values
  if (filePath.includes('/illustrations/')) continue;

  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    for (const rule of rules) {
      // Skip allowlisted files for this rule
      if (rule.skipForFiles.includes(fileName)) continue;

      if (rule.test(line, fileName)) {
        const relPath = relative(process.cwd(), filePath);
        if (!violationsByFile[relPath]) violationsByFile[relPath] = [];
        violationsByFile[relPath].push({
          line: i + 1,
          rule: rule.id,
          description: rule.description,
          code: line.trim(),
        });
        totalViolations++;
      }
    }
  }
}

// ─── Output ─────────────────────────────────────────────────────────────────

const componentViolations = {};
const pageViolations = {};

for (const [file, violations] of Object.entries(violationsByFile)) {
  if (file.startsWith('src/components/')) {
    componentViolations[file] = violations;
  } else {
    pageViolations[file] = violations;
  }
}

const componentCount = Object.values(componentViolations).reduce((sum, v) => sum + v.length, 0);
const pageCount = Object.values(pageViolations).reduce((sum, v) => sum + v.length, 0);

if (totalViolations === 0) {
  console.log('\n  \x1b[32m✓ Token audit passed — no hardcoded values found\x1b[0m\n');
  process.exit(0);
}

function printSection(title, violations, color) {
  const count = Object.values(violations).reduce((sum, v) => sum + v.length, 0);
  if (count === 0) {
    console.log(`  \x1b[32m✓ ${title}: 0 violations\x1b[0m\n`);
    return;
  }
  console.log(`  \x1b[${color}m${title}: ${count} violation${count === 1 ? '' : 's'}\x1b[0m\n`);
  for (const [file, viols] of Object.entries(violations)) {
    console.log(`  \x1b[36m${file}\x1b[0m`);
    for (const v of viols) {
      console.log(`    L${v.line} \x1b[31m[${v.rule}]\x1b[0m ${v.description}`);
      console.log(`    \x1b[90m${v.code.substring(0, 120)}\x1b[0m`);
    }
    console.log('');
  }
}

console.log(`\n  \x1b[33m⚠ Token audit: ${totalViolations} total violations\x1b[0m\n`);
console.log('  ─── COMPONENTS (critical for character switching) ───\n');
printSection('Components', componentViolations, componentCount > 0 ? '31' : '32');
console.log('  ─── PAGES (documentation — lower priority) ───\n');
printSection('Pages', pageViolations, '33');

// Exit with error only if component violations exist
if (componentCount > 0) {
  console.log(`  \x1b[31m✗ ${componentCount} component violation${componentCount === 1 ? '' : 's'} must be fixed before character system\x1b[0m`);
  console.log(`  \x1b[33m  ${pageCount} page violation${pageCount === 1 ? '' : 's'} (lower priority)\x1b[0m\n`);
  process.exit(1);
} else {
  console.log(`  \x1b[32m✓ Components are character-ready (0 violations)\x1b[0m`);
  console.log(`  \x1b[33m  ${pageCount} page violation${pageCount === 1 ? '' : 's'} to clean up when convenient\x1b[0m\n`);
  process.exit(0);
}
