import { CellCoordinates, Vector2 } from "../../shared/player";

/**
 * `sandkit.api.building` — structure placement and built-in structure types.
 * Main thread only.
 */
export namespace building {
  /** Built-in structure type ids used during placement. */
  export enum StructureType {
    /** Left-facing conveyor belt. */
    ConveyorLeft = 1,
    /** Right-facing conveyor belt. */
    ConveyorRight = 2,
    /** Left-facing shaker. */
    ShakerLeft = 3,
    /** Right-facing shaker. */
    ShakerRight = 4,
    /** Up-facing launcher. */
    LauncherUp = 5,
    /** Left-facing launcher. */
    LauncherLeft = 6,
    /** Right-facing launcher. */
    LauncherRight = 7,
    /** Left-facing splitter. */
    SplitterLeft = 8,
    /** Right-facing splitter. */
    SplitterRight = 9,
    /** Dropper structure. */
    Dropper = 10,
    /** Foundation block. */
    Foundation = 11,
    /** Angled foundation facing left. */
    FoundationAngledLeft = 12,
    /** Left triangle foundation (deprecated id). */
    FoundationTriangleLeftDel = 13,
    /** Angled foundation facing right. */
    FoundationAngledRight = 14,
    /** Right triangle foundation (deprecated id). */
    FoundationTriangleRightDel = 15,
    /** Collector structure. */
    Collector = 16,
    /** Left-facing filter. */
    FilterLeft = 17,
    /** Right-facing filter. */
    FilterRight = 18,
    /** Sliding foundation block. */
    SlidingFoundation = 19,
    /** Velocity soaker structure. */
    VelocitySoaker = 20,
    /** Grower structure. */
    Grower = 21,
    /** Sound box structure. */
    SoundBox = 22,
    /** Pipe segment. */
    Pipe = 23,
    /** Pump structure. */
    Pump = 24,
    /** Liquid vent structure. */
    LiquidVent = 25,
    /** Light structure. */
    Light = 26,
    /** Gloom emitter structure. */
    GloomEmitter = 27,
  }

  /**
   * Return the snapped world position for placement at the cell.
   * @param cellX - Grid column of the target cell.
   * @param cellY - Grid row of the target cell.
   * @returns Snapped world position in pixels.
   */
  export function getSnappedPositionAtCell(...args: CellCoordinates): Vector2;

  /**
   * Return true when placement is blocked at the cell.
   * @param cellX - Grid column of the target cell.
   * @param cellY - Grid row of the target cell.
   * @returns True when a structure cannot be placed at the cell.
   */
  export function isBlockedAtCell(...args: CellCoordinates): boolean;

  /** Cancel the current structure placement preview. */
  export function cancelPlacement(): void;

  /**
   * Select a structure for placement by type or id.
   * @param structureTypeOrId - Built-in {@link StructureType} value or registered structure id.
   * @returns Resolved selection, or null when the type or id is invalid.
   */
  export function selectStructure(structureTypeOrId: string | StructureType): string | StructureType | null;
}
