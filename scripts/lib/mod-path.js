/**
 * Sandustry mod output paths and repo dist links (symlink / Windows junction).
 * Game folder name comes from `modinfo.name` in `src/<name>/mod.ts`.
 * The game resolves symlinks with realpath and rejects mod folders outside the mods root.
 *
 * Mods dir: Linux ~/.config/sandustry/mods ; Windows %APPDATA%/sandustry/mods
 */
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  readlinkSync,
  rmSync,
  unlinkSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { styleText } from "./cli-style.js";
import { linkDirectory, samePath, sandustryModsDir } from "./paths.js";

export const REPO_DIST_LINK = "dist";

/** Remove a symlink (including a dangling one) or a real file/directory. */
function removePath(path) {
  let stat;
  try {
    stat = lstatSync(path);
  } catch {
    return;
  }
  if (stat.isSymbolicLink()) {
    unlinkSync(path);
    return;
  }
  rmSync(path, { recursive: true, force: true });
}

function isOwnedGameDir(dir) {
  return samePath(dirname(resolve(dir)), sandustryModsDir());
}

/** @param {string} distPath @returns {Set<string>} */
function readDistSymlinkTargets(distPath) {
  /** @type {Set<string>} */
  const targets = new Set();
  if (!existsSync(distPath) || !lstatSync(distPath).isDirectory()) return targets;

  for (const name of readdirSync(distPath)) {
    const child = join(distPath, name);
    try {
      if (!lstatSync(child).isSymbolicLink()) continue;
      targets.add(resolve(distPath, readlinkSync(child)));
    } catch {
      /* skip unreadable link */
    }
  }
  return targets;
}

/** Remove a game folder this template used to own. */
function removeOwnedGameDir(gameDir) {
  if (!existsSync(gameDir) || !isOwnedGameDir(gameDir)) return;
  removePath(gameDir);
  console.log(`Removed game mod ${gameDir}`);
}

/**
 * Remove OS mod folders linked from `dist/<folder>` and those links.
 * Used when `npm run dev` stops.
 * @param {string} repoRoot
 */
export function removeOwnedGameMods(repoRoot) {
  const distPath = join(repoRoot, REPO_DIST_LINK);
  if (!existsSync(distPath) || !lstatSync(distPath).isDirectory()) return;

  for (const name of readdirSync(distPath)) {
    const child = join(distPath, name);
    let stat;
    try {
      stat = lstatSync(child);
    } catch {
      continue;
    }

    if (stat.isSymbolicLink()) {
      let target = "";
      try {
        target = resolve(distPath, readlinkSync(child));
      } catch {
        target = "";
      }
      removePath(child);
      console.log(`Removed ${REPO_DIST_LINK}/${name}`);
      if (target) removeOwnedGameDir(target);
      continue;
    }

    // Legacy tracking file from older template versions.
    if (name === ".owned-game-names.json") {
      removePath(child);
    }
  }
}

/** @param {string} gameName `modinfo.name` */
export function gameModDir(gameName) {
  return join(sandustryModsDir(), gameName);
}

/** @param {string} gameName */
export function ensureGameModDir(gameName) {
  const dir = gameModDir(gameName);
  mkdirSync(dirname(dir), { recursive: true });
  if (existsSync(dir) && lstatSync(dir).isSymbolicLink()) {
    removePath(dir);
  }
  mkdirSync(dir, { recursive: true });
  return dir;
}

/** @param {string} dir @returns {string | null} */
function readModinfoId(dir) {
  const modinfoPath = join(dir, "modinfo.json");
  if (!existsSync(modinfoPath)) return null;
  try {
    const parsed = JSON.parse(readFileSync(modinfoPath, "utf8"));
    return typeof parsed?.id === "string" && parsed.id.trim() ? parsed.id.trim() : null;
  } catch {
    return null;
  }
}

/**
 * After a `modinfo.name` rename, an old folder can keep the same `id`.
 * Sandustry rejects every copy of a duplicate manifest id — remove the leftovers.
 * @param {{ gameName: string; manifest?: { id?: string } }[]} mods
 */
export function removeStaleSameIdGameDirs(mods) {
  /** @type {Map<string, string>} id → current game folder name */
  const wantedById = new Map();
  for (const mod of mods) {
    const id = typeof mod.manifest?.id === "string" ? mod.manifest.id.trim() : "";
    if (!id) continue;
    wantedById.set(id, mod.gameName);
  }
  if (wantedById.size === 0) return;

  const root = sandustryModsDir();
  if (!existsSync(root)) return;

  for (const name of readdirSync(root)) {
    const dir = join(root, name);
    let stat;
    try {
      stat = lstatSync(dir);
    } catch {
      continue;
    }
    if (!stat.isDirectory() && !stat.isSymbolicLink()) continue;
    if (!isOwnedGameDir(dir)) continue;

    const id = readModinfoId(dir);
    if (!id) continue;
    const wantedName = wantedById.get(id);
    if (!wantedName || name === wantedName) continue;

    removePath(dir);
    console.log(
      `${styleText("yellow", "Removed")} stale mod folder ${styleText("bold", name)} ${styleText("dim", `(same id as "${wantedName}")`)}`,
    );
  }
}

/**
 * `dist/` is a directory of per-mod links named after the src folder.
 * @param {string} repoRoot
 * @param {{ folder: string; gameName: string; manifest?: { id?: string } }[]} mods
 * @param {string[]} [keepFolders] Src folders that should keep a dist link (all discovered mods).
 */
export function linkRepoDistToModOutputs(repoRoot, mods, keepFolders) {
  const distPath = join(repoRoot, REPO_DIST_LINK);

  if (existsSync(distPath) && lstatSync(distPath).isSymbolicLink()) {
    removePath(distPath);
    console.log(`Removed ${REPO_DIST_LINK}/ link (now a directory of per-mod links).`);
  } else if (existsSync(distPath) && !lstatSync(distPath).isDirectory()) {
    removePath(distPath);
  }

  mkdirSync(distPath, { recursive: true });

  const previousTargets = readDistSymlinkTargets(distPath);

  const wanted = new Set(keepFolders ?? mods.map((mod) => mod.folder));
  for (const name of readdirSync(distPath)) {
    if (wanted.has(name) || name === ".owned-game-names.json") continue;
    const child = join(distPath, name);
    if (!lstatSync(child).isSymbolicLink()) continue;
    let target = "";
    try {
      target = resolve(distPath, readlinkSync(child));
    } catch {
      target = "";
    }
    removePath(child);
    if (target && isOwnedGameDir(target)) {
      removePath(target);
      console.log(`Removed stale ${REPO_DIST_LINK}/${name} and ${target}`);
    } else {
      console.log(`Removed stale ${REPO_DIST_LINK}/${name}`);
    }
  }

  removeStaleSameIdGameDirs(mods);

  for (const mod of mods) {
    const linkPath = join(distPath, mod.folder);
    const target = gameModDir(mod.gameName);
    let linkStat;
    try {
      linkStat = lstatSync(linkPath);
    } catch {
      linkStat = null;
    }

    if (linkStat?.isSymbolicLink()) {
      const current = resolve(distPath, readlinkSync(linkPath));
      if (samePath(current, target)) continue;
      removePath(linkPath);
    } else if (linkStat) {
      removePath(linkPath);
    }

    linkDirectory(target, linkPath);
    console.log(
      `${styleText("green", "Linked")} ${styleText("bold", `${REPO_DIST_LINK}/${mod.folder}`)} ${styleText("dim", `-> ${target}`)}`,
    );
  }

  const keptTargets = readDistSymlinkTargets(distPath);
  for (const target of previousTargets) {
    if (keptTargets.has(target)) continue;
    removeOwnedGameDir(target);
  }

  const legacyNamesFile = join(distPath, ".owned-game-names.json");
  if (existsSync(legacyNamesFile)) removePath(legacyNamesFile);
}
