/**
 * Dev watch server for `npm run dev` (--watch only).
 * Hot reload notify: in-memory counter at GET /hot-reload/last.
 * Also accepts POST /log and POST /log/clear for renderer file logging.
 */
import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import http from "node:http";
import { join } from "node:path";
import { sandustryLogsDir } from "../sandustry/paths.js";

export const DEV_WATCH_PORT = 19147;
export const HOT_RELOAD_LAST_PATH = "/hot-reload/last";

/** @returns {string} */
export function devWatchUrl() {
  return `http://127.0.0.1:${DEV_WATCH_PORT}`;
}

/** @type {import('node:http').Server | null} */
let server = null;

let notifyN = 0;

/** @type {{ v: number; n: number; changed?: string[]; force?: boolean }} */
let lastNotify = { v: 1, n: 0 };

/** @type {ReturnType<typeof setTimeout> | null} */
let debounceTimer = null;

/** @type {{ changed?: string[]; force?: boolean } | null} */
let pending = null;

/**
 * @param {{ changed?: string[]; force?: boolean }} payload
 */
function applyNotify(payload) {
  notifyN += 1;
  lastNotify = {
    v: 1,
    n: notifyN,
    ...(payload.changed?.length ? { changed: payload.changed } : {}),
    ...(payload.force === true ? { force: true } : {}),
  };
}

/**
 * @param {{ changed?: string[]; force?: boolean }} payload
 */
export function notifyHotReload(payload) {
  if (!server) return;
  pending = mergePayload(pending, payload);
  if (debounceTimer != null) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    const body = pending;
    pending = null;
    if (!body) return;
    applyNotify(body);
  }, 50);
}

/**
 * @param {{ changed?: string[]; force?: boolean } | null} a
 * @param {{ changed?: string[]; force?: boolean }} b
 */
function mergePayload(a, b) {
  if (!a) {
    return {
      changed: b.changed ? [...b.changed] : undefined,
      force: b.force === true ? true : undefined,
    };
  }
  const changed = new Set([...(a.changed ?? []), ...(b.changed ?? [])]);
  return {
    changed: changed.size > 0 ? [...changed] : undefined,
    force: a.force === true || b.force === true ? true : undefined,
  };
}

/**
 * @param {string} modId
 * @returns {string}
 */
function safeLogId(modId) {
  return String(modId).replace(/[^a-zA-Z0-9._-]+/g, "_") || "mod";
}

/**
 * @param {string} modId
 * @returns {string}
 */
function logFilePath(modId) {
  const dir = sandustryLogsDir();
  mkdirSync(dir, { recursive: true });
  return join(dir, `${safeLogId(modId)}.log`);
}

/**
 * Truncate `logs/<modId>.log` so the next append starts a fresh session.
 * @param {string} modId
 */
export function clearModLog(modId) {
  writeFileSync(logFilePath(modId), "");
}

const CORS = { "Access-Control-Allow-Origin": "*" };

/** Ctrl+R in the `npm run dev` TTY forces a client reload even if main.js is unchanged. */
function installForceReloadKey() {
  if (!process.stdin.isTTY || process.stdin.isRaw) return;

  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (key) => {
    if (key === "\u0003") {
      process.exit(0);
      return;
    }
    if (key !== "\u0012") return;
    notifyHotReload({ changed: ["main.js"], force: true });
    console.log("forced hot reload (Ctrl+R)");
  });
  console.log("press Ctrl+R to force a hot reload");
}

/** Start the dev watch HTTP server once. No-op if already listening. */
export function startHotReloadServer() {
  if (server) return;

  server = http.createServer((req, res) => {
    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        ...CORS,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      });
      res.end();
      return;
    }

    if (req.method === "POST" && (req.url === "/log/clear" || req.url?.startsWith("/log/clear?"))) {
      const chunks = [];
      req.on("data", (c) => chunks.push(c));
      req.on("end", () => {
        const raw = Buffer.concat(chunks).toString("utf8");
        let modId = "mod";
        try {
          const parsed = JSON.parse(raw);
          if (
            parsed &&
            typeof parsed === "object" &&
            typeof parsed.modId === "string" &&
            parsed.modId.trim()
          ) {
            modId = parsed.modId.trim();
          }
        } catch {
          /* plain text or empty body — default mod id */
        }
        clearModLog(modId);
        res.writeHead(204, CORS);
        res.end();
      });
      return;
    }

    if (req.method === "POST" && (req.url === "/log" || req.url?.startsWith("/log?"))) {
      const chunks = [];
      req.on("data", (c) => chunks.push(c));
      req.on("end", () => {
        const raw = Buffer.concat(chunks).toString("utf8");
        let modId = "mod";
        let line = raw;
        try {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === "object") {
            if (typeof parsed.modId === "string" && parsed.modId.trim())
              modId = parsed.modId.trim();
            if (typeof parsed.line === "string") line = parsed.line;
          }
        } catch {
          /* plain text body */
        }
        appendFileSync(logFilePath(modId), line.endsWith("\n") ? line : `${line}\n`);
        res.writeHead(204, CORS);
        res.end();
      });
      return;
    }

    if (
      req.method === "GET" &&
      (req.url === HOT_RELOAD_LAST_PATH || req.url?.startsWith(`${HOT_RELOAD_LAST_PATH}?`))
    ) {
      res.writeHead(200, {
        ...CORS,
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      });
      res.end(`${JSON.stringify(lastNotify)}\n`);
      return;
    }

    res.writeHead(404, CORS);
    res.end("not found");
  });

  server.listen(DEV_WATCH_PORT, "127.0.0.1", () => {
    console.log(`dev watch: ${devWatchUrl()} (GET ${HOT_RELOAD_LAST_PATH})`);
    installForceReloadKey();
  });

  server.on("error", (error) => {
    console.error(`dev watch server failed: ${error.message}`);
  });
}
