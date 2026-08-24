import { clearLog } from "@modkit/log";

/**
 * Re-eval `main.js` for a local mod. JavaScript cannot unload.
 * Cleanup comes from optional `onDispose` (kit) and auto-tracked
 * `api.events.on`, `api.ui.inject`, and `api.ui.overlays.register`.
 *
 * Keys must match `src/hot-reload/patches.ts` (`local-mod-compile-reloaded`) and `modkit/internal/debug`.
 */

const EVAL_IDS_KEY = "__sandkitHotReloadEvalIds__";
const ACTIVE_KEY = "__sandkitHotReloadActive__";
const DISPOSE_LISTS_KEY = "__sandkitDisposeLists__";
const TRACK_INJECT_KEY = "__sandkitTrackInjectDispose";

type Host = {
  toastApi: SandkitApi;
  targetSandkit: typeof sandkit | null;
  entry: string;
  reloading: boolean;
};

type HotEvalGlobals = {
  [EVAL_IDS_KEY]?: Set<string>;
  [ACTIVE_KEY]?: string;
  [DISPOSE_LISTS_KEY]?: Record<string, Array<() => void>>;
  [TRACK_INJECT_KEY]?: (modId: string, fn: () => void) => void;
};

const hosts: Record<string, Host> = {};

function globals(): typeof globalThis & HotEvalGlobals {
  return globalThis as typeof globalThis & HotEvalGlobals;
}

function evalIds(): Set<string> {
  const g = globals();
  if (!g[EVAL_IDS_KEY]) g[EVAL_IDS_KEY] = new Set();
  return g[EVAL_IDS_KEY];
}

function disposeLists(): Record<string, Array<() => void>> {
  const g = globals();
  if (!g[DISPOSE_LISTS_KEY]) g[DISPOSE_LISTS_KEY] = {};
  return g[DISPOSE_LISTS_KEY];
}

function setActive(modId: string): void {
  globals()[ACTIVE_KEY] = modId;
}

function ensureHost(modId: string, toastApi?: SandkitApi): Host {
  const existing = hosts[modId];
  if (existing) {
    if (toastApi) existing.toastApi = toastApi;
    return existing;
  }
  const created: Host = {
    toastApi: toastApi ?? sandkit.api,
    targetSandkit: null,
    entry: "main.js",
    reloading: false,
  };
  hosts[modId] = created;
  return created;
}

function toast(api: SandkitApi, message: string): void {
  api.ui.toast(message, {});
}

function cacheBust(url: string): string {
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}hot=${Date.now()}`;
}

function readXhr(url: string): Promise<string | null> {
  return new Promise((resolve) => {
    try {
      const req = new XMLHttpRequest();
      req.open("GET", url);
      req.onload = () => {
        const ok = req.status === 0 || (req.status >= 200 && req.status < 300);
        resolve(ok ? req.responseText : null);
      };
      req.onerror = () => resolve(null);
      req.send();
    } catch {
      resolve(null);
    }
  });
}

/** Read a URL (file:// or http) with cache-bust. */
export function readRemoteText(url: string): Promise<string | null> {
  if (!url) return Promise.resolve(null);
  const busted = cacheBust(url);
  if (url.startsWith("file:") || busted.startsWith("file:")) return readXhr(busted);
  return fetch(busted, { cache: "no-store" })
    .then((response) => (response.ok ? response.text() : null))
    .catch(() => readXhr(busted));
}

/** True when this mod registered cleanup callbacks for hot reload. */
export function hasDisposers(modId: string): boolean {
  return (disposeLists()[modId]?.length ?? 0) > 0;
}

function runDisposers(modId: string): { ran: number; failed: number } {
  const list = disposeLists()[modId] ?? [];
  disposeLists()[modId] = [];
  let ran = 0;
  let failed = 0;
  for (let i = list.length - 1; i >= 0; i--) {
    try {
      list[i]();
      ran++;
    } catch (error) {
      failed++;
      const message = error instanceof Error ? error.message : String(error);
      console.error(`dispose callback failed: ${message}`, error);
    }
  }
  return { ran, failed };
}

/**
 * Match the patched loader wrapper (5 lines before `<source>` so inline maps
 * stay aligned). See `SANDKIT_LOADER_LINE_OFFSET` in `scripts/build/esbuild.config.mjs`.
 */
function runSource(source: string, modId: string, target: typeof sandkit, sourceUrl: string): void {
  const body = `"use strict";
const sandkit = __sandkit;const reloaded=!!(globalThis.${EVAL_IDS_KEY}&&globalThis.${EVAL_IDS_KEY}.has("${modId}"));globalThis.${ACTIVE_KEY}="${modId}";
return (async () => {
${source}
})();
//# sourceURL=${sourceUrl}
`;
  const run = new Function("__sandkit", body) as (sk: typeof sandkit) => unknown;
  void run(target);
}

export function beginHotEval(modId: string): void {
  evalIds().add(modId);
  setActive(modId);
}

export function bindHostSandkit(
  modId: string,
  toastApi: SandkitApi,
  target: typeof sandkit,
  entry: string,
): void {
  const host = ensureHost(modId, toastApi);
  host.toastApi = toastApi;
  host.targetSandkit = target;
  host.entry = entry;
}

export async function reloadRenderer(modId: string, source: string): Promise<void> {
  const host = ensureHost(modId);
  if (host.reloading) return;
  const target = host.targetSandkit;
  if (!target) {
    console.error("hot reload skipped — no sandkit instance");
    return;
  }

  host.reloading = true;
  beginHotEval(modId);

  await clearLog(modId);
  try {
    globalThis.console.clear();
  } catch {
    /* DevTools clear is best-effort */
  }

  const report = runDisposers(modId);
  console.log(`disposed for reload (${report.ran} callback(s), ${report.failed} failed)`);

  const sourceUrl = `sandkit-workshop://${modId}/${host.entry}`;
  try {
    runSource(source, modId, target, sourceUrl);
    toast(host.toastApi, `${modId} reloaded`);
    console.log("hot reloaded");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    toast(host.toastApi, `Reload failed: ${message}`);
    console.error(`hot reload failed: ${message}`, error);
  } finally {
    host.reloading = false;
  }
}

function trackInjectDispose(modId: string, fn: () => void): void {
  if (typeof fn !== "function" || !modId) return;
  const lists = disposeLists();
  if (!lists[modId]) lists[modId] = [];
  lists[modId].push(fn);
}

globals()[TRACK_INJECT_KEY] = trackInjectDispose;
