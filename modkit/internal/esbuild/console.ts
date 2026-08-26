/**
 * esbuild `inject` target. Bare `console.*` in the mod bundle call through here
 * so every line gets a `[modId]` prefix. Debug builds also POST to the watch
 * log server (`scripts/dev/log-server.js`).
 *
 * Use `globalThis.console` only — never the exported name — or inject recurses.
 *
 * Log methods use `native[level].bind(native, prefix)` so DevTools links to the
 * mod call site instead of this file (wrappers around each call would always
 * show `console.ts`).
 */
declare const __MOD_ID__: string;
declare const __MOD_DEBUG__: boolean;

const native = globalThis.console;
const LOG_URL = "http://127.0.0.1:19147/log";
const MIRROR_LEVELS = new Set(["log", "info", "warn", "error", "debug"]);
const MOD_PREFIX = `[${__MOD_ID__}]`;

function formatArgs(args: unknown[]): string {
  if (args.length === 0) return MOD_PREFIX;
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

function mirrorPrefixed(args: unknown[]): void {
  const body = formatArgs(args);
  mirror(body.length === 0 ? MOD_PREFIX : `${MOD_PREFIX} ${body}`);
}

function mirror(line: string): void {
  void fetch(LOG_URL, {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ modId: __MOD_ID__, line }),
  }).catch(() => {
    /* `npm run dev` log server not running */
  });
}

type ConsoleLevel = "log" | "info" | "warn" | "error" | "debug";

const boundLevels: Partial<Record<ConsoleLevel, (...args: unknown[]) => void>> = {};

function boundLevel(level: ConsoleLevel): (...args: unknown[]) => void {
  let bound = boundLevels[level];
  if (!bound) {
    const nativeFn = native[level] as (...args: unknown[]) => void;
    if (__MOD_DEBUG__) {
      const emit = (...args: unknown[]) => {
        nativeFn.call(native, ...args);
        mirrorPrefixed(args.slice(1));
      };
      bound = emit.bind(native, MOD_PREFIX);
    } else {
      bound = nativeFn.bind(native, MOD_PREFIX);
    }
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
