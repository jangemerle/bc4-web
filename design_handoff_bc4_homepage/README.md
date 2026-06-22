# Handoff: BC4Cloud Marketing Homepage

## Overview
A complete, high-fidelity marketing homepage for **BC4Cloud** (cloud omnichannel contact
center by BusinessCom). It presents the product top-to-bottom: hero → benefits → results →
video → tiers → feature showcase → testimonials → segments → lead form → why-us → FAQ →
CTA → footer. Copy is in Czech and already settled.

## About the design files
The file in this bundle — `BC4Cloud Homepage.dc.html` — is a **design reference built in
HTML**, not production code to ship. It is a self-contained prototype showing the intended
look, layout, and motion. Your job is to **recreate it inside the existing `bc4-web`
codebase** using that project's established patterns:

- **React 18 + TypeScript + Vite** (already set up)
- **Tailwind** + the **kvalt design system** tokens in `src/styles/tokens.css` /
  `src/styles/globals.css`
- **`motion/react`** for animation (already a dependency; see `src/tokens/motion.ts`)
- Content from **`src/content/cs/home.ts`** (do not hard-code Czech strings in components —
  read/extend this file)
- Marketing sections live in **`src/marketing/sections/`**, composed by
  **`src/pages/marketing/HomePage.tsx`**

Do **not** copy the inline styles from the HTML verbatim. Translate them into Tailwind
classes + DS tokens. The HTML uses literal hex values because it had no token layer; the
real codebase does — use it.

## Fidelity
**High-fidelity.** Colors, type, spacing, and interactions are final. Recreate pixel-faithfully
with the codebase's libraries. The one area with deliberate placeholders: client logos
("Klient 01–05"), testimonials (names/quotes are realistic but unverified), and the product
video (still poster only) — these match existing TODOs in `docs/bc4-web`.

---

## Design tokens

| Token | Value | Use |
|---|---|---|
| Primary | `#3564EF` | CTAs, links, accents, eyebrows |
| Primary hover / navy-2 | `#143284` | CTA hover, dark-on-light text |
| Ink / navy | `#04123B` | Headings, dark section bg |
| Accent blue (on dark) | `#6F86F4` | Stat numerals, links on navy |
| Accent blue subtle | `#95A3F7` / `#AAB5F8` | Body text on navy |
| Muted text | `#69707E` | Body copy on light |
| Subtle text | `#868EA0` | Captions, meta |
| Border | `#DEDFE4` | Card borders, dividers |
| Border light | `#EDEEF1` | Inner dividers |
| Surface 0 | `#FFFFFF` | Page / cards |
| Surface 1 | `#F9F9FA` | Alternating sections |
| Surface tint | `#F2F3FE` | Icon chips, badges, hover fills |
| Success | `#00A35A` | Status dot |

Map these to the existing `--color-*` tokens where equivalents exist (primary-1, on-surface,
surface-1, etc.) rather than introducing new literals.

**Type**
- **Manrope** (already bundled locally in `bc4-web/public/fonts`) — 400/500/600/700/800.
  Headings 800, body 400–600.
- **JetBrains Mono** — 600/700 — used ONLY for "data" accents: eyebrow labels, stat
  numerals (`12–25 %`, `0:45`, `99,95 %`), chapter timestamps. This is a deliberate
  telco/data motif. Add it to the font setup.

**Type scale (clamps)**
- H1 hero: `clamp(2.3rem, 1.2rem + 3vw, 3.7rem)`, line-height 1.04, letter-spacing -0.025em
- H2 section: `clamp(1.75rem, 1rem + 2vw, 2.5rem)`, lh 1.12, ls -0.02em
- H3 feature: `clamp(1.4rem, 1rem + 1.2vw, 1.95rem)`
- Body lg: `clamp(1.05rem, 0.95rem + 0.5vw, 1.25rem)`, lh 1.6
- Body: 15–16px, lh 1.58–1.6
- Eyebrow (mono): 11.5–12px, ls 0.05–0.06em, uppercase

**Spacing / radius / shadow**
- Section padding: `clamp(56px, 8vw, 104px)` vertical; content max-width 1200px, 24px gutters
- Card radius 16px; pill/badge 9999px; buttons 10–11px; large media 14–18px
- Card border `1px solid #DEDFE4`; card hover lift `translateY(-3px)` +
  `0 18px 40px -22px rgba(4,18,59,.35)`
- Primary button shadow `0 8px 22px rgba(53,100,239,.32)`

---

## Screens / sections (in order)

`HomePage.tsx` composes these. Each is a candidate `src/marketing/sections/*.tsx`.

1. **Header** (sticky, 72px). Translucent white + `backdrop-filter: blur(14px)`, bottom
   border `#DEDFE4`. Left: logo (headset icon chip + "BC4Cloud"). Center: nav (Funkce, Jak to
   funguje, Proč my, FAQ → in-page anchors). Right: primary "Domluvit ukázku" CTA. Gains a
   soft shadow once scrolled (`scrollTop > 8`). **Header sound-wave motif** — see Animations.
2. **Hero**. Two-column (`minmax(380px,1fr)` auto-fit). Left: mono eyebrow pill (green dot +
   "Omnichannel kontaktní centrum"), H1, lead paragraph, two CTAs ("Domluvit ukázku" primary
   + "Jak to funguje" outline), trust row (GDPR ready / Data v EU / Česká podpora w/ lucide
   icons). Right: framed product screenshot (`assets/product/header.png`) with soft shadow.
   Background: concentric **wave** circles (see Animations) + a masked dotted grid.
3. **Trust band** (toggleable). "Důvěřují nám" + row of client logo placeholders.
4. **Benefits** — 4 cards (`phone-incoming`, `timer`, `users`, `bar-chart-3`). Icon chip
   (surface-tint bg, primary icon), title, description. Hover lift.
5. **Stats band** (dark `#04123B`). 4 stats, big **JetBrains Mono** numerals in accent blue
   `#6F86F4`, label + sub. Top-border-per-column dividers. **Curtain** section — see Animations.
6. **Product video** (toggleable). Centered heading, 16:9 poster with play button, 3 chapter
   cards (mono timestamps).
7. **How it works** — 4 tier cards (Chytré volání, Kontaktní centrum, AI [add-on], Integrace
   [add-on]). Numbered chip, "Přídavný modul" badge on add-ons, checklist with primary check
   icons.
8. **Feature showcase** — 5 blocks alternating left/right (`row` / `row-reverse`). Each: mono
   eyebrow + icon, H3, description, 4-item checklist, and a browser-framed screenshot (traffic
   lights + image). Images: `agent-panel.webp`, `smart-routing.webp`, `supervizor.webp`,
   `call-flow.webp`, `mobile.webp`.
9. **Testimonials** — 3 quote cards (big open-quote, blockquote, avatar initials + name/role).
10. **Segments** (dark `#04123B`). 5 segment cards (e-shopy, servis, banky, zdravotnictví,
    telco) with icon chips. **Curtain** section.
11. **Lead form** (`#poptavka`). Card with IČ / email / phone / team-size inputs, GDPR
    checkbox, submit. On submit → success state (green check, "Děkujeme, poptávka odešla").
    Wire to the existing `src/marketing/forms/leadForm.schema.ts`.
12. **Why us** — 4 items (headphones, map-pin, trending-up, clock): icon + title + copy.
13. **FAQ** — 7-item accordion (single-open). Chevron rotates 180°, panel max-height/opacity
    transition.
14. **CTA strip** (primary `#3564EF` bg). Centered heading + white CTA.
15. **Footer** (dark `#04123B`). Logo + blurb, Produkt / Společnost / Kontakt columns, bottom
    legal row (GDPR ready · Data v EU · 99,95 % SLA).

All copy is already in `src/content/cs/home.ts`. Cross-check section keys; extend that file if
any string here isn't present rather than inlining.

---

## Interactions & behavior (animations)

Recreate these with `motion/react` + `src/tokens/motion.ts`. The HTML implements them in
vanilla JS because it had no framework; in React use Motion's `whileInView`, `useScroll`,
variants, and the DS spring tokens.

1. **Line-by-line text reveal** (the signature). Headings and intro paragraphs reveal one
   text-line at a time: each line sits in an `overflow:hidden` mask, inner span animates
   `translateY(110% → 0)`, staggered **80ms** per line, easing `cubic-bezier(.22,.75,.2,1)`,
   ~0.95s. Fires when the block enters view (~90% viewport) and **replays** when it
   re-enters. ⚠️ Descender fix: masks need `padding-bottom: .16em; margin-bottom: -.16em`
   so g/j/y/ž aren't clipped. In React: a small `<RevealLines>` that splits on line-boxes
   after fonts load (re-split on resize), or Motion's stagger over measured lines.
2. **Block fade-up** for non-text groups (cards, grids, media): `translateY(28px)` + opacity,
   0.8s `cubic-bezier(.16,.84,.44,1)`, **85ms** stagger across grid children. Also replays on
   re-enter. Use Motion `whileInView` + `staggerChildren`.
3. **Curtain / scroll-over** (Stats and Segments). The light section above is `position:sticky;
   top:0` and the dark section scrolls up and overlaps it (square top, no shadow — the user
   removed those). Implemented by wrapping each pinned+overlapping pair in a
   `position:relative` container with both as `sticky; top:0`. **CRITICAL GOTCHA:** do **not**
   put `overflow-x:hidden` on `body` or any ancestor — it forces a scroll-container and
   silently disables `position:sticky`. Clip horizontal overflow another way if needed.
4. **Header sound-wave glow** (port of the prototype's `NavGlow` in
   `prototype/src/components/NavGlow.tsx`). Three concentric **flat-fill** blurred circles
   (`filter: blur(6px)`, NOT radial-gradient — flat fill keeps distinct edges) emanate from
   the headset logo: sizes ~70/132/198px, primary at alpha ~0.13/0.07/0.038. On load they
   **scale-in + fade-in** (`scale .3→1`, `opacity 0→1`, staggered 70ms, `cubic-bezier(.22,.7,
   .3,1)`, 0.6s), then loop a subtle pulse (`scale 1↔1.07`, `opacity 1↔.55`, ~3.4s, staggered
   delays so it ripples outward — evokes sound waves). Header is `overflow:hidden` so circles
   clip to the bar. The same motif repeats larger/subtler in the hero background. You can reuse
   `NavGlow` directly from the prototype, scaled down, with a continuous loop added.
5. **Scroll progress bar** — 3px gradient bar (`#3564EF → #6F86F4`) at top, `scaleX` = scroll
   fraction.
6. **Header shadow on scroll**, **FAQ accordion**, **button/card hovers**, **lead-form success
   state** as described above.

All motion must respect `prefers-reduced-motion` (the HTML does; the codebase has
`src/hooks/useReducedMotion.ts` — use it).

---

## State
- Header: `scrolled` boolean (shadow). Scroll progress value.
- FAQ: `openIndex` (single-open accordion).
- Lead form: form values + `submitted` boolean (+ validation via existing schema).
- Reveal/curtain: handled by Motion `whileInView` / sticky CSS — no app state needed.
- Toggles: trust band + product video visibility (were tweakable props; make them simple
  flags or CMS-driven).

## Assets
Product screenshots (in this bundle under `assets/product/`, originals already in the repo at
`bc4-web/public/product/bronet/`):
- `header.png` — hero product shot
- `agent-panel.webp` — omnichannel inbox / call card
- `smart-routing.webp` — routing & queues
- `supervizor.webp` — supervisor monitoring
- `call-flow.webp` — visual call-flow editor
- `mobile.webp` — mobile agent client

Icons: **lucide** (`lucide-react` in the codebase) — headset, phone-incoming, timer, users,
bar-chart-3, monitor, git-branch, eye, sparkles, smartphone, shield-check, map-pin,
headphones, trending-up, clock, shopping-cart, wrench, stethoscope, antenna, play,
arrow-right, check, chevron-down.

## Files
- `BC4Cloud Homepage.dc.html` — the full design reference (open in a browser to see all motion).
- `assets/product/*` — screenshots used in hero + feature showcase.

## Suggested implementation order
1. Font setup (Manrope already local; add JetBrains Mono) + confirm token mapping.
2. Static sections in `src/marketing/sections/` (Hero → Footer), composed in `HomePage.tsx`,
   reading `home.ts`.
3. Layer motion: `<RevealLines>` + block fade-up, then the curtain sticky pairs (mind the
   overflow gotcha), then port `NavGlow` for the header, then progress bar.
4. Wire the lead form to `leadForm.schema.ts`.
