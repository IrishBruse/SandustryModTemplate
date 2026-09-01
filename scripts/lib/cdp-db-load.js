/**
 * After F5 CDP is up, send the renderer to `?db_load=<saveId>`.
 * Steam `loadFile` has no query string.
 */
import { setTimeout as sleep } from "node:timers/promises";

/**
 * @param {unknown} entry
 * @returns {entry is { type: string; url: string; webSocketDebuggerUrl: string }}
 */
function isRendererPage(entry) {
  if (!entry || typeof entry !== "object") return false;
  const rec = /** @type {Record<string, unknown>} */ (entry);
  return (
    rec.type === "page" &&
    typeof rec.url === "string" &&
    typeof rec.webSocketDebuggerUrl === "string" &&
    (rec.url.includes("index.html") || /sandustry/i.test(String(rec.title ?? "")))
  );
}

/**
 * @param {string} port
 * @returns {Promise<{ url: string; webSocketDebuggerUrl: string } | null>}
 */
async function listRendererPage(port) {
  const response = await fetch(`http://127.0.0.1:${port}/json/list`, {
    signal: AbortSignal.timeout(2000),
  });
  if (!response.ok) return null;
  const targets = await response.json();
  if (!Array.isArray(targets)) return null;
  const page = targets.find(isRendererPage);
  return page ?? null;
}

/**
 * @param {string} wsUrl
 * @param {string} method
 * @param {Record<string, unknown>} [params]
 */
function cdpCall(ws, method, params) {
  return new Promise((resolve, reject) => {
    const id = 1;
    const timer = setTimeout(() => reject(new Error(`CDP ${method} timeout`)), 8000);
    const onMessage = (event) => {
      try {
        const msg = JSON.parse(String(event.data));
        if (msg.id !== id) return;
        cleanup();
        if (msg.error) reject(new Error(msg.error.message ?? JSON.stringify(msg.error)));
        else resolve(msg.result);
      } catch (error) {
        cleanup();
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    };
    function cleanup() {
      clearTimeout(timer);
      ws.removeEventListener("message", onMessage);
    }
    ws.addEventListener("message", onMessage);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

/**
 * @param {string} port
 * @param {string} saveId
 * @param {number} [timeoutMs]
 */
export async function cdpNavigateDbLoad(port, saveId, timeoutMs = 20000) {
  const deadline = Date.now() + timeoutMs;
  let page = await listRendererPage(port);
  while (!page && Date.now() < deadline) {
    await sleep(200);
    page = await listRendererPage(port);
  }
  if (!page) throw new Error(`No renderer page on CDP :${port}`);

  const next = new URL(page.url);
  next.search = "";
  next.searchParams.set("db_load", saveId);
  const targetUrl = next.toString();
  if (page.url === targetUrl || new URL(page.url).searchParams.get("db_load") === saveId) {
    return { url: targetUrl, navigated: false };
  }

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("CDP websocket timeout")), 8000);
    ws.addEventListener("open", () => {
      clearTimeout(timer);
      resolve();
    });
    ws.addEventListener("error", () => {
      clearTimeout(timer);
      reject(new Error("CDP websocket error"));
    });
  });

  try {
    await cdpCall(ws, "Page.navigate", { url: targetUrl });
  } finally {
    ws.close();
  }
  return { url: targetUrl, navigated: true };
}
