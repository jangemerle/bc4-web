# Kvalt — Customer Research v2 Addendum (March 2026)

New findings from four deep research streams. This supplements customer-research-v1.md.

---

## 1. shadcn Presets — competitive analysis

### What they actually are

shadcn launched Design System Presets in CLI v4 (March 2026). A preset is a 7-character Base62-encoded string (e.g., `aIkeymG`) that packs design parameters into a single portable code. You apply it via CLI:

```bash
npx shadcn@latest init --preset aIkeymG
```

### What's inside a preset

Five named visual styles shipped:

| Style | Character |
|-------|-----------|
| **Vega** | Classic shadcn (the baseline everyone knows) |
| **Nova** | Reduced spacing, compact layouts |
| **Maia** | Soft, rounded, generous spacing |
| **Lyra** | Boxy, sharp, pairs with mono fonts |
| **Mira** | Compact, dense data interfaces |

Each encodes: colors, fonts, icons, border-radius, spacing/padding strategies, and choice of base primitive (Radix UI or Base UI).

### What's NOT in presets (= Kvalt's moat)

- **Motion/animation** — Explicitly absent. 13 bits reserved in the encoding for future expansion, but not on the current roadmap.
- **Typography hierarchy** — Presets set font-family but not heading scales, line-heights, or text roles.
- **Interaction choreography** — No hover timing, press feedback, focus behavior, or transition patterns.
- **Spatial rhythm** — Some spacing in the style variants but no comprehensive rhythm system.
- **Tone/character/philosophy** — Presets are style configs. They don't encode design intent.

### Community reaction

Generally positive but notably narrow. Developers like the portability. Nobody is calling presets "design personalities" — they're seen as theme configs, which is exactly what they are. No preset marketplace exists yet; distribution is through registries and CLI.

### Strategic implications

**Validation:** The biggest component library in the ecosystem just confirmed the "portable design config" concept is correct.

**Differentiation is clear:** A Kvalt face includes everything a shadcn preset includes, PLUS motion tokens, interaction philosophy, typographic hierarchy, spatial rhythm, and design intent. A face is a superset, not a competitor.

**Positioning:** "Start with a preset, finish with a face." Or: shadcn presets give you a visual config. A Kvalt face gives you a design personality.

---

## 2. Developer resistance — the real blockers

### The trust collapse is real

- **46% of developers** don't trust AI accuracy (up from 31% previous year)
- Trust in AI accuracy fell from 40% → 29% — steepest annual decline in adoption surveys
- Only **9% of developers** think AI code can be used without human oversight
- **96%** say they don't fully trust AI output, but **only 48% actually verify** before committing

### The quality data backing up the resistance

CodeRabbit analysis of 470 GitHub PRs:

| Issue type | AI vs human multiplier |
|-----------|----------------------|
| Total issues per PR | **1.7x more** |
| Security vulnerabilities (XSS) | **2.74x more** |
| Performance inefficiencies | **8x more** |
| Code readability problems | **3x more** |
| Logic & correctness issues | **75% more** |

### The Amazon incident (March 2026)

Amazon mandated 80% of engineers use Kiro (their AI coding assistant) weekly. Result: four Sev-1 incidents in 90 days, including a 6.3 million lost orders outage on March 5. Amazon convened a mandatory senior leadership meeting. This became the poster child for "vibe coding gone wrong" and CTOs everywhere are citing it.

### The territory/role threat is real but nuanced

- Frontend developer job postings saw the **largest decline** among all engineering roles in 2025
- However, total software engineering roles remain stable
- Developers articulate the threat as **loss of control and autonomy**, not pure job elimination
- The shift is from "coder" to "orchestrator" — developers who specify intent, review output, maintain quality

### What this means for Kvalt

**The resistance is not irrational.** David's pushback (preferring Stitch → shadcn pipeline over your Claude Code + Kvalt workflow) is likely driven by wanting developer control over the code pipeline, not by doubting your design quality.

**Positioning matters enormously.** If Kvalt is framed as "designers ship frontend without developers," it will face maximum resistance. If framed as "developers ship frontend that looks like a designer touched it," resistance drops to near zero. Same product, completely different threat level.

**The winning pattern from teams that adopted AI successfully:**
1. Developers involved in selecting and configuring the tools (not imposed from design)
2. Human-in-the-loop at every decision point
3. Design system as the shared contract between design and dev
4. AI generates within system constraints, not freeform
5. Developers review and own all output

**Kvalt should position as the shared contract, not the designer's weapon.**

---

## 3. YouTube/community pain mining — deeper evidence

### The pain has a cultural name now

"AI slop" is the term people use for the generic aesthetic of AI-generated UIs. It's become a recognized visual category, like "stock photo aesthetic" was in the 2010s. Designers are "actively rejecting UI patterns that resemble the same generic, emoji-fueled, faux-minimalism of AI-generated HTML."

### Scale of the problem

- **277,000+ installs** of a single Claude Code plugin designed to "break the AI slop aesthetic"
- Anthropic published an official "Prompting for Frontend Aesthetics" cookbook — acknowledging the problem at the platform level
- Hacker News thread on "getting good UI from Claude Code" hit **1,058 upvotes, 300+ comments**
- 25% of YC Winter 2025 startups have 95%+ AI-generated codebases and are visibly struggling with generic aesthetics

### What people consistently describe

The pain has three layers:

1. **Visual convergence:** Inter font, purple gradients, rounded cards, soft shadows. Every AI tool defaults to the same palette.
2. **Interaction flatness:** No motion, no feedback, no micro-interactions. "Looks like a wireframe that got colors."
3. **Spacing/hierarchy issues:** AI doesn't understand visual hierarchy, information density, or spatial rhythm. Things are "technically laid out" but don't feel intentional.

### Language patterns (for marketing copy)

- "looks generic" — most common complaint
- "AI slop" — cultural shorthand for low-effort AI output
- "all look the same" — design convergence frustration
- "feels off" — can't articulate it but know something's wrong
- "breaking the curse" — how solutions are framed
- "looks like a prototype" — the gap between MVP and product
- "needs a designer's touch" — what they believe the solution is
- "the shadcn look" — shadcn as a recognizable (negative) aesthetic category

### Emerging solutions people are reaching for

- Custom system prompts/CLAUDE.md files with design rules
- Screenshot-based prompting ("make it look like this")
- Manual CSS overrides after generation
- Hiring a designer for a "polish pass" at the end
- Using animation libraries (Framer Motion, GSAP) to add life
- Nobody has found a systematic solution yet

---

## 4. Google Stitch — David's proposed tool

### What it actually is

Free AI design tool from Google (evolved from acquired Galileo AI), powered by Gemini 2.5 Pro. Generates high-fidelity UI designs from text, voice, sketch, or image prompts. 350 free generations per month.

### Output quality — the honest assessment

**Strengths:** Clean first drafts, good structural scaffolding, produces "genuinely different" layout variants (not just color swaps), exports to HTML/CSS/Tailwind/React.

**Critical weaknesses:**
- "Still lacked the refined aesthetic and nuanced detail that an experienced UI designer would typically bring"
- "Limited set of layout structures — outputs look similar with only minor variations"
- No accessibility guarantees (weak contrast, insufficient touch targets, missing focus states)
- No interactive prototyping, state management, or data binding
- Without DESIGN.md guidance, "10 pages generated by AI might have 10 different button styles"

### DESIGN.md — Google's answer to the generic problem

Google introduced DESIGN.md as a markdown file encoding an entire design system (colors, typography, spacing, components, brand principles). Gemini reads it on every generation.

**Critical limitation:** Uses "probabilistic judgment, not rule-based precision" — it guides rather than strictly constrains. Solves ~70% of the sameness problem but requires human refinement.

**Comparison to Kvalt's approach:** DESIGN.md is conceptually similar to Kvalt's CLAUDE.md + token system, but less precise. Kvalt enforces tokens through actual code (Tailwind classes, motion.ts, component APIs), not probabilistic AI interpretation.

### The CTO's proposed workflow — gap analysis

David suggested: Stitch → manual HTML export → GitHub → Claude AI + shadcn → deploy

**What's missing from this workflow:**
- No brand identity enforcement (Stitch defaults to generic without DESIGN.md)
- Manual HTML export → shadcn conversion = hours of developer work
- No motion system (Stitch doesn't generate animations, shadcn doesn't include them)
- No accessibility built in (requires manual remediation)
- No component reuse across the project (each Stitch generation is isolated)
- No typographic hierarchy or spatial rhythm system
- **Result: looks like "just another AI design"**

**What your existing workflow (Figma → Claude Code + Kvalt) provides that David's doesn't:**
- Opinionated token system enforced at code level
- Motion-first components (usePress, spring configs, semantic transitions)
- Accessibility baked in (WCAG compliance, focus management, keyboard nav)
- Component reuse and consistency across all pages
- Typographic hierarchy with semantic roles
- Spatial rhythm system
- Design intent that survives from Figma to production

### Strategic implication

Stitch is not a threat to Kvalt — it's validation. Stitch proves the market wants AI-accelerated design but can't get distinctive output from it. Kvalt is exactly the layer that makes Stitch output (or any AI output) distinctive.

The smartest framing for David: "Stitch is great for initial exploration. Kvalt is what makes the final product not look like every other Stitch-generated app."

---

## 5. Updated risk assessment

### Risks that increased

**Developer resistance (HIGH).** More serious than we initially estimated. The Amazon incident, the CodeRabbit data, the trust collapse — all create a hostile environment for "designer ships frontend code" narratives. Kvalt MUST be positioned as a developer tool, not a designer tool that bypasses developers.

**shadcn presets (MEDIUM).** They're shallow today but the architecture supports expansion. If shadcn adds motion to presets in the next 6 months, Kvalt's differentiation window narrows. Speed matters.

### Risks that decreased

**Market validation (LOW).** The pain is overwhelmingly confirmed. 277K installs of a single plugin to fix AI aesthetics. Anthropic publishing an official cookbook about it. Hacker News threads with 1K+ upvotes. This is not a hypothetical problem.

**Competitive landscape (LOW).** Nobody is building what Kvalt proposes. The closest things are shadcn presets (too shallow) and Google's DESIGN.md (probabilistic, not precise). The lane remains empty.

### New risk identified

**"AI slop" stigma.** If "AI-generated UI" becomes as stigmatized as "stock photo website," then tools that *improve* AI output have a strong market. But if the stigma extends to "anything built with AI tools," then even Kvalt-enhanced output might be dismissed. Monitor sentiment.

---

## Sources

### shadcn presets
- shadcn CLI v4 changelog: ui.shadcn.com/docs/changelog/2026-03-cli-v4
- shadcn visual styles (Vega, Nova, Maia, Lyra, Mira): shadcnblocks.com
- How presets work (bit-packing): shadcnstudio.com/blog/how-shadcn-ui-presets-work
- shadcn on X (presets announcement): x.com/shadcn/status/2029974151427989567
- registry.directory: community preset distribution

### Developer resistance
- Stack Overflow Developer Survey 2025: trust fell from 40% → 29%
- CodeRabbit: State of AI vs Human Code Generation (470 PRs analyzed)
- Amazon Kiro incidents: getautonoma.com, CNBC, Security Boulevard
- METR study: experienced devs 19% slower with AI tools
- VentureBeat: Only 9% think AI code usable without oversight

### YouTube/community
- Anthropic "Prompting for Frontend Aesthetics" cookbook
- 277K installs of Claude Code design plugin
- Hacker News: "Getting Good UI from Claude Code" (1,058 upvotes)
- Multiple Medium essays on "AI slop" aesthetic

### Google Stitch
- Google blog: blog.google (Stitch announcement)
- LogRocket review: blog.logrocket.com
- DESIGN.md concept: youmind.com, mindstudio.ai
- Figma stock impact: CNBC (8.8% drop after Stitch update)
- NxCode comparisons: Stitch vs Figma, Stitch vs v0 vs Lovable
