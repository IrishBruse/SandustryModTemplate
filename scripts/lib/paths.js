/**
 * OS-specific Sandustry user-data and Steam install paths.
 * Used by mod-path / setup / the watch log server — not by launch spawn code.
 *
 * User data:
 *   Linux:   ~/.config/sandustry
 *   Windows: %APPDATA%/sandustry  (AppData\Roaming\sandustry)
 *
 * Binary (Sandustry.exe on Windows, sandustry on Linux):
 *   1. SANDUSTRY env
 *   2. Default Steam roots
 *   3. libraryfolders.vdf libraries
 */
import { existsSync, readFileSync, symlinkSync } from "node:fs";
import { homedir } from "node:os";
import { basename, dirname, join } from "node:path";

const IS_WIN = process.platform === "win32";

/** Electron user-data root for Sandustry. */
export function sandustryUserDataDir() {
  if (IS_WIN) {
    const appData = process.env.APPDATA || join(homedir(), "AppData", "Roaming");
    return join(appData, "sandustry");
  }
  return join(homedir(), ".config", "sandustry");
}

export function sandustryModsDir() {
  return join(sandustryUserDataDir(), "mods");
}

export function sandustryLogsDir() {
  return join(sandustryUserDataDir(), "logs");
}

/** @returns {string[]} Absolute paths that may contain steamapps/. */
function defaultSteamRoots() {
  if (IS_WIN) {
    const roots = [];
    const x86 = process.env["ProgramFiles(x86)"];
    const pf = process.env.ProgramFiles;
    if (x86) roots.push(join(x86, "Steam"));
    if (pf) roots.push(join(pf, "Steam"));
    return roots;
  }

  return [
    join(homedir(), "games", "SteamLibrary"),
    join(homedir(), ".steam", "steam"),
    join(homedir(), ".steam", "root"),
    join(homedir(), ".local", "share", "Steam"),
    join(homedir(), ".var", "app", "com.valvesoftware.Steam", "data", "Steam"),
  ];
}

/**
 * Pull library paths from a Steam libraryfolders.vdf (legacy + current formats).
 * @param {string} vdfPath
 * @returns {string[]}
 */
function parseLibraryFoldersVdf(vdfPath) {
  if (!existsSync(vdfPath)) return [];
  let text;
  try {
    text = readFileSync(vdfPath, "utf8");
  } catch {
    return [];
  }

  /** @type {string[]} */
  const paths = [];
  // Current: "path"\t\t"D:\\SteamLibrary"
  for (const match of text.matchAll(/"path"\s+"([^"]+)"/gi)) {
    paths.push(match[1].replace(/\\\\/g, "\\"));
  }
  // Legacy: "1"\t\t"D:\\SteamLibrary"
  for (const match of text.matchAll(/"\d+"\s+"([^"]+)"/g)) {
    const value = match[1].replace(/\\\\/g, "\\");
    if (/^[A-Za-z]:[\\/]/.test(value) || value.startsWith("/")) paths.push(value);
  }
  return paths;
}

/** @param {string} steamRoot */
function libraryRootsFromSteamInstall(steamRoot) {
  const fromVdf = [
    ...parseLibraryFoldersVdf(join(steamRoot, "steamapps", "libraryfolders.vdf")),
    ...parseLibraryFoldersVdf(join(steamRoot, "config", "libraryfolders.vdf")),
  ];
  return [steamRoot, ...fromVdf];
}

/** Unique Steam install / library roots (defaults + libraryfolders.vdf). */
export function steamLibraryRoots() {
  /** @type {Set<string>} */
  const steamRoots = new Set();
  for (const root of defaultSteamRoots()) {
    for (const lib of libraryRootsFromSteamInstall(root)) {
      steamRoots.add(lib);
    }
  }
  return [...steamRoots];
}

/** @returns {string[]} Candidate game binaries, preferred first. */
function binaryCandidates() {
  /** @type {string[]} */
  const names = IS_WIN ? ["Sandustry.exe", "sandustry.exe"] : ["sandustry"];

  /** @type {string[]} */
  const out = [];
  for (const root of steamLibraryRoots()) {
    const common = join(root, "steamapps", "common", "Sandustry");
    for (const name of names) {
      out.push(join(common, name));
    }
  }
  return out;
}

/**
 * Resolve the Sandustry executable.
 * Uses SANDUSTRY when set; otherwise probes Steam defaults and libraryfolders.vdf.
 * Always returns a path (first candidate when none exist) so error messages stay useful.
 * @returns {string}
 */
export function resolveSandustryBinary() {
  const fromEnv = process.env.SANDUSTRY?.trim();
  if (fromEnv) return fromEnv;

  const candidates = binaryCandidates();
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }
  return (
    candidates[0] ??
    join(homedir(), "games", "SteamLibrary", "steamapps", "common", "Sandustry", "sandustry")
  );
}

/** @param {string} binaryPath */
export function sandustryBinaryName(binaryPath) {
  return basename(binaryPath);
}

/** @param {string} binaryPath */
export function sandustryInstallDir(binaryPath) {
  return dirname(binaryPath);
}

/** True when paths refer to the same location (case-insensitive on Windows). */
export function samePath(a, b) {
  if (IS_WIN) {
    return a.replace(/\//g, "\\").toLowerCase() === b.replace(/\//g, "\\").toLowerCase();
  }
  return a === b;
}

/**
 * Create a directory link: junction on Windows (no Developer Mode), symlink elsewhere.
 * @param {string} target Absolute directory to point at
 * @param {string} linkPath Path of the link to create
 */
export function linkDirectory(target, linkPath) {
  if (IS_WIN) {
    symlinkSync(target, linkPath, "junction");
  } else {
    symlinkSync(target, linkPath);
  }
}
