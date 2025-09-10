/** @import { TypeId, Constructor } from '../../../reflect/index.js'*/
import { typeid } from '../../../reflect/index.js'

/**
 * @interface
 */
export class QueryFilter {

  /**
   * @param {readonly TypeId[]} _types 
   * @throws {string} When the method is not implemented.
   * @returns {boolean}
   */
  archetype(_types){
    throw `Implement ${this.constructor.name}.archetype`
  }
}

/**
 * @template T
 * @implements {QueryFilter}
 */
export class Has {

  /**
   * @type {TypeId}
   */
  typeid

  /**
   * @param {Constructor<T>} component
   */
  constructor(component){
    this.typeid = typeid(component)
  }

  /**
   * @param {readonly TypeId[]} types 
   * @returns {boolean}
   */
  archetype(types){
    return types.includes(this.typeid)
  }
}