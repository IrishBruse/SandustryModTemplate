import { pushDispose } from "./dispose.ts";

export type ApiNamespaces = {
  ui?: object;
  events?: object;
  settings?: object;
  hooks?: object;
};

/** Copy own keys onto a new object. Not a Proxy. Host object stays untouched. */
export function copyOwn<T extends object>(obj: T): T {
  const out = Object.create(Object.getPrototypeOf(obj)) as T;
  for (const key of Reflect.ownKeys(obj)) {
    try {
      const desc = Object.getOwnPropertyDescriptor(obj, key);
      if (!desc) continue;
      const value = desc.get ? desc.get.call(obj) : desc.value;
      Object.defineProperty(out, key, {
        configurable: true,
        enumerable: desc.enumerable,
        writable: true,
        value,
      });
    } catch {
      /* skip keys that throw on read */
    }
  }
  return out;
}

export function trackDisposeReturn(
  fn: (...args: unknown[]) => unknown,
  modId: string,
): (...args: unknown[]) => unknown {
  return (...args: unknown[]) => {
    const result = fn(...args);
    if (typeof result === "function") pushDispose(modId, result as () => void);
    return result;
  };
}

function wrapMethods<T extends object>(ns: T, names: readonly string[], modId: string): T {
  const copy = copyOwn(ns);
  const source = ns as Record<string, unknown>;
  const target = copy as Record<string, unknown>;
  for (const name of names) {
    const fn = source[name];
    if (typeof fn !== "function") continue;
    const bound = (fn as (...args: unknown[]) => unknown).bind(ns);
    target[name] = trackDisposeReturn(bound, modId);
  }
  return copy;
}

export function wrapApi<T extends ApiNamespaces>(api: T, modId: string): T {
  const copy = copyOwn(api);
  if (api.ui) copy.ui = wrapMethods(api.ui, ["inject"], modId);
  if (api.events) copy.events = wrapMethods(api.events, ["on"], modId);
  if (api.settings) copy.settings = wrapMethods(api.settings, ["onChange"], modId);
  if (api.hooks) copy.hooks = wrapMethods(api.hooks, ["intercept", "modify"], modId);
  return copy;
}

/** Plain object passed as `__sandkit`. Does not Proxy the host. */
export function wrapSandkit<T extends { api: object }>(host: T, modId: string): T {
  const copy = copyOwn(host);
  copy.api = wrapApi(host.api as ApiNamespaces, modId) as T["api"];
  return copy;
}
