# Website & Marketing — Subsystem Index

Everything related to Kvalt's public-facing website: inspiration sites, copy strategies, interaction patterns, visual storytelling, onboarding flows, and developer trust signals.

**How to use:** When building or revising any Kvalt website page, scan this index first. Pull the relevant pattern file for specific approaches. When a new reference URL is shared, create a `sites/xyz.md` teardown and pull interesting patterns into the thematic files.

---

## Pattern Files (synthesized across all reference sites)

| File | Focus |
|------|-------|
| [copy-patterns.md](copy-patterns.md) | Headline formulas, tone rules, social proof placement, CTA strategy |
| [interaction-patterns.md](interaction-patterns.md) | Micro-interactions, scroll behaviors, hover states, page transitions, cursor effects |
| [visual-storytelling.md](visual-storytelling.md) | Diagrams, interactive demos, progressive disclosure, before/after, product explanation |
| [onboarding-flows.md](onboarding-flows.md) | Install experience, first 5 minutes, documentation structure, getting-started funnels |
| [dev-trust-signals.md](dev-trust-signals.md) | GitHub widgets, npm commands, live playgrounds, bundle size, changelogs, open-source credibility |
| [seo-architecture.md](seo-architecture.md) | URL structure, named pages for long-tail, meta/OG strategy, LLM citation optimization |
| [responsive-strategy.md](responsive-strategy.md) | Mobile nav, demo scaling, code blocks on small screens, touch interactions |

## Site Teardowns

| File | URL | Added | Top patterns |
|------|-----|-------|--------------|
| [sites/equals.md](sites/equals.md) | equals.com | 2026-04-08 | Question-as-headline, "this isn't X" reframing, named recipes as pages, persona-first nav, single CTA, distributed social proof |
| [sites/tailwind.md](sites/tailwind.md) | tailwindcss.com + tailwindui.com | 2026-04-07 | Free+paid model, blog as disguised sales channel, docs sidebar as SEO surface, one-time lifetime pricing, self-deprecating humor, showcase as social proof, visual-only sales page |
| [sites/cursor.md](sites/cursor.md) | cursor.com | 2026-04-08 | Product-as-demo hero, period-terminated headings, research identity, changelog on homepage, platform-detected CTA, dark mode first, masterclass testimonial mix |
| [sites/hey.md](sites/hey.md) | hey.com | 2026-04-08 | Confrontational positioning, named concepts as world-building, rotating social proof ticker, founder letter section, footer as philosophy map, invented vocabulary, opinionated copy masterclass |
| [sites/notion.md](sites/notion.md) | notion.com | 2026-04-08 | "Find a wedge" strategy, dual CTA, organic tweet embeds, illustration as emotion, versioned changelog, restraint as brand, possessive pronoun copy |
| [sites/manychat.md](sites/manychat.md) | manychat.com | 2026-04-08 | Before/After comparison, monospace nav typography, trust badges above fold, dual-axis Solutions dropdown, 3-step onboarding, specific numbers in testimonials |
| [sites/supernova.md](sites/supernova.md) | supernova.io | 2026-04-08 | Numbered narrative sections (01/06), repeating brand manifesto, logo-as-tab testimonials, pre-footer community triptych, setup-punchline headlines |
| [sites/untitledui.md](sites/untitledui.md) | untitledui.com | 2026-04-08 | COMPETITOR: scale as moat (320K users, 10K components), zero personality/motion/philosophy, Figma-first pipeline, lifetime pricing, shadcn model, MCP integration. Kvalt wins on craft, motion, opinions, character system |

## Cross-Site Pattern Tracker

Recurring patterns observed across multiple reference sites. Updated as new sites are analyzed.

| Pattern | Seen in | Kvalt application |
|---------|---------|-------------------|
| Question-as-headline | Equals | Hero: "What comes after component libraries?" |
| "This isn't X" reframing | Equals | Position against misconceptions |
| Named recipes as pages | Equals | "The Dashboard", "The Auth Flow" — composed layouts as SEO + docs |
| Persona-first navigation | Equals | "For developers" / "For design engineers" / "For founders" |
| Single CTA everywhere | Equals | One action per page: "Get started" |
| Social proof distributed | Equals | Testimonial on every page, not just one section |
| Confident restraint | Equals | Trust content over decoration |
| Launch banner above nav | Equals | Announce latest release in slim persistent bar |
| Implicit pain | Equals | "First DS with taste" implies pain without stating it |
| Two-tier pricing | Equals, Tailwind | Free + Pro, one axis of differentiation |
| Free core + paid premium | Tailwind | Framework free, components/templates/kit paid |
| Blog as sales channel | Tailwind | Engineering diary that casually mentions paid features |
| Docs sidebar = SEO surface | Tailwind | Every utility class = its own page = hundreds of indexed pages |
| One-time lifetime pricing | Tailwind | $299 personal / $979 team, "Get everything, forever" |
| Self-deprecating humor | Tailwind | "you coward", spaceship joke — developer insider tone |
| Showcase gallery | Tailwind | "Built with X" page featuring recognizable brands |
| Visual-only sales page | Tailwind | Sell output screenshots, not code, on paid product page |
| Playground in main nav | Tailwind | Interactive sandbox as first-class citizen |
| Install-first docs | Tailwind | Docs start with "how to install", not "what is this" |
| Templates as education | Tailwind | "Learn how experts build" framing for paid templates |
| Course as product | Tailwind | Educational content treated as premium offering |
| Magazine cover personality | Tailwind | "Class Warfare — The Anti-Patterns — No. 4" framing on hero — movement, not tool |
| Sponsors above features | Tailwind | Social proof BEFORE explanation — "if they support it, it's good" priming |
| Interactive tools in marketing | Tailwind | P3 color palette is explorable ON the homepage, not behind install |
| File names as code labels | Tailwind | "vite.config.ts" not "TypeScript" — tells devs WHERE, not WHAT |
| Monospace uppercase labels | Tailwind | Section labels: font-mono, uppercase, tracking-widest — strong visual hierarchy |
| Version badge in nav | Tailwind | "v4.2" next to logo signals active development |
| No email capture on homepage | Tailwind | "Get started" goes to docs. No newsletter popup. Developer respect |
| Ecosystem in footer | Tailwind | 4 adjacent products in footer make tool feel like platform |
| UTM tracking everywhere | Tailwind | Every cross-product link has ?ref= param — measure every funnel step |
| Product-as-hero | Cursor | Live interactive product demo IS the hero visual, no illustrations |
| Period-final CTAs | Cursor | "Try Cursor now." — period communicates certainty, not excitement |
| One-sentence descriptions | Cursor | Every feature section gets exactly one sentence. Forces clarity |
| Single accent color | Cursor, Equals | Nearly monochrome + one warm accent for emphasis only |
| Serif headlines + sans body | Cursor | Editorial/literary authority for marketing, sans-serif for product |
| Content hub blog | Cursor | Blog + case studies + press + videos + changelog on one page |
| Collapsible release categories | Cursor | "Bug Fixes (8)" expandable sections in changelog entries |
| Research identity | Cursor | Position as "applied research team" not just product company |
| Platform-specific download | Cursor | "Download for macOS" auto-detected, not generic |
| Social proof on every page | Equals, Cursor | Testimonials/logos distributed across all pages, especially pricing |
| Workflow-phase organization | Cursor | Features organized by Plan/Design/Debug not by feature name |
| Fictional realistic demo content | Cursor | "Acme Labs", real-looking projects — demos tell user stories |
| 4-tier individual pricing | Cursor | Hobby (free) / Pro / Pro+ (recommended) / Ultra — clear ladder |
| Additive feature lists | Cursor | "Everything in X, plus:" reduces cognitive load vs. comparison matrix |
| Confrontational positioning | Hey | "Gmail, Outlook, and Apple got complacent" — name competitors directly |
| Named concepts as world-building | Hey | "The Screener", "The Imbox" — product as a world with named places |
| Rotating social proof ticker | Hey | Praise quotes scrolling above the hero, pre-loading credibility |
| Founder letter as section | Hey, Notion | Personal voice builds trust with indie/dev audience |
| Footer as philosophy map | Hey | Link names are statements: "It's none of their business", "Forever yours" |
| Invented vocabulary | Hey | "Imbox" — deliberate misspelling becomes memorable brand language |
| One concept per scroll section | Hey | Full-width moment per feature, no card grids |
| Warm unexpected sign-offs | Hey | "Have a terrific day!" in footer, asterisked *really* |
| Before/After comparison | ManyChat | Two-panel with matching bullets: pain → outcome |
| Monospace nav typography | ManyChat | All-caps lettertracked nav signals "technical" |
| Trust badges above fold | ManyChat | Framework/partner badges immediately visible near hero |
| Dual-axis Solutions dropdown | ManyChat | "by Role" + "by Task" parallel taxonomy |
| 3-step onboarding section | ManyChat | "1. Install 2. Import 3. Ship" — reduces perceived complexity |
| Specific numbers in copy | ManyChat, Hey | "417 times" not "many times", "$65M in sales" not "increased revenue" |
| Find a wedge | Notion | Lead with one sharp problem, not comprehensive feature tour |
| Organic tweet embeds | Notion | Real tweets more authentic than polished testimonials |
| Versioned changelog | Notion, Cursor | Version numbers (3.2, 3.3) signal living, evolving product |
| Illustration as emotion | Notion | Show how using the product feels, not what it does |
| Possessive pronoun copy | Notion | "Your components", "Your tokens" — ownership before purchase |
| Numbered narrative sections | Supernova | 01/06 through 06/06 — structured story with progress awareness |
| Repeating brand manifesto | Supernova | Signature phrase repeated between sections for memorability |
| Logo-as-tab testimonials | Supernova | Company logos as tab selectors — user chooses whose story to read |
| Pre-footer community triptych | Supernova | Three cards (GitHub, Changelog, Community) as engagement gateway |
| Setup-punchline headlines | Supernova | "Another design system. Except this one has opinions." |
