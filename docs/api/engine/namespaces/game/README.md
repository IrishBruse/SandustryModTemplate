# sandkit.engine.api.game

**`Internal`**

`sandkit.engine.api.game` — game session start, save, and load.

**Internal API.** Prefer [sandkit.api](api/sandkit/README.md#api-1) when a public method exists.
Methods use loose stubs; signatures may take game state as the first argument.
Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.

## Functions <!-- {docsify-ignore} -->

### sandkit.engine.api.game.load() :id=load

```ts
load(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/game.d.ts:15](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/game.d.ts#L15)

Load a saved game into the session.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.game.save() :id=save

```ts
save(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/game.d.ts:20](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/game.d.ts#L20)

Save the current session.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.game.start() :id=start

```ts
start(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/game.d.ts:25](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/game.d.ts#L25)

Start a new game session.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`
