import assert from "node:assert/strict";
import test from "node:test";
import type { ChainIndex, ChainStep } from "./chain-index.ts";
import { buildTree, rowIsOpen, toggleExpanded } from "./chain-tree.ts";
import type { ReactionKind } from "./step-icons.ts";

const ALL_KINDS = new Set<ReactionKind>([
  "contact-mix",
  "element-mix",
  "machine",
  "burn",
  "structure",
]);

function step(partial: ChainStep): ChainStep {
  return partial;
}

/** Minimal index: Florin(1) → Condenser → Gold(2) 50% / Florinol(3) 50%; Gold → Collector. */
function fixtureIndex(): ChainIndex {
  const steps = new Map<string, ChainStep>();
  const producedBy = new Map<number, string[]>();
  const consumedBy = new Map<number, string[]>();

  const condenser = step({
    id: "machine:condenser:1",
    kind: "machine",
    label: "Condenser",
    inputs: [1],
    outputs: [
      { elementType: 2, chance: 0.5 },
      { elementType: 3, chance: 0.5 },
    ],
  });
  const collector = step({
    id: "structure:collector:2",
    kind: "structure",
    label: "Collector",
    inputs: [2],
    outputs: [],
  });
  const mixSteam = step({
    id: "mix:element:4+99",
    kind: "element-mix",
    label: "Mix",
    inputs: [4, 99],
    outputs: [{ elementType: 5 }],
  });
  const condenserWater = step({
    id: "machine:condenser:5",
    kind: "machine",
    label: "Condenser",
    inputs: [5],
    outputs: [{ elementType: 4 }],
  });

  for (const s of [condenser, collector, mixSteam, condenserWater]) {
    steps.set(s.id, s);
  }
  producedBy.set(2, [condenser.id]);
  producedBy.set(3, [condenser.id]);
  producedBy.set(5, [mixSteam.id]);
  producedBy.set(4, [condenserWater.id]);
  consumedBy.set(1, [condenser.id]);
  consumedBy.set(2, [collector.id]);
  consumedBy.set(4, [mixSteam.id]);
  consumedBy.set(5, [condenserWater.id]);
  consumedBy.set(99, [mixSteam.id]);

  return {
    steps,
    producedBy,
    consumedBy,
    elements: new Map(),
    meta: { recipeRows: 2, elementLinks: 2, stepCount: 4 },
  };
}

test("down tree nests Condenser step then Gold and Florinol", () => {
  const rows = buildTree({
    index: fixtureIndex(),
    rootType: 1,
    dir: "down",
    maxDepth: 4,
    enabledKinds: ALL_KINDS,
    expanded: new Set(),
  });
  assert.equal(rows[0]!.kind, "step");
  assert.equal(rows[0]!.step.label, "Condenser");
  const els = rows.filter((row) => row.kind === "element" && row.depth === 2);
  assert.equal(els.length, 2);
  assert.deepEqual(
    els.map((row) => row.elementType).sort((a, b) => (a ?? 0) - (b ?? 0)),
    [2, 3],
  );
  assert.equal(els.find((row) => row.elementType === 2)?.chance, 0.5);
});

test("up tree nests Condenser then Florin under Gold", () => {
  const rows = buildTree({
    index: fixtureIndex(),
    rootType: 2,
    dir: "up",
    maxDepth: 4,
    enabledKinds: ALL_KINDS,
    expanded: new Set(),
  });
  assert.equal(rows[0]!.kind, "step");
  assert.equal(rows[0]!.step.label, "Condenser");
  assert.equal(rows[0]!.chance, 0.5);
  const florin = rows.find((row) => row.kind === "element" && row.elementType === 1);
  assert.ok(florin);
});

test("kind filter hides machine steps", () => {
  const rows = buildTree({
    index: fixtureIndex(),
    rootType: 1,
    dir: "down",
    maxDepth: 4,
    enabledKinds: new Set(["structure"]),
    expanded: new Set(),
  });
  assert.equal(rows.length, 0);
});

test("structure used-in is a sink step under Gold", () => {
  const rows = buildTree({
    index: fixtureIndex(),
    rootType: 2,
    dir: "down",
    maxDepth: 4,
    enabledKinds: ALL_KINDS,
    expanded: new Set(),
  });
  const sink = rows.find(
    (row) => row.sink && row.kind === "step" && row.step.label === "Collector",
  );
  assert.ok(sink);
  assert.equal(sink!.hasChildren, false);
});

test("depth cap stops element hops", () => {
  const shallow = buildTree({
    index: fixtureIndex(),
    rootType: 1,
    dir: "down",
    maxDepth: 1,
    enabledKinds: ALL_KINDS,
    expanded: new Set(),
    autoExpandDepth: 8,
  });
  // Condenser + Gold + Florinol; Gold may not expand further into Collector.
  assert.ok(shallow.every((row) => (row.expandDepth ?? 0) <= 1));
  const gold = shallow.find((row) => row.elementType === 2 && row.kind === "element");
  assert.ok(gold);
  assert.equal(gold!.hasChildren, false);
});

test("cycle marks loop on element and does not recurse", () => {
  const rows = buildTree({
    index: fixtureIndex(),
    rootType: 4,
    dir: "down",
    maxDepth: 8,
    enabledKinds: ALL_KINDS,
    expanded: new Set(),
    autoExpandDepth: 8,
  });
  const loopRow = rows.find((row) => row.loop);
  assert.ok(loopRow, "expected a loop row");
  assert.equal(loopRow!.kind, "element");
  assert.equal(loopRow!.elementType, 4);
  assert.equal(loopRow!.hasChildren, false);
  assert.ok(!rows.some((row) => row.path.startsWith(`${loopRow!.path}>`)));
});

test("duplicate steps get independent paths and rails", () => {
  const index = fixtureIndex();
  const alt = step({
    id: "machine:smelter:10",
    kind: "machine",
    label: "Smelter",
    inputs: [10],
    outputs: [{ elementType: 2 }],
  });
  index.steps.set(alt.id, alt);
  index.producedBy.get(2)!.push(alt.id);
  index.consumedBy.set(10, [alt.id]);

  const rows = buildTree({
    index,
    rootType: 2,
    dir: "up",
    maxDepth: 4,
    enabledKinds: ALL_KINDS,
    expanded: new Set(),
  });
  const stepRows = rows.filter((row) => row.kind === "step" && row.depth === 1);
  assert.equal(stepRows.length, 2);
  assert.notEqual(stepRows[0]!.path, stepRows[1]!.path);
  assert.equal(stepRows[0]!.isLast, false);
  assert.equal(stepRows[1]!.isLast, true);
});

test("toggleExpanded forces open and closed past autoExpand", () => {
  let expanded = new Set<string>();
  assert.equal(rowIsOpen("el:1>x", 1, expanded, 2), true);
  expanded = toggleExpanded(expanded, "el:1>x", true);
  assert.equal(rowIsOpen("el:1>x", 1, expanded, 2), false);
  expanded = toggleExpanded(expanded, "el:1>x", false);
  assert.equal(rowIsOpen("el:1>x", 1, expanded, 2), true);
});
