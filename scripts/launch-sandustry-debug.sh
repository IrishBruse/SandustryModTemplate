#!/usr/bin/env bash
# Build the mod, stop any running game, then start Sandustry with Node/Chrome debug ports.
# Used by VS Code launch configs and `npm run sandustry:debug`.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# shellcheck source=sandustry-common.sh
source "$ROOT/scripts/sandustry-common.sh"

SANDUSTRY_MAIN_DEBUG_PORT="${SANDUSTRY_MAIN_DEBUG_PORT:-9230}"
SANDUSTRY_RENDERER_DEBUG_PORT="${SANDUSTRY_RENDERER_DEBUG_PORT:-9222}"

sandustry_require_binary
MOD_SOURCEMAP=1 sandustry_build_mod "$ROOT"
sandustry_stop_running
sandustry_left_monitor

cd "$SANDUSTRY_DIR"

if [[ "${SANDUSTRY_DEBUG_FOREGROUND:-}" == "1" ]]; then
  echo "Sandustry debug (foreground) — main ${SANDUSTRY_MAIN_DEBUG_PORT}, renderer ${SANDUSTRY_RENDERER_DEBUG_PORT}"
  exec "$SANDUSTRY" \
    --no-sandbox \
    --inspect="${SANDUSTRY_MAIN_DEBUG_PORT}" \
    --remote-debugging-port="${SANDUSTRY_RENDERER_DEBUG_PORT}" \
    --window-position="${MON_X},${MON_Y}" \
    --start-maximized
fi

echo "Sandustry debug — main ${SANDUSTRY_MAIN_DEBUG_PORT}, renderer ${SANDUSTRY_RENDERER_DEBUG_PORT}"

"$SANDUSTRY" \
  --no-sandbox \
  --inspect="${SANDUSTRY_MAIN_DEBUG_PORT}" \
  --remote-debugging-port="${SANDUSTRY_RENDERER_DEBUG_PORT}" \
  --window-position="${MON_X},${MON_Y}" \
  --start-maximized \
  2>&1 &

LAUNCH_PID=$!
sandustry_maximize_on_left_monitor "$MON_X" "$MON_Y"
echo "Launched Sandustry with debug ports (pid ${LAUNCH_PID})."
