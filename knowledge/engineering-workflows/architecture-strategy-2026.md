# Kvalt Architecture Strategy: Building for Infinite Life

*Deep analysis conducted April 7, 2026 — every file, every line, every knowledge entry reviewed.*

---

## Part 1: Where We Are (Honest Assessment)

### What's Strong

Kvalt is in genuinely good shape. After reviewing all 219 source files, 25+ components, 96 knowledge entries, 20 skills, and 9 specs, here's what's working:

**Token discipline is excellent.** Zero hardcoded design values found in components. Colors, spacing, radius, shadows, motion — all flow through the token system. The three-tier structure (primitive OKLCH palettes → semantic CSS variables → component classes) is architecturally sound and aligns with the W3C Design Tokens spec that went stable in October 2025.

**Motion architecture is best-in-class.** The `usePress` hook solving the Magic Trackpad problem, `useReducedMotion` used everywhere, spring/duration/easing tokens with semantic transitions — this is more thoughtful than most production design systems. The MOTION_SPEED multiplier is a clever touch for global tuning.

**Component API consistency is high.** All form components use forwardRef. Size configs follow a uniform `Record<Size, Config>` pattern. Chip renders polymorphically (button vs span). RadioGroup uses context correctly. No circular dependencies anywhere in the import graph.

**Documentation is comprehensive.** SYSTEM.md, conventions.md, philosophy.md, tokens.md, roadmap.md, multi-agent.md, COWORK.md, component INDEX — this is more documentation than most companies produce for their entire product.

**The multi-agent pipeline is innovative.** Designer → Builder → Auditor → Director is a real workflow, not just an idea. Agent files exist, skills support the pipeline, and audits have been produced.

### What Needs Attention

**Security has two critical gaps:**

1. **Exposed API credentials.** The `.mcp.json` file contains a hardcoded Recraft API key and is committed to git. The `.env` file has both Apify and Recraft tokens. While `.env` is gitignored, `.mcp.json` is not. These need immediate revocation and rotation.

2. **Dependency vulnerabilities.** 14 known CVEs: 10 high-severity (mostly through `@vercel/node` transitive deps — undici, minimatch, path-to-regexp). The `@vercel/node` package may not even be needed if geo detection can be handled differently.

**No CSP headers configured.** No Content-Security-Policy in the HTML, Vite config, or Vercel deployment. The Figma MCP script loads from an external CDN without Subresource Integrity (SRI) hashing.

**localStorage is used without validation.** Six files read from localStorage (theme, workspace, characters, todos, sticky notes) without schema validation. If XSS ever occurs, state poisoning is trivial.

**Testing is thin.** Playwright E2E tests exist for visual regression and accessibility, but there are no unit tests (Vitest is not yet integrated). Complex components like Table, Tooltip, and Modal have zero test coverage for their state logic.

**A few code quality items:**
- DocsLayout.tsx line 200: random placeholder recalculated on every render (needs useMemo)
- Input.tsx line 143: hardcoded padding magic numbers instead of config-derived values
- Button.tsx: shadow classes concatenated separately instead of through cn()
- DocsLayout.tsx line 242: local spring constant instead of motion.ts token
- Some legacy files not cleaned up (PaletteGeneratorPageLegacy.tsx)

---

## Part 2: If We Started From the Ground Up

Here's the ideal build order — the sequence that minimizes rework and maximizes stability at every step. This isn't about rewriting Kvalt (much of this is already done well). It's about understanding the correct dependency chain so that every future addition follows the right path.

### Phase 0: Decisions That Are Irreversible

These are the choices that compound. Get them right and everything downstream benefits. Get them wrong and you accumulate workarounds forever.

**Token architecture (3-tier, W3C-aligned)**
```
Primitives (raw values — what exists)
├─ color palettes (OKLCH hues × 12 shades)
├─ spacing scale (4px base × 24 values)
├─ typography (font stacks, size scale)
├─ radius (4 values), shadows (9 values)
└─ motion (durations, springs, easings)

Semantic (meaning — why it's used)
├─ color.bg, color.surface-1..7, color.on-surface
├─ color.primary-1..3, color.danger-1..3
├─ spacing.tight, spacing.cozy, spacing.section
└─ transition.feedback, transition.reveal, transition.dismiss

Component (instance — where it's applied)
├─ Button.primary.background → semantic.primary-1
├─ Input.border.default → semantic.border
└─ Modal.overlay.opacity → 0.5 (derived)
```

Kvalt already has the first two tiers well-implemented. The third tier (component tokens) is implicit in the component code. Making it explicit enables theming, spec export, and cross-platform targets.

**Package boundary decisions**
For current scale (1 person, <30 components), single package is correct. The decision point for splitting comes at either 50+ components OR when external consumers need to import subsets. When that happens: Turborepo monorepo with /core (tokens), /components, /patterns, /docs packages.

**Styling strategy**
Tailwind + CSS variables is the right call for 2026. Zero runtime cost, tree-shakeable, Server Components compatible. CSS-in-JS is declining because of its runtime penalty. This decision is already correct in Kvalt.

**Component API philosophy**
Compound components for complex stateful UI (Select, Tabs, Modal), simple props for leaf components (Button, Badge, Input). Headless hooks for maximum flexibility (usePress, useReducedMotion). This is already the pattern in Kvalt — formalize it as a rule.

### Phase 1: Foundation Layer (Tokens + Primitives)

Build order matters here. Each item depends only on what's above it.

```
1. CSS reset + base typography (globals.css)
2. Primitive tokens (colors.ts, spacing.ts, typography.ts, radius, shadows, icons)
3. Motion tokens (motion.ts — durations, springs, easings, semantic transitions)
4. CSS variable layer (tokens.css — light/dark semantic mapping)
5. Tailwind config (extend with all token values)
6. Utility functions (cn(), contrast(), oklch())
7. Core hooks (usePress, useReducedMotion, useMediaQuery)
8. Icon wrapper component (<Icon>)
```

**Quality gate after Phase 1:** Every token is usable from both CSS and JS. Dark mode toggles cleanly. No value exists that isn't a token.

### Phase 2: Atomic Components (No Composition)

These are self-contained. They don't contain other DS components.

```
9.  Button (all variants, sizes, states, loading, icon slots)
10. Badge (variants, sizes)
11. Input (label, caption, error, icons, sizes)
12. TextArea (auto-resize, character count)
13. Checkbox (checked, indeterminate, error, sizes)
14. RadioButton + RadioGroup (context pattern)
15. Toggle (on/off, sizes, label position)
16. Link (inline, standalone)
17. Skeleton (text, circular, rectangular shimmer)
18. LoadingIndicator (spinner, skeleton, pulse)
19. Tooltip (positioning, delay, keyboard, singleton management)
20. UserAvatar (initials, icon, photo, sizes)
```

**Quality gate after Phase 2:** Every component passes token audit. Every component has keyboard navigation. Every component respects reduced motion. All have proper ARIA.

### Phase 3: Composite Components (Use Phase 2 Components)

These compose the atomic components. They depend on Phase 2 being stable.

```
21. SearchInput (composes Input + Icon)
22. NumberInput (composes Input + IconButton)
23. Select (composes Input + DropdownMenu)
24. Chip (polymorphic: span/button, removable)
25. DropdownMenu (floating panel, search, keyboard nav)
26. ContentSwitcher (sliding indicator via layoutId)
27. Tabs (icon + badge support, keyboard arrows)
28. SplitButton (composes Button + DropdownMenu)
29. DatePicker (calendar, range, presets)
30. Pagination (composes Button + Select)
```

### Phase 4: Layout Components (Structural)

```
31. Modal (focus trap, escape, overlay, contained mode)
32. ModalFullscreen (full viewport variant)
33. Accordion (single/multi expand, nested, keyboard)
34. Toast (queue management, stacking, progress, dismiss)
35. Sidebar Navigation (groups, active states, collapse)
36. Table (sorting, selection, filtering, virtual scroll)
```

### Phase 5: Pattern Components (Domain-Specific)

```
37. Command Palette (Cmd+K, search, actions, recent)
38. Avatar Group (stacked + overflow count)
39. Breadcrumbs (truncation, responsive)
40. Progress Bar / Stepper (determinate, indeterminate)
41. File Upload (drag-drop, preview, progress)
42. Notification Badge (count, dot, positioning)
```

### Phase 6: Page Templates

```
43. Documentation layout components (PageHero, Section, CardGrid, etc.)
44. Foundation pages (Colors, Typography, etc.)
45. Component doc pages (one per component)
46. Philosophy pages (Motion, Accessibility, Tone)
47. Screen Vault demo pages (Login, Signup, etc.)
```

---

## Part 3: Skills to Create

These are the recurring automation tools that prevent quality drift. Each addresses a specific failure mode.

### Skill 1: `dependency-guardian`
**Purpose:** Automated dependency health monitoring
**Trigger:** Weekly scheduled task + on every PR
**What it does:**
- Runs npm audit, flags high/critical CVEs
- Checks for outdated packages (major version behind = warning, 2+ = alert)
- Detects unused dependencies (via depcheck or knip)
- Produces a dependency health report with action items
- Blocks merge if critical CVEs exist in production deps

**Why:** The @vercel/node vulnerability chain sat in the project because there was no automated surfacing. This skill catches that class of problem.

### Skill 2: `security-audit`
**Purpose:** Comprehensive security posture check
**Trigger:** Weekly scheduled + before any deployment
**What it does:**
- Scans for exposed secrets (beyond gitleaks — checks env vars, config files, git history)
- Validates CSP headers are present and correct
- Checks localStorage usage has schema validation
- Audits external script tags for SRI hashes
- Verifies .gitignore covers all sensitive files
- Checks for dangerous patterns (eval, innerHTML, dangerouslySetInnerHTML)
- Produces a security scorecard (A-F grade)

**Why:** The .mcp.json API key exposure was missed by existing tooling. This catches configuration-level security issues.

### Skill 3: `architecture-lint`
**Purpose:** Enforce structural rules that ESLint can't catch
**Trigger:** On every PR + weekly full scan
**What it does:**
- Verifies import dependency direction (tokens ← hooks ← components ← pages, never reverse)
- Checks for circular dependencies
- Ensures every component exports proper TypeScript types
- Validates that composite components use DS primitives (never rebuild what exists)
- Checks that no component exceeds complexity thresholds (lines, prop count, nesting depth)
- Ensures every interactive component uses usePress (not whileTap)
- Validates motion tokens are used (no hardcoded springs/durations)

**Why:** Convention violations are invisible until they accumulate. This makes them visible immediately.

### Skill 4: `component-health`
**Purpose:** Per-component quality dashboard
**Trigger:** After every component change
**What it does:**
- Token compliance score (via check-tokens)
- Accessibility score (ARIA, keyboard, focus, contrast)
- Test coverage percentage
- API surface area (prop count, variant count)
- Bundle size contribution
- Documentation completeness (JSDoc, page exists, all variants showcased)
- Produces a component health card (green/yellow/red per dimension)

**Why:** Without a dashboard, components silently degrade. One hardcoded value, one missing focus ring, one undocumented prop — and quality drifts.

### Skill 5: `breaking-change-detector`
**Purpose:** Catch breaking changes before they ship
**Trigger:** Before any version bump
**What it does:**
- Compares TypeScript declarations between current and last release
- Flags removed props, renamed exports, changed types
- Generates migration guide for breaking changes
- Suggests codemods for common transformations
- Validates that CHANGELOG entries exist for all changes

**Why:** When Kvalt becomes a published package (or when David's team consumes specs), breaking changes without migration guides will cause adoption friction.

### Skill 6: `resilience-test`
**Purpose:** Test that nothing breaks under stress
**Trigger:** Monthly + before releases
**What it does:**
- Error boundary testing (what happens when a component throws?)
- Network failure simulation (API calls fail, images don't load)
- Empty state verification (every list/table/grid handles zero items)
- Extreme content testing (very long text, very short text, special characters, RTL)
- Performance under load (Table with 10K rows, Select with 1K options)
- Reduced motion mode (every animation gracefully degrades)

**Why:** Most bugs emerge at edges. This skill systematically tests edges that manual testing misses.

### Skill 7: `spec-validator`
**Purpose:** Ensure specs are complete before building
**Trigger:** Before running tdd-component
**What it does:**
- Checks spec against a completeness template (variants, states, sizes, keyboard, ARIA, motion, edge cases, error states)
- Cross-references with component INDEX (is this component already partially built?)
- Validates that all referenced tokens exist
- Flags any spec that references hardcoded values
- Ensures accessibility section is present and non-empty

**Why:** The grill-component skill produces design summaries, but there's no validation that the summary is complete. This closes the gap between ideation and implementation.

### Skill 8: `changelog-generator`
**Purpose:** Automated changelog from conventional commits
**Trigger:** Before releases
**What it does:**
- Parses git log since last tag
- Groups by type (feat, fix, refactor, etc.)
- Extracts scope (component/page name)
- Generates markdown changelog
- Highlights breaking changes prominently
- Links to relevant specs/docs for context

**Why:** Manual changelogs get skipped. Automated ones from structured commits are always accurate.

---

## Part 4: Recurring Processes and Audits

### Per-Commit (Automated, Blocking)

| Check | Tool | Threshold | Action on Fail |
|-------|------|-----------|----------------|
| Secret scanning | Gitleaks | 0 findings | Block commit |
| ESLint (inc. security) | eslint-plugin-security | 0 errors | Block commit |
| TypeScript | tsc --noEmit | 0 errors | Block commit |
| Token compliance | check-tokens skill | 0 violations | Block commit |

### Per-PR (Automated, Blocking)

| Check | Tool | Threshold | Action on Fail |
|-------|------|-----------|----------------|
| All per-commit checks | — | — | Block merge |
| Architecture lint | architecture-lint skill | 0 violations | Block merge |
| Bundle size delta | size-limit | <5% growth per component | Warn at 3%, block at 5% |
| Accessibility | axe-core via Playwright | 0 violations | Block merge |
| Visual regression | Playwright screenshots | 0 unexpected diffs | Block merge (or review) |
| Unit tests | Vitest | All passing | Block merge |
| Breaking change check | API extractor | Flagged for review | Require manual approval |

### Weekly (Scheduled, Non-Blocking)

| Audit | Skill | Output | Owner |
|-------|-------|--------|-------|
| Dependency health | dependency-guardian | Health report | Auto-filed |
| Security posture | security-audit | Security scorecard | Review within 48h |
| Component health | component-health | Dashboard update | Review at weekly check-in |
| Unused code scan | knip | Dead code report | Clean up within sprint |

### Monthly (Scheduled, Review Required)

| Audit | Skill/Process | Output | Owner |
|-------|---------------|--------|-------|
| Resilience testing | resilience-test | Edge case report | Fix critical within sprint |
| Accessibility manual audit | Manual + Guidepup | WCAG compliance report | Fix AA violations immediately |
| Performance budget review | Lighthouse CI | Performance report | Adjust budgets if needed |
| Knowledge base curation | Manual | Updated _INDEX.md | Archive stale entries |

### Quarterly (Deep Review)

| Audit | Process | Output | Owner |
|-------|---------|--------|-------|
| Full architecture review | Manual + architecture-lint | Architecture decision record | Decide on any structural changes |
| Competitive landscape | Research + knowledge update | Competitor analysis | Update positioning if needed |
| Token system review | Manual | Token evolution proposal | Decide on token additions/deprecations |
| Security penetration test | External or manual | Vulnerability report | Remediate all findings |
| Dependency major version review | Manual | Upgrade roadmap | Plan major upgrades for next quarter |

---

## Part 5: Security Hardening Plan

### Immediate Actions (This Week)

1. **Revoke and rotate all exposed tokens**
   - Revoke Apify token (apify_api_bWAf...)
   - Revoke Recraft API key (jHqvUj0n...)
   - Generate new tokens with minimum required scopes
   - Store only in environment variables (never in committed files)

2. **Fix .mcp.json**
   - Add `.mcp.json` to `.gitignore`
   - Create `.mcp.json.example` with placeholder values
   - Use environment variable references in the actual file

3. **Add Content-Security-Policy**
   ```html
   <meta http-equiv="Content-Security-Policy"
     content="default-src 'self'; script-src 'self' https://mcp.figma.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self';">
   ```

4. **Add SRI to external scripts**
   ```html
   <script src="https://mcp.figma.com/mcp/html-to-design/capture.js"
     integrity="sha384-[hash]" crossorigin="anonymous" async></script>
   ```

5. **Upgrade vulnerable dependencies**
   - `@vercel/node` → v4.0.0 (or remove if geo can be handled via Vercel edge config)
   - Run `npm audit fix` for other fixable CVEs

### Short-Term (This Sprint)

6. **Add localStorage validation helper**
   ```typescript
   // src/lib/safeStorage.ts
   function safeGet<T>(key: string, schema: ZodSchema<T>, fallback: T): T {
     try {
       const raw = localStorage.getItem(key);
       if (!raw) return fallback;
       return schema.parse(JSON.parse(raw));
     } catch {
       localStorage.removeItem(key);
       return fallback;
     }
   }
   ```
   Apply to all 6 localStorage usage sites.

7. **Audit git history for leaked secrets**
   ```bash
   git log --all -S "apify_api" --oneline
   git log --all -S "jHqvUj0n" --oneline
   ```
   If found: use `git filter-repo` to remove from history, then force push (coordinate with any collaborators).

8. **Tighten pre-commit hooks**
   - Make npm audit block on high-severity (not just warn)
   - Add `.mcp.json` pattern to gitleaks config

### Medium-Term (Next Month)

9. **Integrate Snyk or Socket.dev**
   - Continuous vulnerability monitoring
   - PR comments with security context
   - Alerts on newly discovered CVEs in existing deps

10. **Add security-focused Playwright tests**
    - Test that XSS payloads in input fields don't execute
    - Test that CSRF-like state changes require proper flow
    - Test that error messages don't leak internal paths

11. **Create SECURITY.md**
    - Disclosure policy
    - Contact information
    - Supported versions
    - Response timeline commitments

### Long-Term (Ongoing)

12. **When publishing as npm package:**
    - Generate SBOM (Software Bill of Materials) with every release
    - Sign packages with npm Provenance (Sigstore)
    - Never ship post-install scripts
    - Use MFA for all publish accounts
    - Pin exact versions in package-lock.json
    - Set up automated publish from CI only (no local publishes)

13. **Supply chain monitoring:**
    - Monitor for typosquatting attacks on `kvalt-ds` name
    - Review new transitive dependencies quarterly
    - Use Socket.dev for behavioral analysis (detects malicious post-install scripts)

---

## Part 6: The Anti-Domino Architecture

The core question: how do you ensure that more complexity doesn't mean bigger domino falls?

### Principle 1: Strict Dependency Direction

```
tokens → hooks → components → patterns → pages
  ↓         ↓         ↓            ↓          ↓
  Never references anything to its right
```

This is already largely true in Kvalt. The `architecture-lint` skill enforces it automatically. When a component needs to reference another component, it must go through composition (children, render props, or slots) — never direct import of a sibling's internals.

### Principle 2: Every Component Is an Island

A well-built component should be deletable without breaking anything except the pages that explicitly use it. Test this with a thought experiment: if you `rm Button.tsx`, the only errors should be in files that import Button. If removing one component cascades into 15 other components, the coupling is too tight.

**How to enforce:** The `architecture-lint` skill should include a "blast radius" check — for each component, how many other files break if it's removed? High numbers get flagged.

### Principle 3: Tokens Are the Shared Language

Components don't talk to each other directly. They talk through tokens. If two components need to look consistent, they both reference the same semantic token. They never reference each other's internal values.

This is already strong in Kvalt. The risk is when someone copies a hardcoded value from one component to another instead of extracting a shared token. The `check-tokens` skill catches this.

### Principle 4: Test at the Right Level

| What to test | Where to test | Why |
|---|---|---|
| Token values resolve correctly | Token unit tests | Catches dark mode bugs, theme mismatches |
| Component logic (state, handlers) | Vitest unit tests | Fast feedback, isolates logic from rendering |
| Component renders correctly | Playwright visual | Catches CSS regressions, layout breaks |
| Components work together | Playwright interaction | Catches integration issues (focus, keyboard) |
| Accessibility | axe-core + manual | Catches WCAG violations |
| Performance | Lighthouse + size-limit | Catches bundle bloat, render bottlenecks |

Each layer catches a different class of bug. Together they form a safety net where issues are caught at the smallest possible blast radius.

### Principle 5: Make Breaking Changes Expensive

Not expensive to do — expensive to *not notice*. The `breaking-change-detector` skill, TypeScript strict mode, and visual regression tests together mean that any breaking change triggers alarms in at least three systems. This makes it nearly impossible to accidentally break consumers.

### Principle 6: Document Decisions, Not Just Code

Code tells you *what* exists. Documentation tells you *why*. When someone needs to change a decision 6 months from now, the "why" is what prevents them from re-making a mistake you already learned from. Kvalt's docs/ folder and knowledge/ base are excellent here. Keep investing in them.

### Principle 7: Automate the Boring Parts, Judge the Hard Parts

Skills handle repetitive quality checks (tokens, accessibility, security, dependencies). Human judgment handles architectural decisions (should this be a compound component or a hook? should we add a new token tier?). The line between them: if the rule can be expressed as "if X then Y", automate it. If it requires "it depends", it needs human judgment.

---

## Part 7: Implementation Roadmap

### Sprint 1: Security + Testing Foundation
- [ ] Revoke and rotate all exposed tokens
- [ ] Fix .mcp.json, add to .gitignore
- [ ] Add CSP headers + SRI hashes
- [ ] Upgrade vulnerable dependencies
- [ ] Set up Vitest with first test suite (Button, Input, Modal)
- [ ] Create localStorage validation helper
- [ ] Create `dependency-guardian` skill
- [ ] Create `security-audit` skill

### Sprint 2: Quality Gates
- [ ] Create `architecture-lint` skill
- [ ] Integrate check-tokens into pre-commit hook (block on violations)
- [ ] Set up bundle size monitoring (size-limit)
- [ ] Create `component-health` skill
- [ ] Add unit tests for all hooks (usePress, useReducedMotion, useSectionNav)
- [ ] Fix the 7 code quality issues identified in audit

### Sprint 3: Automation Pipeline
- [ ] Create `breaking-change-detector` skill
- [ ] Create `changelog-generator` skill
- [ ] Set up CI/CD quality gates (GitHub Actions)
- [ ] Create `spec-validator` skill
- [ ] Add accessibility CI (axe-core in Playwright, blocking)
- [ ] Create `resilience-test` skill

### Sprint 4: Production Readiness
- [ ] Complete pending components (Tooltip, Accordion, Toast, Sidebar Nav)
- [ ] Achieve 80%+ test coverage on all components
- [ ] Run first full resilience test cycle
- [ ] Run first manual accessibility audit
- [ ] Create SECURITY.md
- [ ] Document all architectural decisions in an ADR log
- [ ] Prepare npm package structure (if publishing)

### Ongoing: The Infinite Game
- Weekly: dependency + security + component health checks
- Monthly: resilience tests + manual a11y audit + performance review
- Quarterly: architecture review + competitive landscape + token evolution
- Per-change: all automated gates (commit, PR, deploy)

---

## Part 8: Research-Backed Insights

### What the Industry Is Doing (2025-2026)

**Architecture:** The industry has converged on headless-first primitives (Radix, Base UI) with copy-paste component models (shadcn/ui). Kvalt's approach of owning the full stack (tokens through components through pages) is more ambitious but gives more control — which matters for the spec export business model.

**Tokens:** The W3C Design Tokens spec went stable in October 2025. Three-tier systems (primitive → semantic → component) are now standard. Kvalt's two-tier implementation is solid; adding explicit component tokens enables the theming/character system and spec export.

**Testing:** Visual regression AI (Percy, Chromatic) reduces review time 3x. Only 13% of WCAG criteria are fully automatable — manual accessibility testing remains essential. Vitest has replaced Jest for most new projects. Playwright dominates E2E.

**Security:** Supply chain attacks jumped to #3 on OWASP Top 10 (2025). The Shai-Hulud npm worm was the first self-propagating attack, compromising 500+ packages. Sigstore/npm Provenance for signed packages is now standard for published libraries. Socket.dev adds behavioral analysis on top of CVE scanning.

**Performance:** Tailwind + CSS variables is the performance winner for 2026. Zero runtime cost, tree-shakeable, Server Components compatible. CSS-in-JS is declining due to runtime overhead. Design systems should target <4KB per component gzipped.

**Scaling:** RFC processes start at 4-10 people. Contribution models formalize at 10-50. Per-component versioning is only needed at >100 components (Shopify/Adobe scale). For Kvalt's current scale, unified versioning with Changesets is correct.

### Key Numbers to Remember

- **4.5:1** — minimum contrast ratio for normal text (WCAG AA)
- **44px** — minimum touch target size (WCAG 2.2)
- **120ms** — usePress minimum duration (Kvalt's Magic Trackpad fix)
- **13%** — WCAG criteria fully automatable (rest needs manual testing)
- **75%** — target test coverage for CI gates
- **<5%** — bundle size growth threshold per component
- **3 months** — minimum deprecation period before breaking changes
- **Weekly** — dependency and security scanning cadence
- **Quarterly** — deep architecture and security reviews

---

*This document should be revisited quarterly and updated as the project evolves. The architecture principles are permanent; the specific tools and thresholds will shift.*
