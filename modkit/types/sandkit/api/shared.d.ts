import { shared as sharedShared } from "../../shared/api/shared";

export namespace shared {
  export namespace buffers {
    export function create(key: string, config: { type: SharedArrayType; length: number; }): SharedArray;
    export import get = sharedShared.buffers.get
  }
  export import SharedArray = sharedShared.SharedArray
  export import SharedArrayType = sharedShared.SharedArrayType
}