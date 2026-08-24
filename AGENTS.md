# Agent notes

This repo is a **Sandustry** mod template.
Each folder under `src/` or `examples/` that has a `mod.ts` is one game mod. `modkit/` is the shared kit.
The game runs `main.js` as a script body (`new Function`); `sandkit` is already in scope.
Do not emit `import` / `export` in the bundle (esbuild IIFE).
All mod builds inject `modkit/internal/esbuild/console.ts` via esbuild `inject`. Bare `console.log` / `info` / `warn` / `error` / `debug` calls get a `[modId]` prefix automatically — do not add manual `[${modId}]` or `[${__MOD_ID__}]` prefixes in source.
A mod root may contain only `mod.ts`, `main.ts`, optional `worker.ts`, optional `patches.ts`, and config/docs.
Put other source files in feature folders.
Put game-file patches in `patches.ts` and re-export them from `mod.ts`. Do not keep patch lists in `mod.ts`.

Prefer Sandkit API. Use patches only when the public API cannot do the job.
Keep behaviour next to its caller.
For a left management-column row (under Upgrades), use `registerManagementMenuButton` from `@modkit/ui` — not a one-off DOM spacer.
Docs: [`docs/ui/management-menu-button.md`](docs/ui/management-menu-button.md).

Mods must not import files from another mod folder in `src/` or `examples/`.
Shared code lives in `modkit/`.

Any new findings about Sandustry **MUST** be recorded in either `docs/` or `modkit/types`.

## Small features

Do not treat a local rule as a research project. Lock a minimum design, then implement.

1. Open the call site first (the hook or function that will own the behaviour).
2. Prefer the Sandkit / mod API already in use nearby. Grep the whole template or extracted game bundle only for one missing fact.
3. Keep pure rules (math, thresholds) free of Sandkit so Node tests can load them; wire one call from the hook.
4. Read the exact lines you will change, then patch once. Do not edit from memory or from a guessed tree.
5. Touch only the feature folder, its tests, and the mod README / changelog. Do not reformat unrelated docs.
