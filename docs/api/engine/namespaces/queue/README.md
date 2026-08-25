# sandkit.engine.api.queue

**`Internal`**

`sandkit.engine.api.queue` — deferred tick queue with handlers.

**Internal API.** Prefer [sandkit.api](api/sandkit/README.md#api-1) when a public method exists.
Methods use loose stubs; signatures may take game state as the first argument.
Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.

## Functions <!-- {docsify-ignore} -->

### sandkit.engine.api.queue.enqueue() :id=enqueue

```ts
enqueue(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/queue.d.ts:15](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/queue.d.ts#L15)

Enqueue work to run on a future tick.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.queue.enqueueInTicks() :id=enqueueinticks

```ts
enqueueInTicks(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/queue.d.ts:20](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/queue.d.ts#L20)

Enqueue work to run after a tick delay.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.queue.enqueueSkipTick() :id=enqueueskiptick

```ts
enqueueSkipTick(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/queue.d.ts:25](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/queue.d.ts#L25)

Enqueue work that skips the current tick.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.queue.process() :id=process

```ts
process(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/queue.d.ts:30](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/queue.d.ts#L30)

Process pending queue items for the current tick.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.queue.registerHandler() :id=registerhandler

```ts
registerHandler(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/queue.d.ts:35](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/queue.d.ts#L35)

Register a handler for a queue item type.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.queue.removeByKey() :id=removebykey

```ts
removeByKey(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/queue.d.ts:40](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/queue.d.ts#L40)

Remove queued items by key.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`
