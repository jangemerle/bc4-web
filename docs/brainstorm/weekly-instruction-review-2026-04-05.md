# Weekly Instruction Review — 2026-04-05

## Sessions reviewed

Sessions from the past 7 days (2026-03-29 → 2026-04-05). Automated tasks (knowledge distiller, bb session logs, docs sync check) noted but not analyzed for conventions.

- **Export regeneration** — Running now, automated Blueprint DS export task
- **Apr 3 – Docs sync check** — Automated. Blueprint DS fully in sync: 25 components documented, tokens match, 3 unbuilt specs (Accordion, Toast, Tooltip) match roadmap. No action needed.
- **Apr 3/4 – Knowledge distillers** — Automated. Found no new Kvalt-specific insights; week was predominantly BrandBastion operational work.
- **Restart project with new design system** — BrandBastion prototype: hover-expand TasksPanel component. Not Kvalt.
- **Analyze Figma design for dev presentation** — Built a `sprint-announcement` skill for BrandBastion. Not Kvalt.
- **Review design system in project folder** — Ran Kvalt dev server to verify color tokens after a palette check. Purely operational, no new conventions.
- **Build BrandBastion design system prototypes** — Attempted OKLCH color conversion; hit Cowork folder mount issue (Kvalt source not accessible via `design-engineer` mount). See Observations.

---

## Suggested updates (requires your approval)

### 1. CLAUDE.md — Split or trim the skills section (⚠️ carry-over)

**What:** CLAUDE.md is now **262 lines** — 62 lines over the 200-line warning threshold flagged in the Mar 29 review. At that point it was 170 lines; it grew 92 lines in one week, almost entirely in the skills catalog section (currently ~90 lines covering 13 skills). The Mar 29 review suggested splitting the skills catalog into `.skills/INDEX.md` (similar to `docs/components/INDEX.md`), with CLAUDE.md just pointing to it.

Suggested CLAUDE.md replacement for the entire skills block:

```md
## Skills → `.skills/` folder

See `.skills/INDEX.md` for the full skill catalog with triggers and descriptions.

**Component build workflow:** grill-component → write spec → tdd-component → check-tokens → playwright-test
**Visual design workflow:** pencil (explore + design) → figma-to-kvalt mapping → tdd-component → check-tokens
**Asset generation workflow:** recraft (generate + iterate) → image-optimize → catalog entry
**When implementing from Figma designs:** read figma-to-kvalt + check-tokens skills first, then write code.
```

This would bring CLAUDE.md to ~180 lines and make skill onboarding self-maintaining.

**Why:** The Mar 29 review flagged 170 lines as approaching the threshold. It's now 262 and growing with each new skill. A separate index avoids CLAUDE.md bloat.

**Priority:** Medium — no behavioral errors, but CLAUDE.md is getting unwieldy.

---

### 2. CLAUDE.md — Add `code-to-figma` skill (new this week)

**What:** A new skill `.skills/code-to-figma/SKILL.md` (137 lines) exists but is not referenced in CLAUDE.md. It syncs Kvalt design tokens from code into Figma: creates/updates color palette variables, semantic variables (Light + Dark modes), border radius, shadow effect styles, and text styles in a Figma file. It's idempotent and is the inverse of `figma-to-kvalt`.

If the skills section isn't split per recommendation #1, add this entry to the skills block:

```md
- **`.skills/code-to-figma/SKILL.md`** — Syncs Kvalt foundations from code into Figma: color palettes, semantic tokens (Light + Dark), radius, shadows, and text styles via the Figma Console MCP. Run WHEN token values change in code and you need to update the Figma DS file, or when setting up Figma for a new project. Triggers: "sync to Figma", "push tokens", "update Figma variables".
```

Note: `ascii-art`, `sketch`, `brainstorm`, and `youtube-fetch` skills remain undocumented as well — also carried over from the Mar 29 review. If the skills section is split into an INDEX file (recommendation #1), add all five at once rather than incrementally.

**Why:** Without a CLAUDE.md entry, the skill won't be triggered when Jan says "sync tokens to Figma" or "update Figma variables." It's also the only path for keeping Figma and code in sync bidirectionally.

**Priority:** Medium — directly affects Figma–code sync workflow.

---

### 3. conventions.md — Document Vite cache lock workaround (🔴 carry-over, was High)

**What:** This was flagged **High priority** in the Mar 29 review and has not been implemented. The fix is still missing from `conventions.md`. Two sessions that week hit the same issue: Vite's `.vite/deps` cache gets locked with immutable flags on the Cowork-mounted volume. The Apr 2 knowledge distiller also mentioned the issue surfaced again in the "Build BrandBastion design system prototypes" session (`EPERM` errors in the shell output).

Add to `conventions.md` under a new "## Known Issues" section:

```md
## Known Issues

### Vite Dev Server — Cache Lock on Mounted Volumes
If `vite dev` fails with `EPERM` or `operation not permitted` errors on `.vite/deps`,
the Cowork mount has locked the cache files with immutable flags.

**Fix:** Temporarily set `cacheDir: '/tmp/vite-cache'` in `vite.config.ts`, then
restart the dev server. Revert after the session if running from a local checkout.
```

**Why:** This has burned time across at least 3 sessions. A one-line fix that any future session could apply immediately.

**Priority:** High — recurring friction, easy to document, fast to fix once known.

---

### 4. COWORK.md — Update component count from 18 to 25 (⚠️ carry-over)

**What:** `docs/COWORK.md` line 17 reads: "Built the entire Kvalt (**18** components, full token system, motion system, dark mode)". The Apr 3 docs sync confirmed **25** component files in `src/components/`. This was also flagged in the Mar 29 review (Low priority) but not implemented.

Replace:
```
Built the entire Kvalt (18 components, full token system, motion system, dark mode)
```
With:
```
Built the entire Kvalt (25 components, full token system, motion system, dark mode)
```

**Why:** Stale number affects how Claude understands the project scope. Getting more outdated each sprint.

**Priority:** Low — no behavioral errors, but getting increasingly stale.

---

## No action needed

- **Apr 3 docs sync check** — Blueprint DS is fully documented and in sync. All 25 components covered, token values match code, roadmap aligns with spec status.
- **Session conventions (sprint announcements, Figma reviews, BB prototypes)** — None of this week's interactive sessions introduced Kvalt-specific patterns or decisions that need to be reflected in project instructions.
- **Skills that exist (grill-component, tdd-component, check-tokens, etc.)** — Still correctly referenced in CLAUDE.md and workflows look accurate.

---

## Observations

- **All 4 Mar 29 recommendations are carry-overs.** None of last week's suggestions were implemented. The Vite cache one (High priority) is particularly worth revisiting since it's still actively causing friction. If you'd like, I can draft the actual file edits for any of these to reduce the friction of acting on them.

- **Low Kvalt activity this week.** Jan's sessions were almost entirely BrandBastion and non-Kvalt projects. This is good from a "no new conventions broken" standpoint, but also means the instruction docs haven't been exercised much. Weeks like this are a good time to do documentation housework.

- **Folder mount confusion.** The "Build BrandBastion design system prototypes" session showed Claude couldn't access Kvalt source files via the `design-engineer` workspace mount (only `knowledge/`, `mock-data/`, and `.claude/` were visible). This suggests the Kvalt project source lives separately at `kvalt-ds/` rather than inside `design-engineer/`. This isn't a documentation problem per se, but if Jan intends to do Kvalt coding in Cowork, the mounted folder needs to be `kvalt-ds/` directly, not a parent folder. Worth being aware of.

- **`code-to-figma` is the inverse of `figma-to-kvalt`.** Having both skills creates a bidirectional sync loop. Worth documenting them together in CLAUDE.md so it's clear when each applies: Figma → code (design source, use `figma-to-kvalt`) vs. code → Figma (token drift correction, use `code-to-figma`).
