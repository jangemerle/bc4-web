# Claude Usage Limits & Session Optimization

**Source:** Eliot Prince, YouTube
**Date:** 2026-04-07
**Category:** Engineering Workflows

---

## Overview

Claude recently adjusted session limits during peak hours (1–7 PM GMT / 5 AM–7 PM Pacific) to manage growing demand. While weekly usage limits remain unchanged, tokens now progress faster through your 5-hour rolling session window during peak times—similar to surge pricing on public transport. This creates urgency around optimization: understanding the difference between session limits and context limits, strategically disabling expensive tools, batching requests, and scheduling heavy work off-peak can nearly double your effective session capacity.

## Core Concepts

**Session Usage Limits** are the 5-hour rolling window that resets every time you send your first message in a conversation. Once you exhaust this allocation, you must wait for the window to expire or pay extra usage credits to continue. Peak hours tighten this limit, making tokens stretch less far.

**Context Length Limits** are separate: most plans include 200,000 tokens per chat (sometimes 1 million on higher tiers). Every message, response, file attachment, tool activation, MCP connector, and custom instruction consumes tokens from this window. Context cannot be recovered mid-chat; once exhausted, Claude falls back on compressed memory that loses detail.

**Tokens as Currency.** One token roughly equals 0.75–1 word. Every action has a token cost: model selection (Opus costs 5x more than Sonnet), extended thinking (significant overhead), tool loading (MCPs and connectors consume 45,000+ tokens even if unused), and document processing (PDFs are extremely heavy, often consuming 80% of a session alone).

## The Hidden Cost Problem

Running the `/context` command reveals what's silently burning your allocation. Most users are shocked to discover:

- System prompts and custom instructions: 20,000+ tokens just loading
- MCP connectors (Google Drive, Notion, Firecrawl, Gmail, Chrome): 45,000+ tokens combined, even if disabled
- Extended thinking: enabled by default on some accounts, burning tokens on every message
- Unused skills and tools: loading descriptions and metadata continuously

These costs accumulate before you write a single character of actual work.

## 14 Core Optimization Strategies

### Tier 1: Immediate Settings Changes

**Switch to Sonnet as your default.** Opus burns 5x more tokens; Haiku is cheapest but often inefficient for complex tasks (requires many round trips). Sonnet usually offers the best efficiency-for-quality tradeoff on everyday work. Reserve Opus for genuinely compute-intensive reasoning tasks.

**Toggle extended thinking off.** When enabled, it triggers extra reasoning steps and longer outputs—a massive token drain. Use it only on specific tasks that justify the cost.

**Run `/context` diagnostics.** Identify which tools, MCPs, and system prompts are consuming allocation. The top offenders usually are: system prompts, Apify connector, and duplicate browser tools. Disable what you don't actively use.

### Tier 2: Conversation Habits

**One task per chat.** Each message adds context overhead to all subsequent messages in that thread. A 30-message conversation accumulates bloat; its token cost per message grows exponentially. Starting fresh chats per task keeps overhead minimal. This is especially critical when jumping between different contexts (spreadsheet analysis, then marketing copy—these shouldn't share a chat).

**Be specific in prompts from the start.** Vague prompts like "summarize this PDF" force Claude to process the entire document even if you only need financial risks from section three. Specific prompts eliminate wasted computation: "Extract financial risks from section three" consumes far fewer tokens and returns better results.

**Batch requests into single prompts.** Instead of three sequential prompts ("Fix typo in paragraph 2," "Shorten the intro," "Add a CTA"), send one: "Fix the typo in paragraph 2, shorten the intro sentence, and add a CTA." Each additional prompt reloads all system context. Batching cuts that overhead in half.

**Disable idle tools and duplicate MCPs.** Audit your enabled integrations. If you have both a custom Chrome MCP and Claude in Chrome, disable one. Remove connectors you don't use regularly. Each disabled tool reduces token loading on every message.

### Tier 3: Workspace Architecture

**Convert PDFs to markdown before processing.** PDFs are token-expensive: they include images, formatting, layout metadata. Use Perplexity, a dedicated PDF-to-markdown tool, or a lightweight Claude chat to extract clean markdown from PDFs before ingesting them into Cowork or a project. This alone can reduce token burn by up to 80% on document-heavy sessions.

**Use Claude Projects with RAG retrieval.** Projects employ retrieval-augmented generation: they pull only relevant content into context rather than loading entire files at once. Store cleaned markdown files in projects instead of raw PDFs. Write concise project instructions (under 500 words) and rely on project memory to persist context across sessions—this eliminates re-explaining.

**Trim custom instructions to under 500 words.** Long custom instructions (thousands of words) reload with every message. Ruthlessly distill them to essential rules only. The less text Claude processes per message, the fewer tokens burned.

**Keep projects clean.** Remove idle files and out-of-date documents. While Claude may not actively scan every file, clutter forces it to filter through noise and can accidentally trigger processing on irrelevant content.

**Build Claude skills for repeatable workflows.** Skills encode step-by-step processes so you don't re-explain or re-figure methodology each time. Only the skill description loads into context by default; full skill content loads on-demand. This eliminates repeated context negotiation while keeping overhead minimal. Examples: invoice generation, report templates, writing style guides, specific output formats.

### Tier 4: Scheduling & Session Tactics

**Schedule heavy work outside peak hours.** Tokens don't stretch as far during peak hours (1–7 PM GMT especially; 5 AM–7 PM Pacific in the US). If possible, schedule Cowork agent runs, heavy document processing, and multi-agent pipelines for early mornings or evenings when demand is lower.

**Use the session reset trick to double capacity.** Your 5-hour window starts when you send your first message, not when you log in. Send a throwaway prompt hours before you plan to work (e.g., 9 AM if you plan to work at 11 AM). This begins your window early. Later, when you launch real work, you've nearly refreshed your allocation. You can effectively use 8–10 hours of capacity in one logical sitting by straddling two session windows.

## Relevance to Kvalt

Kvalt's multi-agent design-to-code pipeline (Designer → Builder → Auditor → Debugger) and comprehensive documentation dependencies directly intersect with Claude usage optimization:

**Multi-agent pipeline scaling.** Running multiple specialized agents in parallel (Designer reads Figma, Builder implements, Auditor checks tokens/a11y) can rapidly exhaust session budgets. Disabling unused MCPs, consolidating tool sets, and batching Figma-to-code operations into tightly scoped prompts preserves capacity for parallel runs.

**Large design file processing.** Kvalt regularly ingests Figma component trees, design specs (`specs/`), and token definitions. Converting heavy Figma exports or design documentation to markdown before feeding them into Cowork agents (or storing them as markdown in Claude Projects) reduces token burn significantly. Using Projects with RAG ensures only relevant documentation loads per task.

**Custom instructions & guidelines overhead.** Kvalt's mandatory pre-flight checklist (`docs/conventions.md`, `docs/philosophy.md`) and design-to-code workflows are essential but token-heavy. Encoding complex workflows as reusable Claude skills (grill-component → write spec → tdd-component → check-tokens) eliminates repeated context negotiation and keeps custom instructions lean.

**Skill-based design automation.** Kvalt's `.skills/` folder (figma-to-kvalt, tdd-component, check-tokens, playwright-test, pencil, recraft, ffmpeg) should be formally converted to Claude skills rather than embedded in system instructions. This ensures they load only when invoked, freeing token capacity for actual implementation work.

**Off-peak agent scheduling.** Designer agents pulling full Figma component trees and Auditor runs scanning entire component suites consume heavy tokens. Scheduling these via Claude's scheduled task feature for off-peak hours (early morning in US/UK zones) maximizes efficiency during production code phases.

**Context window lifecycle per phase.** Breaking the design-to-code pipeline into separate chats (Designer in one session, Builder in another, Auditor in a third) prevents context bloat. Each agent's work stays focused and token-efficient, and failures in one phase don't pollute context for downstream phases. This aligns with Kvalt's multi-agent philosophy: specialized agent, specialized context.

**Session reset for long build sprints.** When tackling large component systems or documentation overhauls that require 8+ hours of Cowork capacity, the session reset trick allows one logical work session to span multiple token allocations without manual intervention—critical for Kvalt's comprehensive builds.
