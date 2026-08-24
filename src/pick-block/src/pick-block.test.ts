import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildCopiedStructure,
  normalizeFilterElementType,
  shouldCopyStructureData,
  type StructureAtCell,
  type StructureConfigLite,
} from "./copied-structure.ts";
import { collectStructureTypeKeys, resolvePickStructureType } from "./resolve-type.ts";

const configs: Record<string, StructureConfigLite> = {
  conveyorLeft: { buildModes: [{ type: "line" }] },
  conveyorLeftMk2: { variants: [{ id: "conveyorLeftMk2" }] },
  filterLeft: { buildModes: [{ type: "filterHorizontal" }] },
  filterLeftMk2: { buildModes: [{ type: "filterHorizontal" }] },
  noCopy: { buildModes: [{}], copyData: false },
  skipCopy: { buildModes: [{}], skipCopyData: true },
};

function getConfig(type: string | number): StructureConfigLite | undefined {
  return configs[String(type)];
}

test("resolvePickStructureType keeps build-mode types", () => {
  assert.equal(
    resolvePickStructureType("conveyorLeft", getConfig, Object.keys(configs)),
    "conveyorLeft",
  );
});

test("resolvePickStructureType maps variants to build-mode parent", () => {
  configs.conveyorLeft = {
    buildModes: [{ type: "line" }],
    variants: [{ id: "conveyorLeftMk2" }],
  };

  assert.equal(
    resolvePickStructureType("conveyorLeftMk2", getConfig, Object.keys(configs)),
    "conveyorLeft",
  );
});

test("resolvePickStructureType prefers parent with buildModes over fallback", () => {
  configs.parentA = { variants: [{ id: "variantX" }] };
  configs.parentB = {
    buildModes: [{ type: "line" }],
    variants: [{ id: "variantX" }],
  };

  assert.equal(resolvePickStructureType("variantX", getConfig, Object.keys(configs)), "parentB");
});

test("collectStructureTypeKeys merges enum values and unlocked types", () => {
  const keys = collectStructureTypeKeys([1, 2, 3], ["mod.structure", 2]);
  assert.deepEqual(keys.sort(), ["mod.structure", 1, 2, 3].sort());
});

test("shouldCopyStructureData respects copyData and skipCopyData", () => {
  assert.equal(shouldCopyStructureData({ buildModes: [{}] }), true);
  assert.equal(shouldCopyStructureData({ buildModes: [{}], copyData: false }), false);
  assert.equal(shouldCopyStructureData({ buildModes: [{}], skipCopyData: true }), false);
});

test("buildCopiedStructure clones filter, data, and color", () => {
  const structure: StructureAtCell = {
    type: "conveyorLeft",
    filter: { mode: "allow", elementType: 4 },
    data: { spriteIndex: 2 },
    color: "#ff0000",
  };

  const copied = buildCopiedStructure(structure, { buildModes: [{}] });
  assert.notEqual(copied.filter, structure.filter);
  assert.deepEqual(copied.filter, structure.filter);
  assert.notEqual(copied.data, structure.data);
  assert.deepEqual(copied.data, structure.data);
  assert.equal(copied.color, "#ff0000");
});

test("buildCopiedStructure skips data when copy is disabled", () => {
  const structure: StructureAtCell = {
    type: "noCopy",
    data: { spriteIndex: 1 },
  };

  assert.equal(buildCopiedStructure(structure, configs.noCopy).data, undefined);
  assert.equal(buildCopiedStructure(structure, configs.skipCopy).data, undefined);
});

test("normalizeFilterElementType wraps scalars", () => {
  assert.deepEqual(normalizeFilterElementType(4), [4]);
  assert.deepEqual(normalizeFilterElementType([4, 5]), [4, 5]);
});
