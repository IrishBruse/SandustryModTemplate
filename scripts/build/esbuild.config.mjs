import * as esbuild from "esbuild";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, isAbsolute, join, normalize } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { buildPatches } from "../lib/build-patches.js";
import { kv, styleText } from "../lib/cli-style.js";
import {
  bundledContentFiles,
  compileTailwindUtilities,
  findTailwindCssEntry,
  TAILWIND_CSS_FILTER,
} from "../lib/compile-tailwind.js";
import { loadMods, modIsolationPlugin, prepareModOutputs, PUBLISH_OUT_ROOT } from "../lib/mods.js";
import { copyWorkshopInstallFiles, removeWorkshopPublishFiles } from "../lib/workshop-files.js";
import { devWatchUrl, notifyHotReload, startHotReloadServer } from "../dev/hot-reload-server.js";

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

console.log(
  kv("mods", mods.map((mod) => styleText("bold", mod.folder)).join(styleText("dim", ", "))),
);
console.log(kv("mod debug", modDebug ? styleText("green", "on") : styleText("dim", "off")));
console.log(kv("output", publishOut ? "build/<folder>" : "OS mods folder"));
console.log(kv("sourcemap", sourcemap ?? styleText("dim", "off")));

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
  removeWorkshopPublishFiles(mod.outDir);
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
    label: `src/${mod.folder}/mod.ts`,
  });
}

function logBuildResult(mod, result) {
  if (result.errors.length > 0) return;
  console.log(
    `${styleText("green", "built")} ${styleText("bold", mod.folder)} ${styleText("dim", `to ${mod.outDir}`)}`,
  );
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
        path: join(MODKIT_DIR, "esbuild/patches.empty.ts"),
      }));
    },
  };
}

/**
 * Stub `@modkit/debug` to empty when release builds omit debug helpers.
 * Must run before `modkitAliasPlugin` so the stub wins.
 */
function releaseDebugStubPlugin() {
  return {
    name: "release-debug-stub",
    setup(build) {
      if (modDebug) return;
      build.onResolve({ filter: /^@modkit\/debug$/ }, () => ({
        path: join(MODKIT_DIR, "esbuild/debug.empty.ts"),
      }));
    },
  };
}

/** Empty CSS so the first graph pass can list bundled sources without a CSS cycle. */
function stubCssPlugin() {
  return {
    name: "tailwind-stub",
    setup(build) {
      build.onLoad({ filter: TAILWIND_CSS_FILTER }, (args) => ({
        contents: "",
        loader: "text",
        watchFiles: [args.path],
      }));
    },
  };
}

/** @param {() => string} getCss */
function cssTextPlugin(getCss) {
  return {
    name: "tailwind-utilities",
    setup(build) {
      build.onLoad({ filter: TAILWIND_CSS_FILTER }, (args) => ({
        contents: getCss(),
        loader: "text",
        watchFiles: [args.path],
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
 * @param {import("../lib/mods.js").LoadedMod} mod
 */
function maybeRewriteDebugMaps(mod) {
  const outMain = join(mod.outDir, "main.js");
  if (!sourcemap || !existsSync(outMain)) return;
  rewriteMainJsDebugMaps(outMain, manifestModId(mod));
}

/**
 * @param {import("../lib/mods.js").LoadedMod} mod
 * @returns {string}
 */
function manifestModId(mod) {
  return typeof mod.manifest.id === "string" && mod.manifest.id.length > 0
    ? mod.manifest.id
    : "mod";
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
      __MOD_ID__: JSON.stringify(manifestModId(mod)),
      __DEV_WATCH_URL__: embedDevWatchUrl ? JSON.stringify(devWatchUrl()) : '""',
    },
    inject: [
      join(MODKIT_DIR, "esbuild/hot-reload.inject.ts"),
      ...(modDebug ? [join(MODKIT_DIR, "esbuild/console.ts")] : []),
    ],
    alias: {
      react: join(ROOT, "modkit/esbuild/react.ts"),
      "react/jsx-runtime": join(ROOT, "modkit/esbuild/jsx-runtime.ts"),
      "react/jsx-dev-runtime": join(ROOT, "modkit/esbuild/jsx-dev-runtime.ts"),
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
 * Debug builds still inject `console.ts` so logs get the `[modId]` prefix.
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
      __MOD_ID__: JSON.stringify(manifestModId(mod)),
      __DEV_WATCH_URL__: '""',
    },
    inject: modDebug ? [join(MODKIT_DIR, "esbuild/console.ts")] : [],
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
    releaseDebugStubPlugin(),
    modkitAliasPlugin(),
    mainEntryBootstrapPlugin(mod),
  ];
}

/**
 * esbuild `watchDirs` is not recursive. List every folder so `mod.ts`, new
 * files, and kit edits still trigger a rebuild.
 * @param {string} root
 * @param {string[]} [skipNames]
 * @returns {string[]}
 */
function collectWatchDirs(root, skipNames = []) {
  const skip = new Set(["node_modules", ".git", ...skipNames]);
  /** @type {string[]} */
  const dirs = [];
  const walk = (dir) => {
    dirs.push(dir);
    let names;
    try {
      names = readdirSync(dir);
    } catch {
      return;
    }
    for (const name of names) {
      if (skip.has(name)) continue;
      const next = join(dir, name);
      try {
        if (statSync(next).isDirectory()) walk(next);
      } catch {
        /* removed while walking */
      }
    }
  };
  if (existsSync(root)) walk(root);
  return dirs;
}

/**
 * Main entry only (workers skip this):
 * - Skip the entry body when `api.settings.get("enabled")` is false (`isEnabled`)
 * - Keep the hot-reload inject in the graph via `void reloaded` even when a
 *   mod never reads that binding
 *
 * Uses an `if` wrap (not top-level `return`) because entries with `import` are
 * ESM and reject top-level return.
 * @param {import("./mods.js").LoadedMod} mod
 */
function mainEntryBootstrapPlugin(mod) {
  const mainPath = normalize(mod.main);
  return {
    name: "main-entry-bootstrap",
    setup(build) {
      build.onLoad({ filter: /\.[cm]?tsx?$/ }, (args) => {
        if (normalize(args.path) !== mainPath) return;
        const source = readFileSync(args.path, "utf8");
        const loader = args.path.endsWith(".tsx") ? "tsx" : "ts";
        const { imports, body } = splitLeadingImports(source);
        return {
          contents: [
            imports,
            `import { isEnabled } from "@modkit/utils";`,
            `void reloaded;`,
            `if (isEnabled(sandkit.api)) {`,
            body,
            `}`,
          ]
            .filter((part) => part.length > 0)
            .join("\n"),
          loader,
          watchFiles: [args.path, mod.modTs],
          watchDirs: [
            ...collectWatchDirs(mod.dir),
            ...collectWatchDirs(MODKIT_DIR, ["types"]),
          ],
        };
      });
    },
  };
}

/**
 * Pull leading `import` statements so the enabled gate can wrap the rest of
 * the entry (imports must stay top-level in ESM).
 * @param {string} source
 */
function splitLeadingImports(source) {
  const match = source.match(
    /^((?:\s*import\s+(?:type\s+)?(?:[\s\S]*?from\s*)?["'][^"']+["']\s*;\s*)+)/,
  );
  if (!match) return { imports: "", body: source };
  return {
    imports: match[1].trim(),
    body: source.slice(match[1].length).trimStart(),
  };
}

/**
 * @param {import("./mods.js").LoadedMod} mod
 */
async function compileFromBundleGraph(mod) {
  const result = await esbuild.build({
    ...bundleOptions(mod),
    write: false,
    logLevel: "silent",
    metafile: true,
    plugins: [...basePlugins(mod), stubCssPlugin()],
  });
  const cssEntry = findTailwindCssEntry(result.metafile, ROOT);
  if (!cssEntry) return "";
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
  const modId = manifestModId(mod);
  /** @type {ReturnType<typeof setTimeout> | null} */
  let cssRebuildTimer = null;

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

            const queueCssRebuild = () => {
              if (cssRebuildTimer != null) clearTimeout(cssRebuildTimer);
              cssRebuildTimer = setTimeout(() => {
                cssRebuildTimer = null;
                void mainCtx.rebuild();
              }, 0);
            };

            const cssEntry = findTailwindCssEntry(result.metafile, ROOT);
            if (cssEntry) {
              const next = await compileTailwindUtilities(
                bundledContentFiles(result.metafile, ROOT),
                cssEntry,
              );
              if (next !== tailwindCss) {
                tailwindCss = next;
                queueCssRebuild();
                return;
              }
            } else if (tailwindCss) {
              tailwindCss = "";
              queueCssRebuild();
              return;
            }

            maybeRewriteDebugMaps(mod);
            await syncModFiles(mod);
            notifyHotReload({ changed: ["main.js"], modIds: [modId] });
            logBuildResult(mod, result);
          });
        },
      },
    ],
  });

  await mainCtx.watch({ delay: 10 });

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
              notifyHotReload({ changed: [workerOut], modIds: [modId] });
              logBuildResult(mod, result);
            });
          },
        },
      ],
    });
    await workerCtx.watch({ delay: 10 });
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
