# Vibe Coding Is Going To Pop The AI Bubble

**Source:** [DevRant — Vibe Coding Is Going To Pop The AI Bubble](https://youtu.be/98Gu5-Xakgs)
**Duration:** ~4 min monologue / data dump
**Date added:** 2026-04-14

## What it is

Short, stat-heavy post-mortem on vibe coding as a 2025 phenomenon. Karpathy coined the term in Feb 2025 ("forget that the code even exists"), Collins made it word of the year by December, 25% of YC's winter batch had 95% AI-generated codebases. The data now coming in: GitClear's analysis of 153M lines of code shows AI tools caused an 8× spike in duplicated code blocks; AI-generated PRs have 1.7× more issues than human PRs; PR volume up 20% with AI, incidents per PR up 23.5%. Security is worse — 40% of AI-generated code contains vulnerabilities, XSS in 86%, ~10,000 new security findings/month by mid-2025 (10× spike from Dec 2024). Daniel Stenberg shut curl's bug bounty after 20% of submissions were AI slop with a 5% valid rate. Estimate: ~8,000 startups with production apps now need full/partial rebuilds, cleanup cost $400M–$4B. 54% of engineering leaders said in 2025 they planned to hire fewer juniors — which breaks the pipeline for 2028's seniors. The devs winning with AI are the ones who use it *on top of fundamentals* — they can tell when the AI is wrong.

## Key takeaways

- **"Month one feels like a cheat code, month six is a hostage situation."** The architecture decisions AI made silently in month one become load-bearing walls that are more expensive to move than to build correctly.
- **Velocity ≠ leverage.** Higher PR throughput with higher incident rates and more duplication is net negative. Volume metrics lie.
- **Junior pipeline collapse.** Fewer juniors in 2025 → fewer seniors in 2028 → systems no one can debug.
- **Winners combine AI speed with pre-existing fundamentals.** "Faster without being reckless" is currently expensive to hire — which reframes competence as the scarce asset, not tooling access.

## Notable comments

- **"Coded by hand" becomes a quality mark** — @alejosilvalau (121 votes). A sellable provenance claim, not a neo-luddite dig. Matches Kvalt's positioning: design systems built with craft, not generated and hoped.
- **Juniors → seniors takes far longer than 3 years, and most never make it** — @GaiusTacitus (66). The talking point about a 3-year pipeline undersells the real cost; the video's estimate is optimistic.
- **Prototype smell was a 20-year-old tactic for keeping managers from shipping POCs** — @mattzun6779 (46). "I remember needing to make prototype code look odd 20 years ago to prevent clueless managers from putting a proof of concept into production." Vibe coding is the same pathology, except the clueless are now doing the coding.
- **Mythus framing: rescue product for a problem Anthropic helped create** — @miezepups15 (163). The top comment reads Claude Mythus (AI security scanning) as explicitly positioned to clean up vibe-coded slop. Matches the Mythus/Glass Wing memory — the pitch writes itself once the slop is legible.
- **Infra-engineer POV: vibe coders as attack surface** — @MariaFocsa (36). The agent itself becomes the attack surface when the dev can't reason about performance, token burn, or behavior under load. Reinforces that governance/tooling around AI code is the commercial opportunity.

## Relevance to Kvalt

Confirms the thesis behind Kvalt's existence: craft-first systems with explicit tokens, motion philosophy, and audit skills (`check-tokens`, `playwright-test`, planned `architecture-lint`) are the antidote to vibe-coded UI slop — and the stats here make the pitch to David's team sharper. Specifically: (1) the 8× duplication spike is exactly what Kvalt's component-first model prevents (you import `<Button>`, you don't regenerate one); (2) "coded by hand as quality mark" is a viable marketing angle — position Kvalt output as *reviewed craft* rather than *generated slop*, with each component carrying provenance (spec → TDD → audit trail); (3) the junior-pipeline concern argues for skills like `grill-component` and `tdd-component` as teaching scaffolding, not just productivity — they encode the reasoning a senior would have done, giving a junior a chance to learn the shape of good work by operating inside it. Worth a landing-page line: "Built for teams who still want code they can refactor in six months."
