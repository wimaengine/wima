/**
 * A type-level function with a replaceable input slot.
 */
export interface FilterTransform {
  _input: unknown
  0: unknown
}

/** A transform that preserves the component tuple. */
export interface IdentityTransform extends FilterTransform {
  0: this['_input']
}

/** Apply a transform to a concrete component tuple. */
export type ApplyTransform<Transform extends FilterTransform, Input> =
  (Transform & { _input: Input })[0]

/** Transform the tuple entries matching a component into optional entries. */
export type Optionalize<Components extends unknown[], Component> = {
  [K in keyof Components]: Extract<Component, Components[K]> extends never
    ? Components[K]
    : Components[K] | undefined
}

export interface OptionalTransform<Component> extends FilterTransform {
  0: this['_input'] extends unknown[]
    ? Optionalize<this['_input'], Component>
    : never
}

/** Apply one filter's type-level transformation. */
export type ApplyFilter<Components extends unknown[], Filter> =
  Filter extends { readonly typeTransform: infer Transform }
    ? Transform extends FilterTransform
      ? ApplyTransform<Transform, Components>
      : Components
    : Components

/** Apply filters from left to right. */
export type ApplyFilters<Components extends unknown[], Filters extends unknown[]> =
  Filters extends [infer Filter, ...infer Rest]
    ? Rest extends unknown[]
      ? ApplyFilters<ApplyFilter<Components, Filter>, Rest>
      : ApplyFilter<Components, Filter>
    : Components
