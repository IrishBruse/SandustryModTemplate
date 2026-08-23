/**
 * esbuild `inject` target. Bare `console.*` in the mod bundle call through here
 * so every line gets a `[modId]` prefix. Debug builds also POST to the watch
 * log server (`scripts/dev/log-server.js`).
 *
 * Use `globalThis.console` only — never the exported name — or inject recurses.
 */
declare const __MOD_ID__: string;
declare const __MOD_DEBUG__: boolean;

const native = globalThis.console;
const LOG_URL = "http://127.0.0.1:19147/log";
const MIRROR_LEVELS = new Set(["log", "info", "warn", "error", "debug"]);

function prefixArgs(args: unknown[]): unknown[] {
  if (args.length === 0) return [`[${__MOD_ID__}]`];
  if (typeof args[0] === "string") {
    return [`[${__MOD_ID__}] ${args[0]}`, ...args.slice(1)];
  }
  return [`[${__MOD_ID__}]`, ...args];
}

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

function wrap(level: "log" | "info" | "warn" | "error" | "debug") {
  return (...args: unknown[]) => {
    const prefixed = prefixArgs(args);
    native[level](...prefixed);
    if (__MOD_DEBUG__) {
      mirror(formatArgs(prefixed));
    }
  };
}

/** Replaces the free `console` identifier in bundled mod code (esbuild inject). */
export const console: Console = new Proxy(native, {
  get(target, prop, receiver) {
    if (typeof prop === "string" && MIRROR_LEVELS.has(prop)) {
      return wrap(prop as "log" | "info" | "warn" | "error" | "debug");
    }
    const value = Reflect.get(target, prop, receiver);
    return typeof value === "function" ? value.bind(target) : value;
  },
});
