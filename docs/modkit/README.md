# Modkit

Shared kit for Sandustry mods. It includes:

- **React runtime** — `sandkit.react` wired through `modkit/react.ts` and JSX runtimes
- **SDK** — small helpers (`safe`, settings, scene checks, retro console registration)
- **UI** — shared React components under `modkit/ui/`. Live canvases and PNGs live under `docs/ui/canvas/` (`npm run ui:css` / `ui:previews`).
- **Debug / hot reload** — dev-only globals, DevTools, splash skip, main-menu boot, file watch reload
- **Modinfo helpers** — `defineModInfo` / `definePatches` with colocated manifest and patch types

Mods import this folder through the `@modkit/*` path alias. The build emits `modkit/index.js` next to `main.js`. Sandkit still evaluates only `main.js` (esbuild IIFE); that file sync-loads the kit into `globalThis.__modkit`. Do not emit `import` / `export` in either output.

Sibling mods (for example `sandustry-doom-mod`) can use a symlink to this folder instead of a copy.

## Topics

| Topic                | Page                               |
| -------------------- | ---------------------------------- |
| React and JSX        | [react.md](react.md)               |
| SDK helpers          | [sdk.md](sdk.md)                   |
| Debug and hot reload | [debug.md](debug.md)               |
| UI components        | [../ui/README.md](../ui/README.md) |
| Bundle patches       | [../patches.md](../patches.md)     |

## TODO

- [ ] Move modkit into a published npm package so mods can depend on a versioned release instead of a copied or symlinked `modkit/` folder.
