# Kvalt — Multi-Agent Architecture

A pipeline of specialized Claude agents for Figma-to-code translation with automated quality gates.

## Overview: Stage-Based Pipeline

Unlike domain-based agent splits (where each agent owns separate code modules), Kvalt uses **pipeline stages** — each agent handles a phase of the design-to-code workflow. This fits a design system where a single component touches components, tokens, tests, pages, and navigation.

```
              ┌──────────────────┐
              │    DIRECTOR      │
              │  (You + Claude)  │
              │                  │
              │ Creates tasks    │
              │ Reviews reports  │
              │ Merges PRs       │
              │ Wires App.tsx    │
              └───────┬──────────┘
                      │
       ┌──────────────┼──────────────┐
       │              │              │
┌──────▼──────┐ ┌─────▼──────┐ ┌────▼───────┐
│  DESIGNER   │ │  BUILDER   │ │  AUDITOR   │
│  (Opus)     │ │  (Sonnet)  │ │  (Opus)    │
│             │ │  ×N        │ │            │
│ Figma MCP   │ │  worktree  │ │ Figma MCP  │
│ → manifests │ │  isolated  │ │ → reports  │
│ → specs     │ │  → code    │ │ → audits   │
│             │ │  → tests   │ │            │
└─────────────┘ │  → pages   │ └────────────┘
                └────────────┘
```

## Agent Definitions

All definitions live in `.claude/agents/`. Claude Code reads these automatically.

### Director (interactive session)

No agent file — this is your main Claude Code session.

**Responsibilities:**
- Create task lists with DAG dependencies
- Spawn Designer, Builder(s), Auditor as subagents
- Review Auditor iteration reports
- Decide: iterate or merge
- Wire components into App.tsx and navigation
- Handle token decisions when Designer escalates

### Designer (`designer.md`)

**Model:** Opus (token mapping requires design judgment)
**MCP:** figma-console (southleft/figma-console-mcp)
**Skills:** figma-to-kvalt, check-tokens
**Output:** `manifests/*.json`, `specs/*.md`, reference screenshots

Reads Figma designs and produces Design Manifests — structured JSON files mapping every visual value to a Kvalt token. Two modes:

- **Component extraction** — single DS component with all variants, states, tokens
- **Screen translation** — full app page mapped element-by-element to Kvalt components, with gap analysis for anything missing

The manifest replaces Figma for downstream agents. Also produces a **gap analysis** when Figma uses components or patterns not yet in Kvalt, with non-breaking suggestions for DS updates.

### Builder (`builder.md`)

**Model:** Sonnet (implementation is well-constrained by specs)
**Isolation:** Worktree (each Builder gets its own branch)
**Skills:** tdd-component, kvalt-page-gen
**Output:** `src/components/*.tsx`, tests, `src/pages/components/*Page.tsx`, `src/pages/screen-vault/*Page.tsx`

Two modes:
- **Component TDD** — red-green-refactor from component manifests
- **Screen assembly** — compose existing Kvalt components into full app pages from screen manifests, using workarounds for any gaps

Never looks at Figma. Can be spawned ×N for parallel work.

### Auditor (`auditor.md`)

**Model:** Opus (quality judgment, visual comparison)
**MCP:** figma-console (for screenshot comparison)
**Skills:** check-tokens, playwright-test
**Output:** `audits/session-*.md` iteration reports

Reviews all Builder output for token compliance, manifest fidelity (element-by-element comparison), accessibility, convention adherence, and visual regression against Figma screenshots. For screen pages, walks the manifest's layoutTree against the JSX to verify every element, component, and token matches exactly. Produces actionable reports.

## Shared Documents

| Document | Purpose | Owner |
|----------|---------|-------|
| `manifests/[component].json` | Component token maps, variants, states | Designer |
| `manifests/screens/[screen].json` | Screen layout tree, component inventory, gap analysis | Designer |
| `manifests/gap-analysis.md` | DS gaps with non-breaking fix suggestions | Designer |
| `specs/[component].md` | Behavior spec, props API, a11y | Designer |
| `docs/conventions.md` | Coding rules (read-only reference) | Director |
| `docs/tokens.md` | Token values (read-only reference) | Director |
| `audits/session-*.md` | Quality reports | Auditor |

## Task Flow

Tasks use Claude Code's native task system with DAG dependencies.

### Single component pipeline

```
Task 1: "Extract [Component] from Figma"
  owner: designer
  status: pending

Task 2: "Build [Component]"
  owner: builder
  blockedBy: [task-1]

Task 3: "Create [Component] doc page"
  owner: builder
  blockedBy: [task-2]

Task 4: "Audit [Component]"
  owner: auditor
  blockedBy: [task-2, task-3]
```

### Batch pipeline (multiple components)

```
Task 1: "Extract all target components from Figma"
  owner: designer

Task 2a: "Build Tooltip"         ─┐
  owner: builder                  │
  blockedBy: [task-1]             │ parallel
Task 2b: "Build Pagination"      │
  owner: builder                  │
  blockedBy: [task-1]            ─┘

Task 3a: "Doc page: Tooltip"
  owner: builder, blockedBy: [task-2a]

Task 3b: "Doc page: Pagination"
  owner: builder, blockedBy: [task-2b]

Task 4: "Audit all changes"
  owner: auditor
  blockedBy: [task-3a, task-3b]
```

### Screen translation pipeline (Figma → full app page)

```
Task 1: "Extract [Screen] from Figma"
  owner: designer
  → produces screen manifest + gap analysis

Task 2: Director reviews gap analysis
  → decides: build gaps first, or proceed with workarounds?

  IF gaps need fixing first:
    Task 2a: "Build SidebarNav component"     ─┐
      owner: builder                            │ parallel
    Task 2b: "Add danger variant to Button"    ─┘
      owner: builder

    Task 2c: "Audit new components"
      owner: auditor
      blockedBy: [task-2a, task-2b]

Task 3: "Build [Screen] page from manifest"
  owner: builder
  blockedBy: [task-1, optional: task-2c]

Task 4: "Audit [Screen] page"
  owner: auditor
  blockedBy: [task-3]
```

## The Self-Review Loop

After each Auditor report:

```
Auditor produces report
    │
    ▼
Director reads report
    │
    ├── PROCEED → merge all PRs, update App.tsx
    │
    ├── ITERATE → create targeted fix tasks
    │              → re-signal specific Builders
    │              → Auditor re-audits after fixes
    │
    └── ESCALATE → human decision needed
                   (unmapped tokens, design ambiguity)
```

Each iteration round gets tighter — first pass catches structural issues, subsequent passes catch polish issues. Maximum 3 rounds before escalating.

## Design Manifest Format

See `manifests/` directory. Each manifest is a JSON file with:

- `component` — name
- `source` — Figma file, node ID
- `extractedAt` — timestamp
- `variants` — all variant axes and values
- `tokens` — complete token map (figma value → kvalt token) for colors, typography, spacing, radius, shadows
- `unmappedValues` — values without token equivalents (escalation triggers)
- `screenshots` — paths to Figma reference images
- `notes` — Designer observations

## Figma Integration

**Tool:** southleft/figma-console-mcp (90+ tools, deep component trees, resolved tokens)

**Connection:** NPX mode with Figma Desktop + bridge plugin

**Figma source files:**
- Topic Board New (`GKdrp6fzNGwF0XKPO5MDQz`) — DS components and tokens
- BC Call Centrum (`UEZqLZJloo597fklh9ldaD`) — Application screens

## Quick Start

### First time setup

```bash
# 1. Install figma-console-mcp
claude mcp add figma-console -s user \
  -e FIGMA_ACCESS_TOKEN=figd_YOUR_TOKEN \
  -e ENABLE_MCP_APPS=true \
  -- npx -y figma-console-mcp@latest

# 2. Install Figma Desktop bridge plugin
# Open Figma Desktop → Plugins → Development → Import from manifest
# Select: ~/.figma-console-mcp/plugin/manifest.json

# 3. Restart Claude Code
```

### Running the pipeline

```
# In your main Claude Code session:

# Option A: Spawn agents manually
"Run the designer agent on the Tooltip component from Topic Board New"
"Run the builder agent on manifests/tooltip.json"
"Run the auditor on all changes from this session"

# Option B: Create a task list and let DAG handle it
"Create a task pipeline to build the Tooltip component from Figma"
```

## File Ownership

| Path | Owner | Others |
|------|-------|--------|
| `manifests/` | Designer | Builder (read), Auditor (read) |
| `specs/` | Designer | Builder (read), Auditor (read) |
| `src/components/[assigned]` | Builder | Auditor (read) |
| `src/pages/components/[assigned]` | Builder | Auditor (read) |
| `audits/` | Auditor | Director (read) |
| `App.tsx` | Director | — |
| `src/tokens/` | Director | All (read) |
| `docs/` | Director | All (read) |
