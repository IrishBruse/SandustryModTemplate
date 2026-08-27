# Electron bridge

Source of truth: `sandustry/preload.js`. Main handlers: `sandustry/main.js`. Live keys match preload.

Bridge object: `window.electron`.

## Sync (startup-safe)

| Method                              | IPC                                                                           |
| ----------------------------------- | ----------------------------------------------------------------------------- |
| `getPlatformSync()`                 | `get-platform-sync` - `"steam"` / `"msstore"` / `"gog"`                       |
| `getIsSteamDeckSync()`              | `get-is-steam-deck-sync`                                                      |
| `getPreferredSystemLanguagesSync()` | `get-preferred-system-languages-sync`                                         |
| `getLastPlayedGameSync()`           | `get-last-played-game-sync` - JSON string `{ id }`                            |
| `saveExistsSync(id)`                | `save-exists-sync`                                                            |
| `getSettingsSync()`                 | `get-settings-sync`                                                           |
| `isFilePatchingActiveSync()`        | `is-file-patching-active-sync` - true when patch protocol has patched sources |

`getSystemInfo()` is **local** (no IPC): `platform`, `arch`, `electronVersion`, `chromeVersion`, `nodeVersion`.

## Invoke bags (do not call unless asked)

- Saves: `save`, `saveSerialized`, `load`, `loadRaw`, `deleteSave`, `exportSave`, `importSave`, `getSaveFiles`, `getSaveFolder` — on-disk layout: [boot.md](boot.md)
- Last played: `saveLastPlayedGame`, `clearLastPlayedGame`
- Settings: `saveSettings`
- Window: `setFullscreen`, `openDevTools` (`send`, not invoke)
- Quit / browser: `appQuit`, `openExternalBrowser`
- Platform: `diagnostics`, `checkLicense`, `writeGameEvent`, `platformPrimeAchievements`, `platformShowReauthPrompt`
- Nested: `localMods.*`, `customMaps.*`, `platform.*` (achievements, cloud, workshop, overlay)
- Log: `log(level, scope, message)` -> `log:write` fire-and-forget
- Xbox listeners: `onXboxUserSignedOut|SignedIn`, `onXboxLicenseLost` (Steam: never fire)
- Sleep: `onAppSuspend`, `onAppResume`

## File patching

Steam only. `sandustry-patch` privileged scheme. `setupProtocolInterceptor` in `main.js` runs when `workshopPatches.length > 0`. `isFilePatchingActiveSync` is true when interceptor is up **and** patched source map is non-empty.
