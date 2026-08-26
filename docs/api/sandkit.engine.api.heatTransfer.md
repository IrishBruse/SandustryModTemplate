# sandkit.engine.api.heatTransfer

**`Internal`**

`sandkit.engine.api.heatTransfer` — temperature diffusion and absorption.

**Internal API.** Prefer [sandkit.api](api/sandkit.md#api-1) when a public method exists.
Methods use loose stubs; signatures may take game state as the first argument.
Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.

## Functions <!-- {docsify-ignore} -->

### sandkit.engine.api.heatTransfer.absorbAdjacentElements() :id=absorbadjacentelements

```ts
absorbAdjacentElements(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/heatTransfer.d.ts:15](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/heatTransfer.d.ts#L15)

Absorb heat from adjacent elements into a cell.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.heatTransfer.addTemperature() :id=addtemperature

```ts
addTemperature(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/heatTransfer.d.ts:20](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/heatTransfer.d.ts#L20)

Add temperature to a cell or region.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.heatTransfer.computeDiffusedTemperatures() :id=computediffusedtemperatures

```ts
computeDiffusedTemperatures(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/heatTransfer.d.ts:25](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/heatTransfer.d.ts#L25)

Compute diffused temperatures for connected cells.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.heatTransfer.computeEqualizedTemperature() :id=computeequalizedtemperature

```ts
computeEqualizedTemperature(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/heatTransfer.d.ts:30](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/heatTransfer.d.ts#L30)

Compute one equalized temperature across connected cells.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.heatTransfer.consumeTemperatureNear() :id=consumetemperaturenear

```ts
consumeTemperatureNear(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/heatTransfer.d.ts:35](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/heatTransfer.d.ts#L35)

Consume temperature near a point or cell.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.heatTransfer.ensureTemperature() :id=ensuretemperature

```ts
ensureTemperature(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/heatTransfer.d.ts:40](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/heatTransfer.d.ts#L40)

Ensure a cell has at least the given temperature.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.heatTransfer.equalizeConnected() :id=equalizeconnected

```ts
equalizeConnected(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/heatTransfer.d.ts:45](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/heatTransfer.d.ts#L45)

Equalize temperature across a connected component.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`
