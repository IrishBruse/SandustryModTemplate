import type { Vector2 } from "../../shared/player";

export namespace structureBehaviors {
  export function registerConveyorType(structureId: string, options?: { transportOffset?: Vector2; velocity?: Vector2; maxTransportDistance?: number; transportHeight?: number; runWith?: 'left' | 'right'; skipQueued?: boolean; }): void;
  export function registerLauncherType(definition: { upType: string; leftType: string; rightType: string; velocity: [number, number]; softDropVelocity: number; runTickSharedBufferKey?: string; }): void;
}
