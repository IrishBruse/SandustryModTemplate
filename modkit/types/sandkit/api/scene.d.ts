import { Scene as SceneEnum } from "../enums";

export namespace scene {
  export import Scene = SceneEnum;
  export function getActive(): SceneEnum;
}
