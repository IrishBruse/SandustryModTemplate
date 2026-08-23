# reactions

## Interfaces

### ContactRecipeDefinitionV1

Defined in: [sandkit/api/reactions.d.ts:18](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/reactions.d.ts#L18)

Contact reaction recipe definition.

#### Properties

##### inputA

```ts
inputA: number
```

Defined in: [sandkit/api/reactions.d.ts:20](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/reactions.d.ts#L20)

First reacting element type.

##### inputB

```ts
inputB: number
```

Defined in: [sandkit/api/reactions.d.ts:22](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/reactions.d.ts#L22)

Second reacting element type.

##### outputA

```ts
outputA: number | null
```

Defined in: [sandkit/api/reactions.d.ts:24](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/reactions.d.ts#L24)

Element type produced from input A, or null for no output.

##### outputB

```ts
outputB: number | null
```

Defined in: [sandkit/api/reactions.d.ts:26](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/reactions.d.ts#L26)

Element type produced from input B, or null for no output.

##### orientation?

```ts
optional orientation?: "any" | "stacked"
```

Defined in: [sandkit/api/reactions.d.ts:28](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/reactions.d.ts#L28)

Contact layout requirement. Default `"any"`.

## Functions

### registerContact()

```ts
registerContact(definition: ContactRecipeDefinitionV1): void
```

Defined in: [sandkit/api/reactions.d.ts:15](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/reactions.d.ts#L15)

Register a contact reaction between elements.

#### Parameters

##### definition

[`ContactRecipeDefinitionV1`](#contactrecipedefinitionv1)

Contact recipe inputs, outputs, and orientation.

#### Returns

`void`
