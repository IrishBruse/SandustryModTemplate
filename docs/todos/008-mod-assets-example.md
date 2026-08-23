# Mod assets example

## Goal

Add `src/mod-assets-example/`: ship a small static file under `mod/` (for example a PNG or JSON), resolve it with `sandkit.api.assets.getUrl`, and use it in a toast, overlay image, or management-button icon.

## Why

Authors often hard-code asset paths. A minimal example shows Workshop packaging (`mod/` copied into the output folder) and the correct `getUrl` relative path without pulling in a large consumer mod (see [002-compile-time-assets-manifest.md](002-compile-time-assets-manifest.md)).

## Acceptance

- [ ] New folder `src/mod-assets-example/` with `mod/<file>` checked in
- [ ] `main.ts` loads or references the asset via `api.assets.getUrl` (fetch or `<img src>` — keep it one obvious path)
- [ ] README documents the folder layout and the relative path string to pass to `getUrl`
- [ ] `npm run build -- --mod mod-assets-example` copies the asset into `dist/` / the game mods folder
- [ ] Listed in [`docs/layout.md`](../layout.md) and [`AGENTS.md`](../../AGENTS.md) sample-mod table

## Origin

Need called out in [002-compile-time-assets-manifest.md](002-compile-time-assets-manifest.md); no template example today.
