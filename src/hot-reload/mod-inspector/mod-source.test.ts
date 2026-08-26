import assert from "node:assert/strict";
import test from "node:test";
import { modSourceKind } from "./mod-source.ts";

test("local wins over other tags", () => {
  assert.equal(modSourceKind(["local", "root-scan"], "1"), "local");
});

test("subscribed is workshop", () => {
  assert.equal(modSourceKind(["subscribed"]), "workshop");
});

test("root-scan with a workshop item id is workshop, not core", () => {
  assert.equal(modSourceKind(["root-scan"], "3782896614"), "workshop");
});

test("root-scan without an item id is a core mod", () => {
  assert.equal(modSourceKind(["root-scan"]), "core");
  assert.equal(modSourceKind(["root-scan"], null), "core");
});

test("empty tags are unknown", () => {
  assert.equal(modSourceKind([]), "unknown");
});
