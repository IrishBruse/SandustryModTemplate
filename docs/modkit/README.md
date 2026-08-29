# Modkit

Shared kit for Sandustry mods. It includes:

- **React runtime** — `sandkit.react` wired through `modkit/internal/esbuild/react.ts` and JSX runtimes
- **Utils** — small helpers (`safe`, settings, scene checks, retro console registration)
- **Integration tests** — Node helpers that talk to the extracted game in Chromium (CDP `:9224`)
- **UI** — shared React components under `modkit/ui/`. Live canvases and PNGs live under `docs/ui/canvas/` (`npm run ui:css` / `ui:previews`).
- **Modinfo helpers** — `defineModInfo` with colocated manifest types
- **Patch helpers** — `definePatches` and patch types in `@modkit/patches`

Mods import this folder through the `@modkit/*` path alias. The game still loads a single bundled `main.js` (esbuild `esm`, no entry exports). Do not emit `import` / `export` in the output.

The **dev-tools** companion is a mod, not part of this kit. See [Dev Tools](../dev-tools/).

Sibling mods (for example `sandustry-doom-mod`) can use a symlink to this folder instead of a copy.

## Topics

| Topic              | Page                                                                    |
| ------------------ | ----------------------------------------------------------------------- |
| Sandkit API types  | [SandustryTypes](https://sandustry-modding.github.io/SandustryTypes/#/) |
| React and JSX      | [react.md](react.md)                                                    |
| Utils              | [utils.md](utils.md)                                                    |
| Integration tests  | [test.md](test.md)                                                      |
| Mod `configSchema` | [config-schema.md](../config-schema.md)                                 |
| Manifest fields    | [../modinfo.md](../modinfo.md)                                          |
| UI components      | [../ui/README.md](../ui/README.md)                                      |
| Bundle patches     | [../patches.md](../patches.md)                                          |

## TODO

- [ ] Move modkit into a published npm package so mods can depend on a versioned release instead of a copied or symlinked `modkit/` folder.
