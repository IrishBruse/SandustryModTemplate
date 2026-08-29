import assert from "node:assert/strict";
import test from "node:test";
import type { ChainIndex, ChainStep } from "./chain-index.ts";
import { flowBlurb, hopNeighbors, stepsFor } from "./chain-tree.ts";
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

/** Florin(1) → Condenser → Gold(2) 50% / Florinol(3); Gold → Smelter → Liquid(20); Gold → Collector. */
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
  const smelter = step({
    id: "machine:smelter:2",
    kind: "machine",
    label: "Smelter",
    inputs: [2],
    outputs: [{ elementType: 20, chance: 0.5 }],
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

  for (const s of [condenser, smelter, collector, mixSteam, condenserWater]) {
    steps.set(s.id, s);
  }
  producedBy.set(2, [condenser.id]);
  producedBy.set(3, [condenser.id]);
  producedBy.set(20, [smelter.id]);
  producedBy.set(5, [mixSteam.id]);
  producedBy.set(4, [condenserWater.id]);
  consumedBy.set(1, [condenser.id]);
  consumedBy.set(2, [smelter.id, collector.id]);
  consumedBy.set(4, [mixSteam.id]);
  consumedBy.set(5, [condenserWater.id]);
  consumedBy.set(99, [mixSteam.id]);

  const elements = new Map();
  elements.set(1, { name: "Florin" });
  elements.set(2, { name: "Gold" });
  elements.set(3, { name: "Florinol" });
  elements.set(4, { name: "Water" });
  elements.set(5, { name: "Steam" });
  elements.set(20, { name: "Liquid Gold" });
  elements.set(99, { name: "Heat" });

  return {
    steps,
    producedBy,
    consumedBy,
    elements: elements as ChainIndex["elements"],
    meta: { recipeRows: 3, elementLinks: 2, stepCount: 5 },
  };
}

test("Gold does: smelter then collector", () => {
  const index = fixtureIndex();
  const does = stepsFor(index, 2, "down", ALL_KINDS);
  assert.deepEqual(
    does.map((entry) => entry.label),
    ["Smelter", "Collector"],
  );
});

test("Gold comes from condenser", () => {
  const index = fixtureIndex();
  const from = stepsFor(index, 2, "up", ALL_KINDS);
  assert.equal(from.length, 1);
  assert.equal(from[0]!.label, "Condenser");
});

test("kind filter hides machine steps", () => {
  const does = stepsFor(fixtureIndex(), 2, "down", new Set(["structure"]));
  assert.equal(does.length, 1);
  assert.equal(does[0]!.label, "Collector");
});

test("does blurb reads Gold as the subject", () => {
  const text = flowBlurb(fixtureIndex(), 2, "down", ALL_KINDS);
  assert.equal(
    text,
    "Gold → Smelter → Liquid Gold (50%). Gold → Collector.",
  );
});

test("from blurb reads toward Gold", () => {
  const text = flowBlurb(fixtureIndex(), 2, "up", ALL_KINDS);
  assert.equal(text, "Florin → Condenser → Gold (50%).");
});

test("down neighbors of smelter are liquid gold", () => {
  const smelter = fixtureIndex().steps.get("machine:smelter:2")!;
  assert.deepEqual(hopNeighbors(smelter, "down", 2), [20]);
  const collector = fixtureIndex().steps.get("structure:collector:2")!;
  assert.deepEqual(hopNeighbors(collector, "down", 2), []);
});

test("up neighbors of condenser are florin", () => {
  const condenser = fixtureIndex().steps.get("machine:condenser:1")!;
  assert.deepEqual(hopNeighbors(condenser, "up", 2), [1]);
});
