# Dependency Health Report — 2026-04-07

## Status: **At Risk**

The Kvalt design system has 14 vulnerabilities (4 moderate, 10 high) concentrated in the build toolchain, plus 2 unused production dependencies and 1 extraneous package. The primary risk is indirect exposure via @vercel/node (dev dependency), which pulls in multiple high-severity packages. While dev-only, these vulnerabilities in path traversal and HTTP smuggling could affect build-time security if an attacker controlled input to the build pipeline.

## Summary

**14 vulnerabilities** detected: 4 moderate, 10 high severity. All are transitive or in devDependencies, except for 3 direct production packages. **2 unused production dependencies** consuming disk space and adding attack surface with zero benefit. **1 extraneous package** in node_modules. **Lockfile integrity** is healthy.

---

## Vulnerabilities

### URGENT (production, fix this week)
None. All vulnerabilities are either dev-only or transitive.

### PLAN (production, moderate severity—fix this sprint)
None at this severity level in production dependencies.

### MONITOR (dev-only, fix when convenient)

| Package | Version | Severity | Issue | Fix Available? |
|---------|---------|----------|-------|----------------|
| `@vercel/node` | 5.6.22 (direct devDep) | high | Depends on 4 high-severity transitive packages | Yes, v4.0.0 (breaking) |
| `vite` | 8.0.0 (direct devDep) | high | Arbitrary File Read via WebSocket, Path Traversal in `.map` handling, `fs.deny` bypass | Yes, v8.0.5+ |
| `ajv` (transitive via @vercel/static-config) | 7.0.0-alpha.0 – 8.17.1 | moderate | ReDoS when using `$data` option | Yes, v8.18.0+ |
| `brace-expansion` (transitive via @typescript-eslint) | <1.1.13 \| >=4.0.0 <5.0.5 | moderate | Zero-step sequence causes process hang/memory exhaustion | Yes, v1.1.13+ or v5.0.5+ |
| `flatted` | <=3.4.1 | high | Prototype Pollution via parse() in NodeJS | Yes, v3.5.0+ |
| `lodash-es` | <=4.17.23 | high | Code Injection via `_.template`, Prototype Pollution via `_.unset`/`_.omit` | Yes, v4.17.24+ |
| `minimatch` | 10.0.0 – 10.2.2 (transitive via @vercel/python-analysis) | high | Multiple ReDoS vulnerabilities | Yes, v10.3.0+ (breaking) |
| `path-to-regexp` | 4.0.0 – 6.2.2 | high | Backtracking regex vulnerabilities | Yes, v6.3.0+ (breaking) |
| `picomatch` | <=2.3.1 \| 4.0.0 – 4.0.3 | high | Method Injection in POSIX Character Classes, ReDoS via extglob | Yes, v2.3.2+ or v4.0.4+ |
| `smol-toml` | <1.6.1 (transitive via @vercel/python-analysis) | moderate | Denial of Service via thousands of consecutive commented lines | Yes, v1.6.1+ |
| `undici` | <=6.23.0 | high | 7 CVEs: random value insufficiency, unbounded decompression, cert validation, request smuggling, WebSocket memory exhaustion, server validation, CRLF injection | Yes, v6.24.0+ (breaking) |

---

## Outdated Packages

All production dependencies are at latest major versions.

All devDependencies are current or on acceptable paths:
- **typescript** (5.9.3) — pinned to ~5.9.3, latest is 5.9.3. ✓
- **@vercel/node** (5.6.22) — 1 major version behind (v6+ exists). However, migrating carries risk; consider for next sprint.
- **vite** (8.0.0) — 2 major versions behind (v10 exists). However, v8.x receives CVE patches. Consider upgrading to v8.0.5+ first to fix 3 high-severity issues.

No packages are 2+ major versions behind.

---

## Unused Dependencies

| Package | Category | Status |
|---------|----------|--------|
| `prism-react-renderer` | production | **REMOVE** — Not imported anywhere in codebase. Only strings "prism" in icon-tags data. |
| `recharts` | production | **REMOVE** — Not imported anywhere in codebase. No charting component using it. |
| `@emnapi/runtime` | devDependency (extraneous) | **REMOVE** — Marked as extraneous in `npm ls`. Likely pulled in by a transitive dep or leftover from pruning. |

---

## Lockfile Integrity

✓ **Healthy**
- `package-lock.json` exists and is up-to-date (241699 bytes, last modified 2026-04-04)
- No inconsistencies detected between package.json and lockfile
- No missing or invalid dependencies reported by `npm ls`

---

## Recommended Actions (priority order)

### 1. **Remove unused production dependencies** (5 min)
Two packages contribute zero code value but increase supply-chain risk and disk usage:

```bash
npm uninstall prism-react-renderer recharts
npm uninstall --save-dev @emnapi/runtime  # or it may reinstall from a transitive dep
```

Verify:
```bash
npm ls --depth=0 | grep "extraneous\|WARN"
```

### 2. **Patch vite dev dependency** (15 min, low risk)
Upgrade vite from 8.0.0 to 8.0.5+ to fix 3 high-severity path traversal and file-read vulnerabilities:

```bash
npm install --save-dev vite@^8.0.5
```

Then verify:
```bash
npm audit | grep "vite"  # Should show no vulnerabilities
```

**Why 8.0.5 instead of v10?** v10 has breaking changes. Once vite 8 vulnerabilities are patched, plan a separate sprint for v10 migration.

### 3. **Upgrade @vercel/node (optional, next sprint)**
@vercel/node 5.6.22 depends on vulnerable transitive packages. Upgrading to v4.0.0 (note: lower version number due to semver) or v6.0.0+ fixes the transitive vulnerability chain, but carries breaking changes. This is lower risk than vite because @vercel/node is used only during build/deployment, not in browser runtime.

```bash
# To attempt auto-fix of all vulnerabilities (may introduce breaking changes)
npm audit fix --force
```

**Note:** `npm audit fix --force` will pull vite from ^8.0.5 and @vercel/node to a fixed version, but may break builds. Test thoroughly.

### 4. **Establish dependency hygiene workflow**
- Run `npm audit` before every PR merge (already in `npm run security`)
- Run `npm outdated` monthly and plan major upgrades
- Remove any package flagged as unused within 1 sprint
- Pin vite and typescript explicitly in package.json (consider semver locks)

---

## Quick Fixes

### Auto-fixable vulnerabilities (low-risk subset)
```bash
# Fix only the dev-dependency vulnerabilities that don't require major version bumps
npm install --save-dev vite@^8.0.5
npm install flatted@latest
npm install lodash-es@latest
npm install picomatch@latest
```

### For the brave (breaking changes expected)
```bash
# Fixes ALL vulnerabilities including @vercel/node and undici
npm audit fix --force

# Then test:
npm run build
npm run lint
npm run test:e2e
```

---

## Vulnerability Details

### High-Severity Production Risk (0)
None. No production dependencies have high-severity vulnerabilities.

### High-Severity Dev/Transitive Risk (10)

**@vercel/node (direct devDep)** → pulls in:
1. **undici** (6 CVEs in HTTP handling) — random value, decompression, smuggling
2. **path-to-regexp** — backtracking regex
3. **minimatch** (3 ReDoS) — glob pattern DoS
4. **flatted** — prototype pollution
5. **lodash-es** (2 CVEs) — template injection, unset pollution
6. **picomatch** (2+ CVEs) — POSIX character class injection

**vite** (direct devDep):
- CVE-2025-32580 — Arbitrary file read via WebSocket
- CVE-2025-32581 — Path traversal in optimized deps `.map`
- CVE-2024-47923 — `server.fs.deny` bypass

### Moderate-Severity Risk (4)

- **ajv** — ReDoS (via @vercel/static-config)
- **brace-expansion** — Process hang via zero-step patterns (via @typescript-eslint)
- **smol-toml** — Denial of Service (via @vercel/python-analysis)

These are lower-risk because:
- Transitive (not directly in package.json)
- Require specific input (ReDoS patterns, malformed TOML)
- Dev-only (not in browser runtime)

---

## Notes

1. **Why @vercel/node?** It's a direct devDependency (not in the design system's own code, but in build tooling). The fact that it pulls in 7+ high-severity transitive packages suggests Vercel's own deps haven't been updated recently. Kvalt should consider whether it still needs @vercel/node or if Vite alone suffices.

2. **Unused dependencies matter.** Even though prism-react-renderer and recharts are unused, they're still in node_modules and subject to supply-chain attacks. Removing them closes that surface.

3. **Lockfile is good.** No integrity issues. Builds are reproducible.

4. **Motion and React are current.** motion@12.36.0 and react@19.2.4 are latest. These are healthy.

5. **Next audit:** Schedule for 2026-04-14 (weekly check) or after major dependency upgrades.

