/** @import { TableId, TableRow } from '../typedef/index.js'*/
/** @import { TypeId, TupleConstructor  } from '../../type/index.js'*/

import { Entity } from '../entities/index.js'
import { World } from '../registry.js'
import { typeid } from '../../type/index.js'
import { Table } from '../tables/index.js'
import { Archetype } from '../archetype/index.js'
import { QueryFilter } from './filters/filter.js'

/**
 * Enables operations to be performed on specified set
 * of components components on a {@link World}.
 * Ensure that the component types matches up with the
 * component names given in the second parameter of
 * the query in lower case.
 * @example
 * ```ts
 * class A {}
 * class B {}
 *
 * const world = new World()
 *   .registerType(A)
 *   .registerType(B)
 * const query = new Query<[A, B]>(world, ['a','b'])
 *
 * // you can now use the query to perform operations
 * // on entities with components `A` and `B`
 * // see the {@link Query} methods to know what operations
 * // are available
 * ```
 *
 * @template {unknown[]} T
 * @template {QueryFilter[]} [U = []]
 */
export class Query {

  /**
   * @private
   * @type {World}
   */
  world

  /**
   * @readonly
   * @type {TypeId[]}
   */
  descriptors = []

  /**
   * @readonly
   * @type {U}
   */
  filters

  /**
   * @private
   * @type {TableId[]}
   */
  tableIds = []

  /**
   * @param {World} world
   * @param {[...TupleConstructor<T>]} componentTypes
   * @param {[...U]} filters
   */
  constructor(
    world,
    componentTypes,

    // SAFETY: The default value matches the default template value
    filters = /** @type {U}*/([])
  ) {
    this.world = world
    this.descriptors = componentTypes.map((c) => typeid(c))
    this.filters = filters
    this.update()
  }

  /**
   * @returns {void}
   */
  update() {
    const { world } = this
    const archetypes = world.getArchetypes()

    const tableIds = filterMap(archetypes.values(), (archetype) => {
      if (!archetype.has(this.descriptors)) {
        return undefined
      }
      if (!filter(archetype, this.filters)) {
        return undefined
      }

      return archetype.tableId
    })

    this.tableIds = tableIds
  }

  /**
   * Gets the components of a given entity.
   *
   * @param {Entity} entity
   * @returns {T | null}
   */
  get(entity) {
    const { world, descriptors, tableIds } = this
    const cell = world.getEntity(entity)
    const { location } = cell

    if (!cell.exists()) return null

    const { tableId, index } = location
    const table = world.getTables().get(tableId)

    if (table === undefined) return null
    if (!tableIds.includes(tableId)) return null
    if (index > table.size() || index < 0) return null

    const components = new Array(this.descriptors.length)

    // Safety: We check the bounds above
    mapComponents(table, descriptors, index, components)

    // SAFETY: Components are fetched in same order and types as the generic.
    return /** @type {T}*/ (components)
  }

  /**
   * @param {EachFunc<T>} callback
   */
  each(callback) {
    const { tableIds, descriptors } = this
    const tables = this.world.getTables()

    // SAFETY: Components are fetched below.
    const components = /** @type {T}*/(new Array(this.descriptors.length))

    for (let i = 0; i < tableIds.length; i++) {
      const table = tables.get(tableIds[i])

      if (!table) continue

      for (let row = 0; row < table.size(); row++) {

        // SAFETY: Row is in bounds
        mapComponents(table, descriptors, row, components)
        callback(components)
      }
    }
  }

  /**
   * @param {EachCombinationFunc<T>} callback
   */
  eachCombination(callback) {
    const { tableIds, descriptors } = this
    const tables = this.world.getTables()

    // SAFETY: Components are filled below
    const components1 = /** @type {T}*/(new Array(this.descriptors.length))
    const components2 = /** @type {T}*/(new Array(this.descriptors.length))

    for (let i = 0; i < tableIds.length; i++) {
      const table1 = tables.get(tableIds[i])

      if (!table1) continue

      for (let j = i; j < tableIds.length; j++) {
        const table2 = tables.get(tableIds[i])

        if (!table2) continue

        for (let row1 = 0; row1 < table1.size(); row1++) {

          // SAFETY: Row is in bounds
          mapComponents(table1, descriptors, row1, components1)

          const nextup = i === j ? row1 + 1 : 0

          for (let row2 = nextup; row2 < table2.size(); row2++) {

            // SAFETY: Row is in bounds
            mapComponents(table2, descriptors, row2, components2)
            callback(components1, components2)
          }
        }

      }
    }
  }

  /**
   * @returns {T | null}
   */
  single() {
    const { descriptors, world, tableIds } = this
    const tables = world.getTables()

    for (let i = 0; i < tableIds.length; i++) {
      const table = tables.get(tableIds[i])

      if (!table) continue
      if (table.size() < 1) continue

      // SAFETY: Components are fetched below.
      const components = /** @type {T}*/(new Array(this.descriptors.length))

      // SAFETY: Table row is in bounds as checked above.
      mapComponents(table, descriptors, 0, components)

      return components
    }

    return null
  }

  /**
   * Returns the number of entities on this query.
   *
   * @returns {number}
   */
  count() {
    const { tableIds } = this
    const tables = this.world.getTables()
    let sum = 0

    for (let i = 0; i < tableIds.length; i++) {
      const table = tables.get(tableIds[i])

      if (!table) continue

      sum += table.size()
    }

    return sum
  }
}

/**
 * @template T
 * @template U
 * @param { readonly T[] } arr
 * @param { (element:T, index:number) => U | undefined } callback
 * @returns { U[] }
 */
function filterMap(arr, callback) {
  const results = []

  for (let i = 0; i < arr.length; i++) {
    const result = callback(arr[i], i)

    if (result !== undefined) {
      results.push(result)
    }
  }

  return results
}

/**
 * ### Safety
 * The table row should be guaranteed to be in bounds by the caller.
 * The table should also contain all the components described by the descriptor.
 *
 * @template {unknown[]} T
 * @param {Table} table
 * @param {TypeId[]} descriptor
 * @param {number} row
 * @param {[...T]} list
 *
 */
function mapComponents(table, descriptor, row, list) {
  for (let i = 0; i < descriptor.length; i++) {
    const type = descriptor[i]

    // SAFETY:index guaranteed to be in bounds by the caller.The value should be there.
    list[i] = /** @type {unknown}*/ (table.get(type, /** @type {TableRow} */ (row)))
  }
}

/**
 * @param {Archetype} archetype
 * @param {QueryFilter[]} filters
 */
function filter(archetype, filters) {
  for (let i = 0; i < filters.length; i++) {
    if (!filters[i].archetype(archetype.types)) {
      return false
    }
  }

  return true
}

/**
 * @template {unknown[]} T
 * @callback EachFunc
 * @param {[...T]} components
 * @returns {void}
 */

/**
 * @template {unknown[]} T
 * @callback EachCombinationFunc
 * @param {[...T]} components1
 * @param {[...T]} components2
 * @returns {void}
 */
