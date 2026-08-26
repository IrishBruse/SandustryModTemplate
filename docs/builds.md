# Builds

The game runs `main.js` as a script body (`new Function`). The loader wraps the body in an async function and puts `sandkit` in scope. Bundle with esbuild `format: "esm"` and do not export from the entry — the output must have no `import` / `export`.

## Debug vs release

| Command               | Debug helpers                           | `debugPatches` | Output                                                           |
| --------------------- | --------------------------------------- | -------------- | ---------------------------------------------------------------- |
| `npm run build`       | Stage all `src/` (incl. `hot-reload`)   | Omitted        | `build/<modinfo.id>/` only (no OS mods folder, no `dist/` links) |
| `npm run dev`         | Included; install `src/hot-reload`      | Included       | OS mods folder while watching; removed when the watch stops      |
| `npm run dev:release` | Omitted; no `hot-reload`, no sourcemaps | Omitted        | OS mods folder while watching (same cleanup as `dev`)            |
| `--game` / `--debug`  | Included; install `src/hot-reload`      | Included       | Game mods folder                                                 |

`--no-debug` forces a release-style bundle even when watch or game flags are set (`npm run dev:release` uses this). `--mod <folder>` builds one mod folder (repeat `--mod` for several). Debug builds (`npm run dev`, `--game`, `--debug`) install to the OS mods folder (`dist/` links there) unless you pass only `--mod hot-reload`. `npm run build` and `npm run dev` discover every `src/*/modinfo.ts` (including `hot-reload`). Use `npm run examples` or `npm run build -- --examples` for `examples/*/modinfo.ts`. `npm run publish` never lists the companion.

Debug builds emit **inline** source maps on `main.js` (needed for `new Function` eval). Use `--sourcemap` to force maps on a release build, or `--no-sourcemap` to omit them from a debug build.

Session debug helpers (DevTools, auto-load last save, disable autosave, F3, watch reload) live on the **hot-reload** companion. Settings are on that mod only. See [Hot Reload](hot-reload/).

`__MOD_DEBUG__` is `true` in dev builds and `false` in release. All builds inject `console.ts` so bare `console.*` calls get a `[modId]` prefix. File logging to `logs/<mod-id>.log` runs in debug builds only.

## File logging (`console`)

All builds inject [`modkit/internal/esbuild/console.ts`](../modkit/internal/esbuild/console.ts) via esbuild [`inject`](https://esbuild.github.io/api/#inject). Bare `console.log` / `info` / `warn` / `error` / `debug` in mod code get a `[modId]` prefix in DevTools. `__MOD_ID__` comes from that mod's `modinfo.ts` at build time. The shim uses bound native methods (not per-call wrappers) so DevTools links console output to your mod source. Debug builds also add `console.ts` to the source map `ignoreList` so breakpoints skip the shim when stepping.

Debug builds also `POST` those lines to `http://127.0.0.1:19147/log` while `npm run dev` is up ([`scripts/dev/log-server.js`](../scripts/dev/log-server.js)). Lines append to `logs/<modinfo.id>.log` (workspace `logs/` → OS sandustry logs: `~/.config/sandustry/logs` or `%APPDATA%/sandustry/logs`). Use `createLogger` from `@modkit/log` when you want a custom bracket tag.

Use `clearLog(modId)` from `@modkit/log` to clear a log file by hand. `clearLog` aborts after 500 ms if F5 / CDP stalls the POST.

```ts
console.log("my-feature", payload);
// DevTools: [author.template] my-feature {…}
// logs/author.template.log (debug only): [author.template] my-feature {…}
```

The shim uses `globalThis.console` internally so it does not recurse.

See [Hot Reload](hot-reload/) for what the companion does at runtime.

## Tailwind CSS

The game ships Tailwind **v3.4.19** inside `bundle.js`. That stylesheet is purged: only classes the HUD uses are present. A class such as `w-[28rem]` has no rule until the mod adds it.

Sandkit loads `main.js` only. There is no CSS file in the mod manifest. The build still has to insert a `<style>` tag. Import shared `@modkit/ui/tailwind.css` from the mod entry. Import `@modkit/ui/options.css` only when you use `OptionsSlider` / `OptionsSliderRow`. The kit re-exports those React components from `modkit/ui/options/index.ts` so esbuild does not pick `options.css` instead. The build inlines CSS as text (no `main.css` in the mod folder). The compiled Tailwind sheet is **only the utilities this bundle uses**: esbuild lists the source files it packed, then Tailwind scans those files. Unused `modkit/ui` components do not add CSS. Mods that never import those files skip the compile.

The insert lives in [examples/ui/overlay-hotkey/main.ts](../examples/ui/overlay-hotkey/main.ts) (`style#<mod-id>-tailwind`). A renderer hot reload re-inserts the sheet when that code runs again. Restart the game if the overlay does not update.

Do not enable Tailwind preflight. The game already resets `*, ::before, ::after`. A second preflight can change the HUD.

Docs canvases use the same compiler. `npm run ui:css` writes [docs/ui/canvas/_preview/utilities.css](ui/canvas/_preview/utilities.css). Live `preview.html` pages and PNGs live under [docs/ui/canvas](ui/canvas/) (not in `modkit/ui`).

### Verify

Static check against an extracted `sandustry/0.5.2-mods/dist/js/bundle.js` (`npm run setup`):

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
npm run setup            # check install, extract sandustry/<version>-<branch>/, link dist/ and logs/ (one time)
npm run dev              # watch all src/ mods (debug + sourcemaps)
npm run dev:release      # watch without debug helpers, sourcemaps, or hot-reload
npm run dev:pick         # TTY picker; last choice pre-selected
npm run dev -- --mod overlay-hotkey
npm run dev -- --mod overlay-hotkey --mod template
npm run build            # release all src/ mods to build/<modinfo.id>/
npm run build -- --mod overlay-hotkey
npm run build -- --examples
npm run publish          # npm run build + SteamCMD Workshop upload
npm run publish -- --mod <folder>
npm run typecheck
npm run test
npm run test:integration  # same tests; visible Sandustry window on :9223
npm run sandustry        # stop + launch (no build; keep npm run dev for the bundle)
npm run ui:css           # compile docs/ui/canvas preview Tailwind
npm run ui:previews      # compile preview CSS, then screenshot preview.html
```

When `npm run dev` stops (Ctrl+C, terminal close, or process exit), it removes the OS mod folders this template built in that watch session. The `dist/` link stays. Use `npm run build` when you want mods to stay installed.

`npm run dev` watches every `src/*/modinfo.ts` mod. Use `npm run dev:pick` for a keyboard picker before the watch starts. **All mods** is the first row. Mods are grouped under **src** (including the **hot-reload** companion). Type to filter the list, **Space** toggles mods, **Enter** confirms (All, checked mods, or the highlighted mod). Your last choice is saved under `.tmp/dev-mod-selection.json` and pre-selected next time. Pass `--mod` to skip the picker. Non-TTY `dev:pick` watches all mods.

**F5** (VS Code `Sandustry` launch) stops any running game, launches with `--remote-debugging-port`, waits until CDP `:9222` responds, then attaches the debugger to the **renderer** (where mods run). It does not rebuild the mod — keep `npm run dev` running for the bundle and file logs. **Restart** in the debugger toolbar kills that Electron process and starts a new one, then the renderer attach reconnects — a page reload does not restart workers or re-apply patches. If attach fails or ports linger, press F5 again or run the **sandustry:stop** task.

The watch rebuilds when you save a file in the bundle graph (mod sources and imported `modkit/` files), `modinfo.ts`, or static files under `mod/`. A Tailwind CSS change queues a second rebuild after the current one finishes, so the next save is not dropped. With **Watch local mods** on, the hot-reload companion re-evals renderer `main.js`. Restart the game for `worker.js` and `patches.json`.

Renderer attach loads source maps from scripts named `sandkit-workshop://<modId>/main.js` (and from the OS mods folder / `dist/`). Debug builds rewrite inline maps to `file://` sources, add a sandkit loader line offset, set matching `sourceURL`, and mark injected `console.ts` as ignore-listed so breakpoints resolve to mod source instead of the console shim. Console log links use bound native methods so they point at the mod call site. Do not press **F12** while the IDE debugger is attached — Electron DevTools steals that session. Keep **Open DevTools on load** off under F5 for the same reason.

## Workshop publish

`npm run publish` uses [SteamCMD](https://developer.valvesoftware.com/wiki/SteamCMD). It uses a **dedicated** install (downloads Valve’s official archive on first use):

- Linux / macOS: `~/.cache/sandustry-steamcmd/`
- Windows: `%LOCALAPPDATA%\sandustry-steamcmd\`

It does **not** use the Steam client’s `steamcmd` or Debian `/usr/games/steamcmd`, which share `~/.local/share/Steam` and clear the login cache when Steam runs.

Log into the Steam client as the Workshop item owner first (so publish can read your account name). SteamCMD keeps a **separate** credential cache under `home/` in that folder (a private `HOME` / `USERPROFILE` for SteamCMD). The first publish prompts for your Steam password (and Steam Guard if needed), then caches it. Later publishes reuse that cache with short status lines. Full SteamCMD output goes to `.tmp/steamcmd-publish.log`.

In a terminal, `npm run publish` shows an arrow-key list of **`src/` mods** (not `examples/`), then a confirm step (Upload / Cancel).

```bash
npm run publish
npm run publish -- --mod <folder>
npm run publish -- --mod <folder> --yes
```

The command runs `npm run build` for that folder. The bundle lands in `build/<modinfo.id>/` (Workshop staging). Staging gets the release bundle plus `workshop.json` and preview images only. `README.md`, `CHANGELOG.md`, and `workshop/screenshots/` stay in the repo. SteamCMD uploads from `build/<modinfo.id>/`. `workshop/workshop.md` supplies the Steam description in Markdown; `npm run publish` converts it to Steam BBCode at upload time. `npm run build` and `npm run dev` also copy only `workshop.json` and preview images, and remove leftover `README.md`, `CHANGELOG.md`, and `screenshots/` from the game folder.

**First publish:** you do not need `workshop/workshop.json` or an in-game Workshop create step. If the mod has `workshop/preview.png` (or `preview.gif`) and `workshop/workshop.md` (or `modinfo.description`), `npm run publish` sends `publishedfileid` `0` to SteamCMD, creates the item, then writes `src/<name>/workshop/workshop.json` with the new id. Later publishes update that item.

**`workshop.md` syntax:** `#` / `##` headings, `**bold**`, numbered lists (`1.`), and bullet lists (`-`). Do not add links or raw URLs — Steam Workshop virus scan rejects them and publish will fail. Legacy `workshop.txt` (raw BBCode) still works if you keep it instead.

Steam **change notes** come from that mod's `CHANGELOG.md` (Keep a Changelog). Write them for players: what changed in play, not how it was built. `npm run publish` uses the `##` section that matches `modinfo.version` (for example `## 0.2.0` or `## [0.2.0] - 2026-08-22`). If that heading is missing, it uses `## Unreleased` and warns you to rename the heading to the version. If there is no changelog, it sends the version string. The confirm step prints the full Steam change-notes text before Upload / Cancel.

## GitHub Actions

Pushes, pull requests, and manual runs execute `.github/workflows/ci.yml` on **Ubuntu** and **Windows** (Node 24). Each job runs `npm ci`, `npm test`, `npm run lint`, `npm run build`, and a Tailwind example build (`--examples --mod overlay-hotkey`).

On **Windows**, CI also builds a fake Sandustry install under `.tmp/ci-sandustry/` (`scripts/setup/prepare-ci-game.js`), sets `SANDUSTRY`, and runs `npm run setup`. That checks Node, links, asar extract, and junctions without Steam.

The workflow does **not** run `npm run publish`. Publish needs SteamCMD credentials.
