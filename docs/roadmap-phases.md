# Kvalt — Phased Roadmap

_Created: 2026-04-01_
_Author: Jan + Claude (SaaS Business Mentor hat)_

---

## Where we are right now

Let me be blunt about inventory before proposing anything.

**What's strong:**
- 25+ components, full token system, motion system, dark mode — the DS is real and production-grade
- Documentation site deployed on Vercel — it exists, it runs
- Character/theme picker working in sidebar — the "face switching" concept has a prototype
- Deep research done: three customer personas validated, competitive landscape mapped, pricing modeled, GTM channels ranked, YouTube strategy drafted
- David CTO handoff confirms the spec-export workflow has real demand from at least one team
- "Faces" concept is validated as a positioning play — empty competitive lane, 6–12 month window
- Design voice found: "unintrusive sparky humour" (receipt pricing page, editorial tone)
- Pencil design workflow is productive — you can explore and iterate fast

**What's missing (honestly):**
- Zero public presence — no landing page, no YouTube, no social, no email list, no GitHub stars
- No face has been built end-to-end as a shippable artifact (the face file structure exists as a spec, not as code)
- No spec export system (the David handoff workflow is a concept, not a tool)
- No CLI, no registry, no MCP server
- No tests (no Vitest, no Playwright, no visual regression)
- Audit violations still open (24 hardcoded hex, 7 missing focus rings)
- The docs site is a showcase for you, not yet a product site for customers
- You haven't talked to a single potential paying customer who isn't David

**The core risk:**
You have months of research and building, but nothing public. No feedback loop from the market. The 6–12 month window before shadcn expands presets is ticking. Every week spent perfecting internally is a week not spent learning whether people will actually pay.

---

## The operating principle

**Ship small things that teach you something. Stop building in a vacuum.**

Each phase below ends with something public and measurable. Not a feature list — a learning goal. If the learning says "this isn't working," you pivot early with months of runway saved.

---

## Phase 0: Clean house (1 week)

_Goal: Make what exists presentable. No new features._

**Do:**
1. Fix the audit violations — 24 hardcoded hex, 7 missing focus rings, 5 radius violations. This is craft debt. If anyone looks at the code (David's team, a curious developer from Twitter), sloppy token usage undercuts the entire pitch.
2. Run `check-tokens` on every component. Green across the board.
3. One real git cleanup pass — those "Auto-commit" messages in history look like nobody's steering the ship. Going forward, every commit is conventional format, no exceptions.

**Don't:**
- Add new components
- Touch the docs site design
- Start YouTube or social

**Learning:** None external. This is hygiene. But it unblocks everything else because you can't demo code quality if the code has quality issues.

**Exit criteria:** `check-tokens` passes on all 25 components. Zero audit violations.

---

## Phase 1: One real face, end to end (2 weeks)

_Goal: Prove that a "face" is a real, shippable thing — not just a concept._

This is the single most important phase. Everything you've researched — the pricing, the GTM, the YouTube strategy — depends on faces being a real product. Right now they're a great idea with a file structure spec. That's not enough.

**Do:**
1. Pick ONE face personality. Not "default Kvalt" — a distinct character. Something opinionated: a fintech face, a creative studio face, a brutalist face. One that looks obviously different from base Kvalt when you toggle it.
2. Build it following the face file structure from `faces-technical-architecture.md`: `face.json`, `tokens/`, `variables.css`, `tailwind.config.ts`, and `claude.md`.
3. Make the character picker in the sidebar actually swap this face live on the docs site. Toggle between "Kvalt default" and "Face 1" — same components, different personality.
4. Apply Face 1 to at least 3 Screen Vault pages (Login, Dashboard, Pricing) so the difference is visceral, not theoretical.
5. Write the `claude.md` for Face 1 — the AI instructions file that tells Claude Code / Cursor how to build with this personality. This is the artifact that makes faces AI-native.

**Don't:**
- Build a CLI
- Build more than one face
- Start the spec export system
- Worry about packaging or distribution

**Learning:** Can you actually encode a complete design personality as config? Does the character picker work smoothly? When you show someone Face 1 vs default — do they immediately get it?

**Exit criteria:** Live toggle on the docs site between two distinct visual personalities. Three Screen Vault pages styled in both. One `claude.md` that could, in theory, make an AI produce code in this face's style.

---

## Phase 2: The demo that sells itself (2 weeks)

_Goal: Build the "same app, different face" interactive demo. This IS the product pitch._

Your GTM research nailed it: the demo is the marketing. Linear's screenshots were their ads. Kvalt's face-swap demo is yours. This is the one thing that, if it's good enough, makes people share it without you asking.

**Do:**
1. Build a dedicated demo page (or standalone mini-app) showing one SaaS dashboard styled in 3 faces. Toggle between them. Same layout, same data, completely different personality.
2. The three faces: Kvalt default + Face 1 (from Phase 1) + Face 2 (build a second face now — you'll be faster this time).
3. Make the transitions smooth. This is a motion-focused DS — the face swap itself should feel considered, not janky.
4. Add a simple landing section above the demo: the positioning line ("AI gave everyone speed. Nobody got taste." or whatever version feels right), what faces are, and an email capture.
5. Deploy this as the public-facing entry point. Not the full docs site — a focused, opinionated page that shows the concept and captures interest.

**Don't:**
- Build a full marketing site
- Obsess over copy perfection (you'll iterate)
- Add pricing yet
- Build the CLI

**Learning:** Does the demo make people go "oh, I get it"? Track: email signups, time on page, demo interaction rate. Share the URL in 2–3 places (one Reddit post on r/webdev, one tweet, David's team). Watch what happens.

**Exit criteria:** Public URL with face-swap demo + email capture. At least 10 people outside your circle have seen it and you've noted their reactions.

---

## Phase 3: First public signals (2 weeks)

_Goal: Start the feedback loop. Ship things that create conversations._

This is where you stop building in private. Not a "launch" — just being present.

**Do:**
1. **GitHub:** Create a public repo with 3 free faces (including `claude.md` files). README explains what faces are, how to use them, links to the demo. This is the top-of-funnel. Stars = social proof. Issues = feature requests. Forks = adoption signal.
2. **One YouTube video:** "I Built a SaaS Dashboard With Claude Code — Then Gave It 3 Different Personalities." Your #1 ranked video idea. 8–12 minutes. Show the process, not just the result. This is design-decision-walkthrough format — your unique angle that nobody else does.
3. **One Reddit value post:** r/webdev or r/reactjs. Not promotional. Genuinely useful. "I've been working on a way to give AI-built UIs distinct visual personalities. Here's what I learned." Link to GitHub repo in comments, not in the post.
4. **David's team:** Give them a real spec export for 2–3 components. Not a polished tool — a manually-written spec that they try to use. Watch where it breaks. This is user testing for the spec format.

**Don't:**
- Post daily on Twitter
- Launch on ProductHunt (too early)
- Build the CLI yet
- Record more than one video

**Learning:** Do developers understand what faces are from the GitHub README? Does the YouTube video get watch time or do people drop off? Does David's team actually use the spec, and what's missing? Do Reddit comments say "cool" or "I'd pay for this"?

**Exit criteria:** Public GitHub repo with stars tracked. One YouTube video published. One spec tested by David's team with feedback collected. Email list growing (even if slowly).

---

## Phase 4: The spec export skill (2–3 weeks)

_Goal: Turn the David handoff workflow into a repeatable tool._

Now you build infrastructure — but only because Phase 3 confirmed demand.

**Do:**
1. Build a Claude skill (`.skills/spec-export/`) that reads a Kvalt component or screen and outputs a structured implementation spec. Format: structured markdown that's both human-readable and AI-parseable.
2. The spec captures: visual tokens, typography, motion configs (exact spring/easing/duration values), component states and transitions, accessibility patterns, composition rules, responsive breakpoints, content model and edge cases.
3. Test it on 5 components — compare the spec output to what David's team actually needed. Iterate until the spec is good enough that their AI can produce correct shadcn code from it.
4. Build "Export to shadcn" as the first translator — a skill or script that reads a Kvalt spec and outputs shadcn-compatible code. This is where the product thesis gets tested: can the spec actually bridge design intent to a different stack?

**Don't:**
- Build translators for Radix, MUI, Chakra yet (one target first)
- Build a hosted service
- Over-engineer the spec format (iterate based on David's team's feedback)

**Learning:** Is the spec format rich enough to preserve design intent across stacks? How much manual cleanup does David's team need after the AI translates? Is this 80% automated or 20%?

**Exit criteria:** Spec export skill working for all Kvalt components. David's team has used it on a real project (not a test) and you have their honest feedback.

---

## Phase 5: CLI + distribution (2–3 weeks)

_Goal: Make faces installable the way developers expect._

**Do:**
1. `npx @kvalt/faces init` — scaffolds face config in a project
2. `npx @kvalt/faces add fintech` — copies face source into the project (shadcn mental model)
3. Registry: a JSON manifest listing available faces with metadata
4. Free tier: 3 faces via CLI (no auth required)
5. Pro tier: remaining faces require a license key (Lemon Squeezy or Gumroad, not Stripe — keep it simple)
6. Publish to npm

**Don't:**
- Build the MCP server yet
- Build preset codes
- Add more than 5–6 total faces at launch
- Build a custom payment system

**Learning:** Do developers actually install faces via CLI? What's the drop-off between `init` and `add`? Does the license key flow work smoothly or do people complain?

**Exit criteria:** `npx @kvalt/faces add` working. At least 3 free faces + 2–3 paid faces available. Payment flow tested end to end.

---

## Phase 6: Public launch (2 weeks)

_Goal: Coordinated launch push. Not a quiet link drop — a planned event._

By now you have: a working demo, a GitHub repo with traction, a YouTube channel with at least 3–4 videos, an email list, a CLI, and a payment flow. That's enough for a real launch.

**Do:**
1. **ProductHunt launch.** Frame: "Design personality for AI-built products." Prepare assets: 5 screenshots, a 60-second video, tagline, description. Schedule for Tuesday morning.
2. **Launch video on YouTube.** "Why Every AI-Built App Looks the Same (And How to Fix It)" — your #2 ranked idea. This is the manifesto video.
3. **Email list announcement.** Everyone who signed up in Phase 2–5 gets early access or a launch discount (30% off).
4. **Reddit, Hacker News, Indie Hackers** — one post each, timed to the same week.
5. **Price:** Free (3 faces), Starter $49 (5 faces), Pro $149 (all faces + Figma kit). One-time. PPP for EU/CEE.

**Don't:**
- Expect overnight success (most launches get a spike then settle)
- Stop after launch week (this is the beginning, not the end)
- Discount below $49 for Pro (sets the wrong anchor)

**Learning:** Conversion rate from free to paid. Which face is most popular. Whether the "agency dev" persona converts differently than "vibe coder." ProductHunt ranking and comment sentiment.

**Exit criteria:** Launch completed across all channels. Revenue tracked. Post-launch retrospective written: what worked, what didn't, what to double down on.

---

## Phase 7+: Post-launch priorities (ongoing)

These are ordered by expected leverage, not by excitement level. Sequence based on what Phases 1–6 teach you.

1. **More faces.** Each new face pack is a revenue event. Release in themed drops: "SaaS pack" (fintech, healthcare, education), "Creative pack" (portfolio, agency, editorial). One pack per month.

2. **MCP server.** The AI context provider concept — Cursor/Claude Code connecting to Kvalt live for token lookups and component specs. This is the defensible moat, but only build it after CLI distribution proves demand. "MCP CONNECTED" badge on the docs site becomes a real feature.

3. **YouTube consistency.** 1 video/week. Design decision walkthroughs, face showcases, before/after transformations. The channel compounds — every video brings residual traffic to the product.

4. **More spec export targets.** "Export to Radix," "Export to MUI." Each new target expands the addressable market. But only if the shadcn export is polished and validated first.

5. **Community + contributors.** Once there's traction, open face creation to the community. A "face marketplace" where designers sell faces — Kvalt takes a cut. This is the long-term platform play, but it's premature before you have 1,000+ users.

6. **Theming tool.** The interactive "build your own face" experience. Highest complexity, highest ceiling. Only build this when the market has clearly told you "I want custom faces, not just your pre-made ones."

---

## Timeline (honest estimate)

| Phase | Duration | Cumulative | Public artifact |
|-------|----------|------------|-----------------|
| 0: Clean house | 1 week | Week 1 | None (internal) |
| 1: One real face | 2 weeks | Week 3 | Live face toggle on docs site |
| 2: Demo that sells | 2 weeks | Week 5 | Public URL + email capture |
| 3: First public signals | 2 weeks | Week 7 | GitHub repo + 1 YouTube video |
| 4: Spec export | 2–3 weeks | Week 10 | Working skill + David team feedback |
| 5: CLI + distribution | 2–3 weeks | Week 13 | `npx @kvalt/faces add` working |
| 6: Public launch | 2 weeks | Week 15 | ProductHunt + full launch push |

That puts launch around **mid-July 2026** — roughly 3.5 months from today. Could compress to 3 months if you're aggressive. Could stretch to 4 if life happens. The important thing is that you're publicly visible by Week 5 (early May), not Week 15.

---

## What I'd push back on

A few things from the existing research that I'd challenge now that we're making a concrete plan:

**"Build audience before launch."** Partially agree. But the research implies months of content before selling anything. I'd invert it: build the demo (Phase 2), then let the demo be the content. One share-worthy demo > ten "build in public" tweets.

**"15+ faces for Pro tier."** That's a lot of work before you've validated anyone will pay. Launch with 5–6 total faces (3 free, 2–3 paid). If people buy, make more. If they don't, you haven't spent months building faces nobody wants.

**"Spec export as product play."** It's interesting but it's the second product, not the first. Faces are the product. Spec export is a power-user feature that validates over time. Don't let the David handoff (which is one customer's workflow) pull focus from the primary value prop.

**"MCP server early."** The knowledge base has a lot of excitement about MCP. It's a cool technical feature and a genuine differentiator. But it serves zero customers until there are customers. Ship the CLI first, add MCP when people ask for it.

---

## The one thing that matters most

If you only have energy for one thing this week, it's **Phase 1, step 1: pick a face and build it.** Not more research, not more docs, not more design exploration. One complete face, working end to end, toggling live on the site. Everything else — the demo, the GitHub repo, the YouTube video, the CLI, the launch — depends on that artifact existing.

The research is done. The strategy is clear. Now it's about shipping.
