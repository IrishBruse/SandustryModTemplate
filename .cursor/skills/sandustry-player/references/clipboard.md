# Clipboard

Blueprint copy/paste buffer on `sandkit.engine.api.clipboard`. Binds to `KeyBinding.Copy` / `Paste` (live: `Control+KeyC` / `Control+KeyV`).

## Methods

| Method                    | Arity | Notes                                                            |
| ------------------------- | ----- | ---------------------------------------------------------------- |
| `get()`                   | 0     | Current clipboard structure data or `null`                       |
| `getSignalLinks()`        | 0     | Signal link sidecar or `null`                                    |
| `getHistory()`            | 0     | Array of past copies `{ id, timestamp, data, signalLinks? }`     |
| `set(data, signalLinks?)` | 2     | **mutate**                                                       |
| `clear()`                 | 0     | **mutate**                                                       |
| `selectFromHistory(id)`   | 1     | **mutate** - restore history entry                               |
| `activate()`              | 0     | **mutate** - paste preview, may close building/blueprint windows |

## Read-only probe

```js
() => {
  const c = window.sandkit.engine.api.clipboard;
  return {
    hasData: !!c.get(),
    historyLen: c.getHistory()?.length ?? 0,
    hasSignalLinks: !!c.getSignalLinks(),
  };
};
```

UI for clipboard history: **sandustry-ui** Building -> Blueprints tab.
