# Onboarding Flows

What happens after "Get started" — install experiences, first 5 minutes, documentation structure, and getting-started funnels. This is where DS products win or lose adoption.

---

## Install Experience

### Install-first documentation
**Source:** Tailwind
**What:** Docs landing page IS the install page, not an overview. "Get started with Tailwind CSS" immediately shows 5 installation method tabs (Vite, PostCSS, CLI, Framework Guides, Play CDN) with 6 numbered steps each. No philosophical preamble — just "here's how to use it."
**Key detail:** Steps are numbered with zero-padded digits ("01", "02") — small visual refinement that makes the process feel more designed.
**Troubleshooting:** Callout box at bottom: "Are you stuck? Check our framework guides." Catches the frustrated and redirects them.

**Kvalt application:**
- First docs page = install page. `npm install kvalt` with framework tabs (React, Vue, vanilla).
- 3-5 steps max to first rendered component.
- Zero-padded step numbers for visual polish.
- "Are you stuck?" callout linking to framework-specific guides.

---

## First 5 Minutes

### Playground as zero-install entry point
**Source:** Tailwind (play.tailwindcss.com linked in main nav)
**What:** Interactive sandbox where you can try the framework without installing anything. Linked prominently in the main navigation, not buried in docs. First-class product, not afterthought.

**Kvalt application:**
- StackBlitz or CodeSandbox playground showing Kvalt components with character switching.
- Link in main nav as "Playground" (not "Try it" or "Demo").
- Pre-loaded with a meaningful example (dashboard? settings page?) not just a button.

---

## Documentation Structure

### Sidebar as product + SEO surface
**Source:** Tailwind
**What:** 9 top-level categories in sidebar, hundreds of utility-specific pages. Structure: Getting Started (4) > Core Concepts (9) > then property-by-property reference (Layout, Flexbox, Spacing, Typography, etc.). Every class gets its own page.
**Key insight:** The sidebar IS the product. More pages = feels more comprehensive + creates massive SEO surface (hundreds of indexed pages, each targeting specific CSS property queries).

### Core Concepts as philosophy layer
**Source:** Tailwind (9 pages: Styling with utility classes, Hover/focus/states, Responsive design, Dark mode, Theme variables, Colors, Custom styles, Class detection, Functions/directives)
**What:** Sandwiched between install and reference — the "why" section. Teaches the mental model before drowning in the API. Uses the "name the objection, then counter it" technique throughout.

### Code + output transparency
**Source:** Tailwind Core Concepts
**What:** Every code example shows both the utility classes AND the generated CSS. Demystifies what happens under the hood. Developers trust things they can see through.

**Kvalt application:**
- Every component = its own page. Every token = its own page. Every character = its own page. Volume signals substance.
- Core Concepts section between install and reference: "Why characters?", "Token-first design", "Motion philosophy", "Accessibility by default."
- Show the character config AND the generated CSS variables side by side. Transparency builds trust.
- Search (Cmd+K) prominently available (Tailwind has it in the header).

### Header nav upsell pattern
**Source:** Tailwind docs header
**What:** Alongside free docs links (Docs, Blog, Showcase), paid products appear naturally: Components, Templates, UI Kit. Plus a "Course" link with "New" badge. Paid content feels like part of the ecosystem, not a separate sales funnel.
**Tracking:** Paid links use `?ref=sidebar` / `?ref=footer` for attribution.

**Kvalt application:**
- Docs nav includes both free and paid: Components (free), Characters (paid), Templates (paid).
- "New" badge on latest additions to draw attention.
- Track click sources with ref params.

---

## Getting-Started Funnels

### Single CTA discipline
**Source:** Equals
**What:** One action across the entire site: "Get a demo." No competing "try free" / "watch video" / "join waitlist" buttons splitting attention.
**Kvalt application:** Single CTA everywhere: "Get started" or "Install" — one button, one path.

### FAQ at point of anxiety
**Source:** Equals (pricing page)
**What:** FAQ section placed directly on pricing page addressing the three biggest adoption objections: implementation time ("~1 week"), trial availability, and security.
**Kvalt application:** FAQ on getting-started page: "How long to adopt?" "Can I customize everything?" "Does it work with my framework?" "What if I outgrow it?"
