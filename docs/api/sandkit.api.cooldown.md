# sandkit.api.cooldown

`sandkit.api.cooldown` — reusable cooldown timers for abilities and items.
Main thread only.

## Interfaces <!-- {docsify-ignore} -->

### sandkit.api.cooldown.Cooldown :id=cooldown

Defined in: [sandkit/api/cooldown.d.ts:20](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/cooldown.d.ts#L20)

Cooldown state object passed to [check](#check) and [isReady](#isready).

#### Properties

##### last

```ts
last: number
```

Defined in: [sandkit/api/cooldown.d.ts:22](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/cooldown.d.ts#L22)

Timestamp when the cooldown was last triggered (game time).

##### time

```ts
time: number
```

Defined in: [sandkit/api/cooldown.d.ts:24](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/cooldown.d.ts#L24)

Cooldown duration in milliseconds.

## Functions <!-- {docsify-ignore} -->

### sandkit.api.cooldown.check() :id=check

```ts
check(cooldown: Cooldown, overrideTime?: number): boolean
```

Defined in: [sandkit/api/cooldown.d.ts:11](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/cooldown.d.ts#L11)

Starts the cooldown when ready and returns true; otherwise returns false.

#### Parameters

##### cooldown

[`Cooldown`](#cooldown)

Cooldown state object to check and update.

##### overrideTime?

`number`

Optional timestamp (ms) instead of current game time.

#### Returns

`boolean`

***

### sandkit.api.cooldown.isReady() :id=isready

```ts
isReady(cooldown: Cooldown, overrideTime?: number): boolean
```

Defined in: [sandkit/api/cooldown.d.ts:17](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/cooldown.d.ts#L17)

Returns true when the cooldown has elapsed.

#### Parameters

##### cooldown

[`Cooldown`](#cooldown)

Cooldown state object to check.

##### overrideTime?

`number`

Optional timestamp (ms) instead of current game time.

#### Returns

`boolean`
