/**
 * Open/close the engine Debug window (Spawn / Overlays / Lighting / …).
 * That UI only mounts when `gameConfig.debug.active` is true (synced from the
 * mod Debug setting). The engine also mounts plain Debug / Stats buttons —
 * those are hidden while Debug is on.
 */

const OPEN_ROOT = ".fixed.pointer-events-none.z-\\[9999\\]";

function isEngineDebugOpenButton(button: HTMLButtonElement): boolean {
  return (
    button.textContent?.trim() === "Debug" &&
    button.classList.contains("pointer-events-auto") &&
    button.className.includes("bg-opacity-75") &&
    !button.className.includes("ui-box")
  );
}

function isEngineStatsButton(button: HTMLButtonElement): boolean {
  const label = button.textContent?.trim() ?? "";
  return (
    (label === "Stats ▸" || label === "Stats >" || label.startsWith("Stats")) &&
    button.classList.contains("pointer-events-auto") &&
    button.className.includes("bg-opacity-75") &&
    button.className.includes("text-[10px]")
  );
}

function hideButton(button: HTMLButtonElement): void {
  if (button.dataset.modkitHiddenEngineDebug === "1") return;
  button.dataset.modkitHiddenEngineDebug = "1";
  button.style.setProperty("display", "none", "important");
}

/** Hide the engine's plain Debug / Stats buttons under the management column. */
export function hideEngineDebugButtons(): void {
  for (const button of document.querySelectorAll("button")) {
    if (!(button instanceof HTMLButtonElement)) continue;
    if (isEngineDebugOpenButton(button) || isEngineStatsButton(button)) {
      hideButton(button);
    }
  }
}

function isEngineDebugPanelOpen(): boolean {
  const root = document.querySelector(OPEN_ROOT);
  if (!root) return false;
  for (const el of root.querySelectorAll(".text-xs.uppercase.tracking-wider")) {
    if (el.textContent?.trim() === "Debug") return true;
  }
  return false;
}

function clickEngineDebugClose(): boolean {
  const root = document.querySelector(OPEN_ROOT);
  if (!root) return false;
  const closeBtn = [...root.querySelectorAll("button")].find((b) => b.textContent?.trim() === "✕");
  if (!closeBtn) return false;
  closeBtn.click();
  return true;
}

function clickEngineDebugOpen(): boolean {
  const openBtn = [...document.querySelectorAll("button")].find(
    (b) => b instanceof HTMLButtonElement && isEngineDebugOpenButton(b),
  );
  if (!openBtn) return false;
  openBtn.click();
  return true;
}

/** Returns true when the engine panel was toggled. */
export function toggleEngineDebugPanel(): boolean {
  if (isEngineDebugPanelOpen()) return clickEngineDebugClose();
  return clickEngineDebugOpen();
}
