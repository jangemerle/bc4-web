# A YC CEO's Claude Code Skill Library

**Source:** YouTube — "This Tech-CEO's Claude Code Toolkit Will Blow You Away"
**Date:** 2026-04-07
**Added:** 2026-04-07
**Category:** engineering-workflows

---

## The Five-Skill Foundation

A YC founder built a pre-development pipeline to catch problems before any code is written. Each skill enforces discipline at a specific stage.

**Office Hours Skill** — Takes a weak premise and applies pressure. The skill plays the role of skeptical advisor, asking: What's the actual wedge? Who's the first 10 customer? Why now? It catches ideas that sound good in a vacuum but collapse under scrutiny. This skill should execute first, before product thinking or engineering.

**CEO Review Skill** — Scans for hidden winners in what the team has built. It looks for features that are getting organic use despite not being marketed, underexploited patterns, and adjacent problems the product is solving that deserve expansion. Selective expansion (double down on winners) beats feature multiplication (ship everything).

**Design Consultation Skill** — Web research (what are competitors doing), visual reference gathering (Dribbble, awwwards), and strategic aesthetic choices (safe vs risky for this market). This skill doesn't design — it advises on positioning: "This market rewards premium materials aesthetic over playfulness."

**Engineering Review Skill** — Examines system architecture before implementation. It maps data flow, identifies state machines, explores failure modes, and flags scaling concerns. The phrase used: "What breaks if we have 100x the data?" This catches architectural debt before code compounds it. Implementation comes after architecture is sound.

**Document Release Skill** — Keeps PRD, architecture doc, and changelog in sync as the product evolves. Instead of documentation lagging three sprints behind, these docs are authored *during* development. The skill ensures that decisions are explained when they're made, not reconstructed later.

## The Pipeline Sequence

Idea → **Office Hours** (test premise) → **CEO Review** (find the wedge) → **Design Consultation** (aesthetic positioning) → **Engineering Review** (architecture validation) → **Build** → **Document Release** (decisions locked in writing).

This prevents the common trap: shipping a well-executed thing that nobody wanted, or building beautiful code around a bad architecture, or losing institutional knowledge because decisions were never written down.

## Relevance to Kvalt

Kvalt's multi-agent pipeline (Designer → Builder → Auditor) follows this same discipline. The Designer Agent is doing office hours + CEO review work (is this a real problem, what's the minimum design). The Builder Agent does engineering review (architecture before implementation). The Auditor does document release (confirming tokens, writing specs). The CEO's skill library validates that pre-build discipline pays more dividends than post-ship fixes.
