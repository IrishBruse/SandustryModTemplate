# grabber

Grabber tool size and state.

## Functions

### setSize()

```ts
setSize(size: number): void
```

Defined in: [sandkit/api/tools.d.ts:15](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/tools.d.ts#L15)

Set grabber radius size.

#### Parameters

##### size

`number`

Grab radius in cells.

#### Returns

`void`

***

### getSize()

```ts
getSize(): number
```

Defined in: [sandkit/api/tools.d.ts:21](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/tools.d.ts#L21)

Return current grabber radius size.

#### Returns

`number`

Grab radius in cells.

***

### isActive()

```ts
isActive(): boolean
```

Defined in: [sandkit/api/tools.d.ts:27](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/tools.d.ts#L27)

Return true when grabber tool is active.

#### Returns

`boolean`

True when the grabber is the active tool.

***

### isLoaded()

```ts
isLoaded(): boolean
```

Defined in: [sandkit/api/tools.d.ts:33](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/tools.d.ts#L33)

Return true when grabber holds elements.

#### Returns

`boolean`

True when the grabber buffer is not empty.
