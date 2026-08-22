# Builds

The game runs `main.js` as a script body (`new Function`). `sandkit` is already in scope. The bundle must not emit `import` / `export` (esbuild IIFE).

## Debug vs release

| Command              | Debug helpers                  | `debugPatches` | Output                                                      |
| -------------------- | ------------------------------ | -------------- | ----------------------------------------------------------- |
| `npm run build`      | Stub (`modkit/debug/empty.ts`) | Omitted        | OS mods folder; `dist/<folder>/` links                      |
| `npm run dev`        | Included                       | Included       | OS mods folder while watching; removed when the watch stops |
| `--game` / `--debug` | Included                       | Included       | Game mods folder                                            |

`--no-debug` forces a release-style bundle even when watch or game flags are set. `--mod <folder>` builds one `src/<name>/` folder. The build discovers every `src/*/mod.ts`.

Debug builds emit **inline** source maps on `main.js` (needed for `new Function` eval). Use `--sourcemap` to force maps on a release build, or `--no-sourcemap` to omit them from a debug build.

In-game **Debug** (`api.settings.get("debug")`) is merged into debug `modinfo.json` by the build and omitted from release. When the setting is missing, it defaults to on.

`__MOD_DEBUG__` is `true` in dev builds and `false` in release.

See [modkit/debug.md](modkit/debug.md) for what debug helpers do at runtime.

## Tailwind CSS

The game ships Tailwind **v3.4.19** inside `bundle.js`. That stylesheet is purged: only classes the HUD uses are present. A class such as `w-[28rem]` has no rule until the mod adds it.

Sandkit loads `main.js` only. There is no CSS file in the mod manifest. The build still has to insert a `<style>` tag. The compiled sheet is **only the utilities this bundle uses**: esbuild lists the source files it packed, then Tailwind scans those files. Unused `modkit/ui` components do not add CSS.

The insert lives in [src/overlay-hotkey-example/main.ts](../src/overlay-hotkey-example/main.ts) (`style#<mod-id>-tailwind`). Hot reload removes that tag before it inserts a new one.

Do not enable Tailwind preflight. The game already resets `*, ::before, ::after`. A second preflight can change the HUD.

Docs canvases use the same compiler. `npm run ui:css` writes [docs/ui/canvas/_preview/utilities.css](ui/canvas/_preview/utilities.css). Live `preview.html` pages and PNGs live under [docs/ui/canvas](ui/canvas/) (not in `modkit/ui`).

### Verify

Static check against an extracted `references/source/dist/js/bundle.js`:

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
npm run dev              # watch all src/ mods, debug on (required before F5)
npm run dev -- --mod overlay-hotkey-example
npm run build            # release all mods (stay in the OS mods folder)
npm run build -- --mod overlay-hotkey-example
npm run typecheck
npm run sandustry        # stop + launch (no build; keep npm run dev for the bundle)
npm run ui:css           # compile docs/ui/canvas preview Tailwind
npm run ui:previews      # compile preview CSS, then screenshot preview.html
```

When `npm run dev` stops (Ctrl+C, terminal close, or process exit), it removes the OS mod folders this template owns and the matching `dist/<folder>` links. Use `npm run build` when you want mods to stay installed.

**F5** (VS Code `Sandustry` compound) stops any running game, launches with debug ports, then attaches the debugger to the **renderer** (`:9222`, where mods run) and Electron **main** (`:9230`). It does not rebuild the mod — keep `npm run dev` running for the bundle, hot reload, and file logs. Hot reload under F5 polls `hot-reload.json` in the mod folder (file URL). It does not use EventSource — the renderer CDP attach can stall that HTTP stream.

Renderer attach loads source maps from scripts named `sandkit-workshop://<modId>/main.js` (and from the OS mods folder / `dist/`). Debug builds rewrite inline maps to `file://` sources, add a sandkit loader line offset, and set matching `sourceURL` so breakpoints in `src/<name>/` bind through `new Function` eval. Do not press **F12** while the IDE debugger is attached — Electron DevTools steals that session.
