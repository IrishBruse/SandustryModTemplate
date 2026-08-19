#!/usr/bin/env bash
# Sandustry resolves symlinks with realpath and rejects mod folders outside the
# mods root — build into a real directory under ~/.config/sandustry/mods/.
MOD_FOLDER_NAME="Example Mod"
MOD_DIR="${HOME}/.config/sandustry/mods/${MOD_FOLDER_NAME}"
REPO_DIST_LINK="dist"

ensure_mod_dir() {
  mkdir -p "$(dirname "$MOD_DIR")"
  if [[ -L "$MOD_DIR" ]]; then
    rm "$MOD_DIR"
  fi
  mkdir -p "$MOD_DIR"
}

# Symlink repo/dist -> MOD_DIR so built files are visible in the project tree.
link_repo_dist_to_mod_output() {
  local repo_root="$1"
  local link_path="${repo_root}/${REPO_DIST_LINK}"

  if [[ -e "$link_path" && ! -L "$link_path" ]]; then
    rm -rf "$link_path"
    echo "Removed local ${REPO_DIST_LINK}/ directory (dev writes to ${MOD_DIR})."
  elif [[ -L "$link_path" ]]; then
    local current
    current="$(readlink "$link_path")"
    if [[ "$current" == "$MOD_DIR" ]]; then
      return 0
    fi
    rm "$link_path"
  fi

  ln -s "$MOD_DIR" "$link_path"
  echo "Linked ${REPO_DIST_LINK}/ -> ${MOD_DIR}"
}
