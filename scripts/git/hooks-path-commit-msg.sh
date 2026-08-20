#!/bin/sh
# For a global core.hooksPath: run this repo's commit-msg check when present.
# Other repositories without scripts/git/commit-msg.js are not affected.
set -e
repo=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0
hook="$repo/scripts/git/commit-msg.js"
if [ -f "$hook" ]; then
  exec node "$hook" "$@"
fi
