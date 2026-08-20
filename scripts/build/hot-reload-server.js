/**
 * Hot-reload notify for `npm run dev` (--watch only).
 * Game clients subscribe with EventSource; rebuilds push a small JSON event.
 */
import http from "node:http";
import net from "node:net";

export const HOT_RELOAD_PORT = 19147;
export const HOT_RELOAD_PATH = "/hot-reload";

/** @returns {string} */
export function hotReloadUrl() {
  return `http://127.0.0.1:${HOT_RELOAD_PORT}${HOT_RELOAD_PATH}`;
}

/**
 * True when the watch SSE server is accepting connections.
 * Used so one-shot `--game` / F5 builds keep the notify URL while `npm run dev` runs.
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
 * @param {{ changed?: string[] }} payload
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
 * @param {{ changed?: string[] } | null} a
 * @param {{ changed?: string[] }} b
 */
function mergePayload(a, b) {
  if (!a) return { changed: b.changed ? [...b.changed] : undefined };
  const changed = new Set([...(a.changed ?? []), ...(b.changed ?? [])]);
  return {
    changed: changed.size > 0 ? [...changed] : undefined,
  };
}

/** Start the SSE server once. No-op if already listening. */
export function startHotReloadServer() {
  if (server) return;

  server = http.createServer((req, res) => {
    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      });
      res.end();
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
  });

  server.on("error", (error) => {
    console.error(`hot reload notify failed: ${error.message}`);
  });
}
