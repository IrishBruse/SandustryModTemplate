# events

`sandkit.api.events` — subscribe to and emit named game events.
Main thread only.

## Type Aliases

### EventPayload

```ts
EventPayload<K> = unknown
```

Defined in: [sandkit/api/events.d.ts:20](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/events.d.ts#L20)

Event payload type for a given event id (not yet typed in declarations).

#### Type Parameters

##### K

`K`

## Functions

### on()

```ts
on<K>(eventId: K, callback: (payload: unknown) => void): () => void
```

Defined in: [sandkit/api/events.d.ts:11](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/events.d.ts#L11)

Subscribes to an event. Returns an unsubscribe function.

#### Type Parameters

##### K

`K` *extends* `string`

#### Parameters

##### eventId

`K`

Registered event name.

##### callback

(`payload`: `unknown`) => `void`

Called when the event is emitted.

#### Returns

() => `void`

***

### emit()

```ts
emit<K>(eventId: K, payload: unknown): void
```

Defined in: [sandkit/api/events.d.ts:17](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/events.d.ts#L17)

Emits an event with a payload to all subscribers.

#### Type Parameters

##### K

`K` *extends* `string`

#### Parameters

##### eventId

`K`

Registered event name.

##### payload

`unknown`

Serializable payload passed to listeners.

#### Returns

`void`
