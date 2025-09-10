/** @import { TypeId } from '../../../reflect/index.js'*/

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