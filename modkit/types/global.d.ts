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
  /**
   * Host-injected free variable in the sandkit loader scope (not `globalThis`).
   * Use this name in mod `main.js` and modkit code. Do not import a value binding.
   */
  const sandkit: import("./sandkit").Sandkit;

  /** Full shape of the ambient `sandkit` object. */
  type Sandkit = import("./sandkit").Sandkit;
  /** Main-thread `sandkit.api` composed type. Not the worker API. */
  type SandkitApi = import("./sandkit").SandkitApi;
  /** `sandkit.engine` internals bag (state-first APIs). */
  type SandkitEngine = import("./sandkit").SandkitEngine;
  /** Composed `sandkit.engine.api` namespaces. */
  type SandkitEngineApi = import("./sandkit").SandkitEngineApi;
  /** Game state at `sandkit.state` / `sandkit.engine.state`. */
  type SandkitState = import("./sandkit").SandkitState;
  /** Runtime enum bags at `sandkit.enums`. */
  type SandkitEnums = import("./sandkit").SandkitEnums;
  /** Host React package at `sandkit.react`. */
  type SandkitReact = import("./sandkit").SandkitReact;
  /** Retro Console API surface on supported engine namespaces. */
  type RetroConsoleApi = import("./sandkit").RetroConsoleApi;
}

export {};
