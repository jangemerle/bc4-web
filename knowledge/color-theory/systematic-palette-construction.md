# Building Systematic Color Palettes for Design Systems

**Sources:**
- Lyft Design — Kevyn Arnott, "Re-approaching Color" (design.lyft.com)
- Kevyn Arnott — "Introducing the new ColorBox" (medium.com)
- IBM Carbon — Shixie, "Because, colors are beautiful" (medium.com/carbondesign)
- Mineral UI / CA Technologies — Jeeyoung Jung, "Designing Systematic Colors" (uxplanet.org)
- UXPin — Marcin Treder, "One Color Palette to Rule them All" (medium.com)
- ColorBox.io, Color Wizard (hypejunction.github.io/color-wizard)

**Added:** 2026-03-17

---

## Common Patterns Across Systems

Every mature DS that tackled color systematically converges on the same structure:

1. **10–11 lightness steps per hue** (0/100 being lightest, 100/0 darkest depending on convention)
2. **Numeric naming** (blue-60, red-40) rather than semantic names (sky, cherry)
3. **Grays as the foundation** — built first, all chromatic hues match gray lightness values
4. **Perceptual uniformity** — some form of Lab/LCH/HSLuv to ensure consistent perceived lightness
5. **Accessibility baked into the numbering** — contrast guarantees by level distance, not per-pair testing

---

## Lyft's Approach (ColorBox)

**The breakthrough:** Color palette generation via algorithm, not manual picking.

### Naming: Hue + Modifier
Lyft observed that people naturally describe colors with two pieces: the **hue** (blue, red) and a **modifier** (light, dark). They formalized this as `color-N` where N is 0–100 in steps of 10.

- Names must be **bidirectional** — given "blue-60" you can guess the color, and given the color you can guess "blue-60"
- This eliminated the "15 variations of pink" problem (semantic names like mulberry, violet, purple all pointing to similar colors)

### Algorithm-Driven Generation
Instead of hand-picking colors, Lyft defines:
- Number of steps (11)
- Hue range (start/end on 0–359 wheel)
- Saturation curve (0–1, with adjustable acceleration via Bézier curves)
- Luminosity curve (0–1, also Bézier-controlled)

The algorithm produces deterministic output. **No dependency on individual designers, tools, or monitors.** Same inputs = same palette, forever.

### Accessibility by Number
- Colors **0–50**: accessible (4.5:1) on black backgrounds
- Colors **60–100**: accessible (4.5:1) on white backgrounds
- Knowing the number alone tells you if it's accessible — no tools needed

### ColorBox v2 (2021)
- Multi-color creation in one view (previously one hue per tab)
- Color spaces: HSB, HSL, **LCH** (recommended for perceptual uniformity)
- Export as JSON, share as URL
- Dark mode preview built in
- AI-powered color suggestion (ColorBox AI at colorbox.io/ai)

---

## IBM Carbon's Approach

**Philosophy:** Start from brand identity (IBM Blue), derive everything else from it.

### Grays: More Extremes, Fewer Mid-tones
Enterprise UI needs extreme contrast — dark darks and light lights. Mid-tone grays create muddy, low-contrast containers. IBM concentrates palette density at the extremes.

### Hue Harmony Through Constraint
- IBM Blue is the central axis
- Reds and greens are equidistant from blue on the hue wheel
- All hues carry "a little bit of blue" — this creates automatic harmony
- Hues outside the red-blue-green range were eliminated for disharmony
- Result: "It is hard to put the wrong colors together"

### The Accessibility Grind
104 swatches, all manually adjusted. They use a binary pass/fail WCAG system but note that "even a hair of contrast difference can cause an interface to fail." Their v2 palette fixed ratios that failed by hundredths of a point.

### Dark Theme Insight
- Never use pure #000000 for dark backgrounds — it paradoxically reduces readability
- Provide enough dark-end gradations to build layered dark UIs (containers inside containers)

---

## Mineral UI's Approach (CA Technologies)

**Unique constraint:** Themable color ramps where any ramp can be swapped at runtime.

### The Key Insight: Equal Perceived Weight Across Hues
`blue-60` must have the same perceived contrast as `red-60` or `teal-60`. This is non-negotiable for theming — you swap color-60 for any hue and the UI still works.

### Method
1. Define a target grayscale ramp first (the "perfect gray pattern")
2. For each chromatic hue, use an oval pattern in the color space (not circular — circular pegs out saturation at 100%, looks terrible on dark UI)
3. Continuously verify by converting to grayscale — chromatic swatches must exactly match the corresponding gray
4. Record precise HEX values for development

### Dark Mode by Design
Their ramps are built to be visually appealing in both light and dark modes from the start, not retrofitted.

---

## UXPin's Approach

**Context:** A real-world sprint report — what actually happens when a team builds a palette.

### The Naming Evolution
1. Started with `base-blue`, `gray-lighter-25` (prefix + function + interval)
2. Jina Bolton (Salesforce) suggested **suffixes**: `blue-base`, `blue-lighten-15` — reads more naturally
3. Final: `{color}-{function}-{interval}` (e.g., `blue-lighten-15`, `red-darken-10`)

### The Gray Wars
The team's gray choice (#666666) got "completely destroyed" by senior graphic designers who found it too light. After multiple rounds, they settled on two primary grays: dark (#444444) and light (#f3f3f3). **Lesson:** Gray is the most contentious color in any palette — it touches everything.

### Contrast Pairs Documentation
Manual creation of "contrast pairs" showing which color combinations pass WCAG. Time-consuming but essential. Tools used: color-contrast-checker by heiswayi.

---

## Tools Referenced

| Tool | URL | What it does |
|------|-----|-------------|
| **ColorBox** | colorbox.io | Algorithm-driven palette generation with Bézier curves, LCH support, multi-hue |
| **ColorBox AI** | colorbox.io/ai | AI-powered color suggestions |
| **Color Wizard** | hypejunction.github.io/color-wizard | Systematic palette generator |
| **HSLuv** | hsluv.org | Perceptually uniform HSL alternative |
| **ColorCA** | colorca.org | Color accessibility tool (JS-rendered app) |
| **Colorable** | jxnblk.com/colorable | Contrast ratio checker |
| **Color Review** | color.review | Visual contrast verification |

---

## Relevance to Kvalt

**Naming:** Kvalt uses `palette.primary[100]` through `palette.primary[900]` — numeric, bidirectional, consistent with industry consensus. Good.

**Algorithmic generation:** Kvalt's palette uses HSLuv with manually tuned saturation curves per lightness step. This matches Lyft's approach (Bézier-controlled saturation) and Mineral UI's oval pattern. The manual tuning is correct — pure algorithmic output always needs taste refinement.

**Accessibility by number:** Kvalt could adopt Lyft's rule — document which palette levels are guaranteed accessible on light vs dark backgrounds. This simplifies developer decisions enormously.

**Gray density at extremes:** IBM's insight about concentrating grays at light/dark ends matches Kvalt's 7-level dark mode surface scale. The light mode could benefit from the same density at the light end.

**Theming potential:** If Kvalt ever supports custom themes (white-labeling), the Mineral UI approach of "equal perceived weight across hues" is the blueprint. HSLuv already guarantees this — it's a built-in advantage.

**ColorBox as a companion tool:** Kvalt's documentation could link to ColorBox for teams who want to understand how the palette was generated, or extend it with custom brand hues.
