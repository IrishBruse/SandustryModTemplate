import assert from "node:assert/strict";
import test from "node:test";
import { applyDebugModPickInput } from "./sync-debug-mod-picker.js";

test("applyDebugModPickInput writes pickString options and default", () => {
  const launch = { version: "0.2.0", configurations: [], inputs: [] };
  applyDebugModPickInput(launch, ["template", "trees"], "trees");
  assert.deepEqual(launch.inputs, [
    {
      id: "debugMod",
      type: "pickString",
      description: "Debug which mod?",
      options: ["template", "trees"],
      default: "trees",
    },
  ]);
});

test("applyDebugModPickInput falls back when default is unknown", () => {
  const launch = {};
  applyDebugModPickInput(launch, ["template"], "missing");
  assert.equal(launch.inputs[0].default, "template");
});
