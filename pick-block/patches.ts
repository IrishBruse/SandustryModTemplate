import { definePatches } from "@modkit/patches";

/** Exact minified Picker `down` handler in `js/bundle.js` (game 0.5.5). */
export const PICKER_DOWN_FIND = "down:e=>{QA=!0}";

/** When `globalThis.__sandkitPickBlockInstant__` is true, run vanilla `pressed` with a synthetic click. */
export const PICKER_DOWN_CODE =
  "down:e=>{QA=!0;if(globalThis.__sandkitPickBlockInstant__){e.session.input.mouse.clicked=!0;const t=e.sandkit.keyBindings.Picker.handlers;t.pressed&&t.pressed(e);e.session.input.mouse.clicked=!1;QA=!1}}";

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
