import type { ApiHandler } from "../../common";

/** Common lifecycle events seen in Workshop mods. */
export type KnownGameEvent =
  | "game:ready"
  | "game:started"
  | "frame:render"
  | "building:placed"
  | "building:removed"
  | "structures:removed"
  | "tech:unlocked"
  | "resource:collected"
  | "worldItem:pickedUp"
  | "tutorial:stepChanged"
  | "tutorial:completed"
  | (string & {});

export interface EventsApi {
  on(event: KnownGameEvent, handler: ApiHandler): void;
  emit(event: KnownGameEvent, payload?: unknown): void;
}
