# Utils

Small helpers under `modkit/utils/`. Import from `@modkit/utils`.

```ts
import { safe, isEnabled, debugEnabled, inGame, registerRetroGame } from "@modkit/utils";
```

## `safe`

```ts
safe<T>(fn: () => T, fallback?: T | null): T | null
```

Runs `fn` in a try/catch. On success, returns the result. On error, returns `fallback` (default `null`).

Use it when Sandkit calls may throw or return unexpected shapes (for example settings or scene queries).

```ts
import { safe } from "@modkit/utils";

const value = safe(() => api.settings.get("enabled"));
```

## `isEnabled` and `debugEnabled`

Both read a boolean from `api.settings.get(...)`. When the setting is missing or not a boolean, they default to `true`.

| Function            | Setting key | Default when missing |
| ------------------- | ----------- | -------------------- |
| `isEnabled(api)`    | `"enabled"` | `true`               |
| `debugEnabled(api)` | `"debug"`   | `true`               |

```ts
import { debugEnabled, isEnabled } from "@modkit/utils";

if (!isEnabled(api)) return;
if (debugEnabled(api)) {
  // runtime debug behaviour
}
```

Release builds omit the **Debug** setting from `modinfo.json`. See [builds.md](../builds.md).

## `inGame`

```ts
inGame(): boolean
```

Returns `false` on main-menu and intro scenes; `true` everywhere else.

Uses `sandkit.api.scene.getActive()` and `sandkit.enums.Scene` when available. Falls back to numeric scene ids `1` (MainMenu) and `2` (Intro) when enums are missing.

```ts
import { inGame } from "@modkit/utils";

if (!inGame()) return null;
```

## `registerRetroGame`

```ts
registerRetroGame<TState>(game: RetroConsoleGame<TState>): boolean
```

Registers a game on the in-world Retro Console via `sandkit.engine.api.retroConsole.registerGame`.

Returns `false` when `retroConsole.registerGame` is not available (logs a warning). Returns `true` after a successful registration.

Types re-exported from `@modkit/utils`:

| Type                      | Role                                 |
| ------------------------- | ------------------------------------ |
| `RetroConsoleGame`        | Game definition passed to the engine |
| `RetroConsoleGameOptions` | Options on the game object           |
| `RetroConsoleApi`         | Engine retro console API shape       |
| `RetroConsoleDisplay`     | Display interface                    |
| `RetroConsoleInput`       | Input interface                      |
| `RetroConsolePixel`       | Pixel type                           |

Full shapes live in `types/engine` (see the [types repo](https://github.com/flamableassassin/sandustry-modding-types)).

```ts
import { registerRetroGame } from "@modkit/utils";
import type { RetroConsoleGame } from "@modkit/utils";

const game: RetroConsoleGame<MyState> = {
  // ...
};

registerRetroGame(game);
```

## Module layout

| File               | Exports                                     |
| ------------------ | ------------------------------------------- |
| `index.ts`         | Re-exports all public API                   |
| `safe.ts`          | `safe`                                      |
| `settings.ts`      | `isEnabled`, `debugEnabled`                 |
| `scene.ts`         | `inGame`                                    |
| `retro-console.ts` | `registerRetroGame` and retro console types |
