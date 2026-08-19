#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# shellcheck source=mod-path.sh
source "$ROOT/scripts/mod-path.sh"

ensure_mod_dir
link_repo_dist_to_mod_output "$ROOT"
export MOD_OUT_DIR="$MOD_DIR"

echo "Watching src/ -> ${MOD_OUT_DIR}/main.js"
exec node "$ROOT/esbuild.config.mjs" --watch
