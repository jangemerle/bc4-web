# Signal — Character Instructions for AI

You are building with the **Signal** character. Everything feels bold, playful, and unmistakably intentional—like it belongs in a design studio portfolio.

## Design Philosophy

- **Expression over restraint.** Signal is confident and saturated. Use bold colors without apology. Rose/coral primary (#F43F5E) is your hero color. Violet accents (#8B5CF6) add creative spark. This is not a timid interface.
- **Generous and approachable.** Large radius (12–16px), spacious padding, oversized touch targets. Everything feels open and inviting, never cramped. Whitespace is a design decision, not an afterthought.
- **Warm, never cold.** Cream backgrounds (#FFFBF5) instead of pure white. Stone text (#1C1917) instead of black. Shadows are warm and diffused. Even the darkness feels welcoming.
- **Motion with personality.** Springs use `spring.playful` with visible overshoot. Things don't just move—they bounce, celebrate, and announce themselves. Motion is fast (no sluggish delays) but never jarring.
- **Sora for impact, Inter for clarity.** Sora (display) is geometric, modern, bold—perfect for headlines and brand moments. Inter (body) is calm and readable, the supporting voice.
- **Design is the product.** Every pixel should feel intentional. Would a creative agency put this in their portfolio? If not, it's not bold enough.

## Token Rules

### Colors
- **Primary (rose #F43F5E):** Use for calls-to-action, highlights, hero moments. It's attention-grabbing and warm—the voice of the interface.
- **Secondary (violet #8B5CF6):** Use for secondary actions, accents, supporting UI. Creates a creative pop without competing with primary.
- **Surfaces (warm cream #FFFBF5):** Never use pure white. Cream backgrounds feel warmer and more designed. Graduated surfaces (FFF7ED, FFEDD5, FED7AA) create subtle depth.
- **Text (stone #1C1917):** High contrast against cream. Subtle variants (57534E, 78716C) for secondary content.
- **Semantic colors:** Success is emerald, warning is amber, danger is rose (matching primary for bold consistency). Keep danger warm and prominent.

### Typography
- **Sora (display):** Headlines, titles, brand moments. Use weights 600–800. Geometric and bold—it has personality.
- **Inter (body):** Paragraph text, labels, descriptions. Weights 400–600. Clean, efficient, readable at all sizes.
- **Size and weight:** Use generous sizing. Don't shrink text to save space. 14px minimum for body, 18px+ for headlines. Generosity = signal clarity.

### Spacing
- **Generous and airy.** Padding inside components: 16px minimum. Gaps between sections: 24px–32px. Signal is not dense; it breathes.
- **Touch targets:** 44px minimum height for interactive elements (buttons, inputs, list items). Large and inviting.
- **Whitespace as strategy.** Don't fill empty space. Let the eye rest. Margin and padding are features, not waste.

### Border Radius
- **Large and rounded.** Signal uses 12px for components, 16px for larger surfaces. Never sharp corners. 9999px for pills and badges.
- **Softness creates approachability.** Generous radius makes the interface feel designed and premium—like a curated product, not a utility.

### Shadows
- **Warm and diffused.** Use shadow-small-2/3 for elevation, shadow-medium-2/3 for cards and panels. Shadows are subtle—they suggest depth without harsh contrast.
- **Avoid hard shadows.** Never use pure black. Shadows have the warm stone tone (rgba(28,25,23, ...)), not cool black.

### Motion
- **Default spring:** Use `spring.playful` for most motion. Press feedback, dropdowns, state changes—everything bounces and celebrates.
- **Timing:** Use `duration.fast` (160ms) for hover, focus, quick feedback. `duration.base` (240ms) for dropdowns and reveals. Never linger—motion is snappy.
- **Visible overshoot.** Let springs overshoot slightly on entrance. Things arriving should feel celebratory, not mechanical.
- **When to cut:** Page transitions and very fast feedback (< 100ms) can cut (no animation). Everything else should move.
- **Transitions:** Use `transition.feedback` for button press (scale + opacity), `transition.celebrate` for success states.

## Do's
- Use rose/coral as a hero color. It's bold and signal's signature.
- Make everything touch-friendly (44px+ targets). Signal is for real people, not tiny pointers.
- Layer surfaces with graduated warm backgrounds. Depth comes from warmth, not darkness.
- Animate on interaction. Signal is playful—every button press, hover, and state change should feel alive.
- Group related content with generous whitespace. Let the eye scan easily.
- Use Sora headlines with 700–800 weight. Make headlines bold and confident.
- Keep text contrast high. Stone on cream has 8+ WCAG AA contrast—legible and beautiful.

## Don'ts
- Don't use pure white (#FFFFFF). Use warm surfaces (#FFFBF5, #FFF7ED, #FFEDD5).
- Don't use pure black or cool shadows. Signal's darkness is warm stone (#1C1917, rgba(28,25,23, ...)).
- Don't make touch targets smaller than 44px. Signal is inclusive and generous.
- Don't use subtle, slow motion. Playful bounces should be visible. Use `spring.playful`, not `spring.default`.
- Don't cram content. Padding and gaps are generous by default. If it feels tight, add space.
- Don't mix fonts. Sora for display, Inter for body. No other fonts.
- Don't compromise on color saturation. Muted pastels are not Signal. Bold and confident is the voice.
- Don't use sharp corners. Every radius should feel soft and designed.

## Personality Test

> **Would a creative agency put this in their portfolio?**

If the answer is no, it's not bold enough. Signal is a design statement. Every choice should be intentional. Colors should pop. Motion should delight. Spacing should feel generous. The whole experience should feel like a premium design product, not a generic utility.
