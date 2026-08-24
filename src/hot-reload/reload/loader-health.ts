import { modinfo } from "../mod";

const RESTART_STORAGE_KEY = "irishbruse.debug:restartNeeded";
const INJECT_PATCHED_KEY = "__sandkitInjectDisposePatched__";
const REGISTRY_KEY = "__sandkitLocalModRegistry__";

type HealthGlobals = {
  [INJECT_PATCHED_KEY]?: boolean;
  [REGISTRY_KEY]?: Record<string, unknown>;
};

function toast(api: SandkitApi, message: string): void {
  api.ui.toast(message, {});
}

function readRestartMessage(): string | null {
  try {
    return sessionStorage.getItem(RESTART_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeRestartMessage(message: string): void {
  try {
    sessionStorage.setItem(RESTART_STORAGE_KEY, message);
  } catch {
    /* sessionStorage can throw in some embeds */
  }
}

/** Toast and remember across a page reload. Process restart clears sessionStorage. */
export function noteRestartNeeded(api: SandkitApi, message: string): void {
  writeRestartMessage(message);
  toast(api, message);
  console.warn(message);
}

/** After a renderer reload, repeat the restart toast if patches/worker still need a process restart. */
export function remindRestartIfNeeded(api: SandkitApi): void {
  const message = readRestartMessage();
  if (!message) return;
  toast(api, message);
  console.warn(message);
}

/**
 * Loader patches apply in Electron main. A miss still boots the file unpatched.
 * Compile miss throws on free `reloaded` before this runs.
 */
export function probeLoaderPatches(api: SandkitApi): void {
  const g = globalThis as typeof globalThis & HealthGlobals;
  const issues: string[] = [];
  if (typeof reloaded !== "boolean") issues.push("reloaded binding");
  if (g[REGISTRY_KEY]?.[modinfo.id] == null) issues.push("local-mod registry");
  if (g[INJECT_PATCHED_KEY] !== true) issues.push("ui.inject tracking");
  if (issues.length === 0) return;
  const message = `Debug loader patches missing (${issues.join(", ")}). Restart the game.`;
  toast(api, message);
  console.warn(message);
}

export function logRendererReload(): void {
  const entries = performance.getEntriesByType("navigation");
  const nav = entries[0] as PerformanceNavigationTiming | undefined;
  if (nav?.type !== "reload") return;
  console.info("renderer reload — patches.json is not re-applied");
}
