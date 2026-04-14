# Kvalt — Documentation Site Redesign

## Prompt for Claude Code

You are redesigning the Kvalt documentation/showcase site. The current implementation is a single massive `App.tsx` with a sidebar and uniform `SectionTitle → Spec → Card` layout for every page. The goal is to transform it into an editorial, magazine-quality design system documentation site inspired by [wise.design](https://wise.design).

---

## Design vision

The new site should feel like a **design publication**, not a developer testing page. Think: Wise Design, Linear's changelog, Stripe's documentation. Key qualities:

### Typography as a design element — three font families

The documentation site uses **three** font families, each with a distinct role:

1. **Archia** (geometric sans-serif) — the **brand font**, used exclusively for:
   - Page hero titles at **152px**, Bold weight, dark green `#003204` (light) / white (dark)
   - Sidebar logo "kvalt" in SemiBold 24px
   - Top-level nav items (Hello, Foundations, Components, Philosophy, Screen Vault) in SemiBold 20px
   - Two-column subtitle headings (e.g. "Things should move just right") in SemiBold 24px
   - **Never** use Archia for body text, section headings within pages, or component UI

2. **Borna** (`font-display`) — the **section heading font**, used for:
   - Section headings within pages: Bold 42px (major sections like "Personality")
   - Sub-section headings: SemiBold 28px
   - Component page titles that are not hero-scale

3. **Inter** (`font-sans`) — the **body and UI font**, used for:
   - All body text, descriptions, captions
   - Code references, token tables
   - Sidebar category labels (uppercase, 12px)
   - Two-column subtitle descriptions (Medium 18px)
   - All component UI text

#### Font setup required

Archia is **not yet in the project**. Before any page work:
1. Add Archia font files to `public/fonts/archia/` (weights needed: SemiBold 600, Bold 700)
2. Add `@font-face` declarations to `src/styles/fonts.css`
3. Add `brand: ['Archia', 'sans-serif']` to `tailwind.config.js` → `fontFamily`
4. The Tailwind class will be `font-brand`

### Hero titles — 152px Archia Bold

Every page opens with a single-word or short-phrase hero title:
- Font: **Archia Bold**, 152px
- Color: `#003204` in light mode (a deep, almost-black green from outside the standard palette — add as `color-hero-title` token), white in dark mode
- Line-height: tight (0.95–1.0)
- Left-aligned, no max-width constraint on the title itself
- The title is the **visual anchor** of the page — it should dominate the viewport

Examples from Figma:
- Hello page → "Kvalt means speed" (multi-word allowed here as a landing tagline)
- Motion page → "Motion"
- Colors page → "Colors"
- Typography page → "Typography"

### Two-column subtitle pattern

Below the hero title, content pages use a **two-column layout** for the page introduction:
- **Left column**: A short punchy heading in Archia SemiBold 24px (e.g. "Things should move just right")
- **Right column**: A longer description paragraph in Inter Medium 18px, `color-on-surface-subtle-1`
- The two columns sit side by side on desktop, stack on mobile
- Gap between columns: 40px
- Margin below hero title to subtitle: 40px

### Generous whitespace (from Figma measurements)
- **Between major sections**: 80px (`gap-20` / `mt-20`)
- **Within sections** (e.g. heading to content): 20px (`gap-5`)
- **Card internal padding**: 40px
- **Card internal gap** (between elements inside a card): 20px
- Content max-width: `max-w-5xl` (1024px) for the main content area, with occasional full-width breakouts for visual elements like hero images

### Full-width hero images
- After the subtitle section, pages can have a **full-width hero image** or visual
- Border radius on hero images: **30px** (`rounded-[30px]`)
- The image spans the full content width (edge to edge of the content area, not the viewport)

### Varied layouts
Not every section should look the same. Mix these patterns:
- **Full-bleed color blocks** — for color palette pages, let the swatches go edge-to-edge
- **2-column grids** — for do/don't pairs, for comparing variants side by side
- **Large specimen areas** — a single component displayed at hero scale, centered, with lots of space
- **Narrative text + example pairs** — description on the left, live component on the right (or stacked on mobile)
- **Data tables** — for token reference (sizes, spacing values, etc.)
- **Card grids** — e.g. Motion page "Personality" section uses 3 cards in a row, each with a title + description

### Card sections (from Figma "Personality" pattern)
When presenting a set of related concepts (like motion personality traits):
- Cards use `color-surface-1` (white), `rounded-m` (12px), 40px internal padding
- 20px gap between elements inside the card
- Card title: Borna Bold at a comfortable reading size
- Card description: Inter Regular, `color-on-surface-subtle-1`
- Cards arranged in equal-width columns with 20px gap between cards

### Color and surface treatment
- Use `color-bg` as the page background (the grey, not white)
- Content cards use `color-surface-1` (white in light mode)
- Occasional use of `color-inverted-surface` blocks for contrast (dark sections)
- Subtle borders with `color-border`, not heavy outlines
- Use the primary green as an accent sparingly — hero highlights, active states, not everywhere
- Hero title color `#003204` is a special deep green used **only** for hero titles in light mode

---

## Sidebar — exact design from Figma

The sidebar is a critical design element. Follow these specs precisely:

### Dimensions and surface
- Width: **320px** fixed
- Background: `color-surface-1` (white in light mode)
- Height: full viewport, fixed position
- Padding: 32px horizontal, 32px top

### Logo area (top of sidebar)
- Text "kvalt" in **Archia SemiBold 24px**, `color-on-surface`
- Next to it: a small chip/badge reading **"DS"** with:
  - Background: `color-primary-1` (the green)
  - Text: white or `color-on-primary`, small/xs size
  - Rounded-full (pill shape)
- Below the logo: a **dark mode toggle** styled as a pill/capsule:
  - Contains sun icon (left) and moon icon (right)
  - Active mode is highlighted with a sliding indicator
  - Uses `color-surface-3` for the pill background
  - Compact size, fits naturally below the logo

### Navigation structure

The sidebar nav has **two levels**: top-level items and category groups.

**Top-level items** (standalone pages, no category):
- "Hello" — the landing/intro page
- These use **Archia SemiBold 20px**

**Category groups** with sub-items:
- Category label: **Inter**, uppercase, **12px**, **letter-spacing: 2.4px** (tracking-[0.15em]), **50% opacity** (`color-on-surface-subtle-2`)
- Category labels are: FOUNDATIONS, COMPONENTS, PHILOSOPHY, SCREEN VAULT
- Sub-items under each category: **Archia SemiBold 20px**, normal case
- Gap between category label and first item: 12px
- Gap between items within a category: 8px
- Gap between category groups: 32px

**"Screen Vault"** replaces the old "Pages" category. It contains the example/demo pages (Login, Signup, Empty State, Modals, etc.).

### Active state
- Active nav item text color: `color-on-secondary-1` (the blue, `#4571AB` in light mode)
- A **horizontal bar** on the left: **12px wide × 4px tall**, `color-on-secondary-1`, rounded ends
- The bar sits at the very left edge of the sidebar (no left padding before it)
- 20px gap between the bar and the nav item text
- Non-active items: `color-on-surface` (dark text), bar space is empty but reserved (maintains alignment)

### Hover state
- Subtle opacity shift or color change — keep it minimal
- Do NOT add background highlights on hover

### Navigation animation system

The sidebar nav has **two visual states** that transition between each other:

**COLLAPSED state** (Hello page active):
- Only top-level items shown: Hello, Foundations, Components, Philosophy, Screen Vault
- All in Archia SemiBold 20px, full-size nav items
- "Hello" is active (blue text + blue horizontal bar)
- Others are dark text, clickable

**EXPANDED state** (any page inside a category):
When the user clicks a top-level category (e.g. "Philosophy"):
1. The clicked category **transforms into a muted uppercase label** — shrinks from 20px Archia to 12px uppercase with 2.4px letter-spacing at 50% opacity
2. The first sub-item of that category becomes active (e.g. "Motion")
3. The **active item's horizontal bar animates from width 0 → 12px** with `bounceSpring` (subtle bounce)
4. Sub-items appear **one by one** with a staggered animation — each item fades in and slides from `x: -8` to `x: 0` with 40ms stagger delay
5. Other top-level categories remain as 20px clickable items below the sub-items
6. Muted uppercase labels for sections before the active section appear above, after appear below

**Spring config for nav animations:**
- Item reveal: `{ type: 'spring', visualDuration: 0.35, bounce: 0.18 }` — subtle bounce
- Active bar draw: same spring, with +50ms additional delay (so text arrives first, then bar draws)
- Stagger: 40ms between items (`0.04 * index`)
- Cross-fade between collapsed/expanded: `duration.fast` (160ms) opacity transition

---

## Dark mode toggle — pill design with rich micro-interactions

Replace the current toggle with a **pill-shaped** toggle that showcases the motion system.

### Base appearance
- Pill background: `color-surface-3`
- Contains two icons: sun (☀) on left, moon (🌙) on right (use Lucide `Sun` and `Moon`)
- A sliding highlight indicator shows the active mode
- Active indicator background: `color-surface-1` (white)
- Position: in the sidebar, below the logo area, above the nav
- Size: compact, roughly 64px × 32px
- Default shadow: `shadow-small-2`
- Border radius: fully rounded (`rounded-full`)

### Mode switch animation
- Indicator slides between sun/moon positions using `spring.snappy` (crisp, no overshoot)
- The active icon fades to full opacity while the inactive icon dims to 40% — use `duration.fast` (160ms) with `ease.standard`

### Hover interactions

**Shadow lift:**
- On hover, shadow transitions from `shadow-small-2` → `shadow-medium-2`
- Transition: `duration.fast` (160ms) with `ease.enter` — the shadow should feel like it gently lifts off the surface
- On hover exit, shadow returns using `duration.fast` with `ease.exit`

**Scale with bounce:**
- On hover, the entire pill scales to `1.08` (8% larger)
- Use `spring.playful` (`visualDuration: 0.4, bounce: 0.25`) — this gives the pill a satisfying tiny overshoot when it pops up, settling back to exactly 1.08
- On hover exit, scale returns to `1.0` using `spring.default` (gentler return, hint of life but no drama)

**3D perspective tilt (cursor-tracking):**
- Apply `perspective: 400px` on the pill's parent/wrapper
- Track `onMouseMove` cursor position relative to the pill's bounding rect
- Calculate a normalized position: `x = (cursorX - rect.left) / rect.width` → gives 0 (left edge) to 1 (right edge)
- Map to `rotateY`: `(x - 0.5) * 12` degrees — so cursor at right edge tilts +6°, left edge tilts −6°, center = 0°
- Map to `rotateX`: `(0.5 - y) * 8` degrees — cursor at top tilts forward slightly, bottom tilts back
- Apply the transform: `transform: perspective(400px) rotateY(Xdeg) rotateX(Ydeg) scale(1.08)`
- The tilt should be animated with `spring.snappy` so it tracks the cursor smoothly but doesn't feel laggy or wobbly
- On mouse leave, both rotations spring back to 0° using `spring.default` (smooth settle)

### Press animation
- Use the `usePress` hook (per CLAUDE.md rules — never `whileTap`)
- On press: scale `1.08 → 0.96`, shadow drops back to `shadow-small-2`, tilt resets to flat
- This creates a satisfying "push into the surface" feeling
- Spring: `spring.snappy` (instant feedback)
- On release: the mode switch fires, then scale bounces back to `1.0` (since hover may still be active, let hover re-engage naturally)

### Motion token mapping (quick reference)

| Interaction        | Property     | Token                                    |
|--------------------|-------------|------------------------------------------|
| Mode slide         | translateX  | `spring.snappy`                          |
| Icon opacity       | opacity     | `duration.fast` + `ease.standard`        |
| Hover shadow       | box-shadow  | `duration.fast` + `ease.enter`/`ease.exit` |
| Hover scale        | scale       | `spring.playful` (in) / `spring.default` (out) |
| 3D tilt tracking   | rotateX/Y   | `spring.snappy`                          |
| 3D tilt reset      | rotateX/Y   | `spring.default`                         |
| Press              | scale       | `spring.snappy`                          |

### Implementation notes
- The 3D tilt is the most complex part. Use a `useRef` for the pill element and `onMouseMove`/`onMouseLeave` handlers. Store `rotateX` and `rotateY` in `motion` values (from Motion/Framer Motion) so they animate smoothly rather than jumping.
- Shadow transitions: since `box-shadow` is controlled by Motion, don't put `transition-shadow` in Tailwind classes. Instead, use Motion's `animate` prop with the shadow string values directly, or toggle a CSS class and handle the transition via `duration.fast`.
- The scale, tilt, and shadow should all compose together in a single `style` or `animate` object — they're not separate animations, they're one coordinated state.
- Wrap with `useReducedMotion`: if reduced motion is preferred, skip the 3D tilt entirely and use a simple opacity/color change for hover instead. Scale and shadow can remain but with no bounce (use `spring.snappy` instead of `spring.playful`).

---

## Architecture

### Split into page files

Refactor from the current monolithic `App.tsx` into:

```
src/
  App.tsx                    ← Thin shell: sidebar nav + page router
  layouts/
    DocsLayout.tsx           ← Sidebar + content area + responsive behavior
    PageHero.tsx             ← Reusable hero section (152px Archia title + 2-col subtitle)
    Section.tsx              ← Reusable content section with generous spacing
    ExampleBlock.tsx         ← Live interactive component example with label
    ShowcaseBlock.tsx        ← Large, styled, non-interactive visual display
    DosDonts.tsx             ← Side-by-side do/don't comparison
    TokenTable.tsx           ← Table for listing token values (name, value, preview)
    FullBleed.tsx            ← Full-width breakout container
    CodeBlock.tsx            ← Styled code snippet display (for usage examples)
    CardGrid.tsx             ← Grid of concept cards (like Motion "Personality" section)
  pages/
    HelloPage.tsx            ← Landing page ("Kvalt means speed")
    foundations/
      ColorsPage.tsx
      TypographyPage.tsx
      ShadowsPage.tsx
      BorderRadiusPage.tsx
      IconsPage.tsx          ← already exists, refactor to use new layouts
    components/
      ButtonPage.tsx
      InputPage.tsx
      SearchInputPage.tsx
      TextAreaPage.tsx
      NumberInputPage.tsx
      SelectPage.tsx
      CheckboxPage.tsx
      RadioButtonPage.tsx
      TogglePage.tsx
      ChipPage.tsx
      BadgePage.tsx
      UserAvatarPage.tsx
      ModalPage.tsx
      DropdownMenuPage.tsx
      TabsPage.tsx
      DatePickerPage.tsx
      SkeletonPage.tsx
      DataTablePage.tsx
    philosophy/
      MotionPage.tsx         ← already exists as MotionGuidelines.tsx, refactor
      ToneOfVoicePage.tsx    ← already exists, refactor
      AccessibilityPage.tsx  ← already exists, refactor
      IllustrationPage.tsx   ← already exists, refactor
      UXCopywritingPage.tsx  ← already exists, refactor
      DesignPrinciplesPage.tsx ← already exists, refactor
    screen-vault/            ← renamed from "examples"
      EmptyStatePage.tsx     ← already exists
      LoginPage.tsx          ← already exists
      SignupPage.tsx         ← already exists
      ModalsPage.tsx         ← already exists
```

### Navigation/routing

Keep the current approach: `useState` for `activeSection` with the sidebar driving it. No need for react-router — this is a single-page showcase.

The sidebar nav structure must match the Figma exactly:

```
kvalt [DS]              ← logo + chip
[☀ 🌙]                 ← dark mode pill toggle

Hello                   ← standalone top-level item

FOUNDATIONS             ← uppercase category label, 12px, 50% opacity
  Colors
  Typography
  Shadows
  Border Radius
  Icons

COMPONENTS              ← uppercase category label
  Button
  Input
  Search Input
  ...etc

PHILOSOPHY              ← uppercase category label
  Motion
  Tone of Voice
  Accessibility
  ...etc

SCREEN VAULT            ← uppercase category label
  Login
  Signup
  Empty State
  Modals
```

---

## Layout component specs

### `PageHero`
```tsx
interface PageHeroProps {
  /** Hero title — displayed in Archia Bold 152px */
  title: string;
  /** Left subtitle column — Archia SemiBold 24px */
  subtitle?: string;
  /** Right description column — Inter Medium 18px */
  description?: string;
  /** Optional full-width hero image below the subtitle row */
  heroImage?: React.ReactNode;
  /** Optional large visual element (component showcase, color grid, etc.) */
  visual?: React.ReactNode;
  visualPosition?: 'below' | 'right' | 'background';
}
```
- Title: `font-brand font-bold` at 152px, color `color-hero-title` (light) / white (dark)
- 40px gap between title and subtitle row
- Subtitle row: 2-column grid, 40px gap between columns
- If `heroImage` provided: full content width, `rounded-[30px]`, 40px below subtitle row
- `mb-20` (80px) after the entire hero before first content section

### `Section`
```tsx
interface SectionProps {
  /** Section heading — Borna Bold 42px for major, SemiBold 28px for minor */
  title?: string;
  /** Optional description below title — Inter, color-on-surface-subtle-1 */
  description?: string;
  children: React.ReactNode;
  /** If true, content breaks out of max-w container */
  fullWidth?: boolean;
  /** "major" = 42px heading + 80px top margin, "minor" = 28px + 40px */
  level?: 'major' | 'minor';
}
```
- Major sections: `mt-20` (80px) top spacing, Borna Bold 42px heading, `mb-5` (20px) to content
- Minor sections: `mt-10` (40px) top spacing, Borna SemiBold 28px heading
- No divider lines between sections — whitespace alone creates separation

### `CardGrid`
```tsx
interface CardGridProps {
  children: React.ReactNode;  // CardGrid.Card children
  columns?: 2 | 3 | 4;       // Default 3
}

interface CardProps {
  title: string;              // Borna Bold, comfortable reading size
  children: React.ReactNode;  // Description content
}
```
- Cards: `color-surface-1`, `rounded-m` (12px), 40px padding, 20px internal gap
- Grid gap: 20px between cards
- Used for: Motion "Personality" traits, Design Principles, any concept grid

### `ExampleBlock`
```tsx
interface ExampleBlockProps {
  label?: string;
  description?: string;
  children: React.ReactNode;        // The live interactive component
  bg?: 'surface' | 'bg' | 'inverted';
  centered?: boolean;
}
```
- Rounded-lg container with border, generous padding (px-10 py-10 minimum)
- The component is **live and interactive**

### `ShowcaseBlock`
```tsx
interface ShowcaseBlockProps {
  children: React.ReactNode;
  bg?: 'surface' | 'bg' | 'inverted' | 'primary';
  minHeight?: number;               // Default 280px
}
```
- Used in hero areas and feature highlights
- Component displayed at scale, centered, **non-interactive** (pointer-events-none)
- Generous padding, optional background color treatment

### `DosDonts`
```tsx
interface DosDontsProps {
  do: { visual: React.ReactNode; caption: string };
  dont: { visual: React.ReactNode; caption: string };
}
```
- Side-by-side in a 2-column grid
- "Do" has a green top border (`color-success-1`), "Don't" has red (`color-danger-1`)
- Labels: "Do" in green, "Don't" in red, small and bold

### `TokenTable`
```tsx
interface TokenTableProps {
  headers: string[];
  rows: { cells: React.ReactNode[] }[];
}
```
- Clean table for listing tokens
- Monospace font for values, aligned columns, subtle row separators

---

## Page-by-page design direction

### Hello page (landing)
1. **Hero**: "Kvalt means speed" in Archia Bold 152px, dark green
2. Brief introduction to the design system
3. Quick links to key sections
4. This is the default page when the site loads

### Colors page
1. **Hero**: Title "Colors" (152px Archia Bold). Subtitle: punchy heading left, HSLUV description right
2. **Contrast pairings section**: The `ContrastExplorer` component (see `specs/color-contrast-explorer.md`)
3. **Raw palette section**: Each palette shown as a horizontal row of big swatches. Swatch shows color, shade number, hex. Wise "Core Colours" style — generous blocks, not tiny squares
4. **Semantic tokens section**: `TokenTable` mapping semantic names → light/dark values, with inline color swatch
5. **Surface scale section**: Visual stack showing bg → surface-1 → ... → surface-7
6. **Usage guidelines**: Do/don't examples

### Typography page
1. **Hero**: "Typography" (152px Archia Bold). Below: 2-column subtitle about the three-font system
2. **Font families section**: Large specimens of Archia, Borna, and Inter with character sets and usage context
3. **Headline scale**: Each headline size at actual scale, left-aligned, with metadata
4. **Body scale**: Same pattern with weight variations
5. **Token reference**: `TokenTable` with all font size tokens

### Motion page (reference: Figma frame 8956:26720)
1. **Hero**: "Motion" (152px Archia Bold, primary green color). 2-column subtitle: "Things should move just right" (left) + description of the motion philosophy (right)
2. **Full-width hero image**: Motion illustration/animation with `rounded-[30px]`
3. **Personality section**: Heading "Personality" in Borna Bold 42px. Three cards in a `CardGrid`:
   - "Quick not rushed" — description of snappy, purposeful timing
   - "Alive not hyperactive" — description of subtle, organic movement
   - "Quirky not chaotic" — description of playful but controlled personality
4. **Spring & timing tokens**: Interactive demos of each spring/duration/easing
5. **Choreography rules**: Stagger, direction, hierarchy
6. **Reduced motion**: Side-by-side comparison of full vs reduced motion

### Shadows page
1. **Hero**: "Shadows" (152px). Three cards at different elevations
2. **Shadow matrix**: 3×3 grid showing all 9 shadow combinations on cards
3. **Usage guidelines**: When to use which shadow level

### Border Radius page
1. **Hero**: "Radius" (152px). Four shapes showing s, m, lg, xl
2. **Token values**: `TokenTable`
3. **In context**: Radius applied to real components

### Component pages (general pattern)
1. **Hero**: Component name at 152px Archia Bold. 2-column subtitle: what it does + when to use it
2. **ShowcaseBlock**: Component at hero scale on a styled background
3. **Variants section**: Grid/stacked `ExampleBlock` per variant
4. **Sizes section**: All sizes side by side
5. **States section**: Default, hover, focus, disabled in a grid
6. **Interactive playground**: Live example with toggleable props (preserve existing)
7. **Props/tokens used**: Clean table
8. **Accessibility notes**: ARIA, keyboard, screen reader

### Philosophy pages
Refactor to use `PageHero` (152px title), `Section`, `CardGrid` where appropriate. Preserve content, dramatically improve whitespace and typography hierarchy.

---

## Implementation rules

1. **Three font families**: `font-brand` (Archia) for hero titles and nav, `font-display` (Borna) for section headings, `font-sans` (Inter) for everything else. Never use Archia in component UI or body text.
2. **Use only semantic color tokens** — `var(--color-surface-1)`, `var(--color-on-surface)`, etc. Never hardcode hex values except for the hero title color `#003204` which gets its own CSS variable `--color-hero-title`.
3. **Use the existing spacing scale** — `gap-2` (8px), `gap-4` (16px), `gap-5` (20px), `gap-6` (24px), `gap-8` (32px), `gap-10` (40px), `gap-20` (80px).
4. **Use existing border radius tokens** — `rounded-s`, `rounded-m` (12px), `rounded-lg`. Exception: hero images use `rounded-[30px]`.
5. **Use existing shadow tokens** — `shadow-small-1`, `shadow-medium-2`, etc.
6. **Animation**: Use motion tokens from `src/tokens/motion.ts`. Sidebar transitions use `spring.snappy`. Page/section reveals use `spring.default` or `transition.reveal`. Dark mode toggle slide uses `spring.snappy`. Use `useReducedMotion` for accessibility.
7. **Responsive**: Sidebar collapses on narrow viewports (< 1024px). Content reflows from 2-column to single-column. Hero titles scale down proportionally (152px → ~80px on mobile). Test at 1440px, 1280px, 1024px, 768px.
8. **Preserve all existing component showcases** — every component currently demonstrated must still be demonstrated. You're improving presentation, not removing content.
9. **Preserve the standalone page feature** — `?standalone=<pageId>` should still work.
10. **Preserve the playground entry point** — `/playground/` must continue to work via Vite multi-page setup.

---

## Implementation order

Since this is a large refactor, work in this order:

1. **Font setup** — Add Archia to the project: font files, `@font-face`, Tailwind config, hero title CSS variable
2. **Sidebar** — Build the new sidebar exactly matching Figma: logo + DS chip, dark mode pill toggle, category labels, active state with blue bar
3. **Layout components** — Build `PageHero`, `Section`, `CardGrid`, `ExampleBlock`, `ShowcaseBlock`, `DosDonts`, `TokenTable`, `FullBleed`, `DocsLayout`
4. **Hello page** — First page to build (simple, proves the hero pattern)
5. **Motion page** — Second page (matches the Figma reference frame exactly — hero + image + personality cards)
6. **Colors page** — Third (most visual foundation page, includes ContrastExplorer)
7. **Typography page** — Fourth (needs all three fonts to be working)
8. **Remaining foundations** — Shadows, Border Radius, Icons
9. **Component pages** — Start with Button, work through the rest
10. **Philosophy pages** — Wrap existing content in new layout components
11. **Screen Vault pages** — Mostly work as-is, update navigation integration

---

## Reference: what Wise does well (and what we're taking)

- **Big, confident typography** — we're going even bigger (152px vs their ~64px)
- **Color as storytelling** — full-bleed color blocks that make you *feel* the palette
- **Consistent but varied** — same bones (hero → content → details), unique treatments per page
- **Do/don't patterns** — correct vs incorrect usage side by side
- **Whitespace as luxury** — 80px between sections, 40px internal padding
- **Component pages have narrative** — "here's when to use this, here's why, here's how"
- **Three-tier typography** — they use a brand font for navigation + a display font for headings + a body font. We're doing the same: Archia + Borna + Inter

---

## What NOT to do

- Don't add animations just because you can — keep it purposeful
- Don't create a component library import system — keep using direct imports
- Don't add react-router or any new dependencies (Archia font files are an exception, not a dep)
- Don't break the dark mode toggle or theme system
- Don't reduce the number of showcased components/states
- Don't use hardcoded colors — everything through semantic tokens (except `--color-hero-title`)
- Don't use Archia anywhere outside hero titles and sidebar navigation — it's a brand accent, not a workhorse
- Don't add a search feature (yet) — that's a separate task
- Don't add background highlights to sidebar hover states — keep nav items clean
