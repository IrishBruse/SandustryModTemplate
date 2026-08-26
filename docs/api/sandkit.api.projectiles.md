# sandkit.api.projectiles

## Interfaces <!-- {docsify-ignore} -->

### sandkit.api.projectiles.ProjectileDefinition :id=projectiledefinition

Defined in: [sandkit/api/projectiles.d.ts:54](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/projectiles.d.ts#L54)

Mod-registered projectile definition.

#### Indexable

```ts
[key: string]: unknown
```

#### Properties

##### id

```ts
id: string
```

Defined in: [sandkit/api/projectiles.d.ts:55](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/projectiles.d.ts#L55)

##### sprite

```ts
sprite: object
```

Defined in: [sandkit/api/projectiles.d.ts:56](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/projectiles.d.ts#L56)

###### id

```ts
id: string
```

###### tint?

```ts
optional tint?: number
```

##### getOptions

```ts
getOptions: () => Record<string, unknown>
```

Defined in: [sandkit/api/projectiles.d.ts:61](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/projectiles.d.ts#L61)

Returns spawn-time physics and visual options.

###### Returns

`Record`\<`string`, `unknown`\>

##### getModData?

```ts
optional getModData?: (state: unknown, projectile: Projectile) => Record<string, unknown>
```

Defined in: [sandkit/api/projectiles.d.ts:63](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/projectiles.d.ts#L63)

Optional per-projectile mutable data factory.

###### Parameters

###### state

`unknown`

###### projectile

[`Projectile`](#projectile)

###### Returns

`Record`\<`string`, `unknown`\>

***

### sandkit.api.projectiles.ProjectileBlueprint :id=projectileblueprint

Defined in: [sandkit/api/projectiles.d.ts:68](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/projectiles.d.ts#L68)

Blueprint used to spawn a projectile.

#### Properties

##### opts

```ts
opts: Record<string, unknown>
```

Defined in: [sandkit/api/projectiles.d.ts:69](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/projectiles.d.ts#L69)

##### type

```ts
type: unknown
```

Defined in: [sandkit/api/projectiles.d.ts:70](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/projectiles.d.ts#L70)

***

### sandkit.api.projectiles.Projectile :id=projectile

Defined in: [sandkit/api/projectiles.d.ts:74](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/projectiles.d.ts#L74)

Active projectile instance.

#### Indexable

```ts
[key: string]: unknown
```

#### Properties

##### id

```ts
id: number
```

Defined in: [sandkit/api/projectiles.d.ts:75](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/projectiles.d.ts#L75)

##### x

```ts
x: number
```

Defined in: [sandkit/api/projectiles.d.ts:76](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/projectiles.d.ts#L76)

##### y

```ts
y: number
```

Defined in: [sandkit/api/projectiles.d.ts:77](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/projectiles.d.ts#L77)

## Functions <!-- {docsify-ignore} -->

### sandkit.api.projectiles.register() :id=register

```ts
register(definition: ProjectileDefinition): void
```

Defined in: [sandkit/api/projectiles.d.ts:13](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/projectiles.d.ts#L13)

Register a projectile definition.

#### Parameters

##### definition

[`ProjectileDefinition`](#projectiledefinition)

Projectile id, sprite, and runtime options factory.

#### Returns

`void`

***

### sandkit.api.projectiles.getDefinitionById() :id=getdefinitionbyid

```ts
getDefinitionById(projectileId: string): ProjectileDefinition | undefined
```

Defined in: [sandkit/api/projectiles.d.ts:19](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/projectiles.d.ts#L19)

Return a projectile definition by string id.

#### Parameters

##### projectileId

`string`

Registered projectile id.

#### Returns

[`ProjectileDefinition`](#projectiledefinition) \| `undefined`

***

### sandkit.api.projectiles.createBlueprintFromId() :id=createblueprintfromid

```ts
createBlueprintFromId(projectileId: string): ProjectileBlueprint
```

Defined in: [sandkit/api/projectiles.d.ts:26](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/projectiles.d.ts#L26)

Build a spawn blueprint from a projectile string id.

#### Parameters

##### projectileId

`string`

Registered projectile id.

#### Returns

[`ProjectileBlueprint`](#projectileblueprint)

Blueprint passed to [spawnAtWorld](#spawnatworld).

***

### sandkit.api.projectiles.getAll() :id=getall

```ts
getAll(): Projectile[]
```

Defined in: [sandkit/api/projectiles.d.ts:29](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/projectiles.d.ts#L29)

Return all active projectiles.

#### Returns

[`Projectile`](#projectile)[]

***

### sandkit.api.projectiles.getById() :id=getbyid

```ts
getById(projectileId: number): Projectile | undefined
```

Defined in: [sandkit/api/projectiles.d.ts:35](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/projectiles.d.ts#L35)

Return a projectile by numeric id.

#### Parameters

##### projectileId

`number`

Runtime projectile id.

#### Returns

[`Projectile`](#projectile) \| `undefined`

***

### sandkit.api.projectiles.remove() :id=remove

```ts
remove(projectile: Projectile): void
```

Defined in: [sandkit/api/projectiles.d.ts:41](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/projectiles.d.ts#L41)

Remove a projectile from the world.

#### Parameters

##### projectile

[`Projectile`](#projectile)

Projectile instance to remove.

#### Returns

`void`

***

### sandkit.api.projectiles.spawnAtWorld() :id=spawnatworld

```ts
spawnAtWorld(worldX: number, worldY: number, angle: number, blueprint: ProjectileBlueprint): Projectile
```

Defined in: [sandkit/api/projectiles.d.ts:51](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/projectiles.d.ts#L51)

Spawn a projectile at world position with angle and blueprint.

#### Parameters

##### worldX

`number`

Spawn x position in world pixels.

##### worldY

`number`

Spawn y position in world pixels.

##### angle

`number`

Launch angle in radians.

##### blueprint

[`ProjectileBlueprint`](#projectileblueprint)

Blueprint from [createBlueprintFromId](#createblueprintfromid).

#### Returns

[`Projectile`](#projectile)

The spawned projectile instance.
