/**
 * Node helpers for live Sandustry tests (extracted dist in Chromium, CDP `:9224`).
 * Import from `*.integration.test.ts` only. Do not import from mod `main.ts`.
 */
if (typeof globalThis.document !== "undefined") {
  throw new Error("@modkit/test runs under Node. Import it from *.integration.test.ts only.");
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
  SANDUSTRY_TEST_HTTP_PORT,
} from "./paths.ts";
export { setupGame } from "./setup-game.ts";
export { SandustrySession } from "./session.ts";
export {
  buildLayout,
  buildStructures,
  pauseSimulation,
  resumeSimulation,
  runSimulation,
  setSimulationPaused,
} from "./helpers/world.ts";
export { expect } from "./helpers/expect.ts";
export { toPageExpression } from "./serialize.ts";
export { waitFor } from "./helpers/wait.ts";
export type {
  ModMainFile,
  ScreenshotClip,
  ScreenshotOptions,
  SessionWaitForOptions,
  StructureLayout,
  ElementSeed,
  StructureLayoutPhase,
  StructureLayoutSymbol,
  StructurePlacement,
} from "./session.ts";
export type { BufferExpect, SessionExpect, ToHaveScreenshotOptions } from "./helpers/expect.ts";
export type { ImageMatchOptions } from "./helpers/screenshot.ts";
export type { WaitForOptions } from "./helpers/wait.ts";
