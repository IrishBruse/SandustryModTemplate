/**
 * Load mod manifests from `modinfo.json` or `modinfo.ts`, and patches from
 * `patches.json`, `patches.ts`, or exports on `modinfo.ts`.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { bundleAndImport } from "./build-patches.js";
import { stripJsonSchema } from "./json-schemas.js";

/** @param {string} dir */
export function hasModManifest(dir) {
  return existsSync(join(dir, "modinfo.json")) || existsSync(join(dir, "modinfo.ts"));
}

/**
 * Repo-relative manifest path for error messages.
 * @param {string} repoPath
 * @param {"json" | "ts"} source
 */
export function manifestLabel(repoPath, source) {
  return `${repoPath}/modinfo.${source}`;
}

/**
 * @param {string} dir
 * @returns {"json" | "ts" | null}
 */
export function modManifestSource(dir) {
  if (existsSync(join(dir, "modinfo.ts"))) return "ts";
  if (existsSync(join(dir, "modinfo.json"))) return "json";
  return null;
}

/**
 * @param {string} dir
 * @returns {string | null}
 */
export function modManifestPath(dir) {
  const source = modManifestSource(dir);
  if (source === "ts") return join(dir, "modinfo.ts");
  if (source === "json") return join(dir, "modinfo.json");
  return null;
}

/**
 * @param {string} dir
 */
export function readModinfoJsonManifest(dir) {
  const path = join(dir, "modinfo.json");
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Cannot parse ${path}: ${message}`);
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`${path} must contain a JSON object`);
  }
  return stripJsonSchema(parsed);
}

/**
 * Load `modinfo` and optional patch exports for one mod folder.
 *
 * Manifest: `modinfo.ts` wins when both `modinfo.ts` and `modinfo.json` exist.
 * Patches: `modinfo.ts` / `patches.ts` exports win when present; otherwise
 * `patches.json`.
 *
 * @param {string} dir
 * @param {string} cachePrefix
 * @param {string} label
 */
export async function loadModManifestExports(dir, cachePrefix, label) {
  const modTs = join(dir, "modinfo.ts");
  const patchesTs = join(dir, "patches.ts");
  const patchesJson = join(dir, "patches.json");

  /** @type {{ modinfo: unknown, patches?: unknown, debugPatches?: unknown }} */
  let loaded;
  if (existsSync(modTs)) {
    const modModule = await bundleAndImport(modTs, `${cachePrefix}-modinfo.mjs`);
    loaded = {
      modinfo: modModule.modinfo,
      patches: modModule.patches,
      debugPatches: modModule.debugPatches,
    };
  } else {
    loaded = { modinfo: readModinfoJsonManifest(dir) };
  }

  if (loaded.patches == null && loaded.debugPatches == null) {
    if (existsSync(patchesTs)) {
      const patchModule = await bundleAndImport(patchesTs, `${cachePrefix}-patches.mjs`);
      loaded = {
        ...loaded,
        patches: patchModule.patches ?? loaded.patches,
        debugPatches: patchModule.debugPatches ?? loaded.debugPatches,
      };
    } else if (existsSync(patchesJson)) {
      loaded = {
        ...loaded,
        patches: readPatchesJsonManifest(patchesJson),
      };
    }
  }

  if (loaded.patches != null && !Array.isArray(loaded.patches)) {
    throw new Error(`${label} patches must be a JSON array`);
  }
  if (loaded.debugPatches != null && !Array.isArray(loaded.debugPatches)) {
    throw new Error(`${label} debugPatches must be an array when exported from patches.ts`);
  }

  return loaded;
}

/**
 * @param {string} path
 */
export function readPatchesJsonManifest(path) {
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Cannot parse ${path}: ${message}`);
  }
  if (!Array.isArray(parsed)) {
    throw new Error(`${path} must contain a JSON array`);
  }
  return parsed;
}
