# Google Stitch vs Figma AI — Design Agent Wars

**Source:** Adrien | AI Designer (YouTube)
**URL:** https://www.youtube.com/watch?v=V2dMmX2tKwk
**Added:** 2026-04-02

---

## Context

Google launched Stitch (stitch.withgoogle.com), a free AI design agent. Figma stock dropped $2B. Five days later, Figma responded with Claude Code integration for agent-driven design.

## Key Takeaways

### 1. design.mg — Brand Guidelines as AI-Readable Files
- Stitch auto-generates a design system from any uploaded design
- Exports as `.mg` file — a structured brand document any AI tool can consume
- Ensures generated assets stay on-brand (colors, fonts, layout rules)
- Adrien's studio now delivers these to every client as a standard handoff artifact

### 2. Claude Code + Stitch Automation Pipeline
- Custom Claude Code slash command: `/brand-concepts`
- Flow: pulls client research from Notion → analyzes reference screenshots → writes creative concepts → auto-generates 3 landing page variations in Stitch
- One command, fully automated — designs paste into Figma with auto-layout intact
- Human refinement still required; AI gives "foundations" not final output

### 3. Voice-Driven Design
- Stitch has a real-time voice agent — you talk, it designs live
- Can iterate ("change to light mode, make primary blue")
- Impressive demo but limited in practice

### 4. Figma's Response (5 Days Later)
- Changed X bio to "agents meet the canvas"
- Announced Claude Code can control Figma directly — designing by taking over the computer
- Signal: biggest design tools are fully embracing AI agents, not fighting them

### 5. Adrien's Take
- Designers should be excited: more competition = better tools
- The differentiator is **taste** — AI generates, humans judge quality
- Uses Stitch for ideation + design.mg handoffs, Figma for refinement
- "We are not at the point where you can just prompt the AI and it will give you a stunning design you can sell for thousands of dollars"

## Relevance to Kvalt

### design.mg validates the "AI-readable brand context" thesis
Kvalt's token system + face files already serve this exact purpose — codified design intent that AI tools can consume. The `.mg` format is probabilistic brand guidelines; Kvalt faces are precise, deterministic token sets. This is the competitive advantage documented in `competitive-landscape-2026.md`: Stitch DESIGN.md is "probabilistic, not precise."

### Pipeline mirrors multi-agent architecture
Adrien's `/brand-concepts` flow (research → concepts → generation → Figma paste) is structurally identical to the Designer → Builder pipeline. Key difference: Kvalt's pipeline produces production-ready components, not just visual concepts that need manual Figma refinement.

### Figma embracing agents validates MCP-driven design
Figma adding Claude Code integration confirms that the MCP-based design workflow (Figma Console, Pencil) is the direction the industry is heading. Kvalt is already there.

### "Taste as moat" is becoming consensus
Multiple sources now converge on this: AI commoditizes execution, taste/curation is the differentiator. This is exactly what faces encode — opinionated design decisions, not generic defaults.

### Free beta = temporary advantage
Stitch is free during beta with unlimited generations. Worth using for ideation now, but not a foundation to build on. The Stitch integration in the `/brand-concepts` skill could be replicated with Pencil or Recraft for owned infrastructure.
