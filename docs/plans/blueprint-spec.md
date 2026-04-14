# Blueprint Spec

**Companion to:** `docs/MASTER-PLAN.md` § 4
**What this covers:** the full folder structure of the blueprint template, the `kvalt init` flow, and what customizes per project vs. what stays canonical.

---

## 1 — Folder structure (full)

Located at `packages/blueprint/` inside the Kvalt monorepo. Templated files use `{{variable}}` placeholders that `kvalt init` substitutes.

```
packages/blueprint/
  .claude/
    claude.md                    # single-pointer file: "read docs/PROJECT.md and me.md"
    skills/
      (symlinked-at-init-time to @craftkit/workflow and @kvalt/plugin skill folders,
       or copied if user prefers per-project ownership)
    agents/
      planner.md
      architect.md
      builder.md
      auditor.md
      debugger.md
      reviewer.md
      commit.md
      _optional/
        designer.md
        researcher.md
        dba.md
        security.md
        release-manager.md
    hooks/
      pre-commit.sh              # runs kvalt audit + gitleaks + npm audit + tests
      post-commit.sh             # appends to LEARNINGS.md if this commit fixed an error
      on-save.sh                 # optional, fires check-tokens on save for DS work

  docs/
    PROJECT.md                   # TEMPLATED — user fills in the "what is this" summary
    PRD.md                       # empty table of contents, growable
    conventions.md               # starts as Kvalt's general conventions, override per project
    anti-patterns.md             # explicit negative constraints (empty template + examples)
    tokens.md                    # project-specific token overrides (starts empty)
    philosophy.md                # motion, tone, a11y principles (Kvalt defaults inherited)
    decisions/                   # ADR-style architecture decision records
      _template.md

  knowledge/
    _INDEX.md                    # pre-populated with scope=general + security + process entries
    _candidates/                 # empty folder for learnings that may flow back to blueprint
    engineering-workflows/       # scope=general entries copied in
    security/                    # scope=security entries copied in
    process/                     # scope=process entries copied in
    (design-systems/ folder is conditional — only if --include-ds-knowledge flag set)

  mcp-config/
    kvalt.json                   # { "kvaltVersion": "{{currentVersion}}" }
    .mcp-cache/                  # gitignored; stores last-fetched specs for offline fallback

  scripts/
    kvalt-sync.sh                # runs kvalt update on all components, reports drift
    weekly-knowledge-review.sh   # scheduled task hook that scans _candidates/ for promotion
    log                          # alias for git log --graph --all --oneline
    log-file                     # git log --follow --patch [file]
    log-search                   # git log -S [keyword]
    log-today                    # commits from today

  src/
    components/
      ui/                        # empty — kvalt add populates this
    lib/
      utils.ts                   # the standard cn() + basic utilities
    tokens/                      # empty — kvalt add copies tokens as needed
    styles/
      globals.css                # base reset + CSS var declarations
    types/
      kvalt.d.ts                 # type declarations for @kvalt-component version headers

  tests/
    _setup.ts                    # test env bootstrap
    e2e/                         # Playwright setup, one smoke test included

  .auto-memory/                  # initialized empty, same mechanism as Kvalt's
    MEMORY.md                    # index, starts blank
  .claude/log/                   # session log — raw chronological history
    .gitkeep                     # gitignored in content, tracked as folder
                                 # Files: YYYY-MM-DD.md, one per calendar day

  PROGRESS.md                    # TEMPLATED — "Project started {{date}}. No work yet."
  LEARNINGS.md                   # TEMPLATED — empty, agents append
  me.md                          # TEMPLATED — Jan's identity file, or user-provided

  README.md                      # TEMPLATED
  package.json                   # TEMPLATED with scripts, deps
  pnpm-workspace.yaml            # if the project itself is a monorepo (opt-in flag)
  tsconfig.json                  # strict mode on, paths configured
  .gitignore
  .env.example
  COMMIT_CONVENTION.md           # conventional commits reference
  LICENSE                        # defaults to MIT, user can override at init
  .github/
    workflows/
      ci.yml                     # lint + test + build + kvalt audit
      security.yml               # scheduled: gitleaks + npm audit + (future) Mythus
  .changeset/                    # if the project uses Changesets
    config.json
```

---

## 2 — The `kvalt init` flow

```bash
npx kvalt init my-app
```

Runs through:

1. **Prompt** — via interactive CLI (or flags):
   - Project name (default: folder name)
   - License (default: MIT)
   - Skill bundle: `minimal` (4 agents) / `full` (7 default) / `full+extensions` (7 + chosen optional)
   - Knowledge scope: `core` (general + security + process) / `+design-systems` / `+all-kvalt`
   - Is this a DS project? (yes/no — enables Designer agent + design-systems knowledge)
   - Does this need a database? (yes → enables DBA agent)
   - Does this handle PII/payments? (yes → enables Security agent + stricter hooks)
   - me.md source: existing path (symlink) / start fresh / copy from blueprint default

2. **Scaffold** — copies `packages/blueprint/` to `./my-app/` with variables substituted.

3. **Install skills**:
   - If user chose *plugin marketplace install*: writes a stub `.claude/skills/README.md` telling them to install `@craftkit/workflow` + `@kvalt/plugin` in their Claude environment
   - If user chose *per-project skill files*: copies skill folders from the installed plugin locations into `.claude/skills/`

4. **Initialize git** — `git init`, creates first commit with conventional message `chore(init): scaffold from @kvalt/blueprint v{version}`.

5. **Run setup scripts**:
   - `pnpm install` (or npm / yarn based on detection)
   - `kvalt add core` — pulls baseline tokens + utility components
   - Register the pre-commit hook via `husky` or equivalent
   - Create the `.mcp-cache/` and do one initial fetch from the Kvalt MCP

6. **Print a "what now" message** — 5 lines max:
   ```
   ✓ Scaffolded my-app from @kvalt/blueprint 1.2.0
   ✓ 11 generic skills + 6 Kvalt skills active
   ✓ Installed 7 agents, 3 hooks, starter knowledge base

   Next:
     cd my-app
     Write a 2-line description in docs/PROJECT.md, then run `/planner` to write your first PRD.
   ```

---

## 3 — What customizes per project

Fields the user is expected to own and update:

- `docs/PROJECT.md` — the "what is this" summary
- `docs/PRD.md` — grows through every feature
- `docs/conventions.md` — may add project-specific rules on top of Kvalt defaults (don't remove the defaults, append)
- `docs/anti-patterns.md` — project-specific prohibitions
- `docs/tokens.md` — if the project overrides any Kvalt tokens
- `knowledge/` — grows with project learnings
- `PROGRESS.md` / `LEARNINGS.md` — agent-maintained
- `me.md` — the user's portable identity (usually symlinked to a central one)
- Package name, version, author, license

## 4 — What stays canonical (don't touch)

- `.claude/agents/` — agent definitions. If you need to modify, override in `.claude/agents/_overrides/` — the CLI will merge.
- `.claude/hooks/` — same pattern as agents.
- `scripts/log*`, `scripts/kvalt-sync.sh` — maintenance scripts, managed by `kvalt update` at the blueprint level.
- `mcp-config/kvalt.json` — version pin only; structure is owned by the CLI.
- `COMMIT_CONVENTION.md` — reference, not editable.

When the blueprint itself updates (new agent, new hook), running `kvalt blueprint sync` in an existing project will three-way merge the canonical files without overwriting user customizations in `_overrides/`.

---

## 5 — Knowledge flow (three directions)

### Flow A — Blueprint → project (at init)
Described above. Scope-filtered copy.

### Flow B — Blueprint → project (refresh)
```bash
kvalt knowledge pull
```
Shows added entries since the project was last synced. User selects which to import. Existing files merge rather than overwrite (three-way on any hand-edited entries).

### Flow C — Project → blueprint (promote learnings back)
Every Friday, a scheduled task runs `kvalt knowledge promote`:
1. Scans `knowledge/_candidates/` in each of your tracked projects
2. Produces a single review dashboard at `github.com/kvalt/blueprint/issues/weekly-review-YYYY-WW`
3. You approve / reject / rewrite each candidate
4. Approved candidates land in `packages/blueprint/knowledge/` on the next release

The `_candidates/` folder exists specifically to separate "project-specific learning" (stays in `knowledge/<topic>/`) from "might be generalizable" (goes in `_candidates/`). Writing to `_candidates/` is a conscious classification, not automatic.

---

## 6 — Blueprint release cadence

The blueprint itself is versioned independently from Kvalt core. Every blueprint release:

- Conventional-commit changelog via Changesets
- Semver: PATCH for agent/hook tweaks, MINOR for new agents/skills/structure additions, MAJOR for breaking changes to the file layout (rare — think once a year)
- Release notes include a `kvalt blueprint sync` diff preview

Projects pin a blueprint version in `mcp-config/kvalt.json` just like they pin a DS version. `kvalt blueprint update` shows the migration path.

---

## 7 — Empty-template rule (critical for public distribution)

The blueprint is a **template**, not a clone of any working project. These files ship empty or as pure placeholders, always:

| File | What ships in the blueprint |
|---|---|
| `me.md` | Template with section headers only (`## Who am I`, `## Working preferences`), no content |
| `.auto-memory/MEMORY.md` | Header only, no memory entries |
| `.auto-memory/` (rest) | Empty folder |
| `PROGRESS.md` | One line: `# Progress\n\nProject started {{date}}. No work yet.` |
| `LEARNINGS.md` | Header only: `# Learnings\n\nAgents append here as they learn from errors and fixes.` |
| `docs/PRD.md` | Empty table of contents |
| `docs/PROJECT.md` | Placeholder: `## What is this\n[2–3 lines describing the project]` |
| `docs/anti-patterns.md` | Template with section headers + 2 generic examples |
| `docs/decisions/` | Empty except for `_template.md` |
| `knowledge/` | Starter set (scope-filtered by init flags), never includes any project-specific or personal entries |
| `knowledge/_candidates/` | Empty folder |
| `knowledge/conversation-log/` | Empty folder |
| `audits/` | Empty folder (Auditor populates it) |
| `debug-reports/` | Empty folder (Debugger populates it) |

**Why this matters:** public users running `kvalt init` must never inherit Jan's (or any other maintainer's) personal memory, progress logs, PRDs, or private knowledge. The CLI enforces this by only copying from `packages/blueprint/` — the canonical template — and never from any live working project.

## 8 — Maintainer vs. user workflows

Some flows exist only for the Kvalt maintainer (initially Jan, later the Kvalt team). Others are for everyone. Making the distinction explicit so public users don't wonder why some commands seem to do nothing:

### User flows (available to everyone)

| Command | What it does |
|---|---|
| `kvalt init [project]` | Scaffold a new project from the blueprint |
| `kvalt add [component]` | Install a component from the registry |
| `kvalt update [component]` | Update a component with version-aware diff |
| `kvalt diff` | Preview all component drift |
| `kvalt migrate [component]@[version]` | Run codemod for a breaking change |
| `kvalt audit` | Run the full compliance suite |
| `kvalt migrate-project` | Onboard an existing project to the Kvalt model |
| `kvalt knowledge pull` | Pull new blueprint knowledge entries into this project |
| `kvalt blueprint sync` | Refresh canonical blueprint files (agents, hooks, scripts) |
| `kvalt cache clear` | Reset the local MCP spec cache |

### Maintainer-only flows

| Command | What it does |
|---|---|
| `kvalt knowledge retag` | Audit and tag all entries in the Kvalt knowledge base (one-time) |
| `kvalt knowledge promote` | Run the weekly `_candidates/` review across tracked projects, open review PRs against the blueprint repo |
| `kvalt blueprint release` | Cut a new blueprint version (runs via Changesets; only works from the Kvalt monorepo root) |
| `kvalt components publish` | Push a new component version to the registry (only works with publish credentials) |

Maintainer commands fail with a clear message when run outside the Kvalt monorepo or without publish credentials:

```
$ kvalt knowledge promote
Error: this command runs inside the Kvalt monorepo only.
Public users who want a similar flow for their own team can fork
the blueprint and run this against their own fork. See
docs/FORKING.md for details.
```

**If a public team wants the same promote-learnings-back flywheel**, they fork `packages/blueprint/` to their own repo, set the environment variable `KVALT_BLUEPRINT_REPO=their-org/blueprint`, and the same commands operate against their fork instead. Fork instructions live in the public `docs/FORKING.md`.

## 8.5 — Memory stack (three layers, distinct purposes)

The blueprint ships a three-layer memory system, each with a distinct role:

### Layer 1 — Session log (`.claude/log/YYYY-MM-DD.md`)
**Raw chronological history, one file per calendar day.**

- Gitignored by default (user can opt-in to tracking if they want)
- Updated **after every single response** by the agent — if it's not logged before the next compaction, it's lost
- Entries timestamped (`### HH:MM`) or numbered sequentially
- Log everything: questions, answers, decisions, code written, commands run, errors, rejected plans, tangents
- New file per calendar day, one-line summary at the top updated through the day
- At session start, read the most recent log file to pick up context
- **Explicitly not a replacement for memory** — this is raw history in order, not distilled insights

### Layer 2 — Memory (`.auto-memory/` + `MEMORY.md` index)
**Distilled insights, persistent across sessions, topic-indexed.**

- Per-entry markdown files with frontmatter (`name`, `description`, `type`)
- Four types: `user`, `feedback`, `project`, `reference`
- Meant for things future conversations should remember
- `MEMORY.md` at the root is the index; entries live as standalone files

### Layer 3 — Conversation log (`knowledge/conversation-log/`)
**Curated session summaries, published as knowledge.**

- Written at session end by the `wrap-up` skill
- Polished, readable, answers "why was X built this way" months later
- Committed to git; becomes part of the knowledge base

**Why three layers:** ephemeral vs. persistent vs. curated are genuinely different needs. The session log catches raw detail that would bloat memory; memory catches principles that would get lost in session-log noise; the conversation log gives future-you (or future teammates) a readable narrative.

## 9 — OSS hygiene shipped at repo creation

Every Kvalt repo (and the blueprint itself) ships with these files from commit #1:

- `LICENSE` — MIT
- `README.md` — what it is, how to install, links to full docs
- `CONTRIBUTING.md` — how to report issues, submit PRs, propose new components/skills, run the dev setup
- `CODE_OF_CONDUCT.md` — Contributor Covenant v2.1, standard
- `SECURITY.md` — how to report vulnerabilities privately (security@kvalt.dev email alias, 48hr response SLA)
- `.github/ISSUE_TEMPLATE/` — three templates:
  - `bug.yml` — component name, version, reproduction, expected vs. actual
  - `feature.yml` — problem, proposed solution, alternatives considered
  - `component-request.yml` — component name, use cases, existing patterns it replaces
- `.github/PULL_REQUEST_TEMPLATE.md` — checklist: tests added, changeset added, docs updated, codemod added for breaking changes
- `.github/workflows/ci.yml` — `quality` (lint + tsc) → `build` (compile + size:check) → `test-unit` (Vitest) → `test-e2e` (Playwright) → `security` (gitleaks + npm audit). Concurrency-grouped.
- `.github/workflows/release.yml` — Changesets-driven release automation
- `.github/workflows/security.yml` — scheduled nightly security scan (gitleaks + npm audit + future Mythus)
- `.github/dependabot.yml` — weekly dependency updates, grouped (prod vs. dev, major vs. minor), auto-merge patches once CI green

### Tooling installed at scaffold time

Every scaffolded project comes pre-configured with:

- **Husky** + hooks: `pre-commit` (gitleaks + ESLint + token audit + npm audit), `commit-msg` (commitlint), `post-commit` (LEARNINGS.md append), `prepare-commit-msg` (optional PRD linkage check)
- **Commitlint** with `@commitlint/config-conventional`
- **Prettier** with the team's config (2-space, single quotes, semicolons, trailing commas)
- **ESLint 9 flat config**: `@eslint/js` + `typescript-eslint` + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh` + `eslint-plugin-security` + `eslint-plugin-jsx-a11y`
- **TypeScript strict** by default; `tsconfig.app.json` + `tsconfig.test.json` + `tsconfig.node.json` split
- **Vitest** + `@vitest/coverage-v8` + React Testing Library + `jsdom` — coverage thresholds start at 20%, ratchet up
- **Playwright** + `@axe-core/playwright` — Desktop Chrome + iPhone 14 projects, visual + a11y + keyboard test folders
- **size-limit** + `@size-limit/file` — JS 200kB / CSS 60kB gzipped budgets in `package.json`, enforced in CI
- **Gitleaks** config (`.gitleaks.toml`) with allowlist pattern for known-safe false positives
- **Dependabot** (or Renovate if user prefers)
- **Changesets** pre-wired for release automation

GitHub Discussions enabled with categories: Q&A, Show & Tell, Ideas, Announcements. This is the primary support channel for v1.

The blueprint itself scaffolds *user* projects with a subset of these (LICENSE, README template, conventional-commits hook, basic CI) so scaffolded projects also start as well-structured repos.

## 10 — What's intentionally *not* in the blueprint

- **A UI framework choice.** Blueprint is framework-agnostic (React-biased because Kvalt is React, but structure works for any framework). Framework-specific scaffolding happens via `kvalt add framework=[next|vite|astro|remix]`.
- **A database schema.** DBA agent optionally generates one, but there's no baked-in ORM or schema choice.
- **Pre-built pages/routes.** The blueprint is a skeleton, not an app template. You write the app yourself, with agents and skills assisting.
- **Deployment config.** Vercel / Cloudflare / Fly configs are added by `kvalt add deploy=[vercel|cloudflare|fly]` — opt-in.

This is deliberate — the blueprint is the *discipline and tooling* layer. The *app* layer is yours to build.
