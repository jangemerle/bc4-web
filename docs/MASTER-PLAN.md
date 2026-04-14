# Kvalt Master Plan

**Status:** Draft v1 — 2026-04-14
**Authors:** Jan + Claude (Cowork session)
**Read first:** this doc. Everything else in `docs/plans/` elaborates a specific piece.

---

## 1 — The one-paragraph summary

Kvalt is being restructured from "a design system Jan uses in his projects" into "a foundation any project can build on, updated cleanly over time, with enforced quality gates that prevent AI slop." The restructure lives in one monorepo, ships as six packages (core, CLI, MCP server, blueprint, Kvalt plugin, workflow plugin), and is consumed via a `kvalt init` command that scaffolds new projects from a canonical blueprint. A second plugin (`@craftkit/workflow`) ships the generic engineering discipline (PRD-driven planning, TDD, commit hygiene, security audits, memory stack) independently of Kvalt so it travels to non-Kvalt projects too. The whole system is designed so that Claude can't skip the quality gates — the Builder agent refuses to write code without a PRD, `check_compliance` runs at pre-commit, and every component carries its own version header so updates never blindly overwrite consumer customizations.

---

## 2 — The problem this solves

Three pains drove this plan:

**2.1 Claude ignores Kvalt components and generates slop.**
Even when Kvalt is in the repo, Claude writes new `<Button>` implementations because nothing *pulls* the existing spec into context at generation time. The fix is an MCP server exposing components as queryable, plus enforcement hooks that catch the slop at commit time.

**2.2 Keeping multiple projects in sync with Kvalt is manual and error-prone.**
Components get copied into projects and go stale. There's no version header, no diff tool, no migration path. The fix is a CLI (`kvalt add`, `kvalt update`) with per-component semver + codemods for breaking changes.

**2.3 Every new project starts from a blank slate and inherits none of the process discipline.**
PRDs, commit conventions, skill bundles, memory stack, agent teams — all get re-invented per project. The fix is a canonical blueprint (`packages/blueprint/`) that `kvalt init` scaffolds into a new folder, complete with all of the above.

The underlying pathology is the one laid out in the vibe-coding knowledge entries (`vibe-coding-bubble-devrant.md`, `vibe-coding-trust-gap.md`): AI-assisted development defaults to speed-over-craft unless explicit process and tooling force the craft axis. Kvalt's job is to be the craft axis.

---

## 3 — Architecture: four layers

### Layer A — Kvalt MCP server (source of truth at generation time)

An MCP server (`@kvalt/mcp`) exposes the design system as queryable tools that Claude pulls on demand. Tools in v1:

- **Query:** `list_components`, `search_components`, `get_component_spec`
- **Tokens:** `get_token`, `list_tokens`, `export_tokens` (CSS / JSON / Tailwind)
- **Compliance:** `check_token_usage`, `get_accessibility_notes`, `validate_motion_timing`
- **Inspection:** `get_component_variants`, `get_component_usage_stats`, `search_documentation`

Rationale: this matches the tool surface of production DS MCPs we researched (Optics, Material 3, shadcn/ui, Figma Console). The `check_compliance`-style tools are the secret weapon — they turn design-system guidelines from advice into an enforceable gate. Pre-commit hooks call them; the Auditor agent calls them; even Claude's own generation loop can self-check.

**Versioning:** SemVer on the server. Consumers pin a Kvalt DS version in their MCP config (`{ kvaltVersion: "1.4.x" }`) and the server returns specs matching that version from a multi-version index it maintains. Tools are additive-first; breaking renames use `v2` suffixed tool names rather than mutating existing tools.

**Hosting:** Cloudflare Workers + Durable Objects. Global edge, near-zero cold starts, generous free tier. Fallback: Fly.io containers if Workers prove too restrictive for any tool.

**Offline fallback:** The CLI caches the full spec locally in `.kvalt-cache/` on every successful fetch. Skills and pre-commit hooks read from cache when the server is unreachable, with a staleness warning after 7 days.

Details → `docs/plans/versioning-and-updates.md`.

### Layer B — Kvalt CLI (shadcn-style distribution)

A CLI (`@kvalt/cli`) installed via `npx kvalt`. Commands:

- `kvalt init [project]` — scaffold a new project from the blueprint
- `kvalt add [component]` — copy a component into `src/components/ui/` with its tokens, tests, docs
- `kvalt update [component]` — show diff against installed version, apply with merge warnings
- `kvalt diff` — preview all component drift across the project
- `kvalt migrate [component]@[target-version]` — run codemod for breaking changes
- `kvalt migrate-project` — onboard an existing project to the Kvalt model
- `kvalt knowledge pull` — sync knowledge entries from blueprint (scope-filtered)
- `kvalt knowledge promote` — review `_candidates/` entries, promote useful ones back to blueprint
- `kvalt audit` — run full compliance suite against the current project

**The shadcn lesson we're explicitly addressing:** shadcn's biggest failure mode is *no per-component versioning*. Their `diff` compares against the latest registry, so if you customized one component out of 100, you get a massive irrelevant diff. Kvalt fixes this by stamping each installed component with a version header:

```tsx
// @kvalt-component button
// @kvalt-version 1.4.2
// @kvalt-installed 2026-04-14
// @kvalt-changelog
//   1.4.2 - Fix focus ring color on dark mode
//   1.4.0 - Add loading state (non-breaking)
//   1.3.0 - DEPRECATE size=xs (use size=small)
```

`kvalt update` reads this header and only shows diffs relative to the *installed* version, not the latest. Codemods ship alongside breaking changes. Deprecation cycle: add new API → deprecate old with `console.warn` in dev → remove in next major with codemod.

Details → `docs/plans/versioning-and-updates.md`.

### Layer C — Two plugins (skills + agents + hooks)

Not one mega-bundle. Two separate plugins with clean separation:

**`@craftkit/workflow`** — 11 generic skills that apply to any project, Kvalt or not:
`planner`, `commit`, `grill-component`, `tdd-component`, `schedule`, `apify-fetch`, `security-audit`, `playwright-test`, `ffmpeg`, `wrap-up`, `architecture-lint`

**`@kvalt/plugin`** — 6 Kvalt-specific skills, depends on `@craftkit/workflow`:
`figma-to-kvalt`, `check-tokens`, `kvalt-page-gen`, `create-character`, `generate-illustration`, `pencil-kvalt`

**Why two plugins:**
- Your workflow plugin survives if you stop using Kvalt one day
- Non-Kvalt client projects get your process without Kvalt-specific noise
- Preserves the composable product model from `project_composable_product_model.md` — workflow plugin becomes a sellable product on its own
- Cross-plugin references are explicit, not implicit — fewer surprises

**Discovery mechanism:** Skills auto-fire based on their frontmatter description. Two install paths:
- **Via Cowork/Claude Code plugin marketplace** — one-time install, active across all sessions
- **Via `kvalt init`** — copied into `.claude/skills/` per project, versioned with the project

Each Kvalt-specific skill includes a project-fingerprint check at the top: stops and warns if the current project isn't Kvalt-based, preventing misfire on non-DS repos.

Details → `docs/plans/plugin-architecture.md`.

### Layer D — Enforcement hooks (turning advice into gates)

The quality discipline only works if it's enforced, not suggested. Three layers of gates:

**At generation time (inside Claude):**
- Builder agent refuses to write code without a `PRD.md` section for the task. Escape hatch: `/skip-prd` for typo fixes, README edits, trivial bugs.
- Skills self-check via project-fingerprint logic before running.
- MCP `check_compliance` is available to Claude to self-audit generated code.

**At save/commit time:**
- Pre-commit hook runs `kvalt audit` — fails on hardcoded hex, off-grid spacing, missing tokens, test failures, eslint errors.
- Gitleaks + `npm audit` + (future) Claude Mythus run as a `security` step in the same hook.

**At PR/merge time:**
- Auditor agent runs on the full diff, writes an audit report to `audits/YYYY-MM-DD-[feature].md`.
- Reviewer agent does PR-style review, questions decisions, flags missed edge cases.
- CI runs the same gates plus visual regression (Playwright screenshots) and a11y (axe-core).

None of these are new skills — they exist in Kvalt today as `check-tokens`, `playwright-test`, etc. The restructure just makes them *mandatory* rather than opt-in.

---

## 4 — The blueprint (`packages/blueprint/`)

The blueprint is the canonical starter template. When you run `kvalt init my-app`, this is what you get:

```
my-app/
  .claude/
    claude.md                    # one-liner: "read docs/PROJECT.md and me.md"
    skills/                      # copies of @craftkit/workflow + @kvalt/plugin skills
    agents/                      # 7 default + 5 optional agent definitions
    hooks/                       # pre-commit, on-save
  docs/
    PROJECT.md                   # project-specific overview (you fill in)
    PRD.md                       # living document, sections with stable IDs
    conventions.md               # coding rules (Kvalt's defaults + your tweaks)
    anti-patterns.md             # explicit prohibitions (negative constraints)
    tokens.md                    # token overrides for this project, if any
    philosophy.md                # motion, tone, a11y principles
  knowledge/                     # scope-filtered starter set from Kvalt blueprint
    _INDEX.md
    _candidates/                 # learnings this project thinks are generalizable
  mcp-config/
    kvalt.json                   # pins Kvalt DS version
  scripts/
    kvalt-sync.sh                # pull latest Kvalt, diff, apply
  src/
    components/ui/               # initially empty; kvalt add populates it
  PROGRESS.md                    # agent-maintained
  LEARNINGS.md                   # agent-maintained
  me.md                          # Jan's portable identity file (see AI OS pattern)
  README.md
  package.json
```

Key capabilities:
- **Memory stack baked in:** `.auto-memory/`, `LEARNINGS.md`, `PROGRESS.md`, conventional commits, history helper scripts (`npm run log`, `log:file`, `log:search`), `conversation-log/` knowledge folder.
- **Agent roster pre-configured:** Planner, Architect, Builder, Auditor, Debugger, Reviewer, Commit. Optional Designer, Researcher, DBA, Security, Release Manager available as disabled templates.
- **Knowledge starter set:** entries tagged `general`, `security`, `process` ship by default. `design-systems` tagged entries ship if the project is DS-adjacent. `kvalt-specific` entries stay in Kvalt.
- **PRD enforcement live:** Builder checks for a matching PRD section before writing code. Blocks without one.

Details → `docs/plans/blueprint-spec.md` and `docs/plans/agent-roster.md`.

---

## 5 — Migration path for existing projects

For your current projects that already use Kvalt informally, there's a path in:

```bash
cd my-existing-project
npx kvalt migrate-project
```

The command:
1. Scans for Kvalt-derived components (name + structural similarity match)
2. Stamps version headers by git-blame + closest-match diff against the current Kvalt registry
3. Installs the skill bundles to `.claude/skills/`
4. Copies the agent roster to `.claude/agents/`
5. Drops pre-commit hooks (asks first — doesn't overwrite existing hooks)
6. Generates a scaffolded `PRD.md` by reading `src/pages/` and drafting "what this app does" sections
7. Reports everything it changed; you review, commit, or roll back

Migration is idempotent — re-running it is safe, it just reports "nothing to do."

---

## 5.5 — Public-launch readiness (what ships vs. what stays)

Kvalt is being built toward a public release from day 1. Anything that's personal to Jan or internal to the team must never end up in the public packages. The rules:

### 5.5.1 Knowledge scope tagging (expanded)

Every knowledge entry gets one of five scopes:

- **`public-general`** — engineering discipline, security, process. Ships in the public blueprint by default.
- **`public-ds`** — design-system knowledge useful to any DS project. Ships if `kvalt init` is given `--include-ds-knowledge`.
- **`kvalt-specific`** — technical Kvalt knowledge (component decisions, Kvalt architecture). Ships in the Kvalt repo only, never in user blueprints.
- **`kvalt-internal`** — business strategy, competitor tracking, pricing thinking, personal insights. **Never ships anywhere outside the Kvalt repo.** Added to `.gitignore` for public mirrors if we ever set one up.
- **`personal`** — Jan's individual preferences, research, working notes. Stays in Jan's memory / local notes, not in Kvalt at all.

A one-time `kvalt knowledge retag` pass audits the existing `knowledge/` folder and assigns each entry a scope. Agents respect scopes at every boundary: `kvalt init` filters by scope, the promote-to-blueprint flow checks scope before merging, etc.

### 5.5.2 Blueprint ships empty user-state files

The blueprint is a template, not a clone of Jan's working directory. These files **always ship empty or as pure templates with placeholders**:

- `me.md` — template with placeholders (`## Who am I`, `## Working preferences`, etc.), not Jan's actual identity
- `.auto-memory/` — initialized empty, `MEMORY.md` contains only the header
- `PROGRESS.md` — single line: "Project started {{date}}. No work yet."
- `LEARNINGS.md` — empty, agents append as they learn
- `docs/PRD.md` — empty skeleton
- `docs/PROJECT.md` — placeholder ("## What is this\n[2–3 lines describing the project]")
- `knowledge/conversation-log/` — empty

The `kvalt init` command enforces this by copying from `packages/blueprint/` (the canonical template), never from any project Jan has running.

### 5.5.3 Licensing

All packages ship under **MIT** for v1:
- `@kvalt/core`, `@kvalt/cli`, `@kvalt/mcp`, `@kvalt/blueprint`, `@kvalt/plugin`, `@craftkit/workflow`
- Every package has its own `LICENSE` file (MIT, copyright line `© {year} Kvalt contributors`)
- Blueprint includes MIT as the default license in scaffolded projects, with an `--license` flag to override

Commercial differentiation, if pursued later, happens at the *package* level: a premium component pack could ship under a commercial license while the core stays MIT. Decision deferred; default for all Phase 1–4 work is MIT.

### 5.5.4 Privacy & telemetry (the pledge)

The MCP server and CLI commit to:

- **Zero logging of query contents.** We never log which components you query, which tokens you read, or which compliance checks you run.
- **Aggregate counts only.** Total request count per-version, per-day — used to know which versions are still in use so we know when it's safe to retire them. No identifying detail.
- **No CLI telemetry by default.** The CLI does not phone home. If we ever add opt-in usage analytics, it asks on first run and requires explicit consent.
- **Public privacy policy** at `kvalt.dev/privacy` documenting all of the above in plain English.

Added to the "no hostile updates" pledge in `docs/plans/versioning-and-updates.md` § 11.

### 5.5.5 OSS hygiene

From the first public commit, the `kvalt` GitHub org includes:

- `CONTRIBUTING.md` — how to submit issues, PRs, new components, new skills
- `CODE_OF_CONDUCT.md` — Contributor Covenant template, standard
- `SECURITY.md` — how to report vulnerabilities privately (email alias + 48hr response SLA)
- `.github/ISSUE_TEMPLATE/` — bug report, feature request, component request templates
- `.github/PULL_REQUEST_TEMPLATE.md` — checklist (tests added, changeset added, docs updated)
- GitHub Discussions enabled on the main repo (Q&A, showcase, ideas categories)

Discussions is the primary support channel for v1. Discord/Slack can be added later if community size warrants.

### 5.5.6 Repo split — private workspace vs. public monorepo

Kvalt lives in **two repos**, not one:

**Private: `kvalt-ds-workspace`** (existing repo, renamed 2026-04-14)
- Jan's working copy. Full freedom — knowledge base with all scopes, `.auto-memory/`, business strategy, session logs, conversation history, internal docs, experiments.
- Source of truth for *thinking about* Kvalt. Never public.
- Contains the monorepo packages locally during development.
- Mounted at `/sessions/relaxed-bold-gates/mnt/kvalt-ds` in Cowork sessions.

**Public: `github.com/kvalt/kvalt`** (to be created at end of Phase 3)
- Clean monorepo with the six packages, public-scoped docs and knowledge only.
- MIT-licensed, accepting contributions, primary support via GitHub Discussions.
- Created fresh with `git init` — no history from the private workspace is copied over.
- Deliberately deferred until Phase 3 is done (monorepo shape stable, OSS hygiene ready, knowledge scope-filtered).

**The sync flow (from Phase 3 onward):**
A `kvalt sync-public` script copies `packages/*`, public docs, and scope-filtered knowledge from the private workspace into the public repo. Commits to the public repo describe the change without leaking thinking about the change. Issues/PRs land on the public repo; Jan triages from either location.

**Why split:**
- Git history from the private workspace contains business strategy, competitor analyses, personal memory, CTO handoff details. Rewriting history to strip all of this is risky — one oversight and something leaks permanently. Starting the public repo clean is safer.
- Private workspace is where thinking happens; public repo is where outcomes ship. Same pattern as a writer's journal vs. published essays.

**Timing:**
- **Today (2026-04-14):** rename current repo to `kvalt-ds-workspace` ✓; create `kvalt` GitHub org; reserve npm scopes `@kvalt` and `@craftkit`; set up `hello@kvalt.dev` and `security@kvalt.dev` via Cloudflare Email Routing.
- **Phases 1–3:** all development in `kvalt-ds-workspace`.
- **End of Phase 3:** freeze state, run `kvalt sync-public` for the first time, push to `github.com/kvalt/kvalt`, open for public contribution.
- **Phase 4:** public launch from the public repo.

### 5.5.7 Contact emails (domain-based from day 1)

Set up via Cloudflare Email Routing (free, forwards to `jan@gemerle.cz`):

- **`hello@kvalt.dev`** — general contact, used as GitHub org contact email
- **`security@kvalt.dev`** — private vulnerability reports (referenced in `SECURITY.md`)
- **`abuse@kvalt.dev`** — for the unlikely case of GitHub/npm abuse reports

Rationale: GitHub org email is visible on public issues and security reports. Using `jan@gemerle.cz` exposes personal email and doesn't transfer cleanly if ownership ever changes. Role-based aliases on the domain are free via Cloudflare, transfer cleanly, and look professional. Set up before any public commit.

### 5.5.8 Craftkit package location

`@craftkit/workflow` lives in the Kvalt monorepo for now (`packages/craftkit-workflow/`). Published to npm under the `@craftkit` scope, so it's brand-independent from Kvalt's consumer perspective even though development happens in-repo.

Split out into its own repo (`craftkit/workflow`) only if/when Craftkit grows into a real product family with multiple packages. Premature repo-splitting pays complexity costs forever for anticipated scale that often never arrives. Revisit in v2.

### 5.5.9 Maintainer vs. user workflows

Some parts of the system only make sense for the Kvalt maintainer (initially Jan, later the Kvalt team); others are for public consumers. Documented explicitly in `docs/plans/blueprint-spec.md` § 8:

- **Maintainer-only flows:** the `_candidates/` → weekly review → blueprint promotion flow (only the blueprint maintainer can merge); `kvalt knowledge retag` (mass-tagging the internal knowledge base)
- **User flows:** `kvalt init`, `kvalt add`, `kvalt update`, `kvalt migrate`, `kvalt audit`, `kvalt knowledge pull`
- **Both:** `kvalt diff`, `kvalt cache clear`

Public users can fork the blueprint and run their own maintainer flows against their own fork if they want the promote-learnings-back pattern for their own team. That's on them, not on Kvalt's infrastructure.

---

## 5.6 — Quality infrastructure baselines

Derived from a port audit of the Whatever Task project (Jan's most recent
Kvalt-adjacent app). These are the tooling baselines every consumer project
inherits from the blueprint, enforced automatically.

### 5.6.1 Bundle budgets
`size-limit` configured in every shipped package's `package.json`:
- JS bundle: **200 kB** gzipped (baseline; components can tune lower)
- CSS bundle: **60 kB** gzipped
- `npm run size:check` runs in CI on every build; failing budgets fail the PR

### 5.6.2 Testing split (explicit)
Two distinct layers, both required:
- **Unit:** Vitest + React Testing Library + jsdom
  - `src/**/*.test.{ts,tsx}` convention
  - Coverage via `@vitest/coverage-v8`
  - Starter thresholds: **20%** statements/branches/functions/lines, meant to ratchet up
  - Setup file: `src/test/setup.ts`
- **E2E:** Playwright
  - Desktop Chrome + iPhone 14 viewports
  - Visual regression, keyboard, a11y (axe-core) projects
  - 2 retries, 1 worker in CI

Both layers run in CI from day 1. No "local-only" tests.

### 5.6.3 Lint + format (enforcement, not convention)
- **ESLint 9 flat config** with `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, **`eslint-plugin-security`**, **`eslint-plugin-jsx-a11y`**
- **Prettier** for format, enforced via pre-commit + CI
- **Commitlint** + conventional-commits config (enforced via husky `commit-msg` hook)

### 5.6.4 Dependency hygiene
- **Dependabot** (or Renovate) configured at `.github/dependabot.yml`
  - Weekly schedule
  - Grouped updates per category (devDeps vs. prod, major vs. minor)
  - Auto-merge for patch + minor devDeps once CI green
- **npm audit** at `--audit-level=high` runs in pre-commit (warning) and CI security job (nightly, not blocking)
- Security posture audited quarterly via the `security-audit` skill

### 5.6.5 CI shape
- GitHub Actions, concurrency-grouped (cancel superseded runs)
- Triggers: push + PR on `main`, `staging`, `dev`
- Jobs: `quality` (lint + typecheck) → `build` (compile + size:check) → `test-unit` → `test-e2e` → `security`
- Node 22 with `cache: npm`/`pnpm`
- Each job timeout: 10 min

### 5.6.6 TypeScript discipline
- Strict mode on everywhere
- `tsc --noEmit` in CI *separately* from the build (so type errors surface independent of bundling)
- Near-zero `any` — treated as a code smell in review

These baselines are not optional in the blueprint. They're the quality floor.

---

## 6 — Decision log

Every load-bearing decision, locked in:

| # | Decision | Rationale |
|---|---|---|
| 1 | Monorepo, pnpm workspaces + Changesets | One commit can span DS + MCP + CLI; coordinated releases; matches shadcn/Radix structure |
| 2 | Six packages: core, cli, mcp, blueprint, kvalt-plugin, workflow-plugin | Clean separation of concerns; each has its own release cadence |
| 3 | PRD enforcement via Builder agent refusal + `/skip-prd` escape | Preventative, not corrective; friction at the right moment; escape hatch prevents discipline erosion |
| 4 | Per-component version headers stamped at install time | Fixes shadcn's biggest failure mode (diffs vs. latest, not vs. installed) |
| 5 | Codemods ship alongside breaking changes | Breaking changes without migration paths feel hostile; enforces our own discipline |
| 6 | Knowledge `scope` frontmatter tag (`general` / `design-systems` / `kvalt-specific` / `security` / `process`) | Enables clean filtering at `kvalt init` time; prevents blueprint bloat |
| 7 | Knowledge `_candidates/` folder + weekly curation promotion flow | Flywheel that brings project-level learnings back to blueprint without auto-sync sprawl |
| 8 | Two plugins: `@craftkit/workflow` (generic, 11 skills) + `@kvalt/plugin` (Kvalt-specific, 6 skills) | Preserves portability; composable product model; clean separation |
| 9 | 7 default agents (Planner, Architect, Builder, Auditor, Debugger, Reviewer, Commit) + 5 optional (Designer, Researcher, DBA, Security, Release Manager) | Covers the full lifecycle; optional extensions prevent bloat on simple projects |
| 10 | Handoff artifacts (files) between agents, not chat history | Reviewable, persistent, ties into memory stack |
| 11 | MCP hosting: Cloudflare Workers + Durable Objects | Near-zero cold starts, global edge, generous free tier, MCP-friendly |
| 12 | Docs hosting: Vercel → kvalt.dev | Best DX, preview deploys, zero config |
| 13 | Marketing: getkvalt.com → 301 → kvalt.dev via Cloudflare | No second site to maintain |
| 14 | Code hosting: GitHub org `kvalt` | Default, OIDC for npm publish, Actions ecosystem |
| 15 | DNS: Cloudflare (free tier) | Fastest resolution, free SSL/DDoS, easy Workers/Pages addition later |
| 16 | Package registry: npm (scopes `@kvalt` and `@craftkit`) | Standard; JSR as optional secondary publish target |
| 17 | Restructure on a git branch, not a folder rename | Preserves history, reversible, standard git workflow |
| 18 | Workflow plugin name: `@craftkit/workflow` (not `@jan/workflow`) | Neutral brand, sellable as a standalone product, no personal-name coupling |
| 19 | All packages MIT-licensed for v1 | Safest default for OSS; commercial differentiation happens later at package level |
| 20 | Zero query logging on MCP; no CLI telemetry by default | Privacy stance documented publicly; aggregate counts only |
| 21 | GitHub Discussions as primary support channel | Free, built-in, good default; Discord/Slack later if community size warrants |
| 22 | Knowledge scope expanded to 5: `public-general`, `public-ds`, `kvalt-specific`, `kvalt-internal`, `personal` | Prevents leakage of business strategy / personal content into public blueprint |
| 23 | Blueprint ships `me.md`, `.auto-memory/`, `PROGRESS.md`, `LEARNINGS.md` as empty templates | Never copy Jan's working files into public scaffolds |
| 24 | Three-layer memory stack: session log (raw chronological) + memory (distilled insights) + conversation log (curated session summaries) | Distinguishes ephemeral history from persistent knowledge; port audit confirmed session log is a genuine missing layer |
| 25 | size-limit bundle budgets (JS 200kB / CSS 60kB gzipped) enforced in CI | Prevents bundle regressions; simple tool, high payoff |
| 26 | Vitest + RTL unit + Playwright E2E both run in CI from day 1 | No "local-only" tests; tests that don't run in CI don't exist |
| 27 | Commitlint + Prettier + `eslint-plugin-jsx-a11y` enforced by hooks | Makes conventions machine-enforced, not aspirational |
| 28 | Dependabot (or Renovate) configured from day 1 with grouped updates + auto-merge for safe patches | Continuous security, minimal cognitive overhead |

---

## 7 — Phased roadmap

Four phases, each produces something shippable:

### Phase 1 — Foundation (week 1–2)
Goal: get the monorepo structure right, no new features yet.

- Create branch `monorepo-restructure`
- Convert repo to pnpm workspaces
- Split current Kvalt into `packages/core/` (DS itself stays intact)
- Set up Changesets for versioning
- Reserve npm scopes `@kvalt` and `@craftkit` immediately
- Create GitHub org `kvalt`, point `kvalt.dev` there, deploy current docs to Vercel
- Add MIT `LICENSE`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `.github/ISSUE_TEMPLATE/`, `.github/PULL_REQUEST_TEMPLATE.md` at org + core repo level
- Enable GitHub Discussions on the main repo
- Run `kvalt knowledge retag` pass: audit every entry in `knowledge/`, assign a scope (`public-general` / `public-ds` / `kvalt-specific` / `kvalt-internal` / `personal`)
- Write `kvalt.dev/privacy` stub page (zero-logging + no-default-telemetry pledge)
- **Milestone:** current Kvalt still works identically, just in a new shape, and is structurally ready for public release

### Phase 2 — Distribution primitives (week 2–4)
Goal: `kvalt add button` works for a new user.

- Build `packages/cli/` with `init`, `add`, `diff` commands
- Stamp existing Kvalt components with version headers
- Set up component registry (static JSON on kvalt.dev/r/*)
- First `kvalt init` dogfood: scaffold one of your existing projects from scratch
- **Milestone:** someone else can `npx kvalt add button` and get a working component

### Phase 3 — MCP + enforcement (week 4–7)
Goal: Claude stops generating slop.

- Build `packages/mcp/` with the 11 v1 tools
- Deploy MCP to Cloudflare Workers
- Build the `@kvalt/plugin` and `@craftkit/workflow` plugins, publish to the Claude/Cowork plugin registry
- Wire up pre-commit hooks, Builder agent PRD refusal
- Ship first codemod for any API change made during Phase 2
- **Milestone:** you can re-run `kvalt migrate-project` on all existing projects and feel the discipline kick in

### Phase 4 — Blueprint + public launch (week 7–10)
Goal: Kvalt is publicly usable.

- Finalize `packages/blueprint/` with all default agents and skills
- Write public docs on kvalt.dev — installation, philosophy, component catalog
- Record a 2-minute demo video (`kvalt init` → working app in 60 seconds)
- Submit `@craftkit/workflow` and `@kvalt/plugin` to the plugin marketplace
- Soft launch to a small audience (Twitter, HN, design-engineer communities)
- **Milestone:** Kvalt is installable by strangers without hand-holding

---

## 8 — Open questions and follow-ups

Things deliberately unresolved, to be decided during execution:

1. **Blueprint naming.** Currently `packages/blueprint/`. Alternatives: `packages/starter/`, `packages/scaffold/`, `packages/seed/`. Decide during Phase 2. No impact on other choices.
2. **kvalt.com purchase.** Dynadot listing, one-line inquiry pending. Buy if under $3K, walk otherwise.
3. **Skill registry for public skills.** If `@craftkit/workflow` takes off, where do people submit community skills? Deferred to post-v1.
4. **DS-version-in-code:** should the Kvalt DS version be in the consumer's `package.json` as well as MCP config? Probably yes for redundancy; decide in Phase 2.
5. **Multi-theme support in MCP.** If a consumer has multiple character themes, `get_token` needs a theme parameter. Deferred to v2 — v1 assumes single theme per project.
6. **JSR publish target.** TypeScript-native registry as secondary. Nice-to-have; ship v1 on npm only, add JSR in v2 if demand exists.
7. **Character/theme distribution.** Currently characters are one-off files. Should they be installable via `kvalt add character [name]`? Defer to v2 — get core components distributable first.

---

## 9 — What changes in the current Kvalt repo on day 1

The *smallest* first step that keeps momentum:

```bash
cd kvalt-ds
git tag pre-monorepo-restructure         # safety anchor
git checkout -b monorepo-restructure     # do the work here
# create folder structure:
mkdir -p packages/core packages/cli packages/mcp packages/blueprint \
         packages/kvalt-plugin packages/workflow-plugin
# move existing src/, docs/, public/ into packages/core/
# add pnpm-workspace.yaml, root package.json
# install changesets
# commit, push to github.com/kvalt
```

That's the first real commit. Everything else in Phases 1–4 builds on that shape.

---

## 10 — Follow-up docs (all in `docs/plans/`)

- **`blueprint-spec.md`** — full folder structure of the blueprint, init flow, what gets customized per project
- **`agent-roster.md`** — the 7 default + 5 optional agents, their roles, out-of-scope lists, preferred models, trigger conditions, how they coordinate
- **`plugin-architecture.md`** — the two plugins, full skill inventory per plugin, dependency graph, install flows, project-fingerprint checks
- **`versioning-and-updates.md`** — component version headers, Kvalt DS semver, deprecation cycle, codemod authoring guide, MCP version pinning, offline cache mechanics

Read these when you're implementing that specific piece. For the overall vision, this master plan is the source of truth.
