# sandkit.api.patterns

## Type Aliases <!-- {docsify-ignore} -->

### sandkit.api.patterns.PatternExcavateOptions :id=patternexcavateoptions

```ts
PatternExcavateOptions = ExcavateOptions
```

Defined in: [sandkit/api/patterns.d.ts:31](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/patterns.d.ts#L31)

Options for pattern-based excavation. Same shape as [shared.api.world.ExcavateOptions](api/worker/namespaces/world/README.md#excavateoptions).

## Functions <!-- {docsify-ignore} -->

### sandkit.api.patterns.createCircle() :id=createcircle

```ts
createCircle(size: number): number[][]
```

Defined in: [sandkit/api/patterns.d.ts:17](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/patterns.d.ts#L17)

Build a circular excavation pattern matrix for the given size.

#### Parameters

##### size

`number`

Pattern width and height in cells.

#### Returns

`number`[][]

Square matrix with `1` inside the circle and `0` outside.

***

### sandkit.api.patterns.excavateAtCell() :id=excavateatcell

```ts
excavateAtCell(...args: [number, number, number[][], Vector2, number, ExcavateOptions]): void
```

Defined in: [sandkit/api/patterns.d.ts:28](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/patterns.d.ts#L28)

Excavate at a cell using a pattern matrix and output velocity.

#### Parameters

##### args

...\[`number`, `number`, `number`[][], [`Vector2`](api/shared/player/README.md#vector2), `number`, [`ExcavateOptions`](api/worker/namespaces/world/README.md#excavateoptions)\]

#### Returns

`void`
