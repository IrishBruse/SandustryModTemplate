# Mod debug

Import debug from `./debug` in `src/main.ts` (not `@framework/debug`) so release builds can stub it via `framework/debug/empty.ts`.

| Path       | Role                                                                   |
| ---------- | ---------------------------------------------------------------------- |
| `index.ts` | Calls `@framework/debug`, re-exports `onDispose` and `isHotReloadEval` |

Full feature list: [docs/framework/debug.md](../../docs/framework/debug.md).

Patch format and debug patches: [docs/patches.md](../../docs/patches.md).

## Wiring

```ts
// src/debug/index.ts — debug builds
import { installDebug as installFrameworkDebug } from "@framework/debug";
export { isHotReloadEval, onDispose } from "@framework/debug";

export function installDebug(api: SandkitApi, modId: string): void {
  installFrameworkDebug(api, modId);
}

// src/main.ts
import { installDebug, isHotReloadEval, onDispose } from "./debug";
```

Release builds resolve `./debug` to `framework/debug/empty.ts` (`installDebug`, `onDispose`, and `isHotReloadEval` are no-ops).
