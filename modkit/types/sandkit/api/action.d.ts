import { AssetRef } from "../../shared/asset";

/**
 * `sandkit.api.action` — active hotbar action and custom handler data.
 * Main thread only.
 */
export declare namespace action {
  /** Hotbar action asset reference. */
  export type Action = AssetRef;

  /**
   * Return the action slot the player is using.
   * @returns Active hotbar action reference.
   */
  export function getActive(): Action;

  /**
   * Return the action slot selected in the hotbar.
   * @returns Selected hotbar action reference.
   */
  export function getSelected(): Action;

  /**
   * Store custom data on the active action handler.
   * @param data - Serializable payload attached to the active action.
   */
  export function setCustomData<Input>(data: Input): void;
}
