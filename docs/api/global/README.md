# global

## Type Aliases

### Sandkit

```ts
Sandkit = Sandkit
```

Defined in: [global.d.ts:19](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/global.d.ts#L19)

Full shape of the ambient `sandkit` object.

***

### SandkitApi

```ts
SandkitApi = SandkitApi
```

Defined in: [global.d.ts:21](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/global.d.ts#L21)

Main-thread `sandkit.api` composed type. Not the worker API.

***

### SandkitEngine

```ts
SandkitEngine = SandkitEngine
```

Defined in: [global.d.ts:23](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/global.d.ts#L23)

`sandkit.engine` internals bag (state-first APIs).

***

### SandkitEngineApi

```ts
SandkitEngineApi = SandkitEngineApi
```

Defined in: [global.d.ts:25](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/global.d.ts#L25)

Composed `sandkit.engine.api` namespaces.

***

### SandkitState

```ts
SandkitState = SandkitState
```

Defined in: [global.d.ts:27](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/global.d.ts#L27)

Game state at `sandkit.state` / `sandkit.engine.state`.

***

### SandkitEnums

```ts
SandkitEnums = SandkitEnums
```

Defined in: [global.d.ts:29](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/global.d.ts#L29)

Runtime enum bags at `sandkit.enums`.

***

### SandkitReact

```ts
SandkitReact = SandkitReact
```

Defined in: [global.d.ts:31](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/global.d.ts#L31)

Host React package at `sandkit.react`.

***

### RetroConsoleApi

```ts
RetroConsoleApi = RetroConsoleApi
```

Defined in: [global.d.ts:33](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/global.d.ts#L33)

Retro Console API surface on supported engine namespaces.

## Variables

### sandkit

```ts
const sandkit: Sandkit
```

Defined in: [global.d.ts:16](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/global.d.ts#L16)

Host-injected free variable in the sandkit loader scope (not `globalThis`).
Use this name in mod `main.js` and modkit code. Do not import a value binding.
