export namespace signals {
  export namespace targets {
    export function register(structureTypeOrId: string | StructureType, apply: (structure: Structure, payload: SignalTargetPayloadV1) => void): void;
  }

  export type StructureType = unknown
  export type Structure = unknown
  export type SignalTargetPayloadV1 = unknown
}