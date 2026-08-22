/**
 * Discover `src/<name>/mod.ts` folders and load each manifest.
 * Optional `--mod <folder>` (or `--mod=<folder>`) selects one.
 */
import { existsSync, readdirSync, statSync } from "node:fs";
import { dirname, isAbsolute, join, normalize, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { bundleAndImport } from "./build-patches.js";
import { ensureGameModDir, gameModDir, linkRepoDistToModOutputs } from "../sandustry/mod-path.js";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const SRC_DIR = join(ROOT, "src");

/** Companion mod folder. Debug builds install it; release builds omit it. */
export const DEBUG_MOD_FOLDER = "debug";

/**
 * Src-folder name for a path under `src/<name>/...`, or null when outside.
 * @param {string | undefined} filePath
 * @param {string} [root]
 * @returns {string | null}
 */
export function srcModFolder(filePath, root = ROOT) {
  if (!filePath) return null;
  const srcRoot = join(root, "src");
  const rel = relative(srcRoot, normalize(filePath));
  if (!rel || rel.startsWith("..") || isAbsolute(rel)) return null;
  const name = rel.split(/[\\/]/)[0];
  return name || null;
}

/**
 * Fail the bundle when one `src/<name>/` file imports another mod's tree.
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
        const fromMod = srcModFolder(args.importer, root);
        const toMod = srcModFolder(result.path, root);
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

/** @returns {string[]} Sorted folder names that contain `mod.ts`. */
export function discoverModFolders() {
  if (!existsSync(SRC_DIR)) return [];
  return readdirSync(SRC_DIR)
    .filter((name) => {
      const dir = join(SRC_DIR, name);
      return statSync(dir).isDirectory() && existsSync(join(dir, "mod.ts"));
    })
    .sort();
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
      throw new Error("--mod requires a src folder name (for example --mod hello-toast-example)");
    }
    return value;
  }
  const eq = argv.find((arg) => arg.startsWith("--mod="));
  if (eq) {
    const value = eq.slice("--mod=".length).trim();
    if (!value)
      throw new Error("--mod requires a src folder name (for example --mod=hello-toast-example)");
    return value;
  }
  return null;
}

/**
 * @typedef {object} LoadedMod
 * @property {string} folder
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
  const folders = discoverModFolders();
  if (folders.length === 0) {
    throw new Error("No mods found. Add src/<name>/mod.ts");
  }

  const filter = parseModFilter(argv);
  let selected = filter ? folders.filter((name) => name === filter) : folders;
  if (filter && selected.length === 0) {
    throw new Error(`Unknown --mod ${JSON.stringify(filter)}. Found: ${folders.join(", ")}`);
  }

  if (!includeDebugKit) {
    selected = selected.filter((name) => name !== DEBUG_MOD_FOLDER);
    if (selected.length === 0) {
      throw new Error("src/debug is omitted from release builds");
    }
  } else if (filter && filter !== DEBUG_MOD_FOLDER && folders.includes(DEBUG_MOD_FOLDER)) {
    selected = [...selected, DEBUG_MOD_FOLDER];
  }

  /** @type {LoadedMod[]} */
  const mods = [];
  for (const folder of selected) {
    const dir = join(SRC_DIR, folder);
    const modTs = join(dir, "mod.ts");
    const main = join(dir, "main.ts");
    const workerTs = join(dir, "worker.ts");
    const tsconfig = join(dir, "tsconfig.json");
    if (!existsSync(main)) {
      throw new Error(`src/${folder}/mod.ts needs src/${folder}/main.ts`);
    }

    const loaded = await bundleAndImport(modTs, `modinfo-${folder}.mjs`);
    const manifest = structuredClone(loaded.modinfo);
    const name = manifest?.name;
    if (typeof name !== "string" || !name.trim()) {
      throw new Error(
        `src/${folder}/mod.ts modinfo.name must be a non-empty string (mods folder name)`,
      );
    }

    const worker = existsSync(workerTs) ? workerTs : null;
    if (worker && typeof manifest.workerEntry !== "string") {
      manifest.workerEntry = "worker.js";
    }

    const gameName = name.trim();
    mods.push({
      folder,
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
 * Stale dist links are removed only when that src folder is gone, not when `--mod` filters the build.
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
