import type { RetroConsoleApi } from "../../retro-console";
import type { EventsApi } from "./events";
import type { HooksApi } from "./hooks";
import type { InputApi } from "./input";
import type { SceneApi } from "./scene";
import type { ScheduleApi } from "./schedule";
import type { SettingsApi } from "./settings";
import type { StorageApi } from "./storage";
import type { StructuresApi } from "./structures";
import type { TriggersApi } from "./triggers";
import type { UiApi } from "./ui";
import type { WorkersApi } from "./workers";
import type { WorldApi } from "./world";

/**
 * Hand-refined namespaces that override generated arity stubs.
 *
 * Main entry (`main.js`) — use often:
 * `events`, `hooks`, `input`, `ui`, `structures`, `items`, `upgrades`,
 * `sprites`, `triggers`, `schedule`, `storage`, `world`.
 *
 * Worker entry (`worker.js`) — use `workers.setPostUpdateEnabled` and
 * immediate mutation methods on `elements` / `terrains` / `structures`.
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
  /** Not in the public runtime dump; present when retro-console mod API is loaded. */
  retroConsole?: RetroConsoleApi;
}

export type * from "./events";
export type * from "./hooks";
export type * from "./input";
export type * from "./scene";
export type * from "./schedule";
export type * from "./settings";
export type * from "./storage";
export type * from "./structures";
export type * from "./triggers";
export type * from "./ui";
export type * from "./workers";
export type * from "./world";
