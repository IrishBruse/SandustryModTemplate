import { clearLog } from "../log";
import { safe } from "../utils";

/**
 * Renderer hot reload for official Sandkit mods.
 *
 * JavaScript cannot be unloaded. This module reclaims what the mod registered
 * through {@link onDispose}. A monkey-patch or a trigger with no unregister
 * path stays in place until the game restarts.
 *
 * Notify channel: `npm run dev` (--watch) serves GET /hot-reload/last on
 * `127.0.0.1:19147`. The client polls that endpoint; when `n` changes it
 * reads `main.js` once and reloads. One path for normal dev and F5.
 *
 * Stages (honest, as in SandLoader):
 * - `renderer` — build notify for `main.js`: dispose, then evaluate the new
 *   source.
 * - `restart` — `patches.json`, `modinfo.json`, or a declared `workerEntry`
 *   changed: tell the player to restart. This loader cannot rebuild patches
 *   or workers.
 */

declare const __DEV_WATCH_URL__: string;

const MAIN_ENTRY = "main.js";
const RESTART_FILES = ["patches.json", "modinfo.json"] as const;
const POLL_MS = 400;
const FETCH_TIMEOUT_MS = 2000;
const NOTIFY_PATH = "/hot-reload/last";
/** Written by F5 / `sandustry:vscode` (`sandustryDebugEnv`). */
const IDE_DEBUG_MARKER = "ide-debug.json";

type Host = {
  modId: string;
  api: SandkitApi;
  entry: string;
  installed: boolean;
  reloading: boolean;
  disposers: Array<() => void>;
  sources: Record<string, string>;
  pollTimer: ReturnType<typeof setInterval> | null;
  /** Last `n` from GET /hot-reload/last. Null until the first successful read. */
  notifyN: number | null;
  /** Null until `ide-debug.json` has been probed. */
  ideDebug: boolean | null;
};

type GlobalHotReload = {
  __sandkitHotReloadHosts__?: Record<string, Host>;
  __sandkitHotReloadActive__?: string;
};

type NotifyPayload = {
  v?: number;
  n?: number;
  changed?: string[];
  /** Re-run main.js even when the file bytes match the last load (Ctrl+R in `npm run dev`). */
  force?: boolean;
};

function globals(): typeof globalThis & GlobalHotReload {
  return globalThis as typeof globalThis & GlobalHotReload;
}

function hostMap(): Record<string, Host> {
  const g = globals();
  if (!g.__sandkitHotReloadHosts__) g.__sandkitHotReloadHosts__ = {};
  return g.__sandkitHotReloadHosts__;
}

function getHost(modId: string): Host | undefined {
  return hostMap()[modId];
}

function setActive(modId: string): void {
  globals().__sandkitHotReloadActive__ = modId;
}

function activeModId(): string | undefined {
  return globals().__sandkitHotReloadActive__;
}

function devWatchUrl(): string {
  return typeof __DEV_WATCH_URL__ === "string" ? __DEV_WATCH_URL__ : "";
}

function ensureHost(modId: string, api?: SandkitApi): Host {
  const existing = getHost(modId);
  if (existing) {
    if (api) existing.api = api;
    return existing;
  }

  const created: Host = {
    modId,
    api: api ?? sandkit.api,
    entry: MAIN_ENTRY,
    installed: false,
    reloading: false,
    disposers: [],
    sources: {},
    pollTimer: null,
    notifyN: null,
    ideDebug: null,
  };
  hostMap()[modId] = created;
  return created;
}

function toast(api: SandkitApi, message: string): void {
  safe(() => api.ui.toast(message, {}));
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

async function readAsset(api: SandkitApi, relativePath: string): Promise<string | null> {
  let url: string;
  try {
    url = api.assets.getUrl(relativePath);
  } catch {
    return null;
  }
  if (!url) return null;

  const busted = cacheBust(url);
  try {
    const response = await fetch(busted, { cache: "no-store" });
    if (response.ok) return await response.text();
    // A completed 404 must not fall through to XHR — that logs twice.
    return null;
  } catch {
    // Electron file URLs often reject fetch; XHR still works.
  }
  return readXhr(busted);
}

async function fetchNotify(): Promise<(NotifyPayload & { n: number }) | null> {
  const base = devWatchUrl();
  if (!base) return null;

  const controller = new AbortController();
  const timer = globalThis.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(`${base}${NOTIFY_PATH}`, {
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) return null;
    const parsed = (await response.json()) as NotifyPayload;
    if (typeof parsed.n !== "number" || !Number.isFinite(parsed.n)) return null;
    return { ...parsed, n: parsed.n };
  } catch {
    return null;
  } finally {
    globalThis.clearTimeout(timer);
  }
}

/**
 * True when this script body is running because a hot reload evaluated a new
 * `main.js`. Use this to skip one-shot boot work (DevTools, splash skip).
 */
export function isHotReloadEval(modId: string): boolean {
  return getHost(modId)?.installed === true;
}

/**
 * Register cleanup that runs before a renderer hot reload.
 * Release builds stub this to a no-op (import from `./debug`, not this file).
 */
export function onDispose(fn: () => void): () => void {
  if (typeof fn !== "function") return () => {};

  const modId = activeModId();
  const host = modId ? ensureHost(modId) : null;
  if (!host) return () => {};

  host.disposers.push(fn);
  return () => {
    const index = host.disposers.indexOf(fn);
    if (index >= 0) host.disposers.splice(index, 1);
  };
}

function disposeRegistered(host: Host): { ran: number; failed: number } {
  let ran = 0;
  let failed = 0;
  for (let i = host.disposers.length - 1; i >= 0; i--) {
    try {
      host.disposers[i]();
      ran++;
    } catch (error) {
      failed++;
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[${host.modId}] dispose callback failed: ${message}`, error);
    }
  }
  host.disposers.length = 0;
  return { ran, failed };
}

/**
 * Match sandkit's loader wrapper so inline source maps (offset by 5 lines at
 * build time) stay aligned after a hot reload. See `SANDKIT_LOADER_LINE_OFFSET`
 * in `scripts/build/esbuild.config.mjs`.
 */
function runSource(source: string, modId: string): void {
  const body = `"use strict";
const sandkit = __sandkit;
return (async () => {
${source}
})();
//# sourceURL=sandkit-workshop://${modId}/main.js
`;
  const run = new Function("__sandkit", body) as (sk: typeof sandkit) => unknown;
  void run(sandkit);
}

function workerEntryPath(modinfo: string | undefined): string | null {
  if (!modinfo) return null;
  try {
    const parsed = JSON.parse(modinfo) as { workerEntry?: unknown };
    return typeof parsed.workerEntry === "string" && parsed.workerEntry.length > 0
      ? parsed.workerEntry
      : null;
  } catch {
    return null;
  }
}

function modDisplayName(host: Host): string {
  const modinfo = host.sources["modinfo.json"];
  if (modinfo) {
    try {
      const parsed = JSON.parse(modinfo) as { name?: unknown };
      if (typeof parsed.name === "string" && parsed.name.length > 0) return parsed.name;
    } catch {
      // Use modId when modinfo.json is missing or invalid.
    }
  }
  return host.modId;
}

async function reloadRenderer(host: Host, source: string): Promise<void> {
  if (host.reloading) return;
  host.reloading = true;
  host.sources[host.entry] = source;

  // Fresh file + DevTools console for this reload session.
  // Skip HTTP `/log/clear` while the IDE debugger is attached — CDP can stall
  // that POST forever. `clearLog` also times out, but skip is the sure path.
  if (host.ideDebug !== true) {
    await clearLog(host.modId);
  }
  try {
    globalThis.console.clear();
  } catch {
    /* DevTools clear is best-effort */
  }

  const report = disposeRegistered(host);
  console.log(
    `[${host.modId}] disposed for reload (${report.ran} callback(s), ${report.failed} failed)`,
  );

  try {
    runSource(source, host.modId);
    toast(host.api, `${modDisplayName(host)} reloaded`);
    console.log(`[${host.modId}] hot reloaded`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    toast(host.api, `Reload failed: ${message}`);
    console.error(`[${host.modId}] hot reload failed: ${message}`, error);
  } finally {
    host.reloading = false;
  }
}

async function refreshTrackedFiles(host: Host): Promise<void> {
  for (const file of [MAIN_ENTRY, ...RESTART_FILES]) {
    const text = await readAsset(host.api, file);
    if (text != null) host.sources[file] = text;
  }
  const worker = workerEntryPath(host.sources["modinfo.json"]);
  if (worker) {
    const text = await readAsset(host.api, worker);
    if (text != null) host.sources[worker] = text;
  }
}

async function handleNotify(host: Host, payload: NotifyPayload): Promise<void> {
  if (host.reloading) return;

  const mainSource = await readAsset(host.api, host.entry);
  if (mainSource != null && (payload.force === true || mainSource !== host.sources[host.entry])) {
    await reloadRenderer(host, mainSource);
  }

  for (const file of Object.keys(host.sources)) {
    if (file === host.entry) continue;
    const text = await readAsset(host.api, file);
    if (text == null) continue;
    if (text !== host.sources[file]) {
      host.sources[file] = text;
      toast(host.api, `${file} changed. Restart the game to apply it.`);
      console.warn(`[${host.modId}] ${file} changed — restart the game`);
    }
  }
}

function stopPolling(host: Host): void {
  if (host.pollTimer == null) return;
  globalThis.clearInterval(host.pollTimer);
  host.pollTimer = null;
}

async function pollNotify(host: Host): Promise<void> {
  if (host.reloading) return;
  const payload = await fetchNotify();
  if (payload == null) return;

  if (host.notifyN == null) {
    host.notifyN = payload.n;
    void refreshTrackedFiles(host);
    console.log(`[${host.modId}] hot reload watching ${devWatchUrl()}${NOTIFY_PATH}`);
    return;
  }
  if (payload.n === host.notifyN) return;
  host.notifyN = payload.n;
  await handleNotify(host, payload);
}

function startPolling(host: Host): void {
  if (host.pollTimer != null) return;
  host.pollTimer = globalThis.setInterval(() => {
    void pollNotify(host);
  }, POLL_MS);
  void pollNotify(host);
}

async function detectIdeDebug(host: Host): Promise<void> {
  const text = await readAsset(host.api, IDE_DEBUG_MARKER);
  host.ideDebug = text != null && text.trim() === "1";
}

function syncWatching(host: Host): void {
  if (devWatchUrl()) startPolling(host);
  else stopPolling(host);
}

/**
 * Poll the dev watch server when `__DEV_WATCH_URL__` is set.
 * Call once from each mod's `./debug` entry. A later eval replaces the
 * listener so new watch logic takes effect without a game restart.
 */
export function installHotReload(api: SandkitApi, modId: string): void {
  setActive(modId);
  const host = ensureHost(modId, api);
  host.api = api;
  host.modId = modId;
  const firstInstall = !host.installed;

  if (!host.installed) host.installed = true;

  syncWatching(host);
  void detectIdeDebug(host).then(() => {
    if (!firstInstall) return;
    if (!devWatchUrl()) {
      console.log(`[${modId}] hot reload idle (start with npm run dev)`);
    }
  });
}
