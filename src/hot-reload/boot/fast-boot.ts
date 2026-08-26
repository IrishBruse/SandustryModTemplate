import { resolveAutoLoadSaveId } from "./auto-load-save.ts";
import {
  AUTO_LOAD_SAVE_ID_STORAGE_KEY,
  AUTO_LOAD_STORAGE_KEY,
  FAST_BOOT_STORAGE_KEY,
} from "./fast-boot-keys.ts";
import { autoLoadOn, settingOn } from "./settings.ts";
import { writeSkipShaderRecomp } from "./skip-shader-recomp.ts";

export {
  AUTO_LOAD_SAVE_ID_STORAGE_KEY,
  AUTO_LOAD_STORAGE_KEY,
  FAST_BOOT_STORAGE_KEY,
} from "./fast-boot-keys.ts";

export {
  AUTO_LOAD_SESSION_KEY,
  LEGACY_AUTO_LOAD_SESSION_KEY,
  autoLoadSessionDone,
  markAutoLoadSessionDone,
} from "./auto-load.ts";

function writeLocalStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* localStorage can throw in some embeds */
  }
}

function removeLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    /* localStorage can throw in some embeds */
  }
}

/**
 * Mirror boot prefs to localStorage so debugPatches can act before mods and assets load.
 * Fast boot also enables shader skip and auto-load mirrors when those settings are on.
 */
export function syncFastBootPrefs(api: SandkitApi): void {
  const fastBoot = settingOn(api, "fastBoot");
  const autoLoad = fastBoot || autoLoadOn(api);
  const skipShader = fastBoot || settingOn(api, "skipShaderRecomp");

  writeLocalStorage(FAST_BOOT_STORAGE_KEY, String(fastBoot));
  writeLocalStorage(AUTO_LOAD_STORAGE_KEY, String(autoLoad));
  writeSkipShaderRecomp(skipShader);

  if (autoLoad) {
    const saveId = resolveAutoLoadSaveId(api);
    if (saveId) writeLocalStorage(AUTO_LOAD_SAVE_ID_STORAGE_KEY, saveId);
    else removeLocalStorage(AUTO_LOAD_SAVE_ID_STORAGE_KEY);
  } else {
    removeLocalStorage(AUTO_LOAD_SAVE_ID_STORAGE_KEY);
  }
}
