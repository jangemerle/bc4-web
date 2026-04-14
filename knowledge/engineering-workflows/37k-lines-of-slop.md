# 37,000 Lines of Slop: The Case Against Unreviewed AI Code

**Source:** Syntax (YouTube) — "37,000 Lines of Slop"
**Date:** 2026-04-03
**Added:** 2026-04-04

## The GStack Incident

Gary Tan (CEO of Y Combinator) bragged about writing 37K lines of code/day across 5 projects using GStack (suite of markdown skills). A developer audited his blog — here's what production looked like:

- **28 test files shipped to every visitor** (300KB of test code in production bundle)
- **Rails hello world scaffolding controller** loaded in production
- **Uncompressed PNGs:** 2MB + 1.99MB images (every framework has image optimization)
- **520KB rich text editor (WYSIWYG)** — likely backend spillover into frontend
- **47 images with no alt tags**
- **Entire page content rendered twice in DOM** — once for mobile, once for desktop
- Still scored 80 on Lighthouse despite these horrors

## The "Does It Matter?" Answer

**Yes.** Emphatically.
- AI should enable doing things *better*, not shoveling slop
- "Make it good, no bugs, here's some skills" is NOT enough in April 2026
- GStack had QA skills — hilariously, no accessibility skill (hence 47 missing alt tags)
- "A better model will fix this" — talking about right now, not hypothetical futures

## Mario Zechner's Response (Pika creator)

- Mario built Pika (pi.dev) — "for my money the best AI harness out there"
- His post "Slowing Down" advocates:
  1. Let AI do the boring stuff that won't teach you anything new
  2. Evaluate what it produced, take what you want
  3. **Set self-limits** on how much code you let AI generate per day, in line with your ability to review
  4. Finalize implementation either with an AI agent or yourself

## Tools Mentioned for Fighting Slop

- **Deterministic analysis tools** that scan for: dead code, duplicate lines, complexity hotspots
- "AI will solve a problem locally 100 times before it considers solving it globally, despite you begging it to do the opposite"

## Relevance to Kvalt

- **Faces prevent design slop:** What GStack is to code (markdown skills trying to enforce quality), faces are to design — but faces are *deterministic*, not probabilistic. A face doesn't "try to make it look good," it defines exactly what good looks like.
- **check-tokens is the anti-slop tool for design:** Catches hardcoded values, wrong tokens, off-grid spacing. The design equivalent of scanning for dead code and duplicates.
- **"No accessibility skill" is damning:** Validates that Kvalt must bake accessibility into every component by default, not as an optional skill. Our components already do this (ARIA, keyboard support, contrast).
- **The self-limit principle:** Interesting product idea — could faces include complexity budgets? "This face generates max N components per page" to prevent AI from over-generating.
- **Mario Zechner / Pika:** Worth watching as a potential peer/collaborator. His philosophy aligns with Kvalt's — structured, opinionated, quality over quantity.
- **Marketing gold:** "37K lines of slop" is the perfect villain for Kvalt's positioning. We're the opposite — precision over volume, defined over vibed.
