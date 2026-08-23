/**
 * `sandkit.engine` — state-first engine APIs and Retro Console.
 *
 * Runtime paths: `sandkit.engine.api.<name>` and `sandkit.engine.state`
 * (same object as `sandkit.state`). Available on both the main thread
 * (`main.js`) and worker thread (`worker.js`). The public `sandkit.api`
 * surface still differs by runtime.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * These declarations are best-effort stubs. There is no guarantee they are
 * complete or correct.
 *
 * @module engine
 * @internal
 */
import type { RetroConsoleApi } from "./retro-console";
import type { EngineFn, EngineOverlapNs } from "../../shared/engine";
import type { SandkitState } from "./state";

export * from "./retro-console";
export * from "./api";
export * from "./state";

/**
 * Composed `sandkit.engine.api` shape.
 *
 * Overlap namespaces mirror {@link sandkit.api} with state-first signatures.
 * Engine-only namespaces are declared under `api/`.
 *
 * @internal
 */
export type SandkitEngineApi = {
  // --- Overlap with sandkit.api (prefer the public API) ---
  action: EngineOverlapNs;
  authorization: EngineOverlapNs;
  building: EngineOverlapNs;
  camera: EngineOverlapNs;
  collector: EngineOverlapNs;
  constants: EngineOverlapNs;
  cooldown: EngineOverlapNs;
  discoveries: EngineOverlapNs;
  effects: EngineOverlapNs;
  elements: EngineOverlapNs;
  energy: EngineOverlapNs;
  events: EngineOverlapNs;
  excavation: EngineOverlapNs;
  fire: EngineOverlapNs;
  grid: EngineOverlapNs;
  hooks: EngineOverlapNs;
  i18n: EngineOverlapNs;
  input: EngineOverlapNs;
  items: EngineOverlapNs;
  lights: EngineOverlapNs;
  maps: EngineOverlapNs;
  patterns: EngineOverlapNs;
  player: EngineOverlapNs;
  processing: EngineOverlapNs;
  progression: EngineOverlapNs;
  projectiles: EngineOverlapNs;
  random: EngineOverlapNs;
  raycast: EngineOverlapNs;
  reactions: EngineOverlapNs;
  rendering: EngineOverlapNs;
  resources: EngineOverlapNs;
  scene: EngineOverlapNs;
  schedule: EngineOverlapNs;
  signals: EngineOverlapNs;
  sound: EngineOverlapNs;
  sprites: EngineOverlapNs;
  storage: EngineOverlapNs;
  structures: EngineOverlapNs;
  tech: EngineOverlapNs;
  terrains: EngineOverlapNs;
  tools: EngineOverlapNs;
  triggers: EngineOverlapNs;
  ui: EngineOverlapNs;
  upgrades: EngineOverlapNs;
  utils: EngineOverlapNs;
  workers: EngineOverlapNs;
  world: EngineOverlapNs;

  // --- Engine-only ---
  augments: typeof import("./api/augments").augments;
  auralite: typeof import("./api/auralite").auralite;
  blueprints: typeof import("./api/blueprints").blueprints;
  clipboard: typeof import("./api/clipboard").clipboard;
  colorPicker: typeof import("./api/colorPicker").colorPicker;
  coloringTool: typeof import("./api/coloringTool").coloringTool;
  conveyors: typeof import("./api/conveyors").conveyors;
  debug: typeof import("./api/debug").debug;
  drones: typeof import("./api/drones").drones;
  entities: typeof import("./api/entities").entities;
  extensions: typeof import("./api/extensions").extensions;
  factory: typeof import("./api/factory").factory;
  foliage: typeof import("./api/foliage").foliage;
  foundationColorPicker: typeof import("./api/foundationColorPicker").foundationColorPicker;
  game: typeof import("./api/game").game;
  heatTransfer: typeof import("./api/heatTransfer").heatTransfer;
  launchers: typeof import("./api/launchers").launchers;
  lightColorPicker: typeof import("./api/lightColorPicker").lightColorPicker;
  matters: typeof import("./api/matters").matters;
  misc: typeof import("./api/misc").misc;
  portals: typeof import("./api/portals").portals;
  prefabData: typeof import("./api/prefabData").prefabData;
  prefabDecor: typeof import("./api/prefabDecor").prefabDecor;
  prefabulator: typeof import("./api/prefabulator").prefabulator;
  prismaline: typeof import("./api/prismaline").prismaline;
  prismite: typeof import("./api/prismite").prismite;
  queue: typeof import("./api/queue").queue;
  shadows: typeof import("./api/shadows").shadows;
  strataform: typeof import("./api/strataform").strataform;
  swarmConsole: typeof import("./api/swarmConsole").swarmConsole;
  sweeperDrone: typeof import("./api/sweeperDrone").sweeperDrone;
  teleportZones: typeof import("./api/teleportZones").teleportZones;
  tutorialBuild: typeof import("./api/tutorialBuild").tutorialBuild;
  usageTracker: typeof import("./api/usageTracker").usageTracker;
  wall: typeof import("./api/wall").wall;
  workerLocal: typeof import("./api/workerLocal").workerLocal;
  config: EngineFn;
  extend: EngineFn;
  retroConsole: RetroConsoleApi;
};

/**
 * Host `sandkit.engine` object (main and worker).
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * At runtime `sandkit.engine.state === sandkit.state`.
 *
 * @internal
 */
export interface SandkitEngine {
  api: SandkitEngineApi;
  state: SandkitState;
}
