# sandkit.engine.api.augments

**`Internal`**

`sandkit.engine.api.augments` — player augment levels and unlocked perks.

**Internal API.** Prefer [sandkit.api](api/sandkit/README.md#api-1) when a public method exists.
Methods use loose stubs; signatures may take game state as the first argument.
Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.

## Functions <!-- {docsify-ignore} -->

### sandkit.engine.api.augments.getDigLevel() :id=getdiglevel

```ts
getDigLevel(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/augments.d.ts:15](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/augments.d.ts#L15)

Return the current dig augment level.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.augments.getGunLevel() :id=getgunlevel

```ts
getGunLevel(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/augments.d.ts:20](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/augments.d.ts#L20)

Return the current gun augment level.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.augments.getPhaseLevel() :id=getphaselevel

```ts
getPhaseLevel(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/augments.d.ts:25](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/augments.d.ts#L25)

Return the current phase augment level.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.augments.getRocketAmmoLevel() :id=getrocketammolevel

```ts
getRocketAmmoLevel(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/augments.d.ts:30](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/augments.d.ts#L30)

Return the current rocket ammo augment level.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.augments.getRocketReloadLevel() :id=getrocketreloadlevel

```ts
getRocketReloadLevel(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/augments.d.ts:35](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/augments.d.ts#L35)

Return the current rocket reload augment level.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.augments.getSprintCapLevel() :id=getsprintcaplevel

```ts
getSprintCapLevel(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/augments.d.ts:40](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/augments.d.ts#L40)

Return the current sprint cap augment level.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.augments.hasBigDig() :id=hasbigdig

```ts
hasBigDig(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/augments.d.ts:45](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/augments.d.ts#L45)

Return whether the big-dig augment is unlocked.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.augments.hasBulletSpeed() :id=hasbulletspeed

```ts
hasBulletSpeed(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/augments.d.ts:50](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/augments.d.ts#L50)

Return whether the bullet-speed augment is unlocked.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.augments.hasBulletTracer() :id=hasbullettracer

```ts
hasBulletTracer(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/augments.d.ts:55](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/augments.d.ts#L55)

Return whether the bullet-tracer augment is unlocked.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.augments.hasKickstartBoost() :id=haskickstartboost

```ts
hasKickstartBoost(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/augments.d.ts:60](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/augments.d.ts#L60)

Return whether the kickstart-boost augment is unlocked.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.augments.hasPhaseDash() :id=hasphasedash

```ts
hasPhaseDash(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/augments.d.ts:65](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/augments.d.ts#L65)

Return whether the phase-dash augment is unlocked.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.augments.hasPhaseDashCharge() :id=hasphasedashcharge

```ts
hasPhaseDashCharge(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/augments.d.ts:70](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/augments.d.ts#L70)

Return whether the phase-dash-charge augment is unlocked.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.augments.hasRideBoost() :id=hasrideboost

```ts
hasRideBoost(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/augments.d.ts:75](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/augments.d.ts#L75)

Return whether the ride-boost augment is unlocked.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.augments.hasRocketDamage() :id=hasrocketdamage

```ts
hasRocketDamage(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/augments.d.ts:80](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/augments.d.ts#L80)

Return whether the rocket-damage augment is unlocked.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.augments.hasRocketWarhead() :id=hasrocketwarhead

```ts
hasRocketWarhead(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/augments.d.ts:85](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/augments.d.ts#L85)

Return whether the rocket-warhead augment is unlocked.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.augments.hasSprintPower() :id=hassprintpower

```ts
hasSprintPower(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/augments.d.ts:90](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/augments.d.ts#L90)

Return whether the sprint-power augment is unlocked.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.augments.hasTripleShot() :id=hastripleshot

```ts
hasTripleShot(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/augments.d.ts:95](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/augments.d.ts#L95)

Return whether the triple-shot augment is unlocked.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`
