# Kvalt — System Overview

Last updated: 2026-03-24

## What is Kvalt

Kvalt is a design system built from scratch in React + TypeScript. It started as a personal learning project to develop frontend engineering, design systems thinking, motion design, and accessibility skills — but it's evolving into a production-ready operational asset.

The source of truth for all visual designs is a Figma file called "Topic Board New" (file key: `GKdrp6fzNGwF0XKPO5MDQz`). A second Figma file, "BC Call Centrum" (`UEZqLZJloo597fklh9ldaD`), contains real-world application screens that use the DS components.

The DS includes a living documentation site (the app itself) that showcases every component, foundation, and philosophy page with all variants, states, and specs.


## Tech Stack

- **React 19** + **TypeScript 5.9**
- **Vite 8** — build tool + dev server
- **Tailwind CSS 3** + PostCSS — styling via utility classes + semantic CSS variables
- **Motion 12** (formerly Framer Motion) — animation library
- **Lucide React** — icon library (mapped from Untitled UI Figma icons)
- **clsx + tailwind-merge** — class name utilities via `cn()` helper


## Project Structure

```
kvalt/
├── docs/                  # ← YOU ARE HERE — DS documentation
│   ├── SYSTEM.md          # This file — master overview
│   ├── COWORK.md          # Mentor personas and interaction guidelines
│   ├── tokens.md          # All design token values and usage
│   ├── philosophy.md      # Motion, tone, accessibility, design principles
│   ├── conventions.md     # Coding rules and patterns
│   ├── roadmap.md         # What's next, priorities, business context
│   └── components/        # Per-component documentation
├── specs/                 # Component build specifications
├── .skills/               # Custom skills (figma-to-kvalt, check-tokens, etc.)
├── knowledge/             # Curated insights, research, and digests
├── audits/                # Audit reports
├── playground/            # Interactive learning exercises
├── src/
│   ├── components/        # DS components (25 built)
│   │   └── ui/            # Low-level primitives
│   ├── tokens/            # Design tokens (TypeScript source of truth)
│   │   ├── colors.ts      # 6 palettes × 12 shades + semantic tokens
│   │   ├── motion.ts      # Springs, durations, easings, transitions
│   │   ├── typography.ts  # Font families, scales, named styles
│   │   ├── shadows.ts     # 3 sizes × 3 intensities
│   │   ├── borderRadius.ts
│   │   └── icons.ts       # Icon size scale
│   ├── pages/             # Documentation & showcase pages
│   │   ├── components/    # Component doc pages (20)
│   │   ├── foundations/   # Foundation pages (6)
│   │   ├── philosophy/    # Philosophy pages (6)
│   │   └── screen-vault/  # Screen example pages (7)
│   ├── layouts/           # Doc layout components (PageHero, Section, etc.)
│   ├── hooks/             # usePress, useReducedMotion
│   ├── styles/            # CSS: globals, semantic tokens, fonts
│   ├── lib/               # Utilities (cn.ts, contrast.ts)
│   ├── data/              # Demo data, icon categories
│   ├── utils/             # illustrationPicker, etc.
│   ├── App.tsx            # Main showcase app with sidebar nav
│   └── main.tsx           # Entry point
├── scripts/               # Build & utility scripts (image optimization, security)
├── CLAUDE.md              # Claude Code / Cowork instructions (points to docs/)
├── tailwind.config.js     # Token configuration
└── package.json
```


## What's Built

### Foundations
- Typography system: Inter (body) + Borna (headlines), full scale
- Color system: 6 HSLUV-based palettes, light + dark semantic tokens, WCAG pairings
- Spacing: 4px base unit, 15-step scale
- Border radius: 4 semantic tokens (s/m/lg/xl)
- Shadows: 9 tokens (3 sizes × 3 intensities)
- Motion: durations, easings, springs, semantic transitions, global speed multiplier
- Icons: Lucide React with 4 size variants via Icon component

### Components (25)
Badge, Button, Checkbox, Chip, ContrastExplorer, DatePicker, DropdownMenu, FormParts, HsluvExplainer, HsluvExplainers, Icon, Illustration, Input, LoadingIndicator, Modal, NumberInput, RadioButton, SearchInput, Select, Skeleton, Table, Tabs, TextArea, Toggle, UserAvatar

### Documentation Pages
- **Component pages (20):** Badge, Button, Checkbox, Chip, DataTable, DatePicker, DropdownMenu, Input, LoadingIndicator, Modal, ModalExamples, NumberInput, RadioButton, SearchInput, Select, Skeleton, Tabs, TextArea, Toggle, UserAvatar
- **Foundation pages (6):** Colors, Typography, Border Radius, Shadows, Icons, Illustrations
- **Philosophy pages (6):** Motion Guidelines, Tone of Voice, Accessibility, Design Principles, Illustration Philosophy, UX Copywriting
- **Screen Vault pages (7):** Login, Signup, Empty State, Global Search, Modals, Todo List, Verify Email

### Infrastructure
- Dark mode with localStorage persistence + flicker-free loading
- Responsive showcase app with sidebar navigation
- CLAUDE.md for Claude Code development guidelines
- Full documentation system (this folder)


## Theme System

Theme switching uses a `dark` class on `<html>`. All components use semantic CSS variables (`var(--color-*)`) defined in `src/styles/tokens.css`, so dark mode works automatically without component changes.

Persistence: dark mode preference is saved to localStorage (`blueprint-dark-mode`) and applied before first paint via an inline script in `index.html`.


## Figma Sources

- **Topic Board New** (`GKdrp6fzNGwF0XKPO5MDQz`): Component specs, tokens, foundations. This is the DS source of truth.
- **BC Call Centrum** (`UEZqLZJloo597fklh9ldaD`): Real-world application screens using DS components — tables, forms, modals, navigation.


## Documentation Index

- **[tokens.md](./tokens.md)** — Every token value: colors, typography, spacing, radius, shadows, motion, icons
- **[philosophy.md](./philosophy.md)** — Motion guidelines, tone of voice, accessibility rules, design principles
- **[conventions.md](./conventions.md)** — Coding rules, patterns, do's and don'ts
- **[roadmap.md](./roadmap.md)** — Priorities, planned components, business context
- **[components/](./components/)** — Per-component docs: props, behavior, status, Figma source
