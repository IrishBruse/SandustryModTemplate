/**
 * File logging via the Sandustry Electron bridge (`window.electron.log`).
 *
 * Lines go to `logs/main.log` (workspace `sandustry/logs/` → OS sandustry logs:
 * `~/.config/sandustry/logs` or `%APPDATA%/sandustry/logs`) with the mod id as
 * scope. Bare `console.*` in mod bundles already do this through the esbuild
 * inject — use this when you want a custom scope tag without going through
 * `console`.
 */

type ElectronLogLevel = "debug" | "info" | "warn" | "error";
type ElectronLog = (level: ElectronLogLevel, scope: string, message: string) => void;

export type CreateLoggerOptions = {
  /** Scope tag in each file line (default: `modId`). */
  tag?: string;
  /** Also `console.log` the line (default: true). */
  console?: boolean;
};

export type ModLogger = {
  /** Stable mod id (default scope when `tag` is omitted). */
  modId: string;
  /** Plain message, or an event name with optional JSON fields. */
  (message: string, data?: Record<string, unknown>): void;
};

function electronLog(): ElectronLog | undefined {
  try {
    const g = globalThis as typeof globalThis & {
      electron?: { log?: ElectronLog };
      window?: { electron?: { log?: ElectronLog } };
    };
    const log = g.electron?.log ?? g.window?.electron?.log;
    return typeof log === "function" ? log : undefined;
  } catch {
    return undefined;
  }
}

function writeLog(
  level: ElectronLogLevel,
  scope: string,
  message: string,
  options?: { console?: boolean },
): void {
  // Bypass the console inject — the line already carries its tag.
  if (options?.console !== false) globalThis.console.log(`[${scope}] ${message}`);
  const log = electronLog();
  if (!log) return;
  try {
    log(level, scope, message);
  } catch {
    /* logging must never throw */
  }
}

/**
 * Bind a mod id and return a logger.
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
  const scope = options?.tag ?? modId;
  const mirrorConsole = options?.console !== false;

  const logger = ((message: string, data?: Record<string, unknown>) => {
    const text =
      data !== undefined
        ? JSON.stringify({
            t: Math.round(performance.now()),
            event: message,
            ...data,
          })
        : message;
    writeLog("info", scope, text, { console: mirrorConsole });
  }) as ModLogger;

  logger.modId = modId;
  return logger;
}

/**
 * Append one line to `logs/main.log` under the given scope. Prefer
 * {@link createLogger} at call sites.
 */
export function appendLog(modId: string, message: string, options?: { console?: boolean }): void {
  writeLog("info", modId, message, options);
}
