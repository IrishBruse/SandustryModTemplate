/**
 * Sandustry mod output path and repo dist link (symlink / Windows junction).
 * Folder name comes from `modinfo.name` in root `mod.ts`.
 * The game resolves symlinks with realpath and rejects mod folders outside the mods root.
 *
 * Mods dir: Linux ~/.config/sandustry/mods ; Windows %APPDATA%/sandustry/mods
 */
import { existsSync, lstatSync, mkdirSync, readlinkSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as esbuild from "esbuild";
import { linkDirectory, samePath, sandustryModsDir } from "./paths.js";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const MODKIT_DIR = join(ROOT, "modkit");
const MODINFO_CACHE = join(tmpdir(), "sandustry-mod-template-mod-path.mjs");

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

/** @returns {Promise<string>} */
async function loadModFolderName() {
  await esbuild.build({
    entryPoints: [join(ROOT, "mod.ts")],
    outfile: MODINFO_CACHE,
    bundle: true,
    platform: "node",
    format: "esm",
    plugins: [modkitAliasPlugin()],
    logLevel: "silent",
  });

  const mod = await import(`${pathToFileURL(MODINFO_CACHE).href}?t=${Date.now()}`);
  const name = mod.modinfo?.name;
  if (typeof name !== "string" || !name.trim()) {
    throw new Error("mod.ts modinfo.name must be a non-empty string (mods folder name)");
  }
  return name.trim();
}

export const MOD_FOLDER_NAME = await loadModFolderName();
export const MOD_DIR = join(sandustryModsDir(), MOD_FOLDER_NAME);
export const REPO_DIST_LINK = "dist";

export function ensureModDir() {
  mkdirSync(dirname(MOD_DIR), { recursive: true });
  if (existsSync(MOD_DIR) && lstatSync(MOD_DIR).isSymbolicLink()) {
    rmSync(MOD_DIR);
  }
  mkdirSync(MOD_DIR, { recursive: true });
}

/** Link repo/dist -> MOD_DIR so built files are visible in the project tree. */
export function linkRepoDistToModOutput(repoRoot) {
  const linkPath = join(repoRoot, REPO_DIST_LINK);

  if (existsSync(linkPath) && !lstatSync(linkPath).isSymbolicLink()) {
    rmSync(linkPath, { recursive: true, force: true });
    console.log(`Removed local ${REPO_DIST_LINK}/ directory (dev writes to ${MOD_DIR}).`);
  } else if (existsSync(linkPath) && lstatSync(linkPath).isSymbolicLink()) {
    const current = resolve(dirname(linkPath), readlinkSync(linkPath));
    if (samePath(current, MOD_DIR)) return;
    rmSync(linkPath);
  }

  linkDirectory(MOD_DIR, linkPath);
  console.log(`Linked ${REPO_DIST_LINK}/ -> ${MOD_DIR}`);
}
