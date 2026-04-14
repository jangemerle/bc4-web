# 18 Claude Code Token Hacks in 18 Minutes

**Source:** YouTube — "18 Claude Code Token Hacks in 18 Minutes"
**Date:** 2026-04-07
**Added:** 2026-04-07
**Category:** engineering-workflows

---

## The Token Math You Need to Know

Tokens compound exponentially. Message 30 in a session consumes ~31x the tokens of message 1 because the model must reprocess everything that came before it. A session that starts at 200 tokens per message can cost 6,000+ tokens by message 30. **This means short, focused sessions are always cheaper than long, bloated ones.**

## Tier 1: Immediate Wins (Do These Every Session)

**Fresh conversations over continuation.** Start a new session instead of extending a multi-hour session. The context penalty outweighs the loss of continuity.

**Disconnect unused MCPs.** Each active MCP adds ~18K tokens to every message, whether you use it or not. If you're not using the GitHub MCP or Figma MCP in this session, disconnect it. Reconnect only when needed.

**Batch prompts.** Instead of five separate requests ("make this button," "style the form," "add dark mode," "fix accessibility," "write tests"), write one comprehensive prompt covering all five. Batching reduces token overhead from repeated context setup.

**Plan Mode.** Use Shift+Tab to think before writing code. Plan Mode costs less upfront and prevents expensive iteration later. A 5-minute plan saves 10 iterations.

**/context visibility.** Know your context usage at all times. Check before each big request. If you're above 70%, save work and start a new session.

## Tier 2: Architecture Discipline

**Keep CLAUDE.md under 200 lines.** Your project guidelines file should be a lean index, not the full documentation. Link to `docs/SYSTEM.md` instead of embedding it. Every line in CLAUDE.md is context cost in every message. Make it a pointer, not a dump.

**Compact at 60%, not 95%.** When you compact/summarize a session, aim for 60% reduction (big ideas + key decisions), not 95% (everything). Heavy compression loses nuance that becomes context debt later. Better to sacrifice some detail upfront than create ambiguous context that requires re-explaining.

**Modular sessions by feature.** Instead of one session that touches ten files, spawn separate sessions for separate features. A session owns *one* feature start-to-finish. This prevents context drift and keeps token math predictable.

## Tier 3: Economic Delegation

**Use cheaper sub-agents.** For proof-of-concept, refactoring, or testing, delegate to Haiku (cheaper, faster). Use Opus only for strategic decisions (architecture, spec writing, complex design work). Sonnet for implementation. This tiering can reduce token spend by 60%.

**Off-peak hours.** Batch heavy processing (image optimization, video transcoding, multi-agent runs) for off-peak hours when token rates may vary or when you're not under deadline pressure. Plan ahead instead of reactive Claude Code usage.

**Embed architectural decisions in CLAUDE.md.** When you make a critical decision (use Tailwind, not CSS modules; motion via springs, not tweens; this component is modal-only), write it into CLAUDE.md. Future sessions inherit this decision — they don't need to re-debate or re-document it. This saves context cost AND prevents consistency drift.

## Relevance to Kvalt

Kvalt's philosophy of "encode decisions upfront" directly reduces token cost. By documenting motion rules, color variables, and component APIs in tokens and specs, Kvalt reduces the need for context-heavy back-and-forth. A Claude Code session with Kvalt integrated needs far less explanation because Kvalt *is* the embedded architectural decision. The framework validates Kvalt's lean-index approach to documentation.
