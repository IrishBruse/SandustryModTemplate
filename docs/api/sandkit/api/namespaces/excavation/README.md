# sandkit.api.excavation

`sandkit.api.excavation` — register custom excavation tool dig profiles.
Main thread only.

## Interfaces <!-- {docsify-ignore} -->

### sandkit.api.excavation.ExcavationProfileDefinitionV1 :id=excavationprofiledefinitionv1

Defined in: [sandkit/api/excavation.d.ts:14](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/excavation.d.ts#L14)

Excavation tool profile definition.

#### Properties

##### pattern

```ts
pattern: number[][]
```

Defined in: [sandkit/api/excavation.d.ts:16](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/excavation.d.ts#L16)

Dig pattern grid; non-zero cells are removed.

##### power

```ts
power: number
```

Defined in: [sandkit/api/excavation.d.ts:18](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/excavation.d.ts#L18)

Dig strength applied to matched cells. Clamped to 0–1000.

##### options?

```ts
optional options?: ExcavationProfileOptions
```

Defined in: [sandkit/api/excavation.d.ts:20](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/excavation.d.ts#L20)

Optional profile-specific excavation flags.

***

### sandkit.api.excavation.ExcavationProfileOptions :id=excavationprofileoptions

Defined in: [sandkit/api/excavation.d.ts:24](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/excavation.d.ts#L24)

Options attached to an excavation profile definition.

#### Properties

##### fromGun?

```ts
optional fromGun?: boolean
```

Defined in: [sandkit/api/excavation.d.ts:25](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/excavation.d.ts#L25)

##### fromRocketExplosion?

```ts
optional fromRocketExplosion?: boolean
```

Defined in: [sandkit/api/excavation.d.ts:26](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/excavation.d.ts#L26)

##### fromDrill?

```ts
optional fromDrill?: boolean
```

Defined in: [sandkit/api/excavation.d.ts:27](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/excavation.d.ts#L27)

##### useLiteralOutVelocity?

```ts
optional useLiteralOutVelocity?: boolean
```

Defined in: [sandkit/api/excavation.d.ts:28](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/excavation.d.ts#L28)

##### destroyNonDestructible?

```ts
optional destroyNonDestructible?: boolean
```

Defined in: [sandkit/api/excavation.d.ts:29](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/excavation.d.ts#L29)

##### forceRemoveAll?

```ts
optional forceRemoveAll?: boolean
```

Defined in: [sandkit/api/excavation.d.ts:30](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/excavation.d.ts#L30)

##### drillTierDamage?

```ts
optional drillTierDamage?: number
```

Defined in: [sandkit/api/excavation.d.ts:32](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/excavation.d.ts#L32)

Clamped to 0–1000 when set.

## Functions <!-- {docsify-ignore} -->

### sandkit.api.excavation.registerProfile() :id=registerprofile

```ts
registerProfile(id: string, definition: ExcavationProfileDefinitionV1): void
```

Defined in: [sandkit/api/excavation.d.ts:11](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/excavation.d.ts#L11)

Registers an excavation profile by id.

#### Parameters

##### id

`string`

Unique profile id (1–128 chars: letters, numbers, `.`, `_`, `:`, `-`).

##### definition

[`ExcavationProfileDefinitionV1`](#excavationprofiledefinitionv1)

Pattern, power, and profile options.

#### Returns

`void`
