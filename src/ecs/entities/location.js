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
   * @param {ArchetypeId} archid
   * @param {TableRow} index 
   * @param {TableId} tableId
   */
  constructor(

    // SAFETY: -1 Represents the invalid id for all of these identifiers
    archid = /** @type { ArchetypeId }*/ (-1),
    index = /** @type { TableRow }*/ (-1),
    tableId = /** @type { TableId }*/ (-1)
  ) {
    this.archid = archid
    this.index = index
    this.tableId = tableId
  }
}