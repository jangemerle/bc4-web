# Kvalt — Customer Research (March 2026)

## Executive summary

The "my AI-built app looks generic" pain is real, measurable, and has revenue impact. Community mining found direct evidence across Reddit, GitHub issues, Medium, and Hacker News. The pain is not cosmetic — one case study showed 7x CTR improvement and 61% lower cost-per-lead after fixing generic aesthetics. The market is massive (24M+ developers using AI tools, 92% daily adoption), and nobody is selling "design personality as config." shadcn/ui just launched presets (March 2026) which validates the concept but doesn't go far enough — presets are color/font/radius bundles, not cohesive design personalities with motion and spatial rhythm.

---

## 1. Community mining — the pain in people's own words

### Reddit findings (105 posts scraped, 13+ highly relevant)

**The pain is real and it has a name.** People are already calling it "the AI-built aesthetic" — and they mean it negatively. Someone built an AI Website Detector, scanned 30,267 sites, and found AI-built UIs are a visually recognizable category. That's how homogeneous the output is.

**Pain language people actually use:**
- "Generic. Looked like every other ad in the feed."
- "Creative fatigue"
- "Everyone uses the same stock photo approach"
- "All look the same"
- "AI-built" (used as a negative marker)
- "Uninspired design"
- "Cheap look"
- "Roast my build?" (expecting design criticism, not code criticism)

**Where the conversation happens:**
- r/ClaudeAI — Solo devs sharing builds, asking for design feedback
- r/SaaS — Founders discussing differentiation
- r/Entrepreneurs — AI-built product quality debates
- r/webdev (2.4M members) — Design help requests
- r/programming (6.6M members) — Tool discovery

**Revenue impact evidence:**
- A marketer on r/LandyAI documented: generic templates → custom look = **7x CTR improvement** (0.3% → 2.1%) and **61% lower cost per lead**
- This proves the gap between "generic" and "designed" isn't aesthetic — it's a conversion problem

**Who feels it most:**
| Persona | Pain trigger | Severity |
|---------|-------------|----------|
| Solo devs (Claude Code, Cursor) | Speed-first, budget-constrained, no design skills | High — they know it looks bad but can't fix it |
| Bootstrap SaaS founders | Need differentiation for PMF, look amateurish next to funded competitors | High — directly affects conversion |
| Vibe coders (non-devs) | Built something that works but "doesn't feel right" | Medium-high — have taste, lack tools |
| Agency devs | Client deliverables all look the same across projects | High — affects client relationships |

### GitHub issues — what people ask for that doesn't exist

**shadcn/ui GitHub (#9955 — most voted):**
> "I think a great extension for shadcn/ui could be to support multiple fonts... This would further reduce the generic shadcn/ui image and give users the opportunity to personalise their designs even more."

This is a direct request for what Kvalt faces provide — but at the typography level only. The full personality (motion, spacing, rhythm) isn't even in people's vocabulary yet.

**DaisyUI GitHub (#2224, #4016, #2503):**
Multiple issues reporting custom themes "don't work" or "look the same" — users generate themes but they remain visually indistinct. Theme customization tools alone are insufficient; users need **cohesive, pre-tested visual systems**.

**Medium (prominent developer voice):**
> "Every creator has access to shadcn, Tailwind, React, Framer Motion, etc. So why do some UIs feel alive while others feel dead? They experiment. They push variations. They play with micro-interactions. They commit to a visual identity. And most importantly: they don't rely on the default look."

> "UI is one of the last remaining unfair advantages. A breathtaking interface is a moat. A generic one is a graveyard."

### Competitor product reviews — what's missing

**v0 (Vercel):** Users note it generates "slightly calmer, more 'serious' UI" with clean scaffolding but "often missing requirements" and lacking personality.

**Lovable:** Explicitly prioritizes design quality and wins against v0/Bolt for this reason — but can't escape the base shadcn aesthetic without explicit brand direction from the user.

**Bolt.new:** "Prioritizes working code over aesthetics. The UI works but often looks generic."

**Aceternity UI (4.9/5 on Product Hunt):** Succeeds specifically because it provides "motion + modernism + personality combined" — proving the market pays for character.

---

## 2. Market sizing

### AI coding tool usage (verified numbers)

| Tool | Users | Revenue | Source |
|------|-------|---------|--------|
| GitHub Copilot | 20M all-time, 4.7M paid subscribers | 42% market share of $7.88B market | TechCrunch, July 2025 |
| Cursor | 1M+ DAU, 1M+ paying devs | $2B ARR (Feb 2026), 1,100% YoY growth | Sacra, Getpanto |
| Claude (overall) | 18.9M MAU, 30M+ (Q2 2025) | $2.5B run-rate (early 2026) | Backlinko, Demandsage |
| Replit | 35-40M total users | $253M ARR (Q4 2025), 9M full apps | Shipper, Index |
| Bolt.new | 5M signups, ~1M DAU | $40M ARR (March 2025), projecting $80-100M | Shipper, Contrary |
| v0 (Vercel) | 3.5-4M+ users | $42M ARR (Feb 2025), 9.6M projects in 2025 | Getpanto, Sacra |
| Lovable | 100K+ community | $200M ARR (after 1 year) | Lovable blog, Contrary |
| Windsurf (Codeium) | 1M+ active | $82M ARR (July 2025) | Getpanto, Sacra |

### Developer population & AI adoption

- **28.7M developers** globally (2025)
- **84% use or plan to use AI tools** (Stack Overflow 2025, 49K+ respondents)
- **92% of US developers** use AI coding tools daily
- **41% of all code** is now AI-generated
- **63% of active vibe coders** are non-developers

### npm downloads as proxy for frontend dev activity

- **shadcn/ui:** 203K weekly downloads, 109K+ GitHub stars
- **@radix-ui/primitive:** 29M+ weekly downloads
- **tailwindcss:** (massive, baseline utility)

### Market size calculations

**Total Addressable Market (TAM):**
- 24M+ developers actively using AI tools + estimated 50M citizen builders
- AI coding tools market: $7.88B (2025) → $10-12.8B (2026)
- Vibe coding market: $4.7B (2025) → $12.3B (2027) at 38% CAGR

**Serviceable Addressable Market (SAM):**
- Developers shipping products where design matters: ~15-20M
- At $100-200 average one-time purchase: $1.5B-4B SAM

**Serviceable Obtainable Market (SOM) — Year 1:**
- Conservative: 1,000-5,000 paying users × $149-249 = $149K-$1.2M
- This is achievable for a solo creator with audience (Aceternity hit $80K/month within 2 months of Pro launch)

---

## 3. Search demand signals

### High-growth search terms (2024-2026)

**Strongest signals:**
- "vibe coding" — explosive growth, 38% CAGR market
- shadcn/ui ecosystem — 180% growth in adoption (20% → 56% in two years)
- "React UI library" / "React UI kit" — 67% YoY growth in job postings, 847K active roles globally
- "SaaS dashboard template" — consistent demand from founders

**Emerging signals:**
- "AI generated UI" — growing but still niche
- "design system for startups" — underserved, design system teams are typically 1-2 people
- "make my app look better" — low volume but high intent

### What people actually search for vs. what Kvalt offers

People search for **solutions to symptoms**, not the root cause:
- "shadcn themes" → they want customization (symptom)
- "tailwind themes" → they want a different look (symptom)
- "SaaS UI template" → they want to skip design (root)
- "make my app look better" → they want character (root)

Kvalt needs to be findable through the symptom searches (themes, templates) while positioning itself as the root solution (design personality).

---

## 4. Adjacent buyer profiles

### Who already pays for design quality in code?

**Tailwind UI buyers:**
- Web developers and designers with good design sense
- Startups and agencies wanting an "opinionated starting point"
- Hit $2M revenue in 5 months, multi-million annually
- Buyers value: speed, reliability, production-quality patterns

**Framer template buyers:**
- Agencies (ready-to-use solutions), designers, freelancers
- Industry verticals: fintech, AI SaaS, consulting, wellness
- Top creators earn $4K-24K/month
- Buyers value: visual quality, conversion optimization, industry specificity

**Refactoring UI buyers:**
- Developers wanting to learn design (not just use components)
- Developer/designer hybrids
- Buyers value: actionable design knowledge, not just tools

**ThemeForest buyers (declining — cautionary):**
- 50-70% sales drop year-over-year
- Generalist template marketplaces are dying
- Buyers shifted to direct vendor relationships and code-first solutions

### The common thread across all buyer segments

The people who pay for design quality share these traits:
1. **They ship products for others** (clients, users, investors) — not side projects
2. **They recognize the quality gap** but lack time or skills to close it themselves
3. **They value speed** — $149-299 is nothing compared to days of design work
4. **They prefer one-time purchases** over subscriptions for tools
5. **They discover through community** (Twitter, GitHub, Reddit) not search ads

---

## 5. Critical competitive development: shadcn presets (March 2026)

shadcn/ui just launched **Design System Presets** — which is architecturally similar to what Kvalt proposes:
- Presets "pack colors, themes, fonts, border-radius, and icons into a single, portable string"
- CLI initialization: `npx shadcn@latest init --preset [CODE]`
- Explicitly framed as solving the "AI-ready design system" problem

**What this means for Kvalt:**
- **Validation:** The biggest component library in the ecosystem just confirmed the preset/config concept is the right approach
- **Threat:** If shadcn presets become "good enough," the market for additional personality layers shrinks
- **Differentiation opportunity:** shadcn presets are still configuration bundles (colors, fonts, radius, icons). They don't include: motion systems, spatial rhythm, typographic hierarchy, interaction choreography, semantic transition tokens. A Kvalt "face" is deeper than a shadcn preset — it's a complete design personality, not just a visual config.

**Strategic response:** Position Kvalt faces as the layer above shadcn presets. A face might include a shadcn preset as its visual foundation, but adds motion, rhythm, and interaction personality on top. "Start with a preset, finish with a face."

---

## 6. Validated pain signals — summary

| Signal | Source | Confidence |
|--------|--------|------------|
| AI-built UIs are visually recognizable as generic | Reddit (AI Website Detector, 30K sites) | High |
| Generic aesthetics directly hurt conversion metrics | Reddit (7x CTR improvement case study) | High |
| "All look the same" is the #1 complaint about shadcn ecosystem | GitHub issues, Medium articles, HN threads | High |
| Typography/font pairing is the most-requested differentiator | GitHub shadcn/ui #9955, FontTrio launch | High |
| Motion/animation-focused libraries outperform on Product Hunt | Aceternity UI 4.9/5, Ruixen UI demand | High |
| Custom theme tools fail to deliver distinctiveness | DaisyUI issues #2224, #4016, #2503 | Medium-high |
| AI builders (v0, Bolt, Lovable) can't escape generic aesthetic without explicit brand direction | Product comparison articles, user reviews | High |
| Developers will pay $149-299 for opinionated design solutions | Tailwind UI ($2M in 5 months), Untitled UI, Chakra Pro | High |
| The market is moving from "pick your own" to "opinionated defaults" | ThemeForest decline, shadcn preset launch | High |

---

## 7. Interview guide — three personas

### Purpose
Validate whether the pain signals we found in community mining match real behavior, understand current workarounds, and test willingness to pay for Kvalt faces.

### Universal rules
- Never describe the product first. Understand their world first.
- Never ask "would you buy this?" — instead, ask about past behavior, current spending, real projects.
- Listen for the gap between what they say they want and what they actually do.
- Record exact language — this becomes marketing copy.

---

### Persona 1: Agency dev / freelancer (5 interviews)

**Where to find them:** r/webdev, r/freelance, Twitter (search "client project" + "cursor" or "claude"), Upwork top-rated React developers, agency Discord servers

**Screening question:** "Have you delivered 3+ client projects in the last 12 months using AI coding tools (Cursor, Claude Code, v0, etc.)?"

**Interview flow (30 min):**

1. **Their world (5 min)**
   - "Walk me through your last client project from kickoff to delivery. What tools did you use?"
   - "How many projects do you typically work on per year?"

2. **The design problem (10 min)**
   - "When you delivered that project, how did the client react to how it looked?"
   - "Has a client ever pushed back on the visual quality or said it looked too similar to something else?"
   - "When you start a new project, how do you make sure it doesn't look like the last one?"
   - "What's your current process for giving each project a distinct visual identity?"

3. **Current solutions (10 min)**
   - "What UI libraries or templates do you start from?"
   - "How much time do you spend customizing the look per project?"
   - "Have you ever bought a theme, template pack, or design kit for client work? What and why?"
   - "What's the most you've spent on design resources for a single project?"

4. **The gap (5 min)**
   - "If you could change one thing about how your projects look when they ship, what would it be?"
   - "Imagine you could drop in a config file and your project immediately had a completely different visual personality — different motion, typography, color, spatial feel. How would that change your workflow?"
   - "What would that be worth to you per project?"

---

### Persona 2: Indie founder past MVP (5 interviews)

**Where to find them:** Indie Hackers (filter by launched + revenue), r/SaaS, r/startups, Twitter (search "just launched" + "SaaS"), ProductHunt recent launches

**Screening question:** "Have you launched a SaaS product in the last 12 months that has paying users?"

**Interview flow (30 min):**

1. **Their product (5 min)**
   - "Tell me about your product. Who's it for and what does it do?"
   - "How did you build it? What tools and stack?"

2. **The design problem (10 min)**
   - "How do you feel about how your product looks right now?"
   - "Have you ever gotten feedback (from users, investors, or friends) about the visual quality?"
   - "When you look at competitors, how does your UI compare?"
   - "How much time have you spent on design vs. features?"

3. **Current solutions (10 min)**
   - "Did you start from a template or design kit? Which one?"
   - "Have you hired a designer at any point? Why or why not?"
   - "What would you change about the design if you had unlimited time?"
   - "Have you paid for any design tools, themes, or UI kits? What and how much?"

4. **The gap (5 min)**
   - "What's the #1 thing that makes your product look 'indie' vs. 'professional'?"
   - "If you could apply a complete design personality — motion, typography, color, spacing — in one step, when would you have used that?"
   - "Would you pay for that? How much?"

---

### Persona 3: Vibe coder / design-aware builder (5 interviews)

**Where to find them:** Lovable Discord, Bolt.new community, r/ChatGPT (filter "built an app"), Twitter (search "vibe coding" + "shipped"), Maven course alumni

**Screening question:** "Have you built a working app using AI tools (Lovable, Bolt, Cursor, Claude Code) in the last 6 months without being a professional developer?"

**Interview flow (30 min):**

1. **Their journey (5 min)**
   - "How did you get into building apps with AI? What was the first thing you made?"
   - "What tool do you use most? Why that one?"

2. **The design problem (10 min)**
   - "When your app was working, how did you feel about how it looked?"
   - "Did you try to improve the design? What did you try?"
   - "How did you describe what you wanted to the AI tool? Did it understand?"
   - "Show me your app — what would you change about the design if you could?"

3. **Current solutions (10 min)**
   - "Have you tried using different templates, themes, or UI kits?"
   - "Have you asked the AI to 'make it look like [specific product]'? Did that work?"
   - "Have you spent any money on design resources? What?"
   - "How much time do you spend on design vs. functionality?"

4. **The gap (5 min)**
   - "What's the difference between your app and a product that 'feels professional'?"
   - "If you could pick a design personality for your app — like choosing a filter for a photo — and everything (colors, fonts, animations, spacing) changed to match, would you use that?"
   - "What would you pay for it?"

---

### Interview analysis framework

After all 15 interviews, look for:

1. **Problem validation:** Do they confirm the pain or is it milder than community mining suggests?
2. **Current spend:** What are they already paying for design resources? (This sets the price ceiling)
3. **Workaround intensity:** How much effort do they currently put into differentiation? (More effort = more pain)
4. **Language patterns:** What words do they use to describe the problem? (This becomes copy)
5. **Willingness to pay:** Concrete numbers, not hypotheticals
6. **Deal breakers:** What would prevent them from using a "face" system?
7. **Discovery channel:** How would they find a product like this? (This confirms distribution strategy)

---

## 8. Open questions for next research round

1. **shadcn presets adoption speed** — How fast are presets being adopted? Are they "good enough" for most people, or do people still want more? Monitor GitHub discussions and Twitter sentiment.

2. **Willingness to pay for motion specifically** — Our research shows animation-focused libraries (Aceternity) succeed, but is motion a feature people pay extra for or just a nice-to-have?

3. **Enterprise vs. individual buyer** — Is the real money in team/enterprise licenses ($500-999) or individual purchases ($149-249)? The Cursor/Copilot data suggests enterprise penetration is where the volume is.

4. **Figma-to-code pipeline** — Does the face need a Figma component? Or is code-only sufficient? The Untitled UI model (Figma + code sync) suggests both matter.

5. **Config file format** — What's the right delivery mechanism? CLAUDE.md? .cursorrules? MCP server? CLI? Or all of them? Need to test what developers actually reach for.

---

## Sources

**Community mining:**
- Reddit LandyAI: CTR improvement case study (reddit.com/r/LandyAI/comments/1s2nf5w)
- Reddit Entrepreneurs: AI Website Detector (reddit.com/r/Entrepreneurs/comments/1s2py88)
- Reddit ClaudeAI: Solo dev MVP feedback (reddit.com/r/ClaudeAI/comments/1s2pyvy)

**GitHub issues:**
- shadcn/ui #9955: Multiple fonts & font pairing request
- shadcn/ui #6229: Theme discovery discussion
- DaisyUI #2224, #4016, #2503: Custom theme failures
- FontTrio: fonttrio.xyz (community solution for shadcn font pairing)

**Articles & analysis:**
- Medium: "Why developers need to stop blaming shadcn" (govindalapudisrinath)
- DEV.to: shadcn CLI v4 & Design System Presets (March 2026)
- Anna Arteeva: Lovable vs Bolt vs v0 comparison (Medium)
- Design Systems Collective: AI prototyping comparison

**Market data:**
- Stack Overflow Developer Survey 2025 (49K+ respondents)
- JetBrains Developer Ecosystem 2025 (24K+ respondents)
- Fortune Business Insights: AI Code Tools Market ($7.88B)
- Roots Analysis: Vibe Coding Market ($4.7B, 38% CAGR)
- Sacra: Cursor Intelligence ($2B ARR)
- TechCrunch: GitHub Copilot (20M users, 4.7M paid)

**Adjacent market:**
- Adam Wathan: Tailwind CSS business story (adamwathan.me)
- Aceternity UI: starterstory.com, foundernoon.com ($80K/month)
- Framer creators: framer.com/creators ($4K-24K/month)
- ThemeForest decline: premiumwp.com (50-70% sales drop)
- zeroheight: Design Systems Report 2026
