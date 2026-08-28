import * as esbuild from "esbuild";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, extname, join, normalize, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as sleep } from "node:timers/promises";
import type { ChildProcess } from "node:child_process";
import { isSandustryAvailable, CdpConnection } from "./cdp.ts";
import { spawnChrome, stopChild, resolveChrome } from "./chrome.ts";
import { rewriteAssetJoinForHttp } from "./asset-join.ts";
import { companionSettings, copyTestMods, listWorkshopMods } from "./mods.ts";
import {
  extractedDistDir,
  SANDUSTRY_TEST_HTTP_PORT,
  sandustryTestMockPath,
  sandustryTestSavesDir,
  repoRoot,
  sandustryTestHostFile,
  sandustryTestModsDir,
  sandustryTestUserDataDir,
  SANDUSTRY_TEST_CDP_PORT,
} from "./paths.ts";
import { parseSaveFile, readSaveMetaLine, steamSettingsJson } from "./saves.ts";

export type { HostWindowMode } from "./chrome.ts";
export { hostWindowMode } from "./chrome.ts";

export type HostStartResult = { ok: true; reused: boolean } | { ok: false; reason: string };

export type TestHttpServer = {
  port: number;
  distDir: string;
  saveId: string | null;
  origin: string;
  close: () => Promise<void>;
};

type HostRecord = {
  pid: number;
  port: string;
  launchedAt: number;
};

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",
  ".glsl": "text/plain",
};

const ISOLATION_HEADERS = {
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Embedder-Policy": "require-corp",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Cache-Control": "no-store",
};

const GAME_SCENE_WAIT_MS = 90000;

type Runtime = { http: TestHttpServer; chrome: ChildProcess | null };

let runtime: Runtime | null = null;

function send(
  response: ServerResponse,
  status: number,
  body: string | Buffer,
  contentType: string,
): void {
  response.writeHead(status, { ...ISOLATION_HEADERS, "Content-Type": contentType });
  response.end(body);
}

function sendJson(response: ServerResponse, status: number, value: unknown): void {
  send(response, status, `${JSON.stringify(value)}\n`, "application/json");
}

function safeJoin(root: string, urlPath: string): string | null {
  const decoded = decodeURIComponent(urlPath.split("?")[0] ?? "");
  const rel = decoded.replace(/^\/+/, "").replaceAll("/", sep);
  const full = normalize(join(root, rel));
  const relToRoot = relative(root, full);
  if (!relToRoot || relToRoot.startsWith("..") || relToRoot.startsWith(sep)) return null;
  return full;
}

function wrapIndexHtml(distDir: string): string {
  const html = readFileSync(join(distDir, "index.html"), "utf8");
  const injected = '<script src="/electron-mock.js"></script>\n    ';
  if (html.includes("/electron-mock.js")) return html;
  return html.replace(
    '<script type="module" src="js/bundle.js"></script>',
    `${injected}<script type="module" src="js/bundle.js"></script>`,
  );
}

function mergedSettingsJson(modIds: string[]): string {
  let base: Record<string, unknown> = {};
  try {
    const parsed = JSON.parse(steamSettingsJson()) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      base = parsed as Record<string, unknown>;
    }
  } catch {
    /* fallback */
  }
  const companion = companionSettings(modIds);
  const baseExternal =
    base.externalModSettings && typeof base.externalModSettings === "object"
      ? (base.externalModSettings as Record<string, unknown>)
      : {};
  const companionExternal = companion.externalModSettings as Record<string, unknown>;
  return JSON.stringify({
    ...base,
    ...companion,
    externalModSettings: { ...baseExternal, ...companionExternal },
    sound: companion.sound,
  });
}

function prepareSaves(): { saveId: string | null; ids: string[]; saves: Record<string, unknown> } {
  mkdirSync(sandustryTestSavesDir(), { recursive: true });
  return { saveId: null, ids: [], saves: {} };
}

export function prepareSandustryTestUserData(): { mods: string[]; saveId: string | null } {
  mkdirSync(sandustryTestUserDataDir(), { recursive: true });
  const mods = copyTestMods();
  const saves = prepareSaves();
  return { mods, saveId: saves.saveId };
}

async function buildElectronMock(
  saveIds: string[],
  lastPlayedRaw: string,
  saves: Record<string, unknown>,
  modIds: string[],
): Promise<void> {
  const entry = fileURLToPath(new URL("./electron-mock.ts", import.meta.url));
  mkdirSync(sandustryTestUserDataDir(), { recursive: true });
  await esbuild.build({
    absWorkingDir: repoRoot(),
    bundle: true,
    entryPoints: [entry],
    format: "iife",
    outfile: sandustryTestMockPath(),
    platform: "browser",
    target: "es2020",
    define: {
      __TEST_HOST_SETTINGS__: JSON.stringify(mergedSettingsJson(modIds)),
      __TEST_HOST_LAST_PLAYED__: JSON.stringify(lastPlayedRaw),
      __TEST_HOST_SAVE_IDS__: JSON.stringify(saveIds),
      __TEST_HOST_SAVES__: JSON.stringify(saves),
    },
  });
}

function loadSavePayload(
  id: string,
): { success: true; data: unknown } | { success: false; error: string } {
  const filePath = join(sandustryTestSavesDir(), `${id}.save`);
  if (!existsSync(filePath)) return { success: false, error: `Save not found: "${id}"` };
  try {
    const parsed = parseSaveFile(filePath);
    return { success: true, data: parsed.data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

function listSaves(): unknown[] {
  if (!existsSync(sandustryTestSavesDir())) return [];
  const out: unknown[] = [];
  for (const name of readdirSync(sandustryTestSavesDir())) {
    if (!name.endsWith(".save")) continue;
    const meta = readSaveMetaLine(join(sandustryTestSavesDir(), name));
    if (meta) out.push(meta);
  }
  return out;
}

function isFile(filePath: string | null): filePath is string {
  return Boolean(filePath && existsSync(filePath) && statSync(filePath).isFile());
}

/**
 * Vanilla bundle textures use `/mods/<file>.png` under extracted `dist/mods/`.
 * Live test mods use `/mods/<id>/...` under the isolated test mods folder.
 */
export function resolveHostStaticFile(
  distDir: string,
  testModsDir: string,
  urlPath: string,
): string | null {
  const pathOnly = urlPath.split("?")[0] ?? "";
  if (pathOnly.startsWith("/mods/")) {
    const live = safeJoin(testModsDir, pathOnly.slice("/mods".length));
    if (isFile(live)) return live;
    const vanilla = safeJoin(distDir, pathOnly);
    return isFile(vanilla) ? vanilla : null;
  }
  const distFile = safeJoin(distDir, pathOnly);
  return isFile(distFile) ? distFile : null;
}

function sendResolvedFile(filePath: string, response: ServerResponse): void {
  const type = MIME[extname(filePath).toLowerCase()] ?? "application/octet-stream";
  send(response, 200, readFileSync(filePath), type);
}

function serveStatic(distDir: string, urlPath: string, response: ServerResponse): void {
  if (urlPath === "/" || urlPath.startsWith("/?")) {
    send(response, 200, wrapIndexHtml(distDir), "text/html; charset=utf-8");
    return;
  }
  if (urlPath === "/electron-mock.js" || urlPath.startsWith("/electron-mock.js?")) {
    send(
      response,
      200,
      readFileSync(sandustryTestMockPath()),
      "application/javascript; charset=utf-8",
    );
    return;
  }
  const pathOnly = urlPath.split("?")[0] ?? "";
  if (pathOnly === "/js/bundle.js") {
    const raw = readFileSync(join(distDir, "js", "bundle.js"), "utf8");
    send(response, 200, rewriteAssetJoinForHttp(raw), "application/javascript; charset=utf-8");
    return;
  }
  const resolved = resolveHostStaticFile(distDir, sandustryTestModsDir(), urlPath);
  if (resolved) {
    sendResolvedFile(resolved, response);
    return;
  }
  send(response, 404, "Not found", "text/plain; charset=utf-8");
}

async function startHttpHost(): Promise<TestHttpServer> {
  const distDir = extractedDistDir();
  if (!distDir) {
    throw new Error("No sandustry/<version>-<branch>/dist. Run npm run setup.");
  }

  const prepared = prepareSandustryTestUserData();
  const lastPlayedRaw = prepared.saveId ? JSON.stringify({ id: prepared.saveId }) : "";
  const saveIds = prepared.saveId ? [prepared.saveId] : [];
  const saves: Record<string, unknown> = {};
  if (prepared.saveId) {
    const parsed = parseSaveFile(join(sandustryTestSavesDir(), `${prepared.saveId}.save`));
    saves[prepared.saveId] = parsed.data;
  }
  await buildElectronMock(saveIds, lastPlayedRaw, saves, prepared.mods);

  const server = createServer((request: IncomingMessage, response: ServerResponse) => {
    const url = request.url ?? "/";
    try {
      if (url.startsWith("/__host/load")) {
        const id = new URL(url, "http://127.0.0.1").searchParams.get("id") ?? "";
        sendJson(response, 200, loadSavePayload(id));
        return;
      }
      if (url.startsWith("/__host/saves")) {
        sendJson(response, 200, listSaves());
        return;
      }
      if (url.startsWith("/__host/mods")) {
        sendJson(response, 200, {
          ok: true,
          data: { mods: listWorkshopMods(), diagnostics: [] },
          error: null,
        });
        return;
      }
      serveStatic(distDir, url, response);
    } catch (error) {
      sendJson(response, 500, { error: error instanceof Error ? error.message : String(error) });
    }
  });

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(SANDUSTRY_TEST_HTTP_PORT, "127.0.0.1", () => resolve());
  });

  return {
    port: SANDUSTRY_TEST_HTTP_PORT,
    distDir,
    saveId: prepared.saveId,
    origin: `http://127.0.0.1:${SANDUSTRY_TEST_HTTP_PORT}`,
    close: () =>
      new Promise((resolve) => {
        server.close(() => resolve());
      }),
  };
}

function writeHostRecord(record: HostRecord): void {
  mkdirSync(dirname(sandustryTestHostFile()), { recursive: true });
  writeFileSync(sandustryTestHostFile(), `${JSON.stringify(record, null, 2)}\n`);
}

async function waitForGameScene(): Promise<boolean> {
  const deadline = Date.now() + GAME_SCENE_WAIT_MS;
  while (Date.now() < deadline) {
    if (!(await isSandustryAvailable(SANDUSTRY_TEST_CDP_PORT))) {
      await sleep(250);
      continue;
    }
    let cdp: CdpConnection | undefined;
    try {
      cdp = await CdpConnection.connect({ timeoutMs: 8000 });
      const state = (await cdp.evaluate(`(() => {
        const g = globalThis;
        const sk = typeof sandkit !== "undefined" ? sandkit : g.sandkit;
        return {
          api: Boolean(sk && sk.api),
          scene: sk && sk.engine && sk.engine.state && sk.engine.state.store
            ? sk.engine.state.store.scene.active
            : null,
          game: sk && sk.enums && sk.enums.Scene ? sk.enums.Scene.Game : null,
        };
      })()`)) as { api: boolean; scene: number | null; game: number | null };
      cdp.close();
      if (state.api && state.game != null && state.scene === state.game) return true;
    } catch {
      cdp?.close();
    }
    await sleep(500);
  }
  return false;
}

export async function stopSandustryTestHost(): Promise<void> {
  if (runtime) {
    stopChild(runtime.chrome);
    await runtime.http.close();
    runtime = null;
  } else {
    stopChild(null);
  }
  try {
    unlinkSync(sandustryTestHostFile());
  } catch {
    /* missing */
  }
}

export async function startSandustryTestHost(options?: {
  persist?: boolean;
  visible?: boolean;
}): Promise<HostStartResult> {
  const visible = options?.visible === true;
  if (await isSandustryAvailable(SANDUSTRY_TEST_CDP_PORT)) {
    if (process.env.SANDUSTRY_TEST_HOST === "1" && !options?.persist) {
      return { ok: true, reused: true };
    }
    await stopSandustryTestHost();
  }
  if (process.env.SANDUSTRY_TEST_HOST === "1" && !options?.persist) {
    return { ok: false, reason: "Integration host did not start" };
  }

  const chrome = resolveChrome();
  if (!chrome) {
    return { ok: false, reason: "Chrome/Chromium not found. Set CHROME or install google-chrome." };
  }
  if (!extractedDistDir()) {
    return { ok: false, reason: "No sandustry/<version>-<branch>/dist. Run npm run setup." };
  }
  if (visible && process.platform !== "win32" && !process.env.DISPLAY) {
    return { ok: false, reason: "DISPLAY is missing" };
  }

  let http: TestHttpServer;
  try {
    http = await startHttpHost();
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : String(error) };
  }

  const url = http.saveId
    ? `${http.origin}/?db_load=${encodeURIComponent(http.saveId)}`
    : http.origin;
  const child = spawnChrome(chrome, url, visible);
  runtime = { http, chrome: child };
  if (typeof child.pid === "number") {
    writeHostRecord({ pid: child.pid, port: SANDUSTRY_TEST_CDP_PORT, launchedAt: Date.now() });
  }

  const ready = await waitForGameScene();
  if (!ready) {
    await stopSandustryTestHost();
    return { ok: false, reason: "Game scene did not start. See .tmp/sandustry-test-chrome.log" };
  }
  return { ok: true, reused: false };
}
