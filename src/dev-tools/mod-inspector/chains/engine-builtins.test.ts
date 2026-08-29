import assert from "node:assert/strict";
import test from "node:test";
import { resolveLiveEngineSteps } from "./engine-builtins.ts";
import {
  parseBurnFallbacks,
  parseContactTriples,
  parseGrowerFallback,
  parseLiveEngineRecipes,
  parseShakerGoldChance,
  machinesFromStructureDescriptions,
  rjToElementId,
  type LiveEngineRecipes,
} from "./live-engine-recipes.ts";
import { contactStepId, machineOutputsFromRow } from "./recipe-rows.ts";

const VANILLA_IDS: Record<string, number> = {
  sand: 1,
  water: 3,
  wetSand: 4,
  residue: 6,
  gold: 7,
  steam: 10,
  flame: 13,
  burntResidue: 14,
  seed: 15,
  wetSeed: 16,
  seedling: 17,
  lava: 19,
};

function resolveId(id: string): number | null {
  return VANILLA_IDS[id] ?? null;
}

const BUNDLE_SNIPPET = `
const d=[[r.RJ.Water,r.RJ.Sand,r.RJ.WetSand],[r.RJ.Water,r.RJ.Seed,r.RJ.WetSeed],[r.RJ.Water,r.RJ.Lava,r.RJ.Steam],[r.RJ.Water,r.RJ.Flame,r.RJ.Steam]];
E={[r.RJ.Residue]:()=>({output:{elementType:r.RJ.BurntResidue,chance:.25}})};
const chance=e.store.tutorial.currentStep===o.vJ.RefineWetSand?.5:.25;
"structures|velocitySoaker|description":"Drop {t:elements|burntResidue|name} on the {t:structures|velocitySoaker|name} from a great height to refine it into {t:elements|gold|name} and {t:elements|seed|name}.",
"structures|shaker|description":"Place {t:elements|wetSand|name} on the shaker to refine it automatically into {t:elements|gold|name} (↓) and {t:elements|residue|name}. Should be built diagonally to allow natural throughput.",
"structures|grower|description":"Drop {t:elements|wetSeed|name} on a {t:structures|grower|name} to start growing flowers that you can destroy to get {t:elements|gold|name} and {t:elements|petalium|name}.",
t===r.RJ.WetSeed&&(u.FH.elements.replaceAt(e,i,n,r.RJ.Seedling),!0)
`;

test("shaker flattens outputsAbove and outputsBelow", () => {
  assert.deepEqual(
    machineOutputsFromRow({
      input: 4,
      outputsAbove: [{ elementType: 6 }],
      outputsBelow: [{ elementType: 7, chance: 0.25 }],
    }),
    [{ elementType: 6 }, { elementType: 7, chance: 0.25 }],
  );
});

test("grower row uses output not outputs[]", () => {
  assert.deepEqual(machineOutputsFromRow({ input: 16, output: 17, chance: 1 }), [
    { elementType: 17, chance: 1 },
  ]);
});

test("contact ids sort both orders", () => {
  assert.equal(contactStepId(1, 3), contactStepId(3, 1));
  assert.equal(contactStepId(1, 3), "mix:contact:1+3");
});

test("rjToElementId lowercases enum names", () => {
  assert.equal(rjToElementId("BurntResidue"), "burntResidue");
  assert.equal(rjToElementId("WetSand"), "wetSand");
});

test("parses contact triples from the engine table", () => {
  const contacts = parseContactTriples(BUNDLE_SNIPPET);
  assert.equal(contacts.length, 4);
  assert.deepEqual(contacts[0], { inputs: ["water", "sand"], outputs: ["wetSand"] });
  assert.deepEqual(contacts[1], { inputs: ["water", "seed"], outputs: ["wetSeed"] });
});

test("parses residue burn fallback", () => {
  assert.deepEqual(parseBurnFallbacks(BUNDLE_SNIPPET), [
    { input: "residue", output: "burntResidue", chance: 0.25 },
  ]);
});

test("parses shaker gold chance", () => {
  assert.equal(parseShakerGoldChance(BUNDLE_SNIPPET), 0.25);
});

test("press description yields gold and seed", () => {
  const machines = machinesFromStructureDescriptions(BUNDLE_SNIPPET, 0.25);
  const press = machines.find((row) => row.machineId === "kineticPress");
  assert.ok(press);
  assert.equal(press.input, "burntResidue");
  assert.deepEqual(
    press.outputs.map((out) => out.id),
    ["gold", "seed"],
  );
});

test("shaker description yields gold chance and residue", () => {
  const machines = machinesFromStructureDescriptions(BUNDLE_SNIPPET, 0.25);
  const shaker = machines.find((row) => row.machineId === "shaker");
  assert.ok(shaker);
  assert.equal(shaker.input, "wetSand");
  assert.deepEqual(shaker.outputs, [{ id: "gold", chance: 0.25 }, { id: "residue" }]);
});

test("grower description is not used as a machine row", () => {
  const machines = machinesFromStructureDescriptions(BUNDLE_SNIPPET, 0.25);
  assert.equal(
    machines.some((row) => row.machineId === "grower"),
    false,
  );
});

test("grower fallback comes from WetSeed→Seedling code", () => {
  assert.deepEqual(parseGrowerFallback(BUNDLE_SNIPPET), [
    {
      machineId: "grower",
      label: "Planter Box",
      input: "wetSeed",
      outputs: [{ id: "seedling" }],
    },
  ]);
});

test("live recipes resolve press and burn steps", () => {
  const recipes = parseLiveEngineRecipes(BUNDLE_SNIPPET);
  const steps = resolveLiveEngineSteps(recipes, resolveId);
  const press = steps.find((step) => step.id === "machine:kineticPress:14");
  const burn = steps.find((step) => step.id === "burn:6");
  assert.ok(press);
  assert.deepEqual(
    press.outputs.map((out) => out.elementType),
    [7, 15],
  );
  assert.ok(burn);
  assert.equal(burn.outputs[0]?.elementType, 14);
  assert.equal(burn.outputs[0]?.chance, 0.25);
  assert.ok(steps.some((step) => step.id === contactStepId(3, 15)));
});

test("skips a live row when an id does not resolve", () => {
  const recipes: LiveEngineRecipes = {
    contacts: [],
    burns: [{ input: "residue", output: "burntResidue", chance: 0.25 }],
    machines: [],
  };
  assert.equal(resolveLiveEngineSteps(recipes, () => null).length, 0);
  const noResidue = resolveLiveEngineSteps(recipes, (id) =>
    id === "residue" ? null : resolveId(id),
  );
  assert.equal(noResidue.length, 0);
});
