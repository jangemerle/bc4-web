# Session: Pricing Page Exploration
**Date**: 2026-03-31  
**Tool**: Pencil (swarm mode, 6x Claude Opus 4.6)  
**Page**: `/pricing`

---

## What we were redesigning

The existing pricing page: large "Pricing" hero, "The short version" subtitle, 
"Kvalt is free", "You showed up early" statement, Founding Designer certificate card, 
Discord + Browse CTAs. Footer: "* That's the one asterisk. It leads to nothing."

Core message: Kvalt is free. Early users are Founding Designers. No asterisks. Forever.

---

## The 6 versions

| # | Name | Tags used | Jan's reaction |
|---|---|---|---|
| V1 | The Receipt | `monospace`, `paper`, `print`, `typographic` | ❤️ **"fucking love this one"** — "unintrusive sparky humour that suits Kvalt as a project" |
| V2 | The Manifesto | `brutalist`, `editorial`, `bold-type`, `dark-mode` | Not shown / not reacted to |
| V3 | The Museum Label | `refined`, `serif`, `whitespace`, `luxury` | 👎 **"looks like a parte"** (too precious, reads as pretentious) |
| V4 | The Personal Letter | `warm`, `humanist`, `literary`, `cozy` | 👍 **"like the letter idea here"** |
| V5 | The Newspaper | `publication`, `masthead`, `editorial`, `typographic` | 👎 **"too much"** |
| V6 | The Ultra Minimal | `zen`, `whitespace`, `minimalist`, `luxury` | Not shown / not reacted to |

---

## What Jan said (verbatim)

- V1 (Receipt): *"i fucking love this one, thats exactly that unintrusive sparky humour i think suits the kvalt as a project"*
- V3 (Museum): *"this looks like a parte"*
- V4 (Letter): *"like the letter idea here"*
- V5 (Newspaper): *"this is too much"*
- On wild cards: *"Love your approach with doing 2 wild cards, feel free to up that number as youll see suited"*

---

## Lessons extracted → filed to learnings/

### → `kvalt-design-voice.md`
- "Unintrusive sparky humour" is the exact target
- Real-world format as the design frame = powerful for Kvalt
- Humour embedded in metadata/structure, not in headlines
- Museum/gallery aesthetic = too precious for Kvalt
- Newspaper = concept too layered, execution too dense

### → `exploration-patterns.md`
- More wild cards wanted — up to Claude's judgement
- Avoid clustering versions on the same aesthetic axis (3 editorial versions = too similar)

### → `style-guide-tags.md`
- `monospace`, `paper`, `print` = confirmed working
- `warm`, `humanist`, `literary` = confirmed working
- `refined`, `serif`, `luxury` = too precious for Kvalt
- `publication`, `masthead` = over-engineered

---

## Next steps for this page

V1 (Receipt) is the direction. Implement as the actual pricing page:
- Monospace throughout (JetBrains Mono or similar)
- Grey bg, white receipt card
- CASHIER: THE INTERNET metadata detail
- Receipt stub = certificate of recognition
- Black primary CTA, outline secondary CTA
- Footer asterisk as the punchline
