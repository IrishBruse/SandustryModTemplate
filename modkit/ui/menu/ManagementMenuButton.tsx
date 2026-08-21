import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { sandkit } from "../../sandkit";
import { safe } from "../../utils/safe";
import { Interactive } from "../layout/OverlayPanel";
import { MenuButton } from "./MenuButton";

const api = sandkit.api;

const SPACER_ATTR = "data-modkit-management-spacer";
const ROW_ATTR = "data-modkit-management-row";
const SPACER_HEIGHT_PX = 42;
const COLLAPSED_WIDTH_PX = 52;
const DEFAULT_EXPANDED_WIDTH_PX = 208;
const MGMT_LOG_URL = "http://127.0.0.1:19147/mgmt-log";

/** Row id is `${modId}:…`; used as `logs/<mod-id>.log`. */
let logModId = "mod";

function setLogModId(rowId: string): void {
  const cut = rowId.lastIndexOf(":");
  logModId = cut > 0 ? rowId.slice(0, cut) : rowId;
}

function mgmtLog(event: string, data: Record<string, unknown> = {}): void {
  const payload = { t: Math.round(performance.now()), event, ...data };
  const line = `[modkit-mgmt] ${JSON.stringify(payload)}`;
  console.log(line);
  void fetch(MGMT_LOG_URL, {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ modId: logModId, line }),
  }).catch(() => {
    /* watch SSE not running */
  });
}

const rowOrder: string[] = [];
const spacers = new Map<string, HTMLDivElement>();
const anchorListeners = new Map<string, (anchor: ManagementAnchor | null) => void>();

export type ManagementAnchor = {
  spacer: HTMLDivElement;
  expandedWidth: number;
};

function playMenuHover() {
  safe(() => api.sound.play("blip", { playbackRate: 4, volume: 0.05 }));
}

function playMenuClick() {
  safe(() => api.sound.play("click"));
}

function sampleCollapse(tag: string): void {
  let n = 0;
  const tick = () => {
    const upgrades = findUpgradesButton();
    const dest = document.querySelector<HTMLElement>(`[${ROW_ATTR}]`);
    const label = dest?.querySelector<HTMLElement>(".tracking-wider");
    mgmtLog("sample", {
      tag,
      n,
      store: getManagementCollapsed(),
      upgradesW: upgrades?.offsetWidth ?? null,
      upgradesStyle: upgrades?.getAttribute("style"),
      destW: dest?.offsetWidth ?? null,
      destStyle: dest?.getAttribute("style"),
      destTransition: dest ? getComputedStyle(dest).transition : null,
      labelOp: label ? getComputedStyle(label).opacity : null,
      labelW: label ? getComputedStyle(label).width : null,
    });
    n += 1;
    if (n < 10) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

type EngineState = {
  store?: { options?: { managementCollapsed?: boolean } };
};

function getStoreOptions(): { managementCollapsed?: boolean } | null {
  const state = sandkit.engine.state as EngineState | undefined;
  return state?.store?.options ?? null;
}

/** True when the vanilla ◀/▶ column is folded. */
export function getManagementCollapsed(): boolean {
  return getStoreOptions()?.managementCollapsed === true;
}

const collapsedListeners = new Set<(collapsed: boolean) => void>();
const hookedOptions = new WeakSet<object>();

function installCollapsedHook(options: { managementCollapsed?: boolean }): void {
  if (hookedOptions.has(options)) return;
  hookedOptions.add(options);
  let value = options.managementCollapsed === true;
  mgmtLog("hook-install", { initial: value });
  Object.defineProperty(options, "managementCollapsed", {
    configurable: true,
    enumerable: true,
    get() {
      return value;
    },
    set(next: boolean) {
      value = next === true;
      mgmtLog("store-set", { collapsed: value });
      sampleCollapse("store-set");
      for (const fn of collapsedListeners) fn(value);
    },
  });
}

/**
 * Fires in the same turn as vanilla `store.options.managementCollapsed = …`
 * (the ◀/▶ click), before their React commit.
 */
function subscribeManagementCollapsed(onChange: (collapsed: boolean) => void): () => void {
  const options = getStoreOptions();
  if (options) installCollapsedHook(options);
  collapsedListeners.add(onChange);
  onChange(getManagementCollapsed());
  return () => collapsedListeners.delete(onChange);
}

function findUpgradesButton(): HTMLElement | null {
  const rows = document.querySelectorAll<HTMLElement>(
    ".mb-2.relative.group.cursor-pointer.pointer-events-auto",
  );
  for (const row of rows) {
    if (row.hasAttribute(SPACER_ATTR)) continue;
    const text = row.textContent ?? "";
    if (text.includes("Upgrades") || text.includes("pgrades")) return row;
  }
  return null;
}

function placeAll() {
  const options = getStoreOptions();
  if (options) installCollapsedHook(options);

  const upgrades = findUpgradesButton();
  if (!upgrades) {
    for (const id of rowOrder) {
      const spacer = spacers.get(id);
      if (spacer?.parentElement) spacer.remove();
      anchorListeners.get(id)?.(null);
    }
    return;
  }

  const expandedWidth = Math.max(DEFAULT_EXPANDED_WIDTH_PX, upgrades.offsetWidth);
  let previous: HTMLElement = upgrades;

  for (const id of rowOrder) {
    const spacer = spacers.get(id);
    const notify = anchorListeners.get(id);
    if (!spacer || !notify) continue;
    spacer.style.height = `${SPACER_HEIGHT_PX}px`;
    if (
      spacer.previousElementSibling !== previous ||
      spacer.parentElement !== previous.parentElement
    ) {
      previous.after(spacer);
    }
    previous = spacer;
    notify({ spacer, expandedWidth });
  }
}

function registerRow(id: string, setAnchor: (anchor: ManagementAnchor | null) => void): () => void {
  if (!rowOrder.includes(id)) rowOrder.push(id);

  let spacer = spacers.get(id);
  if (!spacer) {
    spacer = document.createElement("div");
    spacer.setAttribute(SPACER_ATTR, id);
    spacer.className = "mb-2";
    spacer.style.height = `${SPACER_HEIGHT_PX}px`;
    spacer.style.pointerEvents = "none";
    spacers.set(id, spacer);
  }

  anchorListeners.set(id, setAnchor);
  placeAll();

  return () => {
    const index = rowOrder.indexOf(id);
    if (index >= 0) rowOrder.splice(index, 1);
    anchorListeners.delete(id);
    const el = spacers.get(id);
    el?.remove();
    spacers.delete(id);
    setAnchor(null);
    placeAll();
  };
}

function useManagementAnchor(id: string, active: boolean): ManagementAnchor | null {
  const [anchor, setAnchor] = useState<ManagementAnchor | null>(null);
  const setAnchorRef = useRef(setAnchor);
  setAnchorRef.current = setAnchor;

  useEffect(() => {
    if (!active) {
      setAnchor(null);
      return;
    }

    const unregister = registerRow(id, (next) => {
      setAnchorRef.current((prev) => {
        if (
          prev &&
          next &&
          prev.spacer === next.spacer &&
          prev.expandedWidth === next.expandedWidth
        ) {
          return prev;
        }
        return next;
      });
    });

    const observer = new MutationObserver(placeAll);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("resize", placeAll);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", placeAll);
      unregister();
    };
  }, [id, active]);

  return active ? anchor : null;
}

function returnRowHome(home: HTMLElement | null, row: HTMLElement | null) {
  if (!home || !row) return;
  if (row.parentElement !== home) home.appendChild(row);
}

export type ManagementMenuButtonProps = {
  id: string;
  icon: ReactNode;
  label: string;
  hotkey: string;
  highlightLetter?: string;
  active?: boolean;
  onClick?: () => void;
};

/**
 * Vanilla-style management column row under Upgrades.
 * Collapse follows `engine.state.store.options.managementCollapsed` (same write as ◀/▶).
 * Width uses CSS `0.2s ease-in-out` like vanilla framer-motion.
 */
export function ManagementMenuButton({
  id,
  icon,
  label,
  hotkey,
  highlightLetter,
  active = true,
  onClick,
}: ManagementMenuButtonProps) {
  setLogModId(id);
  const anchor = useManagementAnchor(id, active);
  const [columnCollapsed, setColumnCollapsed] = useState(getManagementCollapsed);
  const [hovered, setHovered] = useState(false);
  const homeRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const mounted = Boolean(active && anchor);

  useEffect(() => {
    mgmtLog("subscribe", { store: getManagementCollapsed() });
    return subscribeManagementCollapsed((collapsed) => {
      mgmtLog("listener", { collapsed });
      setColumnCollapsed(collapsed);
    });
  }, []);

  const visuallyCollapsed = columnCollapsed && !hovered;
  const expandedWidth = anchor?.expandedWidth ?? DEFAULT_EXPANDED_WIDTH_PX;
  const width = visuallyCollapsed ? COLLAPSED_WIDTH_PX : expandedWidth;

  if (!mounted) {
    returnRowHome(homeRef.current, wrapRef.current);
  }

  useLayoutEffect(() => {
    if (!mounted || !anchor) return;
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (wrap.parentElement !== anchor.spacer) anchor.spacer.appendChild(wrap);
    return () => {
      returnRowHome(homeRef.current, wrap);
    };
  }, [mounted, anchor]);

  useLayoutEffect(() => {
    if (!mounted || !anchor) return;
    anchor.spacer.style.transition = "width 0.2s ease-in-out";
    anchor.spacer.style.width = `${width}px`;
    mgmtLog("layout", {
      width,
      columnCollapsed,
      hovered,
      visuallyCollapsed,
      expandedWidth,
    });
  }, [mounted, anchor, width, columnCollapsed, hovered, visuallyCollapsed, expandedWidth]);

  if (!mounted || !anchor) return null;

  return (
    <div ref={homeRef} hidden aria-hidden>
      <div ref={wrapRef} className="pointer-events-none" style={{ width: "100%", height: "100%" }}>
        <Interactive>
          <MenuButton
            icon={icon}
            label={label}
            hotkey={hotkey}
            highlightLetter={highlightLetter}
            width={width}
            collapsed={visuallyCollapsed}
            className="!mb-0"
            rowProps={{ [ROW_ATTR]: id }}
            onMouseEnter={() => {
              setHovered(true);
              playMenuHover();
            }}
            onMouseLeave={() => setHovered(false)}
            onClick={() => {
              playMenuClick();
              onClick?.();
            }}
          />
        </Interactive>
      </div>
    </div>
  );
}
