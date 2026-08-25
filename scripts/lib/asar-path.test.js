import assert from "node:assert/strict";
import test from "node:test";
import { asarRelPath } from "./asar-path.js";

test("asarRelPath strips leading slash and normalizes Windows separators", () => {
  assert.equal(asarRelPath("/dist/js/bundle.js"), "dist/js/bundle.js");
  assert.equal(asarRelPath("\\dist\\js\\bundle.js"), "dist/js/bundle.js");
  assert.equal(asarRelPath("dist\\js\\bundle.js"), "dist/js/bundle.js");
  assert.equal(asarRelPath("dist/js/bundle.js"), "dist/js/bundle.js");
});
