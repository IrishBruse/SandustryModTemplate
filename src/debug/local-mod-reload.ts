import { onDispose } from "@modkit/debug";
import { safe } from "@modkit/utils";
import {
  beginHotEval,
  bindHostSandkit,
  hasDisposers,
  readRemoteText,
  reloadRenderer,
} from "./hot-eval";
import { modinfo } from "./mod";
import { hotReloadFallback, settingOn } from "./settings";

const POLL_MS = 400;
const RESTART_FILES = ["patches.json", "modinfo.json"] as const;

type LocalModRecord = {
  id: string;
  name?: string;
  rootUrl: string;
  entry: string;
  workerEntry: string | null;
  sandkit: typeof sandkit;
};

type Registry = Record<string, LocalModRecord>;

type Tracked = {
  files: Record<string, string>;
};

declare global {
  interface GlobalThis {
    __sandkitLocalModRegistry__?: Registry;
  }
}

function registry(): Registry {
  return (
    (globalThis as typeof globalThis & { __sandkitLocalModRegistry__?: Registry })
      .__sandkitLocalModRegistry__ ?? {}
  );
}

function joinRoot(rootUrl: string, relative: string): string {
  const base = rootUrl.endsWith("/") ? rootUrl : `${rootUrl}/`;
  return new URL(relative.replace(/^\//, ""), base).href;
}

function displayName(record: LocalModRecord): string {
  return typeof record.name === "string" && record.name.length > 0 ? record.name : record.id;
}

function toast(api: SandkitApi, message: string): void {
  safe(() => api.ui.toast(message, {}));
}

function applyMainFallback(api: SandkitApi, record: LocalModRecord): void {
  const mode = hotReloadFallback(api);
  const name = displayName(record);
  if (mode === "off") {
    console.warn(`[${record.id}] ${name} main.js changed — hot reload skipped (no dispose)`);
    return;
  }
  if (mode === "reload") {
    console.warn(`[${record.id}] ${name} main.js changed — reloading the page`);
    globalThis.location.reload();
    return;
  }
  toast(api, `${name}: main.js changed. No dispose path — restart or reload the page.`);
  console.warn(`[${record.id}] ${name} main.js changed — toast fallback (no dispose)`);
}

async function snapshot(record: LocalModRecord): Promise<Tracked | null> {
  const entry = record.entry || "main.js";
  const main = await readRemoteText(joinRoot(record.rootUrl, entry));
  if (main == null) return null;
  const files: Record<string, string> = { [entry]: main };
  for (const file of RESTART_FILES) {
    const text = await readRemoteText(joinRoot(record.rootUrl, file));
    if (text != null) files[file] = text;
  }
  if (record.workerEntry) {
    const text = await readRemoteText(joinRoot(record.rootUrl, record.workerEntry));
    if (text != null) files[record.workerEntry] = text;
  }
  return { files };
}

async function hotEvalMain(api: SandkitApi, record: LocalModRecord, source: string): Promise<void> {
  bindHostSandkit(record.id, api, record.sandkit, record.entry || "main.js");
  beginHotEval(record.id);
  await reloadRenderer(record.id, source);
}

/**
 * Poll local-mod folders published by the loader patch. Workshop mods are not
 * in that registry. Does not watch this companion (avoids tearing down the poller).
 */
export function startLocalModReload(api: SandkitApi): void {
  const tracked = new Map<string, Tracked>();
  let busy = false;

  const timer = globalThis.setInterval(() => {
    void tick();
  }, POLL_MS);
  onDispose(() => globalThis.clearInterval(timer));
  void tick();

  async function tick(): Promise<void> {
    if (busy) return;
    if (!settingOn(api, "watchLocalMods")) return;
    busy = true;
    try {
      await pollAll();
    } finally {
      busy = false;
    }
  }

  async function pollAll(): Promise<void> {
    const records = registry();
    for (const id of Object.keys(records)) {
      if (id === modinfo.id) continue;
      const record = records[id];
      if (!record?.rootUrl || !record.sandkit) continue;
      bindHostSandkit(id, api, record.sandkit, record.entry || "main.js");

      const next = await snapshot(record);
      if (next == null) {
        tracked.delete(id);
        continue;
      }
      const prev = tracked.get(id);
      if (!prev) {
        tracked.set(id, next);
        continue;
      }

      const entry = record.entry || "main.js";
      for (const file of Object.keys(next.files)) {
        if (file === entry) continue;
        if (prev.files[file] !== undefined && next.files[file] !== prev.files[file]) {
          toast(api, `${file} changed. Restart the game to apply it.`);
          console.warn(`[${id}] ${file} changed — restart the game`);
        }
      }
      if (next.files[entry] !== prev.files[entry]) {
        if (hasDisposers(id)) await hotEvalMain(api, record, next.files[entry]);
        else applyMainFallback(api, record);
      }
      tracked.set(id, next);
    }
  }
}
