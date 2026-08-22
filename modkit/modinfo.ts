/**
 * Mod manifest shapes — canonical example: `src/<name>/mod.ts`.
 * Use `defineModInfo` for type-safe manifest definitions.
 * It returns `{ modinfo, MOD_ID }` so you can export both from `mod.ts`.
 *
 * ```ts
 * export const { modinfo, MOD_ID } = defineModInfo({ ... });
 * ```
 *
 * Read mod settings from `configSchema` via `api.settings.get(key)`.
 * Put feature switches in `configSchema` rather than hard-coded flags.
 */

export type ConfigSchemaFieldType = "boolean" | "number" | "string" | "enum";

export interface ConfigSchemaFieldBase {
  type: ConfigSchemaFieldType;
  default?: unknown;
  labelKey: string;
  descriptionKey: string;
}

export interface ConfigSchemaBooleanField extends ConfigSchemaFieldBase {
  type: "boolean";
  default?: boolean;
}

export interface ConfigSchemaNumberField extends ConfigSchemaFieldBase {
  type: "number";
  default?: number;
  min?: number;
  max?: number;
  step?: number;
}

export interface ConfigSchemaStringField extends ConfigSchemaFieldBase {
  type: "string";
  default?: string;
}

export interface ConfigSchemaEnumField extends ConfigSchemaFieldBase {
  type: "enum";
  default?: string;
  options: string[];
}

export type ConfigSchemaField =
  | ConfigSchemaBooleanField
  | ConfigSchemaNumberField
  | ConfigSchemaStringField
  | ConfigSchemaEnumField;

/** Settings fields exposed in the in-game mod config UI. */
export type ConfigSchema = Record<string, ConfigSchemaField>;

export interface TextureOverrideSheet {
  path: string;
  frameWidth: number;
  frames: number;
  intervalMs: number;
}

export type TextureOverrides = Record<string, string | TextureOverrideSheet>;

export interface MapBlueprints {
  terrain: string;
  lights?: string;
  sensors?: string;
  authorization?: string;
  wall?: string;
  lightsMeta?: string;
  decor?: string;
  config?: string;
}

export interface MapConfig {
  blueprints: MapBlueprints;
  width: number;
  height: number;
  spawn: { x: number; y: number };
  unstuck?: { x: number; y: number };
  deployment?: string;
  topBounds?: { hard: number; soft: number };
  depthLight?: {
    startY: number;
    endY: number;
    maxSize: number;
    minSize: number;
  };
  parallax?: { widthScale: number; offsetY: number };
  colorMappings?: Record<string, string>;
}

/**
 * Required mod manifest (source: `src/<name>/mod.ts`, output: `modinfo.json`).
 *
 * - `entry` — main-thread script (default `main.js`)
 * - `workerEntry` — worker-thread script (default `worker.js`)
 * - `configOverrides` — paths under `config/`
 * - `textureOverrides` — paths under `assets/`
 * - `map` — custom map under `map/`
 */
export interface ModManifest {
  manifestVersion: 1;
  id: string;
  name: string;
  version: string;
  apiVersion: number;
  entry?: string;
  workerEntry?: string;
  description?: string;
  author?: string;
  dependencies?: string[];
  loadOrder?: number;
  configSchema?: ConfigSchema;
  configOverrides?: Record<string, string>;
  textureOverrides?: TextureOverrides;
  map?: MapConfig;
}

/** Shape of `src/<name>/workshop/workshop.json`. The build copies it to the mod root. */
export interface WorkshopManifest {
  schemaVersion: 1;
  publishedFileId: string;
}

/**
 * `patches.json` — bundle rewrites at mod load time.
 *
 * Prefer Sandkit API before patches. Use patches only when public API cannot
 * do the job. Keep replacements small, set `expectedMatches`, and put runtime
 * helpers on `globalThis` (patch code runs outside the bundle IIFE).
 *
 * Define patches with `definePatches` in `src/<name>/mod.ts`.
 *
 * @example
 * ```ts
 * // src/<name>/mod.ts
 * export const patches = definePatches([
 *   {
 *     id: "bundle-log-prefix",
 *     file: "js/bundle.js",
 *     find: "initializing workers",
 *     operation: "insertBefore",
 *     code: "[patched]",
 *     expectedMatches: 1,
 *   },
 * ]);
 * ```
 */

export type PatchOperation = "insertBefore" | "replace" | "wrap";

/** Regex match — use only when exact `find` is not stable enough. */
export interface PatchRegex {
  pattern: string;
  flags?: string;
}

interface PatchBase {
  /** Unique patch id. */
  id: string;
  /** Target file under the game bundle, e.g. `js/bundle.js`. */
  file: string;
  /** Fail mod load if match count differs. */
  expectedMatches: number;
  /** All patches in the group must succeed together. */
  atomicGroup?: string;
}

/** Exact string match — preferred over regex. */
export interface PatchFind extends PatchBase {
  find: string;
  regex?: never;
}

export interface PatchRegexMatch extends PatchBase {
  regex: PatchRegex;
  find?: never;
}

export type PatchMatch = PatchFind | PatchRegexMatch;

/** Insert `code` before each match. */
export type InsertBeforePatch = PatchMatch & {
  operation: "insertBefore";
  code: string;
};

/** Replace each match with `code`. */
export type ReplacePatch = PatchMatch & {
  operation: "replace";
  code: string;
};

/** Wrap each match with `before` + match + `after`. */
export type WrapPatch = PatchMatch & {
  operation: "wrap";
  before: string;
  after: string;
};

export type Patch = InsertBeforePatch | ReplacePatch | WrapPatch;

/** Type-safe mod manifest builder — use in `src/<name>/mod.ts`. */
export function defineModInfo<const T extends ModManifest>(
  manifest: T,
): {
  modinfo: T;
  MOD_ID: T["id"];
} {
  return { modinfo: manifest, MOD_ID: manifest.id };
}

/** Type-safe patch list builder — use in `src/<name>/mod.ts`. Writes to `patches.json` at build. */
export function definePatches<const T extends readonly Patch[]>(patches: T): T {
  return patches;
}
