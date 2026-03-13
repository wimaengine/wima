/**
 * @typedef {string & { __brand:'TypeId' }} TypeId
 */

/**
 * @template [T = unknown]
 * @typedef {new (...args:any[])=>T} Constructor
 */

/**
 * @template {unknown[]} T
 * @typedef {{[K in keyof T]:Constructor<T[K]>}} TupleConstructor
 */
export default {}
