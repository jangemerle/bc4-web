# Google Stitch

**URL:** https://stitch.withgoogle.com
**Category:** Competitor (adjacent — AI design tool, not design personality)
**Added:** 2026-03-25
**Context:** Shared by CTO David Cerny as proposed workflow alternative

---

## What it is
Free AI-native UI design platform from Google Labs, powered by Gemini 2.5 Pro. Evolved from Galileo AI acquisition. Generates high-fidelity UI designs from text, voice, sketch, or image prompts. 350 free generations/month.

## Key capabilities
- Text/voice/sketch/image → high-fidelity UI designs in seconds
- Exports to Figma, HTML/CSS, Tailwind CSS, React/JSX
- "Vibe design" generates 4+ layout variants from single prompt
- DESIGN.md — markdown file encoding design system rules fed to Gemini
- Interactive prototype flows with transitions
- MCP server/SDK for integration with coding tools

## Key weaknesses (= Kvalt's opportunity)
- **Generic output without explicit brand direction** — "limited set of layout structures, outputs look similar with only minor variations"
- **DESIGN.md uses probabilistic judgment** — guides loosely, doesn't enforce. Kvalt enforces through actual code.
- **No motion system** — generates static designs
- **No accessibility guarantees** — weak contrast, insufficient touch targets, missing focus states
- **No component reuse** — each generation is isolated

## Strategic context
David Cerny (CTO) proposed: Stitch → HTML export → GitHub → Claude AI + shadcn → deploy. This workflow produces generic output at every step. Kvalt's existing workflow (Figma → Claude Code + opinionated tokens) produces distinctive output because design opinions are enforced at code level.

## Relevance to Kvalt
Stitch validates the market for AI-accelerated design but proves the "generic output" problem is unsolved. Kvalt faces are the layer that transforms Stitch/AI output from generic to distinctive. Stitch makes Kvalt more valuable, not less. Caused Figma stock to drop 8.8% (March 2026).
