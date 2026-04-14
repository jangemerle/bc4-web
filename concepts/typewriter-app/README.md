---
type: concept
status: idea
captured: 2026-04-10
author: Jan
---

# Typewriter — creative writing canvas with Claude

> A typewriter-soul app for long-form creative writing, where the worldbuilding
> orbits the page instead of hiding in a file tree.

## The pitch

Most writing apps ask you to switch contexts — one tab for the draft, another for the wiki, a third for brainstorming notes, a fourth for the Claude chat. Every switch costs momentum. Every switch is a little betrayal of the sentence you were halfway through.

Typewriter keeps the page at the center. Around it, the knowledge base floats — characters, places, plot threads, style references, brainstorm fragments. As the text being written (or the conversation with Claude) shifts, the relevant material drifts inward. Older topics drift outward but don't disappear. You never leave the page to find something; the something finds you.

## The core interaction

```
          [ archived chapter 2 ]        [ style-guide: voice ]

  [ alien.md ]                                    [ shard-types.md ]

                    ┌──────────────────────┐
                    │                      │
                    │   TYPEWRITER PAGE    │
                    │                      │
                    │   the active draft   │
                    │                      │
                    └──────────────────────┘

  [ cathedral.md ]                               [ monuments.md ]

          [ brainstorm: fauna ]           [ craft-tracker.md ]
```

- **Center**: the typewriter area. Single font (Playwrite CZ for the Kavárna vibe, or user's choice). Ambient line-wrap, minimal chrome, no distractions.
- **Orbit**: floating file tiles representing entries from the writer's knowledge base. Size + proximity + opacity encode relevance.
- **Claude chat**: a collapsible sidecar (or a second orbiting object) where the writer can talk to Claude about the current scene. Whatever the conversation touches influences the clustering.

## Relevance clustering

Not a hierarchy. Not a file tree. A living orbit.

Signals that pull a file inward:

1. **Recency in conversation** — Claude mentioned it in the last N turns (strongest signal)
2. **Recency in text** — the writer typed a name/keyword from that file in the active paragraph
3. **Tag / frontmatter overlap** — the file shares tags with the current chapter
4. **Recently opened** — the writer just touched it
5. **Semantic similarity** — embedding-based match between the active paragraph and the file content (slower, optional)

Signals that let a file drift outward: time since last touch, lack of mention, topic divergence.

Clustering is a soft force layout, not a hard sort. Files ease between positions. No sudden jumps. Spatial memory matters — the reader should recognize "oh, the Maldi files always live in the upper-left."

## Reference use case — Jan's writing repo

`/Users/jan/Dev/writing/writing` is the exact shape Typewriter is designed for. Current structure:

```
writing/
├── _inbox/                    # unsorted quick dumps
├── projects/
│   └── the-forefathers/       # "The Forefathers" — active novel
│       ├── wiki/              # worldbuilding canon
│       │   ├── INDEX.md
│       │   ├── alien.md
│       │   ├── cathedral.md
│       │   ├── catastrophe.md
│       │   ├── humanoids.md
│       │   ├── monuments.md
│       │   ├── shard-types.md
│       │   └── shards-overview.md
│       ├── chapters/          # prose drafts
│       │   └── maldi-at-the-cathedral.md
│       ├── brainstorming/     # exploratory notes (colors, fauna, food, haikus, etc.)
│       ├── names/
│       ├── craft-tracker.md
│       └── creative-todo.md
├── style-guides/              # voice/tone rules
└── archive/                   # paused ideas
```

Typewriter should read this as a read-write source of truth. When Jan opens the app in `projects/the-forefathers/`:

- The typewriter area opens the most recently-edited file in `chapters/` (or a blank page).
- The orbit is seeded with everything in `wiki/`, `brainstorming/`, and `style-guides/`.
- `_inbox/` items drift at the outer edge as "loose thoughts" available for pull-in.
- `archive/` is invisible unless explicitly searched.

A test case: while writing the scene at the cathedral, Jan types "shard" and mentions "Maldi" out loud to Claude. `cathedral.md`, `shard-types.md`, `shards-overview.md`, and the Maldi brainstorms should all drift toward the center within a beat. That's the whole loop.

## Architecture sketch

This is rough — revisit before building.

### Tech stack

- **Frontend**: React + Kvalt DS + Kavárna character
  - Typewriter area: `<textarea>` or a minimal contenteditable with Playwrite CZ / Borna for headlines, Inter for body
  - Orbit: absolutely-positioned Kvalt `<Card variant="outlined">` tiles with motion springs
  - Chat sidecar: `<Modal bare>` or a floating panel
- **Runtime**: Tauri (desktop) or a Vite web app with File System Access API (browser, chromium-only)
  - Tauri gives proper filesystem permission + native feel; web version is a quick demo path
- **State**:
  - File index (metadata + content hash) — IndexedDB cache, file system as truth
  - Recency window — ring buffer of last N conversation turns + last N typed paragraphs
  - Embedding cache (optional) — computed lazily per file, stored locally
- **Claude integration**: Anthropic SDK with prompt caching, streaming, tool use for `read_file` / `list_dir` / `suggest_wiki_entry`. The same skills Jan already uses.

### Layout engine

Physics-lite force layout, not D3. Each file has a target `{ x, y, opacity, scale }` computed every tick from the signal weights above. Motion springs (`spring.default` or `spring.playful`) ease between targets. Files with zero signal snap to a perimeter orbit and fade to ~40% opacity. Max 20–30 visible tiles at once; the rest live in a collapsible "more" drawer.

### File relevance scoring

```
score(file) =
    recencyInChat(file)      * 0.4
  + recencyInText(file)      * 0.25
  + tagOverlap(file)         * 0.15
  + recentlyOpened(file)     * 0.1
  + semanticSimilarity(file) * 0.1
```

Weights live in a config file and are tunable. Each signal normalized to 0–1.

## Why Kvalt

- **Kavárna character** (coral + navy + Playwrite CZ + peach-tinted paper + dot grid) is *exactly* the mood for a literary writing app. Built for this.
- **GlassSurface** primitive for the floating tile depth
- **Motion tokens** for the spring physics (the orbit needs `spring.default` and `spring.playful`)
- **Tone of voice** rules for any UI copy — dry, warm, brief
- **Character system** — let the writer pick their own mood if Kavárna isn't right for their book

## Open questions

- Desktop vs web first? Tauri is heavier but gives proper FS access. Web is faster to prototype.
- How does the writer resolve conflicts between "I'm actively writing this" and "Claude wants to edit it"? Read-only-mode toggle?
- Embedding model — local (Transformers.js) or API? Local is slower but offline; API is faster but ties the writer to a service.
- Orbit density — what's the cap before it feels busy? 20 tiles? 15? Worth testing with real content.
- How does the writer manage the reverse flow — dictating edits back into the wiki? "Claude, add this sentence to `shard-types.md`" should Just Work.
- Multiple active projects — one book open at a time, or cross-project orbit?

## Naming

Working title: **Typewriter**. Too generic for a final product name — revisit. Candidates to explore:

- **Orbit** — the core metaphor, one word, evocative
- **Scriptorium** — medieval writing room, heavy, maybe too much
- **Maldi** — character name from The Forefathers; personal reference, not shippable
- **Kavárna** — would conflict with the Kvalt character name
- **Keystroke** — feels technical
- **Margin** — quiet, literary, suggests "the space around the page"

## Next steps (when this becomes real)

1. Kvalt monorepo restructure — move Kvalt into `packages/kvalt-ds`, add `apps/typewriter` alongside `apps/styleguide`
2. Wire Kavárna as the default character
3. Prototype the orbit: static positions, 10 fake files, see if the spatial metaphor actually reads
4. Build the file index reader pointing at `/Users/jan/Dev/writing/writing/projects/the-forefathers`
5. Hook up Claude chat
6. Build the relevance scoring loop
7. User test on an actual writing session (one chapter, one hour, see what breaks)
