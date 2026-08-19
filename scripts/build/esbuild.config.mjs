import * as esbuild from "esbuild";
import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  buildPatches,
  PATCHES_ENTRY,
  PATCHES_WATCH_CACHE,
  patchSourcesPlugin,
} from "./build-patches.js";
import { MOD_DIR } from "../sandustry/mod-path.js";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
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

/** Load modinfo.ts via esbuild so the build script can stay plain Node ESM. */
async function loadModManifest() {
  await esbuild.build({
    entryPoints: [join(ROOT, "modinfo.ts")],
    outfile: MODINFO_CACHE,
    bundle: true,
    platform: "node",
    format: "esm",
    logLevel: "silent",
  });
  const mod = await import(pathToFileURL(MODINFO_CACHE).href);
  return structuredClone(mod.modManifest);
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

/** @returns {import('esbuild').Plugin} */
function releaseDebugStubPlugin() {
  return {
    name: "release-debug-stub",
    setup(build) {
      if (modDebug) return;
      build.onResolve({ filter: /^\.\.[/\\]lib[/\\]debug$/ }, (args) => {
        if (!args.importer.endsWith(`${join("src", "main.tsx")}`)) return;
        return { path: join(ROOT, "lib/debug/empty.ts") };
      });
    },
  };
}

/** @type {import('esbuild').BuildOptions} */
const options = {
  entryPoints: [join(ROOT, "src/main.tsx")],
  outfile: OUT_MAIN,
  bundle: true,
  format: "iife",
  platform: "browser",
  target: "es2020",
  sourcemap,
  define,
  plugins: [releaseDebugStubPlugin()],
  jsx: "transform",
  jsxFactory: "React.createElement",
  jsxFragment: "React.Fragment",
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

if (watch) {
  const mainCtx = await esbuild.context({
    ...options,
    plugins: [
      releaseDebugStubPlugin(),
      {
        name: "sync-mod",
        setup(build) {
          build.onEnd(async (result) => {
            await syncModFiles();
            logBuildResult(result);
          });
        },
      },
    ],
  });

  const patchCtx = await esbuild.context({
    entryPoints: [PATCHES_ENTRY],
    outfile: PATCHES_WATCH_CACHE,
    bundle: true,
    platform: "node",
    format: "esm",
    define,
    logLevel: "silent",
    plugins: [
      patchSourcesPlugin(modDebug),
      {
        name: "emit-patches-json",
        setup(build) {
          build.onEnd(async (result) => {
            if (result.errors.length > 0) return;
            await buildPatches(MOD_OUT_DIR, modDebug);
          });
        },
      },
    ],
  });

  await Promise.all([mainCtx.watch(), patchCtx.watch()]);
  console.log(`watching ${join(ROOT, "src")} -> ${OUT_MAIN}`);
} else {
  const result = await esbuild.build(options);
  logBuildResult(result);
}
