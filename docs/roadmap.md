# Kvalt — Roadmap & Context

Last updated: 2026-03-27


## Current Status

19 components built, 6 philosophy pages, 5 example pages, full token system, dark mode, showcase app.

### Recent Audit Findings (March 2026)
An audit of all 18 components found:
- 24 hardcoded hex color violations (mostly in RadioButton, Checkbox, Toggle error states)
- 7 components missing focus rings (Button, Chip, DatePicker, DropdownMenu, Modal, Select, Tabs)
- 5 border radius violations (arbitrary values)
- 2 shadow violations (hardcoded transparent resets)
- 10 Icon color overrides (inline `style={{ color }}` instead of parent `currentColor`)

Fixes in progress — see `kvalt-audit.md` in project root.


## Next Components (Priority Order)

Based on analysis of real-world usage across BC Call Centrum and Topic Board Figma designs:

### Recently Built
- **Table** — built 2026-03-16. Spec: `specs/table.md`

### Tier 1 — Highest impact
1. **Pagination** — companion to Table. Needed for data-heavy screens.
2. **Tooltip** — confirmed in designs (queue chip tooltips). Spec: `specs/tooltip.md`

### Tier 2 — High value
4. **Sidebar Navigation** — used across both products. Grouped sections, active states, collapse.
5. **Accordion** — statistics screen has collapsible sections. Spec: `specs/accordion.md`
6. **Toast** — needed for action confirmations. Spec: `specs/toast.md`

### Tier 3 — Future
7. Avatar Group — stacked avatars with overflow count (Topic Board topic rows)
8. Notification Badge — count circles on nav items
9. Breadcrumbs — page hierarchy navigation
10. Progress bar / Stepper
11. File upload
12. Command palette (Cmd+K)
13. Rich text editor / Message composer


## Infrastructure Roadmap

### Near-term
- Component API documentation generation
- Unit tests (Vitest + Testing Library)
- Accessibility auditing (axe-core)

### Medium-term
- Storybook or isolated component dev environment
- NPM packaging for reuse across projects
- Theme editor / token playground
- Theming tool — change DS parameters to brand for different clients

### Spec Export System (NEW — March 2026)

The ability to export Kvalt components and screens as structured implementation specs that any team can translate to their stack. Validated by CTO David's handoff workflow — their FE team will take Kvalt specs and rebuild in shadcn using AI.

**Layer 1: Spec schema** (near-term, needed for David handoff)
- Define a structured format capturing: visual tokens (colors, spacing, radius, shadows), typography, motion configs (spring/easing/duration with exact values), component states and transitions, accessibility patterns (focus management, ARIA, keyboard), composition rules, responsive breakpoints, content model and edge cases
- Format: likely structured markdown or JSON — needs to be both human-readable and AI-parseable
- First test: hand-spec 2–3 components for David's team, iterate on what they actually need

**Layer 2: Spec generator** (near-term)
- Claude skill or script that reads a Kvalt component/screen and outputs the spec
- Should work for both individual components and full screen compositions
- Input: component source code + tokens → Output: complete implementation spec

**Layer 3: Target translators** (medium-term, product play)
- "Export to shadcn" — first target, built for David's team
- "Export to Radix", "Export to MUI", "Export to Chakra" — each new target is a translator that reads the same spec schema
- This is where faces become a product: design intent in, implementation code out, for any stack
- Could ship as Claude skills, CLI tools, or eventually a hosted service

### Long-term
- Visual regression testing


## Business Context

### The Venture
SaaS and client development business with a 50/50 partner, based in Czech Republic (Rýmařov area), targeting the Czech market initially.

### How the DS Fits
The DS is the operational advantage — enabling delivery of polished, consistent UIs for new clients/products at high speed. The theming tool (planned) would allow going from "generic DS" to "client-branded product UI" quickly.

### Monetization Paths Explored
1. **Use it, don't sell it** (highest probability) — operational accelerator for client work, charge for output
2. **Sell as premium component library** — Gumroad/Lemon Squeezy, $5K-$50K/year ceiling
3. **Build a SaaS theming tool** — highest upside, highest risk, crowded space
4. **Content + consulting** — build in public, convert audience to clients

### Key Strategic Insight
The competitive advantage is operational (speed of delivery) rather than product-based (selling the system). Free alternatives (shadcn/ui, Radix) dominate the component library space. Differentiation needs to come from: visual polish, bundled animations (Motion), speed of customization, and targeting a specific niche.

### Emerging Insight: Spec Export as Product (March 2026)
David's CTO handoff revealed a potential product angle: Kvalt as a **design specification layer** that exports to any implementation stack. Faces encode design intent (tokens, motion, accessibility, behavior) — the spec export system translates that intent into shadcn, Radix, MUI, etc. This positions Kvalt not as a competing component library but as the design intelligence layer that sits above all of them. Validated by real handoff need: Jan prototypes in Kvalt, David's team implements in shadcn via AI-translated specs.

### Go-to-Market (not started)
- Build in public content strategy planned but not launched
- No landing page or waitlist yet
- Email list > social followers for launch
- Target: agencies and freelance developers who need branded UIs fast

### Open Questions
- Exact pricing model not defined
- Full add-on package list not finalized (animations and dark mode confirmed)
- Whether to prioritize client work revenue vs. product revenue
- Partner's role and skillset not discussed in detail
- Technical architecture of theming tool not specified


## Founder Context

- Product designer transitioning to design engineer
- Based in Czech Republic
- Built the entire DS using Claude Code from Figma designs
- Has Figma design skills + growing React/TypeScript engineering skills
- Goal: build sustainable income through SaaS or client development
