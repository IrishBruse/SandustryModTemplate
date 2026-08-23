# lights

`sandkit.api.lights` — temporary VFX lights and persistent world lights.
Main thread only.

## Namespaces

| Namespace | Description |
| ------ | ------ |
| [vfx](api/sandkit/api/namespaces/lights/namespaces/vfx/README.md) | Short-lived visual effect lights. |
| [persistent](api/sandkit/api/namespaces/lights/namespaces/persistent/README.md) | Lights that persist in the world save. |

## Interfaces

### PersistentLightOptions

Defined in: [sandkit/api/lights.d.ts:54](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/lights.d.ts#L54)

Options for persistent world lights.

#### Indexable

```ts
[key: string]: unknown
```

#### Properties

##### brightness?

```ts
optional brightness?: number
```

Defined in: [sandkit/api/lights.d.ts:56](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/lights.d.ts#L56)

Light brightness multiplier.

##### size?

```ts
optional size?: number
```

Defined in: [sandkit/api/lights.d.ts:58](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/lights.d.ts#L58)

Light radius in pixels.

##### color?

```ts
optional color?: [number, number, number, number]
```

Defined in: [sandkit/api/lights.d.ts:60](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/lights.d.ts#L60)

RGBA color components.

## Type Aliases

### TemporaryLightOptions

```ts
TemporaryLightOptions = TemporaryLightOptions
```

Defined in: [sandkit/api/lights.d.ts:51](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/lights.d.ts#L51)

Options for temporary VFX lights.

***

### PersistentLightHandle

```ts
PersistentLightHandle = unknown
```

Defined in: [sandkit/api/lights.d.ts:65](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/lights.d.ts#L65)

Handle returned from [persistent.createAtWorld](api/sandkit/api/namespaces/lights/namespaces/persistent/README.md#createatworld).
