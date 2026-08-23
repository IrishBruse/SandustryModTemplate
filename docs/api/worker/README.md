# worker

Worker-thread `sandkit.api` namespaces.

Prefer these declarations in `worker.js`. Type `sandkit.api` as
[WorkerSandkitApi](#workersandkitapi). Do not assume main-thread methods exist here.
See [sandkit.api](api/sandkit/README.md#api-1) for the main-thread public API.

## Namespaces

| Namespace | Description |
| ------ | ------ |
| [maps](api/worker/namespaces/maps/README.md) | Shared `sandkit.api.maps` base — active custom map metadata. |
| [player](api/worker/namespaces/player/README.md) | Shared `sandkit.api.player` base — player position and collision queries. |
| [structures](api/worker/namespaces/structures/README.md) | Shared `sandkit.api.structures` base — structure lookup and mutation. |
| [terrains](api/worker/namespaces/terrains/README.md) | Shared `sandkit.api.terrains` base — terrain type lookup and cell mutation. |
| [ui](api/worker/namespaces/ui/README.md) | Shared `sandkit.api.ui` base — lightweight UI helpers available on workers. |
| [world](api/worker/namespaces/world/README.md) | Shared `sandkit.api.world` base — cell and terrain queries plus excavation. |
| [elements](api/worker/namespaces/elements/README.md) | Worker-thread `sandkit.api.elements` — shared reads plus direct mutations. |
| [main](api/worker/namespaces/main/README.md) | Worker thread only. |
| [shared](api/worker/namespaces/shared/README.md) | Worker thread only. |
| [worker](api/worker/namespaces/worker/README.md) | Worker thread only. |

## Type Aliases

### WorkerSandkitApi

```ts
WorkerSandkitApi = object
```

Defined in: [worker/sandkit-api.d.ts:14](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/worker/sandkit-api.d.ts#L14)

Composed worker-thread `sandkit.api` object.

Namespace members are documented under [worker](api/worker/namespaces/worker/README.md). Use this type in
`worker.js` / `worker.ts`:

```ts
const api = sandkit.api as unknown as WorkerSandkitApi;
```

Main and worker surfaces overlap but are not interchangeable. Do not use
[sandkit.SandkitApi](api/sandkit/README.md#sandkitapi) on worker threads.

#### Properties

##### collector

```ts
collector: collector
```

Defined in: [worker/sandkit-api.d.ts:15](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/worker/sandkit-api.d.ts#L15)

##### elements

```ts
elements: elements
```

Defined in: [worker/sandkit-api.d.ts:16](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/worker/sandkit-api.d.ts#L16)

##### fire

```ts
fire: fire
```

Defined in: [worker/sandkit-api.d.ts:17](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/worker/sandkit-api.d.ts#L17)

##### hooks

```ts
hooks: hooks
```

Defined in: [worker/sandkit-api.d.ts:18](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/worker/sandkit-api.d.ts#L18)

##### main

```ts
main: main
```

Defined in: [worker/sandkit-api.d.ts:19](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/worker/sandkit-api.d.ts#L19)

##### maps

```ts
maps: maps
```

Defined in: [worker/sandkit-api.d.ts:20](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/worker/sandkit-api.d.ts#L20)

##### patterns

```ts
patterns: patterns
```

Defined in: [worker/sandkit-api.d.ts:21](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/worker/sandkit-api.d.ts#L21)

##### player

```ts
player: player
```

Defined in: [worker/sandkit-api.d.ts:22](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/worker/sandkit-api.d.ts#L22)

##### random

```ts
random: random
```

Defined in: [worker/sandkit-api.d.ts:23](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/worker/sandkit-api.d.ts#L23)

##### shared

```ts
shared: shared
```

Defined in: [worker/sandkit-api.d.ts:24](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/worker/sandkit-api.d.ts#L24)

##### structures

```ts
structures: structures
```

Defined in: [worker/sandkit-api.d.ts:25](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/worker/sandkit-api.d.ts#L25)

##### terrains

```ts
terrains: terrains
```

Defined in: [worker/sandkit-api.d.ts:26](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/worker/sandkit-api.d.ts#L26)

##### ui

```ts
ui: ui
```

Defined in: [worker/sandkit-api.d.ts:27](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/worker/sandkit-api.d.ts#L27)

##### utils

```ts
utils: utils
```

Defined in: [worker/sandkit-api.d.ts:28](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/worker/sandkit-api.d.ts#L28)

##### worker

```ts
worker: worker
```

Defined in: [worker/sandkit-api.d.ts:29](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/worker/sandkit-api.d.ts#L29)

##### world

```ts
world: world
```

Defined in: [worker/sandkit-api.d.ts:30](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/worker/sandkit-api.d.ts#L30)

## References

### collector

Re-exports [collector](api/sandkit/api/namespaces/collector/README.md)

***

### fire

Re-exports [fire](api/sandkit/api/namespaces/fire/README.md)

***

### hooks

Re-exports [hooks](api/sandkit/api/namespaces/hooks/README.md)

***

### patterns

Re-exports [patterns](api/sandkit/api/namespaces/patterns/README.md)

***

### random

Re-exports [random](api/sandkit/api/namespaces/random/README.md)

***

### utils

Re-exports [utils](api/sandkit/api/namespaces/utils/README.md)
