import assert from "node:assert/strict";
import test from "node:test";
import { asarExtractPath, asarRelPath } from "./asar-path.js";

test("asarRelPath strips leading slash and normalizes to forward slashes", () => {
  assert.equal(asarRelPath("/dist/js/bundle.js"), "dist/js/bundle.js");
  assert.equal(asarRelPath("\\dist\\js\\bundle.js"), "dist/js/bundle.js");
  assert.equal(asarRelPath("dist\\js\\bundle.js"), "dist/js/bundle.js");
  assert.equal(asarRelPath("dist/js/bundle.js"), "dist/js/bundle.js");
});

test("asarExtractPath strips one leading separator and keeps platform seps", () => {
  assert.equal(asarExtractPath("/dist/js/bundle.js"), "dist/js/bundle.js");
  assert.equal(asarExtractPath("\\dist\\js\\bundle.js"), "dist\\js\\bundle.js");
  assert.equal(asarExtractPath("dist\\js\\bundle.js"), "dist\\js\\bundle.js");
  assert.equal(asarExtractPath("dist/js/bundle.js"), "dist/js/bundle.js");
});
