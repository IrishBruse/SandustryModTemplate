import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import {
  repoRoot,
  SANDUSTRY_TEST_HTTP_PORT,
  sandustryTestModsDir,
  sandustryUserDataDir,
} from "./paths.ts";

const HARNESS_ID = "sandustry-test.harness";

type ModInfo = {
  manifestVersion?: number;
  id?: string;
  name?: string;
  version?: string;
  apiVersion?: number;
  entry?: string;
  workerEntry?: string;
  dependencies?: unknown;
  loadOrder?: number;
  map?: unknown;
};

function distModsRoot(): string {
  return join(repoRoot(), "dist");
}

function osModsRoot(): string {
  return join(sandustryUserDataDir(), "mods");
}

function listModIds(root: string): string[] {
  if (!existsSync(root)) return [];
  return readdirSync(root)
    .filter((name) => {
      const dir = join(root, name);
      return statSync(dir).isDirectory() && existsSync(join(dir, "modinfo.json"));
    })
    .sort();
}

/** Copy every built mod from `dist/`, then fill gaps from the OS mods folder. */
export function copyTestMods(): string[] {
  const destRoot = sandustryTestModsDir();
  mkdirSync(destRoot, { recursive: true });
  const copied = new Set<string>();
  for (const sourceRoot of [distModsRoot(), osModsRoot()]) {
    for (const id of listModIds(sourceRoot)) {
      if (copied.has(id)) continue;
      cpSync(join(sourceRoot, id), join(destRoot, id), { recursive: true, force: true });
      copied.add(id);
    }
  }
  return [...copied].sort();
}

function harnessMod(): Record<string, unknown> {
  return {
    manifest: {
      manifestVersion: 1,
      id: HARNESS_ID,
      name: "sandustry-test harness",
      version: "0.0.1",
      apiVersion: 1,
      entry: "main.js",
      dependencies: [],
      loadOrder: 0,
    },
    entrySource: "globalThis.sandkit = sandkit;\n",
    workerSource: null,
    rootUrl: `http://127.0.0.1:${SANDUSTRY_TEST_HTTP_PORT}/`,
    workshop: {
      itemId: null,
      folder: `/sandustry-test/mods/${HARNESS_ID}`,
      discoveredVia: ["local"],
    },
  };
}

function readModRecord(modDir: string, id: string): Record<string, unknown> | null {
  const infoPath = join(modDir, "modinfo.json");
  if (!existsSync(infoPath)) return null;
  let info: ModInfo;
  try {
    info = JSON.parse(readFileSync(infoPath, "utf8")) as ModInfo;
  } catch {
    return null;
  }
  const entry = typeof info.entry === "string" ? info.entry : "main.js";
  const mainPath = join(modDir, entry);
  if (!existsSync(mainPath)) return null;
  const workerEntry = typeof info.workerEntry === "string" ? info.workerEntry : null;
  const workerPath = workerEntry ? join(modDir, workerEntry) : null;
  return {
    manifest: {
      manifestVersion: info.manifestVersion ?? 1,
      id: typeof info.id === "string" ? info.id : id,
      name: typeof info.name === "string" ? info.name : id,
      version: typeof info.version === "string" ? info.version : "0.0.0",
      apiVersion: info.apiVersion ?? 1,
      entry,
      dependencies: Array.isArray(info.dependencies) ? info.dependencies : [],
      loadOrder: typeof info.loadOrder === "number" ? info.loadOrder : 0,
      ...(workerEntry ? { workerEntry } : {}),
      ...(info.map ? { map: info.map } : {}),
    },
    entrySource: readFileSync(mainPath, "utf8"),
    workerSource: workerPath && existsSync(workerPath) ? readFileSync(workerPath, "utf8") : null,
    rootUrl: `http://127.0.0.1:${SANDUSTRY_TEST_HTTP_PORT}/mods/${id}/`,
    workshop: {
      itemId: null,
      folder: `/sandustry-test/mods/${id}`,
      discoveredVia: ["local"],
    },
  };
}

export function listWorkshopMods(): unknown[] {
  const mods: unknown[] = [harnessMod()];
  const destRoot = sandustryTestModsDir();
  if (!existsSync(destRoot)) return mods;
  for (const name of readdirSync(destRoot).sort()) {
    const record = readModRecord(join(destRoot, name), name);
    if (record) mods.push(record);
  }
  return mods;
}

export function companionSettings(modIds: string[]): Record<string, unknown> {
  const externalModSettings: Record<string, Record<string, unknown>> = {};
  for (const id of modIds) {
    externalModSettings[id] = { enabled: true };
  }
  if (modIds.includes("hot-reload")) {
    externalModSettings["hot-reload"] = {
      enabled: true,
      autoLoad: false,
      startSave: "__last__",
      disableAutosave: true,
      watchLocalMods: true,
      fastBoot: true,
      openDevTools: false,
      f12DevTools: false,
      f3Debug: false,
    };
  }
  return {
    settingsVersion: 12,
    windowMode: "windowed",
    autosaveInterval: 0,
    customMaps: { showCustomMaps: true },
    sound: { masterVolume: 0, sfxVolume: 0, musicVolume: 0 },
    externalModSettings,
  };
}
