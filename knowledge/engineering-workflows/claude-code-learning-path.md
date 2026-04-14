# How I'd Learn Claude Code if I Had to Start Over in 2026

**Source:** Michele Torti (YouTube)
**URL:** https://www.youtube.com/watch?v=kjo_Ol9jgmo
**Added:** 2026-03-18
**Type:** YouTube video (~17 min, published Mar 15, 2026, 4.6K views)

---

## Who is Michele Torti

AI agency operator who scaled to six figures working with 50+ businesses on AI solutions. Teaches 20,000+ people, started with zero technical knowledge. Runs a Skool community and 90-day mentorship program. His angle: Claude Code for non-technical entrepreneurs and agency owners, not for existing developers.

---

## Key Takeaways

### 1. What NOT to learn first

Explicitly: don't start with MCP servers, don't start with agent teams, don't start with hooks and custom configurations. These are the things blowing up on YouTube demos, but starting there is "like trying to learn driving by jumping into a Formula 1 car." The foundations are simple, and most people never need the advanced features.

### 2. Step 1: The mental model shift

Claude Code is not a code editor. It's not VS Code or Cursor. It's an AI agent that lives in your terminal. The most important skill is not coding — it's communication. Think of it like hiring a developer: describe the end result clearly, review what they built, give useful feedback. This is why non-technical people (freelancers, agency owners, entrepreneurs) can build things that previously cost thousands to outsource.

### 3. Step 2: Master CLAUDE.md (the most important feature)

Every new session starts with zero context. CLAUDE.md is onboarding a new employee — explaining the codebase, the project, the rules, the preferences. His skeleton structure:

1. **Project description** — What we're building, who it's for, what problem it solves
2. **File structure** — Where different file types go, how the project is organized
3. **Coding conventions** — Frameworks, naming conventions, style guidelines
4. **Rules and constraints** — What Claude should never do, hard boundaries, immutable requirements

His real example: a landing page for "JM Solutions" — includes target audience ("agency owners doing 50–500K/month"), specific tech stack (vanilla HTML5, CSS3, JavaScript), file structure rules, and constraints (dark theme only, no light mode toggle, images use placeholder gradients, page weight under 100KB).

He spends 10 minutes writing a CLAUDE.md for every project and says it saves 10 hours of back-and-forth.

### 4. Step 3: The core framework — Plan, Execute, Review, Test

This is "80% of using Claude Code effectively":

- **Plan** — Always start in plan mode. Describe what you want, let Claude Code break it down step by step, review the plan before any code is written.
- **Execute** — Approve the plan, Claude builds it. You don't need to understand the code — you reviewed the plan.
- **Review** — Look at what was created. Open the app, scroll through. Does it match what you wanted? Is anything off?
- **Test** — Run it. Press the buttons. Go through step by step. If something breaks, tell Claude Code and it fixes it.

Then repeat. He demonstrates this live, building a landing page from a Dribbble reference image. Key detail: he toggles back to plan mode for changes instead of bypass mode, because he wants Claude to plan the changes before making them.

### 5. Step 4: Build something real, not a tutorial project

Stop watching tutorials. Pick a real project that solves a real problem: a landing page for a business, a dashboard that pulls live API data, an automation script that saves 3 hours a week, a Chrome extension. It almost doesn't matter what — what matters is that it's real. Every build becomes a case study, a portfolio piece, and potentially something you can sell.

### 6. Step 5: Go advanced only after foundations

Custom slash commands, MCP servers, and agent teams are force multipliers — they make everything faster, but only if you have the foundation. Learn custom commands only when you find yourself repeating the same thing to Claude Code. Learn MCP servers only when you need external API connections. Learn agent teams only when you need multiple specialized agents on different parts of a project.

### 7. The Dribbble-as-reference trick

For visual projects: find a design you like on Dribbble, copy the image, paste it directly into Claude Code with a prompt saying "use this as reference design style." Combined with a good CLAUDE.md and plan mode, this produces quality results on the first generation.

---

## Relevance to Kvalt

**CLAUDE.md validation:** Kvalt already has a comprehensive `CLAUDE.md` at the project root. Torti's framework (project description, file structure, coding conventions, rules/constraints) maps almost exactly to what we have. His "10 minutes saves 10 hours" framing is worth quoting when onboarding new contributors.

**Skills = reusable commands:** The `.skills/` folder pattern is the Kvalt equivalent of Torti's "custom slash commands" — persistent context that prevents rediscovery each session. When we build Figma-to-code translation, page generation, or image optimization skills, we're encoding exactly the kind of institutional knowledge he describes.

**Plan mode as default:** The habit of always starting in plan mode — especially for changes — is worth adopting as a documented convention. Review the plan before execution, especially for component changes that could affect the system.

**Non-technical contributors:** Torti's audience is non-technical. If Kvalt's design system is used by designers or PMs who want to contribute documentation or pages, the CLAUDE.md + plan-execute-review-test framework is exactly how to onboard them into Claude Code workflows.

**Dribbble reference pattern:** For Screen Vault demos or marketing pages, the "paste a Dribbble screenshot as design reference" workflow is a fast way to set visual direction without a full Figma design pass.

---

_Full transcript available (21,816 chars). This digest captures the five-step roadmap and the live demo workflow._
