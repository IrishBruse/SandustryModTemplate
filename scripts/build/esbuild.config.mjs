import * as esbuild from "esbuild";
import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { buildPatches } from "./build-patches.js";
import {
  bundledContentFiles,
  compileTailwindUtilities,
  TAILWIND_CSS_FILTER,
} from "./compile-tailwind.js";
import { MOD_DIR } from "../sandustry/mod-path.js";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const MODKIT_DIR = join(ROOT, "modkit");
const args = process.argv.slice(2);
const watch = args.includes("--watch");
const game = args.includes("--game");
const debugFlag = args.includes("--debug");
const noDebugFlag = args.includes("--no-debug");
const sourcemapFlag = args.includes("--sourcemap");

const MOD_OUT_DIR = game || watch ? MOD_DIR : join(ROOT, "dist");
const OUT_MAIN = join(MOD_OUT_DIR, "main.js");
const OUT_MODKIT = join(MOD_OUT_DIR, "modkit", "index.js");
const MODKIT_ASSET = "modkit/index.js";

/** @returns {boolean} */
function resolveModDebug() {
  if (noDebugFlag) return false;
  if (debugFlag) return true;
  return watch || game;
}

const modDebug = resolveModDebug();

console.log(`mod output: ${MOD_OUT_DIR}`);
console.log(`main bundle: ${OUT_MAIN}`);
console.log(`modkit bundle: ${OUT_MODKIT}`);
console.log(`mod debug: ${modDebug ? "on" : "off"}`);

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

const MODINFO_CACHE = join(tmpdir(), "sandustry-mod-template-modinfo.mjs");

/** Load mod.ts via esbuild so the build script can stay plain Node ESM. */
async function loadModManifest() {
  await esbuild.build({
    entryPoints: [join(ROOT, "mod.ts")],
    outfile: MODINFO_CACHE,
    bundle: true,
    platform: "node",
    format: "esm",
    plugins: [modkitAliasPlugin()],
    logLevel: "silent",
  });
  const mod = await import(pathToFileURL(MODINFO_CACHE).href);
  return structuredClone(mod.modinfo);
}

/** Write modinfo.json — debug setting is omitted from release builds. */
async function writeModinfo(outDir, includeDebugSetting) {
  const manifest = await loadModManifest();
  if (!includeDebugSetting && manifest.configSchema?.debug) {
    const { debug: _debug, ...rest } = manifest.configSchema;
    manifest.configSchema = rest;
  }
  writeFileSync(join(outDir, "modinfo.json"), `${JSON.stringify(manifest, null, 2)}\n`);
}

function logBuildResult(result) {
  if (result.errors.length > 0) return;
  console.log(`built to ${MOD_OUT_DIR}`);
}

const sourcemap = sourcemapFlag ? "inline" : undefined;

const define = {
  __MOD_DEBUG__: modDebug ? "true" : "false",
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
 * Browser bundle must not embed patch payloads (`globals` imports `modinfo` from `mod.ts`).
 * Build-time `build-patches.js` still resolves the real `@modkit/patches`.
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
        const importer = args.importer.replace(/\\/g, "/");
        if (!importer.endsWith("/src/main.ts") && !importer.endsWith("/modkit/browser.ts")) {
          return;
        }
        return { path: join(ROOT, "modkit/debug/empty.ts") };
      });
    },
  };
}

/**
 * Map `@modkit/*` and `react` imports in `main.js` to `globalThis.__modkit`
 * (filled by `modkit/index.js`).
 */
function modkitGlobalPlugin() {
  /** @type {Record<string, string>} */
  const namespaces = {
    "@modkit/sandkit": "sandkit",
    "@modkit/sdk": "sdk",
    "@modkit/debug": "debug",
    "@modkit/ui": "ui",
    react: "react",
    "react/jsx-runtime": "jsxRuntime",
    "react/jsx-dev-runtime": "jsxDevRuntime",
  };

  return {
    name: "modkit-global",
    setup(build) {
      build.onResolve({ filter: /.*/ }, (args) => {
        const key = namespaces[args.path];
        if (!key) return;
        return { path: args.path, namespace: "modkit-global", pluginData: { key } };
      });
      build.onLoad({ filter: /.*/, namespace: "modkit-global" }, (args) => ({
        contents: `module.exports = globalThis.__modkit[${JSON.stringify(args.pluginData.key)}];`,
        loader: "js",
      }));
    },
  };
}

/** Sync-load `modkit/index.js` before the main IIFE (Sandkit only evaluates `main.js`). */
const loadModkitBanner = [
  "// Generated — edit src/ and run npm run dev.",
  "// Runs as a plain script via new Function(...). No import/export.",
  "// sandkit is already in scope.",
  "// Loads dist/modkit/index.js into globalThis.__modkit when missing.",
  `(function (sk) {`,
  `  if (globalThis.__modkit) return;`,
  `  var url = sk.api.assets.getUrl(${JSON.stringify(MODKIT_ASSET)});`,
  `  var req = new XMLHttpRequest();`,
  `  req.open("GET", url, false);`,
  `  req.send(null);`,
  `  var ok = req.status === 0 || (req.status >= 200 && req.status < 300);`,
  `  if (!ok) throw new Error("Failed to load ${MODKIT_ASSET}: HTTP " + req.status);`,
  `  (new Function("sandkit", req.responseText))(sk);`,
  `  if (!globalThis.__modkit) throw new Error("${MODKIT_ASSET} did not install globalThis.__modkit");`,
  `})(sandkit);`,
].join("\n");

const reactAliases = {
  react: join(ROOT, "modkit/react.ts"),
  "react/jsx-runtime": join(ROOT, "modkit/jsx-runtime.ts"),
  "react/jsx-dev-runtime": join(ROOT, "modkit/jsx-dev-runtime.ts"),
};

const sharedBrowserOptions = {
  bundle: true,
  format: "iife",
  platform: "browser",
  target: "es2020",
  sourcemap,
  define,
  jsx: "automatic",
  jsxImportSource: "react",
  logLevel: "info",
};

/** @type {import('esbuild').BuildOptions} */
const modkitOptions = {
  ...sharedBrowserOptions,
  entryPoints: [join(ROOT, "modkit/browser.ts")],
  outfile: OUT_MODKIT,
  alias: reactAliases,
  plugins: [modkitAliasPlugin(), releaseDebugStubPlugin()],
  banner: {
    js: [
      "// Generated modkit — edit modkit/ and run npm run dev.",
      "// Loaded from main.js into globalThis.__modkit. sandkit is in scope.",
    ].join("\n"),
  },
};

/** @type {import('esbuild').BuildOptions} */
const mainOptions = {
  ...sharedBrowserOptions,
  entryPoints: [join(ROOT, "src/main.ts")],
  outfile: OUT_MAIN,
  plugins: [browserPatchesStubPlugin(), modkitGlobalPlugin(), releaseDebugStubPlugin()],
  banner: { js: loadModkitBanner },
};

/** Full graph (mod + modkit) for Tailwind content — not the split emit. */
const tailwindScanOptions = {
  ...sharedBrowserOptions,
  entryPoints: [join(ROOT, "src/main.ts")],
  outfile: OUT_MAIN,
  write: false,
  logLevel: "silent",
  metafile: true,
  alias: reactAliases,
  plugins: [browserPatchesStubPlugin(), modkitAliasPlugin(), releaseDebugStubPlugin()],
};

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

/** Scan files a full main+modkit bundle includes, then compile `@tailwind utilities`. */
async function compileFromBundleGraph() {
  const result = await esbuild.build({
    ...tailwindScanOptions,
    plugins: [...tailwindScanOptions.plugins, stubCssPlugin()],
  });
  return compileTailwindUtilities(bundledContentFiles(result.metafile, ROOT));
}

/**
 * @param {string} css
 * @returns {Promise<import('esbuild').BuildResult[]>}
 */
async function buildOnce(css) {
  mkdirSync(dirname(OUT_MODKIT), { recursive: true });
  const kit = await esbuild.build(modkitOptions);
  const main = await esbuild.build({
    ...mainOptions,
    plugins: [...mainOptions.plugins, cssTextPlugin(() => css)],
  });
  return [kit, main];
}

await syncModFiles();

let tailwindCss = await compileFromBundleGraph();

if (watch) {
  mkdirSync(dirname(OUT_MODKIT), { recursive: true });

  const kitCtx = await esbuild.context(modkitOptions);
  const mainCtx = await esbuild.context({
    ...mainOptions,
    metafile: true,
    plugins: [
      ...mainOptions.plugins,
      cssTextPlugin(() => tailwindCss),
      {
        name: "sync-mod",
        setup(build) {
          build.onEnd(async (result) => {
            if (result.errors.length > 0) return;
            const scan = await esbuild.build({
              ...tailwindScanOptions,
              plugins: [...tailwindScanOptions.plugins, stubCssPlugin()],
            });
            const next = await compileTailwindUtilities(bundledContentFiles(scan.metafile, ROOT));
            if (next !== tailwindCss) {
              tailwindCss = next;
              await mainCtx.rebuild();
              return;
            }
            await syncModFiles();
            logBuildResult(result);
          });
        },
      },
    ],
  });

  await kitCtx.watch();
  await mainCtx.watch();
  console.log(`watching src/ + modkit/ -> ${OUT_MAIN} + ${OUT_MODKIT}`);
} else {
  const results = await buildOnce(tailwindCss);
  for (const result of results) logBuildResult(result);
}
