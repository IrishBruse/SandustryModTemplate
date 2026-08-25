import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { safe } from "../../utils/safe";
import { MenuButton } from "./MenuButton";

const api = sandkit.api;

const ROW_ATTR = "data-modkit-management-row";
const COLLAPSED_WIDTH_PX = 52;
const DEFAULT_EXPANDED_WIDTH_PX = 208;
const STOP_KEY = "__modkitManagementLayoutStops";

type StopBag = Set<() => void>;

function stopBag(): StopBag {
  const g = globalThis as typeof globalThis & { [STOP_KEY]?: StopBag };
  if (!g[STOP_KEY]) g[STOP_KEY] = new Set();
  return g[STOP_KEY];
}

/** Kill leftover layout loops before this bundle starts. */
for (const stop of stopBag()) stop();
stopBag().clear();

function trackStop(stop: () => void): () => void {
  const bag = stopBag();
  bag.add(stop);
  return () => {
    stop();
    bag.delete(stop);
  };
}

const rowOrder: string[] = [];
/** Live row roots placed as direct siblings under the vanilla column (like Upgrades). */
const placedRows = new Map<string, HTMLElement>();
const anchorListeners = new Map<string, (anchor: ManagementAnchor | null) => void>();
const columnListeners = new Set<() => void>();

export type ManagementAnchor = {
  expandedWidth: number;
};

function playMenuHover() {
  safe(() => api.sound.play("blip", { playbackRate: 4, volume: 0.05 }));
}

function playMenuClick() {
  safe(() => api.sound.play("click"));
}

type EngineState = {
  store?: { options?: { managementCollapsed?: boolean } };
};

function getStoreOptions(): { managementCollapsed?: boolean } | null {
  const state = sandkit.engine.state as EngineState | undefined;
  return state?.store?.options ?? null;
}

function getManagementCollapsed(): boolean {
  return getStoreOptions()?.managementCollapsed === true;
}

const collapsedListeners = new Set<(collapsed: boolean) => void>();
const hookedOptions = new WeakSet<object>();

function installCollapsedHook(options: { managementCollapsed?: boolean }): void {
  if (hookedOptions.has(options)) return;
  hookedOptions.add(options);
  let value = options.managementCollapsed === true;
  Object.defineProperty(options, "managementCollapsed", {
    configurable: true,
    enumerable: true,
    get() {
      return value;
    },
    set(next: boolean) {
      const v = next === true;
      if (v === value) return;
      value = v;
      for (const fn of collapsedListeners) fn(value);
    },
  });
}

/** Same turn as vanilla `store.options.managementCollapsed = …`. */
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
    if (row.hasAttribute(ROW_ATTR)) continue;
    const text = row.textContent ?? "";
    if (text.includes("Upgrades") || text.includes("pgrades")) return row;
  }
  return null;
}

const VANILLA_COLUMN_SEL =
  "#ui > div.fixed.z-\\[9999\\].pointer-events-none > div.text-white.pointer-events-none";

function findVanillaColumn(): HTMLElement | null {
  return document.querySelector(VANILLA_COLUMN_SEL);
}

function vanillaColumnRows(): HTMLElement[] {
  const col = findVanillaColumn();
  const scope = col ?? document;
  const nodes = scope.querySelectorAll<HTMLElement>(
    ".mb-2.relative.group.cursor-pointer.pointer-events-auto",
  );
  const out: HTMLElement[] = [];
  for (const row of nodes) {
    if (row.hasAttribute(ROW_ATTR)) continue;
    out.push(row);
  }
  return out;
}

function rowStyleWidth(row: HTMLElement): number {
  const sw = row.style.width;
  if (sw.endsWith("px")) return Number.parseFloat(sw);
  return row.getBoundingClientRect().width;
}

/**
 * Resting vanilla row so we copy column collapse, not another row's hover tween.
 * After Toolbox unhover, that row is no longer `:hover` but still 208→52 — skip it
 * and follow a sibling already at the column width (Building / Research / Upgrades).
 */
function findPackRow(): HTMLElement | null {
  const rows = vanillaColumnRows();
  if (rows.length === 0) return null;
  const expected = getManagementCollapsed() ? COLLAPSED_WIDTH_PX : DEFAULT_EXPANDED_WIDTH_PX;
  let best: HTMLElement | null = null;
  let bestDist = Infinity;
  for (const row of rows) {
    if (row.matches(":hover")) continue;
    const dist = Math.abs(rowStyleWidth(row) - expected);
    if (dist < bestDist) {
      bestDist = dist;
      best = row;
    }
  }
  return best ?? rows[0];
}

/**
 * Framer `ease: "easeInOut"` = CSS cubic-bezier(0.42, 0, 0.58, 1).
 * The old 2t² / (1-(2-2t)²)/2 curve is steeper in the middle.
 */
function easeInOut(t: number): number {
  const x1 = 0.42;
  const x2 = 0.58;
  let x = t;
  for (let i = 0; i < 8; i++) {
    const cx = 3 * x1;
    const bx = 3 * (x2 - x1) - cx;
    const ax = 1 - cx - bx;
    const slope = (3 * ax * x + 2 * bx) * x + cx;
    if (Math.abs(slope) < 1e-6) break;
    x -= (((ax * x + bx) * x + cx) * x - t) / slope;
  }
  const cy = 0;
  const by = 3 * (1 - 0) - cy;
  const ay = 1 - cy - by;
  return ((ay * x + by) * x + cy) * x;
}

function setRowWidth(dest: HTMLElement, w: number): void {
  const px = `${w}px`;
  // Vanilla row style is only `width: Npx` (engine also uses min-width:0).
  dest.style.transition = "none";
  dest.style.setProperty("width", px);
  dest.style.minWidth = "0";
  dest.style.overflow = "";
}

function detailProgress(rowWidth: number, expanded: number): number {
  return Math.min(
    1,
    Math.max(0, (rowWidth - COLLAPSED_WIDTH_PX) / Math.max(1, expanded - COLLAPSED_WIDTH_PX)),
  );
}

type MeasuredDetails = {
  destLabel: number;
  destHot: number;
  packLabel: number;
  packHot: number;
};

function cacheNaturals(dest: HTMLElement, pack: HTMLElement, measured: MeasuredDetails): void {
  const destLabel = dest.querySelector<HTMLElement>(".tracking-wider");
  const packLabel = pack.querySelector<HTMLElement>(".tracking-wider");
  const destHot = rowHotkey(dest);
  const packHot = rowHotkey(pack);
  // Only raise naturals — never shrink them mid-tween (framer writes px widths
  // while the row is still 208px at collapse start).
  if (destLabel) {
    const w = destLabel.scrollWidth || destLabel.offsetWidth;
    if (w > measured.destLabel) measured.destLabel = w;
  }
  if (destHot) {
    const w = destHot.scrollWidth || destHot.offsetWidth;
    if (w > measured.destHot) measured.destHot = w;
  }
  if (packLabel) {
    const w = packLabel.scrollWidth || packLabel.offsetWidth;
    if (w > measured.packLabel) measured.packLabel = w;
  }
  if (packHot) {
    const w = packHot.scrollWidth || packHot.offsetWidth;
    if (w > measured.packHot) measured.packHot = w;
  }
}

function widthProgress(src: HTMLElement, natural: number): number {
  const sw = src.style.width;
  if (sw === "0px" || sw === "0") return 0;
  if (natural <= 0) return 0;
  if (sw.endsWith("px")) {
    return Math.min(1, Math.max(0, Number.parseFloat(sw) / natural));
  }
  const laid = src.getBoundingClientRect().width;
  return Math.min(1, Math.max(0, laid / natural));
}

/**
 * Mirror a vanilla label/hotkey node.
 * Vanilla Framer: `animate:{opacity, width, marginLeft}` over 0.2s — opacity
 * fades with width (not a snap). Copy opacity from the pack node.
 * Never set min-width:0 on these nodes (vanilla keeps min-width:auto so flex
 * cannot crush the animated width).
 */
function applyFollow(
  src: HTMLElement | undefined,
  dst: HTMLElement | undefined,
  srcNatural: number,
  dstNatural: number,
  withMargin: boolean,
): void {
  if (!src || !dst) return;
  const sw = src.style.width;
  dst.style.overflow = "";
  dst.style.minWidth = "";
  dst.style.opacity = src.style.opacity !== "" ? src.style.opacity : getComputedStyle(src).opacity;

  if (sw === "0px" || sw === "0") {
    dst.style.width = "0px";
    if (withMargin) dst.style.marginLeft = "0px";
    return;
  }

  // Rest open only — framer uses `auto`. Explicit px (even ≈ natural) must stay px
  // so collapse start (auto→fullPx) stays in lockstep.
  if (sw === "auto" || sw === "") {
    dst.style.width = "auto";
    if (withMargin) dst.style.marginLeft = src.style.marginLeft || "12px";
    return;
  }

  const p = widthProgress(src, srcNatural);
  if (p <= 0.001) {
    dst.style.width = "0px";
    if (withMargin) dst.style.marginLeft = "0px";
    return;
  }
  dst.style.width = `${dstNatural * p}px`;
  if (withMargin) dst.style.marginLeft = src.style.marginLeft || `${12 * p}px`;
}

/** Match vanilla label/hotkey styles driven by the ◀/▶ column toggle. */
function applyDetailsFromPack(
  dest: HTMLElement,
  pack: HTMLElement,
  measured: MeasuredDetails,
): void {
  const packLabel = pack.querySelector<HTMLElement>(".tracking-wider");
  const destLabel = dest.querySelector<HTMLElement>(".tracking-wider");
  const packHot = rowHotkey(pack);
  const destHot = rowHotkey(dest);
  if (packLabel && measured.packLabel <= 0) measured.packLabel = packLabel.scrollWidth;
  if (destLabel && measured.destLabel <= 0) measured.destLabel = destLabel.scrollWidth;
  if (packHot && measured.packHot <= 0) measured.packHot = packHot.scrollWidth;
  if (destHot && measured.destHot <= 0) measured.destHot = destHot.scrollWidth;
  applyFollow(
    packLabel ?? undefined,
    destLabel ?? undefined,
    measured.packLabel,
    measured.destLabel,
    true,
  );
  applyFollow(packHot, destHot, measured.packHot, measured.destHot, false);
}

/**
 * Hover / local tween details. Vanilla Framer:
 * `animate:{opacity: collapsed?0:1, width: collapsed?0:"auto", marginLeft}`
 * `transition:{duration:.2}` — opacity fades with width, it does not snap.
 */
function applyDetails(dest: HTMLElement, p: number, measured: MeasuredDetails): void {
  const label = dest.querySelector<HTMLElement>(".tracking-wider");
  const hot = rowHotkey(dest);
  const apply = (el: HTMLElement | undefined, withMargin: boolean, natural: number) => {
    if (!el) return;
    el.style.overflow = "";
    el.style.minWidth = "";
    el.style.opacity = String(p);
    if (p >= 0.999) {
      el.style.opacity = "1";
      el.style.width = "auto";
      if (withMargin) el.style.marginLeft = "12px";
      return;
    }
    if (p <= 0.001) {
      el.style.opacity = "0";
      el.style.width = "0px";
      if (withMargin) el.style.marginLeft = "0px";
      return;
    }
    el.style.width = `${natural * p}px`;
    if (withMargin) el.style.marginLeft = `${12 * p}px`;
  };
  apply(label ?? undefined, true, measured.destLabel);
  apply(hot, false, measured.destHot);
}

function rowHotkey(row: HTMLElement): HTMLElement | undefined {
  return row.firstElementChild?.children[1] as HTMLElement | undefined;
}

let placeRaf = 0;
let layoutWatchers = 0;
let layoutObserver: MutationObserver | null = null;
let observedRoot: Node | null = null;

function connectLayoutObserver(): void {
  const root = findVanillaColumn() ?? document.body;
  if (observedRoot === root && layoutObserver) return;
  layoutObserver?.disconnect();
  observedRoot = root;
  layoutObserver = new MutationObserver(schedulePlaceAll);
  layoutObserver.observe(root, {
    childList: true,
    subtree: root === document.body,
  });
}

function schedulePlaceAll(): void {
  if (placeRaf) return;
  placeRaf = requestAnimationFrame(() => {
    placeRaf = 0;
    placeAll();
    if (layoutWatchers > 0) connectLayoutObserver();
  });
}

function retainLayoutWatch(): void {
  layoutWatchers += 1;
  if (layoutWatchers !== 1) return;
  connectLayoutObserver();
  window.addEventListener("resize", schedulePlaceAll);
}

function releaseLayoutWatch(): void {
  layoutWatchers -= 1;
  if (layoutWatchers > 0) return;
  layoutObserver?.disconnect();
  layoutObserver = null;
  observedRoot = null;
  window.removeEventListener("resize", schedulePlaceAll);
  if (placeRaf) cancelAnimationFrame(placeRaf);
  placeRaf = 0;
}

trackStop(() => {
  layoutWatchers = 0;
  layoutObserver?.disconnect();
  layoutObserver = null;
  observedRoot = null;
  window.removeEventListener("resize", schedulePlaceAll);
  if (placeRaf) cancelAnimationFrame(placeRaf);
  placeRaf = 0;
});

function placeAll() {
  const options = getStoreOptions();
  if (options) installCollapsedHook(options);

  const upgrades = findUpgradesButton();
  if (!upgrades) {
    for (const id of rowOrder) {
      anchorListeners.get(id)?.(null);
    }
    return;
  }

  const expandedWidth = Math.max(DEFAULT_EXPANDED_WIDTH_PX, upgrades.offsetWidth);
  let previous: HTMLElement = upgrades;

  for (const id of rowOrder) {
    const row = placedRows.get(id);
    const notify = anchorListeners.get(id);
    if (!notify) continue;
    // Notify even before the row DOM exists so the component can mount and place it.
    if (!row) {
      notify({ expandedWidth });
      continue;
    }
    // Direct sibling under the vanilla column — nested spacer/wrap blocked hover.
    if (row.previousElementSibling !== previous || row.parentElement !== previous.parentElement) {
      previous.after(row);
    }
    previous = row;
    notify({ expandedWidth });
  }

  for (const fn of columnListeners) fn();
}

function registerRow(id: string, setAnchor: (anchor: ManagementAnchor | null) => void): () => void {
  if (!rowOrder.includes(id)) rowOrder.push(id);
  anchorListeners.set(id, setAnchor);
  retainLayoutWatch();
  placeAll();

  return () => {
    const index = rowOrder.indexOf(id);
    if (index >= 0) rowOrder.splice(index, 1);
    anchorListeners.delete(id);
    placedRows.delete(id);
    setAnchor(null);
    releaseLayoutWatch();
    placeAll();
  };
}

function setPlacedRow(id: string, row: HTMLElement | null): void {
  if (row) placedRows.set(id, row);
  else placedRows.delete(id);
  placeAll();
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
        if (prev && next && prev.expandedWidth === next.expandedWidth) {
          return prev;
        }
        return next;
      });
    });

    return unregister;
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
 * The row root is placed as a direct sibling of Toolbox / Building / … so
 * hover and clicks match vanilla (nested spacer/wrap blocked pointer hit-testing).
 * Collapse copies a vanilla row's live `width` when that row resizes.
 * Hover uses a local 0.2s ease-in-out tween.
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
  const anchor = useManagementAnchor(id, active);
  const homeRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const hoveredRef = useRef(false);
  const collapsedRef = useRef(getManagementCollapsed());
  const tweenRef = useRef<{ from: number; to: number; start: number } | null>(null);
  const tweenToRef = useRef<(to: number) => void>(() => {});
  const expandedRef = useRef(DEFAULT_EXPANDED_WIDTH_PX);
  const mounted = Boolean(active && anchor);

  if (!mounted) {
    returnRowHome(homeRef.current, rowRef.current);
  }

  useLayoutEffect(() => {
    if (!mounted || !anchor) return;
    const row = rowRef.current;
    if (!row) return;

    setPlacedRow(id, row);

    let raf = 0;
    let live = true;
    let watchedPack: HTMLElement | null = null;
    const WIDTH_MS = 200;
    const measured: MeasuredDetails = { destLabel: 0, destHot: 0, packLabel: 0, packHot: 0 };

    const destRow = () => rowRef.current;

    const syncHoverFlag = () => {
      const dest = destRow();
      if (!dest) return;
      const hot = dest.matches(":hover");
      if (hoveredRef.current && !hot) {
        hoveredRef.current = false;
        tweenToRef.current(collapsedRef.current ? COLLAPSED_WIDTH_PX : expandedRef.current);
      }
    };

    const ensureNaturals = (dest: HTMLElement) => {
      const labelEl = dest.querySelector<HTMLElement>(".tracking-wider");
      const hot = rowHotkey(dest);
      const labelInner = labelEl?.querySelector<HTMLElement>("span.inline-block");
      const hotInner = hot?.querySelector<HTMLElement>("span.inline-block");
      // While collapsed, the wrappers are width:0 — measure the inner nowrap spans.
      if (measured.destLabel <= 0) {
        measured.destLabel =
          labelInner?.scrollWidth || labelEl?.scrollWidth || labelInner?.offsetWidth || 0;
      }
      if (measured.destHot <= 0) {
        measured.destHot = hotInner?.scrollWidth || hot?.scrollWidth || hotInner?.offsetWidth || 0;
      }
      if (measured.destLabel > 0 && measured.destHot > 0) return;
      const pack = findPackRow();
      if (pack) cacheNaturals(dest, pack, measured);
    };

    const applyFromPack = () => {
      if (!live) return;
      const dest = destRow();
      const pack = findPackRow();
      if (!dest || !pack) return;
      const packStyleW = pack.style.width.endsWith("px")
        ? Number.parseFloat(pack.style.width)
        : pack.getBoundingClientRect().width;
      if (packStyleW > COLLAPSED_WIDTH_PX + 8) {
        expandedRef.current = Math.max(DEFAULT_EXPANDED_WIDTH_PX, packStyleW);
      }
      // Naturals only at rest (`width: auto`). Framer switches to px at collapse
      // start while the row is still 208 — caching then poisons progress (~1).
      const packLabel = pack.querySelector<HTMLElement>(".tracking-wider");
      const packHot = rowHotkey(pack);
      const atRest =
        packStyleW >= DEFAULT_EXPANDED_WIDTH_PX - 2 &&
        (packLabel?.style.width === "auto" || packLabel?.style.width === "") &&
        (packHot?.style.width === "auto" || packHot?.style.width === "");
      if (atRest) cacheNaturals(dest, pack, measured);
      setRowWidth(dest, packStyleW);
      applyDetailsFromPack(dest, pack, measured);
    };

    const onPackLayout = () => {
      if (!live) return;
      syncHoverFlag();
      if (hoveredRef.current || tweenRef.current) return;
      applyFromPack();
      armFollowLoop();
    };

    /** Framer updates label/hotkey every frame; keep lockstep even if observers batch. */
    let followRaf = 0;
    const armFollowLoop = () => {
      if (followRaf) return;
      const loop = () => {
        followRaf = 0;
        if (!live || hoveredRef.current || tweenRef.current) return;
        applyFromPack();
        const pack = findPackRow();
        if (!pack) return;
        const w = pack.style.width.endsWith("px")
          ? Number.parseFloat(pack.style.width)
          : pack.getBoundingClientRect().width;
        const packLabel = pack.querySelector<HTMLElement>(".tracking-wider");
        const lw = packLabel?.style.width ?? "";
        const labelMoving = lw.endsWith("px") && Number.parseFloat(lw) > 0.5;
        const rowMoving = w > COLLAPSED_WIDTH_PX + 0.5 && w < expandedRef.current - 0.5;
        if (rowMoving || labelMoving) followRaf = requestAnimationFrame(loop);
      };
      followRaf = requestAnimationFrame(loop);
    };

    const packObserver = new ResizeObserver(onPackLayout);
    // Framer writes label/hotkey `style` after the row width has already settled.
    // ResizeObserver misses that final `width: auto` / opacity snap from the ◀/▶ toggle.
    const packStyleObserver = new MutationObserver(onPackLayout);

    const bindPack = () => {
      if (!live) return;
      const pack = findPackRow();
      if (pack === watchedPack) return;
      packObserver.disconnect();
      packStyleObserver.disconnect();
      watchedPack = pack;
      if (!pack) return;
      packObserver.observe(pack);
      packStyleObserver.observe(pack, {
        attributes: true,
        subtree: true,
        attributeFilter: ["style"],
      });
      if (!hoveredRef.current && !tweenRef.current) applyFromPack();
    };

    const tweenTick = (now: number) => {
      raf = 0;
      if (!live) return;
      const dest = destRow();
      const tw = tweenRef.current;
      if (!dest || !tw) return;
      const t = Math.min(1, (now - tw.start) / WIDTH_MS);
      const w = tw.from + (tw.to - tw.from) * easeInOut(t);
      setRowWidth(dest, w);
      applyDetails(dest, detailProgress(w, expandedRef.current), measured);
      if (t >= 1) {
        tweenRef.current = null;
        if (!hoveredRef.current) applyFromPack();
        return;
      }
      raf = requestAnimationFrame(tweenTick);
    };

    const kickTween = () => {
      if (!live || raf) return;
      raf = requestAnimationFrame(tweenTick);
    };

    /** Vanilla row: `animate:{width: collapsed&&!hovered ? 52 : expanded}` over 0.2s easeInOut. */
    tweenToRef.current = (to: number) => {
      if (!live) return;
      const dest = destRow();
      if (!dest) return;
      ensureNaturals(dest);
      const from = dest.getBoundingClientRect().width;
      if (Math.abs(from - to) < 0.5) {
        tweenRef.current = null;
        setRowWidth(dest, to);
        applyDetails(dest, detailProgress(to, expandedRef.current), measured);
        return;
      }
      tweenRef.current = { from, to, start: performance.now() };
      kickTween();
    };

    const stopCollapsed = subscribeManagementCollapsed((collapsed) => {
      collapsedRef.current = collapsed;
      // Vanilla: `effectiveCollapsed = collapsed && !hovered` — while hovered, stay expanded.
      if (!hoveredRef.current && !tweenRef.current) {
        applyFromPack();
        armFollowLoop();
      }
    });

    bindPack();
    columnListeners.add(bindPack);

    const stop = () => {
      live = false;
      columnListeners.delete(bindPack);
      stopCollapsed();
      packObserver.disconnect();
      packStyleObserver.disconnect();
      tweenToRef.current = () => {};
      if (raf) cancelAnimationFrame(raf);
      if (followRaf) cancelAnimationFrame(followRaf);
      raf = 0;
      followRaf = 0;
      setPlacedRow(id, null);
      returnRowHome(homeRef.current, row);
    };

    return trackStop(stop);
  }, [mounted, anchor, id]);

  if (!mounted || !anchor) return null;

  return (
    <div ref={homeRef} hidden aria-hidden>
      <MenuButton
        rootRef={rowRef}
        icon={icon}
        label={label}
        hotkey={hotkey}
        highlightLetter={highlightLetter}
        liveSync
        rowProps={{ [ROW_ATTR]: id }}
        onMouseEnter={() => {
          hoveredRef.current = true;
          playMenuHover();
          // Vanilla: a = collapsed && !hovered → hover forces expandedWidth.
          tweenToRef.current(expandedRef.current);
        }}
        onMouseLeave={() => {
          hoveredRef.current = false;
          // Vanilla: leave restores collapsed ? 52 : expandedWidth.
          tweenToRef.current(collapsedRef.current ? COLLAPSED_WIDTH_PX : expandedRef.current);
        }}
        onPointerLeave={() => {
          if (!hoveredRef.current) return;
          hoveredRef.current = false;
          tweenToRef.current(collapsedRef.current ? COLLAPSED_WIDTH_PX : expandedRef.current);
        }}
        onClick={() => {
          playMenuClick();
          onClick?.();
        }}
      />
    </div>
  );
}
