# I built an entire Content Team with Claude Code

**Source:** YouTube (Kieran Flanagan, Marketing Against the Grain)
**URL:** https://www.youtube.com/watch?v=kieran-flanagan-content-team
**Added:** 2026-03-18
**Type:** YouTube video (34 min, published Mar 17 2026, 2123 views)

---

## Who is Kieran Flanagan
Senior marketing strategist at HubSpot and content systems architect. Built an end-to-end AI content production pipeline using 11 interconnected Claude Code skills.

---

## Key Takeaways
### 1. Eleven-Skill Content Stack
Five layers: (1) Orchestrator Skill (conversational hub), (2) Audience Profile and Writing Style Cards, (3) Viral Talking Point Extractor, (4) Lookalike Content Skill (pattern extraction), (5) Post Enricher, (6) Platform-Specific Creation Skills (LinkedIn, Substack, X, YouTube coming), (7) Feedback Loop App.

### 2. Audience Profile Beyond ICP
Not demographics — behavioral linguistics. Vocabulary library (what they say and don't say), emotional register, validation hooks, content types they engage with. Separate profiles per platform. Built from Reddit, X, engagement data.

### 3. Platform-Specific Writing Styles
Scrape creator's top 50 posts per platform, extract voice and structural patterns. Store as reusable "style card." LinkedIn voice ≠ X voice ≠ Substack voice. Each skill uses its own card.

### 4. Lookalike Content Pattern Extraction
Feed 51 posts → extract winning patterns from top 30%. Output: content clusters, structural DNA, hook formulas, emotional playbook. Generate infinite new posts matching the winning formula. (Free download available.)

### 5. Post Enricher: Add Real Data
Takes draft → finds case studies, data points, stories, expert quotes. Makes content provable. Example: linked Bezos memo to AI marketing stacks. Transforms surface-level into credible.

### 6. Monthly Feedback Loop Improvement
Feedback Loop App captures all created content, ingests performance data, runs monthly review that actually updates and improves all upstream skills. Closes the loop — content quality increases over time.

### 7. Agentic Autonomy as Goal
"This is not software. There's no drag-and-drop workflow builder." The system creates content daily without intervention. 12 months of iteration to perfect audience profiling. APIs: X, Perplexity, Firecrawl, OpenAI.

---

## Relevance to Kvalt

- **Skill Composition Pattern:** Flanagan's orchestrator skill + downstream specialists mirrors ideal Kvalt architecture. An Orchestrator skill could manage figma-to-kvalt, page-gen, image-optimize skills, plus new ones (component-linter, token-validator, design-audit).

- **Audience Profiling as Component Design:** Just as Flanagan profiles users by platform, Kvalt could profile components by context (marketing, internal tools, mobile, dashboard). Each context gets its own design spec and implementation variant library.

- **Style Cards for Tone Consistency:** Kvalt's `docs/philosophy.md` (motion guidelines, tone of voice) is a "style card" for the entire system. Create component-specific style cards (Button has different tone than Error Message). Automate this via a skill.

- **Content Enrichment Pattern:** Kvalt documentation pages are thin without examples and code snippets. Build an Enricher skill that takes stub documentation → adds real usage examples from codebase, related components, token references, GitHub links. Closes the loop.

- **Monthly System Review:** Implement a Cowork task that runs monthly: scrapes GitHub issues labeled "docs-needed," checks which components lack examples, flags outdated screenshots in `docs/components/`, updates the knowledge base. Keeps documentation fresh like Flanagan's feedback loop.

- **Autonomous Daily Updates:** Once Kvalt's skill system stabilizes, use Cowork scheduling to auto-update `docs/SYSTEM.md`, component snapshots, and token listings from source files daily. No manual maintenance.

---

_Full transcript available (28317 chars). This digest captures the 11-skill stack, audience profiling depth, lookalike extraction, and autonomous improvement loop._
