import * as esbuild from "esbuild";
import { cpSync, existsSync, mkdirSync, readdirSync } from "node:fs";
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

console.log(`mod output: ${MOD_OUT_DIR}`);
console.log(`main bundle: ${OUT_MAIN}`);

/** Copy static mod files and generate patches.json into the output folder. */
async function syncModFiles() {
  mkdirSync(MOD_OUT_DIR, { recursive: true });
  cpSync(join(ROOT, "modinfo.json"), join(MOD_OUT_DIR, "modinfo.json"));
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
  await buildPatches(MOD_OUT_DIR);
}

function logBuildResult(result) {
  if (result.errors.length > 0) return;
  console.log(`built to ${MOD_OUT_DIR}`);
}

const sourcemap =
  process.env.MOD_SOURCEMAP === "1" ? "inline" : undefined;

/** @type {import('esbuild').BuildOptions} */
const options = {
  entryPoints: [join(ROOT, "src/main.tsx")],
  outfile: OUT_MAIN,
  bundle: true,
  format: "iife",
  platform: "browser",
  target: "es2020",
  sourcemap,
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
    logLevel: "silent",
    plugins: [
      {
        name: "emit-patches-json",
        setup(build) {
          build.onEnd(async (result) => {
            if (result.errors.length > 0) return;
            await buildPatches(MOD_OUT_DIR);
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
