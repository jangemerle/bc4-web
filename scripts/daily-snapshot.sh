#!/bin/bash
# Daily snapshot — creates a dated git tag if there are new commits since last tag
# Runs automatically via cron. To restore a snapshot:
#   git checkout snapshot/2026-03-28

set -e

cd /Users/jan/Dev/kvalt-ds

# Load homebrew so git/gh are available
eval "$(/opt/homebrew/bin/brew shellenv)" 2>/dev/null || true

TODAY="snapshot/$(date '+%Y-%m-%d')"

# Skip if today's tag already exists
if git tag | grep -q "^$TODAY$"; then
  echo "Snapshot $TODAY already exists, skipping."
  exit 0
fi

# Check if there are any commits since the last snapshot tag
LAST_TAG=$(git tag --sort=-creatordate | grep "^snapshot/" | head -1)

if [ -z "$LAST_TAG" ]; then
  # No previous snapshot — create one now
  CHANGES=1
else
  CHANGES=$(git log "$LAST_TAG"..HEAD --oneline | wc -l | tr -d ' ')
fi

if [ "$CHANGES" -eq 0 ]; then
  echo "No changes since $LAST_TAG, skipping snapshot."
  exit 0
fi

# Create and push the tag
git tag "$TODAY"
git push origin "$TODAY"

echo "Snapshot created: $TODAY ($CHANGES new commits)"
