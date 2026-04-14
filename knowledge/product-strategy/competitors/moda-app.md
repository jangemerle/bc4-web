# Moda

**URL:** https://moda.app
**Category:** Inspiration (AI-native design tool, different space but relevant architecture)
**Added:** 2026-03-25

---

## What it is
AI-native design platform — "design agent" for non-designers. Generates presentations, social media posts, marketing materials, charts on a fully editable 2D vector canvas. Launched March 2026. Just raised $7.5M seed.

## Pricing
- Free: 1,000 AI credits/month
- Pro: $30/month (6,000 credits)
- Ultra: $100/month (20,000 credits)

## Why it's interesting for Kvalt

### Technical architecture (worth studying)
- Multi-agent system on LangChain's Deep Agents
- Three agents: Design Agent, Research Agent, Brand Kit Agent
- **Custom DSL instead of raw XML/coordinates** — gives LLMs better layout abstractions (similar to how Kvalt's tokens give AI better design abstractions)
- Skill-based system using markdown documents with design best practices
- Dynamic tool loading (12-15 core + ~30 on-demand)
- Prompt caching for cost/latency optimization

### Brand Kit Agent
- Ingests company branding (websites, brand books, color palettes, typography)
- Generates on-brand designs automatically
- This is conceptually what Kvalt faces do for code: enforce a design personality through configuration

## Relevance to Kvalt
1. **Architecture inspiration** — their skill-based markdown system parallels Kvalt's CLAUDE.md approach
2. **Brand Kit Agent concept** — validates the idea of feeding design personality to AI and having it enforce consistency
3. **Different market** — Moda targets non-designers making marketing assets. Kvalt targets developers making product UIs. No overlap.
4. **Validates the "AI needs design opinions" thesis** — Moda's whole product is about giving AI design taste. Same fundamental problem Kvalt solves, different domain.
