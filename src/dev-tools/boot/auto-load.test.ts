import assert from "node:assert/strict";
import test from "node:test";
import {
  BOOT_QUERY_KEYS,
  buildAutoLoadUrl,
  earlyAutoLoadPatchIife,
  isBootQueryActive,
  shouldAutoLoad,
} from "./auto-load.ts";
import { AUTO_LOAD_STORAGE_KEY } from "./fast-boot-keys.ts";

test("isBootQueryActive matches known boot query keys", () => {
  assert.equal(isBootQueryActive("?db_load=abc"), true);
  assert.equal(isBootQueryActive("?new_game=1"), true);
  assert.equal(isBootQueryActive(""), false);
});

test("shouldAutoLoad rejects in-game, session done, and active boot query", () => {
  assert.equal(
    shouldAutoLoad({
      search: "",
      autoLoadEnabled: true,
      saveId: "save-1",
      sessionDone: false,
      inGame: true,
    }),
    false,
  );
  assert.equal(
    shouldAutoLoad({
      search: "?db_load=abc",
      autoLoadEnabled: true,
      saveId: "save-1",
      sessionDone: false,
      inGame: false,
    }),
    false,
  );
  assert.equal(
    shouldAutoLoad({
      search: "",
      autoLoadEnabled: true,
      saveId: "save-1",
      sessionDone: true,
      inGame: false,
    }),
    false,
  );
  assert.equal(
    shouldAutoLoad({
      search: "",
      autoLoadEnabled: true,
      saveId: "save-1",
      sessionDone: false,
      inGame: false,
    }),
    true,
  );
});

test("buildAutoLoadUrl clears other query params", () => {
  const url = buildAutoLoadUrl("save-1", "https://game.test/?foo=1");
  assert.equal(url.search, "?db_load=save-1");
});

test("earlyAutoLoadPatchIife uses shared boot keys", () => {
  const code = earlyAutoLoadPatchIife();
  assert.match(code, new RegExp(AUTO_LOAD_STORAGE_KEY));
  for (const key of BOOT_QUERY_KEYS) {
    assert.match(code, new RegExp(key));
  }
});
