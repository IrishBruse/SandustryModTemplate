import * as esbuild from "esbuild";
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildPatches,
  PATCHES_WATCH_CACHE,
} from "./scripts/build-patches.js";

const ROOT = dirname(fileURLToPath(import.meta.url));
const MOD_OUT_DIR = process.env.MOD_OUT_DIR ?? join(ROOT, "dist");
const OUT_MAIN = join(MOD_OUT_DIR, "main.js");
const watch = process.argv.includes("--watch");
const modDebug =
  process.env.MOD_DEBUG === "1" || (watch && process.env.MOD_DEBUG !== "0");

console.log(`mod output: ${MOD_OUT_DIR}`);
console.log(`main bundle: ${OUT_MAIN}`);
console.log(`mod debug: ${modDebug ? "on" : "off"}`);

/** Copy static mod files and generate patches.json into the output folder. */
async function syncModFiles() {
  mkdirSync(MOD_OUT_DIR, { recursive: true });
  writeModinfo(MOD_OUT_DIR, modDebug);
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

/** Write modinfo.json — debug setting is omitted from release builds. */
function writeModinfo(outDir, includeDebugSetting) {
  const manifest = JSON.parse(readFileSync(join(ROOT, "modinfo.json"), "utf8"));
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

const sourcemap =
  process.env.MOD_SOURCEMAP === "1" ? "inline" : undefined;

const define = {
  __MOD_DEBUG__: modDebug ? "true" : "false",
};

/** @returns {import('esbuild').Plugin} */
function releaseDebugStubPlugin() {
  return {
    name: "release-debug-stub",
    setup(build) {
      if (modDebug) return;
      build.onResolve({ filter: /^\.[/\\]debug$/ }, (args) => {
        if (!args.importer.endsWith(`${join("src", "main.tsx")}`)) return;
        return { path: join(ROOT, "src/debug-empty.ts") };
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
    entryPoints: [join(ROOT, "src/patches/index.ts")],
    outfile: PATCHES_WATCH_CACHE,
    bundle: true,
    platform: "node",
    format: "esm",
    define,
    logLevel: "silent",
    plugins: [
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
