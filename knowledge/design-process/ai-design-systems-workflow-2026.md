# AI + Design Systems in 2026: The Workflow I Actually Use

**Source:** UI Collective — Kirk (YouTube)
**URL:** https://www.youtube.com/watch?v=XfezMs8B-O8
**Added:** 2026-03-18
**Type:** YouTube video (~31 min, published Jan 26, 2026, 34K views)

---

## Who is Kirk / UI Collective

Design system practitioner who runs UI Collective Academy and Design System Labs — he builds and fixes design systems for clients professionally. Also created Collective Kit (a commercial design system). His content is workflow-first, not theoretical. This is the first in a planned series on AI + design systems as the space evolves in 2026.

---

## Key Takeaways

### 1. What AI cannot do (yet) in design systems

Three hard limitations Kirk identifies from real client work:

- **Cannot build a Figma variable library from scratch.** You can't say "build me a variable library for a SaaS health tech startup" and get anything usable. Even with his prior tutorial on this, it requires considerable input — you need foundational knowledge of each collection, and it takes multiple iteration rounds.
- **Cannot build Figma designs using actual design system components.** AI tools generate designs that look like your components but don't use them. They recreate button/form appearances using variables but the actual component instances aren't used.
- **Cannot build real Figma components.** AI generates groups, not auto-layout frames. You'd spend more time rebuilding what it gives you than building from scratch.

### 2. Figma Make specifically tested and found lacking

Kirk tested Figma Make with Collective Kit synced as the design system. Results: variables weren't applied when copied to a Figma page, text styles weren't used, line heights were wrong (57.6 instead of correct values), padding values were bizarre (138.07), and component variants weren't actually used. His verdict: "you'd have to rebuild the components one at a time to get any value out of it."

### 3. Where AI actually works: two practical workflows

**Workflow A — Design token/variable auditing via Cursor + Figma MCP:**
1. Connect Figma MCP to Cursor
2. Feed AI your token documentation table (token name, light mode value, dark mode value, description/usage)
3. Have AI generate a Cursor project rule from this — basically teaching AI all your tokens and when each should be used
4. Build a reusable Cursor command (`/check-variables`) that audits any Figma frame against those rules
5. Pass any Figma link → AI identifies wrong variables, missing variables, hardcoded values, and suggests the correct token

The command steps: (1) identify what's being analyzed, (2) look at UI as a whole — surfaces, borders, text colors, icon colors, secondary/tertiary components, (3) review variables against their documented usage, (4) call out issues one line per issue.

Kirk's demo found: text using a border variable instead of a text token, and a hardcoded hex value instead of a border variable — including suggesting the specific correct variable. He says this speeds up design auditing "50-fold."

**Workflow B — Design system documentation generation:**
1. Create a Cursor rule for documentation style: plain language, describe what the component is/where used/why it exists, don't introduce new components, confirm assumptions instead of guessing
2. Build a reusable command (`/generate-documentation`) with structured output: name, purpose, when to use, when not to use, accessibility guidelines, properties, notes
3. Pass a Figma component link → AI generates markdown documentation

Output is deliberately light — designed to be uploaded to Zero Height, Supernova, or an internal docs site. It covers variants, use cases, states, behaviors, and props. Not meant for direct developer handoff — developers write their own technical content.

### 4. The reusable prompt/command pattern is the real asset

The efficiency gain isn't in any single AI interaction — it's in building reusable Cursor commands and rules that encode your design system's specific knowledge. Once built, anyone on the team can run `/check-variables` or `/generate-documentation` against any frame without needing to understand the underlying prompts.

### 5. Don't trust tools that claim to build designs using your components

Kirk explicitly warns: if your boss asks you to evaluate a tool that "builds designs using your actual design system components" — they don't. Not yet. Tools outside Figma (like standalone AI design tools) exist but aren't in his workflow because all his clients are in Figma. He'll update the series if anything changes.

---

## Relevance to Kvalt

**Direct application — variable auditing:** The `/check-variables` workflow maps directly to Kvalt. We already have comprehensive token documentation in `docs/tokens.md`. Building a Cursor command that audits Figma frames against Kvalt tokens (spacing, radius, color semantics) would catch drift between Figma and code instantly.

**Documentation generation:** The `/generate-documentation` workflow could accelerate Kvalt's `docs/components/` pages. Feed a Figma component → get structured markdown → merge into the existing doc template from `.skills/kvalt-page-gen/`.

**Rules as institutional knowledge:** Kirk's Cursor rules are essentially the same pattern as Kvalt's `.skills/` folder — encoding project-specific expertise into reusable tools. This validates the approach and suggests we could add a `prompts/` or `commands/` folder with reusable audit prompts.

**Figma Make limitation:** Confirmed what we've experienced — AI design generation in Figma doesn't produce production-quality component usage. The Figma-to-code direction (existing components → code) remains more reliable than the AI-to-Figma direction.

**Explicit about secondary/tertiary elements:** Kirk's tip about explicitly asking AI to check secondary/tertiary components is worth adopting — it catches elements that audit prompts otherwise fixate away from.

---

_Full transcript available (34,096 chars). This digest captures both practical workflows and the specific limitations tested._
