/**
 * Compile patch files to patches.json.
 *
 * Each `*.js` file is raw injected source. Leading `// @key value` comments
 * set file, find, and expectedMatches. The filename (without .js) is the id.
 *
 * Production: framework/patches, src/patches
 * Debug: framework/patches/debug, src/patches/debug
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const PATCHES_PROD_DIRS = [join(ROOT, "framework/patches"), join(ROOT, "src/patches")];
const PATCHES_DEBUG_DIRS = [
  join(ROOT, "framework/patches/debug"),
  join(ROOT, "src/patches/debug"),
];
/** Ephemeral esbuild output — lives under the system temp dir, not the repo. */
export const CACHE_DIR = join(tmpdir(), "sandustry-mod-template");
export const PATCHES_WATCH_CACHE = join(CACHE_DIR, "patches-watch.js");
export const PATCHES_ENTRY = join(CACHE_DIR, "patches-entry.js");
const JS_PATCH_PATH = /^js\/[^/]+\.js$/;
const META_LINE = /^\/\/\s*@([A-Za-z][A-Za-z0-9]*)\s+(.*)$/;
const OPERATIONS = new Set(["insertBefore", "replace", "wrap"]);

/** @param {string} dir */
function listPatchFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name.endsWith(".js"))
    .sort()
    .map((name) => join(dir, name));
}

/** @param {string[]} dirs */
function listPatchFilesFrom(dirs) {
  return dirs.flatMap(listPatchFiles);
}

/** @param {string[]} files */
function assertUniquePatchIds(files) {
  /** @type {Map<string, string>} */
  const byId = new Map();
  for (const file of files) {
    const id = basename(file, ".js");
    const existing = byId.get(id);
    if (existing) {
      throw new Error(`Duplicate patch id "${id}":\n  ${existing}\n  ${file}`);
    }
    byId.set(id, file);
  }
}

/** @param {boolean} modDebug */
export function patchSourceFiles(modDebug) {
  const files = listPatchFilesFrom(PATCHES_PROD_DIRS);
  if (modDebug) files.push(...listPatchFilesFrom(PATCHES_DEBUG_DIRS));
  return files;
}

/** Write a dummy module so esbuild can watch patch files. */
export function writePatchWatchStub() {
  mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(PATCHES_ENTRY, "export {};\n");
}

/**
 * @param {string} source
 * @param {string} id
 */
function parsePatchSource(source, id) {
  const lines = source.split(/\r?\n/);
  /** @type {Record<string, string>} */
  const meta = {};
  let index = 0;

  while (index < lines.length) {
    const trimmed = lines[index].trim();
    if (trimmed === "") {
      index += 1;
      continue;
    }
    const match = trimmed.match(META_LINE);
    if (!match) break;
    const [, key, value] = match;
    if (Object.hasOwn(meta, key)) {
      throw new Error(`Patch "${id}": duplicate @${key}`);
    }
    meta[key] = value.trimEnd();
    index += 1;
  }

  const code = lines.slice(index).join("\n").replace(/^\n+/, "").replace(/\s+$/, "");
  const file = meta.file;
  const operation = meta.operation ?? "replace";
  const expectedRaw = meta.expectedMatches;
  const expectedMatches = expectedRaw === undefined ? Number.NaN : Number(expectedRaw);

  if (!file) throw new Error(`Patch "${id}": missing // @file`);
  if (!JS_PATCH_PATH.test(file)) {
    throw new Error(`Patch "${id}": @file must be a relative JavaScript path under js/ (got "${file}")`);
  }
  if (!OPERATIONS.has(operation)) {
    throw new Error(`Patch "${id}": @operation must be insertBefore, replace, or wrap (got "${operation}")`);
  }
  if (!Number.isInteger(expectedMatches)) {
    throw new Error(`Patch "${id}": missing or invalid // @expectedMatches`);
  }
  if (Boolean(meta.find) === Boolean(meta.regex)) {
    throw new Error(`Patch "${id}": set exactly one of // @find or // @regex`);
  }

  /** @type {Record<string, unknown>} */
  const patch = { id, file, operation, expectedMatches };

  if (meta.find) patch.find = meta.find;
  if (meta.regex) {
    patch.regex = meta.regexFlags
      ? { pattern: meta.regex, flags: meta.regexFlags }
      : { pattern: meta.regex };
  }
  if (meta.atomicGroup) patch.atomicGroup = meta.atomicGroup;

  if (operation === "wrap") {
    if (!meta.before || !meta.after) {
      throw new Error(`Patch "${id}": wrap requires // @before and // @after`);
    }
    patch.before = meta.before;
    patch.after = meta.after;
  } else {
    if (!code) throw new Error(`Patch "${id}": file body is empty (it becomes the code field)`);
    patch.code = code;
  }

  return patch;
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
        writePatchWatchStub();
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
export function buildPatches(outDir, modDebug = false) {
  mkdirSync(outDir, { recursive: true });

  const files = patchSourceFiles(modDebug);
  assertUniquePatchIds(files);

  const patches = files.map((file) => {
    const id = basename(file, ".js");
    const source = readFileSync(file, "utf8");
    return parsePatchSource(source, id);
  });

  validatePatches(patches);

  const dest = join(outDir, "patches.json");
  writeFileSync(dest, `${JSON.stringify(patches, null, 2)}\n`);
  const mode = modDebug ? "debug" : "release";
  console.log(`patches: ${patches.length} (${mode}) -> ${dest}`);

  return patches;
}
