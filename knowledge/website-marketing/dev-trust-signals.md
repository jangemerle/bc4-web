# Developer Trust Signals

Patterns specific to developer-tool and open-source product websites that build technical credibility. What makes a developer trust a product enough to install it.

---

## Code-First Signals

### npm install in the hero
**What:** The install command prominently displayed near the hero, often with a copy button. Signals: "this is real, you can use it right now, no signup required."
**Seen in:** Tailwind (install is the entire first docs page — 6 steps with framework tabs)
**Kvalt application:** `npm install kvalt` or `npx create-kvalt` in the hero area. Copy-to-clipboard. Framework badges (React, Vue, etc.) nearby.

### Live code playground
**What:** Embedded interactive code editor where visitors can modify components and see results in real-time. StackBlitz, CodeSandbox, or custom.
**Seen in:** Tailwind (play.tailwindcss.com linked prominently in main nav as "Playground")
**Kvalt application:** Embed a StackBlitz playground showing a Kvalt component with character switching. "Try it — change the character and watch everything adapt."

---

## Open-Source Credibility

### GitHub stars widget
**What:** Live star count displayed on the site, often near the hero or in the nav.
**Seen in:** Tailwind (GitHub link in nav, repo linked from footer)
**Kvalt application:** Once stars reach a meaningful number (500+), display prominently. Below that, skip it — low numbers hurt more than help.

### Changelog visibility
**What:** Public, detailed changelog linked from the site. Signals active maintenance.
**Seen in:** Tailwind (blog serves as changelog — version releases as blog posts with full feature breakdowns; Plus has dedicated /changelog link)
**Kvalt application:** "/changelog" page showing recent releases with commit-level detail. "Last updated 2 days ago" is the strongest trust signal for a DS.

### Bundle size / performance badges
**What:** Tree-shakeable badge, bundle size (bundlephobia), lighthouse scores displayed.
**Seen in:** Tailwind ("most Tailwind projects ship less than 10kB of CSS to the client" — specific claim on homepage)
**Kvalt application:** Show per-component bundle sizes. "Button: 2.1KB gzipped." Developers care about what they're shipping.

---

## Community & Ecosystem

### "Used by" with recognizable logos
**What:** Logo bar of companies/projects using the tool.
**Seen in:** Equals (Notion, Cursor, Superhuman), Tailwind (40+ sponsor logos on homepage + 60-site showcase with NASA, OpenAI, Shopify, Google IO, NYT)
**Kvalt application:** Even 3-4 recognizable names beat 20 unknown ones. Chase early adopters with strong brands.

### Discord/community link
**What:** Prominent link to community chat. Signals: there are other people using this, you can get help.
**Seen in:** Tailwind (Discord, GitHub, X linked in footer under "Community" section)
**Kvalt application:** GitHub Discussions or Discord. Prominently linked but not competing with primary CTA.

---

## Documentation as Trust

### API quality as marketing
**What:** Well-structured, searchable API docs signal engineering quality. Developers judge the product by the documentation.
**Seen in:** Tailwind (every utility class = its own page with generated CSS shown, hundreds of pages = massive SEO surface + signals comprehensiveness)
**Kvalt application:** Component API pages with TypeScript types, default values, and live examples. If the docs are beautiful, the product is probably beautiful.

### "View source" culture
**What:** Link to GitHub source for every component. Transparency builds trust.
**Seen in:** Tailwind (GitHub repo linked from nav; Plus testimonial specifically mentions learning "how the creators structure their components")
**Kvalt application:** "View source" link on every component page. Developers will read the code — make sure it's clean.

---

## Pricing & Purchase Trust

### One-time lifetime pricing
**What:** Single payment for permanent access, including future updates. Removes subscription fatigue.
**Seen in:** Tailwind Plus ($299 personal / $979 team — "Get everything, forever")
**Kvalt application:** Match this model. Developers viscerally prefer one-time payments for tools. "Every character, every component, every update. Once."

### Money-back guarantee
**What:** 30-day refund, no questions asked. Removes purchase risk entirely.
**Seen in:** Tailwind Plus ("email us within 30 days and we'll refund you in full, no questions asked")
**Kvalt application:** Offer 30-day guarantee. The refund rate will be negligible but the conversion lift is real.

### Student discount
**What:** Reduced pricing for students/low-income users with income threshold.
**Seen in:** Tailwind Plus ($30K USD income threshold for eligibility)
**Kvalt application:** Seeds future paying customers. Design students become design engineers who buy the Pro tier at their first job.

---

## Content as Trust

### Blog as engineering diary
**What:** Blog posts that deliver genuine engineering value while naturally cross-promoting paid products. Not a sales blog — a building-in-public log.
**Seen in:** Tailwind (version releases, open-source tool announcements, behind-the-scenes conference recaps — paid product mentions feel incidental)
**Kvalt application:** Every component shipped = blog post explaining the design thinking. Free value with casual mention of the full system.

### RSS feeds
**What:** Provide RSS/Atom/JSON feeds for the blog. Developers use RSS readers.
**Seen in:** Tailwind (feed.xml, atom.xml, feed.json)
**Kvalt application:** Add RSS feed to blog from day one. Small effort, signals developer empathy.

### Showcase / "Built with" gallery
**What:** Curated gallery of real sites built with the tool. Screenshots with hover video previews.
**Seen in:** Tailwind (60+ sites, responsive grid, curated not crowdsourced, own templates mixed in)
**Kvalt application:** "Built with Kvalt" page. Even 5-10 well-designed sites is enough. Mix own demos with real customer sites. Video hover previews make sites feel alive.
