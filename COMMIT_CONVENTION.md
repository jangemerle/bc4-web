# Commit Convention

Every commit follows **Conventional Commits** format so the history is useful
for debugging, bisecting, and understanding what changed and why.

## Format

```
type(scope): short description   ← required, max 72 chars
                                  ← blank line if body follows
Why this change was made.         ← optional body: the WHY not the what
Context, trade-offs, decisions.

Footer: Closes #123 / BREAKING CHANGE: ...  ← optional
```

## Types

| Type | When to use |
|---|---|
| `feat` | New feature or capability added |
| `fix` | Bug fixed — something was broken and now it isn't |
| `refactor` | Code restructured — no behaviour change, no bug fix |
| `style` | Visual or copy change — layout, spacing, colours, text |
| `docs` | Documentation, comments, README, knowledge base |
| `chore` | Tooling, dependencies, config, scripts |
| `perf` | Performance improvement |
| `test` | Adding or fixing tests |

## Scopes

Use the name of the thing you changed. Be specific.

```
feat(Button): ...           ← component name
fix(FloatingSectionNav): …  ← component name
style(TypographyPage): …    ← page name
docs(MotionPage): …         ← page name
feat(useSectionNav): …      ← hook name
chore(deps): …              ← special scope for dependencies
style(tokens): …            ← token file
docs(knowledge): …          ← knowledge base
chore(agents): …            ← agent definitions
```

## Rules

1. **Title describes the change, body explains the reason.**
   Bad:  `fix: fixed the thing`
   Good: `fix(FloatingSectionNav): replace IntersectionObserver with scroll-based pinning`
   Body: `IntersectionObserver with threshold:0 fires immediately on mount when
          the element is near the viewport edge, causing a false-positive pin on
          load. getBoundingClientRect().bottom < 0 only fires after actual scroll.`

2. **One logical change per commit.**
   Don't bundle "update hero copy on 6 pages + fix Input validation bug".
   Split into two commits.

3. **No "Auto-commit" messages.** If Claude Code auto-commits, the session
   should end with an explicit `git commit` with a proper message.

4. **Present tense imperative.**
   `add loading state` not `added loading state` not `adds loading state`

5. **Don't end the title with a period.**

## Useful git commands

```bash
# Full history with graph
npm run log

# Full history of a single file (all renames)
npm run log:file -- src/components/Button.tsx

# What changed today
npm run log:today

# Find all commits mentioning a keyword
npm run log:search -- "FloatingSectionNav"

# What changed in a specific commit
git show <hash>

# Find which commit introduced a bug (binary search)
git bisect start
git bisect bad HEAD
git bisect good <last-known-good-hash>
# git runs you through commits — mark each as good/bad
git bisect reset

# Who last changed each line in a file
git blame src/components/Button.tsx

# What changed between two dates
git log --since="2026-03-30" --until="2026-03-31" --oneline

# All changes to a token file
git log --follow -p src/tokens/motion.ts
```

## Agent commits

Every agent task ends with a descriptive `git commit` before completing.
Agents do NOT rely on auto-commit. The commit message is the record of
what the agent did and why.
