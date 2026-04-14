# Plugin Architecture

**Companion to:** `docs/MASTER-PLAN.md` § 3 Layer C
**What this covers:** the two plugins, their full skill inventory, dependency graph, install flows, and the project-fingerprint check that prevents misfire.

---

## 1 — Why two plugins, quick recap

**`@craftkit/workflow`** — 11 generic skills, works on any project regardless of stack. Your engineering discipline layer.

**`@kvalt/plugin`** — 6 Kvalt-specific skills, depends on `@craftkit/workflow`. Your design system layer.

The split exists because:
- `@craftkit/workflow` survives if you ever stop using Kvalt
- Non-Kvalt client projects get your process without loading Kvalt-specific skill descriptions (saves context tokens)
- Preserves the composable product model — workflow plugin can be sold or distributed as its own product
- Clean dependency direction — Kvalt depends on workflow, never the reverse

---

## 2 — `@craftkit/workflow` — full skill inventory

Core set of 11 skills ships in v1. An additional 8 are on the roadmap (port audit from Whatever Task confirmed these are genuinely useful) and ship as they mature.

### 2.1 Planning & process (v1)
- **`planner`** — grill-style questioning → `PRD.md` section with stable ID. Pairs with the Planner agent.
- **`grill-component`** — design-tree interview before building anything (variants, states, content model, composition, accessibility, motion, edge cases). Not DS-specific; works for any component or feature.
- **`tdd-component`** — red-green-refactor loop. Follows the design from `grill-component`.
- **`spec-validator`** *(roadmap)* — completeness check on a PRD/spec before Builder starts. Catches missing acceptance criteria, undefined states, vague language.

### 2.2 Engineering (v1)
- **`commit`** — writes conventional commit messages, runs pre-commit hooks. Pairs with the Commit agent.
- **`architecture-lint`** — checks for duplicate code, files > 400 lines, high coupling, circular imports.
- **`security-audit`** — gitleaks + npm audit + (future) Mythus integration. Runs on-demand or scheduled.
- **`playwright-test`** — e2e + visual regression + interaction tests. Pairs with the Auditor agent.
- **`component-health`** *(roadmap)* — per-component quality dashboard (test coverage, last-touched date, open issues, token compliance, bundle cost).
- **`dependency-guardian`** *(roadmap)* — watches for outdated/vulnerable dependencies, proposes safe upgrade paths, drafts PRs.
- **`breaking-change-detector`** *(roadmap)* — diffs public API surface between versions, flags breaking changes, suggests codemod scope.
- **`resilience-test`** *(roadmap)* — edge-case / stress testing (large inputs, empty states, network failure, race conditions).
- **`changelog-generator`** *(roadmap)* — generates release notes from conventional commits + PR descriptions. Pairs with Release Manager agent.

### 2.3 Session & memory (v1)
- **`wrap-up`** — save session summary to `knowledge/conversation-log/`. Ties into the memory stack (Layer 3).
- **`schedule`** — create scheduled tasks that run daily/weekly. Wraps the Cowork scheduled-tasks mechanism.

### 2.4 Ideation & design-adjacent (roadmap)
- **`sketch`** *(roadmap)* — layout wireframing in a sketch-first style, before going to pixel-perfect.
- **`brainstorm`** *(roadmap)* — unexpected combinations. Forcing-function prompts for when exploration stalls.

### 2.5 External (v1)
- **`apify-fetch`** — web scraping fallback when WebFetch fails. Includes the YouTube transcript+comments flow from our auto-memory.
- **`ffmpeg`** — video/image manipulation. Converts recordings to GIFs, extracts frames, etc.

**v1 skill count: 11. Full roadmap count: 19.** Roadmap skills ship as they mature — quality gate is the skill-benchmarking methodology (see `knowledge/engineering-workflows/skill-benchmarking-methodology.md`).

---

## 3 — `@kvalt/plugin` — full skill inventory

### 3.1 Design-to-code
- **`figma-to-kvalt`** — complete token mapping tables (Figma → Kvalt Tailwind classes), Figma MCP parsing rules, font/color/spacing/radius/shadow translation.
- **`check-tokens`** — audits Kvalt components against the token system. Called by the Auditor agent. Self-improving via benchmark loop (`skill-benchmarking-methodology.md`).

### 3.2 Page & theme generation
- **`kvalt-page-gen`** — uses Kvalt's `PageHero`, `Section`, `CardGrid`, `ExampleBlock` layout components. Recipes for foundation / component / philosophy / Screen Vault pages.
- **`create-character`** — generates DS theme characters (53 CSS variable overrides) from a mood description.

### 3.3 Asset generation
- **`generate-illustration`** — Midjourney prompts for Kvalt watercolor style (Ouch hand-drawn). Supports color accent variants.
- **`pencil-kvalt`** — tuned Pencil design workflow with Kvalt variables and style guide pre-loaded.

---

## 4 — Dependency graph

```
                  ┌──────────────────┐
                  │  @craftkit/workflow   │
                  │                  │
                  │  11 skills       │
                  │  Works anywhere  │
                  └──────────────────┘
                          ▲
                          │ depends on
                          │
                  ┌──────────────────┐
                  │  @kvalt/plugin   │
                  │                  │
                  │  6 skills        │
                  │  Kvalt projects  │
                  └──────────────────┘
                          ▲
                          │ depends on (optional)
                          │
                  ┌──────────────────┐
                  │  future:         │
                  │  @kvalt/themes   │
                  │  @kvalt/kits     │
                  └──────────────────┘
```

Cross-plugin skill calls (e.g., `check-tokens` calling `playwright-test`) are explicit — the Kvalt-specific skill declares a soft dependency on a workflow-plugin skill. If `@craftkit/workflow` isn't installed, the Kvalt skill degrades gracefully with a "install the workflow plugin for full functionality" note.

---

## 5 — Install flows

### 5.1 Via Claude / Cowork plugin marketplace (recommended for individual devs)

```
In Claude: Customize → Plugins → Install @craftkit/workflow
           then:        Plugins → Install @kvalt/plugin
```

Active across all sessions in all projects. Skills auto-fire based on their descriptions. Updates propagate via the registry.

**Pros:** one install, zero per-project config, always up-to-date.
**Cons:** Kvalt-specific skills load their descriptions in non-Kvalt projects (small token cost, mitigated by project-fingerprint check below).

### 5.2 Via `kvalt init` (per-project install)

```bash
kvalt init my-app
# choose: "install skills per-project" in the interactive prompt
```

CLI copies skill folders from the user's local plugin install into `.claude/skills/` of the new project. Skills are versioned with the project.

**Pros:** deterministic, reproducible, explicit dependency.
**Cons:** manual `kvalt knowledge pull` to get skill updates.

### 5.3 Hybrid (the default)

Most users will have plugins installed globally via 5.1 AND have `kvalt init` drop per-project versions. Duplicate skill names deduplicate by install precedence (project → user-global → none). This means a project can pin a specific skill version while others float.

---

## 6 — Project-fingerprint check (preventing misfire)

Every Kvalt-specific skill includes this at the top of `SKILL.md`:

```markdown
## Prerequisites

Before proceeding, verify this is a Kvalt project. One of the following
must be true:

- `package.json` has `@kvalt/core` or `@kvalt/cli` in dependencies/devDependencies
- `mcp-config/kvalt.json` exists with a `kvaltVersion` field
- `docs/SYSTEM.md` contains "Kvalt" in the first 50 lines

If NONE are true, stop and tell the user:

  "This skill is for Kvalt-based projects. For this project, you
   probably want: [route to generic alternative from @craftkit/workflow].
   If you want to scaffold a Kvalt project, run: npx kvalt init."

Do not attempt to apply Kvalt tokens or components. Claude does not
know this project's design system and should not guess."
```

This is the guard that makes it safe to install `@kvalt/plugin` globally in 5.1 — skills won't misfire on a React project that has nothing to do with Kvalt.

---

## 7 — Plugin versioning

Both plugins follow SemVer independently.

### `@craftkit/workflow`
- **PATCH:** skill description tweaks, bug fixes in scripts
- **MINOR:** new skills added (e.g., future `changelog-gen` skill)
- **MAJOR:** breaking change to a skill's invocation pattern or output format

### `@kvalt/plugin`
- Same pattern
- Explicit peer dependency on `@craftkit/workflow >= X.Y.Z` — updates when workflow plugin ships a breaking change
- Kvalt DS breaking changes do NOT automatically bump the plugin's major version; the plugin abstracts the DS specifics

Both plugins publish to the Claude/Cowork plugin marketplace + npm (as zip archives named `@craftkit/workflow.plugin` and `@kvalt/plugin.plugin`).

---

## 8 — Skill authoring conventions (applies to both plugins)

Every skill file:

```markdown
---
name: [skill-name]
description: [trigger description — specific, scoped, mentions prerequisites if Kvalt-only]
---

# [Skill Name]

## When to use this skill
[2–3 sentences, concrete examples]

## Prerequisites
[project-fingerprint check if Kvalt-specific; otherwise skip]

## Process
[ordered steps, each actionable]

## Outputs
[what files or artifacts the skill produces]

## Related skills
[cross-references to other skills in either plugin]
```

Reviewed via the `skill-creator` skill + self-benchmarked via the `skill-benchmarking-methodology` pattern. Skills that fail benchmarks don't ship.

---

## 9 — What's intentionally *not* in either plugin

- **No Kvalt *components*** — those live in `@kvalt/core` and are installed per-project via `kvalt add`. Plugin skills reference them but don't bundle them.
- **No MCP server code** — that's `@kvalt/mcp`. Plugins *use* the MCP via Claude's standard MCP client, they don't contain one.
- **No CLI code** — that's `@kvalt/cli`. Plugins can invoke CLI commands but don't reimplement them.
- **No agent definitions** — those live in `packages/blueprint/.claude/agents/`. Plugins provide skills, blueprint provides agents.

This keeps concerns separate: plugins = skills (procedural knowledge), blueprint = agents + hooks + structure, core = the design system itself, CLI = distribution, MCP = runtime query surface.

---

## 10 — Release coordination across plugins

Monorepo + Changesets handles this:

- Change a file in `packages/workflow-plugin/` → Changeset flags workflow plugin for bump
- Change a file in `packages/kvalt-plugin/` → same for Kvalt plugin
- If both change in one PR → two separate version bumps, coordinated release

A release PR is auto-opened by Changesets with the version bumps + changelog entries pre-filled. Merge the release PR → CI publishes to both npm and the plugin marketplace.

For breaking changes: Changesets asks for a migration note → becomes the "Upgrade Guide" in release notes → optionally paired with a codemod (same discipline as Layer B components).
