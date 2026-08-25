import assert from "node:assert/strict";
import test from "node:test";
import {
  SANDKIT_LOADER_PREFIX,
  SANDKIT_LOADER_SUFFIX,
  hotEvalMain,
  wrapSource,
} from "./hot-eval.ts";

test("wrapSource matches the sandkit loader body (5 lines before source)", () => {
  const source = "console.log(1);";
  const body = wrapSource(source);
  assert.equal(body, `${SANDKIT_LOADER_PREFIX}${source}${SANDKIT_LOADER_SUFFIX}`);
  assert.equal(
    SANDKIT_LOADER_PREFIX,
    '"use strict";\nconst sandkit = __sandkit;\nreturn (async () => {\n',
  );
  assert.equal(SANDKIT_LOADER_PREFIX.split("\n").length - 1, 3);
  assert.ok(body.startsWith('"use strict";\n'));
});

test("hotEvalMain evals with wrapped sandkit and runs prior disposers", async () => {
  const seen: unknown[] = [];
  const host = {
    api: {
      ui: {
        inject: () => {
          seen.push("inject");
          return () => seen.push("dispose");
        },
      },
    },
  };
  await hotEvalMain("mod-e", "sandkit.api.ui.inject();", host);
  assert.deepEqual(seen, ["inject"]);
  await hotEvalMain("mod-e", "void 0;", host);
  assert.deepEqual(seen, ["inject", "dispose"]);
});
