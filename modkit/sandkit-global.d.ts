/**
 * Ambient host bindings for this template.
 *
 * Types submodule documents namespaces under `main` / `worker` / `shared/engine`
 * and does not ship a composed global. Compose `sandkit.api` from those module
 * shapes here. Prefer free `sandkit` / ambient type names in mod code.
 */
import type { ReactElement } from "react";
import type { SandkitEngine, SandkitEngineState } from "./types/src/shared/engine";

type MainApi = Omit<typeof import("./types/src/main/index"), "engine">;
type WorkerApi = Omit<typeof import("./types/src/worker/index"), "engine">;

type SandkitReact = typeof import("react") & {
  jsx?(type: unknown, props: unknown, key: unknown): ReactElement;
  jsxs?(type: unknown, props: unknown, key: unknown): ReactElement;
};

type SandkitHost = {
  api: MainApi;
  /** Live value is `1`. */
  apiVersion: number;
  engine: SandkitEngine;
  enums: {
    Scene: { MainMenu: number; Intro: number } & Record<string, number>;
    ComponentId: { ShortcutHelper: number } & Record<string, number>;
  } & Record<string, unknown>;
  react: SandkitReact;
  /** Same object as `sandkit.engine.state` at runtime. */
  state: SandkitEngineState & {
    session?: unknown;
    [key: string]: unknown;
  };
};

declare global {
  type SandkitApi = MainApi;
  type WorkerSandkitApi = WorkerApi;
  type Sandkit = SandkitHost;
  const sandkit: Sandkit;
  /**
   * True when this `main.js` eval is a hot-reload pass.
   * Debug builds set it via esbuild inject (`modkit/internal/esbuild/hot-reload.inject.ts`).
   * Release builds define it as `false`.
   */
  const reloaded: boolean;
}

export {};
