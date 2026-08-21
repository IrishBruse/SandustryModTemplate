/**
 * Write patches.json from a mod's `mod.ts` (`patches` + optional `debugPatches`).
 * Debug builds can also merge `modkitDebugPatches` from the framework (once).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as esbuild from "esbuild";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const MODKIT_DIR = join(ROOT, "modkit");
/** Ephemeral esbuild output — lives under the system temp dir, not the repo. */
export const CACHE_DIR = join(tmpdir(), "sandustry-mod-template");
const JS_PATCH_PATH = /^js\/[^/]+\.js$/;
const OPERATIONS = new Set(["insertBefore", "replace", "wrap"]);

/** Resolve `@modkit/...` to `modkit/...`. */
function modkitAliasPlugin() {
  return {
    name: "modkit-alias",
    setup(build) {
      build.onResolve({ filter: /^@modkit(?:\/|$)/ }, (args) => {
        const rest = args.path === "@modkit" ? "" : args.path.slice("@modkit/".length);
        return build.resolve(rest === "" ? "." : `./${rest}`, {
          kind: args.kind,
          importer: args.importer,
          resolveDir: MODKIT_DIR,
        });
      });
    },
  };
}

/**
 * Bundle a TypeScript entry and import it as Node ESM.
 * @param {string} entryPoint
 * @param {string} cacheName
 */
export async function bundleAndImport(entryPoint, cacheName) {
  mkdirSync(CACHE_DIR, { recursive: true });
  const outfile = join(CACHE_DIR, cacheName);
  await esbuild.build({
    entryPoints: [entryPoint],
    outfile,
    bundle: true,
    platform: "node",
    format: "esm",
    plugins: [modkitAliasPlugin()],
    logLevel: "silent",
  });
  return import(`${pathToFileURL(outfile).href}?t=${Date.now()}`);
}

/**
 * @param {unknown} patch
 * @param {string} label
 */
function assertPatch(patch, label) {
  if (!patch || typeof patch !== "object") {
    throw new Error(`${label}: each patch must be an object`);
  }

  const { id, file, operation, expectedMatches } = /** @type {Record<string, unknown>} */ (patch);

  if (typeof id !== "string" || !id) {
    throw new Error(`${label}: each patch must have a string id`);
  }
  if (typeof file !== "string" || !JS_PATCH_PATH.test(file)) {
    throw new Error(
      `Patch "${id}": file must be a relative JavaScript path under js/ (got ${JSON.stringify(file)})`,
    );
  }
  if (typeof operation !== "string" || !OPERATIONS.has(operation)) {
    throw new Error(
      `Patch "${id}": operation must be insertBefore, replace, or wrap (got ${JSON.stringify(operation)})`,
    );
  }
  if (!Number.isInteger(expectedMatches)) {
    throw new Error(`Patch "${id}": expectedMatches must be an integer`);
  }

  const hasFind = typeof patch.find === "string" && patch.find.length > 0;
  const hasRegex = patch.regex != null && typeof patch.regex === "object";
  if (hasFind === hasRegex) {
    throw new Error(`Patch "${id}": set exactly one of find or regex`);
  }

  if (operation === "wrap") {
    if (typeof patch.before !== "string" || typeof patch.after !== "string") {
      throw new Error(`Patch "${id}": wrap requires before and after strings`);
    }
  } else if (typeof patch.code !== "string" || !patch.code) {
    throw new Error(`Patch "${id}": ${operation} requires a non-empty code string`);
  }
}

/** @param {unknown[]} patches */
function validatePatches(patches) {
  const seen = new Set();

  for (const [index, patch] of patches.entries()) {
    assertPatch(patch, `patches[${index}]`);
    const id = /** @type {{ id: string }} */ (patch).id;
    if (seen.has(id)) {
      throw new Error(`Duplicate patch id "${id}"`);
    }
    seen.add(id);
  }
}

/**
 * @param {string} outDir
 * @param {{
 *   modDebug?: boolean;
 *   modTs: string;
 *   cachePrefix: string;
 *   includeModkitDebug?: boolean;
 *   label?: string;
 * }} options
 */
export async function buildPatches(outDir, options) {
  const {
    modDebug = false,
    modTs,
    cachePrefix,
    includeModkitDebug = false,
    label = "mod.ts",
  } = options;
  mkdirSync(outDir, { recursive: true });

  const [mod, kit] = await Promise.all([
    bundleAndImport(modTs, `${cachePrefix}-patches.mjs`),
    bundleAndImport(join(MODKIT_DIR, "patches.ts"), "modkit-patches.mjs"),
  ]);
  const production = structuredClone(mod.patches ?? []);
  const debugPatches = structuredClone(mod.debugPatches ?? []);
  const modkitDebugPatches = structuredClone(kit.modkitDebugPatches ?? []);

  if (!Array.isArray(production)) {
    throw new Error(`${label} must export a \`patches\` array`);
  }
  if (mod.debugPatches != null && !Array.isArray(mod.debugPatches)) {
    throw new Error(`${label} \`debugPatches\` must be an array when exported`);
  }
  if (!Array.isArray(modkitDebugPatches)) {
    throw new Error("modkit/patches.ts must export a `modkitDebugPatches` array");
  }

  const patches = modDebug
    ? [...production, ...(includeModkitDebug ? modkitDebugPatches : []), ...(debugPatches ?? [])]
    : [...production];
  validatePatches(patches);

  const dest = join(outDir, "patches.json");
  writeFileSync(dest, `${JSON.stringify(patches, null, 2)}\n`);
  const mode = modDebug ? "debug" : "release";
  console.log(`patches: ${patches.length} (${mode}) -> ${dest}`);

  return patches;
}
