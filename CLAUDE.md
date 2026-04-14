# Kvalt — Claude Code Guidelines

## This repo hosts two products — check which one you're working on

Dvě různé věci žijí ve stejném gitovém repu (rozhodnuto 2026-04-14, detaily v `docs/bc4-web/README.md`):

1. **Kvalt DS** — designový systém + jeho living documentation site (to, čeho se týká většina tohoto CLAUDE.md). Routes: `/components/*`, `/foundations/*`, `/philosophy/*`, `/screen-vault/*`. Zdroj Figma: "Topic Board New".
2. **BC4Cloud marketing web** — konverzně zaměřený marketingový web pro SaaS produkt BusinessCom a.s., postavený **na** Kvalt DS. Routes: `/`, `/produkt/*`, `/cenik`, `/kontakt`, `/poptavka`. Zdroj: projektová dokumentace v `bc4-web/` + `docs/bc4-web/`.

**Když jde o BC4 web:**
- Před jakoukoli prací přečti **`docs/bc4-web/README.md`** — navede tě na strategy, IA, tech architecture, a destilovaný playbook.
- Pravidla BC4 webu: všechny komponenty z Kvalt DS (`src/components/`), žádný hardcoded text (vše přes `src/content/{locale}/`), čeština primární, každá stránka má single primary CTA (`Domluvit ukázku`), žádný AI slop (specifičnost > obecnost, konkrétní čísla > generické claims).
- Commit scope pro BC4: `feat(bc4-home)`, `content(bc4-pricing)`, `fix(bc4-leadform)`. **Nikdy** nemíchat Kvalt DS změnu a BC4 marketing změnu v jednom commitu.
- BC4 má vlastní anti-slop checklist v `docs/bc4-web/knowledge-distilled.md` § 9 — projdi před deployem.

---

## Full documentation → `docs/` folder

For comprehensive project documentation, read these files:
- **`docs/SYSTEM.md`** — Master overview: what exists, architecture, tech stack
- **`docs/tokens.md`** — Every token value: colors, typography, spacing, radius, shadows, motion
- **`docs/philosophy.md`** — Motion guidelines, tone of voice, accessibility, design principles
- **`docs/conventions.md`** — All coding rules and patterns (expanded version of this file)
- **`docs/roadmap.md`** — Priorities, planned components, business context
- **`docs/multi-agent.md`** — Multi-agent pipeline: Designer → Builder → Auditor workflow
- **`docs/components/INDEX.md`** — Per-component docs: props, variants, behavior, Figma source
- **`docs/COWORK.md`** — Mentor personas and interaction guidelines for Cowork sessions

For component build specs, see `specs/` — these are detailed implementation instructions.

**Always consult `docs/SYSTEM.md` and `docs/conventions.md` before building new components.**

## Design → Code pre-flight (MANDATORY for any Pencil/Figma → code task)

Before writing a single line of implementation code from any design source, run through this checklist in order. Do not skip steps.

### 1. Component existence check
Read `docs/components/INDEX.md`. For every UI element in the design, ask: does Kvalt already have this?
- Button, IconButton, Input, Toggle, Checkbox, Radio, Dropdown, Modal, Tabs, ContentSwitcher, Skeleton, DataTable, LoadingIndicator — **always use the DS component, never rebuild from scratch**
- If unsure → grep `src/components/` before building anything new

### 2. Philosophy alignment check
Read the relevant sections of `docs/philosophy.md` before implementing:
- **Motion**: All animations use motion tokens from `src/tokens/motion.ts`. No hardcoded durations, no `whileTap` (use `usePress` hook). Springs for spatial motion, durations for opacity/color.
- **Tone of voice**: Check button labels, headings, error states against Kvalt's voice — direct, dry, no corporate filler. If the design has generic copy ("Submit", "Click here"), improve it to match Kvalt's voice.
- **Accessibility**: Every interactive element needs keyboard support and ARIA. Check contrast on any custom colors.

### 3. Token mapping
Run `figma-to-kvalt` or `check-tokens` skill for all values. Colors → CSS variables, spacing → Tailwind scale, radius → token classes, shadows → token classes. Zero hardcoded hex, zero arbitrary px values that have a token equivalent.

### 4. After building → audit
Run `check-tokens` skill on the finished component. Fix any violations before considering the task done.

**Always read `docs/COWORK.md` at session start** — it defines mentor personas (Design Engineering Mentor and SaaS Business Mentor) and interaction style for all conversations.

## Knowledge base → `knowledge/` folder

Curated insights from articles, videos, podcasts, and research relevant to Kvalt.
Organized by topic (design-process, color-theory, product-strategy, etc.).

- **`knowledge/_INDEX.md`** — Scan this first to see what's available. Pull specific files only when relevant to the current task.
- When adding new content: distill into key takeaways + "Relevance to Kvalt" section, file into the right topic folder, update the index.
- Topics and folders grow organically — create new subfolders as needed.

## Illustrations → `public/illustrations/`

Hand-drawn watercolor illustrations (Icons8 Ouch — hand-drawn animation style).
Used to add personality to documentation pages and Screen Vault demos.

- **`_catalog.json`** — Master index of all illustrations with tags, context descriptions, and color info.
- **`src/utils/illustrationPicker.ts`** — Auto-matches illustrations to page content by keywords.
- When adding new illustrations: drop the PNG into the folder, add an entry to `_catalog.json` with descriptive tags and context.
- When generating pages: use `pickIllustration(['keyword1', 'keyword2'])` to find the best fit.

## Security tooling

Three layers of security are configured:

- **Gitleaks** (`.gitleaks.toml`) — scans for leaked secrets, API keys, tokens. Run: `npm run security`
- **eslint-plugin-security** — catches unsafe regex, eval, timing attacks, etc. in ESLint
- **npm audit** — dependency vulnerability scanning (runs as part of `npm run security`)

Run `npm run security` before committing to check all three.

## Image optimization → `scripts/optimize-images.mjs`

Sharp-based pipeline that resizes, compresses, and generates WebP variants.

- Run `npm run optimize-images` to process all illustrations
- Run `node scripts/optimize-images.mjs filename.png` for a single file
- Output goes to `public/illustrations/optimized/` (gitignored, regenerate on CI)
- Use `<Illustration name="envelope" width={200} />` component for rendering

Read `.skills/image-optimize/SKILL.md` for full usage guide and quality presets.

## Skills → `.skills/` folder

Custom skills accelerate Figma-to-code, page generation, and image optimization:

- **`.skills/figma-to-kvalt/SKILL.md`** — Read this BEFORE converting any Figma design to code. Contains complete token mapping tables (Figma values → Kvalt Tailwind classes), Figma MCP output parsing rules, and the font-family/color/spacing/radius/shadow translation guide. Also read `references/tokens.md` for the full lookup table.

- **`.skills/kvalt-page-gen/SKILL.md`** — Read this BEFORE creating any new documentation page. Contains page structure recipes for foundation, component, philosophy, and Screen Vault pages, plus the exact layout component API (`PageHero`, `Section`, `CardGrid`, `ExampleBlock`, `ShowcaseBlock`, `TokenTable`, `DosDonts`). Also read `references/page-recipes.md` for complete templates.

- **`.skills/image-optimize/SKILL.md`** — Read this BEFORE optimizing or adding images. Contains Sharp pipeline usage, quality presets per use case, and the `<Illustration>` component API.

- **`.skills/apify-fetch/SKILL.md`** — Web scraping via Apify when WebFetch fails (JS-rendered pages, anti-bot protection, YouTube). Token stored in `.env` as `APIFY_TOKEN`. For YouTube transcripts specifically, use the `karamelo~youtube-transcripts` Apify actor via API — it returns full captions, metadata, and descriptions. Use Apify automatically whenever YouTube or a blocked site needs scraping; don't waste time on WebFetch or `youtube-transcript-api` first.

- **`.skills/check-tokens/SKILL.md`** — Audit any Figma frame or React component against Kvalt's token system. Catches hardcoded values, wrong semantic tokens, off-grid spacing, and radius violations. Run BEFORE implementing from Figma (after reading the design) and AFTER building a component (as final verification). Also use when the user pastes a Figma link and asks to "check" or "audit" it.

- **`.skills/grill-component/SKILL.md`** — Design tree interview for components. Walk down every branch (variants, states, content model, composition, accessibility, motion, edge cases) before writing any code. Run BEFORE creating a new component spec or starting implementation. Produces a confirmed design summary that feeds into the TDD skill.

- **`.skills/tdd-component/SKILL.md`** — Test-driven component development. Red-green-refactor loop: write one failing test, implement to pass, refactor, repeat. Run WHEN building any new component. Follows the confirmed design from grill-component and ends with a check-tokens audit.

- **`.skills/generate-illustration/SKILL.md`** — Generate Midjourney prompts for new illustrations consistent with the Kvalt hand-drawn watercolor style. Produces copy-paste prompts, reference image strategy, and a post-generation QA checklist. Supports color accent variants (salmon, slate-blue, sage-green, amber, lavender). Run WHEN the user needs a new illustration. Also read `references/style-dna.md` for the full visual language decomposition.

- **`.skills/create-character/SKILL.md`** — Generate a complete DS character (theme personality) from a mood description. Produces a full Character object with 53 CSS variable overrides, manifest metadata, and personality traits. Run WHEN the user says "create character", "new theme", or describes a visual mood. One prompt in, one character out.

- **`.skills/ffmpeg/SKILL.md`** — Multimedia manipulation for motion showcase. Video → frame sequences for scroll animations, screen recordings → optimized GIF/WebP demos, looping hero animations, format conversion. Core recipes for all common Kvalt use cases. Run WHEN creating scroll animations, component demos, or processing video content for the docs site.

- **`.skills/playwright-test/SKILL.md`** — Automated browser testing for Kvalt components. Visual regression screenshots, motion timing verification, interaction state testing, responsive breakpoints, and accessibility audits (axe-core). Run AFTER building components (post tdd-component) and BEFORE deploying docs. Config at `playwright.config.ts`, tests in `tests/e2e/`.

- **`.skills/pencil/SKILL.md`** — Design UI screens, components, and layouts using Pencil's AI-driven visual canvas via the pencil MCP server. Visual ideation before coding: pick a style guide, set Kvalt variables, design iteratively with screenshots. Run WHEN the user wants to visually prototype, explore layout variations, or design a screen before implementing it. Covers the full session ritual, prompt templates for great non-generic output, and the handoff workflow to Kvalt React code.

- **`.skills/recraft/SKILL.md`** — Generate, transform, and post-process images using the Recraft MCP server. Covers illustration, vector/SVG, photography, logo, and icon generation — plus upscaling, background removal, vectorization, and custom style references for brand consistency. Always generates 4 variations. Run WHEN the user needs a generated image, illustration, icon, logo, or wants to transform/upscale an existing image. Includes Kvalt-specific prompt templates, substyle recommendations, cost awareness, and pipelines for each asset type.

**Component build workflow: grill-component → write spec → tdd-component → check-tokens (final audit) → playwright-test (e2e & visual)**

**Visual design workflow: pencil (explore + design) → figma-to-kvalt mapping → tdd-component → check-tokens**

**Asset generation workflow: recraft (generate + iterate) → image-optimize (Sharp pipeline) → catalog entry**

**When implementing from Figma designs: read figma-to-kvalt + check-tokens skills first, then write code.**

---

## Commit discipline → always commit with conventional messages

**Every piece of work ends with a descriptive git commit. No exceptions.**

Format: `type(scope): description` — see `COMMIT_CONVENTION.md` for full reference.

```
feat(Button): add loading state with spinner animation
fix(FloatingSectionNav): replace IntersectionObserver with scroll pinning
style(TypographyPage): update PageHero to editorial copy
docs(MotionPage): add spring personality justifications
refactor(useSectionNav): simplify pinning logic to single scroll listener
chore(deps): upgrade motion to 11.2.0
```

**Rules:**
- One logical change per commit — don't bundle unrelated changes
- Title = what changed. Body = why (only if non-obvious)
- Present tense imperative: `add` not `added` not `adds`
- Scope = the component/page/file/hook name
- **Never rely on auto-commit** — always write an explicit `git commit -m "..."` at the end of each task
- Agents must commit their own work before completing a task

**For bug hunting:**
```bash
npm run log                          # full history with graph
npm run log:file -- src/components/Button.tsx   # one file's full history
npm run log:today                    # what changed today
npm run log:search -- "keyword"      # find commits by keyword
git show <hash>                      # what changed in one commit
git bisect start                     # binary search for bug introduction
git blame src/components/Button.tsx  # who changed which line
```

---

## Press animations → always use `usePress`

**Never use `whileTap` directly.** On Apple Magic Trackpad (and other touch devices),
`whileTap` exits within ~10–50 ms — before the animation is visible.

Instead, always use the `usePress` hook from `src/hooks/usePress.ts`:

```tsx
import { usePress } from '../hooks/usePress';

// Inside the component:
const { isPressed, pressHandlers } = usePress({ disabled });

// Spread handlers on the interactive element (button, label, div, etc.):
<motion.button animate={{ scale: isPressed ? 0.97 : 1 }} {...pressHandlers} />

// For elements wrapping a hidden input (e.g. RadioButton, Checkbox):
<label {...pressHandlers}>
  <motion.div animate={{ scale: isPressed ? 0.9 : 1 }} />
  <input className="sr-only" />
</label>
```

The hook guarantees `isPressed` stays `true` for at least 120 ms, so even
an instant trackpad tap produces a fully perceptible animation.

### When to use it
Any component with a press/active animation:
- Buttons (Button, IconButton)
- Form controls with a visual indicator (RadioButton, Checkbox, Toggle)
- Clickable cards, list items, tiles
- Any `motion.*` element that previously used `whileTap`

---

## Animation tokens — never hardcode timing values

**All animation timing must come from `src/tokens/motion.ts`.** Never inline
spring configs, duration numbers, or easing arrays in components.

```tsx
import { spring, ease, duration, transition } from '../tokens/motion';

// Springs — spatial motion (position, scale, rotation)
spring.snappy   // press feedback, dropdowns, tooltips
spring.default  // panels, modals, tab indicators, cards
spring.playful  // toasts, success states, celebrations

// Durations — tween timing (opacity, color, blur)
duration.instant   // 100ms — micro-feedback
duration.fast      // 160ms — hover, focus, tooltip
duration.base      // 240ms — dropdown, popover, tab switch
duration.moderate  // 340ms — panel, accordion, sidebar, modal
duration.slow      // 480ms — page transitions

// Easings — cubic-bezier curves
ease.enter     // [0, 0, 0.2, 1]   — things arriving
ease.exit      // [0.4, 0, 1, 1]   — things leaving
ease.standard  // [0.4, 0, 0.2, 1] — state changes
ease.stroke    // [0.65, 0, 0.35, 1] — checkbox/radio path draw

// Semantic tokens — pre-composed, pick the intent:
transition.feedback   // button press, checkbox
transition.reveal     // dropdown, popover appearing
transition.dismiss    // closing, removing
transition.expand     // sidebar, accordion
transition.navigate   // page transitions
transition.celebrate  // success, achievement
```

### Speed multiplier

`MOTION_SPEED` in `tokens/motion.ts` scales every duration and spring
`visualDuration` globally. Set to `0.5` for 2× faster, `2` for 2× slower.

### Box shadows

Box shadows use Motion-controlled values — do not put `box-shadow` in Tailwind
transition utilities on animated components.

---

## Multi-agent pipeline → `.claude/agents/`

Four specialized agents for Figma-to-code workflows and runtime debugging. See `docs/multi-agent.md` for full architecture.

| Agent | Model | Role | Output |
|-------|-------|------|--------|
| **Designer** | Opus | Reads Figma via MCP, produces Design Manifests + specs | `manifests/`, `specs/` |
| **Builder** | Sonnet | TDD implementation from manifests (worktree isolated) | `src/components/`, `src/pages/`, tests |
| **Auditor** | Opus | Token compliance, a11y, visual regression, iteration reports | `audits/` |
| **Debugger** | Sonnet | Runtime debugging via Playwright MCP — finds console errors, blank screens, broken interactions | `debug-reports/` |

**Pipeline:** Designer extracts → Builder(s) implement in parallel → Auditor reviews → Director merges or iterates.

**Debugger:** Use whenever something doesn't work at runtime — blank screens, broken clicks, visual glitches. It opens a real browser, reproduces the issue, captures console errors, and identifies the exact root cause. Spawn with: `"Run the debugger agent on [page/issue]"`

**Figma MCP:** `figma-console` (southleft/figma-console-mcp) — 90+ tools, resolved tokens, deep component trees.

**Spawning agents:**
```
"Run the designer agent on [component] from Topic Board New"
"Run the builder agent on manifests/[component].json"
"Run the auditor on all changes from this session"
```
