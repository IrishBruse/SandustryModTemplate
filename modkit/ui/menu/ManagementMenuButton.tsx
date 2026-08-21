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
      value = next === true;
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
    if (row.hasAttribute(SPACER_ATTR) || row.hasAttribute(ROW_ATTR)) continue;
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
    if (row.hasAttribute(SPACER_ATTR) || row.hasAttribute(ROW_ATTR)) continue;
    out.push(row);
  }
  return out;
}

/** Resting vanilla row (not hovered) so we copy column collapse, not hover-expand. */
function findPackRow(): HTMLElement | null {
  for (const row of vanillaColumnRows()) {
    if (row.matches(":hover")) continue;
    return row;
  }
  return vanillaColumnRows()[0] ?? null;
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

function setRowWidth(dest: HTMLElement, spacer: HTMLDivElement, wrap: HTMLElement, w: number): void {
  const px = `${w}px`;
  dest.style.transition = "none";
  spacer.style.transition = "none";
  wrap.style.transition = "none";
  dest.style.setProperty("width", px);
  dest.style.minWidth = "0";
  dest.style.overflow = "hidden";
  spacer.style.setProperty("width", px);
  spacer.style.minWidth = "0";
  spacer.style.overflow = "hidden";
  spacer.style.alignSelf = "flex-start";
  wrap.style.width = px;
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
  if (destLabel) measured.destLabel = destLabel.offsetWidth || measured.destLabel;
  if (destHot) measured.destHot = destHot.offsetWidth || measured.destHot;
  if (packLabel) measured.packLabel = packLabel.offsetWidth || measured.packLabel;
  if (packHot) measured.packHot = packHot.offsetWidth || measured.packHot;
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

function applyFollow(src: HTMLElement | undefined, dst: HTMLElement | undefined, srcNatural: number, dstNatural: number, withMargin: boolean): void {
  if (!src || !dst) return;
  const p = widthProgress(src, srcNatural);
  dst.style.minWidth = "0px";
  dst.style.overflow = "";
  dst.style.opacity = p <= 0.001 ? "0" : "1";
  if (p <= 0.001) {
    dst.style.width = "0px";
    if (withMargin) dst.style.marginLeft = "0px";
    return;
  }
  if (p >= 0.999) {
    dst.style.width = "auto";
    if (withMargin) dst.style.marginLeft = src.style.marginLeft || "12px";
    return;
  }
  dst.style.width = `${dstNatural * p}px`;
  if (withMargin) dst.style.marginLeft = src.style.marginLeft || `${12 * p}px`;
}

/** Match vanilla label/hotkey: clip width, keep opacity 1 until width is 0. */
function applyDetailsFromPack(dest: HTMLElement, pack: HTMLElement, measured: MeasuredDetails): void {
  const packLabel = pack.querySelector<HTMLElement>(".tracking-wider");
  const destLabel = dest.querySelector<HTMLElement>(".tracking-wider");
  const packHot = rowHotkey(pack);
  const destHot = rowHotkey(dest);
  if (packLabel && measured.packLabel <= 0) measured.packLabel = packLabel.scrollWidth;
  if (destLabel && measured.destLabel <= 0) measured.destLabel = destLabel.scrollWidth;
  if (packHot && measured.packHot <= 0) measured.packHot = packHot.scrollWidth;
  if (destHot && measured.destHot <= 0) measured.destHot = destHot.scrollWidth;
  applyFollow(packLabel ?? undefined, destLabel ?? undefined, measured.packLabel, measured.destLabel, true);
  applyFollow(packHot, destHot, measured.packHot, measured.destHot, false);
}

/** Hover tween: same clip behaviour, progress from dest row width. */
function applyDetails(dest: HTMLElement, p: number, measured: MeasuredDetails): void {
  const label = dest.querySelector<HTMLElement>(".tracking-wider");
  const hot = rowHotkey(dest);
  const apply = (el: HTMLElement | undefined, withMargin: boolean, natural: number) => {
    if (!el) return;
    el.style.overflow = "";
    el.style.minWidth = "0px";
    el.style.opacity = p <= 0.001 ? "0" : "1";
    if (p >= 0.999) {
      el.style.width = "auto";
      if (withMargin) el.style.marginLeft = "12px";
      return;
    }
    if (p <= 0.001) {
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

function px(n: number): number {
  return Math.round(n * 10) / 10;
}

function rowMotion(row: HTMLElement): Record<string, unknown> {
  const label = row.querySelector<HTMLElement>(".tracking-wider");
  const hot = rowHotkey(row);
  const text = (row.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 20);
  return {
    text,
    sw: row.style.width,
    w: px(row.getBoundingClientRect().width),
    lop: label?.style.opacity ?? "",
    cop: label ? getComputedStyle(label).opacity : "",
    lw: label?.style.width ?? "",
    lr: label ? px(label.getBoundingClientRect().width) : 0,
    hop: hot?.style.opacity ?? "",
    hw: hot?.style.width ?? "",
    hr: hot ? px(hot.getBoundingClientRect().width) : 0,
  };
}

function isMovingWidth(w: number): boolean {
  return w > COLLAPSED_WIDTH_PX + 1 && w < DEFAULT_EXPANDED_WIDTH_PX - 1;
}

function rowHotkey(row: HTMLElement): HTMLElement | undefined {
  return row.firstElementChild?.children[1] as HTMLElement | undefined;
}

function rowBadge(row: HTMLElement): HTMLElement | null {
  const hot = rowHotkey(row);
  if (!hot) return null;
  const ours = hot.querySelector<HTMLElement>("span.inline-flex");
  if (ours) return ours;
  const nodes = [hot, ...Array.from(hot.querySelectorAll<HTMLElement>("*"))];
  for (let i = nodes.length - 1; i >= 0; i--) {
    if (getComputedStyle(nodes[i]).boxShadow !== "none") return nodes[i];
  }
  return hot;
}

function rowBar(row: HTMLElement): HTMLElement | null {
  return row.firstElementChild as HTMLElement | null;
}

/** Ancestors whose overflow is not visible and whether they cut the badge bottom. */
function clipChain(badge: HTMLElement): Array<Record<string, unknown>> {
  const br = badge.getBoundingClientRect();
  const hits: Array<Record<string, unknown>> = [];
  let node: HTMLElement | null = badge;
  let depth = 0;
  while (node && depth < 16) {
    const s = getComputedStyle(node);
    if (s.overflowX !== "visible" || s.overflowY !== "visible") {
      const r = node.getBoundingClientRect();
      hits.push({
        d: depth,
        id: node.getAttribute(ROW_ATTR) ?? node.getAttribute(SPACER_ATTR) ?? "",
        cls: String(node.className).replace(/\s+/g, " ").slice(0, 72),
        ov: `${s.overflowX}/${s.overflowY}`,
        h: px(r.height),
        bottom: px(r.bottom),
        badgeBottom: px(br.bottom),
        clipY: br.bottom > r.bottom + 0.5,
        clipX: br.right > r.right + 0.5,
      });
    }
    node = node.parentElement;
    depth += 1;
  }
  return hits;
}

function menuCssSnapshot(
  dest: HTMLElement,
  pack: HTMLElement,
  spacer: HTMLDivElement,
  wrap: HTMLElement,
  hovered: boolean,
): Record<string, unknown> {
  const destBadge = rowBadge(dest);
  const packBadge = rowBadge(pack);
  return {
    hovered,
    spacerH: spacer.style.height,
    spacerOv: `${getComputedStyle(spacer).overflowX}/${getComputedStyle(spacer).overflowY}`,
    wrap: boxSnap(wrap),
    dest: boxSnap(dest),
    destBar: boxSnap(rowBar(dest)),
    destHot: boxSnap(rowHotkey(dest) ?? null),
    destBadge: boxSnap(destBadge),
    destLabel: boxSnap(dest.querySelector(".tracking-wider")),
    pack: boxSnap(pack),
    packBar: boxSnap(rowBar(pack)),
    packHot: boxSnap(rowHotkey(pack) ?? null),
    packBadge: boxSnap(packBadge),
    packLabel: boxSnap(pack.querySelector(".tracking-wider")),
    clip: destBadge ? clipChain(destBadge) : [],
  };
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
    spacer.style.minWidth = "0";
    spacer.style.overflow = "hidden";
    spacer.style.alignSelf = "flex-start";
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
 * Collapse copies a vanilla row's live `width` (framer-motion) each frame.
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
  const wrapRef = useRef<HTMLDivElement>(null);
  const hoveredRef = useRef(false);
  const collapsedRef = useRef(getManagementCollapsed());
  const tweenRef = useRef<{ from: number; to: number; start: number } | null>(null);
  const expandedRef = useRef(DEFAULT_EXPANDED_WIDTH_PX);
  const mounted = Boolean(active && anchor);

  if (!mounted) {
    returnRowHome(homeRef.current, wrapRef.current);
  }

  useLayoutEffect(() => {
    if (!mounted || !anchor) return;
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (wrap.parentElement !== anchor.spacer) anchor.spacer.appendChild(wrap);

    const spacer = anchor.spacer;
    let raf = 0;
    const WIDTH_MS = 200;
    let lastCssAt = 0;
    const measured: MeasuredDetails = { destLabel: 0, destHot: 0, packLabel: 0, packHot: 0 };

    const targetWidth = () =>
      collapsedRef.current && !hoveredRef.current ? COLLAPSED_WIDTH_PX : expandedRef.current;

    const stopCollapsed = subscribeManagementCollapsed((collapsed) => {
      collapsedRef.current = collapsed;
      console.log("[menu-diff]", {
        t: Math.round(performance.now()),
        event: collapsed ? "collapse" : "expand",
        col: Boolean(findVanillaColumn()),
      });
    });

    const tick = (now: number) => {
      const dest = spacer.querySelector<HTMLElement>(`[${ROW_ATTR}]`);
      const pack = findPackRow();
      if (!dest || !pack) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const packStyleW = pack.style.width.endsWith("px")
        ? Number.parseFloat(pack.style.width)
        : pack.getBoundingClientRect().width;
      if (packStyleW > COLLAPSED_WIDTH_PX + 8) {
        expandedRef.current = Math.max(DEFAULT_EXPANDED_WIDTH_PX, packStyleW);
      }
      if (packStyleW >= DEFAULT_EXPANDED_WIDTH_PX - 2) {
        cacheNaturals(dest, pack, measured);
      }
      const expanded = expandedRef.current;

      if (hoveredRef.current || tweenRef.current) {
        const to = targetWidth();
        if (!tweenRef.current || tweenRef.current.to !== to) {
          tweenRef.current = {
            from: dest.getBoundingClientRect().width,
            to,
            start: now,
          };
        }
        const tw = tweenRef.current;
        const t = Math.min(1, (now - tw.start) / WIDTH_MS);
        const w = tw.from + (tw.to - tw.from) * easeInOut(t);
        setRowWidth(dest, spacer, wrap, w);
        applyDetails(dest, detailProgress(w, expanded), measured);
        if (t >= 1) tweenRef.current = null;
      } else {
        setRowWidth(dest, spacer, wrap, packStyleW);
        applyDetailsFromPack(dest, pack, measured);
      }

      const destM = rowMotion(dest);
      const vanilla = vanillaColumnRows().map(rowMotion);
      const upgrades =
        vanilla.find((row) => String(row.text).includes("pgrades")) ?? vanilla[vanilla.length - 1];
      const destW = Number(destM.w);
      const upgW = upgrades ? Number(upgrades.w) : 0;
      const moving =
        isMovingWidth(destW) || vanilla.some((row) => isMovingWidth(Number(row.w)));
      const dW = px(destW - upgW);
      if (moving || Math.abs(dW) > 0.3 || now - lastCssAt > 2000) {
        lastCssAt = now;
        console.log("[menu-diff]", {
          t: Math.round(now),
          hovered: hoveredRef.current,
          collapsed: collapsedRef.current,
          dW,
          dest: destM,
          vanilla,
        });
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      stopCollapsed();
      cancelAnimationFrame(raf);
      returnRowHome(homeRef.current, wrap);
    };
  }, [mounted, anchor, id]);

  if (!mounted || !anchor) return null;

  return (
    <div ref={homeRef} hidden aria-hidden>
      <div
        ref={wrapRef}
        className="pointer-events-none"
        style={{ overflow: "hidden", minWidth: 0 }}
      >
        <Interactive>
          <MenuButton
            icon={icon}
            label={label}
            hotkey={hotkey}
            highlightLetter={highlightLetter}
            liveSync
            className="!mb-0"
            rowProps={{ [ROW_ATTR]: id }}
            onMouseEnter={() => {
              hoveredRef.current = true;
              playMenuHover();
              const dest = wrapRef.current?.querySelector<HTMLElement>(`[${ROW_ATTR}]`);
              if (dest) {
                tweenRef.current = {
                  from: dest.getBoundingClientRect().width,
                  to: expandedRef.current,
                  start: performance.now(),
                };
              }
            }}
            onMouseLeave={() => {
              hoveredRef.current = false;
              const dest = wrapRef.current?.querySelector<HTMLElement>(`[${ROW_ATTR}]`);
              if (dest) {
                const to = collapsedRef.current ? COLLAPSED_WIDTH_PX : expandedRef.current;
                tweenRef.current = {
                  from: dest.getBoundingClientRect().width,
                  to,
                  start: performance.now(),
                };
              }
            }}
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
