type MenuWindow = { open?: boolean };

const HOOK_KEY = "__hotReloadPauseMenuOpenHook__";

type MenuOpenListener = (open: boolean) => void;

export function getMenuWindow(): MenuWindow | null {
  const state = sandkit.engine.state as
    | { session?: { windows?: { menu?: MenuWindow } } }
    | undefined;
  return state?.session?.windows?.menu ?? null;
}

export function isPauseMenuOpen(): boolean {
  return getMenuWindow()?.open === true;
}

/** Subscribe to pause menu open/close via a property hook on `menu.open`. */
export function subscribeMenuOpen(onChange: MenuOpenListener): () => void {
  const menu = getMenuWindow();
  if (!menu) {
    onChange(isPauseMenuOpen());
    return () => {};
  }

  const bag = menu as MenuWindow & { [HOOK_KEY]?: Set<MenuOpenListener> };
  let listeners = bag[HOOK_KEY];
  if (!listeners) {
    listeners = new Set();
    bag[HOOK_KEY] = listeners;
    let value = menu.open === true;
    Object.defineProperty(menu, "open", {
      configurable: true,
      enumerable: true,
      get() {
        return value;
      },
      set(next: boolean) {
        const v = next === true;
        if (v === value) return;
        value = v;
        for (const fn of listeners!) fn(value);
      },
    });
  }

  listeners.add(onChange);
  onChange(menu.open === true);
  return () => {
    listeners!.delete(onChange);
  };
}
