# AI-Assisted Design in Figma via Figma Console MCP

**Source:** evin_svg (YouTube) — "I tried designing in Figma with AI!"
**URL:** https://www.youtube.com/watch?v=1wiuW90QPYU
**Added:** 2026-03-25
**Type:** YouTube video (published March 24, 2026)

---

## Key Takeaways

### 1. Figma Console MCP >> Official Figma MCP
The official Figma MCP is unidirectional (read-only) and produces noisy output. Figma Console MCP (by Southleft) is bidirectional — can read AND write to Figma. Creator says it "totally blows Figma's official tooling out of the water." Note: Figma released beta bidirectional capabilities literally during recording.

### 2. What Claude can do in Figma right now
- Generate entire token systems (colors, typography, spacing) in seconds
- Create component variants with hover/disabled states
- Build alias variable systems (BG primary, secondary, tertiary)
- Dark mode support automatically applied
- Split app screens into reusable components
- Export design tokens to CSS/code files
- Generate React components from Figma designs

### 3. The critical limitation
"None of these models have been trained on any design. If they have, it's very limited to things that are more developer-oriented like Tailwind." This is exactly the gap Kvalt fills — providing the design opinions that AI models lack.

### 4. Quality depends on specificity
Vague prompts = generic output. Specific instructions with design system rules = much better results. Pre-configured design systems with documented conventions dramatically improve AI output quality.

### 5. The creator's verdict
"I don't think any of this is going to replace me or you as a designer anytime soon, but I think it's helpful augmentation and it's only going to get better."

---

## Relevance to Kvalt

This video directly validates Kvalt's core thesis:
1. AI can generate design tokens and components, but the output is generic without design opinions
2. Pre-built token systems (what Kvalt provides) dramatically accelerate the workflow
3. Figma Console MCP could be a distribution/integration channel for Kvalt faces — faces could be applied to Figma projects via MCP
4. The "design system as API" concept aligns perfectly with Kvalt's architecture
5. The creator explicitly identifies the gap: AI is good at developer-oriented tokens (Tailwind) but lacks design taste — that's Kvalt's entire value prop
