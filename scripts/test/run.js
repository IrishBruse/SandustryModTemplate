/**
 * Run TypeScript tests with the Node test runner (Node 24 strips types).
 * `--import` maps `@modkit/*` because Node does not use tsconfig paths.
 *
 * `npm test` — unit files only (no Chromium).
 * `npm run test:integration` — boot extracted dist in Chrome, then `*.live.test.ts`.
 */
import { globSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { startSandustryTestHost, stopSandustryTestHost } from "../../modkit/test/host.ts";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const REGISTER = join(ROOT, "scripts/test/register-modkit.js");

function collectUnitFiles() {
  return [
    ...globSync("src/**/*.test.ts", { cwd: ROOT }),
    ...globSync("modkit/**/*.test.ts", { cwd: ROOT }),
    ...globSync("scripts/**/*.test.js", { cwd: ROOT }),
  ]
    .filter(
      (file) =>
        !file.endsWith(".live.test.ts") &&
        !file.endsWith("/live.test.ts") &&
        file !== "live.test.ts",
    )
    .sort();
}

function collectLiveFiles() {
  const files = [
    ...globSync("src/**/*.live.test.ts", { cwd: ROOT }),
    ...globSync("src/**/live.test.ts", { cwd: ROOT }),
    ...globSync("modkit/**/*.live.test.ts", { cwd: ROOT }),
    ...globSync("modkit/**/live.test.ts", { cwd: ROOT }),
    ...globSync("examples/**/*.live.test.ts", { cwd: ROOT }),
    ...globSync("examples/**/live.test.ts", { cwd: ROOT }),
  ];
  return [...new Set(files)].sort();
}

function run(args, extraEnv) {
  return spawnSync(process.execPath, ["--import", REGISTER, ...args], {
    cwd: ROOT,
    stdio: "inherit",
    env: extraEnv ? { ...process.env, ...extraEnv } : process.env,
  });
}

function waitForSignal() {
  return new Promise((resolve) => {
    const onStop = () => resolve();
    process.once("SIGINT", onStop);
    process.once("SIGTERM", onStop);
  });
}

/**
 * @param {{ integration?: boolean }} [options]
 * @returns {Promise<number>}
 */
export async function runNodeTests(options) {
  const integration = options?.integration === true;
  const files = integration ? collectLiveFiles() : collectUnitFiles();
  if (files.length === 0) {
    console.error(
      integration
        ? "No live tests found (*.live.test.ts)."
        : "No tests found (src/**/*.test.ts, modkit/**/*.test.ts).",
    );
    return 1;
  }

  if (!integration) {
    const result = run(["--test", ...files.map((file) => join(ROOT, file))]);
    return result.status ?? 1;
  }

  const host = await startSandustryTestHost({ persist: true, visible: true });
  if (!host.ok) {
    console.error(`Integration host failed: ${host.reason}`);
    return 1;
  }
  console.log("Integration host ready (extracted dist, Chromium CDP :9224)");

  let status = 1;
  try {
    const result = run(
      ["--test", "--test-concurrency=1", ...files.map((file) => join(ROOT, file))],
      {
        SANDUSTRY_TEST_HOST: "1",
      },
    );
    status = result.status ?? 1;
    if (status !== 0) {
      console.log(
        "Tests failed. Integration host is still running on CDP :9224. Press Ctrl+C to stop.",
      );
      await waitForSignal();
    }
  } finally {
    await stopSandustryTestHost();
  }

  return status;
}
