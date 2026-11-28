/** @import {Constructor, TupleConstructor, TypeId } from './typedef' */

/**
 * Marks an explicit string as a {@linkcode TypeId} for APIs that identify types
 * by ID.
 *
 * Use this to provide a type ID when the type has no runtime constructor, such
 * as an enum or a union. The function does not validate, normalize, or look up
 * `name`; it returns the same string with the {@linkcode TypeId} annotation. The
 * result can be supplied to an API that registers or looks up type metadata.
 * Prefer {@linkcode typeid} or {@linkcode typeidGeneric} when a runtime constructor
 * exists.
 *
 * Because any string is accepted, this function can create an ID with no
 * corresponding type metadata. Use the exact name expected by the consuming
 * API.
 *
 * @param {string} name - The type ID to mark as a `TypeId`.
 * @returns {TypeId} The unchanged `name` value.
 *
 * @example
 * const StatusId = setTypeId('Status')
 * // StatusId === 'Status'
 */
export function setTypeId(name) {
  return /** @type {TypeId}*/(name)
}

/**
 * Derives a {@linkcode TypeId} lookup key from a constructor's runtime name.
 *
 * The constructor is not instantiated or inspected beyond its `.name`
 * property, so the returned ID is exactly that name. Use the result with APIs
 * that register or look up metadata for the constructor's type. The result can
 * differ after minification or if a constructor's name is changed. Use
 * {@linkcode setTypeId} for types without a runtime constructor.
 *
 * @param {Constructor} type - The constructor whose runtime name identifies the type.
 * @returns {TypeId} The constructor's `.name` value marked as a `TypeId`.
 *
 * @example
 * class Position {}
 * const positionId = typeid(Position)
 * // positionId === 'Position'
 */
export function typeid(type) {
  return setTypeId(type.name)
}

/**
 * Derives a generic {@linkcode TypeId} lookup key from a constructor and its
 * constructor arguments.
 *
 * For a non-empty `types` array, the ID is the base constructor name followed
 * by the argument constructor names in angle brackets, with no spaces. Use the
 * result with APIs that register or look up metadata for the generic type. For
 * an empty array, this function returns the same ID as {@linkcode typeid} for
 * `type`. It uses each constructor's `.name`; it does not inspect or instantiate
 * any constructor.
 *
 * @template T
 * @template {Constructor[]} U
 * @param {Constructor<T>} type - The base generic constructor.
 * @param {[...U]} types - The constructors used as the generic arguments.
 * @returns {TypeId} An ID such as `Map<String,Number>` or, with no arguments, `Map`.
 *
 * @example
 * const valuesId = typeidGeneric(Map, [String, Number])
 * // valuesId === 'Map<String,Number>'
 */
export function typeidGeneric(type, types) {
  if (!types.length) {
    return typeid(type)
  }

  let name = `${type.name}<`

  for (let i = 0; i < types.length - 1; i++) {
    name += `${types[i].name},`
  }

  name += `${types[types.length - 1].name}>`

  return /** @type {TypeId}*/ (name)
}

/**
 * Derives a function-signature {@linkcode TypeId} lookup key from constructor
 * information.
 *
 * The function value is used only for type inference and is not called or
 * inspected. The ID is built from the constructors in `input` and `output`:
 * `fn(Input1,Input2):Output`. Use the result with APIs that register or look up
 * metadata for the function signature. Input order is preserved, and an empty
 * input array produces `fn():Output`.
 *
 * @template {(...args: any[]) => any} F
 * @param {F} _func - A function value used for type inference; it is not called.
 * @param {TupleConstructor<Parameters<F>>} input - Constructors for the function's parameters, in order.
 * @param {Constructor<ReturnType<F>>} output - The constructor for the return value.
 * @returns {TypeId} An ID in the form `fn(Input1,Input2):Output`.
 *
 * @example
 * const addId = typeidFunction((left, right) => left + right, [Number, Number], Number)
 * // addId === 'fn(Number,Number):Number'
 */
export function typeidFunction(_func, input, output) {
  return setTypeId(`fn(${input.map((e) => typeid(e)).join(',')}):${typeid(output)}`)
}
