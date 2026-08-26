/**
 * Nominal helpers for Sandkit types.
 *
 * `LooseString` / `LooseNumber` keep autocomplete for known literals while
 * still accepting any string or number (the `string & {}` / `number & {}` trick).
 *
 * `TaggedNumber` marks handles so an element type is not a cell id.
 *
 * @internal Not a runtime `sandkit` namespace.
 */

/**
 * Known string literals plus any other string.
 * `T | string` collapses to `string` and drops autocomplete.
 */
export type LooseString<T extends string> = T | (string & {});

/**
 * Known numeric literals plus any other number.
 * `T | number` collapses to `number` and drops autocomplete.
 */
export type LooseNumber<T extends number> = T | (number & {});

/**
 * Number handle that does not mix with a different tag.
 * Plain `number` is not assignable; numeric literals and enum members are.
 */
export type TaggedNumber<Tag extends string> = number & { readonly __tag?: Tag };

/** Packed simulation cell id from `world.getCellIdAtCell`. */
export type CellId = TaggedNumber<"cellId">;
