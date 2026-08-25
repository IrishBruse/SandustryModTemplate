# sandkit.engine.api.workerLocal

**`Internal`**

`sandkit.engine.api.workerLocal` — per-worker ephemeral key-value storage.

**Internal API.** Prefer [sandkit.api](api/sandkit/README.md#api-1) when a public method exists.
Available on worker threads only. Values do not persist across workers.

## Functions <!-- {docsify-ignore} -->

### sandkit.engine.api.workerLocal.clear() :id=clear

```ts
clear(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/workerLocal.d.ts:14](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/workerLocal.d.ts#L14)

Remove all keys from worker-local storage.

#### Parameters

##### args

...`unknown`[]

Worker-local context first on workers; otherwise game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.workerLocal.get() :id=get

```ts
get(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/workerLocal.d.ts:19](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/workerLocal.d.ts#L19)

Return a value by key, or undefined when missing.

#### Parameters

##### args

...`unknown`[]

Worker-local context first on workers; otherwise game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.workerLocal.getOrInit() :id=getorinit

```ts
getOrInit(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/workerLocal.d.ts:24](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/workerLocal.d.ts#L24)

Return a value by key, initializing it when missing.

#### Parameters

##### args

...`unknown`[]

Worker-local context first on workers; otherwise game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.workerLocal.set() :id=set

```ts
set(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/workerLocal.d.ts:29](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/workerLocal.d.ts#L29)

Store a value by key.

#### Parameters

##### args

...`unknown`[]

Worker-local context first on workers; otherwise game state first, then method-specific arguments.

#### Returns

`unknown`
