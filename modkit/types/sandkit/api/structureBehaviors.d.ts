/**
 * Structure behavior registration for conveyors and launchers.
 *
 * Available as `sandkit.api.structureBehaviors`.
 *
 * @module
 */
import type { Vector2 } from "../../shared/player";

export namespace structureBehaviors {
  /**
   * Register conveyor behavior for a structure type.
   * @param structureId - Structure type id string.
   * @param options - Transport offset, velocity, distance, and run direction.
   */
  export function registerConveyorType(structureId: string, options?: { transportOffset?: Vector2; velocity?: Vector2; maxTransportDistance?: number; transportHeight?: number; runWith?: 'left' | 'right'; skipQueued?: boolean; }): void;
  /**
   * Register launcher behavior for up, left, and right launcher types.
   * @param definition - Launcher type ids, velocities, and optional shared buffer key.
   */
  export function registerLauncherType(definition: { upType: string; leftType: string; rightType: string; velocity: [number, number]; softDropVelocity: number; runTickSharedBufferKey?: string; }): void;
}
