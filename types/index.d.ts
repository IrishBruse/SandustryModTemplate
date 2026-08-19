/**
 * Sandustry modding types for TypeScript mod authors and IDE tooling.
 *
 * ## Execution model
 *
 * - Entry files run as plain script bodies via `new Function(...)`.
 * - Do not use `import` or `export` in mod entry files.
 * - Top-level `await` is allowed in main entry files.
 * - `sandkit` and `api` are already in global scope.
 * - `main.js` (or `entry`) runs on the main thread.
 * - `worker.js` runs on manager and simulation worker threads.
 *
 * ## Mod folder layout
 *
 * ```
 * mods/example-mod/
 *   modinfo.json    — required manifest
 *   main.js         — main-thread script
 *   worker.js       — worker-thread script
 *   patches.json    — optional bundle patches
 *   config/         — native JSON config overrides
 *   assets/         — texture overrides
 *   map/            — custom map blueprints and config
 *   preview.png     — Workshop preview image
 *   workshop.json   — published Workshop item id
 * ```
 *
 * ## API source of truth
 *
 * Method names come from the in-game runtime dump (`types/api/runtime-dump.txt`).
 * Regenerate stubs: `npm run generate-types`.
 * Hand-refined typings live in `api/refined.d.ts`.
 *
 * ## Workshop patterns (run `npm run references` to sync)
 *
 * | Item id | Mod id | Notable pattern |
 * |---|---|---|
 * | 3783239581 | uolkx.power-monitor | Overlay UI, metrics, Alt+G toggle |
 * | 3784544373 | uolkx.atomic-age | Large content mod, heavy configSchema |
 * | 3783114793 | trim.infinite-factory | Element registration + reactions |
 * | 3783723865 | Kingcub.vertical-conveyor-portal | structures.updateDefinition |
 * | 3783134306 | electric131.wired-pyro | signals.targets.register |
 * | 3783406459 | uolkx.debug-toggle | Settings-driven live flags |
 * | 3785604934 | trim.creative-mode | Custom structures, overlays, triggers |
 * | 3783397350 | uolkx.mod-inspector | Loader diagnostics + electron bridge |
 * | 3782896614 | laser-overcharge | Bundle patches + globalThis helpers |
 *
 * Prefer API-first mods. Use bundle patches only for hard engine paths.
 */

export type * from "./common";
export type * from "./sandkit";
export type * from "./retro-console";
export type * from "./mod/manifest";
export type * from "./mod/patches";
export type * from "./api";

export type { SandkitApi } from "./api";
export type { ModGlobal } from "./sandkit";
export type { RetroConsoleGame, RetroConsoleContext } from "./retro-console";
export type { ModManifest, ConfigSchema } from "./mod/manifest";
export type { Patch, PatchOperation } from "./mod/patches";
