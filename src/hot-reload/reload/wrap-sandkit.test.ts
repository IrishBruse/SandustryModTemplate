import assert from "node:assert/strict";
import { test } from "node:test";
import {
  DISPOSE_LISTS_KEY,
  EVAL_IDS_KEY,
  SUPPRESS_TOAST_KEY,
  WRAP_KEY,
  trackDispose,
  wrapForDispose,
} from "./wrap-sandkit.ts";

type DisposeGlobals = {
  [DISPOSE_LISTS_KEY]?: Record<string, Array<() => void>>;
  [EVAL_IDS_KEY]?: Set<string>;
  [SUPPRESS_TOAST_KEY]?: boolean;
  [WRAP_KEY]?: typeof wrapForDispose;
};

const g = globalThis as typeof globalThis & DisposeGlobals;

function lists(): Record<string, Array<() => void>> {
  if (!g[DISPOSE_LISTS_KEY]) g[DISPOSE_LISTS_KEY] = {};
  return g[DISPOSE_LISTS_KEY];
}

function fakeSandkit(options?: {
  scene?: number;
  gameScene?: number;
  overlaysUnregister?: (slot: string, overlayId: string) => void;
}) {
  const unsubs: Array<() => void> = [];
  const toastCalls: string[] = [];
  const overlayUnregisters: Array<[string, string]> = [];
  const unregister =
    options?.overlaysUnregister ??
    ((slot: string, overlayId: string) => {
      overlayUnregisters.push([slot, overlayId]);
    });

  const api = {
    events: {
      on: (_eventId: string, _callback: (payload: unknown) => void) => {
        const stop = () => {
          /* unsubscribe */
        };
        unsubs.push(stop);
        return stop;
      },
    },
    ui: {
      inject: (_id: string, _component: unknown) => {
        const stop = () => {
          /* unmount */
        };
        unsubs.push(stop);
        return stop;
      },
      toast: (message: string) => {
        toastCalls.push(message);
      },
      overlays: {
        register: (_slot: string, _overlayId: string, _render: () => unknown) => {
          /* void */
        },
        unregister,
      },
    },
    hooks: {
      intercept: (_hookId: string, _callback: unknown) => {
        const stop = () => {
          /* unhook */
        };
        unsubs.push(stop);
        return stop;
      },
      modify: (_hookId: string, _callback: unknown) => {
        const stop = () => {
          /* unhook */
        };
        unsubs.push(stop);
        return stop;
      },
    },
    settings: {
      onChange: (_callback: unknown) => {
        const stop = () => {
          /* unsubscribe */
        };
        unsubs.push(stop);
        return stop;
      },
    },
    scene: {
      getActive: () => options?.scene ?? 0,
    },
    input: {
      registerBinding: (bindingId: string) => bindingId,
    },
  };

  const sk = {
    api,
    enums: { Scene: { Game: options?.gameScene ?? 1 } },
    state: { marker: "original-state" },
  } as unknown as typeof sandkit;

  return { sk, unsubs, toastCalls, overlayUnregisters };
}

test("wrap tracks function-returning Sandkit APIs under the eval mod id", () => {
  g[DISPOSE_LISTS_KEY] = {};
  const { sk } = fakeSandkit();
  const wrapped = wrapForDispose(sk, "owner.mod");
  const hooks = wrapped.api.hooks as {
    intercept: (id: string, cb: () => void) => () => void;
    modify: (id: string, cb: () => void) => () => void;
  };

  wrapped.api.events.on("frame:render", () => {});
  wrapped.api.ui.inject("hud", () => null);
  hooks.intercept("input:keydown", () => {});
  hooks.modify("x", () => {});
  wrapped.api.settings.onChange(() => {});

  assert.equal(lists()["owner.mod"]?.length, 5);
  assert.equal(lists()["other.mod"], undefined);
});

test("wrap tracks overlays.register as unregister even though it returns void", () => {
  g[DISPOSE_LISTS_KEY] = {};
  const overlayUnregisters: Array<[string, string]> = [];
  const { sk } = fakeSandkit({
    overlaysUnregister: (slot, overlayId) => {
      overlayUnregisters.push([slot, overlayId]);
    },
  });
  const wrapped = wrapForDispose(sk, "owner.mod");
  wrapped.api.ui.overlays.register("hotbar", "my-overlay", () => null);

  assert.equal(lists()["owner.mod"]?.length, 1);
  lists()["owner.mod"]?.[0]?.();
  assert.deepEqual(overlayUnregisters, [["hotbar", "my-overlay"]]);
});

test("wrap does not track non-function returns", () => {
  g[DISPOSE_LISTS_KEY] = {};
  const { sk } = fakeSandkit();
  const wrapped = wrapForDispose(sk, "owner.mod");
  const id = wrapped.api.input.registerBinding("bind.a", ["KeyA"], {
    displayName: "A",
    category: "test",
    handlers: {},
  });
  assert.equal(id, "bind.a");
  assert.equal(lists()["owner.mod"], undefined);
});

test("wrap leaves state on the original object", () => {
  const { sk } = fakeSandkit();
  const wrapped = wrapForDispose(sk, "owner.mod");
  assert.equal(wrapped.state, sk.state);
  assert.equal((wrapped.state as unknown as { marker: string }).marker, "original-state");
});

test("wrap-tracked disposers bind to the eval mod id, not a later active id", () => {
  g[DISPOSE_LISTS_KEY] = {};
  const { sk } = fakeSandkit();
  const wrapped = wrapForDispose(sk, "owner.mod");
  trackDispose("other.mod", () => {});
  wrapped.api.events.on("frame:render", () => {});
  assert.equal(lists()["owner.mod"]?.length, 1);
  assert.equal(lists()["other.mod"]?.length, 1);
});

test("ui.toast is a no-op while toast suppress is on", () => {
  const { sk, toastCalls } = fakeSandkit();
  const wrapped = wrapForDispose(sk, "owner.mod");
  g[SUPPRESS_TOAST_KEY] = true;
  wrapped.api.ui.toast("hello");
  g[SUPPRESS_TOAST_KEY] = false;
  wrapped.api.ui.toast("later");
  assert.deepEqual(toastCalls, ["later"]);
});

test("game:ready replays after hot-eval when the scene is Game", async () => {
  g[DISPOSE_LISTS_KEY] = {};
  g[EVAL_IDS_KEY] = new Set(["owner.mod"]);
  let readyCount = 0;
  const { sk } = fakeSandkit({ scene: 2, gameScene: 2 });
  const wrapped = wrapForDispose(sk, "owner.mod");
  wrapped.api.events.on("game:ready", () => {
    readyCount += 1;
  });
  await Promise.resolve();
  assert.equal(readyCount, 1);
  g[EVAL_IDS_KEY] = new Set();
});

test("game:ready does not replay on first load", async () => {
  g[DISPOSE_LISTS_KEY] = {};
  g[EVAL_IDS_KEY] = new Set();
  let readyCount = 0;
  const { sk } = fakeSandkit({ scene: 2, gameScene: 2 });
  const wrapped = wrapForDispose(sk, "owner.mod");
  wrapped.api.events.on("game:ready", () => {
    readyCount += 1;
  });
  await Promise.resolve();
  assert.equal(readyCount, 0);
});

test("installSandkitWrap publishes wrapForDispose on globalThis", () => {
  assert.equal(typeof g[WRAP_KEY], "function");
});
