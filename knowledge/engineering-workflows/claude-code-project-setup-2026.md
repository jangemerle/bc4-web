# How You Need To Start Every Coding Project (Claude Code setup)

**Source:** [AI LABS — This Is How You Need To Start Every Coding Project](https://youtu.be/ywIhw15za9Y)
**Duration:** ~12 min walkthrough
**Date added:** 2026-04-14

## What it is

End-to-end pre-build setup for Claude Code projects. The argument: 60 years of software process wasn't about humans, it was about structure — and now agents need the same structure to produce reliable work. The sequence: (1) plan with a dedicated planner agent, not Claude's plan mode — planner asks iterative questions and emits a PRD document to the project folder, with phased implementation and key decisions captured; (2) write `claude.md` by hand (never `init`), link the PRD, add only what the agent doesn't already know — conventions, rules, style. Keep it lean, update it incrementally; (3) configure skills, sub-agents, and MCPs *before* coding starts — planner, commit, refactoring, verification (Playwright), plus MCPs for Supabase/shadcn/Playwright; (4) path-specific rules live in separate files linked from `claude.md` rather than bloating it; (5) add explicit negative constraints ("don't use purple/blue default", "don't create X") — agents are biased toward action and positive specs leave gaps; (6) maintain a `progress.md` and a `learnings.md` the agent updates continuously — progress prevents re-reading the whole codebase, learnings prevent repeating errors; (7) write tests *from the PRD*, not from the implementation — otherwise the agent optimizes tests to pass the code it wrote; (8) track issues from day one via GitHub (technical) or Notion/Trello MCP (non-technical teammates); (9) plan for load — tell the agent the expected concurrent user count and use plan mode to map K6 stress tests.

## Key takeaways

- **Hand-write `claude.md`**, don't `init` it. The generated version describes current state; you want to describe the rules and the gaps.
- **Negative constraints close the ambiguity that positive specs leave.** "Don't use the default purple/blue combo" > hoping it won't.
- **`progress.md` + `learnings.md`** as a persistent, agent-maintained ledger. Saves tokens and prevents repeat errors across sessions.
- **Tests derived from the PRD, not from the code.** Agents writing tests after implementation optimize toward the code that exists, not the spec that should be met.
- **Dedicated sub-agents for planning, commits, refactoring, verification.** Each gets its own context window and instruction set — prevents one bloated main agent from context-thrashing.
- **Load testing is a planning artifact, not an afterthought.** Tell Claude concurrent-user estimates upfront; use plan mode to pick a stress-testing tool (K6 was their pick for Next.js).

## Notable comments

- **1M-context workflow beats plan mode** — @oopsec (2 votes): "Going all the way from research to architecture design and keeping that all in context on the 1 million token model window, then just doing todo list to track progress and implementing direct from there. You can still compact around 400k tokens, but you don't reset context like normal plan mode." Worth testing against Kvalt's current Opus-plan-mode + manifest flow — the comment claims keeping everything hot in context produces better downstream builds than a cold plan handoff.
- **MCP context bloat is real and underdiscussed** — @alvaro1121 (2 votes): MCPs enable tools but can balloon context the same way a bad `claude.md` does. Matches Kvalt's existing note (`claude-code-token-hacks.md`) that disconnecting unused MCPs saves ~18k tokens/msg. Reinforces: only attach the MCPs you'll actually use for the current phase.

## Relevance to Kvalt

Most of this is already codified in Kvalt's setup (dedicated agents, path-specific rules, docs-driven, per-component specs), but three gaps are worth closing: (1) **`learnings.md` as a first-class artifact** — we have commit history and audit reports, but no single agent-written journal of "error → cause → fix" that survives across sessions. Add one at repo root and instruct the Builder/Debugger to append to it; the Auditor reviews it on every run. (2) **Negative constraints file** — `docs/conventions.md` is positive-leaning; a sibling `docs/anti-patterns.md` listing explicit prohibitions (no inline hex, no `whileTap`, no hardcoded durations, no new components without grill-component) would close the implicit-gap problem the video describes. Some of this lives in skill files but isn't consolidated. (3) **PRD-first test derivation** — TDD skill writes tests from the confirmed design summary, but worth making the connection explicit: tests derive from the grill-component output, not from the implementation. Also validates the existing Kvalt pattern of planner → specs → builder → auditor — same shape, different naming.
