export type PickedStructurePayload = {
  filter?: unknown;
  data?: unknown;
  color?: unknown;
};

export type StructureConfigLite = {
  copyData?: boolean;
  skipCopyData?: boolean;
  disallowPick?: boolean;
  buildModes?: unknown[];
  variants?: { id: string | number; angles?: number[] }[];
  nameKey?: string;
  name?: string;
};

export type StructureFilter = {
  elementType?: unknown;
  mode?: string;
  affectsLiquid?: boolean;
  affectsGas?: boolean;
};

export type StructureAtCell = {
  type: string | number;
  filter?: StructureFilter;
  data?: unknown;
  color?: unknown;
};

export function shouldCopyStructureData(config: StructureConfigLite | undefined): boolean {
  if (!config) return false;
  return config.copyData !== false && !config.skipCopyData;
}

export function buildCopiedStructure(
  structure: StructureAtCell,
  config: StructureConfigLite | undefined,
): PickedStructurePayload {
  const copied: PickedStructurePayload = {};

  if (structure.filter) {
    copied.filter = JSON.parse(JSON.stringify(structure.filter));
  }
  if (structure.data && shouldCopyStructureData(config)) {
    copied.data = JSON.parse(JSON.stringify(structure.data));
  }
  if (structure.color !== undefined && structure.color !== null) {
    copied.color = structure.color;
  }

  return copied;
}

export function normalizeFilterElementType(elementType: unknown): unknown[] {
  if (Array.isArray(elementType)) return [...elementType];
  return [elementType];
}
