/**
 * Active game scene and scene enum.
 *
 * Available as `sandkit.api.scene`.
 *
 * @module
 */
import { Scene as SceneEnum } from "../enums";

export namespace scene {
  /** Scene enum values. */
  export import Scene = SceneEnum;
  /** Return the active scene. */
  export function getActive(): SceneEnum;
}
