/**
 * Sandustry mod output path and repo dist symlink.
 * The game resolves symlinks with realpath and rejects mod folders outside the mods root.
 */
import { existsSync, lstatSync, mkdirSync, readlinkSync, rmSync, symlinkSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";

export const MOD_FOLDER_NAME = "Example Mod";
export const MOD_DIR = join(homedir(), ".config/sandustry/mods", MOD_FOLDER_NAME);
export const REPO_DIST_LINK = "dist";

export function ensureModDir() {
  mkdirSync(dirname(MOD_DIR), { recursive: true });
  if (existsSync(MOD_DIR) && lstatSync(MOD_DIR).isSymbolicLink()) {
    rmSync(MOD_DIR);
  }
  mkdirSync(MOD_DIR, { recursive: true });
}

/** Symlink repo/dist -> MOD_DIR so built files are visible in the project tree. */
export function linkRepoDistToModOutput(repoRoot) {
  const linkPath = join(repoRoot, REPO_DIST_LINK);

  if (existsSync(linkPath) && !lstatSync(linkPath).isSymbolicLink()) {
    rmSync(linkPath, { recursive: true, force: true });
    console.log(`Removed local ${REPO_DIST_LINK}/ directory (dev writes to ${MOD_DIR}).`);
  } else if (existsSync(linkPath) && lstatSync(linkPath).isSymbolicLink()) {
    const current = readlinkSync(linkPath);
    if (current === MOD_DIR) return;
    rmSync(linkPath);
  }

  symlinkSync(MOD_DIR, linkPath);
  console.log(`Linked ${REPO_DIST_LINK}/ -> ${MOD_DIR}`);
}
