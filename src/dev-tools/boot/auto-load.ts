import { AUTO_LOAD_SAVE_ID_STORAGE_KEY, AUTO_LOAD_STORAGE_KEY } from "./fast-boot-keys.ts";

/** Query keys that already start a game boot (same list as the game bundle). */
export const BOOT_QUERY_KEYS = [
  "new_game",
  "load",
  "db_load",
  "file_load",
  "custom_map",
  "external_map",
] as const;

/** sessionStorage key — skip auto-load after exit to main menu (page reload). */
export const AUTO_LOAD_SESSION_KEY = "dev-tools.autoLoadDone";

export type AutoLoadContext = {
  search: string;
  autoLoadEnabled: boolean;
  saveId: string | null;
  sessionDone: boolean;
  inGame: boolean;
};

/** True when the page URL already asks the game to boot a world. */
export function isBootQueryActive(search = window.location.search): boolean {
  const params = new URLSearchParams(search);
  return BOOT_QUERY_KEYS.some((key) => params.has(key));
}

/** True when this browser session already ran auto-load (early patch or late fallback). */
export function autoLoadSessionDone(): boolean {
  try {
    return sessionStorage.getItem(AUTO_LOAD_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function markAutoLoadSessionDone(): void {
  try {
    sessionStorage.setItem(AUTO_LOAD_SESSION_KEY, "1");
  } catch {
    /* sessionStorage can throw in some embeds */
  }
}

/** Build the `?db_load=` URL used by early and late auto-load redirects. */
export function buildAutoLoadUrl(saveId: string, href = window.location.href): URL {
  const url = new URL(href);
  url.search = "";
  url.searchParams.set("db_load", saveId);
  return url;
}

/** Shared gate for early patch IIFE and late `tryAutoLoadSave`. */
export function shouldAutoLoad(ctx: AutoLoadContext): boolean {
  if (ctx.inGame || ctx.sessionDone || !ctx.autoLoadEnabled || !ctx.saveId) return false;
  return !isBootQueryActive(ctx.search);
}

/**
 * Early auto-load IIFE inserted into `js/bundle.js` before mods run.
 * Reads the same localStorage keys mirrored by `syncFastBootPrefs`.
 */
export function earlyAutoLoadPatchIife(): string {
  const keys = JSON.stringify(BOOT_QUERY_KEYS);
  return `(function(){try{if(localStorage.getItem(${JSON.stringify(AUTO_LOAD_STORAGE_KEY)})!=="true"||sessionStorage.getItem(${JSON.stringify(AUTO_LOAD_SESSION_KEY)}))return;const p=new URLSearchParams(location.search);if(${keys}.some(function(k){return p.has(k)}))return;const id=localStorage.getItem(${JSON.stringify(AUTO_LOAD_SAVE_ID_STORAGE_KEY)});if(!id)return;sessionStorage.setItem(${JSON.stringify(AUTO_LOAD_SESSION_KEY)},"1");const u=new URL(location.href);u.search="";u.searchParams.set("db_load",id);location.replace(u.toString())}catch(e){}})();`;
}
