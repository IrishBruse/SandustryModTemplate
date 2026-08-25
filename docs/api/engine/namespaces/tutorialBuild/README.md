# sandkit.engine.api.tutorialBuild

**`Internal`**

`sandkit.engine.api.tutorialBuild` — tutorial build-step constraints and targets.

**Internal API.** Prefer [sandkit.api](api/sandkit/README.md#api-1) when a public method exists.
Methods use loose stubs; signatures may take game state as the first argument.
Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.

## Functions <!-- {docsify-ignore} -->

### sandkit.engine.api.tutorialBuild.areAllTargetsBuilt() :id=arealltargetsbuilt

```ts
areAllTargetsBuilt(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/tutorialBuild.d.ts:15](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/tutorialBuild.d.ts#L15)

Return whether all active tutorial targets are built.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.tutorialBuild.areFamilyTargetsBuilt() :id=arefamilytargetsbuilt

```ts
areFamilyTargetsBuilt(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/tutorialBuild.d.ts:20](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/tutorialBuild.d.ts#L20)

Return whether all targets in a structure family are built.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.tutorialBuild.canPlaceAtActiveTarget() :id=canplaceatactivetarget

```ts
canPlaceAtActiveTarget(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/tutorialBuild.d.ts:25](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/tutorialBuild.d.ts#L25)

Return whether placement is allowed at the active target.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.tutorialBuild.getFoundationMoveDests() :id=getfoundationmovedests

```ts
getFoundationMoveDests(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/tutorialBuild.d.ts:30](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/tutorialBuild.d.ts#L30)

Return foundation move destination cells for the tutorial step.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.tutorialBuild.getFoundationMoveSources() :id=getfoundationmovesources

```ts
getFoundationMoveSources(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/tutorialBuild.d.ts:35](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/tutorialBuild.d.ts#L35)

Return foundation move source cells for the tutorial step.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.tutorialBuild.getTargets() :id=gettargets

```ts
getTargets(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/tutorialBuild.d.ts:40](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/tutorialBuild.d.ts#L40)

Return build targets for the current tutorial step.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.tutorialBuild.hasDefinition() :id=hasdefinition

```ts
hasDefinition(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/tutorialBuild.d.ts:45](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/tutorialBuild.d.ts#L45)

Return whether a tutorial build definition exists.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.tutorialBuild.isStepConstrained() :id=isstepconstrained

```ts
isStepConstrained(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/tutorialBuild.d.ts:50](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/tutorialBuild.d.ts#L50)

Return whether the current step restricts building.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.tutorialBuild.matchesFoundationMove() :id=matchesfoundationmove

```ts
matchesFoundationMove(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/tutorialBuild.d.ts:55](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/tutorialBuild.d.ts#L55)

Return whether a foundation move matches tutorial rules.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.tutorialBuild.matchesFoundationRemove() :id=matchesfoundationremove

```ts
matchesFoundationRemove(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/tutorialBuild.d.ts:60](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/tutorialBuild.d.ts#L60)

Return whether a foundation remove matches tutorial rules.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.tutorialBuild.shouldProtectActiveTargetAt() :id=shouldprotectactivetargetat

```ts
shouldProtectActiveTargetAt(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/tutorialBuild.d.ts:65](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/tutorialBuild.d.ts#L65)

Return whether the active target should be protected at a cell.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`
