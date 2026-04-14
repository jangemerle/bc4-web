# 9 Hacks to Use Claude Code Better Than 90% of People

**Source:** YouTube — "9 Hacks to Use Claude Code Better Than 90% of People"
**Date:** 2026-04-07
**Added:** 2026-04-07
**Category:** engineering-workflows

---

## The Token Multiplier Layer

**CLI > MCP.** The CLI (Command Line Interface) consumes fewer tokens than MCP (Model Context Protocol) for the same request. If you need git operations, file operations, or shell commands, use the CLI directly. MCPs add context overhead. Most efficient teams use Claude Code's built-in CLI first, external MCPs only when necessary.

**/btw for free sidebar chats.** Type `/btw` to open a free sidebar conversation. These chats don't consume token budget against your primary workspace. Use sidebars for brainstorming, quick questions, and iteration feedback while keeping your main session's context lean.

**Hooks for completion sounds.** Configure bash hooks or system notifications to alert you when Claude Code finishes. This prevents context switching (you're not watching the terminal, you're working elsewhere) and reclaims attention only when there's something to review.

## The Context Architecture Layer

**Clear context at 20–25%.** Your session context should stay at most 20–25% full when working. If you're at 75%+ context usage, you're at risk of hitting the limit mid-session. Periodically save progress, summarize insights, and clear the session. A fresh session with explicit context setup is cheaper than a bloated session near limits.

**Status line customization.** Configure VS Code or your editor to show token usage, current directory, and git branch. This gives you real-time awareness of context consumption. You can't optimize what you don't measure.

**Skill-creator for testing.** When building a new reusable skill, test it in skill-creator first (small, isolated prompt space) before adding it to your permanent library. This prevents shipping half-baked skills that consume context every session.

## The Strategic Layer

**Agent teams.** Spawn multiple agents in parallel for independent tasks (one agent redesigns a page, another audits components, a third optimizes images). Agent teams finish work 3–5x faster than sequential single-agent work because they work in parallel on different aspects of the same codebase.

**Open-ended questions in Plan Mode.** Instead of "build this feature," ask "What are we not thinking about? Where's the risk? What could go wrong?" Plan Mode with explorative questions catches blind spots before implementation starts.

**Obsidian as second brain.** Keep a private Obsidian vault (or equivalent) to log insights, design decisions, and patterns you discover. Link back to code. When you join a new project, your vault is the most valuable asset you own — it's the distilled knowledge from every project, searchable and reusable.

## Relevance to Kvalt

These hacks are organizational discipline applied to Claude Code. Kvalt's philosophy of "fewer opinions, better documented" directly enables #1–3 (clear context, lean CLAUDE.md, explicit status). The multi-agent pattern validates Kvalt's Designer→Builder→Auditor architecture. The emphasis on open-ended questioning in Plan Mode aligns with how Kvalt forces upfront design discipline instead of accidental architecture.
