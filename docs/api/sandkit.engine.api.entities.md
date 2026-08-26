# sandkit.engine.api.entities

**`Internal`**

`sandkit.engine.api.entities` — entity type registration, spawn, and queries.

**Internal API.** Prefer [sandkit.api](api/sandkit.md#api-1) when a public method exists.
Methods use loose stubs; signatures may take game state as the first argument.
Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.

## Functions <!-- {docsify-ignore} -->

### sandkit.engine.api.entities.createLight() :id=createlight

```ts
createLight(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/entities.d.ts:15](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/entities.d.ts#L15)

Create a light entity attached to a parent.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.entities.getAll() :id=getall

```ts
getAll(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/entities.d.ts:20](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/entities.d.ts#L20)

Return all live entities.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.entities.getAllByType() :id=getallbytype

```ts
getAllByType(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/entities.d.ts:25](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/entities.d.ts#L25)

Return all entities of one type.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.entities.getAllTypeDefs() :id=getalltypedefs

```ts
getAllTypeDefs(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/entities.d.ts:30](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/entities.d.ts#L30)

Return all registered entity type definitions.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.entities.getSprite() :id=getsprite

```ts
getSprite(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/entities.d.ts:35](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/entities.d.ts#L35)

Return the sprite for an entity.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.entities.getTypeDef() :id=gettypedef

```ts
getTypeDef(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/entities.d.ts:40](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/entities.d.ts#L40)

Return one entity type definition by id.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.entities.launch() :id=launch

```ts
launch(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/entities.d.ts:45](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/entities.d.ts#L45)

Launch an entity with velocity or trajectory.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.entities.registerSpawner() :id=registerspawner

```ts
registerSpawner(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/entities.d.ts:50](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/entities.d.ts#L50)

Register an entity spawner behavior.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.entities.registerType() :id=registertype

```ts
registerType(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/entities.d.ts:55](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/entities.d.ts#L55)

Register a custom entity type.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.entities.spawn() :id=spawn

```ts
spawn(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/entities.d.ts:60](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/entities.d.ts#L60)

Spawn an entity instance.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.entities.startCapture() :id=startcapture

```ts
startCapture(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/entities.d.ts:65](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/entities.d.ts#L65)

Start capturing entities for a tool or effect.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`
