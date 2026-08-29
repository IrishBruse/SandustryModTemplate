/**
 * esbuild `inject` target. Bare `console.*` in the mod bundle call through here
 * so every line gets a `[modId]` prefix in DevTools and is forwarded to the
 * Electron file logger (`window.electron.log` → `logs/main.log`).
 *
 * Use `globalThis.console` only — never the exported name — or inject recurses.
 *
 * Log methods use `native[level].bind(native, prefix)` so DevTools links to the
 * mod call site instead of this file (wrappers around each call would always
 * show `console.ts`).
 */
declare const __MOD_ID__: string;

const native = globalThis.console;
const MIRROR_LEVELS = new Set(["log", "info", "warn", "error", "debug"]);
const MOD_PREFIX = `[${__MOD_ID__}]`;

type ConsoleLevel = "log" | "info" | "warn" | "error" | "debug";
type ElectronLogLevel = "debug" | "info" | "warn" | "error";
type ElectronLog = (level: ElectronLogLevel, scope: string, message: string) => void;

function formatArgs(args: unknown[]): string {
  return args
    .map((value) => {
      if (typeof value === "string") return value;
      if (value instanceof Error) return value.stack ?? value.message;
      try {
        return JSON.stringify(value);
      } catch {
        return String(value);
      }
    })
    .join(" ");
}

function toElectronLevel(level: ConsoleLevel): ElectronLogLevel {
  return level === "log" ? "info" : level;
}

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

/** Fire-and-forget write to `logs/main.log` via the host IPC bridge. */
function mirrorToFile(level: ConsoleLevel, args: unknown[]): void {
  const log = electronLog();
  if (!log) return;
  try {
    log(toElectronLevel(level), __MOD_ID__, formatArgs(args));
  } catch {
    /* logging must never throw */
  }
}

const boundLevels: Partial<Record<ConsoleLevel, (...args: unknown[]) => void>> = {};

function boundLevel(level: ConsoleLevel): (...args: unknown[]) => void {
  let bound = boundLevels[level];
  if (!bound) {
    const nativeFn = native[level] as (...args: unknown[]) => void;
    const emit = (...args: unknown[]) => {
      nativeFn.call(native, ...args);
      mirrorToFile(level, args.slice(1));
    };
    bound = emit.bind(native, MOD_PREFIX);
    boundLevels[level] = bound;
  }
  return bound;
}

/** Replaces the free `console` identifier in bundled mod code (esbuild inject). */
export const console: Console = new Proxy(native, {
  get(target, prop, receiver) {
    if (typeof prop === "string" && MIRROR_LEVELS.has(prop)) {
      return boundLevel(prop as ConsoleLevel);
    }
    const value = Reflect.get(target, prop, receiver);
    return typeof value === "function" ? value.bind(target) : value;
  },
});
