import { AssetRef } from "../../shared/asset";


export declare namespace action {
  export type Action = AssetRef;

  export function getActive(): Action;
  export function getSelected(): Action;
  export function setCustomData<Input>(data: Input): void;
}