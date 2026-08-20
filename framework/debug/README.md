# Debug framework

Shared dev-only runtime helpers for Sandustry mods: global `window.api`, DevTools shortcuts, splash skip, main-menu auto-boot, and renderer hot reload.

Mod-specific debug setup and dev-only patches live in [`src/debug/`](../../src/debug/). That folder imports this module and adds mod-only behaviour.

**Release builds do not compile this code.** `npm run build` stubs `src/debug` to `empty.ts`, so neither this folder nor mod debug code is bundled.

**Dev builds include this code.** `npm run dev`, VS Code debug tasks, and `npm run sandustry:debug` build with debug enabled. The mod config **Debug** toggle (`api.settings.get("debug")`) turns helpers on or off at runtime without rebuilding.

## Hot reload

With `npm run dev` and the Debug setting on, a change to `main.js` disposes registered resources and evaluates the new bundle. The game keeps running.

JavaScript cannot be unloaded. The loader only reclaims what you register:

```ts
import { onDispose } from "./debug";

const stop = api.ui.inject("my-panel", render);
onDispose(stop);
onDispose(() => clearInterval(timer));
```

Import `onDispose` from `./debug` (not `framework/debug`) so release builds stub it.

| Change | Result |
|---|---|
| `main.js` | Dispose, then evaluate the new source |
| `patches.json`, `modinfo.json`, declared `workerEntry` | Toast: restart the game |

A monkey-patch or a trigger with no unregister path stays until the game restarts. Use `isHotReloadEval(modId)` to skip one-shot boot work.
