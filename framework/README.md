# Framework

Shared kit for Sandustry mods: React runtime, SDK helpers, UI components, debug/hot reload, and type shims. Mods import this folder through the `@framework/*` path alias. The game still loads a single bundled `main.js`.

Sibling mods (for example `sandustry-doom-mod`) can use a symlink to this folder instead of a copy.

## TODO

- [ ] Move this framework into a published npm package so mods can depend on a versioned release instead of a copied or symlinked `framework/` folder.
