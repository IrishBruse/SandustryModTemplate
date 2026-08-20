import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { sandkit } from "../../sandkit";
import { safe } from "../../utils/safe";
import { Interactive } from "../layout/OverlayPanel";
import { MenuButton } from "./MenuButton";

const api = sandkit.api;

const SPACER_ATTR = "data-modkit-management-spacer";
const SPACER_HEIGHT_PX = 42;
/** Vanilla collapsed management rows are icon-only (~square). */
const COLLAPSED_WIDTH_PX = 80;

/** Registration order so stacked rows stay under Upgrades without overlap. */
const rowOrder: string[] = [];
const spacers = new Map<string, HTMLDivElement>();
const anchorListeners = new Map<string, (anchor: ManagementAnchor | null) => void>();

export type ManagementAnchor = {
  spacer: HTMLDivElement;
  collapsed: boolean;
};

function playMenuHover() {
  safe(() => api.sound.play("blip", { playbackRate: 4, volume: 0.05 }));
}

function playMenuClick() {
  safe(() => api.sound.play("click"));
}

/** Find the Upgrades management row so rows can sit under it in the same column. */
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

function isManagementCollapsed(upgrades: HTMLElement): boolean {
  const label = upgrades.querySelector<HTMLElement>(".tracking-wider");
  if (label) {
    const opacity = Number.parseFloat(getComputedStyle(label).opacity);
    if (opacity === 0) return true;
  }
  return upgrades.getBoundingClientRect().width < COLLAPSED_WIDTH_PX;
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

  const width = upgrades.getBoundingClientRect().width;
  const collapsed = isManagementCollapsed(upgrades);
  let previous: HTMLElement = upgrades;

  for (const id of rowOrder) {
    const spacer = spacers.get(id);
    const notify = anchorListeners.get(id);
    if (!spacer || !notify) continue;

    spacer.style.width = `${width}px`;
    spacer.style.height = `${SPACER_HEIGHT_PX}px`;

    if (
      spacer.previousElementSibling !== previous ||
      spacer.parentElement !== previous.parentElement
    ) {
      previous.after(spacer);
    }
    previous = spacer;

    notify({ spacer, collapsed });
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

/**
 * Keep flow spacers after Upgrades (so later rows shift down) and expose the
 * spacer node so the row paints inside the management column stacking context.
 */
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
        if (prev && next && prev.spacer === next.spacer && prev.collapsed === next.collapsed) {
          return prev;
        }
        return next;
      });
    });

    const observer = new MutationObserver(placeAll);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    window.addEventListener("resize", placeAll);
    const timer = window.setInterval(placeAll, 500);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", placeAll);
      window.clearInterval(timer);
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
  /** Stable id for spacer stacking (unique per mod row). */
  id: string;
  icon: ReactNode;
  label: string;
  hotkey: string;
  highlightLetter?: string;
  /** When false, the row and spacer are removed. Default true. */
  active?: boolean;
  onClick?: () => void;
};

/**
 * Vanilla-style management column row under Upgrades (Toolbox / Building / …).
 * Plays the same hover `blip` / click `click` cues when those sounds exist.
 *
 * The row DOM is moved into a flow spacer under Upgrades so it shares that
 * column's stacking context (fixed + high z-index painted above Debug panels).
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
  const mounted = Boolean(active && anchor);

  // Before React commits an unmount, put the row back under its React parent.
  if (!mounted) {
    returnRowHome(homeRef.current, rowRef.current);
  }

  useLayoutEffect(() => {
    if (!mounted || !anchor) return;
    const row = rowRef.current;
    if (!row) return;
    if (row.parentElement !== anchor.spacer) anchor.spacer.appendChild(row);

    return () => {
      returnRowHome(homeRef.current, row);
    };
  }, [mounted, anchor]);

  if (!mounted || !anchor) return null;

  return (
    <div ref={homeRef} hidden aria-hidden>
      <div ref={rowRef} className="pointer-events-none w-full h-full">
        <Interactive>
          <MenuButton
            icon={icon}
            label={label}
            hotkey={hotkey}
            highlightLetter={highlightLetter}
            width="100%"
            collapsed={anchor.collapsed}
            className="!mb-0"
            onMouseEnter={playMenuHover}
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
