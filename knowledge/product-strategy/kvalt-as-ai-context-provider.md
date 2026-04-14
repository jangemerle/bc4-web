# Kvalt as an AI Context Provider

**Source:** Cowork session — "Explore CLI integration for product" (2026-03-31)
**Added:** 2026-03-31
**Type:** Product direction / design decision

---

## Key Takeaways

The standard vision of a design system MCP (Phase 3 in `faces-technical-architecture.md`) focuses on *distribution* — switching faces via natural language. This session surfaced a different, higher-leverage concept: Kvalt as a **live queryable context source that AI coding tools call while generating code**.

### The core insight

Right now the spec-to-shadcn pipeline (used by David's team and any client following this workflow) depends entirely on the quality of the exported spec document. If the spec misses a detail, the AI generates wrong code. If Kvalt could be queried directly, the AI fills its own gaps.

An MCP server exposing tools like:
- `get_token("color.primary")` — returns the exact CSS variable and value
- `get_component_spec("Modal")` — returns props, variants, accessibility requirements
- `list_variants("Button")` — returns all variants with their token usage
- `get_motion_config("spring.snappy")` — returns the exact spring configuration

...means any AI tool (Cursor, Claude Code, Windsurf) can connect and pull ground-truth Kvalt context during code generation, rather than inferring from a static document.

### Three implementation forms (ranked by leverage)

1. **MCP server** — highest leverage, fits ecosystem direction. Live context injection. Cursor, Claude Code, Windsurf connect directly. The docs site shows "MCP CONNECTED" as a real status indicator when an AI session is actively pulling from Kvalt. Most defensible.

2. **CLI context dump** — `kvalt context Button --format=prompt` outputs the component spec, tokens, and conventions as a copy-paste prompt block. Simpler, works everywhere, no MCP support required. Good bridge until MCP is everywhere.

3. **Static JSON bundle** — `npm install @kvalt/ai-context` — machine-readable token and component spec file. Lowest effort to build, lowest dynamic value but composable with any workflow.

### Distinction from faces distribution MCP

- `faces-technical-architecture.md` Phase 3 MCP = switching visual identity ("apply the fintech face")
- This concept MCP = querying design knowledge during code generation ("what's the exact spring config for press feedback?")

Both MCPs could be the same server with different tool surfaces. But the mental model and use case are different enough to plan and market separately.

### "MCP CONNECTED" as a UI pattern

The status pill already exists in the Kvalt docs site UI. Giving it real semantics — showing whether an AI session has Kvalt context loaded — turns it from decoration into a product differentiator. It makes the AI-native positioning visible and tangible to developers.

---

## Relevance to Kvalt

This extends the spec-to-shadcn pipeline beyond document quality. Rather than building ever-more-detailed spec exports, the ceiling on output quality rises when the AI agent can ask Kvalt what it needs to know. This is directly relevant to the David/CTO workflow and to any team that uses AI to implement from Kvalt specs.

**Phasing:** This can be a Phase 3.5 — after the CLI ships but before presets. The JSON bundle version is buildable in a day (export `src/tokens/` and component manifests as a static file). The MCP version builds on top of that.

**Marketing angle:** The "MCP CONNECTED" indicator on the docs site is a concrete, demonstrable feature that no other design system has. It makes the AI-native positioning visible in a screenshot.
