const ET = sandkit.enums.ElementType;

const NAME_BY_TYPE = new Map<number, string>();

for (const key of Object.keys(ET) as Array<keyof typeof ET>) {
  const value = ET[key];
  if (typeof value === "number") NAME_BY_TYPE.set(value, key);
}

/** Built-in enum name (e.g. `Sand`) or mod element id when unknown. */
export function elementTypeName(elementType: number, id: string): string {
  return NAME_BY_TYPE.get(elementType) ?? id;
}

export function isBuiltInElementType(elementType: number): boolean {
  return NAME_BY_TYPE.has(elementType);
}
