/**
 * Insert a vanilla-style **Dev Tools** row under **Options** on the pause menu.
 * Sandkit has no pause-menu hook, so this places a DOM sibling (same idea as
 * `registerManagementMenuButton`).
 *
 * Click opens Dev Tools (not vanilla Workshop `modsScreen`).
 */
import { safe } from "@modkit/utils";
import { setModInspectorOpen } from "./state";

const api = sandkit.api;

const BTN_ATTR = "data-hot-reload-pause-mods";
const ROW_SEL = ".w-64.mb-2.relative.group.cursor-pointer.pointer-events-auto";
const HOOK_KEY = "__hotReloadPauseMenuOpenHooked__";

/** Match vanilla pause `ZO` hover debounce (`qO = 150`). */
const HOVER_DEBOUNCE_MS = 150;
let lastHoverBlipAt = 0;

/** Inner face classes from vanilla pause `ZO` buttons (Continue / Options / …). */
const FACE_CLASS = [
  "w-full",
  "text-3xl",
  "leading-10",
  "tracking-wider",
  "text-white",
  "bg-black",
  "border",
  "rounded-tr-lg",
  "rounded-bl-lg",
  "shadow-md",
  "skew-x-0",
  "px-2",
  "border-slate-200",
  "border-opacity-100",
  "group-hover:border-opacity-0",
  "transition-all",
  "duration-300",
  "group-hover:duration-0",
  "group-hover:text-[#ffe700]",
  "overflow-hidden",
  "before:ease",
  "before:absolute",
  "before:right-0",
  "before:-top-4",
  "before:h-20",
  "before:w-6",
  "before:translate-x-12",
  "before:rotate-6",
  "before:bg-white",
  "before:opacity-10",
  "before:duration-700",
  "group-hover:before:-translate-x-52",
  "relative",
  "left-0",
  "group-hover:left-2",
  "pointer-events-none",
].join(" ");

type MenuWindow = { open?: boolean };

/** Vanilla pause row hover: `blip` with `ignoreMute` (not management `playbackRate`). */
function playHover(): void {
  const now = Date.now();
  if (now - lastHoverBlipAt < HOVER_DEBOUNCE_MS) return;
  lastHoverBlipAt = now;
  safe(() => api.sound.play("blip", { ignoreMute: true }));
}

function playClick(): void {
  safe(() => api.sound.play("click", { ignoreMute: true }));
}

function rowText(el: Element): string {
  return (el.textContent ?? "").replace(/\s+/g, " ").trim();
}

function getMenuWindow(): MenuWindow | null {
  const state = sandkit.engine.state as
    | { session?: { windows?: { menu?: MenuWindow } } }
    | undefined;
  return state?.session?.windows?.menu ?? null;
}

function isPauseMenuOpen(): boolean {
  return getMenuWindow()?.open === true;
}

/** Options immediately followed by Exit (English pause list). */
function findOptionsExit(): { options: HTMLElement; exit: HTMLElement } | null {
  const rows = [...document.querySelectorAll<HTMLElement>(ROW_SEL)].filter(
    (el) => !el.hasAttribute(BTN_ATTR),
  );
  for (let i = 0; i < rows.length - 1; i++) {
    const options = rows[i]!;
    const exit = rows[i + 1]!;
    if (options.parentElement !== exit.parentElement) continue;
    if (rowText(options) === "Options" && rowText(exit) === "Exit") {
      return { options, exit };
    }
  }
  return null;
}

function createModsButton(): HTMLElement {
  const root = document.createElement("div");
  root.setAttribute(BTN_ATTR, "1");
  root.className = "w-64 mb-2 relative group cursor-pointer pointer-events-auto";
  root.setAttribute("role", "button");
  root.tabIndex = 0;

  const face = document.createElement("div");
  face.className = FACE_CLASS;
  face.style.outline = "#000 solid 1px";

  const first = document.createElement("span");
  first.textContent = "D";
  const rest = document.createElement("span");
  rest.style.color = "white";
  rest.textContent = "ev Tools";
  face.append(first, rest);
  root.append(face);

  const open = () => {
    playClick();
    lastHoverBlipAt = Date.now();
    setModInspectorOpen(true);
  };

  root.addEventListener("click", (event) => {
    event.stopPropagation();
    open();
  });
  root.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    event.stopPropagation();
    open();
  });
  root.addEventListener("mouseenter", () => playHover());

  return root;
}

function placeButton(button: HTMLElement): boolean {
  const pair = findOptionsExit();
  if (!pair) {
    button.remove();
    return false;
  }
  if (button.nextElementSibling === pair.exit && button.parentElement === pair.exit.parentElement) {
    return true;
  }
  pair.exit.parentElement?.insertBefore(button, pair.exit);
  return button.isConnected;
}

type MenuOpenListener = (open: boolean) => void;

function subscribeMenuOpen(onChange: MenuOpenListener): () => void {
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

/**
 * Keep a **Dev Tools** button under **Options** while the pause menu is open.
 * Returns a dispose function.
 */
export function startPauseModsButton(): () => void {
  const button = createModsButton();
  let raf = 0;
  let placed = false;

  const sync = () => {
    if (!isPauseMenuOpen()) {
      button.remove();
      placed = false;
      return;
    }
    placed = placeButton(button);
    if (!placed) {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(sync);
    }
  };

  const stopMenu = subscribeMenuOpen((open) => {
    if (open) sync();
    else {
      cancelAnimationFrame(raf);
      button.remove();
      placed = false;
    }
  });

  const observer = new MutationObserver(() => {
    if (!isPauseMenuOpen()) return;
    if (placed && button.isConnected) return;
    sync();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  const poll = window.setInterval(() => {
    if (!isPauseMenuOpen()) {
      if (placed || button.isConnected) {
        button.remove();
        placed = false;
      }
      return;
    }
    if (!placed || !button.isConnected) sync();
  }, 500);

  return () => {
    stopMenu();
    observer.disconnect();
    window.clearInterval(poll);
    cancelAnimationFrame(raf);
    button.remove();
  };
}
