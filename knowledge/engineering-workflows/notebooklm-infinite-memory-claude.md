# NotebookLM + Claude Code/Cowork = Infinite Memory

**Source:** Jack Roberts (YouTube) — "Claude Code + NoteBookLM = Infinite Memory"
**URL:** https://www.youtube.com/watch?v=6t32nPxeJb8
**Added:** 2026-04-01

---

## Key Concept

Connect Google's NotebookLM to Claude Code and Cowork as an external RAG-based memory layer. Instead of cramming hundreds of pages of context into Claude's window (burning tokens), you make a single API call to NotebookLM which does semantic search across all your stored knowledge and returns only the relevant result.

## How It Works

1. **Install via skill** — A Claude Code skill installs an unofficial NotebookLM Python connector (from GitHub). It authenticates via browser cookie token.
2. **Bidirectional access** — Once connected, Claude can create notebooks, add sources, query notebooks, and download generated assets (infographics, cinematic videos, audio overviews) — all from within Claude Code or Cowork.
3. **Cowork integration** — A separate `.md` skill file is uploaded to Cowork's skill manager, giving Cowork sessions the same NotebookLM access.

## Three Use Cases Demonstrated

### 1. Enrichment (deeper research without burning tokens)
- Mid-conversation, tell Claude to create a NotebookLM notebook from the current project context
- NotebookLM ingests all sources (70+ in the demo), runs deep research on Google's side
- Claude gets back distilled insights without processing all that context itself
- Works especially well inside Cowork Projects where additional context is available

### 2. Programmatic Asset Creation (free generation)
- NotebookLM generates infographics, cinematic videos, podcasts, social content — all free
- Claude orchestrates: "create an infographic in NotebookLM with these specs, bring it back"
- Zero token cost for the generation itself — the API call is the only Claude cost
- Also enables: competitive intelligence, market synthesis, due diligence, SOP generation

### 3. Long-Term Memory via "Wrap-Up Skill" (the big one)
- A "wrap-up" skill is activated at the end of large sessions
- It takes the entire conversation and stores a structured summary in a dedicated "Brain" notebook in NotebookLM (e.g., "Jack's Brain")
- This notebook grows over time — every session adds to it
- In future sessions, Claude can query the Brain notebook via semantic search to recall any past decision, context, or rationale
- Add to project instructions: "whenever answering questions about strategy, always consult the [brain notebook] in NotebookLM"
- Result: one lightweight API call retrieves exactly the relevant past context, instead of loading massive memory files

## Why This Matters (Token Economics)

The core insight is about **token cost vs. context quality**:
- Reading many files into Claude's context = expensive, eats token budget, causes people to "run out" of Cowork/Code usage
- NotebookLM as external RAG = one API call out, all processing happens on Google's side (free), only the distilled answer comes back
- "Jab and get results back" — minimal token spend for maximum context retrieval
- Also solves the Obsidian integration problem where connecting large vaults blazes through context

## Relevance to Kvalt

- **Memory architecture pattern** — Kvalt's own knowledge base (`knowledge/`) and auto-memory system follow a similar principle (structured storage → selective retrieval). NotebookLM could be a more scalable external layer if the knowledge base grows very large.
- **Skills as distribution** — Both skills demonstrated (NotebookLM connector + Wrap-Up) are shared as downloadable files. Validates the "skills as distribution channel" pattern we've seen across multiple sources.
- **Token efficiency** — Directly relevant to how we think about Kvalt's spec-to-shadcn pipeline. If specs are large, an external RAG layer could help the receiving FE team's AI tools consume them more efficiently.
- **Cowork Project integration** — Shows the Cowork Projects feature adding significant value by providing richer context for enrichment workflows.
