# Figma Design System Skills for Designers (Test Results)

**Source:** YouTube — "Claude Code + Figma Design System (Designer Workflow Test)"
**Date:** 2026-04-07
**Added:** 2026-04-07
**Category:** engineering-workflows

---

## Experiment Setup

Testing whether Claude Code + Figma Skills could generate designs directly from a design system. The goal: designers use Claude Code to generate new screens from the published design system without touching code.

## Results

**What worked:** Claude Code correctly used components from the design system (Button, Input). It identified which components to use and placed them appropriately. Basic component selection logic is sound.

**What failed:** The generated designs completely missed applying design tokens. Surface colors were hardcoded instead of pulling from the system's color variables. Shadows didn't use the token library. Typography scaling was arbitrary instead of using the type scale. The visual language (tokens, variables, spacing rules) was ignored entirely.

## The Root Cause

For Claude Code to respect a design system, the system must be published as a **team library in Figma**. If it's only in the source code or a local Figma file, Claude Code can't see it. Even when published, the AI needs explicit instruction on which tokens apply where — it doesn't automatically "understand" your system's philosophy.

## Honest Assessment

Currently, developers get far more value from Claude Code + Figma than designers do. A developer can extract a design, understand the component structure, and regenerate it in code. A designer gets component shells that need manual token fixes. The workflow currently creates work instead of eliminating it — tweaking hardcoded values in Figma is slower than designing manually.

**Verdict: Not production-ready for designers yet.** The skill needs explicit token mapping prompts and Figma library linking before it's worth the context cost.

## Relevance to Kvalt

This validates Kvalt's approach: the design system must be codified and discoverable. A Figma Skills task needs pre-loaded token tables (like Kvalt's), not just component references. Kvalt's strength is that every token is documented in code and available for export — Claude Code can reference exact values, not guess them. The test reveals that "publish the design system" is necessary but insufficient — the tokens need to be explicitly available to the AI's reasoning.
