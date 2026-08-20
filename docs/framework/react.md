# React runtime

Sandustry exposes React on `sandkit.react`. The template does not bundle a separate React copy. TypeScript and esbuild resolve `react` imports to thin shims in `framework/`.

## Runtime source

`framework/react.ts` reads the live runtime:

```ts
const runtime = sandkit.react;

export default runtime;
export const { createElement, useState, useEffect, useCallback, useMemo, useRef, Fragment } =
  runtime;
```

In mod code, write normal React imports:

```tsx
import { useState, useEffect } from "react";
import type { ReactNode } from "react";
```

At build time, esbuild maps `react` → `framework/react.ts`.

## JSX

TypeScript (`tsconfig.json`):

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

esbuild (`scripts/build/esbuild.config.mjs`):

```js
alias: {
  react: join(ROOT, "framework/react.ts"),
  "react/jsx-runtime": join(ROOT, "framework/jsx-runtime.ts"),
  "react/jsx-dev-runtime": join(ROOT, "framework/jsx-dev-runtime.ts"),
},
jsx: "automatic",
jsxImportSource: "react",
```

### `framework/jsx-runtime.ts`

Automatic JSX runtime backed by `sandkit.react`. Exports `Fragment`, `jsx`, and `jsxs`.

When `runtime.jsx` / `runtime.jsxs` exist on `sandkit.react`, those are used. Otherwise the shim falls back to `createElement`.

### `framework/jsx-dev-runtime.ts`

Dev runtime exports `jsxDEV`. When `sandkit.react.jsxDEV` is missing, it falls back to production `jsx` from `jsx-runtime.ts`.

## Bundle format

The game loads `main.js` as a plain script body:

```js
new Function("sandkit", source);
```

esbuild settings:

| Option     | Value       | Why                  |
| ---------- | ----------- | -------------------- |
| `format`   | `"iife"`    | Single script scope  |
| `platform` | `"browser"` | Renderer context     |
| `bundle`   | `true`      | One `main.js` output |

The build banner states:

- Generated output — edit `src/` and rebuild
- No `import` / `export` in the output
- `sandkit` is already in scope

Do not rely on ES modules at runtime. All dependencies must be bundled into `main.js`.

## `@framework/*` alias

esbuild resolves `@framework/...` to files under `framework/` (same as TypeScript `paths`). Example:

```ts
import { installDebug } from "@framework/debug";
```

## UI overlays

Put mod UI under `src/ui/`. Import components from `@framework/ui` or local files. Register overlays with `api.ui.inject` from `src/main.ts`.

See [../ui/README.md](../ui/README.md) for shared UI components.
