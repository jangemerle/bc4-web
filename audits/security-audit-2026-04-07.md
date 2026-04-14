# Security Audit — 2026-04-07

## Grade: D

## Summary
The Kvalt codebase contains one critical security vulnerability (exposed API credentials in committed .mcp.json) and 10 high-severity dependency vulnerabilities. The code itself is clean — no eval, innerHTML, or dangerous patterns — but configuration-level issues need immediate attention before any production deployment.

## Findings

### CRITICAL
1. `.mcp.json:19` — Recraft API key hardcoded in committed config file — Move to .env, revoke and rotate token
2. Git history — Apify token (`apify_api_bWAf...`) committed in earlier versions (commits 65154bf, 0d3e67b, e7595d1) — Purge history with git-filter-repo, rotate token

### HIGH
1. `vite.config.ts` — No Content-Security-Policy header configured — Add CSP to vercel.json
2. `vercel.json` — No X-Frame-Options header — Add `DENY` to deployment config
3. `vercel.json` — No X-Content-Type-Options header — Add `nosniff` to deployment config
4. `index.html:16` — External Figma capture script loaded without SRI hash — Add integrity attribute
5. `vercel.json` — `Access-Control-Allow-Origin: *` on /api/ routes — Restrict to specific origins
6. Dependencies — 10 high-severity vulnerabilities: Vite (file read, path traversal, fs.deny bypass), undici (7 CVEs), lodash-es (code injection, prototype pollution), flatted (prototype pollution), picomatch (method injection, ReDoS), minimatch (ReDoS), path-to-regexp (ReDoS)

### MEDIUM
1. `src/App.tsx:206-213` — localStorage type cast to ThemeMode without schema validation
2. `src/stores/workspace.ts:51-58` — JSON.parse has try-catch but no shape validation
3. `src/characters/CharacterProvider.tsx:72-97` — Character name from localStorage applied as CSS variable context without validation
4. `.gitignore` — .mcp.json not excluded (contains credentials)
5. Dependencies — 4 moderate vulnerabilities: ajv (ReDoS), brace-expansion (DoS), smol-toml (DoS)

### LOW
1. localStorage contracts undocumented — Add JSDoc to workspace.ts explaining expected schema per key

## Recommendations (priority order)
1. **Revoke and rotate** both exposed tokens (Recraft + Apify) immediately
2. **Add .mcp.json to .gitignore**, move credentials to .env
3. **Purge git history** with git-filter-repo to remove committed secrets
4. **Add CSP + security headers** to vercel.json deployment config
5. **Add SRI hash** to Figma capture script in index.html
6. **Update Vite** to 8.0.5+ (fixes 3 CVEs)
7. **Run npm audit fix** to patch dependency vulnerabilities
8. **Add Zod schema validation** to all localStorage reads
9. **Restrict CORS** on /api/ routes to specific origins

## Category Results

| Category | Status | Findings |
|----------|--------|----------|
| Secrets Exposure | CRITICAL | 2 critical (committed keys + git history) |
| CSP Headers | HIGH | 3 high (no CSP, no X-Frame, no X-Content-Type) |
| SRI | HIGH | 1 high (Figma script without integrity) |
| localStorage | MEDIUM | 3 medium (missing validation) |
| Dangerous Patterns | PASS | 0 findings |
| .gitignore | MEDIUM | 1 gap (.mcp.json) |
| Dependencies | HIGH | 14 vulnerabilities (10 high, 4 moderate) |
