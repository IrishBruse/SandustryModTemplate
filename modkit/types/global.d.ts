/**
 * Ambient host bindings for mod `main.js`.
 *
 * The game evaluates the bundle with `new Function("__sandkit", body)` and
 * binds `const sandkit = __sandkit` before the IIFE. Use the free name
 * `sandkit` in mod and modkit code — do not import a value binding.
 *
 * Type names below are also ambient so mods can annotate without imports.
 * Prefer `typeof sandkit` / `typeof sandkit.api` when that reads clearer.
 */
declare global {
  /** Host-injected free variable in the sandkit loader scope (not `globalThis`). */
  const sandkit: import("./sandkit").Sandkit;

  type Sandkit = import("./sandkit").Sandkit;
  type SandkitApi = import("./sandkit").SandkitApi;
  type SandkitEngine = import("./sandkit").SandkitEngine;
  type SandkitEngineApi = import("./sandkit").SandkitEngineApi;
  type SandkitState = import("./sandkit").SandkitState;
  type SandkitEnums = import("./sandkit").SandkitEnums;
  type SandkitReact = import("./sandkit").SandkitReact;
  type RetroConsoleApi = import("./sandkit").RetroConsoleApi;
}

export {};
