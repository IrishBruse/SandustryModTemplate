#!/usr/bin/env bash
# Shared Sandustry launch helpers (normal + debug).
set -euo pipefail

SANDUSTRY="${SANDUSTRY:-/home/econn/games/SteamLibrary/steamapps/common/Sandustry/sandustry}"
SANDUSTRY_DIR="$(dirname "$SANDUSTRY")"

sandustry_require_binary() {
  if [[ ! -x "$SANDUSTRY" ]]; then
    echo "Sandustry binary not found: $SANDUSTRY" >&2
    exit 1
  fi
}

sandustry_build_mod() {
  local root="$1"
  # shellcheck source=mod-path.sh
  source "$root/scripts/mod-path.sh"
  ensure_mod_dir
  MOD_OUT_DIR="$MOD_DIR" node "$root/esbuild.config.mjs"
}

sandustry_stop_running() {
  if pgrep -f "${SANDUSTRY_DIR}/sandustry" >/dev/null 2>&1; then
    echo "Stopping Sandustry..."
    pkill -TERM -f "${SANDUSTRY_DIR}/sandustry" || true
    for _ in {1..20}; do
      pgrep -f "${SANDUSTRY_DIR}/sandustry" >/dev/null 2>&1 || break
      sleep 0.25
    done
    pkill -KILL -f "${SANDUSTRY_DIR}/sandustry" 2>/dev/null || true
  fi
}

sandustry_left_monitor() {
  read -r MON_X MON_Y MON_W MON_H MON_NAME <<< "$(
    xrandr --query |
      awk '
        / connected / {
          if (match($0, /([0-9]+)x([0-9]+)\+([0-9]+)\+([0-9]+)/, m)) {
            name = $1
            w = m[1]
            h = m[2]
            x = m[3]
            y = m[4]
            print x, y, w, h, name
          }
        }
      ' |
      sort -n -k1,1 -k2,2 |
      head -1
  )"

  if [[ -z "${MON_X:-}" ]]; then
    echo "Could not detect monitors from xrandr." >&2
    exit 1
  fi

  echo "Left monitor: ${MON_NAME} ${MON_W}x${MON_H} at ${MON_X},${MON_Y}"
}

sandustry_maximize_on_left_monitor() {
  local mon_x="$1"
  local mon_y="$2"
  (
    for _ in {1..60}; do
      for display in "${GNOME_SETUP_DISPLAY:-:2}" ":1" "${DISPLAY:-:0}"; do
        if DISPLAY="$display" wmctrl -l 2>/dev/null | rg -qi 'sandustry'; then
          DISPLAY="$display" wmctrl -r "Sandustry" -e "0,${mon_x},${mon_y},-1,-1" 2>/dev/null || true
          DISPLAY="$display" wmctrl -r "Sandustry" -b add,maximized_vert,maximized_horz 2>/dev/null || true
          exit 0
        fi
      done
      sleep 0.1
    done
  ) &
}
