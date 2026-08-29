/**
 * Mod manifest helpers — use `modinfo.json` or `modinfo.ts`.
 *
 * Shapes come from `@sandustry-modding/types/configs` (`ModInfo` and related).
 * Author either:
 *
 * - `modinfo.json` with `$schema`, imported from `main.ts` as `import modinfo from "./modinfo.json"`
 * - `modinfo.ts` with `defineModInfo({ ... })` or `modinfoFromJson(manifest)`
 *
 * When both manifest files exist, the build loads **`modinfo.ts` first**.
 *
 * Patch lists can live in `patches.json`, `patches.ts`, or be re-exported from
 * `modinfo.ts`. See `@modkit/patches`.
 */

import type {
  ConfigSchemaBoolean,
  ConfigSchemaChoice,
  ConfigSchemaEntry,
  ConfigSchemaNumber,
  ModGameVersion,
  ModInfo,
  ModMapBlueprints,
  ModMapDefinition,
  ModProvide,
  TextureOverride,
} from "@sandustry-modding/types/configs";

export {
  MODINFO_JSON_SCHEMA,
  PATCHES_JSON_SCHEMA,
  stripJsonSchema,
  withModinfoSchema,
} from "./schemas.ts";

export type {
  ConfigSchemaBoolean,
  ConfigSchemaChoice,
  ConfigSchemaChoiceOption,
  ConfigSchemaEntry,
  ConfigSchemaNumber,
  ModGameVersion,
  ModInfo,
  ModMapBlueprints,
  ModMapDefinition,
  ModProvide,
  TextureOverride,
} from "@sandustry-modding/types/configs";

/** @deprecated Use {@link ConfigSchemaEntry}. */
export type ConfigSchemaField = ConfigSchemaEntry;
/** @deprecated Use {@link ConfigSchemaBoolean}. */
export type ConfigSchemaBooleanField = ConfigSchemaBoolean;
/** @deprecated Use {@link ConfigSchemaNumber}. */
export type ConfigSchemaNumberField = ConfigSchemaNumber;
/** @deprecated Use {@link ConfigSchemaChoice}. */
export type ConfigSchemaChoiceField = ConfigSchemaChoice;
/** @deprecated Use {@link TextureOverride}. */
export type TextureOverrideSheet = TextureOverride;
/** @deprecated Use {@link ModGameVersion}. */
export type GameVersionRange = ModGameVersion;
/** @deprecated Use {@link ModProvide}. */
export type AssetProvider = ModProvide;
/** @deprecated Use {@link ModMapBlueprints}. */
export type MapBlueprints = ModMapBlueprints;
/** @deprecated Use {@link ModMapDefinition}. */
export type MapConfig = ModMapDefinition;
/** @deprecated Use {@link ModInfo}. */
export type ModManifest = ModInfo;

/** Field types the game accepts in `configSchema`. */
export type ConfigSchemaFieldType = "boolean" | "number" | "choice";

/** Settings fields exposed in Options → Mods. */
export type ConfigSchema = NonNullable<ModInfo["configSchema"]>;

/** Texture id → static path string or animated sheet. */
export type TextureOverrides = NonNullable<ModInfo["textureOverrides"]>;

/** Shader id → relative `.glsl` path under `shaders/`. */
export type ShaderOverrides = NonNullable<ModInfo["shaderOverrides"]>;

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
 * Type-safe manifest for `modinfo.ts`.
 *
 * ```ts
 * export const modinfo = defineModInfo({ ... });
 * ```
 */
export function defineModInfo<const T extends ModInfo>(manifest: T): T {
  return manifest;
}

/** Wrap an imported `modinfo.json` value (strips optional `$schema`). */
export function modinfoFromJson(raw: ModInfo & { $schema?: string }): ModInfo {
  const { $schema: _schema, ...manifest } = raw;
  return defineModInfo(manifest);
}
