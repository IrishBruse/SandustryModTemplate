import type { SandkitApi } from "./api";
import type { RetroConsoleApi } from "./retro-console";

/**
 * Sandkit runtime globals and engine escape hatch.
 *
 * Entry files run as script bodies — `sandkit` is already in scope.
 * No `import` or `export`. Top-level `await` is allowed in main entry.
 *
 * ## Engine escape hatch (outside apiVersion guarantee)
 *
 * Use only when Sandkit API is not enough:
 *
 * - `sandkit.engine.api` — raw engine API
 * - `sandkit.engine.state` — raw engine state
 * - `sandkit.react` — React for UI components
 * - `sandkit.enums` — Scene, MatterType, etc.
 *
 * Wrap each risky call in try/catch. Keep failure local. Degrade to no-op
 * or vanilla behavior.
 */

/** Dev globals exposed by the Example mod entry. */
export interface ModGlobal {
  modId: string;
  api: SandkitApi;
  ctx: SandkitState;
  sandkit: SandkitGlobal;
  status: {
    loaded: boolean;
    retroConsole: boolean;
    error: string | null;
  };
  registerGame: RetroConsoleApi["registerGame"];
  registerProbe(): string;
}

/** Global `sandkit` object provided by the mod runtime. */
export interface SandkitGlobal {
  api: SandkitApi;
  react: typeof import("react");
  state: SandkitState;
  enums: SandkitEnums;
  engine: SandkitEngine;
}

/** Engine escape hatch — outside apiVersion guarantee. */
export interface SandkitEngine {
  api: unknown;
  state: unknown;
}

/** Partial shape of sandkit.state; extend as needed. */
export interface SandkitState {
  shared?: {
    energy?: number[];
    [key: string]: unknown;
  };
  store?: {
    resources?: {
      energy?: number;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  sandkit?: {
    mods?: {
      elements?: Record<string, unknown>;
      matters?: Record<string, unknown>;
      items?: Record<string, unknown>;
      structures?: Record<string, unknown>;
      terrains?: Record<string, unknown>;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

/** Known enum buckets from Workshop mods. */
export interface SandkitEnums {
  Scene?: Record<string, number>;
  MatterType?: Record<string, number>;
  [key: string]: unknown;
}

/**
 * Desktop bridge — outside apiVersion guarantee (Mod Inspector pattern).
 *
 * Some mods use `window.electron` for Workshop, local folder, and DevTools.
 * Same category as `sandkit.engine.api` — wrap every call and degrade gracefully.
 *
 * @example
 * ```js
 * const bridge = safe(() => window.electron) || null;
 * ```
 */
export interface SandustryElectronBridge {
  openDevTools?(): void;
  getLastPlayedGameSync?(): string | null;
  saveExistsSync?(id: string): boolean;
  localMods?: {
    openFolder(): Promise<void>;
  };
  workshop?: Record<string, unknown>;
  [key: string]: unknown;
}
