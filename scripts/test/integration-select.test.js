import assert from "node:assert/strict";
import test from "node:test";
import {
  filterIntegrationFiles,
  integrationTestRepoPaths,
  normalizeIntegrationArgv,
} from "./integration-select.js";

const discovered = [
  { folder: "overlay-hotkey", root: "examples", repoPath: "examples/ui/overlay-hotkey" },
  { folder: "i18n", root: "examples", repoPath: "examples/api/i18n" },
  { folder: "template", root: "src", repoPath: "src/template" },
  { folder: "dev-tools", root: "src", repoPath: "src/dev-tools" },
];

const files = [
  "examples/api/i18n/i18n.integration.test.ts",
  "examples/ui/overlay-hotkey/overlay.integration.test.ts",
  "modkit/test/game.integration.test.ts",
  "src/dev-tools/reload/integration.test.ts",
  "src/template/template.integration.test.ts",
];

test("normalizeIntegrationArgv turns positional folders into --mod", () => {
  assert.deepEqual(normalizeIntegrationArgv(["--view", "collector-element"]), [
    "--view",
    "--mod",
    "collector-element",
  ]);
  assert.deepEqual(normalizeIntegrationArgv(["template", "i18n", "--examples"]), [
    "--mod",
    "template",
    "--mod",
    "i18n",
    "--examples",
  ]);
  assert.deepEqual(normalizeIntegrationArgv(["--mod", "template", "--view"]), [
    "--mod",
    "template",
    "--view",
  ]);
});

test("filterIntegrationFiles keeps the full list when no prefixes are set", () => {
  assert.deepEqual(filterIntegrationFiles(files, null), [...files].sort());
  assert.deepEqual(filterIntegrationFiles(files, []), [...files].sort());
});

test("filterIntegrationFiles keeps files under a selected mod folder", () => {
  assert.deepEqual(filterIntegrationFiles(files, ["examples/ui/overlay-hotkey"]), [
    "examples/ui/overlay-hotkey/overlay.integration.test.ts",
  ]);
  assert.deepEqual(filterIntegrationFiles(files, ["src/dev-tools"]), [
    "src/dev-tools/reload/integration.test.ts",
  ]);
});

test("filterIntegrationFiles does not match a sibling prefix", () => {
  assert.deepEqual(filterIntegrationFiles(files, ["examples/ui/overlay"]), []);
});

test("integrationTestRepoPaths maps --mod folders", () => {
  assert.deepEqual(integrationTestRepoPaths(["--mod", "overlay-hotkey"], discovered), [
    "examples/ui/overlay-hotkey",
  ]);
  assert.deepEqual(
    integrationTestRepoPaths(["--mod", "overlay-hotkey", "--mod", "template"], discovered),
    ["examples/ui/overlay-hotkey", "src/template"],
  );
});

test("integrationTestRepoPaths maps positional mod folders", () => {
  assert.deepEqual(integrationTestRepoPaths(["overlay-hotkey"], discovered), [
    "examples/ui/overlay-hotkey",
  ]);
  assert.deepEqual(integrationTestRepoPaths(["--view", "template"], discovered), [
    "src/template",
  ]);
});

test("integrationTestRepoPaths uses examples/ for --examples", () => {
  assert.deepEqual(integrationTestRepoPaths(["--examples"], discovered), ["examples"]);
  assert.deepEqual(filterIntegrationFiles(files, ["examples"]), [
    "examples/api/i18n/i18n.integration.test.ts",
    "examples/ui/overlay-hotkey/overlay.integration.test.ts",
  ]);
});

test("integrationTestRepoPaths rejects --examples --mod from src/", () => {
  assert.throws(
    () => integrationTestRepoPaths(["--examples", "--mod", "template"], discovered),
    /not under examples/,
  );
});

test("integrationTestRepoPaths rejects unknown --mod", () => {
  assert.throws(
    () => integrationTestRepoPaths(["--mod", "missing"], discovered),
    /Unknown mod "missing"/,
  );
});
