/**
 * @template [T = unknown]
 * @typedef {new (...args:any[])=>T} Constructor
 */

/** @import { Constructor } from '../../reflect/index.js' */

/**
 * @template {unknown[]} T
 * @typedef {{[K in keyof T]:Constructor<T[K]>}} TupleFnConstructor
 */
export default {}
