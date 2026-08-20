# Debug framework

Shared dev-only runtime helpers for Sandustry mods: DevTools globals (`sandkit`, `api`, `enums`, `react`), DevTools shortcuts, splash skip, main-menu auto-boot, and renderer hot reload.

Splash skip uses both `splash.ts` (runtime poll) and [`../patches/debug/skip-startup-splash.js`](../patches/debug/skip-startup-splash.js) (bundle rewrite). That `.js` file is raw injected source: leading `// @file`, `// @find`, and `// @expectedMatches` comments set the patch fields, and the rest of the file is the `code`. The filename is the id. Debug builds only. Full format: [`src/patches/README.md`](../../src/patches/README.md).

Mod-specific debug setup lives in [`src/debug/`](../../src/debug/). That folder imports this module and adds mod-only behaviour.

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
