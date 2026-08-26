# sandkit.api.hooks

`sandkit.api.hooks` — intercept and modify internal game hook points.
Main thread only.

## Interfaces <!-- {docsify-ignore} -->

### sandkit.api.hooks.InterceptHookMap :id=intercepthookmap

Defined in: [sandkit/api/hooks.d.ts:22](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/hooks.d.ts#L22)

Map of intercept hook ids to argument shapes (not yet typed in declarations).

#### Properties

##### input:boost-down

```ts
input:boost-down: Record<string, never>
```

Defined in: [sandkit/api/hooks.d.ts:23](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/hooks.d.ts#L23)

##### input:descend-down

```ts
input:descend-down: Record<string, never>
```

Defined in: [sandkit/api/hooks.d.ts:24](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/hooks.d.ts#L24)

##### input:keydown

```ts
input:keydown: object
```

Defined in: [sandkit/api/hooks.d.ts:25](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/hooks.d.ts#L25)

###### key?

```ts
optional key?: string
```

###### code?

```ts
optional code?: string
```

###### event?

```ts
optional event?: Event
```

##### input:keyup

```ts
input:keyup: object
```

Defined in: [sandkit/api/hooks.d.ts:30](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/hooks.d.ts#L30)

###### key?

```ts
optional key?: string
```

###### code?

```ts
optional code?: string
```

###### event?

```ts
optional event?: Event
```

##### input:escape

```ts
input:escape: Record<string, never>
```

Defined in: [sandkit/api/hooks.d.ts:35](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/hooks.d.ts#L35)

##### input:scroll

```ts
input:scroll: Record<string, unknown>
```

Defined in: [sandkit/api/hooks.d.ts:36](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/hooks.d.ts#L36)

***

### sandkit.api.hooks.HookContext :id=hookcontext

Defined in: [sandkit/api/hooks.d.ts:40](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/hooks.d.ts#L40)

Context passed to intercept hook callbacks.

#### Methods

##### cancel()

```ts
cancel(): void
```

Defined in: [sandkit/api/hooks.d.ts:42](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/hooks.d.ts#L42)

When called, the intercepted action is skipped.

###### Returns

`void`

***

### sandkit.api.hooks.HookOptions :id=hookoptions

Defined in: [sandkit/api/hooks.d.ts:47](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/hooks.d.ts#L47)

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

Defined in: [sandkit/api/hooks.d.ts:49](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/hooks.d.ts#L49)

Run this hook before others with lower priority.

## Type Aliases <!-- {docsify-ignore} -->

### sandkit.api.hooks.ModifierHookMap :id=modifierhookmap

```ts
ModifierHookMap = unknown
```

Defined in: [sandkit/api/hooks.d.ts:45](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/hooks.d.ts#L45)

Map of modifier hook ids to argument shapes (not yet typed in declarations).

## Functions <!-- {docsify-ignore} -->

### sandkit.api.hooks.intercept() :id=intercept

```ts
intercept<K>(hookId: K, callback: (args: InterceptHookMap[K], context: HookContext) => void, options?: HookOptions): () => void
```

Defined in: [sandkit/api/hooks.d.ts:12](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/hooks.d.ts#L12)

Registers an intercept hook. Returns an unsubscribe function.

#### Type Parameters

##### K

`K` *extends* keyof [`InterceptHookMap`](#intercepthookmap)

#### Parameters

##### hookId

`K`

Registered hook identifier.

##### callback

(`args`: [`InterceptHookMap`](#intercepthookmap)\[`K`\], `context`: [`HookContext`](#hookcontext)) => `void`

Called with hook arguments and context; may cancel the hook.

##### options?

[`HookOptions`](#hookoptions)

Optional priority and filter options.

#### Returns

() => `void`

***

### sandkit.api.hooks.modify() :id=modify

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
