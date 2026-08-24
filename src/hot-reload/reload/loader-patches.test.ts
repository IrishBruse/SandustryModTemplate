import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const DIR = dirname(fileURLToPath(import.meta.url));
const PATCHES = readFileSync(join(DIR, "../patches.ts"), "utf8");
const RUNTIME = join(DIR, "../../../sandustry/dist/js/external-mod-runtime.js");

test("inject tracking uses the sandkit mod id, not the last active id", () => {
  assert.match(PATCHES, /tr&&e&&tr\(e,d\)/);
  assert.doesNotMatch(
    PATCHES,
    /var a=globalThis\.__sandkitHotReloadActive__,tr=globalThis\.__sandkitTrackInjectDispose/,
  );
  assert.match(PATCHES, /local-mod-track-overlays/);
});

test("registry patch does not assign frozen api.events.on", () => {
  assert.match(PATCHES, /__sandkitLocalModRegistry__/);
  assert.doesNotMatch(PATCHES, /ev\.on=/);
  assert.match(PATCHES, /local-mod-track-events/);
  assert.match(PATCHES, /tr&&r\.id&&tr\(r\.id,u\)/);
});

test("loader patch finds still exist in extracted external-mod-runtime.js", (t) => {
  if (!existsSync(RUNTIME)) {
    t.skip("sandustry/dist is missing — run npm run setup");
    return;
  }
  const source = readFileSync(RUNTIME, "utf8");
  const finds = [
    "const t=ie(e,{manifest:i,discovered:r});e.store.integrity.modsUsed=!0,await c(t)",
    "S=q({on:(t,r)=>i.FH.events.on(e,t,function(e,i){r(",
    '}})(t,i))}),emit:(t,r)=>{i.FH.events.emit(e,t,"frame:render"===t?{state:e}:r)}})',
    'return l.set(n,s),i.FH.ui.overlays.register(e,"global",n,function(){return $.createElement(o)}),()=>{const t=G.get(e);(null==t?void 0:t.get(n))===s&&(t.delete(n),i.FH.ui.overlays.unregister(e,"global",n))}',
    "Ce=q({register:(t,r,o)=>{i.FH.ui.overlays.register(e,t,r,function(){return o()})},unregister:(t,r)=>{i.FH.ui.overlays.unregister(e,t,r)},update:t=>{i.FH.ui.overlays.update(e,t)}})",
  ];
  for (const find of finds) {
    const matches = source.split(find).length - 1;
    assert.equal(matches, 1, `expected 1 match for ${find.slice(0, 80)}`);
  }
});
