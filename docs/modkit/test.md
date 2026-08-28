# Integration tests

Node helpers for tests that talk to the **extracted game** in Chromium. Import from `*.integration.test.ts` only.

```ts
import test from "node:test";
import { setupGame } from "@modkit/test";

const game = await setupGame();

test("a", async () => {
  await game.evaluate(() => sandkit.api.player.getPositionAtWorld());
});

test("b", async () => {
  await game.evaluate(() => sandkit.api);
});
```

`setupGame()` connects once per test file. Later calls in that file reuse the session. The file closes the CDP socket when it finishes so the Node test worker can exit.

`npm test` runs **unit** files only (`*.test.ts`, not `*.integration.test.ts`). It does not start Chromium.

`npm run test:integration`:

1. Builds `src/` and `examples/` with `--debug` into `dist/`.
2. Boots `sandustry/<version>-<branch>/dist` in Chrome (CDP **:9224**).
3. Waits for the Game scene.
4. Runs every `*.integration.test.ts` with `--test-concurrency=1`.

If the host is not running, `setupGame()` throws. Run integration files only through `npm run test:integration`.

On failure, the host stays up until you press Ctrl+C. Do not open Chrome DevTools on that window while the tests run. That steals CDP from the runner.

This host does not attach to Steam or F5, and it does not stop them.

| Item           | Path / value                                          |
| -------------- | ----------------------------------------------------- |
| Game files     | `sandustry/<version>-<branch>/dist` (`npm run setup`) |
| Chrome profile | `.tmp/sandustry-test-chrome/`                         |
| Test mods copy | `.tmp/sandustry-test/mods/`                           |
| CDP            | **9224** (Steam / F5 stay on **9222**)                |
| HTTP           | `http://127.0.0.1:4173` with COOP/COEP                |
| Display        | Desktop (`DISPLAY` on Linux) so WebGL works           |

It copies every built mod from `dist/` (then fills gaps from the OS mods folder) and enables them. It loads the tracked Void save `modkit/test/fixtures/Empty.save` with `?db_load=<meta.id>` (vanilla file name is `{id}.save`). A harness mod sets `globalThis.sandkit`. Hot-reload can fetch `main.js` from `/mods/<id>/`. Vanilla HUD textures stay at `/mods/<file>.png` from extracted `dist/mods/`. The host rewrites the served `js/bundle.js` so `assets.getUrl` / map blueprints accept HTTP `rootUrl` (vanilla join allows `file:` only). `sessionStorage.splashShown` is set; `?db_load=` still runs vanilla shader wait.

Import `@modkit/test` from test files only. The esbuild alias rejects a game bundle import. The module also throws if `document` exists.

`npm test` strips types. Assign constructor arguments to fields in the constructor body. Use `import type` for type-only imports.

Name integration files `*.integration.test.ts` (for example `src/template/template.integration.test.ts`).

Tests that write the same world (for example player position) must run in order. Use `describe(..., { concurrency: false }, () => { ... })`.

## Session

| Call                                 | Role                                                                                          |
| ------------------------------------ | --------------------------------------------------------------------------------------------- |
| `game.evaluate(fn, ...args)`         | Run `fn` in the renderer. Arguments must be JSON values. Closures do not capture Node locals. |
| `game.waitFor(read, match, options)` | Poll `read` in the page until `match` is true in Node.                                        |
| `game.withModMain(id, fn)`           | Edit the test-host `main.js`, then restore the original bytes.                                |
| `game.tryReadModMain(id)`            | Return the test-host bundle, or `null`.                                                       |

`waitFor` defaults: 8000 ms timeout, 250 ms interval.

Return values from `evaluate` must be JSON-serializable.

Kit smoke: `modkit/test/game.integration.test.ts`. Template: `src/template/template.integration.test.ts`. Samples: `examples/**/*.integration.test.ts`. Hot-reload: `src/hot-reload/reload/integration.test.ts`.
