import { AssetRef } from "../../shared/asset";

/**
 * `sandkit.api.action` — active hotbar action and custom handler data.
 * Main thread only.
 */
export declare namespace action {
  /** Hotbar action asset reference. */
  export type Action = AssetRef;

  /** Returns the action slot the player is using. */
  export function getActive(): Action;
  /** Returns the action slot selected in the hotbar. */
  export function getSelected(): Action;
  /** Stores custom data on the active action handler. */
  export function setCustomData<Input>(data: Input): void;
}
