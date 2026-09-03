import assert from "node:assert/strict";
import test from "node:test";
import { envFlag, parseEnvText, resolveDevCleanup, resolveDevModsSetting } from "./env.js";

test("parseEnvText skips blank and comment lines", () => {
  assert.deepEqual(parseEnvText("\n# hi\n\nFOO=bar\n"), { FOO: "bar" });
});

test("envFlag accepts common truthy forms", () => {
  const prev = process.env.DEV_CLEANUP;
  try {
    process.env.DEV_CLEANUP = "yes";
    assert.equal(envFlag("DEV_CLEANUP", false), true);
    process.env.DEV_CLEANUP = "off";
    assert.equal(envFlag("DEV_CLEANUP", true), false);
  } finally {
    if (prev === undefined) delete process.env.DEV_CLEANUP;
    else process.env.DEV_CLEANUP = prev;
  }
});

test("resolveDevCleanup defaults off", () => {
  const prev = process.env.DEV_CLEANUP;
  try {
    delete process.env.DEV_CLEANUP;
    assert.equal(resolveDevCleanup(), false);
  } finally {
    if (prev === undefined) delete process.env.DEV_CLEANUP;
    else process.env.DEV_CLEANUP = prev;
  }
});

test("resolveDevModsSetting empty is selection", () => {
  assert.deepEqual(resolveDevModsSetting("", ""), { mode: "selection", alwaysFolders: [] });
});

test("watchModFolders all mode returns empty filter", async () => {
  const { watchModFolders } = await import("./env.js");
  assert.deepEqual(
    watchModFolders({ all: false, folders: ["template"] }, { mode: "all", alwaysFolders: [] }),
    [],
  );
});
