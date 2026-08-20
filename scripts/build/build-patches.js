/**
 * Write patches.json from `patches.ts` (`patches` + optional `debugPatches`).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as esbuild from "esbuild";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const FRAMEWORK_DIR = join(ROOT, "framework");
const PATCHES_TS = join(ROOT, "patches.ts");
/** Ephemeral esbuild output — lives under the system temp dir, not the repo. */
export const CACHE_DIR = join(tmpdir(), "sandustry-mod-template");
export const PATCHES_CACHE = join(CACHE_DIR, "patches.mjs");
export const PATCHES_WATCH_CACHE = join(CACHE_DIR, "patches-watch.js");
const JS_PATCH_PATH = /^js\/[^/]+\.js$/;
const OPERATIONS = new Set(["insertBefore", "replace", "wrap"]);

/** Resolve `@framework/...` to `framework/...`. */
function frameworkAliasPlugin() {
  return {
    name: "framework-alias",
    setup(build) {
      build.onResolve({ filter: /^@framework(?:\/|$)/ }, (args) => {
        const rest = args.path === "@framework" ? "" : args.path.slice("@framework/".length);
        return build.resolve(rest === "" ? "." : `./${rest}`, {
          kind: args.kind,
          importer: args.importer,
          resolveDir: FRAMEWORK_DIR,
        });
      });
    },
  };
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

/** Bundle and import root `patches.ts`. */
export async function loadPatchesModule() {
  mkdirSync(CACHE_DIR, { recursive: true });
  await esbuild.build({
    entryPoints: [PATCHES_TS],
    outfile: PATCHES_CACHE,
    bundle: true,
    platform: "node",
    format: "esm",
    plugins: [frameworkAliasPlugin()],
    logLevel: "silent",
  });
  const mod = await import(`${pathToFileURL(PATCHES_CACHE).href}?t=${Date.now()}`);
  return {
    patches: structuredClone(mod.patches ?? []),
    debugPatches: structuredClone(mod.debugPatches ?? []),
  };
}

/**
 * @param {string} outDir
 * @param {boolean} [modDebug=false]
 */
export async function buildPatches(outDir, modDebug = false) {
  mkdirSync(outDir, { recursive: true });

  const { patches: production, debugPatches } = await loadPatchesModule();
  if (!Array.isArray(production)) {
    throw new Error("patches.ts must export a `patches` array");
  }
  if (!Array.isArray(debugPatches)) {
    throw new Error("patches.ts must export a `debugPatches` array");
  }

  const patches = modDebug ? [...production, ...debugPatches] : [...production];
  validatePatches(patches);

  const dest = join(outDir, "patches.json");
  writeFileSync(dest, `${JSON.stringify(patches, null, 2)}\n`);
  const mode = modDebug ? "debug" : "release";
  console.log(`patches: ${patches.length} (${mode}) -> ${dest}`);

  return patches;
}
