/**
 * In-page `window.electron` for the extracted dist host.
 * Sync getters and save payloads are inlined by esbuild.
 */

declare const __TEST_HOST_SETTINGS__: string;
declare const __TEST_HOST_LAST_PLAYED__: string;
declare const __TEST_HOST_SAVE_IDS__: string[];
declare const __TEST_HOST_SAVES__: Record<string, unknown>;

/** Vanilla `b8()`: UA contains "Electron" or `window.process.type === "renderer"`. */
Object.defineProperty(window, "process", {
  configurable: true,
  value: { type: "renderer" },
});
try {
  const ua = `${navigator.userAgent} Electron/33.0.2`;
  Object.defineProperty(Navigator.prototype, "userAgent", {
    configurable: true,
    get: () => ua,
  });
} catch {
  /* userAgent may be locked */
}

/**
 * Cap reported cores so vanilla sim worker count stays small:
 * `max(2, hardwareConcurrency - 2)`. A 16-core host would otherwise spawn ~14 workers
 * and starve Steam Sandustry / the desktop while tests run.
 */
try {
  Object.defineProperty(Navigator.prototype, "hardwareConcurrency", {
    configurable: true,
    get: () => 4,
  });
} catch {
  /* hardwareConcurrency may be locked */
}

try {
  sessionStorage.setItem("splashShown", "1");
} catch {
  /* sessionStorage may be locked */
}

Object.assign(globalThis, { __sandustryTestHost: true });

const SAVE_IDS = new Set(__TEST_HOST_SAVE_IDS__);

type Json = Record<string, unknown>;

async function hostJson(path: string, init?: RequestInit): Promise<unknown> {
  const response = await fetch(path, init);
  return response.json();
}

function ok(extra?: Json): Json {
  return { ok: true, success: true, ...extra };
}

function loadSave(
  id: string,
): { success: true; data: unknown } | { success: false; error: string } {
  const key = String(id);
  const data = __TEST_HOST_SAVES__[key];
  if (data === undefined) {
    return { success: false, error: `Save not found: "${key}"` };
  }
  return { success: true, data };
}

const workshop = {
  subscribe: async () => ok(),
  unsubscribe: async () => ok(),
  installInfo: async () => null,
  downloadInfo: async () => null,
  getState: async () => 0,
  getSubscribedItems: async () => [],
  getItem: async () => null,
  download: async () => ok(),
  getSandkitMods: async () => hostJson("/__host/mods"),
};

const electron = {
  getPlatformSync: () => "steam",
  getModdingEnabledSync: () => true,
  getIsSteamDeckSync: () => false,
  getPreferredSystemLanguagesSync: () => ["en"],
  getLastPlayedGameSync: () => __TEST_HOST_LAST_PLAYED__,
  saveExistsSync: (id: string) => SAVE_IDS.has(String(id)),
  getSettingsSync: () => __TEST_HOST_SETTINGS__,
  isFilePatchingActiveSync: () => false,
  getSystemInfo: () => ({
    platform: "linux",
    arch: "x64",
    electronVersion: "0.0.0-sandustry-test",
    chromeVersion: navigator.userAgent,
    nodeVersion: "0.0.0",
  }),

  onAppSuspend: () => undefined,
  onAppResume: () => undefined,
  onXboxUserSignedOut: () => undefined,
  onXboxLicenseLost: () => undefined,
  onXboxUserSignedIn: () => undefined,

  diagnostics: async () => ({ platform: "steam" }),
  checkLicense: async () => ({
    valid: true,
    reason: null,
    networkError: false,
    cached: false,
  }),
  writeGameEvent: async () => undefined,
  platformPrimeAchievements: async () => ok(),
  platformShowReauthPrompt: async () => ({ dismissed: true }),
  appQuit: async () => undefined,
  openExternalBrowser: async () => undefined,

  save: async () => ok({ path: "/sandustry-test" }),
  saveSerialized: async () => ok({ path: "/sandustry-test" }),
  load: async (id: string) => loadSave(id),
  deleteSave: async () => ok(),
  loadRaw: async (id: string) => loadSave(id),
  exportSave: async () => ({ success: false, error: "not implemented" }),
  importSave: async () => ({ success: false, error: "not implemented" }),
  getSaveFiles: async () => hostJson("/__host/saves"),
  getSaveFolder: async () => "/sandustry-test/saves",

  localMods: {
    getFolder: async () => "/sandustry-test/mods",
    openFolder: async () => ok(),
    list: async () => ({ ok: true, data: [] }),
    upload: async () => ({ ok: false, errorCode: "unsupported_platform" }),
  },

  saveLastPlayedGame: async () => ok(),
  clearLastPlayedGame: async () => ok(),
  saveSettings: async () => ok(),
  setFullscreen: async () => ok(),
  toggleFullscreen: async () => ok(),
  openDevTools: () => undefined,

  macRightMouse: {
    watch: () => undefined,
    onPos: () => undefined,
    onUp: () => undefined,
  },

  platform: {
    isInitialized: async () => true,
    getPlayerName: async () => "sandustry-test",
    getPlayerId: async () => "0",
    getAppId: async () => 0,
    unlockAchievement: async () => true,
    isAchievementUnlocked: async () => false,
    clearAchievement: async () => true,
    cloudSave: async () => true,
    cloudLoad: async () => null,
    cloudFileExists: async () => false,
    cloudDelete: async () => true,
    cloudSync: async () => true,
    workshop,
    overlay: { openUrl: async () => undefined },
  },

  // Match preload: fire-and-forget IPC. Forward startup failures to the host
  // log without using the renderer console, which may call `electron.log`.
  log: (level: string, scope: string, message: string) => {
    if (level === "error" || level === "warn" || scope === "bootstrap") {
      const line = `[electron.log:${level}:${scope}] ${message}`;
      console.error(line);
      hostErrors.push(line);
    }
  },

  customMaps: {
    save: async () => ok(),
    load: async () => ({ success: false, error: "not implemented" }),
    list: async () => [],
    delete: async () => ok(),
  },
};

const hostErrors: string[] = [];
(window as unknown as { __sandustryTestErrors: string[] }).__sandustryTestErrors = hostErrors;

window.addEventListener("error", (event) => {
  const line = `sandustry-test uncaught ${event.message} ${event.filename}:${event.lineno}`;
  console.error(line);
  hostErrors.push(line);
});
window.addEventListener("unhandledrejection", (event) => {
  const line = `sandustry-test rejection ${String(event.reason)}`;
  console.error(line);
  hostErrors.push(line);
});

(window as unknown as { electron: typeof electron }).electron = electron;
