/** localStorage keys read by debugPatches before mods run. */
export const FAST_BOOT_STORAGE_KEY = "dev-tools.fastBoot";
export const AUTO_LOAD_STORAGE_KEY = "dev-tools.autoLoad";
export const AUTO_LOAD_SAVE_ID_STORAGE_KEY = "dev-tools.autoLoadSaveId";

/** Expression for early patches: fast boot is on when this localStorage value is `"true"`. */
export function fastBootLocalStorageExpr(): string {
  return `localStorage.getItem(${JSON.stringify(FAST_BOOT_STORAGE_KEY)})==="true"`;
}
