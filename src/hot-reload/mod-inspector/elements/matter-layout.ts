import type { ElementRow } from "./list-elements";

export type MatterGroup = {
  label: string;
  matterType: number;
  elements: ElementRow[];
};

const MATTER_ORDER = [1, 8, 6, 2, 3, 4, 7, 5, 0] as const;

/** Group elements by game matter type, sorted by type number within each group. */
export function buildMatterGroups(elements: ElementRow[]): MatterGroup[] {
  const buckets = new Map<number, ElementRow[]>();

  for (const element of elements) {
    const key = element.matterType;
    const bucket = buckets.get(key);
    if (bucket) bucket.push(element);
    else buckets.set(key, [element]);
  }

  const groups: MatterGroup[] = [];
  const seen = new Set<number>();

  for (const matterType of MATTER_ORDER) {
    const bucket = buckets.get(matterType);
    if (!bucket?.length) continue;
    seen.add(matterType);
    bucket.sort((a, b) => a.elementType - b.elementType);
    groups.push({
      matterType,
      label: bucket[0]!.matterLabel,
      elements: bucket,
    });
  }

  for (const [matterType, bucket] of buckets) {
    if (seen.has(matterType) || !bucket.length) continue;
    bucket.sort((a, b) => a.elementType - b.elementType);
    groups.push({
      matterType,
      label: bucket[0]!.matterLabel,
      elements: bucket,
    });
  }

  return groups;
}
