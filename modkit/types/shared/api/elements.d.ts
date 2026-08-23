import { CellCoordinates } from "../../shared/player";

export namespace elements {
  export type ElementType = number;
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

  export function getTypeFromId(elementId: string): ElementType;
  export function getDefinitionByType(elementType: ElementType): ElementDefinition | undefined;
  export function getTypeAtCell(...args: CellCoordinates): ElementType | null;
  export function getResolvedTypeAtCell(...args: CellCoordinates): ElementType | null;
  export function getResolvedTypeFromCellId(cellId: number): ElementType | null;
  export function getInfoAtCell(...args: CellCoordinates): { elementType: ElementType; isParticle: boolean; cellId: number; elementIndex: number; } | null;
  export function getMatterTypeAtCell(...args: CellCoordinates): MatterType | null;
  export function isTypeAtCell(...args: [...CellCoordinates, elementType: ElementType]): boolean;
  export function isFreeFallingAtCell(...args: CellCoordinates): boolean;
  export function getVelocityAtCell(...args: CellCoordinates): { x: number; y: number; } | null;
  export function getDataFieldAtCell(...args: [...CellCoordinates, fieldNumber: 1 | 2 | 3 | 4]): number | null;
}

