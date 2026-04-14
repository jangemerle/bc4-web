# Claude Code's Creator: Daily Skills & Internal Tools

**Source:** AI LABS (YouTube) — "Claude Code's Creator Uses These Claude Skills Every Single Day"
**Date:** 2026-04-03
**Added:** 2026-04-04

## Skills & Tools Revealed

### 1. Front-End Designs Plugin (public)
- Available in official Claude Code plugin marketplace
- Converts designs using simple prompts while enhancing UI/UX
- **Purpose:** Avoid "general AI aesthetics" — the default designs models converge toward
- Install via `plugins add marketplace`

### 2. Batch Skill (built-in)
- Automates parallelizable tasks (library migrations, bulk operations)
- **Key difference from normal sub-agents:** Uses separate work trees (isolated repo copies)
- Flow: plan mode → break into units → spawn N agents in N work trees → merge back
- Each agent gets dedicated prompt + isolated environment, preventing interference
- Can manage PRs if remote is configured

### 3. Code Simplifier Plugin (public) + Simplify Skill (built-in)
- Plugin: single agent, removes duplicates and unnecessary files
- **Simplify** (product feature): spawns 3 agents, evaluates across multiple metrics
- Simplify is the more thorough version; both heavily used by the team

### 4. Verify Skill (internal, not public)
- Hidden behind CLI flag, only for Anthropic team members
- Runs the app, tests changes from different angles, auto-fixes failures
- System prompt injected via environment, not in source code
- Project-specific by nature — you need to build your own version
- Uses Playwright MCP, linters, npm test, exit codes
- **Should be configured with test cases + visual verification**

### 5. Skillify Skill (internal, not public)
- Records a brainstorming session and turns it into a reusable skill
- Identifies: repeatable processes, tools/permissions needed, agents involved
- Interacts with user to clarify intentions, generates complete skill.md
- System prompt IS in the source code (unlike Verify)
- **You can build your own using the source as a guide**

## Relevance to Kvalt

- **Batch skill validates multi-agent pipeline:** Kvalt's Designer→Builder→Auditor pattern is the same idea — isolated work trees, parallel execution, merge back. We're already doing this.
- **Verify = our check-tokens + playwright-test combined:** We should formalize a `/verify` skill that chains: build → check-tokens → playwright visual regression → report. Currently these are separate steps.
- **Skillify = what we already do manually:** The grill-component → spec → skill pattern. Could automate: after a successful component build, auto-generate a skill from the session.
- **"General AI aesthetics" problem is exactly what faces solve:** The front-end designs plugin tries to avoid default AI output. Faces go further — they define the exact aesthetic, not just "avoid the default."
- **Work tree isolation is critical:** Confirms our Builder agent approach of using worktree isolation is the right pattern.
