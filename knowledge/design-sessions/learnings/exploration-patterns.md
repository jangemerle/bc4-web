# Exploration Patterns

How to structure Pencil multi-version explorations. Updated from session reactions.

---

## Version count

**6 versions is the sweet spot** for swarm mode. Covers enough ground without becoming overwhelming.
For simpler components or tighter briefs, 4 is enough.

---

## The wild card strategy

Jan explicitly wants **more wild cards**, not fewer. From 2026-03-31:
> "Love your approach with doing 2 wild cards, feel free to up that number as you'll see suited"

### The spectrum (use this to plan each exploration)

```
Safe → Considered → Spicy → Wild → Unhinged
```

For a 6-version exploration:
- **1–2 Safe**: The obvious good answer. Clean execution of the brief. Useful as a baseline.
- **2–3 Considered**: Interesting takes that are still clearly on-brief. The letter, the receipt.
- **1–2 Wild/Unhinged**: Concepts that reframe the entire problem. Could be wrong, could be genius.

**Never do 6 Safe.** Never do 6 Unhinged.

### Wild card ideas that work for Kvalt

These are real-world formats that could become design frames:
- Receipt / invoice / bill
- Personal letter / memo / note
- Field notes / lab notebook
- Ticket / boarding pass
- Form / government document
- Telegram / classified ad
- Book page / chapter heading
- Error message / terminal output
- Product tag / label / hang tag
- Museum label / gallery card

---

## Diversity strategy — the biggest mistake to avoid

**2026-03-31 lesson**: 3 of the 6 versions were all editorial/typographic (Museum, Newspaper, Letter). They clustered.

For every exploration, ensure genuine diversity across these axes:

| Axis | Examples |
|---|---|
| **Dark vs Light** | One dark-bg version, one white-space version |
| **Dense vs Airy** | One information-rich, one minimal |
| **Digital vs Analog** | One screen-native, one real-world-format |
| **Serious vs Playful** | One straight, one with a concept |
| **Type-led vs Image-led** | One driven by typography, one by visuals |

Before writing the prompt: check each version against these axes. If 3 versions share 2+ axes, diversify.

---

## Prompt structure for swarm explorations

```
[Context: what the page/component is and what it needs to communicate]

[Content: the exact copy/information to include in all versions]

VERSION 1 — Agent N: "[Name]"
Style guide tags: [3-4 specific tags]
[2-3 sentences of specific direction — concept, not just aesthetic]
[1-2 specific execution details]

[...repeat for each version]

---
Each frame: [width]px wide, [min-height]px tall, labeled with version name.
Arrange left to right with 80px gaps.
No placeholder boxes — each version should feel finished.
```

---

## Layout variation mode

When Jan picks one concept direction early, use the 6 versions for **layout exploration**
instead of concept exploration. Same content, different structural approaches. This produces
useful variety without the overhead of 6 different conceptual frames.

**2026-04-01 lesson**: "liked all, good variability" — the spread from grid to sidebar to
scoreboard to card-heavy to split-pane to lane-strip was well calibrated.

### Push visual prominence in iteration rounds

After a first pass that's evenly weighted, the second round should push harder:
- Hero-sized stat numbers — Borna Bold or JetBrains Mono at 60-80px+
- One dominant metric per version that commands the layout
- More contrast between "the big thing" and supporting data
- Don't be afraid of asymmetric visual weight

---

## Learning from reactions

After each session, log:
- Which versions Jan explicitly called out (positive and negative)
- His exact words when possible
- The WHY behind the reaction (not just what, but why it worked/failed)
- Update `kvalt-design-voice.md` with any new principles
- Update the sessions log in `_INDEX.md`
