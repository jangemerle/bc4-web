# Paperclip: AI Agent Teams as Software Companies

**Source:** Leon van Zyl (YouTube) — "Claude Code + Paperclip = AI Dev Team"
**Date:** 2026-04-03
**Added:** 2026-04-04

## What Paperclip Is

- **Not an AI agent itself** — a framework/harness for building agent teams
- Went viral: 41K GitHub stars in weeks
- Works with: Claude Code, Open Claude, Codex, Cursor, Bash, HTTP
- Deploy on VPS for 24/7 operation (or run locally)

## Team Structure

```
Board (You) → CEO Agent → Team Leads → Individual Agents
```

- Each agent has unique skills, prompts, rules, and model configuration
- Roles: CTO, engineering lead, front-end dev, back-end dev, security specialist, QA, DevOps, marketing lead, SEO specialist, copywriter
- Team leads delegate to their team members and handle QC
- Issue-based: create tickets, assign to CEO, watch it cascade down

## Key Differentiator from Sub-Agents

| Claude Code Sub-Agents | Paperclip |
|---|---|
| You're actively prompting Claude | CEO agent handles delegation |
| Single session, you manage | Autonomous, runs on autopilot |
| Ad-hoc parallelism | Structured org chart with roles |
| Session-bound | Persistent (24/7 on VPS) |

## Workflow

1. Create issue/ticket with instructions
2. CEO picks it up, delegates to relevant team
3. Team leads break down work, assign to specialists
4. Agents commit/push to GitHub repo
5. PRs created, follows real SDLC
6. Can integrate with email inbox for customer-facing automation

## Relevance to Kvalt

- **Validates the multi-agent pattern at scale:** Kvalt's 4-agent pipeline (Designer→Builder→Auditor→Debugger) is a focused version of this. Paperclip proves the organizational model works.
- **CEO = Director pattern:** The "agentic engineering" concept from Karpathy — you define vision, CEO translates to actionable tasks. Same as our spec-driven workflow.
- **Potential integration:** Could Kvalt faces + skills be distributed as Paperclip agent configurations? A "Kvalt design team" preset where the design agent already knows the token system.
- **Issue-driven workflow:** Could adopt this pattern — create issues for component builds, let the pipeline pick them up. Currently we manually orchestrate.
- **41K stars in weeks:** Confirms appetite for multi-agent dev tooling. Marketing signal.
