/** @import {Constructor, TupleConstructor, TypeId } from './typedef/index.js' */

/**
 * This function converts a string to a `TypeId`.This function should be used in some special cases where a type does not actually exist on runtime e.g enums, union types e.t.c.
 * See `typeid` or `typeidGeneric` for safer methods of getting `TypeId`s.
 *
 * # Safety
 * This function is inherently unsafe as any string can be converted to a `TypeId` without it actually having a backing type.Use sparingly or dont use it if possible.
 *
 * @param {string} name
 */
export function setTypeId(name) {
  return /** @type {TypeId}*/(name)
}

/**
 * @template T
 * @param {Constructor<T>} type
 * @returns {TypeId}
 */
export function typeid(type) {
  return setTypeId(type.name)
}

/**
 * @template T
 * @template {Constructor[]} U
 * @param {Constructor<T>} type
 * @param {[...U]} types
 * @returns {TypeId}
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
 * @template {(...args: any[]) => any} F
 * @param {F} _func
 * @param {TupleConstructor<Parameters<F>>} input
 * @param {Constructor<ReturnType<F>>} output
 */
export function typeidFunction(_func, input, output) {
  return setTypeId(`fn(${input.map((e) => typeid(e)).join(',')}):${typeid(output)}`)
}
