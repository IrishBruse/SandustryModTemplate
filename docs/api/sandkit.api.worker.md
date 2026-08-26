# sandkit.api (worker)

Worker-thread `sandkit.api` namespaces.

Prefer these declarations in `worker.js`. Type `sandkit.api` as
[WorkerSandkitApi](#workersandkitapi). Do not assume main-thread methods exist here.
See [sandkit.api](api/sandkit.md#api-1) for the main-thread public API.

## Namespaces <!-- {docsify-ignore} -->

- [maps](api/sandkit.api.maps.worker.md)
- [player](api/sandkit.api.player.worker.md)
- [structures](api/sandkit.api.structures.worker.md)
- [terrains](api/sandkit.api.terrains.worker.md)
- [ui](api/sandkit.api.ui.worker.md)
- [world](api/sandkit.api.world.worker.md)
- [elements](api/sandkit.api.elements.worker.md)
- [main](api/sandkit.api.main.worker.md)
- [shared](api/sandkit.api.shared.worker.md)
- [worker](api/sandkit.api.worker.worker.md)

## Type Aliases <!-- {docsify-ignore} -->

### sandkit.api.WorkerSandkitApi (worker) :id=workersandkitapi

```ts
WorkerSandkitApi = object
```

Defined in: [worker/sandkit-api.d.ts:14](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/worker/sandkit-api.d.ts#L14)

Composed worker-thread `sandkit.api` object.

Namespace members are documented under [worker](api/sandkit.api.worker.worker.md). Use this type in
`worker.js` / `worker.ts`:

```ts
const api = sandkit.api as unknown as WorkerSandkitApi;
```

Main and worker surfaces overlap but are not interchangeable. Do not use
[sandkit.SandkitApi](api/sandkit.md#sandkitapi) on worker threads.

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

## References <!-- {docsify-ignore} -->

### sandkit.api.collector (worker) :id=collector

Re-exports [collector](api/sandkit.api.collector.md)

***

### sandkit.api.fire (worker) :id=fire

Re-exports [fire](api/sandkit.api.fire.md)

***

### sandkit.api.hooks (worker) :id=hooks

Re-exports [hooks](api/sandkit.api.hooks.md)

***

### sandkit.api.patterns (worker) :id=patterns

Re-exports [patterns](api/sandkit.api.patterns.md)

***

### sandkit.api.random (worker) :id=random

Re-exports [random](api/sandkit.api.random.md)

***

### sandkit.api.utils (worker) :id=utils

Re-exports [utils](api/sandkit.api.utils.md)
