import { CellCoordinates, Vector2 } from "../../shared/player";

export namespace building {
  export enum StructureType {
    ConveyorLeft = 1,
    ConveyorRight = 2,
    ShakerLeft = 3,
    ShakerRight = 4,
    LauncherUp = 5,
    LauncherLeft = 6,
    LauncherRight = 7,
    SplitterLeft = 8,
    SplitterRight = 9,
    Dropper = 10,
    Foundation = 11,
    FoundationAngledLeft = 12,
    FoundationTriangleLeftDel = 13,
    FoundationAngledRight = 14,
    FoundationTriangleRightDel = 15,
    Collector = 16,
    FilterLeft = 17,
    FilterRight = 18,
    SlidingFoundation = 19,
    VelocitySoaker = 20,
    Grower = 21,
    SoundBox = 22,
    Pipe = 23,
    Pump = 24,
    LiquidVent = 25,
    Light = 26,
    GloomEmitter = 27,
  }
  export function getSnappedPositionAtCell(...args: CellCoordinates): Vector2;
  export function isBlockedAtCell(...args: CellCoordinates): boolean;
  export function cancelPlacement(): void;
  export function selectStructure(structureTypeOrId: string | StructureType): string | StructureType | null;
}