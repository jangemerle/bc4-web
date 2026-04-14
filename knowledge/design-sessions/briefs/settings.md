# Concept Brief: Settings Page

**Page type:** Screen Vault — functional (creative treatment in structure, not concept)
**Route:** `/screen-vault/settings`
**DS components used:** Tabs, Input, TextArea, Toggle, Select, RadioButton, Checkbox, Button, UserAvatar, UserAvatarLabel, NumberInput, Badge, Modal, SearchInput

---

## What this page communicates

The highest-density component showcase in Screen Vault. A settings page touches almost every
form component in the DS. The creative opportunity isn't in a conceptual frame (nobody wants
a "clever" settings page) — it's in **layout architecture**: how you organise complexity.

This is where Kvalt proves its components compose into something usable at scale.

---

## The versions (4 — functional pages need fewer)

### VERSION 1 — "The Sidebar Settings"
```
Format:      Left sidebar with section nav + right content panel. Classic SaaS pattern
             (GitHub, Linear, Notion). Clean, proven, boring-on-purpose.
Why it fits:  This is the baseline. If Kvalt components can't do a standard settings page
             well, nothing else matters. Proves composition at the most common layout.
Voice hit:   Functional first. Negative space between sections. No decoration.
Spectrum:    Safe
Risk:        Too generic — might not showcase Kvalt's personality at all.
```
**Tags:** `minimal`, `clean`, `neutral`, `light`
**Sections:** Account (UserAvatar, Input×3, Button), Notifications (Toggle×6, grouped), 
Appearance (RadioButton group for theme, Select for density), Security (Input, Button, Modal confirm)

---

### VERSION 2 — "The Stacked Cards"
```
Format:      Full-width stacked cards, one per section. No sidebar. Vertical scroll.
             Each card is self-contained with its own save action.
Why it fits:  Mobile-first thinking applied to desktop. Each section is independently
             editable — you don't lose scroll position when saving one section.
             Shows the DS handling isolated form contexts.
Voice hit:   Clean structure. Generous whitespace between cards. Green only on primary CTAs.
Spectrum:    Considered
Risk:        Long scroll on desktop. Could feel like a mobile layout forced onto large screens.
```
**Tags:** `minimal`, `clean`, `whitespace`, `light`
**Sections:** Same as V1 but each section = a card with its own footer (Save/Cancel)

---

### VERSION 3 — "The Terminal Config"
```
Format:      Settings as a config file being edited — monospace, key:value pairs,
             comments (# Notification preferences), sections as [brackets].
             BUT with real interactive components inline (toggles, inputs replace the values).
Voice hit:   Format matches audience. The joke: your settings page IS a dotfile.
             Functional — the config structure actually organises the content well.
Spectrum:    Spicy
Risk:        Could be confusing — are these real inputs or is this a code block?
             Needs clear affordances that the "values" are interactive.
```
**Tags:** `monospace`, `code`, `dark`, `technical`
**Sections:** `[account]`, `[notifications]`, `[appearance]`, `[security]` — each with 
key = value lines where values are actual Kvalt form components

---

### VERSION 4 — "The Two-Pane Dialogue"
```
Format:      Each section is a two-column row: left column = description (what this does,
             why you'd change it), right column = the controls. Alternating subtle background
             bands. No tabs or sidebar — everything visible, sectioned by horizontal rules.
Why it fits:  The description-heavy approach shows Kvalt's typography system working hard.
             Left column uses Borna headings + Inter body. Right column is pure components.
             Proves the DS handles mixed-density layouts.
Voice hit:   Functional first. Kvalt tone in the descriptions: "We'll email you. Not too
             often. Promise." instead of "Email notification preferences."
Spectrum:    Considered
Risk:        Might feel text-heavy if the descriptions aren't sharp. Needs great copy.
```
**Tags:** `editorial`, `clean`, `light`, `typographic`
**Sections:** Horizontal sections with description left, controls right, dividers between

---

## Diversity check

| Version | Dark/Light | Dense/Airy | Digital/Analog | Serious/Playful | Type/Image |
|---|---|---|---|---|---|
| V1 Sidebar | Light | Dense | Digital | Serious | Type-led |
| V2 Stacked Cards | Light | Airy | Digital | Serious | Type-led |
| V3 Terminal Config | Dark | Dense | Digital | Playful | Type-led |
| V4 Two-Pane | Light | Airy | Analog-feel | Serious | Type-led |

**3 light, 1 dark** ✅ | **2 dense, 2 airy** ✅ | **All type-led** (acceptable — settings pages are form-driven)

---

## Component density map

This page uses **14 of 25 DS components** — the most of any Screen Vault page:

```
Account:        UserAvatar, Input (×3: name, email, bio or TextArea), Button (save)
Notifications:  Toggle (×6), grouped with labels
Appearance:     RadioButton group (theme), Select (density/language), ContentSwitcher?
Security:       Input (password), Button (change), Modal (confirm), Toggle (2FA)
Billing:        Badge (plan), Button (upgrade), RadioButton (plan selection)
Search:         SearchInput (filter settings — V1 sidebar only)
Loading:        Skeleton (while settings load)
```
