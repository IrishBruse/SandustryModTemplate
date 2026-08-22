# Modkit

Shared kit for Sandustry mods. It includes:

- **React runtime** — `sandkit.react` wired through `modkit/react.ts` and JSX runtimes
- **Utils** — small helpers (`safe`, settings, scene checks, retro console registration)
- **UI** — shared React components under `modkit/ui/`. Live canvases and PNGs live under `docs/ui/canvas/` (`npm run ui:css` / `ui:previews`).
- **Debug / hot reload** — companion mod `src/debug` (DevTools, splash skip, auto-boot, F3) plus per-mod `./debug.ts` hot reload and `console` → file log inject
- **Modinfo helpers** — `defineModInfo` / `definePatches` with colocated manifest and patch types

Mods import this folder through the `@modkit/*` path alias. The game still loads a single bundled `main.js` (esbuild IIFE). Do not emit `import` / `export` in the output.

Sibling mods (for example `sandustry-doom-mod`) can use a symlink to this folder instead of a copy.

## Topics

| Topic                | Page                               |
| -------------------- | ---------------------------------- |
| React and JSX        | [react.md](react.md)               |
| Utils                | [utils.md](utils.md)               |
| Debug and hot reload | [debug.md](debug.md)               |
| UI components        | [../ui/README.md](../ui/README.md) |
| Bundle patches       | [../patches.md](../patches.md)     |

## TODO

- [ ] Move modkit into a published npm package so mods can depend on a versioned release instead of a copied or symlinked `modkit/` folder.
