/**
 * Mod manifest helpers — canonical example: `src/<name>/modinfo.ts`.
 *
 * Shapes come from `@sandustry-modding/types/configs` (`ModInfo` and related).
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
 * Type-safe mod manifest builder — use in `src/<name>/modinfo.ts`.
 *
 * ```ts
 * export const modinfo = defineModInfo({ ... });
 * ```
 */
export function defineModInfo<const T extends ModInfo>(manifest: T): T {
  return manifest;
}
