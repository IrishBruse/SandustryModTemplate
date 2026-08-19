/**
 * Sandkit API domain types from the official reference.
 *
 * These are opaque handles and option bags — not full runtime shapes.
 * See types/api/source/official-api-reference.txt for method signatures.
 */

type Action = string;
type Scene = string;
type ElementType = string;
type StructureType = string | number;
type ItemType = string | number;
type MatterType = string;
type TechGridId = string;
type ComponentId = string;
type WorldItemType = string;
type SharedArrayType = string;

type Player = Record<string, unknown>;
type Structure = Record<string, unknown>;
type Cooldown = Record<string, unknown>;
type ModItem = Record<string, unknown>;
type Projectile = Record<string, unknown>;
type SharedArray = SharedArrayBuffer;
type SoundHandle = Record<string, unknown>;

type AssetProviderV1 = string;
type ConfigValueV1 = string | number | boolean;
type ActiveMapV1 = Record<string, unknown>;
type AvailableMapV1 = Record<string, unknown>;
type SignalTargetPayloadV1 = Record<string, unknown>;
type ProjectileBlueprint = Record<string, unknown>;

type ElementDefinition = Record<string, unknown>;
type ElementCreateOptions = Record<string, unknown>;
type ElementRemovalOptions = Record<string, unknown>;
type Interaction = Record<string, unknown>;
type TerrainDefinition = Record<string, unknown>;
type TerrainMutationOptions = Record<string, unknown>;
type ExcavationProfileDefinitionV1 = Record<string, unknown>;
type ContactRecipeDefinitionV1 = Record<string, unknown>;
type PlanterBoxRecipeDefinitionV1 = Record<string, unknown>;
type ShakerRecipeDefinitionV1 = Record<string, unknown>;
type KineticPressRecipeDefinitionV1 = Record<string, unknown>;
type WeightedRefineryRecipeDefinitionV1 = Record<string, unknown>;
type StructureProcessingDefinitionV1 = Record<string, unknown>;
type StructureProcessorDefinitionV1 = Record<string, unknown>;
type SandkitStructureDefinition = Record<string, unknown>;
type PlacementConfigDefinition = Record<string, unknown>;
type ProgressionCompletionRequestV1 = Record<string, unknown>;
type MainTriggerDefinition = Record<string, unknown>;
type UpgradeCategoryDefinition = Record<string, unknown>;
type UpgradeDefinition = Record<string, unknown>;
type TechDefinition = Record<string, unknown>;
type TechGridPosition = Record<string, unknown>;
type InputBindingDefinition = Record<string, unknown>;
type TemporaryLightOptions = Record<string, unknown>;
type PersistentLightOptions = Record<string, unknown>;
type ParticleEffectOptions = Record<string, unknown>;
type PatternExcavateOptions = Record<string, unknown>;
type ExcavateOptions = Record<string, unknown>;
type WorldItemLight = Record<string, unknown>;
type TooltipData = Record<string, unknown>;
type LocalizedText = string;
type ToastOptions = Record<string, unknown>;
type I18nNumberFormatOptions = Record<string, unknown>;
type HookContext = Record<string, unknown>;
type HookOptions = Record<string, unknown>;
type WorkerEventOptionsV1 = Record<string, unknown>;
type WorkerHandlerOptionsV1 = Record<string, unknown>;
type SoundLayer = Record<string, unknown>;
type SoundOptions = Record<string, unknown>;

interface InterceptHookMap {
  [hookId: string]: unknown;
}

interface ModifierHookMap {
  [hookId: string]: unknown;
}

type EventPayload<K extends string> = unknown;

type ComponentType<T> = import("react").ComponentType<T>;

interface RefObject<T> {
  readonly current: T | null;
}
