import assert from "node:assert/strict";
import test from "node:test";
import { toPageExpression } from "./serialize.ts";

test("toPageExpression wraps the function and JSON args", () => {
  function add(n: number) {
    return n + 1;
  }
  const readN = (opts: { n: number }) => opts.n;
  assert.equal(toPageExpression(add, [2]), `(${add.toString()})(2)`);
  assert.equal(
    toPageExpression(() => 1),
    "(() => 1)()",
  );
  assert.equal(toPageExpression(readN, [{ n: 1 }]), `(${readN.toString()})({"n":1})`);
});

test("toPageExpression rejects values that JSON cannot serialize", () => {
  assert.throws(() => toPageExpression(() => 1, [undefined]), /JSON-serializable/);
  assert.throws(() => toPageExpression(() => 1, [() => 0]), /JSON-serializable/);
});
