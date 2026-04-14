# Skill Benchmarking Methodology — Iteration Loop with Failure-Mode Analysis

**Source:** Cowork session — `check-tokens` skill iteration 2 benchmark (2026-04-11)
**Added:** 2026-04-11
**Type:** engineering pattern

---

## Key Takeaways

### The benchmark grid: evals × configs × subagents in parallel
For any skill that returns structured findings (audits, lints, classifiers), benchmark it with a grid of `N evals × {with_skill, without_skill}`, run as parallel subagents on Haiku for speed. The `check-tokens` setup ran 4 evals × 2 configs = 8 parallel subagents per iteration. Each subagent produces a markdown audit report; a separate grading script tallies hits/misses against ground truth.

### Pass-rate alone is misleading — failure modes are the real signal
Iteration 2 of `check-tokens` came in at 43/44 (97.9%) with the skill vs 43/44 (97.2%) baseline. Numerically tied. But the *kinds* of failures were the load-bearing finding:

- **with_skill** caught a real production violation (`font-mono` in Button.tsx) that the baseline marked compliant — exactly the kind of false-negative the audit-gate is built to prevent.
- **with_skill** missed one phantom token in the hard fixture; **without_skill** missed a different one. Each config has a blind spot, neither dominates.

A skill that ties on pass rate but catches the violation that matters in production is winning. Always grade by *which* misses happen, not just how many.

### Hallucination collapse as the iteration target
Iteration 1 of the same skill produced **9 hallucinated issues** on a clean Button.tsx audit. Iteration 2 reported **2 real ground-truth issues** on the same file. That collapse from 9 → 2 is the clearest signal the rewrite landed — far more meaningful than the marginal pass-rate delta. When iterating on a skill, watch the false-positive count on a known-clean fixture as a primary metric.

### Speed wins erode as you add grounding content
Iteration 1 was ~2.3× faster than baseline. Iteration 2 was only ~1.1× faster. The reason: iteration 2 added a "prime directive", a Step 1 grounding instruction (`cat tokens.css upfront`), false-positive traps, and a worked example. The extra reading ate the speed advantage. There is a real tradeoff between *more accurate* and *more concise* — track both, and decide which the use case actually rewards.

### The grader itself can lie — verify before trusting
While building the grading script, six "failures" turned out to be regex false positives in the grader, not real model misses. Two patterns caused them:
1. **Substring matches** — `--color-on-surface` matched inside `--color-on-surface-subtle-1`, so the grader thought a more specific phantom had been found when only a shorter prefix was reported.
2. **"Suggested Fix:" sections** containing positive-sounding language fooled the grader into marking violations as compliant.

Lesson: when a benchmark looks suspicious, sanity-check by reading the raw subagent output before believing the score. Tighten regex assertions to use exact-token boundaries and avoid scoring near "Suggested Fix" headings. **A bad grader will hide a real win or invent a fake one.**

### Use a known production component as a regression eval
The most diagnostic eval in the suite was `Button.tsx` from the live Kvalt repo, with ground truth being its 2 real violations (`font-mono` + `duration-150`). Synthetic fixtures help, but a production component you've already audited by hand is the truest signal that the skill behaves on real code, not just toy inputs.

### Phantom-token evals catch the next blind spot
A second hard eval used CSS files containing four phantom tokens (token names that don't exist in `tokens.css`). Both configs missed one — different ones. That's the next iteration target: whether the "cat tokens.css upfront and keep in scratchpad" Step 1 is actually being executed by the model, or whether it's getting skipped under context pressure.

---

## Relevance to Kvalt

1. **Apply this loop to every Kvalt skill** — `figma-to-kvalt`, `check-tokens`, `kvalt-page-gen`, `grill-component`, `tdd-component`, `generate-illustration`. Each one should have its own benchmark suite of `evals × {with, without}` that gets re-run when the skill is touched. Build the grader once, reuse the harness.

2. **Skills as a Kvalt product line need defensible metrics**. If quality skills become a paid component pack or premium add-on (per the composable product model), every shipped skill should come with a public benchmark report showing the failure-mode delta vs baseline. That's the proof that "encoded design taste" actually performs better than vibes.

3. **Hallucination collapse > marginal pass-rate** is the framing for the README of any Kvalt skill. "Reduces false-positive findings by 78% on clean components" is a much sharper claim than "97.9% accuracy".

4. **The benchmark output is content**. The HTML viewer (`check-tokens-benchmark-iter2.html`) is a tangible artifact — share-worthy as a blog post, a YouTube walkthrough, a producthunt asset. Validates the YouTube strategy of "design decision walkthroughs": showing the iteration math is itself the differentiator.

5. **Next-up benchmark candidate**: `figma-to-kvalt`. It's the highest-leverage skill in the daily Kvalt workflow and currently has no benchmark. Same harness should drop in.
