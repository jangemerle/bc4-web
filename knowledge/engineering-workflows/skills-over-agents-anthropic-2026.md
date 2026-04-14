# Don't Build Agents, Build Skills Instead

**Source:** AI Engineer Conference — Barry Zhang & Mahesh Murag, Anthropic (YouTube)
**Added:** 2026-03-31
**URL:** https://www.youtube.com/watch?v=CEvIs9y1uog
**Published:** 2025-12-08

Talk by the creators of Claude Code's Agent Skills system at Anthropic. Core thesis: stop rebuilding agents for each domain — build skills (organized folders of procedural knowledge) that plug into a universal agent instead.

---

## Key Takeaways

### 1. Code Is the Universal Interface
After building Claude Code, Anthropic realized a coding agent is actually a general-purpose agent. Financial reports, data analysis, document creation — all reducible to reading files, calling APIs, writing code. The scaffolding can be as thin as bash + file system.

### 2. Intelligence ≠ Expertise
The "Mahesh vs Barry" analogy: you don't want a 300 IQ genius doing your taxes from first principles — you want an experienced tax professional. Agents today are brilliant but lack domain expertise. Skills fill that gap.

### 3. What Skills Are
Organized collections of files that package composable procedural knowledge. Deliberately simple: they're folders. Version them in Git, share via zip, throw in Google Drive. The format is:
- **Metadata** (always in context) — just the name/description so the agent knows the skill exists
- **skill.md** (read on demand) — core instructions, directory of the folder
- **Scripts as tools** — self-documenting, modifiable, live in file system until needed

### 4. Progressive Disclosure
Only metadata is shown to the model at runtime. The agent reads the full skill.md only when it decides to use that skill. This protects the context window and enables hundreds/thousands of skills simultaneously.

### 5. Three Categories Emerging
- **Foundational skills** — new general capabilities (document creation, scientific research)
- **Third-party skills** — partners teaching Claude their product (Browserbase/Stagehand, Notion)
- **Enterprise/team skills** — org-specific best practices, internal tooling, code style

### 6. Skills + MCP = Complementary
MCP provides connection to the outside world (tools, data). Skills provide the expertise for how to use those connections effectively. Skills can orchestrate workflows across multiple MCP tools.

### 7. Non-Technical Creators
Finance, recruiting, accounting, legal people are building skills. Validates that skills make general agents accessible beyond engineering.

### 8. The Computing Analogy
- **Models = Processors** — massive investment, immense potential, limited alone
- **Agent runtimes = Operating Systems** — orchestrate resources around the processor
- **Skills = Applications** — where millions of developers encode domain expertise and unique POVs

### 9. Skills as Continuous Learning
- Day 1: standardized format guarantees anything Claude writes down can be reused by future self
- Over time: memory becomes tangible — not everything, just procedural knowledge for specific tasks
- Goal: Claude on day 30 is dramatically better than Claude on day 1

### 10. Future Directions
- Testing and evaluation for skills (treating them like software)
- Versioning and lineage tracking as skills evolve
- Explicit dependencies between skills, MCP servers, and packages
- Distribution and sharing across organizations and community

---

## Key Quote
> "Skills are just the starting point. We think it's time to stop rebuilding agents and start building skills instead."

---

## Relevance to Kvalt

- **Kvalt already uses this architecture.** The `.skills/` folder with `figma-to-kvalt`, `tdd-component`, `grill-component`, `check-tokens`, etc. is exactly this pattern. Kvalt is ahead of the curve here.
- **Skills as distribution channel** — Faces could ship as skills. A "face installer" skill that configures tokens, motion, typography in one folder. This is more composable than a CLI preset.
- **Progressive disclosure validates the CLAUDE.md → docs/ → skills/ layering.** The index-level metadata in CLAUDE.md points to detailed docs read on demand. Same pattern Anthropic recommends.
- **Enterprise skills = design system governance.** A "brand compliance" skill that enforces token usage, checks Figma parity, runs audits — exactly what `check-tokens` already does. This is a sellable product for enterprise Kvalt customers.
- **Non-technical skill creators** — Designers building skills for their design system is a powerful narrative. "Your design system ships as a skill that any AI agent can use."
- **Skills + MCP complementarity** — Kvalt already does this: Figma Console MCP (connection) + figma-to-kvalt skill (expertise). The combination is the product.
