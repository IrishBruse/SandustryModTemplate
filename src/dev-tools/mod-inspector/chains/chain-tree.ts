/** Pure tree expansion for the Chains element explorer. */

import type { ChainIndex, ChainStep } from "./chain-index";
import type { ReactionKind } from "./step-icons";

export type TreeDirection = "up" | "down";

export type TreeRowKind = "step" | "element";

export type TreeRow = {
  /** Full path key for expand state. */
  path: string;
  depth: number;
  /** Element-hop depth used for auto-expand / toggle (not visual indent). */
  expandDepth: number;
  kind: TreeRowKind;
  step: ChainStep;
  /** Set on element rows (and sink steps that consume this type). */
  elementType?: number;
  /** Chance on a produced/consumed output for this branch. */
  chance?: number;
  /** Element already appears on this path — terminal. */
  loop: boolean;
  /** Structure (or other) step with no outputs — Used-in sink. */
  sink: boolean;
  hasChildren: boolean;
  /** Last among siblings — draws └ instead of ├. */
  isLast: boolean;
  /** For each ancestor depth, whether that ancestor was last among its siblings. */
  ancestorLast: boolean[];
};

export type BuildTreeOptions = {
  index: ChainIndex;
  rootType: number;
  dir: TreeDirection;
  maxDepth: number;
  enabledKinds: ReadonlySet<ReactionKind>;
  /** Path → expanded. Missing keys are treated as collapsed unless autoExpandDepth. */
  expanded: ReadonlySet<string>;
  /** Auto-expand paths whose depth is less than this (default 2). */
  autoExpandDepth?: number;
};

function chanceForOutput(step: ChainStep, elementType: number): number | undefined {
  const out = step.outputs.find((entry) => entry.elementType === elementType);
  return out?.chance;
}

function neighborElements(
  step: ChainStep,
  dir: TreeDirection,
): { elementType: number; chance?: number }[] {
  if (dir === "up") {
    return step.inputs.map((elementType) => ({ elementType }));
  }
  return step.outputs.map((out) => ({
    elementType: out.elementType,
    chance: out.chance,
  }));
}

function stepIdsFor(
  index: ChainIndex,
  elementType: number,
  dir: TreeDirection,
  enabledKinds: ReadonlySet<ReactionKind>,
): string[] {
  const raw = dir === "up" ? index.producedBy.get(elementType) : index.consumedBy.get(elementType);
  if (!raw?.length) return [];
  return raw.filter((id) => {
    const step = index.steps.get(id);
    return step != null && enabledKinds.has(step.kind);
  });
}

function pathHasElement(path: string, elementType: number): boolean {
  const token = `el:${elementType}`;
  if (path === token || path.endsWith(`>${token}`)) return true;
  return path.split(">").includes(token);
}

function isExpanded(
  path: string,
  depth: number,
  expanded: ReadonlySet<string>,
  autoExpandDepth: number,
): boolean {
  if (expanded.has(path)) return true;
  if (expanded.has(`!${path}`)) return false;
  return depth < autoExpandDepth;
}

type Frame = {
  elementType: number;
  path: string;
  /** Element-hop depth from root (steps nest between). */
  elementDepth: number;
  ancestorLast: boolean[];
};

/**
 * Flatten the reaction tree for one direction from a root element.
 * Emits alternating step nodes and element children so the UI can draw an outline tree.
 * Duplicates are intentional: each path holds its own copy.
 */
export function buildTree(opts: BuildTreeOptions): TreeRow[] {
  const {
    index,
    rootType,
    dir,
    maxDepth,
    enabledKinds,
    expanded,
    autoExpandDepth = 2,
  } = opts;

  const rows: TreeRow[] = [];
  const rootPath = `el:${rootType}`;
  const visit: Frame[] = [
    { elementType: rootType, path: rootPath, elementDepth: 0, ancestorLast: [] },
  ];

  while (visit.length) {
    const frame = visit.shift()!;
    if (frame.elementDepth >= maxDepth) continue;

    const shouldExpand =
      frame.elementDepth === 0 ||
      isExpanded(frame.path, frame.elementDepth, expanded, autoExpandDepth);
    if (!shouldExpand) continue;

    const stepIds = stepIdsFor(index, frame.elementType, dir, enabledKinds);
    stepIds.forEach((stepId, stepIndex) => {
      const step = index.steps.get(stepId);
      if (!step) return;

      const stepPath = `${frame.path}>${stepId}`;
      const stepIsLast = stepIndex === stepIds.length - 1;
      const stepAncestorLast = frame.ancestorLast;
      const stepDepth = frame.elementDepth * 2 + 1;
      const parentChance =
        dir === "up" ? chanceForOutput(step, frame.elementType) : undefined;

      // Structure sinks: step only, no element children.
      if (dir === "down" && step.outputs.length === 0) {
        rows.push({
          path: `${stepPath}>sink`,
          depth: stepDepth,
          expandDepth: frame.elementDepth,
          kind: "step",
          step,
          elementType: frame.elementType,
          chance: undefined,
          loop: false,
          sink: true,
          hasChildren: false,
          isLast: stepIsLast,
          ancestorLast: stepAncestorLast,
        });
        return;
      }

      const neighbors = neighborElements(step, dir).filter(
        (neighbor) => !(dir === "down" && neighbor.elementType === frame.elementType),
      );
      const stepOpen = isExpanded(stepPath, frame.elementDepth, expanded, autoExpandDepth);
      const hasElementChildren = neighbors.length > 0;

      rows.push({
        path: stepPath,
        depth: stepDepth,
        expandDepth: frame.elementDepth,
        kind: "step",
        step,
        elementType: frame.elementType,
        chance: parentChance,
        loop: false,
        sink: false,
        hasChildren: hasElementChildren,
        isLast: stepIsLast,
        ancestorLast: stepAncestorLast,
      });

      if (!hasElementChildren || !stepOpen) return;

      const childAncestorLast = [...stepAncestorLast, stepIsLast];
      neighbors.forEach((neighbor, neighborIndex) => {
        const elPath = `${stepPath}>el:${neighbor.elementType}`;
        const elIsLast = neighborIndex === neighbors.length - 1;
        const loop = pathHasElement(frame.path, neighbor.elementType);
        const nextElementDepth = frame.elementDepth + 1;
        const childStepIds = loop
          ? []
          : stepIdsFor(index, neighbor.elementType, dir, enabledKinds);
        const hasChildren =
          !loop && nextElementDepth < maxDepth && childStepIds.length > 0;

        rows.push({
          path: elPath,
          depth: stepDepth + 1,
          expandDepth: nextElementDepth,
          kind: "element",
          step,
          elementType: neighbor.elementType,
          chance: dir === "up" ? parentChance : neighbor.chance,
          loop,
          sink: false,
          hasChildren,
          isLast: elIsLast,
          ancestorLast: childAncestorLast,
        });

        if (hasChildren && isExpanded(elPath, nextElementDepth, expanded, autoExpandDepth)) {
          visit.push({
            elementType: neighbor.elementType,
            path: elPath,
            elementDepth: nextElementDepth,
            ancestorLast: [...childAncestorLast, elIsLast],
          });
        }
      });
    });
  }

  return rows;
}

/** Toggle expand state: explicit collapse uses `!path`, expand uses `path`. */
export function toggleExpanded(
  expanded: Set<string>,
  path: string,
  currentlyOpen: boolean,
): Set<string> {
  const next = new Set(expanded);
  if (currentlyOpen) {
    next.delete(path);
    next.add(`!${path}`);
  } else {
    next.delete(`!${path}`);
    next.add(path);
  }
  return next;
}

export function rowIsOpen(
  path: string,
  depth: number,
  expanded: ReadonlySet<string>,
  autoExpandDepth = 2,
): boolean {
  return isExpanded(path, depth, expanded, autoExpandDepth);
}
