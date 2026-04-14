# Concept Brief: Onboarding Flow

**Page type:** Screen Vault — multi-step flow (creative frame + functional progression)
**Route:** `/screen-vault/onboarding`
**DS components used:** Input, Select, Button, RadioButton, Checkbox, Toggle, UserAvatar, ContentSwitcher, LoadingIndicator, Chip, Badge

---

## What this page communicates

A first-run experience — 3-4 steps that collect user info, preferences, and workspace setup.
The creative opportunity is in the **step metaphor**: how you frame the progression from
stranger to set-up user. This page also proves Kvalt handles multi-step flows with state.

The Screen Vault version shows all steps simultaneously (side by side or stacked) so visitors
can see the full flow at once.

---

## The versions (6)

### VERSION 1 — "The Boarding Pass"
```
Format:      Each step is a section of a boarding pass — passenger info (name, email),
             seat preference (workspace settings), boarding group (plan selection),
             gate (final confirmation). Tear-off perforations between steps.
Why it fits:  "Onboarding" literally contains "boarding." The format IS the pun, but
             the pun is structural, not written. Each section maps naturally to a step.
Voice hit:   Concept is the design. Dry — the humour is in the format choice, not
             the copy. Real-world frame with natural content mapping.
Spectrum:    Considered
Risk:        Could feel forced if the boarding pass sections don't map cleanly to all
             the data we need to collect. Flight metaphor might stretch thin.
```
**Tags:** `monospace`, `paper`, `print`, `minimal`
**Voice pre-check:** ✅ Concept is the design, ✅ One idea, ✅ Dry, ✅ Real-world frame

---

### VERSION 2 — "The Clean Stepper"
```
Format:      Standard horizontal stepper with numbered steps, one visible panel at a time.
             ContentSwitcher as the step indicator. Generous whitespace, one question per
             screen, large input fields. The "breathing room" approach.
Why it fits:  Baseline — this is what good SaaS onboarding looks like. No concept,
             pure execution quality. Proves the DS handles progressive disclosure.
Voice hit:   Functional first. Negative space. Green only on the "Next" CTA.
             Kvalt tone in microcopy: "What should we call you?" not "Enter your name."
Spectrum:    Safe
Risk:        Boring. But boring that works is valuable as a baseline.
```
**Tags:** `minimal`, `clean`, `whitespace`, `light`
**Voice pre-check:** ⚠️ No strong concept, ✅ One idea, ✅ Dry, ❌ No real-world frame (standard UI)

---

### VERSION 3 — "The Job Application"
```
Format:      Employment application form — "Position applied for: User", "Previous
             experience: None required", "References: Not needed, we trust you."
             Each step is a section of the form. Bureaucratic format, warm subversion.
Why it fits:  The format is familiar and slightly absurd applied to software setup.
             "Emergency contact: your browser's back button" — dry, structural humour.
Voice hit:   Concept is the design. Dry humour embedded in field labels and metadata.
             The joke is the mismatch between formal document and casual context.
Spectrum:    Spicy
Risk:        Could confuse people who don't immediately get the conceit. Needs to be
             readable as a real form even if you miss the joke.
```
**Tags:** `paper`, `print`, `monospace`, `warm`
**Voice pre-check:** ✅ Concept is the design, ✅ One idea, ✅ Dry, ✅ Real-world frame

---

### VERSION 4 — "The Character Creation Screen"
```
Format:      RPG character creation — choose your class (role), allocate stats (preferences),
             pick your avatar, name your character, enter the world. Progress bar as XP bar.
Why it fits:  The audience (devs/designers) grew up on these. "CLASS: Design Engineer"
             with stat sliders for "Notification tolerance" and "Dark mode affinity"
             is immediately fun and functional.
Voice hit:   Concept is the design. Dry through taxonomy (RPG stats applied to preferences).
             Playful but not loud — the UI is clean, the gaming layer is conceptual.
Spectrum:    Wild
Risk:        Could feel like it's trying too hard to be fun. Needs restraint — clean UI
             with gaming vocabulary, NOT pixel art or fantasy fonts.
```
**Tags:** `dark`, `minimal`, `technical`, `bold`
**Voice pre-check:** ✅ Concept is the design, ✅ One idea, ⚠️ Dry (could tip into loud), ✅ Real-world frame

---

### VERSION 5 — "The Recipe Card"
```
Format:      Recipe format — ingredients (what you'll need: name, email, role),
             prep time (2 minutes), servings (1 workspace), method (step-by-step
             instructions), chef's notes (tips for getting the most out of the tool).
Why it fits:  Warm, analog, instructional. The recipe format is inherently step-based,
             which maps perfectly to onboarding. "Preheat your workspace to dark mode."
Voice hit:   Real-world frame. Warm without being saccharine (similar energy to the
             Personal Letter that Jan liked). Humour in the metadata.
Spectrum:    Spicy
Risk:        The cooking metaphor might not map naturally to all onboarding steps.
             "Add 1 cup of notification preferences" is a stretch.
```
**Tags:** `warm`, `paper`, `serif`, `light`
**Voice pre-check:** ✅ Concept is the design, ✅ One idea, ✅ Dry, ✅ Real-world frame

---

### VERSION 6 — "The Mixtape"
```
Format:      Cassette tape insert / liner notes — Side A (setup), Side B (preferences).
             Track listing as steps. "Recorded at: your browser." "Produced by: you."
             Hand-lettered feel for titles, monospace for metadata.
Why it fits:  Nostalgic format that the audience recognises. The cassette insert is
             physically a folded card with two sides — natural two-part flow.
             "Track 1: Name That Tune (0:30)" for a 30-second step.
Voice hit:   Real-world frame. Dry through misapplied format (cassette for software).
             One accent colour moment (green = play button). Generous negative space.
Spectrum:    Wild
Risk:        Very niche nostalgia — under-30s might not connect with the format.
             Could feel forced if the track metaphor doesn't hold.
```
**Tags:** `warm`, `paper`, `expressive`, `dark`
**Voice pre-check:** ✅ Concept is the design, ✅ One idea, ✅ Dry, ✅ Real-world frame

---

## Diversity check

| Version | Dark/Light | Dense/Airy | Digital/Analog | Serious/Playful | Type/Image |
|---|---|---|---|---|---|
| V1 Boarding Pass | Light | Airy | Analog | Serious | Type-led |
| V2 Clean Stepper | Light | Airy | Digital | Serious | Type-led |
| V3 Job Application | Light | Dense | Analog | Playful | Type-led |
| V4 Character Creation | Dark | Dense | Digital | Playful | Image-led |
| V5 Recipe Card | Light | Airy | Analog | Playful | Type-led |
| V6 Mixtape | Dark | Airy | Analog | Playful | Image-led |

**2 dark, 4 light** ✅ | **2 dense, 4 airy** (acceptable — onboarding should feel spacious) | **2 digital, 4 analog** ✅ | **4 playful** (high — but onboarding is where personality is expected) | **2 image-led** ✅

---

## Step content model (all versions use the same data)

```
Step 1 — WHO ARE YOU
  Input: Full name
  Input: Email
  UserAvatar: Upload or choose initials
  Button: Continue

Step 2 — YOUR WORKSPACE
  Input: Workspace name
  Select: Team size (Just me, 2-5, 6-20, 20+)
  RadioButton: What brings you here? (Design system, Component library, Learning, Other)
  Button: Continue / Back

Step 3 — PREFERENCES
  Toggle: Dark mode
  Toggle: Email notifications
  RadioButton: Density (Compact, Default, Comfortable)
  Chip: Select interests (pick 3+) — Design, Engineering, Motion, Accessibility, Typography, Color
  Button: Continue / Back

Step 4 — READY
  LoadingIndicator → success state
  Summary of choices
  Button: Enter workspace
  Badge: "Founding Designer" (callback to pricing)
```
