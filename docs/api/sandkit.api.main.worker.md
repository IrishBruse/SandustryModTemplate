# sandkit.api.main (worker)

**`Internal`**

Worker thread only.

`sandkit.api.main` — send events to the main thread.

 Base shape reused by [WorkerSandkitApi](api/sandkit.api.worker.md#workersandkitapi). Main thread has a
larger `sandkit.api` surface; do not assume parity.

## Functions <!-- {docsify-ignore} -->

### sandkit.api.main.emitEvent() (worker) :id=emitevent

```ts
emitEvent<Payload>(eventId: string, payload: Payload): void
```

Defined in: [worker/api/main.d.ts:15](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/worker/api/main.d.ts#L15)

Emit a custom event on the main thread.

#### Type Parameters

##### Payload

`Payload` = `any`

#### Parameters

##### eventId

`string`

Registered event name.

##### payload

`Payload`

Serializable payload passed to main-thread listeners.

#### Returns

`void`
