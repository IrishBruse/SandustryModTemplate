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
import { MOD_DIR } from "../sandustry/mod-path.js";
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

const MOD_OUT_DIR = game || watch ? MOD_DIR : join(ROOT, "dist");
const OUT_MAIN = join(MOD_OUT_DIR, "main.js");

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

console.log(`mod output: ${MOD_OUT_DIR}`);
console.log(`main bundle: ${OUT_MAIN}`);
console.log(`mod debug: ${modDebug ? "on" : "off"}`);
console.log(`sourcemap: ${sourcemap ?? "off"}`);
console.log(`hot reload URL: ${embedHotReloadUrl ? hotReloadUrl() : "(none)"}`);

/** Copy static mod files and generate patches.json into the output folder. */
async function syncModFiles() {
  mkdirSync(MOD_OUT_DIR, { recursive: true });
  await writeModinfo(MOD_OUT_DIR, modDebug);
  const modDir = join(ROOT, "mod");
  if (existsSync(modDir)) {
    for (const name of readdirSync(modDir)) {
      if (name === "patches.json") continue;
      cpSync(join(modDir, name), join(MOD_OUT_DIR, name), {
        recursive: true,
        force: true,
      });
    }
  }
  await buildPatches(MOD_OUT_DIR, modDebug);
}

/** @type {{ manifest: any; debugSchema: any } | null} */
let modManifestCache = null;

/** Load mod.ts + framework debug schema via esbuild so the build stays plain Node ESM. */
async function loadModManifestAndDebugSchema() {
  if (modManifestCache) return modManifestCache;
  const [mod, kit] = await Promise.all([
    bundleAndImport(join(ROOT, "mod.ts"), "modinfo.mjs"),
    bundleAndImport(join(MODKIT_DIR, "debug/config-schema.ts"), "modkit-debug-schema.mjs"),
  ]);
  modManifestCache = {
    manifest: structuredClone(mod.modinfo),
    debugSchema: structuredClone(kit.modkitDebugConfigSchema ?? {}),
  };
  return modManifestCache;
}

/** Write modinfo.json — debug builds merge framework debug settings into configSchema. */
async function writeModinfo(outDir, includeDebugSetting) {
  const { manifest, debugSchema } = await loadModManifestAndDebugSchema();
  if (includeDebugSetting && debugSchema && typeof debugSchema === "object") {
    manifest.configSchema = {
      ...manifest.configSchema,
      ...debugSchema,
    };
  }
  writeFileSync(join(outDir, "modinfo.json"), `${JSON.stringify(manifest, null, 2)}\n`);
}

function logBuildResult(result) {
  if (result.errors.length > 0) return;
  console.log(`built to ${MOD_OUT_DIR}`);
}

const { manifest: modManifest } = await loadModManifestAndDebugSchema();

const define = {
  __MOD_DEBUG__: modDebug ? "true" : "false",
  __MOD_ID__: JSON.stringify(typeof modManifest.id === "string" ? modManifest.id : "mod"),
  // SSE server starts only with `--watch`. Embed the URL for watch builds and
  // for one-shot debug builds while that server is already up (`--game` / sandustry).
  __HOT_RELOAD_URL__: embedHotReloadUrl ? JSON.stringify(hotReloadUrl()) : '""',
};

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

/** Stub `./debug` to empty when release builds omit debug helpers. */
function releaseDebugStubPlugin() {
  return {
    name: "release-debug-stub",
    setup(build) {
      if (modDebug) return;
      build.onResolve({ filter: /^\.\/debug$/ }, (args) => {
        // Match both `src/main.ts` and `src\main.ts` (Windows).
        if (!/[\\/]src[\\/]main\.ts$/.test(args.importer)) return;
        return { path: join(ROOT, "modkit/debug/empty.ts") };
      });
    },
  };
}

const basePlugins = [browserPatchesStubPlugin(), modkitAliasPlugin(), releaseDebugStubPlugin()];

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

function maybeRewriteDebugMaps() {
  if (!sourcemap || !existsSync(OUT_MAIN)) return;
  rewriteMainJsDebugMaps(OUT_MAIN);
}

/** @type {import('esbuild').BuildOptions} */
const options = {
  entryPoints: [join(ROOT, "src/main.ts")],
  outfile: OUT_MAIN,
  bundle: true,
  format: "iife",
  platform: "browser",
  target: "es2020",
  sourcemap,
  define,
  // Debug builds: replace bare `console` with modkit/console.ts (file mirror).
  inject: modDebug ? [join(MODKIT_DIR, "console.ts")] : [],
  alias: {
    react: join(ROOT, "modkit/react.ts"),
    "react/jsx-runtime": join(ROOT, "modkit/jsx-runtime.ts"),
    "react/jsx-dev-runtime": join(ROOT, "modkit/jsx-dev-runtime.ts"),
  },
  plugins: basePlugins,
  jsx: "automatic",
  jsxImportSource: "react",
  banner: {
    js: [
      "// Generated — edit src/ and run npm run dev.",
      "// Runs as a plain script via new Function(...). No import/export.",
      "// sandkit is already in scope.",
    ].join("\n"),
  },
  logLevel: "info",
};

/** Scan only files this bundle includes, then compile `@tailwind utilities`. */
async function compileFromBundleGraph() {
  const result = await esbuild.build({
    ...options,
    write: false,
    logLevel: "silent",
    metafile: true,
    plugins: [...basePlugins, stubCssPlugin()],
  });
  return compileTailwindUtilities(bundledContentFiles(result.metafile, ROOT));
}

await syncModFiles();

let tailwindCss = await compileFromBundleGraph();

if (watch) {
  startHotReloadServer();

  const mainCtx = await esbuild.context({
    ...options,
    metafile: true,
    plugins: [
      ...basePlugins,
      cssTextPlugin(() => tailwindCss),
      {
        name: "sync-mod",
        setup(build) {
          build.onEnd(async (result) => {
            if (result.errors.length > 0) return;
            const next = await compileTailwindUtilities(bundledContentFiles(result.metafile, ROOT));
            if (next !== tailwindCss) {
              tailwindCss = next;
              await mainCtx.rebuild();
              return;
            }
            maybeRewriteDebugMaps();
            await syncModFiles();
            notifyHotReload({ changed: ["main.js"] });
            logBuildResult(result);
          });
        },
      },
    ],
  });

  await mainCtx.watch();
  console.log(`watching ${join(ROOT, "src")} -> ${OUT_MAIN}`);
} else {
  const result = await esbuild.build({
    ...options,
    plugins: [...basePlugins, cssTextPlugin(() => tailwindCss)],
  });
  maybeRewriteDebugMaps();
  logBuildResult(result);
}
