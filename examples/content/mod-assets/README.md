# Mod Assets Example

Ship static files under `mod/` and resolve them with `assets.getUrl`.

## Use

1. Enable the mod.
2. Load a save (or continue).
3. On first load, look for a toast with the message from `mod/info.json`.
4. Open DevTools console. You see:
   - `badgeUrl` — resolved URL for `mod/badge.png`
   - `info` — parsed JSON from `mod/info.json`

On hot reload the toast does not show again. The console still logs asset URLs when the mod loads.

`npm run build` copies everything under `mod/` into the installed mod folder. You do not copy those files into the game folder by hand.

## Folder layout

```
examples/content/mod-assets/
  mod/
    badge.png      ← copied into the installed mod folder
    info.json
  main.ts          ← api.assets.getUrl(...)
```

Pass paths **relative to the mod folder**, not the repo `src/` path:

```ts
sandkit.api.assets.getUrl("badge.png");
sandkit.api.assets.getUrl("info.json");
```

Use the returned URL with `fetch`, `<img src>`, or other browser APIs.

## Copy this mod

Copy `examples/content/mod-assets/` to `src/<your-mod>/`. Add files under `mod/` and reference them with `getUrl`.
