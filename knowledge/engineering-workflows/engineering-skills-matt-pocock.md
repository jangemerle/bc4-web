# 5 Claude Code skills I use every single day

**Source:** YouTube (Matt Pocock)
**URL:** https://www.youtube.com/watch?v=matt-pocock-daily-skills
**Added:** 2026-03-18
**Type:** YouTube video (22 min, published Mar 16 2026, 61.6K views)

---

## Who is Matt Pocock
Full-stack engineer and educator at Total TypeScript. Designed a five-skill system that forms a complete product development workflow from ideation to architecture refactoring.

---

## Key Takeaways
### 1. Process is Everything
"Process has never been more important." Agents have no long-term memory, so strict, well-defined workflows are non-negotiable. Each skill encodes a process, not a tool.

### 2. `/grill-me` — Relentless Interview (3 sentences)
"Interview me about every aspect of this plan until we reach shared understanding. Walk down each branch of the design tree, resolving dependencies one by one." Based on Frederick Brooks' "The Design of Design." Sessions run 30–45 min with 30–50 questions. Tiny spec, massive impact.

### 3. `/write-a-prd` — Idea to Specification
Takes grilled idea → GitHub issue as PRD. Steps: ask description, explore repo, interview user, sketch major modules, write PRD from template including user stories. Bridges grilling and execution.

### 4. `/prd-to-issues` — Vertical Slices Over Horizontal
Breaks PRD into thin, vertical cuts (touch all integration layers) not horizontal feature layers. Establishes blocking relationships. Tracer bullet approach: flush out unknown unknowns first, then add detail.

### 5. `/tdd` — Test-Driven Development Loop
Write one failing test → code to pass → refactor. Forces Claude to confirm interface changes with user before coding. "Deep modules" concept: larger modules with thin interfaces are easier for AI to navigate, test, and maintain.

### 6. `/improve-codebase-architecture` — Guided Refactoring
Explores codebase for confusions, identifies "deepening opportunities" (shallow modules → deep modules), spawns 3+ parallel sub-agents to design different interfaces, recommends hybrid. Produces RFC as GitHub issue.

### 7. Process Chain
Complete workflow: grill-me → write-a-prd → prd-to-issues → tdd (Ralph loops) → improve-codebase-architecture. Each skill is a stage gate. Output of one feeds input of the next.

### 8. Treat Agents Like Constrained Humans
Agents lack memory, get confused by ambiguity, can't hold state across long sessions. Design processes assuming these constraints — repetition, explicit handoffs, small batch sizes.

---

## Relevance to Kvalt

- **Skill Chain as Kvalt Workflow:** Kvalt's component lifecycle should mirror Pocock's chain. New component: grill-me (clarify use cases) → prd (spec with props and variants) → issues (break into implementable pieces) → tdd (component + tests) → architecture review (refactor for composability).

- **TDD for Token Consistency:** Kvalt's token system (`src/tokens/motion.ts`, `tokens.md`) benefits from TDD discipline. Write a test asserting "spring.snappy applies correct timing," then implement the token. Catches token mismatches early.

- **Deep Modules in Design:** Pocock's "deep modules with thin interfaces" applies directly to component design. A Button component with 50 props (shallow) is harder for AI to navigate than a thoughtfully composed component with core props + slots (deep). Kvalt should guide this.

- **Vertical Slices for Component Dependencies:** When adding components to Kvalt, use vertical slices: a feature like "dark mode support" cuts through Button, Input, Card, etc. rather than building "all dark mode infrastructure" first. Tracer bullet approach catches unknowns.

- **Ralph Loops in Refactoring:** When redesigning component families (form controls, navigation), use Ralph loops (red-green-refactor) to validate each step. Prevents architectural drift and maintains backward compatibility.

- **Grill-Me for API Design:** Before finalizing a complex component's props API, run `/grill-me` on the spec. Force yourself to articulate every constraint, dependency, and edge case. Results in cleaner, more stable components.

- **Process Documentation in CLAUDE.md:** Kvalt's `CLAUDE.md` should encode this workflow for Claude Code. "New component? Run `/grill-me`, then spec in `docs/components/`, then implement in TDD, then review architecture." Scales adoption.

---

_Full transcript available (20286 chars). This digest captures the five-skill chain, deep modules concept, and process-first philosophy._
