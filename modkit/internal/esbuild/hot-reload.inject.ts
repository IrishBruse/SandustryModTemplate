/**
 * esbuild `inject` target (debug main bundle only). Boots hot reload and
 * exposes a free `reloaded` binding so mods do not call `installHotReload` /
 * `isHotReloadEval` themselves.
 *
 * Release builds omit this file and define `reloaded` as `false`.
 */
import { installHotReload, isHotReloadEval } from "@modkit/debug";

declare const __MOD_ID__: string;

const modId = typeof __MOD_ID__ === "string" && __MOD_ID__.length > 0 ? __MOD_ID__ : "mod";

/** True when this eval is a hot-reload pass. Free identifier via esbuild inject. */
export const reloaded = isHotReloadEval(modId);

installHotReload(sandkit.api, modId);
