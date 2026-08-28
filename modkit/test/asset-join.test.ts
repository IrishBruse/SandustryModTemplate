import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { rewriteAssetJoinForHttp } from "./asset-join.ts";
import { extractedDistDir } from "./paths.ts";

const SNIPPET =
  'const o=new URL(e),a=new URL(n,o);if("file:"!==o.protocol||"file:"!==a.protocol||!a.href.startsWith(o.href)||a.href===o.href)throw new Error("Asset path resolves outside the mod folder.");return a.href';

test("rewriteAssetJoinForHttp allows http rootUrl in the join guard", () => {
  const next = rewriteAssetJoinForHttp(SNIPPET);
  assert.ok(next.includes('"http:"===o.protocol'));
  assert.ok(next.includes("o.protocol!==a.protocol"));
  assert.throws(() => rewriteAssetJoinForHttp("no join here"));
});

test("rewriteAssetJoinForHttp patches extracted dist/js/bundle.js", () => {
  const dist = extractedDistDir();
  assert.ok(dist, "run npm run setup");
  const raw = readFileSync(join(dist, "js", "bundle.js"), "utf8");
  const next = rewriteAssetJoinForHttp(raw);
  assert.equal(next.includes('"file:"!==o.protocol||"file:"!==a.protocol'), false);
});
