/**
 * esbuild `inject` target (debug builds). Bare `console.*` in the mod bundle
 * call through here so DevTools and `logs/<mod-id>.log` both see the line.
 * DevTools lines are prefixed with `[modId]` — do not repeat that in call sites.
 *
 * Use `globalThis.console` only — never the exported name — or inject recurses.
 */
declare const __MOD_ID__: string;

const native = globalThis.console;
const LOG_URL = "http://127.0.0.1:19147/log";
const MIRROR_LEVELS = new Set(["log", "info", "warn", "error", "debug"]);

function modId(): string {
  return typeof __MOD_ID__ === "string" && __MOD_ID__.length > 0 ? __MOD_ID__ : "mod";
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

function mirror(level: string, args: unknown[]): void {
  const line = `[${level}] ${formatArgs(args)}`;
  void fetch(LOG_URL, {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ modId: modId(), line }),
  }).catch(() => {
    /* `npm run dev` watch server not running */
  });
}

function wrap(level: "log" | "info" | "warn" | "error" | "debug") {
  return (...args: unknown[]) => {
    native[level](`[${modId()}]`, ...args);
    mirror(level, args);
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
