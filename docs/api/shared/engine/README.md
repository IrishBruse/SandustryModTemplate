# shared/engine

## Type Aliases

### EngineFn

```ts
EngineFn = (...args: unknown[]) => unknown
```

Defined in: [shared/engine.d.ts:11](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/engine.d.ts#L11)

**`Internal`**

Stub for an unresolved engine method.

#### Parameters

##### args

...`unknown`[]

#### Returns

`unknown`

***

### EngineOverlapNs

```ts
EngineOverlapNs = Record<string, EngineFn | Record<string, unknown> | unknown>
```

Defined in: [shared/engine.d.ts:17](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/engine.d.ts#L17)

**`Internal`**

Loose bag for namespaces that overlap `sandkit.api` (different names / state-first).
