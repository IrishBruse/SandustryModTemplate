/**
 * Discover `src/<name>/mod.ts` and `examples/<name>/mod.ts` folders and load each manifest.
 * Optional `--mod <folder>` (repeatable, or `--mod=<folder>`) selects one or more.
 */
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { basename, dirname, isAbsolute, join, normalize, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { bundleAndImport } from "./build-patches.js";
import { ensureGameModDir, gameModDir, linkRepoDistToModOutputs } from "./mod-path.js";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

/** Mod source roots relative to the repo root. */
export const MOD_ROOTS = ["src", "examples"];

/** Companion mod folder. Debug builds install it; release builds omit it. */
export const DEBUG_MOD_FOLDER = "debug";

/** Workshop staging root (`npm run publish`). Copied from the OS mods folder on release `npm run build`. */
export const PUBLISH_OUT_ROOT = join(ROOT, "build");

/** @param {string} folder Mod folder name (under `src/` or `examples/`) */
export function publishStagingDir(folder) {
  return join(PUBLISH_OUT_ROOT, folder);
}

/**
 * Copy a release build from the OS mods folder into `build/<folder>/`.
 * @param {LoadedMod} mod
 */
export function syncModToPublishStaging(mod) {
  const staging = publishStagingDir(mod.folder);
  rmSync(staging, { recursive: true, force: true });
  mkdirSync(staging, { recursive: true });
  cpSync(mod.outDir, staging, { recursive: true });
}

const SKIP_DIR_NAMES = new Set(["node_modules", ".git"]);

/**
 * Mod-folder name for a path inside a mod tree, or null when outside.
 * @param {string | undefined} filePath
 * @param {string} [root]
 * @returns {string | null}
 */
export function modFolderFromPath(filePath, root = ROOT) {
  if (!filePath) return null;
  let dir = normalize(filePath);
  try {
    if (!statSync(dir).isDirectory()) dir = dirname(dir);
  } catch {
    return null;
  }

  for (const modRoot of MOD_ROOTS) {
    const base = join(root, modRoot);
    let current = dir;
    while (true) {
      const rel = relative(base, current);
      if (!rel || rel.startsWith("..") || isAbsolute(rel)) break;
      if (existsSync(join(current, "mod.ts"))) return basename(current);
      const parent = dirname(current);
      if (parent === current) break;
      current = parent;
    }
  }
  return null;
}

/** @deprecated Use {@link modFolderFromPath}. */
export function srcModFolder(filePath, root = ROOT) {
  return modFolderFromPath(filePath, root);
}

/**
 * Fail the bundle when one mod folder imports another mod's tree.
 * @param {string} [root]
 */
export function modIsolationPlugin(root = ROOT) {
  return {
    name: "mod-isolation",
    setup(build) {
      build.onResolve({ filter: /.*/ }, async (args) => {
        if (args.pluginData?.skipModIsolation) return;
        const result = await build.resolve(args.path, {
          importer: args.importer,
          resolveDir: args.resolveDir,
          kind: args.kind,
          namespace: args.namespace,
          pluginData: { ...args.pluginData, skipModIsolation: true },
        });
        if (result.errors?.length) return result;
        const fromMod = modFolderFromPath(args.importer, root);
        const toMod = modFolderFromPath(result.path, root);
        if (fromMod && toMod && fromMod !== toMod) {
          return {
            errors: [
              {
                text: `Mod "${fromMod}" cannot import from mod "${toMod}" (${args.path})`,
              },
            ],
          };
        }
        return result;
      });
    },
  };
}

/**
 * @typedef {object} DiscoveredMod
 * @property {string} folder Leaf folder name (`--mod` id and `dist/<folder>/` link)
 * @property {string} root `src` or `examples`
 * @property {string} dir Absolute path to the mod folder
 * @property {string} repoPath Repo-relative path (for example `examples/ui/overlay-hotkey`)
 */

/**
 * Walk a mod root and collect every directory that contains `mod.ts`.
 * @param {string} modRoot `src` or `examples`
 * @returns {DiscoveredMod[]}
 */
function discoverModsInTree(modRoot) {
  const base = join(ROOT, modRoot);
  if (!existsSync(base)) return [];

  /** @type {DiscoveredMod[]} */
  const mods = [];

  /** @param {string} dir */
  function walk(dir) {
    if (existsSync(join(dir, "mod.ts"))) {
      mods.push({
        folder: basename(dir),
        root: modRoot,
        dir,
        repoPath: relative(ROOT, dir).split(sep).join("/"),
      });
      return;
    }
    let names;
    try {
      names = readdirSync(dir);
    } catch {
      return;
    }
    for (const name of names) {
      if (SKIP_DIR_NAMES.has(name)) continue;
      const child = join(dir, name);
      try {
        if (statSync(child).isDirectory()) walk(child);
      } catch {
        /* removed while walking */
      }
    }
  }

  walk(base);
  return mods;
}

/**
 * @returns {DiscoveredMod[]} Sorted by folder name.
 */
export function discoverMods() {
  /** @type {DiscoveredMod[]} */
  const mods = [];
  /** @type {Map<string, string>} */
  const seen = new Map();

  for (const root of MOD_ROOTS) {
    for (const mod of discoverModsInTree(root)) {
      const prior = seen.get(mod.folder);
      if (prior) {
        throw new Error(
          `Duplicate mod folder name "${mod.folder}" in ${prior} and ${mod.repoPath}. Folder names must be unique across mod roots.`,
        );
      }
      seen.set(mod.folder, mod.repoPath);
      mods.push(mod);
    }
  }

  return mods.sort((a, b) => a.folder.localeCompare(b.folder));
}

/** @returns {string[]} Sorted folder names that contain `mod.ts`. */
export function discoverModFolders() {
  return discoverMods().map((mod) => mod.folder);
}

/**
 * @param {string} folder
 * @returns {DiscoveredMod | undefined}
 */
export function findModByFolder(folder) {
  return discoverMods().find((mod) => mod.folder === folder);
}

/**
 * @param {string[]} argv
 * @returns {string[]}
 */
export function parseModFilters(argv) {
  /** @type {string[]} */
  const filters = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--mod") {
      const value = argv[i + 1];
      if (!value || value.startsWith("-")) {
        throw new Error("--mod requires a folder name (for example --mod hello-world)");
      }
      filters.push(value);
      i += 1;
      continue;
    }
    if (arg.startsWith("--mod=")) {
      const value = arg.slice("--mod=".length).trim();
      if (!value) throw new Error("--mod requires a folder name (for example --mod=hello-world)");
      filters.push(value);
    }
  }
  return filters;
}

/**
 * @param {string[]} argv
 * @returns {string | null}
 */
export function parseModFilter(argv) {
  const filters = parseModFilters(argv);
  return filters[0] ?? null;
}

/**
 * @typedef {object} LoadedMod
 * @property {string} folder
 * @property {string} root
 * @property {string} repoPath
 * @property {string} dir
 * @property {string} modTs
 * @property {string} main
 * @property {string | null} worker
 * @property {string} tsconfig
 * @property {any} manifest
 * @property {string} gameName
 * @property {string} outDir
 */

/**
 * @param {string[]} [argv]
 * @param {{ includeDebugKit?: boolean }} [options]
 * @returns {Promise<LoadedMod[]>}
 */
export async function loadMods(argv = process.argv.slice(2), options = {}) {
  const includeDebugKit = options.includeDebugKit === true;
  const discovered = discoverMods();
  if (discovered.length === 0) {
    throw new Error("No mods found. Add src/<name>/mod.ts or examples/<name>/mod.ts");
  }

  const filters = parseModFilters(argv);
  let selected =
    filters.length > 0 ? discovered.filter((mod) => filters.includes(mod.folder)) : discovered;
  if (filters.length > 0) {
    const unknown = filters.filter((folder) => !discovered.some((mod) => mod.folder === folder));
    if (unknown.length > 0) {
      throw new Error(
        `Unknown --mod ${unknown.map((folder) => JSON.stringify(folder)).join(", ")}. Found: ${discovered.map((m) => m.folder).join(", ")}`,
      );
    }
    if (selected.length === 0) {
      throw new Error(
        `No mods matched --mod. Found: ${discovered.map((m) => m.folder).join(", ")}`,
      );
    }
  }

  if (!includeDebugKit) {
    selected = selected.filter((mod) => mod.folder !== DEBUG_MOD_FOLDER);
    if (selected.length === 0) {
      throw new Error("src/debug is omitted from release builds. Pass --debug or use npm run dev.");
    }
  } else if (
    filters.length > 0 &&
    !filters.includes(DEBUG_MOD_FOLDER) &&
    discovered.some((mod) => mod.folder === DEBUG_MOD_FOLDER)
  ) {
    const debugMod = discovered.find((mod) => mod.folder === DEBUG_MOD_FOLDER);
    if (debugMod && !selected.some((mod) => mod.folder === DEBUG_MOD_FOLDER)) {
      selected = [...selected, debugMod];
    }
  }

  /** @type {LoadedMod[]} */
  const mods = [];
  for (const entry of selected) {
    const { folder, dir, repoPath } = entry;
    const modTs = join(dir, "mod.ts");
    const main = join(dir, "main.ts");
    const workerTs = join(dir, "worker.ts");
    const tsconfig = join(dir, "tsconfig.json");
    if (!existsSync(main)) {
      throw new Error(`${repoPath}/mod.ts needs ${repoPath}/main.ts`);
    }

    const loaded = await bundleAndImport(modTs, `modinfo-${folder}.mjs`);
    const manifest = structuredClone(loaded.modinfo);
    const name = manifest?.name;
    if (typeof name !== "string" || !name.trim()) {
      throw new Error(
        `${repoPath}/mod.ts modinfo.name must be a non-empty string (mods folder name)`,
      );
    }

    const worker = existsSync(workerTs) ? workerTs : null;
    if (worker && typeof manifest.workerEntry !== "string") {
      manifest.workerEntry = "worker.js";
    }

    const gameName = name.trim();
    mods.push({
      folder,
      root: entry.root,
      repoPath,
      dir,
      modTs,
      main,
      worker,
      tsconfig,
      manifest,
      gameName,
      outDir: gameModDir(gameName),
    });
  }
  return mods;
}

/**
 * Create each game mod folder and `dist/<folder>` links.
 * Stale dist links are removed only when that folder is gone, not when `--mod` filters the build.
 * Release builds omit `src/debug` from keepFolders so leftover `mods/debug` is removed.
 * @param {string} repoRoot
 * @param {LoadedMod[]} mods
 * @param {{ includeDebugKit?: boolean }} [options]
 */
export function prepareModOutputs(repoRoot, mods, options = {}) {
  const includeDebugKit = options.includeDebugKit === true;
  const keepFolders = discoverModFolders().filter(
    (folder) => folder !== DEBUG_MOD_FOLDER || includeDebugKit,
  );
  for (const mod of mods) ensureGameModDir(mod.gameName);
  linkRepoDistToModOutputs(repoRoot, mods, keepFolders);
}
