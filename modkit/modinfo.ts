/**
 * Mod manifest shapes — canonical example: `src/<name>/modinfo.ts`.
 *
 * Use `defineModInfo` for a type-safe manifest. Export the result as `modinfo`.
 * Use `modinfo.id` for the mod id and the OS mods folder name.
 *
 * ```ts
 * export const modinfo = defineModInfo({ ... });
 * ```
 *
 * Read mod settings from `configSchema` with `api.settings.get(key)`.
 * Put feature switches in `configSchema` rather than hard-coded flags.
 *
 * Game-supported field types (validated in `sandustry/workshop-mods.js`):
 * `boolean`, `number`, `choice`. See `docs/config-schema.md`.
 *
 * Extra exports next to `modinfo` (not inside the object):
 * - `patches` — production patches (`definePatches` from `@modkit/patches`); build writes `patches.json`
 * - `debugPatches` — `npm run dev` / `--debug` only; omitted from `npm run build`
 */

/** Field types the game accepts in `configSchema`. */
export type ConfigSchemaFieldType = "boolean" | "number" | "choice";

/** Shared keys for every `configSchema` field. */
export interface ConfigSchemaFieldBase {
  /** One of `boolean`, `number`, or `choice`. */
  type: ConfigSchemaFieldType;
  /** Required by the game validator for every field. */
  default: unknown;
  /** Localization key or plain label shown in Options → Mods. */
  labelKey: string;
  /** Optional localization key or plain description under the label. */
  descriptionKey?: string;
}

/** Boolean switch in Options → Mods. */
export interface ConfigSchemaBooleanField extends ConfigSchemaFieldBase {
  type: "boolean";
  default: boolean;
}

/**
 * Number field. Optional `min` / `max` / `step`.
 * When both `min` and `max` are set, the Options UI also shows a range slider.
 */
export interface ConfigSchemaNumberField extends ConfigSchemaFieldBase {
  type: "number";
  default: number;
  /** Inclusive lower bound. Pair with `max` for a range slider. */
  min?: number;
  /** Inclusive upper bound. Pair with `min` for a range slider. */
  max?: number;
  /** Positive finite step for the number box / slider. */
  step?: number;
}

/** One option in a `choice` field. */
export interface ConfigSchemaChoiceOption {
  /** Stored value. Must match `default` for one option. */
  value: string;
  /** Localization key or plain label for this option. */
  labelKey: string;
}

/**
 * Choice (select) field. `default` must match one `options[].value`.
 * Prefer this over inventing a string free-text type — the game has none.
 */
export interface ConfigSchemaChoiceField extends ConfigSchemaFieldBase {
  type: "choice";
  default: string;
  /** Select options (1–64). Each `value` is a nonempty string up to 128 characters. */
  options: ConfigSchemaChoiceOption[];
}

/** Any single `configSchema` field. */
export type ConfigSchemaField =
  | ConfigSchemaBooleanField
  | ConfigSchemaNumberField
  | ConfigSchemaChoiceField;

/**
 * Settings fields exposed in Options → Mods.
 * Keys are field ids (`^[a-zA-Z][a-zA-Z0-9_.-]*$`). Max 64 fields.
 */
export type ConfigSchema = Record<string, ConfigSchemaField>;

/**
 * Animated texture sheet under `assets/`.
 * Use a plain path string in `TextureOverrides` for a static texture.
 */
export interface TextureOverrideSheet {
  /** Relative path under the mod root (for example `assets/texture.png`). */
  path: string;
  /** Width in pixels of one animation frame. */
  frameWidth: number;
  /** Frame count in the sheet. */
  frames: number;
  /** Milliseconds between frames. */
  intervalMs: number;
}

/**
 * Texture id → static path string or animated sheet.
 * Paths are under `assets/`.
 */
export type TextureOverrides = Record<string, string | TextureOverrideSheet>;

/**
 * Optional game version gate (loader 0.5.5+).
 * Set `minimum` when the mod needs newer hooks or APIs.
 */
export interface GameVersionRange {
  /** Lowest supported game version string (for example `"0.5.5"`). */
  minimum?: string;
  /** Highest supported game version string (for example `"0.5.9"`). */
  maximum?: string;
}

/**
 * Shader id → relative `.glsl` path under `shaders/`.
 * Example: `{ sky: "shaders/sky.glsl" }`.
 */
export type ShaderOverrides = Record<string, string>;

/**
 * Asset provider bundle listed under `provides`.
 * Same `textureOverrides` shape as the top-level field.
 */
export interface AssetProvider {
  /** Provider kind (for example `structureTextures`). */
  kind: string;
  /** Provider id within that kind (for example `industrial`). */
  id: string;
  /** Textures this provider supplies. Paths under `assets/`. */
  textureOverrides: TextureOverrides;
}

/**
 * Paths to map blueprint files under `map/`.
 * `terrain` is required for a custom map.
 */
export interface MapBlueprints {
  /** Terrain blueprint PNG (required). */
  terrain: string;
  /** Optional lights layer PNG. */
  lights?: string;
  /** Optional sensors layer PNG. */
  sensors?: string;
  /** Optional authorization layer PNG. */
  authorization?: string;
  /** Optional wall layer PNG. */
  wall?: string;
  /** Optional lights metadata PNG. */
  lightsMeta?: string;
  /** Optional decor layer PNG. */
  decor?: string;
  /** Optional map config JSON. */
  config?: string;
}

/** Custom map under `map/` (see official Sandkit `modinfo.json` complete example). */
export interface MapConfig {
  /** Blueprint file paths under `map/`. */
  blueprints: MapBlueprints;
  /** Map width in cells. */
  width: number;
  /** Map height in cells. */
  height: number;
  /** Player spawn cell. */
  spawn: { x: number; y: number };
  /** Optional unstuck / rescue cell. */
  unstuck?: { x: number; y: number };
  /** Optional deployment mode (for example `"skip"`). */
  deployment?: string;
  /** Optional hard / soft top bounds. */
  topBounds?: { hard: number; soft: number };
  /** Optional depth lighting ramp. */
  depthLight?: {
    startY: number;
    endY: number;
    maxSize: number;
    minSize: number;
  };
  /** Optional parallax tuning. */
  parallax?: { widthScale: number; offsetY: number };
  /** Optional colour-key → terrain / element id mappings. */
  colorMappings?: Record<string, string>;
}

/**
 * Mod manifest (source: `src/<name>/modinfo.ts`, build output: `modinfo.json`).
 *
 * Required: `manifestVersion`, `id`, `name`, `version`, `apiVersion`.
 * The game folder name is `id`, not the repo folder and not `name`.
 */
export interface ModManifest {
  /** Manifest schema version. Use `1`. */
  manifestVersion: 1;
  /** OS mods folder and Workshop identity. Prefer `author.mod` (for example `author.template`). */
  id: string;
  /** Display name in Options → Mods and the loader. */
  name: string;
  /** Mod version (for example `0.0.1`). Steam change notes match this to `CHANGELOG.md`. */
  version: string;
  /** Sandkit API generation. Use `1`. */
  apiVersion: number;
  /** Main-thread script. Default `main.js`. */
  entry?: string;
  /**
   * Worker-thread script. Default `worker.js`.
   * If the folder has `worker.ts` and this field is omitted, the build sets `"worker.js"`.
   */
  workerEntry?: string;
  /** Loader / Workshop fallback when `workshop/workshop.md` is missing. */
  description?: string;
  /** Author label. */
  author?: string;
  /** Other mods by `id`. Empty list is fine. */
  dependencies?: string[];
  /** Load order. Lower runs first. Hot Reload uses `-2147483648`. */
  loadOrder?: number;
  /** Optional game version gate (0.5.5+). */
  gameVersion?: GameVersionRange;
  /** Options → Mods fields. Max 64. See `docs/config-schema.md`. */
  configSchema?: ConfigSchema;
  /** Config id → path under `config/` (for example `drill` → `config/drill.json`). */
  configOverrides?: Record<string, string>;
  /** Shader id → relative `.glsl` path under `shaders/`. */
  shaderOverrides?: ShaderOverrides;
  /** Texture id → path string or sheet under `assets/`. */
  textureOverrides?: TextureOverrides;
  /** Asset provider bundles (`kind`, `id`, `textureOverrides`). */
  provides?: AssetProvider[];
  /** Custom map under `map/`. */
  map?: MapConfig;
}

/**
 * Shape of `src/<name>/workshop/workshop.json`.
 * The build copies it to the mod root. Keep `publishedFileId` when you update a release.
 */
export interface WorkshopManifest {
  /** Workshop JSON schema version. Use `1`. */
  schemaVersion: 1;
  /** Steam Workshop published file id. Do not change after the first upload. */
  publishedFileId: string;
}

/**
 * Type-safe mod manifest builder — use in `src/<name>/modinfo.ts`.
 *
 * ```ts
 * export const modinfo = defineModInfo({ ... });
 * ```
 */
export function defineModInfo<const T extends ModManifest>(manifest: T): T {
  return manifest;
}
