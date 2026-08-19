/**
 * Auto-generated from types/api/runtime-dump.txt
 * Run: npm run generate-types
 *
 * In-game runtime snapshot: 631 entries, 517 functions.
 * Signatures are arity-based best guesses (ctx-first when arity >= 1).
 * Prefer hand-crafted types in refined.d.ts where available.
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */

import type { ApiHandler, ByArity, Method0, Method1, Method2, Method3, Method4, Method5, Method6 } from "../common";

export interface ApiAction {
  getActive: ApiHandler;
  getSelected: ApiHandler;
  setCustomData: ByArity<2>;
}

export interface ApiAugments {
  getDigLevel: ApiHandler;
  getGunLevel: ApiHandler;
  getPhaseLevel: ApiHandler;
  getRocketAmmoLevel: ApiHandler;
  getRocketReloadLevel: ApiHandler;
  getSprintCapLevel: ApiHandler;
  hasBigDig: ApiHandler;
  hasBulletSpeed: ApiHandler;
  hasBulletTracer: ApiHandler;
  hasKickstartBoost: ApiHandler;
  hasPhaseDash: ApiHandler;
  hasPhaseDashCharge: ApiHandler;
  hasRideBoost: ApiHandler;
  hasRocketDamage: ApiHandler;
  hasRocketWarhead: ApiHandler;
  hasSprintPower: ApiHandler;
  hasTripleShot: ApiHandler;
}

export interface ApiAuralite {
  ensureProducedAtLeast: ByArity<2>;
  getProduced: ApiHandler;
}

export interface ApiAuthorization {
  canBuild: ByArity<3>;
  canGrab: ByArity<3>;
  canUseTool: ByArity<2>;
  canUseToolAt: ByArity<3>;
  getPlayerZoneId: ApiHandler;
  getZoneIdAt: ByArity<3>;
}

export interface ApiBlueprints {
  delete: ApiHandler;
  exportAllString: Method0;
  exportString: ApiHandler;
  getAll: Method0;
  importString: ApiHandler;
  load: ApiHandler;
  save: ByArity<3>;
}

export interface ApiBuilding {
  cancelPlacement: ApiHandler;
  getSnappedCellPosition: ByArity<2>;
  isBlockedByTerrainOrElements: ByArity<3>;
  selectStructure: ByArity<2>;
}

export interface ApiCamera {
  releaseFocusToPlayer: ApiHandler;
  setFocusAtWorld: ByArity<3>;
  snapToPlayer: ApiHandler;
}

export interface ApiClipboard {
  activate: Method0;
  clear: Method0;
  get: Method0;
  getHistory: Method0;
  getSignalLinks: Method0;
  selectFromHistory: ApiHandler;
  set: ByArity<2>;
}

export interface ApiCollector {
  getValueFromCellId: ByArity<2>;
  getValueFromElementType: ByArity<2>;
  isCellCollectable: ByArity<2>;
  isCellCollectableForSprite: ByArity<2>;
  notifyPickup: ByArity<3>;
}

export interface ApiColoringTool {
  colorStructure: ByArity<3>;
  floodFillColor: ByArity<3>;
  getColor: ApiHandler;
  isColorableStructure: ApiHandler;
  isMatchColorMode: ApiHandler;
  isPaintBucketMode: ApiHandler;
  setColor: ByArity<2>;
  toggleMatchColorMode: ApiHandler;
  togglePaintBucketMode: ApiHandler;
}

export interface ApiColorPicker {
  closePalette: ApiHandler;
  CYCLE_COLOR: string;
  getActivePalette: Method0;
  getCycleColor: ByArity<2>;
  getRandomColor: ApiHandler;
  hexToRgba: ApiHandler;
  NO_COLOR: null;
  PREDEFINED_COLORS: unknown[];
  RANDOM_COLOR: string;
  renderColorButton: ApiHandler;
  renderColorSection: ByArity<2>;
  renderPalette: ByArity<2>;
  rgbaToHex: ApiHandler;
  setActivePalette: ApiHandler;
  togglePalette: ByArity<2>;
}

export interface ApiConfig {
  getLegacy: Method0;
  set: ByArity<2>;
}

export interface ApiConstants {
  PHYSICS: ApiConstantsPHYSICS;
}

export interface ApiConstantsPHYSICS {
  AGGRESSIVE_SKIP: number;
  NORMAL: number;
  SKIP: number;
}

export interface ApiConveyors {
  registerType: ByArity<3>;
}

export interface ApiCooldown {
  check: ByArity<3>;
  isReady: ByArity<3>;
}

export interface ApiDebug {
  register: ByArity<3>;
}

export interface ApiDiscoveries {
  addElement: ByArity<2>;
  addTerrain: ByArity<2>;
}

export interface ApiDrones {
  kill: ByArity<2>;
  spawn: ByArity<6>;
}

export interface ApiEffects {
  createDistortionWave: ByArity<3>;
  createEffect: ByArity<4>;
  createLaser: ByArity<5>;
  createLight: ByArity<3>;
  createParticles: ByArity<3>;
  createShockwave: ApiHandler;
  removeLight: ByArity<2>;
}

export interface ApiElements {
  addInteractionInfo: ByArity<3>;
  addParticleVelocity: ByArity<5>;
  convertFromParticle: ByArity<3>;
  convertToParticle: ByArity<4>;
  createAt: ByArity<5>;
  findFreePositionInStructure: ByArity<4>;
  getConfig: ApiHandler;
  getDataField: ByArity<4>;
  getDataField1: ByArity<3>;
  getDataField2: ByArity<3>;
  getDataField3: ByArity<3>;
  getDataField4: ByArity<3>;
  getElementTypeAtPos: ByArity<3>;
  getElementTypeFromId: ByArity<2>;
  getInfoAtCell: ByArity<3>;
  getInfoAtPos: ByArity<3>;
  getMatterTypeAtCell: ByArity<3>;
  getMatterTypeAtPos: ByArity<3>;
  getName: ByArity<2>;
  getRegisteredTypes: ApiHandler;
  getResolvedTypeAtCell: ByArity<3>;
  getResolvedTypeAtPos: ByArity<3>;
  getResolvedTypeFromCellId: ByArity<2>;
  getTypeAtCell: ByArity<3>;
  getVelocity: ByArity<3>;
  isFreeFalling: ByArity<3>;
  isTypeAt: ByArity<4>;
  markMovementBlocked: ByArity<2>;
  move: ByArity<5>;
  moveAtSimulationIdle: ByArity<6>;
  refreshColorAt: ByArity<3>;
  register: ByArity<2>;
  removeAt: ByArity<4>;
  removeAtDeferred: ByArity<4>;
  replaceAt: ByArity<5>;
  setDataField: ByArity<5>;
  setDataField1: ByArity<4>;
  setDataField2: ByArity<4>;
  setDataField3: ByArity<4>;
  setDataField4: ByArity<4>;
  setDuration: ByArity<5>;
  setPhysics: ByArity<4>;
  setVelocity: ByArity<4>;
  swap: ByArity<5>;
  teleport: ByArity<5>;
  updateDefinition: ByArity<3>;
}

export interface ApiEnergy {
  add: ByArity<5>;
  addBatch: ByArity<3>;
  consume: ByArity<3>;
  consumeExcludingNetwork: ByArity<4>;
  getNetwork: ByArity<3>;
  getNetworkFreeCapacity: ByArity<3>;
  registerType: ByArity<4>;
}

export interface ApiEntities {
  createLight: ByArity<3>;
  getAll: ApiHandler;
  getAllByType: ByArity<2>;
  getAllTypeDefs: Method0;
  getSprite: ByArity<2>;
  getTypeDef: ApiHandler;
  launch: ByArity<4>;
  registerSpawner: ApiHandler;
  registerType: ApiHandler;
  spawn: ByArity<4>;
  startCapture: ByArity<2>;
}

export interface ApiEvents {
  emit: ByArity<3>;
  on: ByArity<3>;
}

export interface ApiExcavation {
  registerProfile: ByArity<3>;
}

export interface ApiExtensions {
  define: ByArity<4>;
}

export interface ApiFactory {
  addViabilityGold: ByArity<2>;
  canUnlockNextTier: ApiHandler;
  ensureProcessAtLeast: ByArity<3>;
  flushDeferredLevelUps: ByArity<2>;
  getLevel: ApiHandler;
  getProcessCount: ByArity<2>;
  getProcessRate: ByArity<2>;
  recordProcess: ByArity<2>;
  unlockNextTier: ApiHandler;
}

export interface ApiFire {
  burnElementAt: ByArity<3>;
  canBurnElementAt: ByArity<3>;
}

export interface ApiFoliage {
  generate: Method0;
  getClusters: Method0;
  getContainer: Method0;
  hasProcgenData: Method0;
}

export interface ApiFoundationColorPicker {
  getColor: ApiHandler;
}

export interface ApiGame {
  load: ByArity<2>;
  save: ByArity<3>;
  start: ByArity<2>;
}

export interface ApiGrid {
  iterateCircle: ByArity<5>;
  iterateRect: ByArity<6>;
}

export interface ApiHeatTransfer {
  absorbAdjacentElements: ByArity<3>;
  addTemperature: ByArity<3>;
  computeDiffusedTemperatures: ByArity<2>;
  computeEqualizedTemperature: ApiHandler;
  consumeTemperatureNear: ByArity<6>;
  ensureTemperature: ApiHandler;
  equalizeConnected: ByArity<3>;
}

export interface ApiHooks {
  applyModifiers: ByArity<3>;
  applyModifiersSafe: ByArity<3>;
  countInterceptors: ByArity<2>;
  countModifiers: ByArity<2>;
  hasGuardedModifiers: ByArity<3>;
  hasInterceptors: ByArity<2>;
  hasModifiers: ByArity<2>;
  intercept: ByArity<4>;
  modify: ByArity<4>;
  offAll: ByArity<2>;
  offInterceptor: ByArity<3>;
  offModifier: ByArity<3>;
  runInterceptors: ByArity<3>;
  runInterceptorsSafe: ByArity<3>;
}

export interface ApiI18n {
  clearGlobal: ApiHandler;
  formatKeyForDisplay: ApiHandler;
  formatNumber: ByArity<2>;
  getAvailableLocales: Method0;
  getDescription: ApiHandler;
  getGlobal: ApiHandler;
  getGlobals: Method0;
  getLanguages: Method0;
  getLocale: Method0;
  getName: ApiHandler;
  hasTranslation: ByArity<2>;
  key: Method0;
  register: ByArity<2>;
  setGlobal: ByArity<2>;
  setLocale: ApiHandler;
  syncKeyBindings: ApiHandler;
  t: ByArity<2>;
  translatable: ByArity<2>;
}

export interface ApiInput {
  getBoundKeys: ByArity<2>;
  getDisplayKey: ByArity<2>;
  getMouseCellPosition: ApiHandler;
  isAltHeld: ApiHandler;
  isCtrlHeld: ApiHandler;
  pressBinding: ByArity<2>;
  registerKeyBinding: ByArity<4>;
  releaseBinding: ByArity<2>;
  resetMouseState: ApiHandler;
  triggerBinding: ByArity<2>;
}

export interface ApiItems {
  create: ByArity<2>;
  getActive: ApiHandler;
  isActive: ByArity<3>;
  register: ByArity<2>;
  spriteMounts: ApiItemsSpriteMounts;
  updateDefinition: ByArity<3>;
}

export interface ApiItemsSpriteMounts {
  backhand: string;
  cryoblaster: string;
  onehand: string;
}

export interface ApiLaunchers {
  registerType: ByArity<2>;
}

export interface ApiLightColorPicker {
  getColor: ApiHandler;
}

export interface ApiLights {
  persistent: ApiLightsPersistent;
  vfx: ApiLightsVfx;
}

export interface ApiLightsPersistent {
  create: ByArity<3>;
  fadeAt: ByArity<3>;
  markDirty: Method0;
  removeAt: ByArity<3>;
}

export interface ApiLightsVfx {
  create: ByArity<3>;
  remove: ByArity<2>;
}

export interface ApiMaps {
  getActive: ApiHandler;
  getAvailable: Method0;
  start: ByArity<2>;
}

export interface ApiMatters {
  getMatterTypeFromId: ByArity<2>;
  register: ByArity<2>;
  runSolidUpdate: ByArity<7>;
}

export interface ApiMisc {
  register: ByArity<2>;
}

export interface ApiPatterns {
  createCircle: ApiHandler;
  excavate: ByArity<6>;
}

export interface ApiPlayer {
  buildings: ApiPlayerBuildings;
  getPosition: ApiHandler;
  inventory: ApiPlayerInventory;
  isCollidingWithCell: ByArity<3>;
  isOnGround: ApiHandler;
  isPositionClear: ByArity<3>;
  isWithinRadius: ByArity<4>;
  setMovementMode: ByArity<2>;
  setMovementSpeedMultiplier: ByArity<2>;
  setPosition: ByArity<3>;
  setVelocity: ByArity<3>;
  teleportToGround: ApiHandler;
}

export interface ApiPlayerBuildings {
  add: ByArity<2>;
}

export interface ApiPlayerInventory {
  add: ByArity<2>;
}

export interface ApiPortals {
  getMarkers: ApiHandler;
}

export interface ApiPrefabData {
  getAll: Method0;
  getAllMetadata: Method0;
  getArtifactLocations: Method0;
  getAtCell: ByArity<2>;
  getMetadata: ApiHandler;
}

export interface ApiPrefabDecor {
  getPlacementByName: ApiHandler;
  replaceDecor: ByArity<2>;
}

export interface ApiPrefabulator {
  localizeBlueprintStructures: ApiHandler;
  serializeBlueprintStructures: ApiHandler;
}

export interface ApiPrismaline {
  consume: ByArity<2>;
  getAvailable: ApiHandler;
  getConsumed: ApiHandler;
}

export interface ApiPrismite {
  consume: ByArity<2>;
  getAvailable: ApiHandler;
  getConsumed: ApiHandler;
}

export interface ApiProcessing {
  registerGrower: ByArity<2>;
  registerKineticPress: ByArity<2>;
  registerShaker: ByArity<2>;
}

export interface ApiProgression {
  complete: ByArity<2>;
  getCurrentStep: ApiHandler;
  getIntroText: ApiHandler;
  getObjectivePosition: ByArity<2>;
  getSteps: Method0;
  getWaypoints: ApiHandler;
  isStepCompleted: ByArity<2>;
  setIntroText: ApiHandler;
  setSteps: ApiHandler;
  triggerCurrentWaypoint: ApiHandler;
}

export interface ApiProjectiles {
  createBlueprint: ByArity<2>;
  getAll: ApiHandler;
  register: ByArity<2>;
  remove: ByArity<2>;
  spawn: ByArity<5>;
}

export interface ApiQueue {
  enqueue: ByArity<2>;
  enqueueInTicks: ByArity<2>;
  enqueueSkipTick: ByArity<2>;
  process: ApiHandler;
  registerHandler: ByArity<2>;
  removeByKey: ByArity<2>;
}

export interface ApiRandom {
  float: ByArity<2>;
  int: ByArity<2>;
}

export interface ApiRaycast {
  cast: ByArity<5>;
}

export interface ApiReactions {
  registerContact: ByArity<2>;
}

export interface ApiRendering {
  getCellDrawPos: ByArity<3>;
  getDrawPos: ByArity<3>;
  getGridMetrics: Method0;
  getOverlayViewportSize: ApiHandler;
  shaders: ApiRenderingShaders;
  withOverlayContext: ByArity<2>;
}

export interface ApiRenderingShaders {
  register: ApiHandler;
  warmup: ByArity<3>;
}

export interface ApiResources {
  collectFluxiteAtCell: ByArity<3>;
  updateEnergy: ByArity<3>;
}

export interface ApiRetroConsole {
  registerGame: ApiHandler;
}

export interface ApiScene {
  getActive: ApiHandler;
}

export interface ApiSchedule {
  nextTick: ByArity<2>;
}

export interface ApiShadows {
  refresh: ByArity<3>;
  refreshRadius: ByArity<3>;
  refreshRect: ByArity<5>;
}

export interface ApiSignals {
  targets: ApiSignalsTargets;
}

export interface ApiSignalsTargets {
  register: ByArity<3>;
}

export interface ApiSound {
  calculateDistanceOptions: ByArity<3>;
  play: ByArity<3>;
  playActive: ByArity<3>;
  playLayers: ByArity<3>;
  stop: ByArity<2>;
  stopActive: ApiHandler;
  stopAll: ApiHandler;
}

export interface ApiSprites {
  get: ByArity<2>;
  hideAllPlayerModSprites: ApiHandler;
  load: ByArity<3>;
  rotatePlayerModSprites: ByArity<2>;
}

export interface ApiStorage {
  ensure: ByArity<2>;
  get: ByArity<3>;
  local: ApiStorageLocal;
  remove: ByArity<3>;
  set: ByArity<4>;
}

export interface ApiStorageLocal {
  get: ApiHandler;
  remove: ApiHandler;
  set: ByArity<2>;
}

export interface ApiStrataform {
  getDefaultConfig: Method0;
  getRegisteredTypes: Method0;
  registerType: ByArity<2>;
  trigger: ByArity<4>;
  triggerByType: ByArity<5>;
}

export interface ApiStructures {
  addProcessor: ByArity<3>;
  addVariant: ByArity<4>;
  beginBatchWrite: Method0;
  build: ByArity<4>;
  endBatchWrite: Method0;
  forEachOfType: ByArity<3>;
  getAtCell: ByArity<3>;
  getConfig: ApiHandler;
  getUnlockedTypes: ApiHandler;
  hasBuiltAtCell: ByArity<3>;
  isBlockedByPlayer: ByArity<3>;
  isLauncherAt: ByArity<3>;
  isType: ByArity<2>;
  isTypeAt: ByArity<4>;
  isUnlocked: ByArity<2>;
  mapValueToSpritesheetIndex: ByArity<2>;
  processing: ApiStructuresProcessing;
  recipes: ApiStructuresRecipes;
  register: ByArity<3>;
  registerPlacementConfig: ByArity<2>;
  removeAt: ByArity<4>;
  removeAtPositions: ByArity<3>;
  removeBetween: ByArity<4>;
  resolveTypeName: ApiHandler;
  setData: ByArity<4>;
  setSpritesheetIndex: ByArity<3>;
  setSpritesheetIndexAt: ByArity<4>;
  setSpritesheetIndexByValue: ByArity<4>;
  setSpritesheetIndexByValueAt: ByArity<5>;
  update: ByArity<3>;
  updateDefinition: ByArity<4>;
}

export interface ApiStructuresProcessing {
  isEnabledAt: ByArity<3>;
  register: ByArity<3>;
  setEnabledAt: ByArity<4>;
}

export interface ApiStructuresRecipes {
  getWeightedRecipe: ByArity<3>;
  register: ByArity<3>;
  selectWeightedOutput: ByArity<2>;
}

export interface ApiSwarmConsole {
  decrementConvergenceBuffer: ByArity<3>;
  getCrystalMined: ApiHandler;
  getDiskRadiusCells: Method0;
  getEntityType: ApiHandler;
  getNearestConvergence: ByArity<3>;
  getPendingConvergence: ApiHandler;
  getPlacedConsoles: ApiHandler;
  getRadiusPx: ApiHandler;
  isSpawnJammed: ApiHandler;
  registerEntityType: ByArity<2>;
  resetAllConvergenceBuffers: Method0;
  setSpawnJammed: ByArity<2>;
}

export interface ApiSweeperDrone {
  cancelSelection: ApiHandler;
}

export interface ApiTech {
  addDefinition: ByArity<2>;
  getDefinition: ApiHandler;
  isLocked: ByArity<2>;
  registerNode: ByArity<3>;
  setLocked: ByArity<3>;
  updateDefinition: ByArity<2>;
}

export interface ApiTeleportZones {
  add: ByArity<2>;
  getAll: ApiHandler;
  getAtCell: ByArity<3>;
  getById: ByArity<2>;
  remove: ByArity<2>;
  spawnDefaultParticles: ByArity<4>;
  teleportPlayerTo: ByArity<4>;
}

export interface ApiTerrains {
  createAt: ByArity<5>;
  damageTerrain: ByArity<4>;
  getGroundCellTypeAtPos: ByArity<3>;
  getTerrainData: ByArity<3>;
  getTypeAtCell: ByArity<3>;
  getTypeByName: ByArity<2>;
  isAtCell: ByArity<3>;
  isCellIdTerrain: ApiHandler;
  isPosTerrain: ByArity<3>;
  isPosTerrainId: ByArity<4>;
  isTerrain: ApiHandler;
  isTypeAtCell: ByArity<4>;
  register: ByArity<2>;
  removeAt: ByArity<4>;
  removeAtWhenIdle: ByArity<4>;
  replaceAt: ByArity<5>;
  setTerrainHP: ByArity<4>;
  transform: ByArity<4>;
  updateDefinition: ByArity<3>;
}

export interface ApiTools {
  blockSwitchIfGrabberLoaded: ApiHandler;
  getGrabberSize: ApiHandler;
  isGrabberActive: ApiHandler;
  isGrabberLoaded: ApiHandler;
  setGrabberSize: ByArity<2>;
}

export interface ApiTriggers {
  register: ByArity<3>;
}

export interface ApiTutorialBuild {
  areAllTargetsBuilt: ApiHandler;
  areFamilyTargetsBuilt: ByArity<2>;
  canPlaceAtActiveTarget: ByArity<3>;
  getFoundationMoveDests: Method0;
  getFoundationMoveSources: Method0;
  getTargets: ApiHandler;
  hasDefinition: Method0;
  isStepConstrained: ApiHandler;
  matchesFoundationMove: ApiHandler;
  matchesFoundationRemove: ApiHandler;
  shouldProtectActiveTargetAt: ByArity<2>;
}

export interface ApiUi {
  alert: ByArity<3>;
  confirm: ByArity<3>;
  openPauseMenu: ApiHandler;
  overlays: ApiUiOverlays;
  prompt: ByArity<6>;
  radialMenu: ApiUiRadialMenu;
  showTooltip: ByArity<2>;
  toast: ByArity<3>;
  update: ByArity<3>;
}

export interface ApiUiOverlays {
  register: ByArity<4>;
  unregister: ByArity<3>;
  update: ByArity<2>;
}

export interface ApiUiRadialMenu {
  addItem: ApiHandler;
  clear: Method0;
  close: ApiHandler;
  isOpen: Method0;
  open: ByArity<3>;
  release: ByArity<2>;
  setDirection: ByArity<3>;
  setItemsProvider: ApiHandler;
  setOnOpen: ApiHandler;
}

export interface ApiUpgrades {
  getAvailableLevel: ByArity<3>;
  getLevel: ByArity<3>;
  register: ByArity<2>;
  registerCategory: ByArity<2>;
  updateDefinition: ByArity<4>;
}

export interface ApiUsageTracker {
  clear: Method0;
  getLatest: Method0;
  getMostUsed: Method0;
}

export interface ApiUtils {
  getAngle: ByArity<2>;
  getCoordinatesBetweenPoints: ByArity<2>;
  getDirection: ByArity<2>;
  getDistance: ByArity<2>;
  getRandomFloatBetween: ByArity<2>;
  getRandomIntBetween: ByArity<2>;
}

export interface ApiWall {
  getPaletteData: ApiHandler;
  getWallDataAt: ByArity<3>;
  getWallDataSize: ApiHandler;
  setWallDataAt: ByArity<4>;
}

export interface ApiWorkerLocal {
  clear: ByArity<2>;
  get: ByArity<2>;
  getOrInit: ByArity<3>;
  set: ByArity<3>;
}

export interface ApiWorkers {
  emitToMain: ByArity<3>;
  events: ApiWorkersEvents;
  hooks: ApiWorkersHooks;
  messages: ApiWorkersMessages;
  shared: ApiWorkersShared;
  triggers: ApiWorkersTriggers;
}

export interface ApiWorkersEvents {
  emit: ByArity<4>;
  on: ByArity<4>;
}

export interface ApiWorkersHooks {
  intercept: ByArity<4>;
  modify: ByArity<4>;
}

export interface ApiWorkersMessages {
  getIdByName: ApiHandler;
  postToEachThreadColumnSequentiallyAwait: ByArity<3>;
}

export interface ApiWorkersShared {
  create: ByArity<3>;
  get: ByArity<2>;
}

export interface ApiWorkersTriggers {
  register: ByArity<3>;
}

export interface ApiWorld {
  createLightSource: ByArity<3>;
  excavate: ByArity<6>;
  fadeLightSourceAt: ByArity<3>;
  getCellId: ByArity<3>;
  getCellTypeByName: ByArity<2>;
  isCellEmpty: ByArity<3>;
  isTerrainAt: ByArity<3>;
  items: ApiWorldItems;
  markLightsDirty: Method0;
  mutateCellWhenIdle: ByArity<4>;
  pickups: Record<string, unknown>;
  redrawSurroundingCells: ByArity<4>;
  removeLightSourcesAt: ByArity<3>;
  reportActivityToChunk: ByArity<3>;
  revealFogAtCell: ByArity<3>;
  runWhenSimulationIdle: ByArity<2>;
  setCellId: ByArity<4>;
  setCellIdWhenIdle: ByArity<4>;
}

export interface ApiWorldItems {
  destroy: ByArity<2>;
  getAll: ApiHandler;
  getById: ByArity<2>;
  pickUp: ByArity<2>;
  spawn: ByArity<6>;
}

/** Runtime API surface from the in-game dump. */
export interface GeneratedSandkitApi {
  /** Active/selected tool actions */
  action: ApiAction;
  /** Player augment levels */
  augments: ApiAugments;
  /** Infinite Factory progression */
  auralite: ApiAuralite;
  /** Build/grab/tool permissions */
  authorization: ApiAuthorization;
  /** Blueprint save/load/export */
  blueprints: ApiBlueprints;
  /** Placement helpers */
  building: ApiBuilding;
  /** Focus and snap */
  camera: ApiCamera;
  /** Copy/paste structures */
  clipboard: ApiClipboard;
  /** Collector value queries */
  collector: ApiCollector;
  /** Structure coloring */
  coloringTool: ApiColoringTool;
  /** UI color palette */
  colorPicker: ApiColorPicker;
  /** Legacy config read/write */
  config: ApiConfig;
  /** Physics constants */
  constants: ApiConstants;
  /** Conveyor type registration */
  conveyors: ApiConveyors;
  /** Cooldown checks */
  cooldown: ApiCooldown;
  /** Debug registrations */
  debug: ApiDebug;
  /** Discovery journal */
  discoveries: ApiDiscoveries;
  /** Drone spawn/kill */
  drones: ApiDrones;
  /** Particles, lights, lasers */
  effects: ApiEffects;
  /** Element defs and cell mutation */
  elements: ApiElements;
  /** Energy network */
  energy: ApiEnergy;
  /** Entity spawn/types */
  entities: ApiEntities;
  /** Event bus */
  events: ApiEvents;
  /** Excavation profiles */
  excavation: ApiExcavation;
  /** Add custom API namespaces */
  extend: Method3;
  /** Extension definitions */
  extensions: ApiExtensions;
  /** Factory tier progression */
  factory: ApiFactory;
  /** Burning elements */
  fire: ApiFire;
  /** Procedural foliage */
  foliage: ApiFoliage;
  foundationColorPicker: ApiFoundationColorPicker;
  /** Save/load/start */
  game: ApiGame;
  /** Rect/circle iteration */
  grid: ApiGrid;
  /** Temperature diffusion */
  heatTransfer: ApiHeatTransfer;
  /** Intercept and modify hooks */
  hooks: ApiHooks;
  /** Translations */
  i18n: ApiI18n;
  /** Key bindings and mouse */
  input: ApiInput;
  /** Item registration */
  items: ApiItems;
  /** Launcher types */
  launchers: ApiLaunchers;
  lightColorPicker: ApiLightColorPicker;
  /** Persistent and VFX lights */
  lights: ApiLights;
  /** Custom maps */
  maps: ApiMaps;
  /** Matter type registration */
  matters: ApiMatters;
  misc: ApiMisc;
  /** Excavation patterns */
  patterns: ApiPatterns;
  /** Player state */
  player: ApiPlayer;
  /** Portal markers */
  portals: ApiPortals;
  prefabData: ApiPrefabData;
  prefabDecor: ApiPrefabDecor;
  prefabulator: ApiPrefabulator;
  prismaline: ApiPrismaline;
  prismite: ApiPrismite;
  /** Grower/shaker/press recipes */
  processing: ApiProcessing;
  /** Story progression */
  progression: ApiProgression;
  /** Projectile spawn */
  projectiles: ApiProjectiles;
  /** Deferred work queue */
  queue: ApiQueue;
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
  /** Register embedded retro games */
  retroConsole: ApiRetroConsole;
  /** Active scene */
  scene: ApiScene;
  /** nextTick scheduling */
  schedule: ApiSchedule;
  shadows: ApiShadows;
  /** Signal target registration */
  signals: ApiSignals;
  /** Sound playback */
  sound: ApiSound;
  /** Sprite loading */
  sprites: ApiSprites;
  /** Mod and local storage */
  storage: ApiStorage;
  strataform: ApiStrataform;
  /** Structure registration and mutation */
  structures: ApiStructures;
  swarmConsole: ApiSwarmConsole;
  sweeperDrone: ApiSweeperDrone;
  /** Tech tree */
  tech: ApiTech;
  teleportZones: ApiTeleportZones;
  /** Terrain registration and mutation */
  terrains: ApiTerrains;
  /** Grabber helpers */
  tools: ApiTools;
  /** Interval triggers (main) */
  triggers: ApiTriggers;
  tutorialBuild: ApiTutorialBuild;
  /** Toast, overlays, radial menu */
  ui: ApiUi;
  /** Upgrade trees */
  upgrades: ApiUpgrades;
  usageTracker: ApiUsageTracker;
  /** Math helpers */
  utils: ApiUtils;
  /** Wall palette data */
  wall: ApiWall;
  /** Per-worker local storage */
  workerLocal: ApiWorkerLocal;
  /** Worker events, hooks, shared buffers, triggers */
  workers: ApiWorkers;
  /** Cell reads, excavation, idle mutation */
  world: ApiWorld;
}
