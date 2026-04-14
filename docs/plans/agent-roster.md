# Agent Roster

**Companion to:** `docs/MASTER-PLAN.md` § 3 Layer C + § 4
**What this covers:** every agent in the blueprint, its role, model, triggers, out-of-scope list, and how they hand off to each other.

---

## 1 — Default team (always installed)

Seven agents cover the full feature lifecycle. Each has a dedicated `.claude/agents/*.md` file with its full system prompt. Summary table:

| Agent | Model | When it fires | Primary output |
|---|---|---|---|
| Planner | Opus | Start of any new feature | A new section in `PRD.md` with a stable ID |
| Architect | Opus | After Planner, before Builder (skippable for small changes) | `docs/decisions/ADR-NNN-[topic].md` |
| Builder | Sonnet | Implementing a PRD section | Code + tests (refuses without PRD) |
| Auditor | Opus | After Builder, before merge | `audits/YYYY-MM-DD-[feature].md` |
| Debugger | Sonnet | User reports "something is broken" | `debug-reports/YYYY-MM-DD-[issue].md` |
| Reviewer | Opus | Before merge, after Auditor passes | PR-style comments on the diff |
| Commit | Haiku | At commit time | Conventional commit message |

### 1.1 Planner

**Model:** Opus
**Role:** Turn vague user intent into a reviewed, committed PRD section.
**Fires when:** user asks to "build", "add feature", or anything feature-shaped without a matching PRD section.
**Process:**
1. Reads `docs/PROJECT.md`, existing `PRD.md`, relevant knowledge entries (tagged `process`).
2. Runs grill-style questioning (branching decision tree: goal, users, success criteria, constraints, non-goals, edge cases, dependencies, motion/a11y requirements).
3. Ends by proposing a PRD section with a stable ID (`PRD-042`) and writing it to `docs/PRD.md`.
4. Commits the PRD with message `docs(prd): add PRD-042 [title]`.
**Out of scope:** writing code, choosing specific libraries, making architecture decisions (that's Architect's job).

### 1.2 Architect

**Model:** Opus
**Role:** Review the PRD for scaling, security, data-flow, and architectural boundaries *before* any code exists.
**Fires when:** PRD is non-trivial (Planner flags `architecture-review: required`). Skippable for small features by explicit user override.
**Process:**
1. Reads the PRD section + relevant knowledge entries (tagged `engineering-workflows`, `security`).
2. Questions assumptions: "you said X — have you considered Y? What happens at 10× scale? Where does PII flow?"
3. Writes an ADR (`docs/decisions/ADR-NNN-[topic].md`) documenting decisions with rationale.
4. If fundamentally blocked, routes back to Planner.
**Out of scope:** implementation details, component-level decisions, UI critique (Auditor and Designer cover those).

### 1.3 Builder

**Model:** Sonnet
**Role:** Implement a PRD section using TDD. This is the workhorse.
**Fires when:** user asks to implement something AND a matching PRD section exists.
**Process:**
1. **PRD check (mandatory):** Verify `PRD.md` contains a matching section. If not → STOP, route to Planner. `/skip-prd` override exists for typo fixes / trivial bugs.
2. **ADR check:** If Architect flagged this as requiring review and no ADR exists → STOP, route to Architect.
3. Writes failing tests first (TDD red).
4. Implements to pass (TDD green).
5. Refactors (TDD refactor).
6. If DS project: runs `check_compliance` via MCP before declaring done.
7. Appends to `PROGRESS.md` with a one-line note.
**Out of scope:** writing a PRD, making architecture decisions, reviewing its own work, writing commit messages.

### 1.4 Auditor

**Model:** Opus
**Role:** Independent quality review on the diff Builder just produced.
**Fires when:** Builder signals "done" on a feature. Also fires in CI on every PR.
**Process:**
1. Runs full `kvalt audit`: tokens, hardcoded values, eslint, test coverage on new code.
2. Runs `playwright-test` for visual regression + interaction tests.
3. Runs `accessibility-review` if UI changed.
4. Runs `security-audit` on any file touching auth, input, or external calls.
5. Writes `audits/YYYY-MM-DD-[feature].md` with findings.
6. If any blocker found: routes back to Builder with specifics.
**Out of scope:** commenting on design intent (Reviewer's job), writing new code, fixing the issues it finds.

### 1.5 Debugger

**Model:** Sonnet
**Role:** Runtime investigation when something is broken.
**Fires when:** user reports "it's broken" — blank screen, console errors, broken interaction, visual glitch.
**Process:**
1. Asks minimal reproduction steps (doesn't re-derive them from scratch).
2. Opens the affected page in Playwright, reproduces, captures console + network.
3. Identifies root cause by narrowing: last commit touching this code, last dependency change, data-shape mismatch.
4. Writes `debug-reports/YYYY-MM-DD-[issue].md` with reproduction + cause + suggested fix.
5. Appends to `LEARNINGS.md` with a one-line "error → cause → fix" entry.
6. If fix is trivial: applies it. If non-trivial: routes to Builder with a pointer to the debug report.
**Out of scope:** implementing big features, writing PRDs.

### 1.6 Reviewer

**Model:** Opus
**Role:** The PR-review adversary. Questions decisions, flags missed cases, second-guesses the approach.
**Fires when:** Auditor passes on a feature, before merge.
**Process:**
1. Reads the full diff (not just changed lines — context around them).
2. Reads the PRD section + ADR.
3. Questions: "why this approach and not X? What about Y edge case? This name is ambiguous. This component is too coupled. This deserves a test we don't have."
4. Writes review comments as inline notes in the diff + a summary at the PR level.
5. If anything is blocking: routes back to Builder.
**Out of scope:** running tooling (Auditor does that), writing the fix.

### 1.7 Commit

**Model:** Haiku
**Role:** Good commit messages, every time.
**Fires when:** user runs `/commit` or a commit is about to happen.
**Process:**
1. Reads the staged diff.
2. Categorizes change type (feat / fix / refactor / docs / style / test / chore).
3. Identifies scope (component/file/hook name).
4. Writes conventional message. Present-tense imperative. Body only if non-obvious.
5. Runs pre-commit hooks, waits for pass.
6. Creates the commit.
**Out of scope:** changing the diff, splitting commits (user's call), bypassing hooks.

---

## 2 — Optional extensions (install per project)

Five optional agents. Shipped as disabled templates in `.claude/agents/_optional/`; user enables by moving into `.claude/agents/`.

### 2.1 Designer (DS/Figma projects)

**Model:** Opus
**Role:** Read Figma files via MCP, produce Design Manifests + component specs.
**Enable when:** the project uses Figma for design handoff, or is a DS project.
**Out of scope:** implementation (that's Builder).

### 2.2 Researcher

**Model:** Opus
**Role:** Targeted web research with source verification. Produces knowledge entries.
**Enable when:** project has a research-heavy phase or keeps needing context from docs/papers.
**Out of scope:** writing code, drafting PRDs from scratch.

### 2.3 DBA

**Model:** Opus
**Role:** Schema design, migration safety, query performance review.
**Enable when:** the project has a non-trivial database.
**Out of scope:** application-level logic.

### 2.4 Security

**Model:** Opus
**Role:** Deep security audit, threat modeling, pentest-style checks.
**Enable when:** the project handles PII, auth, payments, or user-uploaded content.
**Out of scope:** everyday code review (Auditor handles the basics).

### 2.5 Release Manager

**Model:** Sonnet
**Role:** Generate changelogs, bump versions, write release notes, cut tags.
**Enable when:** the project ships versioned releases to users.
**Out of scope:** writing features or fixes.

---

## 3 — Coordination rules (the three that matter)

### 3.1 Single director per task
The user (or the automation in scheduled tasks) is the only thing that calls an agent directly. Agents don't spawn other agents autonomously — each handoff is an explicit user action ("now run the Builder"). This prevents runaway cost and keeps the sequence reviewable.

### 3.2 Handoff via artifacts, not conversations
- Planner writes `PRD.md`
- Architect writes `ADR-NNN.md`
- Builder writes code + tests + appends to `PROGRESS.md`
- Auditor writes `audits/*.md`
- Debugger writes `debug-reports/*.md` + appends to `LEARNINGS.md`
- Reviewer writes review comments (GitHub PR if public; inline markdown if local)
- Commit writes the commit message + creates the commit

Each next agent reads the artifact from the previous one. Nobody reads each other's chat history. This makes the trail reviewable months later (ties into the memory stack).

### 3.3 Out-of-scope list in every agent
Every agent prompt ends with "This agent does NOT do X, Y, Z — route those to [other agent]." Prevents turf overlap, which is the single biggest source of wasted tokens in multi-agent setups. When a user accidentally asks the Builder to write a PRD, Builder refuses and routes to Planner — not by being rude, just by being clear about role.

---

## 4 — The PRD enforcement gate (the anti-slop core)

This is the one rule that does the most work.

```
Builder agent:

Before writing any production code (anything in src/ that ships):

1. Search docs/PRD.md for a section matching the current task's name or
   description.
2. If no matching section exists → STOP. Response: "I don't see a PRD
   section for [task]. Options: (a) run /planner first, (b) use /skip-prd
   if this is a typo / README fix / 1-line bug."
3. If a matching PRD section exists but contains any [TBD], [DECIDE], or
   [TODO] placeholders → STOP. Response: "The PRD has open decisions
   (list them). Resolve those first, or run /architect if they're
   architectural."
4. If an ADR is referenced but doesn't exist → STOP. Response:
   "Architect flagged this as needing an ADR (ADR-NNN-[topic].md) but I
   don't see one. Run /architect first."
5. Only after all three checks pass, proceed to implementation.
```

The `/skip-prd` override is the escape hatch. It's important:
- Without it, the system is tyrannical and you'll bypass it by switching agents.
- With it, skipping is a conscious act that leaves a trace in the session log — making the pattern visible and easy to catch if it's overused.

---

## 5 — Model choice rationale

- **Opus** for agents that question, plan, review. Expensive but the judgment is where money is worth spending. (Planner, Architect, Auditor, Reviewer, plus optional Designer / Researcher / DBA / Security.)
- **Sonnet** for agents that execute a well-defined task. (Builder, Debugger, optional Release Manager.)
- **Haiku** for one-shot transformations. (Commit. Cheap and fast; the context is small.)

This is an opinionated default. Individual agents can override in their frontmatter if a project wants different tradeoffs.

---

## 6 — How agents tie into the memory stack

Every agent's output ends up somewhere durable:

- PRD sections, ADRs, audits, debug reports → committed markdown files
- Short summaries → `PROGRESS.md` (Builder appends) and `LEARNINGS.md` (Debugger + Auditor append)
- Session-level takeaways → `.auto-memory/` (via the `wrap-up` skill, not the agents directly)
- Commit messages → git history
- Conversation logs → `knowledge/conversation-log/` (written by the `wrap-up` skill at session end)

Between these six surfaces, any past decision can be rediscovered. No agent's work vanishes at session end.
