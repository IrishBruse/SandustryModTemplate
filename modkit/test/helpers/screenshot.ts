import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import { sandustryTestScreenshotsDir } from "../paths.ts";

export type ImageMatchOptions = {
  maxDiffPixels?: number;
  maxDiffPixelRatio?: number;
  threshold?: number;
};

export type ComparePngResult = {
  ok: boolean;
  diffPixels: number;
  diffRatio: number;
  width: number;
  height: number;
  diffPng?: Buffer;
  message: string;
};

export type AssertImageSnapshotOptions = ImageMatchOptions & {
  update?: boolean;
  ci?: boolean;
  artifactsDir?: string;
};

const DEFAULT_THRESHOLD = 0.2;

export function shouldUpdateSnapshots(
  argv: readonly string[] = [...process.execArgv, ...process.argv],
): boolean {
  return argv.includes("--test-update-snapshots");
}

export function isCi(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.CI === "true" || env.CI === "1";
}

export function snapshotStem(name: string): string {
  return name.toLowerCase().endsWith(".png") ? name.slice(0, -4) : name;
}

export function snapshotFileName(name: string, platform = process.platform): string {
  return `${snapshotStem(name)}-chromium-${platform}.png`;
}

export function resolveSnapshotPath(name: string, testFile: string): string {
  return join(`${testFile}-snapshots`, snapshotFileName(name));
}

export function callerTestFile(stack = new Error().stack ?? ""): string {
  for (const line of stack.split("\n")) {
    const file = stackLineFile(line);
    if (!file || isHelperFile(file)) continue;
    if (isTestFile(file)) return file;
  }
  throw new Error("expect() could not find the calling test file");
}

export function comparePng(
  actual: Buffer,
  expected: Buffer,
  options?: ImageMatchOptions,
): ComparePngResult {
  const img1 = PNG.sync.read(actual);
  const img2 = PNG.sync.read(expected);
  if (img1.width !== img2.width || img1.height !== img2.height) {
    return {
      ok: false,
      diffPixels: Number.POSITIVE_INFINITY,
      diffRatio: 1,
      width: img1.width,
      height: img1.height,
      message: `Screenshot sizes differ: actual ${img1.width}x${img1.height}, expected ${img2.width}x${img2.height}`,
    };
  }
  const { width, height } = img1;
  const diff = new PNG({ width, height });
  const threshold = options?.threshold ?? DEFAULT_THRESHOLD;
  const diffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold });
  const total = width * height;
  const diffRatio = total === 0 ? 0 : diffPixels / total;
  const maxDiffPixels = options?.maxDiffPixels;
  const maxDiffPixelRatio = options?.maxDiffPixelRatio;
  let ok = diffPixels === 0;
  if (maxDiffPixels != null || maxDiffPixelRatio != null) {
    ok = true;
    if (maxDiffPixels != null && diffPixels > maxDiffPixels) ok = false;
    if (maxDiffPixelRatio != null && diffRatio > maxDiffPixelRatio) ok = false;
  }
  const percent = (diffRatio * 100).toFixed(2);
  return {
    ok,
    diffPixels,
    diffRatio,
    width,
    height,
    diffPng: ok ? undefined : PNG.sync.write(diff),
    message: ok
      ? "matched"
      : `Screenshot comparison failed: ${diffPixels} pixels (${percent}%) differ`,
  };
}

export function writeScreenshotArtifacts(input: {
  snapshotPath: string;
  actual: Buffer;
  expected?: Buffer;
  diff?: Buffer;
  artifactsDir?: string;
}): { actualPath: string; expectedPath: string; diffPath: string } {
  const dir = input.artifactsDir ?? sandustryTestScreenshotsDir();
  mkdirSync(dir, { recursive: true });
  const stem = basename(input.snapshotPath).replace(/\.png$/i, "");
  const actualPath = join(dir, `${stem}-actual.png`);
  const expectedPath = join(dir, `${stem}-expected.png`);
  const diffPath = join(dir, `${stem}-diff.png`);
  writeFileSync(actualPath, input.actual);
  if (input.expected) writeFileSync(expectedPath, input.expected);
  if (input.diff) writeFileSync(diffPath, input.diff);
  return { actualPath, expectedPath, diffPath };
}

export function assertImageSnapshot(
  actual: Buffer,
  snapshotPath: string,
  options?: AssertImageSnapshotOptions,
): void {
  const update = options?.update ?? shouldUpdateSnapshots();
  const ci = options?.ci ?? isCi();
  const exists = existsSync(snapshotPath);
  if (!exists) {
    if (ci && !update) {
      throw new Error(`Screenshot snapshot missing: ${snapshotPath}`);
    }
    mkdirSync(dirname(snapshotPath), { recursive: true });
    writeFileSync(snapshotPath, actual);
    if (update) return;
    throw new Error(
      `Screenshot snapshot not found, wrote ${snapshotPath}. Re-run the test to confirm.`,
    );
  }
  if (update) {
    writeFileSync(snapshotPath, actual);
    return;
  }
  const expected = readFileSync(snapshotPath);
  const result = comparePng(actual, expected, options);
  if (result.ok) return;
  const artifacts = writeScreenshotArtifacts({
    snapshotPath,
    actual,
    expected,
    diff: result.diffPng,
    artifactsDir: options?.artifactsDir,
  });
  throw new Error(
    `${result.message}\n  Expected: ${snapshotPath}\n  Actual: ${artifacts.actualPath}\n  Diff: ${artifacts.diffPath}`,
  );
}

function stackLineFile(line: string): string | null {
  const match = line.match(/\((.*):(\d+):(\d+)\)\s*$/) ?? line.match(/^\s*at (.*):(\d+):(\d+)\s*$/);
  if (!match) return null;
  let file = match[1];
  if (!file || file.startsWith("node:")) return null;
  if (file.startsWith("file://")) {
    try {
      file = fileURLToPath(file);
    } catch {
      return null;
    }
  }
  return file;
}

function isHelperFile(file: string): boolean {
  const normalized = file.replaceAll("\\", "/");
  return (
    normalized.includes("/modkit/test/helpers/") ||
    normalized.endsWith("/modkit/test/session.ts") ||
    normalized.endsWith("/modkit/test/index.ts")
  );
}

function isTestFile(file: string): boolean {
  return /\.(?:integration\.)?test\.[cm]?[jt]s$/.test(file);
}
