# The 7 Levels of Claude Code Design

**Source:** Chase AI (YouTube)
**URL:** https://youtu.be/1PXFAFMgdns
**Added:** 2026-03-27
**Category:** engineering-workflows

---

## Overview

A progression framework for front-end design quality when using Claude Code. Each level builds on the previous, adding tools and skills that move output from generic AI slop to crafted, original work.

## The 7 Levels

### Level 1: Raw Prompting
Just you and a prompt. Generic results because Claude Code has no design direction. Output: purple gradients, generic SaaS templates.

**Skills to develop:** Descriptive prompts, framework awareness (Next.js, Astro, etc.), basic design vocabulary. Plan mode helps by forcing design decisions (text stack, style, page goals).

**Trap:** Staying here because "AI has no taste." The real problem: most people can't *articulate* taste.

### Level 2: Design Skills/Plugins
Inject Claude Code with specialized design prompts (e.g., UIUX Pro Max skill — 52K stars on GitHub). These act as checklists covering color theory, typography, spacing, anti-slop patterns.

**Result:** Designed AI template — better colors, glows, section breaks — but still recognizably AI-generated at its core.

**Trap:** Thinking skills alone solve the design problem. They raise the floor but not the ceiling.

### Level 3: Visual Director (Screenshots as References)
Show, don't just tell. Feed Claude Code screenshots from inspiration sites:
- **awwwards** (3 W's) — graded creative work
- **godly.website** — infinite scroll gallery
- **Pinterest** — surprisingly good SaaS landing page inspiration
- **Dribbble** (3 B's) — design community

**Key insight:** Looking at references educates *you* — you start recognizing patterns and building vocabulary. Combine references from multiple sites.

**Trap:** The "vibe gap" — screenshots get you ~50% there. Iterating with screenshot→prompt→screenshot loops is slow and never fully closes the gap because of the visual-to-code translation loss.

### Level 4: The Cloner (Source Code Deconstruction)
Go beyond surface screenshots — extract the actual HTML/CSS/JS from sites you admire.

**Process:**
1. `Ctrl+U` on a website to view HTML source
2. Copy the full HTML into Claude Code
3. Tell Claude Code to also fetch and analyze the linked CSS and JS files (not via WebFetch's summarized model — use a site teardown skill that grabs full files)
4. Use the code as a template foundation, not a copy

**Why this educates you:** You can now ask Claude Code *how* specific effects work (backgrounds, scroll animations, parallax). Each clone teaches new techniques and vocabulary.

**Skills to develop:** Read and understand source code, identify which techniques produce each effect, adapt clone patterns to your own designs.

**Trap:** "Clone ceiling" — copying without understanding the why. Can't create, only reproduce.

### Level 5: Custom Assets & Components
Stop copying, start creating. Two paths:

**Component libraries:**
- **21st.dev** — browse buttons, carousels, scroll areas, nav menus, etc. Copy the prompt/code into Claude Code
- **CodePen** — interactive demos with code
- **Monae** — another component source

**Custom imagery:**
- Use AI image generation (MidJourney, Nano Banana Pro, Cadream) for original hero artwork
- Visual storytelling: tie imagery to your product's narrative (e.g., Argus = mythological figure with 10,000 eyes → "See What's Next")
- Convert still images to subtle video backgrounds (Kling 3.0, VO 3.1) — use start+end frame for loop, keep motion subtle
- Performance: serve video on desktop, still image on mobile

**Details that matter:** Loading animations, counter animations, scroll progress bars, hover lighting effects, custom fonts (Google Fonts). "These little things — most people won't notice individually, but combined they make it feel crafted."

### Level 6: Visual Design Tools (Iterate Outside Claude Code)
Break out of the terminal for visual iteration:

- **Stitch** (Google, free) — visual canvas for redesigning sections, variant generation
- **Paper.design** — visual editor
- **Pencil.dev** — real-time canvas, works with Cursor/VS Code
- **Figma** — the classic

**Workflow:** Screenshot your current site → redesign in visual tool → screenshot the redesign → bring back to Claude Code for implementation.

This level is really about creative self-expression — using Claude Code as *your* tool rather than being along for the ride.

**Pro tip:** Tell Claude Code to web search for best practices on specific effects (glassmorphism, card depth, premium feel) and propose ideas — then curate what you keep.

### Level 7: The Frontier (3D / WebGL / Shaders)
Custom WebGL, shaders, full 3D experiences. Websites that look like video games. Currently out of reach for most AI-assisted workflows (March 2026). Examples on awwwards "Site of the Day."

Included as aspiration, not practical guidance.

## Key Takeaways

1. **"AI has no taste" is really "people can't articulate taste"** — and they can't articulate it because they lack the vocabulary. The progression naturally builds that vocabulary.

2. **Cloning is the highest-leverage learning activity.** Not for plagiarism — for understanding how professionals build. Every clone teaches techniques you didn't know existed.

3. **The craft is in the details.** Loading animations, font choices, scroll behaviors, hover states, section transitions. Individually invisible, collectively transformative.

4. **Skills raise the floor, not the ceiling.** They prevent the worst AI slop but won't produce original work alone.

5. **Visual-to-code translation is inherently lossy.** Screenshots help but have limits. Source code extraction is the breakthrough.

## Relevance to Kvalt

- **Validates the "taste as moat" thesis.** The whole video is about how most people can't articulate design quality to AI — which is exactly the gap Kvalt faces fill. Faces encode taste as code, skipping the articulation problem entirely.

- **Levels 1-3 are Kvalt's target customer pain.** People stuck in generic output who need design direction. Kvalt faces solve this by providing the design system, tokens, motion, and typography hierarchy that Claude Code lacks by default.

- **Level 4 technique (source deconstruction) maps to how faces work.** A face is essentially a pre-deconstructed, pre-encoded design system. Instead of users needing to clone and extract, they install a face.

- **Component libraries (Level 5) are Kvalt's playing field.** 21st.dev, CodePen, etc. are component sources without cohesive design systems. Kvalt provides the cohesion layer.

- **The progression confirms Kvalt's educational content strategy.** Teaching this workflow (with Kvalt faces as the shortcut) could be powerful YouTube content — "skip to Level 5 with faces."

- **"Domain expertise is the moat" aligns with Kvalt philosophy.** The video repeatedly emphasizes that the human's design eye, not the tool, determines quality.
