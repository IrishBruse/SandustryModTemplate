import assert from "node:assert/strict";
import test from "node:test";
import { disposeLists, pushDispose, runDisposers } from "./dispose.ts";

test("runDisposers runs in order then clears the list", () => {
  const order: number[] = [];
  pushDispose("m", () => order.push(1));
  pushDispose("m", () => order.push(2));
  runDisposers("m");
  assert.deepEqual(order, [1, 2]);
  assert.deepEqual(disposeLists().m, []);
});

test("runDisposers continues after a throw", () => {
  const order: number[] = [];
  const warn = console.warn;
  console.warn = () => {};
  try {
    pushDispose("m2", () => {
      throw new Error("boom");
    });
    pushDispose("m2", () => order.push(1));
    runDisposers("m2");
  } finally {
    console.warn = warn;
  }
  assert.deepEqual(order, [1]);
});
