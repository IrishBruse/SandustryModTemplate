# sandkit.react

## Type Aliases <!-- {docsify-ignore} -->

### sandkit.react.SandkitReact :id=sandkitreact

```ts
SandkitReact = object
```

Defined in: [sandkit/react.d.ts:8](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/react.d.ts#L8)

Host React runtime at `sandkit.react`.

Kept intentionally shallow so TypeDoc does not ingest `@types/react` / DOM.
Mods should import `react` through the template JSX runtime, not this bag
directly, unless you need to reach the host copy at runtime.

#### Indexable

```ts
[key: string]: unknown
```

Additional host exports not listed here.

#### Properties

##### Fragment?

```ts
optional Fragment?: unknown
```

Defined in: [sandkit/react.d.ts:36](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/react.d.ts#L36)

Fragment symbol (host copy).

##### Component?

```ts
optional Component?: unknown
```

Defined in: [sandkit/react.d.ts:38](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/react.d.ts#L38)

Base class component (host copy).

##### PureComponent?

```ts
optional PureComponent?: unknown
```

Defined in: [sandkit/react.d.ts:40](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/react.d.ts#L40)

Pure class component (host copy).

##### StrictMode?

```ts
optional StrictMode?: unknown
```

Defined in: [sandkit/react.d.ts:42](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/react.d.ts#L42)

Strict mode wrapper (host copy).

##### Suspense?

```ts
optional Suspense?: unknown
```

Defined in: [sandkit/react.d.ts:44](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/react.d.ts#L44)

Suspense boundary (host copy).

##### version?

```ts
optional version?: string
```

Defined in: [sandkit/react.d.ts:46](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/react.d.ts#L46)

React version string from the host bundle.

#### Methods

##### createElement()?

```ts
optional createElement(...args: unknown[]): unknown
```

Defined in: [sandkit/react.d.ts:10](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/react.d.ts#L10)

Create a React element (host copy).

###### Parameters

###### args

...`unknown`[]

###### Returns

`unknown`

##### createContext()?

```ts
optional createContext(...args: unknown[]): unknown
```

Defined in: [sandkit/react.d.ts:12](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/react.d.ts#L12)

Create a React context (host copy).

###### Parameters

###### args

...`unknown`[]

###### Returns

`unknown`

##### createRef()?

```ts
optional createRef(...args: unknown[]): unknown
```

Defined in: [sandkit/react.d.ts:14](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/react.d.ts#L14)

Create a ref object (host copy).

###### Parameters

###### args

...`unknown`[]

###### Returns

`unknown`

##### forwardRef()?

```ts
optional forwardRef(...args: unknown[]): unknown
```

Defined in: [sandkit/react.d.ts:16](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/react.d.ts#L16)

Wrap a component to forward refs (host copy).

###### Parameters

###### args

...`unknown`[]

###### Returns

`unknown`

##### memo()?

```ts
optional memo(...args: unknown[]): unknown
```

Defined in: [sandkit/react.d.ts:18](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/react.d.ts#L18)

Memoize a component (host copy).

###### Parameters

###### args

...`unknown`[]

###### Returns

`unknown`

##### lazy()?

```ts
optional lazy(...args: unknown[]): unknown
```

Defined in: [sandkit/react.d.ts:20](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/react.d.ts#L20)

Lazy-load a component (host copy).

###### Parameters

###### args

...`unknown`[]

###### Returns

`unknown`

##### useState()?

```ts
optional useState(...args: unknown[]): unknown
```

Defined in: [sandkit/react.d.ts:22](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/react.d.ts#L22)

State hook (host copy).

###### Parameters

###### args

...`unknown`[]

###### Returns

`unknown`

##### useEffect()?

```ts
optional useEffect(...args: unknown[]): unknown
```

Defined in: [sandkit/react.d.ts:24](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/react.d.ts#L24)

Effect hook (host copy).

###### Parameters

###### args

...`unknown`[]

###### Returns

`unknown`

##### useLayoutEffect()?

```ts
optional useLayoutEffect(...args: unknown[]): unknown
```

Defined in: [sandkit/react.d.ts:26](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/react.d.ts#L26)

Layout effect hook (host copy).

###### Parameters

###### args

...`unknown`[]

###### Returns

`unknown`

##### useMemo()?

```ts
optional useMemo(...args: unknown[]): unknown
```

Defined in: [sandkit/react.d.ts:28](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/react.d.ts#L28)

Memo hook (host copy).

###### Parameters

###### args

...`unknown`[]

###### Returns

`unknown`

##### useCallback()?

```ts
optional useCallback(...args: unknown[]): unknown
```

Defined in: [sandkit/react.d.ts:30](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/react.d.ts#L30)

Callback hook (host copy).

###### Parameters

###### args

...`unknown`[]

###### Returns

`unknown`

##### useRef()?

```ts
optional useRef(...args: unknown[]): unknown
```

Defined in: [sandkit/react.d.ts:32](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/react.d.ts#L32)

Ref hook (host copy).

###### Parameters

###### args

...`unknown`[]

###### Returns

`unknown`

##### useContext()?

```ts
optional useContext(...args: unknown[]): unknown
```

Defined in: [sandkit/react.d.ts:34](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/react.d.ts#L34)

Context hook (host copy).

###### Parameters

###### args

...`unknown`[]

###### Returns

`unknown`
