# Any Model, Any App — Build Your AI OS (Nick Milo / Linking Your Thinking)

**Source:** [Linking Your Thinking — Any Model. Any App. Build Your AI OS to Work Everywhere.](https://youtu.be/jbHB-rzKBAs)
**Duration:** ~15 min
**Date added:** 2026-04-14

## What it is

Nick Milo's "AI OS" — a three-layer architecture for making your personal knowledge and workflows portable across AI tools. Layer 1 is your **ideaverse** (an Obsidian vault or any folder of plain-text notes, organized under ACE: Atlas for knowledge, Calendar for time, Efforts for projects). Layer 2 is **maps + manuals** — two files that act as the translation layer between your ideaverse and whatever tool you're using today. Layer 3 is the actual **tools** (Claude, Cowork, NotebookLM, Codex) — treated as replaceable. The two critical files in layer 2: (a) `me.md` — "who am I, how do I think, how do I want you to work with me" — 50–80 lines, portable, not tool-specific; (b) a **vault map** — a master table of contents describing folder structure, note types, naming conventions, how to create notes on your behalf. `claude.md` at the project root becomes a one-liner: "go read `me.md`." Layer 3 also hosts **skills** — but crucially, Milo argues skills are markdown process documents, not tool features. They live in your ideaverse (`AIOS/skills/`), travel with you, and describe processes ("when I ask for a briefing, do it this way"). The case for doing this now: file-over-app becomes file-over-AI when tools deprecate, APIs break, or you want to switch to local models later without rebuilding your whole setup.

## Key takeaways

- **File over AI.** Your personal config, preferences, and processes should live as markdown in a folder you own — not inside any one tool's proprietary format.
- **Two files do most of the work.** `me.md` (identity, stable) + `vault map` (structure, evolving). Everything else references these.
- **`claude.md` collapses to a pointer.** One line: "Go to `me.md`." Your real config is portable.
- **Skills are documentation, not tools.** A skill is markdown describing a repeatable process. It works in any AI that can read text.
- **Give AI a map, not the whole vault.** 20K interconnected notes eat tokens and confuse models; a map lets it isolate the 5–10 relevant files instantly.
- **Gardener rhythm for maintenance.** Every few weeks, prune `me.md` and vault map. Add, connect, archive. Same cadence as the ideaverse itself.
- **AI-generated content must be marked.** Emoji, tag, or folder — "always know what's yours and what's been AI-assisted."

## Notable comments

- **Cowork on a 5k-note vault → 10k+ connections in minutes** — @dd.oliver (12 votes): let Cowork auto-connect a large Obsidian vault and it edited thousands of notes. Nick's cautionary reply: "Hope you made a backup first. Be wary of AI making that many connections on your behalf." Important warning alongside the capability claim — non-reversible AI edits on a personal KB are high-stakes.
- **Loose control when an agent restructures your KB** — @real-kirillov (2 votes): "Doesn't it now feel like someone else's ideaverse? The key issue is you have loose control of what and why an agent changes." Echoes the Kvalt "vibe-coding-trust-gap" memo applied to knowledge, not code. Same problem: without review scaffolding, agent edits erode ownership.
- **"Caveman" skill for token savings** — @AnthonyAllGood (2 votes): pointer to the `JuliusBrussee/caveman` skill that instructs AI to respond in terse caveman speech to cut tokens without hurting answer quality. Style-as-compression is an angle worth testing for Kvalt's more verbose skills.
- **Start `me.md` with file paths to your most important maps** — Nick (reply): "From there regular wiki links work without any confusion." Concrete implementation tip: the top of `me.md` is a routing table.

## Relevance to Kvalt

Kvalt already uses many of these patterns (docs-first architecture, `CLAUDE.md` as index, skills as markdown), but three ideas are worth stealing: (1) **Collapse `CLAUDE.md` further.** Right now it's ~150 lines of guidelines; could shrink to a pointer file that reads "see `docs/SYSTEM.md` + `docs/conventions.md`" with only the truly session-critical rules inline. Frees ~150 lines of every context. (2) **A `me.md`-equivalent for Jan's working style.** Not a project file — a portable preference file that moves between Kvalt, other projects, and future AI tools. Candidates: terse responses, use `usePress` not `whileTap`, always commit at end, fetch YouTube comments in parallel. Some of this is already in `.auto-memory`, but Milo's framing — a single markdown file Jan owns — is cleaner than a memory index and survives Cowork. (3) **Treat skills as portable artifacts.** Current Kvalt skills live inside `.skills/` tied to this repo. The `kvalt-page-gen` or `figma-to-kvalt` skill is genuinely portable if someone's building a design system with different tokens; version them as standalone `.skill` zips for distribution. Matches the "composable product" memory — skills are the paid-addon layer of the product. Also the comment thread's warning about large-scale agent edits to personal KBs is a cautionary tale for the knowledge base workflow: always commit the knowledge folder before running batch knowledge operations.
