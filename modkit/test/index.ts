/**
 * Node helpers for live Sandustry tests (isolated host, CDP `:9223`).
 * Import from `*.test.ts` only. Do not import from mod `main.ts`.
 */
if (typeof globalThis.document !== "undefined") {
  throw new Error("@modkit/test runs under Node. Import it from *.test.ts only.");
}

export { SANDUSTRY_CDP_PORT, isSandustryAvailable } from "./cdp.ts";
export {
  startSandustryTestHost,
  stopSandustryTestHost,
  prepareSandustryTestUserData,
  testCompanionSettings,
  hostWindowMode,
} from "./host.ts";
export type { HostStartResult, HostWindowMode } from "./host.ts";
export {
  installedModMain,
  sandustryModsDir,
  sandustryTestUserDataDir,
  sandustryUserDataDir,
  tryReadInstalledModMain,
  SANDUSTRY_TEST_CDP_PORT,
} from "./paths.ts";
export { sandustryTest } from "./sandustry-test.ts";
export { SandustrySession } from "./session.ts";
export { toPageExpression } from "./serialize.ts";
export { waitFor } from "./wait.ts";
export type { SandustryTestFn } from "./sandustry-test.ts";
export type { ModMainFile, SessionWaitForOptions } from "./session.ts";
export type { WaitForOptions } from "./wait.ts";
