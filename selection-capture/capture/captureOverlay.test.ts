import assert from "node:assert/strict";
import { test } from "node:test";

/** Node has no DOM ImageData; captureOverlay uses the constructor at runtime. */
if (typeof globalThis.ImageData === "undefined") {
  globalThis.ImageData = class ImageData {
    data: Uint8ClampedArray;
    width: number;
    height: number;
    constructor(sw: number | Uint8ClampedArray, sh?: number, h?: number) {
      if (typeof sw === "number") {
        this.width = sw;
        this.height = sh!;
        this.data = new Uint8ClampedArray(this.width * this.height * 4);
      } else {
        this.data = sw;
        this.width = sh!;
        this.height = h!;
      }
    }
  } as typeof ImageData;
}

import {
  blendSourceOverImageData,
  buildSimpleOverlayHtml,
  escapeOverlayText,
  overlayRasterCacheKey,
  resolveOverlayInnerHtml,
} from "./captureOverlay.ts";

test("escapeOverlayText escapes HTML special characters", () => {
  assert.equal(
    escapeOverlayText(`Tom & Jerry <3 "quotes"`),
    "Tom &amp; Jerry &lt;3 &quot;quotes&quot;",
  );
});

test("buildSimpleOverlayHtml includes escaped text and vertical position", () => {
  const html = buildSimpleOverlayHtml(`Line <one>`, 42, 0, 32);
  assert.match(html, /top:42%/);
  assert.match(html, /left:0%/);
  assert.match(html, /32px/);
  assert.match(html, /Line &lt;one&gt;/);
});

test("resolveOverlayInnerHtml returns null when disabled or empty", () => {
  assert.equal(
    resolveOverlayInnerHtml({
      enabled: false,
      advanced: false,
      text: "hello",
      verticalAlign: 50,
      horizontalAlign: 0,
      fontSize: 32,
      html: "",
    }),
    null,
  );
  assert.equal(
    resolveOverlayInnerHtml({
      enabled: true,
      advanced: false,
      text: "   ",
      verticalAlign: 50,
      horizontalAlign: 0,
      fontSize: 32,
      html: "",
    }),
    null,
  );
  assert.equal(
    resolveOverlayInnerHtml({
      enabled: true,
      advanced: true,
      text: "",
      verticalAlign: 50,
      horizontalAlign: 0,
      fontSize: 32,
      html: "  ",
    }),
    null,
  );
});

test("resolveOverlayInnerHtml uses simple or advanced markup", () => {
  const simple = resolveOverlayInnerHtml({
    enabled: true,
    advanced: false,
    text: "Caption",
    verticalAlign: 10,
    horizontalAlign: 0,
    fontSize: 32,
    html: "",
  });
  assert.match(simple ?? "", /Caption/);

  const advanced = resolveOverlayInnerHtml({
    enabled: true,
    advanced: true,
    text: "",
    verticalAlign: 10,
    horizontalAlign: 0,
    fontSize: 32,
    html: "<div class='x'>Custom</div>",
  });
  assert.equal(advanced, "<div class='x'>Custom</div>");
});

test("overlayRasterCacheKey includes size and mode", () => {
  assert.equal(
    overlayRasterCacheKey(
      {
        enabled: true,
        advanced: true,
        text: "",
        verticalAlign: 50,
        horizontalAlign: 0,
        fontSize: 32,
        html: "<div>x</div>",
      },
      320,
      180,
    ),
    "320x180:advanced:<div>x</div>",
  );
  assert.equal(
    overlayRasterCacheKey(
      {
        enabled: true,
        advanced: false,
        text: "Caption",
        verticalAlign: 75,
        horizontalAlign: 0,
        fontSize: 32,
        html: "",
      },
      320,
      180,
    ),
    "320x180:simple:Caption:75:0:32",
  );
});

test("blendSourceOverImageData composites semi-transparent overlay pixels", () => {
  const base = new ImageData(1, 1);
  base.data.set([100, 120, 140, 255], 0);
  const overlay = new ImageData(1, 1);
  overlay.data.set([200, 0, 0, 128], 0);
  const blended = blendSourceOverImageData(base, overlay);
  assert.equal(blended.data[0], 150);
  assert.equal(blended.data[3], 255);
});
