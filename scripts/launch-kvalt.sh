#!/bin/zsh
# launch-kvalt.sh — Open Kvalt dev environment in one click
# Usage: paste into macOS Shortcuts → "Run Shell Script" (zsh)
#
# What it does:
#   1. Opens Terminal tab → runs `npm run dev`
#   2. Opens Terminal tab → runs `claude`
#   3. Waits for Vite to pick a port, then opens Safari to that URL

KVALT_DIR="$HOME/Dev/kvalt-ds"

# ── 1. Terminal tab: dev server ──────────────────────────────────
osascript <<'APPLESCRIPT'
tell application "Terminal"
    activate
    -- Dev server tab
    do script "cd ~/Dev/kvalt-ds && npm run dev"
end tell
APPLESCRIPT

# ── 2. Terminal tab: Claude Code ─────────────────────────────────
osascript <<'APPLESCRIPT'
tell application "Terminal"
    activate
    -- Small delay so the first tab is settled
    delay 0.5
    -- Open a new tab (Cmd+T)
    tell application "System Events"
        keystroke "t" using command down
    end tell
    delay 0.3
    do script "cd ~/Dev/kvalt-ds && claude" in front window
end tell
APPLESCRIPT

# ── 3. Wait for Vite to start, then open Safari ─────────────────
# Poll for any port in 5173–5200 range (covers Vite fallbacks)
MAX_WAIT=30  # seconds
WAITED=0

while [ $WAITED -lt $MAX_WAIT ]; do
    # Find the port Vite is listening on
    PORT=$(lsof -iTCP -sTCP:LISTEN -nP 2>/dev/null \
        | grep node \
        | grep -oE ':51[0-9]{2}' \
        | head -1 \
        | tr -d ':')

    if [ -n "$PORT" ]; then
        open -a Safari "http://localhost:$PORT"
        exit 0
    fi

    sleep 1
    WAITED=$((WAITED + 1))
done

# Fallback: if we couldn't detect the port, open the default
open -a Safari "http://localhost:5173"
