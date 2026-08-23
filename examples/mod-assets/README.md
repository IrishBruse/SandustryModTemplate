# Mod Assets Example

Ship static files under `mod/` and resolve them with `assets.getUrl`.

## Folder layout

```
examples/mod-assets/
  mod/
    badge.png      ← copied into the installed mod folder
    info.json
  main.ts          ← api.assets.getUrl("badge.png")
```

Pass paths **relative to the mod folder**, not the repo `src/` path:

```ts
sandkit.api.assets.getUrl("badge.png");
sandkit.api.assets.getUrl("info.json");
```

The overlay loads the PNG with `<img src>` and fetches the JSON for its message text.

## Copy this mod

Copy `examples/mod-assets/` to `src/<your-mod>/`. Add files under `mod/` and reference them with `getUrl`.
