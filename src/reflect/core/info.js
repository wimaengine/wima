/** @import { TypeId } from '../types/index.js' */
export class TypeInfo {}

export class Field {

  /**
   * @readonly
   * @type {TypeId}
   */
  type

  /**
   * @readonly
   * @type {boolean}
   */
  optional

  /**
   * @param {TypeId} type
   * @param {boolean} [optional=false]
   */
  constructor(type, optional = false) {
    this.type = type
    this.optional = optional
  }
}

export class OpaqueInfo extends TypeInfo {  
  static default() {
    return new OpaqueInfo()
  }
}