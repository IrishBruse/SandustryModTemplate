import * as esbuild from "esbuild";
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, normalize } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { buildPatches, bundleAndImport } from "./build-patches.js";
import {
  bundledContentFiles,
  compileTailwindUtilities,
  TAILWIND_CSS_FILTER,
} from "./compile-tailwind.js";
import { loadMods, modIsolationPlugin, prepareModOutputs } from "./mods.js";
import {
  hotReloadUrl,
  isHotReloadServerUp,
  notifyHotReload,
  startHotReloadServer,
} from "./hot-reload-server.js";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const MODKIT_DIR = join(ROOT, "modkit");
const args = process.argv.slice(2);
const watch = args.includes("--watch");
const game = args.includes("--game");
const debugFlag = args.includes("--debug");
const noDebugFlag = args.includes("--no-debug");
const sourcemapFlag = args.includes("--sourcemap");
const noSourcemapFlag = args.includes("--no-sourcemap");

/** @returns {boolean} */
function resolveModDebug() {
  if (noDebugFlag) return false;
  if (debugFlag) return true;
  return watch || game;
}

const modDebug = resolveModDebug();

/**
 * Inline maps for `new Function` eval (external `.map` links do not resolve).
 * Debug builds emit by default; `--sourcemap` / `--no-sourcemap` override.
 * @returns {"inline" | undefined}
 */
function resolveSourcemap() {
  if (noSourcemapFlag) return undefined;
  if (sourcemapFlag || modDebug) return "inline";
  return undefined;
}

const sourcemap = resolveSourcemap();

// Watch always embeds the URL. One-shot `--game` embeds it when
// `npm run dev` is already serving notify (F5 does not build).
const embedHotReloadUrl = watch || (modDebug && (await isHotReloadServerUp()));

const mods = await loadMods(args);
prepareModOutputs(ROOT, mods);

console.log(`mods: ${mods.map((mod) => mod.folder).join(", ")}`);
console.log(`mod debug: ${modDebug ? "on" : "off"}`);
console.log(`sourcemap: ${sourcemap ?? "off"}`);
console.log(`hot reload URL: ${embedHotReloadUrl ? hotReloadUrl() : "(none)"}`);

/** @type {any | null} */
let debugSchemaCache = null;

async function loadDebugSchema() {
  if (debugSchemaCache) return debugSchemaCache;
  const kit = await bundleAndImport(
    join(MODKIT_DIR, "debug/config-schema.ts"),
    "modkit-debug-schema.mjs",
  );
  debugSchemaCache = structuredClone(kit.modkitDebugConfigSchema ?? {});
  return debugSchemaCache;
}

/**
 * Write modinfo.json — debug builds merge framework debug settings into configSchema.
 * @param {import("./mods.js").LoadedMod} mod
 * @param {boolean} includeDebugSetting
 */
async function writeModinfo(mod, includeDebugSetting) {
  const manifest = structuredClone(mod.manifest);
  if (includeDebugSetting) {
    const debugSchema = await loadDebugSchema();
    if (debugSchema && typeof debugSchema === "object") {
      manifest.configSchema = {
        ...manifest.configSchema,
        ...debugSchema,
      };
    }
  }
  writeFileSync(join(mod.outDir, "modinfo.json"), `${JSON.stringify(manifest, null, 2)}\n`);
}

/**
 * Copy static files and write modinfo.json + patches.json.
 * @param {import("./mods.js").LoadedMod} mod
 * @param {boolean} includeModkitDebug
 */
async function syncModFiles(mod, includeModkitDebug) {
  mkdirSync(mod.outDir, { recursive: true });
  await writeModinfo(mod, modDebug);
  const staticDir = join(mod.dir, "mod");
  if (existsSync(staticDir)) {
    for (const name of readdirSync(staticDir)) {
      if (name === "patches.json") continue;
      cpSync(join(staticDir, name), join(mod.outDir, name), {
        recursive: true,
        force: true,
      });
    }
  }
  await buildPatches(mod.outDir, {
    modDebug,
    modTs: mod.modTs,
    cachePrefix: mod.folder,
    includeModkitDebug,
    label: `src/${mod.folder}/mod.ts`,
  });
}

function logBuildResult(mod, result) {
  if (result.errors.length > 0) return;
  console.log(`built ${mod.folder} to ${mod.outDir}`);
}

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
 * Browser bundle must not embed patch payloads if something imports `@modkit/patches`.
 * Build-time `build-patches.js` still resolves the real module.
 */
function browserPatchesStubPlugin() {
  return {
    name: "browser-patches-stub",
    setup(build) {
      build.onResolve({ filter: /^@modkit\/patches$/ }, () => ({
        path: join(MODKIT_DIR, "patches.empty.ts"),
      }));
    },
  };
}

/**
 * Stub `./debug` to empty when release builds omit debug helpers.
 * @param {import("./mods.js").LoadedMod} mod
 */
function releaseDebugStubPlugin(mod) {
  return {
    name: "release-debug-stub",
    setup(build) {
      if (modDebug) return;
      build.onResolve({ filter: /^\.\/debug$/ }, (args) => {
        if (normalize(args.importer) !== normalize(mod.main)) return;
        return { path: join(ROOT, "modkit/debug/empty.ts") };
      });
    },
  };
}

/** Empty CSS so the first graph pass can list bundled sources without a CSS cycle. */
function stubCssPlugin() {
  return {
    name: "tailwind-stub",
    setup(build) {
      build.onLoad({ filter: TAILWIND_CSS_FILTER }, () => ({ contents: "", loader: "text" }));
    },
  };
}

/** @param {() => string} getCss */
function cssTextPlugin(getCss) {
  return {
    name: "tailwind-utilities",
    setup(build) {
      build.onLoad({ filter: TAILWIND_CSS_FILTER }, () => ({
        contents: getCss(),
        loader: "text",
      }));
    },
  };
}

const SOURCE_MAP_DATA_MARKER = "//# sourceMappingURL=data:application/json;base64,";
const SOURCE_URL_RE = /\n\/\/# sourceURL=.*$/;

/**
 * Make inline maps work for VS Code / CDP on `new Function` eval:
 * - absolute `sources` (maps resolve even when the script URL is a VM id)
 * - `sourceURL` pointing at the real `main.js` on disk
 */
function rewriteMainJsDebugMaps(filePath) {
  let code = readFileSync(filePath, "utf8");
  code = code.replace(SOURCE_URL_RE, "");

  const mapIdx = code.lastIndexOf(SOURCE_MAP_DATA_MARKER);
  if (mapIdx < 0) {
    writeFileSync(filePath, `${code}\n//# sourceURL=${pathToFileURL(filePath).href}\n`);
    return;
  }

  const lineEnd = code.indexOf("\n", mapIdx);
  const mapLineEnd = lineEnd === -1 ? code.length : lineEnd;
  const b64 = code.slice(mapIdx + SOURCE_MAP_DATA_MARKER.length, mapLineEnd).trim();

  /** @type {{ sources?: string[]; sourceRoot?: string }} */
  let map;
  try {
    map = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
  } catch {
    return;
  }

  const outDir = dirname(filePath);
  map.sources = (map.sources ?? []).map((source) => {
    if (typeof source !== "string" || source.length === 0) return source;
    if (isAbsolute(source)) return normalize(source);
    return normalize(join(outDir, source));
  });
  delete map.sourceRoot;

  const nextB64 = Buffer.from(JSON.stringify(map)).toString("base64");
  writeFileSync(
    filePath,
    `${code.slice(0, mapIdx)}${SOURCE_MAP_DATA_MARKER}${nextB64}\n//# sourceURL=${pathToFileURL(filePath).href}\n`,
  );
}

/**
 * @param {import("./mods.js").LoadedMod} mod
 */
function maybeRewriteDebugMaps(mod) {
  const outMain = join(mod.outDir, "main.js");
  if (!sourcemap || !existsSync(outMain)) return;
  rewriteMainJsDebugMaps(outMain);
}

/**
 * @param {import("./mods.js").LoadedMod} mod
 */
function bundleOptions(mod) {
  const outMain = join(mod.outDir, "main.js");
  return {
    entryPoints: [mod.main],
    outfile: outMain,
    bundle: true,
    format: "iife",
    platform: "browser",
    target: "es2020",
    sourcemap,
    define: {
      __MOD_DEBUG__: modDebug ? "true" : "false",
      __MOD_ID__: JSON.stringify(typeof mod.manifest.id === "string" ? mod.manifest.id : "mod"),
      __HOT_RELOAD_URL__: embedHotReloadUrl ? JSON.stringify(hotReloadUrl()) : '""',
    },
    inject: modDebug ? [join(MODKIT_DIR, "console.ts")] : [],
    alias: {
      react: join(ROOT, "modkit/react.ts"),
      "react/jsx-runtime": join(ROOT, "modkit/jsx-runtime.ts"),
      "react/jsx-dev-runtime": join(ROOT, "modkit/jsx-dev-runtime.ts"),
    },
    jsx: "automatic",
    jsxImportSource: "react",
    banner: {
      js: [
        `// Generated — edit src/${mod.folder}/ and run npm run dev.`,
        "// Runs as a plain script via new Function(...). No import/export.",
        "// sandkit is already in scope.",
      ].join("\n"),
    },
    logLevel: "info",
  };
}

/**
 * @param {import("./mods.js").LoadedMod} mod
 */
function basePlugins(mod) {
  return [
    modIsolationPlugin(ROOT),
    browserPatchesStubPlugin(),
    modkitAliasPlugin(),
    releaseDebugStubPlugin(mod),
  ];
}

/**
 * @param {import("./mods.js").LoadedMod} mod
 */
async function compileFromBundleGraph(mod) {
  const cssEntry = join(mod.dir, "ui/tailwind.css");
  if (!existsSync(cssEntry)) return "";
  const result = await esbuild.build({
    ...bundleOptions(mod),
    write: false,
    logLevel: "silent",
    metafile: true,
    plugins: [...basePlugins(mod), stubCssPlugin()],
  });
  return compileTailwindUtilities(bundledContentFiles(result.metafile, ROOT), cssEntry);
}

/**
 * @param {import("./mods.js").LoadedMod} mod
 * @param {boolean} includeModkitDebug
 */
async function buildOne(mod, includeModkitDebug) {
  await syncModFiles(mod, includeModkitDebug);
  let tailwindCss = await compileFromBundleGraph(mod);
  const result = await esbuild.build({
    ...bundleOptions(mod),
    plugins: [...basePlugins(mod), cssTextPlugin(() => tailwindCss)],
  });
  maybeRewriteDebugMaps(mod);
  logBuildResult(mod, result);
}

/**
 * @param {import("./mods.js").LoadedMod} mod
 * @param {boolean} includeModkitDebug
 */
async function watchOne(mod, includeModkitDebug) {
  await syncModFiles(mod, includeModkitDebug);
  let tailwindCss = await compileFromBundleGraph(mod);
  const cssEntry = join(mod.dir, "ui/tailwind.css");

  const mainCtx = await esbuild.context({
    ...bundleOptions(mod),
    metafile: true,
    plugins: [
      ...basePlugins(mod),
      cssTextPlugin(() => tailwindCss),
      {
        name: "sync-mod",
        setup(build) {
          build.onEnd(async (result) => {
            if (result.errors.length > 0) return;
            if (existsSync(cssEntry)) {
              const next = await compileTailwindUtilities(
                bundledContentFiles(result.metafile, ROOT),
                cssEntry,
              );
              if (next !== tailwindCss) {
                tailwindCss = next;
                await mainCtx.rebuild();
                return;
              }
            }
            maybeRewriteDebugMaps(mod);
            await syncModFiles(mod, includeModkitDebug);
            notifyHotReload({ changed: ["main.js"] });
            logBuildResult(mod, result);
          });
        },
      },
    ],
  });

  await mainCtx.watch();
  console.log(`watching src/${mod.folder} -> ${join(mod.outDir, "main.js")}`);
}

const kitDebugFolder = mods[0]?.folder;

if (watch) {
  startHotReloadServer();
  for (const mod of mods) {
    await watchOne(mod, modDebug && mod.folder === kitDebugFolder);
  }
} else {
  for (const mod of mods) {
    await buildOne(mod, modDebug && mod.folder === kitDebugFolder);
  }
}
