# Kvalt Build Plan — From DS to Characters Product

**Created:** 2026-03-25
**Status:** Draft for review

---

## The Goal

Ship a product people can try: opinionated design configurations ("characters") that transform generic AI-built UIs into products with distinct character. Distributed as token bundles that work on top of shadcn/ui and integrate natively with AI coding tools.

**Success signal:** Someone installs a character, builds something with it, and shares the result unprompted.

---

## Phase 0: Foundation Cleanup
**Why:** Characters inherit from the base token system. If the base has hardcoded values, every character inherits those bugs. Fix once, benefit everywhere.

**Estimated effort:** 1–2 sessions

### Tasks

0.1 **Fix remaining audit violations (13 issues)**
- Toggle.tsx: replace hardcoded `#c0c8c8` with semantic token
- Skeleton.tsx: remove fallback hex `#e2e8f0`
- DatePicker.tsx: add `useReducedMotion` hook, gate all spatial animations
- 7 `rounded-full` structural violations — audit whether these are intentional (pills, avatars) or should use radius tokens
- 2 hardcoded rgba shadow values — migrate to shadow tokens
- 1 motion token override — align with `tokens/motion.ts`

0.2 **Verify every token is extractable**
- Confirm all color, typography, spacing, radius, shadow, and motion values come from `src/tokens/*.ts` and `src/styles/tokens.css`
- No component should reference a raw value that isn't in the token files
- This is the prerequisite for face switching — if it's not a token, a face can't override it

0.3 **Create a token coverage audit script**
- Automated check: grep components for hardcoded hex, px values, spring configs, etc.
- Integrate into `npm run security` or create `npm run audit:tokens`
- Catches regressions as new components are built

---

## Phase 1: Character Architecture
**Why:** The technical system that makes characters possible. Without this, characters are just a concept.

**Estimated effort:** 2–3 sessions

### Tasks

1.1 **Design the character.json manifest schema**
- Name, description, version, author
- Token file references (which files this character provides)
- Dependencies (fonts, icon library)
- Metadata: personality tags, recommended use cases, preview colors
- Validate with JSON Schema

1.2 **Extract current Kvalt tokens into the "default" character**
- Current tokens become `characters/kvalt-default/`
- This proves the extraction works and gives us a reference character
- Structure:
  ```
  characters/kvalt-default/
  ├── character.json
  ├── tokens/
  │   ├── colors.ts
  │   ├── typography.ts
  │   ├── spacing.ts
  │   ├── radius.ts
  │   ├── shadows.ts
  │   └── motion.ts
  ├── variables.css
  ├── tailwind.config.ts
  └── claude.md
  ```

1.3 **Build the character loader**
- Runtime: reads character.json, applies CSS variables and token overrides
- Mechanism: swap CSS custom properties on `:root` (same pattern as dark mode)
- Must support hot-switching without page reload (for the demo)
- Consider: should characters also override Tailwind config, or only CSS variables?

1.4 **Build character switching hook**
- `useCharacter()` — returns current character, available characters, switch function
- Persists selection (same as dark mode pattern)
- Triggers re-render of all token-dependent components via CSS variable swap
- Optional: transition animation between characters (use motion tokens)

1.5 **Write the claude.md template**
- What goes into a character's claude.md: design philosophy, do's/don'ts, tone guidance
- How AI tools should interpret the character when generating code
- Template that each character fills in with its own personality

---

## Phase 2: First Characters
**Why:** The product IS the characters. We need 3–5 that demonstrate range — same components, completely different character. These are also the free tier.

**Estimated effort:** 3–5 sessions

### Design criteria for character selection
- Each character should feel like a real product, not a theme demo
- They should be visually distinct enough that a 2-second glance tells them apart
- Cover different industries/vibes to show range
- At least one should be bold/playful, one clean/corporate, one warm/editorial

### Candidate characters (pick 3–5)

2.1 **"Fintech"** — Trust, precision, data density
- Colors: deep navy, cool grays, green/red for data
- Typography: tight, medium weight, monospace for numbers
- Motion: minimal, fast, functional (snappy springs, short durations)
- Radius: small (2–4px), sharp
- Shadows: subtle, cool-toned
- Personality: "We handle your money. Every pixel is deliberate."

2.2 **"Creative Studio"** — Bold, expressive, playful
- Colors: saturated accent, off-white/cream backgrounds, unexpected combos
- Typography: large headings, display font with character, generous spacing
- Motion: bouncy, playful springs, slightly exaggerated scale
- Radius: large (12–16px), rounded
- Shadows: warm, diffused
- Personality: "Design is our product. The UI should feel like one of our projects."

2.3 **"SaaS Dashboard"** — Clean, neutral, enterprise-friendly
- Colors: pure neutral grays, single brand accent, high contrast
- Typography: system font stack, compact, scannable
- Motion: fast, almost invisible, utility-only
- Radius: medium (6–8px)
- Shadows: standard elevation system
- Personality: "500 users look at this 8 hours a day. It should disappear."

2.4 **"Editorial / Content"** — Warm, readable, literary
- Colors: warm neutrals, paper-like backgrounds, ink-like text
- Typography: serif headings, generous line-height, reading-optimized
- Motion: gentle, slow reveals, content-first
- Radius: none or minimal (0–2px)
- Shadows: none or very subtle
- Personality: "The content is the product. Everything else gets out of the way."

2.5 **"Health / Wellness"** — Calm, accessible, reassuring
- Colors: soft greens, warm whites, gentle accent
- Typography: rounded sans-serif, friendly, larger base size
- Motion: slow, gentle, no sudden movements
- Radius: large (12–16px), soft
- Shadows: soft, warm
- Personality: "People are anxious when they use this. The UI should lower their heart rate."

### For each character:

2.x.1 Design the token set (colors, typography, spacing, radius, shadows, motion)
2.x.2 Implement as character folder with all token files
2.x.3 Write the claude.md with personality and guidelines
2.x.4 Test against all 25 existing components — verify nothing breaks
2.x.5 Screenshot/record before-after for each character

---

## Phase 3: The Demo — "Same App, Different Character"
**Why:** This IS the marketing. An interactive demo where you toggle between characters on the same SaaS dashboard is worth more than 10,000 words of copy.

**Estimated effort:** 2–3 sessions

### Tasks

3.1 **Design a representative demo app**
- A realistic SaaS dashboard with: sidebar nav, data table, cards/stats, form, modal, toast
- Uses every major component category (layout, data display, input, feedback, navigation)
- Has enough visual surface area that character differences are immediately obvious
- Keep it to 2–3 screens max — enough to show range, not so many it dilutes impact

3.2 **Build the demo app**
- Standalone page/route in the Kvalt docs site, or separate mini-app
- All components wired to the character system from Phase 1
- Real-looking demo data (not lorem ipsum — use a believable SaaS scenario)

3.3 **Build the character switcher UI**
- Floating panel or sidebar with character thumbnails
- Click to switch — instant CSS variable swap
- Show character name, personality description, and key token values
- Smooth transition between characters (the transition itself demonstrates motion tokens)

3.4 **Polish the transitions**
- Character switch animation should be delightful — this is the "wow" moment
- Consider: color crossfade, subtle scale pulse, motion token preview
- The transition speed should match each character's own motion personality

3.5 **Make it screenshot-worthy**
- Every frame of the demo should look good as a screenshot
- This is the Linear model: the product IS the marketing
- Test: would someone share a screenshot of this unprompted?

---

## Phase 4: Distribution MVP
**Why:** People need to be able to actually use characters in their projects. Start simple (files on GitHub), prove demand, then build tooling.

**Estimated effort:** 2–3 sessions

### Tasks

4.1 **Structure the characters GitHub repo**
- Public repo: `kvalt/characters` (or monorepo with character packages)
- Each character as a folder with the structure from Phase 1
- README with clear instructions: "Copy this folder into your project"
- License: free characters under MIT, premium characters under commercial license

4.2 **Write CLAUDE.md / .cursorrules distribution configs**
- For each free character: a CLAUDE.md that AI tools can consume
- Instructions telling Claude/Cursor: "Use these tokens, follow this design philosophy"
- Test: start a new project with Claude Code, paste the CLAUDE.md, build something — does it look like the character?

4.3 **Landing page**
- Embed the interactive demo from Phase 3
- Clear value prop: "Your AI builds the code. Kvalt gives it character."
- Show the character switcher live on the page
- Email capture for launch / premium characters notification
- Keep it simple — one page, no fluff

4.4 **Submit to directories**
- cursor.directory (CLAUDE.md configs)
- awesome-shadcn-ui list (if characters work on top of shadcn)
- awesome-cursorrules
- Relevant GitHub topic tags

4.5 **GitHub README + docs**
- Clear getting-started guide
- "How characters work" technical explanation
- Contributing guide (for community characters later)
- Character catalog with previews

---

## Phase 5: CLI & Registry
**Why:** Reduces friction from "copy this folder" to one command. Matches the shadcn mental model developers already know.

**Estimated effort:** 3–5 sessions (can be deferred until demand validates)

### Tasks

5.1 **Build the CLI**
- `npx @kvalt/characters init` — scaffolds character config in existing project
- `npx @kvalt/characters add fintech` — copies character tokens + CSS into project
- `npx @kvalt/characters list` — shows available characters
- `npx @kvalt/characters preview` — opens local preview of applied character

5.2 **Build the registry**
- JSON manifest of all available characters (mirrors shadcn registry pattern)
- Hosted on GitHub or simple API
- CLI resolves characters from registry URL
- Supports custom registries (community characters)

5.3 **shadcn compatibility layer**
- Characters inject CSS variables that shadcn components consume
- Motion layer adds animation tokens shadcn doesn't have
- Typography and spacing layers refine what shadcn leaves generic
- Test: existing shadcn project + `npx @kvalt/characters add fintech` = transformed

5.4 **Publish to npm**
- `@kvalt/characters` CLI package
- `@kvalt/character-fintech`, `@kvalt/character-creative`, etc. (individual character packages)
- Or single package with tree-shaking

---

## Phase 6: Content & GTM
**Why:** Building without distribution is hope-based strategy. Content starts now, not at launch.

**Runs in parallel with Phases 2–5**

### Tasks

6.1 **YouTube content (primary channel)**
- Video 1: "I built a SaaS with Claude Code, then gave it character in 5 minutes" (demo-first)
- Video 2: "Why every AI-built app looks the same (and how to fix it)" (problem-aware)
- Video 3: "shadcn is great. Here's what it's missing." (developer-aware)
- Format: 7–15 minutes, screen recording + voiceover, show real building process
- Cadence: 1 video every 1–2 weeks
- Start with the demo video as soon as Phase 3 is done

6.2 **Automated social posting (minimal time investment)**
- Use Buffer/Typefully for scheduled posts
- Content: demo GIFs, face comparison screenshots, build progress
- Never open the feed — schedule and close
- 3–5 posts per week, auto-generated from YouTube content + demo screenshots

6.3 **GitHub as distribution**
- Free character pack (3 characters) drives stars and awareness
- Good README is a landing page
- Issues become customer conversations
- Stars/forks are social proof

6.4 **Community seeding (Arc Browser model)**
- Identify 20–50 taste-makers: agency leads, indie hackers with design taste, AI tool creators
- Give them early access to premium characters
- Ask for honest feedback, not promotion
- Their usage generates authentic content

6.5 **Launch event**
- ProductHunt launch when demo + 5 characters + CLI are ready
- Frame: "Design personality for AI-built products"
- Coordinate with YouTube video + GitHub release
- Email list gets 24h early access

---

## Phase 7: Premium & Monetization
**Why:** Free validates demand. Premium turns it into a business.

**Estimated effort:** ongoing, starts after Phase 4

### Tasks

7.1 **Define premium character tiers**
- Free: 3 characters (fintech, creative studio, SaaS dashboard)
- Starter ($49–79): 5 additional characters
- Pro ($149–249): 15+ characters + Figma kit + page templates
- One-time purchase, no subscription

7.2 **Build premium characters**
- 10–15 additional character personalities
- Higher polish: more component overrides, more detailed claude.md
- Include Figma kit that mirrors code components
- Pre-built page templates styled with each character

7.3 **Payment & delivery**
- Lemon Squeezy or Gumroad (solo founder friendly)
- License key → unlocks premium character downloads
- PPP pricing for non-US markets (40–50% discount)

7.4 **Figma kit**
- Components matching each character's visual identity
- Designers can mock up with the character before developers build
- Bridges the designer ↔ developer workflow

---

## Execution Order & Dependencies

```
Phase 0 ──→ Phase 1 ──→ Phase 2 ──→ Phase 3 ──→ Phase 4 ──→ Phase 5
  (cleanup)   (arch)     (faces)     (demo)      (ship)      (CLI)
                                        │
                                        ↓
                                    Phase 6 (content starts here, runs parallel)
                                        │
                                        ↓
                                    Phase 7 (monetization, after Phase 4)
```

### Critical path
**Phase 0 → 1 → 2 → 3** is the critical path. Everything else can wait.
- Phase 0 unblocks Phase 1 (clean tokens)
- Phase 1 unblocks Phase 2 (character system exists)
- Phase 2 unblocks Phase 3 (characters exist to demo)
- Phase 3 unblocks everything else (the demo IS the product pitch)

### What can run in parallel
- Phase 6.1 (YouTube) can start with Phase 2 (record the character design process)
- Phase 4.3 (landing page) can start during Phase 3
- Phase 7 planning can happen anytime

---

## Open Questions for Jan

1. **Character selection:** Which 3–5 characters should we build first? The candidates above are suggestions — you know your taste and target market better.

2. **Demo app scenario:** What SaaS should the demo app represent? A generic dashboard, or something specific (project management, analytics, CRM)?

3. **Repo structure:** Monorepo (`kvalt/characters` with all characters) or separate repos per character? Monorepo is simpler to start.

4. **shadcn compatibility first?** Should characters work exclusively on top of shadcn from day one, or start with Kvalt's own component set and add shadcn compatibility later?

5. **Naming:** "Characters" as the product name — are we committed? It's good, but worth a final gut check before building the brand around it.

6. **Timeline ambition:** Are we building toward a launch date, or shipping incrementally as things are ready?

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Characters feel like "just themes" | Medium | High | Demo must show motion, interaction, typography — not just color swaps. The claude.md with design intent is the differentiator. |
| shadcn moves into characters territory | Medium | High | Ship fast. First mover in AI-native design configs. Build community before shadcn adds motion/interaction tokens. |
| Developers don't value design personality | Medium | Medium | Target agencies and founders, not developers building internal tools. Frame as business value (conversion, trust), not aesthetics. |
| Character switching is technically brittle | Low | High | Phase 0 ensures all values are tokenized. Automated audit catches regressions. |
| YouTube doesn't gain traction | Medium | Medium | Content is a compounding asset — it works over 12 months, not 12 days. Supplement with GitHub distribution (doesn't need audience). |
| Solo founder bottleneck | High | Medium | Prioritize ruthlessly. Phase 0–3 before anything else. CLI and premium can wait. |
