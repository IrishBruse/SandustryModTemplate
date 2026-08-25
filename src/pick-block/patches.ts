import { definePatches } from "@modkit/modinfo";

/** Exact minified Picker `down` handler in `js/bundle.js`. */
export const PICKER_DOWN_FIND = "down:e=>{_S=!0}";

/** When `globalThis.__sandkitPickBlockInstant__` is true, run vanilla `pressed` with a synthetic click. */
export const PICKER_DOWN_CODE =
  "down:e=>{_S=!0;if(globalThis.__sandkitPickBlockInstant__){e.session.input.mouse.clicked=!0;const t=e.sandkit.keyBindings.Picker.handlers;t.pressed&&t.pressed(e);e.session.input.mouse.clicked=!1;_S=!1}}";

export const patches = definePatches([
  {
    id: "instant-pick-block-picker-down",
    file: "js/bundle.js",
    find: PICKER_DOWN_FIND,
    operation: "replace",
    code: PICKER_DOWN_CODE,
    expectedMatches: 1,
  },
]);
