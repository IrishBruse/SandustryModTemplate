# Live tests

Node helpers for tests that talk to a **test-only** Sandustry renderer. Import from `*.test.ts` only.

```ts
import { sandustryTest } from "@modkit/test";
```

`npm test` starts that host, then loads `scripts/test/register-modkit.js` so Node can resolve `@modkit/*`. tsconfig paths do not apply to `node --test`. After the tests, it stops the host.

`npm run test:integration` runs the **same** files against a **visible** test window. Use that when you want to watch the Game scene or inspect a failed live case. On failure, the host stays up on CDP **:9223** until you press Ctrl+C. Do not open Electron DevTools (F12) while the tests run. That steals CDP from the runner.

The test host is a second Electron process. It does not attach to Steam or F5, and it does not stop them.

- User data: `.tmp/sandustry-test/` (Steam stays in `~/.config/sandustry` / `%APPDATA%\sandustry`)
- CDP port: **9223** (Steam / F5 stay on **9222**)
- `npm test` on Linux / macOS: `xvfb-run` plus `--ozone-platform=x11` (no window)
- `npm test` on Windows: Electron `--headless=new`
- `npm run test:integration`: always a visible window. It needs a desktop (`DISPLAY` on Linux).

Electron-only flags are not enough for this packaged game (Electron 33): `--ozone-platform=headless` stalls before CDP HTTP works, and `--headless=new` still opens a desktop window. Linux / macOS therefore use a virtual X display.

It copies `author.template` and `hot-reload` from `dist/` (or the OS mods folder). It copies the last played `.save` so auto-load can enter the Game scene. After `npm test`, the runner stops only the test host.

Import `@modkit/test` from `*.test.ts` only. The esbuild alias rejects a game bundle import. The module also throws if `document` exists.

`npm test` strips types. Assign constructor arguments to fields in the constructor body. Use `import type` for type-only imports.

## When a case runs

`sandustryTest` is a `node:test` case. It **skips** when the Sandustry binary, `xvfb-run` (Unix), or test mods are missing, or when the renderer does not reach the Game scene.

Inside the case, skip when the ordered mod list is not ready.

## Session

| Call                                 | Role                                                                                          |
| ------------------------------------ | --------------------------------------------------------------------------------------------- |
| `game.evaluate(fn, ...args)`         | Run `fn` in the renderer. Arguments must be JSON values. Closures do not capture Node locals. |
| `game.waitFor(read, match, options)` | Poll `read` in the page until `match` is true in Node.                                        |
| `game.withModMain(id, fn)`           | Edit the test-host `main.js`, then restore the original bytes.                                |
| `game.tryReadModMain(id)`            | Return the test-host bundle, or `null`.                                                       |

`waitFor` defaults: 8000 ms timeout, 250 ms interval.

Return values from `evaluate` must be JSON-serializable.

## Example

```ts
import assert from "node:assert/strict";
import { sandustryTest } from "@modkit/test";

sandustryTest("toast text is visible", async (_t, game) => {
  const text = await game.waitFor(
    () => document.body.textContent,
    (value) => typeof value === "string" && value.includes("Template inject"),
    { message: "inject probe missing" },
  );
  assert.ok(text);
});
```

The hot-reload live case is `src/hot-reload/reload/live.test.ts`.
