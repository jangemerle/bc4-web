# Phase 1 Launch Videos — Outline & Scripts

Ready-to-film video outlines for Month 1-2. Each includes estimated timing, key scenes, and talking points.

---

## Video 1: "What Are Design System Faces? (And Why They Matter for AI-Assisted Dev)"

**Duration:** 10 minutes | **Target Retention:** 60%+
**Upload:** Week 1 (Tuesday)

### Thumbnail
Text: "Design System Faces?"
Visual: Side-by-side component variants showing different aesthetic directions
Color: High contrast (e.g., Kvalt primary + white)

### Title
**Option A:** "What Are Design System Faces? (AI-Assisted Dev Secret)"
**Option B:** "Design System Faces Explained: Why Developers Love Them"
**Option C:** "The Design Decision Behind Kvalt's 'Face' System [15 min Deep Dive]"

**Chosen:** Option A (40 chars, includes power word "Secret", parenthetical signal)

### Hook (0:00-0:30)
```
"If you're building a design system, you've probably thought:
'I want ONE aesthetic, but I need it to feel different in different contexts.'

Design system FACES solve exactly this problem. And they're about to become
essential for every AI-assisted design workflow.

In the next 10 minutes, I'm showing you what they are, why Kvalt built them,
and how they'll change the way you think about component libraries."
```

### Section 1: The Problem (0:30-2:00)

**Talking Points:**
- Traditional design systems = one aesthetic, one set of tokens
- Reality: You need dark mode, you need "professional vs playful," you need different tones
- Current solution: Create separate component libraries (maintenance nightmare)
- Better solution: One library, multiple FACES

**Visual:**
- Show typical design system (Tailwind, shadcn, etc.)
- Show copy-paste approach (multiple folders, duplicated components)
- Chart: Maintenance burden (lines of code, time to implement new component)

**Script Example:**
```
"Most design systems today work like this: you define your tokens once,
you build your components once, and everything is locked into that single aesthetic.

But reality is messier. Your enterprise app needs a professional face.
Your startup site needs playful. Your SaaS needs minimal. Your mobile app needs dense.

Right now, the industry solution is... create three design systems.

That's what we had before Kvalt. It doesn't scale."
```

### Section 2: What Are Faces? (2:00-5:00)

**Talking Points:**
- Definition: Pre-configured aesthetic variations of the same component system
- NOT different components, NOT theme switching — same components, different token configs
- Example: Button component stays the same, but color/radius/shadow/spacing configs change
- Think of it like: same car (components), different paint jobs (faces)

**Visual:**
- Show same component with 3 different faces side-by-side
- Animate the change (fade transition between faces)
- Show token changes in code (color palette, radius values, shadow depth)
- Quick diagram: Components + Token Faces = Full System

**Script Example:**
```
"A FACE is a pre-configured set of design tokens that completely transform
how your components look and feel — without changing a single line of component code.

Here's a button component. Same button. Watch what happens when I switch faces.

[Fade animation between faces]

Same button, different vibe. Professional. Playful. Minimal. Dense.

The component doesn't change. The tokens do. That's the power.

In code, this means: one component library, infinite aesthetics."
```

### Section 3: Why This Matters for AI (5:00-7:30)

**Talking Points:**
- AI tools (Claude, etc.) can now generate components
- Problem: Generated components need to fit your aesthetic instantly
- Solution: AI generates in component language, face config applies your aesthetic automatically
- Consequence: Designers don't need to manually tweak every AI-generated component

**Visual:**
- Show AI generating a component (mock demo or recording)
- Show component generated with "default" face
- Show component with Kvalt face applied (instant transformation)
- Show the same component in 3-4 different contexts (still one generated component, different faces)

**Script Example:**
```
"Here's where this gets exciting for AI.

Right now, if you ask Claude or any AI to generate a component, you get...
something generic. You then have to manually adjust colors, spacing, radius to match your brand.

With design system faces, the process flips.

Generate the component. Apply your face. Done.

The AI knows: 'Generate this button using the component pattern.'
Your system knows: 'Apply the Kvalt aesthetic.'

One AI component can instantly look professional in a financial app,
playful in a creator tool, minimal in a design system docs site.

That's the future. That's what Kvalt enables."
```

### Section 4: The Kvalt Approach (7:30-9:00)

**Talking Points:**
- Kvalt doesn't replace your design system (Tailwind, shadcn, etc.)
- Kvalt = pre-built faces + tools to create your own
- Opinionated but extensible
- Works as: config file, Figma library, React component system, whatever

**Visual:**
- Show Kvalt homepage or product
- Show available faces (professional, playful, minimal, etc.)
- Show how someone could customize a face
- Show the config file (or token export)

**Script Example:**
```
"Kvalt isn't a design system itself. It's configuration infrastructure for design systems.

We've created five pre-built faces. Professional. Playful. Minimal. Dense. Accessible.

Each one is completely thought through: color palettes, typography scale,
motion tokens, spacing systems, border radius patterns.

But here's the key: you can start with one of ours, or build your own.

The infrastructure stays the same. The faces change.

And the best part? Every face works with Tailwind, shadcn, or any component system.
Because faces are just tokens. They're composable. They're portable."
```

### Section 5: Live Demo (9:00-9:45)

**What to Show:**
- Switch between 2-3 faces on a real component
- Show one small component library (e.g., 3-4 components)
- Show how same components look in different faces
- Quick code view: show token swaps in action

**Script Example:**
```
"Let me show you a real example.

Here's a simple component library: card, button, input, badge.

Now I'm switching faces. Watch the transformation.

[Switch to professional face: muted colors, sharp angles, dense spacing]

Same components. Professional vibe. Enterprise ready.

[Switch to playful face: bright colors, rounded, spacious]

Same components. Friendly. Creative. Accessible.

[Switch to minimal face: grayscale-heavy, clean lines, intentional whitespace]

Same components. Focus. Clarity. Distraction-free.

And because faces are just configuration, adding a new face takes hours,
not weeks. You're not duplicating components. You're not managing multiple systems.

You're composing with configuration."
```

### Outro/CTA (9:45-10:00)

**Script Example:**
```
"Design system faces are the future of component-driven development.

If you're curious about applying this to your own system,
we've built Kvalt specifically to make this easy.

Head to kvalt.design to explore. First three faces are free.

Like this video if you think this is the future of design systems.

See you next week."
```

---

## Video 2: "Design System Setup: Kvalt vs [Competitor]"

**Duration:** 12 minutes | **Target Retention:** 55%+
**Upload:** Week 2 (Friday)

### Thumbnail
Text: "Kvalt vs [Competitor]"
Visual: Split screen, two different design systems side-by-side
Color: Contrasting colors for each side

### Title
**Option A:** "Design System Architecture: Kvalt vs Tailwind vs shadcn"
**Option B:** "The Right Way to Set Up a Design System in 2025"
**Option C:** "Design System Setup Comparison: Process, Trade-offs, Decisions [Guide]"

**Chosen:** Option A (best CTR potential, comparison format naturally clickable)

### Structure

**0:00-1:00: Hook**
- "Three popular approaches to design systems: Tailwind (utility-first), shadcn (component-based), Kvalt (face-based)."
- "Each solves different problems. None is 'the best.' Here's how to pick."

**1:00-3:00: The Tailwind Approach**
- Low-level utilities as source of truth
- Fast to build, easy to customize
- Downside: Consistency is your problem, not theirs
- Good for: Teams that want total control
- Visual: Show Tailwind config, build a component with utilities

**3:00-5:00: The shadcn Approach**
- Pre-built components, you own the code
- Fast + batteries-included
- Downside: Styling is copy-paste, not systematic
- Good for: Quick MVPs, single product with one aesthetic
- Visual: Show shadcn installation, component override example

**5:00-7:30: The Kvalt Approach**
- Pre-configured faces, systematic tokens
- Fast implementation + consistency
- Downside: Opinionated by design (you're adopting a taste)
- Good for: Teams that want beautiful defaults + flexibility
- Visual: Show face swapping, token system, extensibility

**7:30-9:30: Trade-offs Matrix**
- Speed to first component
- Consistency enforcement
- Customization ease
- Team skill requirement
- Long-term maintenance
- Visual: Table or side-by-side comparison

**9:30-11:30: Which One Is Right?**
- Decision tree: Are you a startup or enterprise? Speed or consistency? Solo or team?
- Real-world scenarios and recommendations
- Visual: Decision tree or flowchart

**11:30-12:00: Outro**
- "Pick the approach that matches your team's constraints."
- "We'll do a deep dive on each in future videos."
- CTA: Try Kvalt if you want beautiful defaults + face flexibility

---

## Video 3: "How We Named Our Design Tokens: Design System Naming Conventions"

**Duration:** 8 minutes | **Target Retention:** 58%+
**Upload:** Week 3 (Tuesday)

### Thumbnail
Text: "Token Naming" (with a code snippet visual)
Visual: Three naming conventions side-by-side (with X marks and checkmarks)
Color: Error/success colors (red ❌ green ✓)

### Title
**Option A:** "Design Token Naming Explained: Semantic vs Descriptive [Quick Guide]"
**Option B:** "Why Good Token Names Matter (Design Systems Lesson)"
**Option C:** "The 3 Token Naming Mistakes That Broke Our Design System"

**Chosen:** Option C (emotional hook, mistake-framing drives curiosity)

### Structure

**0:00-0:45: Hook + Problem**
```
"We named our design tokens wrong. Three times.

And every time, it cost us days of refactoring when we wanted to change a color
or add a new aesthetic.

Token naming seems small. It's not. It compounds.

In this video, I'm showing you the three mistakes we made,
and the naming system that finally worked."
```

**0:45-2:15: Mistake #1 — Descriptive Names Only**
- ❌ `color-blue-light` (what if you want to use this blue for danger?)
- Problem: Couples naming to appearance, breaks when you add new faces
- Visual: Show token cascade, show breakage when face changes

**2:15-3:45: Mistake #2 — No Hierarchy**
- ❌ `button-primary-background`, `card-primary-background`, `input-primary-background` (duplication)
- Problem: You're naming by component, not by semantic value
- Result: Maintenance nightmare, no reusability
- Visual: Show component-scoped tokens, point out duplication

**3:45-5:15: The Right Approach — Semantic Naming**
- ✓ Separate semantic layer: `color-primary`, `color-background`, `color-border`
- ✓ Semantic naming first (what's the semantic role?)
- ✓ Tokens don't mention components
- Visual: Show token hierarchy, show how one semantic token applies across components

**5:15-6:30: Advanced: Cross-Face Consistency**
- How Kvalt uses semantic naming to support multiple faces
- Professional face: `color-primary` = corporate blue
- Playful face: `color-primary` = vibrant orange
- Same token name, different value per face
- Example: Show token in JSON, show how it changes per face

**6:30-7:45: Quick Tips**
- Use semantic prefixes (not component prefixes)
- Keep hierarchy shallow (color-, spacing-, radius-, font-)
- Name for your brand values, not your colors
- Test it: Can this token apply to 3+ different components? If no, it's too specific.

**7:45-8:00: Outro**
```
"Good token naming scales. Bad token naming breaks the moment you want to add a new face.

Next week, we're building a component library using these naming principles.

See you then."
```

---

## Video 4: "Building Your First Component Library: Config-Driven Approach"

**Duration:** 15 minutes | **Target Retention:** 52%+
**Upload:** Week 4 (Friday)

### Thumbnail
Text: "Component Lib Setup" (or just "Build Components")
Visual: Before/after: messy code → clean component structure
Color: High contrast

### Title
**Option A:** "Building a Component Library From Scratch: Step-by-Step [No Boilerplate]"
**Option B:** "Component Library Setup: The Config-Driven Way (Complete Guide)"
**Option C:** "I Built a 10-Component Library in 15 Minutes [Here's How]"

**Chosen:** Option A (clear, step-by-step, "no boilerplate" removes friction signal)

### Structure

**0:00-1:30: Intro + What We're Building**
```
"In the next 15 minutes, we're building a production-ready component library.

Not a tutorial project. A real library you could ship to users.

Button. Card. Input. Badge. Modal. Tooltip. 5 components,
all using Kvalt's semantic token system.

By the end, you'll have:
1. A working component library
2. Three pre-built faces (professional, playful, minimal)
3. Configuration system for adding new faces

Let's build."
```

**1:30-3:00: Project Setup**
- Show file structure (components/, tokens/, faces/)
- Show entry point
- Show how tokens flow into components
- Visual: Folder structure, then show a component importing tokens

**3:00-6:30: Building the First Component (Button)**
- Start with spec: button needs size variants, color variants, loading state
- Show semantic tokens (already defined): color-primary, color-text, spacing-sm, radius-md
- Build component using tokens (React example, or whatever)
- Swap faces live (same component, different appearance)
- Explanation: "Notice we're not hardcoding any values. It's all tokens."

**6:30-9:00: Building the Second Component (Card)**
- Reuse pattern from button
- Show how same tokens apply differently
- Add complexity: card has header, body, footer
- Show inheritance and composition
- Live demo: change one token, watch all cards update

**9:00-12:00: Extending with New Faces**
- Add a 4th face (e.g., "Dense") beyond the three pre-built
- Show what changes: color palette, spacing, radius
- Show what stays the same: component structure
- Build time: ~5 minutes (not hours)
- Explanation: "This is why faces matter. Adding a new aesthetic is configuration, not code."

**12:00-14:00: Exporting & Using This Library**
- Show how to export as npm package
- Show how to use in a real project
- Show TypeScript support (auto-complete on design tokens)
- Live example: build a landing page using the component library, switch faces

**14:00-14:45: What's Next**
- Documentation
- Adding tests
- CI/CD for token updates
- Accessibility auditing
- Teasing next video

**14:45-15:00: Outro & CTA**
```
"You now have a design system that can support multiple aesthetics
without duplicating code.

This is the foundation. Next week, we're adding accessibility testing.

Fork the code on GitHub (link in description). Build your own faces.

See you next week."
```

---

## Optional: Quick-Reference Filming Checklist

- [ ] Camera setup: Good lighting, clean background, no distractions
- [ ] Audio: Lavalier mic or USB condenser, test levels
- [ ] Screen recording: 1080p or 1440p, 60fps for motion demos
- [ ] Zoom/focus: Show code clearly, not too fast
- [ ] B-roll: Component in different states, color swaps, animations
- [ ] Branding: Kvalt logo in corner or intro slide
- [ ] CTAs: Consistent "like, subscribe, link in description" format
- [ ] Pacing: Script out talking points, avoid reading directly
- [ ] Thumbnails: Create before upload, test click-ability

---

## Notes for Jan

1. **Scripting:** These are outlines, not word-for-word scripts. Improvise naturally; viewers prefer conversational tone over reads.

2. **Demo Prep:** Pre-record all demos. Don't live-code; it's unpredictable and slower.

3. **Editing:** Cut out pauses, ums, and long silences. Keep pacing tight. Music/SFX for scene changes.

4. **Publishing:** Upload all 4 videos, then schedule them Tue/Fri for 4 weeks. Don't upload all at once (algorithm likes fresh content).

5. **Testing:** Film one video, publish, get feedback, refine based on CTR and retention. Iterate on style before committing to entire series.

6. **Monetization:** Once at 4k hours watch time + 1K subs, apply for YouTube Partner. Focus on sponsorships after 50K subs.

---

_End of Phase 1 Scripts. Return to youtube-for-design-systems.md for full research context._
