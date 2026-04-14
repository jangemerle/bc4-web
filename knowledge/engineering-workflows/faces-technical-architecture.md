# Faces Technical Architecture — How shadcn Distributes & How Kvalt Should

**Source:** shadcn/ui GitHub, CLI source code, registry docs, preset encoding analysis, MCP server docs
**Added:** 2026-03-25
**Type:** Engineering research

---

## How shadcn/ui distributes (the model to follow)

### CLI architecture
- `npx shadcn@latest init` — scaffolds project config, installs dependencies, creates `components.json`
- `npx shadcn@latest add button` — copies component source code into your project (not npm install)
- Components are resolved from a **registry** — a JSON manifest listing every component with its files, dependencies, and CSS variables
- User owns the code — no vendor lock-in, full modification rights

### Registry system
- JSON-based component registry at `ui.shadcn.com/registry`
- Each component entry includes: name, type, files (with content), dependencies, registryDependencies, cssVars, tailwind config
- Third parties can create custom registries pointing to their own component sources
- The CLI can consume any registry URL — not locked to shadcn's official one

### Preset encoding (March 2026)
- 7-character Base62 codes (0-9, A-Z, a-z) encoding 8 parameters into 40 bits:
  - Primary color (16 options, 4 bits)
  - Surface color/gray (8 options, 3 bits)
  - Font heading + body (selection from curated pairs)
  - Border radius (5 levels, 3 bits)
  - Icon library (lucide, radix, phosphor)
  - Visual style (Vega, Nova, Maia, Lyra, Mira)
  - Base primitive (Radix UI or Base UI)
- 13 bits reserved for future expansion (animation? spacing? typography scale?)
- Codes are URL-safe, shareable, embeddable

### MCP server
- Exposes component browsing and installation via natural language
- Operations: list components, get component details, install component, search
- Cursor users can say "add a data table" and the MCP handles resolution + installation
- Authentication via API key

## What a Kvalt "face" should technically contain

Based on shadcn's architecture + Kvalt's existing token system + what presets are missing:

### Face file structure
```
faces/fintech/
├── face.json          # Manifest: name, description, version, dependencies
├── tokens/
│   ├── colors.ts      # Color palette (semantic tokens, not raw values)
│   ├── typography.ts   # Font families, scale, weights, line-heights, letter-spacing
│   ├── spacing.ts      # Spacing scale, component-specific overrides
│   ├── radius.ts       # Border radius tokens
│   ├── shadows.ts      # Elevation system
│   └── motion.ts       # Spring configs, durations, easings, transitions
├── variables.css       # CSS custom properties (Tailwind v4 compatible)
├── tailwind.config.ts  # Tailwind theme extensions
├── components/         # Optional: face-specific component overrides
│   ├── button.tsx      # Override default button styling/behavior
│   └── card.tsx        # Override default card styling/behavior
└── claude.md           # AI instructions for this face (how Claude should build with it)
```

### What a face encodes that a shadcn preset doesn't

| Layer | shadcn preset | Kvalt face |
|-------|--------------|------------|
| Colors | Yes (16 options) | Yes (full semantic palette) |
| Fonts | Yes (pair selection) | Yes + scale, weights, line-heights, roles |
| Radius | Yes (5 levels) | Yes + component-specific overrides |
| Icons | Yes (library choice) | Yes |
| Spacing | Partial (style variant) | Full spatial rhythm system |
| Motion | No (reserved bits) | Full: springs, durations, easings, transitions |
| Shadows | No | Full elevation system |
| Typography hierarchy | No | Heading scale, text roles, responsive sizing |
| Interaction patterns | No | Press feedback, focus behavior, hover timing |
| Design intent | No | claude.md with philosophy and guidelines |
| Component overrides | No | Optional per-face component customization |

### Distribution mechanism

**Phase 1 (MVP):** GitHub repo + CLAUDE.md + manual copy
- User clones face folder into their project
- CLAUDE.md instructs AI tools to use face tokens
- Lowest friction, highest manual effort

**Phase 2 (CLI):** `npx @kvalt/faces add fintech`
- Mirrors shadcn CLI mental model
- Resolves from Kvalt registry
- Copies face source into project (user owns it)
- Updates tailwind config and CSS variables

**Phase 3 (MCP):** Kvalt MCP server
- AI tools connect and receive active face context
- Dynamic face switching via natural language
- "Switch to the fintech face" in Cursor/Claude Code

**Phase 4 (Preset codes):** Kvalt preset encoding
- Similar to shadcn's 7-char codes but encoding more parameters (motion, spacing, typography)
- Shareable, embeddable, URL-safe
- Powers the "same app, different face" demo site

### shadcn compatibility

Faces should work ON TOP of shadcn, not replace it:
1. User has existing shadcn project
2. `npx @kvalt/faces add fintech` adds face tokens + CSS variables + optional component overrides
3. Existing shadcn components pick up new visual identity via CSS variables
4. Motion layer adds animation tokens that shadcn doesn't have
5. Typography and spacing layers refine what shadcn leaves generic

---

## Relevance to Kvalt

This architecture positions faces as a strict superset of shadcn presets — everything a preset does, plus motion, typography hierarchy, spatial rhythm, shadows, interaction patterns, and design intent (claude.md). The CLI distribution matches existing developer mental models. The phased rollout lets Jan ship the MVP (GitHub + CLAUDE.md) immediately while building toward the full CLI/MCP system.
