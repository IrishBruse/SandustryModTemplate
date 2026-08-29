/** Live reaction / recipe index for the Dev Tools Chains element explorer. */

import { listElements, type ElementRow } from "../elements/list-elements";
import { resolveLiveEngineSteps } from "./engine-builtins";
import { getCachedLiveEngineRecipes, type LiveEngineRecipes } from "./live-engine-recipes";
import { contactStepId, machineOutputsFromRow, type RecipeRow } from "./recipe-rows";
import {
  burnIconSrc,
  machineIconSrc,
  STRUCTURE_MACHINE,
  structureIconSrc,
  structureLabel,
  type ReactionKind,
} from "./step-icons";

export type ChainOutput = { elementType: number; chance?: number };

export type ChainStep = {
  id: string;
  kind: ReactionKind;
  label: string;
  iconSrc?: string;
  inputs: number[];
  outputs: ChainOutput[];
};

export type ChainIndex = {
  steps: Map<string, ChainStep>;
  producedBy: Map<number, string[]>;
  consumedBy: Map<number, string[]>;
  elements: Map<number, ElementRow>;
  meta: {
    recipeRows: number;
    elementLinks: number;
    stepCount: number;
  };
};

type ContactRecipe = {
  inputA: number | string;
  inputB: number | string;
  outputA: number | string | null;
  outputB?: number | string | null;
};

type RecipeBag = {
  contacts?: ContactRecipe[];
  condensers?: RecipeRow[];
  steamDryers?: RecipeRow[];
  synthesizers?: RecipeRow[];
  snowmakers?: RecipeRow[];
  smelters?: RecipeRow[];
  shakers?: RecipeRow[];
  growers?: RecipeRow[];
  kineticPresses?: Array<RecipeRow & { minimumDownwardVelocity?: number }>;
};

type MachineBagKey = Exclude<keyof RecipeBag, "contacts">;

const MACHINE_BAGS: { bag: MachineBagKey; machineId: string; label: string }[] = [
  { bag: "condensers", machineId: "condenser", label: "Condenser" },
  { bag: "steamDryers", machineId: "steamDryer", label: "Steam Dryer" },
  { bag: "synthesizers", machineId: "synthesizer", label: "Synthesizer" },
  { bag: "snowmakers", machineId: "snowmaker", label: "Snowmaker" },
  { bag: "smelters", machineId: "smelter", label: "Smelter" },
  { bag: "shakers", machineId: "shaker", label: "Shaker" },
  { bag: "growers", machineId: "grower", label: "Planter Box" },
  { bag: "kineticPresses", machineId: "kineticPress", label: "Kinetic Press" },
];

const MACHINE_ID_BY_BAG: Partial<Record<MachineBagKey, string>> = Object.fromEntries(
  MACHINE_BAGS.map(({ bag, machineId }) => [bag, machineId]),
);

const EMPTY_LIVE: LiveEngineRecipes = { contacts: [], burns: [], machines: [] };

function recipeBag(): RecipeBag {
  try {
    const mods = (
      sandkit.engine?.state as { sandkit?: { mods?: { recipes?: RecipeBag } } } | undefined
    )?.sandkit?.mods;
    return mods?.recipes ?? {};
  } catch {
    return {};
  }
}

function resolveElementType(ref: number | string): number | null {
  if (typeof ref === "number" && Number.isFinite(ref)) return ref;
  if (typeof ref !== "string" || !ref) return null;
  try {
    const type = sandkit.api.elements.getTypeById(ref);
    if (typeof type === "number" && Number.isFinite(type)) return type;
  } catch {
    /* ignore */
  }
  try {
    const types = sandkit.api.elements.getRegisteredTypes();
    for (const type of types) {
      const def = sandkit.api.elements.getDefinitionByType(type);
      if (def?.id === ref) return type;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function structureIdKey(ref: string | number): string {
  if (typeof ref === "string") return ref;
  try {
    const d = sandkit.api.structures.getDefinitionByType(ref);
    const key = d?.nameKey;
    const match = typeof key === "string" ? /^structures\|([^|]+)\|/.exec(key) : null;
    if (match?.[1]) return match[1];
  } catch {
    /* ignore */
  }
  return String(ref);
}

function pushIndex(map: Map<number, string[]>, elementType: number, stepId: string): void {
  const list = map.get(elementType);
  if (list) {
    if (!list.includes(stepId)) list.push(stepId);
  } else {
    map.set(elementType, [stepId]);
  }
}

function addStep(
  steps: Map<string, ChainStep>,
  producedBy: Map<number, string[]>,
  consumedBy: Map<number, string[]>,
  step: ChainStep,
): void {
  if (steps.has(step.id)) return;
  // Collapse Collector (and similar) listed twice under different structure refs.
  if (step.kind === "structure" && step.outputs.length === 0) {
    const dup = [...steps.values()].find(
      (other) =>
        other.kind === "structure" &&
        other.outputs.length === 0 &&
        other.label === step.label &&
        other.inputs.join(",") === step.inputs.join(","),
    );
    if (dup) return;
  }
  steps.set(step.id, step);
  for (const input of step.inputs) pushIndex(consumedBy, input, step.id);
  for (const out of step.outputs) pushIndex(producedBy, out.elementType, step.id);
}

function decorateBuiltinStep(step: ChainStep): ChainStep {
  if (step.kind === "machine") {
    const machineId = step.id.split(":")[1];
    if (machineId) return { ...step, iconSrc: machineIconSrc(machineId) ?? undefined };
  }
  if (step.kind === "burn") return { ...step, iconSrc: burnIconSrc() };
  return step;
}

function addMachineStep(
  steps: Map<string, ChainStep>,
  producedBy: Map<number, string[]>,
  consumedBy: Map<number, string[]>,
  machineId: string,
  label: string,
  recipe: RecipeRow,
): void {
  if (typeof recipe.input !== "number") return;
  const outputs = machineOutputsFromRow(recipe);
  addStep(steps, producedBy, consumedBy, {
    id: `machine:${machineId}:${recipe.input}`,
    kind: "machine",
    label,
    iconSrc: machineIconSrc(machineId) ?? undefined,
    inputs: [recipe.input],
    outputs,
  });
}

/** Build the live reaction index from recipes, mixes, burns, and structure links. */
export function buildChainIndex(): ChainIndex {
  const steps = new Map<string, ChainStep>();
  const producedBy = new Map<number, string[]>();
  const consumedBy = new Map<number, string[]>();
  const elements = new Map<number, ElementRow>();
  for (const row of listElements()) elements.set(row.elementType, row);

  const recipes = recipeBag();
  let recipeRows = 0;
  let elementLinks = 0;

  for (const contact of recipes.contacts ?? []) {
    const a = resolveElementType(contact.inputA);
    const b = resolveElementType(contact.inputB);
    const outA = contact.outputA == null ? null : resolveElementType(contact.outputA);
    const outB = contact.outputB == null ? null : resolveElementType(contact.outputB);
    if (a == null || b == null) continue;
    recipeRows += 1;
    const outputs: ChainOutput[] = [];
    if (outA != null) outputs.push({ elementType: outA });
    if (outB != null) outputs.push({ elementType: outB });
    addStep(steps, producedBy, consumedBy, {
      id: contactStepId(a, b),
      kind: "contact-mix",
      label: "Mix",
      inputs: [a, b],
      outputs,
    });
  }

  for (const { bag, machineId, label } of MACHINE_BAGS) {
    const rows = recipes[bag];
    if (!Array.isArray(rows)) continue;
    for (const row of rows) {
      if (!row || typeof row.input !== "number") continue;
      recipeRows += 1;
      addMachineStep(steps, producedBy, consumedBy, machineId, label, row);
    }
  }

  const live = getCachedLiveEngineRecipes() ?? EMPTY_LIVE;
  for (const step of resolveLiveEngineSteps(live, resolveElementType)) {
    addStep(steps, producedBy, consumedBy, decorateBuiltinStep(step));
  }

  try {
    for (const type of sandkit.api.elements.getRegisteredTypes()) {
      const def = sandkit.api.elements.getDefinitionByType(type) as
        | {
            mixes?: readonly {
              elementType?: number;
              result?: number;
              secondaryResult?: number;
            }[];
            flammable?: {
              outputElementId?: string;
              outputChance?: number;
            };
            interactions?: readonly { kind?: string; structures?: readonly (string | number)[] }[];
          }
        | undefined;
      if (!def) continue;

      if (Array.isArray(def.mixes)) {
        for (const mix of def.mixes) {
          if (typeof mix.elementType !== "number" || typeof mix.result !== "number") continue;
          elementLinks += 1;
          const outputs: ChainOutput[] = [{ elementType: mix.result }];
          if (typeof mix.secondaryResult === "number") {
            outputs.push({ elementType: mix.secondaryResult });
          }
          // Canonical id so A+B and B+A collapse when both defs list the pair.
          const lo = Math.min(type, mix.elementType);
          const hi = Math.max(type, mix.elementType);
          addStep(steps, producedBy, consumedBy, {
            id: `mix:element:${lo}+${hi}`,
            kind: "element-mix",
            label: "Mix",
            inputs: [type, mix.elementType],
            outputs,
          });
        }
      }

      const flam = def.flammable;
      if (flam && typeof flam === "object" && typeof flam.outputElementId === "string") {
        const outType = resolveElementType(flam.outputElementId);
        if (outType != null) {
          elementLinks += 1;
          addStep(steps, producedBy, consumedBy, {
            id: `burn:${type}`,
            kind: "burn",
            label: "Burn",
            iconSrc: burnIconSrc(),
            inputs: [type],
            outputs: [{ elementType: outType, chance: flam.outputChance }],
          });
        }
      }

      if (Array.isArray(def.interactions)) {
        for (const ix of def.interactions) {
          if (!ix || ix.kind !== "structure" || !Array.isArray(ix.structures)) continue;
          for (const ref of ix.structures) {
            elementLinks += 1;
            const idKey = structureIdKey(ref);
            const machineMeta = STRUCTURE_MACHINE[idKey] ?? STRUCTURE_MACHINE[String(ref)];

            if (machineMeta) {
              const bag = machineMeta.bag as MachineBagKey;
              const machineId = MACHINE_ID_BY_BAG[bag] ?? machineMeta.bag;
              if (steps.has(`machine:${machineId}:${type}`)) continue;
              const rows = recipes[bag];
              const match = Array.isArray(rows)
                ? rows.find((row) => row && typeof row.input === "number" && row.input === type)
                : undefined;
              if (match) {
                addMachineStep(steps, producedBy, consumedBy, machineId, machineMeta.label, match);
                continue;
              }
            }

            addStep(steps, producedBy, consumedBy, {
              id: `structure:${idKey}:${type}`,
              kind: "structure",
              label: structureLabel(ref),
              iconSrc: structureIconSrc(ref) ?? undefined,
              inputs: [type],
              outputs: [],
            });
          }
        }
      }
    }
  } catch {
    /* ignore */
  }

  return {
    steps,
    producedBy,
    consumedBy,
    elements,
    meta: {
      recipeRows,
      elementLinks,
      stepCount: steps.size,
    },
  };
}

/** Count of steps that produce or consume an element (for picker badges). */
export function elementStepCount(index: ChainIndex, elementType: number): number {
  const produced = index.producedBy.get(elementType)?.length ?? 0;
  const consumed = index.consumedBy.get(elementType)?.length ?? 0;
  return produced + consumed;
}
