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

function vanillaRows(): HTMLElement[] {
  const nodes = document.querySelectorAll<HTMLElement>(
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
  for (const row of vanillaRows()) {
    if (row.matches(":hover")) continue;
    return row;
  }
  return vanillaRows()[0] ?? null;
}

function copyRowWidth(source: HTMLElement, dest: HTMLElement, spacer: HTMLDivElement): void {
  spacer.style.transition = "none";
  dest.style.transition = "none";
  const width = `${source.getBoundingClientRect().width}px`;
  dest.style.width = width;
  spacer.style.width = width;
}

function detailProgress(rowWidth: number, expanded: number): number {
  return Math.min(
    1,
    Math.max(0, (rowWidth - COLLAPSED_WIDTH_PX) / Math.max(1, expanded - COLLAPSED_WIDTH_PX)),
  );
}

type MeasuredDetails = { label: number; hot: number };

/** Same ease as the row: opacity and width use progress from 52px ↔ expanded. */
function applyDetails(dest: HTMLElement, p: number, measured: MeasuredDetails): void {
  const label = dest.querySelector<HTMLElement>(".tracking-wider");
  const hot = dest.firstElementChild?.children[1] as HTMLElement | undefined;

  const apply = (el: HTMLElement | null | undefined, withMargin: boolean, natural: number) => {
    if (!el) return;
    el.style.overflow = "";
    if (p >= 0.999) {
      el.style.opacity = "1";
      el.style.width = "auto";
      el.style.minWidth = "";
      if (withMargin) el.style.marginLeft = "12px";
      return;
    }
    if (p <= 0.001) {
      el.style.opacity = "0";
      el.style.width = "0px";
      el.style.minWidth = "0px";
      if (withMargin) el.style.marginLeft = "0px";
      return;
    }
    el.style.opacity = String(p);
    el.style.width = `${natural * p}px`;
    el.style.minWidth = "0px";
    if (withMargin) el.style.marginLeft = `${12 * p}px`;
  };

  if (p >= 0.999) {
    apply(label, true, 0);
    apply(hot, false, 0);
    if (label) measured.label = label.offsetWidth;
    if (hot) measured.hot = hot.offsetWidth;
    return;
  }

  apply(label, true, measured.label);
  apply(hot, false, measured.hot);
}

function easeInOut(t: number): number {
  return t * t * (3 - 2 * t);
}

function px(n: number): number {
  return Math.round(n * 10) / 10;
}

function boxSnap(el: HTMLElement | null | undefined) {
  if (!el) return null;
  const s = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  return {
    w: px(r.width),
    h: px(r.height),
    oh: el.offsetHeight,
    ch: el.clientHeight,
    ov: `${s.overflowX}/${s.overflowY}`,
    height: s.height,
    boxShadow: s.boxShadow === "none" ? "none" : s.boxShadow.slice(0, 80),
  };
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
  const anchor = useManagementAnchor(id, active);
  const homeRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const hoveredRef = useRef(false);
  const unhoveringRef = useRef(false);
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
    let lastCssKey = "";
    let lastCssAt = 0;
    const measured: MeasuredDetails = { label: 0, hot: 0 };

    const tick = (now: number) => {
      const dest = spacer.querySelector<HTMLElement>(`[${ROW_ATTR}]`);
      const pack = findPackRow();
      if (!dest || !pack) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const packW = pack.getBoundingClientRect().width;
      if (packW > COLLAPSED_WIDTH_PX + 8) {
        expandedRef.current = Math.max(DEFAULT_EXPANDED_WIDTH_PX, packW);
      }
      const expanded = expandedRef.current;
      const destW = dest.getBoundingClientRect().width;
      spacer.style.transition = "none";
      dest.style.transition = "none";

      if (hoveredRef.current) {
        unhoveringRef.current = false;
        const to = expanded;
        if (!tweenRef.current || tweenRef.current.to !== to) {
          tweenRef.current = { from: destW, to, start: now };
        }
        const t = Math.min(1, (now - tweenRef.current.start) / WIDTH_MS);
        const w = tweenRef.current.from + (to - tweenRef.current.from) * easeInOut(t);
        dest.style.width = `${w}px`;
        spacer.style.width = `${w}px`;
        applyDetails(dest, detailProgress(w, expanded), measured);
        if (t >= 1) tweenRef.current = null;
      } else if (unhoveringRef.current) {
        const to = packW;
        if (!tweenRef.current || tweenRef.current.to !== to) {
          tweenRef.current = { from: destW, to, start: now };
        }
        const t = Math.min(1, (now - tweenRef.current.start) / WIDTH_MS);
        const w = tweenRef.current.from + (to - tweenRef.current.from) * easeInOut(t);
        dest.style.width = `${w}px`;
        spacer.style.width = `${w}px`;
        applyDetails(dest, detailProgress(w, expanded), measured);
        if (t >= 1 || Math.abs(w - to) < 0.5) {
          tweenRef.current = null;
          unhoveringRef.current = false;
        }
      } else {
        tweenRef.current = null;
        copyRowWidth(pack, dest, spacer);
        applyDetails(dest, detailProgress(packW, expanded), measured);
      }

      const snap = menuCssSnapshot(dest, pack, spacer, wrap, hoveredRef.current);
      const key = JSON.stringify(snap);
      if (key !== lastCssKey || now - lastCssAt > 2000) {
        lastCssKey = key;
        lastCssAt = now;
        console.log("[menu-css]", id, snap);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      returnRowHome(homeRef.current, wrap);
    };
  }, [mounted, anchor]);

  if (!mounted || !anchor) return null;

  return (
    <div ref={homeRef} hidden aria-hidden>
      <div
        ref={wrapRef}
        className="pointer-events-none"
        style={{ width: "100%", overflow: "visible" }}
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
            }}
            onMouseLeave={() => {
              hoveredRef.current = false;
              unhoveringRef.current = true;
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
