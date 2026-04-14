# Kvalt Spaciness System — v1 Proposal

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║              K V A L T   S P A C I N E S S   S Y S T E M                   ║
║                                                                            ║
║              One knob. Every component. Every layout.                      ║
║              From compact dashboards to breathing editorial.               ║
║                                                                            ║
╚══════════════════════════════════════════════════════════════════════════════╝


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1. THE BIG IDEA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Today:   MOTION_SPEED = 1    ← one knob scales ALL animation timing
  
  New:     SPACINESS = 1       ← one knob scales ALL spatial tokens

  Same philosophy. Same pattern. Applied to space instead of time.


  ┌─────────────────────────────────────────────────────────┐
  │                                                         │
  │   --spaciness: 0.85;    ← compact (data-dense apps)    │
  │   --spaciness: 1;       ← default (balanced)           │
  │   --spaciness: 1.15;    ← spacious (editorial/landing) │
  │                                                         │
  │   Characters can override this per-theme.               │
  │   Breakpoints shift it automatically.                   │
  │   Regions can override locally (dense table in          │
  │   a spacious page).                                     │
  │                                                         │
  └─────────────────────────────────────────────────────────┘



━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  2. THREE-LAYER ARCHITECTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


  ┌─────────────────────────────────────────────────────────────────┐
  │  LAYER 3 — COMPONENT TOKENS                                    │
  │  "What does THIS component need?"                              │
  │                                                                 │
  │  --card-padding         --btn-padding-x      --input-height    │
  │  --card-gap             --btn-padding-y      --input-padding   │
  │  --card-inner-padding   --btn-gap             ...              │
  │  --card-header-gap      --modal-padding                        │
  │  ...                    --modal-gap                            │
  │                         ...                                    │
  ├─────────────────────────────────────────────────────────────────┤
  │  LAYER 2 — SEMANTIC SCALE  (the shared vocabulary)             │
  │  "How much space does this INTENT need?"                       │
  │                                                                 │
  │  --space-xs    4px  × spaciness   ← hairline gaps, icon-label  │
  │  --space-sm    8px  × spaciness   ← tight groups, tag rows     │
  │  --space-md   16px  × spaciness   ← form fields, list items    │
  │  --space-lg   24px  × spaciness   ← card padding, sections     │
  │  --space-xl   32px  × spaciness   ← panel padding, modals      │
  │  --space-2xl  48px  × spaciness   ← hero margins, page gaps    │
  │  --space-3xl  64px  × spaciness   ← section dividers           │
  │  --space-4xl  96px  × spaciness   ← page-level breathing       │
  │                                                                 │
  ├─────────────────────────────────────────────────────────────────┤
  │  LAYER 1 — FOUNDATION                                          │
  │  "The physics of the system"                                   │
  │                                                                 │
  │  --spaciness: 1;          ← THE master knob (0.75 → 1.25)     │
  │  --grid-unit: 4px;        ← base grid (never changes)         │
  │                                                                 │
  │  + FIXED tokens (never scale):                                 │
  │    --border-width: 1px    --focus-ring: 2px                    │
  │    --divider: 1px         --outline-offset: 2px                │
  │                                                                 │
  └─────────────────────────────────────────────────────────────────┘


  Data flows DOWN:

       spaciness
           │
           ▼
    semantic scale     (base values × spaciness, snapped to 4px grid)
           │
           ▼
    component tokens   (aliases into the semantic scale)
           │
           ▼
    actual CSS          padding, gap, margin, height



━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  3. THE SEMANTIC SCALE — HOW IT COMPUTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Base values sit on the 4px grid. Spaciness multiplies them.
  Results snap to nearest 4px to stay on-grid.

  ┌──────────┬──────┬────────────┬────────────┬────────────┐
  │  Token   │ Base │  × 0.85    │  × 1.00    │  × 1.15    │
  │          │      │  compact   │  default   │  spacious  │
  ├──────────┼──────┼────────────┼────────────┼────────────┤
  │ space-xs │  4px │    4px     │    4px     │    4px     │
  │ space-sm │  8px │    8px     │    8px     │    8px     │
  │ space-md │ 16px │   12px     │   16px     │   20px     │
  │ space-lg │ 24px │   20px     │   24px     │   28px     │
  │ space-xl │ 32px │   28px     │   32px     │   36px     │
  │ space-2xl│ 48px │   40px     │   48px     │   56px     │
  │ space-3xl│ 64px │   56px     │   64px     │   72px     │
  │ space-4xl│ 96px │   80px     │   96px     │  112px     │
  └──────────┴──────┴────────────┴────────────┴────────────┘

  Notice: xs and sm don't move much — small gaps should stay
  tight regardless. The bigger the space, the more spaciness
  affects it. This is intentional: you don't want icon-label
  gaps ballooning, but you DO want section padding to breathe.

  ┌─────────────────────────────────────────────────────────┐
  │  GRID SNAP FUNCTION                                     │
  │                                                         │
  │  snap(base, spaciness) =                                │
  │    round(base × spaciness / 4) × 4                     │
  │                                                         │
  │  Always lands on the 4px grid. No fractional pixels.    │
  └─────────────────────────────────────────────────────────┘

  In CSS:
  
  :root {
    --spaciness: 1;
    --space-md: calc(
      round(nearest, 16px * var(--spaciness), 4px)
    );
  }

  (CSS round() has good browser support as of 2025+)



━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  4. COMPONENT TOKENS — CARD DEEP DIVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Every component gets its own semantic spacing tokens that
  reference the shared scale. Here's Card:


  ┌──────────────────────────────────────────────────────────────┐
  │  CARD ANATOMY                                                │
  │                                                              │
  │  ┌─ card ─────────────────────────────────────────────────┐  │
  │  │                                                         │  │
  │  │  ← card-padding →                                      │  │
  │  │                                                         │  │
  │  │  ┌─ card-header ─────────────────────────────────────┐  │  │
  │  │  │  ┌──────┐                                         │  │  │
  │  │  │  │ Icon │  Title            [Action] [Action]     │  │  │
  │  │  │  └──────┘                                         │  │  │
  │  │  │  ← card-header-gap →                              │  │  │
  │  │  │  Description text goes here and can wrap           │  │  │
  │  │  │  to multiple lines.                                │  │  │
  │  │  └───────────────────────────────────────────────────┘  │  │
  │  │                                                         │  │
  │  │  ↕ card-gap (between header and body)                   │  │
  │  │                                                         │  │
  │  │  ┌─ card-body ───────────────────────────────────────┐  │  │
  │  │  │                                                    │  │  │
  │  │  │  ← card-inner-padding →                           │  │  │
  │  │  │                                                    │  │  │
  │  │  │  Content area. Tables, forms, lists, media,       │  │  │
  │  │  │  charts, whatever you slot in here.               │  │  │
  │  │  │                                                    │  │  │
  │  │  │  ↕ card-body-gap (between body items)             │  │  │
  │  │  │                                                    │  │  │
  │  │  │  More content.                                     │  │  │
  │  │  │                                                    │  │  │
  │  │  └────────────────────────────────────────────────────┘  │  │
  │  │                                                         │  │
  │  │  ↕ card-gap                                             │  │
  │  │                                                         │  │
  │  │  ┌─ card-footer ─────────────────────────────────────┐  │  │
  │  │  │                         [Secondary]  [Primary]     │  │  │
  │  │  └───────────────────────────────────────────────────┘  │  │
  │  │                                                         │  │
  │  └─────────────────────────────────────────────────────────┘  │
  │                                                              │
  └──────────────────────────────────────────────────────────────┘


  TOKEN MAP:

  ┌──────────────────────┬──────────────┬──────────────────────────────┐
  │  Component Token     │ Points to    │ Purpose                      │
  ├──────────────────────┼──────────────┼──────────────────────────────┤
  │ --card-padding       │ --space-lg   │ Outer padding (all sides)    │
  │ --card-gap           │ --space-md   │ Between header/body/footer   │
  │ --card-inner-padding │ --space-md   │ Body internal padding        │
  │ --card-header-gap    │ --space-sm   │ Icon→title, title→desc       │
  │ --card-body-gap      │ --space-sm   │ Between items inside body    │
  │ --card-radius        │ --radius-lg  │ Corner radius (FIXED)        │
  │ --card-shadow        │ shadow-sm-1  │ Elevation (FIXED)            │
  └──────────────────────┴──────────────┴──────────────────────────────┘

  When spaciness changes, card-padding (→ space-lg) shifts from
  20px (compact) → 24px (default) → 28px (spacious).
  
  The card doesn't know about spaciness. It just uses space-lg.


  CARD VARIANTS (same tokens, different mappings):

  ┌─────────────┬────────────┬────────────┬────────────┐
  │             │  Default   │  Compact   │  Flush     │
  ├─────────────┼────────────┼────────────┼────────────┤
  │ padding     │  space-lg  │  space-md  │  0         │
  │ gap         │  space-md  │  space-sm  │  space-sm  │
  │ inner-pad   │  space-md  │  space-sm  │  space-md  │
  │ header-gap  │  space-sm  │  space-xs  │  space-sm  │
  │ radius      │  radius-lg │  radius-m  │  0         │
  │ shadow      │  sm-1      │  sm-1      │  none      │
  ├─────────────┼────────────┼────────────┼────────────┤
  │ Use case    │  Standard  │  Data-     │  Embedded  │
  │             │  content   │  dense     │  in other  │
  │             │  card      │  dashbrd   │  surfaces  │
  └─────────────┴────────────┴────────────┴────────────┘

  Flush = no padding, no radius, no shadow. For cards that live
  inside another card or panel. The content IS the card.



━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  5. EVERY COMPONENT — TOKEN MAPPING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Every component follows the same pattern: its own semantic
  tokens that alias into the shared scale.


  BUTTONS
  ┌──────────────────────┬──────────────┐
  │ --btn-padding-x      │ --space-md   │
  │ --btn-padding-y      │ --space-sm   │
  │ --btn-gap            │ --space-sm   │  (icon ↔ label)
  │ --btn-height         │ 40px (fixed) │  height doesn't scale
  │ --btn-radius         │ --radius-m   │
  └──────────────────────┴──────────────┘

  INPUTS
  ┌──────────────────────┬──────────────┐
  │ --input-padding-x    │ --space-md   │
  │ --input-padding-y    │ --space-sm   │
  │ --input-height       │ 40px (fixed) │
  │ --input-gap          │ --space-xs   │  (label ↔ input)
  │ --input-radius       │ --radius-m   │
  └──────────────────────┴──────────────┘

  MODAL
  ┌──────────────────────┬──────────────┐
  │ --modal-padding      │ --space-xl   │
  │ --modal-gap          │ --space-lg   │  (between sections)
  │ --modal-header-gap   │ --space-sm   │  (title ↔ desc)
  │ --modal-footer-gap   │ --space-md   │  (between buttons)
  │ --modal-radius       │ --radius-lg  │
  └──────────────────────┴──────────────┘

  DROPDOWN / POPOVER
  ┌──────────────────────┬──────────────┐
  │ --dropdown-padding   │ --space-sm   │
  │ --dropdown-item-pad  │ --space-sm / --space-md │
  │ --dropdown-item-gap  │ --space-xs   │
  │ --dropdown-radius    │ --radius-m   │
  └──────────────────────┴──────────────┘

  TABS
  ┌──────────────────────┬──────────────┐
  │ --tab-padding-x      │ --space-md   │
  │ --tab-padding-y      │ --space-sm   │
  │ --tab-gap            │ --space-xs   │  (between tabs)
  │ --tab-content-gap    │ --space-lg   │  (tabs ↔ content)
  └──────────────────────┴──────────────┘

  DATA TABLE
  ┌──────────────────────┬──────────────┐
  │ --table-cell-pad-x   │ --space-md   │
  │ --table-cell-pad-y   │ --space-sm   │
  │ --table-header-pad-y │ --space-sm   │
  │ --table-row-gap      │ 0 (fixed)    │  rows touch
  │ --table-radius       │ --radius-lg  │
  └──────────────────────┴──────────────┘

  Notice the pattern: almost every component uses the SAME
  semantic tokens (space-sm for tight internal, space-md for
  comfortable internal, space-lg for generous container padding).
  
  This means spaciness automatically propagates everywhere.



━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  6. LAYOUT TOKENS — ARRANGING COMPONENTS ON A PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Separate from component internals. Layout tokens handle the
  space BETWEEN components and page structure.


  ┌──────────────────────┬──────────┬──────────────────────────────┐
  │  Layout Token        │ Base     │ Purpose                      │
  ├──────────────────────┼──────────┼──────────────────────────────┤
  │ --layout-gutter      │ 16px     │ Grid column gutters          │
  │ --layout-margin      │ 24px     │ Page edge margins            │
  │ --layout-gap-tight   │ 12px     │ Between tightly grouped      │
  │                      │          │ components (label + input)    │
  │ --layout-gap-default │ 24px     │ Between components in a      │
  │                      │          │ section (card to card)        │
  │ --layout-gap-section │ 48px     │ Between page sections        │
  │ --layout-gap-page    │ 96px     │ Major page divisions         │
  │ --layout-page-max    │ 1280px   │ Max content width (FIXED)    │
  └──────────────────────┴──────────┴──────────────────────────────┘

  Layout tokens ALSO scale with spaciness (except page-max):

  ┌──────────────────────┬──────────┬──────────┬──────────┐
  │                      │ compact  │ default  │ spacious │
  ├──────────────────────┼──────────┼──────────┼──────────┤
  │ layout-gutter        │   12px   │   16px   │   20px   │
  │ layout-margin        │   20px   │   24px   │   28px   │
  │ layout-gap-tight     │   12px   │   12px   │   16px   │
  │ layout-gap-default   │   20px   │   24px   │   28px   │
  │ layout-gap-section   │   40px   │   48px   │   56px   │
  │ layout-gap-page      │   80px   │   96px   │  112px   │
  │ layout-page-max      │  1280px  │  1280px  │  1280px  │  (FIXED)
  └──────────────────────┴──────────┴──────────┴──────────┘



━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  7. GRID SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


  12-column fluid grid. Gutters and margins scale with spaciness.


  DESKTOP (≥1024px)
  ┌──────────────────────────────────────────────────────────────┐
  │ margin │ col│gut│col│gut│col│gut│col│gut│col│gut│col│ margin│
  │ ←────→ │ ←→ │←→│←→ │←→│←→ │←→│←→ │←→│←→ │←→│←→ │ ←────→ │
  │  24px  │    16px gutter between columns                24px │
  │        │                                                    │
  │        │  12 columns, fluid width                          │
  │        │  max-width: 1280px (centered)                     │
  └──────────────────────────────────────────────────────────────┘

  Common column spans:

  ┌─────────────────────┬─────────────────────┐  ← 6 + 6
  │                     │                     │
  │     6 columns       │     6 columns       │
  │                     │                     │
  └─────────────────────┴─────────────────────┘

  ┌────────────┬────────────┬────────────┐       ← 4 + 4 + 4
  │  4 cols    │  4 cols    │  4 cols    │
  └────────────┴────────────┴────────────┘

  ┌──────┬──────┬──────┬──────┐                  ← 3 + 3 + 3 + 3
  │ 3col │ 3col │ 3col │ 3col │
  └──────┴──────┴──────┴──────┘

  ┌──────────────────────────────────────┐       ← full width
  │            12 columns                │
  └──────────────────────────────────────┘



━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  8. BREAKPOINTS + RESPONSIVE SPACINESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Spaciness adjusts at breakpoints. Mobile gets tighter
  automatically. Desktop gets room to breathe.


  ┌──────────────────────────────────────────────────────────────┐
  │                                                              │
  │  BREAKPOINT         WIDTH         COLUMNS   SPACINESS        │
  │  ─────────────────────────────────────────────────────────── │
  │  mobile             < 640px       4         0.85 (compact)   │
  │  tablet             640–1023px    8         1.00 (default)   │
  │  desktop            1024–1439px   12        1.00 (default)   │
  │  wide               ≥ 1440px      12        1.10 (spacious)  │
  │                                                              │
  └──────────────────────────────────────────────────────────────┘

  But! The user/character can OVERRIDE the base spaciness,
  and breakpoints multiply on top of that:

  ┌─────────────────────────────────────────────────────────┐
  │                                                         │
  │  final spaciness = base × breakpoint multiplier         │
  │                                                         │
  │  Example: Character sets base = 0.9 (dense theme)      │
  │                                                         │
  │  mobile:   0.9 × 0.85 = 0.765  (very compact)          │
  │  tablet:   0.9 × 1.00 = 0.9                            │
  │  desktop:  0.9 × 1.00 = 0.9                            │
  │  wide:     0.9 × 1.10 = 0.99   (almost default)        │
  │                                                         │
  └─────────────────────────────────────────────────────────┘


  MOBILE LAYOUT (< 640px, 4 columns)

  ┌──────────────────────────────┐
  │ margin                margin │
  │ ←16px→                ←16px→ │
  │ ┌──────────────────────────┐ │
  │ │      Full-width card     │ │
  │ │      (4 columns)         │ │
  │ └──────────────────────────┘ │
  │        ↕ gap-default         │
  │ ┌──────────────────────────┐ │
  │ │      Full-width card     │ │
  │ └──────────────────────────┘ │
  │        ↕ gap-default         │
  │ ┌────────────┬─────────────┐ │
  │ │  2 cols    │  2 cols     │ │
  │ └────────────┴─────────────┘ │
  └──────────────────────────────┘


  TABLET LAYOUT (640–1023px, 8 columns)

  ┌──────────────────────────────────────────┐
  │ margin                            margin │
  │ ←20px→                            ←20px→ │
  │ ┌──────────────────┬───────────────────┐ │
  │ │    4 columns     │    4 columns      │ │
  │ └──────────────────┴───────────────────┘ │
  │              ↕ gap-default               │
  │ ┌──────────────────────────────────────┐ │
  │ │          8 columns (full)            │ │
  │ └──────────────────────────────────────┘ │
  └──────────────────────────────────────────┘


  DESKTOP LAYOUT (≥1024px, 12 columns)

  ┌──────────────────────────────────────────────────────────┐
  │  margin                                          margin  │
  │  ←24px→                                          ←24px→  │
  │  ┌───────────────┬───────────────┬───────────────┐       │
  │  │   4 columns   │   4 columns   │   4 columns   │       │
  │  └───────────────┴───────────────┴───────────────┘       │
  │                  ↕ gap-section                            │
  │  ┌─────────────────────────┬─────────────────────┐       │
  │  │       8 columns         │     4 columns       │       │
  │  │       (main content)    │     (sidebar)        │       │
  │  └─────────────────────────┴─────────────────────┘       │
  └──────────────────────────────────────────────────────────┘



━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  9. FIXED vs. SCALABLE — THE ESCAPE HATCH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Not everything should scale. Some values must stay fixed
  regardless of spaciness.


  ┌─────────────────────────────────────────────────────────────┐
  │                                                             │
  │  SCALABLE (× spaciness)          FIXED (constant)           │
  │  ─────────────────────           ────────────────           │
  │  Padding                         Border width (1px)         │
  │  Gaps                            Focus ring (2px)           │
  │  Margins                         Outline offset (2px)       │
  │  Section spacing                 Divider thickness (1px)    │
  │  Layout gutters                  Icon sizes (16/20/24px)    │
  │  Layout margins                  Component heights*         │
  │                                  Max content width          │
  │                                  Border radius              │
  │                                  Shadow offsets              │
  │                                                             │
  │  * Heights: buttons, inputs stay 40px. A compact button     │
  │    has less padding, not less height. Touch targets must     │
  │    remain ≥ 44px for accessibility.                         │
  │                                                             │
  └─────────────────────────────────────────────────────────────┘


  WHY heights are fixed:

  ┌───────────────────────────────────────────────────────┐
  │                                                       │
  │  Compact:    ┌──────────────────┐                     │
  │              │    Save  ▸       │ ← 40px tall         │
  │              └──────────────────┘   less padding      │
  │                                     but same height   │
  │                                                       │
  │  Default:    ┌──────────────────┐                     │
  │              │    Save  ▸       │ ← 40px tall         │
  │              └──────────────────┘                     │
  │                                                       │
  │  Spacious:   ┌──────────────────┐                     │
  │              │    Save  ▸       │ ← 40px tall         │
  │              └──────────────────┘   more padding      │
  │                                     but same height   │
  │                                                       │
  │  Vertical alignment stays consistent across all       │
  │  spaciness levels. Forms don't jump around.           │
  └───────────────────────────────────────────────────────┘



━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  10. VISUAL COMPARISON — SPACINESS IN ACTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


  COMPACT (spaciness: 0.85) — data-dense, SaaS dashboard feel

  ┌──────────────────────────────────────┐
  │ ┌──────────────────────────────────┐ │
  │ │ Revenue        ┌──────────────┐  │ │
  │ │ Q1 2026        │ ▓▓▓▓▓▓▓▓▓▓ │  │ │
  │ │ $1.2M (+12%)   │ ▓▓▓▓▓▓▓▓   │  │ │
  │ │                │ ▓▓▓▓▓▓     │  │ │
  │ │ Updated 2m ago └──────────────┘  │ │
  │ └──────────────────────────────────┘ │
  │ ┌──────────────────────────────────┐ │
  │ │ Active Users                     │ │
  │ │ 3,847 (+5.2%)                    │ │
  │ └──────────────────────────────────┘ │
  └──────────────────────────────────────┘


  DEFAULT (spaciness: 1.0) — balanced, general purpose

  ┌──────────────────────────────────────────┐
  │                                          │
  │  ┌────────────────────────────────────┐  │
  │  │                                    │  │
  │  │  Revenue        ┌──────────────┐   │  │
  │  │  Q1 2026        │ ▓▓▓▓▓▓▓▓▓▓ │   │  │
  │  │  $1.2M (+12%)   │ ▓▓▓▓▓▓▓▓   │   │  │
  │  │                 │ ▓▓▓▓▓▓     │   │  │
  │  │  Updated 2m ago └──────────────┘   │  │
  │  │                                    │  │
  │  └────────────────────────────────────┘  │
  │                                          │
  │  ┌────────────────────────────────────┐  │
  │  │                                    │  │
  │  │  Active Users                      │  │
  │  │  3,847 (+5.2%)                     │  │
  │  │                                    │  │
  │  └────────────────────────────────────┘  │
  │                                          │
  └──────────────────────────────────────────┘


  SPACIOUS (spaciness: 1.15) — editorial, landing, breathing room

  ┌────────────────────────────────────────────────┐
  │                                                │
  │                                                │
  │   ┌──────────────────────────────────────────┐ │
  │   │                                          │ │
  │   │                                          │ │
  │   │   Revenue        ┌──────────────┐        │ │
  │   │   Q1 2026        │ ▓▓▓▓▓▓▓▓▓▓ │        │ │
  │   │                  │ ▓▓▓▓▓▓▓▓   │        │ │
  │   │   $1.2M (+12%)   │ ▓▓▓▓▓▓     │        │ │
  │   │                  └──────────────┘        │ │
  │   │   Updated 2m ago                         │ │
  │   │                                          │ │
  │   │                                          │ │
  │   └──────────────────────────────────────────┘ │
  │                                                │
  │                                                │
  │   ┌──────────────────────────────────────────┐ │
  │   │                                          │ │
  │   │   Active Users                           │ │
  │   │   3,847 (+5.2%)                          │ │
  │   │                                          │ │
  │   └──────────────────────────────────────────┘ │
  │                                                │
  │                                                │
  └────────────────────────────────────────────────┘



━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  11. LOCAL DENSITY OVERRIDE — NESTED REGIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Sometimes you need a dense region inside a spacious page.
  Like a data table inside an editorial layout.

  Use a <DensityProvider> that locally overrides --spaciness:


  ┌─ Page (spaciness: 1.15 — spacious) ──────────────────────┐
  │                                                           │
  │   Hero section with lots of breathing room                │
  │                                                           │
  │   ┌─ DensityProvider spaciness={0.85} ─────────────────┐  │
  │   │                                                     │  │
  │   │  ┌─────┬───────────┬──────────┬──────────┬───────┐  │  │
  │   │  │ ID  │ Name      │ Status   │ Revenue  │ Trend │  │  │
  │   │  ├─────┼───────────┼──────────┼──────────┼───────┤  │  │
  │   │  │ 01  │ Acme Corp │ Active   │ $120K    │ ↑ 12% │  │  │
  │   │  │ 02  │ Globex    │ Pending  │ $85K     │ ↓ 3%  │  │  │
  │   │  │ 03  │ Initech   │ Active   │ $210K    │ ↑ 8%  │  │  │
  │   │  │ 04  │ Umbrella  │ Churned  │ $0       │ —     │  │  │
  │   │  └─────┴───────────┴──────────┴──────────┴───────┘  │  │
  │   │                                                     │  │
  │   └─────────────────────────────────────────────────────┘  │
  │                                                           │
  │   More spacious editorial content below...                │
  │                                                           │
  └───────────────────────────────────────────────────────────┘


  Implementation:

  <DensityProvider spaciness={0.85}>
    <DataTable data={rows} columns={cols} />
  </DensityProvider>

  The provider sets --spaciness on its wrapper div.
  All tokens inside resolve to compact values via CSS calc().
  No prop drilling. No component awareness needed.



━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  12. CHARACTER INTEGRATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Characters already override colors, radius, fonts, and motion.
  Now they can override spaciness too:


  ┌──────────────────────────────────────────────────────────────┐
  │                                                              │
  │  Character: "Brutalist"                                      │
  │  ──────────────────────                                      │
  │  spaciness:    0.80      ← tight, raw, compressed            │
  │  radius:       0px       ← no rounded corners                │
  │  motion_speed: 0.5       ← snappy                            │
  │                                                              │
  │  Character: "Editorial"                                      │
  │  ──────────────────────                                      │
  │  spaciness:    1.20      ← generous, breathing, magazine     │
  │  radius:       16px      ← soft corners                      │
  │  motion_speed: 1.2       ← languid, deliberate               │
  │                                                              │
  │  Character: "Dashboard"                                      │
  │  ──────────────────────                                      │
  │  spaciness:    0.90      ← efficient, data-forward            │
  │  radius:       8px       ← functional                        │
  │  motion_speed: 0.7       ← quick, no-nonsense                │
  │                                                              │
  └──────────────────────────────────────────────────────────────┘



━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  13. IMPLEMENTATION — FILE STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


  src/
  ├── tokens/
  │   ├── spacing.ts          ← REWRITE: semantic scale + snap()
  │   ├── motion.ts           ← existing (MOTION_SPEED pattern)
  │   ├── borderRadius.ts     ← existing (fixed, no scaling)
  │   └── gradients.ts        ← existing
  │
  ├── styles/
  │   ├── tokens.css          ← ADD: --spaciness + all computed vars
  │   └── density.css         ← NEW: breakpoint spaciness overrides
  │
  ├── components/
  │   ├── Card/
  │   │   ├── Card.tsx        ← NEW: composable card (header/body/footer)
  │   │   ├── Card.test.tsx   ← NEW: TDD tests
  │   │   └── card.css        ← NEW: component tokens → semantic tokens
  │   │
  │   ├── DensityProvider/
  │   │   └── DensityProvider.tsx  ← NEW: local spaciness override
  │   │
  │   └── ...existing components (update to use semantic tokens)
  │
  └── hooks/
      └── useSpaciness.ts     ← NEW: read current computed spaciness


  CSS IMPLEMENTATION:

  /* tokens.css — foundation */
  :root {
    --spaciness: 1;

    /* Semantic scale (computed) */
    --space-xs:  calc(round(nearest,  4px * var(--spaciness), 4px));
    --space-sm:  calc(round(nearest,  8px * var(--spaciness), 4px));
    --space-md:  calc(round(nearest, 16px * var(--spaciness), 4px));
    --space-lg:  calc(round(nearest, 24px * var(--spaciness), 4px));
    --space-xl:  calc(round(nearest, 32px * var(--spaciness), 4px));
    --space-2xl: calc(round(nearest, 48px * var(--spaciness), 4px));
    --space-3xl: calc(round(nearest, 64px * var(--spaciness), 4px));
    --space-4xl: calc(round(nearest, 96px * var(--spaciness), 4px));

    /* Fixed tokens (never scale) */
    --fixed-border: 1px;
    --fixed-focus:  2px;
    --fixed-divider: 1px;
  }

  /* density.css — responsive overrides */
  @media (max-width: 639px)  { :root { --spaciness: 0.85; } }
  @media (min-width: 1440px) { :root { --spaciness: 1.10; } }

  /* card.css — component tokens */
  .card {
    --card-padding:       var(--space-lg);
    --card-gap:           var(--space-md);
    --card-inner-padding: var(--space-md);
    --card-header-gap:    var(--space-sm);

    padding: var(--card-padding);
    gap: var(--card-gap);
  }
  .card--compact {
    --card-padding:       var(--space-md);
    --card-gap:           var(--space-sm);
    --card-inner-padding: var(--space-sm);
    --card-header-gap:    var(--space-xs);
  }



━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  14. WHAT CHANGES FROM TODAY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


  BEFORE (today)                    AFTER (v1)
  ─────────────────────────         ──────────────────────────────
  gap.tight = 'gap-2'              --space-sm (scales with spaciness)
  gap.cozy = 'gap-4'               --space-md (scales with spaciness)
  gap.card = 'gap-10'              --layout-gap-default (scales)
  gap.section = 'gap-16'           --layout-gap-section (scales)

  AICard padding: 20px             --card-padding → --space-lg
  HubCard padding: 32px            --card-padding → --space-xl
  DocCard padding: 40px            --card-padding → --space-2xl

  Hardcoded per-component          Semantic tokens → shared scale
  No density control               --spaciness knob
  Same spacing on all screens      Responsive spaciness per breakpoint
  No local overrides               DensityProvider for regions


  MIGRATION PATH:
  1. Add --spaciness + semantic scale to tokens.css
  2. Build Card component using new tokens (proves the system)
  3. Add DensityProvider
  4. Gradually migrate existing components to semantic tokens
  5. Add breakpoint spaciness overrides
  6. Add spaciness to Character system
  7. Remove old spacing.ts exports (or alias them)



━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  15. PARALLELS WITH MOTION — THE KVALT WAY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


  ┌──────────────────┬──────────────────────────────────────┐
  │  Motion system   │  Spaciness system                    │
  ├──────────────────┼──────────────────────────────────────┤
  │  MOTION_SPEED    │  --spaciness                         │
  │  1 master knob   │  1 master knob                       │
  │  scales time     │  scales space                        │
  │                  │                                      │
  │  spring.snappy   │  --space-sm                          │
  │  spring.default  │  --space-md                          │
  │  spring.playful  │  --space-lg                          │
  │  semantic names  │  semantic names                      │
  │                  │                                      │
  │  transition.*    │  --card-padding, --btn-gap, ...      │
  │  component-level │  component-level                     │
  │  presets          │  presets                             │
  │                  │                                      │
  │  never hardcode  │  never hardcode                      │
  │  durations       │  pixel values                        │
  │                  │                                      │
  │  Characters can  │  Characters can                      │
  │  override speed  │  override spaciness                  │
  └──────────────────┴──────────────────────────────────────┘


  The Kvalt equation:

  ┌─────────────────────────────────────────────────────┐
  │                                                     │
  │   Personality = Color + Typography + Radius          │
  │                 + Motion(speed) + Space(spaciness)   │
  │                                                     │
  │   5 axes. Fully independent.                        │
  │   Characters dial each one.                         │
  │   The DS adapts.                                    │
  │                                                     │
  └─────────────────────────────────────────────────────┘
```
