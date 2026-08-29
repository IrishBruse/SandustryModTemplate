import assert from "node:assert/strict";
import { test } from "node:test";
import {
  cssContentToText,
  cssValueHasUnsafeUrl,
  escapeXmlText,
  isGenericFontFamily,
  parseFontFamilyList,
  resolveCssContentText,
} from "./overlayDomSnapshot.ts";

test("cssContentToText unwraps quoted CSS content", () => {
  assert.equal(cssContentToText("none"), null);
  assert.equal(cssContentToText('""'), "");
  assert.equal(cssContentToText('"REC"'), "REC");
  assert.equal(cssContentToText("'x'"), "x");
});

test("resolveCssContentText resolves counter() from reset/set/--var", () => {
  assert.equal(resolveCssContentText('"REC"', {}), "REC");
  assert.equal(resolveCssContentText("counter(sand)", { reset: "sand 1364", set: "none" }), "1364");
  assert.equal(resolveCssContentText("counter(sand)", { set: "sand 980", reset: "sand 0" }), "980");
  assert.equal(
    resolveCssContentText("counter(sand)", {
      reset: "none",
      varForName: (name) => (name === "sand" ? "1420" : ""),
    }),
    "1420",
  );
  assert.equal(resolveCssContentText("counter(sand)", { reset: "none" }), null);
});

test("cssValueHasUnsafeUrl rejects non-data URLs", () => {
  assert.equal(cssValueHasUnsafeUrl("none"), false);
  assert.equal(cssValueHasUnsafeUrl("linear-gradient(red, blue)"), false);
  assert.equal(cssValueHasUnsafeUrl('url("data:image/png;base64,xx")'), false);
  assert.equal(cssValueHasUnsafeUrl('url("file:///tmp/cursor.png")'), true);
  assert.equal(cssValueHasUnsafeUrl("url(https://example.com/a.png)"), true);
});

test("escapeXmlText escapes @property syntax angle brackets", () => {
  assert.equal(escapeXmlText('syntax: "<integer>";'), 'syntax: "&lt;integer&gt;";');
  assert.equal(escapeXmlText("a & b"), "a &amp; b");
});

test("parseFontFamilyList splits quoted and unquoted families", () => {
  assert.deepEqual(parseFontFamilyList("Play, sans-serif"), ["Play", "sans-serif"]);
  assert.deepEqual(parseFontFamilyList('"Segoe UI", system-ui, sans-serif'), [
    "Segoe UI",
    "system-ui",
    "sans-serif",
  ]);
  assert.deepEqual(parseFontFamilyList("monospace"), ["monospace"]);
});

test("isGenericFontFamily detects CSS generics", () => {
  assert.equal(isGenericFontFamily("monospace"), true);
  assert.equal(isGenericFontFamily("Play"), false);
  assert.equal(isGenericFontFamily("system-ui"), true);
});
