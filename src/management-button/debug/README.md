# Mod debug

Import debug from `./debug` in `src/management-button/main.ts` (not `@modkit/debug`) so release builds can stub it via `modkit/debug/empty.ts`.

| Path       | Role                                                                |
| ---------- | ------------------------------------------------------------------- |
| `index.ts` | Calls `@modkit/debug`, re-exports `onDispose` and `isHotReloadEval` |

Full feature list: [docs/modkit/debug.md](../../../docs/modkit/debug.md).

Patch format and debug patches: [docs/patches.md](../../../docs/patches.md).

## Wiring

```ts
// src/management-button/debug/index.ts — debug builds
import { installDebug as installModkitDebug } from "@modkit/debug";
export { isHotReloadEval, onDispose } from "@modkit/debug";

export function installDebug(api: SandkitApi, modId: string): void {
  installModkitDebug(api, modId);
}

// src/management-button/main.ts
import { installDebug, isHotReloadEval, onDispose } from "./debug";
```

Release builds resolve `./debug` to `modkit/debug/empty.ts` (`installDebug`, `onDispose`, and `isHotReloadEval` are no-ops).
