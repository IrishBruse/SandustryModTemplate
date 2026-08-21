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
    if (!value) throw new Error("--mod requires a src folder name (for example --mod=hello-toast-example)");
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
 * @property {string} tsconfig
 * @property {any} manifest
 * @property {string} gameName
 * @property {string} outDir
 */

/**
 * @param {string[]} [argv]
 * @returns {Promise<LoadedMod[]>}
 */
export async function loadMods(argv = process.argv.slice(2)) {
  const folders = discoverModFolders();
  if (folders.length === 0) {
    throw new Error("No mods found. Add src/<name>/mod.ts");
  }

  const filter = parseModFilter(argv);
  const selected = filter ? folders.filter((name) => name === filter) : folders;
  if (filter && selected.length === 0) {
    throw new Error(`Unknown --mod ${JSON.stringify(filter)}. Found: ${folders.join(", ")}`);
  }

  /** @type {LoadedMod[]} */
  const mods = [];
  for (const folder of selected) {
    const dir = join(SRC_DIR, folder);
    const modTs = join(dir, "mod.ts");
    const main = join(dir, "main.ts");
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

    const gameName = name.trim();
    mods.push({
      folder,
      dir,
      modTs,
      main,
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
 * @param {string} repoRoot
 * @param {LoadedMod[]} mods
 */
export function prepareModOutputs(repoRoot, mods) {
  for (const mod of mods) ensureGameModDir(mod.gameName);
  linkRepoDistToModOutputs(repoRoot, mods, discoverModFolders());
}
