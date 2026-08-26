import { runDisposers } from "./dispose.ts";
import { nextHotGeneration } from "./generation.ts";
import { wrapSandkit } from "./wrap-api.ts";

/**
 * Same wrapper as the game loader / `SANDKIT_LOADER_LINE_OFFSET` in
 * `scripts/build/esbuild.config.mjs`.
 */
export const SANDKIT_LOADER_PREFIX =
  '"use strict";\nconst sandkit = __sandkit;\nreturn (async () => {\n';
export const SANDKIT_LOADER_SUFFIX = "\n})();\n";

const SOURCE_URL_LINE = /\n\/\/# sourceURL=[^\n]*/g;

export function wrapSource(source: string): string {
  return `${SANDKIT_LOADER_PREFIX}${source}${SANDKIT_LOADER_SUFFIX}`;
}

export function stripSourceUrl(source: string): string {
  return source.replace(SOURCE_URL_LINE, "");
}

export function hotSourceUrl(modId: string, now = Date.now()): string {
  return `sandkit-workshop://${modId}/main.js?hot=${now}`;
}

/**
 * Loader wrap plus a unique `sourceURL` so DevTools does not merge this eval
 * with the first-load script (`sandkit-workshop://<id>/main.js`).
 */
export function wrapHotSource(source: string, modId: string, now = Date.now()): string {
  return `${wrapSource(stripSourceUrl(source))}//# sourceURL=${hotSourceUrl(modId, now)}\n`;
}

export async function hotEvalMain(
  modId: string,
  source: string,
  host: { api: object },
): Promise<number> {
  runDisposers(modId);
  const generation = nextHotGeneration(modId);
  const wrapped = wrapSandkit(host, modId, generation);
  const fn = new Function("__sandkit", wrapHotSource(source, modId));
  await fn(wrapped);
  return generation;
}
