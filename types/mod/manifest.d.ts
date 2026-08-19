/**
 * Mod manifest shapes — canonical example: `modinfo.json` at repo root.
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
 * Required mod manifest (`modinfo.json`).
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

/** Optional Workshop publish metadata (`workshop.json`). */
export interface WorkshopManifest {
  publishedFileId?: string;
}
