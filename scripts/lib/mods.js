/**
 * Discover `src/<name>/mod.ts` and `examples/<name>/mod.ts` folders and load each manifest.
 * Optional `--mod <folder>` (or `--mod=<folder>`) selects one.
 */
import { existsSync, readdirSync, statSync } from "node:fs";
import { dirname, isAbsolute, join, normalize, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { bundleAndImport } from "./build-patches.js";
import { ensureGameModDir, gameModDir, linkRepoDistToModOutputs } from "./mod-path.js";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

/** Mod source roots relative to the repo root. */
export const MOD_ROOTS = ["src", "examples"];

/** Companion mod folder. Debug builds install it; release builds omit it. */
export const DEBUG_MOD_FOLDER = "debug";

/** Staging root for `npm run build:release` / `npm run publish` — not `dist/` or the OS mods folder. */
export const PUBLISH_OUT_ROOT = join(ROOT, "build");

/** @param {string} folder Mod folder name (under `src/` or `examples/`) */
export function publishStagingDir(folder) {
  return join(PUBLISH_OUT_ROOT, folder);
}

/**
 * Mod-folder name for a path under `src/<name>/...` or `examples/<name>/...`, or null when outside.
 * @param {string | undefined} filePath
 * @param {string} [root]
 * @returns {string | null}
 */
export function modFolderFromPath(filePath, root = ROOT) {
  if (!filePath) return null;
  const path = normalize(filePath);
  for (const modRoot of MOD_ROOTS) {
    const base = join(root, modRoot);
    const rel = relative(base, path);
    if (!rel || rel.startsWith("..") || isAbsolute(rel)) continue;
    const name = rel.split(/[\\/]/)[0];
    if (name) return name;
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
 * @property {string} folder
 * @property {string} root `src` or `examples`
 * @property {string} dir Absolute path to the mod folder
 */

/**
 * @returns {DiscoveredMod[]} Sorted by folder name.
 */
export function discoverMods() {
  /** @type {DiscoveredMod[]} */
  const mods = [];
  /** @type {Map<string, string>} */
  const seen = new Map();

  for (const root of MOD_ROOTS) {
    const rootDir = join(ROOT, root);
    if (!existsSync(rootDir)) continue;
    for (const name of readdirSync(rootDir)) {
      const dir = join(rootDir, name);
      if (!statSync(dir).isDirectory() || !existsSync(join(dir, "mod.ts"))) continue;
      const prior = seen.get(name);
      if (prior) {
        throw new Error(
          `Duplicate mod folder name "${name}" in ${prior}/ and ${root}/. Folder names must be unique across mod roots.`,
        );
      }
      seen.set(name, root);
      mods.push({ folder: name, root, dir });
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
 * @returns {string | null}
 */
export function parseModFilter(argv) {
  const flag = argv.indexOf("--mod");
  if (flag >= 0) {
    const value = argv[flag + 1];
    if (!value || value.startsWith("-")) {
      throw new Error("--mod requires a folder name (for example --mod hello-world)");
    }
    return value;
  }
  const eq = argv.find((arg) => arg.startsWith("--mod="));
  if (eq) {
    const value = eq.slice("--mod=".length).trim();
    if (!value) throw new Error("--mod requires a folder name (for example --mod=hello-world)");
    return value;
  }
  return null;
}

/**
 * @typedef {object} LoadedMod
 * @property {string} folder
 * @property {string} root
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
 * @param {{ includeDebugKit?: boolean; outRoot?: string }} [options]
 * @returns {Promise<LoadedMod[]>}
 */
export async function loadMods(argv = process.argv.slice(2), options = {}) {
  const includeDebugKit = options.includeDebugKit === true;
  const outRoot =
    typeof options.outRoot === "string" && options.outRoot.trim() ? options.outRoot : null;
  const discovered = discoverMods();
  if (discovered.length === 0) {
    throw new Error("No mods found. Add src/<name>/mod.ts or examples/<name>/mod.ts");
  }

  const filter = parseModFilter(argv);
  let selected = filter ? discovered.filter((mod) => mod.folder === filter) : discovered;
  if (filter && selected.length === 0) {
    throw new Error(
      `Unknown --mod ${JSON.stringify(filter)}. Found: ${discovered.map((m) => m.folder).join(", ")}`,
    );
  }

  if (!includeDebugKit) {
    selected = selected.filter((mod) => mod.folder !== DEBUG_MOD_FOLDER);
    if (selected.length === 0) {
      throw new Error("src/debug is omitted from release builds");
    }
  } else if (
    filter &&
    filter !== DEBUG_MOD_FOLDER &&
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
    const { folder, root, dir } = entry;
    const modTs = join(dir, "mod.ts");
    const main = join(dir, "main.ts");
    const workerTs = join(dir, "worker.ts");
    const tsconfig = join(dir, "tsconfig.json");
    if (!existsSync(main)) {
      throw new Error(`${root}/${folder}/mod.ts needs ${root}/${folder}/main.ts`);
    }

    const loaded = await bundleAndImport(modTs, `modinfo-${folder}.mjs`);
    const manifest = structuredClone(loaded.modinfo);
    const name = manifest?.name;
    if (typeof name !== "string" || !name.trim()) {
      throw new Error(
        `${root}/${folder}/mod.ts modinfo.name must be a non-empty string (mods folder name)`,
      );
    }

    const worker = existsSync(workerTs) ? workerTs : null;
    if (worker && typeof manifest.workerEntry !== "string") {
      manifest.workerEntry = "worker.js";
    }

    const gameName = name.trim();
    mods.push({
      folder,
      root,
      dir,
      modTs,
      main,
      worker,
      tsconfig,
      manifest,
      gameName,
      outDir: outRoot ? join(outRoot, folder) : gameModDir(gameName),
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
