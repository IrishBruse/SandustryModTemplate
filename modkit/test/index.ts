/**
 * Node helpers for live Sandustry tests (CDP `:9222`).
 * Import from `*.test.ts` only. Do not import from mod `main.ts`.
 */
if (typeof globalThis.document !== "undefined") {
  throw new Error("@modkit/test runs under Node. Import it from *.test.ts only.");
}

export { SANDUSTRY_CDP_PORT, isSandustryAvailable } from "./cdp.ts";
export {
  installedModMain,
  sandustryModsDir,
  sandustryUserDataDir,
  tryReadInstalledModMain,
} from "./paths.ts";
export { sandustryTest } from "./sandustry-test.ts";
export { SandustrySession } from "./session.ts";
export { toPageExpression } from "./serialize.ts";
export { waitFor } from "./wait.ts";
export type { SandustryTestFn } from "./sandustry-test.ts";
export type { ModMainFile, SessionWaitForOptions } from "./session.ts";
export type { WaitForOptions } from "./wait.ts";
