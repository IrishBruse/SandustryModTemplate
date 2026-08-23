# triggers

## Interfaces

### MainTriggerDefinition

Defined in: [sandkit/api/triggers.d.ts:17](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/triggers.d.ts#L17)

Main-thread trigger definition shape.

#### Indexable

```ts
[key: string]: unknown
```

#### Properties

##### interval

```ts
interval: number
```

Defined in: [sandkit/api/triggers.d.ts:19](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/triggers.d.ts#L19)

Interval between callbacks in simulation ticks.

##### callback

```ts
callback: () => void
```

Defined in: [sandkit/api/triggers.d.ts:21](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/triggers.d.ts#L21)

Called each time the trigger fires.

###### Returns

`void`

## Functions

### register()

```ts
register(triggerId: string, definition: MainTriggerDefinition): void
```

Defined in: [sandkit/api/triggers.d.ts:14](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/triggers.d.ts#L14)

Register a repeating trigger with interval and callback.

#### Parameters

##### triggerId

`string`

Unique trigger identifier.

##### definition

[`MainTriggerDefinition`](#maintriggerdefinition)

Interval in ticks and callback to invoke.

#### Returns

`void`
