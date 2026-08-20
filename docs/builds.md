# Builds

The game runs `main.js` as a script body (`new Function`). `sandkit` is already in scope. The bundle must not emit `import` / `export` (esbuild IIFE).

## Debug vs release

| Command                                    | Debug helpers                     | `debugPatches` | Output                                 |
| ------------------------------------------ | --------------------------------- | -------------- | -------------------------------------- |
| `npm run build`                            | Stub (`framework/debug/empty.ts`) | Omitted        | `dist/` (symlink)                      |
| `npm run dev`                              | Included                          | Included       | `~/.config/sandustry/mods/Example Mod` |
| `npm run sandustry` / `--game` / `--debug` | Included                          | Included       | Game mods folder                       |

`--no-debug` forces a release-style bundle even when watch or game flags are set.

In-game **Debug** (`api.settings.get("debug")`) is omitted from release `modinfo.json`. When the setting is missing, it defaults to on.

`__MOD_DEBUG__` is `true` in dev builds and `false` in release.

See [framework/debug.md](framework/debug.md) for what debug helpers do at runtime.

## Commands

```bash
npm run dev              # watch, debug on
npm run build            # release
npm run typecheck
npm run generate-types   # after a new runtime dump
npm run sandustry        # build debug + launch
npm run sandustry:debug  # same, with inspector ports
```
