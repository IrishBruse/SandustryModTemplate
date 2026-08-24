import type { HotReloadFallback } from "../boot/settings";

export type MainReloadAction = "eval" | "skip" | "reload";

/**
 * What to do when local `main.js` bytes change.
 * Default **toast** still evaluates so mods without `onDispose` can iterate.
 */
export function planMainReload(
  hasDisposers: boolean,
  fallback: HotReloadFallback,
): MainReloadAction {
  if (hasDisposers) return "eval";
  if (fallback === "off") return "skip";
  if (fallback === "reload") return "reload";
  return "eval";
}

/** Console (and optional toast) when eval runs with an empty dispose list. */
export function shouldWarnNoDispose(hasDisposers: boolean, action: MainReloadAction): boolean {
  return action === "eval" && !hasDisposers;
}
