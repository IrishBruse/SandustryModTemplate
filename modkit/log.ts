/**
 * File logging for the renderer while `npm run dev` is running.
 *
 * The watch server accepts POST `/log` and appends to
 * `~/.config/sandustry/logs/<modId>.log` on Linux or
 * `%APPDATA%/sandustry/logs/<modId>.log` on Windows (repo `logs/` link).
 * Electron `logs/main.log` only gets the main process — not `console.log`
 * from the game UI — so use this for in-game UI debugging.
 *
 * Port/path must match `scripts/build/hot-reload-server.js`.
 */

const LOG_URL = "http://127.0.0.1:19147/log";

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
 * Bind a mod id and return a logger. Safe when the watch server is down
 * (fetch errors are ignored).
 *
 * ```ts
 * import { createLogger } from "@modkit/log";
 * import { MOD_ID } from "./globals";
 *
 * const log = createLogger(MOD_ID);
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
  if (options?.console !== false) console.log(line);
  void fetch(LOG_URL, {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ modId, line }),
  }).catch(() => {
    /* npm run dev not running */
  });
}
