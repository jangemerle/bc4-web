# I Built a Claude Skill That Plans High-Converting Klaviyo Campaigns for Shopify Brands

**Source:** Elliot Kovac (YouTube)
**URL:** https://www.youtube.com/watch?v=0kao3pyG88Q
**Added:** 2026-03-18
**Type:** YouTube video (~7 min, published Mar 17, 2026)

---

## Who is Elliot Kovac

Founder of Dispatch (email marketing agency — 2 billion emails sent, $50M+ revenue generated) and Eltie AI (AI-powered Klaviyo + Shopify campaign creation tool). The Claude Skill he demo'd went viral on LinkedIn — close to 1,300 comments in a couple of days. His angle: domain expertise encoded into a structured AI tool, not generic AI assistance.

---

## Key Takeaways

### 1. The Skill's eight-part workflow

The campaign calendar Skill runs a structured eight-step process:

1. **Input gathering** — Month/year, email volume, SMS volume, planned promotions, product launches, brand events, industry, target customer demographics. Strongly recommended: past Klaviyo campaign performance data and Shopify ABC product analysis.

2. **Performance + inventory analysis** — Core philosophy: double down on what's working, cut what's not, consistently test 1–2 new angles each month (same mindset as testing creative angles in Meta ads). The ABC product analysis from Shopify prioritizes which products to feature based on inventory levels and sales velocity.

3. **Cultural moments research** — The Skill searches holidays and cultural events for the target month, filtered by brand relevance. "Campaign calendar building 101" but automated.

4. **Decision tree calendar anchoring** — Different frameworks fire based on inputs: promotion decision tree, launch decision tree, SMS decision tree. Also handles smart send logic (when to use it, when not to).

5. **Angle audit** — Based on past performance data: which angles to double down on, keep, optimize, or cut. Plus identifying 1–2 new angles to test.

6. **Product assignment** — Methodical product selection instead of gut feel. Example: a pink product for Valentine's Day won't sell if it has no organic demand. Evergreen campaigns feature products with natural sales velocity. B/C-grade products get promotional strategies (24-hour flash sales, bundles) to move inventory.

7. **Tag assignment** — Proper Klaviyo tagging for analysis: benchmarking specific campaign types (evergreen vs. promo), tracking what's working over time.

8. **Segmentation recommendations** — General frameworks for top-performing segments matched to specific campaign types.

### 2. The output structure

A structured campaign calendar with: campaign names, suggested Klaviyo tags, segmentation recommendations, smart send on/off, and detailed strategy/messaging breakdowns including CTA link guidance. Designed as a creative brief that can be handed directly to a copywriter or designer. If you request 20 campaigns, it generates 20 plus bonus suggestions.

### 3. The key insight: ABC product analysis drives campaign strategy

Most brands pick products for campaigns based on vibes ("it's Valentine's Day, promote the pink one"). Kovac's framework: A-grade products (high velocity, organic demand) go in evergreen campaigns. B/C-grade products (low velocity, stagnant inventory) need promotional structures to convert — flash sales, bundles, urgency mechanics. This product-strategy-first approach is what differentiates a revenue-generating calendar from a content calendar.

### 4. Eltie AI — the execution layer

After the Skill generates the campaign strategy, Eltie AI (his SaaS product) handles execution: it integrates directly with Shopify and Klaviyo, learns from ongoing campaign performance, generates copy and design using actual product photography from Shopify, and exports campaigns directly to Klaviyo with one click. The Skill plans; Eltie builds and deploys.

### 5. The composability pattern

The Claude Skill does one job: plan campaigns. It doesn't write copy, design emails, or send anything. The output is a structured brief that feeds into the next tool (Eltie, a copywriter, a designer). This narrow-Skill-plus-handoff architecture is intentional — each piece does one job well.

### 6. Domain expertise as the moat

The Skill isn't a generic "write me a marketing email" prompt. It encodes Dispatch's specific frameworks built from sending 2 billion emails: when to use smart send, how to audit angles, how to match products to campaign types, how to structure tags for analysis. The expertise is in the decision trees, not the AI.

---

## Relevance to Kvalt

**Skill architecture as a pattern:** The eight-step structured workflow with decision trees is a model for how Kvalt Skills should work. Each step has a clear input, a specific job, and passes output to the next. Compare to `.skills/figma-to-kvalt/` — it should follow the same pattern: read Figma → identify tokens → map to Kvalt classes → generate code.

**Domain expertise encoded in Skills:** Kovac's moat is his agency's frameworks, not the AI. Same principle for Kvalt: the value of `.skills/kvalt-page-gen/` isn't that it uses AI, it's that it encodes our specific page structure recipes, layout component APIs, and documentation patterns. The expertise is what makes the Skill valuable.

**ABC analysis as a prioritization framework:** The concept of ranking items by performance (A = high performing, invest more; B = moderate, optimize; C = low performing, either fix or cut) could apply to Kvalt's own component library — which components get the most usage? Which need rework? Which should be deprecated?

**Composable tools vs. monolithic workflows:** The Skill + Eltie separation — planning as a Claude Skill, execution as a dedicated tool — validates Kvalt's approach of keeping Skills narrow. A "generate component documentation" Skill should produce a structured markdown brief, not try to also publish it and update the index.

**Viral potential of specialized Skills:** 1,300 LinkedIn comments in two days for a niche email marketing Skill. If Kvalt built and shared a public "audit your design system tokens" Skill, it could serve as both a marketing tool and a product demonstration.

---

_Full transcript available (9,878 chars). This digest captures the complete eight-step workflow and the product-strategy framework behind it._
