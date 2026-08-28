import { existsSync, readFileSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";
import {
  assertImageSnapshot,
  callerTestFile,
  comparePng,
  resolveSnapshotPath,
  shouldUpdateSnapshots,
  writeScreenshotArtifacts,
  type ImageMatchOptions,
} from "./screenshot.ts";
import { SandustrySession, type ScreenshotOptions } from "./session.ts";
import { WAIT_FOR_INTERVAL_MS, WAIT_FOR_TIMEOUT_MS, type WaitForOptions } from "./wait.ts";

export type ToHaveScreenshotOptions = ScreenshotOptions & ImageMatchOptions & WaitForOptions;

export type SessionExpect = {
  toHaveScreenshot(name: string, options?: ToHaveScreenshotOptions): Promise<void>;
};

export type BufferExpect = {
  toMatchSnapshot(name: string, options?: ImageMatchOptions): Promise<void>;
};

export function expect(actual: SandustrySession): SessionExpect;
export function expect(actual: Buffer): BufferExpect;
export function expect(actual: SandustrySession | Buffer): SessionExpect | BufferExpect {
  if (Buffer.isBuffer(actual)) {
    return {
      toMatchSnapshot(name, options) {
        const snapshotPath = resolveSnapshotPath(name, callerTestFile());
        assertImageSnapshot(actual, snapshotPath, options);
        return Promise.resolve();
      },
    };
  }
  const session = actual;
  return {
    async toHaveScreenshot(name, options) {
      const snapshotPath = resolveSnapshotPath(name, callerTestFile());
      const capture = captureOptions(options);
      const match = matchOptions(options);
      if (!existsSync(snapshotPath) || shouldUpdateSnapshots()) {
        const png = await session.screenshot(capture);
        assertImageSnapshot(png, snapshotPath, match);
        return;
      }
      const expected = readFileSync(snapshotPath);
      const timeoutMs = options?.timeoutMs ?? WAIT_FOR_TIMEOUT_MS;
      const intervalMs = options?.intervalMs ?? WAIT_FOR_INTERVAL_MS;
      const deadline = Date.now() + timeoutMs;
      let last: Buffer | undefined;
      let lastMessage = "Screenshot comparison failed";
      while (Date.now() < deadline) {
        last = await session.screenshot(capture);
        const result = comparePng(last, expected, match);
        if (result.ok) return;
        lastMessage = result.message;
        const remaining = deadline - Date.now();
        if (remaining <= 0) break;
        await sleep(Math.min(intervalMs, remaining));
      }
      if (!last) throw new Error(lastMessage);
      const result = comparePng(last, expected, match);
      const artifacts = writeScreenshotArtifacts({
        snapshotPath,
        actual: last,
        expected,
        diff: result.diffPng,
      });
      throw new Error(
        `${result.message}\n  Expected: ${snapshotPath}\n  Actual: ${artifacts.actualPath}\n  Diff: ${artifacts.diffPath}`,
      );
    },
  };
}

function captureOptions(options?: ToHaveScreenshotOptions): ScreenshotOptions | undefined {
  if (!options) return undefined;
  return {
    clip: options.clip,
    selector: options.selector,
    mask: options.mask,
    path: options.path,
    animations: options.animations,
  };
}

function matchOptions(options?: ToHaveScreenshotOptions): ImageMatchOptions {
  return {
    maxDiffPixels: options?.maxDiffPixels,
    maxDiffPixelRatio: options?.maxDiffPixelRatio,
    threshold: options?.threshold,
  };
}
