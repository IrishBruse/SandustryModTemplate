# sandkit.engine.api.factory

**`Internal`**

`sandkit.engine.api.factory` — factory tier progression and process tracking.

**Internal API.** Prefer [sandkit.api](api/sandkit.md#api-1) when a public method exists.
Methods use loose stubs; signatures may take game state as the first argument.
Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.

## Functions <!-- {docsify-ignore} -->

### sandkit.engine.api.factory.addViabilityGold() :id=addviabilitygold

```ts
addViabilityGold(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/factory.d.ts:15](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/factory.d.ts#L15)

Add viability gold toward the next factory tier.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.factory.canUnlockNextTier() :id=canunlocknexttier

```ts
canUnlockNextTier(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/factory.d.ts:20](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/factory.d.ts#L20)

Return whether the next factory tier can be unlocked.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.factory.ensureProcessAtLeast() :id=ensureprocessatleast

```ts
ensureProcessAtLeast(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/factory.d.ts:25](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/factory.d.ts#L25)

Ensure at least the given process count has been recorded.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.factory.flushDeferredLevelUps() :id=flushdeferredlevelups

```ts
flushDeferredLevelUps(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/factory.d.ts:30](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/factory.d.ts#L30)

Apply deferred factory level-ups.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.factory.getLevel() :id=getlevel

```ts
getLevel(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/factory.d.ts:35](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/factory.d.ts#L35)

Return the current factory level.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.factory.getProcessCount() :id=getprocesscount

```ts
getProcessCount(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/factory.d.ts:40](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/factory.d.ts#L40)

Return total recorded process count.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.factory.getProcessRate() :id=getprocessrate

```ts
getProcessRate(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/factory.d.ts:45](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/factory.d.ts#L45)

Return the current process rate.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.factory.recordProcess() :id=recordprocess

```ts
recordProcess(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/factory.d.ts:50](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/factory.d.ts#L50)

Record one factory process event.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.factory.unlockNextTier() :id=unlocknexttier

```ts
unlockNextTier(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/factory.d.ts:55](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/factory.d.ts#L55)

Unlock the next factory tier.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`
