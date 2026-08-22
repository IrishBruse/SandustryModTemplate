import * as esbuild from "esbuild";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, isAbsolute, join, normalize } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { buildPatches } from "./build-patches.js";
import {
  bundledContentFiles,
  compileTailwindUtilities,
  TAILWIND_CSS_FILTER,
} from "./compile-tailwind.js";
import { loadMods, modIsolationPlugin, prepareModOutputs, PUBLISH_OUT_ROOT } from "./mods.js";
import { copyWorkshopInstallFiles } from "../sandustry/workshop-files.js";
import { devWatchUrl, notifyHotReload, startHotReloadServer } from "./hot-reload-server.js";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const MODKIT_DIR = join(ROOT, "modkit");
const args = process.argv.slice(2);
const watch = args.includes("--watch");
const game = args.includes("--game");
const debugFlag = args.includes("--debug");
const noDebugFlag = args.includes("--no-debug");
const sourcemapFlag = args.includes("--sourcemap");
const noSourcemapFlag = args.includes("--no-sourcemap");
const publishOut = args.includes("--publish-out");

if (publishOut && (watch || debugFlag || game)) {
  throw new Error(
    "--publish-out is a release staging build. Do not pass --watch, --debug, or --game.",
  );
}

/** @returns {boolean} */
function resolveModDebug() {
  if (publishOut || noDebugFlag) return false;
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

// Watch embeds the dev watch base URL for hot-reload GET polling.
const embedDevWatchUrl = watch;

const mods = await loadMods(args, {
  includeDebugKit: modDebug,
  outRoot: publishOut ? PUBLISH_OUT_ROOT : undefined,
});
if (publishOut) {
  for (const mod of mods) {
    rmSync(mod.outDir, { recursive: true, force: true });
    mkdirSync(mod.outDir, { recursive: true });
  }
} else {
  prepareModOutputs(ROOT, mods, { includeDebugKit: modDebug });
}

console.log(`mods: ${mods.map((mod) => mod.folder).join(", ")}`);
console.log(`mod debug: ${modDebug ? "on" : "off"}`);
console.log(`output: ${publishOut ? ".tmp/publish/<folder>" : "OS mods folder"}`);
console.log(`sourcemap: ${sourcemap ?? "off"}`);
console.log(`dev watch URL: ${embedDevWatchUrl ? devWatchUrl() : "(none)"}`);

/**
 * Write modinfo.json from that mod's `mod.ts`.
 * @param {import("./mods.js").LoadedMod} mod
 */
function writeModinfo(mod) {
  const manifest = structuredClone(mod.manifest);
  writeFileSync(join(mod.outDir, "modinfo.json"), `${JSON.stringify(manifest, null, 2)}\n`);
}

/**
 * Copy static files and write modinfo.json + patches.json.
 * @param {import("./mods.js").LoadedMod} mod
 */
async function syncModFiles(mod) {
  mkdirSync(mod.outDir, { recursive: true });
  writeModinfo(mod);
  copyWorkshopInstallFiles(mod.dir, mod.outDir);
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
  for (const name of ["README.md", "CHANGELOG.md"]) {
    const from = join(mod.dir, name);
    if (!existsSync(from)) continue;
    cpSync(from, join(mod.outDir, name), { force: true });
  }
  await buildPatches(mod.outDir, {
    modDebug,
    modTs: mod.modTs,
    cachePrefix: mod.folder,
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
 * Sandkit loads `main.js` via `new Function("__sandkit", body)` where `body` is:
 *   "use strict";\nconst sandkit = __sandkit;\nreturn (async () => {\n<source>\n})();\n
 * The Function header is two lines, then three body lines — five lines before `<source>`.
 * Hot reload in `modkit/debug/hot-reload.ts` must use the same wrapper.
 */
const SANDKIT_LOADER_LINE_OFFSET = 5;

/**
 * Source-map `sources` must be `file://` URLs. A data: map has no file base, so
 * absolute filesystem paths do not resolve in VS Code / CDP.
 * @param {string} source
 * @param {string} outDir
 */
function toSourceMapFileUrl(source, outDir) {
  if (typeof source !== "string" || source.length === 0) return source;
  if (source.startsWith("file:")) return source;
  const abs = isAbsolute(source) ? normalize(source) : normalize(join(outDir, source));
  return pathToFileURL(abs).href;
}

/**
 * Make inline maps work for VS Code / CDP on sandkit `new Function` eval:
 * - `file://` `sources` (maps resolve when the script URL is `sandkit-workshop://…`)
 * - indexed map offset matching the sandkit loader wrapper
 * - `sourceURL` matching the game (`sandkit-workshop://<modId>/main.js`)
 * @param {string} filePath
 * @param {string} modId
 */
function rewriteMainJsDebugMaps(filePath, modId) {
  let code = readFileSync(filePath, "utf8");
  code = code.replace(SOURCE_URL_RE, "");

  const sourceURL = `sandkit-workshop://${modId}/main.js`;
  const mapIdx = code.lastIndexOf(SOURCE_MAP_DATA_MARKER);
  if (mapIdx < 0) {
    console.warn(`no inline source map in ${filePath}`);
    writeFileSync(filePath, `${code}\n//# sourceURL=${sourceURL}\n`);
    return;
  }

  const lineEnd = code.indexOf("\n", mapIdx);
  const mapLineEnd = lineEnd === -1 ? code.length : lineEnd;
  const b64 = code.slice(mapIdx + SOURCE_MAP_DATA_MARKER.length, mapLineEnd).trim();

  /** @type {{ version?: number; sources?: string[]; sourceRoot?: string; mappings?: string; names?: string[]; sourcesContent?: string[] }} */
  let map;
  try {
    map = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
  } catch {
    console.warn(`invalid inline source map in ${filePath}`);
    return;
  }

  const outDir = dirname(filePath);
  map.sources = (map.sources ?? []).map((source) => toSourceMapFileUrl(source, outDir));
  delete map.sourceRoot;

  /** @type {{ version: number; sections: { offset: { line: number; column: number }; map: typeof map }[] }} */
  const indexed = {
    version: 3,
    sections: [{ offset: { line: SANDKIT_LOADER_LINE_OFFSET, column: 0 }, map }],
  };

  const nextB64 = Buffer.from(JSON.stringify(indexed)).toString("base64");
  writeFileSync(
    filePath,
    `${code.slice(0, mapIdx)}${SOURCE_MAP_DATA_MARKER}${nextB64}\n//# sourceURL=${sourceURL}\n`,
  );
}

/**
 * @param {import("./mods.js").LoadedMod} mod
 */
function maybeRewriteDebugMaps(mod) {
  const outMain = join(mod.outDir, "main.js");
  if (!sourcemap || !existsSync(outMain)) return;
  const modId =
    typeof mod.manifest.id === "string" && mod.manifest.id.length > 0 ? mod.manifest.id : "mod";
  rewriteMainJsDebugMaps(outMain, modId);
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
      __DEV_WATCH_URL__: embedDevWatchUrl ? JSON.stringify(devWatchUrl()) : '""',
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
 * Worker bundle — same IIFE + free `sandkit`, no React / hot-reload inject.
 * @param {import("./mods.js").LoadedMod} mod
 */
function workerBundleOptions(mod) {
  const workerEntry =
    typeof mod.manifest.workerEntry === "string" && mod.manifest.workerEntry.length > 0
      ? mod.manifest.workerEntry
      : "worker.js";
  return {
    entryPoints: [mod.worker],
    outfile: join(mod.outDir, workerEntry),
    bundle: true,
    format: "iife",
    platform: "browser",
    target: "es2020",
    sourcemap,
    define: {
      __MOD_DEBUG__: modDebug ? "true" : "false",
      __MOD_ID__: JSON.stringify(typeof mod.manifest.id === "string" ? mod.manifest.id : "mod"),
      __DEV_WATCH_URL__: '""',
    },
    banner: {
      js: [
        `// Generated — edit src/${mod.folder}/worker.ts and run npm run dev.`,
        "// Worker entry via new Function(...). No import/export.",
        "// sandkit is already in scope (worker-thread api).",
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
 */
async function buildOne(mod) {
  await syncModFiles(mod);
  let tailwindCss = await compileFromBundleGraph(mod);
  const result = await esbuild.build({
    ...bundleOptions(mod),
    plugins: [...basePlugins(mod), cssTextPlugin(() => tailwindCss)],
  });
  maybeRewriteDebugMaps(mod);
  logBuildResult(mod, result);

  if (mod.worker) {
    const workerResult = await esbuild.build({
      ...workerBundleOptions(mod),
      plugins: basePlugins(mod),
    });
    logBuildResult(mod, workerResult);
  }
}

/**
 * @param {import("./mods.js").LoadedMod} mod
 */
async function watchOne(mod) {
  await syncModFiles(mod);
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
            await syncModFiles(mod);
            notifyHotReload({ changed: ["main.js"] });
            logBuildResult(mod, result);
          });
        },
      },
    ],
  });

  await mainCtx.watch();
  console.log(`watching src/${mod.folder} -> ${join(mod.outDir, "main.js")}`);

  if (mod.worker) {
    const workerOut =
      typeof mod.manifest.workerEntry === "string" && mod.manifest.workerEntry.length > 0
        ? mod.manifest.workerEntry
        : "worker.js";
    const workerCtx = await esbuild.context({
      ...workerBundleOptions(mod),
      plugins: [
        ...basePlugins(mod),
        {
          name: "sync-worker",
          setup(build) {
            build.onEnd(async (result) => {
              if (result.errors.length > 0) return;
              await syncModFiles(mod);
              // Worker scripts do not hot-reload — toast asks for a game restart.
              notifyHotReload({ changed: [workerOut] });
              logBuildResult(mod, result);
            });
          },
        },
      ],
    });
    await workerCtx.watch();
    console.log(`watching src/${mod.folder} -> ${join(mod.outDir, workerOut)}`);
  }
}

if (watch) {
  startHotReloadServer();
  for (const mod of mods) {
    await watchOne(mod);
  }
} else {
  for (const mod of mods) {
    await buildOne(mod);
  }
}
