# Ink — Editorial Content-First Design System

You are building with the **Ink** character. It feels like reading a premium literary magazine or well-crafted newsletter — warm, quiet, authoritative. The interface dissolves away. The content is everything.

## Design Philosophy

- **Content over chrome.** The UI is invisible. Every decoration serves the text. No gradients, no splashes of color, no unnecessary motion. The words are the protagonist.
- **Paper-like warmth.** Backgrounds are warm off-white (#FAF9F6), never clinical or clinical white. Shadows are almost nonexistent — rely on borders and whitespace for hierarchy. High contrast text on warm surfaces ensures readability.
- **Typographic authority.** Lora serif for headlines (literary, confident, warm), Inter sans for body (comfortable, clear). Line-height is generous (1.6+). Letter-spacing is ample. Reading is never cramped.
- **Sharp, editorial form.** Border radius is 2px (or none) — typographic, exact, like a printed page. No rounded buttons or soft cards. Every edge is intentional.
- **Slow, quiet motion.** Things arrive gently. No bounce, no drama, no celebration animations. Motion is 240ms–480ms. Springs are conservative. Opacity and color shifts, not scale or position jumps. The reader should barely notice the transition.
- **Warm amber/brown primary.** Ink on paper — #92400E for links, highlights, primary actions. Secondary is warm amber (pale, papery). Success is olive-sage (like book cover cloth). Warning and danger remain warm (orange, red-brown).

> The content is the product. Everything else gets out of the way. Quiet confidence, like a well-designed book.

## Token Rules

### Colors

- **Primary (#92400E):** Warm amber-brown, like ink. Use for links, primary buttons, emphasis, focus states. Never harsh or cold.
- **Secondary (#FFFBEB–#FEF3C7):** Pale warm amber. Use for subtle backgrounds, secondary accents, light highlights. Should feel like aged parchment.
- **Surface & background:** Warm off-white (#FAF9F6) as page background. White (#FFFFFF) for card surfaces, only when needed for contrast. Stone grays (#78716C–#A8A29E) for subtle dividers and placeholder text.
- **Text on surfaces:** High contrast dark (#292524) on warm white/off-white. Subtle text (#57534E, #78716C) only for secondary info or metadata. Never use the primary color for text — reserve it for interactive elements and emphasis.
- **Success (olive-sage #4D7C0F):** Like book cloth or natural plant dyes. Warm, not neon. Use for successful states, completed checkmarks, positive reinforcement.
- **Warning (warm orange #C2410C):** Not bright, not urgent. Warm, grounded. Like a caution flag in a magazine.
- **Danger (warm red #B91C1C):** Warm red-brown, not neon. Serious but not alarming. Like red ink edits on a manuscript.

### Typography

- **Display font:** Lora serif (500, 600, 700 weights). Use for headlines, article titles, section headers, any moment that needs authority and warmth. Lora has generous spacing and warm curves — it reads like a published book.
- **Body font:** Inter sans (400, 500, 600). Clear, comfortable, high readability. Use for paragraphs, navigation, labels, buttons. Generous line-height (1.6–1.8) and letter-spacing (0.5–1px) for long-form reading.
- **Brand font:** Lora serif. Consistency with display.
- **Size & weight:** Prefer larger sizes (16px–18px base for body, 28px–42px for headlines). Weight is medium–bold for display, regular–medium for body. Never use light weight for readability. Prefer weight changes over size changes for hierarchy.

### Spacing

- **Density:** Generous and airy. Content should breathe. Paddings and gaps are larger than typical (16px minimum inside cards, 24px+ between sections).
- **Line-height:** Minimum 1.6 for body text, preferably 1.8 for long-form. Generous vertical space makes reading effortless.
- **Paragraph margins:** 1.5–2em between paragraphs in prose.
- **Grid/list gaps:** 16px–24px. Never cramped. Whitespace is a design tool.

### Border Radius

- **Philosophy:** Sharp and editorial. Radius 0–4px max, anywhere. Never 8px+.
- **Specific values:**
  - Small (buttons, badges, small inputs): 2px
  - Medium (cards, modals): 2px
  - Large (rare, for special cases): 4px
  - Full circle (avatars, icons): 9999px
- **Why:** Sharp edges feel typographic, intentional, like printed matter. Rounded corners break the editorial mood.

### Shadows

- **Philosophy:** Barely there. Rely on borders, whitespace, and color for hierarchy instead.
- **Usage:**
  - Small shadows (small-1: 0px 1px 2px rgba(41,37,36,0.03)): Micro-elevation for hover states, small popovers.
  - Medium shadows (medium-1: 0px 4px 8px rgba(41,37,36,0.03)): Cards, modest popovers, modals.
  - Large shadows (large-2: 0px 8px 16px rgba(41,37,36,0.08)): Rare. Only for critical modals or high-elevation components.
  - Avoid shadow-3 (most intense) unless absolutely necessary.
- **Shadow color:** Warm stone alpha (RGBA of #292524, not pure black). Feels natural on warm paper backgrounds.

### Motion

- **Speed:** Slow and gentle. 240ms–480ms for most transitions. No snappy 100ms feedback (too jarring for an editorial context).
  - `duration.fast` (160ms): Hover states, subtle focus indicators.
  - `duration.base` (240ms): Standard transitions, dropdown reveals, tab switches.
  - `duration.moderate` (340ms): Larger reveals, panel slides, accordion opens.
  - `duration.slow` (480ms): Page transitions, modal enters, major reflows.
- **Springs:** Conservative. Use `spring.default` (not snappy, not playful). No bounce. Motion should feel like turning a page, not a toy.
- **Easing:** `ease.standard` for most state changes. `ease.enter` for arrivals, `ease.exit` for dismissals. Never use jarring easing curves.
- **What to animate:** Opacity, color, blur. Position and scale only for intentional reveal animations (not press feedback). Avoid motion on every interaction — some things should cut instantly.
- **When not to animate:** Form validation, text input focus, rapid list filtering. These should respond instantly or use a very brief 100ms opacity fade.

## Do's

- **Lead with content.** The layout should serve the text, never compete with it.
- **Use Lora serif bold for headlines.** It communicates authority and warmth.
- **Generous whitespace.** Cards, sections, and paragraphs should have breathing room (24px+).
- **Maintain high text contrast.** Dark stone (#292524) on warm white (#FFFFFF or #FAF9F6). WCAG AAA for all body text.
- **Use warm amber for interactive elements.** Links, primary buttons, selected states — always that warm #92400E.
- **Prefer border over shadow.** Use 1px solid border at --color-border (#E7E5E4) instead of drop shadows. Borders feel more editorial.
- **Size buttons and inputs at 44px+ height.** Generous hit targets. Use generous padding (12px vertical, 16px+ horizontal).
- **Motion is optional, never mandatory.** If in doubt, cut the animation and let the layout speak.
- **Test on paper.** Imagine this design printed. Would it look professional? Would the text be readable? If yes, you're on brand.

## Don'ts

- **Don't use neon, bright, or saturated colors.** Everything should feel warm, grounded, natural. No pure #00FF00 or #FF0000.
- **Don't use rounded corners above 4px.** No 12px radius, no `rounded-lg`. Breaks the typographic mood.
- **Don't use heavy shadows.** If you need depth, use a border instead.
- **Don't use light weight for body text.** Weight 300 and under are illegible. Use 400+ (regular or medium).
- **Don't animate scale or position on every click.** Press feedback should be subtle (maybe a 1–2px shrink) or invisible (color + opacity change). Never make the UI feel "bouncy."
- **Don't use sans-serif for headlines.** Lora serif is the voice of Ink. No Borna, no Archia, no system fonts.
- **Don't crowd the page.** Dense information layouts break the reading experience. Prefer scrolling to cramming.
- **Don't add decorative icons, illustrations, or gradients.** Every visual element must serve the text. No flourishes.
- **Don't use bright secondary colors.** Pale, warm, muted only. Think aged book cloth and cream paper.
- **Don't make motion faster than 240ms.** It feels rushed and aggressive. Ink is deliberate, not frantic.

## Personality Test

If you're unsure whether a design decision fits Ink, ask:

> **"Would this feel at home on the website of a premium literary magazine, a well-designed newsletter, or a bestselling author's personal site? Would a book designer recognize this aesthetic?"**

If yes → it fits Ink. If no → reconsider.

Additional questions:
- "Is the content the star, or is the UI fighting for attention?"
- "Could I print this page and hang it in a library?"
- "Would removing 50% of the decoration make it better?"
- "Is every color, motion, and shape serving the text?"

Ink succeeds when the reader forgets they're looking at an interface and loses themselves in the content.
