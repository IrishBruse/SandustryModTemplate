import { pushDispose } from "./dispose.ts";
import { formatHotToastMessage } from "./generation.ts";

export type ApiNamespaces = {
  ui?: {
    overlays?: object;
    regions?: object;
    toast?: (...args: unknown[]) => unknown;
  };
  events?: object;
  settings?: object;
  hooks?: object;
  input?: object;
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

/**
 * Wrap `register` so reload calls `unregister` with the first `arity` arguments.
 */
export function wrapRegisterUnregister<T extends object>(
  ns: T,
  registerName: string,
  unregisterName: string,
  arity: number,
  modId: string,
): T {
  const copy = copyOwn(ns);
  const source = ns as Record<string, unknown>;
  const target = copy as Record<string, unknown>;
  const register = source[registerName];
  const unregister = source[unregisterName];
  if (typeof register !== "function") return copy;

  const boundRegister = (register as (...args: unknown[]) => unknown).bind(ns);
  const boundUnregister =
    typeof unregister === "function"
      ? (unregister as (...args: unknown[]) => unknown).bind(ns)
      : undefined;

  target[registerName] = (...args: unknown[]) => {
    const result = boundRegister(...args);
    if (typeof result === "function") {
      pushDispose(modId, result as () => void);
    } else if (boundUnregister) {
      const unregArgs = args.slice(0, arity);
      pushDispose(modId, () => {
        boundUnregister(...unregArgs);
      });
    }
    return result;
  };
  return copy;
}

/** Wrap `mount` so reload calls `unmount` on the handle when present. */
export function wrapRegionsMount<T extends object>(ns: T, modId: string): T {
  const copy = copyOwn(ns);
  const source = ns as Record<string, unknown>;
  const target = copy as Record<string, unknown>;
  const mount = source.mount;
  if (typeof mount !== "function") return copy;

  const boundMount = (mount as (...args: unknown[]) => unknown).bind(ns);
  target.mount = (...args: unknown[]) => {
    const result = boundMount(...args);
    if (typeof result === "function") {
      pushDispose(modId, result as () => void);
    } else if (
      result &&
      typeof result === "object" &&
      typeof (result as { unmount?: unknown }).unmount === "function"
    ) {
      const unmount = (result as { unmount: () => void }).unmount;
      pushDispose(modId, unmount.bind(result));
    }
    return result;
  };
  return copy;
}

type BindingHandlers = {
  down?: () => void;
  up?: () => void;
};

type BindingDefinition = {
  handlers?: BindingHandlers;
  [key: string]: unknown;
};

/** Gate binding handlers so a replaced binding does not keep firing after reload. */
export function wrapRegisterBinding(
  fn: (...args: unknown[]) => unknown,
  modId: string,
): (...args: unknown[]) => unknown {
  return (bindingId: unknown, defaultKeys: unknown, definition: unknown) => {
    let live = true;
    const def = definition as BindingDefinition | undefined;
    const handlers = def?.handlers;
    const nextDef =
      handlers && typeof handlers === "object"
        ? {
            ...def,
            handlers: {
              ...handlers,
              down: handlers.down
                ? () => {
                    if (live) handlers.down?.();
                  }
                : handlers.down,
              up: handlers.up
                ? () => {
                    if (live) handlers.up?.();
                  }
                : handlers.up,
            },
          }
        : definition;
    const result = fn(bindingId, defaultKeys, nextDef);
    pushDispose(modId, () => {
      live = false;
    });
    return result;
  };
}

function wrapInput<T extends object>(input: T, modId: string): T {
  const copy = copyOwn(input);
  const register = (input as { registerBinding?: unknown }).registerBinding;
  if (typeof register === "function") {
    const bound = (register as (...args: unknown[]) => unknown).bind(input);
    (copy as { registerBinding: unknown }).registerBinding = wrapRegisterBinding(bound, modId);
  }
  return copy;
}

function wrapToast(
  toast: (...args: unknown[]) => unknown,
  modId: string,
  generation: number,
): (...args: unknown[]) => unknown {
  return (message: unknown, options?: unknown, ...rest: unknown[]) =>
    toast(formatHotToastMessage(message, modId, generation), options, ...rest);
}

function wrapUi<
  T extends { overlays?: object; regions?: object; toast?: (...args: unknown[]) => unknown },
>(ui: T, modId: string, generation?: number): T {
  const copy = wrapMethods(ui, ["inject"], modId);
  if (ui.overlays) {
    copy.overlays = wrapRegisterUnregister(ui.overlays, "register", "unregister", 2, modId);
  }
  if (ui.regions) {
    copy.regions = wrapRegionsMount(ui.regions, modId);
  }
  if (typeof generation === "number" && typeof ui.toast === "function") {
    copy.toast = wrapToast(ui.toast.bind(ui), modId, generation);
  }
  return copy;
}

export function wrapApi<T extends ApiNamespaces>(api: T, modId: string, generation?: number): T {
  const copy = copyOwn(api);
  if (api.ui) copy.ui = wrapUi(api.ui, modId, generation);
  if (api.events) copy.events = wrapMethods(api.events, ["on"], modId);
  if (api.settings) copy.settings = wrapMethods(api.settings, ["onChange"], modId);
  if (api.hooks) copy.hooks = wrapMethods(api.hooks, ["intercept", "modify"], modId);
  if (api.input) copy.input = wrapInput(api.input, modId);
  return copy;
}

/** Plain object passed as `__sandkit`. Does not Proxy the host. */
export function wrapSandkit<T extends { api: object }>(
  host: T,
  modId: string,
  generation?: number,
): T {
  const copy = copyOwn(host);
  copy.api = wrapApi(host.api as ApiNamespaces, modId, generation) as T["api"];
  return copy;
}
