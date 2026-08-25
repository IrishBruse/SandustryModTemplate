import { isEnabled } from "@modkit/utils";

const api = sandkit.api;

console.log("Loaded");

function apply() {
  const enabled = isEnabled(api);
  console.log(enabled ? "enabled" : "disabled");

  (globalThis as any).__sandkitPickBlockInstant__ = enabled;
}

apply();

console.log("loaded — Picker picks instantly (default F)");
