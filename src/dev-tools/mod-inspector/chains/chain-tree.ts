/** Direct recipe hops for the Chains element explorer. */

import type { ChainIndex, ChainStep } from "./chain-index";
import type { ReactionKind } from "./step-icons";

export type TreeDirection = "up" | "down";

export function stepsFor(
  index: ChainIndex,
  elementType: number,
  dir: TreeDirection,
  enabledKinds: ReadonlySet<ReactionKind>,
): ChainStep[] {
  const raw = dir === "up" ? index.producedBy.get(elementType) : index.consumedBy.get(elementType);
  if (!raw?.length) return [];
  const out: ChainStep[] = [];
  for (const id of raw) {
    const step = index.steps.get(id);
    if (step && enabledKinds.has(step.kind)) out.push(step);
  }
  return out;
}

/** Far-side elements for the next hop (inputs when going up, outputs when going down). */
export function hopNeighbors(step: ChainStep, dir: TreeDirection, fromType: number): number[] {
  if (dir === "up") return step.inputs.filter((type) => type !== fromType);
  return step.outputs.map((out) => out.elementType).filter((type) => type !== fromType);
}

function chanceText(chance: number | undefined): string | null {
  if (chance == null || !(chance < 1)) return null;
  return `${Math.round(chance * 100)}%`;
}

function nameOf(index: ChainIndex, type: number): string {
  return index.elements.get(type)?.name ?? `type ${type}`;
}

/** One-line explanation of what the focused element does or comes from. */
export function flowBlurb(
  index: ChainIndex,
  rootType: number,
  dir: TreeDirection,
  enabledKinds: ReadonlySet<ReactionKind>,
): string {
  const steps = stepsFor(index, rootType, dir, enabledKinds);
  if (steps.length === 0) return dir === "down" ? "No uses." : "No sources.";
  const rootName = nameOf(index, rootType);
  return steps
    .map((step) => {
      if (dir === "down") {
        if (step.outputs.length === 0) return `${rootName} → ${step.label}.`;
        const outs = step.outputs
          .map((out) => {
            const pct = chanceText(out.chance);
            return `${nameOf(index, out.elementType)}${pct ? ` (${pct})` : ""}`;
          })
          .join(" + ");
        return `${rootName} → ${step.label} → ${outs}.`;
      }
      const ins = step.inputs.map((type) => nameOf(index, type)).join(" + ");
      const out = step.outputs.find((entry) => entry.elementType === rootType);
      const pct = chanceText(out?.chance);
      return `${ins} → ${step.label} → ${rootName}${pct ? ` (${pct})` : ""}.`;
    })
    .join(" ");
}
