#!/usr/bin/env bash
# VS Code F5 launcher — same window placement as scripts/launch-sandustry.sh,
# with Node/Chrome debug ports for the Sandustry + Sandustry Renderer configs.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# shellcheck source=sandustry-common.sh
source "$ROOT/scripts/sandustry-common.sh"

SANDUSTRY_MAIN_DEBUG_PORT="${SANDUSTRY_MAIN_DEBUG_PORT:-9230}"
SANDUSTRY_RENDERER_DEBUG_PORT="${SANDUSTRY_RENDERER_DEBUG_PORT:-9222}"

sandustry_require_binary
sandustry_left_monitor
sandustry_maximize_on_left_monitor "$MON_X" "$MON_Y"

exec "$SANDUSTRY" \
  --no-sandbox \
  --inspect="${SANDUSTRY_MAIN_DEBUG_PORT}" \
  --remote-debugging-port="${SANDUSTRY_RENDERER_DEBUG_PORT}" \
  --window-position="${MON_X},${MON_Y}" \
  --start-maximized \
  "$@"
