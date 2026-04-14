/**
 * setup-git-hooks.mjs
 *
 * Run once after cloning: npm run setup-hooks
 * Sets up conventional commit hooks for the Kvalt repo.
 */

import { writeFileSync, chmodSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const HOOKS_DIR = join(ROOT, '.git', 'hooks');

if (!existsSync(HOOKS_DIR)) {
  console.error('❌ .git/hooks not found — are you in the repo root?');
  process.exit(1);
}

// ── prepare-commit-msg ───────────────────────────────────────────────────────
// Pre-fills a conventional commit template when committing with no -m flag

const PREPARE_COMMIT_MSG = `#!/bin/sh
COMMIT_MSG_FILE=$1
COMMIT_SOURCE=$2

# Only inject template for fresh commits (not --amend, merge, squash)
if [ -z "$COMMIT_SOURCE" ]; then
  CONTENT=$(grep -v '^#' "$COMMIT_MSG_FILE" | tr -d '[:space:]')
  if [ -z "$CONTENT" ]; then
    cat > "$COMMIT_MSG_FILE" << 'EOF'
# type(scope): short description  (keep under 72 chars)
#
# Types:  feat | fix | refactor | style | docs | chore | perf | test
# Scopes: component name, page, token, layout, hook, skill, agent, deps
#
# Examples:
#   feat(Button): add loading state with spinner animation
#   fix(FloatingSectionNav): replace IntersectionObserver with scroll pinning
#   style(TypographyPage): update PageHero to editorial copy
#   docs(MotionPage): add spring personality justifications
#   refactor(ColorsPage): extract PaletteSwatches into separate component
#   chore(deps): upgrade motion to 11.2.0
#
# Body (optional) — explain WHY not what. Omit if title is self-evident.
#
# Footer:
#   Closes #123
#   BREAKING CHANGE: what changed and migration path
EOF
  fi
fi
`;

// ── commit-msg ───────────────────────────────────────────────────────────────
// Warns (does not block) when commit message doesn't follow convention

const COMMIT_MSG = `#!/bin/sh
COMMIT_MSG_FILE=$1
MSG=$(cat "$COMMIT_MSG_FILE" | grep -v '^#' | head -1)

# Skip merge commits and empty messages
if echo "$MSG" | grep -qE '^(Merge |Revert |Auto-commit)'; then
  exit 0
fi

# Validate conventional commit format: type(scope): description
if ! echo "$MSG" | grep -qE '^(feat|fix|refactor|style|docs|chore|perf|test)(\([a-zA-Z0-9_/-]+\))?: .{3,}'; then
  echo ""
  echo "⚠️  Commit message doesn't follow convention:"
  echo "   $MSG"
  echo ""
  echo "   Expected: type(scope): description"
  echo "   Example:  feat(Button): add loading state"
  echo ""
  echo "   Types: feat fix refactor style docs chore perf test"
  echo "   (Commit will proceed — this is a warning, not a block)"
  echo ""
fi

exit 0
`;

// Write hooks
const hooks = [
  { name: 'prepare-commit-msg', content: PREPARE_COMMIT_MSG },
  { name: 'commit-msg', content: COMMIT_MSG },
];

for (const hook of hooks) {
  const hookPath = join(HOOKS_DIR, hook.name);
  writeFileSync(hookPath, hook.content, 'utf8');
  chmodSync(hookPath, '755');
  console.log(`✓ ${hook.name}`);
}

console.log('\n✅ Git hooks installed. Conventional commits are now active.\n');
console.log('Format: type(scope): description');
console.log('Types:  feat | fix | refactor | style | docs | chore | perf | test\n');
