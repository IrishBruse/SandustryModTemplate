import { runDisposers } from "./dispose.ts";
import { wrapSandkit } from "./wrap-api.ts";

/**
 * Same wrapper as the game loader / `SANDKIT_LOADER_LINE_OFFSET` in
 * `scripts/build/esbuild.config.mjs`.
 */
export const SANDKIT_LOADER_PREFIX =
  '"use strict";\nconst sandkit = __sandkit;\nreturn (async () => {\n';
export const SANDKIT_LOADER_SUFFIX = "\n})();\n";

export function wrapSource(source: string): string {
  return `${SANDKIT_LOADER_PREFIX}${source}${SANDKIT_LOADER_SUFFIX}`;
}

export async function hotEvalMain(
  modId: string,
  source: string,
  host: { api: object },
): Promise<void> {
  runDisposers(modId);
  const wrapped = wrapSandkit(host, modId);
  const fn = new Function("__sandkit", wrapSource(source));
  await fn(wrapped);
}
