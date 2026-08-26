# Live tests

Node helpers for tests that talk to a running Sandustry renderer. Import from `*.test.ts` only.

```ts
import { sandustryTest } from "@modkit/test";
```

`npm test` loads `scripts/test/register-modkit.js` so Node can resolve `@modkit/*`. tsconfig paths do not apply to `node --test`.

Do not import `@modkit/test` from mod `main.ts`. The esbuild alias rejects it. The module also throws if `document` exists.

`npm test` strips types. Assign constructor arguments to fields in the constructor body. Use `import type` for type-only imports.

## When a case runs

`sandustryTest` is a `node:test` case. It **skips** when CDP `:9222` is down or the websocket fails.

Launch the game with F5 or `sandustry-vscode-launch.js`. `npm run sandustry` does not open that port.

Inside the case, skip when the scene or mod is not ready. A closed game is a skip, not a failure.

## Session

| Call                                 | Role                                                                                          |
| ------------------------------------ | --------------------------------------------------------------------------------------------- |
| `game.evaluate(fn, ...args)`         | Run `fn` in the renderer. Arguments must be JSON values. Closures do not capture Node locals. |
| `game.waitFor(read, match, options)` | Poll `read` in the page until `match` is true in Node.                                        |
| `game.withModMain(id, fn)`           | Edit the installed `main.js`, then restore the original bytes.                                |
| `game.tryReadModMain(id)`            | Return the installed bundle, or `null`.                                                       |

`waitFor` defaults: 8000 ms timeout, 250 ms interval.

Return values from `evaluate` must be JSON-serializable.

## Example

```ts
import assert from "node:assert/strict";
import { sandustryTest } from "@modkit/test";

sandustryTest("toast text is visible", async (t, game) => {
  const scene = await game.evaluate(() => ({
    active: globalThis.sandkit?.engine?.state?.store?.scene?.active ?? null,
    game: globalThis.sandkit?.enums?.Scene?.Game ?? null,
  }));
  if (scene.game == null || scene.active !== scene.game) {
    t.skip("Sandustry is not in the Game scene");
    return;
  }

  const text = await game.waitFor(
    () => document.body.textContent,
    (value) => typeof value === "string" && value.includes("Template inject"),
    { message: "inject probe missing" },
  );
  assert.ok(text);
});
```

The hot-reload live case is `src/hot-reload/reload/live.test.ts`.
