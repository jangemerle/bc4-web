# GEO Audit Tool — Free Claude Code Project as Agency Lead Gen

**Source:** Zubair Trabzada / AI Workshop (YouTube)
**URL:** https://www.youtube.com/watch?v=46vC7-BwJ_o
**Published:** 2026-03-23
**Added:** 2026-03-25

---

## What is GEO?

Generative Engine Optimization — the successor to SEO. Instead of optimizing for Google's link-based results, GEO optimizes for AI-generated answers across ChatGPT, Perplexity, Google AI Overviews, Gemini, and Bing Copilot. Agencies currently charge $5–12K/month for this as a service. The market is projected to reach $7B in the next couple of years, with AI search traffic growing 500%+ year-over-year.

The core insight: when someone asks an AI for a recommendation in your industry, does your website show up? For most businesses, no — they're invisible to AI search.

## The Tool

A Claude Code project (open-source, 2,600 GitHub stars in a few weeks) that audits any website for AI visibility. One slash command (`/geo-audit`) triggers a multi-phase process:

1. **Phase 1 — Discovery:** Fetch homepage, detect business type
2. **Phase 2 — Parallel sub-agent analysis:** 5 specialized agents run simultaneously, each scoring a category 0–100:
   - AI citability analysis
   - Brand authority
   - Technical GEO infrastructure
   - Content quality
   - Schema markup
3. **Phase 3 — Aggregation:** Combine scores into overall GEO score, generate report

A second skill (`/geo-report-pdf`) converts the markdown report into a polished, client-ready PDF with score gauges, bar charts, platform-by-platform breakdowns, critical findings, and a prioritized action plan.

## Key Takeaways

### 1. The "Audit → Sell" GTM pattern
Pick 5 businesses → run the free audit → send the PDF cold → offer a call to fix findings. The PDF itself is the deliverable that agencies charge thousands for. Value-first outreach that costs nothing to produce.

### 2. Claude Code Skills as productized expertise
Skills = markdown instruction files that make Claude Code an "expert" on a specific domain. The GEO audit skill contains the full audit methodology (phases, sub-agent specs, scoring criteria). The insight: **domain expertise encoded as a skill IS the product.** The tool is free; the knowledge baked into the instructions is what makes it valuable.

### 3. Sub-agent orchestration pattern
The 5-agent parallel analysis is the key architectural choice. Analogy used: general contractor hiring subcontractors (electrician, concrete, HVAC). Each sub-agent gets specific instructions and produces an independent score. This makes the audit both faster and more thorough than serial processing.

### 4. Two-skill pipeline (audit → report)
Separation of concerns: one skill for the analysis (heavy, sub-agents, data collection), a second skill for presentation (PDF generation, visual formatting). Clean modular design that lets each evolve independently.

### 5. Distribution via GitHub + one-command install
The entire thing installs with a single terminal command that sets up all skills. Low friction → high adoption → GitHub stars → organic discovery. The community/course upsell is secondary to the free tool's virality.

## What the audit actually scores

Using Descript.com (58/100) and Typeform.com (62/100) as examples:

- **AI citability** — Can AI systems quote/cite your content blocks?
- **Brand authority** — Wikipedia presence, LinkedIn followers, G2 ratings, marketplace presence
- **Technical infrastructure** — Crawler access policies, `llms.txt` compliance, JavaScript rendering issues
- **Content quality** — Are key pages (especially pricing) accessible to AI crawlers?
- **Schema markup** — Software application, FAQ, person, offer schemas present?

Critical finding examples: "Pricing page invisible to AI crawlers — data rendered via JavaScript API calls, AI systems cannot answer 'how much does Typeform cost?'" and "llms.txt file non-compliant — exists but uses incorrect format."

## Monetization model

1. **Free tool** — GitHub repo, installs in one command, builds trust and stars
2. **Agency service** — Run audits for clients, charge for implementation of fixes
3. **Community/course** — Paid community teaching how to build and sell with Claude Code, live calls for troubleshooting

---

## Relevance to Kvalt

### The "audit then sell" pattern maps directly to characters
The GEO tool proves a powerful GTM template: **build a free diagnostic tool → generate a professional report → use it as cold outreach.** For Kvalt, the equivalent could be a "Design Character Audit" — a Claude Code skill that analyzes an existing app and shows how generic/characterless its design tokens are, then recommends which Kvalt character would best fit. Free audit → "here's what your app looks like with the Taut character applied" → sell the character or customization service.

### Skills as distribution channel — validated at scale
2,600 GitHub stars in weeks confirms that Claude Code skills are a legitimate distribution channel. Kvalt characters ARE Claude Code skills (each includes a `claude.md`). The install-via-one-command pattern is exactly what we planned for Phase 5 (distribution).

### Sub-agent orchestration is relevant for Phase 3+
The 5-parallel-agent pattern could apply to our character demo: one agent evaluating color contrast, another checking motion feel, another assessing typography rhythm, etc. Could make the character preview more impressive and thorough.

### Two-skill pipeline validates our audit → report approach
We already have `audit-tokens` and `check-tokens` skills. Adding a presentation layer (PDF report of token compliance) would mirror this proven pattern and could be a standalone product for design system teams.

### The market timing insight
GEO is brand new, just like AI-native design systems. Being early to an emerging category with a free, high-quality tool is the play. The $7B GEO market projection validates that "AI changes how X works" categories are where the growth is.
