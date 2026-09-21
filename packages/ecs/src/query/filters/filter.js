/** @import { TypeId, Constructor } from '@wimaengine/type'*/
/** @import { FilterTransform, IdentityTransform, OptionalTransform } from './types' */
import { typeid } from '@wimaengine/type'

/**
 * @abstract
 * @template {FilterTransform} [Transform = FilterTransform]
 */
export class QueryFilter {

  /** @type {Transform} */
  typeTransform

  constructor() {
    if (new.target === QueryFilter) {
      throw new TypeError('QueryFilter is abstract')
    }
  }

  /**
   * Returns whether a descriptor must be present for this filter to be
   * applicable to an archetype.
   *
   * @param {TypeId} _type
   * @returns {boolean}
   */
  isRequired(_type) {
    return true
  }

  /**
   * @param {readonly TypeId[]} _types
   * @throws {string} When the method is not implemented.
   * @returns {boolean}
   */
  archetype(_types) {
    throw `Implement ${this.constructor.name}.archetype`
  }
}

/**
 * @template T
 * @extends {QueryFilter<IdentityTransform>}
 */
export class Has extends QueryFilter {

  /**
   * @type {TypeId}
   */
  typeid

  /**
   * @param {Constructor<T>} component
   */
  constructor(component) {
    super()
    this.typeid = typeid(component)
  }

  /**
   * @param {readonly TypeId[]} types
   * @returns {boolean}
   */
  archetype(types) {
    return types.includes(this.typeid)
  }
}

/**
 * @template T
 * @param {Constructor<T>} component
 * @returns {Has<T>}
 */
export function has(component) {
  return new Has(component)
}

/**
 * Marks a component in a query as optional. Optional components do not affect
 * archetype matching and are returned as `undefined` when absent.
 *
 * @template T
 * @extends {QueryFilter<OptionalTransform<T>>}
 */
export class Optional extends QueryFilter {

  /** @type {TypeId} */
  typeid

  /** @param {Constructor<T>} component */
  constructor(component) {
    super()
    this.typeid = typeid(component)
  }

  /**
   * @param {TypeId} type
   * @returns {boolean}
   */
  isRequired(type) {
    return this.typeid !== type
  }

  /** @param {readonly TypeId[]} _types */
  archetype(_types) {
    return true
  }
}

/**
 * @template T
 * @param {Constructor<T>} component
 * @returns {Optional<T>}
 */
export function optional(component) {
  return new Optional(component)
}

/**
 * @template T
 * @extends {QueryFilter<IdentityTransform>}
 */
export class Without extends QueryFilter {

  /**
   * @type {TypeId}
   */
  typeid

  /**
   * @param {Constructor<T>} component
   */
  constructor(component) {
    super()
    this.typeid = typeid(component)
  }

  /**
   * @param {readonly TypeId[]} types
   * @returns {boolean}
   */
  archetype(types) {
    return !types.includes(this.typeid)
  }
}

/**
 * @template T
 * @param {Constructor<T>} component
 * @returns {Without<T>}
 */
export function without(component) {
  return new Without(component)
}
