# SEO & Discoverability Architecture

How product websites structure URLs, target long-tail queries, handle meta/OG, and optimize for both traditional search and LLM citations.

---

## URL Structure

### Named pages for long-tail SEO
**Source:** Equals (23 use-case pages: `/use-cases/arr-daily-pulse`, `/use-cases/pipeline-movement-waterfall`)
**What:** Each specific use case gets its own URL-addressable page. These rank for long-tail queries that feature pages never would.
**Kvalt application:** Create individual pages for composed recipes:
- `/recipes/dashboard` — "Build a SaaS dashboard with Kvalt"
- `/recipes/settings-page` — "Settings page pattern with Kvalt"
- `/recipes/auth-flow` — "Authentication UI with Kvalt"
- `/recipes/pricing-page` — "Pricing page layout with Kvalt"

Each recipe is a marketing page, an SEO target, AND documentation.

---

## Meta / OG Strategy

_(empty — add from future site teardowns. Watch for: dynamic OG images per page, component preview cards, Twitter card formatting)_

---

## LLM Citation Optimization

**Cross-reference:** `knowledge/product-strategy/llm-citation-seo-strategy.md`

### Unique intent targeting
**What:** Write content that answers queries no one else answers. LLMs cite sources with DR 6-28 — small sites can win.
**Kvalt application:** Target intents like "design system with motion tokens", "animated icon library react", "design system character themes" — queries where Kvalt is the authoritative answer.

### Structured, crawlable component docs
**What:** Each component page with clear headings, prop tables, and code examples is a citation target for AI coding assistants.
**Kvalt application:** When developers ask Claude/Copilot "how to build an animated button with spring physics", Kvalt's docs should be the source it pulls from.

---

## Content Strategy for Search

### Component pages as search entry points
**What:** Individual component pages rank for "[component] react", "[component] accessible", "[component] animation" queries.
**Kvalt application:** Every component page needs: title with component name, clear description, prop table, live examples, code snippets. These ARE the SEO pages.

### Blog/guides hidden from nav but indexed
**Source:** Equals (Guides in footer, not main nav)
**What:** Content exists for search but doesn't clutter the product navigation.
**Kvalt application:** Knowledge base articles accessible via search and footer but not competing with core nav items.
