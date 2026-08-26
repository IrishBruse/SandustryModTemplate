/**
 * Build a page expression from a function and JSON arguments.
 * Closures do not capture Node locals. Pass values as `args`.
 */
export function toPageExpression(
  fn: { toString(): string },
  args: readonly unknown[] = [],
): string {
  const serialized = args.map(serializeArg).join(", ");
  return `(${fn.toString()})(${serialized})`;
}

function serializeArg(value: unknown): string {
  const json = JSON.stringify(value);
  if (json === undefined) {
    throw new Error("@modkit/test evaluate args must be JSON-serializable");
  }
  return json;
}
