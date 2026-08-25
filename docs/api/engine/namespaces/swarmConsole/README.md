# sandkit.engine.api.swarmConsole

**`Internal`**

`sandkit.engine.api.swarmConsole` — swarm convergence console state.

**Internal API.** Prefer [sandkit.api](api/sandkit/README.md#api-1) when a public method exists.
Methods use loose stubs; signatures may take game state as the first argument.
Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.

## Functions <!-- {docsify-ignore} -->

### sandkit.engine.api.swarmConsole.decrementConvergenceBuffer() :id=decrementconvergencebuffer

```ts
decrementConvergenceBuffer(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/swarmConsole.d.ts:15](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/swarmConsole.d.ts#L15)

Decrease the convergence buffer by one step.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.swarmConsole.getCrystalMined() :id=getcrystalmined

```ts
getCrystalMined(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/swarmConsole.d.ts:20](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/swarmConsole.d.ts#L20)

Return total crystal mined for swarm consoles.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.swarmConsole.getDiskRadiusCells() :id=getdiskradiuscells

```ts
getDiskRadiusCells(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/swarmConsole.d.ts:25](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/swarmConsole.d.ts#L25)

Return the disk radius in cells for a console.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.swarmConsole.getEntityType() :id=getentitytype

```ts
getEntityType(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/swarmConsole.d.ts:30](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/swarmConsole.d.ts#L30)

Return the entity type used by swarm consoles.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.swarmConsole.getNearestConvergence() :id=getnearestconvergence

```ts
getNearestConvergence(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/swarmConsole.d.ts:35](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/swarmConsole.d.ts#L35)

Return the nearest convergence point.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.swarmConsole.getPendingConvergence() :id=getpendingconvergence

```ts
getPendingConvergence(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/swarmConsole.d.ts:40](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/swarmConsole.d.ts#L40)

Return the pending convergence target.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.swarmConsole.getPlacedConsoles() :id=getplacedconsoles

```ts
getPlacedConsoles(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/swarmConsole.d.ts:45](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/swarmConsole.d.ts#L45)

Return all placed swarm console structures.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.swarmConsole.getRadiusPx() :id=getradiuspx

```ts
getRadiusPx(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/swarmConsole.d.ts:50](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/swarmConsole.d.ts#L50)

Return the console effect radius in pixels.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.swarmConsole.isSpawnJammed() :id=isspawnjammed

```ts
isSpawnJammed(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/swarmConsole.d.ts:55](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/swarmConsole.d.ts#L55)

Return whether swarm spawn is currently jammed.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.swarmConsole.registerEntityType() :id=registerentitytype

```ts
registerEntityType(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/swarmConsole.d.ts:60](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/swarmConsole.d.ts#L60)

Register the entity type for swarm consoles.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.swarmConsole.resetAllConvergenceBuffers() :id=resetallconvergencebuffers

```ts
resetAllConvergenceBuffers(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/swarmConsole.d.ts:65](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/swarmConsole.d.ts#L65)

Reset convergence buffers on all consoles.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.swarmConsole.setSpawnJammed() :id=setspawnjammed

```ts
setSpawnJammed(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/swarmConsole.d.ts:70](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/swarmConsole.d.ts#L70)

Set whether swarm spawn is jammed.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`
