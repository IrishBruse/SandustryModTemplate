import type { SandkitApi } from "types/api";
import { sandkit } from "../sandkit";
import { debugEnabled, safe } from "../sdk";

/**
 * Renderer hot reload for official Sandkit mods.
 *
 * JavaScript cannot be unloaded. This module reclaims what the mod registered
 * through {@link onDispose}. A monkey-patch or a trigger with no unregister
 * path stays in place until the game restarts.
 *
 * Stages (honest, as in SandLoader):
 * - `renderer` — `main.js` changed: dispose, then evaluate the new source.
 * - `restart` — `patches.json`, `modinfo.json`, or a declared `workerEntry`
 *   changed: tell the player to restart. This loader cannot rebuild patches
 *   or workers.
 */

const POLL_MS = 400;
const DEBOUNCE_MS = 250;
const MAIN_ENTRY = "main.js";
const RESTART_FILES = ["patches.json", "modinfo.json"] as const;

type Host = {
  modId: string;
  api: SandkitApi;
  entry: string;
  installed: boolean;
  ready: boolean;
  reloading: boolean;
  polling: boolean;
  disposers: Array<() => void>;
  sources: Record<string, string>;
  pollTimer: ReturnType<typeof setInterval> | null;
  settingsOff: (() => void) | null;
};

type GlobalHotReload = {
  __sandkitHotReloadHosts__?: Record<string, Host>;
  __sandkitHotReloadActive__?: string;
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
    ready: false,
    reloading: false,
    polling: false,
    disposers: [],
    sources: {},
    pollTimer: null,
    settingsOff: null,
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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });
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

function runSource(source: string): void {
  const run = new Function("sandkit", source) as (sk: typeof sandkit) => void;
  run(sandkit);
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

async function captureBaseline(host: Host): Promise<void> {
  const entry = await readAsset(host.api, host.entry);
  if (entry != null) host.sources[host.entry] = entry;

  for (const file of RESTART_FILES) {
    const text = await readAsset(host.api, file);
    if (text != null) host.sources[file] = text;
  }

  const worker = workerEntryPath(host.sources["modinfo.json"]);
  if (worker) {
    const text = await readAsset(host.api, worker);
    if (text != null) host.sources[worker] = text;
  }

  host.ready = entry != null;
}

async function changedRestartFile(host: Host): Promise<string | null> {
  for (const file of Object.keys(host.sources)) {
    if (file === host.entry) continue;
    const text = await readAsset(host.api, file);
    if (text == null) continue;
    if (text !== host.sources[file]) {
      host.sources[file] = text;
      return file;
    }
  }
  return null;
}

function reloadRenderer(host: Host, source: string): void {
  if (host.reloading) return;
  host.reloading = true;
  host.sources[host.entry] = source;

  const report = disposeRegistered(host);
  console.log(
    `[${host.modId}] disposed for reload (${report.ran} callback(s), ${report.failed} failed)`,
  );

  try {
    runSource(source);
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

async function poll(host: Host): Promise<void> {
  if (host.reloading || host.polling) return;
  host.polling = true;

  try {
    if (!host.ready) {
      await captureBaseline(host);
      if (!host.ready) {
        console.warn(`[${host.modId}] hot reload cannot read ${host.entry}`);
      }
      return;
    }

    const restartFile = await changedRestartFile(host);
    const entry = await readAsset(host.api, host.entry);
    if (entry == null) return;

    if (entry !== host.sources[host.entry]) {
      await sleep(DEBOUNCE_MS);
      const again = await readAsset(host.api, host.entry);
      if (again != null && again !== host.sources[host.entry]) {
        reloadRenderer(host, again);
      }
    }

    if (restartFile) {
      toast(host.api, `${restartFile} changed. Restart the game to apply it.`);
      console.warn(`[${host.modId}] ${restartFile} changed — restart the game`);
    }
  } finally {
    host.polling = false;
  }
}

function stopPolling(host: Host): void {
  if (host.pollTimer == null) return;
  globalThis.clearInterval(host.pollTimer);
  host.pollTimer = null;
}

function startPolling(host: Host): void {
  if (host.pollTimer != null) return;
  void captureBaseline(host);
  host.pollTimer = globalThis.setInterval(() => {
    void poll(host);
  }, POLL_MS);
}

function syncWatching(host: Host): void {
  if (debugEnabled(host.api)) startPolling(host);
  else stopPolling(host);
}

/**
 * Watch `main.js` and reload the renderer when it changes.
 * Call once from `installDebug`. A later eval replaces the poller so new
 * watch logic takes effect without a game restart.
 */
export function installHotReload(api: SandkitApi, modId: string): void {
  setActive(modId);
  const host = ensureHost(modId, api);
  host.api = api;
  host.modId = modId;

  if (!host.installed) {
    host.installed = true;
    host.settingsOff = safe(() =>
      api.settings.onChange(() => {
        syncWatching(host);
      }),
    );
  }

  stopPolling(host);
  syncWatching(host);
  if (host.pollTimer != null) {
    console.log(`[${modId}] hot reload watching ${host.entry}`);
  }
}
