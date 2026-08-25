# sandkit.api.processing

## Interfaces <!-- {docsify-ignore} -->

### sandkit.api.processing.WeightedRecipeOutput :id=weightedrecipeoutput

Defined in: [sandkit/api/processing.d.ts:30](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/processing.d.ts#L30)

Weighted element output entry shared by machine recipes.

#### Properties

##### elementType

```ts
elementType: number
```

Defined in: [sandkit/api/processing.d.ts:32](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/processing.d.ts#L32)

Output element type (1–255).

##### chance

```ts
chance: number
```

Defined in: [sandkit/api/processing.d.ts:34](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/processing.d.ts#L34)

Output probability from 0 to 1.

***

### sandkit.api.processing.PlanterBoxRecipeDefinitionV1 :id=planterboxrecipedefinitionv1

Defined in: [sandkit/api/processing.d.ts:38](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/processing.d.ts#L38)

Planter box grower recipe definition.

#### Properties

##### input

```ts
input: number
```

Defined in: [sandkit/api/processing.d.ts:40](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/processing.d.ts#L40)

Input element type placed on the grower.

##### output

```ts
output: number
```

Defined in: [sandkit/api/processing.d.ts:42](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/processing.d.ts#L42)

Output element type produced by the grower.

##### chance?

```ts
optional chance?: number
```

Defined in: [sandkit/api/processing.d.ts:44](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/processing.d.ts#L44)

Success chance from 0 to 1. Default 1.

***

### sandkit.api.processing.ShakerRecipeDefinitionV1 :id=shakerrecipedefinitionv1

Defined in: [sandkit/api/processing.d.ts:48](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/processing.d.ts#L48)

Shaker recipe definition.

#### Properties

##### input

```ts
input: number
```

Defined in: [sandkit/api/processing.d.ts:50](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/processing.d.ts#L50)

Input element type dropped on the shaker.

##### outputsAbove

```ts
outputsAbove: WeightedRecipeOutput[]
```

Defined in: [sandkit/api/processing.d.ts:52](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/processing.d.ts#L52)

Weighted outputs ejected upward.

##### outputsBelow

```ts
outputsBelow: WeightedRecipeOutput[]
```

Defined in: [sandkit/api/processing.d.ts:54](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/processing.d.ts#L54)

Weighted outputs ejected downward.

***

### sandkit.api.processing.KineticPressRecipeDefinitionV1 :id=kineticpressrecipedefinitionv1

Defined in: [sandkit/api/processing.d.ts:58](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/processing.d.ts#L58)

Kinetic press recipe definition.

#### Properties

##### input

```ts
input: number
```

Defined in: [sandkit/api/processing.d.ts:60](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/processing.d.ts#L60)

Input element type processed by the press.

##### minimumDownwardVelocity

```ts
minimumDownwardVelocity: number
```

Defined in: [sandkit/api/processing.d.ts:62](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/processing.d.ts#L62)

Minimum downward velocity required to trigger the press.

##### outputs

```ts
outputs: WeightedRecipeOutput[]
```

Defined in: [sandkit/api/processing.d.ts:64](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/processing.d.ts#L64)

Weighted outputs produced by the press.

## Functions <!-- {docsify-ignore} -->

### sandkit.api.processing.registerGrower() :id=registergrower

```ts
registerGrower(definition: PlanterBoxRecipeDefinitionV1): void
```

Defined in: [sandkit/api/processing.d.ts:15](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/processing.d.ts#L15)

Register a planter box grower recipe.

#### Parameters

##### definition

[`PlanterBoxRecipeDefinitionV1`](#planterboxrecipedefinitionv1)

Grower input/output recipe.

#### Returns

`void`

***

### sandkit.api.processing.registerShaker() :id=registershaker

```ts
registerShaker(definition: ShakerRecipeDefinitionV1): void
```

Defined in: [sandkit/api/processing.d.ts:21](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/processing.d.ts#L21)

Register a shaker recipe.

#### Parameters

##### definition

[`ShakerRecipeDefinitionV1`](#shakerrecipedefinitionv1)

Shaker input and weighted outputs.

#### Returns

`void`

***

### sandkit.api.processing.registerKineticPress() :id=registerkineticpress

```ts
registerKineticPress(definition: KineticPressRecipeDefinitionV1): void
```

Defined in: [sandkit/api/processing.d.ts:27](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/processing.d.ts#L27)

Register a kinetic press recipe.

#### Parameters

##### definition

[`KineticPressRecipeDefinitionV1`](#kineticpressrecipedefinitionv1)

Press input, velocity threshold, and outputs.

#### Returns

`void`
