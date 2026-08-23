import { CellCoordinates } from "../../shared/player";

/**
 * Shared `sandkit.api.elements` base — element reads and definitions.
 *
 * Workers add direct mutation helpers on top of this shape. Main thread adds
 * idle-scheduled mutations and registration APIs.
 *
 * @internal Base namespace reused by main and worker declarations.
 */
export namespace elements {
  /** Numeric element type handle. */
  export type ElementType = number;
  /** Physical behaviour category for an element. */
  export enum MatterType {
    Solid = 1,
    Liquid = 2,
    Particle = 3,
    Gas = 4,
    Static = 5,
    Slushy = 6,
    Wisp = 7,
    Powder = 8,
  }
  /** Mod-registered element definition snapshot. */
  export type ElementDefinition = {
    id: string,
    nameKey: string,
    defaultDataFields?: { [key: string]: number },
    colors: {
      variantFromDataField1?: {
        rangeMin?: number,
        rangeMax?: number,
        invert?: boolean,
        useGradient?: boolean,
      },
      variants: [number, number, number][],
    },
    density: number,
    matterType: MatterType,
    getExtraProps?: () => { data: Record<PropertyKey, any> }
  };

  /** Resolve a mod element string id to a type handle. */
  export function getTypeFromId(elementId: string): ElementType;
  /** Look up the definition for a type handle. */
  export function getDefinitionByType(elementType: ElementType): ElementDefinition | undefined;
  /** Raw element type at a cell (may differ from resolved type). */
  export function getTypeAtCell(...args: CellCoordinates): ElementType | null;
  /** Resolved element type after overlays and particles. */
  export function getResolvedTypeAtCell(...args: CellCoordinates): ElementType | null;
  /** Resolved element type from a packed cell id. */
  export function getResolvedTypeFromCellId(cellId: number): ElementType | null;
  /** Element index, particle flag, and ids at a cell. */
  export function getInfoAtCell(...args: CellCoordinates): { elementType: ElementType; isParticle: boolean; cellId: number; elementIndex: number; } | null;
  /** Matter category at a cell, or null when empty. */
  export function getMatterTypeAtCell(...args: CellCoordinates): MatterType | null;
  /** True when the cell holds the given element type. */
  export function isTypeAtCell(...args: [...CellCoordinates, elementType: ElementType]): boolean;
  /** True when the element at the cell is falling. */
  export function isFreeFallingAtCell(...args: CellCoordinates): boolean;
  /** Per-cell velocity for moving elements. */
  export function getVelocityAtCell(...args: CellCoordinates): { x: number; y: number; } | null;
  /** Read element data field 1–4 at a cell. */
  export function getDataFieldAtCell(...args: [...CellCoordinates, fieldNumber: 1 | 2 | 3 | 4]): number | null;
}
