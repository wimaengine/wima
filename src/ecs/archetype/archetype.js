/** @import { TypeId } from '../../reflect/index.js' */
/** @import { TableId } from '../typedef/index.js' */

export class Archetype {

  /**
   * @readonly
   * @type {readonly TypeId[]}
   */
  types

  /**
   * @readonly
   * @type {TableId}
   */
  tableId

  /**
   * @param {TableId} tableId
   * @param {TypeId[]} types
   */
  constructor(tableId, types) {
    this.types = types
    this.tableId = tableId
  }

  /**
   * @param {TypeId[]} typeids
   * @returns {boolean}
   */
  has(typeids) {
    for (let i = 0; i < typeids.length; i++) {
      if (!this.types.includes(typeids[i])) return false
    }

    return true
  }

  /**
   * @param {TypeId[]} typeIds
   * @returns {boolean}
   */
  hasOnly(typeIds) {
    if (typeIds.length !== this.types.length) return false

    for (let i = 0; i < typeIds.length; i++) {
      if (!this.types.includes(typeIds[i])) return false
    }

    return true
  }
}
