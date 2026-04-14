# Figma to Webflow using Claude MCP

**Source:** [Flux Academy — Figma to Webflow using Claude MCP (EASY!)](https://www.youtube.com/watch?v=Yu43-Aw7oC0)
**Duration:** ~8 min demo walkthrough
**Date added:** 2026-04-14

## What it is

Ran from Flux Academy walks through a full Figma → Webflow build using Claude with two MCP connectors (Figma + Webflow). Setup is ~2 min: connect both MCPs in Claude's connector panel, authorize the target Webflow project. Prompt Claude to "connect to the Figma file, then build it in the Webflow project using the Client First framework." First pass: ~30 min, produces structure, color variables, most classes correctly named but no images and no responsive breakpoints. Manual step: drop exported assets into Webflow's asset panel (MCP has no upload). Second pass: ~3 min to wire images. Feedback round: Ran lists issues (missing logo, nav positioning, headings using DOM blocks instead of native H tags, button padding, misaligned columns, no responsive). Claude fixes most in ~30 more min. Total: ~1 hour of mostly passive "yes-yes-continue" prompting. Output is ~85% done, remaining polish done visually in Webflow.

## Key takeaways

- **MCP connector + framework instruction is the whole play.** Claude doesn't invent structure from scratch — it follows the framework convention (Client First here) so class naming and variables land where the user expects.
- **Treat Claude like a junior designer.** First pass is scaffolding, not finished work. Expect to give specific written feedback ("headings should use H tags, not DOM blocks; columns aren't aligned; add breakpoints") for round two.
- **Weird recurring bug:** Claude used generic DOM blocks for headings instead of native H1/H2 tags. Worth preempting in the prompt.
- **Asset upload is the one manual break.** Webflow MCP can't upload images yet — export from Claude, drag into Webflow's asset panel, tell Claude "done."
- **Visual polish stays in the target tool.** The argument for Webflow (vs. pure code gen) is that final-mile tweaks happen visually, not in a prompt loop.

## Notable comments

- **Create a project-specific skill with your framework rules** — @nocodekevin (19 votes): bundle Client First conventions, variable usage (font sizes, spacing), and component-naming heuristics into a custom skill so Claude stops having to be re-taught each run. Exactly the pattern Kvalt already uses with `figma-to-kvalt`.
- **Claude can't handle Webflow components — use a `_component` suffix** — @nocodekevin: explicitly instruct Claude to tag repeated sections/containers with `_component` so they're easy to convert manually after the build. Workaround for Webflow MCP's component blind spot.
- **Pre-upload images with descriptive filenames** — @nocodekevin: if the media library has `hero-dark-mountains.jpg` already, Claude can match them to the Figma layers by name. Removes the mid-run manual step.
- **Start from a Relume clone + style-guide note in the skill** — @nocodekevin: "refer to your style guide for base styles and adjust them as needed to fit the Figma system." Gives Claude a canonical base to adapt rather than build from zero.
- **InDesign/Illustrator PDFs outperform Figma for Claude's layout fidelity** — @craigbixel: PDF exports from Illustrator produced cleaner Claude output than Figma designs. Hypothesis: Adobe's document model is simpler for the model to parse. Worth testing as an alternative import path.
- **Figma connections beat screenshots and instructions** — @nocodekevin: across multiple tools, live MCP connection to Figma consistently beats "here's a screenshot" or "here's a description" for recreation fidelity.

## Relevance to Kvalt

Reinforces the `figma-to-kvalt` skill design: a framework-specific skill with token tables and class conventions dramatically raises baseline output quality, and is exactly what lets Kvalt ship "junior designer" AI runs that don't need re-teaching every time. Three concrete ideas worth stealing: (1) a `_component` suffix convention for things that should later become real Kvalt components — flags repetition without forcing the model to solve componentization mid-build; (2) pre-populating an asset manifest with descriptive names before the run so Claude can auto-match layer names to files; (3) testing whether PDF exports outperform Figma MCP for specific layout classes — if @craigbixel's observation replicates, it's a fallback path when Figma MCP chokes on deep component trees. Also a useful framing for the Kvalt pitch to David's team: the Webflow demo took 1 hour with ~15% polish remaining — the equivalent Kvalt workflow should aim for higher fidelity because our target (React + tokens) is closer to a canonical structure than Webflow's open class system.
