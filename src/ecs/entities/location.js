/** @import {ArchetypeId, TableId, TableRow} from '../typedef/index.js' */

export class EntityLocation {

  /**
   * @type {TableId}
   */
  tableId

  /**
   * @type {TableRow}
   */
  index

  /**
   * @type {number}
   */
  generation = 0

  /**
   * @type {ArchetypeId}
   */
  archetypeId

  /**
   * @param {ArchetypeId} archetypeId
   * @param {TableRow} index
   * @param {TableId} tableId
   */
  constructor(

    // SAFETY: -1 Represents the invalid id for all of these identifiers
    archetypeId = /** @type { ArchetypeId }*/ (-1),
    index = /** @type { TableRow }*/ (-1),
    tableId = /** @type { TableId }*/ (-1)
  ) {
    this.archetypeId = archetypeId
    this.index = index
    this.tableId = tableId
  }
}
