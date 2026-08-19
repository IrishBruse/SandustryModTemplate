/**
 * Compile patch files under src/patches/ and src/patches/debug/ to patches.json.
 */
import * as esbuild from "esbuild";
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const PATCHES_PROD_DIR = join(ROOT, "src/patches");
const PATCHES_DEBUG_DIR = join(ROOT, "src/patches/debug");
/** Ephemeral esbuild output — lives under the system temp dir, not the repo. */
export const CACHE_DIR = join(tmpdir(), "sandustry-mod-template");
export const PATCHES_CACHE = join(CACHE_DIR, "patches.js");
export const PATCHES_WATCH_CACHE = join(CACHE_DIR, "patches-watch.js");
export const PATCHES_ENTRY = join(CACHE_DIR, "patches-entry.js");
const JS_PATCH_PATH = /^js\/[^/]+\.js$/;

/** @param {string} dir */
function listPatchFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name.endsWith(".js"))
    .sort()
    .map((name) => join(dir, name));
}

/** @param {boolean} modDebug */
export function patchSourceFiles(modDebug) {
  const files = listPatchFiles(PATCHES_PROD_DIR);
  if (modDebug) files.push(...listPatchFiles(PATCHES_DEBUG_DIR));
  return files;
}

/**
 * Write a bundled entry that imports one patch file per id (filename without .js).
 * @param {boolean} modDebug
 */
export function generatePatchesEntry(modDebug) {
  mkdirSync(CACHE_DIR, { recursive: true });

  const prodFiles = listPatchFiles(PATCHES_PROD_DIR);
  const debugFiles = modDebug ? listPatchFiles(PATCHES_DEBUG_DIR) : [];
  const allFiles = [...prodFiles, ...debugFiles];
  const finalizePath = join(ROOT, "lib/patches/finalize.ts");

  const imports = allFiles.map(
    (file, index) => `import patch_${index} from ${JSON.stringify(file)};`,
  );

  const entries = allFiles.map((file, index) => {
    const id = basename(file, ".js");
    return `  finalizePatch(${JSON.stringify(`${id}.js`)}, patch_${index}),`;
  });

  const content = [
    `import { finalizePatch } from ${JSON.stringify(finalizePath)};`,
    ...imports,
    "",
    "export const patches = [",
    ...entries,
    "];",
    "",
  ].join("\n");

  writeFileSync(PATCHES_ENTRY, content);
}

/** @param {boolean} modDebug */
function patchDefine(modDebug) {
  return { __MOD_DEBUG__: modDebug ? "true" : "false" };
}

/** @param {unknown[]} patches */
function validatePatches(patches) {
  const seen = new Set();

  for (const patch of patches) {
    if (!patch || typeof patch !== "object") {
      throw new Error("Each patch must be an object");
    }

    const { id, file } = patch;
    if (typeof id !== "string" || !id) {
      throw new Error("Each patch must have a string id");
    }
    if (seen.has(id)) {
      throw new Error(`Duplicate patch id "${id}"`);
    }
    seen.add(id);

    if (typeof file !== "string" || !JS_PATCH_PATH.test(file)) {
      throw new Error(
        `Patch "${id}": file must be a relative JavaScript path under js/ (got "${file}")`,
      );
    }
  }
}

/** @returns {import('esbuild').Plugin} */
export function patchSourcesPlugin(modDebug) {
  return {
    name: "patch-sources",
    setup(build) {
      build.onStart(() => {
        generatePatchesEntry(modDebug);
        for (const file of patchSourceFiles(modDebug)) {
          build.watchFiles.add(file);
        }
      });
    },
  };
}

/**
 * @param {string} outDir
 * @param {boolean} [modDebug=false]
 */
export async function buildPatches(outDir, modDebug = false) {
  mkdirSync(dirname(PATCHES_CACHE), { recursive: true });
  mkdirSync(outDir, { recursive: true });
  generatePatchesEntry(modDebug);

  await esbuild.build({
    entryPoints: [PATCHES_ENTRY],
    outfile: PATCHES_CACHE,
    bundle: true,
    platform: "node",
    format: "esm",
    define: patchDefine(modDebug),
    logLevel: "silent",
  });

  const mod = await import(`${pathToFileURL(PATCHES_CACHE).href}?t=${Date.now()}`);
  const patches = mod.patches;

  if (!Array.isArray(patches)) {
    throw new Error("Generated patches entry must export a patches array");
  }

  validatePatches(patches);

  const dest = join(outDir, "patches.json");
  writeFileSync(dest, `${JSON.stringify(patches, null, 2)}\n`);
  console.log(`patches: ${patches.length} -> ${dest}`);

  return patches;
}
