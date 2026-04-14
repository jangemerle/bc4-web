# Taut — Character Instructions for AI

You are building with the **Taut** character. Sharp, precise, data-dense fintech interface where every pixel is deliberate and nothing is wasted.

## Design Philosophy

- **Precision over expression.** Every decision serves a function. Visual hierarchy is ruthless — only the essential survives. Decorative elements, soft transitions, and gentle curves are removed. No whitespace is wasted; no color is arbitrary.
- **Data density without chaos.** Taut embraces grid-based layouts, small type, tight spacing, and clear hierarchies. Contrast is high. Tables, charts, and numbers dominate. Everything is scannable, nothing is hidden.
- **Speed over delight.** Motion is snappy and near-invisible — it serves feedback, not emotion. Spring animations are tight (zero bounce). Durations are short. Micro-interactions confirm, not celebrate.
- **Trust is the brand.** We handle your money. The interface communicates competence, stability, and control. No quirk. No surprise. No personality. Just precision.

**Personality in one sentence:** We handle your money. Every pixel is deliberate. Nothing decorative, nothing wasted.

## Token Rules

### Colors
- **Primary: Indigo (#6366F1–#4338CA).** Core action, button states, focus rings, links. Always on purpose. Never decorative.
- **Success: Emerald (#10B981).** Positive data, gains, approvals, confirmations. High confidence, no ambiguity.
- **Danger: Red (#EF4444).** Losses, errors, rejections. Impossible to miss or misinterpret.
- **Warning: Amber (#F59E0B).** Caution, pending, attention needed. Between success and danger.
- **Surfaces: Cool slate (F1F5F9–0F172A).** Backgrounds stay slightly cool and minimal, never warm. Contrast is always sufficient for accessibility. Text on light surfaces is deep indigo/slate-900 (#0F172A).
- **Text: High contrast.** --color-on-surface (#0F172A) on light. --color-on-inverted-surface (#F8FAFC) on dark. No soft grays for body text.
- **Borders: Cool slate (#E2E8F0 for default, #CBD5E1 for strong).** Never decorative. Always functional.

### Typography
- **Display font: Inter (bold weight 600–700 only).** No decorative display font. Consistency over personality. Bold, strong, readable.
- **Body font: Inter (regular 400, medium 500, semibold 600).** The same as display. No serif. No stylistic variation. Pure function.
- **Mono: JetBrains Mono (400–500).** For code, account numbers, reference IDs. Always monospace for data.
- **Size and weight.** Hierarchy is clear: display is bold and large, body is medium and small, labels are bold and compact. No subtle differences.

### Spacing
- **Density: Tight and compact.** Padding is 12px/16px/24px (never generous). Gaps between elements are 8px/12px/16px. Whitespace is functional, not breathing room.
- **Grids.** 8px grid for everything. No exceptions. Tables and data cards use 4px gutters. Forms stack vertically with 16px gap between fields.

### Border Radius
- **Sharp: 2–4px minimum, 6px maximum.** No rounded corners. No playful curves. Taut uses --radius-s (2px) for subtle emphasis, --radius-m (4px) for buttons/inputs, --radius-lg (6px) for modals/cards. --radius-xl is reserved for pill shapes only.

### Shadows
- **Subtle and cool-toned.** Shadows use deep slate (rgba(15,23,42,...)) with tight offsets (1px, 4px, 12px). No heavy drop shadows. No warm/brown tints. Shadows define hierarchy and separation, never decoration.
- **Small shadows (1px lift):** --shadow-small-1/2/3 for subtle focus, hover, or small cards.
- **Medium shadows (4px lift):** --shadow-medium-1/2/3 for dropdowns, popovers, elevated inputs.
- **Large shadows (12px lift):** --shadow-large-1/2/3 for modals, side panels, overlay content.

### Motion
- **Speed: Snappy and invisible.** Use `transition.feedback` (100ms) for all button presses, checkbox/radio states, and micro-feedback. Use `transition.reveal` (160ms) for dropdowns and popovers. No durations longer than 240ms unless part of a deliberate reveal (like a panel opening). Motion supports task completion, not emotional resonance.
- **Spring: No bounce.** Use `spring.snappy` only (zero overshoot). No playful or default springs. Motion should feel confident and controlled.
- **When to animate vs. cut.** Animate feedback states (press, hover, focus, success). Cut for navigation, layout shifts, and page changes. Animations that distract from data are removed.
- **Specific preferences:** Button press = scale 0.97 over 100ms. Focus ring = subtle glow using --color-primary-1. Checkbox = path draw + fade, no bounce. Dropdown = fade + slight slide from above. Success toast = slide from right, no celebration sound.

## Do's
- Always use Inter for display, body, and brand. No serif, no display typefaces.
- Enforce indigo as primary. It's cool, trustworthy, and precise.
- Use bold weight (600–700) for emphasis. Never rely on color alone.
- Stack form fields vertically with 16px gaps. No side-by-side unless absolutely necessary.
- Use tables and grids for data. Taut assumes dense, multi-column layouts are expected.
- Apply tight shadows (small-1 or small-2 by default). Reserve medium/large for true elevation.
- Keep border radius at 2–4px. Never exceed 6px unless it's a pill.
- High contrast is non-negotiable. WCAG AAA on all text.
- Validate with hard success/danger feedback. No soft warnings.
- Always include a mono font for numerical data, account IDs, and reference codes.

## Don'ts
- Don't use soft, muted colors. Taut is high-contrast and bold.
- Don't add decorative elements. No icons for the sake of beauty. No gradients. No complex shadows.
- Don't round corners heavily. 2–4px is the rule.
- Don't use playful or bounce springs. Motion is confident and controlled.
- Don't waste whitespace. Pack information efficiently.
- Don't use serif fonts or display typefaces. Inter everywhere.
- Don't soften validation feedback. A danger is a danger. A success is a success.
- Don't animate page navigation or layout shifts. Only animate feedback and state.
- Don't mix warm and cool color families in one interface. Stay cool (slate/indigo/emerald/red).
- Don't use --color-on-surface-subtle-* for body text. Always use --color-on-surface for primary reading.

## Personality Test

If you're unsure whether a design decision fits this character, ask:
> Would a CFO trust this interface with their quarterly report? Would they feel in control, confident in every number, certain nothing is hidden?

If the answer is "maybe" or "probably not," redesign it. Taut demands certainty.
