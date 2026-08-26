/** localStorage key read by debugPatches before mods run (early outline compile). */
export const SKIP_SHADER_RECOMP_STORAGE_KEY = "hot-reload.skipShaderRecomp";

/**
 * Persist skip preference so the next page load skips compiles that run before main.js.
 */
export function writeSkipShaderRecomp(on: boolean): void {
  try {
    localStorage.setItem(SKIP_SHADER_RECOMP_STORAGE_KEY, String(on));
  } catch {
    /* localStorage can throw in some embeds */
  }
}
