# 10 CLI Tools That Make Claude Code Unstoppable

**Source:** Chase AI (YouTube)
**URL:** https://www.youtube.com/watch?v=uULvhQrKB_c
**Added:** 2026-03-28

---

## Key Thesis

The Claude Code ecosystem is shifting from MCPs to CLI tools. CLIs live in the terminal alongside Claude Code — no overhead, direct connection, fewer tokens. Playwright CLI comparison: same task as MCP but ~90,000 fewer tokens and faster execution.

## The 10 Tools

### 1. CLI Anything
Creates CLI tools from any open-source project. From the makers of LightRAG. Point Claude Code at any open-source repo → it generates a CLI wrapper. Already done for Blender, Inkscape, OBS, Zoom, NotebookLM. Two-step install, one-step execution.

### 2. NotebookLM CLI (notebooklm-cli)
Connects Claude Code to Google NotebookLM. Solves the "Claude can't handle video" problem — throw YouTube URLs at NotebookLM, it analyzes for free (Google's tokens), brings results back. Deliverables: podcasts, slide decks, infographics, quizzes, flashcards. Also unlocks batch downloads, slide revision, programmatic sharing not available in web UI.

### 3. Stripe CLI
Eliminates the pain of navigating Stripe's web interface. Product creation, configuration — all the 20-tab workflows become terminal commands. Still test transactions by hand, but setup/config is dramatically faster.

### 4. FFmpeg
Multimedia manipulation (video, audio, subtitles). Web design use case: took a keyboard assembly video → chopped into individual frames → created scroll-triggered animation on a web page. Also: auto-reverse and stitch videos for looping hero animations. Fills Claude Code's multimedia gap.

### 5. GitHub CLI
Essential for any code-pushing workflow. Claude Code already understands Git well — installing GitHub CLI is literally one sentence. Authentication is a simple link-click flow. Handles commits, branches, PRs, all from terminal.

### 6. Vercel CLI
Deployment from terminal. Generous free tier. GitHub + Vercel = easy CI/CD pipeline. Vercel also publishes many Claude Code skills (deployment, browser automation, design/UI). Worth exploring their full skills page.

### 7. Supabase CLI
Backend: databases + authentication in one place. Open source (Firebase alternative). Can run Supabase completely locally via CLI.

### 8. Playwright CLI
Browser automation — Claude Code spins up Chrome instances and tests web apps. Head-to-head with MCP: CLI was faster and used ~90K fewer tokens for the same task. Use case: automatically spin up 5 Chrome tabs, test forms from different angles. Deep feature set beyond basic testing.

### 9. LLMfit
Recommends which local model fits your hardware setup. Solves the "which Ollama model?" problem — non-obvious answer given the endless list of models and versions.

### 10. GWS (Google Workspace CLI)
Full Google Workspace control: Gmail, Docs, Sheets, everything. Security considerations exist but mitigated by: sandboxing Claude Code with shared folders, email filters, Google Armor (prompt injection protection). Has a massive library of skills — recommend pointing Claude Code at the repo and having it recommend which to install.

## Key Insights

- **CLI > MCP trend:** "We're moving away from MCPs. We're moving into CLIs because it just makes sense. Claude Code lives in the terminal. CLIs live in the terminal. There's no overhead."
- **Skills + CLIs go hand-in-hand:** Install the CLI dependency, then give Claude Code a skill that teaches it how to use the tool in the right way.
- **Let Claude Code install things:** For most CLI tools, just give Claude Code the repo URL or docs page and it will handle installation.
- **Multimedia is the gap:** Claude Code out-of-box can't handle video/audio well. FFmpeg and NotebookLM CLI fill that gap.

## Relevance to Kvalt

- **FFmpeg for motion showcase:** Could use FFmpeg to create scroll-triggered animations or frame-by-frame breakdowns for the Kvalt docs site — showing component animations, interaction demos, or face previews as scroll sequences.
- **Playwright CLI for component testing:** Test Kvalt components in real browsers automatically. Validate motion timing, interaction states, responsive behavior. The 90K token savings over MCP is significant for CI workflows.
- **NotebookLM CLI for research pipeline:** Could streamline the knowledge base workflow — feed YouTube URLs through NotebookLM for analysis, then distill into knowledge entries. Faster than manual Apify transcript → manual distillation.
- **CLI-first distribution validates faces:** The "CLI > MCP" trend aligns with Kvalt's planned CLI-based face distribution. Developers clearly prefer terminal-native tools. Ship faces as a CLI-installable package.
- **GitHub CLI + Vercel CLI for Kvalt deployment:** Standard tooling for the docs site CI/CD pipeline.
