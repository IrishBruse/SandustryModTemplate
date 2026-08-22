/**
 * Ambient Sandkit names for this template.
 * The types submodule documents `sandkit.api` under `modkit/types/src/main` and
 * `modkit/types/src/worker` and no longer ships `global.d.ts`.
 */
import type { SandkitEngine } from "./types/src/shared/engine";

type MainApi = typeof import("./types/src/main/index");
type WorkerApi = typeof import("./types/src/worker/index");

declare global {
  type SandkitApi = MainApi;
  type WorkerSandkitApi = WorkerApi;
  type Sandkit = {
    api: SandkitApi;
    engine: SandkitEngine;
    state: {
      session?: unknown;
      [key: string]: unknown;
    };
    enums: {
      Scene: { MainMenu: number; Intro: number } & Record<string, number>;
      ComponentId: { ShortcutHelper: string } & Record<string, string>;
    } & Record<string, unknown>;
    react: typeof import("react");
  };
  const sandkit: Sandkit;
  /**
   * Set by esbuild inject (`modkit/esbuild/hot-reload.inject.ts`).
   * True when this `main.js` eval is a hot-reload pass.
   */
  const reloaded: boolean;
}

export {};
