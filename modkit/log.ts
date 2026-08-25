/**
 * File logging for the renderer while `npm run dev` is running (debug builds only).
 *
 * The watch log server accepts POST `/log` (append) and POST `/log/clear`
 * (truncate) for `~/.config/sandustry/logs/<modId>.log` on Linux or
 * `%APPDATA%/sandustry/logs/<modId>.log` on Windows (repo `logs/` link).
 * Electron `logs/main.log` only gets the main process — not `console.log`
 * from the game UI — so use this for in-game UI debugging.
 *
 * Port/path must match `scripts/dev/log-server.js`.
 */

declare const __MOD_DEBUG__: boolean;

const LOG_URL = "http://127.0.0.1:19147/log";
const LOG_CLEAR_URL = "http://127.0.0.1:19147/log/clear";

export type CreateLoggerOptions = {
  /** Bracket tag in each line (default: `modId`). */
  tag?: string;
  /** Also `console.log` the line (default: true). */
  console?: boolean;
};

export type ModLogger = {
  /** Stable mod id — used as the log file name (`logs/<modId>.log`). */
  modId: string;
  /** Plain message, or an event name with optional JSON fields. */
  (message: string, data?: Record<string, unknown>): void;
};

/**
 * Bind a mod id and return a logger. Safe when the log server is down
 * (fetch errors are ignored).
 *
 * ```ts
 * import { createLogger } from "@modkit/log";
 * import { modinfo } from "./modinfo";
 *
 * const log = createLogger(modinfo.id);
 * log("booted");
 * log("place", { x: 1, y: 2 });
 * ```
 */
export function createLogger(modId: string, options?: CreateLoggerOptions): ModLogger {
  const tag = options?.tag ?? modId;
  const mirrorConsole = options?.console !== false;

  const logger = ((message: string, data?: Record<string, unknown>) => {
    const line =
      data !== undefined
        ? `[${tag}] ${JSON.stringify({
            t: Math.round(performance.now()),
            event: message,
            ...data,
          })}`
        : `[${tag}] ${message}`;
    appendLog(logger.modId, line, { console: mirrorConsole });
  }) as ModLogger;

  logger.modId = modId;
  return logger;
}

/**
 * Append one line to `logs/<modId>.log`. Prefer {@link createLogger} at call sites.
 */
export function appendLog(modId: string, line: string, options?: { console?: boolean }): void {
  // Bypass the console inject — the line already carries its tag.
  if (options?.console !== false) globalThis.console.log(line);
  if (!__MOD_DEBUG__) return;
  void fetch(LOG_URL, {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ modId, line }),
  }).catch(() => {
    /* npm run dev not running */
  });
}

/**
 * Truncate `logs/<modId>.log`. Hot reload awaits this before re-eval so the file
 * only holds lines from the current session. Safe when the log server is down
 * or when F5 / CDP stalls the POST (abort after 500 ms).
 */
export function clearLog(modId: string): Promise<void> {
  if (!__MOD_DEBUG__) return Promise.resolve();
  const controller = new AbortController();
  const timer = globalThis.setTimeout(() => controller.abort(), 500);
  return fetch(LOG_CLEAR_URL, {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ modId }),
    signal: controller.signal,
  })
    .then(() => undefined)
    .catch(() => {
      /* npm run dev not running, or the IDE debugger stalled HTTP */
    })
    .finally(() => {
      globalThis.clearTimeout(timer);
    });
}
