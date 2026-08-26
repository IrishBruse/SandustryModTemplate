/**
 * Versioned Sandustry source extracts under `sandustry/<version>-<branch>/`.
 */
import { extractFile } from "@electron/asar";
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync } from "node:fs";
import { join } from "node:path";
import { asarExtractPath, asarRelPath } from "./asar-path.js";

export const SANDUSTRY_EXTRACT_DIRNAME = "sandustry";
export const LEGACY_CURRENT_LINK = "current";
export const BUNDLE_RELS = ["dist/js/bundle.js", "js/bundle.js"];
const VERSIONED_FOLDER = /^\d+\.\d+\.\d+-[\w-]+$/;

/** @param {string} repoRoot */
export function sandustryExtractRoot(repoRoot) {
  return join(repoRoot, SANDUSTRY_EXTRACT_DIRNAME);
}

/**
 * Folder name for one extract, e.g. `0.5.2-mods`.
 * @param {string | null | undefined} version
 * @param {string | null | undefined} branchKey
 */
export function gameExtractFolderName(version, branchKey) {
  const v = String(version ?? "").trim() || "unknown";
  const branch = sanitizeBranchKey(branchKey) || "release";
  return `${v}-${branch}`;
}

/** @param {string | null | undefined} branchKey */
export function sanitizeBranchKey(branchKey) {
  const raw = String(branchKey ?? "")
    .trim()
    .toLowerCase();
  if (!raw) return "";
  return raw.replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
}

/**
 * Resolve branch key from Steam beta and bundle contents.
 * @param {string | null | undefined} steamBetaKey
 * @param {boolean} hasSandkit
 */
export function resolveGameBranchKey(steamBetaKey, hasSandkit) {
  const beta = sanitizeBranchKey(steamBetaKey);
  if (beta) return beta;
  if (hasSandkit) return "mods";
  return "release";
}

/** @param {string | Buffer | Uint8Array} bundle */
export function bundleHasSandkit(bundle) {
  const text = typeof bundle === "string" ? bundle : Buffer.from(bundle).toString("utf8");
  return text.includes("sandkit");
}

/**
 * Read `package.json` version from app.asar without a full extract.
 * @param {string} asarPath
 * @param {string[]} listed
 * @returns {string | null}
 */
export function readGameVersionFromAsar(asarPath, listed) {
  const rels = new Set(listed.map(asarRelPath));
  const pkgRel = rels.has("package.json") ? "package.json" : null;
  if (!pkgRel) return null;

  try {
    const raw = extractFile(asarPath, asarExtractPath(pkgRel));
    const pkg = JSON.parse(Buffer.from(raw).toString("utf8"));
    const version = typeof pkg.version === "string" ? pkg.version.trim() : "";
    return version || null;
  } catch {
    return null;
  }
}

/**
 * @param {string} asarPath
 * @param {string[]} listed
 * @returns {{ rel: string; hasSandkit: boolean } | null}
 */
export function readBundleSandkitFromAsar(asarPath, listed) {
  for (const rel of BUNDLE_RELS) {
    const listedEntry = listed.find((entry) => asarRelPath(entry) === rel);
    if (!listedEntry) continue;

    try {
      const raw = extractFile(asarPath, asarExtractPath(listedEntry));
      return { rel, hasSandkit: bundleHasSandkit(raw) };
    } catch {
      return null;
    }
  }
  return null;
}

/** @param {string} extractRoot @param {string} folderName */
export function versionedExtractDir(extractRoot, folderName) {
  return join(extractRoot, folderName);
}

/** @param {string} name */
export function isVersionedExtractFolder(name) {
  return VERSIONED_FOLDER.test(name);
}

/** @param {string} extractRoot @param {string} name */
function shouldKeepExtractRootEntry(extractRoot, name) {
  if (isVersionedExtractFolder(name)) return true;
  if (name === LEGACY_CURRENT_LINK) {
    rmSync(join(extractRoot, name), { recursive: true, force: true });
    return true;
  }
  return false;
}

/** Remove legacy `sandustry/current` symlink from older setup runs. */
export function removeLegacyCurrentLink(extractRoot) {
  const linkPath = join(extractRoot, LEGACY_CURRENT_LINK);
  if (!existsSync(linkPath)) return;
  rmSync(linkPath, { recursive: true, force: true });
}

/**
 * Move a flat `sandustry/main.js` tree into `sandustry/<version>-<branch>/`.
 * @param {string} extractRoot
 * @returns {string | null} folder name when migration ran
 */
export function migrateLegacyFlatExtract(extractRoot) {
  if (!existsSync(join(extractRoot, "main.js"))) return null;

  let version = null;
  try {
    const pkg = JSON.parse(readFileSync(join(extractRoot, "package.json"), "utf8"));
    version = typeof pkg.version === "string" ? pkg.version.trim() : null;
  } catch {
    /* no package.json */
  }

  let hasSandkit = false;
  for (const rel of BUNDLE_RELS) {
    const bundlePath = join(extractRoot, rel);
    if (!existsSync(bundlePath)) continue;
    hasSandkit = bundleHasSandkit(readFileSync(bundlePath));
    break;
  }

  const folderName = gameExtractFolderName(version, resolveGameBranchKey("", hasSandkit));
  const dest = versionedExtractDir(extractRoot, folderName);
  mkdirSync(dest, { recursive: true });

  for (const name of readdirSync(extractRoot)) {
    if (shouldKeepExtractRootEntry(extractRoot, name)) continue;
    renameSync(join(extractRoot, name), join(dest, name));
  }

  return folderName;
}

/**
 * Remove leftover flat extract files at `sandustry/` root after migration.
 * @param {string} extractRoot
 */
export function cleanupOrphanedFlatExtract(extractRoot) {
  if (!existsSync(join(extractRoot, "package.json"))) return;
  if (existsSync(join(extractRoot, "main.js"))) return;

  for (const name of readdirSync(extractRoot)) {
    if (shouldKeepExtractRootEntry(extractRoot, name)) continue;
    rmSync(join(extractRoot, name), { recursive: true, force: true });
  }
}

/** @param {string} extractRoot */
export function ensureExtractRoot(extractRoot) {
  mkdirSync(extractRoot, { recursive: true });
  removeLegacyCurrentLink(extractRoot);
  const migrated = migrateLegacyFlatExtract(extractRoot);
  cleanupOrphanedFlatExtract(extractRoot);
  return migrated;
}
