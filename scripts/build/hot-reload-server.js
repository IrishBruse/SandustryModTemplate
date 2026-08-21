/**
 * Hot-reload notify for `npm run dev` (--watch only).
 * Game clients subscribe with EventSource; rebuilds push a small JSON event.
 */
import { appendFileSync, mkdirSync } from "node:fs";
import http from "node:http";
import net from "node:net";
import { homedir } from "node:os";
import { join } from "node:path";

export const HOT_RELOAD_PORT = 19147;
export const HOT_RELOAD_PATH = "/hot-reload";

/** @returns {string} */
export function hotReloadUrl() {
  return `http://127.0.0.1:${HOT_RELOAD_PORT}${HOT_RELOAD_PATH}`;
}

/**
 * True when the watch SSE server is accepting connections.
 * Used so one-shot `--game` builds keep the notify URL while `npm run dev` runs.
 * @param {number} [timeoutMs]
 * @returns {Promise<boolean>}
 */
export function isHotReloadServerUp(timeoutMs = 200) {
  return new Promise((resolve) => {
    const socket = net.connect({ host: "127.0.0.1", port: HOT_RELOAD_PORT }, () => {
      socket.destroy();
      resolve(true);
    });
    const fail = () => {
      socket.destroy();
      resolve(false);
    };
    socket.on("error", fail);
    socket.setTimeout(timeoutMs, fail);
  });
}

/** @type {Set<import('node:http').ServerResponse>} */
const clients = new Set();

/** @type {import('node:http').Server | null} */
let server = null;

/** @type {ReturnType<typeof setTimeout> | null} */
let debounceTimer = null;

/** @type {{ changed?: string[] } | null} */
let pending = null;

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
    const chunk = `data: ${JSON.stringify({ v: 1, ...body })}\n\n`;
    for (const res of clients) {
      try {
        res.write(chunk);
      } catch {
        clients.delete(res);
      }
    }
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

/** Start the SSE server once. No-op if already listening. */
export function startHotReloadServer() {
  if (server) return;

  server = http.createServer((req, res) => {
    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      });
      res.end();
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
        const safeId = modId.replace(/[^a-zA-Z0-9._-]+/g, "_") || "mod";
        const dir = join(homedir(), ".config/sandustry/logs");
        mkdirSync(dir, { recursive: true });
        appendFileSync(join(dir, `${safeId}.log`), line.endsWith("\n") ? line : `${line}\n`);
        res.writeHead(204, { "Access-Control-Allow-Origin": "*" });
        res.end();
      });
      return;
    }

    if (req.url !== HOT_RELOAD_PATH) {
      res.writeHead(404, { "Access-Control-Allow-Origin": "*" });
      res.end("not found");
      return;
    }

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    });
    res.write("\n");
    clients.add(res);
    req.on("close", () => {
      clients.delete(res);
    });
  });

  server.listen(HOT_RELOAD_PORT, "127.0.0.1", () => {
    console.log(`hot reload notify: ${hotReloadUrl()}`);
    installForceReloadKey();
  });

  server.on("error", (error) => {
    console.error(`hot reload notify failed: ${error.message}`);
  });
}
