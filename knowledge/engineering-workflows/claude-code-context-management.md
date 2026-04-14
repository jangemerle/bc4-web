# How to make Claude Code less dumb

**Source:** YouTube (Michia Rohrssen)
**URL:** https://www.youtube.com/watch?v=michia-context-management
**Added:** 2026-03-18
**Type:** YouTube video (18 min, published Mar 15 2026, 64.7K views)

---

## Who is Michia Rohrssen
Software engineer focused on AI-assisted development workflows. Specializes in context management and sub-agent architectures for Claude Code.

---

## Key Takeaways
### 1. Context as the Core Constraint
Past ~50% context window, Claude begins hallucinating and forgetting instructions from minutes ago. Don't wait for 100% fill. Monitor aggressively and split work early.

### 2. Sub-Agents Over Compaction
Never compact context (loses information but retains errors). Instead: main agent orchestrates, spawns clean sub-agents with their own windows, collects reports. Sub-agents start fresh with zero poisoning.

### 3. Plugin Stack for Extended Capabilities
Must-haves: (1) cc-statusline (shows context %, cost, session time, git branch), (2) Superpowers (spec-driven with sub-agents), (3) Sequential Thinking MCP (chain-of-thought), (4) Context7 (up-to-date API knowledge), (5) Code Simplifier.

### 4. Superpowers Workflow: Brainstorm → Plan → Execute
Brainstorm phase: clarifying questions, approaches, design doc. Plan phase: spec + implementation plan. Execute phase: dispatches sub-agents, code reviewers, testers. Three-layer separation avoids context collapse.

### 5. Terminal Alongside Claude
Use Warp terminal to see files while Claude writes. Split panes, multiple instances, tabs. Tight feedback loop between Claude output and file system reality.

### 6. Custom Skills for Process Encoding
Encode repetitive workflows as skills (example: "creature-forge"). Each skill has a clean spec, inputs, outputs. Scales linearly without context bloat.

---

## Relevance to Kvalt

- **Sub-Agent Architecture for Component Building:** Kvalt components are complex (props, variants, animations, token bindings). Use sub-agents: one for spec, one for component code, one for tests. Each stays fresh; main agent orchestrates. Mirrors Michia's pattern exactly.

- **Superpowers for Spec-Driven Development:** Kvalt's `docs/components/INDEX.md` and `specs/` folder are pre-built for Superpowers workflow. Brainstorm phase produces spec, plan phase produces implementation roadmap, execute phase builds with sub-agents.

- **Sequential Thinking for Complex Token Decisions:** When Kvalt adds new token categories (e.g., new motion timing family), Sequential Thinking MCP helps Claude reason through implications across `src/tokens/motion.ts`, `CLAUDE.md`, and all dependent components.

- **Context7 for API Currency:** Kvalt uses React 19, Tailwind 4, Motion 5, TypeScript. Context7 plugin ensures Claude Code always has latest API docs — catches hallucinated deprecated patterns early.

- **Custom Skills as Meta-Automation:** Kvalt's existing skills (figma-to-kvalt, page-gen, image-optimize) are perfect candidates for sub-agent dispatch. Main orchestrator skill could manage all three in parallel, reducing total context load.

---

_Full transcript available (20429 chars). This digest captures context-window limits, sub-agent architecture, plugin stack, and terminal workflows._
