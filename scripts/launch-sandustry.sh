#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# shellcheck source=sandustry-common.sh
source "$ROOT/scripts/sandustry-common.sh"

sandustry_require_binary
sandustry_build_mod "$ROOT"
sandustry_stop_running
sandustry_left_monitor

cd "$SANDUSTRY_DIR"

# --start-maximized applies as early as Electron allows; wmctrl loop below is a fallback.
nohup "$SANDUSTRY" \
  --no-sandbox \
  --window-position="${MON_X},${MON_Y}" \
  --start-maximized \
  >/dev/null 2>&1 &

LAUNCH_PID=$!
disown "$LAUNCH_PID" 2>/dev/null || true
sandustry_maximize_on_left_monitor "$MON_X" "$MON_Y"

echo "Launched Sandustry (pid ${LAUNCH_PID})."
