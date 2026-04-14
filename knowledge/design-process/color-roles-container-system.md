# Color Roles & Container System — M3 Analysis for Kvalt

**Added:** 2026-04-06
**Type:** Design system architecture research
**Source:** Material Design 3 color system analysis + Kvalt character requirements

---

## The problem

Kvalt characters currently override 53 CSS variables with hardcoded values. This means:
- Every character needs manual color picking for all 53 tokens
- No systematic way to flip "polarity" (light-on-dark vs dark-on-light primary buttons)
- Contrast levels aren't a character property — they're implicit in the values chosen

## How M3 solves this: color roles

Every color in M3 has a **container/on-container pair**:

```
Primary              → strong color, used for prominent buttons
On Primary           → text/icons ON a Primary-filled surface

Primary Container    → softer tint, used for cards, chips, subtle emphasis
On Primary Container → text ON that softer container
```

The component code references semantic tokens (`bg: var(--primary)`, `color: var(--on-primary)`). The theme/character swaps what those resolve to.

### Tonal palette

M3 generates a full tonal ramp (0-100 lightness) from each hue, then picks stops:

| Role | Light theme tone | Dark theme tone |
|---|---|---|
| Primary | 40 | 80 |
| On Primary | 100 | 20 |
| Primary Container | 90 | 30 |
| On Primary Container | 10 | 90 |

### Three contrast levels

Same palette, different tonal distances:

- **Standard:** container = tone 90, on-container = tone 10 (soft, default)
- **Medium:** container = tone 80, on-container = tone 10 (punchier)
- **High:** container = tone 70, on-container = tone 0 (maximum contrast, accessibility)

## How this maps to Kvalt characters

### Current state
- `--color-primary-1` and `--color-on-primary-1` already exist
- Characters manually set all values
- No container tier (soft emphasis)
- Polarity (light bg + dark text vs dark bg + light text) is implicit

### Proposed additions

**4 new container tokens:**
```css
--color-primary-container:       /* softer bg for cards, chips, highlights */
--color-on-primary-container:    /* text on that softer bg */
--color-secondary-container:     /* softer secondary bg */
--color-on-secondary-container:  /* text on that */
```

**Character config gets two new properties:**
```ts
{
  hue: 154,                              // primary hue in OKLCH
  polarity: 'light' | 'dark',           // light primary = light bg + dark text
  contrast: 'standard' | 'medium' | 'high',
}
```

**Palette generator** takes hue + polarity + contrast → outputs all token values. Characters go from "53 hardcoded values" to "hue + polarity + contrast level" and the system generates the rest.

### Implementation priority

1. Add container tokens (4 new CSS variables) — enables soft emphasis tier
2. Update Button, Chip, Badge, Card to use container variants where appropriate
3. Build tonal ramp generator in palette generator page
4. Add polarity and contrast to character config schema
5. Auto-generate the 53 values from the 3 inputs

## Key insight

Don't copy M3's full 30-role system — it's overengineered. Kvalt needs:
- **Primary pair** (exists): bold buttons, strong emphasis
- **Primary container pair** (new): subtle highlights, chips, soft cards
- **Secondary pair** (exists): neutral interactive surfaces
- **Secondary container pair** (new): subtle secondary emphasis

That's 4 new tokens, not 30. The palette generator does the math.

---

## Relevance to Kvalt

This directly enables the "faces" product vision: a character becomes 3 inputs (hue, polarity, contrast) instead of 53 manual values. The palette generator becomes the hero feature — type a hue, pick your vibe, get a complete design system personality. Also unlocks accessibility as a first-class character trait (contrast level), not a manual audit.
