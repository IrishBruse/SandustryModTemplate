export namespace shared {
  export namespace buffers {
    export function get(key: string): SharedArray | undefined;
  }

  export type SharedArray = unknown
  export type SharedArrayType = unknown
}