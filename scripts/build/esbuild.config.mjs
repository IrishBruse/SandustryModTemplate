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
const FRAMEWORK_DIR = join(ROOT, "framework");
const args = process.argv.slice(2);
const watch = args.includes("--watch");
const game = args.includes("--game");
const debugFlag = args.includes("--debug");
const noDebugFlag = args.includes("--no-debug");
const sourcemapFlag = args.includes("--sourcemap");

const MOD_OUT_DIR = game || watch ? MOD_DIR : join(ROOT, "dist");
const OUT_MAIN = join(MOD_OUT_DIR, "main.js");

/** @returns {boolean} */
function resolveModDebug() {
  if (noDebugFlag) return false;
  if (debugFlag) return true;
  return watch || game;
}

const modDebug = resolveModDebug();

console.log(`mod output: ${MOD_OUT_DIR}`);
console.log(`main bundle: ${OUT_MAIN}`);
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
    plugins: [frameworkAliasPlugin()],
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
 * Browser bundle must not embed patch payloads (`globals` imports `modinfo` from `mod.ts`).
 * Build-time `build-patches.js` still resolves the real `@framework/patches`.
 */
function browserPatchesStubPlugin() {
  return {
    name: "browser-patches-stub",
    setup(build) {
      build.onResolve({ filter: /^@framework\/patches$/ }, () => ({
        path: join(FRAMEWORK_DIR, "patches.empty.ts"),
      }));
    },
  };
}

/** @returns {import('esbuild').Plugin} */
function releaseDebugStubPlugin() {
  return {
    name: "release-debug-stub",
    setup(build) {
      if (modDebug) return;
      build.onResolve({ filter: /^\.\/debug$/ }, (args) => {
        if (!args.importer.endsWith(`${join("src", "main.ts")}`)) return;
        return { path: join(ROOT, "framework/debug/empty.ts") };
      });
    },
  };
}

const basePlugins = [browserPatchesStubPlugin(), frameworkAliasPlugin(), releaseDebugStubPlugin()];

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
  alias: {
    react: join(ROOT, "framework/react.ts"),
    "react/jsx-runtime": join(ROOT, "framework/jsx-runtime.ts"),
    "react/jsx-dev-runtime": join(ROOT, "framework/jsx-dev-runtime.ts"),
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

await syncModFiles();

let tailwindCss = await compileFromBundleGraph();

if (watch) {
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
            await syncModFiles();
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
  logBuildResult(result);
}
