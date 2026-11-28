/**
 * Branded string used as a type identifier. The brand distinguishes a
 * {@linkcode TypeId} from an ordinary string at the type level.
 *
 * @typedef {string & { __brand:'TypeId' }} TypeId
 */

/**
 * Runtime constructable function shape. Primitive constructor factories are
 * selected by {@linkcode Constructor} for the corresponding primitive type.
 * The constructor accepts any number of arguments.
 *
 * @typedef {{new (...args:any[]):any, prototype:any}} ConstructorFn
 */

/**
 * Runtime constructor type for values of `T`. `T` defaults to `unknown` when
 * omitted.
 *
 * @template [T = unknown]
 * @typedef {unknown extends T ? ConstructorFn : [T] extends [number] ? [number] extends [T] ? NumberConstructor : {new (...args:any[]):T, prototype:T} : [T] extends [string] ? [string] extends [T] ? StringConstructor : {new (...args:any[]):T, prototype:T} : [T] extends [boolean] ? [boolean] extends [T] ? BooleanConstructor : {new (...args:any[]):T, prototype:T} : [T] extends [bigint] ? [bigint] extends [T] ? any : {new (...args:any[]):T, prototype:T} : {new (...args:any[]):T, prototype:T}} Constructor
 */

/**
 * Extracts the instance type produced by a runtime constructor.
 *
 * @template {ConstructorFn} T
 * @typedef {unknown extends T ? never : T extends {prototype:infer U} ? U : never} ConstructorInstanceType
 */

/**
 * Maps each element of an array or tuple type `T` to a matching
 * {@linkcode Constructor}, preserving the input tuple's positions.
 *
 * @template {unknown[]} T
 * @typedef {{[K in keyof T]:Constructor<T[K]>}} TupleConstructor
 */

/**
 * Generic copy contract for values of type `T`. Its `copy` method accepts a
 * source value and an optional `out` target, then returns a value of type `T`.
 *
 * @template T
 * @typedef {{ copy(value: T, out?: T): T }} Copy
 */

/**
 * Generic clone contract for values of type `T`. Its `clone` method accepts a
 * source value and returns a value of type `T`. Sharing, cloning depth, and
 * other implementation details are left unspecified.
 *
 * @template T
 * @typedef {{ clone(value: T): T }} Clone
 */
export {}
