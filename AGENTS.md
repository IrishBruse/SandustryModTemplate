# Agent notes

This repo is a **Sandustry** mod template.
Each folder under `src/` that has a `mod.ts` is one game mod. `modkit/` is the shared kit.
The game runs `main.js` as a script body (`new Function`); `sandkit` is already in scope.
Do not emit `import` / `export` in the bundle (esbuild IIFE).

Prefer Sandkit API. Use patches only when the public API cannot do the job.
Keep behaviour next to its caller.
For a left management-column row (under Upgrades), use `registerManagementMenuButton` from `@modkit/ui` — not a one-off DOM spacer.
Docs: [`docs/ui/management-menu-button.md`](docs/ui/management-menu-button.md).

Mods must not import files from another `src/<name>/` folder.
Shared code lives in `modkit/`.

Any new findings about Sandustry **MUST** be recorded in either `docs/` or `modkit/types`
