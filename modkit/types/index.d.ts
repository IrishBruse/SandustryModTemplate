/**
 * Composed Sandkit import paths for this template.
 *
 * The `types/` submodule ships namespace modules under `types/src/`.
 * These files build the shapes used by `import type { … } from "types/api"`
 * (and `types/sandkit` / `types/engine`).
 *
 * Path aliases in root `tsconfig.json` map those import names here.
 */

export type { SandkitApi } from "./api";
export type { SandkitGlobal } from "./sandkit";
export type { RetroConsoleApi, RetroConsoleDisplay, RetroConsoleGame } from "./engine";
