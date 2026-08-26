/**
 * Defaults when `api.settings.get` has no boolean yet.
 * Keep in sync with `configSchema` in `../modinfo.ts`.
 */
export const SETTING_DEFAULTS: Record<string, boolean> = {
  openDevTools: false,
  f12DevTools: false,
  autoLoad: false,
  f3Debug: false,
  disableAutosave: false,
  watchLocalMods: false,
};
