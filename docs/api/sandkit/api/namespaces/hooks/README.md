# hooks

`sandkit.api.hooks` — intercept and modify internal game hook points.
Main thread only.

## Interfaces

### HookOptions

Defined in: [sandkit/api/hooks.d.ts:28](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/hooks.d.ts#L28)

Options for hook registration.

#### Indexable

```ts
[key: string]: unknown
```

#### Properties

##### priority?

```ts
optional priority?: number
```

Defined in: [sandkit/api/hooks.d.ts:30](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/hooks.d.ts#L30)

Run this hook before others with lower priority.

## Type Aliases

### InterceptHookMap

```ts
InterceptHookMap = unknown
```

Defined in: [sandkit/api/hooks.d.ts:22](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/hooks.d.ts#L22)

Map of intercept hook ids to argument shapes (not yet typed in declarations).

***

### HookContext

```ts
HookContext = unknown
```

Defined in: [sandkit/api/hooks.d.ts:24](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/hooks.d.ts#L24)

Context passed to intercept hook callbacks (not yet typed in declarations).

***

### ModifierHookMap

```ts
ModifierHookMap = unknown
```

Defined in: [sandkit/api/hooks.d.ts:26](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/hooks.d.ts#L26)

Map of modifier hook ids to argument shapes (not yet typed in declarations).

## Functions

### intercept()

```ts
intercept<K>(hookId: K, callback: (args: unknown, context: unknown) => void, options?: HookOptions): () => void
```

Defined in: [sandkit/api/hooks.d.ts:12](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/hooks.d.ts#L12)

Registers an intercept hook. Returns an unsubscribe function.

#### Type Parameters

##### K

`K` *extends* `never`

#### Parameters

##### hookId

`K`

Registered hook identifier.

##### callback

(`args`: `unknown`, `context`: `unknown`) => `void`

Called with hook arguments and context; may cancel the hook.

##### options?

[`HookOptions`](#hookoptions)

Optional priority and filter options.

#### Returns

() => `void`

***

### modify()

```ts
modify<K>(hookId: K, callback: (args: unknown) => void, options?: HookOptions): () => void
```

Defined in: [sandkit/api/hooks.d.ts:19](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/hooks.d.ts#L19)

Registers a modifier hook. Returns an unsubscribe function.

#### Type Parameters

##### K

`K` *extends* `never`

#### Parameters

##### hookId

`K`

Registered hook identifier.

##### callback

(`args`: `unknown`) => `void`

Called with hook arguments; may mutate hook payload.

##### options?

[`HookOptions`](#hookoptions)

Optional priority and filter options.

#### Returns

() => `void`
