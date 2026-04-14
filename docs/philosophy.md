# Kvalt — Design Philosophy

Four pillars define Kvalt's personality: Motion, Tone of Voice, Accessibility, and Design Principles. Each has a dedicated interactive page in the showcase app.


## Motion Guidelines

**Personality**: Quick, not rushed. Alive, not hyperactive. Quirky, not chaotic.

### Choreography Rules
- Exit before enter — old content leaves before new arrives
- Parent before children — container animates, then contents follow
- 50ms stagger maximum — between sibling elements
- Dismiss faster than reveal — closing feels snappier than opening

### Performance Rules
- Only animate composited properties: `transform`, `opacity`
- Never animate `height`, `width`, `top`, `left` directly
- Use Motion's layout animations for size/position changes
- Box shadows are Motion-controlled — no Tailwind transition on animated components

### Accessibility
- Respect `prefers-reduced-motion` via `useReducedMotion` hook
- Reduced motion: opacity-only fades under 200ms, no spatial animation
- No infinite animation loops
- Never animate information that's critical to understanding

### Golden Rule
If you removed every animation, nothing should break or be confusing.


## Tone of Voice

**Character**: Clear, not clinical. Warm, not gushing. Brief, not curt.

### Writing Rules
- Buttons: verb + noun ("Create account", "Save changes")
- Errors: what went wrong + what to do ("Email not found. Check spelling or sign up.")
- Empty states: acknowledge absence, explain why, suggest action, one CTA
- Sentence case everywhere
- No exclamation marks in UI

### Words to Avoid
"Click here", "Please", "Successfully", "Simply/Just/Easy", "Invalid input", "Are you sure?"

### Principles
- Start with user actions, not system states
- Active voice, not passive
- One idea per sentence
- Important word last (for scanning)


## Accessibility

**Stance**: If it's not accessible, it's not done.

### Three Pillars
- Inclusive, not patronising
- Robust, not fragile
- Obvious, not clever

### Focus Rings
Every interactive element has a visible focus ring:
```
outline-none focus-visible:outline focus-visible:outline-2
focus-visible:outline-[var(--color-primary-1)] focus-visible:outline-offset-2
```

### Color
Color is never the sole carrier of meaning. Status is always reinforced with icons, text, or pattern.

### Keyboard Navigation
All flows are keyboard-accessible: Tab, Enter, Space, Escape, Arrow keys where appropriate.

### Screen Readers
Semantic HTML first, ARIA attributes where semantic elements aren't sufficient. Every component has appropriate roles, labels, and live regions.

### Contrast
All text meets WCAG AA (4.5:1 normal text, 3:1 large text). The Accessibility page documents specific color pairings and their contrast ratios.


## Design Principles

### Gestalt
Proximity, similarity, continuity, closure, figure/ground — used to create visual relationships without explicit decoration.

### Hierarchy
Visual weight through type scale, color contrast, and spatial prominence. Scanning patterns (F-pattern, Z-pattern) inform layout decisions.

### Composition
Alignment to grid, balance (symmetric and asymmetric), whitespace as a structural element, density appropriate to context.

### Rhythm
Spacing scale tokens create consistent vertical rhythm. Repetition of patterns builds familiarity. The 4px base unit ensures everything aligns.

### Practical Checklist (8 heuristics for layout review)
1. Can I tell what's most important in 2 seconds?
2. Are related things visually grouped?
3. Is there a clear reading path?
4. Does the density match the context?
5. Is alignment consistent?
6. Is whitespace intentional, not leftover?
7. Does the layout work at different widths?
8. Would removing any element break understanding?
