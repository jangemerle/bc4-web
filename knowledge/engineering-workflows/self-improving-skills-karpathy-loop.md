# Self-Improving Claude Code Skills — Karpathy Auto-Research Loop

**Source:** Simon Scrapes — "Build Self-Improving Claude Code Skills. The Results Are Crazy."
**URL:** https://www.youtube.com/watch?v=wQ0duoTeAAU
**Date added:** 2026-03-18

---

## Core Concept

Apply Andrej Karpathy's "auto research" pattern to Claude Code skills. The loop: read the SKILL.md → make a change → run tests → check score → keep or revert → repeat autonomously until perfect or interrupted.

## Two Layers of Skill Improvement

### Layer 1 — Trigger Accuracy (built into skill-creator)
- Anthropic's skill-creator already has a description improvement loop
- Tests whether the skill activates on the right prompts
- Community testing found activation as low as 20% with vague YAML descriptions
- The loop proposes better descriptions, retests, and iterates

### Layer 2 — Output Quality (the Karpathy loop)
- Define binary true/false assertions in an `eval.json`
- Run the skill multiple times, check each assertion
- If any fail → tweak the SKILL.md → retest → keep if improved, revert if not
- Runs autonomously overnight — "never stop, the human might be asleep"

## Binary Assertions — The Key Insight

Assertions MUST be binary (true/false), not subjective:

**Good (binary):**
- Does not contain em-dashes
- Total word count under 300
- Final line is not a question
- First line is a standalone sentence
- Contains at least one specific number or statistic

**Bad (subjective):**
- Does it have a compelling subject line?
- Is the tone professional?
- Is the copy creative?

Subjective quality still needs human judgment or the skill-creator's qualitative dashboard. The binary loop handles structure, format, word counts, and forbidden patterns.

## Practical Setup

```
my-skill/
  SKILL.md              ← the file being improved
  references/           ← context files (tone of voice, examples, etc.)
  eval/
    eval.json           ← 25 binary assertions across 5 test prompts
```

Each test in `eval.json` has:
- A prompt to feed the skill
- An expected output description
- 5 binary assertions to check against the result

## The Loop Prompt

Tell Claude Code:
1. Use the skill-creator skill
2. Run a self-improvement loop on [skill name]
3. Point to the eval.json for assertions
4. If any assertions fail → make ONE change to SKILL.md
5. Rerun tests and recalculate score
6. If score improved → git commit and keep
7. If score dropped → git reset and try a different change
8. Log everything
9. Don't ask for permission — keep looping until interrupted or perfect score

## Results

- Example: marketing copywriting skill (already on v5) scored 23/24 (95.8%) on first run
- One failed assertion: "end with question" rule was in tone-of-voice.md but not SKILL.md
- Loop added the rule to SKILL.md, reran, hit 24/24 (100%) on second iteration
- New skills would take many more iterations — let it run overnight

## Limitations

The binary loop handles:
- Structure and format rules
- Word counts and length constraints
- Forbidden patterns (em-dashes, certain phrases)
- Required elements (statistics, CTAs, standalone lines)

It does NOT handle:
- Tone of voice quality
- Creative quality
- Whether reference files are being used properly
- These still need human review via the skill-creator's qualitative dashboard

## Relevance to Kvalt

**Direct applications:**
- Could add `eval/` folders to our existing skills (check-tokens, kvalt-page-gen, figma-to-kvalt)
- Binary assertions for kvalt-page-gen: "Uses only DS tokens?", "Has PageHero?", "No hardcoded colors?", "Includes accessibility props?"
- Binary assertions for check-tokens: "Reports all hardcoded hex values?", "Suggests correct semantic token?", "Catches off-grid spacing?"
- The tdd-component skill already follows a similar loop pattern — could formalize with eval.json

**Future consideration:**
- Build an `eval.json` template as part of our skill-creation workflow
- Add eval step to the workflow chain: grill-component → spec → tdd-component → check-tokens → **eval loop**
