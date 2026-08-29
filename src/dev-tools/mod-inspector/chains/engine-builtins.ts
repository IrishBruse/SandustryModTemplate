/** Resolve live engine recipe string ids into chain steps. */

import type { LiveEngineRecipes } from "./live-engine-recipes.ts";
import { contactStepId } from "./recipe-rows.ts";
export type ResolveElementId = (id: string) => number | null;

export type ResolvedBuiltinStep = {
  id: string;
  kind: "contact-mix" | "machine" | "burn";
  label: string;
  inputs: number[];
  outputs: { elementType: number; chance?: number }[];
};

/** Turn scraped engine recipes into typed chain steps. Skip rows that fail to resolve. */
export function resolveLiveEngineSteps(
  recipes: LiveEngineRecipes,
  resolveId: ResolveElementId,
): ResolvedBuiltinStep[] {
  const steps: ResolvedBuiltinStep[] = [];

  for (const contact of recipes.contacts) {
    const a = resolveId(contact.inputs[0]);
    const b = resolveId(contact.inputs[1]);
    if (a == null || b == null) continue;
    const outputs = contact.outputs
      .map((id) => resolveId(id))
      .filter((type): type is number => type != null)
      .map((elementType) => ({ elementType }));
    if (outputs.length === 0) continue;
    steps.push({
      id: contactStepId(a, b),
      kind: "contact-mix",
      label: "Mix",
      inputs: [a, b],
      outputs,
    });
  }

  for (const machine of recipes.machines) {
    const input = resolveId(machine.input);
    if (input == null) continue;
    const outputs = machine.outputs.flatMap((out) => {
      const elementType = resolveId(out.id);
      if (elementType == null) return [];
      return [{ elementType, chance: out.chance }];
    });
    if (outputs.length === 0) continue;
    steps.push({
      id: `machine:${machine.machineId}:${input}`,
      kind: "machine",
      label: machine.label,
      inputs: [input],
      outputs,
    });
  }

  for (const burn of recipes.burns) {
    const input = resolveId(burn.input);
    const output = resolveId(burn.output);
    if (input == null || output == null) continue;
    steps.push({
      id: `burn:${input}`,
      kind: "burn",
      label: "Burn",
      inputs: [input],
      outputs: [{ elementType: output, chance: burn.chance }],
    });
  }

  return steps;
}
