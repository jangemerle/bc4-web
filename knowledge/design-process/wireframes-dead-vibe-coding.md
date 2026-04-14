# Figma Wireframes Are Dead. Here's How Product Teams Are Replacing Them

**Source:** The Design Project — Diane Alter (YouTube)
**URL:** https://www.youtube.com/watch?v=uwH8sGi-GLQ
**Added:** 2026-03-18
**Type:** YouTube video (~15 min)

---

## Who is Diane Alter / The Design Project

Co-founder of The Design Project, a consultancy working with 50+ B2B SaaS teams (including companies acquired by Slack, Nvidia, MrBeast) to ship faster with AI. She runs design-to-code workshops (Friends of Figma Miami) and publishes weekly on AI + product design workflows. This video is a full walkthrough, not a concept pitch — she builds a real prototype from scratch on camera.

---

## Key Takeaways

### 1. The thesis: wireframes should come back, but not in Figma

Diane's position is counterintuitive: she's not saying skip wireframes. She's saying AI made it too easy to jump straight to hi-fi, and that's why so many AI-built products feel off — they're missing the deep UX thinking that happens when you slow down and map out the flow. Her advocacy: bring wireframes back, but build them as functional prototypes in code (Claude Code), not static Figma frames.

### 2. The full workflow demonstrated

She walks through building an onboarding flow for cal.com from scratch:

1. **Start with a PRD and user flow** — research done in ChatGPT/Claude, flow finalized with the team in FigJam/Figma
2. **Feed the user flow to Claude Code via Figma MCP** — copy the Figma link, Claude Code reads the flow
3. **Use plan mode first** — Claude Code acts as a CTO/co-founder, asking questions before building (where should files go? low-fi or cal.com colors? click-through only or interactive?)
4. **Generate a clickable wireframe in ~20 minutes** — functional prototype with real navigation, step indicators, decision points
5. **Review and iterate in the same codebase** — identify what feels wrong (too many steps, wrong final screen), prompt Claude Code to fix it
6. **Explore alternative patterns** — she builds a second version: chat-based onboarding as an alternative to the step-through flow
7. **Go hi-fi on top of the wireframe** — because it's already in the codebase, you don't start over. Apply the component library, then scale the styling across all steps.

### 3. Why low-fi matters even when hi-fi is free

Key insight: tools like V0 and Lovable output polished UIs, and that polish misleads stakeholders into thinking decisions are final. A wireframe's deliberate roughness invites structural feedback ("is this the right flow?") instead of visual feedback ("I don't like that blue"). By keeping the wireframe stage, you validate structure before committing to design.

### 4. Chat-based onboarding as a real alternative

When Diane realized the step-through onboarding had too many steps, she prompted Claude Code to build an alternative: a chat-based onboarding with an AI assistant ("Cal") that guides users through setup conversationally. Key decisions surfaced in plan mode: free-form responses vs. quick-reply buttons (both), inline components vs. slide-up panels (inline), fade old messages (yes). The result felt less intimidating than 10 sequential steps.

### 5. The speed comparison

Traditional process for a feature: weeks to a month. Wireframing alone: a week. This workflow: 20 minutes to two clickable wireframe options ready for team feedback. And because the wireframe is already in the codebase, going hi-fi doesn't require a rebuild — you build on top of the foundation.

### 6. Figma MCP as the bridge

Figma MCP connects the user flow (in Figma) to Claude Code. Claude reads the flow diagram directly, understands the steps, decision points, and user types. This eliminates the manual translation step between design and development.

---

## Relevance to Kvalt

**Component-first wireframing:** Kvalt's component library is exactly what makes the "wireframe → hi-fi in the same codebase" workflow possible. When every common UI element is already a polished component, going from rough wireframe to production quality is just applying the component library. This is a selling point for the design system.

**Figma MCP integration:** Kvalt already uses Figma MCP (`.skills/figma-to-kvalt/`). The workflow Diane shows — feed Figma link → get structured output → build in code — is the same pipeline we use for component translation. Worth documenting as a recommended workflow for Kvalt users.

**Screen Vault as validation tool:** The Screen Vault pattern (standalone pages in an iframe) could serve exactly this purpose — quick prototypes for UX validation before going production. The `?standalone=<id>` parameter already enables this.

**Structure thinking replacement:** Diane raises an important point: when you skip wireframes, you lose the thinking discipline they enforce. Kvalt could provide user story templates, flow checklists, or a "before you build" prompt checklist that fills this gap for teams using the system.

**Chat-based onboarding pattern:** Worth adding to Kvalt's pattern library if it doesn't exist — conversational UI with inline rich components is becoming a common alternative to step-through wizards.

---

_Full transcript available (13,498 chars). This digest captures the complete workflow walkthrough and the structural argument for wireframe-stage thinking._
