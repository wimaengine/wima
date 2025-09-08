/** @import { TableId, TableRow } from '../typedef/index.js'*/
/** @import { TypeId } from '../../reflect/index.js'*/

import { throws } from '../../logger/index.js'
import { swapRemove } from '../../utils/index.js'

/**
 * Contains entities with the same set of components.
 * @example
 * ```ts
 * //components
 * class A {}
 * class B {}
 * 
 * //This table contains entities with component A
 * const archetype1 = new Table()
 * table.components.set("A",[])
 * 
 * //This table contains entities with component A and B
 * const archetype2 = new Table()
 * table.components.set("A",[])
 * table.components.set("B",[])
 * ```
 */
export class Table {

  /**
   * @readonly
   * @type {ReadonlyMap<TypeId,unknown[]>}
   */
  columns = new Map()

  /**
   * @private
   */
  length = 0

  /**
   * @param {TypeId[]} typeids
   */
  constructor(typeids) {
    const map = new Map()

    for (let i = 0; i < typeids.length; i++) {
      map.set(typeids[i], [])
    }

    this.columns = map
  }

  /**
   * @param {TypeId} typeid
   * @param {TableRow} row
   * @param {unknown} value
   * @returns {void}
   */
  set(typeid, row, value) {
    if (row >= this.size()) return

    const column = this.columns.get(typeid)

    if (column) column[row] = value
  }

  /**
   * @param {TypeId} typeid
   * @param {TableRow} row
   * @returns {unknown | undefined}
   */
  get(typeid, row) {
    const column = this.columns.get(typeid)

    if (column) return column[row]

    return undefined
  }

  /**
   * ### SAFETY
   * The allocated row should be immediately be filled with values
   * before any other operation is done to the table.
   * 
   * @returns {TableRow}
   */
  reserve() {
    const index = this.length

    this.length += 1

    return /** @type {TableRow} */(index)
  }

  /**
   * @returns {number}
   */
  size() {
    return this.length
  }

  /**
   * @param {TypeId[]} ids
   * @param {unknown[]} components
   */
  insert(ids, components) {
    if (ids.length !== components.length) {
      throws('The component list and id list should match!')
    }

    const index = this.reserve()

    this.insertUnchecked(index, ids, components)

    return index
  }

  /**
   * ### Safety
   * It is up to the caller to ensure it fills all the columns on the row.
   * See the method {@link Table.insert } for a safer method.
   * @param {TableRow} index
   * @param {TypeId[]} ids 
   * @param {unknown[]} components 
   */
  insertUnchecked(index, ids, components) {

    for (let i = 0; i < components.length; i++) {
      const list = this.columns.get(ids[i])

      if (list) {
        list[index] = components[i]
      } else {
        throws('Invalid table insertion!')
      }
    }
  }

  /**
   * @param {TableRow} row
   * @returns {void}
   */
  remove(row) {
    for (const list of this.columns.values()) {
      swapRemove(list, row)
    }

    this.length -= 1
  }

  /**
   * @param {TableRow} row
   * @returns {[TypeId[],unknown[]]}
   */
  extract(row) {
    const components = []
    const keys = []

    for (const [key, list] of this.columns) {
      keys.push(key)
      components.push(list[row])
    }

    return [keys, components]
  }

  /**
   * @param {TypeId[]} ids
   * @returns {boolean} 
   */
  hasOnly(ids) {
    if (ids.length !== this.columns.size) return false

    for (let i = 0; i < ids.length; i++) {
      if (!this.columns.has(ids[i])) return false
    }

    return true
  }

  /**
   * @param {Table} newTable 
   * @param {TableRow} row
   * @returns {TableRow}
   */
  moveTo(newTable, row) {
    const newIndex = newTable.reserve()

    for (const [id, column] of this.columns) {
      newTable.set(id, newIndex, column[row])
    }

    this.remove(row)

    return newIndex
  }
}

/**
 * Store components in {@link Table archetypes}.
 */
export class Tables {

  /**
   * 
   * ## SAFETY:
   * Guaranteed to be dense as it is private.
   * @private
   * @type {Table[]}
   */
  list = []

  /**
   * @param {TypeId[]} typeIds
   * @returns {[TableId,Table]}
   */
  createTable(typeIds) {
    const table = new Table(typeIds)

    // SAFETY: `Tables` allocates the table id
    const id = /** @type {TableId}*/(this.list.length)

    this.list.push(table)

    return [id, table]
  }

  /**
   * @param {TableId} id
   * @returns {Table | undefined}
   */
  get(id) {
    return this.list[id]
  }
  
  /**
   * @returns {readonly Table[]}
   */
  values(){
    return this.list
  }

  /**
   * @param {TypeId[]} ids
   * @returns {[TableId,Table]}
   */
  resolveTableFor(ids) {
    for (let i = 0; i < this.list.length; i++) {
      const table = this.list[i]
      const hasit = table.hasOnly(ids)

      if (hasit) {

        // SAFETY: `Tables` allocates the table id
        const id = /** @type {TableId} */(i)

        return [id, table]
      }
    }

    return this.createTable(ids)
  }

  /**
   * @param {TypeId[]} comps
   * @param {TableId[]} filtered
   * @returns {TableId[]}
   */
  getTableIds(comps, filtered) {
    for (let i = 0; i < this.list.length; i++) {
      let hasComponents = true

      for (let j = 0; j < comps.length; j++) {
        if (!this.list[i].columns.has(comps[j])) {
          hasComponents = false
          break
        }
      }

      if (hasComponents){

        // SAFETY: `Tables` allocates the table id
        const id = /** @type {TableId} */(i)

        filtered.push(id)
      }
    }

    return filtered
  }

  /**
   * @returns {void}
   */
  clear() {
    this.list = []
  }
}