# Changelog

Template and docs changes. Player-facing mod notes live in each mod's `CHANGELOG.md`.

## Unreleased

### Added

- **`gameVersion`**, **`shaderOverrides`**, and **`provides`** on `defineModInfo` / `ModManifest` (0.5.5 loader fields).
- Starter template sets `gameVersion.minimum` to `"0.5.5"`.
- Hot-reload wraps **`api.ui.regions.mount`** and calls handle **`unmount`** on reload. Deprecated **`overlays.register`** still unregisters.
- Vanilla Collector admission fact: Gold + liquidGold only (`sandustry-factory` `references/collector.md`).

### Changed

- Ambient `sandkit` types load from `compilerOptions.types` in `tsconfig.mod.json`. CSS string imports load from `files` (`modkit/css.d.ts`). `modkit/ambient.d.ts` is gone.
- **`npm test`** always runs the isolated Sandustry host with no window (`xvfb-run` + X11 ozone on Linux / macOS; Electron `--headless=new` on Windows). Electron `--ozone-platform=headless` stalls CDP on this game build; `--headless=new` still opens a window on Linux. Use `npm run test:integration` for a visible window.
- Stop hook (`.cursor/hooks/lint-test.sh`) writes `.tmp/lint-test-last.log` and keeps it. Host stop no longer calls `fuser` (it can hang).
- Patch types and `definePatches` live in `@modkit/patches` (`modkit/patches.ts`). `@modkit/modinfo` is manifest-only.
- **`collector-patches`**: find strings retargeted to `sandustry/0.5.5-mods/dist/js/` (one match per file).
- Hot-reload **`debugPatches`**: find strings retargeted to 0.5.5 `bundle.js` / `external-mod-runtime.js`.
- **Builds** Tailwind verify path: `sandustry/0.5.5-mods/dist/js/bundle.js`.
- **Host loader** skill: limits from `sandustry/0.5.5-mods/workshop-mods.js`, including `gameVersion` and `shaderOverrides`.
- **Docs search** (`assets/search-paths.js`): removed stale `/api/sandkit…` paths. Sandkit stays at https://sandustry.com/sandkit.html and [SandustryTypes](https://sandustry-modding.github.io/SandustryTypes/#/).
- **Examples / layout**: `collector-patches` is the remaining bundle-rewrite sample.
