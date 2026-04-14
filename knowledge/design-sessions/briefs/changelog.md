# Concept Brief: Changelog / What's New

**Page type:** Screen Vault — creative + functional hybrid
**Route:** `/screen-vault/changelog`
**DS components used:** Badge, Chip, UserAvatarLabel, Button, Tabs, Skeleton

---

## What this page communicates

A running log of product updates — versions, features, fixes, dates. Every SaaS has one and
almost all of them are boring. The content is inherently list-like and temporal, which makes
the format choice critical — it's the difference between "scan and close" and "actually want
to read this."

---

## The versions (6)

### VERSION 1 — "The Lab Notebook"
```
Format:      Field researcher's notebook — ruled pages, handwritten annotations, specimen entries
Why it fits:  Each release is an "experiment." Results, observations, side effects.
             The analog format makes software updates feel tactile and human.
Voice hit:   Real-world frame. Functional first (the entries ARE the content). Negative space
             between entries feels like page turns.
Spectrum:    Considered
Risk:        Could feel hipster if the handwritten aesthetic is overdone. Keep it structured.
```
**Tags:** `paper`, `print`, `monospace`, `warm`
**Voice pre-check:** ✅ Concept is the design, ✅ One idea, ✅ Dry, ✅ Real-world frame

---

### VERSION 2 — "The Commit Log"
```
Format:      Git log output — hashes, authors, timestamps, diff stats (+++ / ---)
Why it fits:  The audience literally reads these every day. A changelog AS a commit log
             is zero-friction: they already know how to scan it.
Voice hit:   Functional first. Format matches audience's reality. Dry humour in commit
             messages ("fix: stopped the thing from doing the other thing").
Spectrum:    Considered
Risk:        Very close to the Terminal concept used on 404/Pricing. Different enough?
             Yes — this is git log specifically, not a generic terminal.
```
**Tags:** `monospace`, `code`, `dark`, `technical`
**Voice pre-check:** ✅ Concept is the design, ✅ One idea, ✅ Dry, ✅ Real-world frame

---

### VERSION 3 — "The Newspaper Column"
```
Format:      Newspaper "recent developments" column — datelines, bylines, column layout
Why it fits:  Each update is a story. Bylines = contributors. Datelines = versions.
             Typography-driven, editorial feel.
Voice hit:   Real-world frame. Could be clean if kept to a single column (not full newspaper).
Spectrum:    Considered
Risk:        Newspaper was rejected for Pricing ("too much"). BUT that was the full newspaper
             with masthead + classified + columns. A single COLUMN is simpler. Test it.
```
**Tags:** `editorial`, `typographic`, `serif`, `light`
**Voice pre-check:** ✅ Concept is the design, ✅ One idea, ⚠️ Dry (depends on copy), ✅ Real-world frame

---

### VERSION 4 — "The Patch Notes"
```
Format:      Video game patch notes — version headers, categorized changes (BUFFS, NERFS, 
             BUG FIXES, NEW), rarity badges for features
Why it fits:  Patch notes are a cultural format the dev/design audience loves. "LEGENDARY:
             Dark mode" is immediately understood and fun without being loud.
Voice hit:   Concept is the design. Dry humour through gaming taxonomy applied to software.
             Functional — the categories actually help scanning.
Spectrum:    Spicy
Risk:        Could feel too playful for some visitors. Might not read as "serious tool."
```
**Tags:** `bold`, `dark`, `technical`, `minimal`
**Voice pre-check:** ✅ Concept is the design, ✅ One idea, ✅ Dry (taxonomy IS the joke), ✅ Real-world frame

---

### VERSION 5 — "The Police Evidence Board"
```
Format:      Cork board with pinned notes, red string connections between related changes,
             polaroid-style screenshots, push pins, evidence tags with dates
Why it fits:  Each release "solves a case." Related changes are literally connected.
             The physicality is unexpected for a changelog. Visual-first, not text-first.
Voice hit:   Real-world frame from a completely different domain. Dry through context
             (treating bug fixes as criminal investigations). Negative space = cork texture.
Spectrum:    Wild
Risk:        Execution-heavy — lots of visual elements to manage. Could look messy.
             Might not scan well as an actual changelog (form over function).
```
**Tags:** `warm`, `paper`, `expressive`, `dark`
**Voice pre-check:** ✅ Concept is the design, ⚠️ One idea (could get busy), ✅ Dry, ✅ Real-world frame

---

### VERSION 6 — "The Shipping Manifest"
```
Format:      Cargo shipping document — container IDs (version numbers), contents list,
             origin/destination, weight (impact), handling instructions (breaking changes)
Why it fits:  "Shipping" is already the word devs use. The format literalises the metaphor.
             Each release is a shipment with contents and handling instructions.
Voice hit:   Concept IS the design — the word "ship" does double duty. Dry through
             bureaucratic format applied to software updates. Clean, structured.
Spectrum:    Spicy
Risk:        Could feel forced if the shipping metaphor doesn't map naturally to all
             change types. "Handling: FRAGILE — breaking change" works. "Weight: 3.2kg"
             for a button color change... less so.
```
**Tags:** `monospace`, `paper`, `print`, `minimal`
**Voice pre-check:** ✅ Concept is the design, ✅ One idea, ✅ Dry, ✅ Real-world frame

---

## Diversity check

| Version | Dark/Light | Dense/Airy | Digital/Analog | Serious/Playful | Type/Image |
|---|---|---|---|---|---|
| V1 Lab Notebook | Light | Airy | Analog | Serious | Type-led |
| V2 Commit Log | Dark | Dense | Digital | Serious | Type-led |
| V3 Newspaper Column | Light | Airy | Analog | Serious | Type-led |
| V4 Patch Notes | Dark | Dense | Digital | Playful | Type-led |
| V5 Evidence Board | Dark | Dense | Analog | Playful | Image-led |
| V6 Shipping Manifest | Light | Airy | Analog | Serious | Type-led |

**3 dark, 3 light** ✅ | **3 dense, 3 airy** ✅ | **1 digital, rest analog** ⚠️ (but the digital one IS native) | **2 playful** ✅ | **1 image-led** ⚠️ (acceptable — changelogs are inherently text content)
