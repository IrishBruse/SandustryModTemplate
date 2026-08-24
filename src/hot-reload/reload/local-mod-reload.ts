import { onDispose } from "@modkit/debug";
import { beginHotEval, bindHostSandkit, readRemoteText, reloadRenderer } from "./hot-eval";
import { settingOn } from "../boot/settings";
import { modinfo } from "../mod";
import { noteRestartNeeded, probeLoaderPatches, remindRestartIfNeeded } from "./loader-health";

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

function applyMainChange(
  _api: SandkitApi,
  record: LocalModRecord,
  source: string,
): Promise<void> | void {
  return hotEvalMain(_api, record, source);
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
 * in that registry. Watches this companion's `patches.json` / `modinfo.json`
 * (and worker entry) for restart toasts only — never hot-evals its own `main.js`.
 */
export function startLocalModReload(api: SandkitApi): void {
  const tracked = new Map<string, Tracked>();
  let busy = false;
  let probed = false;

  remindRestartIfNeeded(api);

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
    if (!probed) {
      probed = true;
      probeLoaderPatches(api);
    }
    for (const id of Object.keys(records)) {
      const record = records[id];
      if (!record?.rootUrl || !record.sandkit) continue;
      const self = id === modinfo.id;
      if (!self) bindHostSandkit(id, api, record.sandkit, record.entry || "main.js");

      const next = await snapshot(record);
      // Keep the last good snapshot when a poll read fails (rebuild can
      // briefly miss main.js). Dropping it would treat the next read as a
      // baseline and skip the change.
      if (next == null) continue;
      const prev = tracked.get(id);
      if (!prev) {
        tracked.set(id, next);
        continue;
      }

      const entry = record.entry || "main.js";
      for (const file of Object.keys(next.files)) {
        if (file === entry) continue;
        if (prev.files[file] !== undefined && next.files[file] !== prev.files[file]) {
          noteRestartNeeded(api, `${file} changed. Restart the game to apply it.`);
        }
      }
      if (!self && next.files[entry] !== prev.files[entry]) {
        await applyMainChange(api, record, next.files[entry]);
      }
      tracked.set(id, next);
    }
  }
}
