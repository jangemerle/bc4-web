# Whatever Task — First Product Built on Kvalt

**Source:** Cowork sessions — product brainstorming, Computer Use prototype review, v1 scoping
**Added:** 2026-04-09 (updated 2026-04-10 with v1 scope decisions; updated 2026-04-11 after verifying the Figma Make prototype is interactive — keyboard model revised to terminal-inspired arrow-cycling)
**Type:** design decision / product validation

---

## Key Takeaways

### Kvalt as product foundation — validated
"Whatever Task" is a keyboard-first, personality-driven todo app being built on top of Kvalt DS. Jan chose Kvalt as the foundation specifically because dark mode and theming "should be easy" with the character system. This is the first real product validating Kvalt's consumer-facing utility beyond documentation sites. Decision (2026-04-10): the opensource v1 will be **reworked from the ground up** on Kvalt rather than iterating on the Figma Make prototype.

### v1 is explicitly a flat list — no nesting
Original direction capped nesting at 2 levels. **Reversed in 2026-04-10 session** — v1 ships with zero nesting. The reframing: flat list is not a limitation, it's the positioning. Outliners are a crowded space (Workflowy, Dynalist, Tana, Logseq) and a flat keyboard-first list is less crowded and more honest to the "I just want to write my tasks" philosophy. Pitch becomes *"Apple Notes simplicity, text-editor keyboard flow, nothing more."* Nesting can return later as an opt-in power mode.

### Terminal-inspired keyboard model (revised 2026-04-11)
After actually clicking into the Figma Make prototype's task textbox (the earlier "static mock" assumption was wrong — it's interactive), the verified behaviour became the new foundation:

- **Right Arrow at end-of-text** exits the text cursor *into the action button cluster* (check → delete). Left Arrow reverses back into the text. This is the core "terminal-like" move — arrow keys are responsible for both text editing and lateral navigation across the row.
- **Up / Down Arrow** moves between tasks (and through long task content vertically when applicable).
- **Tab** is freed up to handle indent/outdent (nesting is back on the table for v1 as a result, partially walking back the 2026-04-10 "flat-only" lock — nesting is now an open question to resolve in the fresh Claude Code build).
- **Enter** still creates a new task and confirms the current one.
- **Esc** still exits edit mode.

The reason this matters: with arrow keys doing the boundary-crossing between text and actions, the model maps directly to how power users already think about terminals and modal editors. No special mode flag needed — the cursor's position *is* the mode.

### Lesson: never trust "the prototype is static" without verifying
The whole keyboard-model rewrite was triggered by Jan pushing back when Claude initially declared the Figma Make prototype non-interactive. Clicking on the row container did nothing — clicking *directly* on the textbox immediately revealed: focus rings, action buttons appearing, the list scroll-centering on the focused row, full Tab/arrow cycling. The lesson for any future prototype audit: click into the actual interactive elements (textbox, button), not the wrapper. Always read the page DOM for `<input>`, `<button>`, `[role=textbox]` before declaring something a static mock.

### Depth-of-field focus effect = navigation metaphor
The focused task stays vertically centered on screen. Tasks further from the focus point progressively fade out — creating a camera-like "depth of field" effect. With a flat list, this isn't just visual flair, it becomes **the** navigation metaphor: the list scrolls past a fixed focus point, neighbors fade by distance, only one task is sharp at a time. Almost meditative on desktop. The tradeoff: sparse lists (2-3 tasks) feel nearly empty. Accept that tradeoff because "opinionated is what gets shared."

### Design personality as distribution advantage
The app's visual identity (soft blue gradient, pill-shaped rows, Bariol Serif, teal accent) and tone ("Whatever Task" name, Lebowski sample data, "Throw a task here" placeholder) are intentionally distinctive. Quote from session: *"most opensource todo apps are technically interesting but visually generic. Yours is the opposite."* Personality-first design drives GitHub stars and social sharing.

### Pre-filled onboarding over empty states
Ship with pre-filled sample tasks (Lebowski-themed) rather than an empty state + tutorial video. Users need to *feel* the app in 3 seconds, not watch a video. The app should teach itself through interaction. Keyboard hints appear in the bottom corner and fade out after the user demonstrates proficiency (show first ~3 times they focus a task, then never again).

### Completed-task view toggle (Apple Notes reference)
Top-right view toggle is a direct reference to an Apple Notes setting: completed tasks either **stay in place** (option 1) or **sink to the bottom** after all ongoing tasks (option 2). Both modes are valid and users have strong preferences — ship both.

### v1 scope (revised 2026-04-11)
- **Keyboard model**: terminal-inspired — arrow keys cross text↔action boundary; Tab handles indent/outdent (nesting question reopened); Enter creates; Esc exits edit mode
- Vertical centering with depth-of-field fade
- Bariol Serif
- Light + dark mode (via Kvalt character system)
- localStorage persistence, zero backend
- Pre-filled Lebowski tasks on first load
- Keyboard hints fading out after first few uses
- PWA-capable, one-command deploy (Vite + Tailwind)
- Build is being handed off to a fresh Claude Code session via `KICKOFF.md` brief — `whatever-task` repo is 2 commits ahead of main locally as of 2026-04-11

---

## Relevance to Kvalt

1. **Product validation**: Whatever Task proves Kvalt works as a foundation for consumer apps, not just documentation. The character/theming system enables dark mode with minimal effort. Concrete case study for marketing.

2. **Component/hook opportunities**: The depth-of-field focus effect, modal keyboard interaction, and progressive-disclosure action bar could become reusable Kvalt patterns or hooks (`useFocusDepth`, `useModalKeyboard`, `useProgressiveActions`).

3. **"Opinionated is what gets shared"**: Reinforces Kvalt's core thesis — faces encode taste, and taste drives adoption. Whatever Task's visual distinctiveness is a direct result of having a design system with personality built in.

4. **Flat-list positioning parallels Kvalt's anti-framework stance**: both reject a crowded "more powerful" category (outliners / enterprise DS) in favour of a distinctive minimal one (flat list / taste-encoded defaults). Same playbook at different scales.

5. **Open source strategy**: The approach (personality-first, pre-filled demo data, keyboard-native, zero backend, PWA-capable, 5-line keyboard explanation) aligns with Kvalt's own distribution strategy — distinctive defaults that earn organic sharing and fit cleanly in a README screenshot.
