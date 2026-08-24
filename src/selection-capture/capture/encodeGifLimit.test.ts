import assert from "node:assert/strict";
import { test } from "node:test";
import type { UnencodedFrame } from "modern-gif";
import {
  GIF_1MB,
  GIF_MIN_FRAMES,
  encodePreparedGifWithLimit,
  encodeRgbaFrames,
  isAbortError,
  throwIfAborted,
} from "./encodeGifLimit.ts";

const WIDTH = 16;
const HEIGHT = 16;

function solidFrame(red: number, green: number, blue: number): UnencodedFrame {
  const data = new Uint8ClampedArray(WIDTH * HEIGHT * 4);
  for (let i = 0; i < WIDTH * HEIGHT; i++) {
    const o = i * 4;
    data[o] = red;
    data[o + 1] = green;
    data[o + 2] = blue;
    data[o + 3] = 255;
  }
  return { data, delay: 40, disposal: 1 };
}

function frames(count: number): UnencodedFrame[] {
  const list: UnencodedFrame[] = [];
  for (let i = 0; i < count; i++) {
    list.push(solidFrame((i * 37) % 256, (i * 91) % 256, (i * 13) % 256));
  }
  return list;
}

test("GIF_1MB is 1 MiB", () => {
  assert.equal(GIF_1MB, 1024 * 1024);
});

test("encode without a cap writes a GIF89a file", async () => {
  const prepared = frames(8);
  const result = await encodePreparedGifWithLimit(
    prepared,
    WIDTH,
    HEIGHT,
    undefined,
    undefined,
    undefined,
  );
  assert.ok(result && result !== "too-large");
  assert.equal(result.frameCount, 8);
  assert.equal(result.hitLimit, false);
  assert.equal(String.fromCharCode(...result.bytes.subarray(0, 6)), "GIF89a");
});

test("encode with a cap keeps the longest prefix that fits", async () => {
  const prepared = frames(10);
  const five = await encodeRgbaFrames(prepared.slice(0, 5), WIDTH, HEIGHT, undefined, undefined);
  const six = await encodeRgbaFrames(prepared.slice(0, 6), WIDTH, HEIGHT, undefined, undefined);
  assert.ok(five && six);
  assert.ok(six.byteLength > five.byteLength);

  const result = await encodePreparedGifWithLimit(
    prepared,
    WIDTH,
    HEIGHT,
    five.byteLength,
    undefined,
    undefined,
  );
  assert.ok(result && result !== "too-large");
  assert.equal(result.frameCount, 5);
  assert.equal(result.hitLimit, true);
  assert.ok(result.bytes.byteLength <= five.byteLength);
});

test("encode returns too-large when two frames still exceed the cap", async () => {
  const prepared = frames(GIF_MIN_FRAMES);
  const result = await encodePreparedGifWithLimit(prepared, WIDTH, HEIGHT, 1, undefined, undefined);
  assert.equal(result, "too-large");
});

test("throwIfAborted throws AbortError after abort", () => {
  const abort = new AbortController();
  abort.abort();
  assert.throws(
    () => throwIfAborted(abort.signal),
    (error: unknown) => isAbortError(error),
  );
});

test("encode stops when the signal is aborted", async () => {
  const abort = new AbortController();
  abort.abort();
  await assert.rejects(
    encodePreparedGifWithLimit(frames(4), WIDTH, HEIGHT, undefined, abort.signal, undefined),
    (error: unknown) => isAbortError(error),
  );
});

test("encode of no frames returns null", async () => {
  assert.equal(await encodeRgbaFrames([], WIDTH, HEIGHT, undefined, undefined), null);
  assert.equal(
    await encodePreparedGifWithLimit([], WIDTH, HEIGHT, undefined, undefined, undefined),
    null,
  );
});

test("a cap larger than the full GIF does not trim", async () => {
  const prepared = frames(3);
  const result = await encodePreparedGifWithLimit(
    prepared,
    WIDTH,
    HEIGHT,
    GIF_1MB,
    undefined,
    undefined,
  );
  assert.ok(result && result !== "too-large");
  assert.equal(result.frameCount, 3);
  assert.equal(result.hitLimit, false);
});
