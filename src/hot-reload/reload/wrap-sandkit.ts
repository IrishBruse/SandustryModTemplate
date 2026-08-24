/**
 * Eval-time wrap of `sandkit.api` so hot reload can dispose without mods
 * calling `onDispose`. Keys must match `patches.ts` and `hot-eval.ts`.
 */

export const EVAL_IDS_KEY = "__sandkitHotReloadEvalIds__";
export const ACTIVE_KEY = "__sandkitHotReloadActive__";
export const DISPOSE_LISTS_KEY = "__sandkitDisposeLists__";
export const TRACK_KEY = "__sandkitTrackInjectDispose";
export const WRAP_KEY = "__sandkitWrapForDispose";
export const SUPPRESS_TOAST_KEY = "__sandkitHotReloadSuppressToast__";

type DisposeFn = () => void;

type WrapGlobals = {
  [EVAL_IDS_KEY]?: Set<string>;
  [ACTIVE_KEY]?: string;
  [DISPOSE_LISTS_KEY]?: Record<string, DisposeFn[]>;
  [TRACK_KEY]?: (modId: string, fn: DisposeFn) => void;
  [WRAP_KEY]?: typeof wrapForDispose;
  [SUPPRESS_TOAST_KEY]?: boolean;
};

function globals(): typeof globalThis & WrapGlobals {
  return globalThis as typeof globalThis & WrapGlobals;
}

function disposeLists(): Record<string, DisposeFn[]> {
  const g = globals();
  if (!g[DISPOSE_LISTS_KEY]) g[DISPOSE_LISTS_KEY] = {};
  return g[DISPOSE_LISTS_KEY];
}

export function trackDispose(modId: string, fn: DisposeFn): void {
  if (typeof fn !== "function" || !modId) return;
  const lists = disposeLists();
  if (!lists[modId]) lists[modId] = [];
  lists[modId].push(fn);
}

export function isToastSuppressed(): boolean {
  return globals()[SUPPRESS_TOAST_KEY] === true;
}

export async function withToastSuppressed(fn: () => void | Promise<void>): Promise<void> {
  globals()[SUPPRESS_TOAST_KEY] = true;
  try {
    await fn();
    await Promise.resolve();
  } finally {
    globals()[SUPPRESS_TOAST_KEY] = false;
  }
}

function evalIds(): Set<string> | undefined {
  return globals()[EVAL_IDS_KEY];
}

function isInGame(sk: typeof sandkit): boolean {
  try {
    const scene = sk.api.scene?.getActive?.();
    const game = sk.enums?.Scene?.Game;
    return game != null && scene === game;
  } catch {
    return false;
  }
}

function replayGameReadyIfNeeded(sk: typeof sandkit, modId: string, callback: unknown): void {
  if (typeof callback !== "function") return;
  if (!evalIds()?.has(modId)) return;
  if (!isInGame(sk)) return;
  queueMicrotask(() => {
    try {
      (callback as (payload: Record<string, never>) => void)({});
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`game:ready replay failed: ${message}`, error);
    }
  });
}

/**
 * Proxy `sandkit.api` for one eval. Function results are tracked as disposers.
 * `ui.overlays.register` (void) tracks a matching unregister.
 * Leave `state` / `enums` / `react` on the original object.
 */
export function wrapForDispose(sk: typeof sandkit, modId: string): typeof sandkit {
  if (!sk || !modId) return sk;

  const originalUnregister = sk.api?.ui?.overlays?.unregister;
  const cache = new WeakMap<object, object>();

  function wrap(value: unknown, parent: object | undefined, path: string): unknown {
    if (typeof value === "function") {
      return function wrappedApiFn(...args: unknown[]) {
        if (path === "ui.toast" && isToastSuppressed()) return undefined;
        const result = value.apply(parent, args);
        if (typeof result === "function") {
          trackDispose(modId, result as DisposeFn);
        } else if (path === "ui.overlays.register" && typeof originalUnregister === "function") {
          const slot = args[0];
          const overlayId = args[1];
          if (typeof slot === "string" && typeof overlayId === "string") {
            trackDispose(modId, () => originalUnregister.call(sk.api.ui.overlays, slot, overlayId));
          }
        }
        if (path === "events.on" && args[0] === "game:ready") {
          replayGameReadyIfNeeded(sk, modId, args[1]);
        }
        return result;
      };
    }
    if (!value || typeof value !== "object") return value;
    const objectValue = value as object;
    const cached = cache.get(objectValue);
    if (cached) return cached;
    const proxy = new Proxy(objectValue, {
      get(target, prop) {
        if (prop === "then") return undefined;
        const inner = (target as Record<PropertyKey, unknown>)[prop];
        const nextPath = path ? `${path}.${String(prop)}` : String(prop);
        return wrap(inner, target, nextPath);
      },
    });
    cache.set(objectValue, proxy);
    return proxy;
  }

  return new Proxy(sk, {
    get(target, prop) {
      const inner = (target as Record<PropertyKey, unknown>)[prop];
      if (prop === "api") return wrap(inner, target, "");
      return inner;
    },
  }) as typeof sandkit;
}

export function installSandkitWrap(): void {
  const g = globals();
  g[WRAP_KEY] = wrapForDispose;
  g[TRACK_KEY] = trackDispose;
}

installSandkitWrap();
