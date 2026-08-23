# events

`sandkit.api.events` — subscribe to and emit named game events.
Main thread only.

## Interfaces

### PlayerCollisionPreparePayload

Defined in: [sandkit/api/events.d.ts:23](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/events.d.ts#L23)

Mutable payload for `player:collision:prepare`.
Listeners may change `maxStepCells` (clamped 1–8) and phasing flags.

#### Properties

##### phaseThroughTerrain

```ts
phaseThroughTerrain: boolean
```

Defined in: [sandkit/api/events.d.ts:25](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/events.d.ts#L25)

When true, terrain collision is skipped this sub-step.

##### phaseThroughStructures

```ts
phaseThroughStructures: boolean
```

Defined in: [sandkit/api/events.d.ts:27](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/events.d.ts#L27)

When true, structure collision is skipped this sub-step.

##### maxStepCells

```ts
maxStepCells: number
```

Defined in: [sandkit/api/events.d.ts:29](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/events.d.ts#L29)

Max cells the player can step up when blocked horizontally (1–8).

***

### EventPayloadMap

Defined in: [sandkit/api/events.d.ts:33](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/events.d.ts#L33)

Known event payloads. Unlisted ids still use `unknown`.

#### Properties

##### player:collision:prepare

```ts
player:collision:prepare: PlayerCollisionPreparePayload
```

Defined in: [sandkit/api/events.d.ts:34](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/events.d.ts#L34)

## Type Aliases

### EventPayload

```ts
EventPayload<K> = K *extends* keyof EventPayloadMap ? EventPayloadMap[K] : unknown
```

Defined in: [sandkit/api/events.d.ts:38](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/events.d.ts#L38)

Event payload type for a given event id.

#### Type Parameters

##### K

`K`

## Functions

### on()

```ts
on<K>(eventId: K, callback: (payload: EventPayload<K>) => void): () => void
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

(`payload`: [`EventPayload`](#eventpayload)\<`K`\>) => `void`

Called when the event is emitted.

#### Returns

() => `void`

***

### emit()

```ts
emit<K>(eventId: K, payload: EventPayload<K>): void
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

[`EventPayload`](#eventpayload)\<`K`\>

Serializable payload passed to listeners.

#### Returns

`void`
