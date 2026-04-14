# Design System Research — Comparative Analysis & Recommendations

Based on deep analysis of: Carbon (IBM), Polaris (Shopify), Primer (GitHub), Geist (Vercel), and Wise.

---

## What Kvalt already does well

Before recommendations, let's be honest about what's strong:

- **Motion system** — Your motion token architecture (durations, easings, springs, semantic transitions) is more sophisticated than any of the five systems studied. Wise has qualitative principles ("snappy, fluid, intuitive") but no actual tokens. Carbon and Polaris have motion guidelines but nothing as composable as your spring/transition system. This is a genuine differentiator.

- **Tone of Voice page** — The "Clear, not clinical / Warm, not gushing / Brief, not curt" framing with concrete before/after examples is stronger than Carbon's or Polaris's content guidelines. Wise comes closest with their Grammar & Style + Vocabulary approach, but yours has better instructional quality.

- **Accessibility page** — The contrast ratio table, keyboard patterns table, and focus ring rules are practical and implementation-ready. Most DS docs stay at principles level — yours goes to "here's the exact outline CSS."

- **Color token architecture** — 6 palettes × 12 shades + full semantic layer with light/dark mapping is solid and complete. The HSLUV-based generation gives you perceptual uniformity that most systems don't have.

- **Design Principles page** — The 8-point checklist is unique. No other system I studied provides a concrete layout review heuristic like this.

---

## What's missing — Foundation pages to add

### 1. Spacing (HIGH PRIORITY)

**Who has it:** Wise (separate Spacing + Padding pages), Polaris (part of layout), Primer (primitives).

**Why you need it:** You have spacing tokens in Tailwind config (4px base, scale from 0–96px), but no dedicated page explaining *when to use which value*. Your components use these tokens, but there's no documentation about the system behind them.

**What it should cover:**
- Your 4px base unit and the full spacing scale with visual examples
- Semantic guidance: when to use 8px vs 16px vs 24px (Wise's approach is excellent here — they name spacings by *context*: "between-text: 8px", "between-sections: 32px", "content-to-button: 24px")
- Difference between spacing (between elements) and padding (inside elements) — Wise dedicates separate pages to these, and it works
- Visual rhythm — how consistent spacing creates visual harmony (connects to your Design Principles page)
- Vertical rhythm in page layouts

**Recommendation:** Create a single Spacing page that covers both internal padding and external spacing with your token values, plus contextual usage guidance. You don't need to split like Wise unless the page gets too long.

---

### 2. Layout & Grid (HIGH PRIORITY)

**Who has it:** Wise (detailed grid with 6 breakpoints), Primer (layout foundations + responsive), Polaris (layout design page).

**Why you need it:** You have no layout documentation at all. No breakpoints defined, no grid system documented, no guidance on content width, columns, or responsive behavior. When you're building real products with Kvalt, this will be the first gap that hurts.

**What it should cover:**
- Breakpoints (define yours — Wise uses 320/480/768/992/1200/1440, which is a reasonable starting point for SaaS)
- Column grid (6 columns mobile, 12 desktop is the standard)
- Content max-width (you're using `max-w-4xl` in the showcase — is that your standard?)
- Sidebar + content layout patterns (relevant to your BC Call Centrum screens)
- Responsive behavior rules: what stacks, what collapses, what hides

**Note on tech stack fit:** You're using Tailwind, which has responsive prefixes built in (sm/md/lg/xl/2xl). Your layout page should map your breakpoints to these Tailwind prefixes so components and pages are consistent.

---

### 3. Interaction States (MEDIUM PRIORITY)

**Who has it:** Polaris (dedicated "Interaction states" design page), Wise (Focus States as a foundation).

**Why you need it:** Your Accessibility page covers focus rings, but there's no unified reference for all interaction states: default, hover, active/pressed, focus, disabled, loading, selected, error. Each component implements these differently. A unified page would:
- Define the visual language for each state (what changes — color? shadow? scale?)
- Map states to tokens (hover → surface shift, focus → primary ring, disabled → 50% opacity + no pointer-events, etc.)
- Show how states compose (what does hover + focus look like? Selected + disabled?)

**What to cover:**
- Hover patterns (your components use different hover treatments — some darken, some lighten, some scale)
- Press/active (you have `usePress` — document its visual contract)
- Focus (already documented, but should live here too or link to Accessibility)
- Disabled (visual rules + accessibility rules)
- Loading (Skeleton exists, but what about inline loading states?)
- Error/validation states

---

### 4. Size / Component Height Scale (MEDIUM PRIORITY)

**Who has it:** Wise (dedicated Size foundation — 5 tokens from 24px to 72px).

**Why you need it:** Your components have size props (Button has sm/md/lg, Input has sizes), but there's no documented system for *why* these values exist. Wise's approach is clean: define a height scale that components reference, so a "medium" button and a "medium" input are the same height and sit next to each other naturally.

**What it should cover:**
- Your component height scale (extract from existing components — what's the actual px height of Button sm/md/lg?)
- Rules for when to use which size
- How heights relate to padding (Wise's insight: fixed-height components use padding to fill the height; variable-height components let padding drive the height)

---

### 5. Grammar & Style / Vocabulary (LOW-MEDIUM PRIORITY)

**Who has it:** Wise (Grammar & Style + Vocabulary as two separate foundations).

**Why it's interesting:** Your Tone of Voice page covers *how* to write (character, principles). But it doesn't cover mechanics: capitalization rules, date formats, number formats, specific word choices ("Change" vs "Edit", "Choose" vs "Select"), punctuation rules. These matter when multiple people (or Claude) write UI copy.

**What to add:**
- Could be a section on the existing Tone of Voice page rather than a new page
- Word pairs: the Wise "Change vs Edit", "Choose vs Select", "View vs See" pattern is very practical
- Date/number formatting (relevant since you're Czech market — dd/mm/yyyy? Czech locale?)
- Approved terminology for your DS (what do you call things — "dialog" or "modal"? "dropdown" or "select"?)

---

### 6. Transitions / Page Navigation Patterns (LOW PRIORITY — future)

**Who has it:** Wise (Transitions as a separate foundation from Motion System).

**Why it's worth noting:** You have motion tokens for page transitions (`transition.navigate`) but no documented patterns for *how* pages transition. When you build multi-page products, you'll need this. But it's not urgent until you have routing.

---

## Changes to existing pages

### Colors page — add usage guidance

Your colors page shows the palette and semantic tokens, which is correct. What's missing is **usage guidance**: when to use primary vs secondary for actions, how to use success/warning/danger beyond "green = good, red = bad", and the relationship between surface layers (when to use surface-2 vs surface-3). A "Do/Don't" section showing correct and incorrect color usage would be valuable.

### Typography page — add usage context

Same pattern: the type specimens are good, but add guidance on *when* to use each scale level. Which headline size for page titles vs section titles vs card titles? When to use Body M vs Body S? Wise's approach of tying each size to a specific UI context helps designers make consistent decisions.

### Accessibility page — split Focus States into interaction states

Your focus ring documentation is excellent. Consider whether focus rules should move to the proposed Interaction States page (which would be the single reference for all states), with the Accessibility page focusing on broader accessibility principles, testing, and ARIA patterns.

### Motion page — this is your crown jewel, don't change much

Your motion page is genuinely the best-documented motion system I found across all five references. The combination of timing tokens + easing tokens + spring configs + semantic transitions + choreography rules + live interactive demos is comprehensive. Only addition: consider showing reduced-motion behavior side-by-side with full motion, so designers understand what the fallback looks like.

---

## Patterns section — a new category

**Who has it:** Polaris (7 patterns), Primer (10 UI patterns).

**What are patterns?** They sit between components and full pages. A component is a Button. A pattern is "how to build a form with validation feedback" — it combines multiple components into a reusable interaction recipe.

**Patterns worth documenting (based on your Figma screens and roadmap):**

1. **Form patterns** — field layout, validation display, submit flow, inline vs summary errors. You have Input, Select, Checkbox, RadioButton, Toggle, DatePicker, NumberInput — but no guidance on how to compose them into a form.

2. **Empty states** — you already have an Empty State page/example. Elevate it to a pattern: when to show, what to include, visual style, call-to-action rules. Connects to your Tone of Voice guidelines.

3. **Loading patterns** — you have Skeleton. But when do you use a skeleton vs a spinner vs a progress bar vs optimistic UI? This would be a useful pattern.

4. **Data table patterns** — you're building Table. The patterns around sorting, filtering, pagination, bulk selection, and empty/error states for tables compose into a pattern that's bigger than the Table component alone.

5. **Navigation patterns** — sidebar nav (on your roadmap), breadcrumbs, tabs. How do these compose for different page types?

**Recommendation:** Don't build the Patterns section yet. Build it *after* you've shipped the next wave of components (Table, Sidebar Navigation, Toast, Accordion). Patterns emerge from components, so you need the components first. But plan for it in your nav structure now.

---

## What to prioritize — recommended build order

Based on impact for your actual products (BC Call Centrum, Topic Board) and what would make Kvalt feel complete as a system:

### Immediate (alongside component building)

1. **Spacing page** — low effort, high value. You already have the tokens, just need the documentation and usage guidance.
2. **Layout & Grid page** — define your breakpoints and grid. Essential before building real product layouts.

### Next wave (after Table + Sidebar Nav ship)

3. **Interaction States page** — unifies your state treatments, makes the system more predictable.
4. **Colors page enhancement** — add usage guidance and do/don't examples.
5. **Typography page enhancement** — add contextual usage rules.

### When the system matures

6. **Size/height scale** — extract from existing components, document the system.
7. **Grammar & Style section** — practical mechanics to complement Tone of Voice.
8. **Patterns section** — forms, empty states, loading, table patterns.

---

## One principle I noticed across all five systems

The best design systems don't just document *what* — they document *when* and *why not*. Every foundation page in Wise and Primer answers three questions:

1. **What is this?** (the token values, the visual examples)
2. **When do I use it?** (contextual guidance, mapped to real UI situations)
3. **What's the wrong way to use it?** (do/don't examples, anti-patterns)

Your current pages mostly nail #1. Adding #2 and #3 would elevate Kvalt from a component library into a true design system.
