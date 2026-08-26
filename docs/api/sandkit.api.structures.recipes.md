# sandkit.api.structures.recipes

Structure recipe registration by machine kind.

## Functions <!-- {docsify-ignore} -->

### sandkit.api.structures.recipes.register() :id=register

#### Call Signature

```ts
register(id: "planterBox", definition: PlanterBoxRecipeDefinitionV1): void
```

Defined in: [sandkit/api/structures.d.ts:153](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L153)

Register a planter box recipe.

##### Parameters

###### id

`"planterBox"`

Machine recipe slot id.

###### definition

`PlanterBoxRecipeDefinitionV1`

Grower recipe definition.

##### Returns

`void`

#### Call Signature

```ts
register(id: "shaker", definition: ShakerRecipeDefinitionV1): void
```

Defined in: [sandkit/api/structures.d.ts:160](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L160)

Register a shaker recipe.

##### Parameters

###### id

`"shaker"`

Machine recipe slot id.

###### definition

`ShakerRecipeDefinitionV1`

Shaker recipe definition.

##### Returns

`void`

#### Call Signature

```ts
register(id: "kineticPress", definition: KineticPressRecipeDefinitionV1): void
```

Defined in: [sandkit/api/structures.d.ts:167](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L167)

Register a kinetic press recipe.

##### Parameters

###### id

`"kineticPress"`

Machine recipe slot id.

###### definition

`KineticPressRecipeDefinitionV1`

Kinetic press recipe definition.

##### Returns

`void`

#### Call Signature

```ts
register(id: "condenser" | "steamDryer" | "synthesizer" | "snowmaker" | "smelter", definition: WeightedRefineryRecipeDefinitionV1): void
```

Defined in: [sandkit/api/structures.d.ts:174](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L174)

Register a weighted refinery machine recipe.

##### Parameters

###### id

`"condenser"` \| `"steamDryer"` \| `"synthesizer"` \| `"snowmaker"` \| `"smelter"`

Refinery machine id.

###### definition

[`WeightedRefineryRecipeDefinitionV1`](api/sandkit.api.structures.md#weightedrefineryrecipedefinitionv1)

Weighted input/output recipe.

##### Returns

`void`
