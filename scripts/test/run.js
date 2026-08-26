/**
 * Run TypeScript tests with the Node test runner (Node 24 strips types).
 * `--import` maps `@modkit/*` because Node does not use tsconfig paths.
 * Live cases use an isolated Sandustry host on CDP :9223, not the Steam window.
 */
import { globSync } from "node:fs";
import { spawn, spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as sleep } from "node:timers/promises";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const REGISTER = join(ROOT, "scripts/test/register-modkit.js");

function collectTestFiles() {
  return [
    ...globSync("src/**/*.test.ts", { cwd: ROOT }),
    ...globSync("modkit/**/*.test.ts", { cwd: ROOT }),
    ...globSync("scripts/**/*.test.js", { cwd: ROOT }),
  ].sort();
}

function run(args, extraEnv) {
  return spawnSync(process.execPath, ["--import", REGISTER, ...args], {
    cwd: ROOT,
    stdio: "inherit",
    env: extraEnv ? { ...process.env, ...extraEnv } : process.env,
  });
}

async function testCdpUp() {
  try {
    const response = await fetch("http://127.0.0.1:9223/json/version", {
      signal: AbortSignal.timeout(500),
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function waitForTestCdp(timeoutMs = 60000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await testCdpUp()) return true;
    await sleep(200);
  }
  return false;
}

function waitForSignal() {
  return new Promise((resolve) => {
    const onStop = () => resolve();
    process.once("SIGINT", onStop);
    process.once("SIGTERM", onStop);
  });
}

/**
 * @param {{ visible?: boolean }} [options]
 * @returns {Promise<number>}
 */
export async function runNodeTests(options) {
  const visible = options?.visible === true;
  const files = collectTestFiles();
  if (files.length === 0) {
    console.error("No tests found (src/**/*.test.ts, modkit/**/*.test.ts).");
    return 1;
  }

  const hostArgs = ["--import", REGISTER, join(ROOT, "scripts/test/start-host.js")];
  if (visible) hostArgs.push("visible");

  const host = spawn(process.execPath, hostArgs, {
    cwd: ROOT,
    stdio: "inherit",
  });

  const hostExit = new Promise((resolve) => {
    host.once("exit", () => resolve("exit"));
  });

  let status = 1;
  try {
    const outcome = await Promise.race([waitForTestCdp().then(() => "cdp"), hostExit]);
    const cdpUp = outcome === "cdp" || (await testCdpUp());
    const result = run(["--test", ...files.map((file) => join(ROOT, file))], {
      SANDUSTRY_TEST_HOST: "1",
    });
    status = result.status ?? 1;
    if (visible && !cdpUp) {
      if (status === 0) status = 1;
      console.error("Visible Sandustry test host did not start.");
    }
    if (visible && status !== 0) {
      console.log("Tests failed. Test host is still running on CDP :9223. Press Ctrl+C to stop.");
      await waitForSignal();
    }
  } finally {
    if (host.exitCode == null && host.pid) host.kill("SIGTERM");
    run([join(ROOT, "scripts/test/stop-host.js")]);
  }

  return status;
}
