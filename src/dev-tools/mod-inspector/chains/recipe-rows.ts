/** Normalize live recipe-bag rows into `{ input, outputs }`. */

export type RecipeOutput = { elementType: number; chance?: number };

export type RecipeRow = {
  input?: number;
  output?: number;
  chance?: number;
  outputs?: RecipeOutput[];
  outputsAbove?: RecipeOutput[];
  outputsBelow?: RecipeOutput[];
};

function isOutput(value: RecipeOutput | undefined): value is RecipeOutput {
  return typeof value?.elementType === "number";
}

/** Grower `{ output }`, shaker `{ outputsAbove, outputsBelow }`, or weighted `{ outputs }`. */
export function machineOutputsFromRow(row: RecipeRow): RecipeOutput[] {
  if (typeof row.output === "number") {
    return [{ elementType: row.output, chance: row.chance }];
  }
  return [...(row.outputs ?? []), ...(row.outputsAbove ?? []), ...(row.outputsBelow ?? [])].filter(
    isOutput,
  );
}

/** Canonical contact id so A+B and B+A collapse. */
export function contactStepId(a: number, b: number): string {
  return `mix:contact:${Math.min(a, b)}+${Math.max(a, b)}`;
}
