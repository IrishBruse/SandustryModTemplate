import { createRequire } from "node:module";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { sandustryTestModsDir } from "./paths.ts";

type PatchResult = {
  patch: { id: string; file: string; expectedMatches: number; modId?: string };
  applied: boolean;
  actualMatches?: number;
  reason?: string;
};

type ApplyPatchSet = (
  sources: Map<string, string>,
  patches: unknown[],
) => { sources: Map<string, string>; results: PatchResult[] };

/** Stash per-mod sandkit and sync electron mod settings before the first main eval. */
/** Keep the companion stash patch shape; settings sync is handled in the test host boot flag. */
const TEST_HOST_STASH_AND_SYNC =
  "const t=we(e,{manifest:o,discovered:r});(globalThis.__sandkitByMod||(globalThis.__sandkitByMod={}))[o.id]=t;e.store.integrity.modsUsed=!0,await c(t)";

/** Drop the companion stash patch when the test host replaces it with settings sync. */
const TEST_HOST_PATCHES: Array<Record<string, unknown>> = [
  {
    id: "test-host-stash-sandkit-by-mod",
    file: "js/external-mod-runtime.js",
    find: "const t=we(e,{manifest:o,discovered:r});e.store.integrity.modsUsed=!0,await c(t)",
    operation: "replace",
    code: TEST_HOST_STASH_AND_SYNC,
    expectedMatches: 1,
  },
];

function withTestHostPatches(patches: unknown[]): unknown[] {
  const filtered = patches.filter(
    (patch) => (patch as { id?: string }).id !== "stash-sandkit-by-mod",
  );
  return [...filtered, ...TEST_HOST_PATCHES];
}

function workshopModsModule(distDir: string): { applyPatchSet: ApplyPatchSet } | null {
  const candidate = join(dirname(distDir), "workshop-mods.js");
  if (!existsSync(candidate)) return null;
  const require = createRequire(import.meta.url);
  return require(candidate) as { applyPatchSet: ApplyPatchSet };
}

/** Read every `patches.json` under the isolated test mods folder. */
export function collectTestHostPatches(modsDir = sandustryTestModsDir()): unknown[] {
  if (!existsSync(modsDir)) return [];
  const patches: unknown[] = [];
  const seenIds = new Set<string>();
  for (const name of readdirSync(modsDir).sort()) {
    const modDir = join(modsDir, name);
    if (!statSync(modDir).isDirectory()) continue;
    const patchesPath = join(modDir, "patches.json");
    if (!existsSync(patchesPath)) continue;
    const parsed = JSON.parse(readFileSync(patchesPath, "utf8")) as unknown;
    if (!Array.isArray(parsed)) continue;
    const modId = readModId(modDir) ?? name;
    for (const entry of parsed) {
      if (!entry || typeof entry !== "object") continue;
      const patch = entry as { id?: unknown; modId?: unknown };
      const id = typeof patch.id === "string" ? patch.id : null;
      // Identical sample patches (collector-element + collector-patches) share ids.
      // Applying both in one set merges empty-modId atomic groups and rolls them back.
      if (id && seenIds.has(id)) continue;
      if (id) seenIds.add(id);
      patches.push({ ...patch, modId: typeof patch.modId === "string" ? patch.modId : modId });
    }
  }
  return patches;
}

function readModId(modDir: string): string | null {
  const infoPath = join(modDir, "modinfo.json");
  if (!existsSync(infoPath)) return null;
  try {
    const info = JSON.parse(readFileSync(infoPath, "utf8")) as { id?: unknown };
    return typeof info.id === "string" ? info.id : null;
  } catch {
    return null;
  }
}

/**
 * Apply test-mod patches to extracted dist JS the same way Electron main does
 * before the renderer loads. Returns normalized `js/...` paths.
 */
export function buildPatchedDistSources(
  distDir: string,
  options?: { modsDir?: string; patches?: unknown[] },
): Map<string, string> {
  const patches = withTestHostPatches(options?.patches ?? collectTestHostPatches(options?.modsDir));
  if (patches.length === 0) return new Map();

  const workshop = workshopModsModule(distDir);
  if (!workshop) {
    throw new Error(`workshop-mods.js not found beside ${distDir}`);
  }

  const targetFiles = new Set<string>();
  for (const patch of patches) {
    const file = (patch as { file?: unknown })?.file;
    if (typeof file === "string" && file.startsWith("js/")) targetFiles.add(file);
  }

  const sources = new Map<string, string>();
  for (const file of targetFiles) {
    const filePath = join(distDir, ...file.split("/"));
    sources.set(file, readFileSync(filePath, "utf8"));
  }

  const prepared = workshop.applyPatchSet(sources, patches);
  const out = new Map<string, string>();
  for (const [file, content] of prepared.sources) {
    out.set(file, content);
  }

  for (const result of prepared.results) {
    if (result.applied) continue;
    const label = result.patch.modId ? `${result.patch.modId}:${result.patch.id}` : result.patch.id;
    const detail =
      result.reason === "match_count_mismatch"
        ? `expected ${result.patch.expectedMatches}, found ${result.actualMatches ?? 0}`
        : (result.reason ?? "unknown");
    console.warn(`Integration host patch skipped ${label} on ${result.patch.file}: ${detail}`);
  }

  return out;
}
