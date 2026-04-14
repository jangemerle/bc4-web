# Weekly Instruction Review — 2026-04-12

## Sessions reviewed

Sessions from the past 7 days (2026-04-05 → 2026-04-12). Automated tasks (knowledge distillers, export regeneration, bb session logs) noted but not analyzed for conventions.

- **Docs sync check (Apr 10)** — Automated. Found 2 components missing from `docs/components/INDEX.md`: LoadingIndicator and Table. Tokens, roadmap, and CLAUDE.md paths all confirmed in sync.
- **check-tokens benchmark iter 2 (Apr 11)** — Rewrote the `check-tokens` skill with prime directive, Step 1 grounding, false-positive traps, and worked example. Hallucinations on clean components dropped from 9 → 2. Skill file itself is updated; no instruction-level change needed.
- **Knowledge distillers (Apr 9–11)** — Three runs. Created `skill-benchmarking-methodology.md` in knowledge. Updated `whatever-task-product-validation.md` with verified interactive prototype and flat-list v1 scope. No Kvalt instruction gaps surfaced.
- **Simple todo app business viability (Apr 11)** — Whatever Task keyboard model finalized (terminal-inspired, flat list). Changes committed to `whatever-task/` repo, not Kvalt.
- **Essential skills for SaaS products (Apr ~8)** — TypeScript CI fixes in Kvalt (CSSProperties indexing, Element.getTotalLength). Purely operational, no convention changes.
- **Slack feature announcement (Apr ~8)** — BrandBastion sprint copy. Not Kvalt. (Produced a useful memory about framing features as "in progress" not "ready to use" — BB-specific.)
- **Export regeneration (Apr 12)** — Running now. Automated Blueprint DS export rebuild. No convention impact.

---

## Suggested updates (requires your approval)

### 1. `.skills/INDEX.md` — Create a skills index and slim down CLAUDE.md (🔴 carry-over × 3)

**What:** CLAUDE.md is **262 lines** (threshold: 200). The skills catalog is ~90 lines covering 13 skills — but there are now **27 skills on disk**, meaning **14 are undocumented**:

Undocumented: `architecture-lint`, `ascii-art`, `brainstorm`, `breaking-change-detector`, `changelog-generator`, `check-tokens-workspace`, `code-to-figma`, `component-health`, `dependency-guardian`, `resilience-test`, `security-audit`, `sketch`, `spec-validator`, `youtube-fetch`

The gap between documented (13) and actual (27) skills is now larger than the documented set itself. Adding 14 more entries to CLAUDE.md would push it to ~400 lines.

**Suggested action:** Create `.skills/INDEX.md` with a one-line description + trigger for each of the 27 skills. Replace the entire skills block in CLAUDE.md with:

```md
## Skills → `.skills/` folder

See `.skills/INDEX.md` for the full skill catalog (27 skills) with triggers and descriptions.

**Component build workflow:** grill-component → write spec → tdd-component → check-tokens → playwright-test
**Visual design workflow:** pencil (explore + design) → figma-to-kvalt mapping → tdd-component → check-tokens
**Asset generation workflow:** recraft (generate + iterate) → image-optimize → catalog entry
**When implementing from Figma designs:** read figma-to-kvalt + check-tokens skills first, then write code.
```

**Why:** Flagged Mar 29 (170 lines), Apr 5 (262 lines, still not split). The skill count doubled since then. This is the single highest-impact documentation change right now.

**Priority:** High — 14 skills are invisible to Claude; CLAUDE.md is 30% over the size threshold.

---

### 2. `docs/components/INDEX.md` — Add LoadingIndicator and Table entries

**What:** Both components are built, have doc pages, and are listed in `docs/SYSTEM.md`, but have no entry in the component index. The Apr 10 docs sync check confirmed this gap.

Add rows to the overview table:

```md
| **LoadingIndicator** | — | spinner, dots, pulse | sm, md, lg | default | Animated loading state indicator |
| **Table** | — | — | — | default, hover, selected | Data table with sorting, filtering, and row selection |
```

Plus detail sections following the existing pattern (check `src/components/LoadingIndicator.tsx` and `src/components/Table.tsx` for accurate props).

**Why:** Session `local_dc6ecd17` (Docs sync check, Apr 10) identified this as the only real gap in documentation sync.

**Priority:** Medium — affects component discoverability but doesn't cause behavioral errors.

---

### 3. `docs/conventions.md` — Add Vite cache lock workaround (🔴 carry-over × 3, was High)

**What:** Still missing. Flagged High in Mar 29 and Apr 5 reviews. The workaround:

```md
## Known Issues

### Vite Dev Server — Cache Lock on Mounted Volumes
If `vite dev` fails with `EPERM` or `operation not permitted` errors on `.vite/deps`,
the Cowork mount has locked the cache files with immutable flags.

**Fix:** Temporarily set `cacheDir: '/tmp/vite-cache'` in `vite.config.ts`, then
restart the dev server. Revert after the session if running from a local checkout.
```

**Why:** Has burned time across at least 3 sessions. A one-line fix that any future session could apply immediately.

**Priority:** High — recurring friction, trivial to document.

---

### 4. `docs/COWORK.md` line 17 — Update component count 18 → 25 (⚠️ carry-over × 3)

**What:** Line 17 reads "Built the entire Kvalt (**18** components…)". Filesystem has **25** component files. Change `18` to `25`.

**Why:** Stale number has been wrong since at least Mar 29.

**Priority:** Low — cosmetic but increasingly inaccurate.

---

## No action needed

- **Token accuracy** — All token files match `docs/tokens.md` (verified Apr 10 docs sync).
- **CLAUDE.md paths** — Every referenced file/folder exists on disk (verified Apr 10).
- **Roadmap vs specs** — Tooltip, Accordion, Toast still "specs ready to build"; Table and ContrastExplorer correctly listed as "recently built". Matches reality.
- **`check-tokens` skill** — Iteration 2 rewrite landed in the skill file itself. No instruction-level change needed; the benchmarking methodology was captured in `knowledge/engineering-workflows/skill-benchmarking-methodology.md`.
- **Motion conventions** — `usePress`, `useReducedMotion`, spring/duration tokens all correctly documented and consistently used.

---

## Observations

- **All 4 recommendations are carry-overs from previous reviews.** The Vite cache fix and CLAUDE.md skills split have been flagged for 3 consecutive weeks. The skills gap has actually worsened (was 5 undocumented in Apr 5, now 14). If you'd like, I can draft the actual `.skills/INDEX.md` file and the edits in a follow-up session to reduce the friction of acting on these.

- **Low Kvalt coding activity this week.** Most sessions were BrandBastion operations, Whatever Task (separate repo), or automated tasks. The `check-tokens` benchmark was the main Kvalt-specific work, and it was self-contained (skill file updated, knowledge entry created).

- **Skill sprawl is the dominant trend.** 27 skills on disk, 13 documented. Many of the newer skills (architecture-lint, breaking-change-detector, dependency-guardian, resilience-test, security-audit, spec-validator) appear to have been generated during the Apr 7 architecture analysis session referenced in memory. They may be experimental or not yet validated — worth tagging as `[experimental]` vs `[stable]` in the INDEX when created.

- **`check-tokens-workspace`** appears to be a working copy or variant of `check-tokens` (possibly from the benchmarking work). Worth confirming whether it should be kept or cleaned up.
