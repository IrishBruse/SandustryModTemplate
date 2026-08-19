/**
 * Compile src/patches/index.ts to patches.json in the mod output folder.
 */
import * as esbuild from "esbuild";
import { mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const PATCHES_ENTRY = join(ROOT, "src/patches/index.ts");
/** Ephemeral esbuild output — lives under the system temp dir, not the repo. */
export const CACHE_DIR = join(tmpdir(), "sandustry-mod-template");
export const PATCHES_CACHE = join(CACHE_DIR, "patches.mjs");
export const PATCHES_WATCH_CACHE = join(CACHE_DIR, "patches-watch.mjs");
const JS_PATCH_PATH = /^js\/[^/]+\.js$/;

/** @param {unknown[]} patches */
function validatePatches(patches) {
  for (const patch of patches) {
    if (!patch || typeof patch !== "object") {
      throw new Error("Each patch must be an object");
    }

    const { id, file } = patch;
    if (typeof id !== "string" || !id) {
      throw new Error("Each patch must have a string id");
    }
    if (typeof file !== "string" || !JS_PATCH_PATH.test(file)) {
      throw new Error(
        `Patch "${id}": file must be a relative JavaScript path under js/ (got "${file}")`,
      );
    }
  }
}

/**
 * @param {string} outDir
 */
export async function buildPatches(outDir) {
  mkdirSync(dirname(PATCHES_CACHE), { recursive: true });
  mkdirSync(outDir, { recursive: true });

  await esbuild.build({
    entryPoints: [PATCHES_ENTRY],
    outfile: PATCHES_CACHE,
    bundle: true,
    platform: "node",
    format: "esm",
    logLevel: "silent",
  });

  const mod = await import(`${pathToFileURL(PATCHES_CACHE).href}?t=${Date.now()}`);
  const patches = mod.patches;

  if (!Array.isArray(patches)) {
    throw new Error("src/patches/index.ts must export a patches array");
  }

  validatePatches(patches);

  const dest = join(outDir, "patches.json");
  writeFileSync(dest, `${JSON.stringify(patches, null, 2)}\n`);
  console.log(`patches: ${patches.length} -> ${dest}`);

  return patches;
}
