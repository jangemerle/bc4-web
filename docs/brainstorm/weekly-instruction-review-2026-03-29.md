# Weekly Instruction Review — 2026-03-29

## Sessions reviewed

- **Mar 29 – Export regeneration** — Automated Blueprint DS export task (not Kvalt)
- **Use images for styleguide cards** — ASCII pattern showcase cards for Kvalt landing; hit Vite cache lock + rate limit
- **Recreate landing page from Fish Audio** — Kvalt landing page work; hit same Vite cache lock issue
- **YouTube video link provided** — Playwright + FFmpeg skills setup; video analysis discussion
- **YouTube video link shared** — 3-layer spec export system design; NNgroup outcome-oriented design video; roadmap updated
- **Mar 28 – Knowledge distiller** — Automated task, no new insights found
- **Mar 27 – Knowledge distiller** — Automated task
- **Mar 27 – Bb session logs** — Blueprint DS logging, not Kvalt
- **Build mindmap webapp with design system** — PixelForge pixel art tool (separate project)
- **Mindmap** — Forefathers mindtask UI (separate project)
- **Check status and deploy first version** — ASCII book terminal app (separate project)

---

## Suggested updates (requires your approval)

### 1. CLAUDE.md — Add 4 undocumented skills

**What:** The `.skills/` folder contains 4 skills not listed in the CLAUDE.md skills section: `ascii-art` (547 lines), `sketch` (221 lines), `brainstorm` (95 lines), and `youtube-fetch` (62 lines). Add entries for each with trigger descriptions.

**Why:** These skills exist and are functional but Claude won't know to use them unless they're referenced in CLAUDE.md or discovered by scanning the folder. The `ascii-art` skill in particular is the largest skill file in the project.

**Priority:** Medium — these are utility/creative skills, not part of the core component workflow. But `youtube-fetch` specifically should be documented since it overlaps with the `apify-fetch` skill's YouTube actor and could cause confusion about which to use.

### 2. Roadmap.md + COWORK.md — Fix component count inconsistency

**What:** Three different numbers appear across docs:
- `docs/roadmap.md` line 8: "**19** components built"
- `docs/roadmap.md` line 12 (audit section): "An audit of all **18** components found"
- `docs/COWORK.md` line 17: "Built the entire Kvalt (**18** components, full token system...)"

The audit was done before Table was built (March 16), so 18 was correct at that time. But the surrounding text should be consistent. Suggest updating the audit line to clarify: "An audit of all 18 components (pre-Table) found:" and updating COWORK.md to say "19 components."

**Why:** Inconsistent numbers can confuse Claude when assessing project scope or deciding if a component already exists.

**Priority:** Low — minor factual inconsistency, no behavioral impact.

### 3. CLAUDE.md or conventions.md — Document Vite cache workaround for mounted volumes

**What:** Two separate sessions this week hit the same issue: Vite's `.vite/deps` cache gets locked with immutable flags on the mounted Cowork volume, blocking dev server restarts. The workaround used both times was changing `cacheDir` in `vite.config.ts` to `/tmp/vite-cache`. This should be documented as a known issue with a standard fix, so future sessions don't waste time debugging it.

Suggested addition to conventions.md or a new "Known Issues" section in CLAUDE.md:
```
## Vite Dev Server — Cache Lock on Mounted Volumes
If `vite dev` fails with permission errors on `.vite/deps`, the Cowork
mount has locked the cache files. Fix: set `cacheDir: '/tmp/vite-cache'`
in vite.config.ts temporarily, or run from a local checkout.
```

**Why:** This bug burned time in at least 2 sessions this week and will keep happening. A one-line doc addition prevents repeated debugging.

**Priority:** High — recurring operational friction.

---

## No action needed

- **Spec export system (3-layer architecture)** — Already fully documented in `docs/roadmap.md` lines 60–79 with Layer 1/2/3 breakdown. Business context updated too (lines 101–102). Looks thorough.
- **NNgroup outcome-oriented design insights** — Already stored in `knowledge/design-process/outcome-oriented-design-nngroup.md` by the knowledge distiller.
- **Playwright and FFmpeg skills** — Already added to CLAUDE.md skills section and component build workflow line.
- **David CTO handoff context** — Already captured in auto-memory (`project_david_cto_handoff.md`) and roadmap.

---

## Observations

- **CLAUDE.md is at 170 lines** — approaching the 200-line warning threshold. The skills section alone is ~50 lines and growing. Consider splitting the skills catalog into a separate `.skills/INDEX.md` file that CLAUDE.md references, similar to how `docs/components/INDEX.md` works. This would also make it easier to keep skill documentation in sync since each skill could own its own description.

- **ascii-art skill is 547 lines** — the largest skill file by far (next is playwright-test at 339). If it's being actively used, fine. If not, it may be worth archiving or splitting. Worth a quick check on whether it's pulling its weight.

- **Most sessions this week were non-Kvalt** — Of ~15 sessions reviewed, only 3–4 were directly Kvalt work (landing page, styleguide cards, spec export discussion). The rest were Blueprint DS, Forefathers, PixelForge, and ASCII art projects. This is fine context-wise but means there were fewer Kvalt-specific conventions or patterns to catch this week.

- **The `ascii-art.zip` file** sitting in `.skills/` should probably be cleaned up — it looks like an artifact from skill creation/transfer, not an active file.
