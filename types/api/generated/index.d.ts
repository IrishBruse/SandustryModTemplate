/**
 * Auto-generated from sandkit-api/runtime-dump.json
 * Run: npm run generate-types
 *
 * In-game runtime snapshot: 352 entries, 281 functions.
 * Docs overlay: sandkit-api/api-docs.json
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */

import type { ApiAction } from "./action";
import type { ApiAssets } from "./assets";
import type { ApiAuthorization } from "./authorization";
import type { ApiBuilding } from "./building";
import type { ApiCamera } from "./camera";
import type { ApiCollector } from "./collector";
import type { ApiConstants } from "./constants";
import type { ApiCooldown } from "./cooldown";
import type { ApiDiscoveries } from "./discoveries";
import type { ApiEffects } from "./effects";
import type { ApiElements } from "./elements";
import type { ApiEnergy } from "./energy";
import type { ApiEvents } from "./events";
import type { ApiExcavation } from "./excavation";
import type { ApiFire } from "./fire";
import type { ApiGameConfig } from "./gameConfig";
import type { ApiGrid } from "./grid";
import type { ApiHooks } from "./hooks";
import type { ApiI18n } from "./i18n";
import type { ApiInput } from "./input";
import type { ApiItems } from "./items";
import type { ApiLights } from "./lights";
import type { ApiMaps } from "./maps";
import type { ApiMods } from "./mods";
import type { ApiPatterns } from "./patterns";
import type { ApiPlayer } from "./player";
import type { ApiProcessing } from "./processing";
import type { ApiProgression } from "./progression";
import type { ApiProjectiles } from "./projectiles";
import type { ApiRandom } from "./random";
import type { ApiRaycast } from "./raycast";
import type { ApiReactions } from "./reactions";
import type { ApiRendering } from "./rendering";
import type { ApiResources } from "./resources";
import type { ApiScene } from "./scene";
import type { ApiSchedule } from "./schedule";
import type { ApiSettings } from "./settings";
import type { ApiShared } from "./shared";
import type { ApiSignals } from "./signals";
import type { ApiSound } from "./sound";
import type { ApiSprites } from "./sprites";
import type { ApiStorage } from "./storage";
import type { ApiStructureBehaviors } from "./structureBehaviors";
import type { ApiStructures } from "./structures";
import type { ApiTech } from "./tech";
import type { ApiTerrains } from "./terrains";
import type { ApiTime } from "./time";
import type { ApiTools } from "./tools";
import type { ApiTriggers } from "./triggers";
import type { ApiUi } from "./ui";
import type { ApiUpgrades } from "./upgrades";
import type { ApiUtils } from "./utils";
import type { ApiWorkers } from "./workers";
import type { ApiWorld } from "./world";

/** Runtime API surface from the in-game dump. */
export interface GeneratedSandkitApi {
  /** Active/selected tool actions */
  action: ApiAction;
  /** Mod asset provider selection */
  assets: ApiAssets;
  /** Build/grab/tool permissions */
  authorization: ApiAuthorization;
  /** Placement helpers */
  building: ApiBuilding;
  /** Focus and snap */
  camera: ApiCamera;
  /** Collector value queries */
  collector: ApiCollector;
  /** Physics constants */
  constants: ApiConstants;
  /** Cooldown checks */
  cooldown: ApiCooldown;
  /** Discovery journal */
  discoveries: ApiDiscoveries;
  /** Particles, lights, lasers */
  effects: ApiEffects;
  /** Element defs and cell mutation */
  elements: ApiElements;
  /** Energy network */
  energy: ApiEnergy;
  /** Event bus */
  events: ApiEvents;
  /** Excavation profiles */
  excavation: ApiExcavation;
  /** Burning elements */
  fire: ApiFire;
  /** Read-only game config */
  gameConfig: ApiGameConfig;
  /** Rect/circle iteration */
  grid: ApiGrid;
  /** Intercept and modify hooks */
  hooks: ApiHooks;
  /** Translations */
  i18n: ApiI18n;
  /** Key bindings and mouse */
  input: ApiInput;
  /** Item registration */
  items: ApiItems;
  /** Persistent and VFX lights */
  lights: ApiLights;
  /** Custom maps */
  maps: ApiMaps;
  /** Mod provider listing */
  mods: ApiMods;
  /** Excavation patterns */
  patterns: ApiPatterns;
  /** Player state */
  player: ApiPlayer;
  /** Grower/shaker/press recipes */
  processing: ApiProcessing;
  /** Story progression */
  progression: ApiProgression;
  /** Projectile spawn */
  projectiles: ApiProjectiles;
  /** RNG */
  random: ApiRandom;
  /** Ray casting */
  raycast: ApiRaycast;
  /** Contact reactions */
  reactions: ApiReactions;
  /** Draw positions, overlay canvas */
  rendering: ApiRendering;
  /** Fluxite and energy UI */
  resources: ApiResources;
  /** Active scene */
  scene: ApiScene;
  /** nextTick scheduling */
  schedule: ApiSchedule;
  /** Mod configSchema settings */
  settings: ApiSettings;
  /** Cross-thread shared buffers */
  shared: ApiShared;
  /** Signal target registration */
  signals: ApiSignals;
  /** Sound playback */
  sound: ApiSound;
  /** Sprite loading */
  sprites: ApiSprites;
  /** Mod and local storage */
  storage: ApiStorage;
  /** Conveyor and launcher types */
  structureBehaviors: ApiStructureBehaviors;
  /** Structure registration and mutation */
  structures: ApiStructures;
  /** Tech tree */
  tech: ApiTech;
  /** Terrain registration and mutation */
  terrains: ApiTerrains;
  /** Simulation tick and time */
  time: ApiTime;
  /** Grabber helpers */
  tools: ApiTools;
  /** Interval triggers (main) */
  triggers: ApiTriggers;
  /** Toast, overlays, dialogs */
  ui: ApiUi;
  /** Upgrade trees */
  upgrades: ApiUpgrades;
  /** Math helpers */
  utils: ApiUtils;
  /** Worker post-update flag */
  workers: ApiWorkers;
  /** Cell reads, excavation, idle mutation */
  world: ApiWorld;
}
