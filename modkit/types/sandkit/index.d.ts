/**
 * Live `sandkit` object — shape, ambient binding docs, and nested bags.
 *
 * Mirrors on-disk `src/sandkit/` and the host free variable: `api`, `engine`,
 * `enums`, `react`, `state`. Prefer the free name `sandkit` in mod code
 * (`src/global.d.ts`); do not import a value binding.
 *
 * @module sandkit
 */

export * as api from "./api";
export * as engine from "./engine";
export * as enums from "./enums";

import type { SandkitApi } from "./api/sandkit-api";
import type { SandkitEngine } from "./engine";
import type { SandkitEnums } from "./enums";
import type { SandkitReact } from "./react";
import type { SandkitState } from "./engine/state";

/** Shape of the host-injected `sandkit` free variable in mod `main.js`. */
export type Sandkit = {
  /** Public mod API. See {@link sandkit.api}. */
  api: SandkitApi;
  /** Sandkit API version number (live value is `1`). */
  apiVersion: number;
  /**
   * State-first internals. See {@link SandkitEngine}.
   * @internal
   */
  engine: SandkitEngine;
  /** Runtime enum bags. See {@link sandkit.enums}. */
  enums: SandkitEnums;
  /** Host React package. See {@link SandkitReact}. */
  react: SandkitReact;
  /**
   * Game state. Same object as `sandkit.engine.state` at runtime.
   * See {@link SandkitState}.
   */
  state: SandkitState;
};

export type { SandkitApi } from "./api/sandkit-api";
export type { SandkitEngine, SandkitEngineApi, RetroConsoleApi } from "./engine";
export type { SandkitState } from "./engine/state";
export type { SandkitEnums } from "./enums";
export type { SandkitReact } from "./react";
