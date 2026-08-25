# sandkit.enums

## Enumerations <!-- {docsify-ignore} -->

| Enumeration | Description |
| ------ | ------ |
| [AbilityType](api/sandkit/enums/enumerations/AbilityType.md) | Item ability categories (dig, shoot, spray, laser). |
| [ActionState](api/sandkit/enums/enumerations/ActionState.md) | Phases of a held or repeated player action. |
| [ActionType](api/sandkit/enums/enumerations/ActionType.md) | High-level action channel (weapon, building, tool, mod). |
| [AuthorizationType](api/sandkit/enums/enumerations/AuthorizationType.md) | Zone rules that restrict player abilities. |
| [BuildMode](api/sandkit/enums/enumerations/BuildMode.md) | Linear vs rectangular structure placement. |
| [BuildingClearance](api/sandkit/enums/enumerations/BuildingClearance.md) | Result of a build placement check. |
| [CellType](api/sandkit/enums/enumerations/CellType.md) | Terrain / special cell kinds in the simulation grid. |
| [ComponentId](api/sandkit/enums/enumerations/ComponentId.md) | UI component ids for HUD and menu routing. |
| [DroneType](api/sandkit/enums/enumerations/DroneType.md) | Autonomous drone kinds. |
| [ElementType](api/sandkit/enums/enumerations/ElementType.md) | Built-in element type ids (prefer API string ids when registering mods). |
| [ItemId](api/sandkit/enums/enumerations/ItemId.md) | Built-in hotbar item ids. |
| [ItemType](api/sandkit/enums/enumerations/ItemType.md) | Item category (weapon, tool, consumable, mod). |
| [KeyBinding](api/sandkit/enums/enumerations/KeyBinding.md) | Named input bindings (settings keys). |
| [KeyState](api/sandkit/enums/enumerations/KeyState.md) | Key transition state for input polling. |
| [MatterType](api/sandkit/enums/enumerations/MatterType.md) | Physical behaviour category for elements (mirrors shared API enum). |
| [ProjectileType](api/sandkit/enums/enumerations/ProjectileType.md) | Projectile kinds spawned by weapons and tools. |
| [ReloadType](api/sandkit/enums/enumerations/ReloadType.md) | Weapon reload behaviour. |
| [Scene](api/sandkit/enums/enumerations/Scene.md) | Top-level game scene (menu, intro, deploy, in-game). |
| [StructureType](api/sandkit/enums/enumerations/StructureType.md) | Built-in structure type ids. |
| [Tech](api/sandkit/enums/enumerations/Tech.md) | Tech tree node ids (mixed numeric and string keys). |
| [TechStatus](api/sandkit/enums/enumerations/TechStatus.md) | Visibility and research state of a tech node. |
| [WorldItemType](api/sandkit/enums/enumerations/WorldItemType.md) | Pickups and interactable world items. |

## Type Aliases <!-- {docsify-ignore} -->

### sandkit.enums.SandkitEnums :id=sandkitenums

```ts
SandkitEnums = object
```

Defined in: [sandkit/enums/index.d.ts:421](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/enums/index.d.ts#L421)

Composed `sandkit.enums` object.

#### Properties

##### AbilityType

```ts
AbilityType: *typeof* AbilityType
```

Defined in: [sandkit/enums/index.d.ts:422](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/enums/index.d.ts#L422)

##### ActionState

```ts
ActionState: *typeof* ActionState
```

Defined in: [sandkit/enums/index.d.ts:423](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/enums/index.d.ts#L423)

##### ActionType

```ts
ActionType: *typeof* ActionType
```

Defined in: [sandkit/enums/index.d.ts:424](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/enums/index.d.ts#L424)

##### AuthorizationType

```ts
AuthorizationType: *typeof* AuthorizationType
```

Defined in: [sandkit/enums/index.d.ts:425](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/enums/index.d.ts#L425)

##### BuildMode

```ts
BuildMode: *typeof* BuildMode
```

Defined in: [sandkit/enums/index.d.ts:426](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/enums/index.d.ts#L426)

##### BuildingClearance

```ts
BuildingClearance: *typeof* BuildingClearance
```

Defined in: [sandkit/enums/index.d.ts:427](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/enums/index.d.ts#L427)

##### CellType

```ts
CellType: *typeof* CellType
```

Defined in: [sandkit/enums/index.d.ts:428](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/enums/index.d.ts#L428)

##### ComponentId

```ts
ComponentId: *typeof* ComponentId
```

Defined in: [sandkit/enums/index.d.ts:429](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/enums/index.d.ts#L429)

##### DroneType

```ts
DroneType: *typeof* DroneType
```

Defined in: [sandkit/enums/index.d.ts:430](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/enums/index.d.ts#L430)

##### ElementType

```ts
ElementType: *typeof* ElementType
```

Defined in: [sandkit/enums/index.d.ts:431](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/enums/index.d.ts#L431)

##### ItemId

```ts
ItemId: *typeof* ItemId
```

Defined in: [sandkit/enums/index.d.ts:432](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/enums/index.d.ts#L432)

##### ItemType

```ts
ItemType: *typeof* ItemType
```

Defined in: [sandkit/enums/index.d.ts:433](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/enums/index.d.ts#L433)

##### KeyBinding

```ts
KeyBinding: *typeof* KeyBinding
```

Defined in: [sandkit/enums/index.d.ts:434](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/enums/index.d.ts#L434)

##### KeyState

```ts
KeyState: *typeof* KeyState
```

Defined in: [sandkit/enums/index.d.ts:435](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/enums/index.d.ts#L435)

##### MatterType

```ts
MatterType: *typeof* MatterType
```

Defined in: [sandkit/enums/index.d.ts:436](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/enums/index.d.ts#L436)

##### ProjectileType

```ts
ProjectileType: *typeof* ProjectileType
```

Defined in: [sandkit/enums/index.d.ts:437](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/enums/index.d.ts#L437)

##### ReloadType

```ts
ReloadType: *typeof* ReloadType
```

Defined in: [sandkit/enums/index.d.ts:438](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/enums/index.d.ts#L438)

##### Scene

```ts
Scene: *typeof* Scene
```

Defined in: [sandkit/enums/index.d.ts:439](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/enums/index.d.ts#L439)

##### StructureType

```ts
StructureType: *typeof* StructureType
```

Defined in: [sandkit/enums/index.d.ts:440](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/enums/index.d.ts#L440)

##### Tech

```ts
Tech: *typeof* Tech
```

Defined in: [sandkit/enums/index.d.ts:441](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/enums/index.d.ts#L441)

##### TechStatus

```ts
TechStatus: *typeof* TechStatus
```

Defined in: [sandkit/enums/index.d.ts:442](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/enums/index.d.ts#L442)

##### WorldItemType

```ts
WorldItemType: *typeof* WorldItemType
```

Defined in: [sandkit/enums/index.d.ts:443](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/enums/index.d.ts#L443)
