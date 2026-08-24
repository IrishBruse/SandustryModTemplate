import { onDispose } from "@modkit/debug";
import { isEnabled } from "@modkit/utils";

/** Read by the bundle patch in `patches.ts`. */
const INSTANT_FLAG = "__sandkitPickBlockInstant__";

const api = sandkit.api;

function sync(enabled: boolean) {
  (globalThis as unknown as Record<string, boolean | undefined>)[INSTANT_FLAG] = enabled;
}

function apply() {
  sync(isEnabled(api));
}

apply();
api.settings.onChange(apply);
onDispose(() => sync(false));

console.log(`${reloaded ? "reloaded" : "loaded"} — Picker picks instantly (default F)`);
