# Versioning & Updates

**Companion to:** `docs/MASTER-PLAN.md` § 3 Layer A + Layer B
**What this covers:** component version headers, Kvalt DS semver, deprecation cycle, codemod authoring, MCP version pinning, offline cache mechanics. This is the piece that prevents us from shipping hostile breaking changes once Kvalt is public.

---

## 1 — The shadcn failure mode we're fixing

**shadcn's biggest flaw:** no per-component versioning. Their `diff` command compares your installed component against the *latest* registry version, not the version you originally installed. If you've customized one component out of 100, `shadcn diff` shows a massive irrelevant diff for all 100. Consumers learn to never update.

**Kvalt's fix:** every installed component carries a version header. The CLI reads the header and only shows diffs relative to the *installed* version. Consumers can update confidently.

---

## 2 — Component version headers

Every component file installed via `kvalt add` includes a header block at the top:

```tsx
// @kvalt-component button
// @kvalt-version 1.4.2
// @kvalt-installed 2026-04-14T10:32:00Z
// @kvalt-source https://kvalt.dev/r/button.json
// @kvalt-changelog
//   1.4.2 - Fix focus ring color on dark mode (non-breaking)
//   1.4.0 - Add loading state (non-breaking)
//   1.3.0 - DEPRECATE size=xs (use size=small instead, removes in 2.0.0)
//   1.0.0 - Initial release
// @kvalt-deprecations
//   size=xs → size=small (since 1.3.0, removes in 2.0.0)
//   (none other)
```

The header is machine-readable (the `@kvalt-*` prefix makes it parseable) and human-readable. Comments preserve across formatters (eslint/prettier leave comments alone). User-added comments under the header are preserved during updates.

TypeScript declarations for parsing these headers live in `src/types/kvalt.d.ts` (shipped by the blueprint).

---

## 3 — Kvalt DS semver rules

### 3.1 What counts as PATCH (1.4.2 → 1.4.3)
- Bug fixes that don't change the component's API or output structure
- Performance improvements
- Internal refactors
- Documentation-only changes

### 3.2 What counts as MINOR (1.4.2 → 1.5.0)
- New optional prop
- New variant
- New component
- New token (additive)
- Deprecation of existing API (but NOT removal — see § 4)

### 3.3 What counts as MAJOR (1.4.2 → 2.0.0)
- Removing a prop, variant, or token
- Changing a prop's type or default value
- Renaming a component file (path change)
- Changing HTML structure of a component in a way that breaks consumer CSS
- Any change that requires consumer action to keep working

**Golden rule:** if your change requires a consumer to modify their code for the update to work, it's a MAJOR. Period. No exceptions "because it's minor in spirit."

---

## 4 — Deprecation cycle (always follow this)

Breaking changes never land without passing through deprecation first:

1. **MINOR release introduces the new way, deprecates the old.** Both work. The old API logs `console.warn("Button's 'size=xs' is deprecated since 1.3.0, use 'size=small' instead. Will be removed in 2.0.0.")` in development mode only (silent in production).

2. **At least ONE minor release gap between deprecation and removal.** If 1.3.0 deprecates `size=xs`, 2.0.0 can only remove it if 1.4.x has also shipped. Gives consumers time to migrate.

3. **MAJOR release removes the deprecated API + ships codemod.** `kvalt migrate button@2.0.0` rewrites consumer call sites automatically.

4. **Release notes explicitly list every deprecation and every removal** with before/after examples. No silent breaking changes.

**No shortcuts on this.** The discipline compounds — consumers learn they can trust Kvalt updates because breaking changes always come with a migration path.

---

## 5 — Codemod authoring

Every MAJOR release ships at least one codemod per breaking change.

### 5.1 Stack
- **jscodeshift** for JavaScript/TypeScript transformations (shadcn's choice too)
- **postcss + custom plugin** for CSS token renames
- **cheerio** for HTML/template transformations

### 5.2 Authoring pattern

Codemods live in `packages/core/codemods/<component>/<from-version>__<to-version>.ts`. Example structure:

```
packages/core/codemods/
  button/
    1.x__2.x.ts            # removes size=xs, rewrites to size=small
    2.x__3.x.ts            # future
  tokens/
    1.x__2.x.ts            # renames --kvalt-color-primary → --kvalt-primary
```

### 5.3 Invocation
```bash
kvalt migrate button@2.x           # applies button/1.x__2.x.ts across the project
kvalt migrate --to 2.x             # applies ALL migrations to bring project to 2.x
kvalt migrate --dry-run --to 2.x   # preview what would change
```

Every codemod:
1. Finds all call sites for the component/token being migrated
2. Transforms them to the new form
3. Reports: files changed, transformations applied, things it couldn't transform (e.g., dynamically constructed prop names)
4. Leaves TODO comments where manual intervention is needed

### 5.4 Codemod tests
Every codemod ships with fixtures:
```
packages/core/codemods/button/1.x__2.x.ts
packages/core/codemods/button/__fixtures__/
  input.tsx     # pre-migration sample
  output.tsx    # expected post-migration sample
```

Unit test runs the codemod on `input.tsx` and diffs against `output.tsx`. Any drift fails CI. Prevents the "shadcn 1.x Radix migration was incomplete" failure mode we saw in research.

---

## 6 — MCP version pinning

### 6.1 Consumer config

Every project has `mcp-config/kvalt.json`:

```json
{
  "kvaltVersion": "1.4.x",
  "endpoint": "https://mcp.kvalt.dev",
  "cacheTtl": 86400,
  "offlineMode": "warn-after-7-days"
}
```

`kvaltVersion` accepts:
- `1.4.2` — exact pin
- `1.4.x` — latest patch of 1.4
- `1.x` — latest minor/patch of 1
- `latest` — not recommended, but supported

### 6.2 Server response includes version

When the MCP receives a query, it reads the consumer's version pin from the request headers and returns specs matching that version:

```jsonc
// Consumer request:
{
  "tool": "get_component_spec",
  "input": { "name": "button" }
}
// Server response:
{
  "name": "button",
  "version": "1.4.2",     // version the consumer is pinned to
  "latestAvailable": "1.5.0",  // heads-up if newer exists
  "spec": { ... }
}
```

If the consumer is pinned to a version the server no longer serves (e.g., pinned to 0.x and we've dropped that), the server returns a clear error with a migration path recommendation. No silent fallback.

### 6.3 Multi-version storage on the MCP side

The MCP server maintains a multi-version index:

```
/data/kvalt/
  versions/
    1.4.2/
      components/
        button.json
      tokens/
        ...
    1.5.0/
      ...
    2.0.0/
      ...
  latest → symlink to newest
```

When Kvalt releases a new version, CI pushes the full spec tree to the MCP's data store. Older versions are retained indefinitely (they're cheap — JSON blobs). This means consumers on 1.4.x keep working forever, even when Kvalt is on 5.x.

---

## 7 — Offline cache mechanics

### 7.1 When the cache writes
Every successful MCP query writes to `.mcp-cache/`:

```
.mcp-cache/
  components/
    button__1.4.2.json
    input__1.4.2.json
  tokens/
    all__1.4.2.json
  meta/
    last-fetch.json       # { "fetchedAt": "...", "kvaltVersion": "1.4.2" }
```

### 7.2 When the cache reads
If the MCP server is unreachable (timeout, 5xx, DNS failure):
1. CLI/skill checks `.mcp-cache/` for the requested data
2. If hit: returns cached data with a `stale: true` flag and a warning
3. If miss: fails with "MCP unreachable and no cached spec for [query]. Try again when online."

### 7.3 Staleness policy
Per `kvalt.json` → `offlineMode`:
- `"strict"` — fail immediately when MCP is unreachable (for CI environments)
- `"warn-after-7-days"` — use cache but warn if > 7 days old (default)
- `"warn-after-30-days"` — lenient mode for long offline periods
- `"silent"` — use cache silently regardless of age (not recommended)

### 7.4 Cache invalidation
- `kvalt update` → clears the cache before running, forces fresh fetch
- `kvalt cache clear` → manual reset
- Cache entries auto-expire after 30 days unless refreshed

---

## 8 — The `kvalt update` experience

What a consumer sees:

```bash
$ kvalt update
Checking for updates... ✓
Connected to MCP at https://mcp.kvalt.dev (you are pinned to Kvalt 1.4.x)

3 components have updates:

  button   1.4.2 → 1.5.0    MINOR — adds loading state (non-breaking)
  input    1.4.2 → 1.4.3    PATCH — fixes focus ring
  dropdown 1.4.0 → 2.0.0    MAJOR — see migration note

? Update button to 1.5.0? (Yes/No/Diff)
  > Diff
  [shows unified diff, reads the version header to diff against 1.4.2 not latest]
  ? Apply this diff? (Yes/No/Skip)
  > Yes
  ✓ button updated to 1.5.0

? Update input to 1.4.3? (Yes/No/Diff)
  > Yes (non-breaking patch, auto-apply OK)
  ✓ input updated to 1.4.3

? Update dropdown to 2.0.0? (Yes/No/Diff/Migrate)
  > Migrate
  Running codemod: dropdown/1.x__2.x...
  ✓ Rewrote 7 call sites in src/pages/
  ⚠ 1 dynamic call site couldn't be auto-rewritten (see TODO in src/components/SearchBar.tsx)
  ✓ dropdown updated to 2.0.0

Summary:
  ✓ 3 components updated
  ⚠ 1 manual review needed (src/components/SearchBar.tsx)

Run `kvalt audit` to verify.
```

Key UX principles:
- **Nothing silent.** Every update asks or reports.
- **Diffs are honest.** Against the installed version, not latest.
- **Breaking changes are explicit.** MAJOR is called out, codemod is offered.
- **Failures are localized.** One component failing doesn't block the rest.
- **Escape hatches exist.** `kvalt update --to 1.4.x-latest` stays on current major forever.

---

## 9 — What happens when Kvalt itself breaks

When we make a mistake (we will), consumers need recovery paths.

### 9.1 Revert path
Every `kvalt update` creates a git commit automatically (if in a git repo):
```
chore(kvalt): update button 1.4.2 → 1.5.0, input 1.4.2 → 1.4.3, dropdown 1.4.0 → 2.0.0
```

Revert is `git revert <sha>`. No custom "undo" needed — we use what's already there.

### 9.2 Pin to older version
```bash
kvalt add button@1.4.2     # pin installs to a specific version, ignores latest
```

### 9.3 Lock the whole project
```json
// mcp-config/kvalt.json
{ "kvaltVersion": "1.4.2" }  // exact pin, never updates silently
```

### 9.4 Post-mortem discipline
When we ship a broken version:
1. Immediately publish a patch release marking it as revoked
2. MCP server refuses to serve the broken version (returns a deprecation error pointing to the replacement)
3. Incident post-mortem in `docs/incidents/YYYY-MM-DD-[what-broke].md`
4. Update the relevant codemod test fixture so the bug is a regression test forever

---

## 10 — Naming convention reference

- **Component version:** `@kvalt/core@1.4.2`, stamped per-file as `@kvalt-version 1.4.2`
- **DS version:** matches `@kvalt/core` version (they're the same thing)
- **CLI version:** `@kvalt/cli@0.8.1` — versioned independently, backwards-compatible across DS versions
- **MCP server version:** `@kvalt/mcp@1.2.0` — versioned independently
- **Blueprint version:** `@kvalt/blueprint@1.0.0` — versioned independently
- **Plugin versions:** `@craftkit/workflow@1.0.0`, `@kvalt/plugin@1.0.0` — independent

All versions follow SemVer. Changesets coordinates releases across packages so they can ship together when changes span multiple packages.

---

## 11 — The "no hostile updates" pledge

Summarized for the README + docs site:

> Kvalt commits to:
> - Every installed component carries a version stamp. Updates only diff against what you have, not what's latest.
> - Every breaking change comes with a codemod. If we can't auto-migrate, we document the manual steps before release.
> - Every breaking change is preceded by at least one minor release with the old API deprecated + warning.
> - Every release ships a public changelog with migration difficulty labels (`trivial` / `manual` / `hostile`).
> - You can pin any version forever. Old versions are served by the MCP indefinitely.
> - If we break you anyway, there's always a revert path via git or version pin.
> - **Privacy:** the MCP logs zero query contents. Only aggregate request counts per version per day, for the purpose of knowing when old versions are safe to retire. The CLI has no default telemetry; any future opt-in telemetry is explicit and asks on first run. Full privacy policy at [kvalt.dev/privacy](https://kvalt.dev/privacy).

This is the trust contract. Without it, Layer B can't go public.
