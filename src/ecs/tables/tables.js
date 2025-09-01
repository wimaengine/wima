/** @import { TableId, TableRow } from '../typedef/index.js'*/
/** @import { TypeId } from '../../reflect/index.js'*/

import { assert, throws } from '../../logger/index.js'
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
   * @private
   * @type {Table[]}
   */
  list = []

  /**
   * @param {TypeId[]} comps
   * @returns {ArchetypeId}
   */
  createArchetype(comps) {
    const archetype = new Table()

    for (let i = 0; i < comps.length; i++) {
      archetype.components.set(comps[i], [])
    }

    return this.list.push(archetype) - 1
  }

  /**
   * @param {Table} archetype
   * @param {TypeId[]} comps
   * @returns {boolean} 
   */
  archetypeHasOnly(archetype, comps) {
    if (this.getActualCompSize(comps) !== archetype.components.size) return false

    for (let i = 0; i < comps.length; i++) {
      if (!archetype.components.has(comps[i])) return false
    }

    return true
  }

  /**
   * @private
   * @param {TypeId[]} ids
   * @returns {number}
   */
  getActualCompSize(ids){
    return new Set(ids).size
  }

  /**
   * @param {ArchetypeId} id
   * @returns {Table | undefined}
   */
  getArchetype(id) {
    return this.list[id]
  }

  /**
   * @param {ArchetypeFilter} filter
   * @param {Table[]} out
   * @returns {Table[]}
   */
  filterArchetypes(filter, out = []) {
    for (let i = 0; i < this.list.length; i++) {
      if (filter(this.list[i], i)) out.push(this.list[i])
    }

    return out
  }

  /**
   * @param {TypeId[]} comps
   * @returns {ArchetypeId}
   */
  getArchetypeId(comps) {
    for (let i = 0; i < this.list.length; i++) {
      if (this.archetypeHasOnly(this.list[i], comps)) {
        return i
      }
    }

    return -1
  }

  /**
   * @param {TypeId[]} ids
   * @returns {ArchetypeId}
   */
  resolveArchetypeFor(ids) {
    for (let i = 0; i < this.list.length; i++) {
      const hasit = this.archetypeHasOnly(this.list[i], ids)

      if (hasit) return i
    }

    return this.createArchetype(ids)
  }

  /**
   * @param {TypeId[]} comps
   * @param {ArchetypeId[]} filtered
   * @returns {ArchetypeId[]}
   */
  getArchetypeIds(comps, filtered) {
    for (let i = 0; i < this.list.length; i++) {
      let hasComponents = true

      for (let j = 0; j < comps.length; j++) {
        if (!this.list[i].components.has(comps[j])) {
          hasComponents = false
          break
        }
      }

      if (hasComponents) filtered.push(i)
    }

    return filtered
  }

  /**
   * @template {unknown[]} T
   * @param {ArchetypeId} id
   * @param {TypeId[]} keys
   * @param {[...T]} components
   */
  insertIntoArchetype(id, keys, components) {
    const archetype = this.getArchetype(id)

    if(!archetype) return

    // SAFETY: Caller ensures the archetype has at least 1 component list
    const index = /** @type {number}*/(archetype.components.values().next().value?.length)

    for (let i = 0; i < components.length; i++) {
      const list = archetype.components.get(keys[i])

      if(list){
        list[index] = components[i]
      }else{
        throws('Invalid archetype insertion!')
      }
    }

    return index
  }

  /**
   * @param {ArchetypeId} id
   * @param {number} index
   * @returns {[TypeId[],unknown[]] | null}
   */
  extract(id, index) {
    const keys = []
    const components = []
    const archetype = this.getArchetype(id)

    if(!archetype) return null

    for (const [key, list] of archetype.components) {
      keys.push(key)
      components.push(list[index])
    }

    return [keys, components]
  }

  /**
   * @template {unknown[]} T
   * @param {[...T]} components
   * @param {TypeId[]} ids
   * @returns {[ArchetypeId,number]}
   */
  insert(components, ids) {
    const archid = this.resolveArchetypeFor(ids)
    const index = this.insertIntoArchetype(archid, ids, components)

    assert(index, 'Internal error:Table exists but insertion failed!')
    
    return [archid, index]
  }

  /**
   * @param {ArchetypeId} id
   * @param {number} index
   * @returns {void}
   */
  remove(id, index) {
    const archetype = this.getArchetype(id)

    if(!archetype) return 

    for (const list of archetype.components.values()) {
      swapRemove(list, index)
    }
  }

  /**
   * @template T
   * @param {ArchetypeId} id
   * @param {number} index
   * @param {TypeId} compname
   * @returns {T | null}
   */
  get(id, index, compname) {
    const archetype = this.getArchetype(id)

    if (!archetype) return null

    const compList = archetype.components.get(compname)

    if (!compList) return null

    return /** @type {T}*/(compList[index])
  }

  /**
   * @returns {void}
   */
  clear() {
    this.list = []
  }
}