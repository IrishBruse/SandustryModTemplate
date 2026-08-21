import type { SandkitApi } from "types/api";
import { sandkit } from "../sandkit";
import { debugEnabled, safe } from "../utils";

/**
 * Renderer hot reload for official Sandkit mods.
 *
 * JavaScript cannot be unloaded. This module reclaims what the mod registered
 * through {@link onDispose}. A monkey-patch or a trigger with no unregister
 * path stays in place until the game restarts.
 *
 * Notify channel: `npm run dev` (--watch) embeds `__HOT_RELOAD_URL__` and runs
 * an SSE server. One-shot builds leave the URL empty — no subscribe, no poll.
 *
 * Stages (honest, as in SandLoader):
 * - `renderer` — build notify for `main.js`: dispose, then evaluate the new
 *   source.
 * - `restart` — `patches.json`, `modinfo.json`, or a declared `workerEntry`
 *   changed: tell the player to restart. This loader cannot rebuild patches
 *   or workers.
 */

declare const __HOT_RELOAD_URL__: string;

const MAIN_ENTRY = "main.js";
const RESTART_FILES = ["patches.json", "modinfo.json"] as const;
const RECONNECT_MS = 1000;

type Host = {
  modId: string;
  api: SandkitApi;
  entry: string;
  installed: boolean;
  reloading: boolean;
  disposers: Array<() => void>;
  sources: Record<string, string>;
  eventSource: EventSource | null;
  reconnectTimer: ReturnType<typeof setTimeout> | null;
  settingsOff: (() => void) | null;
};

type GlobalHotReload = {
  __sandkitHotReloadHosts__?: Record<string, Host>;
  __sandkitHotReloadActive__?: string;
};

type NotifyPayload = {
  v?: number;
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

function hotReloadUrl(): string {
  return typeof __HOT_RELOAD_URL__ === "string" ? __HOT_RELOAD_URL__ : "";
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
    eventSource: null,
    reconnectTimer: null,
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

function reloadRenderer(host: Host, source: string): void {
  if (host.reloading) return;
  host.reloading = true;
  host.sources[host.entry] = source;

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
    reloadRenderer(host, mainSource);
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

function stopReconnect(host: Host): void {
  if (host.reconnectTimer == null) return;
  globalThis.clearTimeout(host.reconnectTimer);
  host.reconnectTimer = null;
}

function scheduleReconnect(host: Host): void {
  stopReconnect(host);
  if (!debugEnabled(host.api) || !hotReloadUrl()) return;
  host.reconnectTimer = globalThis.setTimeout(() => {
    host.reconnectTimer = null;
    startListening(host);
  }, RECONNECT_MS);
}

function stopListening(host: Host): void {
  stopReconnect(host);
  if (host.eventSource == null) return;
  host.eventSource.close();
  host.eventSource = null;
}

function startListening(host: Host): void {
  const url = hotReloadUrl();
  if (!url || host.eventSource != null) return;

  let source: EventSource;
  try {
    source = new EventSource(url);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[${host.modId}] hot reload EventSource failed: ${message}`);
    scheduleReconnect(host);
    return;
  }

  host.eventSource = source;

  source.onopen = () => {
    console.log(`[${host.modId}] hot reload listening ${url}`);
    void refreshTrackedFiles(host);
  };

  source.onmessage = (event) => {
    let payload: NotifyPayload = {};
    try {
      payload = JSON.parse(String(event.data)) as NotifyPayload;
    } catch {
      payload = { changed: [MAIN_ENTRY] };
    }
    void handleNotify(host, payload);
  };

  source.onerror = () => {
    if (source.readyState !== EventSource.CLOSED) return;
    host.eventSource = null;
    scheduleReconnect(host);
  };
}

function syncWatching(host: Host): void {
  if (debugEnabled(host.api) && hotReloadUrl()) startListening(host);
  else stopListening(host);
}

/**
 * Subscribe to the `npm run dev` SSE notify channel when Debug is on.
 * Call once from `installDebug`. A later eval replaces the listener so new
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

  stopListening(host);
  syncWatching(host);
  if (!hotReloadUrl()) {
    console.log(`[${modId}] hot reload idle (start with npm run dev)`);
  }
}
