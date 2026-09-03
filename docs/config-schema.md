# Mod `configSchema`

`configSchema` in `modinfo.ts` defines settings the player edits under **Options → Mods**.

Read values with `sandkit.api.settings.get(key)`.
Subscribe with `settings.onChange`.
Put feature switches here instead of hard-coded flags.

Canonical showcase: [settings](https://github.com/sandustry-modding/SandustryExamples/tree/main/api/settings/).

Game validation lives in `sandustry/source/workshop-mods.js` (`validateConfigSchema`).
The Options UI renders the same three types.

## Field types

The game accepts only these `type` values:

| `type`    | Control in Options → Mods                          | Value type |
| --------- | -------------------------------------------------- | ---------- |
| `boolean` | Switch                                             | `boolean`  |
| `number`  | Number box; range slider when both `min` and `max` | `number`   |
| `choice`  | Select list                                        | `string`   |

There is **no** free-text `string` field and **no** `enum` field.
Use `choice` when the player picks one of a fixed set of string values.

### Shared keys

Every field needs:

- `type` — one of the three values above
- `default` — must match the type (and for `choice`, must match an option `value`)
- `labelKey` — localization key or plain label

Optional:

- `descriptionKey` — localization key or plain help text under the label

Field ids must match `^[a-zA-Z][a-zA-Z0-9_.-]*$`, cannot be reserved, and cannot start with `__`.
Max **64** fields per mod.

### `boolean`

```ts
enabled: {
  type: "boolean",
  default: true,
  labelKey: "Mod enabled",
  descriptionKey: "Turn the mod off without unsubscribing.",
},
```

### `number`

Optional `min`, `max`, and `step` (positive finite). `default` must sit inside `min`/`max` when those are set.

When **both** `min` and `max` are set, Options shows a range slider next to the number box.

```ts
volume: {
  type: "number",
  default: 50,
  min: 0,
  max: 100,
  step: 5,
  labelKey: "Volume",
  descriptionKey: "Slider appears because min and max are set.",
},
retryCount: {
  type: "number",
  default: 3,
  labelKey: "Retry count",
  descriptionKey: "Number box only — no min/max.",
},
```

### `choice`

`options` is a list of `{ value, labelKey }` objects (1–64). `default` must equal one `value`.
Each `value` is a nonempty string up to 128 characters.

```ts
priority: {
  type: "choice",
  default: "normal",
  labelKey: "Priority",
  descriptionKey: "Select one option.",
  options: [
    { value: "low", labelKey: "Low" },
    { value: "normal", labelKey: "Normal" },
    { value: "high", labelKey: "High" },
  ],
},
```

## Read and react in `main.ts`

```ts
import { safe } from "@modkit/utils";

const api = sandkit.api;

const volume = safe(() => api.settings.get("volume"));
api.settings.onChange((values) => {
  console.log("settings", values);
});
```

`settings.get` / `getAll` return `string | number | boolean | null` (`ConfigValueV1`).
Check the type before you use the value.

Call `isEnabled` in `main.ts` when the mod must respect **Mod enabled**.
The build does not skip the entry for that setting.
See [utils.md](modkit/utils.md).

## Types

TypeScript shapes come from `@sandustry-modding/types/configs` (re-exported by [`modkit/modinfo.ts`](../modkit/modinfo.ts)).
Keep them aligned with the game validator — do not add field types the game rejects.
