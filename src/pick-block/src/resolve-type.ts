import type { StructureConfigLite } from "./copied-structure";

export function normalizeStructureTypeKey(key: string | number): string | number {
  if (typeof key === "number") return key;
  const num = Number(key);
  return Number.isNaN(num) ? key : num;
}

export function resolvePickStructureType(
  type: string | number,
  getConfig: (candidate: string | number) => StructureConfigLite | undefined,
  allTypeKeys: Iterable<string | number>,
): string | number {
  const self = getConfig(type);
  if (self?.buildModes?.length) return type;

  let fallback: string | number | null = null;
  for (const parentKey of allTypeKeys) {
    if (parentKey == type) continue;

    const parent = getConfig(parentKey);
    const variants = parent?.variants;
    if (!variants?.some((variant) => variant.id == type)) continue;

    const normalizedParent = normalizeStructureTypeKey(parentKey);
    if (parent?.buildModes?.length) return normalizedParent;
    if (fallback === null) fallback = normalizedParent;
  }

  return fallback ?? type;
}

export function collectStructureTypeKeys(
  enumValues: readonly (string | number)[],
  unlocked: Iterable<string | number>,
): (string | number)[] {
  const keys = new Set<string | number>();
  for (const value of enumValues) keys.add(value);
  for (const type of unlocked) keys.add(type);
  return [...keys];
}
