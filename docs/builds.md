# Builds

The game runs `main.js` as a script body (`new Function`). `sandkit` is already in scope. The bundle must not emit `import` / `export` (esbuild IIFE).

## Debug vs release

| Command                                    | Debug helpers                  | `debugPatches` | Output                                 |
| ------------------------------------------ | ------------------------------ | -------------- | -------------------------------------- |
| `npm run build`                            | Stub (`modkit/debug/empty.ts`) | Omitted        | `dist/` (symlink)                      |
| `npm run dev`                              | Included                       | Included       | `~/.config/sandustry/mods/Example Mod` |
| `npm run sandustry` / `--game` / `--debug` | Included                       | Included       | Game mods folder                       |

`--no-debug` forces a release-style bundle even when watch or game flags are set.

In-game **Debug** (`api.settings.get("debug")`) is omitted from release `modinfo.json`. When the setting is missing, it defaults to on.

`__MOD_DEBUG__` is `true` in dev builds and `false` in release.

See [modkit/debug.md](modkit/debug.md) for what debug helpers do at runtime.

## Tailwind CSS

The game ships Tailwind **v3.4.19** inside `bundle.js`. That stylesheet is purged: only classes the HUD uses are present. A class such as `w-[28rem]` has no rule until the mod adds it.

Sandkit loads `main.js` only. There is no CSS file in the mod manifest. The build still has to insert a `<style>` tag. The compiled sheet is **only the utilities this bundle uses**: esbuild lists the source files it packed, then Tailwind scans those files. Unused `modkit/ui` components do not add CSS.

The insert lives in [src/main.ts](../src/main.ts) (`style#<mod-id>-tailwind`). Hot reload removes that tag before it inserts a new one.

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

1. Run `npm run sandustry`.
2. Press **Alt+E**. The example panel must be 28rem (448px) wide. The help sentence must be underlined.
3. In DevTools, `document.getElementById("<mod-id>-tailwind")` must exist.

## Commands

```bash
npm run dev              # watch, debug on
npm run build            # release
npm run typecheck
npm run generate-types   # after a new runtime dump
npm run sandustry        # build debug + launch
npm run sandustry:debug  # same, with inspector ports
npm run ui:css           # compile docs/ui/canvas preview Tailwind
npm run ui:previews      # compile preview CSS, then screenshot preview.html
```
