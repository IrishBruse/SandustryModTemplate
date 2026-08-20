import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { sandkit } from "../../sandkit";
import { safe } from "../../utils/safe";
import { Interactive } from "../layout/OverlayPanel";
import { MenuButton } from "./MenuButton";

const api = sandkit.api;

const SPACER_ATTR = "data-modkit-management-spacer";
const SPACER_HEIGHT_PX = 42;

/** Registration order so stacked rows stay under Upgrades without overlap. */
const rowOrder: string[] = [];
const spacers = new Map<string, HTMLDivElement>();
const styleListeners = new Map<string, (style: CSSProperties | null) => void>();

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

function placeAll() {
  const upgrades = findUpgradesButton();
  if (!upgrades) {
    for (const id of rowOrder) {
      const spacer = spacers.get(id);
      if (spacer?.parentElement) spacer.remove();
      styleListeners.get(id)?.(null);
    }
    return;
  }

  const width = upgrades.getBoundingClientRect().width;
  let previous: HTMLElement = upgrades;

  for (const id of rowOrder) {
    const spacer = spacers.get(id);
    const notify = styleListeners.get(id);
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

    const rect = spacer.getBoundingClientRect();
    notify({
      position: "fixed",
      top: rect.top,
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
    });
  }
}

function registerRow(id: string, setStyle: (style: CSSProperties | null) => void): () => void {
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

  styleListeners.set(id, setStyle);
  placeAll();

  return () => {
    const index = rowOrder.indexOf(id);
    if (index >= 0) rowOrder.splice(index, 1);
    styleListeners.delete(id);
    const el = spacers.get(id);
    el?.remove();
    spacers.delete(id);
    setStyle(null);
    placeAll();
  };
}

/**
 * Keep flow spacers after Upgrades (so later rows shift down) and return a
 * fixed style that paints the MenuButton over that spacer.
 */
function useManagementAnchor(id: string, active: boolean): CSSProperties | null {
  const [style, setStyle] = useState<CSSProperties | null>(null);
  const styleRef = useRef(setStyle);
  styleRef.current = setStyle;

  useEffect(() => {
    if (!active) {
      setStyle(null);
      return;
    }

    const unregister = registerRow(id, (next) => {
      styleRef.current((prev) => {
        if (
          prev &&
          next &&
          prev.top === next.top &&
          prev.left === next.left &&
          prev.width === next.width
        ) {
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

  return style;
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
  const menuStyle = useManagementAnchor(id, active);

  if (!menuStyle) return null;

  return (
    <div style={menuStyle} className="pointer-events-none">
      <Interactive>
        <MenuButton
          icon={icon}
          label={label}
          hotkey={hotkey}
          highlightLetter={highlightLetter}
          width="100%"
          className="!mb-0"
          onMouseEnter={playMenuHover}
          onClick={() => {
            playMenuClick();
            onClick?.();
          }}
        />
      </Interactive>
    </div>
  );
}
