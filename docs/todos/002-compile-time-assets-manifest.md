# Compile-time assets manifest

## Goal

Generate an `assets/` manifest at build time (or via an esbuild plugin) so mods get correct `api.assets.getUrl` relative paths, and/or load listed assets automatically instead of hard-coded fetch strings.

## Why

Consumer mods (for example Doom) currently call `loadModAsset("doom/engine.wasm")` and similar paths by hand. Easy to mistype, drift from files on disk, and miss Workshop packaging checks.

## Acceptance

- [ ] Build emits a typed or JSON asset list from the mod’s on-disk assets folder
- [ ] Emitted paths match what `sandkit.api.assets.getUrl` expects
- [ ] Optional helper can load all (or named) assets from that list
- [ ] Doom mod (or template example) uses the generated paths instead of hard-coded strings

## Origin

Prototyped need in `sandustry-doom-mod` (`src/doom/assets.ts`, session boot loads `doom/engine.wasm` + `doom/freedoom1.wad`).
