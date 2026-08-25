import { isEnabled } from "@modkit/utils";

const api = sandkit.api;

function apply() {
  const enabled = isEnabled(api);
  console.log(enabled ? "enabled" : "disabled");

  (globalThis as any).__sandkitPickBlockInstant__ = enabled;
}

apply();
api.settings.onChange(apply);

console.log("loaded — Picker picks instantly (default F)");
