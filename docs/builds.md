# Builds

The game runs `main.js` as a script body (`new Function`). `sandkit` is already in scope. The bundle must not emit `import` / `export` (esbuild IIFE).

## Debug vs release

| Command              | Debug helpers                                            | `debugPatches` | Output                                                      |
| -------------------- | -------------------------------------------------------- | -------------- | ----------------------------------------------------------- |
| `npm run build`      | Stub (`modkit/esbuild/debug.empty.ts`); omit `src/debug` | Omitted        | OS mods folder; `dist/<folder>/` links                      |
| `npm run build:release` | Stub; omit `src/debug`                                | Omitted        | `build/<folder>/` (Workshop staging; not the OS mods folder) |
| `npm run dev`        | Included; install `src/debug`                            | Included       | OS mods folder while watching; removed when the watch stops |
| `--game` / `--debug` | Included; install `src/debug`                            | Included       | Game mods folder                                            |

`--no-debug` forces a release-style bundle even when watch or game flags are set. `--mod <folder>` builds one `src/<name>/` folder. Debug builds also install `src/debug` unless `--mod debug`. The build discovers every `src/*/mod.ts`.

Debug builds emit **inline** source maps on `main.js` (needed for `new Function` eval). Use `--sourcemap` to force maps on a release build, or `--no-sourcemap` to omit them from a debug build.

Session debug helpers (DevTools, splash skip, auto-boot, disable autosave, F3) live on the **debug** companion. Settings are on that mod only. See [modkit/debug.md](modkit/debug.md).

`__MOD_DEBUG__` is `true` in dev builds and `false` in release.

See [modkit/debug.md](modkit/debug.md) for what debug helpers do at runtime.

## Tailwind CSS

The game ships Tailwind **v3.4.19** inside `bundle.js`. That stylesheet is purged: only classes the HUD uses are present. A class such as `w-[28rem]` has no rule until the mod adds it.

Sandkit loads `main.js` only. There is no CSS file in the mod manifest. The build still has to insert a `<style>` tag. Import shared `@modkit/ui/tailwind.css` from the mod entry. The compiled sheet is **only the utilities this bundle uses**: esbuild lists the source files it packed, then Tailwind scans those files. Unused `modkit/ui` components do not add CSS. Mods that never import the file skip the compile.

The insert lives in [src/overlay-hotkey-example/main.ts](../src/overlay-hotkey-example/main.ts) (`style#<mod-id>-tailwind`). Hot reload removes that tag before it inserts a new one.

Do not enable Tailwind preflight. The game already resets `*, ::before, ::after`. A second preflight can change the HUD.

Docs canvases use the same compiler. `npm run ui:css` writes [docs/ui/canvas/_preview/utilities.css](ui/canvas/_preview/utilities.css). Live `preview.html` pages and PNGs live under [docs/ui/canvas](ui/canvas/) (not in `modkit/ui`).

### Verify

Static check against an extracted `sandustry/dist/js/bundle.js` (`npm run setup`):

| Selector           | In the game CSS |
| ------------------ | --------------- |
| `.flex {`          | Yes             |
| `.bg-black {`      | Yes             |
| `.bg-opacity-85 {` | Yes             |
| `.w-\[28rem\] {`   | No              |
| `.underline {`     | No              |

In game:

1. Run `npm run dev`, then `npm run sandustry` (or **F5**).
2. Press **Alt+E**. The overlay panel must be 28rem (448px) wide. The help sentence must be underlined.
3. In DevTools, `document.getElementById("<mod-id>-tailwind")` must exist.

## Commands

```bash
npm run setup            # check install, extract sandustry/, link logs/ (one time)
npm run dev              # watch all src/ mods, debug on (required before F5)
npm run dev -- --mod overlay-hotkey-example
npm run build            # release all mods (stay in the OS mods folder)
npm run build -- --mod overlay-hotkey-example
npm run build:release    # release staging to build/<folder>/ (Workshop assets)
npm run build:release -- --mod selection-capture
npm run publish          # build:release + SteamCMD Workshop upload
npm run publish -- --mod selection-capture
npm run typecheck
npm run sandustry        # stop + launch (no build; keep npm run dev for the bundle)
npm run ui:css           # compile docs/ui/canvas preview Tailwind
npm run ui:previews      # compile preview CSS, then screenshot preview.html
```

When `npm run dev` stops (Ctrl+C, terminal close, or process exit), it removes the OS mod folders this template owns and the matching `dist/<folder>` links. Use `npm run build` when you want mods to stay installed.

**F5** (VS Code `Sandustry` compound) stops any running game, launches with `--remote-debugging-port`, waits until CDP `:9222` responds, then attaches the debugger to the **renderer** (where mods run). It does not rebuild the mod — keep `npm run dev` running for the bundle, hot reload, and file logs. Hot reload polls `GET http://127.0.0.1:19147/hot-reload/last` on the dev watch server (same path as normal dev). If attach fails or ports linger, press F5 again (preLaunch stops the old session) or run the **sandustry:stop** task.

Renderer attach loads source maps from scripts named `sandkit-workshop://<modId>/main.js` (and from the OS mods folder / `dist/`). Debug builds rewrite inline maps to `file://` sources, add a sandkit loader line offset, and set matching `sourceURL` so breakpoints in `src/<name>/` bind through `new Function` eval. Do not press **F12** while the IDE debugger is attached — Electron DevTools steals that session. Keep **Open DevTools on load** off under F5 for the same reason.

## Workshop publish

`npm run publish` **requires SteamCMD**. Install it from the Valve [SteamCMD](https://developer.valvesoftware.com/wiki/SteamCMD) page. Put `steamcmd` (or `steamcmd.exe` / `steamcmd.sh`) on your PATH, or unpack it under `.tmp/steamcmd/`.

Log into the Steam client as the Workshop item owner first. SteamCMD keeps its **own** credential cache (separate from the Steam client). The first publish prompts for your Steam password (and Steam Guard if needed), then caches it. Later publishes reuse that cache.

In a terminal, `npm run publish` shows an arrow-key list of mods, then a confirm step (Upload / Cancel).

```bash
npm run publish
npm run publish -- --mod selection-capture
npm run publish -- --mod selection-capture --yes
```

The command runs `npm run build:release` for that folder into `build/<folder>/` (not the OS mods folder, so `npm run dev` cannot overwrite it). Staging gets the release bundle plus `workshop.json` and preview images only. `README.md`, `CHANGELOG.md`, and `workshop/screenshots/` stay in the repo. SteamCMD uploads from that folder. `workshop.txt` supplies the Steam description (it stays under `src/<name>/workshop/`). `npm run build` and `npm run dev` also copy only `workshop.json` and preview images, and remove leftover `README.md`, `CHANGELOG.md`, and `screenshots/` from the game folder.

Steam **change notes** come from that mod's `CHANGELOG.md` (Keep a Changelog). `npm run publish` uses the `##` section that matches `modinfo.version` (for example `## 0.2.0` or `## [0.2.0] - 2026-08-22`). If that heading is missing, it uses `## Unreleased` and warns you to rename the heading to the version. If there is no changelog, it sends the version string. The confirm step prints the full Steam change-notes text before Upload / Cancel.
