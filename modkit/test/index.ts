/**
 * Node helpers for live Sandustry tests (extracted dist in Chromium, CDP `:9224`).
 * Import from `*.live.test.ts` only. Do not import from mod `main.ts`.
 */
if (typeof globalThis.document !== "undefined") {
  throw new Error("@modkit/test runs under Node. Import it from *.live.test.ts only.");
}

export { SANDUSTRY_CDP_PORT, isSandustryAvailable } from "./cdp.ts";
export { startSandustryTestHost, stopSandustryTestHost } from "./host.ts";
export type { HostStartResult, HostWindowMode } from "./host.ts";
export {
  installedModMain,
  sandustryModsDir,
  sandustryTestUserDataDir,
  sandustryUserDataDir,
  tryReadInstalledModMain,
  SANDUSTRY_TEST_CDP_PORT,
} from "./paths.ts";
export { setupGame } from "./setup-game.ts";
export { SandustrySession } from "./session.ts";
export { toPageExpression } from "./serialize.ts";
export { waitFor } from "./wait.ts";
export type { ModMainFile, SessionWaitForOptions } from "./session.ts";
export type { WaitForOptions } from "./wait.ts";
