/** @import { Constructor } from '../../reflect/index.js' */

/**
 * @template {unknown[]} T
 * @typedef {{[K in keyof T]:Constructor<T[K]>}} TupleConstructor
 */
export default {}