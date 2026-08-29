import { useLayoutEffect } from "react";

/** Pause menu layer on `#ui` (see sandustry-ui dom.md). */
const PAUSE_Z = 10010;
/** Above pause so Dev Tools is clickable. */
export const DEV_TOOLS_Z = Math.max(PAUSE_Z + 40, 10050);

/**
 * Raise the `#ui` inject host above the pause layer while mounted.
 * `api.ui.inject` mounts under `z-[10005]`; a child z-index cannot escape that context.
 */
export function useAbovePauseMenu(active: boolean): void {
  useLayoutEffect(() => {
    if (!active) return;

    const ui = document.getElementById("ui");
    const dialog = document.querySelector('[aria-label="Dev Tools"]');
    if (!ui || !dialog) return;

    let host: HTMLElement | null = dialog.parentElement;
    while (host && host.parentElement !== ui) {
      host = host.parentElement;
    }
    if (!host) return;

    const prev = host.style.zIndex;
    host.style.zIndex = String(DEV_TOOLS_Z);
    return () => {
      host!.style.zIndex = prev;
    };
  }, [active]);
}
