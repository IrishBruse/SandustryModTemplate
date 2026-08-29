import { inGame } from "@modkit/utils";
import { formatHealth, getHealth } from "../health/health";
import { modinfo } from "../modinfo";
import { findResourceStack } from "./resourceStack";

const HOST_ATTR = "data-survival-mode-health";

function cloneHealthRow(source: HTMLElement): HTMLElement | null {
  const template = source.querySelector(".text-3xl.px-2.text-outline");
  if (!(template instanceof HTMLElement)) return null;

  const row = template.cloneNode(true) as HTMLElement;
  row.setAttribute(HOST_ATTR, modinfo.id);
  return row;
}

function valueFromRow(row: HTMLElement): HTMLElement | null {
  const valueNode = row.lastElementChild;
  return valueNode instanceof HTMLElement ? valueNode : null;
}

function pathFrom(el: HTMLElement): string | null {
  return el.querySelector("path")?.getAttribute("d") ?? null;
}

function ensureHealthRow(
  stack: HTMLElement,
  source: HTMLElement,
): { row: HTMLElement; valueEl: HTMLElement } | null {
  const existing = stack.querySelector(`[${HOST_ATTR}]`);
  if (existing instanceof HTMLElement) {
    const valueEl = valueFromRow(existing);
    const sameHeart = pathFrom(existing) === pathFrom(source);
    if (existing.classList.contains("text-3xl") && valueEl && sameHeart) {
      if (stack.firstChild !== existing) {
        stack.insertBefore(existing, stack.firstChild);
      }
      return { row: existing, valueEl };
    }
    existing.remove();
  }

  const row = cloneHealthRow(source);
  const valueEl = row ? valueFromRow(row) : null;
  if (!row || !valueEl) return null;

  stack.insertBefore(row, stack.firstChild);
  return { row, valueEl };
}

/** Mount a clone of the JSX health row as the first `div.mb-4` child. */
export function mountHealthRow(source: HTMLElement): () => void {
  let live = true;
  let row: HTMLElement | null = null;
  let valueEl: HTMLElement | null = null;

  function teardownRow() {
    row?.remove();
    row = null;
    valueEl = null;
  }

  function syncRow() {
    if (!live) return;

    if (!inGame()) {
      teardownRow();
      return;
    }

    const stack = findResourceStack();
    if (!stack) return;

    const mounted = ensureHealthRow(stack, source);
    if (!mounted) return;
    row = mounted.row;
    valueEl = mounted.valueEl;
  }

  syncRow();

  const stopFrames = sandkit.api.events.on("frame:render", () => {
    if (!live) return;
    if (row && !row.isConnected) {
      row = null;
      valueEl = null;
    }
    if (valueEl) {
      valueEl.textContent = formatHealth(getHealth());
    }
    if (!row) syncRow();
  });

  return () => {
    live = false;
    stopFrames();
    teardownRow();
  };
}
