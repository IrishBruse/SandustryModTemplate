import type { ApiHandler, Ctx, DataBag, RegistrationDef, StructureCallback, StructureRef } from "../common";
import type { RetroConsoleApi } from "../retro-console";

/** Known scene ids from Workshop overlay mods (hide-list pattern). */
export type SceneId =
  | 1 // MainMenu
  | 2 // Intro
  | 3 // Deploy
  | 4; // Game

export interface SceneApi {
  /** Active scene id, or undefined before first read. */
  getActive(ctx?: Ctx): number | undefined;
}

/** React panel mount used by Power Monitor and Mod Inspector. Not in runtime dump. */
export type UiInjectComponent = import("react").ComponentType | (() => import("react").ReactElement | null);

export interface UiOverlaysApi {
  register(layer: string, id: string, render: () => import("react").ReactElement | null, ctx?: Ctx): void;
  unregister(layer: string, id: string, ctx?: Ctx): void;
  update(layer: string, ctx?: Ctx): void;
}

export interface UiApi {
  toast(message: string, ctx?: Ctx, durationMs?: number): void;
  update(root: string, ctx?: Ctx, payload?: unknown): void;
  alert(title: string, message: string, ctx?: Ctx): void;
  confirm(title: string, message: string, ctx?: Ctx): Promise<boolean>;
  prompt(title: string, message: string, defaultValue: string, ctx?: Ctx, options?: DataBag): Promise<string | null>;
  openPauseMenu(ctx?: Ctx): void;
  showTooltip(text: string, ctx?: Ctx): void;
  /** Workshop pattern — may be absent on older builds. */
  inject?(id: string, component: UiInjectComponent): (() => void) | null;
  overlays: UiOverlaysApi;
  radialMenu: {
    addItem(item: DataBag): void;
    clear(): void;
    close(ctx?: Ctx): void;
    isOpen(): boolean;
    open(x: number, y: number, ctx?: Ctx): void;
    release(ctx?: Ctx, reason?: unknown): void;
    setDirection(ctx?: Ctx, angle?: number, distance?: number): void;
    setItemsProvider(provider: () => DataBag[]): void;
    setOnOpen(handler: ApiHandler): void;
  };
}

export interface SettingsApi {
  get<T = unknown>(key: string): T;
  /** Used by debug-toggle mod; may be absent. */
  onChange?(handler: () => void): void;
}

export interface EventsApi {
  on(event: string, handler: ApiHandler, ctx?: Ctx): void;
  emit(event: string, payload?: unknown, ctx?: Ctx): void;
}

/** Common lifecycle events seen in Workshop mods. */
export type KnownGameEvent =
  | "game:ready"
  | "building:placed"
  | "building:removed"
  | "structures:removed"
  | "steamTurbine:energyGenerated"
  | (string & {});

export interface HooksApi {
  intercept(ctx: Ctx, hook: string, handler: ApiHandler, priority?: number): void;
  modify(ctx: Ctx, hook: string, handler: ApiHandler, priority?: number): void;
  offInterceptor(ctx: Ctx, hook: string, handler: ApiHandler): void;
  offModifier(ctx: Ctx, hook: string, handler: ApiHandler): void;
  offAll(ctx: Ctx, hook: string): void;
  runInterceptors(ctx: Ctx, hook: string, args: unknown[]): unknown;
  runInterceptorsSafe(ctx: Ctx, hook: string, args: unknown[]): unknown;
  applyModifiers(ctx: Ctx, hook: string, value: unknown): unknown;
  applyModifiersSafe(ctx: Ctx, hook: string, value: unknown): unknown;
  hasInterceptors(ctx: Ctx, hook: string): boolean;
  hasModifiers(ctx: Ctx, hook: string): boolean;
  countInterceptors(ctx: Ctx, hook: string): number;
  countModifiers(ctx: Ctx, hook: string): number;
  hasGuardedModifiers(ctx: Ctx, hook: string, guard: unknown): boolean;
}

export interface StorageLocalApi {
  get<T = unknown>(key: string): T | null;
  set(key: string, value: unknown): void;
  remove(key: string): void;
}

export interface StorageApi {
  get<T = unknown>(ctx: Ctx, modId: string, key: string): T | null;
  set(ctx: Ctx, modId: string, key: string, value: unknown): void;
  remove(ctx: Ctx, modId: string, key: string): void;
  ensure(ctx: Ctx, modId: string): void;
  local: StorageLocalApi;
}

export interface ScheduleApi {
  nextTick(ctx: Ctx, fn: () => void): void;
}

export interface TriggersApi {
  register(id: string, options: { intervalMs?: number; fn: (ctx: Ctx) => void }, ctx?: Ctx): void;
}

export interface InputApi {
  registerKeyBinding(ctx: Ctx, id: string, binding: DataBag, handler: ApiHandler): void;
  getBoundKeys(ctx: Ctx, bindingId: string): string[];
  getDisplayKey(ctx: Ctx, bindingId: string): string;
  getMouseCellPosition(ctx: Ctx): { x: number; y: number } | null;
  isAltHeld(ctx: Ctx): boolean;
  isCtrlHeld(ctx: Ctx): boolean;
  pressBinding(ctx: Ctx, bindingId: string): void;
  releaseBinding(ctx: Ctx, bindingId: string): void;
  triggerBinding(ctx: Ctx, bindingId: string): void;
  resetMouseState(ctx: Ctx): void;
}

export interface StructuresApi {
  register(ctx: Ctx, definition: RegistrationDef, options?: RegistrationDef): void;
  updateDefinition(ctx: Ctx, typeId: string, patch: RegistrationDef, modId?: string): void;
  forEachOfType(typeId: string, fn: StructureCallback, ctx?: Ctx): void;
  getAtCell(x: number, y: number, ctx?: Ctx): StructureRef | null;
  setData(structure: StructureRef, data: DataBag, options?: { propagateToWorkers?: boolean }): void;
  isType(structure: StructureRef, typeId: string): boolean;
  isTypeAt(typeId: string, x: number, y: number, ctx?: Ctx): boolean;
  build(ctx: Ctx, typeId: string, x: number, y: number): void;
  removeAt(ctx: Ctx, x: number, y: number, options?: DataBag): void;
  processing: {
    register(typeId: string, handler: ApiHandler, ctx?: Ctx): void;
    isEnabledAt(x: number, y: number, ctx?: Ctx): boolean;
    setEnabledAt(ctx: Ctx, x: number, y: number, enabled: boolean): void;
  };
  recipes: {
    register(machineId: string, recipe: RegistrationDef, ctx?: Ctx): void;
    getWeightedRecipe(ctx: Ctx, machineId: string, input: unknown): unknown;
    selectWeightedOutput(ctx: Ctx, outputs: unknown): unknown;
  };
}

export interface WorldApi {
  isCellEmpty(ctx: Ctx, x: number, y: number): boolean;
  /** Legacy alias still seen in Workshop source. */
  isCellEmptyAtCell?(x: number, y: number): boolean;
  getCellId(ctx: Ctx, x: number, y: number): number;
  setCellId(ctx: Ctx, x: number, y: number, cellId: number): void;
  setCellIdWhenIdle(ctx: Ctx, x: number, y: number, cellId: number): void;
  mutateCellWhenIdle(ctx: Ctx, x: number, y: number, fn: ApiHandler): void;
  runWhenSimulationIdle(ctx: Ctx, fn: () => void): void;
  excavate(ctx: Ctx, x: number, y: number, radius: number, profile: unknown, options?: DataBag): void;
  revealFogAtCell(ctx: Ctx, x: number, y: number): void;
  reportActivityToChunk(ctx: Ctx, x: number, y: number): void;
  /** Legacy alias from creative-mode Workshop mod. */
  reportActivityAtCell?(x: number, y: number): void;
  redrawSurroundingCells(ctx: Ctx, x: number, y: number, radius: number): void;
  /** Legacy alias from creative-mode Workshop mod. */
  redrawAroundCellWhenIdle?(x: number, y: number, radius: number): void;
}

/**
 * Worker-thread API (`worker.js` on manager/simulation threads).
 *
 * Use immediate mutation methods here: `createAt`, `removeAt`, `move`, `setCellId`.
 * From main thread, prefer idle-safe paths: `runWhenSimulationIdle`,
 * `mutateCellWhenIdle`, `removeAtDeferred`, `moveAtSimulationIdle`.
 */
export interface WorkersApi {
  /** Replaces legacy `api.main.emitEvent`. */
  emitToMain(ctx: Ctx, event: string, payload?: unknown): void;
  events: {
    on(ctx: Ctx, event: string, handler: ApiHandler): void;
    emit(ctx: Ctx, event: string, payload?: unknown): void;
  };
  hooks: {
    intercept(ctx: Ctx, hook: string, handler: ApiHandler): void;
    modify(ctx: Ctx, hook: string, handler: ApiHandler): void;
  };
  shared: {
    create(ctx: Ctx, name: string, init: unknown): unknown;
    get(ctx: Ctx, name: string): unknown;
  };
  triggers: {
    register(id: string, options: { intervalMs?: number; fn: ApiHandler }, ctx?: Ctx): void;
  };
}

/**
 * Hand-refined namespaces that override generated arity stubs.
 *
 * Main entry (`main.js`) — use often:
 * `events`, `hooks`, `input`, `ui`, `structures`, `items`, `upgrades`,
 * `sprites`, `triggers`, `schedule`, `storage`, `world`, `retroConsole`.
 *
 * Worker entry (`worker.js`) — use often:
 * `workers.events`, `workers.hooks`, `workers.emitToMain`, `workers.triggers`,
 * `workers.shared`, `workerLocal`, immediate `elements`/`terrains`/`structures`.
 */
export interface RefinedSandkitApi {
  scene: SceneApi;
  ui: UiApi;
  settings: SettingsApi;
  events: EventsApi;
  hooks: HooksApi;
  storage: StorageApi;
  schedule: ScheduleApi;
  triggers: TriggersApi;
  input: InputApi;
  structures: StructuresApi;
  world: WorldApi;
  workers: WorkersApi;
  retroConsole: RetroConsoleApi;
}
