/**
 * Auto-generated from types/api/source/runtime-dump.json
 * Run: npm run generate-types
 * Conveyor and launcher types
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiStructureBehaviors {
  /**
   * Register conveyor type.
   * @param structureId structure id.
   * @param options Optional settings object.
   */
  registerConveyorType: (structureId: string, options?: { transportOffset?: { x: number; y: number; }; velocity?: { x: number; y: number; }; maxTransportDistance?: number; transportHeight?: number; runWith?: 'left' | 'right'; skipQueued?: boolean; }) => void;
  /**
   * Register launcher type.
   * @param definition Registration definition object.
   */
  registerLauncherType: (definition?: { upType: string; leftType: string; rightType: string; velocity: [number, number]; softDropVelocity: number; runTickSharedBufferKey?: string; }) => void;
}
export type ApiStructureBehaviorsNamespace = ApiStructureBehaviors;
