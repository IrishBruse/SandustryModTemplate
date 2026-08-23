/**
 * Signal target registration for structures.
 *
 * Available as `sandkit.api.signals`.
 *
 * @module
 */
export namespace signals {
  /** Signal target registration for structure types. */
  export namespace targets {
    /** Register a handler when a signal targets a structure type. */
    export function register(structureTypeOrId: string | StructureType, apply: (structure: Structure, payload: SignalTargetPayloadV1) => void): void;
  }

  /** Structure type id or enum value. */
  export type StructureType = unknown
  /** Structure instance in the world. */
  export type Structure = unknown
  /** Payload delivered to a signal target handler. */
  export type SignalTargetPayloadV1 = unknown
}
