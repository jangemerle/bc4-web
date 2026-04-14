# Kvalt Default — Character Instructions for AI

You are building with the **Kvalt Default** character. This is a professional SaaS design system with personality in the details.

## Design Philosophy

- **Professional but alive.** Not sterile, not playful. The UI should feel trustworthy and considered.
- **Green accents on cool neutrals.** Primary green (#7DDB85) is energetic but not aggressive. The dark navy text (#14263E) anchors everything.
- **Every interaction has weight.** Buttons press with spring.snappy, modals arrive with spring.default, success states celebrate with spring.playful.
- **Structured hierarchy.** Borna for headlines (authoritative), Inter for body (readable). Two fonts, clear roles.

## Token Rules

### Colors
- Use semantic tokens (`var(--color-primary-1)`, `var(--color-surface-3)`), never raw hex values
- Background hierarchy: bg → surface-1 → surface-2 → surface-3 (each layer is slightly darker)
- Text on light surfaces: `--color-on-surface` (#14263E), never pure black
- Subtle text: `--color-on-surface-subtle-1` for secondary info, `-subtle-2` for tertiary

### Typography
- Headlines: `font-display` (Borna), sizes headline-s through headline-2xl, weight bold or medium
- Body text: `font-sans` (Inter), sizes 2xs through lg, weight medium/semibold/bold
- Never mix: no Borna in body text, no Inter in headlines

### Spacing
- 4px base unit. Use Tailwind spacing scale: p-1 (4px) through p-24 (96px)
- Component internal padding: typically p-3 (12px) to p-5 (20px)
- Section gaps: gap-5 (20px) to gap-8 (32px)

### Border Radius
- Small controls (tags, badges): rounded-s (6px)
- Inputs, buttons, chips: rounded-m (8px)
- Cards, modals, panels: rounded-lg (12px)
- Pills, avatars: rounded-full

### Shadows
- Subtle elevation: shadow-small-1
- Cards and dropdowns: shadow-medium-2
- Modals and popovers: shadow-large-2
- Never use more than one shadow level within a component

### Motion
- Press feedback: `spring.snappy` (instant, no bounce)
- Panels and modals: `spring.default` (hint of life)
- Success states and celebrations: `spring.playful` (visible bounce)
- Color transitions: `duration.instant` + `ease.standard`
- Never hardcode timing values — always import from `tokens/motion.ts`

## Do's
- Use the `usePress` hook for any interactive element with a press animation
- Gate spatial animations behind `useReducedMotion()`
- Use `cn()` helper for class merging
- Follow the component composition patterns in the existing codebase

## Don'ts
- Don't use whileTap directly (use usePress instead)
- Don't use pure black (#000000) for text — always use semantic tokens
- Don't add CSS transitions to properties that motion.dev controls (boxShadow, scale, etc.)
- Don't use inline hex colors — all colors must come from CSS variables
